/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * TRANG PHỤC H'MÔNG VÁY LANH (MONG GARMENT RENDERER)
 * Đặc trưng: dệt lanh sáp ong, váy xòe rộng xếp nếp nón cụt, tạp dề trước, xà cạp
 */

import React from "react";
import { GarmentRenderProps, GarmentRenderResult, COMMON_GARMENT_STYLE } from "./types";
import { renderFootwear } from "../accessories/FootwearRenderer";

export function renderMongGarment({
  soDo,
  mauHex,
  patternFill,
  hasSneaker = false,
}: GarmentRenderProps): GarmentRenderResult {
  const skirtFill = "#1e293b";
  const apronFill = "#0f172a";

  const armOffset = soDo.isMale ? 18 : 13;
  const elbowOffset = soDo.isMale ? 16 : 13;
  const armpitY = soDo.isMale ? soDo.bustY - 10 : soDo.bustY - 8;

  const childrenVayQuan = (
    <g id="mong-vay" className="garment-transition">
      <style>{COMMON_GARMENT_STYLE}</style>

      {/* Xà cạp quấn bắp chân */}
      <path
        d={`
          M ${200 - soDo.legWidth * 1.5} ${soDo.kneeY + 14}
          L ${200 - soDo.legWidth * 1.3} ${soDo.ankleY + 6}
          L ${200 - 6} ${soDo.ankleY + 6}
          L ${200 - 6} ${soDo.kneeY + 14}
          Z
        `}
        fill="#1e293b"
        stroke="#0f172a"
        strokeWidth="1"
      />
      <path
        d={`
          M ${200 + soDo.legWidth * 1.5} ${soDo.kneeY + 14}
          L ${200 + soDo.legWidth * 1.3} ${soDo.ankleY + 6}
          L ${200 + 6} ${soDo.ankleY + 6}
          L ${200 + 6} ${soDo.kneeY + 14}
          Z
        `}
        fill="#1e293b"
        stroke="#0f172a"
        strokeWidth="1"
      />

      {/* Váy lanh Mông xòe xếp ly rộng */}
      <path
        d={`
          M ${200 - soDo.eo - 4} ${soDo.waistY - 8}
          Q ${200 - soDo.hong - 10} ${soDo.hipY + 20}, ${200 - soDo.hong - 20} ${soDo.ankleY - 12}
          Q 200 ${soDo.ankleY - 6}, ${200 + soDo.hong + 20} ${soDo.ankleY - 12}
          Q ${200 + soDo.hong + 10} ${soDo.hipY + 20}, ${200 + soDo.eo + 4} ${soDo.waistY - 8}
          Q 200 ${soDo.waistY - 4}, ${200 - soDo.eo - 4} ${soDo.waistY - 8}
          Z
        `}
        fill={skirtFill}
        stroke="#0f172a"
        strokeWidth="1.2"
      />

      {/* Dải hoa văn thổ cẩm sáp ong viền gấu váy */}
      <path
        d={`
          M ${200 - soDo.hong - 18} ${soDo.ankleY - 26}
          L ${200 - soDo.hong - 20} ${soDo.ankleY - 12}
          Q 200 ${soDo.ankleY - 6}, ${200 + soDo.hong + 20} ${soDo.ankleY - 12}
          L ${200 + soDo.hong + 18} ${soDo.ankleY - 26}
          Q 200 ${soDo.ankleY - 20}, ${200 - soDo.hong - 18} ${soDo.ankleY - 26}
          Z
        `}
        fill="url(#hoa-van-mong)"
        stroke="#b91c1c"
        strokeWidth="1"
      />

      {/* Tạp dề trước (vải buông che trước bụng) */}
      <path
        d={`
          M ${200 - soDo.eo * 0.45} ${soDo.waistY + 2}
          L ${200 - soDo.eo * 0.55} ${soDo.kneeY + 20}
          L ${200 + soDo.eo * 0.55} ${soDo.kneeY + 20}
          L ${200 + soDo.eo * 0.45} ${soDo.waistY + 2}
          Z
        `}
        fill={apronFill}
        stroke="#334155"
        strokeWidth="1"
      />
      <line
        x1={200 - soDo.eo * 0.52}
        y1={soDo.kneeY + 14}
        x2={200 + soDo.eo * 0.52}
        y2={soDo.kneeY + 14}
        stroke="#dc2626"
        strokeWidth="2"
      />

      {hasSneaker && renderFootwear(soDo, ["sneaker"])}
    </g>
  );

  const childrenAo = (
    <g id="mong-ao" className="garment-transition">
      <style>{COMMON_GARMENT_STYLE}</style>

      {/* Tay áo bên trái ôm theo dáng tay croquis */}
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
      <rect
        x={200 - soDo.wristOuterX}
        y={soDo.wristY - 10}
        width={soDo.wristOuterX - soDo.wristInnerX}
        height="10"
        fill="#dc2626"
      />

      {/* Tay áo bên phải */}
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
      <rect
        x={200 + soDo.wristInnerX}
        y={soDo.wristY - 10}
        width={soDo.wristOuterX - soDo.wristInnerX}
        height="10"
        fill="#dc2626"
      />

      {/* Thân áo Mông vạt đắp chéo cổ chữ V thêu thổ cẩm */}
      <path
        d={`
          M ${200 - soDo.neckHalfWidth - 2} ${soDo.neckY + 2}
          L ${200 - soDo.vai} ${soDo.shoulderY}
          L ${200 - soDo.armpitX} ${soDo.armpitY}
          Q ${200 - soDo.eo - 1} ${(soDo.armpitY + soDo.waistY) / 2}, ${200 - soDo.eo} ${soDo.waistY}
          L ${200 + soDo.eo} ${soDo.waistY}
          Q ${200 + soDo.eo + 1} ${(soDo.armpitY + soDo.waistY) / 2}, ${200 + soDo.armpitX} ${soDo.armpitY}
          L ${200 + soDo.vai} ${soDo.shoulderY}
          L ${200 + soDo.neckHalfWidth + 2} ${soDo.neckY + 2}
          L 200 ${soDo.neckY + 22}
          Z
        `}
        fill={mauHex}
        stroke="rgba(0,0,0,0.25)"
        strokeWidth="1.2"
      />

      {/* Nẹp cổ thêu hoa văn sặc sỡ */}
      <path
        d={`
          M ${200 - soDo.neckHalfWidth - 2} ${soDo.neckY + 2}
          L 200 ${soDo.neckY + 22}
          L ${200 + soDo.neckHalfWidth + 2} ${soDo.neckY + 2}
        `}
        fill="none"
        stroke="#dc2626"
        strokeWidth="4"
      />

      {/* Hoa văn mượn */}
      {patternFill && (
        <path
          d={`
            M ${200 - soDo.neckHalfWidth - 2} ${soDo.neckY + 2}
            L ${200 - soDo.vai} ${soDo.shoulderY}
            L ${200 - soDo.nguc + 3} ${armpitY}
            Q ${200 - soDo.eo - 1} ${(soDo.shoulderY + soDo.waistY) / 2}, ${200 - soDo.eo} ${soDo.waistY}
            L ${200 + soDo.eo} ${soDo.waistY}
            Q ${200 + soDo.eo + 1} ${(soDo.shoulderY + soDo.waistY) / 2}, ${200 + soDo.nguc - 3} ${armpitY}
            L ${200 + soDo.vai} ${soDo.shoulderY}
            L ${200 + soDo.neckHalfWidth + 2} ${soDo.neckY + 2}
            L 200 ${soDo.neckY + 22}
            Z
          `}
          fill={patternFill}
          style={{ mixBlendMode: "screen" }}
        />
      )}

      {/* Thắt lưng vải đỏ to bản quấn eo */}
      <rect
        x={200 - soDo.eo - 2}
        y={soDo.waistY - 5}
        width={soDo.eo * 2 + 4}
        height="12"
        fill="#b91c1c"
        stroke="#7f1d1d"
        strokeWidth="1"
        rx="1"
      />
    </g>
  );

  return { childrenVayQuan, childrenAo };
}
