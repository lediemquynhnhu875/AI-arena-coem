/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * DỮ LIỆU ĐỀ THI AUDITION: "VIỆT PHỤC REMIX — PHONG CÁCH GEN Z"
 * Cung cấp:
 * 1. Sự kiện & Hoàn cảnh sử dụng cho học sinh, sinh viên Gen Z
 * 2. Nhu cầu người dùng & Phong cách phối đồ cá nhân
 * 3. Ma trận Ngũ Hành & Kiểm tra sự hài hòa màu sắc
 * 4. Hệ thống Gác Cổng Văn Hóa (Cảnh báo lệch chuẩn & Gợi ý Remix văn minh)
 * 5. Khuyến nghị theo thời tiết kết hợp sự kiện
 */

export interface SuKienGenZ {
  id: string;
  ten: string;
  bieuTuong: string;
  nhuCau: string;
  moTa: string;
  trangPhucDeXuat: string[];
  mauDeXuat: string[];
  phuKienDeXuat: string[];
  giayDeXuat: string;
  loiKhuyenVanHoa: string;
  phongCachMacDinh: "chuan_muc" | "y2k_remix" | "thanh_lich" | "pha_cach";
}

export interface PhongCachGenZ {
  id: "chuan_muc" | "y2k_remix" | "thanh_lich" | "pha_cach";
  ten: string;
  bieuTuong: string;
  moTa: string;
  phuKienDacTrung: string[];
  tinhThan: string;
}

export interface NguHanhColor {
  element: "Kim" | "Moc" | "Thuy" | "Hoa" | "Tho";
  hanh: string;
  tenMau: string;
  hex: string;
  yNghia: string;
}

export const SU_KIEN_GENZ: SuKienGenZ[] = [
  {
    id: "ky_yeu",
    ten: "Kỷ Yếu & Học Đường Gen Z",
    bieuTuong: "🎓",
    nhuCau: "Trẻ trung, trang nhã, thoải mái vận động cả ngày dài tại sân trường, lên hình sáng sủa.",
    moTa: "Buổi chụp ảnh kỷ niệm thời thanh xuân học sinh - sinh viên cùng bạn bè thầy cô.",
    trangPhucDeXuat: ["aodai", "ngu_than"],
    mauDeXuat: ["m_trang", "m_lam", "m_luc"],
    phuKienDeXuat: ["kieng_bac", "non_la"],
    giayDeXuat: "sneaker",
    loiKhuyenVanHoa: "Nên giữ tà áo dài phủ gót kín đáo, cổ áo 2.5 - 3cm thanh nhã; sneaker trắng là điểm chạm Gen Z tiện lợi được yêu thích.",
    phongCachMacDinh: "y2k_remix",
  },
  {
    id: "dao_pho",
    ten: "Dạo Phố Cà Phê & Check-in",
    bieuTuong: "☕",
    nhuCau: "Thoải mái, cá tính, hòa hợp không gian đô thị hiện đại hoặc quán xá hoài cổ.",
    moTa: "Cuộc hẹn cuối tuần cùng bạn bè dạo phố đi bộ, chụp ảnh film và uống trà chiều.",
    trangPhucDeXuat: ["ba_ba", "aodai", "ngu_than"],
    mauDeXuat: ["m_luc", "m_nau", "m_den"],
    phuKienDeXuat: ["khan_ran", "tote"],
    giayDeXuat: "guoc_moc",
    loiKhuyenVanHoa: "Áo bà ba hoặc áo ngũ thân lanh mộc mạc rất hợp đi cùng túi cói hoặc túi tote vải thô dạo phố.",
    phongCachMacDinh: "thanh_lich",
  },
  {
    id: "le_hoi",
    ten: "Trẩy Hội Di Sản & Đền Hùng / Phố Cổ",
    bieuTuong: "🏮",
    nhuCau: "Đậm đà phong vị văn hóa cội nguồn, hòa cùng không khí lễ hội truyền thống non nước.",
    moTa: "Tham dự các lễ hội dân gian, hành hương về đất Tổ Đền Hùng hay dạo bước đêm rằm Phố cổ Hội An.",
    trangPhucDeXuat: ["tu_than", "ngu_than"],
    mauDeXuat: ["m_nau", "m_do", "m_vang"],
    phuKienDeXuat: ["khan_mo_qua", "non_quai_thao", "kieng_bac"],
    giayDeXuat: "guoc_moc",
    loiKhuyenVanHoa: "Áo tứ thân với nón quai thao thắt quai thao buông lơi, yếm lót kín đáo thể hiện nét duyên Quan họ đằm thắm.",
    phongCachMacDinh: "chuan_muc",
  },
  {
    id: "tet",
    ten: "Tết Cổ Truyền & Du Xuân Chúc Tết",
    bieuTuong: "🧧",
    nhuCau: "Tươi tắn, sang trọng, mang lại may mắn, cát tường cho năm mới và sum vầy gia đình.",
    moTa: "Đi chúc Tết ông bà cha mẹ, trẩy hội chợ hoa xuân và vãn cảnh chùa đầu năm.",
    trangPhucDeXuat: ["ngu_than", "aodai"],
    mauDeXuat: ["m_do", "m_vang"],
    phuKienDeXuat: ["khan_dong", "quat_lua"],
    giayDeXuat: "hai_theu",
    loiKhuyenVanHoa: "Sắc đỏ son (hỏa cát) và vàng nghệ (hoàng gia) tượng trưng cho hỷ khí và tài lộc, phối cùng quạt lụa thêu sen rất đoan trang.",
    phongCachMacDinh: "chuan_muc",
  },
  {
    id: "bieu_dien",
    ten: "Sân Khấu & Nghệ Thuật Đa Bản Sắc",
    bieuTuong: "🎭",
    nhuCau: "Thị giác ấn tượng, tôn vinh nét đẹp văn hóa 54 dân tộc anh em trên sân khấu học đường.",
    moTa: "Tham gia hội diễn văn nghệ trường lớp, liên hoan giai điệu tuổi hồng hoặc thi hùng biện di sản.",
    trangPhucDeXuat: ["co_thai", "mong_lanh", "ede_tho_cam", "champa_tho_cam", "sampot"],
    mauDeXuat: ["m_cham", "m_do", "m_vang"],
    phuKienDeXuat: ["khan_pieu", "kieng_bac"],
    giayDeXuat: "hai_theu",
    loiKhuyenVanHoa: "Tôn trọng các họa tiết thổ cẩm thiêng liêng và cách thắt khăn đúng bản sắc của từng đồng bào vùng cao.",
    phongCachMacDinh: "pha_cach",
  },
  {
    id: "cuoi_hoi",
    ten: "Tiệc Cưới & Lễ Gia Tiên Thanh Lịch",
    bieuTuong: "💍",
    nhuCau: "Trang trọng, quý phái, thanh tao, tôn vinh lề lối gia phong Việt Nam.",
    moTa: "Dự lễ dạm ngõ, ăn hỏi hoặc lễ cưới theo nghi thức truyền thống trang nhã.",
    trangPhucDeXuat: ["aodai", "ngu_than"],
    mauDeXuat: ["m_do", "m_trang", "m_vang"],
    phuKienDeXuat: ["kieng_bac", "quat_lua"],
    giayDeXuat: "hai_theu",
    loiKhuyenVanHoa: "Áo ngũ thân tay chẽn hoặc áo dài gấm dệt hoa chìm đi cùng kiềng bạc sáng mang lại phong thái đài các chuẩn mực.",
    phongCachMacDinh: "thanh_lich",
  },
];

export const PHONG_CACH_GENZ: PhongCachGenZ[] = [
  {
    id: "chuan_muc",
    ten: "Cổ Điển Chuẩn Mực",
    bieuTuong: "🏛️",
    moTa: "Tôn trọng nghiêm ngặt cấu trúc nguyên bản, cúc cài đủ 5 chiếc, đi cùng hài thêu hoặc guốc mộc.",
    phuKienDacTrung: ["Khăn đóng", "Nón quai thao", "Hài thêu", "Kiềng bạc"],
    tinhThan: "Bảo tồn trọn vẹn tinh hoa cổ truyền",
  },
  {
    id: "y2k_remix",
    ten: "Gen Z Remix / Y2K",
    bieuTuong: "✨",
    moTa: "Giao thoa giữa tà áo cổ phong và tinh thần năng động Gen Z: sneaker trắng, túi tote, kính retro.",
    phuKienDacTrung: ["Sneaker trắng", "Túi vải tote", "Kính râm retro", "Nón lá bài thơ"],
    tinhThan: "Đem cổ phục bước vào nhịp sống thường nhật",
  },
  {
    id: "thanh_lich",
    ten: "Tối Giản Hiện Đại",
    bieuTuong: "🌿",
    moTa: "Tông màu pastel hoặc trung tính nhã nhặn, chất liệu lanh/đũi tự nhiên, chi tiết tinh giản.",
    phuKienDacTrung: ["Quạt lụa mộc", "Guốc mộc quai trơn", "Túi cói thủ công"],
    tinhThan: "Thanh tao, êm dịu và thời thượng",
  },
  {
    id: "pha_cach",
    ten: "Nghệ Thuật Phá Cách",
    bieuTuong: "🎨",
    moTa: "Chơi màu tương phản cao, mượn hoa văn thủy ba sóng nước, tạo hình visual ấn tượng.",
    phuKienDacTrung: ["Kiềng bạc bản lớn", "Khăn piêu cách điệu", "Màu sắc ngũ hành tương phản"],
    tinhThan: "Khẳng định cá tính sáng tạo độc bản",
  },
];

// BẢNG QUY CHIẾU MÀU SẮC THEO NGŨ HÀNH & TƯƠNG SINH TƯƠNG KHẮC
export const MAU_NGU_HANH: Record<string, NguHanhColor> = {
  m_trang: {
    element: "Kim",
    hanh: "Bạch Kim",
    tenMau: "Trắng ngà / Bạc",
    hex: "#F8FAFC",
    yNghia: "Đại diện cho sự thuần khiết, tinh khôi và liêm chính trong phẩm cách người xưa.",
  },
  m_luc: {
    element: "Moc",
    hanh: "Thanh Mộc",
    tenMau: "Xanh lá mạ / Lục",
    hex: "#10B981",
    yNghia: "Đại diện cho sinh sôi nảy nở, sự tươi mới của mùa xuân và sức sống đồng nội.",
  },
  m_cham: {
    element: "Thuy",
    hanh: "Huyền Thủy",
    tenMau: "Xanh chàm / Lam biển",
    hex: "#1E3A8A",
    yNghia: "Đại diện cho chiều sâu tri thức, đức tính điềm đạm, khoan dung như dòng nước.",
  },
  m_lam: {
    element: "Thuy",
    hanh: "Huyền Thủy",
    tenMau: "Xanh thiên thanh",
    hex: "#0284C7",
    yNghia: "Sắc trời biếc thanh cao, mang lại cảm giác bình yên và phóng khoáng.",
  },
  m_den: {
    element: "Thuy",
    hanh: "Huyền Thủy",
    tenMau: "Đen tuyền / Nước mực",
    hex: "#1E293B",
    yNghia: "Tượng trưng cho sự kiên định, thâm trầm, màu của sự mộc mạc áo bà ba.",
  },
  m_do: {
    element: "Hoa",
    hanh: "Xích Hỏa",
    tenMau: "Đỏ son / Huyết dụ",
    hex: "#DC2626",
    yNghia: "Tượng trưng cho hỷ sự, may mắn, nhiệt huyết thanh xuân và uy quyền cát tường.",
  },
  m_vang: {
    element: "Tho",
    hanh: "Hoàng Thổ",
    tenMau: "Vàng nghệ / Ánh kim",
    hex: "#EAB308",
    yNghia: "Màu của đất mẹ phì nhiêu, sự thịnh vượng, màu áo hoàng gia triều Nguyễn.",
  },
  m_nau: {
    element: "Tho",
    hanh: "Hoàng Thổ",
    tenMau: "Nâu sồng / Đất nung",
    hex: "#78350F",
    yNghia: "Sắc màu đằm thắm của củ nâu, gắn liền với nếp sống cần cù, chân chất Bắc Bộ.",
  },
};

// ĐÁNH GIÁ SỰ HÀI HÒA CỦA MÀU SẮC THEO NGŨ HÀNH & THẨM MỸ THỜI TRANG
export function kiemTraHaiHoaMauSac(
  mauAoId: string,
  mauPhuKienId?: string
): {
  diemSo: number;
  nhan: string;
  quanHeNguHanh: string;
  phanTich: string;
  loiKhuyenGenZ: string;
  elementAo: string;
  elementPhuKien: string;
} {
  const ao = MAU_NGU_HANH[mauAoId] || MAU_NGU_HANH["m_do"];
  const pk = MAU_NGU_HANH[mauPhuKienId || "m_trang"] || MAU_NGU_HANH["m_trang"];

  const tuongSinh: Record<string, string> = {
    Kim: "Thuy",
    Thuy: "Moc",
    Moc: "Hoa",
    Hoa: "Tho",
    Tho: "Kim",
  };

  const tuongKhac: Record<string, string> = {
    Kim: "Moc",
    Moc: "Tho",
    Tho: "Thuy",
    Thuy: "Hoa",
    Hoa: "Kim",
  };

  if (ao.element === pk.element) {
    return {
      diemSo: 95,
      nhan: "Đồng điệu Thanh Nhã (Tone sur Tone)",
      quanHeNguHanh: `Cùng hành ${ao.element} — Đồng thanh tương ứng`,
      phanTich: `Sự kết hợp giữa ${ao.tenMau} và ${pk.tenMau} tạo nên tổng thể đồng nhất, toát lên phong thái nền nã, không bị rối mắt.`,
      loiKhuyenGenZ: "Rất thích hợp cho ảnh kỷ yếu và sự kiện trang trọng; có thể nhấn thêm một chiếc kiềng bạc hoặc quạt lụa để tăng chiều sâu.",
      elementAo: ao.element,
      elementPhuKien: pk.element,
    };
  }

  if (tuongSinh[ao.element] === pk.element || tuongSinh[pk.element] === ao.element) {
    return {
      diemSo: 100,
      nhan: "Tương Sinh Cát Tường (Ngũ Hành Tương Sinh)",
      quanHeNguHanh: `${ao.element} sinh ${pk.element} — Vượng khí hòa hợp`,
      phanTich: `Cặp màu ${ao.tenMau} (${ao.element}) và ${pk.tenMau} (${pk.element}) hỗ trợ và nâng đỡ nhau tuyệt đối về thị giác và phong thủy truyền thống.`,
      loiKhuyenGenZ: "Điểm 10/10 cho sự kết hợp này! Bộ trang phục vừa tôn dáng vừa mang lại năng lượng tích cực, thanh thoát.",
      elementAo: ao.element,
      elementPhuKien: pk.element,
    };
  }

  if (tuongKhac[ao.element] === pk.element || tuongKhac[pk.element] === ao.element) {
    return {
      diemSo: 82,
      nhan: "Tương Phản Phá Cách (Cần Cân Bằng)",
      quanHeNguHanh: `${ao.element} đối trọng ${pk.element} — Tương phản thị giác`,
      phanTich: `Hai màu ${ao.tenMau} và ${pk.tenMau} có độ đối chọi thị giác cao, tạo nên ấn tượng thị giác mạnh mẽ trên sân khấu.`,
      loiKhuyenGenZ: "Để bản phối vừa cá tính vừa không bị gắt, Gen Z hãy giữ diện tích màu phụ kiện ở mức 15-20% làm điểm nhấn (accent color).",
      elementAo: ao.element,
      elementPhuKien: pk.element,
    };
  }

  return {
    diemSo: 90,
    nhan: "Hài Hòa Bổ Trợ (Complementary)",
    quanHeNguHanh: "Giao thoa êm dịu",
    phanTich: `Sự kết hợp giữa ${ao.tenMau} và ${pk.tenMau} tạo cảm giác dễ chịu, cân bằng giữa ấm và lạnh.`,
    loiKhuyenGenZ: "Bản phối an toàn, dễ mặc trong mọi hoàn cảnh từ đi học đến dự tiệc gia đình.",
    elementAo: ao.element,
    elementPhuKien: pk.element,
  };
}

// HỆ THỐNG GÁC CỔNG VĂN HÓA (CẢNH BÁO LỆCH CHUẨN & HƯỚNG DẪN TÔN TRỌNG)
export interface CanhBaoVanHoa {
  mucDo: "chuan_xac" | "remix_van_minh" | "can_can_nhac";
  tieuDe: string;
  noiDung: string;
  nguyenTacCotLoi: string;
  goiYKhacPhuc: string;
}

export function danhGiaVanHoaGenZ(
  trangPhucId: string,
  mauId: string,
  phuKienIds: string[],
  giayId: string,
  phongCachId: string
): CanhBaoVanHoa {
  // Cảnh báo 1: Áo ngũ thân kết hợp phụ kiện sai tính chất
  if (trangPhucId === "ngu_than" && phuKienIds.includes("khan_ran")) {
    return {
      mucDo: "can_can_nhac",
      tieuDe: "Cân nhắc bối cảnh: Áo ngũ thân và Khăn rằn Nam Bộ",
      noiDung: "Áo ngũ thân là trang phục lễ nghi khuôn thước triều Nguyễn, trong khi khăn rằn là phụ kiện lao động dân dã miền sông nước.",
      nguyenTacCotLoi: "Tôn trọng nguồn gốc địa lý và tính chất nghi lễ của từng món đồ.",
      goiYKhacPhuc: "Nên phối Áo ngũ thân cùng Khăn đóng hoặc Quạt lụa; còn Khăn rằn hãy kết hợp cùng Áo bà ba mộc mạc.",
    };
  }

  // Cảnh báo 2: Màu trắng hoặc đen toàn thân ngày Tết
  if (mauId === "m_den" && phuKienIds.includes("khan_dong")) {
    return {
      mucDo: "remix_van_minh",
      tieuDe: "Lưu ý sắc thái khi du xuân hoặc dự hỷ sự",
      noiDung: "Bộ đồ mang phong thái nho nhã trang nghiêm, nhưng nếu diện vào ngày mùng 1 Tết cổ truyền nên điểm xuyết thêm sắc đỏ hoặc phụ kiện vàng son.",
      nguyenTacCotLoi: "Tập tục ngày Tết chuộng sắc màu hỷ khí, may mắn (Hỷ sắc).",
      goiYKhacPhuc: "Bạn có thể phối thêm một chiếc quạt lụa đỏ hoặc kiềng bạc sáng để trang phục thêm phần rạng rỡ.",
    };
  }

  // Cảnh báo 3: Phối sneaker với Áo dài / Cổ phục
  if (giayId === "sneaker") {
    return {
      mucDo: "remix_van_minh",
      tieuDe: "✦ Điểm sáng Remix Gen Z: Cổ phục & Sneaker trắng",
      noiDung: "Kết hợp sneaker trắng tối giản cùng áo dài hoặc áo ngũ thân là xu hướng được thế hệ trẻ đón nhận vì sự thoải mái khi di chuyển chụp kỷ yếu.",
      nguyenTacCotLoi: "Giữ tà áo đúng phom suông, không xẻ tà quá trớn hay cộc cỡn làm mất đi sự trang nghiêm của y phục.",
      goiYKhacPhuc: "Nên ưu tiên sneaker trắng trơn cổ thấp thanh lịch, tránh các đôi giày hầm hố có màu sắc quá chói lọi.",
    };
  }

  // Mặc định: Chuẩn mực di sản
  return {
    mucDo: "chuan_xac",
    tieuDe: "✦ Bản phối đạt chuẩn giá trị di sản văn hóa",
    noiDung: "Các món trang phục và phụ kiện phối hợp ăn ý theo quy chuẩn thẩm mỹ truyền thống của người Việt.",
    nguyenTacCotLoi: "Giữ trọn vẹn tinh thần đoan trang, tôn kính cội nguồn.",
    goiYKhacPhuc: "Tự tin diện bộ trang phục này trong mọi sự kiện văn hóa, lễ hội hay không gian chụp ảnh nghệ thuật!",
  };
}
