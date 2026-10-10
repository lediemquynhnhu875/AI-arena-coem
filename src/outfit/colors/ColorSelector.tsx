/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * BỘ CHỌN MÀU SẮC TRỰC QUAN (COLOR SELECTOR)
 */

import React from "react";
import { COLOR_PALETTE } from "./colorCatalog";

interface ColorSelectorProps {
  selectedColorId: string;
  onSelectColor: (id: string) => void;
  hoveredColorId?: string | null;
  onHoverColor?: (id: string | null) => void;
  className?: string;
}

export default function ColorSelector({
  selectedColorId,
  onSelectColor,
  hoveredColorId,
  onHoverColor,
  className = "",
}: ColorSelectorProps) {
  const activeColor = COLOR_PALETTE.find((c) => c.id === selectedColorId) ?? COLOR_PALETTE[0];
  const activeHover = hoveredColorId
    ? COLOR_PALETTE.find((c) => c.id === hoveredColorId) ?? null
    : null;
  const displayColor = activeHover ?? activeColor;

  return (
    <div className={`color-selector space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-[var(--nen-toi)] uppercase tracking-wider">
          Màu vải truyền thống
        </span>
        <span className="text-xs text-[var(--vang-chinh)] font-semibold">
          {displayColor.ten} {displayColor.nguHanh ? `(Hành ${displayColor.nguHanh})` : ""}
        </span>
      </div>

      {/* Dãy nút swatch tròn trực quan */}
      <div className="flex flex-wrap gap-2.5 items-center">
        {COLOR_PALETTE.map((c) => {
          const isSelected = selectedColorId === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => onSelectColor(c.id)}
              onMouseEnter={() => onHoverColor?.(c.id)}
              onMouseLeave={() => onHoverColor?.(null)}
              className={`relative w-9 h-9 rounded-full transition-transform cursor-pointer flex items-center justify-center border border-black/10 ${
                isSelected
                  ? "scale-110 ring-2 ring-[var(--vang-chinh)] ring-offset-2 ring-offset-[var(--nen-bright)] shadow-md"
                  : "hover:scale-105"
              }`}
              style={{ backgroundColor: c.hex }}
              title={`${c.ten}: ${c.yNghia}`}
            >
              {isSelected && (
                <span className="w-2.5 h-2.5 rounded-full bg-white shadow-sm ring-1 ring-black/20" />
              )}
            </button>
          );
        })}
      </div>

      {/* Khung mô tả ngắn gọn ý nghĩa màu */}
      <div className="p-2.5 rounded-lg border border-[var(--vien-the)] bg-[var(--nen-the-phu)] text-xs text-[var(--chu-mo)] leading-relaxed">
        <strong className="text-[var(--nen-toi)]">{displayColor.ten}:</strong>{" "}
        {displayColor.yNghia}
        {displayColor.dipMac && (
          <span className="block mt-1 text-[11px] text-[var(--xanh-chinh)] font-medium">
            ✦ Dịp mặc: {displayColor.dipMac}
          </span>
        )}
      </div>
    </div>
  );
}
