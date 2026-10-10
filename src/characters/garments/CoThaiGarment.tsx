/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * ÁO CỎM VÁY THÁI (CO THAI GARMENT RENDERER)
 * Đặc trưng: áo ngắn ôm khít eo, cạp váy thổ cẩm, cúc bướm bạc (khau buom)
 */

import React from "react";
import { GarmentRenderProps, GarmentRenderResult, COMMON_GARMENT_STYLE } from "./types";
import { renderFootwear } from "../accessories/FootwearRenderer";

export function renderCoThaiGarment({
  soDo,
  mauHex,
  patternFill,
  hasSneaker = false,
}: GarmentRenderProps): GarmentRenderResult {
  const skirtFill = "#111827";

  const armOffset = soDo.isMale ? 18 : 13;
  const elbowOffset = soDo.isMale ? 16 : 13;
  const armpitY = soDo.isMale ? soDo.bustY - 10 : soDo.bustY - 8;

  const childrenVayQuan = (
    <g id="cothai-vay" className="garment-transition">
      <style>{COMMON_GARMENT_STYLE}</style>
      {/* Thân váy đen tuyền suông dài tới cổ chân, ôm trọn vùng hông */}
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
        stroke="#030712"
        strokeWidth="1.2"
      />
      {/* Cạp váy dệt thổ cẩm Thái rực rỡ */}
      <rect
        x={200 - soDo.eo - 3}
        y={soDo.waistY - 4}
        width={soDo.eo * 2 + 6}
        height="14"
        fill="#b91c1c"
        stroke="#7f1d1d"
        strokeWidth="1"
        rx="2"
      />
      <line
        x1={200 - soDo.eo - 2}
        y1={soDo.waistY + 3}
        x2={200 + soDo.eo + 2}
        y2={soDo.waistY + 3}
        stroke="#facc15"
        strokeWidth="2"
        strokeDasharray="4 2"
      />
      {hasSneaker && renderFootwear(soDo, ["sneaker"])}
    </g>
  );

  const childrenAo = (
    <g id="cothai-ao" className="garment-transition">
      <style>{COMMON_GARMENT_STYLE}</style>

      {/* 1. Tay áo cỏm bên trái ôm gọn */}
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

      {/* 2. Tay áo cỏm bên phải */}
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

      {/* 3. Thân áo cỏm: ôm khít vòng eo con kiến */}
      <path
        d={`
          M ${200 - soDo.neckHalfWidth} ${soDo.neckY + 4}
          L ${200 - soDo.vai} ${soDo.shoulderY}
          L ${200 - soDo.armpitX} ${soDo.armpitY}
          Q ${200 - soDo.eo - 1} ${(soDo.armpitY + soDo.waistY) / 2}, ${200 - soDo.eo} ${soDo.waistY}
          L ${200 + soDo.eo} ${soDo.waistY}
          Q ${200 + soDo.eo + 1} ${(soDo.armpitY + soDo.waistY) / 2}, ${200 + soDo.armpitX} ${soDo.armpitY}
          L ${200 + soDo.vai} ${soDo.shoulderY}
          L ${200 + soDo.neckHalfWidth} ${soDo.neckY + 4}
          Q 200 ${soDo.neckY + 14}, ${200 - soDo.neckHalfWidth} ${soDo.neckY + 4}
          Z
        `}
        fill={mauHex}
        stroke="rgba(0,0,0,0.2)"
        strokeWidth="1.2"
      />

      {patternFill && (
        <path
          d={`
            M ${200 - soDo.neckHalfWidth} ${soDo.neckY + 4}
            L ${200 - soDo.vai} ${soDo.shoulderY}
            L ${200 - soDo.nguc + 3} ${armpitY}
            Q ${200 - soDo.eo - 1} ${(soDo.shoulderY + soDo.waistY) / 2}, ${200 - soDo.eo} ${soDo.waistY}
            L ${200 + soDo.eo} ${soDo.waistY}
            Q ${200 + soDo.eo + 1} ${(soDo.shoulderY + soDo.waistY) / 2}, ${200 + soDo.nguc - 3} ${armpitY}
            L ${200 + soDo.vai} ${soDo.shoulderY}
            L ${200 + soDo.neckHalfWidth} ${soDo.neckY + 4}
            Q 200 ${soDo.neckY + 18}, ${200 - soDo.neckHalfWidth} ${soDo.neckY + 4}
            Z
          `}
          fill={patternFill}
          style={{ mixBlendMode: "screen" }}
        />
      )}

      {/* 4. Hàng cúc bướm bạc (khau bướm) tinh xảo */}
      <line
        x1={200}
        y1={soDo.neckY + 16}
        x2={200}
        y2={soDo.waistY - 2}
        stroke="#94a3b8"
        strokeWidth="1.2"
      />
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const y = soDo.neckY + 20 + i * ((soDo.waistY - soDo.neckY - 24) / 5);
        return (
          <g key={i} transform={`translate(200, ${y})`}>
            <circle cx="-3" cy="0" r="2" fill="#f1f5f9" stroke="#64748b" strokeWidth="0.8" />
            <circle cx="3" cy="0" r="2" fill="#f1f5f9" stroke="#64748b" strokeWidth="0.8" />
            <line x1="-1.5" y1="0" x2="1.5" y2="0" stroke="#475569" strokeWidth="1" />
          </g>
        );
      })}
    </g>
  );

  return { childrenVayQuan, childrenAo };
}
