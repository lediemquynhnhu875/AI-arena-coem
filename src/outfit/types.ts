/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * ĐỊNH NGHĨA KIỂU DỮ LIỆU HỆ THỐNG PHỐI TRANG PHỤC (OUTFIT STYLING TYPES)
 */

import { Vai, MauSac, PhuKien } from "../types";

export type OutfitTab =
  | "su_kien"
  | "mau_sac"
  | "loai_vai"
  | "hoa_tiet"
  | "phu_kien"
  | "giay_dep"
  | "hai_hoa"
  | "khu_vuc"
  | "gioi_tinh";

export interface OutfitState {
  trangPhucId: string;
  mauId: string;
  phuKienIds: string[];
  hoaVanThem?: string | null;
  phongCach: string;
  vaiCustom?: Vai | null;
}

export interface CulturalPatternDef {
  id: string;
  ten: string;
  danToc: string;
  vungMien: string;
  yNghia: string;
  svgPatternId: string;
}

export interface FootwearItem {
  id: string;
  ten: string;
  loai: "truyen_thong" | "remix";
  moTa: string;
  phuHopVoi: string[];
  icon: string;
}

export interface StylingAdvice {
  isHarmonious: boolean;
  colorNote: string;
  cultureNote: string;
  suggestion?: string;
}
