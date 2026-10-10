/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * BỘ CHỌN SỰ KIỆN & NHU CẦU GEN Z (GEN Z EVENT & OCCASION SELECTOR)
 * Giúp học sinh, sinh viên chọn sự kiện, nhận diện nhu cầu cá nhân
 * và 1-chạm áp dụng combo phối đồ di sản chuẩn điệu.
 */

import React from "react";
import { SU_KIEN_GENZ, SuKienGenZ } from "../data/genzRemixData";
import { Sparkles, Check, ArrowRight, Compass, Info } from "lucide-react";
import Tooltip from "./Tooltip";

interface GenzEventSelectorProps {
  selectedEventId: string | null;
  onSelectEvent: (event: SuKienGenZ) => void;
  onApplyRecommendation: (event: SuKienGenZ) => void;
}

export default function GenzEventSelector({
  selectedEventId,
  onSelectEvent,
  onApplyRecommendation,
}: GenzEventSelectorProps) {
  const currentEvent = SU_KIEN_GENZ.find((e) => e.id === selectedEventId) || SU_KIEN_GENZ[0];

  return (
    <div className="genz-event-selector p-4 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-500/25 shadow-sm text-slate-800 dark:text-slate-100">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400">
            <Compass className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-300 m-0">
              Sự Kiện & Nhu Cầu Phối Đồ Gen Z
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 m-0">
              Chọn hoàn cảnh để nhận gợi ý phối đồ vừa hiện đại vừa giữ chuẩn văn hóa
            </p>
          </div>
        </div>
      </div>

      {/* Dải nút cuộn chọn sự kiện */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-3.5">
        {SU_KIEN_GENZ.map((ev) => {
          const isSelected = ev.id === selectedEventId;
          return (
            <button
              key={ev.id}
              type="button"
              onClick={() => onSelectEvent(ev)}
              className={`p-2.5 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between gap-1 ${
                isSelected
                  ? "bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/70 dark:to-teal-950/50 border-emerald-500 ring-2 ring-emerald-400/40 shadow-xs"
                  : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-emerald-400/60"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-base sm:text-lg">{ev.bieuTuong}</span>
                {isSelected && (
                  <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                    <Check className="w-2.5 h-2.5" />
                  </span>
                )}
              </div>
              <span className="text-xs font-bold truncate text-slate-800 dark:text-slate-200">
                {ev.ten.split("&")[0].trim()}
              </span>
            </button>
          );
        })}
      </div>

      {/* Thẻ chi tiết nhu cầu & Lời khuyên văn hóa cho sự kiện được chọn */}
      {currentEvent && (
        <div className="p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-emerald-900 dark:text-emerald-200">
                {currentEvent.bieuTuong} {currentEvent.ten}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-200/70 dark:bg-emerald-800/70 text-emerald-900 dark:text-emerald-100 font-semibold">
                Nhu cầu người dùng
              </span>
            </div>
            <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed m-0">
              🎯 <strong>Nhu cầu:</strong> {currentEvent.nhuCau}
            </p>
            <p className="text-[11px] text-emerald-800 dark:text-emerald-300 leading-relaxed m-0 italic">
              💡 <strong>Lời khuyên di sản:</strong> {currentEvent.loiKhuyenVanHoa}
            </p>
          </div>

          <Tooltip
            title="Tự động áp dụng"
            content="Tự động chỉnh trang phục, màu sắc, giày dép và phụ kiện tối ưu cho sự kiện này."
            position="top"
          >
            <button
              type="button"
              onClick={() => onApplyRecommendation(currentEvent)}
              className="w-full sm:w-auto py-2 px-3.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-semibold rounded-xl text-xs shadow-xs hover:shadow transition flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>1-Chạm phối đồ cho dịp này</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Tooltip>
        </div>
      )}
    </div>
  );
}
