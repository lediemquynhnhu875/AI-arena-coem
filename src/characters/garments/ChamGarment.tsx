/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * TRANG PHỤC THỔ CẨM CHĂM (CHAM GARMENT RENDERER)
 * Đặc trưng: áo dài chui đầu kín đáo, thắt lưng Talei Ka-in, hoa văn tháp Chăm
 */

import React from "react";
import { GarmentRenderProps, GarmentRenderResult, COMMON_GARMENT_STYLE } from "./types";
import { renderFootwear } from "../accessories/FootwearRenderer";

export function renderChamGarment({
  soDo,
  mauHex,
  patternFill,
  hasSneaker = false,
}: GarmentRenderProps): GarmentRenderResult {
  const skirtFill = "#1e1b4b";
  const sashFill = "#dc2626";

  const armOffset = soDo.isMale ? 18 : 13;
  const elbowOffset = soDo.isMale ? 16 : 13;
  const armpitY = soDo.isMale ? soDo.bustY - 10 : soDo.bustY - 8;

  const childrenVayQuan = (
    <g id="champa-vay" className="garment-transition">
      <style>{COMMON_GARMENT_STYLE}</style>
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
        stroke="#0f172a"
        strokeWidth="1.2"
      />
    </g>
  );

  const childrenAo = (
    <g id="champa-ao" className="garment-transition">
      <style>{COMMON_GARMENT_STYLE}</style>

      {/* 1. Tay áo dài Chăm kín đáo bên trái */}
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

      {/* 2. Tay áo dài Chăm bên phải */}
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

      {/* 3. Thân áo dài Chăm: áo chui đầu buông dài qua gối kín đáo, che trọn hông */}
      <path
        d={`
          M ${200 - soDo.neckHalfWidth - 3} ${soDo.neckY + 4}
          L ${200 - soDo.vai} ${soDo.shoulderY}
          L ${200 - soDo.armpitX} ${soDo.armpitY}
          C ${200 - soDo.eo - 2} ${(soDo.armpitY + soDo.waistY) / 2}, ${200 - soDo.eo - 3} ${soDo.waistY}, ${200 - soDo.eo - 3} ${soDo.waistY}
          C ${200 - soDo.hong - 5} ${soDo.hipY - 10}, ${200 - soDo.hong - 5} ${soDo.hipY}, ${200 - soDo.hong - 4} ${soDo.hipY + 20}
          L ${200 - soDo.hong + 4} ${soDo.kneeY + 20}
          L ${200 - soDo.hong + 6} ${soDo.ankleY - 14}
          L ${200 + soDo.hong - 6} ${soDo.ankleY - 14}
          L ${200 + soDo.hong - 4} ${soDo.kneeY + 20}
          L ${200 + soDo.hong - 4} ${soDo.hipY + 20}
          C ${200 + soDo.hong + 5} ${soDo.hipY}, ${200 + soDo.hong + 5} ${soDo.hipY - 10}, ${200 + soDo.eo + 3} ${soDo.waistY}
          C ${200 + soDo.eo + 3} ${soDo.waistY}, ${200 + soDo.eo + 2} ${(soDo.armpitY + soDo.waistY) / 2}, ${200 + soDo.armpitX} ${soDo.armpitY}
          L ${200 + soDo.vai} ${soDo.shoulderY}
          L ${200 + soDo.neckHalfWidth + 3} ${soDo.neckY + 4}
          Q 200 ${soDo.neckY + 16}, ${200 - soDo.neckHalfWidth - 3} ${soDo.neckY + 4}
          Z
        `}
        fill={mauHex}
        stroke="rgba(0,0,0,0.25)"
        strokeWidth="1.2"
      />

      {/* 4. Hoa văn trang trí */}
      {patternFill && (
        <path
          d={`
            M ${200 - soDo.neckHalfWidth - 3} ${soDo.neckY + 4}
            L ${200 - soDo.vai} ${soDo.shoulderY}
            L ${200 - soDo.nguc + 3} ${armpitY}
            Q ${200 - soDo.eo - 1} ${(soDo.shoulderY + soDo.waistY) / 2}, ${200 - soDo.eo} ${soDo.waistY}
            Q ${200 - soDo.hong - 2} ${soDo.hipY + 20}, ${200 - soDo.hong + 2} ${soDo.kneeY + 20}
            L ${200 - soDo.hong + 6} ${soDo.ankleY - 14}
            L ${200 + soDo.hong - 6} ${soDo.ankleY - 14}
            L ${200 + soDo.hong - 2} ${soDo.kneeY + 20}
            Q ${200 + soDo.hong + 2} ${soDo.hipY + 20}, ${200 + soDo.eo} ${soDo.waistY}
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

      {/* 5. Thắt lưng Talei Ka-in dệt thổ cẩm Chăm */}
      <rect
        x={200 - soDo.eo - 2}
        y={soDo.waistY - 2}
        width={soDo.eo * 2 + 4}
        height="10"
        fill={sashFill}
        stroke="#991b1b"
        strokeWidth="1"
        rx="1"
      />
      {/* Dải thắt lưng rủ bên hông */}
      <path
        d={`
          M ${200 + soDo.eo - 6} ${soDo.waistY + 8}
          L ${200 + soDo.eo - 2} ${soDo.hipY + 30}
          L ${200 + soDo.eo + 6} ${soDo.hipY + 30}
          L ${200 + soDo.eo + 2} ${soDo.waistY + 8}
          Z
        `}
        fill="url(#hoa-van-champa)"
        stroke="#991b1b"
        strokeWidth="1"
      />
    </g>
  );

  return { childrenVayQuan, childrenAo };
}
