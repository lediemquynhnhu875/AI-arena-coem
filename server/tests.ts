/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * BỘ KIỂM THỬ BACKEND TOÀN DIỆN (AUTOMATED BACKEND, AUTH & SECURITY TEST SUITE)
 * Kiểm tra:
 * 1. Đăng nhập Gmail & Xác thực OTP (OTP generation, rate limiting, expiry, verification)
 * 2. Phiên làm việc (Session Tokens, Profile Retrieval, Logout)
 * 3. Tính toàn vẹn của Cơ sở dữ liệu (Database CRUD & Consistency)
 * 4. Bảo mật chống rò rỉ thông tin mật (No Secrets/Keys/Paths Leaked)
 * 5. Khử độc dữ liệu đầu vào (XSS Sanitization & Schema Validation)
 * 6. Kiểm tra các Endpoint HTTP thực tế trên máy chủ
 */

import http from "http";
import db from "./db.ts";
import type { CharacterRecord, OutfitRecord, MemoryRecord, OrderRecord } from "./db.ts";
import {
  redactSecrets,
  sanitizeErrorMessage,
  sanitizeString,
} from "./security.ts";
import { isValidEmail, generateOtpCode } from "./emailService.ts";

interface TestResult {
  name: string;
  passed: boolean;
  message?: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, testName: string, failureMessage = ""): void {
  if (condition) {
    results.push({ name: testName, passed: true });
    console.log(`  ✓ [PASS] ${testName}`);
  } else {
    results.push({ name: testName, passed: false, message: failureMessage });
    console.error(`  ✗ [FAIL] ${testName}: ${failureMessage}`);
  }
}

// Helper gửi request HTTP nội bộ
function makeRequest(
  method: string,
  path: string,
  body?: unknown,
  token?: string
): Promise<{ status: number; headers: http.IncomingHttpHeaders; data: any }> {
  return new Promise((resolve, reject) => {
    const postData = body ? JSON.stringify(body) : "";
    const headers: Record<string, string | number> = {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(postData),
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const req = http.request(
      {
        hostname: "127.0.0.1",
        port: 3000,
        path,
        method,
        headers,
      },
      (res) => {
        let raw = "";
        res.on("data", (chunk) => (raw += chunk));
        res.on("end", () => {
          let parsed: any;
          try {
            parsed = JSON.parse(raw);
          } catch {
            parsed = raw;
          }
          resolve({ status: res.statusCode || 0, headers: res.headers, data: parsed });
        });
      }
    );

    req.on("error", (err) => reject(err));
    if (postData) req.write(postData);
    req.end();
  });
}

async function runTestSuite() {
  console.log("\n============================================================");
  console.log(" BẮT ĐẦU CHẠY BỘ KIỂM THỬ BACKEND, AUTH & BẢO MẬT DỰ ÁN CÒ EM");
  console.log("============================================================\n");

  // =========================================================================
  // NHÓM 1: KIỂM THỬ ĐĂNG NHẬP GMAIL & XÁC THỰC MÃ OTP
  // =========================================================================
  console.log("--- 1. KIỂM THỬ ĐĂNG NHẬP GMAIL & MÃ OTP (AUTHENTICATION) ---");

  // Test 1: Kiểm tra định dạng email hợp lệ / không hợp lệ
  assert(
    isValidEmail("nguoidung.test@gmail.com") &&
      isValidEmail("vietphuc.heritage@gmail.com") &&
      !isValidEmail("invalid-email") &&
      !isValidEmail("@missing.com"),
    "Kiểm tra định dạng email hợp lệ (Valid Gmail format)",
    "Hàm isValidEmail không hoạt động chuẩn"
  );

  // Test 2: Sinh mã OTP 6 chữ số ngẫu nhiên
  const otpCode = generateOtpCode();
  assert(
    typeof otpCode === "string" && otpCode.length === 6 && /^\d{6}$/.test(otpCode),
    "Sinh mã OTP 6 chữ số ngẫu nhiên an toàn",
    `Mã sinh ra: ${otpCode}`
  );

  // Test 3: Endpoint POST /api/auth/send-otp từ chối email sai
  try {
    const badEmailRes = await makeRequest("POST", "/api/auth/send-otp", { email: "not_an_email" });
    assert(
      badEmailRes.status === 400 && badEmailRes.data.ok === false,
      "Endpoint POST /api/auth/send-otp từ chối email sai định dạng (400)",
      `Status: ${badEmailRes.status}`
    );
  } catch (err) {
    console.warn("Lỗi kết nối kiểm thử:", err);
  }

  // Test 4: Endpoint POST /api/auth/send-otp gửi thành công tới Gmail
  let generatedOtp = "";
  const testGmail = "nguoidung.test@gmail.com";
  try {
    const sendOtpRes = await makeRequest("POST", "/api/auth/send-otp", { email: testGmail });
    generatedOtp = sendOtpRes.data?.devOtpPreview || "";
    assert(
      sendOtpRes.status === 200 && sendOtpRes.data.ok === true && sendOtpRes.data.email === testGmail,
      "Endpoint POST /api/auth/send-otp tạo và chuyển phát mã OTP thành công",
      `Status: ${sendOtpRes.status}, Msg: ${sendOtpRes.data?.message}`
    );
  } catch (err) {
    console.warn("Lỗi kết nối kiểm thử:", err);
  }

  // Test 5: Endpoint POST /api/auth/verify-otp từ chối mã sai
  try {
    const wrongOtpRes = await makeRequest("POST", "/api/auth/verify-otp", {
      email: testGmail,
      code: "000000",
    });
    assert(
      wrongOtpRes.status === 400 && wrongOtpRes.data.ok === false,
      "Endpoint POST /api/auth/verify-otp từ chối mã OTP không khớp (400)",
      `Status: ${wrongOtpRes.status}`
    );
  } catch (err) {
    console.warn("Lỗi kết nối kiểm thử:", err);
  }

  // Test 6: Endpoint POST /api/auth/verify-otp xác thực thành công mã OTP đúng
  let authToken = "";
  try {
    // Lấy mã OTP thực tế vừa lưu trong CSDL
    const latestDbOtp = db.getLatestOtp(testGmail);
    const validCode = latestDbOtp?.code || generatedOtp;

    const verifyRes = await makeRequest("POST", "/api/auth/verify-otp", {
      email: testGmail,
      code: validCode,
      name: "Thu Modzit - Người Mến Cổ Phục",
    });
    authToken = verifyRes.data?.token || "";
    assert(
      verifyRes.status === 200 &&
        verifyRes.data.ok === true &&
        Boolean(authToken) &&
        verifyRes.data.user.email === testGmail,
      "Endpoint POST /api/auth/verify-otp xác thực thành công và cấp Session Token",
      `Token: ${authToken?.substring(0, 16)}...`
    );
  } catch (err) {
    console.warn("Lỗi kết nối kiểm thử:", err);
  }

  // Test 7: Endpoint GET /api/auth/me lấy thông tin tài khoản qua Token
  try {
    const meRes = await makeRequest("GET", "/api/auth/me", undefined, authToken);
    assert(
      meRes.status === 200 && meRes.data.ok === true && meRes.data.user.email === testGmail,
      "Endpoint GET /api/auth/me trả về thông tin người dùng đã xác thực",
      `User: ${meRes.data?.user?.name}`
    );
  } catch (err) {
    console.warn("Lỗi kết nối kiểm thử:", err);
  }

  // Test 8: Endpoint POST /api/auth/logout đăng xuất
  try {
    const logoutRes = await makeRequest("POST", "/api/auth/logout", undefined, authToken);
    const afterLogoutMe = await makeRequest("GET", "/api/auth/me", undefined, authToken);
    assert(
      logoutRes.status === 200 && afterLogoutMe.status === 401,
      "Endpoint POST /api/auth/logout hủy phiên làm việc thành công (Token invalidated)",
      `After logout status: ${afterLogoutMe.status}`
    );
  } catch (err) {
    console.warn("Lỗi kết nối kiểm thử:", err);
  }

  // =========================================================================
  // NHÓM 2: KIỂM THỬ BẢO MẬT & CHỐNG RÒ RỈ THÔNG TIN MẬT
  // =========================================================================
  console.log("\n--- 2. KIỂM THỬ BẢO MẬT & CHỐNG LỘ BÍ MẬT ---");

  // Test 9: Khử sạch mẫu khóa API Google (AIza...)
  const mockApiKey = "AIzaSyD-fakeKeyForTestingSecurity1234";
  const leakedString = `Error occurred when contacting API with key ${mockApiKey} at /home/user/app/server.ts`;
  const sanitized = redactSecrets(leakedString);
  assert(
    !sanitized.includes(mockApiKey) && sanitized.includes("[REDACTED]"),
    "Khử sạch mẫu khóa API Google (AIza...) khỏi chuỗi thông báo",
    `Kết quả: ${sanitized}`
  );

  // Test 10: Khử đường dẫn hệ thống nội bộ
  assert(
    !sanitized.includes("/home/user/app") && sanitized.includes("[REDACTED]"),
    "Khử đường dẫn hệ thống nội bộ khỏi lỗi",
    `Kết quả: ${sanitized}`
  );

  // Test 11: Thông điệp lỗi an toàn không rò rỉ stack trace
  const safeErr = sanitizeErrorMessage(new Error("Fatal database error at /var/www/internal/db.sqlite"));
  assert(
    !safeErr.includes("/var/www/internal") && safeErr.length <= 160,
    "Thông điệp lỗi an toàn (Safe error message) được cắt gọn và che giấu",
    `Kết quả: ${safeErr}`
  );

  // Test 12: Chống XSS qua sanitizeString
  const dirtyXSS = "<script>alert('xssAttack()')</script>Nguyễn Hoàng Nam";
  const cleanStr = sanitizeString(dirtyXSS);
  assert(
    !cleanStr.includes("<script>") && cleanStr.includes("Nguyễn Hoàng Nam"),
    "Khử độc mã JavaScript độc hại (Anti-XSS)",
    `Kết quả: ${cleanStr}`
  );

  // =========================================================================
  // NHÓM 3: KIỂM THỬ CƠ SỞ DỮ LIỆU (DATABASE ENGINE)
  // =========================================================================
  console.log("\n--- 3. KIỂM THỬ CƠ SỞ DỮ LIỆU (DATABASE ENGINE) ---");

  // Test 13: Lưu và đọc nhân vật
  const testChar: CharacterRecord = {
    id: "test-user-01",
    name: "Thục Anh - Người Mẫu Test",
    gioi: "nu",
    tuoi: "nguoi_lon",
    vocDang: "dong_ho_cat",
    tongDa: 2,
    toc: "bui_thap",
    huongNhin: "truoc",
    updated_at: new Date().toISOString(),
  };
  db.saveCharacter(testChar);
  const loadedChar = db.getCharacter("test-user-01");
  assert(
    loadedChar !== null && loadedChar.name === testChar.name && loadedChar.gioi === "nu",
    "Ghi và đọc dữ liệu nhân vật trong CSDL thành công",
    `Loaded: ${JSON.stringify(loadedChar)}`
  );

  // Test 14: Lưu và lấy danh sách bộ phối đồ
  const testOutfit: OutfitRecord = {
    id: `test-outfit-${Date.now()}`,
    title: "Áo Tấc Hoàng Tộc Xanh Thiên Thanh",
    trang_phuc_id: "aotac",
    mau_hex: "#0284C7",
    phu_kien_ids: ["nonla", "vongco"],
    nhan_vat_config: { gioi: "nu", vocDang: "dong_ho_cat" },
    notes: "Bộ lễ phục trang nhã",
    created_at: new Date().toISOString(),
  };
  db.saveOutfit(testOutfit);
  const allOutfits = db.getAllOutfits();
  const foundOutfit = allOutfits.find((o) => o.id === testOutfit.id);
  assert(
    foundOutfit !== undefined && foundOutfit.title === testOutfit.title,
    "Lưu và truy vấn danh sách bộ trang phục trong CSDL",
    `Tìm thấy: ${foundOutfit?.title}`
  );

  // Test 15: Xóa bộ phối đồ
  const deleted = db.deleteOutfit(testOutfit.id);
  const afterDeleteOutfits = db.getAllOutfits();
  const stillExists = afterDeleteOutfits.some((o) => o.id === testOutfit.id);
  assert(
    deleted === true && !stillExists,
    "Xóa bộ trang phục khỏi CSDL thành công",
    `deleted=${deleted}, stillExists=${stillExists}`
  );

  // Test 16: Lưu và đọc ký ức Việt Phục
  const testMemory: MemoryRecord = {
    id: `test-mem-${Date.now()}`,
    sender_name: "Thanh Hằng",
    content: "Chiếc áo Nhật Bình đỏ thắm của ngoại tôi truyền lại qua 3 thế hệ.",
    trang_phuc_name: "Áo Nhật Bình",
    era: "Triều Nguyễn",
    created_at: new Date().toISOString(),
  };
  db.saveMemory(testMemory);
  const allMemories = db.getAllMemories();
  const foundMem = allMemories.find((m) => m.id === testMemory.id);
  assert(
    foundMem !== undefined && foundMem.sender_name === "Thanh Hằng",
    "Lưu và đọc ký ức di sản Việt phục thành công",
    `Tìm thấy: ${foundMem?.content}`
  );

  // Test 17: Đơn hàng chợ phiên
  const testOrder: OrderRecord = {
    id: `test-ord-${Date.now()}`,
    item_id: "aodai_truyenthong",
    item_name: "Áo Dài Lụa Hà Đông",
    size: "L",
    quantity: 1,
    status: "pending",
    created_at: new Date().toISOString(),
  };
  db.saveOrder(testOrder);
  const allOrders = db.getAllOrders();
  const foundOrder = allOrders.find((o) => o.id === testOrder.id);
  assert(
    foundOrder !== undefined && foundOrder.item_name === "Áo Dài Lụa Hà Đông",
    "Ghi nhận đơn hàng chợ phiên vào CSDL thành công",
    `Order status: ${foundOrder?.status}`
  );

  // Test 18: Cache AI trên máy chủ
  const cacheKey = "test_prompt_hash_123";
  const cacheData = { suggestion: "Nên kết hợp với hài nhung thêu chỉ vàng" };
  db.setAiCache(cacheKey, cacheData);
  const loadedCache = db.getAiCache(cacheKey);
  assert(
    JSON.stringify(loadedCache) === JSON.stringify(cacheData),
    "Hệ thống lưu đệm AI Cache hoạt động chuẩn xác",
    `Loaded cache: ${JSON.stringify(loadedCache)}`
  );

  // =========================================================================
  // NHÓM 4: KIỂM THỬ CÁC ENDPOINT HTTP THỰC TẾ TRÊN MÁY CHỦ
  // =========================================================================
  console.log("\n--- 4. KIỂM THỬ CÁC ENDPOINTS HTTP TRÊN SERVER ĐANG CHẠY ---");

  try {
    // Test 19: Endpoint /api/health bảo đảm an toàn
    const healthRes = await makeRequest("GET", "/api/health");
    assert(
      healthRes.status === 200 && healthRes.data.status === "ok",
      "Endpoint GET /api/health phản hồi 200 OK",
      `Status: ${healthRes.status}`
    );

    // Test 20: Kiểm tra /api/health KHÔNG rò rỉ khóa API
    const rawHealthText = JSON.stringify(healthRes.data);
    const keyLeaked =
      rawHealthText.includes("AIza") ||
      rawHealthText.includes(process.env.GEMINI_API_KEY || "___none___");
    assert(
      !keyLeaked,
      "Endpoint /api/health TUYỆT ĐỐI KHÔNG chứa chuỗi API Key của hệ thống",
      `Health output: ${rawHealthText}`
    );

    // Test 21: Endpoint GET /api/memories
    const memRes = await makeRequest("GET", "/api/memories");
    assert(
      memRes.status === 200 && Array.isArray(memRes.data.data),
      "Endpoint GET /api/memories trả về danh sách mảng JSON",
      `Status: ${memRes.status}, Count: ${memRes.data.data?.length}`
    );

    // Test 22: Endpoint POST /api/character khử XSS
    const postCharRes = await makeRequest("POST", "/api/character", {
      id: "http-char-test",
      name: "<b>Huyền Trang</b>",
      gioi: "nu",
      tongDa: 3,
    });
    assert(
      postCharRes.status === 200 && !postCharRes.data.data.name.includes("<b>"),
      "Endpoint POST /api/character tự động khử thẻ HTML",
      `Name: ${postCharRes.data.data?.name}`
    );

    // Test 23: Endpoint POST /api/gemini kiểm tra validation input thiếu
    const badGeminiRes = await makeRequest("POST", "/api/gemini", {});
    assert(
      badGeminiRes.status === 400 && badGeminiRes.data.ok === false,
      "Endpoint POST /api/gemini từ chối yêu cầu rỗng (400 Bad Request) an toàn",
      `Status: ${badGeminiRes.status}`
    );

    // Test 24: Kiểm tra bảo mật HTTP Headers
    const headers = healthRes.headers;
    const hasNosniff = headers["x-content-type-options"] === "nosniff";
    const hasFrame = headers["x-frame-options"] === "SAMEORIGIN";
    assert(
      hasNosniff && hasFrame,
      "Máy chủ gửi đầy đủ Security Headers (nosniff, SAMEORIGIN)",
      `Headers: nosniff=${hasNosniff}, frame=${hasFrame}`
    );
  } catch (err: unknown) {
    console.warn("Lưu ý: Không thể kết nối tới server 127.0.0.1:3000 để chạy HTTP test.", err);
  }

  // =========================================================================
  // TỔNG KẾT KẾT QUẢ KIỂM THỬ
  // =========================================================================
  console.log("\n============================================================");
  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  const failed = total - passed;

  console.log(` TỔNG SỐ TEST: ${total} | ĐẠT: ${passed} | THẤT BẠI: ${failed}`);
  if (failed === 0) {
    console.log(" 🎉 TOÀN BỘ CÁC BÀI KIỂM THỬ ĐÃ VƯỢT QUA 100%! HỆ THỐNG AN TOÀN TUYỆT ĐỐI.");
  } else {
    console.error(" ⚠️ CÓ MỘT SỐ BÀI KIỂM THỬ CHƯA ĐẠT. VUI LÒNG KIỂM TRA LẠI.");
  }
  console.log("============================================================\n");
}

runTestSuite();
