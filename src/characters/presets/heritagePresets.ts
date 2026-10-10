/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * 6 KHUÔN MẪU NHÂN VẬT TIÊU BIỂU DI SẢN (HERITAGE ARCHETYPES)
 * Đảm bảo chỉ sử dụng 2 giới tính: "nu" (Nữ) và "nam" (Nam).
 */

import { NhanVatConfig } from "../types";

export interface HeritagePreset {
  id: string;
  ten: string;
  danhXung: string;
  moTa: string;
  vungMien: string;
  config: NhanVatConfig;
}

export const HERITAGE_PRESETS: HeritagePreset[] = [
  {
    id: "thieu_nu_ha_thanh",
    ten: "Thiếu Nữ Hà Thành",
    danhXung: "Đoan trang · Đài các",
    moTa: "Mặt trái xoan thanh tú, suối tóc mây buông lơi, da trắng hoa lê, dáng ngọc thanh tân bên hồ Gươm.",
    vungMien: "Kinh Bắc · Hà Nội",
    config: {
      tuoi: "nguoi_lon",
      gioi: "nu",
      vocDang: "manh",
      tongDa: 2,
      toc: "dai_xoa",
      khuonMat: "trai_xoan",
    },
  },
  {
    id: "chang_trai_kinh_ky",
    ten: "Chàng Trai Kinh Kỳ",
    danhXung: "Khôi ngô · Đĩnh đạc",
    moTa: "Khuôn mặt chữ điền cương nghị, tóc ngắn rẽ ngôi gọn ghẽ, vóc dáng chuẩn mực thư sinh.",
    vungMien: "Bắc Bộ · Thăng Long",
    config: {
      tuoi: "nguoi_lon",
      gioi: "nam",
      vocDang: "trung_binh",
      tongDa: 3,
      toc: "ngan",
      khuonMat: "chu_dien",
    },
  },
  {
    id: "nu_nhan_nam_bo",
    ten: "Nữ Nhân Nam Bộ",
    danhXung: "Duyên dáng · Đôn hậu",
    moTa: "Mặt trái xoan mặn mà, mái tóc vấn cao cài trâm ngọc, làn da bánh mật ngọt ngào sông nước Cửu Long.",
    vungMien: "Nam Bộ · Miền Tây",
    config: {
      tuoi: "nguoi_lon",
      gioi: "nu",
      vocDang: "day_dan",
      tongDa: 4,
      toc: "bui_cao",
      khuonMat: "trai_xoan",
    },
  },
  {
    id: "thu_sinh_co_do",
    ten: "Thư Sinh Cố Đô",
    danhXung: "Tao nhã · Trầm tĩnh",
    moTa: "Khuôn mặt chữ điền đĩnh đạc, da trắng ngọc, dáng cao thanh thoát bên bờ sông Hương.",
    vungMien: "Huế · Cố Đô",
    config: {
      tuoi: "nguoi_lon",
      gioi: "nam",
      vocDang: "manh",
      tongDa: 1,
      toc: "ngan",
      khuonMat: "chu_dien",
    },
  },
  {
    id: "be_tho_tray_hoi",
    ten: "Trẻ Em Trảy Hội",
    danhXung: "Hồn nhiên · Hoạt bát",
    moTa: "Gương mặt bầu bĩnh, đôi má ửng hồng phấn nụ, nụ cười rạng rỡ nô nức đón Tết du xuân.",
    vungMien: "Đồng bằng Bắc Bộ",
    config: {
      tuoi: "tre_em",
      gioi: "nu",
      vocDang: "trung_binh",
      tongDa: 2,
      toc: "ngan",
      khuonMat: "trai_xoan",
    },
  },
  {
    id: "truong_boi_don_hau",
    ten: "Bậc Trưởng Bối",
    danhXung: "Ung dung · Phúc hậu",
    moTa: "Gương mặt trái xoan phúc hậu, tóc hoa râm búi gáy xưa, nét cười đôn hậu trải qua bao mùa dâu bể.",
    vungMien: "Cổ phong truyền thống",
    config: {
      tuoi: "nguoi_cao_tuoi",
      gioi: "nu",
      vocDang: "dam_nguoi",
      tongDa: 3,
      toc: "bac_bui",
      khuonMat: "trai_xoan",
    },
  },
];
