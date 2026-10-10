/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * ÁO BÀ BA NAM BỘ (BA BA GARMENT RENDERER)
 * Đặc trưng: dáng gọn cổ tròn, xẻ tà ngắn hai bên hông, 2 túi vuông trước bụng
 */

import React from "react";
import { GarmentRenderProps, GarmentRenderResult, COMMON_GARMENT_STYLE } from "./types";
import { renderFootwear } from "../accessories/FootwearRenderer";

export function renderBaBaGarment({
  soDo,
  mauHex,
  patternFill,
  hasSneaker = false,
}: GarmentRenderProps): GarmentRenderResult {
  const pantsFill = "#18181b";

  const armOffset = soDo.isMale ? 18 : 13;
  const elbowOffset = soDo.isMale ? 16 : 13;
  const armpitY = soDo.isMale ? soDo.bustY - 10 : soDo.bustY - 8;

  const childrenVayQuan = (
    <g id="baba-quan" className="garment-transition">
      <style>{COMMON_GARMENT_STYLE}</style>
      {/* Quần lụa đen Nam Bộ ôm eo, ôm trọn hông, xòe suông ống rộng thanh thoát */}
      <path
        d={`
          M ${200 - soDo.eo - 4} ${soDo.waistY - 8}
          C ${200 - soDo.eo - 6} ${soDo.waistY + 14}, ${200 - soDo.hong - 8} ${soDo.hipY - 12}, ${200 - soDo.hong - 8} ${soDo.hipY}
          C ${200 - soDo.hong - 8} ${soDo.hipY + 30}, ${200 - soDo.hong - 4} ${soDo.kneeY}, ${200 - soDo.legWidth * 1.55} ${soDo.ankleY + 12}
          L ${200 - 6} ${soDo.ankleY + 12}
          Q ${200 - 3} ${(soDo.crotchY + soDo.ankleY) / 2}, ${200} ${soDo.crotchY}
          Q ${200 + 3} ${(soDo.crotchY + soDo.ankleY) / 2}, ${200 + 6} ${soDo.ankleY + 12}
          L ${200 + soDo.legWidth * 1.55} ${soDo.ankleY + 12}
          C ${200 + soDo.hong + 4} ${soDo.kneeY}, ${200 + soDo.hong + 8} ${soDo.hipY + 30}, ${200 + soDo.hong + 8} ${soDo.hipY}
          C ${200 + soDo.hong + 8} ${soDo.hipY - 12}, ${200 + soDo.eo + 6} ${soDo.waistY + 14}, ${200 + soDo.eo + 4} ${soDo.waistY - 8}
          Q 200 ${soDo.waistY - 4}, ${200 - soDo.eo - 4} ${soDo.waistY - 8}
          Z
        `}
        fill={pantsFill}
        stroke="#09090b"
        strokeWidth="1.2"
      />
      {/* Đường ly chỉ giữa quần */}
      <line
        x1="200"
        y1={soDo.waistY + 3}
        x2="200"
        y2={soDo.crotchY}
        stroke="#27272a"
        strokeWidth="0.8"
        opacity="0.8"
      />
      {hasSneaker && renderFootwear(soDo, ["sneaker"])}
    </g>
  );

  const childrenAo = (
    <g id="baba-ao" className="garment-transition">
      <style>{COMMON_GARMENT_STYLE}</style>

      {/* 1. Tay áo bà ba bên trái ôm sát dáng tay */}
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

      {/* 2. Tay áo bà ba bên phải */}
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

      {/* 3. Thân áo bà ba: dáng gọn, ngắn ngang hông, xẻ tà nhỏ 2 bên */}
      <path
        d={`
          M ${200 - soDo.neckHalfWidth} ${soDo.neckY + 4}
          L ${200 - soDo.vai} ${soDo.shoulderY}
          L ${200 - soDo.armpitX} ${soDo.armpitY}
          C ${200 - soDo.eo - 2} ${(soDo.armpitY + soDo.waistY) / 2}, ${200 - soDo.eo - 2} ${soDo.waistY}, ${200 - soDo.eo - 2} ${soDo.waistY}
          C ${200 - soDo.hong - 5} ${soDo.hipY - 10}, ${200 - soDo.hong - 5} ${soDo.hipY}, ${200 - soDo.hong - 4} ${soDo.hipY + 8}
          L ${200 + soDo.hong + 4} ${soDo.hipY + 8}
          C ${200 + soDo.hong + 5} ${soDo.hipY}, ${200 + soDo.hong + 5} ${soDo.hipY - 10}, ${200 + soDo.eo + 2} ${soDo.waistY}
          C ${200 + soDo.eo + 2} ${soDo.waistY}, ${200 + soDo.eo + 2} ${(soDo.armpitY + soDo.waistY) / 2}, ${200 + soDo.armpitX} ${soDo.armpitY}
          L ${200 + soDo.vai} ${soDo.shoulderY}
          L ${200 + soDo.neckHalfWidth} ${soDo.neckY + 4}
          Q 200 ${soDo.neckY + 16}, ${200 - soDo.neckHalfWidth} ${soDo.neckY + 4}
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
            M ${200 - soDo.neckHalfWidth} ${soDo.neckY + 4}
            L ${200 - soDo.vai} ${soDo.shoulderY}
            L ${200 - soDo.armpitX} ${soDo.armpitY}
            Q ${200 - soDo.eo - 1} ${(soDo.armpitY + soDo.waistY) / 2}, ${200 - soDo.eo} ${soDo.waistY}
            L ${200 - soDo.hong + 2} ${soDo.hipY + 8}
            L ${200 + soDo.hong - 2} ${soDo.hipY + 8}
            L ${200 + soDo.eo} ${soDo.waistY}
            Q ${200 + soDo.eo + 1} ${(soDo.armpitY + soDo.waistY) / 2}, ${200 + soDo.armpitX} ${soDo.armpitY}
            L ${200 + soDo.vai} ${soDo.shoulderY}
            L ${200 + soDo.neckHalfWidth} ${soDo.neckY + 4}
            Q 200 ${soDo.neckY + 16}, ${200 - soDo.neckHalfWidth} ${soDo.neckY + 4}
            Z
          `}
          fill={patternFill}
          style={{ mixBlendMode: "screen" }}
        />
      )}

      {/* 5. Cổ tròn áo bà ba duyên dáng */}
      <path
        d={`
          M ${200 - soDo.neckHalfWidth} ${soDo.neckY + 4}
          Q 200 ${soDo.neckY + 18}, ${200 + soDo.neckHalfWidth} ${soDo.neckY + 4}
        `}
        fill="none"
        stroke="rgba(0,0,0,0.25)"
        strokeWidth="1.2"
      />

      {/* 6. Hàng cúc áo bà ba phía trước ngực */}
      <line
        x1={200}
        y1={soDo.neckY + 18}
        x2={200}
        y2={soDo.hipY + 8}
        stroke="rgba(0,0,0,0.2)"
        strokeWidth="1.2"
      />
      {[0, 1, 2, 3, 4].map((i) => {
        const cy = soDo.neckY + 22 + i * ((soDo.hipY - soDo.neckY - 14) / 4);
        return (
          <circle
            key={i}
            cx={200}
            cy={cy}
            r="2"
            fill="#ffffff"
            stroke="#64748b"
            strokeWidth="0.8"
          />
        );
      })}

      {/* 7. Hai túi vuông nổi đặc trưng phía trước vạt áo */}
      <rect
        x={200 - soDo.hong + 6}
        y={soDo.waistY + 8}
        width={soDo.hong * 0.45}
        height={soDo.hong * 0.45}
        fill="none"
        stroke="rgba(0,0,0,0.25)"
        strokeWidth="1"
        rx="2"
      />
      <rect
        x={200 + soDo.hong * 0.55 - 6}
        y={soDo.waistY + 8}
        width={soDo.hong * 0.45}
        height={soDo.hong * 0.45}
        fill="none"
        stroke="rgba(0,0,0,0.25)"
        strokeWidth="1"
        rx="2"
      />
    </g>
  );

  return { childrenVayQuan, childrenAo };
}
