/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * HUY HIỆU ĐÁNH GIÁ PHỐI ĐỒ (OUTFIT INDICATOR)
 */

import React from "react";
import { StylingAdvice } from "../types";

interface OutfitIndicatorProps {
  advice: StylingAdvice;
  className?: string;
}

export default function OutfitIndicator({ advice, className = "" }: OutfitIndicatorProps) {
  return (
    <div
      className={`outfit-indicator flex flex-wrap items-center gap-2 text-xs select-none ${className}`}
    >
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span>Hài hòa màu sắc</span>
      </div>

      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300 font-medium">
        <span>✨</span>
        <span>{advice.cultureNote}</span>
      </div>
    </div>
  );
}
