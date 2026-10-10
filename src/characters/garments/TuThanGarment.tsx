/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * ÁO TỨ THÂN YẾM ĐÀO (TU THAN GARMENT RENDERER)
 * Đặc trưng: yếm lụa trong, 4 thân ngoài, thắt vạt bụng, váy đụp đen
 */

import React from "react";
import { GarmentRenderProps, GarmentRenderResult, COMMON_GARMENT_STYLE } from "./types";
import { renderFootwear } from "../accessories/FootwearRenderer";

export function renderTuThanGarment({
  soDo,
  mauHex,
  patternFill,
  hasSneaker = false,
}: GarmentRenderProps): GarmentRenderResult {
  const skirtFill = "#18181b";
  const yemFill = "#d98ba0";
  const daiLietFill = "#d9a441";

  const armOffset = soDo.isMale ? 18 : 13;
  const elbowOffset = soDo.isMale ? 16 : 13;
  const armpitY = soDo.isMale ? soDo.bustY - 10 : soDo.bustY - 8;

  const childrenVayQuan = (
    <g id="tuthan-vay" className="garment-transition">
      <style>{COMMON_GARMENT_STYLE}</style>
      {/* Váy đụp lụa đen tuyền xòe mềm mại, ôm trọn vùng hông kín đáo */}
      <path
        d={`
          M ${200 - soDo.eo - 4} ${soDo.waistY - 8}
          C ${200 - soDo.eo - 6} ${soDo.waistY + 14}, ${200 - soDo.hong - 8} ${soDo.hipY - 12}, ${200 - soDo.hong - 8} ${soDo.hipY}
          C ${200 - soDo.hong - 8} ${soDo.hipY + 30}, ${200 - soDo.hong - 10} ${soDo.kneeY}, ${200 - soDo.hong - 12} ${soDo.ankleY - 8}
          Q 200 ${soDo.ankleY - 2}, ${200 + soDo.hong + 12} ${soDo.ankleY - 8}
          C ${200 + soDo.hong + 10} ${soDo.kneeY}, ${200 + soDo.hong + 8} ${soDo.hipY + 30}, ${200 + soDo.hong + 8} ${soDo.hipY}
          C ${200 + soDo.hong + 8} ${soDo.hipY - 12}, ${200 + soDo.eo + 6} ${soDo.waistY + 14}, ${200 + soDo.eo + 4} ${soDo.waistY - 8}
          Q 200 ${soDo.waistY - 4}, ${200 - soDo.eo - 4} ${soDo.waistY - 8}
          Z
        `}
        fill={skirtFill}
        stroke="#09090b"
        strokeWidth="1.2"
      />
    </g>
  );

  const childrenAo = (
    <g id="tuthan-ao" className="garment-transition">
      <style>{COMMON_GARMENT_STYLE}</style>

      {/* 1. Thân áo tứ thân và hai vạt sau: bao bọc sườn nách và hông kín đáo */}
      <path
        d={`
          M ${200 - soDo.neckHalfWidth - 3} ${soDo.neckY}
          L ${200 - soDo.vai} ${soDo.shoulderY}
          L ${200 - soDo.armpitX - 2} ${soDo.armpitY}
          C ${200 - soDo.eo - 6} ${(soDo.armpitY + soDo.waistY) / 2}, ${200 - soDo.eo - 6} ${soDo.waistY}, ${200 - soDo.eo - 6} ${soDo.waistY}
          C ${200 - soDo.hong - 8} ${soDo.hipY - 10}, ${200 - soDo.hong - 8} ${soDo.hipY}, ${200 - soDo.hong - 6} ${soDo.hipY + 20}
          L ${200 - soDo.hong - 4} ${soDo.kneeY + 25}
          L ${200 + soDo.hong + 4} ${soDo.kneeY + 25}
          L ${200 + soDo.hong + 6} ${soDo.hipY + 20}
          C ${200 + soDo.hong + 8} ${soDo.hipY}, ${200 + soDo.hong + 8} ${soDo.hipY - 10}, ${200 + soDo.eo + 6} ${soDo.waistY}
          C ${200 + soDo.eo + 6} ${soDo.waistY}, ${200 + soDo.eo + 6} ${(soDo.armpitY + soDo.waistY) / 2}, ${200 + soDo.armpitX + 2} ${soDo.armpitY}
          L ${200 + soDo.vai} ${soDo.shoulderY}
          L ${200 + soDo.neckHalfWidth + 3} ${soDo.neckY}
          Z
        `}
        fill={mauHex}
        stroke="rgba(0,0,0,0.2)"
        strokeWidth="1"
      />

      {/* 2. Yếm lụa đào bên trong ôm trọn ngực */}
      <path
        d={`
          M 200 ${soDo.chinY + 8}
          L ${200 - 20} ${soDo.neckY + 4}
          L ${200 - soDo.armpitX + 2} ${soDo.armpitY + 14}
          L ${200 - soDo.eo - 4} ${soDo.waistY + 4}
          L ${200 + soDo.eo + 4} ${soDo.waistY + 4}
          L ${200 + soDo.armpitX - 2} ${soDo.armpitY + 14}
          L ${200 + 20} ${soDo.neckY + 4}
          Z
        `}
        fill={yemFill}
        stroke="rgba(0,0,0,0.15)"
        strokeWidth="1"
      />
      <circle cx="200" cy={soDo.chinY + 8} r="1.5" fill="#f43f5e" />

      {/* 3. Tay áo bên trái ôm theo dáng tay croquis */}
      <path
        d={`
          M ${200 - soDo.neckHalfWidth - 3} ${soDo.neckY}
          L ${200 - soDo.vai} ${soDo.shoulderY}
          Q ${200 - soDo.deltoidX} ${soDo.deltoidY}, ${200 - soDo.elbowOuterX} ${soDo.elbowY}
          L ${200 - soDo.wristOuterX} ${soDo.wristY}
          L ${200 - soDo.wristInnerX} ${soDo.wristY}
          Q ${200 - soDo.elbowInnerX} ${soDo.elbowY}, ${200 - soDo.armpitX} ${soDo.armpitY}
          Z
        `}
        fill={mauHex}
        stroke="rgba(0,0,0,0.2)"
        strokeWidth="1"
      />

      {/* 4. Tay áo bên phải */}
      <path
        d={`
          M ${200 + soDo.neckHalfWidth + 3} ${soDo.neckY}
          L ${200 + soDo.vai} ${soDo.shoulderY}
          Q ${200 + soDo.deltoidX} ${soDo.deltoidY}, ${200 + soDo.elbowOuterX} ${soDo.elbowY}
          L ${200 + soDo.wristOuterX} ${soDo.wristY}
          L ${200 + soDo.wristInnerX} ${soDo.wristY}
          Q ${200 + soDo.elbowInnerX} ${soDo.elbowY}, ${200 + soDo.armpitX} ${soDo.armpitY}
          Z
        `}
        fill={mauHex}
        stroke="rgba(0,0,0,0.2)"
        strokeWidth="1"
      />

      {/* 5. Hai vạt trước mở khép, thắt vạt duyên dáng trước bụng */}
      <path
        d={`
          M ${200 - soDo.vai} ${soDo.shoulderY}
          L ${200 - 12} ${soDo.waistY}
          L 200 ${soDo.waistY + 16}
          L ${200 - 16} ${soDo.hipY + 36}
          L ${200 - 4} ${soDo.hipY + 40}
          L 200 ${soDo.waistY + 22}
          L ${200 + 4} ${soDo.hipY + 40}
          L ${200 + 16} ${soDo.hipY + 36}
          L 200 ${soDo.waistY + 16}
          L ${200 + 12} ${soDo.waistY}
          L ${200 + soDo.vai} ${soDo.shoulderY}
          L ${200 + soDo.neckHalfWidth + 4} ${soDo.neckY}
          L ${200 - soDo.neckHalfWidth - 4} ${soDo.neckY}
          Z
        `}
        fill={mauHex}
        stroke="rgba(0,0,0,0.25)"
        strokeWidth="1.2"
      />

      {/* 6. Hoa văn trang trí */}
      {patternFill && (
        <path
          d={`
            M ${200 - soDo.vai} ${soDo.shoulderY}
            L ${200 - 12} ${soDo.waistY}
            L 200 ${soDo.waistY + 16}
            L ${200 - 16} ${soDo.hipY + 36}
            L ${200 - 4} ${soDo.hipY + 40}
            L 200 ${soDo.waistY + 22}
            L ${200 + 4} ${soDo.hipY + 40}
            L ${200 + 16} ${soDo.hipY + 36}
            L 200 ${soDo.waistY + 16}
            L ${200 + 12} ${soDo.waistY}
            L ${200 + soDo.vai} ${soDo.shoulderY}
            L ${200 + soDo.neckHalfWidth + 4} ${soDo.neckY}
            L ${200 - soDo.neckHalfWidth - 4} ${soDo.neckY}
            Z
          `}
          fill={patternFill}
          style={{ mixBlendMode: "screen" }}
        />
      )}

      {/* 7. Dải thắt lưng bao tượng vàng nghệ */}
      <rect
        x={200 - soDo.eo - 2}
        y={soDo.waistY - 4}
        width={soDo.eo * 2 + 4}
        height="12"
        fill={daiLietFill}
        stroke="#b45309"
        strokeWidth="1"
        rx="2"
      />
      <path
        d={`
          M 200 ${soDo.waistY + 8}
          L ${200 - 8} ${soDo.hipY + 15}
          L ${200 - 2} ${soDo.hipY + 16}
          L 200 ${soDo.waistY + 12}
          L ${200 + 2} ${soDo.hipY + 16}
          L ${200 + 8} ${soDo.hipY + 15}
          Z
        `}
        fill={daiLietFill}
        stroke="#b45309"
        strokeWidth="1"
      />
    </g>
  );

  return { childrenVayQuan, childrenAo };
}
