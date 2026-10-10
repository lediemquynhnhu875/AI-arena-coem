/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * BỘ CHỌN GIÀY DÉP VIỆT PHỤC (FOOTWEAR SELECTOR)
 */

import React from "react";
import { FOOTWEAR_CATALOG } from "./footwearCatalog";

interface FootwearSelectorProps {
  selectedFootwearId: string;
  onSelectFootwear: (id: string) => void;
  className?: string;
}

export default function FootwearSelector({
  selectedFootwearId,
  onSelectFootwear,
  className = "",
}: FootwearSelectorProps) {
  return (
    <div className={`footwear-selector space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-[var(--nen-toi)] uppercase tracking-wider">
          Giày dép & Guốc cổ truyền
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {FOOTWEAR_CATALOG.map((item) => {
          const isSelected = selectedFootwearId === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectFootwear(item.id)}
              className={`p-3 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? "border-[var(--xanh-la)] bg-[var(--xanh-nhe)] ring-1 ring-[var(--xanh-la)] shadow-sm"
                  : "border-[var(--vien-the)] bg-[var(--nen-the)] hover:border-[var(--xanh-la)] hover:bg-[var(--xanh-nhe)]/30"
              }`}
              style={{ borderRadius: "var(--vien-lech-a)" }}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{item.icon}</span>
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded font-semibold ${
                      item.loai === "remix"
                        ? "bg-[var(--xanh-mint)] text-[var(--xanh-dam)]"
                        : "bg-[var(--vang-nhe)] text-[var(--vang-chinh)]"
                    }`}
                  >
                    {item.loai === "remix" ? "Remix" : "Cổ truyền"}
                  </span>
                </div>
                <div className="text-xs font-semibold text-[var(--nen-toi)] mt-2">
                  {item.ten}
                </div>
                <p className="text-[10.5px] text-[var(--chu-mo)] mt-1 line-clamp-2 leading-relaxed">
                  {item.moTa}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
