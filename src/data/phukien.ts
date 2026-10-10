/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PhuKien } from "../types";

export const phuKien: PhuKien[] = [
  {
    id: "non_la",
    ten: "Nón lá Huế (nón bài thơ)",
    loai: "non",
    nhomIds: ["kh"],
    suThat: ["Nón bài thơ có lồng hình hoặc chữ giữa hai lớp lá."],
    mucRemix: "tu_do",
    daKiemChung: true
  },
  {
    id: "khan_dong",
    ten: "Khăn đóng",
    loai: "khan",
    nhomIds: ["kh"],
    suThat: ["Khăn đội đầu truyền thống của nam giới, thường gặp ở Huế và miền Trung."],
    mucRemix: "co_dieu_kien",
    daKiemChung: true
  },
  {
    id: "khan_mo_qua",
    ten: "Khăn mỏ quạ",
    loai: "khan",
    nhomIds: ["kb"],
    suThat: ["Thường đi cùng áo tứ thân."],
    mucRemix: "co_dieu_kien",
    daKiemChung: true
  },
  {
    id: "non_quai_thao",
    ten: "Nón quai thao",
    loai: "non",
    nhomIds: ["kb"],
    suThat: ["Thường đi cùng áo tứ thân."],
    mucRemix: "co_dieu_kien",
    daKiemChung: true
  },
  {
    id: "khan_ran",
    ten: "Khăn rằn",
    loai: "khan",
    nhomIds: ["kn"],
    suThat: ["Khăn kẻ ô, phổ biến ở Nam Bộ."],
    mucRemix: "tu_do",
    daKiemChung: true
  },
  {
    id: "khan_pieu",
    ten: "Khăn piêu",
    loai: "khan",
    nhomIds: ["thai"],
    suThat: ["Khăn thêu hoa văn của phụ nữ Thái, thường xuất hiện trong lễ hội và múa xòe."],
    mucRemix: "co_dieu_kien",
    daKiemChung: true
  },
  {
    id: "vong_bac",
    ten: "Vòng bạc",
    loai: "trang_suc",
    nhomIds: ["mong", "thai"],
    suThat: ["Trang sức bạc phổ biến ở nhiều nhóm."],
    mucRemix: "co_dieu_kien",
    daKiemChung: true
  },
  {
    id: "tram_cai",
    ten: "Trâm cài",
    loai: "trang_suc",
    nhomIds: ["kb", "kh"],
    suThat: [],
    mucRemix: "tu_do",
    daKiemChung: false
  },
  {
    id: "tote",
    ten: "Túi tote",
    loai: "hien_dai",
    nhomIds: [],
    suThat: [],
    mucRemix: "tu_do",
    daKiemChung: false
  },
  {
    id: "sneaker",
    ten: "Giày sneaker",
    loai: "hien_dai",
    nhomIds: [],
    suThat: [],
    mucRemix: "tu_do",
    daKiemChung: false
  }
];
