/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * SidebarNav — Cột Điều Hướng Bên Trái
 * Dải menu phân loại rõ rệt từng trạm dừng chân văn hóa:
 * 1. Cổng vào
 * 2. Quê nhà
 * 3. Phòng may Studio
 * 4. Tủ đồ
 * 5. Dòng thời gian
 * 6. Soi chỉ chất liệu
 * 7. Bản đồ văn hóa
 * 8. Mô hình người 2 giới
 * 9. Linh vật Cò Rằn (Cò Em)
 * Bo góc mềm mại (rounded-2xl) cùng hiệu ứng viền bất đối xứng hữu cơ (--vien-lech-a, --vien-lech-b)
 */

import React, { useState, useEffect } from "react";
import CoLogo from "./CoLogo";
import Tooltip from "./Tooltip";
import { ThemeMode } from "../lib/theme";
import { HoSo } from "../lib/hoSo";
import { docCaiDatTraiNghiem } from "../lib/caiDatTraiNghiem";
import {
  Home,
  CloudSun,
  Palette,
  Bookmark,
  History,
  GitCompare,
  Map,
  Users,
  Feather,
  Shirt,
  Sliders,
  Sun,
  Moon,
  User,
  Menu,
  X,
  BookOpen,
  type LucideIcon,
} from "lucide-react";

export type Screen =
  | "chao_ban"
  | "gate"
  | "que_nha"
  | "s2"
  | "s3"
  | "nhan_vat"
  | "s4"
  | "test"
  | "giu_chuan"
  | "gui_ky_uc"
  | "nhat_ky"
  | "tham_tu"
  | "ban_do"
  | "dong_thoi_gian"
  | "soi_chi_chung"
  | "cho_phien";

interface NavItem {
  id: Screen | "linh_vat";
  label: string;
  icon: LucideIcon;
  badge?: string;
  tooltip: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: "gate", label: "Trang Chủ", icon: Home, tooltip: "Trang Chủ" },
  { id: "s2", label: "Bộ Sưu Tập", icon: Shirt, tooltip: "Bộ Sưu Tập" },
  { id: "s4", label: "Phối Đồ", icon: Palette, tooltip: "Phối Đồ & Thử Trang Phục 2D" },
  { id: "nhan_vat", label: "Tạo Nhân Vật", icon: Users, tooltip: "Tạo Nhân Vật" },
  { id: "que_nha", label: "Bối Cảnh", icon: CloudSun, tooltip: "Bối Cảnh" },
  { id: "gui_ky_uc", label: "Gùi Ký Ức", icon: Bookmark, tooltip: "Gùi Ký Ức — Tủ đồ lưu trữ" },
  { id: "nhat_ky", label: "Nhật Ký", icon: BookOpen, tooltip: "Nhật Ký Trải Nghiệm & Cảm Xúc" },
  { id: "dong_thoi_gian", label: "Dòng Lịch Sử", icon: History, tooltip: "Dòng Lịch Sử" },
  { id: "ban_do", label: "Bản Đồ", icon: Map, tooltip: "Bản Đồ" },
  { id: "soi_chi_chung", label: "Sợi Chỉ Chung", icon: GitCompare, tooltip: "Sợi Chỉ Chung" },
];

interface SidebarNavProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  activeHoSo: HoSo;
  onOpenChaoBan: () => void;
  onOpenTraiNghiem: () => void;
  hasActiveTraiNghiem: boolean;
  onToggleChat: () => void;
  isChatOpen: boolean;
  showGoiYBtn?: boolean;
  onOpenGoiY?: () => void;
}

export default function SidebarNav({
  currentScreen,
  onNavigate,
  theme,
  onToggleTheme,
  activeHoSo,
  onOpenChaoBan,
  onOpenTraiNghiem,
  hasActiveTraiNghiem,
  onToggleChat,
  isChatOpen,
}: SidebarNavProps) {
  // Sidebar cố định hoàn toàn theo yêu cầu người dùng (không cần thu gọn)
  const isCollapsed = false;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isShakingGuiKyUc, setIsShakingGuiKyUc] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    const handleOutfitCompleted = () => {
      setIsShakingGuiKyUc(true);
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        setIsShakingGuiKyUc(false);
      }, 7000); // Rung lắc và giữ nhấp nháy 7 giây
    };

    window.addEventListener("vpr:outfit-completed", handleOutfitCompleted);
    return () => {
      window.removeEventListener("vpr:outfit-completed", handleOutfitCompleted);
      if (timer) clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const handleOpenMobile = () => setMobileOpen(true);
    window.addEventListener("vpr:open-mobile-nav", handleOpenMobile);
    return () => window.removeEventListener("vpr:open-mobile-nav", handleOpenMobile);
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.body.classList.add("sidebar-expanded");
      document.body.classList.remove("sidebar-collapsed");
    }
    try {
      window.localStorage.setItem("vpr:sidebar_collapsed", "false");
    } catch {
      // ignore
    }
  }, []);

  const handleSelectNav = (id: Screen | "linh_vat") => {
    if (id === "gui_ky_uc") {
      setIsShakingGuiKyUc(false);
    }
    if (id === "linh_vat") {
      onToggleChat();
    } else {
      onNavigate(id);
    }
    setMobileOpen(false);
  };

  const isLight = theme === "light";

  return (
    <>
      <style>{`
        /* Container thanh công cụ cột bên trái */
        .vpr-sidebar-nav {
          position: fixed;
          top: 0;
          bottom: 0;
          left: 0;
          z-index: 50;
          display: flex;
          flex-direction: column;
          background: var(--nen-sidebar, rgba(255, 255, 255, 0.98));
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-right: 1px solid var(--sidebar-border, #E2E8F0);
          box-shadow: 4px 0 24px -4px rgba(15, 23, 42, 0.08);
          transition: width 0.28s cubic-bezier(0.4, 0, 0.2, 1), transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
          width: 250px;
          border-top-right-radius: 20px;
          border-bottom-right-radius: 20px;
        }

        .vpr-sidebar-nav.is-collapsed {
          width: 72px;
        }

        @media (max-width: 1023px) {
          .vpr-sidebar-nav {
            transform: translateX(-100%);
            width: 280px !important;
          }
          .vpr-sidebar-nav.is-mobile-open {
            transform: translateX(0);
          }
        }

        .vpr-sidebar-backdrop {
          position: fixed;
          inset: 0;
          z-index: 48;
          background: rgba(26, 48, 34, 0.45);
          backdrop-filter: blur(4px);
        }

        /* Các dòng nút điều hướng */
        .vpr-nav-row {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 8px 12px;
          border-radius: var(--vien-lech-a);
          background: transparent;
          border: 1px solid transparent;
          color: var(--nen-toi);
          cursor: pointer;
          text-align: left;
          transition: all 0.24s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          white-space: nowrap;
        }

        .vpr-nav-row:hover {
          background: rgba(16, 185, 129, 0.08);
          border-color: rgba(16, 185, 129, 0.22);
          color: #047857;
          transform: translateX(3px);
        }

        /* KHUNG ĐANG CHỌN (ACTIVE CATEGORY FRAME): Sang trọng, ngọc bích & thiên thanh, hiệu ứng ánh sáng mượt mà */
        .vpr-nav-row--active {
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(20, 184, 166, 0.08) 100%) !important;
          border: 1.5px solid rgba(16, 185, 129, 0.45) !important;
          color: #064E3B !important;
          font-weight: 700 !important;
          box-shadow: 0 4px 14px -2px rgba(16, 185, 129, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.9) !important;
          transform: translateX(4px);
        }

        .vpr-nav-row--active .vpr-nav-sub {
          color: #059669 !important;
        }

        /* Dải viền phát sáng chỉ báo bên trái */
        .vpr-nav-row--active::before {
          content: "";
          position: absolute;
          left: 0;
          top: 6px;
          bottom: 6px;
          width: 3.5px;
          border-radius: 4px;
          background: linear-gradient(180deg, #10B981 0%, #06B6D4 100%);
          box-shadow: 0 0 10px rgba(16, 185, 129, 0.65);
        }

        /* Hiệu ứng gợn ánh sáng mượt mà chạy ngang (Shimmer Effect) */
        .vpr-nav-row--active::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          pointer-events: none;
          background: linear-gradient(90deg, transparent 0%, rgba(16, 185, 129, 0.14) 50%, transparent 100%);
          background-size: 200% 100%;
          animation: vprNavShimmer 3s infinite ease-in-out;
        }

        @keyframes vprNavShimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        /* Dark Theme cho khung Active: Tươi sáng dạ quang ngọc & thiên thanh */
        html[data-theme="dark"] .vpr-nav-row--active,
        html.theme-dark .vpr-nav-row--active {
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.16) 0%, rgba(56, 189, 248, 0.18) 100%) !important;
          border: 1.5px solid rgba(56, 189, 248, 0.52) !important;
          color: #F8FAFC !important;
          box-shadow: 0 4px 20px -2px rgba(56, 189, 248, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.18) !important;
          transform: translateX(4px);
        }

        html[data-theme="dark"] .vpr-nav-row--active .vpr-nav-sub,
        html.theme-dark .vpr-nav-row--active .vpr-nav-sub {
          color: rgba(224, 242, 254, 0.95) !important;
        }

        html[data-theme="dark"] .vpr-nav-row--active::before,
        html.theme-dark .vpr-nav-row--active::before {
          background: linear-gradient(180deg, #38BDF8 0%, #34D399 100%);
          box-shadow: 0 0 12px rgba(56, 189, 248, 0.75);
        }

        /* Hiệu ứng rung nhẹ (vibrate / shake) khi hoàn thành một bộ trang phục mới */
        @keyframes vprShakeGentle {
          0%, 100% {
            transform: translateX(0) rotate(0deg);
          }
          10% {
            transform: translateX(-3.5px) rotate(-1.5deg);
          }
          20% {
            transform: translateX(3.5px) rotate(1.5deg);
          }
          30% {
            transform: translateX(-3px) rotate(-1deg);
          }
          40% {
            transform: translateX(3px) rotate(1deg);
          }
          50% {
            transform: translateX(-2px) rotate(-0.5deg);
          }
          60% {
            transform: translateX(2px) rotate(0.5deg);
          }
          70% {
            transform: translateX(-1px) rotate(0deg);
          }
          80% {
            transform: translateX(1px) rotate(0deg);
          }
          90% {
            transform: translateX(0) rotate(0deg);
          }
        }

        .vpr-nav-shake-btn {
          animation: vprShakeGentle 0.85s ease-in-out infinite alternate;
          border-color: rgba(245, 158, 11, 0.75) !important;
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.16) 0%, rgba(16, 185, 129, 0.14) 100%) !important;
          box-shadow: 0 4px 18px -2px rgba(245, 158, 11, 0.38) !important;
        }

        .vpr-nav-shake-btn .vpr-shake-badge {
          animation: vprBadgePulse 1s ease-in-out infinite alternate;
        }

        @keyframes vprBadgePulse {
          0% {
            transform: scale(0.95);
            opacity: 0.9;
          }
          100% {
            transform: scale(1.08);
            opacity: 1;
            filter: drop-shadow(0 0 6px rgba(245, 158, 11, 0.8));
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .vpr-nav-shake-btn {
            animation: none !important;
            box-shadow: 0 0 14px rgba(245, 158, 11, 0.5) !important;
          }
        }
      `}</style>

      {mobileOpen && (
        <div
          className="vpr-sidebar-backdrop lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* 2. THANH CÔNG CỤ CỘT BÊN TRÁI CHÍNH */}
      <aside
        className={`vpr-sidebar-nav ${isCollapsed ? "is-collapsed" : ""} ${
          mobileOpen ? "is-mobile-open" : ""
        }`}
        aria-label="Thanh công cụ điều hướng chính"
      >
        {/* HEADER: LOGO CÒ EM + NÚT THU GỌN / ĐÓNG */}
        <div className="flex items-center justify-between p-3.5 border-b border-[var(--sidebar-border)]">
          <Tooltip
            title="Cò Em — Trang chủ"
            content="Quay lại Cổng chào và Lời ngỏ khởi hành."
            position="right"
          >
            <CoLogo
              size="md"
              showText={true}
              onClick={() => handleSelectNav("gate")}
            />
          </Tooltip>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg text-[var(--tro-tram)] hover:bg-[var(--nen-the-phu)]"
              aria-label="Đóng menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* BỘ CHUYỂN CHẾ ĐỘ SÁNG / TỐI: GỌN GÀNG, BỎ Ô SÁNG CHÓI BÊN CẠNH */}
        <div className="px-3 py-2.5 border-b border-[var(--sidebar-border)]">
          <button
            type="button"
            onClick={onToggleTheme}
            className="w-full flex items-center justify-between p-2 rounded-xl bg-[var(--nen-the)] border border-[var(--vien-the)] hover:border-emerald-500/40 text-[var(--nen-toi)] transition-all cursor-pointer shadow-xs hover:bg-[var(--nen-the-phu)]"
            title={isLight ? "Bấm để chuyển sang chế độ Tối (Trời đêm)" : "Bấm để chuyển sang chế độ Sáng (Ban ngày)"}
          >
            <div className="flex items-center gap-2.5">
              {isLight ? (
                <Sun className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              ) : (
                <Moon className="w-4 h-4 text-sky-400 flex-shrink-0" />
              )}
              {!isCollapsed && (
                <span className="text-xs font-semibold text-[var(--nen-toi)]">
                  {isLight ? "Giao diện Sáng" : "Giao diện Tối"}
                </span>
              )}
            </div>
            {!isCollapsed && (
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium transition-colors ${
                isLight
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-sky-950/80 text-sky-300 border border-sky-700/40"
              }`}>
                {isLight ? "Bật tối »" : "Bật sáng »"}
              </span>
            )}
          </button>
        </div>

        {/* CÁC MỤC DANH MỤC ĐIỀU HƯỚNG */}
        <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-1.5 custom-scrollbar">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--tro-tram)] px-2 py-1">
            {!isCollapsed ? "Danh Mục" : "Menu"}
          </div>

          {NAV_ITEMS.map((item) => {
            const isActive =
              item.id === "linh_vat" ? isChatOpen : currentScreen === item.id;
            const isShaking = item.id === "gui_ky_uc" && isShakingGuiKyUc;
            const IconComponent = item.icon;
            return (
              <Tooltip
                key={item.id}
                title={item.label}
                content={
                  isShaking
                    ? "✨ Bạn vừa hoàn thành một bộ trang phục mới! Bấm vào đây để xem Gùi Ký Ức."
                    : item.tooltip
                }
                position="right"
                disabled={!isCollapsed}
                asBlock
              >
                <button
                  type="button"
                  onClick={() => handleSelectNav(item.id)}
                  className={`vpr-nav-row ${isActive ? "vpr-nav-row--active" : ""} ${
                    isShaking ? "vpr-nav-shake-btn ring-2 ring-amber-400/80" : ""
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                      isShaking
                        ? "bg-gradient-to-br from-amber-500 to-emerald-600 text-white shadow-md ring-2 ring-amber-300 animate-pulse"
                        : isActive
                        ? isLight
                          ? "bg-gradient-to-br from-[#059669] to-[#0D9488] text-white shadow-sm ring-1 ring-emerald-400/50"
                          : "bg-gradient-to-br from-[#0284C7] to-[#10B981] text-white shadow-md ring-1 ring-sky-400/50"
                        : "bg-[var(--nen-the-phu)] text-[var(--nen-toi)] group-hover:text-emerald-600"
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                  </span>

                  {!isCollapsed && (
                    <span className={`text-xs leading-tight flex-1 text-left ${isShaking ? "font-bold text-amber-800 dark:text-amber-300" : "font-semibold truncate"}`}>
                      {item.label}
                    </span>
                  )}

                  {isShaking && !isCollapsed && (
                    <span className="vpr-shake-badge text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-emerald-500 text-white shadow-xs ml-auto flex items-center gap-0.5">
                      <span>✦</span>
                      <span>Mới!</span>
                    </span>
                  )}

                  {!isShaking && isActive && !isCollapsed && (
                    <span
                      className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-sky-400 shadow-[0_0_8px_rgba(16,185,129,0.8)] dark:shadow-[0_0_8px_rgba(56,189,248,0.8)] animate-pulse ml-auto"
                      aria-hidden="true"
                    />
                  )}
                </button>
              </Tooltip>
            );
          })}

          {/* CÔNG CỤ TRỢ THỦ CÒ EM */}
          <div className="pt-3 mt-2 border-t border-[var(--sidebar-border)]">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--tro-tram)] px-2 py-1">
              {!isCollapsed ? "Trợ Thủ" : "Khác"}
            </div>

            {/* Trò chuyện cùng Cò Em */}
            <Tooltip
              title="Hỏi Cò Em"
              content="Trò chuyện cùng Cò Em về di sản văn hóa"
              position="right"
              disabled={!isCollapsed}
              asBlock
            >
              <button
                type="button"
                onClick={onToggleChat}
                className={`vpr-nav-row ${isChatOpen ? "vpr-nav-row--active" : ""}`}
              >
                <span
                  className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${
                    isChatOpen
                      ? isLight
                        ? "bg-gradient-to-br from-[#059669] to-[#0D9488] text-white shadow-sm ring-1 ring-emerald-400/50"
                        : "bg-gradient-to-br from-[#0284C7] to-[#10B981] text-white shadow-md ring-1 ring-sky-400/50"
                      : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
                  }`}
                >
                  <Feather className="w-4 h-4" />
                </span>
                {!isCollapsed && (
                  <span className="text-xs font-semibold truncate flex-1 text-left">
                    Hỏi Cò Em
                  </span>
                )}
                {isChatOpen && !isCollapsed && (
                  <span
                    className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-sky-400 shadow-[0_0_8px_rgba(16,185,129,0.8)] dark:shadow-[0_0_8px_rgba(56,189,248,0.8)] animate-pulse ml-auto"
                    aria-hidden="true"
                  />
                )}
              </button>
            </Tooltip>

            {/* Cài đặt trải nghiệm */}
            <Tooltip
              title="Cài đặt"
              content="Tùy chỉnh âm thanh, cỡ chữ và bầu trời"
              position="right"
              disabled={!isCollapsed}
              asBlock
            >
              <button
                type="button"
                onClick={onOpenTraiNghiem}
                className="vpr-nav-row"
              >
                <span className="w-7 h-7 rounded-lg bg-[var(--nen-the-phu)] text-[var(--tro-tram)] flex items-center justify-center flex-shrink-0">
                  <Sliders className="w-4 h-4" />
                </span>
                {!isCollapsed && (
                  <span className="text-xs font-semibold truncate flex-1 text-left">
                    Cài đặt
                  </span>
                )}
                {hasActiveTraiNghiem && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.7)] ml-auto" />
                )}
              </button>
            </Tooltip>
          </div>
        </div>

        {/* FOOTER: HỒ SƠ NGƯỜI DÙNG */}
        <div className="p-2.5 border-t border-[var(--sidebar-border)] bg-[var(--nen-the-phu)]">
          <Tooltip
            title="Hồ Sơ Của Bạn"
            content={`Đang dùng hồ sơ "${activeHoSo.tenHienThi}". Nhấp để đổi hồ sơ.`}
            position="right"
            asBlock
          >
            <button
              type="button"
              onClick={onOpenChaoBan}
              className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-[var(--nen-the)] text-left transition-colors border border-[var(--vien-the)]"
            >
              <div className="w-8 h-8 rounded-lg bg-[var(--xanh-mint)] text-[var(--xanh-chinh)] flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4" />
              </div>
              {!isCollapsed && (
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-xs font-bold text-[var(--nen-toi)] truncate">
                    {activeHoSo.tenHienThi}
                  </span>
                  <span className="text-[10px] text-[var(--tro-tram)] font-medium">
                    Đổi hồ sơ »
                  </span>
                </div>
              )}
            </button>
          </Tooltip>
        </div>
      </aside>
    </>
  );
}
