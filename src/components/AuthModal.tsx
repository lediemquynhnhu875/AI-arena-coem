/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * MODAL ĐĂNG NHẬP (FOCUSED AUTH MODAL)
 * Thiết kế tinh gọn, tập trung vào 1 nút hành động đăng nhập chính bằng Google,
 * kèm tùy chọn dự phòng Email & OTP và chế độ Khách nhanh chóng.
 */

import React, { useState, useEffect, useRef } from "react";
import {
  Mail,
  ArrowRight,
  RefreshCw,
  X,
  User,
  CheckCircle2,
  ShieldCheck,
  KeyRound,
  LogIn,
} from "lucide-react";
import { AuthService, AuthUser, AUTH_CHANGE_EVENT } from "../lib/auth";
import { taoHoacChonHoSo, dungHoSoKhach } from "../lib/hoSo";
import { signInWithGoogle } from "../lib/firebase";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (user: AuthUser) => void;
  initialMode?: "login" | "register";
  initialEmail?: string;
  initialName?: string;
}

export default function AuthModal({
  isOpen,
  onClose,
  onSuccess,
  initialEmail = "",
  initialName = "",
}: AuthModalProps) {
  const [step, setStep] = useState<"form" | "otp" | "success">("form");
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showEmailForm, setShowEmailForm] = useState(false);

  // Bộ đếm thời gian hiệu lực OTP (300s = 5 phút)
  const [expirySeconds, setExpirySeconds] = useState(300);
  // Bộ đếm thời gian cho phép gửi lại (45s)
  const [resendCooldown, setResendCooldown] = useState(45);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isOpen) {
      setStep("form");
      setName(initialName || "");
      setEmail(initialEmail || "");
      setOtpDigits(["", "", "", "", "", ""]);
      setErrorMessage("");
      setShowEmailForm(false);
    }
  }, [isOpen, initialEmail, initialName]);

  // Đếm ngược thời gian OTP
  useEffect(() => {
    if (step !== "otp") return;

    const timer = setInterval(() => {
      setExpirySeconds((prev) => (prev > 0 ? prev - 1 : 0));
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [step]);

  // Đăng nhập 1 chạm với tài khoản Google
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const fbUser = await signInWithGoogle();
      if (fbUser) {
        const authUser: AuthUser = {
          id: fbUser.uid,
          name: fbUser.displayName || fbUser.email?.split("@")[0] || "Người Mến Cổ Phục",
          email: fbUser.email || "",
          avatar: fbUser.photoURL || undefined,
        };

        if (typeof window !== "undefined" && window.localStorage) {
          window.localStorage.setItem("vpr:auth_token", `fb-${fbUser.uid}`);
          window.localStorage.setItem("vpr:auth_user", JSON.stringify(authUser));
        }

        taoHoacChonHoSo(authUser.name);
        window.dispatchEvent(new CustomEvent(AUTH_CHANGE_EVENT, { detail: authUser }));
        setName(authUser.name);
        setStep("success");
        if (onSuccess) onSuccess(authUser);
        setTimeout(() => onClose(), 1200);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("popup-closed-by-user")) {
        setErrorMessage("Bạn đã đóng cửa sổ đăng nhập Google.");
      } else if (msg.includes("popup-blocked")) {
        setErrorMessage("Trình duyệt đã chặn cửa sổ popup. Bạn hãy bật cho phép popup hoặc dùng Email bên dưới nhé!");
        setShowEmailForm(true);
      } else if (msg.includes("unauthorized-domain") || msg.includes("operation-not-allowed")) {
        setErrorMessage("Tên miền xem trước chưa cấp phép Google Popup. Vui lòng đăng nhập bằng Email bên dưới rất nhanh!");
        setShowEmailForm(true);
      } else {
        setErrorMessage("Không thể mở Google Sign-In. Vui lòng thử đăng nhập bằng Email bên dưới.");
        setShowEmailForm(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Gửi mã OTP qua Email
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage("");

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      setErrorMessage("Vui lòng nhập địa chỉ email hợp lệ (VD: tenban@gmail.com).");
      return;
    }

    setIsLoading(true);
    const res = await AuthService.sendOtp(trimmedEmail);
    setIsLoading(false);

    if (res.ok) {
      setStep("otp");
      setExpirySeconds(300);
      setResendCooldown(45);
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    } else {
      setErrorMessage(res.error || "Không thể gửi mã xác thực. Vui lòng kiểm tra lại email.");
    }
  };

  // Nhập từng chữ số OTP
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newDigits = [...otpDigits];
    newDigits[index] = value.slice(-1);
    setOtpDigits(newDigits);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    const fullCode = newDigits.join("");
    if (fullCode.length === 6) {
      handleVerifyCode(fullCode);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;

    const newDigits = [...otpDigits];
    for (let i = 0; i < pasted.length; i++) {
      newDigits[i] = pasted[i];
    }
    setOtpDigits(newDigits);

    if (pasted.length === 6) {
      handleVerifyCode(pasted);
    } else if (pasted.length < 6) {
      inputRefs.current[pasted.length]?.focus();
    }
  };

  // Xác thực mã OTP
  const handleVerifyCode = async (codeToVerify?: string) => {
    const code = codeToVerify || otpDigits.join("");
    if (code.length !== 6) {
      setErrorMessage("Vui lòng nhập đủ 6 chữ số mã OTP.");
      return;
    }

    setErrorMessage("");
    setIsLoading(true);

    const displayName = name.trim() || email.split("@")[0] || "Người Mến Cổ Phục";
    const res = await AuthService.verifyOtp(email.trim().toLowerCase(), code, displayName);
    setIsLoading(false);

    if (res.ok && res.user) {
      try {
        taoHoacChonHoSo(res.user.name);
      } catch {
        // Fallback
      }

      setStep("success");
      if (onSuccess) onSuccess(res.user);
      setTimeout(() => {
        onClose();
      }, 1200);
    } else {
      setErrorMessage(res.error || "Mã OTP không chính xác hoặc đã hết hiệu lực.");
    }
  };

  // Tiếp tục với tư cách Khách
  const handleGuest = () => {
    dungHoSoKhach();
    onClose();
  };

  if (!isOpen) return null;

  const minutes = Math.floor(expirySeconds / 60);
  const seconds = expirySeconds % 60;
  const timeFormatted = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md transition-opacity duration-300"
      role="dialog"
      aria-modal="true"
      aria-label="Cửa sổ đăng nhập"
    >
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-amber-200/60 dark:border-amber-500/20 text-slate-800 dark:text-slate-100 p-6 sm:p-8 overflow-hidden transition-all animate-in fade-in zoom-in-95 duration-200">
        {/* Điểm nhấn viền ánh kim phía trên */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700" />

        {/* Nút đóng */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        {/* =================================================================== */}
        {/* BƯỚC 1: FORM ĐĂNG NHẬP TINH GỌN VỚI 1 NÚT CHÍNH DUY NHẤT            */}
        {/* =================================================================== */}
        {step === "form" && (
          <div>
            {/* Header: Biểu tượng & Tiêu đề */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200/80 dark:border-amber-800/80 flex items-center justify-center text-amber-700 dark:text-amber-400 shadow-xs flex-shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 dark:text-white tracking-tight leading-tight">
                  Đăng Nhập
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Đồng bộ tủ đồ cổ phục và lưu giữ trải nghiệm của bạn.
                </p>
              </div>
            </div>

            {/* NÚT ĐĂNG NHẬP DUY NHẤT: GOOGLE SIGN-IN (1 CHẠM LÀ XONG) */}
            <div className="mb-4">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="group w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-white hover:bg-slate-50 active:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-sm font-bold rounded-2xl border-2 border-amber-300/80 hover:border-amber-500 dark:border-slate-700 dark:hover:border-amber-500/80 shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 hover:scale-[1.01] active:scale-95"
              >
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>Đăng nhập bằng Google</span>
              </button>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 text-xs text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 rounded-xl animate-in fade-in">
                {errorMessage}
              </div>
            )}

            {/* TÙY CHỌN DỰ PHÒNG: EMAIL (NẾU CẦN) */}
            {!showEmailForm ? (
              <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowEmailForm(true)}
                  className="text-xs text-slate-500 hover:text-amber-700 dark:hover:text-amber-300 underline cursor-pointer"
                >
                  Hoặc đăng nhập bằng Email & OTP
                </button>
              </div>
            ) : (
              <form onSubmit={handleSendOtp} className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800 animate-in fade-in">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Địa chỉ Email của bạn:
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tenban@gmail.com"
                      required
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-xl shadow-xs transition cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Đang gửi mã...</span>
                    </>
                  ) : (
                    <>
                      <span>Tiếp Tục Với Mã OTP</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* DÙNG NHANH KHÁCH */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
              <button
                type="button"
                onClick={handleGuest}
                className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition underline cursor-pointer"
              >
                Tiếp tục trải nghiệm với tư cách Khách
              </button>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* BƯỚC 2: NHẬP MÃ OTP 6 SỐ                                            */}
        {/* =================================================================== */}
        {step === "otp" && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 dark:text-white">
                Xác Thực Mã OTP
              </h2>
              <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/80 px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-800">
                {timeFormatted}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-5 leading-relaxed">
              Mã xác nhận 6 chữ số vừa được gửi đến: <strong className="text-slate-800 dark:text-slate-200">{email}</strong>.
            </p>

            <div className="flex justify-between gap-2 sm:gap-3 mb-5" onPaste={handlePaste}>
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => {
                    inputRefs.current[idx] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className="w-11 h-13 sm:w-12 sm:h-14 text-center font-mono text-xl sm:text-2xl font-bold bg-slate-50 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:border-amber-600 dark:focus:border-amber-500 focus:bg-white dark:focus:bg-slate-900 transition shadow-inner"
                />
              ))}
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 text-xs text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 rounded-xl">
                {errorMessage}
              </div>
            )}

            <button
              type="button"
              onClick={() => handleVerifyCode()}
              disabled={isLoading || otpDigits.join("").length !== 6}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md shadow-emerald-700/25 hover:shadow-emerald-700/40 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mb-3"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Đang kích hoạt...</span>
                </>
              ) : (
                <>
                  <span>Xác Nhận & Đăng Nhập</span>
                  <CheckCircle2 className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setStep("form")}
                className="hover:text-slate-800 dark:hover:text-slate-200 transition cursor-pointer"
              >
                ← Quay lại
              </button>
              <button
                type="button"
                onClick={() => handleSendOtp()}
                disabled={resendCooldown > 0 || isLoading}
                className="text-amber-700 dark:text-amber-400 hover:underline disabled:opacity-40 cursor-pointer"
              >
                {resendCooldown > 0 ? `Gửi lại sau (${resendCooldown}s)` : "Gửi lại mã OTP"}
              </button>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* BƯỚC 3: THÀNH CÔNG                                                  */}
        {/* =================================================================== */}
        {step === "success" && (
          <div className="text-center py-7">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 mb-3 shadow-sm animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 dark:text-white mb-1.5">
              Chào mừng, {name || "bạn"}!
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Đăng nhập thành công. Đang đồng bộ không gian cổ phục...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
