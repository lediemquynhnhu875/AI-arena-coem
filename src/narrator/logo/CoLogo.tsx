/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * LOGO CÒ EM — BIỂU TƯỢNG CÒ RẰN NAM BỘ DI SẢN (NARRATOR LOGO)
 */

import React, { useId } from "react";

export interface CoLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
  onClick?: () => void;
}

export default function CoLogo({
  size = "md",
  showText = true,
  className = "",
  onClick,
}: CoLogoProps) {
  const uid = useId().replace(/:/g, "");
  const id = (n: string) => `${n}-${uid}`;
  const iconSize = size === "sm" ? 38 : size === "md" ? 48 : 60;

  return (
    <div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={`co-logo-container inline-flex items-center gap-2.5 select-none ${
        onClick ? "cursor-pointer group" : ""
      } ${className}`}
      title="Cò Em — Việt Phục Remix"
    >
      <div className="relative inline-flex items-center justify-center flex-shrink-0">
        {/* Vòng hào quang mờ thanh lịch (ẩn ở dark theme) */}
        <div
          className="absolute -inset-1 rounded-full pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity dark:opacity-0"
          style={{
            background: "radial-gradient(circle, rgba(234, 179, 8, 0.35) 0%, rgba(202, 138, 4, 0.1) 60%, transparent 80%)",
          }}
        />

        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-300 group-hover:scale-105"
        >
          <defs>
            {/* Vòng vàng tơ tằm */}
            <linearGradient id={id("ringGrad")} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="50%" stopColor="#EAB308" />
              <stop offset="100%" stopColor="#CA8A04" />
            </linearGradient>

            {/* Khăn rằn caro */}
            <pattern id={id("logoKhan")} width="6" height="6" patternUnits="userSpaceOnUse">
              <rect width="6" height="6" fill="#FFFFFF" />
              <rect x="0" y="0" width="3" height="3" fill="#090D16" />
              <rect x="3" y="3" width="3" height="3" fill="#090D16" />
            </pattern>

            {/* Bộ lông trắng ngọc 3D */}
            <radialGradient id={id("coBody")} cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="65%" stopColor="#F7FAF5" />
              <stop offset="100%" stopColor="#DCE7E1" />
            </radialGradient>

            {/* Mỏ vàng */}
            <linearGradient id={id("coBeak")} x1="0%" y1="0%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="100%" stopColor="#CA8A04" />
            </linearGradient>

            {/* Nón lá mini */}
            <linearGradient id={id("hatGrad")} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FEF9C3" />
              <stop offset="60%" stopColor="#EAB308" />
              <stop offset="100%" stopColor="#B45309" />
            </linearGradient>
          </defs>

          {/* Vòng nền tròn bảo chứng di sản */}
          <circle cx="32" cy="32" r="28" fill="#FBFDF9" stroke="url(#ringGrad)" strokeWidth="1.6" />
          <circle cx="32" cy="32" r="25.5" stroke="#EAB308" strokeWidth="0.8" strokeDasharray="2.5 2" opacity="0.6" />

          {/* CHÚ CÒ EM THANH THOÁT */}
          {/* Thân & Cổ cò */}
          <path
            d="
              M 32 16
              C 38 16, 42 20, 42 26
              C 42 32, 38 36, 36 40
              C 42 42, 46 47, 46 52
              C 46 56, 38 58, 30 58
              C 22 58, 18 53, 18 47
              C 18 42, 24 37, 27 34
              C 25 30, 24 24, 26 20
              C 27 17, 29 16, 32 16
              Z
            "
            fill={`url(#${id("coBody")})`}
            stroke="#CBD5E1"
            strokeWidth="0.8"
          />

          {/* Cánh gập nhẹ */}
          <path
            d="M 27 38 C 34 37, 42 40, 43 46 C 44 50, 40 54, 32 55 C 26 55, 23 50, 24 45 C 24 41, 25 39, 27 38 Z"
            fill="#FFFFFF"
            stroke="#94A3B8"
            strokeWidth="0.8"
          />

          {/* Khăn rằn Nam Bộ caro buông cổ */}
          {/* Tà sau bay */}
          <path
            d="M 37 32 C 44 30, 52 34, 56 31 C 58 35, 50 38, 40 36 Z"
            fill={`url(#${id("logoKhan")})`}
            stroke="#090D16"
            strokeWidth="0.8"
          />
          {/* Khăn quấn cổ */}
          <ellipse cx="33" cy="32" rx="7" ry="3.5" fill={`url(#${id("logoKhan")})`} stroke="#090D16" strokeWidth="0.9" transform="rotate(4 33 32)" />
          {/* Nút thắt */}
          <circle cx="31" cy="33" r="2.2" fill="#FFFFFF" stroke="#090D16" strokeWidth="1" />
          <circle cx="31" cy="33" r="1.1" fill="#090D16" />
          {/* Tà trước ngắn */}
          <path
            d="M 30 35 C 29 39, 28 44, 31 47 C 32 46, 33 41, 33 36 Z"
            fill={`url(#${id("logoKhan")})`}
            stroke="#090D16"
            strokeWidth="0.8"
          />

          {/* Mỏ vàng thanh thoát */}
          <path d="M 38 23 C 48 24, 56 26, 60 27 C 52 29, 44 30, 37 28 Z" fill={`url(#${id("coBeak")})`} stroke="#B45309" strokeWidth="0.6" />

          {/* Mắt tròn long lanh */}
          <circle cx="33.5" cy="22" r="2.2" fill="#1A3022" />
          <circle cx="33" cy="21.2" r="0.8" fill="#FFFFFF" />

          {/* Nón lá mini trên đầu */}
          <path
            d="M 23 15 C 28 8, 32 4, 34 3 C 36 4, 40 8, 45 15 C 38 17, 30 17, 23 15 Z"
            fill={`url(#${id("hatGrad")})`}
            stroke="#B45309"
            strokeWidth="0.8"
          />
          <ellipse cx="34" cy="15" rx="10.5" ry="2.2" fill="none" stroke="#D97706" strokeWidth="0.7" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <span
            style={{ fontFamily: "var(--font-tieu-de, serif)" }}
            className="text-lg sm:text-xl font-bold tracking-wider text-[var(--nen-toi)] group-hover:text-[var(--vang-chinh)] transition-colors"
          >
            CÒ EM
          </span>
          <span className="text-[10px] font-medium tracking-widest uppercase text-[var(--xanh-chinh)] mt-0.5">
            Việt Phục Remix
          </span>
        </div>
      )}
    </div>
  );
}
