/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * ÁO YẾM LỤA ĐÀO TRUYỀN THỐNG (YEM GARMENT RENDERER)
 * Tôn vinh nét đẹp phác thảo bờ vai thon, xương quai xanh và lưng ong của mẫu croquis
 */

import React from "react";
import { GarmentRenderProps, GarmentRenderResult, COMMON_GARMENT_STYLE } from "./types";
import { renderFootwear } from "../accessories/FootwearRenderer";

export function renderYemGarment({
  soDo,
  mauHex,
  patternFill,
  hasSneaker = false,
}: GarmentRenderProps): GarmentRenderResult {
  const skirtFill = "#18181b";
  const yemColor = mauHex || "#b45309";

  const childrenVayQuan = (
    <g id="yem-vay" className="garment-transition">
      <style>{COMMON_GARMENT_STYLE}</style>
      {/* Váy đụp lụa đen xòe mềm mại tôn vóc dáng */}
      <path
        d={`
          M ${200 - soDo.eo - 4} ${soDo.waistY - 8}
          Q ${200 - soDo.hong - 10} ${soDo.kneeY - 20}, ${200 - soDo.hong - 12} ${soDo.ankleY - 8}
          Q 200 ${soDo.ankleY - 2}, ${200 + soDo.hong + 12} ${soDo.ankleY - 8}
          Q ${200 + soDo.hong + 10} ${soDo.kneeY - 20}, ${200 + soDo.eo + 4} ${soDo.waistY - 8}
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
    <g id="yem-ao" className="garment-transition">
      <style>{COMMON_GARMENT_STYLE}</style>

      {/* 1. Dây yếm quàng qua cổ */}
      <path
        d={`
          M 200 ${soDo.chinY + 8}
          Q ${200 - 6} ${soDo.neckY}, ${200 - 15} ${soDo.neckY + 4}
        `}
        fill="none"
        stroke={yemColor}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d={`
          M 200 ${soDo.chinY + 8}
          Q ${200 + 6} ${soDo.neckY}, ${200 + 15} ${soDo.neckY + 4}
        `}
        fill="none"
        stroke={yemColor}
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* 2. Thân yếm lụa đào hình quả trám ôm trọn ngực và thắt eo */}
      <path
        d={`
          M 200 ${soDo.chinY + 8}
          L ${200 - 16} ${soDo.neckY + 4}
          Q ${200 - soDo.nguc} ${soDo.bustY}, ${200 - soDo.eo + 2} ${soDo.waistY}
          L ${200 + soDo.eo - 2} ${soDo.waistY}
          Q ${200 + soDo.nguc} ${soDo.bustY}, ${200 + 16} ${soDo.neckY + 4}
          Z
        `}
        fill={yemColor}
        stroke="rgba(0,0,0,0.18)"
        strokeWidth="1.2"
      />

      {/* 3. Hoa văn phủ trên yếm nếu có */}
      {patternFill && (
        <path
          d={`
            M 200 ${soDo.chinY + 8}
            L ${200 - 16} ${soDo.neckY + 4}
            Q ${200 - soDo.nguc} ${soDo.bustY}, ${200 - soDo.eo + 2} ${soDo.waistY}
            L ${200 + soDo.eo - 2} ${soDo.waistY}
            Q ${200 + soDo.nguc} ${soDo.bustY}, ${200 + 16} ${soDo.neckY + 4}
            Z
          `}
          fill={patternFill}
          style={{ mixBlendMode: "screen" }}
        />
      )}

      {/* 4. Dây thắt lưng yếm buộc sau eo */}
      <line
        x1={200 - soDo.eo}
        y1={soDo.waistY}
        x2={200 + soDo.eo}
        y2={soDo.waistY}
        stroke={yemColor}
        strokeWidth="2"
      />
    </g>
  );

  return { childrenVayQuan, childrenAo };
}
