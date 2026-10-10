/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * BỘ CHỌN CHẤT LIỆU VẢI DI SẢN (FABRIC SELECTOR)
 * Tinh gọn, trực quan, không nhiều chữ
 */

import React from "react";
import { FABRIC_CATALOG, VaiNangCao } from "./fabricCatalog";

interface FabricSelectorProps {
  selectedFabricId: string;
  onSelectFabric: (fabric: VaiNangCao) => void;
  className?: string;
}

export default function FabricSelector({
  selectedFabricId,
  onSelectFabric,
  className = "",
}: FabricSelectorProps) {
  const activeFabric = FABRIC_CATALOG.find((f) => f.id === selectedFabricId) ?? FABRIC_CATALOG[0];

  return (
    <div className={`fabric-selector space-y-2.5 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-[var(--nen-toi)] uppercase tracking-wider">
          Chất liệu vải
        </span>
        <span className="text-xs text-[var(--vang-chinh)] font-bold">
          {activeFabric.ten}
        </span>
      </div>

      {/* Danh sách thẻ chất liệu */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {FABRIC_CATALOG.map((f) => {
          const isSelected = f.id === selectedFabricId;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => onSelectFabric(f)}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? "border-[var(--xanh-la)] bg-[var(--xanh-nhe)] shadow-xs ring-1 ring-[var(--xanh-la)]"
                  : "border-[var(--vien-the)] bg-[var(--nen-the)] hover:border-[var(--xanh-la)] hover:bg-[var(--xanh-nhe)]/30"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-bold text-[var(--nen-toi)]">
                  {f.ten}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--vang-nhe)] text-[var(--vang-chinh)] font-semibold">
                  {f.doDay}
                </span>
              </div>
              <div className="text-[10px] text-[var(--xanh-chinh)] font-medium mt-1 truncate">
                {f.langNghe}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
