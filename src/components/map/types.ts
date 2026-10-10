/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * ĐỊNH NGHĨA KIỂU DỮ LIỆU BẢN ĐỒ VIỆT NAM 34 TỈNH THÀNH (QĐ 19/2025/QĐ-TTg)
 */

import { VungId } from "../../data/vung";

export type ProvinceDivisionType = "thành phố" | "tỉnh";

export interface Province34 {
  /** ID chuẩn hóa dạng snake_case (vd: ha_noi, ho_chi_minh, quang_ninh) */
  id: string;
  /** Mã tỉnh (1 -> 34) */
  code: number;
  /** Mã tra cứu TMS */
  tmsCode: number;
  /** Tên chính thức sau sáp nhập */
  name: string;
  /** Tên không dấu */
  codename: string;
  /** Loại hình đơn vị hành chính */
  divisionType: ProvinceDivisionType;
  /** Khu vực địa lý văn hóa (Bắc Bộ, Trung Bộ, Tây Nguyên, Nam Bộ) */
  region: VungId;
  /** Danh sách các tỉnh/thành phố cũ sáp nhập thành tỉnh mới */
  mergedFrom: string[];
  /** Số lượng xã/phường/thị trấn */
  communeCount: number;
  /** Tọa độ trung tâm để hiển thị nhãn và marker trên SVG (ViewBox 0 0 520 1090) */
  center: { x: number; y: number };
  /** Nếp cổ phục truyền thống tiêu biểu gắn với địa phương */
  costumeIds: string[];
  /** Tên trang phục tiêu biểu */
  costumeNames: string[];
  /** Điểm nhấn di sản / câu chuyện văn hóa */
  heritageHighlight: string;
}

export interface RegionInfo {
  id: VungId;
  name: string;
  shortName: string;
  provincesCount: number;
  colorHex: string;
  accentHex: string;
  description: string;
}
