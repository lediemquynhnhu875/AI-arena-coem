/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * BỘ GÁC CỔNG VĂN HÓA & CẢNH BÁO LỆCH CHUẨN (CULTURAL GUARDIAN & WARNING)
 * Đảm bảo thông tin văn hóa được thể hiện phù hợp, cảnh báo những cách kết hợp
 * có thể làm sai lệch đặc trưng văn hóa và gợi ý cách Remix văn minh.
 */

import React from "react";
import { danhGiaVanHoaGenZ, CanhBaoVanHoa } from "../data/genzRemixData";
import { ShieldCheck, AlertTriangle, Sparkles, BookOpen } from "lucide-react";
import { openGiuChuanVanHoa } from "../lib/giuChuan";
import Tooltip from "./Tooltip";

interface CulturalWarningCardProps {
  trangPhucId: string;
  mauId: string;
  phuKienIds: string[];
  giayId: string;
  phongCachId: string;
  className?: string;
}

export default function CulturalWarningCard({
  trangPhucId,
  mauId,
  phuKienIds,
  giayId,
  phongCachId,
  className = "",
}: CulturalWarningCardProps) {
  const warning = danhGiaVanHoaGenZ(trangPhucId, mauId, phuKienIds, giayId, phongCachId);

  const isWarning = warning.mucDo === "can_can_nhac";
  const isRemix = warning.mucDo === "remix_van_minh";

  return (
    <div
      className={`cultural-warning-card p-4 rounded-2xl border transition-all ${
        isWarning
          ? "bg-amber-50/90 dark:bg-amber-950/40 border-amber-400 dark:border-amber-600 shadow-sm"
          : isRemix
          ? "bg-teal-50/80 dark:bg-teal-950/30 border-teal-400 dark:border-teal-700 shadow-xs"
          : "bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700 shadow-xs"
      } ${className}`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <span
            className={`p-1.5 rounded-xl ${
              isWarning
                ? "bg-amber-200 text-amber-900 dark:bg-amber-800 dark:text-amber-100"
                : isRemix
                ? "bg-teal-200 text-teal-900 dark:bg-teal-800 dark:text-teal-100"
                : "bg-emerald-200 text-emerald-900 dark:bg-emerald-800 dark:text-emerald-100"
            }`}
          >
            {isWarning ? (
              <AlertTriangle className="w-4 h-4" />
            ) : isRemix ? (
              <Sparkles className="w-4 h-4" />
            ) : (
              <ShieldCheck className="w-4 h-4" />
            )}
          </span>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white m-0">
              {warning.tieuDe}
            </h4>
            <span className="text-[10px] uppercase tracking-wider font-semibold opacity-75">
              {isWarning
                ? "Lưu ý giữ chuẩn cổ phong"
                : isRemix
                ? "Phong cách giao thoa đương đại"
                : "Bảo tồn giá trị nguyên bản"}
            </span>
          </div>
        </div>

        <Tooltip
          title="Tư liệu khảo cứu"
          content="Đọc thêm về các quy chuẩn di sản và nguồn gốc phục dựng trang phục."
          position="left"
        >
          <button
            type="button"
            onClick={() => openGiuChuanVanHoa()}
            className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 hover:underline cursor-pointer bg-transparent border-0 p-0"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Khảo cứu</span>
          </button>
        </Tooltip>
      </div>

      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mb-2.5">
        {warning.noiDung}
      </p>

      <div className="pt-2 border-t border-black/10 dark:border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
        <div>
          <span className="font-bold text-slate-800 dark:text-slate-200">
            Nguyên tắc cốt lõi:{" "}
          </span>
          <span className="text-slate-600 dark:text-slate-400">
            {warning.nguyenTacCotLoi}
          </span>
        </div>
        <div>
          <span className="font-bold text-emerald-800 dark:text-emerald-300">
            Gợi ý hoàn thiện:{" "}
          </span>
          <span className="text-slate-600 dark:text-slate-400">
            {warning.goiYKhacPhuc}
          </span>
        </div>
      </div>
    </div>
  );
}
