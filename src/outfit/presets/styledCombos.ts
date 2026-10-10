/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * BỘ PHỐI MẪU HOÀN CHỈNH (STYLED COMBOS)
 */

export interface StyledCombo {
  id: string;
  ten: string;
  trangPhucId: string;
  mauId: string;
  phuKienIds: string[];
  hoaVanThem?: string | null;
  phongCach: "truyen_thong" | "remix";
  moTa: string;
}

export const STYLED_COMBOS: StyledCombo[] = [
  {
    id: "aodai_trang_nonla",
    ten: "Áo Dài Trắng Xứ Huế",
    trangPhucId: "aodai",
    mauId: "m_trang",
    phuKienIds: ["non_la"],
    phongCach: "truyen_thong",
    moTa: "Nón bài thơ che nghiêng vành, tà áo trắng tinh khôi thanh thoát.",
  },
  {
    id: "tuthan_kinh_bac",
    ten: "Liền Chị Kinh Bắc Trẩy Hội",
    trangPhucId: "tu_than",
    mauId: "m_do",
    phuKienIds: ["non_quai_thao", "khan_mo_qua"],
    hoaVanThem: "kb",
    phongCach: "truyen_thong",
    moTa: "Nón ba tầm quai thao buông lơi, yếm thắm khăn vuông mỏ quạ.",
  },
  {
    id: "baba_nam_bo_remix",
    ten: "Áo Bà Ba Sneaker Đương Đại",
    trangPhucId: "ba_ba",
    mauId: "m_nau",
    phuKienIds: ["khan_ran", "sneaker", "tote"],
    hoaVanThem: "kn",
    phongCach: "remix",
    moTa: "Chất mộc miệt vườn sông nước remix cùng đôi sneaker trắng tinh tươm.",
  },
  {
    id: "nguthan_khandong_quyphai",
    ten: "Áo Ngũ Thân Lập Lĩnh Cổ Kính",
    trangPhucId: "ngu_than",
    mauId: "m_vang",
    phuKienIds: ["khan_dong", "tram_cai"],
    phongCach: "truyen_thong",
    moTa: "Nho nhã phong thái nho gia với năm chiếc khuy cài ngay ngắn.",
  },
];
