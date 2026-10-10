/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * BẢNG MÀU DI SẢN & HỆ THỐNG MÀU SẮC (HERITAGE PALETTE & COLOR SYSTEM)
 * Quản lý tập trung mọi mã màu, biến màu, tên gọi văn hóa và tokens chủ đề.
 */

export interface ColorDef {
  name: string;
  vietnameseName: string;
  hex: string;
  description: string;
  culturalOrigin: string;
}

/**
 * 1. BẢNG MÀU TRUYỀN THỐNG VIỆT NAM (CORE HERITAGE COLORS)
 */
export const HERITAGE_COLORS = {
  // Đỏ son tranh Đông Hồ & tranh Hàng Trống
  SON_DONG_HO: {
    name: "son-dong-ho",
    vietnameseName: "Đỏ Son Đông Hồ",
    hex: "#C1272D",
    description: "Màu son khoáng điều chế từ sỏi son núi đá, dùng trong tranh dân gian Đông Hồ.",
    culturalOrigin: "Tranh dân gian Đông Hồ, Bắc Ninh",
  },
  // Đất nung gốm Bát Tràng & Phù Lãng
  DAT_NUNG: {
    name: "dat-nung",
    vietnameseName: "Đất Nung Bát Tràng",
    hex: "#B5502F",
    description: "Màu gạch gốm mộc nung già lửa của các lò gốm đồng bằng Bắc Bộ.",
    culturalOrigin: "Làng gốm Bát Tràng, Gia Lâm, Hà Nội",
  },
  // Vàng nghệ củ sấy & Vàng hoàng gia
  VANG_NGHE: {
    name: "vang-nghe",
    vietnameseName: "Vàng Nghệ Khắc Vàng",
    hex: "#B7740C", // Bản tương phản cao cho nền sáng
    description: "Sắc vàng ấm chiết xuất từ củ nghệ già, biểu trưng cho đất phù sa màu mỡ và sắc áo hoàng gia.",
    culturalOrigin: "Nhuộm thảo mộc cổ truyền Việt Nam",
  },
  VANG_HOANG_GIA: {
    name: "vang-hoang-gia",
    vietnameseName: "Vàng Hoàng Kim Ánh Nguyệt",
    hex: "#D9A441", // Bản vàng sáng cho nền tối và ánh hoàng kim
    description: "Sắc vàng ánh trăng soi bóng nước đêm hè.",
    culturalOrigin: "Màu chỉ thêu kim tuyến cung đình Huế",
  },
  // Xanh rêu phong mái ngói cổ & đình làng
  REU_PHONG: {
    name: "reu-phong",
    vietnameseName: "Xanh Rêu Phong Cổ Tự",
    hex: "#3B533E",
    description: "Màu xanh trầm lắng của lớp rêu bám trên ngói âm dương, tường đình miếu qua trăm năm.",
    culturalOrigin: "Kiến trúc đình chùa cổ truyền Bắc Bộ",
  },
  // Tro bếp & sắc chàm nhuộm
  TRO_TRAM: {
    name: "tro-tram",
    vietnameseName: "Tro Trầm Chàm Nhuộm",
    hex: "#686154",
    description: "Sắc trầm của tro rơm bếp ấm pha với nước chàm vùng cao.",
    culturalOrigin: "Nghề nhuộm chàm vùng Tây Bắc",
  },
  // Mực nho thư pháp
  MUC_NHO: {
    name: "muc-nho",
    vietnameseName: "Than Mực Nho",
    hex: "#162225",
    description: "Màu đen tuyền sâu lắng của thỏi mực mài viết liễn đối, văn tự cổ.",
    culturalOrigin: "Thư pháp & Hán Nôm Việt",
  },
  // Lụa tơ tằm nguyên bản
  LUA_TO_TAM: {
    name: "lua-to-tam",
    vietnameseName: "Trắng Ngà Lụa Tơ Tằm",
    hex: "#FAF8F5",
    description: "Màu trắng ngà ấm của sợi tơ tằm dệt tay làng Vạn Phúc chưa qua tẩy hóa chất.",
    culturalOrigin: "Làng lụa Vạn Phúc, Hà Đông",
  },
  // Sắc vàng Cò Em & hoa đăng
  DOM_DOM_GOLD: {
    name: "co-em-gold",
    vietnameseName: "Ánh Vàng Cò Em",
    hex: "#FACC15",
    description: "Sắc vàng tươi sáng, ấm áp của nón lá và dải lúa chín đồng bằng.",
    culturalOrigin: "Văn hóa đồng quê Nam Bộ & làng quê Việt Nam",
  },
  CO_EM_GOLD: {
    name: "co-em-gold",
    vietnameseName: "Ánh Vàng Cò Em",
    hex: "#FACC15",
    description: "Sắc vàng tươi sáng, ấm áp của nón lá và dải lúa chín đồng bằng.",
    culturalOrigin: "Văn hóa đồng quê Nam Bộ & làng quê Việt Nam",
  },
  // Ngọc bích đồng nội
  NGOC_BICH: {
    name: "ngoc-bich",
    vietnameseName: "Ngọc Bích Đồng Nội",
    hex: "#34D399",
    description: "Sắc xanh ngọc bích trong veo của đồng lúa non mướt mát.",
    culturalOrigin: "Ngọc bích thời Lê - Nguyễn",
  },
} as const;

/**
 * 2. CẤU HÌNH TOKENS THEO CHỦ ĐỀ SÁNG / TỐI (LIGHT & DARK TOKENS)
 */
export const THEME_COLOR_TOKENS = {
  light: {
    name: "Bạch Nhật (Sáng Trắng Tinh Khôi)",
    canvas: "#FAF8F5",         // Nền canvas sáng trắng ngà lụa tơ tằm thanh tao
    card: "#FFFFFF",           // Nền thẻ thông tin trắng tinh sạch
    cardSecondary: "#F4EFE6",  // Nền thẻ phụ / ô bấm nhẹ
    border: "#D8CFBE",         // Viền thẻ ánh hổ phách nhạt
    borderSubtle: "rgba(185, 119, 14, 0.18)",
    textPrimary: "#141F22",    // Chữ chính (đen than mộc đậm, tương phản > 14:1)
    textMuted: "#3E4E52",      // Chữ phụ / mô tả sắc nét, tương phản > 7:1 đạt chuẩn AAA
    textInverse: "#FAF8F5",    // Chữ tương phản khi trên nền đậm
    accentGold: "#965700",     // Vàng nghệ chủ đạo tương phản cao sắc sảo trên nền sáng
    accentRed: "#C1272D",      // Đỏ son điểm nhấn
    accentGreen: "#3B533E",    // Xanh rêu
    sidebarBackground: "rgba(255, 255, 255, 0.96)",
    sidebarBorder: "rgba(185, 119, 14, 0.22)",
    cardShadow: "0 4px 18px -2px rgba(27, 42, 46, 0.08)",
  },
  dark: {
    name: "Huyền Dạ (Đêm Tối Cổ Phong)",
    canvas: "#111A1D",         // Nền đêm cổ phong êm dịu mắt
    card: "#1A2629",           // Nền thẻ tối phiến đá trầm
    cardSecondary: "#223236",  // Nền thẻ phụ / ô hover
    border: "rgba(217, 164, 65, 0.32)",
    borderSubtle: "rgba(217, 164, 65, 0.15)",
    textPrimary: "#F7F3E8",    // Chữ sáng ngà ánh trăng, tương phản > 13:1
    textMuted: "#CAD8D5",      // Chữ phụ sáng rõ thanh thoát, tuyệt đối không bị chìm tối
    textInverse: "#141F22",
    accentGold: "#F2BE42",     // Vàng hoàng kim rực rỡ trong đêm
    accentRed: "#E0353C",
    accentGreen: "#6A825B",
    sidebarBackground: "rgba(18, 28, 31, 0.96)",
    sidebarBorder: "rgba(217, 164, 65, 0.28)",
    cardShadow: "0 4px 24px -2px rgba(0, 0, 0, 0.5)",
  },
} as const;

/**
 * 3. HÀM TIỆN ÍCH XỬ LÝ MÀU
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let c = hex.replace("#", "");
  if (c.length === 3) {
    c = c.split("").map((x) => x + x).join("");
  }
  const num = parseInt(c, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export function hexToRgba(hex: string, alpha: number): string {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
