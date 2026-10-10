/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * ĐỊNH NGHĨA KIỂU DỮ LIỆU NHÂN VẬT & THƯỚC ĐO 3D / VECTOR
 */

export type Tuoi = "tre_em" | "nguoi_lon" | "nguoi_cao_tuoi";
export type Gioi = "nu" | "nam";
export type KhuonMat = "trai_xoan" | "chu_dien";
export type VocDang =
  | "chu_nhat"       // Dáng Chữ Nhật (Thước kẻ)
  | "qua_le"         // Dáng Quả Lê (Tam giác thuận)
  | "dong_ho_cat"    // Dáng Đồng Hồ Cát (Thắt đáy lưng ong)
  | "tam_giac_nguoc" // Dáng Tam Giác Ngược (Vai ngang)
  | "qua_tao"        // Dáng Quả Táo (Dáng tròn đầy đặn)
  | "manh"           // Tương thích ngược: Thước kẻ
  | "trung_binh"     // Tương thích ngược: Đồng hồ cát
  | "day_dan"        // Tương thích ngược: Quả lê
  | "dam_nguoi";     // Tương thích ngược: Quả táo
export type TongDa = 1 | 2 | 3 | 4 | 5 | 6;
export type KieuToc = "bui_thap" | "ngan" | "dai_xoa" | "bui_cao" | "bac_bui";
export type HuongNhin = "truoc" | "sau";

export interface NhanVatConfig {
  tuoi: Tuoi;
  gioi: Gioi;
  vocDang: VocDang;
  tongDa: TongDa;
  toc: string;
  khuonMat?: KhuonMat;
  huongNhin?: HuongNhin;
}

export const NHAN_VAT_MAC_DINH: NhanVatConfig = {
  tuoi: "nguoi_lon",
  gioi: "nu",
  vocDang: "dong_ho_cat",
  tongDa: 2,
  toc: "bui_thap",
  khuonMat: "trai_xoan",
  huongNhin: "truoc",
};

export interface SoDoNhanVat {
  chieuCaoTong: number;
  vai: number; // nửa bề rộng vai từ tâm x=200
  nguc: number; // nửa bề rộng vòng 1 (ngực)
  eo: number;  // nửa bề rộng vòng 2 (eo)
  hong: number; // nửa bề rộng vòng 3 (hông)
  doDaiThan: number; // shoulderY đến hipY

  // Tọa độ các mốc dọc (Y)
  headTopY: number;
  headCenterY: number;
  chinY: number;
  neckY: number;
  neckHalfWidth: number;
  shoulderY: number;
  bustY: number; // vị trí đỉnh ngực (vòng 1)
  waistY: number; // vị trí thắt eo (vòng 2)
  hipY: number; // vị trí đỉnh hông (vòng 3)
  crotchY: number;
  kneeY: number;
  ankleY: number;
  feetY: number;

  // Bán kính đầu
  headRadiusX: number;
  headRadiusY: number;

  // Cánh tay
  armWidth: number;
  wristY: number;
  elbowY: number;

  // Tọa độ chi tiết mốc giải phẫu ôm khít cơ thể (Croquis anatomical landmarks)
  deltoidX: number;
  deltoidY: number;
  elbowOuterX: number;
  elbowInnerX: number;
  wristOuterX: number;
  wristInnerX: number;
  armpitX: number;
  armpitY: number;

  // Phân biệt giới tính cho trang phục
  isMale: boolean;

  // Chân
  legWidth: number;
}

export type CharacterScalePreset = "xs" | "sm" | "md" | "lg" | "xl";

export interface ViewportScaleConfig {
  width: number;
  height: number;
  viewBox: string;
  label: string;
}
