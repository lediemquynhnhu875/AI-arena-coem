/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * THẺ GỢI Ý PHỐI ĐỒ THEO GIỚI TÍNH (GENDER STYLING CARD)
 * Tinh gọn, trực quan, không nhiều chữ
 */

import React from "react";

interface GenderFilterCardProps {
  currentGender: "nam" | "nu";
  onSelectGender?: (gender: "nam" | "nu") => void;
  className?: string;
}

export default function GenderFilterCard({
  currentGender,
  onSelectGender,
  className = "",
}: GenderFilterCardProps) {
  const options = [
    {
      id: "nu" as const,
      label: "Nữ",
      icon: "♀",
      sub: "Duyên dáng · Mềm mại",
      phucTrang: "Áo dài, Tứ thân, Yếm lụa",
    },
    {
      id: "nam" as const,
      label: "Nam",
      icon: "♂",
      sub: "Đĩnh đạc · Vững chãi",
      phucTrang: "Áo ngũ thân, Áo tấc, Khăn đóng",
    },
  ];

  return (
    <div className={`gender-filter-card space-y-2.5 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-[var(--nen-toi)] uppercase tracking-wider">
          Định hướng phối đồ
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {options.map((opt) => {
          const isSelected = currentGender === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onSelectGender?.(opt.id)}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col text-left gap-1.5 ${
                isSelected
                  ? "border-[var(--xanh-la)] bg-[var(--xanh-nhe)] ring-1 ring-[var(--xanh-la)] shadow-xs"
                  : "border-[var(--vien-the)] bg-[var(--nen-the)] hover:border-[var(--xanh-la)] hover:bg-[var(--xanh-nhe)]/30"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-sm font-bold text-[var(--nen-toi)] flex items-center gap-1.5">
                  <span className="text-base">{opt.icon}</span>
                  <span>{opt.label}</span>
                </span>
                {isSelected && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--xanh-chinh)] text-white font-semibold">
                    Đang chọn
                  </span>
                )}
              </div>
              <div className="text-[11px] text-[var(--chu-mo)] font-medium">
                {opt.sub}
              </div>
              <div className="text-[10.5px] text-[var(--xanh-chinh)] font-medium truncate w-full pt-1 border-t border-[var(--vien-the)]">
                {opt.phucTrang}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
