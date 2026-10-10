/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * PHỐI ĐỒ KHU VỰC BẮC BỘ & VÙNG CAO TÂY BẮC (NORTH REGION STYLING)
 */

export interface RegionalStylingConfig {
  vungId: string;
  tenVung: string;
  moTa: string;
  khiHau: string;
  trangPhucTieuBieu: string[];
  loaiVaiUuTien: string[];
  hoaVanUuTien: string[];
  phuKienUuTien: string[];
  mauUuTien: string[];
}

export const BAC_BO_STYLING: RegionalStylingConfig = {
  vungId: "bac",
  tenVung: "Bắc Bộ & Tây Bắc",
  moTa: "Nơi hội tụ nền văn hiến Kinh Bắc với áo tứ thân, nón quai thao cùng nét thổ cẩm rực rỡ của các dân tộc Thái, Mông trên rẻo cao.",
  khiHau: "Bốn mùa rõ rệt, mùa đông se lạnh thích hợp cho vải đũi, lanh sáp ong và lụa dày.",
  trangPhucTieuBieu: ["tu_than", "co_thai", "mong_lanh"],
  loaiVaiUuTien: ["lua_van_phuc", "lanh_mong", "cham_nhuom"],
  hoaVanUuTien: ["kb", "thai", "mong"],
  phuKienUuTien: ["non_quai_thao", "khan_mo_qua", "khan_pieu", "vong_bac"],
  mauUuTien: ["m_do", "m_cham", "m_reu", "m_nau"],
};
