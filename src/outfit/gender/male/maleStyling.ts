/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * PHỐI ĐỒ NAM GIỚI (MALE OUTFIT STYLING)
 */

export interface GenderStylingRule {
  id: string;
  gioi: "nam" | "nu";
  tieuDe: string;
  moTa: string;
  trangPhucKhuyenNghi: string[];
  phuKienKhuyenNghi: string[];
  giayDepKhuyenNghi: string[];
  mauUuTien: string[];
}

export const MALE_STYLING: GenderStylingRule = {
  id: "styling_nam",
  gioi: "nam",
  tieuDe: "Phong thái Đĩnh Đạc Nam Giới",
  moTa: "Tôn vinh nét trang trọng, đĩnh đạc của nam phục Việt. Chú trọng dáng cổ đứng lập lĩnh, khuy cài ngay ngắn và khăn đóng lịch thiệp.",
  trangPhucKhuyenNghi: ["ngu_than", "ba_ba", "ede_tho_cam", "sampot"],
  phuKienKhuyenNghi: ["khan_dong", "khan_ran", "vong_tay_dong"],
  giayDepKhuyenNghi: ["guoc_moc", "sneaker"],
  mauUuTien: ["m_cham", "m_vang", "m_nau", "m_reu"],
};
