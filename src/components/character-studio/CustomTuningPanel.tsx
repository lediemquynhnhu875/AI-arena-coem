/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * BẢNG TÙY CHỈNH THÔNG SỐ NHÂN VẬT (CUSTOM TUNING PANEL)
 * - Tối ưu hóa kích thước nút nhỏ gọn (h-8, text-[11px]) để nhường không gian tối đa cho người mẫu phối đồ
 * - Đồng nhất phân cấp chữ theo đúng yêu cầu:
 *   1. "GIỚI TÍNH", "ĐỘ TUỔI", "VÓC DÁNG", "TÔNG DA", "KIỂU TÓC": Cùng 1 font và cỡ chữ (font-sans text-[11px] font-bold uppercase tracking-wider)
 *   2. Tất cả các nút tùy chọn còn lại: Cùng 1 font và cỡ chữ (font-sans text-[11px] font-semibold)
 *   3. Chuẩn hóa chiều cao nút đồng đều h-8
 */

import React from "react";
import { Sparkles, Check } from "lucide-react";
import {
  NhanVatConfig,
  Gioi,
  Tuoi,
  VocDang,
  TongDa,
} from "../../characters/types";
import { SILK_SKIN_TONES } from "../../characters/domain/silkSkinTones";

export interface CustomTuningPanelProps {
  config: NhanVatConfig;
  updateField: <K extends keyof NhanVatConfig>(field: K, val: NhanVatConfig[K]) => void;
}

export function CustomTuningPanel({ config, updateField }: CustomTuningPanelProps) {
  // Tiêu đề 5 nhóm thuộc tính: Cùng 1 font và cỡ chữ chuẩn xác
  const labelClass = "text-[11px] font-bold uppercase tracking-wider text-amber-950 dark:text-amber-300 font-sans";
  
  // Toàn bộ các nút tùy chọn còn lại: Cùng 1 font và cỡ chữ chuẩn xác (text-[11px] font-semibold font-sans)
  const optionTextClass = "text-[11px] font-semibold font-sans whitespace-nowrap";

  return (
    <div className="flex-1 flex flex-col gap-2.5 overflow-y-auto pr-1 font-sans select-none">
      
      {/* 1. GIỚI TÍNH */}
      <div className="flex flex-col gap-1">
        <label className={labelClass}>
          Giới tính
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { id: "nu" as Gioi, label: "Nữ", icon: "♀" },
            { id: "nam" as Gioi, label: "Nam", icon: "♂" },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => updateField("gioi", item.id)}
              className={`h-8 px-2.5 rounded-lg border text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 font-sans ${
                config.gioi === item.id
                  ? "bg-amber-100 dark:bg-amber-950/70 border-amber-600 shadow-xs ring-1 ring-amber-600 text-amber-950 dark:text-amber-200"
                  : "bg-white/80 dark:bg-slate-800/80 border-amber-200/50 dark:border-slate-700 hover:bg-amber-50 text-amber-900 dark:text-slate-200"
              }`}
            >
              <span className="text-xs leading-none">{item.icon}</span>
              <span className={optionTextClass}>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. ĐỘ TUỔI */}
      <div className="flex flex-col gap-1">
        <label className={labelClass}>
          Độ tuổi
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {[
            { id: "tre_em" as Tuoi, label: "Trẻ em" },
            { id: "nguoi_lon" as Tuoi, label: "Người lớn" },
            { id: "nguoi_cao_tuoi" as Tuoi, label: "Cao tuổi" },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => updateField("tuoi", item.id)}
              className={`h-8 px-1.5 rounded-lg border text-center transition-all cursor-pointer flex items-center justify-center font-sans ${
                config.tuoi === item.id
                  ? "bg-amber-100 dark:bg-amber-950/70 border-amber-600 shadow-xs text-amber-950 dark:text-amber-200 ring-1 ring-amber-600"
                  : "bg-white/80 dark:bg-slate-800/80 border-amber-200/50 dark:border-slate-700 hover:bg-amber-50 text-amber-900 dark:text-slate-200"
              }`}
            >
              <span className={optionTextClass}>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. VÓC DÁNG */}
      <div className="flex flex-col gap-1">
        <label className={labelClass}>
          Vóc dáng
        </label>
        <div className="grid grid-cols-4 gap-1">
          {[
            { id: "manh" as VocDang, label: "Mảnh mai" },
            { id: "trung_binh" as VocDang, label: "Cân đối" },
            { id: "day_dan" as VocDang, label: "Đầy đặn" },
            { id: "dam_nguoi" as VocDang, label: "Đậm người" },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => updateField("vocDang", item.id)}
              className={`h-8 px-0.5 rounded-lg border text-center transition-all cursor-pointer flex items-center justify-center font-sans ${
                config.vocDang === item.id
                  ? "bg-amber-100 dark:bg-amber-950/70 border-amber-600 shadow-xs text-amber-950 dark:text-amber-200 ring-1 ring-amber-600"
                  : "bg-white/80 dark:bg-slate-800/80 border-amber-200/50 dark:border-slate-700 hover:bg-amber-50 text-amber-900 dark:text-slate-200"
              }`}
            >
              <span className={optionTextClass}>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 4. TÔNG DA */}
      <div className="flex flex-col gap-1">
        <label className={labelClass}>
          Tông da
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {([1, 2, 3, 4, 5, 6] as TongDa[]).map((td) => {
            const info = SILK_SKIN_TONES[td];
            const isSelected = config.tongDa === td;
            return (
              <button
                key={td}
                type="button"
                onClick={() => updateField("tongDa", td)}
                className={`h-8 px-2 rounded-lg border flex items-center gap-1.5 transition-all cursor-pointer font-sans ${
                  isSelected
                    ? "border-amber-600 bg-amber-50 dark:bg-amber-950/60 shadow-xs ring-1 ring-amber-600"
                    : "border-amber-200/50 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 hover:bg-amber-50/50"
                }`}
              >
                <div
                  className="w-3.5 h-3.5 rounded-full border border-black/15 shadow-inner shrink-0 flex items-center justify-center"
                  style={{ background: info.swatchGrad }}
                >
                  {isSelected && <Check className="w-2 h-2 text-amber-950 stroke-[3]" />}
                </div>
                <span className={`${optionTextClass} text-amber-950 dark:text-amber-100`}>
                  {info.ten}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. KIỂU TÓC */}
      <div className="flex flex-col gap-1">
        <label className={labelClass}>
          Kiểu tóc
        </label>

        {config.gioi === "nam" ? (
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { id: "side_part", label: "Tóc rẽ ngôi lịch lãm" },
              { id: "short_crop", label: "Tóc cắt ngắn nam tính" },
              { id: "ngan", label: "Tóc ngắn tân thời" },
              { id: "bac_bui", label: "Tóc hoa râm phúc hậu" },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => updateField("toc", item.id)}
                className={`h-8 px-2 rounded-lg border text-center transition-all cursor-pointer flex items-center justify-center font-sans ${
                  config.toc === item.id
                    ? "bg-amber-100 dark:bg-amber-950/70 border-amber-600 shadow-xs text-amber-950 dark:text-amber-200 ring-1 ring-amber-600"
                    : "bg-white/80 dark:bg-slate-800/80 border-amber-200/50 dark:border-slate-700 hover:bg-amber-50 text-amber-900 dark:text-slate-200"
                }`}
              >
                <span className={optionTextClass}>{item.label}</span>
              </button>
            ))}
          </div>
        ) : (
          <>
            {/* Búi thấp thanh lịch (chuẩn mẫu) chiếm trọn 1 hàng */}
            <button
              type="button"
              onClick={() => updateField("toc", "bui_thap")}
              className={`h-8 px-2.5 rounded-lg border text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 font-sans ${
                config.toc === "bui_thap" || config.toc === "low_bun"
                  ? "bg-amber-100 dark:bg-amber-950/70 border-amber-600 shadow-xs text-amber-950 dark:text-amber-200 ring-1 ring-amber-600"
                  : "bg-white/80 dark:bg-slate-800/80 border-amber-200/50 dark:border-slate-700 hover:bg-amber-50 text-amber-900 dark:text-slate-200"
              }`}
            >
              <Sparkles className="w-3 h-3 text-amber-600 shrink-0" />
              <span className={optionTextClass}>Búi thấp thanh lịch (Chuẩn mẫu)</span>
            </button>

            {/* 4 kiểu tóc truyền thống xếp lưới 2x2 vuông vắn */}
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: "dai_xoa", label: "Tóc dài buông xõa" },
                { id: "bui_cao", label: "Búi cài trâm ngọc" },
                { id: "ngan", label: "Tóc ngắn tân thời" },
                { id: "bac_bui", label: "Tóc hoa râm" },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => updateField("toc", item.id)}
                  className={`h-8 px-2 rounded-lg border text-center transition-all cursor-pointer flex items-center justify-center font-sans ${
                    config.toc === item.id
                      ? "bg-amber-100 dark:bg-amber-950/70 border-amber-600 shadow-xs text-amber-950 dark:text-amber-200 ring-1 ring-amber-600"
                      : "bg-white/80 dark:bg-slate-800/80 border-amber-200/50 dark:border-slate-700 hover:bg-amber-50 text-amber-900 dark:text-slate-200"
                  }`}
                >
                  <span className={optionTextClass}>{item.label}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

    </div>
  );
}

export default CustomTuningPanel;
