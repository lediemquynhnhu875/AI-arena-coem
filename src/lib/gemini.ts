/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from "@google/genai";
import { trangPhuc } from "../data/trangphuc";
import { phuKien } from "../data/phukien";
import { vai } from "../data/vai";
import { mocThoiGian } from "../data/mocthoigian";
import { coem, domdom } from "../copy/coem";

export interface CallGeminiParams {
  vaiTro?: string;
  context?: string;
  quyTac?: string | string[];
  viDu?: string | unknown;
  cauHoi: string;
  schema?: Record<string, unknown>;
  nhietDo?: number;
  callerKey?: string; // Khóa định danh luồng gọi: "mot_trang_doi", "vi_sao", "dom_dom_chat", v.v.
  signal?: AbortSignal;
}

export interface CallGeminiResult {
  ok: boolean;
  data: unknown;
  tuCache: boolean;
  biHuy?: boolean; // True nếu thao tác bị người dùng chuyển lựa chọn mới làm hủy lệnh
}

// Bộ nhớ đệm in-memory
const memoryCache = new Map<string, unknown>();

// Quản lý các lệnh gọi đang xử lý theo callerKey để tự động hủy lệnh cũ khi người dùng đổi lựa chọn
const activeControllers = new Map<string, AbortController>();

// Hàm băm chuỗi để tạo khóa cache
function hashString(str: string): string {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) + hash + str.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

// Kiểm tra JSON theo schema đơn giản nhưng chặt chẽ
function validateSchema(data: unknown, schema: Record<string, unknown>): boolean {
  if (!schema) return true;

  const expectedType = schema.type as string | undefined;

  if (expectedType === "object") {
    if (typeof data !== "object" || data === null || Array.isArray(data)) {
      return false;
    }
    const obj = data as Record<string, unknown>;

    // Kiểm tra các trường bắt buộc (required)
    if (Array.isArray(schema.required)) {
      for (const field of schema.required) {
        if (typeof field === "string" && (obj[field] === undefined || obj[field] === null)) {
          return false;
        }
      }
    }

    // Kiểm tra kiểu các thuộc tính (properties)
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

/**
 * Hàm duy nhất gọi Gemini theo cơ chế mặc định AI Studio Build:
 * - Ghép prompt: VAI TRÒ → CONTEXT → QUY TẮC → VÍ DỤ → CÂU HỎI → ĐỊNH DẠNG ĐẦU RA (JSON)
 * - Timeout: 12 giây
 * - Kiểm tra JSON theo schema, sai schema coi như lỗi
 * - Cache theo hash của prompt (in-memory + localStorage, khóa "vpr:gem:")
 * - Khi lỗi trả ok=false để nơi gọi dùng fallbackText có sẵn trong dữ liệu
 * - Không gọi trong lúc render, chỉ gọi khi thao tác
 */
export async function callGemini({
  vaiTro,
  context,
  quyTac,
  viDu,
  cauHoi,
  schema,
  nhietDo = 0.3,
  callerKey,
  signal,
}: CallGeminiParams): Promise<CallGeminiResult> {
  // Quản lý AbortController để hủy lệnh cũ nếu có lệnh mới từ cùng callerKey
  let localController: AbortController | undefined;
  if (callerKey) {
    const prev = activeControllers.get(callerKey);
    if (prev) {
      prev.abort();
    }
    localController = new AbortController();
    activeControllers.set(callerKey, localController);
  }

  const isAborted = () => Boolean(signal?.aborted || localController?.signal?.aborted);

  try {
    if (isAborted()) {
      return { ok: false, data: null, tuCache: false, biHuy: true };
    }

    // (1) Ghép prompt theo đúng thứ tự:
    // VAI TRÒ → CONTEXT → QUY TẮC → VÍ DỤ → CÂU HỎI → ĐỊNH DẠNG ĐẦU RA
    const parts: string[] = [];

    if (vaiTro && vaiTro.trim()) {
      parts.push(`=== VAI TRÒ ===\n${vaiTro.trim()}`);
    }
    if (context && context.trim()) {
      parts.push(`=== CONTEXT ===\n${context.trim()}`);
    }
    if (quyTac) {
      const quyTacStr = Array.isArray(quyTac)
        ? quyTac.map((r) => `- ${r}`).join("\n")
        : quyTac.trim();
      if (quyTacStr) {
        parts.push(`=== QUY TẮC ===\n${quyTacStr}`);
      }
    }
    if (viDu) {
      const viDuStr =
        typeof viDu === "string" ? viDu.trim() : JSON.stringify(viDu, null, 2);
      if (viDuStr) {
        parts.push(`=== VÍ DỤ ===\n${viDuStr}`);
      }
    }
    if (cauHoi && cauHoi.trim()) {
      parts.push(`=== CÂU HỎI ===\n${cauHoi.trim()}`);
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

    // (4) Cache theo hash của prompt (in-memory + localStorage, khóa "vpr:gem:")
    const promptHash = hashString(assembledPrompt);
    const cacheKey = `vpr:gem:${promptHash}`;

    // Kiểm tra in-memory cache
    if (memoryCache.has(cacheKey)) {
      return { ok: true, data: memoryCache.get(cacheKey), tuCache: true };
    }

    // Kiểm tra localStorage cache
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const stored = window.localStorage.getItem(cacheKey);
        if (stored) {
          const parsed = JSON.parse(stored);
          memoryCache.set(cacheKey, parsed);
          return { ok: true, data: parsed, tuCache: true };
        }
      }
    } catch {
      // Bỏ qua lỗi đọc localStorage nếu bị chặn
    }

    // Khởi tạo client GoogleGenAI hoặc gọi proxy /api/gemini của máy chủ
    const apiKey =
      (typeof process !== "undefined" && process.env?.GEMINI_API_KEY) ||
      (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_GEMINI_API_KEY) ||
      "";

    // Nếu chạy trên trình duyệt và không có API key trực tiếp trên client, gửi qua proxy /api/gemini
    if (!apiKey && typeof window !== "undefined") {
      try {
        const timeoutController = new AbortController();
        const timeoutTimer = setTimeout(() => timeoutController.abort(), 12000);
        
        const combinedSignal = signal || localController?.signal;
        if (combinedSignal) {
          combinedSignal.addEventListener("abort", () => timeoutController.abort());
        }

        const res = await fetch("/api/gemini", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            vaiTro,
            context,
            quyTac,
            viDu,
            cauHoi,
            schema,
            nhietDo,
          }),
          signal: timeoutController.signal,
        });
        clearTimeout(timeoutTimer);

        if (res.ok) {
          const json = await res.json();
          if (json.ok && json.data !== undefined) {
            memoryCache.set(cacheKey, json.data);
            try {
              if (window.localStorage) {
                window.localStorage.setItem(cacheKey, JSON.stringify(json.data));
              }
            } catch {
              // Bỏ qua nếu localStorage đầy
            }
            return { ok: true, data: json.data, tuCache: false };
          }
        }
      } catch (proxyErr) {
        console.warn("Proxy /api/gemini không phản hồi, dùng fallback:", proxyErr);
      }

      // Kích hoạt fallback mượt mà nếu máy chủ chưa có key hoặc lỗi mạng
      return { ok: false, data: null, tuCache: false };
    }

    if (!apiKey) {
      return { ok: false, data: null, tuCache: false };
    }
    const ai = new GoogleGenAI({ apiKey });

    // Cấu hình phản hồi: chỉ bật responseMimeType json khi có schema
    const config: Record<string, unknown> = {
      ...(schema ? { responseMimeType: "application/json" } : {}),
      temperature: nhietDo,
    };

    // (2) Timeout 12 giây cho toàn bộ quá trình
    const timeoutPromise = new Promise<never>((_, reject) => {
      const timer = setTimeout(() => {
        clearTimeout(timer);
        reject(new Error("Timeout sau 12 giây"));
      }, 12000);
    });

    const callWithRetry = async () => {
      const modelsToTry = ["gemini-3.8-flash", "gemini-3.1-flash-lite"];
      let lastErr: unknown;

      for (const model of modelsToTry) {
        for (let attempt = 0; attempt < 2; attempt++) {
          try {
            return await ai.models.generateContent({
              model,
              contents: assembledPrompt,
              config,
            });
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
            // Chuyển sang model tiếp theo nếu gặp lỗi quota hoặc service unavailable
            break;
          }
        }
      }
      throw lastErr;
    };

    const response = await Promise.race([callWithRetry(), timeoutPromise]);
    const rawText = response.text || "";

    let parsedData: unknown = rawText.trim();

    // Khi có schema, yêu cầu làm sạch cú pháp và kiểm tra schema nghiêm ngặt
    if (schema) {
      let cleanJson = rawText.trim();
      if (cleanJson.startsWith("```")) {
        cleanJson = cleanJson.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();
      }

      parsedData = JSON.parse(cleanJson);

      // (3) Kiểm tra JSON theo schema, sai schema thì coi như lỗi
      if (!validateSchema(parsedData, schema)) {
        throw new Error("Dữ liệu trả về không khớp với schema yêu cầu");
      }
    }

    // Kiểm tra nếu lệnh đã bị hủy trước khi lưu cache và trả về
    if (isAborted()) {
      return { ok: false, data: null, tuCache: false, biHuy: true };
    }

    // Lưu vào bộ nhớ đệm
    memoryCache.set(cacheKey, parsedData);
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem(cacheKey, JSON.stringify(parsedData));
      }
    } catch {
      // Bỏ qua nếu localStorage đầy
    }

    return { ok: true, data: parsedData, tuCache: false };
  } catch (error) {
    if (isAborted()) {
      return { ok: false, data: null, tuCache: false, biHuy: true };
    }
    // (5) Khi lỗi trả ok=false để nơi gọi dùng fallbackText có sẵn trong dữ liệu
    console.warn("Lỗi gọi Gemini (fallback được kích hoạt):", error);
    return { ok: false, data: null, tuCache: false };
  } finally {
    if (callerKey && localController && activeControllers.get(callerKey) === localController) {
      activeControllers.delete(callerKey);
    }
  }
}

/**
 * Chọn CONTEXT bằng so khớp từ khóa đơn giản trên trangPhuc/phuKien/vai/mocThoiGian + bộ đồ đang xem
 */
export function timKiemContextChoCauHoi(
  cauHoi: string,
  boDoHienTai?: {
    trangPhucId?: string;
    mauId?: string;
    phuKienIds?: string[];
  }
): string {
  const qLower = cauHoi.toLowerCase();
  const contextLines: string[] = [];

  // 1. So khớp trangPhuc
  const matchedTrangPhuc = trangPhuc.filter((tp) => {
    if (boDoHienTai?.trangPhucId === tp.id) return true;
    if (qLower.includes(tp.ten.toLowerCase())) return true;
    if (qLower.includes("tứ thân") && tp.id === "tu_than") return true;
    if (qLower.includes("ngũ thân") && tp.id === "ngu_than") return true;
    if (qLower.includes("áo dài") && tp.id === "aodai") return true;
    if (qLower.includes("bà ba") && tp.id === "ba_ba") return true;
    if (qLower.includes("nhật bình") && tp.id === "nhat_binh") return true;
    if (qLower.includes("giao lĩnh") && tp.id === "giao_linh") return true;
    if (qLower.includes("áo tấc") && tp.id === "ao_tac") return true;
    if (qLower.includes("chàm") && tp.id === "ao_cham") return true;
    if (qLower.includes("khăn piêu") && tp.id === "khan_pieu") return true;
    return false;
  });

  matchedTrangPhuc.forEach((tp) => {
    contextLines.push(
      `[Trang phục: ${tp.id}] Tên: ${tp.ten}. Dành cho: ${tp.gioiTinh}. Dịp mặc: ${tp.dip.join(", ")}. Thời tiết: ${tp.thoiTiet.join(", ")}. Miêu tả: ${tp.moTaNgan}. Sự thật đã kiểm chứng: ${tp.suThat.join("; ")}. Nguồn: ${tp.nguonIds.join(", ")}.`
    );
  });

  // 2. So khớp phuKien
  const matchedPhuKien = phuKien.filter((pk) => {
    if (boDoHienTai?.phuKienIds?.includes(pk.id)) return true;
    if (qLower.includes(pk.ten.toLowerCase())) return true;
    if (qLower.includes("nón lá") && pk.id.includes("non_la")) return true;
    if (qLower.includes("khăn đóng") && pk.id.includes("khan_dong")) return true;
    if (qLower.includes("khăn mỏ quạ") && pk.id.includes("khan_mo_qua")) return true;
    if ((qLower.includes("quai thao") || qLower.includes("nón quai thao")) && pk.id.includes("non_quai_thao")) return true;
    if (qLower.includes("khăn rằn") && pk.id.includes("khan_ran")) return true;
    if (qLower.includes("khăn piêu") && pk.id.includes("khan_pieu")) return true;
    if (qLower.includes("kiềng") && pk.id.includes("kieng")) return true;
    if (qLower.includes("hài cong") && pk.id.includes("hai_cong")) return true;
    // Đi kèm áo tứ thân trong dữ liệu
    if (qLower.includes("tứ thân") && (pk.id === "khan_mo_qua" || pk.id === "non_quai_thao")) return true;
    return false;
  });

  matchedPhuKien.forEach((pk) => {
    contextLines.push(
      `[Phụ kiện: ${pk.id}] Tên: ${pk.ten}. Loại: ${pk.loai}. Sự thật: ${pk.suThat.join("; ")}.`
    );
  });

  // 3. So khớp vai (chất liệu)
  const matchedVai = vai.filter((v) => {
    if (qLower.includes(v.ten.toLowerCase())) return true;
    if (qLower.includes(v.langNghe.toLowerCase())) return true;
    if (qLower.includes("lụa") || qLower.includes("vạn phúc") || qLower.includes("hà đông")) {
      if (v.id === "lua_van_phuc") return true;
    }
    if (qLower.includes("vải chàm") || (qLower.includes("chàm") && !qLower.includes("áo chàm"))) {
      if (v.id === "cham_nhuom") return true;
    }
    if (qLower.includes("thổ cẩm") || qLower.includes("chăm") || qLower.includes("mỹ nghiệp")) {
      if (v.id === "tho_cam_champa") return true;
    }
    if (qLower.includes("lanh") || qLower.includes("mông") || qLower.includes("sáp ong")) {
      if (v.id === "lanh_mong") return true;
    }
    if (qLower.includes("ê đê") || (qLower.includes("thổ cẩm") && qLower.includes("tây nguyên"))) {
      if (v.id === "tho_cam_ede") return true;
    }
    return false;
  });

  matchedVai.forEach((v) => {
    contextLines.push(
      `[Vải/Chất liệu: ${v.id}] Tên: ${v.ten}. Làng nghề / Nguồn gốc: ${v.langNghe}. Kỹ thuật: ${v.kyThuat}. Sự thật: ${v.suThat.join("; ")}. Nguồn: ${v.nguonIds.join(", ")}.`
    );
  });

  // 4. So khớp mocThoiGian
  const matchedMoc = mocThoiGian.filter((m) => {
    if (qLower.includes(m.nam.toLowerCase())) return true;
    if (qLower.includes(m.ten.toLowerCase())) return true;
    if (qLower.includes("lemur") || qLower.includes("cát tường")) {
      if (m.id === "tg2") return true;
    }
    if (qLower.includes("raglan") || qLower.includes("cổ thuyền")) {
      if (m.id === "tg4") return true;
    }
    if (
      qLower.includes("thời gian") ||
      qLower.includes("lịch sử") ||
      qLower.includes("thế kỷ") ||
      qLower.includes("thập niên")
    ) {
      return true;
    }
    return false;
  });

  matchedMoc.forEach((m) => {
    contextLines.push(
      `[Mốc thời gian: ${m.id}] Năm/Thời kỳ: ${m.nam}. Sự kiện: ${m.ten}. Thay đổi: ${m.thayDoi}.`
    );
  });

  // Nếu không có gì khớp nhưng đang xem một bộ đồ
  if (contextLines.length === 0 && boDoHienTai?.trangPhucId) {
    const curTp = trangPhuc.find((t) => t.id === boDoHienTai.trangPhucId);
    if (curTp) {
      contextLines.push(
        `[Bộ đồ đang xem: ${curTp.id}] Tên: ${curTp.ten}. Dành cho: ${curTp.gioiTinh}. Dịp mặc: ${curTp.dip.join(", ")}. Miêu tả: ${curTp.moTaNgan}. Sự thật: ${curTp.suThat.join("; ")}. Nguồn: ${curTp.nguonIds.join(", ")}.`
      );
    }
  }

  return contextLines.join("\n");
}

export const SYSTEM_PROMPT_CHATBOT = `Bạn là "Cố vấn văn hóa Cò Em" của ứng dụng Cò Em — Việt Phục Remix, xưng "Cò Em", gọi người dùng là "bạn", nói với học sinh, sinh viên bằng tiếng Việt, giọng thân thiện, tối đa 4 câu.
1. Chỉ dùng CONTEXT. Không thêm dữ kiện, con số, tên người, địa danh, năm tháng ngoài CONTEXT.
2. CONTEXT không đủ thì nói: "Cò Em chưa có dữ liệu chắc chắn về điều này..." và gợi ý xem trang giữ chuẩn hoặc bấm "Báo sai".
3. Chỉ trả lời về trang phục, dịp mặc, chất liệu, hoa văn, cách phối của Việt Nam; ngoài phạm vi thì từ chối lịch sự và đưa về chủ đề trang phục.
4. Không phán đúng/sai tuyệt đối (dùng "cần cân nhắc vì..."); không so sánh dân tộc nào đẹp hơn; gọi đúng tên dân tộc.
5. Kết thúc bằng [nguon: id1, id2] khi có dùng CONTEXT.`;

export const FEW_SHOT_CHATBOT = `- Câu hỏi: "Áo tứ thân đi với gì?"
  Trả lời: Áo tứ thân của phụ nữ Bắc Bộ truyền thống thường đi cùng yếm, váy, khăn mỏ quạ và nón quai thao. Hai vạt trước của áo thường được buộc lại duyên dáng khi trẩy hội. [nguon: bt_phu_nu_vn, trang_phuc_thang_long]

- Câu hỏi: "Công thức nấu phở?"
  Trả lời: Cò Em là cố vấn trang phục truyền thống của Cò Em — Việt Phục Remix nên chưa thể chia sẻ công thức nấu ăn được rồi. Bạn có muốn tìm hiểu về trang phục truyền thống hay cách phối áo dài, áo tứ thân không nào?

- Câu hỏi: "Ai là người thợ dệt đầu tiên của làng Vạn Phúc?"
  Trả lời: Cò Em chưa có dữ liệu chắc chắn về điều này trong kho tư liệu đã kiểm chứng. Bạn có thể xem trang Giữ chuẩn văn hóa để biết thêm quy trình thẩm định, hoặc bấm "Báo sai" nếu có tư liệu bổ sung nhé!`;

export interface ChatCoVanResult {
  ok: boolean;
  cauTraLoi: string;
  nguonIds: string[];
  tuCache: boolean;
  loi?: boolean;
}

/**
 * GỌI GEMINI THẬT qua callGemini theo đúng System prompt cố vấn văn hóa (nhiệt độ 0.3)
 */
export async function hoiCoVanVanHoa(
  cauHoi: string,
  boDoHienTai?: {
    trangPhucId?: string;
    mauId?: string;
    phuKienIds?: string[];
  }
): Promise<ChatCoVanResult> {
  const context = timKiemContextChoCauHoi(cauHoi, boDoHienTai);

  const res = await callGemini({
    vaiTro: `Bạn là "Cố vấn văn hóa Cò Em" của ứng dụng Cò Em — Việt Phục Remix, xưng "Cò Em", gọi người dùng là "bạn", nói với học sinh, sinh viên bằng tiếng Việt, giọng thân thiện, tối đa 4 câu.`,
    quyTac: [
      "1. Chỉ dùng CONTEXT. Không thêm dữ kiện, con số, tên người, địa danh, năm tháng ngoài CONTEXT.",
      "2. CONTEXT không đủ thì nói: \"Cò Em chưa có dữ liệu chắc chắn về điều này...\" và gợi ý xem trang giữ chuẩn hoặc bấm \"Báo sai\".",
      "3. Chỉ trả lời về trang phục, dịp mặc, chất liệu, hoa văn, cách phối của Việt Nam; ngoài phạm vi thì từ chối lịch sự và đưa về chủ đề trang phục.",
      "4. Không phán đúng/sai tuyệt đối (dùng \"cần cân nhắc vì...\"); không so sánh dân tộc nào đẹp hơn; gọi đúng tên dân tộc.",
      "5. Kết thúc bằng [nguon: id1, id2] khi có dùng CONTEXT."
    ],
    viDu: FEW_SHOT_CHATBOT,
    context: context || "Không có thông tin phù hợp trong kho dữ liệu văn hóa.",
    cauHoi,
    nhietDo: 0.3,
    callerKey: "co_em_chat",
  });

  if (!res.ok || typeof res.data !== "string") {
    return {
      ok: false,
      cauTraLoi: domdom.common.error, // "Tôi chưa nghe rõ, bạn hỏi lại được không..."
      nguonIds: [],
      tuCache: false,
      loi: true,
    };
  }

  const rawText = res.data;
  // Trích xuất [nguon: id1, id2] hoặc [nguồn: id1, id2]
  const nguonMatch = rawText.match(/\[nguon?:\s*([^\]]+)\]/i);
  let nguonIds: string[] = [];
  let cauTraLoi = rawText;

  if (nguonMatch) {
    nguonIds = nguonMatch[1]
      .split(/[,;]/)
      .map((s) => s.trim().replace(/^['"]|['"]$/g, ""))
      .filter(Boolean);
    cauTraLoi = rawText.replace(/\[nguon?:\s*[^\]]+\]/i, "").trim();
  }

  return {
    ok: true,
    cauTraLoi,
    nguonIds,
    tuCache: res.tuCache,
  };
}

export interface GoiYPhanTichBoiCanh {
  tongQuan: string;
  trangPhucId: string;
  tenTrangPhuc: string;
  lyDo: string;
  phoiMau: {
    mauChinh: string;
    mauPhoi: string;
    yNghia: string;
  };
  phuKien: string[];
  luuYVanHoa: string;
  dipTuongUng: string[];
  vungTuongUng?: string;
  phongCachKhuyenNghi: "truyen_thong" | "cach_tan_nhe" | "ca_tinh";
}

function taoGoiYFallback(moTa: string): GoiYPhanTichBoiCanh {
  const m = moTa.toLowerCase();
  if (m.includes("cưới") || m.includes("hỷ") || m.includes("dâu") || m.includes("rể")) {
    return {
      tongQuan: "Bối cảnh hỷ sự thiêng liêng đòi hỏi phục trang trang nhã, tươi vui mà không lấn át sắc áo cô dâu.",
      trangPhucId: m.includes("huế") ? "ngu_than" : "aodai",
      tenTrangPhuc: m.includes("huế") ? "Áo ngũ thân Cố Đô" : "Áo dài truyền thống",
      lyDo: "Tôn vinh nét đẹp kín đáo, trang trọng và mang đậm không khí lễ nghi gia đình ấm áp.",
      phoiMau: {
        mauChinh: "Hồng phấn hoặc Vàng hoàng yến nhạt",
        mauPhoi: "Trắng ngọc trai hoặc Xanh lam dịu",
        yNghia: "Sắc màu chúc phúc cát tường, dịu dàng và thanh lịch.",
      },
      phuKien: ["Khăn đóng hoặc nón lá thanh nhã", "Kiềng bạc mảnh", "Guốc mộc truyền thống"],
      luuYVanHoa: "Đi dự tiệc cưới nên tránh mặc màu trắng tuyết toàn thân hoặc đỏ tươi rực rỡ lấn át cô dâu.",
      dipTuongUng: ["cuoi"],
      vungTuongUng: m.includes("huế") ? "kh" : "kb",
      phongCachKhuyenNghi: "truyen_thong",
    };
  }
  if (m.includes("kỷ yếu") || m.includes("tốt nghiệp") || m.includes("trường") || m.includes("học sinh") || m.includes("sinh viên")) {
    return {
      tongQuan: "Bối cảnh kỷ niệm học đường thanh xuân, cần vẻ đẹp tươi tắn, thuần khiết và lưu giữ nụ cười rạng rỡ.",
      trangPhucId: "aodai",
      tenTrangPhuc: "Áo dài nữ sinh / Áo dài thanh xuân",
      lyDo: "Biểu tượng tinh khôi của tuổi học trò, chụp ảnh nhóm hay cá nhân đều tôn dáng và hài hòa không gian trường lớp.",
      phoiMau: {
        mauChinh: "Trắng tinh khôi hoặc Xanh ngọc pastel",
        mauPhoi: "Vàng nhạt hoặc Hồng hoa đào",
        yNghia: "Biểu trưng cho thanh xuân trong trẻo và ước mơ bay cao.",
      },
      phuKien: ["Nón lá sen thêu nhẹ", "Cành hoa sen hồng hoặc cúc họa mi", "Guốc mộc đế thấp"],
      luuYVanHoa: "Nên chọn chất lụa mềm nhẹ để cử động bay bổng tự nhiên khi chụp ảnh kỷ niệm.",
      dipTuongUng: ["ky_yeu", "tot_nghiep"],
      vungTuongUng: "kb",
      phongCachKhuyenNghi: "cach_tan_nhe",
    };
  }
  if (m.includes("bắc bộ") || m.includes("quan họ") || m.includes("hội làng") || m.includes("chùa") || m.includes("đình")) {
    return {
      tongQuan: "Không gian lễ hội đình làng, trẩy hội văn hóa tâm linh miền Bắc cần sự đằm thắm, duyên dáng và cung kính.",
      trangPhucId: "tu_than",
      tenTrangPhuc: "Áo tứ thân Bắc Bộ",
      lyDo: "Dáng áo bốn vạt gắn liền với hội xuân miền Kinh Bắc, mềm mại và rộn ràng sắc màu dân gian.",
      phoiMau: {
        mauChinh: "Nâu sồng hoặc Hồng đào",
        mauPhoi: "Yếm cánh sen hoặc Xanh lục mạ",
        yNghia: "Sự kết hợp đa sắc truyền thống 'mười phần duyên dáng, mười phần nết na'.",
      },
      phuKien: ["Khăn mỏ quạ thắt đuôi gà", "Nón quai thao ba tầm", "Hài cong nhung"],
      luuYVanHoa: "Vạt áo trước có thể buông thả mềm mại hoặc thắt nút nhẹ nhàng trước bụng khi trẩy hội.",
      dipTuongUng: ["le_hoi", "tet"],
      vungTuongUng: "kb",
      phongCachKhuyenNghi: "truyen_thong",
    };
  }
  if (m.includes("nam bộ") || m.includes("miền tây") || m.includes("sông nước") || m.includes("chợ nổi")) {
    return {
      tongQuan: "Không gian sông nước miệt vườn Nam Bộ cần sự phóng khoáng, chân chất, tiện lợi và gần gũi.",
      trangPhucId: "ba_ba",
      tenTrangPhuc: "Áo bà ba Nam Bộ",
      lyDo: "Thoải mái di chuyển trên ghe xuồng, dạo miệt vườn, toát lên nét duyên mộc mạc phương Nam.",
      phoiMau: {
        mauChinh: "Nâu đất phù sa hoặc Xanh đọt chuối",
        mauPhoi: "Đen tuyền hoặc Trắng khăn rằn",
        yNghia: "Biểu trưng cho cốt cách hào sảng, chân chất và đôn hậu của con người phương Nam.",
      },
      phuKien: ["Khăn rằn caro đen trắng quấn cổ", "Nón lá búp bàng", "Guốc mộc gõ nhịp"],
      luuYVanHoa: "Áo bà ba xẻ tà hai bên hông vừa vặn, kết hợp quần lụa đen rộng thoải mái.",
      dipTuongUng: ["doi_thuong", "le_hoi"],
      vungTuongUng: "kn",
      phongCachKhuyenNghi: "truyen_thong",
    };
  }
  return {
    tongQuan: "Bối cảnh giao thoa văn hóa vừa trang nhã vừa hiện đại, phù hợp cho nhiều dịp dạo phố và gặp gỡ bạn bè.",
    trangPhucId: "aodai",
    tenTrangPhuc: "Áo dài cách tân thanh nhã",
    lyDo: "Dáng áo dài luôn là biểu tượng hoàn hảo nhất, dễ phối đồ và thích ứng linh hoạt với mọi hoàn cảnh.",
    phoiMau: {
      mauChinh: "Vàng lúa chín hoặc Xanh ngọc bích",
      mauPhoi: "Trắng ngà lụa tơ tằm",
      yNghia: "Mang lại năng lượng tươi mới, thanh lịch và ấm áp.",
    },
    phuKien: ["Nón lá mini hoặc quạt gỗ trầm", "Kiềng bạc trơn", "Túi cói thổ cẩm"],
    luuYVanHoa: "Chọn cổ áo tròn hoặc cổ đứng thấp 2-3cm để tạo cảm giác nhẹ nhàng, dễ chịu.",
    dipTuongUng: ["doi_thuong", "chi_muon_kham_pha"],
    vungTuongUng: "kb",
    phongCachKhuyenNghi: "cach_tan_nhe",
  };
}

/**
 * Phân tích bối cảnh do người dùng tự nhập tự do bằng Gemini AI
 */
export async function phanTichBoiCanhVaGoiY(boiCanhMoTa: string): Promise<GoiYPhanTichBoiCanh> {
  const fallback = taoGoiYFallback(boiCanhMoTa);
  if (!boiCanhMoTa || !boiCanhMoTa.trim()) return fallback;

  const schema = {
    type: "object",
    properties: {
      tongQuan: { type: "string" },
      trangPhucId: {
        type: "string",
      },
      tenTrangPhuc: { type: "string" },
      lyDo: { type: "string" },
      phoiMau: {
        type: "object",
        properties: {
          mauChinh: { type: "string" },
          mauPhoi: { type: "string" },
          yNghia: { type: "string" },
        },
        required: ["mauChinh", "mauPhoi", "yNghia"],
      },
      phuKien: {
        type: "array",
        items: { type: "string" },
      },
      luuYVanHoa: { type: "string" },
      dipTuongUng: {
        type: "array",
        items: { type: "string" },
      },
      vungTuongUng: { type: "string" },
      phongCachKhuyenNghi: {
        type: "string",
      },
    },
    required: ["tongQuan", "trangPhucId", "tenTrangPhuc", "lyDo", "phoiMau", "phuKien", "luuYVanHoa", "dipTuongUng", "phongCachKhuyenNghi"],
  };

  try {
    const res = await callGemini({
      vaiTro: `Bạn là cố vấn thời trang văn hóa truyền thống "Cò Em" của ứng dụng Cò Em — Việt Phục Remix. Bạn am hiểu tường tận lễ nghi, lịch sử, văn hóa trang phục Việt Nam qua các triều đại và vùng miền.`,
      context: `Danh sách trang phục có sẵn trong hệ thống:
- aodai: Áo dài (truyền thống & cách tân, hợp cưới hỏi, kỷ yếu, lễ hội, dạo phố)
- ngu_than: Áo ngũ thân (trang trọng, cổ phong, cung đình Huế, lễ hội)
- tu_than: Áo tứ thân (phụ nữ Kinh Bắc Bộ, hội làng, trẩy hội, quan họ)
- ba_ba: Áo bà ba (Nam Bộ, sông nước, bình dị, thoải mái, đời thường)
- co_thai: Áo cỏm Thái (Tây Bắc, ôm sát cúc bướm bạc)
- mong_lanh: Trang phục Mông (núi cao, thổ cẩm dệt lanh, vẽ sáp ong)
- ede_tho_cam: Trang phục Ê Đê (Tây Nguyên, buôn làng, cồng chiêng)
- champa_tho_cam: Trang phục Chăm (Ninh Thuận, tháp Chàm, lễ hội Katê)
- sampot: Sampot Khmer (Nam Bộ, lễ Chol Chnam Thmay)`,
      cauHoi: `Người dùng mô tả bối cảnh / hoàn cảnh chuẩn bị trang phục của họ như sau:
"${boiCanhMoTa.trim()}"

Hãy phân tích bối cảnh này (thời tiết, tính trang trọng, không gian văn hóa, đối tượng tham dự), từ đó chọn trang phục phù hợp nhất từ danh sách trên, hướng dẫn phối màu sắc chuẩn mực văn hóa, đề xuất 2-3 phụ kiện và đưa ra lời dặn văn hóa tinh tế từ Cò Em.`,
      schema,
      nhietDo: 0.3,
      callerKey: "phan_tich_boi_canh",
    });

    if (res.ok && res.data && typeof res.data === "object") {
      const parsed = res.data as Partial<GoiYPhanTichBoiCanh>;
      return {
        tongQuan: parsed.tongQuan || fallback.tongQuan,
        trangPhucId: parsed.trangPhucId || fallback.trangPhucId,
        tenTrangPhuc: parsed.tenTrangPhuc || fallback.tenTrangPhuc,
        lyDo: parsed.lyDo || fallback.lyDo,
        phoiMau: parsed.phoiMau || fallback.phoiMau,
        phuKien: Array.isArray(parsed.phuKien) && parsed.phuKien.length > 0 ? parsed.phuKien : fallback.phuKien,
        luuYVanHoa: parsed.luuYVanHoa || fallback.luuYVanHoa,
        dipTuongUng: Array.isArray(parsed.dipTuongUng) && parsed.dipTuongUng.length > 0 ? parsed.dipTuongUng : fallback.dipTuongUng,
        vungTuongUng: parsed.vungTuongUng || fallback.vungTuongUng,
        phongCachKhuyenNghi: (parsed.phongCachKhuyenNghi as any) || fallback.phongCachKhuyenNghi,
      };
    }
  } catch (err) {
    console.warn("Lỗi phân tích bối cảnh:", err);
  }

  return fallback;
}
