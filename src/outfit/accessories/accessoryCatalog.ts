/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * DANH MỤC PHỤ KIỆN VIỆT PHỤC (ACCESSORIES CATALOG)
 */

export interface PhuKienPhanLoai {
  id: string;
  ten: string;
  phanLoai: "doi_dau" | "khan_quang" | "trang_suc" | "tui_xach";
  phongCach: "truyen_thong" | "remix";
  moTa: string;
  icon: string;
  nhomIds: string[];
}

export const ACCESSORY_CATALOG: PhuKienPhanLoai[] = [
  // 1. Đội đầu
  {
    id: "non_la",
    ten: "Nón lá bài thơ xứ Huế",
    phanLoai: "doi_dau",
    phongCach: "truyen_thong",
    moTa: "Nón lá kè lồng hoa văn bài thơ và phong cảnh sông Hương êm đềm.",
    icon: "👒",
    nhomIds: ["kh", "kn", "kb"],
  },
  {
    id: "khan_dong",
    ten: "Khăn đóng cổ truyền",
    phanLoai: "doi_dau",
    phongCach: "truyen_thong",
    moTa: "Vành khăn đóng đen hoặc xanh thẫm trang trọng, lịch lãm.",
    icon: "👑",
    nhomIds: ["kh", "kb"],
  },
  {
    id: "khan_mo_qua",
    ten: "Khăn mỏ quạ liền chị",
    phanLoai: "doi_dau",
    phongCach: "truyen_thong",
    moTa: "Khăn lụa đen gấp hình tam giác ôm gọn khuôn trăng duyên dáng.",
    icon: "🧣",
    nhomIds: ["kb"],
  },
  {
    id: "non_quai_thao",
    ten: "Nón quai thao trẩy hội",
    phanLoai: "doi_dau",
    phongCach: "truyen_thong",
    moTa: "Nón thúng rộng vành đính dải thao buông dài chấm ngực.",
    icon: "🏮",
    nhomIds: ["kb"],
  },
  {
    id: "khan_pieu",
    ten: "Khăn piêu thêu dệt Thái",
    phanLoai: "doi_dau",
    phongCach: "truyen_thong",
    moTa: "Khăn thêu hoa văn chim chóc, cây cỏ rực rỡ với chùm vải cút piêu đỏ.",
    icon: "🌺",
    nhomIds: ["thai"],
  },

  // 2. Khăn quàng
  {
    id: "khan_ran",
    ten: "Khăn rằn Nam Bộ",
    phanLoai: "khan_quang",
    phongCach: "truyen_thong",
    moTa: "Khăn kẻ ca-rô đen trắng hoặc đỏ trắng che nắng gió sông Tiền sông Hậu.",
    icon: "🌾",
    nhomIds: ["kn"],
  },

  // 3. Trang sức
  {
    id: "vong_bac",
    ten: "Kiềng bạc thủ công",
    phanLoai: "trang_suc",
    phongCach: "truyen_thong",
    moTa: "Kiềng bạc chạm khắc hoa sen, chim muông bảo vệ sức khỏe và mang lại may mắn.",
    icon: "💍",
    nhomIds: ["mong", "thai", "kb"],
  },
  {
    id: "tram_cai",
    ten: "Trâm cài ngọc / gỗ",
    phanLoai: "trang_suc",
    phongCach: "truyen_thong",
    moTa: "Trâm cài giữ búi tóc gọn gàng, tăng vẻ phong lưu quý phái.",
    icon: "🪄",
    nhomIds: ["kb", "kh"],
  },
  {
    id: "vong_tay_dong",
    ten: "Vòng tay đồng Tây Nguyên",
    phanLoai: "trang_suc",
    phongCach: "truyen_thong",
    moTa: "Vòng đồng xoắn đúc tay của người Ê Đê, Gia Rai.",
    icon: "✨",
    nhomIds: ["ede"],
  },

  // 4. Túi xách & Đồ remix
  {
    id: "tote",
    ten: "Túi tote vải mộc remix",
    phanLoai: "tui_xach",
    phongCach: "remix",
    moTa: "Túi vải canvas dệt mộc tiện dụng kết hợp hài hòa với tà áo xưa.",
    icon: "👜",
    nhomIds: [],
  },
];
