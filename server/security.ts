/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * BỘ TIỆN ÍCH BẢO MẬT & CHỐNG RÒ RỈ THÔNG TIN MẬT (SERVER SECURITY MODULE)
 * - Khử độc chuỗi ký tự (Sanitize input, XSS prevention)
 * - Tẩy sạch bí mật, khóa API và đường dẫn hệ thống khỏi lỗi và phản hồi
 * - Giới hạn tần suất gọi (Rate limiting)
 * - Chống lộ biến môi trường và thông tin nhạy cảm lên frontend
 */

import type { Request, Response, NextFunction } from "express";

// Danh sách các từ khóa hoặc mẫu nhạy cảm cần lọc sạch
const SENSITIVE_PATTERNS = [
  /AIza[0-9A-Za-z-_]{20,}/g, // Google API Key (bất kỳ chuỗi bắt đầu bằng AIza có độ dài >= 24)
  /Bearer\s+[A-Za-z0-9._-]+/gi, // Bearer Tokens
  /(?:\/[a-zA-Z0-9._-]+){2,}/g, // Bất kỳ đường dẫn tệp tuyệt đối nào (/var/..., /home/..., /app/...)
  /sk-[a-zA-Z0-9]{20,}/g, // Generic Secret Keys
];

/**
 * Tẩy sạch chuỗi để không chứa khóa bí mật hay đường dẫn nội bộ
 */
export function redactSecrets(text: string): string {
  if (!text || typeof text !== "string") return text;

  let cleaned = text;

  // Lấy giá trị thực tế của biến môi trường nhạy cảm để xóa nếu có
  const sensitiveEnvKeys = ["GEMINI_API_KEY", "API_KEY", "SECRET", "PRIVATE_KEY"];
  for (const envKey of sensitiveEnvKeys) {
    const val = process.env[envKey];
    if (val && val.length > 5) {
      cleaned = cleaned.split(val).join("[REDACTED_SECRET]");
    }
  }

  for (const pattern of SENSITIVE_PATTERNS) {
    cleaned = cleaned.replace(pattern, "[REDACTED]");
  }

  return cleaned;
}

/**
 * Xử lý lỗi an toàn: KHÔNG lộ stack trace, KHÔNG lộ đường dẫn file, KHÔNG lộ API key
 */
export function sanitizeErrorMessage(err: unknown): string {
  if (!err) return "Đã xảy ra lỗi không xác định.";

  const rawMsg = err instanceof Error ? err.message : String(err);
  const safeMsg = redactSecrets(rawMsg);

  // Chỉ trả về thông điệp thân thiện, không trả về chi tiết kỹ thuật nhạy cảm
  if (safeMsg.includes("429") || safeMsg.toLowerCase().includes("quota")) {
    return "Hệ thống tạm thời bận do lưu lượng cao. Vui lòng thử lại sau vài giây.";
  }
  if (safeMsg.includes("503") || safeMsg.toLowerCase().includes("unavailable")) {
    return "Dịch vụ trí tuệ nhân tạo đang bảo trì. Ứng dụng sẽ tự động sử dụng kho tri thức có sẵn.";
  }

  return safeMsg.slice(0, 160);
}

/**
 * Khử độc đầu vào (Chống XSS / Injection)
 */
export function sanitizeString(input: unknown): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/[<>]/g, "")
    .trim()
    .slice(0, 1000);
}

/**
 * Middleware bảo mật HTTP Headers
 */
export function securityHeadersMiddleware(_req: Request, res: Response, next: NextFunction): void {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
}

/**
 * Middleware giới hạn tần suất yêu cầu đơn giản bằng bộ nhớ in-memory (Rate Limiter)
 */
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export function rateLimiterMiddleware(maxRequests = 180, windowMs = 60000) {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || "unknown_client";
    const now = Date.now();

    const record = requestCounts.get(ip);
    if (!record || now > record.resetTime) {
      requestCounts.set(ip, { count: 1, resetTime: now + windowMs });
      return next();
    }

    record.count++;
    if (record.count > maxRequests) {
      res.status(429).json({
        ok: false,
        error: "Quá nhiều yêu cầu. Vui lòng chờ một chút trước khi thử lại.",
      });
      return;
    }

    next();
  };
}
