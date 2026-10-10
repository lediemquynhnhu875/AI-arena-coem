/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * BỘ TÙY CHỌN NHÂN VẬT MẪU (CHARACTER TEMPLATES & PRESETS)
 */

import { NhanVatConfig } from "../../characters/types";

export interface NhanVatMauDef {
  id: string;
  ten: string;
  moTa: string;
  config: NhanVatConfig;
}

export const NHAN_VAT_MAU_DANH_SACH: NhanVatMauDef[] = [
  {
    id: "ba_bac_bo",
    ten: "Cụ Bà Bắc Bộ Tóc Hoa Râm",
    moTa: "Nét mặt đôn hậu, tóc hoa râm búi gáy, dáng người đầy đặn.",
    config: {
      tuoi: "nguoi_cao_tuoi",
      gioi: "nu",
      vocDang: "day_dan",
      tongDa: 3,
      toc: "bac_bui",
    },
  },
  {
    id: "thieu_nu_kinh_bac",
    ten: "Thiếu Nữ Kinh Bắc",
    moTa: "Dáng mảnh mai, tóc dài buông xõa mượt mà, da trắng ngà.",
    config: {
      tuoi: "nguoi_lon",
      gioi: "nu",
      vocDang: "manh",
      tongDa: 2,
      toc: "dai_xoa",
    },
  },
  {
    id: "si_tu_ngu_than",
    ten: "Sĩ Tử Áo Ngũ Thân",
    moTa: "Dáng dấp thư sinh, tóc búi cao gọn gàng, phong thái điềm đạm.",
    config: {
      tuoi: "nguoi_lon",
      gioi: "nam",
      vocDang: "trung_binh",
      tongDa: 3,
      toc: "bui_cao",
    },
  },
  {
    id: "chang_trai_tay_nguyen",
    ten: "Chàng Trai Tây Nguyên",
    moTa: "Vóc dáng đậm người khỏe khoắn, da ngăm rám nắng đại ngàn.",
    config: {
      tuoi: "nguoi_lon",
      gioi: "nam",
      vocDang: "dam_nguoi",
      tongDa: 5,
      toc: "ngan",
    },
  },
  {
    id: "em_be_dong_dao",
    ten: "Em Bé Đồng Dao",
    moTa: "Dáng người nhỏ nhắn tròn trịa dễ thương, tóc ngắn hồn nhiên.",
    config: {
      tuoi: "tre_em",
      gioi: "nu",
      vocDang: "trung_binh",
      tongDa: 2,
      toc: "ngan",
    },
  },
];
