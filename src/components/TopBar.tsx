/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * TopBar (56px) — Thanh Tiêu Đề Trên Cùng:
 * - Cố định trên đỉnh màn hình với nền trắng mờ kính (backdrop-blur-md)
 * - Chứa Logo Cò Rằn (Cò Em)
 * - Chip thời tiết giả lập
 * - Nút Đăng Nhập Gmail & Quản lý tài khoản người dùng
 */

import { useRef, useEffect, useState } from "react";
import WeatherChip from "./WeatherChip";
import { ThoiTietState, ThongTinViTri } from "../lib/thoitiet";
import { VungId } from "../data/vung";
import Tooltip from "./Tooltip";
import { Menu, Mail, LogOut, CheckCircle2, User, BookOpen, ShieldCheck } from "lucide-react";
import { useAuth } from "../lib/auth";

interface TopBarProps {
  weatherState: ThoiTietState;
  onSelectVung: (vungId: VungId) => void;
  onSelectCostume?: (trangPhucId: string) => void;
  onViTriChange?: (newViTri: ThongTinViTri) => void;
  onLogoClick?: () => void;
  theme?: "light" | "dark";
  onToggleTheme?: () => void;
  onOpenAuthModal?: () => void;
}

export default function TopBar({
  weatherState,
  onSelectVung,
  onSelectCostume,
  onViTriChange,
  onLogoClick,
  theme = "light",
  onOpenAuthModal,
}: TopBarProps) {
  const barRef = useRef<HTMLElement>(null);
  const { user, isLoggedIn, logout } = useAuth();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      ref={barRef}
      className="vpr-top-bar"
      role="banner"
      aria-label="Thanh tiêu đề trên cùng"
    >
      <style>{`
        .vpr-top-bar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 56px;
          z-index: 45;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 16px;
          background: rgba(251, 253, 249, 0.88);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--sidebar-border, rgba(21, 128, 61, 0.16));
          box-sizing: border-box;
          transition: background-color 0.3s ease, border-color 0.3s ease;
        }

        html[data-theme="dark"] .vpr-top-bar,
        html.theme-dark .vpr-top-bar {
          background: rgba(7, 16, 32, 0.92);
          border-bottom: 1px solid rgba(56, 189, 248, 0.22);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
        }

        @media (min-width: 1024px) {
          .vpr-top-bar {
            left: 250px;
          }
          body.sidebar-collapsed .vpr-top-bar {
            left: 72px;
          }
        }

        @media (max-width: 1023px) {
          .vpr-top-bar {
            padding: 0 10px;
          }
        }
      `}</style>

      {/* ZONE 1: MENU MOBILE VÀ TÊN ỨNG DỤNG RÕ RÀNG */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={() => window.dispatchEvent(new CustomEvent("vpr:open-mobile-nav"))}
          className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--nen-the)] border border-[var(--vien-the)] text-[var(--nen-toi)] hover:border-emerald-500/40 shadow-xs cursor-pointer flex-shrink-0"
          aria-label="Mở thực đơn"
          title="Mở thực đơn"
        >
          <Menu className="w-4 h-4 text-emerald-600" />
        </button>

        <button
          type="button"
          onClick={onLogoClick}
          className="flex items-center gap-2 group text-left cursor-pointer bg-transparent border-0 p-0"
          title="Trang chủ Việt Phục Remix"
        >
          <span className="font-serif font-black text-sm sm:text-base text-emerald-950 dark:text-emerald-100 tracking-tight group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition">
            Việt Phục Remix
          </span>
          <span className="hidden sm:inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100/90 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
            Gen Z Heritage
          </span>
        </button>
      </div>

      {/* ZONE 2 & 3: CHIP THỜI TIẾT + ĐĂNG NHẬP GMAIL */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Chip thời tiết giả lập */}
        <Tooltip
          title="Thời tiết quê hương"
          content="Gợi ý trang phục theo khí hậu và nhiệt độ thực tế của từng vùng miền."
          shortcut="Đổi vùng"
          position="bottom"
        >
          <WeatherChip
            weatherState={weatherState}
            onSelectVung={onSelectVung}
            onSelectCostume={onSelectCostume}
            onViTriChange={onViTriChange}
          />
        </Tooltip>

        {/* Nút Đăng nhập hoặc Chip Tài khoản người dùng */}
        {!isLoggedIn ? (
          <button
            type="button"
            onClick={onOpenAuthModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-600/15 hover:bg-amber-600/25 text-amber-950 dark:text-amber-200 border border-amber-500/35 transition shadow-xs hover:shadow cursor-pointer"
            title="Đăng nhập để lưu và đồng bộ dữ liệu cá nhân"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Đăng nhập</span>
          </button>
        ) : (
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-950 dark:text-emerald-200 border border-emerald-500/40 transition shadow-xs cursor-pointer"
              title="Tài khoản của bạn"
            >
              <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">
                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
              <span className="max-w-[100px] truncate hidden md:inline">
                {user?.name || user?.email}
              </span>
            </button>

            {/* Menu thả xuống */}
            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-64 p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center gap-2 pb-2.5 mb-2.5 border-b border-slate-200 dark:border-slate-800">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                    {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-bold truncate text-slate-900 dark:text-white">
                      {user?.name}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {user?.email}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowUserDropdown(false);
                    window.dispatchEvent(new CustomEvent("vpr:open-profile"));
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer font-medium mb-1 text-slate-700 dark:text-slate-200"
                >
                  <User className="w-3.5 h-3.5 text-amber-600" />
                  Hồ sơ & Cá nhân hóa
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowUserDropdown(false);
                    window.dispatchEvent(new CustomEvent("vpr:open-nhat-ky"));
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer font-medium mb-1 text-slate-700 dark:text-slate-200"
                >
                  <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                  Nhật Ký Trải Nghiệm
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowUserDropdown(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-xl transition cursor-pointer font-medium"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
