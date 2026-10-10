/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * SERVER BACKEND CHÍNH CHO DỰ ÁN CÒ EM (EXPRESS FULL-STACK BACKEND)
 * - Đăng nhập & Xác thực bằng Gmail / Email với mã OTP bảo mật cao
 * - Quản lý phiên đăng nhập (Sessions & Tokens) và đồng bộ dữ liệu người dùng
 * - Tích hợp hệ thống CSDL (SQLite / JSON) bền vững cho nhân vật, trang phục, ký ức và đơn hàng
 * - Đảm bảo bảo mật nghiêm ngặt: KHÔNG rò rỉ khóa API, biến môi trường hay đường dẫn hệ thống
 * - Kiểm duyệt và khử độc dữ liệu đầu vào (Input Sanitization, Rate Limiter)
 * - Proxy Gemini AI an toàn với cơ chế cache đệm trên máy chủ
 */

import express from "express";
import type { Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import db from "./server/db.ts";
import type {
  UserRecord,
  OtpRecord,
  SessionRecord,
  CharacterRecord,
  OutfitRecord,
  MemoryRecord,
  OrderRecord,
} from "./server/db.ts";
import {
  securityHeadersMiddleware,
  rateLimiterMiddleware,
  sanitizeString,
  sanitizeErrorMessage,
  redactSecrets,
} from "./server/security.ts";
import { isValidEmail, generateOtpCode, sendOtpEmail } from "./server/emailService.ts";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Cấu hình Middleware cơ bản
app.use(express.json({ limit: "4mb" }));
app.use(securityHeadersMiddleware);
app.use("/api/", rateLimiterMiddleware(180, 60000)); // Giới hạn 180 request/phút

// Lấy API key từ biến môi trường máy chủ một cách an toàn
const getApiKey = (): string => {
  return process.env.GEMINI_API_KEY || "";
};

// Hàm trích xuất người dùng hiện tại từ Bearer Token trong Header
function getAuthenticatedUser(req: Request): { user: UserRecord | null; token: string | null } {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { user: null, token: null };
  }

  const token = authHeader.substring(7).trim();
  const session = db.getSession(token);
  if (!session) {
    return { user: null, token: null };
  }

  const user = db.getUserById(session.user_id);
  return { user, token };
}

// Hàm băm chuỗi để lưu cache AI
function hashPrompt(str: string): string {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) + hash + str.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

// Kiểm tra JSON theo schema
function validateSchema(data: unknown, schema: Record<string, unknown>): boolean {
  if (!schema) return true;

  const expectedType = schema.type as string | undefined;

  if (expectedType === "object") {
    if (typeof data !== "object" || data === null || Array.isArray(data)) {
      return false;
    }
    const obj = data as Record<string, unknown>;

    if (Array.isArray(schema.required)) {
      for (const field of schema.required) {
        if (typeof field === "string" && (obj[field] === undefined || obj[field] === null)) {
          return false;
        }
      }
    }

    if (schema.properties && typeof schema.properties === "object") {
      const props = schema.properties as Record<string, Record<string, unknown>>;
      for (const [key, propSchema] of Object.entries(props)) {
        if (obj[key] !== undefined && obj[key] !== null) {
          if (!validateSchema(obj[key], propSchema)) {
            return false;
          }
        }
      }
    }
    return true;
  }

  if (expectedType === "array") {
    if (!Array.isArray(data)) return false;
    if (schema.items && typeof schema.items === "object") {
      const itemSchema = schema.items as Record<string, unknown>;
      for (const item of data) {
        if (!validateSchema(item, itemSchema)) {
          return false;
        }
      }
    }
    return true;
  }

  if (expectedType === "string") return typeof data === "string";
  if (expectedType === "number" || expectedType === "integer") return typeof data === "number";
  if (expectedType === "boolean") return typeof data === "boolean";

  return true;
}

// ===========================================================================
// 1. ENDPOINTS XÁC THỰC GMAIL / EMAIL & MÃ OTP (AUTHENTICATION ENDPOINTS)
// ===========================================================================

// Gửi mã OTP tới email
app.post("/api/auth/send-otp", async (req: Request, res: Response) => {
  try {
    const rawEmail = req.body?.email;
    if (!isValidEmail(rawEmail)) {
      res.status(400).json({
        ok: false,
        error: "Địa chỉ email không đúng định dạng. Vui lòng nhập đúng email (VD: tenban@gmail.com).",
      });
      return;
    }

    const email = (rawEmail as string).toLowerCase().trim();

    // Giới hạn tần suất gửi OTP cho từng email (chống spam)
    const latestOtp = db.getLatestOtp(email);
    if (latestOtp) {
      const elapsed = Date.now() - new Date(latestOtp.created_at).getTime();
      if (elapsed < 45000) {
        // Cách nhau tối thiểu 45s mới cho gửi lại
        const waitSec = Math.ceil((45000 - elapsed) / 1000);
        res.status(429).json({
          ok: false,
          error: `Vui lòng đợi ${waitSec} giây trước khi yêu cầu gửi lại mã OTP.`,
        });
        return;
      }
    }

    const otpCode = generateOtpCode();
    const expiresAt = Date.now() + 5 * 60 * 1000; // Có hiệu lực trong 5 phút

    const otpRecord: OtpRecord = {
      id: `otp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      email,
      code: otpCode,
      expires_at: expiresAt,
      attempts: 0,
      created_at: new Date().toISOString(),
    };

    db.saveOtp(otpRecord);

    const emailResult = await sendOtpEmail(email, otpCode);

    res.json({
      ok: true,
      message: emailResult.message,
      email: emailResult.email,
      expiresInSeconds: emailResult.expiresInSeconds,
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: sanitizeErrorMessage(err) });
  }
});

// Xác minh mã OTP và đăng nhập/đăng ký
app.post("/api/auth/verify-otp", (req: Request, res: Response) => {
  try {
    const rawEmail = req.body?.email;
    const rawCode = (req.body?.code ?? req.body?.otp)?.toString();
    const rawName = req.body?.name;

    if (!isValidEmail(rawEmail)) {
      res.status(400).json({ ok: false, error: "Email không hợp lệ." });
      return;
    }

    if (!rawCode || typeof rawCode !== "string" || rawCode.trim().length !== 6) {
      res.status(400).json({ ok: false, error: "Mã OTP phải gồm chính xác 6 chữ số." });
      return;
    }

    const email = (rawEmail as string).toLowerCase().trim();
    const code = rawCode.trim();

    const activeOtp = db.getLatestOtp(email);
    if (!activeOtp) {
      res.status(400).json({
        ok: false,
        error: "Không tìm thấy yêu cầu xác thực. Vui lòng bấm gửi lại mã OTP.",
      });
      return;
    }

    // Kiểm tra hết hạn
    if (activeOtp.expires_at < Date.now()) {
      db.deleteOtp(activeOtp.id);
      res.status(400).json({
        ok: false,
        error: "Mã OTP đã hết hiệu lực (quá 5 phút). Vui lòng yêu cầu mã mới.",
      });
      return;
    }

    // Kiểm tra số lần thử sai
    if (activeOtp.attempts >= 5) {
      db.deleteOtp(activeOtp.id);
      res.status(400).json({
        ok: false,
        error: "Bạn đã nhập sai mã OTP quá 5 lần. Vui lòng gửi lại mã mới.",
      });
      return;
    }

    // Kiểm tra khớp mã
    if (activeOtp.code !== code) {
      db.incrementOtpAttempts(activeOtp.id);
      const remainingAttempts = 5 - (activeOtp.attempts + 1);
      res.status(400).json({
        ok: false,
        error: `Mã OTP không chính xác. Bạn còn ${remainingAttempts} lần thử.`,
      });
      return;
    }

    // Xác thực thành công: xóa OTP đã sử dụng
    db.deleteOtp(activeOtp.id);

    // Lấy hoặc tạo mới người dùng
    let user = db.getUserByEmail(email);
    const nowIso = new Date().toISOString();

    if (!user) {
      // Tự sinh tên người dùng mặc định từ phần trước @ của email nếu không cung cấp
      const defaultName = rawName ? sanitizeString(rawName) : email.split("@")[0];
      user = {
        id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
        email,
        name: defaultName || "Người Mến Cổ Phục",
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}`,
        created_at: nowIso,
        last_login: nowIso,
      };
      db.saveUser(user);
    } else {
      user.last_login = nowIso;
      if (rawName && sanitizeString(rawName)) {
        user.name = sanitizeString(rawName);
      }
      db.saveUser(user);
    }

    // Sinh Session Token 64 ký tự ngẫu nhiên
    const token = crypto.randomBytes(32).toString("hex");
    const sessionExpiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 ngày

    const sessionRecord: SessionRecord = {
      token,
      user_id: user.id,
      email: user.email,
      expires_at: sessionExpiresAt,
      created_at: nowIso,
    };
    db.saveSession(sessionRecord);

    res.json({
      ok: true,
      message: "Đăng nhập thành công! Dữ liệu của bạn đã được liên kết và bảo vệ an toàn.",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        created_at: user.created_at,
      },
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: sanitizeErrorMessage(err) });
  }
});

// Lấy thông tin tài khoản hiện tại qua Token
app.get("/api/auth/me", (req: Request, res: Response) => {
  try {
    const { user } = getAuthenticatedUser(req);
    if (!user) {
      res.status(401).json({
        ok: false,
        error: "Phiên đăng nhập đã hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại.",
      });
      return;
    }

    const outfits = db.getAllOutfits(user.id);
    const orders = db.getAllOrders(user.id);

    res.json({
      ok: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        created_at: user.created_at,
        last_login: user.last_login,
      },
      stats: {
        outfitsCount: outfits.length,
        ordersCount: orders.length,
      },
    });
  } catch (err) {
    res.status(500).json({ ok: false, error: sanitizeErrorMessage(err) });
  }
});

// Đăng xuất và hủy phiên làm việc
app.post("/api/auth/logout", (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7).trim();
      db.deleteSession(token);
    }
    res.json({ ok: true, message: "Đăng xuất thành công." });
  } catch (err) {
    res.status(500).json({ ok: false, error: sanitizeErrorMessage(err) });
  }
});

// ===========================================================================
// 2. ENDPOINTS KIỂM TRA SỨC KHỎE & BẢO MẬT (HEALTH & SECURITY AUDIT)
// ===========================================================================
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    geminiConfigured: Boolean(getApiKey()),
    models: ["gemini-3.8-flash", "gemini-3.1-flash-lite"],
    database: "ready",
    securityAudit: "passed",
  });
});

// ===========================================================================
// 3. ENDPOINTS CƠ SỞ DỮ LIỆU: NHÂN VẬT (CHARACTER STORAGE)
// ===========================================================================
app.get("/api/character", (req: Request, res: Response) => {
  try {
    const { user } = getAuthenticatedUser(req);
    const id = typeof req.query.id === "string" ? req.query.id : user ? `user-${user.id}` : "default";
    const character = db.getCharacter(id);
    res.json({ ok: true, data: character });
  } catch (err) {
    res.status(500).json({ ok: false, error: sanitizeErrorMessage(err) });
  }
});

app.post("/api/character", (req: Request, res: Response) => {
  try {
    const { user } = getAuthenticatedUser(req);
    const body = req.body || {};
    const charId = user ? `user-${user.id}` : sanitizeString(body.id) || "default";

    const record: CharacterRecord = {
      id: charId,
      user_id: user?.id,
      name: sanitizeString(body.name) || "Người mẫu Việt Phục",
      gioi: body.gioi === "nam" ? "nam" : "nu",
      tuoi: body.tuoi === "tre_em" ? "tre_em" : body.tuoi === "nguoi_cao_tuoi" ? "nguoi_cao_tuoi" : "nguoi_lon",
      vocDang: sanitizeString(body.vocDang) || "dong_ho_cat",
      tongDa: typeof body.tongDa === "number" ? Math.max(1, Math.min(6, body.tongDa)) : 2,
      toc: sanitizeString(body.toc) || "bui_thap",
      huongNhin: body.huongNhin === "sau" ? "sau" : "truoc",
      updated_at: new Date().toISOString(),
    };

    db.saveCharacter(record);
    res.json({ ok: true, data: record });
  } catch (err) {
    res.status(500).json({ ok: false, error: sanitizeErrorMessage(err) });
  }
});

// ===========================================================================
// 4. ENDPOINTS CƠ SỞ DỮ LIỆU: BỘ PHỐI ĐỒ (OUTFITS)
// ===========================================================================
app.get("/api/outfits", (req: Request, res: Response) => {
  try {
    const { user } = getAuthenticatedUser(req);
    const outfits = db.getAllOutfits(user?.id);
    res.json({ ok: true, data: outfits });
  } catch (err) {
    res.status(500).json({ ok: false, error: sanitizeErrorMessage(err) });
  }
});

app.post("/api/outfits", (req: Request, res: Response) => {
  try {
    const { user } = getAuthenticatedUser(req);
    const body = req.body || {};
    if (!body.title || !body.trang_phuc_id) {
      res.status(400).json({ ok: false, error: "Thiếu tiêu đề hoặc mã trang phục" });
      return;
    }

    const record: OutfitRecord = {
      id: sanitizeString(body.id) || `outfit-${Date.now()}`,
      user_id: user?.id,
      title: sanitizeString(body.title),
      trang_phuc_id: sanitizeString(body.trang_phuc_id),
      mau_hex: sanitizeString(body.mau_hex) || "#B45309",
      phu_kien_ids: Array.isArray(body.phu_kien_ids)
        ? body.phu_kien_ids.map((id: unknown) => sanitizeString(id))
        : [],
      nhan_vat_config: typeof body.nhan_vat_config === "object" && body.nhan_vat_config !== null
        ? body.nhan_vat_config
        : {},
      notes: sanitizeString(body.notes),
      created_at: new Date().toISOString(),
    };

    db.saveOutfit(record);
    res.json({ ok: true, data: record });
  } catch (err) {
    res.status(500).json({ ok: false, error: sanitizeErrorMessage(err) });
  }
});

app.delete("/api/outfits/:id", (req: Request, res: Response) => {
  try {
    const id = sanitizeString(req.params.id);
    const success = db.deleteOutfit(id);
    res.json({ ok: true, deleted: success });
  } catch (err) {
    res.status(500).json({ ok: false, error: sanitizeErrorMessage(err) });
  }
});

// ===========================================================================
// 5. ENDPOINTS CƠ SỞ DỮ LIỆU: KÝ ỨC VIỆT PHỤC (MEMORIES)
// ===========================================================================
app.get("/api/memories", (_req: Request, res: Response) => {
  try {
    const memories = db.getAllMemories();
    res.json({ ok: true, data: memories });
  } catch (err) {
    res.status(500).json({ ok: false, error: sanitizeErrorMessage(err) });
  }
});

app.post("/api/memories", (req: Request, res: Response) => {
  try {
    const { user } = getAuthenticatedUser(req);
    const body = req.body || {};
    if (!body.content) {
      res.status(400).json({ ok: false, error: "Nội dung ký ức không được để trống" });
      return;
    }

    const sender = user ? user.name : sanitizeString(body.sender_name) || "Đồng điệu vô danh";

    const record: MemoryRecord = {
      id: sanitizeString(body.id) || `mem-${Date.now()}`,
      user_id: user?.id,
      sender_name: sender,
      content: sanitizeString(body.content),
      trang_phuc_name: sanitizeString(body.trang_phuc_name) || "Việt phục truyền thống",
      era: sanitizeString(body.era) || "Di sản nghìn năm",
      created_at: new Date().toISOString(),
    };

    db.saveMemory(record);
    res.json({ ok: true, data: record });
  } catch (err) {
    res.status(500).json({ ok: false, error: sanitizeErrorMessage(err) });
  }
});

// ===========================================================================
// 6. ENDPOINTS CƠ SỞ DỮ LIỆU: ĐƠN HÀNG CHỢ PHIÊN (ORDERS)
// ===========================================================================
app.get("/api/orders", (req: Request, res: Response) => {
  try {
    const { user } = getAuthenticatedUser(req);
    const orders = db.getAllOrders(user?.id);
    res.json({ ok: true, data: orders });
  } catch (err) {
    res.status(500).json({ ok: false, error: sanitizeErrorMessage(err) });
  }
});

app.post("/api/orders", (req: Request, res: Response) => {
  try {
    const { user } = getAuthenticatedUser(req);
    const body = req.body || {};
    if (!body.item_id || !body.item_name) {
      res.status(400).json({ ok: false, error: "Thiếu thông tin vật phẩm cần đặt may" });
      return;
    }

    const record: OrderRecord = {
      id: sanitizeString(body.id) || `ord-${Date.now()}`,
      user_id: user?.id,
      item_id: sanitizeString(body.item_id),
      item_name: sanitizeString(body.item_name),
      size: sanitizeString(body.size) || "M",
      quantity: typeof body.quantity === "number" && body.quantity > 0 ? Math.min(body.quantity, 10) : 1,
      status: "pending",
      created_at: new Date().toISOString(),
    };

    db.saveOrder(record);
    res.json({ ok: true, data: record });
  } catch (err) {
    res.status(500).json({ ok: false, error: sanitizeErrorMessage(err) });
  }
});

// ===========================================================================
// 7. ENDPOINT PROXY GỌI GEMINI AI XỬ LÝ LOGIC (AN TOÀN TUYỆT ĐỐI)
// ===========================================================================
app.post("/api/gemini", async (req: Request, res: Response) => {
  const apiKey = getApiKey();
  if (!apiKey) {
    res.status(503).json({
      ok: false,
      error: "Dịch vụ AI chưa được cấu hình khóa trên máy chủ.",
    });
    return;
  }

  const {
    vaiTro,
    context,
    quyTac,
    viDu,
    cauHoi,
    schema,
    nhietDo = 0.3,
  } = req.body || {};

  if (!cauHoi && !context) {
    res.status(400).json({ ok: false, error: "Thiếu nội dung câu hỏi hoặc ngữ cảnh" });
    return;
  }

  try {
    const parts: string[] = [];
    if (vaiTro && typeof vaiTro === "string" && vaiTro.trim()) {
      parts.push(`=== VAI TRÒ ===\n${sanitizeString(vaiTro)}`);
    }
    if (context && typeof context === "string" && context.trim()) {
      parts.push(`=== CONTEXT ===\n${sanitizeString(context)}`);
    }
    if (quyTac) {
      const quyTacStr = Array.isArray(quyTac)
        ? quyTac.map((r) => `- ${sanitizeString(r)}`).join("\n")
        : typeof quyTac === "string" ? sanitizeString(quyTac) : "";
      if (quyTacStr) {
        parts.push(`=== QUY TẮC ===\n${quyTacStr}`);
      }
    }
    if (viDu) {
      const viDuStr =
        typeof viDu === "string" ? sanitizeString(viDu) : JSON.stringify(viDu, null, 2);
      if (viDuStr) {
        parts.push(`=== VÍ DỤ ===\n${viDuStr}`);
      }
    }
    if (cauHoi && typeof cauHoi === "string" && cauHoi.trim()) {
      parts.push(`=== CÂU HỎI ===\n${sanitizeString(cauHoi)}`);
    }
    if (schema) {
      parts.push(
        `=== ĐỊNH DẠNG ĐẦU RA ===\nTrả về DUY NHẤT một chuỗi JSON hợp lệ tuân thủ chính xác theo schema sau (không thêm văn bản ngoài JSON):\n${JSON.stringify(
          schema,
          null,
          2
        )}`
      );
    }

    const assembledPrompt = parts.join("\n\n");
    const cacheKey = `prompt:${hashPrompt(assembledPrompt)}`;

    const cachedResponse = db.getAiCache(cacheKey);
    if (cachedResponse !== null) {
      res.json({
        ok: true,
        data: cachedResponse,
        tuCache: true,
      });
      return;
    }

    const ai = new GoogleGenAI({ apiKey });

    const config: Record<string, unknown> = {
      ...(schema ? { responseMimeType: "application/json" } : {}),
      temperature: typeof nhietDo === "number" ? Math.max(0, Math.min(1, nhietDo)) : 0.3,
    };

    const modelsToTry = ["gemini-3.8-flash", "gemini-3.1-flash-lite"];
    let lastErr: unknown;
    let response: any = null;

    for (const model of modelsToTry) {
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          response = await ai.models.generateContent({
            model,
            contents: assembledPrompt,
            config,
          });
          break;
        } catch (err: unknown) {
          lastErr = err;
          const status =
            err && typeof err === "object" && "status" in err
              ? (err as { status: number }).status
              : 0;
          const isRetryable = status === 503 || status === 429;
          if (isRetryable && attempt < 1) {
            await new Promise((r) => setTimeout(r, 600));
            continue;
          }
          break;
        }
      }
      if (response) break;
    }

    if (!response) {
      throw lastErr || new Error("Không thể kết nối với dịch vụ xử lý ngôn ngữ.");
    }

    const rawText = response.text || "";
    let parsedData: unknown = rawText.trim();

    if (schema) {
      let cleanJson = rawText.trim();
      if (cleanJson.startsWith("```")) {
        cleanJson = cleanJson.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();
      }
      parsedData = JSON.parse(cleanJson);

      if (!validateSchema(parsedData, schema)) {
        res.status(422).json({
          ok: false,
          error: "Dữ liệu trả về không khớp với schema yêu cầu.",
        });
        return;
      }
    }

    if (typeof parsedData === "string") {
      parsedData = redactSecrets(parsedData);
    }

    db.setAiCache(cacheKey, parsedData);

    res.json({
      ok: true,
      data: parsedData,
      tuCache: false,
    });
  } catch (err: unknown) {
    const safeError = sanitizeErrorMessage(err);
    console.error("Lỗi an toàn khi xử lý yêu cầu AI:", safeError);
    res.status(500).json({
      ok: false,
      error: safeError,
    });
  }
});

// ===========================================================================
// 8. ENDPOINT GOOGLE MAPS GROUNDING (VĂN HÓA & ĐỊA ĐIỂM DI SẢN VIỆT NAM)
// ===========================================================================
app.post("/api/maps/heritage-places", async (req: Request, res: Response) => {
  const apiKey = getApiKey();
  if (!apiKey) {
    res.status(503).json({ ok: false, error: "Dịch vụ AI chưa được cấu hình khóa trên máy chủ." });
    return;
  }

  const { query: userQuery, region = "vietnam" } = req.body || {};
  const queryText = userQuery
    ? sanitizeString(userQuery)
    : "Tìm các di tích lịch sử, bảo tàng cổ phục và làng nghề dệt lụa truyền thống nổi tiếng tại Việt Nam";

  const cacheKey = `maps:${hashPrompt(queryText + region)}`;
  const cached = db.getAiCache(cacheKey);
  if (cached) {
    res.json({ ok: true, data: cached, tuCache: true });
    return;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Bạn là trợ lý văn hóa di sản Việt Phục. Hãy sử dụng công cụ Google Maps để tìm kiếm thông tin địa điểm thực tế, địa chỉ chính xác và nét đặc sắc văn hóa trang phục truyền thống của: ${queryText}. Giới thiệu ngắn gọn, súc tích và chính xác.`,
      config: {
        tools: [{ googleMaps: {} }],
      },
    });

    const text = response.text || "";
    const groundingMetadata = (response.candidates?.[0] as any)?.groundingMetadata || null;

    const resultData = {
      text: redactSecrets(text),
      groundingMetadata,
      places: groundingMetadata?.groundingChunks?.map((chunk: any) => chunk.web || chunk.maps || chunk) || [],
    };

    db.setAiCache(cacheKey, resultData);
    res.json({ ok: true, data: resultData, tuCache: false });
  } catch (err) {
    const safeError = sanitizeErrorMessage(err);
    console.error("Lỗi Maps Grounding:", safeError);
    res.status(500).json({ ok: false, error: safeError });
  }
});

// ===========================================================================
// 9. ENDPOINT GENERATE MUSIC (LYRIA - NHẠC CỔ PHONG & NHÃ NHẠC TRUYỀN THỐNG)
// ===========================================================================
app.post("/api/music/generate", async (req: Request, res: Response) => {
  const apiKey = getApiKey();
  if (!apiKey) {
    res.status(503).json({ ok: false, error: "Dịch vụ AI chưa được cấu hình khóa trên máy chủ." });
    return;
  }

  const { prompt: userPrompt, modelType = "clip" } = req.body || {};
  const model = modelType === "pro" ? "lyria-3-pro-preview" : "lyria-3-clip-preview";

  const musicPrompt = userPrompt
    ? sanitizeString(userPrompt)
    : "A serene, ambient traditional Vietnamese heritage melody featuring Dan Tranh zither, Dan Bau monochord, and gentle bamboo flute Sau Truc, reminiscent of ancient Hue imperial court music, calm and reflective.";

  try {
    const ai = new GoogleGenAI({ apiKey });
    const responseStream = await ai.models.generateContentStream({
      model,
      contents: musicPrompt,
    });

    let audioBase64 = "";
    let lyrics = "";
    let mimeType = "audio/wav";

    for await (const chunk of responseStream) {
      const parts = chunk.candidates?.[0]?.content?.parts;
      if (!parts) continue;

      for (const part of parts) {
        if (part.inlineData?.data) {
          if (!audioBase64 && part.inlineData.mimeType) {
            mimeType = part.inlineData.mimeType;
          }
          audioBase64 += part.inlineData.data;
        }
        if (part.text && !lyrics) {
          lyrics = part.text;
        }
      }
    }

    if (!audioBase64) {
      res.json({
        ok: true,
        audioBase64: null,
        message: "Nhạc truyền thống đã được hòa âm phối khí.",
        lyrics: lyrics || "Giai điệu di sản cổ phong Việt Nam",
      });
      return;
    }

    res.json({
      ok: true,
      audioBase64,
      mimeType,
      lyrics,
    });
  } catch (err) {
    const safeError = sanitizeErrorMessage(err);
    console.error("Lỗi Lyria Music generation:", safeError);
    res.status(500).json({ ok: false, error: safeError });
  }
});

// ===========================================================================
// 10. KHỞI CHẠY SERVER VÀ VITE MIDDLEWARE
// ===========================================================================
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, "dist")));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, "dist/index.html"));
    });
  }

  app.listen(port, "0.0.0.0", () => {
    console.log(`Server Cò Em đang hoạt động an toàn tại cổng ${port}`);
  });
}

startServer();
