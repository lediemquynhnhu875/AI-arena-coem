/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * BẢNG MÀU VẢI DI SẢN (COLORS CATALOG)
 */

import { MauSac } from "../../types";

export interface MauSacNangCao extends MauSac {
  nguHanh?: "Kim" | "Mộc" | "Thủy" | "Hỏa" | "Thổ";
  dipMac?: string;
  nguonGoc?: string;
}

export const COLOR_PALETTE: MauSacNangCao[] = [
  {
    id: "m_do",
    ten: "Đỏ điều",
    hex: "#B3261E",
    yNghia: "May mắn, hỷ sự; hợp Tết và cưới hỏi trọn vẹn.",
    nguHanh: "Hỏa",
    dipMac: "Lễ cưới, Tết Nguyên Đán, hội xuân",
    nguonGoc: "Sỏi son khoáng & hạt điều màu cổ truyền",
  },
  {
    id: "m_vang",
    ten: "Vàng nghệ",
    hex: "#D9A441",
    yNghia: "Sung túc, phúc lộc; từng gắn với trang phục hoàng gia và lễ nghi.",
    nguHanh: "Thổ",
    dipMac: "Lễ hội cung đình, hội đình làng, dịp long trọng",
    nguonGoc: "Chiết xuất củ nghệ già vùng đất phù sa",
  },
  {
    id: "m_cham",
    ten: "Xanh chàm",
    hex: "#1F3A5F",
    yNghia: "Giản dị, mộc mạc và bền bỉ; màu sắc của đất trời và núi rừng Tây Bắc.",
    nguHanh: "Thủy",
    dipMac: "Mặc thường nhật, hội lồng tồng, chợ phiên",
    nguonGoc: "Lá cây chàm ngâm ủ vôi tôi truyền thống",
  },
  {
    id: "m_trang",
    ten: "Trắng ngà lụa",
    hex: "#F3ECDD",
    yNghia: "Thanh khiết, tao nhã; gắn với tà áo dài nữ sinh và phong thái sĩ tử.",
    nguHanh: "Kim",
    dipMac: "Dạo phố, trường học, lễ chùa đầu năm",
    nguonGoc: "Kén tơ tằm dệt tay chưa qua tẩy hóa chất",
  },
  {
    id: "m_reu",
    ten: "Xanh rêu cổ",
    hex: "#5C6B4F",
    yNghia: "Trầm lắng, bền bỉ; màu của ngói cổ đình làng và cây cỏ bình dị.",
    nguHanh: "Mộc",
    dipMac: "Hội hè thôn quê, viếng cảnh chùa thanh tịnh",
    nguonGoc: "Lá cây bàng & vỏ cây tự nhiên",
  },
  {
    id: "m_nau",
    ten: "Nâu đất phù sa",
    hex: "#8A5A3B",
    yNghia: "Mộc mạc, chân chất; sắc màu thân thương của người nông dân và áo bà ba.",
    nguHanh: "Thổ",
    dipMac: "Lao động, đi chợ nổi, sinh hoạt đời thường",
    nguonGoc: "Củ nâu ngâm nước phù sa đồng bằng",
  },
  {
    id: "m_hongsen",
    ten: "Hồng cánh sen",
    hex: "#D98BA0",
    yNghia: "Nhẹ nhàng, thanh thoát; tượng trưng cho quốc hoa sen hồng cao quý.",
    nguHanh: "Hỏa",
    dipMac: "Lễ hội hoa, trẩy hội xuân, tiệc trà thanh lịch",
    nguonGoc: "Chiết xuất thảo mộc nhuộm hoa hồng cổ",
  },
];
