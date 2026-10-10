/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * TRANG PHỤC THỔ CẨM Ê ĐÊ (EDE GARMENT RENDERER)
 * Đặc trưng: áo chui đầu cổ thuyền/chữ U, váy tấm quấn thân, sọc chỉ đỏ vàng Tây Nguyên
 */

import React from "react";
import { GarmentRenderProps, GarmentRenderResult, COMMON_GARMENT_STYLE } from "./types";
import { renderFootwear } from "../accessories/FootwearRenderer";

export function renderEDeGarment({
  soDo,
  mauHex,
  patternFill,
  hasSneaker = false,
}: GarmentRenderProps): GarmentRenderResult {
  const skirtFill = "#0f172a";

  const armOffset = soDo.isMale ? 18 : 13;
  const elbowOffset = soDo.isMale ? 16 : 13;
  const armpitY = soDo.isMale ? soDo.bustY - 10 : soDo.bustY - 8;

  const childrenVayQuan = (
    <g id="ede-vay" className="garment-transition">
      <style>{COMMON_GARMENT_STYLE}</style>

      {/* Váy tấm Ê Đê quấn ôm thân, bao trọn hông buông dài xuống mắt cá */}
      <path
        d={`
          M ${200 - soDo.eo - 4} ${soDo.waistY - 8}
          C ${200 - soDo.eo - 6} ${soDo.waistY + 14}, ${200 - soDo.hong - 8} ${soDo.hipY - 12}, ${200 - soDo.hong - 8} ${soDo.hipY}
          C ${200 - soDo.hong - 8} ${soDo.hipY + 20}, ${200 - soDo.hong - 4} ${soDo.kneeY}, ${200 - soDo.legWidth * 1.35} ${soDo.ankleY + 4}
          L ${200 + soDo.legWidth * 1.35} ${soDo.ankleY + 4}
          C ${200 + soDo.hong + 4} ${soDo.kneeY}, ${200 + soDo.hong + 8} ${soDo.hipY + 20}, ${200 + soDo.hong + 8} ${soDo.hipY}
          C ${200 + soDo.hong + 8} ${soDo.hipY - 12}, ${200 + soDo.eo + 6} ${soDo.waistY + 14}, ${200 + soDo.eo + 4} ${soDo.waistY - 8}
          Q 200 ${soDo.waistY - 4}, ${200 - soDo.eo - 4} ${soDo.waistY - 8}
          Z
        `}
        fill={skirtFill}
        stroke="#020617"
        strokeWidth="1.2"
      />

      {/* Dải hoa văn thổ cẩm sọc chỉ đỏ vàng Tây Nguyên ở gấu váy */}
      <rect
        x={200 - soDo.legWidth * 1.3}
        y={soDo.ankleY - 20}
        width={soDo.legWidth * 2.6}
        height="18"
        fill="url(#hoa-van-ede)"
        stroke="#dc2626"
        strokeWidth="1"
      />

      {hasSneaker && renderFootwear(soDo, ["sneaker"])}
    </g>
  );

  const childrenAo = (
    <g id="ede-ao" className="garment-transition">
      <style>{COMMON_GARMENT_STYLE}</style>

      {/* 1. Tay áo bên trái ôm theo dáng tay croquis */}
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
      <line
        x1={200 - soDo.wristOuterX}
        y1={soDo.wristY - 4}
        x2={200 - soDo.wristInnerX}
        y2={soDo.wristY - 4}
        stroke="#ef4444"
        strokeWidth="2.5"
      />

      {/* 2. Tay áo bên phải */}
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
      <line
        x1={200 + soDo.wristInnerX}
        y1={soDo.wristY - 4}
        x2={200 + soDo.wristOuterX}
        y2={soDo.wristY - 4}
        stroke="#ef4444"
        strokeWidth="2.5"
      />

      {/* 3. Thân áo chui đầu cổ thuyền / cổ U viền chỉ đỏ */}
      <path
        d={`
          M ${200 - soDo.neckHalfWidth - 8} ${soDo.neckY + 6}
          L ${200 - soDo.vai} ${soDo.shoulderY}
          L ${200 - soDo.armpitX} ${soDo.armpitY}
          Q ${200 - soDo.eo - 1} ${(soDo.armpitY + soDo.waistY) / 2}, ${200 - soDo.eo} ${soDo.waistY + 4}
          L ${200 + soDo.eo} ${soDo.waistY + 4}
          Q ${200 + soDo.eo + 1} ${(soDo.armpitY + soDo.waistY) / 2}, ${200 + soDo.armpitX} ${soDo.armpitY}
          L ${200 + soDo.vai} ${soDo.shoulderY}
          L ${200 + soDo.neckHalfWidth + 8} ${soDo.neckY + 6}
          Q 200 ${soDo.neckY + 18}, ${200 - soDo.neckHalfWidth - 8} ${soDo.neckY + 6}
          Z
        `}
        fill={mauHex}
        stroke="rgba(0,0,0,0.25)"
        strokeWidth="1.2"
      />

      {/* 4. Viền cổ thuyền đỏ đặc trưng Ê Đê */}
      <path
        d={`
          M ${200 - soDo.neckHalfWidth - 8} ${soDo.neckY + 6}
          Q 200 ${soDo.neckY + 18}, ${200 + soDo.neckHalfWidth + 8} ${soDo.neckY + 6}
        `}
        fill="none"
        stroke="#ef4444"
        strokeWidth="2.5"
      />

      {/* 5. Dải thổ cẩm sọc chỉ ngang ngực */}
      <rect
        x={200 - soDo.eo + 2}
        y={soDo.shoulderY + 12}
        width={(soDo.eo - 2) * 2}
        height="14"
        fill="url(#hoa-van-ede)"
        stroke="#dc2626"
        strokeWidth="0.8"
      />

      {/* 6. Hoa văn mượn */}
      {patternFill && (
        <path
          d={`
            M ${200 - soDo.neckHalfWidth - 8} ${soDo.neckY + 6}
            L ${200 - soDo.vai} ${soDo.shoulderY}
            L ${200 - soDo.nguc + 3} ${armpitY}
            Q ${200 - soDo.eo - 1} ${(soDo.shoulderY + soDo.waistY) / 2}, ${200 - soDo.eo} ${soDo.waistY + 4}
            L ${200 + soDo.eo} ${soDo.waistY + 4}
            Q ${200 + soDo.eo + 1} ${(soDo.shoulderY + soDo.waistY) / 2}, ${200 + soDo.nguc - 3} ${armpitY}
            L ${200 + soDo.vai} ${soDo.shoulderY}
            L ${200 + soDo.neckHalfWidth + 8} ${soDo.neckY + 6}
            Q 200 ${soDo.neckY + 18}, ${200 - soDo.neckHalfWidth - 8} ${soDo.neckY + 6}
            Z
          `}
          fill={patternFill}
          style={{ mixBlendMode: "screen" }}
        />
      )}
    </g>
  );

  return { childrenVayQuan, childrenAo };
}
