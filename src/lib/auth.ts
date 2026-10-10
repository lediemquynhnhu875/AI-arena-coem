/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * MODULE QUẢN LÝ XÁC THỰC GMAIL / EMAIL & MÃ OTP TRÊN CLIENT (CLIENT AUTH SERVICE)
 * - Tự động đồng bộ phiên đăng nhập bằng Token
 * - Gửi & Xác thực mã OTP qua máy chủ
 * - Phát sự kiện `vpr:auth-change` khi đăng nhập hoặc đăng xuất
 */

import { useState, useEffect } from "react";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  created_at?: string;
}

const AUTH_TOKEN_KEY = "vpr:auth_token";
const AUTH_USER_KEY = "vpr:auth_user";
export const AUTH_CHANGE_EVENT = "vpr:auth-change";

export class AuthService {
  /**
   * Lấy token hiện tại từ bộ nhớ
   */
  static getToken(): string | null {
    if (typeof window === "undefined" || !window.localStorage) return null;
    return window.localStorage.getItem(AUTH_TOKEN_KEY);
  }

  /**
   * Lấy thông tin người dùng đã lưu
   */
  static getUser(): AuthUser | null {
    if (typeof window === "undefined" || !window.localStorage) return null;
    const raw = window.localStorage.getItem(AUTH_USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  /**
   * Header xác thực gửi kèm API
   */
  static getAuthHeaders(): Record<string, string> {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  /**
   * Yêu cầu gửi mã OTP tới email
   */
  static async sendOtp(email: string): Promise<{ ok: boolean; message: string; error?: string }> {
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        return { ok: false, message: "", error: data.error || "Không thể gửi mã OTP. Vui lòng thử lại." };
      }
      return { ok: true, message: data.message };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Lỗi kết nối máy chủ";
      return { ok: false, message: "", error: msg };
    }
  }

  /**
   * Xác thực mã OTP và nhận Session Token
   */
  static async verifyOtp(
    email: string,
    code: string,
    name?: string
  ): Promise<{ ok: boolean; user?: AuthUser; message?: string; error?: string }> {
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, name }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        return { ok: false, error: data.error || "Mã OTP không chính xác hoặc đã hết hạn." };
      }

      // Lưu token và thông tin người dùng
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem(AUTH_TOKEN_KEY, data.token);
        window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.user));
        window.dispatchEvent(new CustomEvent(AUTH_CHANGE_EVENT, { detail: data.user }));
      }

      return { ok: true, user: data.user, message: data.message };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Lỗi kết nối máy chủ";
      return { ok: false, error: msg };
    }
  }

  /**
   * Làm mới thông tin tài khoản từ máy chủ
   */
  static async fetchMe(): Promise<AuthUser | null> {
    const token = this.getToken();
    if (!token) return null;

    try {
      const res = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        this.logout();
        return null;
      }
      const data = await res.json();
      if (data.ok && data.user) {
        if (typeof window !== "undefined" && window.localStorage) {
          window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.user));
          window.dispatchEvent(new CustomEvent(AUTH_CHANGE_EVENT, { detail: data.user }));
        }
        return data.user;
      }
    } catch {
      // Offline fallback to stored user
    }
    return this.getUser();
  }

  /**
   * Đăng xuất và xóa phiên làm việc
   */
  static logout(): void {
    const token = this.getToken();
    if (token) {
      fetch("/api/auth/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }

    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.removeItem(AUTH_TOKEN_KEY);
      window.localStorage.removeItem(AUTH_USER_KEY);
      window.dispatchEvent(new CustomEvent(AUTH_CHANGE_EVENT, { detail: null }));
    }
  }
}

/**
 * React Hook quản lý trạng thái đăng nhập
 */
export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(() => AuthService.getUser());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Tự động kiểm tra phiên đăng nhập trên máy chủ khi mở app
    AuthService.fetchMe().then((me) => {
      setUser(me);
    });

    const handleAuthChange = (e: Event) => {
      const customEvent = e as CustomEvent<AuthUser | null>;
      setUser(customEvent.detail);
    };

    window.addEventListener(AUTH_CHANGE_EVENT, handleAuthChange);
    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, handleAuthChange);
    };
  }, []);

  return {
    user,
    isLoggedIn: Boolean(user),
    isLoading,
    setIsLoading,
    logout: () => AuthService.logout(),
  };
}
