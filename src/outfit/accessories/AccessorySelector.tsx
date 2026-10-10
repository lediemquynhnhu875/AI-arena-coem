/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * BỘ CHỌN PHỤ KIỆN VIỆT PHỤC (ACCESSORY SELECTOR)
 */

import React, { useState } from "react";
import { ACCESSORY_CATALOG } from "./accessoryCatalog";

interface AccessorySelectorProps {
  selectedIds: string[];
  onToggleAccessory: (id: string) => void;
  className?: string;
}

export default function AccessorySelector({
  selectedIds,
  onToggleAccessory,
  className = "",
}: AccessorySelectorProps) {
  const [filterType, setFilterType] = useState<string>("all");

  const filteredAccessories = ACCESSORY_CATALOG.filter((item) => {
    if (filterType === "all") return true;
    return item.phanLoai === filterType;
  });

  return (
    <div className={`accessory-selector space-y-3 ${className}`}>
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className="text-xs font-semibold text-[var(--nen-toi)] uppercase tracking-wider">
          Phụ kiện ({selectedIds.length} đang chọn)
        </span>

        {/* Nút lọc nhanh phân loại */}
        <div className="flex gap-1">
          {[
            { id: "all", label: "Tất cả" },
            { id: "doi_dau", label: "Nón / Khăn" },
            { id: "trang_suc", label: "Trang sức" },
            { id: "tui_xach", label: "Túi xách" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterType(tab.id)}
              className={`px-2 py-0.5 text-[10px] rounded transition-colors cursor-pointer ${
                filterType === tab.id
                  ? "bg-[var(--xanh-chinh)] text-white font-semibold"
                  : "bg-[var(--nen-the)] text-[var(--chu-mo)] hover:text-[var(--nen-toi)] hover:bg-[var(--xanh-nhe)]"
              }`}
              style={{ borderRadius: "var(--vien-lech-a)" }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Lưới danh sách phụ kiện */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {filteredAccessories.map((item) => {
          const isSelected = selectedIds.includes(item.id);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onToggleAccessory(item.id)}
              className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                isSelected
                  ? "border-[var(--xanh-la)] bg-[var(--xanh-nhe)] ring-1 ring-[var(--xanh-la)] shadow-sm"
                  : "border-[var(--vien-the)] bg-[var(--nen-the)] hover:border-[var(--xanh-la)] hover:bg-[var(--xanh-nhe)]/30"
              }`}
              style={{ borderRadius: "var(--vien-lech-a)" }}
            >
              <span className="text-xl shrink-0 mt-0.5">{item.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[var(--nen-toi)] truncate">
                    {item.ten}
                  </span>
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded font-medium shrink-0 ml-1 ${
                      isSelected
                        ? "bg-[var(--vang-chinh)] text-white font-bold"
                        : "bg-[var(--nen-the-phu)] text-[var(--chu-mo)]"
                    }`}
                  >
                    {isSelected ? "Đã chọn" : "+ Thêm"}
                  </span>
                </div>
                <p className="text-[10.5px] text-[var(--chu-mo)] mt-0.5 line-clamp-1">
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
