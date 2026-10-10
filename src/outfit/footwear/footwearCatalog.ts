/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * DANH MỤC GIÀY DÉP VIỆT PHỤC & REMIX (FOOTWEAR CATALOG)
 */

import { FootwearItem } from "../types";

export const FOOTWEAR_CATALOG: FootwearItem[] = [
  {
    id: "guoc_moc",
    ten: "Guốc mộc quai nhung",
    loai: "truyen_thong",
    moTa: "Guốc gỗ vông đẽo tay, đế sơn mài mộc mạc, quai bọc vải nhung son êm ái.",
    phuHopVoi: ["aodai", "tu_than", "ba_ba", "ngu_than"],
    icon: "👡",
  },
  {
    id: "hai_theu",
    ten: "Hài thêu hoa sen cung đình",
    loai: "truyen_thong",
    moTa: "Mũi hài cong thanh thoát thêu chỉ kim tuyến hoa sen và mây cuộn triều Nguyễn.",
    phuHopVoi: ["aodai", "ngu_than", "champa_tho_cam"],
    icon: "🩰",
  },
  {
    id: "sneaker",
    ten: "Giày Sneaker trắng Remix",
    loai: "remix",
    moTa: "Nét phá cách trẻ trung, năng động kết hợp hoàn hảo cùng tà áo dài hoặc áo bà ba đương đại.",
    phuHopVoi: ["aodai", "ba_ba", "ngu_than", "tu_than", "co_thai", "mong_lanh", "ede_tho_cam", "champa_tho_cam", "sampot"],
    icon: "👟",
  },
  {
    id: "dep_da_co",
    ten: "Dép da thủ công Nam Bộ",
    loai: "truyen_thong",
    moTa: "Dép quai ngang da thuộc khâu tay bền chắc, thoáng mát vùng sông nước.",
    phuHopVoi: ["ba_ba", "sampot", "ede_tho_cam"],
    icon: "🩴",
  },
];
