/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * PHỤ KIỆN THÂN MÌNH (BODY ACCESSORIES RENDERER)
 * - Vòng bạc / kiềng bạc
 * - Khăn rằn Nam Bộ
 * - Túi vải thổ cẩm / tote
 */

import { SoDoNhanVat } from "../types";
import { CroquisBodyType } from "../croquis/BodyPartLayering";

export function renderBodyAccessories(
  soDo: SoDoNhanVat,
  phuKienIds: string[],
  bodyType: CroquisBodyType = "adult"
) {
  const hasVongBac = phuKienIds.includes("vong_bac");
  const hasKhanRan = phuKienIds.includes("khan_ran");
  const hasTote = phuKienIds.includes("tote");

  if (!hasVongBac && !hasKhanRan && !hasTote) return null;

  const kNeckRingRadius = bodyType === "child" ? soDo.neckHalfWidth + 6 : soDo.neckHalfWidth + 9;
  const kNeckRingWidth = bodyType === "child" ? "2.6" : "3.4";
  const khanRanBottomY = bodyType === "child" ? soDo.hipY + 8 : soDo.hipY + 18;

  return (
    <g id="common-phu-kien-than" className={`body-acc-${bodyType}`}>
      {hasVongBac && (
        <ellipse
          cx={200}
          cy={soDo.neckY + 8}
          rx={kNeckRingRadius}
          ry="7"
          fill="none"
          stroke="#f1f5f9"
          strokeWidth={kNeckRingWidth}
        />
      )}
      {hasKhanRan && (
        <path
          d={`
            M ${200 - soDo.neckHalfWidth - 4} ${soDo.neckY + 4}
            C ${200 - 16} ${soDo.shoulderY + 10}, ${200 - 18} ${soDo.waistY}, ${200 - 14} ${khanRanBottomY}
            L ${200 - 5} ${khanRanBottomY}
            L ${200 - 3} ${soDo.neckY + 8}
            L ${200 + 3} ${soDo.neckY + 8}
            L ${200 + 5} ${khanRanBottomY}
            L ${200 + 14} ${khanRanBottomY}
            C ${200 + 18} ${soDo.waistY}, ${200 + 16} ${soDo.shoulderY + 10}, ${200 + soDo.neckHalfWidth + 4} ${soDo.neckY + 4}
            Z
          `}
          fill="url(#hoa-van-kn)"
          stroke="#1e293b"
          strokeWidth="1.2"
        />
      )}
      {hasTote && (
        <g id="common-tote-bag">
          <line
            x1={200 + soDo.vai - 6}
            y1={soDo.shoulderY + 4}
            x2={200 + soDo.hong + 14}
            y2={soDo.hipY + 8}
            stroke="#475569"
            strokeWidth="2"
          />
          <rect
            x={200 + soDo.hong + 4}
            y={soDo.hipY + 8}
            width="36"
            height="44"
            fill="#f1f5f9"
            stroke="#64748b"
            strokeWidth="1.5"
            rx="3"
          />
          <line
            x1={200 + soDo.hong + 8}
            y1={soDo.hipY + 18}
            x2={200 + soDo.hong + 36}
            y2={soDo.hipY + 18}
            stroke="#bd4b3b"
            strokeWidth="2"
          />
        </g>
      )}
    </g>
  );
}
