/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * ÁO NGŨ THÂN LẬP LĨNH (NGU THAN GARMENT RENDERER)
 * Đặc trưng: 5 thân vải, cổ đứng cao, vạt dài qua gối, cài 5 khuy cúc
 */

import React from "react";
import { GarmentRenderProps, GarmentRenderResult, COMMON_GARMENT_STYLE } from "./types";
import { renderFootwear } from "../accessories/FootwearRenderer";

export function renderNguThanGarment({
  soDo,
  mauHex,
  patternFill,
  hasSneaker = false,
}: GarmentRenderProps): GarmentRenderResult {
  const pantsFill = "#f5f0e6";
  const buttonFill = "#d9a441";

  const armOffset = soDo.isMale ? 18 : 13;
  const elbowOffset = soDo.isMale ? 16 : 13;
  const armpitY = soDo.isMale ? soDo.bustY - 10 : soDo.bustY - 8;

  const childrenVayQuan = (
    <g id="nguthan-quan" className="garment-transition">
      <style>{COMMON_GARMENT_STYLE}</style>
      {/* Quần bạch thái hà trang trọng ôm eo, bao trọn hông buông ống phủ mắt cá chân */}
      <path
        d={`
          M ${200 - soDo.eo - 2} ${soDo.waistY + 2}
          C ${200 - soDo.eo - 4} ${soDo.waistY + 20}, ${200 - soDo.hong - 5} ${soDo.hipY - 15}, ${200 - soDo.hong - 5} ${soDo.hipY}
          C ${200 - soDo.hong - 5} ${soDo.hipY + 30}, ${200 - soDo.hong - 2} ${soDo.kneeY}, ${200 - soDo.legWidth * 1.6} ${soDo.ankleY + 12}
          L ${200 - 6} ${soDo.ankleY + 12}
          Q ${200 - 3} ${(soDo.crotchY + soDo.ankleY) / 2}, ${200} ${soDo.crotchY}
          Q ${200 + 3} ${(soDo.crotchY + soDo.ankleY) / 2}, ${200 + 6} ${soDo.ankleY + 12}
          L ${200 + soDo.legWidth * 1.6} ${soDo.ankleY + 12}
          C ${200 + soDo.hong + 2} ${soDo.kneeY}, ${200 + soDo.hong + 5} ${soDo.hipY + 30}, ${200 + soDo.hong + 5} ${soDo.hipY}
          C ${200 + soDo.hong + 5} ${soDo.hipY - 15}, ${200 + soDo.eo + 4} ${soDo.waistY + 20}, ${200 + soDo.eo + 2} ${soDo.waistY + 2}
          Q 200 ${soDo.waistY + 4}, ${200 - soDo.eo - 2} ${soDo.waistY + 2}
          Z
        `}
        fill={pantsFill}
        stroke="#d1c7b7"
        strokeWidth="1.2"
      />
      {/* Đường nẹp chỉ đứng giữa quần */}
      <line
        x1="200"
        y1={soDo.waistY + 3}
        x2="200"
        y2={soDo.crotchY}
        stroke="#d1c7b7"
        strokeWidth="0.8"
        opacity="0.8"
      />
      {hasSneaker && renderFootwear(soDo, ["sneaker"])}
    </g>
  );

  const childrenAo = (
    <g id="nguthan-ao" className="garment-transition">
      <style>{COMMON_GARMENT_STYLE}</style>

      {/* 1. Tà sau buông rộng trang trọng quá gối */}
      <path
        d={`
          M ${200 - soDo.eo - 3} ${soDo.waistY}
          Q ${200 - soDo.hong - 4} ${soDo.hipY + 15}, ${200 - soDo.hong - 8} ${soDo.kneeY + 24}
          L ${200 + soDo.hong + 8} ${soDo.kneeY + 24}
          Q ${200 + soDo.hong + 4} ${soDo.hipY + 15}, ${200 + soDo.eo + 3} ${soDo.waistY}
          Z
        `}
        fill={mauHex}
        stroke="rgba(0,0,0,0.2)"
        strokeWidth="1.2"
        opacity="0.88"
      />

      {/* 2. Tay áo thụng thoải mái bên trái */}
      <path
        d={`
          M ${200 - soDo.neckHalfWidth - 3} ${soDo.neckY}
          L ${200 - soDo.vai - 2} ${soDo.shoulderY}
          Q ${200 - soDo.deltoidX - 3} ${soDo.deltoidY}, ${200 - soDo.elbowOuterX - 4} ${soDo.elbowY}
          L ${200 - soDo.wristOuterX - 3} ${soDo.wristY}
          L ${200 - soDo.wristInnerX + 2} ${soDo.wristY}
          Q ${200 - soDo.elbowInnerX - 3} ${soDo.elbowY}, ${200 - soDo.armpitX} ${soDo.armpitY}
          Z
        `}
        fill={mauHex}
        stroke="rgba(0,0,0,0.2)"
        strokeWidth="1"
      />

      {/* 3. Tay áo thụng thoải mái bên phải */}
      <path
        d={`
          M ${200 + soDo.neckHalfWidth + 3} ${soDo.neckY}
          L ${200 + soDo.vai + 2} ${soDo.shoulderY}
          Q ${200 + soDo.deltoidX + 3} ${soDo.deltoidY}, ${200 + soDo.elbowOuterX + 4} ${soDo.elbowY}
          L ${200 + soDo.wristOuterX + 3} ${soDo.wristY}
          L ${200 + soDo.wristInnerX - 2} ${soDo.wristY}
          Q ${200 + soDo.elbowInnerX + 3} ${soDo.elbowY}, ${200 + soDo.armpitX} ${soDo.armpitY}
          Z
        `}
        fill={mauHex}
        stroke="rgba(0,0,0,0.2)"
        strokeWidth="1"
      />

      {/* 4. Thân trước áo ngũ thân: vạt đè sang sườn phải, vạt dài qua gối */}
      <path
        d={`
          M ${200 - soDo.neckHalfWidth} ${soDo.neckY + 4}
          L ${200 - soDo.vai - 1} ${soDo.shoulderY}
          L ${200 - soDo.armpitX} ${soDo.armpitY}
          Q ${200 - soDo.eo - 2} ${(soDo.armpitY + soDo.waistY) / 2}, ${200 - soDo.eo - 3} ${soDo.waistY}
          Q ${200 - soDo.hong - 3} ${soDo.hipY + 15}, ${200 - soDo.hong - 6} ${soDo.kneeY + 24}
          L ${200 + soDo.hong + 6} ${soDo.kneeY + 24}
          Q ${200 + soDo.hong + 3} ${soDo.hipY + 15}, ${200 + soDo.eo + 3} ${soDo.waistY}
          Q ${200 + soDo.eo + 2} ${(soDo.armpitY + soDo.waistY) / 2}, ${200 + soDo.armpitX} ${soDo.armpitY}
          L ${200 + soDo.vai + 1} ${soDo.shoulderY}
          L ${200 + soDo.neckHalfWidth} ${soDo.neckY + 4}
          Z
        `}
        fill={mauHex}
        stroke="rgba(0,0,0,0.25)"
        strokeWidth="1.2"
      />

      {/* 5. Hoa văn truyền thống phủ trên thân áo */}
      {patternFill && (
        <path
          d={`
            M ${200 - soDo.neckHalfWidth} ${soDo.neckY + 4}
            L ${200 - soDo.vai - 1} ${soDo.shoulderY}
            L ${200 - soDo.armpitX} ${soDo.armpitY}
            Q ${200 - soDo.eo - 2} ${(soDo.armpitY + soDo.waistY) / 2}, ${200 - soDo.eo - 3} ${soDo.waistY}
            Q ${200 - soDo.hong - 3} ${soDo.hipY + 15}, ${200 - soDo.hong - 6} ${soDo.kneeY + 24}
            L ${200 + soDo.hong + 6} ${soDo.kneeY + 24}
            Q ${200 + soDo.hong + 3} ${soDo.hipY + 15}, ${200 + soDo.eo + 3} ${soDo.waistY}
            Q ${200 + soDo.eo + 2} ${(soDo.armpitY + soDo.waistY) / 2}, ${200 + soDo.armpitX} ${soDo.armpitY}
            L ${200 + soDo.vai + 1} ${soDo.shoulderY}
            L ${200 + soDo.neckHalfWidth} ${soDo.neckY + 4}
            Z
          `}
          fill={patternFill}
          style={{ mixBlendMode: "screen" }}
        />
      )}

      {/* 6. Cổ đứng cao trang nghiêm (Cổ lập lĩnh truyền thống) */}
      <path
        d={`
          M ${200 - soDo.neckHalfWidth} ${soDo.neckY + 4}
          L ${200 - soDo.neckHalfWidth + 1} ${soDo.chinY + 4}
          Q 200 ${soDo.chinY + 6}, ${200 + soDo.neckHalfWidth - 1} ${soDo.chinY + 4}
          L ${200 + soDo.neckHalfWidth} ${soDo.neckY + 4}
          Z
        `}
        fill={mauHex}
        stroke="rgba(0,0,0,0.3)"
        strokeWidth="1.2"
      />

      {/* 7. Đường vạt đè chéo sang sườn phải */}
      <path
        d={`
          M 200 ${soDo.chinY + 5}
          Q ${200 + 10} ${soDo.neckY + 4}, ${200 + soDo.neckHalfWidth + 8} ${soDo.shoulderY + 6}
          L ${200 + soDo.eo + 3} ${soDo.waistY}
          L ${200 + soDo.hong + 6} ${soDo.kneeY + 24}
        `}
        fill="none"
        stroke="rgba(0,0,0,0.2)"
        strokeWidth="1.2"
      />

      {/* 8. 5 chiếc cúc đồng ngũ khuy truyền thống */}
      {[
        { x: 200, y: soDo.chinY + 5 },
        { x: 200 + 12, y: soDo.neckY + 5 },
        { x: 200 + soDo.neckHalfWidth + 6, y: soDo.shoulderY + 8 },
        { x: 200 + soDo.eo + 2, y: (soDo.shoulderY + soDo.waistY) / 2 + 4 },
        { x: 200 + soDo.eo + 3, y: soDo.waistY },
      ].map((btn, idx) => (
        <circle
          key={idx}
          cx={btn.x}
          cy={btn.y}
          r="2.8"
          fill={buttonFill}
          stroke="#92400e"
          strokeWidth="0.8"
        />
      ))}
    </g>
  );

  return { childrenVayQuan, childrenAo };
}
