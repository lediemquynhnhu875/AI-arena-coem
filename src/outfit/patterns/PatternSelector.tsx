/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * BỘ CHỌN HOA VĂN MƯỢN (PATTERN SELECTOR)
 */

import React from "react";
import { CULTURAL_PATTERNS } from "./patternCatalog";

interface PatternSelectorProps {
  selectedPatternId: string | null;
  onSelectPattern: (id: string | null) => void;
  className?: string;
}

export default function PatternSelector({
  selectedPatternId,
  onSelectPattern,
  className = "",
}: PatternSelectorProps) {
  return (
    <div className={`pattern-selector space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-[var(--nen-toi)] uppercase tracking-wider">
          Hoa văn di sản mượn
        </span>
        {selectedPatternId && (
          <button
            type="button"
            onClick={() => onSelectPattern(null)}
            className="text-[11px] text-[var(--vang-chinh)] hover:text-[var(--xanh-chinh)] underline cursor-pointer"
          >
            Về vải trơn nguyên bản
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* Nút không dùng hoa văn */}
        <button
          type="button"
          onClick={() => onSelectPattern(null)}
          className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
            selectedPatternId === null
              ? "border-[var(--xanh-la)] bg-[var(--xanh-nhe)] ring-1 ring-[var(--xanh-la)] shadow-sm"
              : "border-[var(--vien-the)] bg-[var(--nen-the)] hover:border-[var(--xanh-la)] hover:bg-[var(--xanh-nhe)]/30"
          }`}
          style={{ borderRadius: "var(--vien-lech-a)" }}
        >
          <div className="text-xs font-semibold text-[var(--nen-toi)]">Vải trơn</div>
          <div className="text-[10px] text-[var(--chu-mo)] mt-0.5">Không hoa văn mượn</div>
        </button>

        {CULTURAL_PATTERNS.map((p) => {
          const isSelected = selectedPatternId === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onSelectPattern(p.id)}
              className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                isSelected
                  ? "border-[var(--xanh-la)] bg-[var(--xanh-nhe)] ring-1 ring-[var(--xanh-la)] shadow-sm"
                  : "border-[var(--vien-the)] bg-[var(--nen-the)] hover:border-[var(--xanh-la)] hover:bg-[var(--xanh-nhe)]/30"
              }`}
              style={{ borderRadius: "var(--vien-lech-a)" }}
              title={p.yNghia}
            >
              <div className="flex items-center justify-between gap-1">
                <span className="text-xs font-semibold text-[var(--nen-toi)] truncate">
                  {p.ten}
                </span>
                <span className="text-[9px] px-1 py-0.5 bg-[var(--vang-nhe)] text-[var(--vang-chinh)] rounded shrink-0 font-medium">
                  {p.danToc}
                </span>
              </div>
              <div className="text-[10px] text-[var(--chu-mo)] mt-1 truncate">
                {p.vungMien} · {p.yNghia}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
