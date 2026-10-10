/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * BẢNG CHỌN KHUÔN MẪU CÓ SẴN (PRESET SELECTOR PANEL)
 * - Đồng nhất 1 font chữ duy nhất: font-sans (Be Vietnam Pro)
 * - Thẻ khuôn mẫu cân xứng, không bị lệch hàng hay cắt góc
 */

import React from "react";
import { Check } from "lucide-react";
import { NhanVatConfig } from "../../characters/types";
import { HeritagePreset } from "../../characters/presets/heritagePresets";

export interface PresetSelectorPanelProps {
  presets: HeritagePreset[];
  config: NhanVatConfig;
  onApplyPreset: (preset: HeritagePreset) => void;
}

export function PresetSelectorPanel({
  presets,
  config,
  onApplyPreset,
}: PresetSelectorPanelProps) {
  return (
    <div className="flex-1 flex flex-col gap-2.5 overflow-y-auto pr-1 font-sans select-none">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {presets.map((preset) => {
          const isSelected =
            config.tuoi === preset.config.tuoi &&
            config.gioi === preset.config.gioi &&
            config.vocDang === preset.config.vocDang &&
            config.tongDa === preset.config.tongDa &&
            config.toc === preset.config.toc;

          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onApplyPreset(preset)}
              className={`preset-card h-14 p-3 rounded-xl border text-left flex items-center justify-between gap-2 cursor-pointer transition-all font-sans ${
                isSelected
                  ? "preset-card--active ring-1 ring-amber-600 border-amber-600 bg-amber-50/90 dark:bg-amber-950/60"
                  : "bg-white/80 dark:bg-slate-800/80 border-amber-200/60 dark:border-slate-700 hover:bg-amber-50/40"
              }`}
            >
              <div className="min-w-0 flex-1">
                <div className="font-bold text-xs sm:text-sm text-amber-950 dark:text-amber-50 truncate font-sans">
                  {preset.ten}
                </div>
                <div className="text-[11px] text-amber-700 dark:text-amber-400 font-medium truncate font-sans">
                  {preset.vungMien} · {preset.config.gioi === "nu" ? "Nữ" : "Nam"}
                </div>
              </div>

              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all ${
                  isSelected
                    ? "bg-amber-600 text-white"
                    : "border border-amber-300 dark:border-slate-600 text-transparent"
                }`}
              >
                <Check className="w-3 h-3 stroke-[2.5]" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default PresetSelectorPanel;
