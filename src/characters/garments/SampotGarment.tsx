/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * TRANG PHỤC KHMER SAMPOT (SAMPOT GARMENT RENDERER)
 * Đặc trưng: vải quấn quanh hông, xếp nếp giữa bụng, dải khăn chéo vai (Sbai)
 */

import React from "react";
import { GarmentRenderProps, GarmentRenderResult, COMMON_GARMENT_STYLE } from "./types";
import { renderFootwear } from "../accessories/FootwearRenderer";

export function renderSampotGarment({
  soDo,
  mauHex,
  patternFill,
  hasSneaker = false,
}: GarmentRenderProps): GarmentRenderResult {
  const sampotGoldBorder = "#d97706";

  const armOffset = soDo.isMale ? 18 : 13;
  const elbowOffset = soDo.isMale ? 16 : 13;
  const armpitY = soDo.isMale ? soDo.bustY - 10 : soDo.bustY - 8;

  const childrenVayQuan = (
    <g id="sampot-vay" className="garment-transition">
      <style>{COMMON_GARMENT_STYLE}</style>

      {/* Sampot Khmer quấn hông, ôm trọn vùng hông buông lửng qua gối */}
      <path
        d={`
          M ${200 - soDo.eo - 4} ${soDo.waistY - 8}
          C ${200 - soDo.eo - 6} ${soDo.waistY + 14}, ${200 - soDo.hong - 8} ${soDo.hipY - 12}, ${200 - soDo.hong - 8} ${soDo.hipY}
          C ${200 - soDo.hong - 8} ${soDo.hipY + 25}, ${200 - soDo.hong - 4} ${soDo.kneeY}, ${200 - soDo.hong - 2} ${soDo.kneeY + 22}
          L ${200 + soDo.hong + 2} ${soDo.kneeY + 22}
          C ${200 + soDo.hong + 4} ${soDo.kneeY}, ${200 + soDo.hong + 8} ${soDo.hipY + 25}, ${200 + soDo.hong + 8} ${soDo.hipY}
          C ${200 + soDo.hong + 8} ${soDo.hipY - 12}, ${200 + soDo.eo + 6} ${soDo.waistY + 14}, ${200 + soDo.eo + 4} ${soDo.waistY - 8}
          Q 200 ${soDo.waistY - 4}, ${200 - soDo.eo - 4} ${soDo.waistY - 8}
          Z
        `}
        fill={mauHex}
        stroke="rgba(0,0,0,0.25)"
        strokeWidth="1.2"
      />

      {/* Đường xếp nếp tinh tế chính giữa Sampot */}
      <path
        d={`
          M 200 ${soDo.waistY + 2}
          L ${200 - 8} ${soDo.kneeY + 22}
          L ${200 + 8} ${soDo.kneeY + 22}
          Z
        `}
        fill="rgba(0,0,0,0.12)"
      />
      <line
        x1="200"
        y1={soDo.waistY + 2}
        x2="200"
        y2={soDo.kneeY + 22}
        stroke={sampotGoldBorder}
        strokeWidth="1.5"
      />

      {/* Viền chỉ vàng và hoa văn sen ở gấu Sampot */}
      <rect
        x={200 - soDo.hong}
        y={soDo.kneeY + 14}
        width={soDo.hong * 2}
        height="8"
        fill="url(#hoa-van-khmer)"
        stroke={sampotGoldBorder}
        strokeWidth="1"
      />

      {hasSneaker && renderFootwear(soDo, ["sneaker"])}
    </g>
  );

  const childrenAo = (
    <g id="sampot-ao" className="garment-transition">
      <style>{COMMON_GARMENT_STYLE}</style>

      {/* 1. Tay áo tầm vông bên trái */}
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

      {/* 2. Tay áo tầm vông bên phải */}
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

      {/* 3. Thân áo ôm vừa chạm cạp thắt lưng */}
      <path
        d={`
          M ${200 - soDo.neckHalfWidth - 3} ${soDo.neckY + 4}
          L ${200 - soDo.vai} ${soDo.shoulderY}
          L ${200 - soDo.armpitX} ${soDo.armpitY}
          Q ${200 - soDo.eo - 1} ${(soDo.armpitY + soDo.waistY) / 2}, ${200 - soDo.eo - 2} ${soDo.waistY + 4}
          L ${200 + soDo.eo + 2} ${soDo.waistY + 4}
          Q ${200 + soDo.eo + 1} ${(soDo.armpitY + soDo.waistY) / 2}, ${200 + soDo.armpitX} ${soDo.armpitY}
          L ${200 + soDo.vai} ${soDo.shoulderY}
          L ${200 + soDo.neckHalfWidth + 3} ${soDo.neckY + 4}
          Q 200 ${soDo.neckY + 16}, ${200 - soDo.neckHalfWidth - 3} ${soDo.neckY + 4}
          Z
        `}
        fill={mauHex}
        stroke="rgba(0,0,0,0.25)"
        strokeWidth="1.2"
      />

      {/* 4. Dải khăn Sbai vắt chéo từ vai trái qua ngực xuống hông phải */}
      <path
        d={`
          M ${200 - soDo.neckHalfWidth - 3} ${soDo.shoulderY - 2}
          L ${200 - soDo.neckHalfWidth + 12} ${soDo.shoulderY - 2}
          L ${200 + soDo.eo + 2} ${soDo.waistY}
          L ${200 + soDo.eo - 10} ${soDo.waistY}
          Z
        `}
        fill="url(#hoa-van-khmer)"
        stroke={sampotGoldBorder}
        strokeWidth="1.2"
      />

      {/* 5. Hoa văn mượn */}
      {patternFill && (
        <path
          d={`
            M ${200 - soDo.neckHalfWidth - 3} ${soDo.neckY + 4}
            L ${200 - soDo.vai} ${soDo.shoulderY}
            L ${200 - soDo.nguc + 3} ${armpitY}
            Q ${200 - soDo.eo - 1} ${(soDo.shoulderY + soDo.waistY) / 2}, ${200 - soDo.eo} ${soDo.waistY}
            L ${200 + soDo.eo} ${soDo.waistY}
            Q ${200 + soDo.eo + 1} ${(soDo.shoulderY + soDo.waistY) / 2}, ${200 + soDo.nguc - 3} ${armpitY}
            L ${200 + soDo.vai} ${soDo.shoulderY}
            L ${200 + soDo.neckHalfWidth + 3} ${soDo.neckY + 4}
            Q 200 ${soDo.neckY + 16}, ${200 - soDo.neckHalfWidth - 3} ${soDo.neckY + 4}
            Z
          `}
          fill={patternFill}
          style={{ mixBlendMode: "screen" }}
        />
      )}

      {/* 6. Thắt lưng kim loại vàng quấn eo */}
      <rect
        x={200 - soDo.eo - 1}
        y={soDo.waistY - 3}
        width={soDo.eo * 2 + 2}
        height="8"
        fill="#facc15"
        stroke="#ca8a04"
        strokeWidth="1"
        rx="1"
      />
    </g>
  );

  return { childrenVayQuan, childrenAo };
}
