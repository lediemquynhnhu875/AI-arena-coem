/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TrangPhuc } from "../types";

export const trangPhuc: TrangPhuc[] = [
  {
    id: "aodai",
    ten: "Áo dài",
    nhomIds: ["kh", "kb", "kn"],
    gioiTinh: "chung",
    dip: ["tet", "khai_giang", "cuoi", "ky_yeu", "tot_nghiep", "nha_giao"],
    thoiTiet: ["nong", "mat"],
    moTaNgan: "Áo dài hiện đại phát triển từ áo ngũ thân.",
    fallbackText: "Áo dài hiện đại phát triển từ áo ngũ thân.",
    suThat: [
      "Áo dài hiện đại phát triển từ áo ngũ thân.",
      "Thập niên 1930, họa sĩ Cát Tường giới thiệu kiểu áo dài Lemur (Le Mur) cách tân.",
      "Thường mặc trong Tết, lễ cưới, lễ hội và là đồng phục nữ sinh ở nhiều trường."
    ],
    mucRemix: "co_dieu_kien",
    nguonIds: ["ngan_nam_ao_mu", "bt_phu_nu_vn"],
    daKiemChung: true
  },
  {
    id: "ngu_than",
    ten: "Áo ngũ thân",
    nhomIds: ["kh", "kb"],
    gioiTinh: "chung",
    dip: ["le", "tet"],
    thoiTiet: ["mat", "lanh"],
    moTaNgan: "Áo trang trọng gồm năm thân vải.",
    fallbackText: "Áo trang trọng gồm năm thân vải.",
    suThat: [
      "Gồm năm thân vải: hai thân trước, hai thân sau và một thân con.",
      "Là trang phục trang trọng, tiền thân của áo dài hiện đại."
    ],
    mucRemix: "co_dieu_kien",
    nguonIds: ["ngan_nam_ao_mu", "trang_phuc_thang_long"],
    daKiemChung: true
  },
  {
    id: "tu_than",
    ten: "Áo tứ thân",
    nhomIds: ["kb"],
    gioiTinh: "nu",
    dip: ["hoi_lang", "tet", "le_hoi"],
    thoiTiet: ["mat", "lanh"],
    moTaNgan: "Áo của phụ nữ Bắc Bộ, hai vạt trước thường buộc lại.",
    fallbackText: "Áo của phụ nữ Bắc Bộ, hai vạt trước thường buộc lại.",
    suThat: [
      "Phổ biến ở Bắc Bộ, gồm bốn thân vải, hai vạt trước thường buộc lại.",
      "Thường đi cùng yếm, váy, khăn mỏ quạ và nón quai thao."
    ],
    mucRemix: "co_dieu_kien",
    nguonIds: ["bt_phu_nu_vn", "trang_phuc_thang_long"],
    daKiemChung: true
  },
  {
    id: "ba_ba",
    ten: "Áo bà ba",
    nhomIds: ["kn"],
    gioiTinh: "chung",
    dip: ["doi_thuong", "le_hoi"],
    thoiTiet: ["nong", "mat", "mua"],
    moTaNgan: "Áo gọn, cổ tròn, quen thuộc ở Nam Bộ.",
    fallbackText: "Áo gọn, cổ tròn, quen thuộc ở Nam Bộ.",
    suThat: [
      "Phổ biến ở Nam Bộ, dáng gọn, cổ tròn, thoải mái cho sinh hoạt và lao động.",
      "Thường đi cùng khăn rằn."
    ],
    mucRemix: "tu_do",
    nguonIds: ["bt_phu_nu_vn", "can_bo_sung"],
    daKiemChung: false
  },
  {
    id: "co_thai",
    ten: "Áo cỏm Thái",
    nhomIds: ["thai"],
    gioiTinh: "nu",
    dip: ["le_hoi"],
    thoiTiet: ["mat", "lanh"],
    moTaNgan: "Áo ngắn ôm sát người của phụ nữ Thái, cài cúc bạc.",
    fallbackText: "Áo ngắn ôm sát người của phụ nữ Thái, cài cúc bạc.",
    suThat: [
      "Áo ngắn ôm sát người của phụ nữ Thái, cài cúc bạc."
    ],
    mucRemix: "co_dieu_kien",
    nguonIds: ["bt_dan_toc_hoc", "can_bo_sung"],
    daKiemChung: false
  },
  {
    id: "mong_lanh",
    ten: "Trang phục Mông",
    nhomIds: ["mong"],
    gioiTinh: "chung",
    dip: ["le_hoi", "cho_phien"],
    thoiTiet: ["lanh", "mat"],
    moTaNgan: "Trang phục dệt lanh, thêu và vẽ sáp ong.",
    fallbackText: "Trang phục dệt lanh, thêu và vẽ sáp ong.",
    suThat: [
      "Nhiều nhóm Mông dệt vải lanh, trang trí bằng vẽ sáp ong, thêu, may chắp.",
      "Trang sức bạc phổ biến."
    ],
    mucRemix: "co_dieu_kien",
    nguonIds: ["bt_dan_toc_hoc", "can_bo_sung"],
    daKiemChung: false
  },
  {
    id: "ede_tho_cam",
    ten: "Trang phục Ê Đê",
    nhomIds: ["ede"],
    gioiTinh: "chung",
    dip: ["le_hoi"],
    thoiTiet: ["mat", "lanh"],
    moTaNgan: "Thổ cẩm dệt tay, hoa văn hình học.",
    fallbackText: "Thổ cẩm dệt tay, hoa văn hình học.",
    suThat: [
      "Thổ cẩm dệt tay với hoa văn hình học.",
      "Gắn với đời sống buôn làng và lễ hội cồng chiêng Tây Nguyên."
    ],
    mucRemix: "co_dieu_kien",
    nguonIds: ["bt_dan_toc_hoc", "can_bo_sung"],
    daKiemChung: false
  },
  {
    id: "champa_tho_cam",
    ten: "Trang phục Chăm",
    nhomIds: ["champa"],
    gioiTinh: "chung",
    dip: ["le_hoi"],
    thoiTiet: ["nong", "mat"],
    moTaNgan: "Thổ cẩm Chăm dệt thủ công.",
    fallbackText: "Thổ cẩm Chăm dệt thủ công.",
    suThat: [
      "Thổ cẩm Chăm nổi tiếng ở làng Mỹ Nghiệp, Ninh Thuận, dệt thủ công."
    ],
    mucRemix: "co_dieu_kien",
    nguonIds: ["tt_van_hoa_dan_toc", "can_bo_sung"],
    daKiemChung: false
  },
  {
    id: "sampot",
    ten: "Sampot Khmer",
    nhomIds: ["khmer"],
    gioiTinh: "chung",
    dip: ["le_hoi"],
    thoiTiet: ["nong", "mat"],
    moTaNgan: "Vải quấn quanh hông trong trang phục Khmer.",
    fallbackText: "Vải quấn quanh hông trong trang phục Khmer.",
    suThat: [
      "Sampot là loại vải quấn quanh hông trong trang phục truyền thống Khmer.",
      "Xuất hiện trong lễ hội như Chol Chnam Thmay (Tết Khmer)."
    ],
    mucRemix: "co_dieu_kien",
    nguonIds: ["tt_van_hoa_dan_toc", "can_bo_sung"],
    daKiemChung: false
  }
];
