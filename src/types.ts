/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Nhom {
  id: string;
  ten: string;
  vung: "bac" | "trung" | "nam" | "taynguyen" | string;
}

export interface TrangPhuc {
  id: string;
  ten: string;
  nhomIds: string[];
  gioiTinh: "chung" | "nu" | "nam" | string;
  dip: string[];
  thoiTiet: string[];
  moTaNgan: string;
  fallbackText: string;
  suThat: string[];
  mucRemix: "tu_do" | "co_dieu_kien" | "cam" | string;
  nguonIds: string[];
  daKiemChung: boolean;
  baoTon?: {
    muc: string;
    nguonIds: string[];
  };
}

export interface PhuKien {
  id: string;
  ten: string;
  loai: "non" | "khan" | "trang_suc" | "hien_dai" | string;
  nhomIds: string[];
  suThat: string[];
  mucRemix: "tu_do" | "co_dieu_kien" | string;
  daKiemChung?: boolean;
}

export interface MauSac {
  id: string;
  ten: string;
  hex: string;
  yNghia: string;
}

export interface LuatMau {
  a: string;
  b: string;
  ketQua: "hai_hoa" | "can_can_bang" | string;
  lyDo: string;
}

export interface LuatRemix {
  id: string;
  khi: {
    trangPhuc?: string[];
    phuKienBatKy?: string[];
    hoaVanThem?: string;
  };
  nhan: "sang_tao" | "chuan" | "can_xem_lai" | "chua_du_du_lieu" | string;
  lyDo: string;
  goiYThayThe?: string;
}

export interface CaThamTu {
  id: string;
  boPhoi: {
    trangPhuc: string;
    phuKien?: string[];
    hoaVanThem?: string;
  };
  loiSai: string | null;
  lyDo: string;
}

export interface Vai {
  id: string;
  ten: string;
  langNghe: string;
  kyThuat: string;
  suThat: string[];
  nguonIds: string[];
}

export interface MocThoiGian {
  id: string;
  nam: string;
  ten: string;
  thayDoi: string;
  suThat: string[];
  nguonIds: string[];
}

export interface SuKien {
  id: string;
  ten: string;
  ngayDL: string | null;
  ghiChu?: string;
}

export interface Nguon {
  id: string;
  ten: string;
  loai: "bao_tang" | "hoc_thuat" | "bao_chi" | "nghe_nhan" | "khac";
  url?: string;
}

export interface Outfit {
  id: string;
  nhanVat: {
    tuoi: "tre_em" | "nguoi_lon" | "nguoi_cao_tuoi";
    gioi: "nu" | "nam";
    vocDang: "manh" | "trung_binh" | "day_dan" | "dam_nguoi";
    tongDa: 1 | 2 | 3 | 4 | 5 | 6;
    toc: string;
  };
  trangPhucId: string;
  mauId: string;
  phuKienIds: string[];
  hoaVanThem?: string; /* id nhóm mượn họa tiết */
  caption?: string;
  taoLuc: number;
}

export interface QueNhaData {
  dip: string[] | string | null;
  camHungIds: string[];
  phongCach: string[] | string | null;
  nhomQueId?: string | null; // Cầu nối tương thích ngược
}
