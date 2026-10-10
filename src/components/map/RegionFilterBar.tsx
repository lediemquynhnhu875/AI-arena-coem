/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * THANH LỌC VÙNG MIỀN & TÌM KIẾM TỈNH THÀNH
 */

import React from "react";
import { Search, RotateCcw } from "lucide-react";
import Tooltip from "../Tooltip";

export interface RegionFilterTab {
  id: string;
  label: string;
  count: number;
  color: string;
}

const REGION_TABS: RegionFilterTab[] = [
  { id: "all", label: "Toàn Quốc", count: 34, color: "var(--xanh-chinh)" },
  { id: "bac", label: "Bắc Bộ", count: 15, color: "#15803D" },
  { id: "trung", label: "Trung Bộ", count: 8, color: "#CA8A04" },
  { id: "taynguyen", label: "Tây Nguyên", count: 3, color: "#C2410C" },
  { id: "nam", label: "Nam Bộ", count: 8, color: "#0D9488" },
];

interface RegionFilterBarProps {
  activeRegion: string;
  onSelectRegion: (regionId: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  matchedCount?: number;
  onReset?: () => void;
}

export default function RegionFilterBar({
  activeRegion,
  onSelectRegion,
  searchQuery,
  onSearchChange,
  matchedCount,
  onReset,
}: RegionFilterBarProps) {
  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-2 rounded-[var(--vien-lech-a)] bg-[var(--nen-the)] border border-[var(--vien-the)] shadow-sm">
      {/* 1. CÁC TAB LỌC 4 VÙNG MIỀN VĂN HÓA */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none select-none">
        {REGION_TABS.map((tab) => {
          const isActive = activeRegion === tab.id;
          return (
            <Tooltip
              key={tab.id}
              title={`Khu vực ${tab.label}`}
              content={`Lọc và hiển thị ${tab.count} tỉnh thành thuộc ${tab.label}.`}
              shortcut={`${tab.count} tỉnh`}
              position="bottom"
            >
              <button
                type="button"
                onClick={() => onSelectRegion(tab.id)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm ring-1 ring-emerald-400/50 scale-[1.02]"
                    : "bg-[var(--nen-the-phu)] text-[var(--tro-tram)] hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20 hover:text-[var(--nen-toi)] border border-[var(--vien-the)] hover:border-emerald-500/40"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? "bg-white/20 text-white" : "bg-[var(--nen-the)] text-[var(--tro-tram)]"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            </Tooltip>
          );
        })}
      </div>

      {/* 2. Ô TÌM KIẾM NHANH TÊN TỈNH THÀNH */}
      <div className="relative min-w-[210px] flex items-center gap-2">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-[var(--tro-tram)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm tên tỉnh, ví dụ: Hà Nội, Huế..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-[var(--nen-the-phu)] border border-[var(--vien-the)] text-[var(--nen-toi)] placeholder:text-[var(--tro-tram)]/60 focus:outline-none focus:border-emerald-500 focus:bg-[var(--nen-the)]"
          />
        </div>

        {(searchQuery || activeRegion !== "all") && onReset && (
          <Tooltip title="Xóa bộ lọc" content="Hiện lại toàn bộ 34 tỉnh thành." position="bottom">
            <button
              type="button"
              onClick={onReset}
              className="p-1.5 rounded-md text-[var(--tro-tram)] hover:text-[var(--nen-toi)] hover:bg-[var(--nen-the-phu)] transition-colors"
              aria-label="Xóa bộ lọc"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </Tooltip>
        )}
      </div>
    </div>
  );
}
