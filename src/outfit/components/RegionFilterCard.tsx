/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * THẺ GỢI Ý PHỐI ĐỒ THEO KHU VỰC VĂN HÓA (REGIONAL STYLING CARD)
 * Tinh gọn, trực quan, không nhiều chữ
 */

import React from "react";
import { REGIONAL_STYLING_LIST } from "../regions";

interface RegionFilterCardProps {
  onSelectRegion?: (regionId: string) => void;
  className?: string;
}

export default function RegionFilterCard({
  onSelectRegion,
  className = "",
}: RegionFilterCardProps) {
  return (
    <div className={`region-filter-card space-y-2.5 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-[var(--nen-toi)] uppercase tracking-wider">
          Đặc trưng 4 vùng miền
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {REGIONAL_STYLING_LIST.map((reg) => (
          <button
            key={reg.vungId}
            type="button"
            onClick={() => onSelectRegion?.(reg.vungId)}
            className="p-3 rounded-xl border border-[var(--vien-the)] bg-[var(--nen-the)] hover:border-[var(--xanh-la)] hover:bg-[var(--xanh-nhe)]/30 transition-all cursor-pointer flex flex-col justify-between text-left gap-1"
          >
            <div>
              <div className="text-xs font-bold text-[var(--nen-toi)]">
                {reg.tenVung}
              </div>
              <div className="text-[10px] text-[var(--vang-chinh)] font-semibold mt-0.5">
                {reg.vungId}
              </div>
            </div>

            <div className="text-[10px] text-[var(--xanh-chinh)] font-medium pt-1.5 border-t border-[var(--vien-the)] truncate w-full">
              {reg.phuKienUuTien.slice(0, 2).join(", ")}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
