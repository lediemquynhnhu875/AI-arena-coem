/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * NatureBackground — Nền Thiên Nhiên Toàn Bộ Ứng Dụng (Full Web Background)
 * - Tràn viền 100vw, 100vh (fixed inset-0) cho toàn bộ trang web
 * - Lũy tre xanh hai bên bám sát mép màn hình, đồi núi & dòng nước mượt mà
 * - Tự động đồng bộ chuẩn xác 100% với chế độ Sáng / Tối (Theme Light / Dark)
 * - Tối ưu mã nguồn gọn nhẹ, hiệu năng cao, thích ứng cả chế độ Sáng & Tối
 */

import React, { useState, useEffect } from "react";
import { VungId } from "../../data/vung";
import { ThoiTietLoai } from "../../lib/thoitiet";
import { useSkySettings } from "../../lib/caiDatSky";
import { layThemeHienTai, THEME_CHANGE_EVENT, ThemeMode } from "../../lib/theme";
import BotanicalBambooGrove from "./BotanicalBambooGrove";

export type DayNightPhase = "ngay" | "hoang_hon" | "dem" | "binh_minh";

interface NatureBackgroundProps {
  vungId?: VungId;
  thoiTiet?: ThoiTietLoai;
  manualPhase?: DayNightPhase | null;
  theme?: ThemeMode;
}

export default function NatureBackground({
  thoiTiet = "mat",
  manualPhase = null,
  theme,
}: NatureBackgroundProps) {
  const [settings] = useSkySettings();
  const [activeTheme, setActiveTheme] = useState<ThemeMode>(() => theme || layThemeHienTai());

  useEffect(() => {
    if (theme) {
      setActiveTheme(theme);
    }
  }, [theme]);

  useEffect(() => {
    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ theme: ThemeMode }>;
      if (customEvent.detail?.theme) {
        setActiveTheme(customEvent.detail.theme);
      }
    };
    window.addEventListener(THEME_CHANGE_EVENT, handleThemeChange);
    return () => window.removeEventListener(THEME_CHANGE_EVENT, handleThemeChange);
  }, []);

  // Xác định chế độ tối / đêm:
  // QUY TẮC BẮT BUỘC:
  // - Khi người dùng ở "Giao diện Sáng" (activeTheme === "light"): Luôn hiển thị ban ngày rạng rỡ (nắng ấm, đồi xanh, luỹ tre mạ non).
  //   Tuyệt đối không để giờ thực tế ban đêm biến giao diện sáng thành nền trời đêm đen kịt.
  // - Khi người dùng ở "Giao diện Tối" (activeTheme === "dark"): Hiển thị bầu trời đêm lung linh trăng sao.
  const isNight = activeTheme === "dark";
  const isReducedMotion = settings.giamChuyenDong;

  if (settings.tatBauTroi) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0"
      aria-hidden="true"
    >
      <style>{`
        .bamboo-sway-left {
          animation: ${isReducedMotion ? "none" : "bambooSwayL 20s ease-in-out infinite alternate"};
          transform-origin: bottom left;
        }
        .bamboo-sway-right {
          animation: ${isReducedMotion ? "none" : "bambooSwayR 20.5s ease-in-out infinite alternate"};
          transform-origin: bottom right;
        }
        @keyframes bambooSwayL {
          0% { transform: rotate(-0.02deg); }
          100% { transform: rotate(0.02deg); }
        }
        @keyframes bambooSwayR {
          0% { transform: rotate(0.02deg); }
          100% { transform: rotate(-0.02deg); }
        }
        .water-wave-pulse {
          animation: ${isReducedMotion ? "none" : "waterWave 4.2s ease-in-out infinite alternate"};
          transform-origin: center;
        }
        @keyframes waterWave {
          0% { opacity: 0.45; transform: scaleX(0.97); }
          100% { opacity: 0.85; transform: scaleX(1.03); }
        }
        .star-twinkle {
          animation: ${isReducedMotion ? "none" : "twinkle 3.2s ease-in-out infinite alternate"};
        }
        @keyframes twinkle {
          0% { opacity: 0.25; transform: scale(0.85); }
          100% { opacity: 0.95; transform: scale(1.15); }
        }
      `}</style>

      {/* 1. NỀN BẦU TRỜI: BÌNH MINH DỊU NHẸ, NẮNG MAI ÊM DỊU, KHÔNG CHÓI GẮT */}
      <div
        className="absolute inset-0 transition-colors duration-1000"
        style={{
          background: isNight
            ? "linear-gradient(180deg, #060D1A 0%, #0B192C 35%, #102641 70%, #173356 100%)"
            : "linear-gradient(180deg, #EDF4F9 0%, #F5F8FA 20%, #FFF8F0 45%, #FEEFD9 70%, #FCE8CE 85%, #F7D6B0 100%)",
        }}
      />

      {/* 2. THIÊN THỂ BAN ĐÊM (TRĂNG SAO KHI GIAO DIỆN TỐI) */}
      {isNight && (
        <>
          {/* Trăng khuyết lung linh ở góc trên bên phải */}
          <div className="absolute top-14 right-8 sm:top-16 sm:right-24 pointer-events-none">
            <div className="w-24 h-24 -ml-6 -mt-6 rounded-full blur-xl bg-sky-400/20" />
            <svg width="44" height="44" viewBox="0 0 32 32" className="drop-shadow-[0_0_10px_rgba(254,240,138,0.7)]">
              <path
                d="M16 2 A14 14 0 1 0 30 16 A12 12 0 0 1 16 2 Z"
                fill="#FEF08A"
              />
            </svg>
          </div>

          {/* Các vì sao lấp lánh rải rác */}
          {[
            { x: "12%", y: "15%", d: "0s" },
            { x: "24%", y: "26%", d: "0.8s" },
            { x: "38%", y: "12%", d: "1.6s" },
            { x: "52%", y: "22%", d: "0.4s" },
            { x: "65%", y: "16%", d: "2.1s" },
            { x: "82%", y: "28%", d: "1.2s" },
            { x: "92%", y: "10%", d: "1.9s" },
          ].map((s, i) => (
            <div
              key={i}
              className="star-twinkle absolute w-1.5 h-1.5 rounded-full bg-white/80 shadow-[0_0_4px_#fff]"
              style={{ left: s.x, top: s.y, animationDelay: s.d }}
            />
          ))}
        </>
      )}

      {/* 3. ĐỒI NÚI VÀ GÒ ĐẤT TRẢI RỘNG 100% CHIỀU NGANG MÀN HÌNH */}
      <div className="absolute bottom-0 left-0 right-0 h-48 sm:h-64 md:h-72">
        <svg
          viewBox="0 0 1440 260"
          preserveAspectRatio="none"
          className="w-full h-full block"
        >
          <defs>
            <linearGradient id="hillFarGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isNight ? "#122D3E" : "#8A9F8E"} stopOpacity="0.4" />
              <stop offset="100%" stopColor={isNight ? "#091722" : "#55735B"} stopOpacity="0.18" />
            </linearGradient>
            <linearGradient id="hillNearGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isNight ? "#113A30" : "#4A6E53"} stopOpacity="0.75" />
              <stop offset="100%" stopColor={isNight ? "#091C16" : "#2A4532"} stopOpacity="0.45" />
            </linearGradient>
            <linearGradient id="waterGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#F5BCA0" stopOpacity="0.04" />
              <stop offset="50%" stopColor="#F5BCA0" stopOpacity={isNight ? "0.5" : "0.35"} />
              <stop offset="100%" stopColor="#F5BCA0" stopOpacity="0.04" />
            </linearGradient>
          </defs>

          {/* Dãy đồi xa trập trùng mờ sương */}
          <path
            d="M 0 260 L 0 130 Q 360 80, 720 120 Q 1080 160, 1440 100 L 1440 260 Z"
            fill="url(#hillFarGrad)"
          />

          {/* Dòng nước lăn tăn gợn sóng ở giữa */}
          <ellipse
            cx="720"
            cy="195"
            rx="360"
            ry="14"
            fill="url(#waterGrad)"
            className="water-wave-pulse"
          />

          {/* Gò đất thoai thoải xanh mướt trải dài bờ cõi */}
          <path
            d="M 0 260 L 0 185 Q 400 150, 720 175 Q 1040 200, 1440 165 L 1440 260 Z"
            fill="url(#hillNearGrad)"
          />
        </svg>
      </div>

      {/* 4. LŨY TRE LÀNG BÊN TRÁI: CAO THÊM MỘT XÍU, NHIỀU CÂY HƠN 1 XÍU (THEO ĐÚNG YÊU CẦU) */}
      <div className="bamboo-sway-left absolute bottom-0 left-0 lg:left-[250px] w-[25vw] min-w-[220px] max-w-[400px] h-[83vh] sm:h-[87vh] md:h-[90vh] min-h-[600px] max-h-[880px] pointer-events-none transition-all duration-300">
        <BotanicalBambooGrove isNight={isNight} flipped={false} />
      </div>

      {/* 5. LŨY TRE LÀNG BÊN PHẢI: CAO THÊM MỘT XÍU, NHIỀU CÂY HƠN 1 XÍU (ĐỐI XỨNG HOÀN HẢO) */}
      <div className="bamboo-sway-right absolute bottom-0 right-0 w-[25vw] min-w-[220px] max-w-[400px] h-[83vh] sm:h-[87vh] md:h-[90vh] min-h-[600px] max-h-[880px] pointer-events-none transition-all duration-300">
        <BotanicalBambooGrove isNight={isNight} flipped={true} />
      </div>

      {/* 6. MƯA RƠI DỊU DÀNG NẾU THỜI TIẾT LÀ MƯA */}
      {thoiTiet === "mua" && !isReducedMotion && (
        <div className="absolute inset-0 pointer-events-none opacity-30">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 h-10 bg-sky-200 rounded-full"
              style={{
                left: `${(i * 8.5 + 4) % 100}%`,
                top: `${(i * 12) % 80}%`,
                transform: "rotate(15deg)",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
