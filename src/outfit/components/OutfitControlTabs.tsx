/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * THANH TAB ĐIỀU KHIỂN PHỐI ĐỒ (OUTFIT CONTROL TABS)
 * Bố cục thư mục trực quan, thanh thoát, phong cách Trắng - Vàng - Xanh Lá
 */

import React from "react";
import { OutfitTab } from "../types";
import Tooltip from "../../components/Tooltip";

interface OutfitControlTabsProps {
  activeTab: OutfitTab;
  onSelectTab: (tab: OutfitTab) => void;
  className?: string;
}

export const OUTFIT_TABS: {
  id: OutfitTab;
  label: string;
  icon: string;
  tooltip: string;
}[] = [
  {
    id: "su_kien",
    label: "Sự kiện",
    icon: "🎓",
    tooltip: "Nhu cầu phối đồ Gen Z theo dịp: Kỷ yếu, Dạo phố, Trẩy hội, Tết, Sân khấu.",
  },
  {
    id: "mau_sac",
    label: "Màu vải",
    icon: "🎨",
    tooltip: "Bảng màu ngũ hành & quy chuẩn truyền thống Việt Nam.",
  },
  {
    id: "loai_vai",
    label: "Loại vải",
    icon: "🧵",
    tooltip: "Chất liệu di sản: Lụa tơ tằm, Gấm, Đũi tơ gai, Lanh sáp ong, Thổ cẩm.",
  },
  {
    id: "hoa_tiet",
    label: "Họa tiết",
    icon: "✨",
    tooltip: "Hoa văn mượn: Thủy ba sóng nước, Mây lửa, Rồng phụng, Cúc bướm bạc.",
  },
  {
    id: "phu_kien",
    label: "Phụ kiện",
    icon: "👒",
    tooltip: "Phụ kiện đội đầu & trang sức: Nón lá, Khăn đóng, Kiềng bạc, Vòng cườm.",
  },
  {
    id: "giay_dep",
    label: "Giày dép",
    icon: "👟",
    tooltip: "Hài thêu cung đình, Guốc mộc mộc mạc, hoặc Sneaker cách tân.",
  },
  {
    id: "hai_hoa",
    label: "Hài hòa & Chuẩn",
    icon: "☯️",
    tooltip: "Kiểm tra sự hài hòa ngũ hành và hệ thống cảnh báo giữ chuẩn văn hóa.",
  },
  {
    id: "gioi_tinh",
    label: "Giới tính",
    icon: "👥",
    tooltip: "Chọn vóc dáng hình mẫu: Nữ hoặc Nam.",
  },
  {
    id: "khu_vuc",
    label: "Khu vực",
    icon: "🗺️",
    tooltip: "Lọc sắc thái trang phục 4 miền: Bắc Bộ, Trung Bộ, Tây Nguyên, Nam Bộ.",
  },
];

export default function OutfitControlTabs({
  activeTab,
  onSelectTab,
  className = "",
}: OutfitControlTabsProps) {
  return (
    <div
      className={`outfit-control-tabs flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none select-none ${className}`}
    >
      {OUTFIT_TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <Tooltip
            key={tab.id}
            title={tab.label}
            content={tab.tooltip}
            shortcut="Chọn tab"
            position="bottom"
          >
            <button
              type="button"
              onClick={() => onSelectTab(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold shadow-md shadow-emerald-600/25 ring-2 ring-emerald-400/50 scale-[1.03]"
                  : "border border-[var(--vien-the)] bg-[var(--nen-the)] text-[var(--chu-mo)] hover:text-[var(--nen-toi)] hover:border-emerald-500/40 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/20"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          </Tooltip>
        );
      })}
    </div>
  );
}
