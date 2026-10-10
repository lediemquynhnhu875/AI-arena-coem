/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * BẢNG KHOÁC THỬ TRANG PHỤC VÀ LƯỚI GIÓNG CROQUIS 9 ĐẦU (GARMENT QUICK TESTER)
 * - Tối ưu gọn gàng để nhường toàn bộ không gian cho người mẫu to rõ
 * - Đồng nhất font chữ font-sans
 */

import React from "react";
import { Ruler } from "lucide-react";

export interface GarmentQuickTesterProps {
  previewGarment: "yem" | "aodai" | "ngu_than" | "ba_ba" | "tu_than" | null;
  onPreviewGarmentChange: (garment: "yem" | "aodai" | "ngu_than" | "ba_ba" | "tu_than" | null) => void;
  fitStatusText?: string;
  badgeLabel?: string;
}

export function GarmentQuickTester({
  previewGarment,
  onPreviewGarmentChange,
  fitStatusText,
  badgeLabel,
}: GarmentQuickTesterProps) {
  const garmentOptions = [
    { id: "aodai" as const, label: "Áo Dài", activeClass: "bg-sky-700 text-white border-sky-800 ring-1 ring-sky-700" },
    { id: "ngu_than" as const, label: "Ngũ Thân", activeClass: "bg-rose-800 text-white border-rose-900 ring-1 ring-rose-800" },
    { id: "ba_ba" as const, label: "Bà Ba", activeClass: "bg-emerald-700 text-white border-emerald-800 ring-1 ring-emerald-700" },
    { id: "yem" as const, label: "Yếm Lụa", activeClass: "bg-amber-700 text-white border-amber-800 ring-1 ring-amber-700" },
  ];

  return (
    <div className="w-full pt-1.5 border-t border-amber-200/50 dark:border-amber-700/30 flex flex-col gap-1.5 z-10 bg-white/70 dark:bg-slate-900/60 rounded-xl p-2 font-sans select-none">
      {/* Tiêu đề thanh khoác thử trang phục */}
      <div className="flex items-center justify-between gap-1.5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-amber-950 dark:text-amber-200 font-sans">
          Khoác thử trang phục truyền thống
        </span>
        <span className="text-[10px] text-amber-800/70 dark:text-amber-400/60 font-sans">
          {previewGarment ? "Bấm lại để xem dáng người mẫu mộc" : "Đang hiển thị dáng người mẫu mộc"}
        </span>
      </div>

      {/* Các nút khoác thử trang phục gọn gàng */}
      <div className="grid grid-cols-4 gap-1.5">
        {garmentOptions.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onPreviewGarmentChange(previewGarment === item.id ? null : item.id)}
            className={`h-7.5 px-1.5 rounded-lg text-[11px] font-bold transition-all border cursor-pointer whitespace-nowrap flex items-center justify-center font-sans ${
              previewGarment === item.id
                ? `${item.activeClass} shadow-xs`
                : "bg-white dark:bg-slate-800 text-amber-950 dark:text-amber-200 border-amber-200 dark:border-slate-700 hover:bg-amber-50"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* CHỈ BÁO HIỆU CHUẨN TỶ LỆ TRANG PHỤC THEO THỂ TRẠNG (DYNAMIC FIT LOGIC CHECK) */}
      {previewGarment && fitStatusText && (
        <div className="flex items-center gap-1.5 text-[10px] text-emerald-800 dark:text-emerald-300 bg-emerald-50/90 dark:bg-emerald-950/50 px-2 py-1 rounded-md border border-emerald-500/25 mt-0.5 animate-fadeIn">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span className="font-semibold text-emerald-900 dark:text-emerald-200 shrink-0">
            {badgeLabel || "Tự động co giãn"}:
          </span>
          <span className="truncate">{fitStatusText}</span>
        </div>
      )}
    </div>
  );
}

export default GarmentQuickTester;
