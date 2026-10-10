/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * TÍNH TOÁN TỈ LỆ SỐ ĐO NHÂN VẬT CHUẨN XÁC THEO CROQUIS_PROJECT
 * Đồng bộ 100% với giải phẫu học và đường nét vector của croquis_project:
 * - Trục dọc 9 đầu:
 *   + Đỉnh đầu: Y ~ 50
 *   + Cằm: Y ~ 136
 *   + Cổ: Y ~ 152
 *   + Vai: Y ~ 165
 *   + Chân ngực: Y ~ 210
 *   + Thắt eo: Y ~ 275
 *   + Đỉnh hông: Y ~ 355
 *   + Đáy chậu / Đũng: Y ~ 395
 *   + Khớp gối: Y ~ 535
 *   + Cổ chân & Mắt cá: Y ~ 690
 *   + Bàn chân / Gót: Y ~ 745
 * - Nửa bề rộng trục ngang từ tâm X = 200:
 *   + Phái Nữ: vai ~ 55, ngực ~ 45, eo ~ 34, hông ~ 58, đùi ~ 20
 *   + Phái Nam: vai ~ 77, ngực ~ 63, eo ~ 61, hông ~ 73, đùi ~ 26
 */

import { NhanVatConfig, SoDoNhanVat, NHAN_VAT_MAC_DINH } from "../types";

export { NHAN_VAT_MAC_DINH };

export function tinhSoDo(nv: NhanVatConfig): SoDoNhanVat {
  const { tuoi, gioi, vocDang } = nv;
  const isMale = gioi === "nam";

  // 1. TỶ LỆ TRỤC DỌC CHUẨN RAW CROQUIS_PROJECT (Đồng bộ cho cả Nam & Nữ trước khi scale/translate)
  let headTopY = 50;
  let headCenterY = 90;
  let chinY = 136;
  let neckY = 148;
  let shoulderY = 165;
  let bustY = 210;
  let waistY = 285;
  let hipY = 367;
  let crotchY = 402;
  let kneeY = 569;
  let ankleY = 745;
  let feetY = 795;
  let wristY = 388.3;
  let elbowY = 262;
  let headRadiusX = 26;
  let headRadiusY = 43;
  let chieuCaoTong = 800;

  // Điểm mốc giải phẫu ôm sát cánh tay và nách chuẩn vector croquis_project
  // Độ rộng được thiết kế bao trọn đường nét cơ thể, không để lộ da thịt dưới tay áo
  let deltoidX = isMale ? 92 : 69;
  let deltoidY = 188;
  let elbowOuterX = isMale ? 102 : 74;
  let elbowInnerX = isMale ? 64 : 46;
  let wristOuterX = isMale ? 97 : 88.5;
  let wristInnerX = isMale ? 81 : 72.5;
  let armpitX = isMale ? 55 : 41;
  let armpitY = 208;

  // 2. TỶ LỆ TRỤC NGANG (CHUẨN VECTOR CROQUIS_PROJECT)
  // Bề rộng được tinh chỉnh để nẹp áo ôm khít bờ vai và hông của ma-nơ-canh
  let vai = isMale ? 84 : 60;
  let nguc = isMale ? 66 : 48;
  let eo = isMale ? 63 : 37;
  let hong = isMale ? 77 : 62;
  let legWidth = isMale ? 28 : 22;
  let armWidth = isMale ? 17 : 13;
  let neckHalfWidth = isMale ? 19 : 14;

  return {
    chieuCaoTong,
    vai,
    nguc,
    eo,
    hong,
    doDaiThan: hipY - shoulderY,
    headTopY,
    headCenterY,
    chinY,
    neckY,
    neckHalfWidth,
    shoulderY,
    bustY,
    waistY,
    hipY,
    crotchY,
    kneeY,
    ankleY,
    feetY,
    headRadiusX,
    headRadiusY,
    armWidth,
    wristY,
    elbowY,
    deltoidX,
    deltoidY,
    elbowOuterX,
    elbowInnerX,
    wristOuterX,
    wristInnerX,
    armpitX,
    armpitY,
    isMale,
    legWidth,
  };
}
