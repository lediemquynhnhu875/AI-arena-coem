/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LuatMau, LuatRemix } from "../types";

export const luatMau: LuatMau[] = [
  { a: "m_do", b: "m_vang", ketQua: "hai_hoa", lyDo: "Đỏ và vàng là cặp quen thuộc của dịp Tết và cưới." },
  { a: "m_do", b: "m_trang", ketQua: "hai_hoa", lyDo: "Đỏ trên nền trắng ngà làm bộ đồ sáng và gọn." },
  { a: "m_vang", b: "m_cham", ketQua: "hai_hoa", lyDo: "Vàng ấm nổi lên trên nền chàm trầm." },
  { a: "m_cham", b: "m_trang", ketQua: "hai_hoa", lyDo: "Chàm và trắng ngà cho cảm giác giản dị, thanh." },
  { a: "m_reu", b: "m_nau", ketQua: "hai_hoa", lyDo: "Hai gam đất và cây cỏ hòa vào nhau." },
  { a: "m_hongsen", b: "m_trang", ketQua: "hai_hoa", lyDo: "Hồng sen và trắng ngà nhẹ, dễ nhìn." },
  { a: "m_do", b: "m_reu", ketQua: "can_can_bang", lyDo: "Đỏ và xanh rêu tương phản mạnh; nên chia tỷ lệ, để một màu làm chính." },
  { a: "m_do", b: "m_hongsen", ketQua: "can_can_bang", lyDo: "Hai sắc đỏ–hồng gần nhau dễ lấn át nhau; nên thêm một màu trung tính." },
  { a: "m_vang", b: "m_hongsen", ketQua: "can_can_bang", lyDo: "Hai màu sáng cùng nổi; nên thêm một màu trầm để cân." },
  { a: "*", b: "*", ketQua: "hai_hoa", lyDo: "Cặp này chưa có ghi chú riêng; nhìn chung hòa hợp." }
];

export const luatRemix: LuatRemix[] = [
  {
    id: "r1",
    khi: { trangPhuc: ["aodai"], phuKienBatKy: ["sneaker", "tote"] },
    nhan: "sang_tao",
    lyDo: "Cách tân phụ kiện là hướng remix quen thuộc."
  },
  {
    id: "r2",
    khi: { trangPhuc: ["aodai"], phuKienBatKy: ["non_la"] },
    nhan: "chuan",
    lyDo: "Áo dài và nón lá là cặp quen thuộc."
  },
  {
    id: "r3",
    khi: { trangPhuc: ["tu_than"], phuKienBatKy: ["khan_mo_qua", "non_quai_thao"] },
    nhan: "chuan",
    lyDo: "Đây là cách phối đi cùng áo tứ thân."
  },
  {
    id: "r4",
    khi: { trangPhuc: ["tu_than"], phuKienBatKy: ["khan_dong"] },
    nhan: "can_xem_lai",
    lyDo: "Khăn đóng thường gắn với nam giới; đội với trang phục nữ Bắc Bộ là kết hợp lệch bối cảnh.",
    goiYThayThe: "Bạn có thể thay bằng khăn mỏ quạ hoặc nón quai thao để đúng điệu phụ nữ Bắc Bộ xưa."
  },
  {
    id: "r5",
    khi: { trangPhuc: ["aodai"], phuKienBatKy: ["khan_pieu"] },
    nhan: "sang_tao",
    lyDo: "Lấy cảm hứng từ khăn piêu của phụ nữ Thái; nên ghi nguồn cảm hứng."
  },
  {
    id: "r6",
    khi: { trangPhuc: ["co_thai"], hoaVanThem: "mong" },
    nhan: "can_xem_lai",
    lyDo: "Trộn đặc trưng của hai dân tộc trong cùng một bộ dễ làm mất ý nghĩa riêng; nên giữ một nguồn chính.",
    goiYThayThe: "Bạn có thể giữ nguyên nét trang nhã thuần túy của áo cóm Thái hoặc phối cùng khăn piêu truyền thống."
  },
  {
    id: "r7",
    khi: { trangPhuc: ["ba_ba"], phuKienBatKy: ["khan_ran"] },
    nhan: "chuan",
    lyDo: "Áo bà ba và khăn rằn thường đi cùng nhau."
  },
  {
    id: "mac_dinh",
    khi: {},
    nhan: "sang_tao",
    lyDo: "Cách phối này chưa có ghi chú riêng; xem như sáng tạo cá nhân."
  }
];
