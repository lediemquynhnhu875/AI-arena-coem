/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * BỘ KIỂM TRA SỰ HÀI HÒA CỦA MÀU SẮC (COLOR HARMONY & FIVE ELEMENTS CHECKER)
 * Phân tích bảng màu ngũ hành (Kim, Mộc, Thủy, Hỏa, Thổ), tương sinh tương khắc
 * và chấm điểm thẩm mỹ thời trang truyền thống kết hợp Gen Z.
 */

import React from "react";
import { kiemTraHaiHoaMauSac, MAU_NGU_HANH } from "../data/genzRemixData";
import { Palette, Sparkles, CheckCircle2, AlertCircle, Info } from "lucide-react";

interface ColorHarmonyCheckerProps {
  selectedColorId: string;
  selectedAccessoryColorId?: string;
  className?: string;
}

export default function ColorHarmonyChecker({
  selectedColorId,
  selectedAccessoryColorId,
  className = "",
}: ColorHarmonyCheckerProps) {
  const result = kiemTraHaiHoaMauSac(selectedColorId, selectedAccessoryColorId);
  const aoInfo = MAU_NGU_HANH[selectedColorId] || MAU_NGU_HANH["m_do"];

  return (
    <div
      className={`color-harmony-checker p-4 rounded-2xl bg-white dark:bg-slate-900 border border-amber-300/60 dark:border-amber-700/50 shadow-sm text-slate-800 dark:text-slate-100 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400">
            <Palette className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300 m-0">
              Kiểm Tra Sự Hài Hòa Của Màu Sắc
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 m-0">
              Ngũ Hành Cát Tường & Quy luật phối sắc Việt phục
            </p>
          </div>
        </div>

        {/* Điểm số */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-emerald-500 text-white font-mono font-bold text-xs shadow-xs">
          <span>{result.diemSo}</span>
          <span className="text-[10px] opacity-80">/ 100 điểm</span>
        </div>
      </div>

      {/* Thanh đo tiến trình điểm số */}
      <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-3.5 border border-slate-200 dark:border-slate-700">
        <div
          className="h-full bg-gradient-to-r from-amber-500 via-emerald-500 to-teal-500 transition-all duration-500 rounded-full"
          style={{ width: `${result.diemSo}%` }}
        />
      </div>

      {/* Thông tin 2 hành ngũ hành đối chiếu */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        {/* Màu áo chính */}
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-lg border border-black/15 shadow-inner flex-shrink-0"
            style={{ backgroundColor: aoInfo.hex }}
          />
          <div className="min-w-0 flex-1">
            <span className="text-[10px] text-slate-500 block">Màu nếp áo</span>
            <span className="text-xs font-bold truncate block">{aoInfo.tenMau}</span>
            <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-400">
              Hành: {aoInfo.hanh}
            </span>
          </div>
        </div>

        {/* Mối quan hệ */}
        <div className="p-2.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex flex-col justify-center">
          <span className="text-[10px] font-semibold text-amber-800 dark:text-amber-300">
            Quy luật ngũ hành:
          </span>
          <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
            {result.quanHeNguHanh}
          </span>
          <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">
            {result.nhan}
          </span>
        </div>
      </div>

      {/* Lời bình & Phân tích chuyên sâu */}
      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5 leading-relaxed">
        <p className="text-slate-700 dark:text-slate-300 m-0">
          📜 <strong>Luận giải:</strong> {result.phanTich}
        </p>
        <p className="text-emerald-800 dark:text-emerald-300 m-0 font-medium">
          ✨ <strong>Mẹo Gen Z:</strong> {result.loiKhuyenGenZ}
        </p>
      </div>
    </div>
  );
}
