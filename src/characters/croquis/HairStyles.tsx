/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * BỘ SƯU TẬP KIỂU TÓC CROQUIS_PROJECT (AUTHENTIC CROQUIS HAIR STYLES)
 * Định nghĩa chuẩn xác các kiểu tóc vector từ thư mục croquis/options/hair:
 * 1. low_bun: Búi thấp thanh lịch (Chuẩn mẫu)
 * 2. long_loose / dai_xoa: Tóc dài buông xõa (Suối tóc sau lưng + lọn tóc trước ngực)
 * 3. high_bun / bui_cao: Búi tóc đài các vấn cao cài trâm ngọc
 * 4. short_bob / ngan: Tóc ngắn tân thời ngang cằm
 * 5. short_crop: Tóc cắt ngắn nam tính
 * 6. side_part: Tóc rẽ ngôi nam thanh lịch
 * 7. silver / bac_bui: Tóc hoa râm búi gáy phúc hậu
 */

import React from "react";
import { HuongNhin } from "../types";

export interface HairStyleProps {
  styleId: string;
  view: HuongNhin;
  hairColor?: string;
  isMale?: boolean;
  bodyType?: "adult" | "child" | "elderly";
}

export function CroquisBehindHair({
  styleId,
  hairColor = "#2b2420",
  isMale = false,
  bodyType = "adult",
}: {
  styleId: string;
  hairColor?: string;
  isMale?: boolean;
  bodyType?: "adult" | "child" | "elderly";
}) {
  // Chỉ những kiểu tóc buông xõa dài mới có phần tóc rủ sau lưng
  if (styleId !== "long_loose" && styleId !== "dai_xoa") {
    return null;
  }

  return (
    <g id="croquis-hair-behind" className={`croquis-hair-layer hair-${bodyType}`}>
      <path
        d="M-27 70 C-36 120 -38 190 -32 258 C-18 266 18 266 32 258 C38 190 36 120 27 70 Z"
        fill="var(--hair, #2b2420)"
        stroke="#000000"
        strokeOpacity="0.35"
        strokeWidth="0.5"
      />
    </g>
  );
}

export function CroquisHairRenderer({
  styleId,
  view,
  hairColor = "#2b2420",
  isMale = false,
  bodyType = "adult",
}: HairStyleProps) {
  const isBack = view === "sau";
  const normalizedId =
    bodyType === "elderly" && (!styleId || styleId === "bui_thap" || styleId === "low_bun")
      ? "silver"
      : styleId === "dai_xoa"
      ? "long_loose"
      : styleId === "ngan"
      ? (isMale ? "side_part" : "short_bob")
      : styleId === "bui_cao"
      ? "high_bun"
      : styleId === "bac_bui"
      ? "silver"
      : isMale && (!styleId || styleId === "low_bun" || styleId === "bui_thap")
      ? "side_part"
      : styleId || "low_bun";

  return (
    <g id={`croquis-hair-${normalizedId}-${view}`} className={`croquis-hair-front-layer hair-${bodyType}`}>
      {/* ============================================================== */}
      {/* 1. BÚI THẤP THANH LỊCH (LOW BUN - CHUẨN MẪU)                    */}
      {/* ============================================================== */}
      {(normalizedId === "low_bun" || normalizedId === "bui_thap") && (
        !isBack ? (
          <g id="hair-low-bun-front">
            {/* Mũ tóc trước rẽ ngôi giữa ôm trán */}
            <path
              d="M-26.5 92 C-29 56 -12 47 0 47 C12 47 29 56 26.5 92 C24 74 14 62 0 61 C-14 62 -24 74 -26.5 92 Z"
              fill="var(--hair, #2b2420)"
              stroke="#000000"
              strokeOpacity="0.35"
              strokeWidth="0.5"
              strokeLinejoin="round"
            />
            {/* Sợi tóc mai & lọn tóc ánh sáng */}
            <path d="M0 49 C-9 52 -17 60 -21 74" fill="none" stroke="#ffffff" strokeWidth="0.7" opacity="0.28" strokeLinecap="round" />
            <path d="M0 49 C9 52 17 60 21 74" fill="none" stroke="#ffffff" strokeWidth="0.7" opacity="0.28" strokeLinecap="round" />
          </g>
        ) : (
          <g id="hair-low-bun-back">
            {/* Mũ tóc sau */}
            <path
              d="M-26.5 90 C-26.5 62 -14 49 0 49 C14 49 26.5 62 26.5 90 C26.5 108 19 121 0 124 C-19 121 -26.5 108 -26.5 90 Z"
              fill="var(--hair, #2b2420)"
              stroke="#000000"
              strokeOpacity="0.35"
              strokeWidth="0.5"
              strokeLinejoin="round"
            />
            <path d="M0 50 C-1 70 -1 95 0 120" fill="none" stroke="#ffffff" strokeWidth="0.6" opacity="0.25" strokeLinecap="round" />
            <path d="M-12 58 C-18 78 -17 100 -11 116" fill="none" stroke="#ffffff" strokeWidth="0.7" opacity="0.25" strokeLinecap="round" />
            <path d="M12 58 C18 78 17 100 11 116" fill="none" stroke="#ffffff" strokeWidth="0.7" opacity="0.25" strokeLinecap="round" />
            {/* Búi xoắn ốc thấp ở gáy */}
            <path
              d="M-12.5 110 C-12.5 93.1 12.5 93.1 12.5 110 C12.5 125.0 -12.5 125.0 -12.5 110 Z"
              fill="var(--hair, #2b2420)"
              stroke="#000000"
              strokeOpacity="0.35"
              strokeWidth="0.5"
              strokeLinejoin="round"
            />
            <path d="M-7.5 106 C-2.5 101 7.5 104 8.7 110" fill="none" stroke="#ffffff" strokeWidth="0.7" opacity="0.28" strokeLinecap="round" />
            <path d="M-8.7 112 C-3.7 118 5.0 118 8.7 113" fill="none" stroke="#ffffff" strokeWidth="0.7" opacity="0.28" strokeLinecap="round" />
          </g>
        )
      )}

      {/* ============================================================== */}
      {/* 2. TÓC DÀI BUÔNG XÕA (LONG LOOSE)                               */}
      {/* ============================================================== */}
      {normalizedId === "long_loose" && (
        !isBack ? (
          <g id="hair-long-loose-front">
            <path
              d="M-26.5 92 C-29 56 -12 47 0 47 C12 47 29 56 26.5 92 C24 74 14 62 0 61 C-14 62 -24 74 -26.5 92 Z"
              fill="var(--hair, #2b2420)"
              stroke="#000000"
              strokeOpacity="0.35"
              strokeWidth="0.5"
            />
            {/* 2 dải tóc mây buông trước ngực */}
            <path
              d="M-26.5 92 C-31 130 -37 190 -35 244 C-31 252 -23 250 -21 240 C-19 190 -22 135 -23.5 100 Z"
              fill="var(--hair, #2b2420)"
              stroke="#000000"
              strokeOpacity="0.3"
              strokeWidth="0.5"
            />
            <path
              d="M26.5 92 C31 130 37 190 35 244 C31 252 23 250 21 240 C19 190 22 135 23.5 100 Z"
              fill="var(--hair, #2b2420)"
              stroke="#000000"
              strokeOpacity="0.3"
              strokeWidth="0.5"
            />
            <path d="M-31 140 C-34 180 -33 215 -31 240" fill="none" stroke="#ffffff" strokeWidth="0.7" opacity="0.25" strokeLinecap="round" />
            <path d="M31 140 C34 180 33 215 31 240" fill="none" stroke="#ffffff" strokeWidth="0.7" opacity="0.25" strokeLinecap="round" />
          </g>
        ) : (
          <g id="hair-long-loose-back">
            <path
              d="M-26.5 90 C-26.5 62 -14 49 0 49 C14 49 26.5 62 26.5 90 C26.5 108 19 121 0 124 C-19 121 -26.5 108 -26.5 90 Z"
              fill="var(--hair, #2b2420)"
              stroke="#000000"
              strokeOpacity="0.35"
              strokeWidth="0.5"
            />
            {/* Suối tóc buông dài sau lưng qua eo */}
            <path
              d="M-27 72 C-37 130 -39 205 -33 268 C-18 277 18 277 33 268 C39 205 37 130 27 72 Z"
              fill="var(--hair, #2b2420)"
              stroke="#000000"
              strokeOpacity="0.35"
              strokeWidth="0.5"
            />
            <path d="M-14 64 C-16.5 130 -16.8 205 -14.7 268" fill="none" stroke="#ffffff" strokeWidth="0.6" opacity="0.2" strokeLinecap="round" />
            <path d="M0 64 C0 130 0 205 0 268" fill="none" stroke="#ffffff" strokeWidth="0.6" opacity="0.25" strokeLinecap="round" />
            <path d="M14 64 C16.5 130 16.8 205 14.7 268" fill="none" stroke="#ffffff" strokeWidth="0.6" opacity="0.2" strokeLinecap="round" />
          </g>
        )
      )}

      {/* ============================================================== */}
      {/* 3. TÓC BÚI CAO ĐÀI CÁC (HIGH BUN)                              */}
      {/* ============================================================== */}
      {normalizedId === "high_bun" && (
        !isBack ? (
          <g id="hair-high-bun-front">
            {/* Búi tóc vấn cao tròn trịa trên đỉnh đầu */}
            <ellipse cx="0" cy="42" rx="14" ry="12" fill="var(--hair, #2b2420)" stroke="#000000" strokeOpacity="0.35" strokeWidth="0.5" />
            <path d="M-8 40 Q0 34 8 40" fill="none" stroke="#ffffff" strokeWidth="0.8" opacity="0.3" strokeLinecap="round" />
            {/* Trâm ngọc cài búi cao */}
            <line x1="-16" y1="36" x2="16" y2="44" stroke="#10b981" strokeWidth="2.2" strokeLinecap="round" />
            <circle cx="16" cy="44" r="2.8" fill="#fbbf24" stroke="#d97706" strokeWidth="0.5" />
            {/* Vòm tóc trước ôm trán */}
            <path
              d="M-26.5 92 C-29 56 -12 47 0 47 C12 47 29 56 26.5 92 C24 74 14 62 0 61 C-14 62 -24 74 -26.5 92 Z"
              fill="var(--hair, #2b2420)"
              stroke="#000000"
              strokeOpacity="0.35"
              strokeWidth="0.5"
            />
            <path d="M0 49 C-9 52 -17 60 -21 74" fill="none" stroke="#ffffff" strokeWidth="0.7" opacity="0.28" strokeLinecap="round" />
            <path d="M0 49 C9 52 17 60 21 74" fill="none" stroke="#ffffff" strokeWidth="0.7" opacity="0.28" strokeLinecap="round" />
          </g>
        ) : (
          <g id="hair-high-bun-back">
            <ellipse cx="0" cy="42" rx="14" ry="12" fill="var(--hair, #2b2420)" stroke="#000000" strokeOpacity="0.35" strokeWidth="0.5" />
            <line x1="-16" y1="36" x2="16" y2="44" stroke="#10b981" strokeWidth="2.2" strokeLinecap="round" />
            <path
              d="M-26.5 90 C-26.5 62 -14 49 0 49 C14 49 26.5 62 26.5 90 C26.5 108 19 121 0 124 C-19 121 -26.5 108 -26.5 90 Z"
              fill="var(--hair, #2b2420)"
              stroke="#000000"
              strokeOpacity="0.35"
              strokeWidth="0.5"
            />
            <path d="M0 50 C-1 70 -1 95 0 120" fill="none" stroke="#ffffff" strokeWidth="0.6" opacity="0.25" strokeLinecap="round" />
          </g>
        )
      )}

      {/* ============================================================== */}
      {/* 4. TÓC NGẮN TÂN THỜI (SHORT BOB)                               */}
      {/* ============================================================== */}
      {normalizedId === "short_bob" && (
        !isBack ? (
          <g id="hair-short-bob-front">
            <path
              d="M-27.5 104 C-31 60 -13 45 0 45 C13 45 31 60 27.5 104 C27 112 26 120 22 124 C21 106 20 90 17 80 C10 70 0 66 -8 68 C-14 78 -20 92 -22 124 C-26 120 -27 112 -27.5 104 Z"
              fill="var(--hair, #2b2420)"
              stroke="#000000"
              strokeOpacity="0.35"
              strokeWidth="0.5"
            />
            <path d="M-6 50 C-14 60 -19 78 -20 100" fill="none" stroke="#ffffff" strokeWidth="0.7" opacity="0.28" strokeLinecap="round" />
            <path d="M8 50 C16 62 20 80 21 102" fill="none" stroke="#ffffff" strokeWidth="0.7" opacity="0.28" strokeLinecap="round" />
          </g>
        ) : (
          <g id="hair-short-bob-back">
            <path
              d="M-28 90 C-30 56 -14 46 0 46 C14 46 30 56 28 90 C30 108 29 122 23 129 C10 134 -10 134 -23 129 C-29 122 -30 108 -28 90 Z"
              fill="var(--hair, #2b2420)"
              stroke="#000000"
              strokeOpacity="0.35"
              strokeWidth="0.5"
            />
            <path d="M0 48 C-1 80 -1 110 0 130" fill="none" stroke="#ffffff" strokeWidth="0.6" opacity="0.25" strokeLinecap="round" />
          </g>
        )
      )}

      {/* ============================================================== */}
      {/* 5. TÓC RẼ NGÔI (SIDE PART - NAM CHUẨN)                         */}
      {/* ============================================================== */}
      {(normalizedId === "side_part" || normalizedId === "short_crop") && (
        !isBack ? (
          <g id="hair-side-part-front">
            <path
              d="M-26.5 92 C-29 56 -12 44 2 44 C16 44 29 56 26.5 92 C24 80 22 72 17 66 C10 61 -2 62 -10 66 C-16 70 -20 74 -22 80 C-23 84 -25 88 -26.5 92 Z"
              fill="var(--hair, #2b2420)"
              stroke="#000000"
              strokeOpacity="0.35"
              strokeWidth="0.5"
            />
            <path d="M-12 48 C-14 56 -12 62 -6 65" fill="none" stroke="#ffffff" strokeWidth="0.8" opacity="0.28" strokeLinecap="round" />
            <path d="M2 45 C8 50 16 58 22 74" fill="none" stroke="#ffffff" strokeWidth="0.7" opacity="0.28" strokeLinecap="round" />
          </g>
        ) : (
          <g id="hair-side-part-back">
            <path
              d="M-26.5 90 C-27 58 -14 45 1 45 C15 45 27 58 26.5 90 C26.5 99 22 105 16 108 C8 104 -8 104 -16 108 C-22 105 -26.5 99 -26.5 90 Z"
              fill="var(--hair, #2b2420)"
              stroke="#000000"
              strokeOpacity="0.35"
              strokeWidth="0.5"
            />
            <path d="M1 47 C0 70 0 92 1 105" fill="none" stroke="#ffffff" strokeWidth="0.6" opacity="0.25" strokeLinecap="round" />
          </g>
        )
      )}

      {/* ============================================================== */}
      {/* 6. TÓC HOA RÂM (SILVER BUN - BÀ CỤ PHÚC HẬU)                   */}
      {/* ============================================================== */}
      {normalizedId === "silver" && (
        !isBack ? (
          <g id="hair-silver-front">
            <path
              d="M-26.5 92 C-29 56 -12 47 0 47 C12 47 29 56 26.5 92 C24 74 14 62 0 61 C-14 62 -24 74 -26.5 92 Z"
              fill="#94a3b8"
              stroke="#000000"
              strokeOpacity="0.35"
              strokeWidth="0.5"
            />
            <path d="M0 49 C-9 52 -17 60 -21 74" fill="none" stroke="#f1f5f9" strokeWidth="0.9" opacity="0.45" strokeLinecap="round" />
            <path d="M0 49 C9 52 17 60 21 74" fill="none" stroke="#f1f5f9" strokeWidth="0.9" opacity="0.45" strokeLinecap="round" />
          </g>
        ) : (
          <g id="hair-silver-back">
            <path
              d="M-26.5 90 C-26.5 62 -14 49 0 49 C14 49 26.5 62 26.5 90 C26.5 108 19 121 0 124 C-19 121 -26.5 108 -26.5 90 Z"
              fill="#94a3b8"
              stroke="#000000"
              strokeOpacity="0.35"
              strokeWidth="0.5"
            />
            <path
              d="M-12.5 110 C-12.5 93.1 12.5 93.1 12.5 110 C12.5 125.0 -12.5 125.0 -12.5 110 Z"
              fill="#cbd5e1"
              stroke="#000000"
              strokeOpacity="0.35"
              strokeWidth="0.5"
            />
          </g>
        )
      )}
    </g>
  );
}
