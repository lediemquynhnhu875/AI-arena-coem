/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * BỘ PHỐI ĐỒ MẪU CHUẨN MỰC & REMIX (OUTFIT PRESETS)
 */

export interface OutfitPresetDef {
  id: string;
  ten: string;
  trangPhucId: string;
  mauHex: string;
  phuKienIds: string[];
  hoaVanThem?: string | null;
  phongCach: "chuan_xua" | "remix_hien_dai";
  moTa: string;
}

export const OUTFIT_PRESETS: OutfitPresetDef[] = [
  {
    id: "aodai_nonla_trang",
    ten: "Áo Dài Trắng Nón Lá Bài Thơ",
    trangPhucId: "aodai",
    mauHex: "#ffffff",
    phuKienIds: ["non_la"],
    phongCach: "chuan_xua",
    moTa: "Nét duyên dáng trường tồn của người phụ nữ Việt Nam.",
  },
  {
    id: "nguthan_khandong_quyphai",
    ten: "Áo Ngũ Thân Khăn Đóng Quý Phái",
    trangPhucId: "ngu_than",
    mauHex: "#1e3a5f",
    phuKienIds: ["khan_dong"],
    phongCach: "chuan_xua",
    moTa: "Phong thái đĩnh đạc, nho nhã thời Nguyễn.",
  },
  {
    id: "tuthan_yem_hoa",
    ten: "Áo Tứ Thân Nón Quai Thao",
    trangPhucId: "tu_than",
    mauHex: "#b5502f",
    phuKienIds: ["non_quai_thao", "khan_mo_qua"],
    hoaVanThem: "kb",
    phongCach: "chuan_xua",
    moTa: "Hình ảnh liền chị quan họ trẩy hội mùa xuân.",
  },
  {
    id: "baba_khan_ran_sneaker",
    ten: "Áo Bà Ba Remix Sneaker",
    trangPhucId: "ba_ba",
    mauHex: "#2d3748",
    phuKienIds: ["khan_ran", "sneaker", "tote"],
    phongCach: "remix_hien_dai",
    moTa: "Chất mộc Nam Bộ hòa quyện nhịp sống trẻ thành thị.",
  },
  {
    id: "cothai_vongbac",
    ten: "Áo Cóm Váy Thái & Khăn Piêu",
    trangPhucId: "co_thai",
    mauHex: "#3b533e",
    phuKienIds: ["khan_pieu", "vong_bac"],
    hoaVanThem: "thai",
    phongCach: "chuan_xua",
    moTa: "Khuy bướm bạc lấp lánh bên sườn non Tây Bắc.",
  },
  {
    id: "mong_sapong_sacso",
    ten: "Váy Lanh H'Mông Dập Ly Thổ Cẩm",
    trangPhucId: "mong_lanh",
    mauHex: "#1e293b",
    phuKienIds: ["vong_bac"],
    hoaVanThem: "mong",
    phongCach: "chuan_xua",
    moTa: "Váy xòe hoa văn vẽ sáp ong tinh tế trên đỉnh núi cao.",
  },
];
