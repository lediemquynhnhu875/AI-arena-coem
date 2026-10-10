/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * MÀN HÌNH HỒ SƠ & CÁ NHÂN HÓA (PROFILE MANAGEMENT SCREEN)
 * - Quản lý thông tin tài khoản và tủ đồ cá nhân
 * - Cho phép chuyển đổi nhanh giữa các hồ sơ đã lưu
 * - Điều hướng trực tiếp sang Modal Đăng Nhập / Đăng Ký hợp nhất (không trùng lặp giao diện)
 */

import React, { useState } from "react";
import { domdom } from "../copy/coem";
import {
  HoSo,
  layHoSoHienTai,
  layDanhSachHoSo,
  taoHoacChonHoSo,
  dungHoSoKhach,
  chuyenHoSo,
} from "../lib/hoSo";
import {
  Sparkles,
  ShieldCheck,
  User,
  X,
  ArrowRight,
  LogOut,
  CheckCircle2,
  LogIn,
  UserPlus,
  PlusCircle,
} from "lucide-react";
import { WelcomePose } from "../narrator";
import { useAuth } from "../lib/auth";

interface Props {
  onProceed: (hoSo: HoSo) => void;
  onBack?: () => void;
  isModal?: boolean;
}

const noise = encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .95  0 0 0 0 .92  0 0 0 0 .85  0 0 0 .55 0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`
);

export default function ChaoBanScreen({
  onProceed,
  onBack,
  isModal = false,
}: Props) {
  const { user, isLoggedIn, logout } = useAuth();
  const currentHoSo = layHoSoHienTai();

  // Danh sách các hồ sơ lưu trên thiết bị
  const [profiles, setProfiles] = useState<HoSo[]>(() => layDanhSachHoSo());
  const [tenNhanh, setTenNhanh] = useState("");
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  // Mở AuthModal đồng nhất khi muốn Đăng nhập / Đăng ký
  const handleOpenAuth = (mode: "login" | "register") => {
    window.dispatchEvent(
      new CustomEvent("vpr:open-auth-modal", { detail: { mode } })
    );
    if (onBack) onBack();
  };

  // Tạo hồ sơ nhanh cục bộ
  const handleQuickSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = tenNhanh.trim();
    if (!trimmed) {
      handleGuest();
      return;
    }
    const hoSo = taoHoacChonHoSo(trimmed);
    setProfiles(layDanhSachHoSo());
    onProceed(hoSo);
  };

  const handleGuest = () => {
    const hoSo = dungHoSoKhach();
    setProfiles(layDanhSachHoSo());
    onProceed(hoSo);
  };

  const handleSwitchProfile = (p: HoSo) => {
    const switched = chuyenHoSo(p.id);
    onProceed(switched);
  };

  return (
    <div className={`chao-ban-wrapper ${isModal ? "chao-ban-wrapper--modal" : ""}`}>
      <style>{`
        .chao-ban-wrapper {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px 16px;
          background: #fdfbf7;
          position: relative;
        }

        .chao-ban-wrapper--modal {
          position: fixed;
          inset: 0;
          z-index: 60;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          background: rgba(0, 0, 0, 0.65);
          backdrop-filter: blur(6px);
        }

        .chao-ban-card {
          width: 100%;
          max-width: 480px;
          background: #ffffff;
          border-radius: 28px;
          padding: 32px 28px;
          box-shadow: 0 20px 45px -10px rgba(15, 23, 42, 0.12);
          border: 1px solid rgba(217, 119, 6, 0.2);
          text-align: center;
          position: relative;
        }

        html[data-theme="dark"] .chao-ban-card {
          background: #0f172a;
          border-color: rgba(245, 158, 11, 0.25);
          color: #f8fafc;
        }
      `}</style>

      <main className="chao-ban-card">
        {/* Nút đóng nếu mở dạng modal */}
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Linh vật Cò Em */}
        <div className="flex justify-center mb-3">
          <WelcomePose size={72} />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-300/50 text-amber-800 dark:text-amber-300 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Hồ Sơ & Cá Nhân Hóa</span>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 dark:text-white mb-1.5">
          Không Gian Cổ Phục Của Bạn
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6">
          Lưu giữ các bộ phối đồ di sản Gen Z, quản lý tủ đồ và kết nối an toàn.
        </p>

        {/* =================================================================== */}
        {/* TRƯỜNG HỢP 1: NGƯỜI DÙNG ĐÃ ĐĂNG NHẬP                              */}
        {/* =================================================================== */}
        {isLoggedIn && user ? (
          <div className="w-full p-5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-300/60 dark:border-amber-700/50 text-left shadow-xs">
            <div className="flex items-center gap-3.5 mb-3.5">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider block">
                  Tài khoản đang liên kết
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                  {user.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {user.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 py-1.5 px-3 rounded-xl bg-emerald-100/70 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-medium mb-4">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              <span>Dữ liệu phối đồ được đồng bộ an toàn</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={() => {
                  const hoSo = taoHoacChonHoSo(user.name);
                  onProceed(hoSo);
                }}
                className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Vào Khám Phá Với Hồ Sơ Này</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => logout()}
                className="py-2.5 px-3.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-medium rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Đăng Xuất</span>
              </button>
            </div>
          </div>
        ) : (
          /* =================================================================== */
          /* TRƯỜNG HỢP 2: CHƯA ĐĂNG NHẬP -> GỌI ĐẾN AUTH MODAL HỢP NHẤT          */
          /* =================================================================== */
          <div className="w-full space-y-4 text-left">
            {/* THẺ HỒ SƠ ĐANG DÙNG HIỆN TẠI TRÊN MÁY */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Hồ sơ đang mở
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-semibold">
                  Hiện hành
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold text-sm">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {currentHoSo.tenHienThi}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Chế độ lưu trữ trên thiết bị
                  </p>
                </div>
              </div>
            </div>

            {/* KHỐI ĐĂNG NHẬP CHÍNH - MỞ AUTH MODAL */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50/50 dark:from-amber-950/30 dark:to-orange-950/20 border border-amber-300/60 dark:border-amber-700/40">
              <div className="flex items-center gap-2 mb-2 text-amber-800 dark:text-amber-300">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <h4 className="text-xs font-bold uppercase tracking-wider">
                  Đăng Nhập Tài Khoản
                </h4>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-3.5 leading-relaxed">
                Đăng nhập để đồng bộ toàn bộ tủ đồ, gùi ký ức và lookbook phối đồ của bạn qua Google.
              </p>
              <button
                type="button"
                onClick={() => handleOpenAuth("login")}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-amber-600/25 hover:scale-[1.01] active:scale-95 transition cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Đăng Nhập</span>
              </button>
            </div>

            {/* DANH SÁCH HỒ SƠ KHÁC TRÊN THIẾT BỊ NÀY */}
            {profiles.length > 1 && (
              <div className="pt-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                  Đổi sang hồ sơ khác trên máy:
                </span>
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {profiles.map((p) => {
                    const isSelected = p.id === currentHoSo.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleSwitchProfile(p)}
                        className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs transition cursor-pointer ${
                          isSelected
                            ? "border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-bold"
                            : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-amber-400 text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        <span className="truncate">{p.tenHienThi}</span>
                        {isSelected ? (
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                            Đang dùng ✓
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400">Chọn »</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TẠO HỒ SƠ NHANH (LOCAL NICKNAME) */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
              {!isCreatingNew ? (
                <button
                  type="button"
                  onClick={() => setIsCreatingNew(true)}
                  className="w-full py-2 px-3 text-xs text-slate-600 dark:text-slate-400 hover:text-amber-700 dark:hover:text-amber-300 flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Hoặc đặt tên trải nghiệm nhanh cục bộ</span>
                </button>
              ) : (
                <form onSubmit={handleQuickSubmit} className="space-y-2 mt-2">
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                    Tên hiển thị nhanh:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tenNhanh}
                      onChange={(e) => setTenNhanh(e.target.value)}
                      placeholder="Ví dụ: Bạn Mới, Lan Anh..."
                      maxLength={30}
                      className="flex-1 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                    <button
                      type="submit"
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl cursor-pointer"
                    >
                      Lưu
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
