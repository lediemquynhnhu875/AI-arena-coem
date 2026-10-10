/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * PHỤ KIỆN ĐỘI ĐẦU / KHĂN / NÓN (HEADWEAR RENDERER)
 * Bao gồm:
 * - Nón lá bài thơ
 * - Khăn đóng truyền thống
 * - Khăn mỏ quạ
 * - Nón quai thao
 * - Khăn piêu Thái
 * - Trâm cài tóc
 */

import { SoDoNhanVat } from "../types";
import { CroquisBodyType } from "../croquis/BodyPartLayering";

export function renderHeadwear(
  soDo: SoDoNhanVat,
  phuKienIds: string[],
  bodyType: CroquisBodyType = "adult"
) {
  const hasNonLa = phuKienIds.includes("non_la");
  const hasKhanDong = phuKienIds.includes("khan_dong");
  const hasKhanMoQua = phuKienIds.includes("khan_mo_qua");
  const hasNonQuaiThao = phuKienIds.includes("non_quai_thao");
  const hasKhanPieu = phuKienIds.includes("khan_pieu");
  const hasTramCai = phuKienIds.includes("tram_cai");

  if (!hasNonLa && !hasKhanDong && !hasKhanMoQua && !hasNonQuaiThao && !hasKhanPieu && !hasTramCai) {
    return null;
  }

  // Tùy biến tỷ lệ nón/khăn theo nhóm thể trạng adult, child, elderly
  const kRadius = bodyType === "child" ? 36 : 44;
  const kHeight = bodyType === "child" ? 38 : 44;
  const kKhanDongRy = bodyType === "child" ? 11 : 14;

  return (
    <g id="common-headwear" className={`headwear-${bodyType}`}>
      {/* 1. Nón lá bài thơ */}
      {hasNonLa && !hasNonQuaiThao && !hasKhanPieu && (
        <g id="acc-non-la">
          <polygon
            points={`200,${soDo.headTopY - kHeight} ${200 - soDo.headRadiusX - kRadius},${soDo.headCenterY + 4} ${200 + soDo.headRadiusX + kRadius},${soDo.headCenterY + 4}`}
            fill="#fef3c7"
            stroke="#d97706"
            strokeWidth="1.2"
          />
          <ellipse
            cx={200}
            cy={soDo.headCenterY + 4}
            rx={soDo.headRadiusX + kRadius}
            ry="10"
            fill="#fef3c7"
            stroke="#d97706"
            strokeWidth="1.2"
          />
          <path
            d={`M ${200 - soDo.headRadiusX - 10} ${soDo.headCenterY + 4} Q ${200 - 12} ${soDo.chinY + 8}, 200 ${soDo.chinY + 6} Q ${200 + 12} ${soDo.chinY + 8}, ${200 + soDo.headRadiusX + 10} ${soDo.headCenterY + 4}`}
            fill="none"
            stroke="#d98ba0"
            strokeWidth="2.2"
          />
        </g>
      )}

      {/* 2. Khăn đóng truyền thống */}
      {hasKhanDong && !hasKhanMoQua && !hasKhanPieu && (
        <g id="acc-khan-dong">
          <ellipse
            cx={200}
            cy={soDo.headCenterY - (bodyType === "child" ? 8 : 10)}
            rx={soDo.headRadiusX + (bodyType === "child" ? 3 : 5)}
            ry={kKhanDongRy}
            fill="#1e293b"
            stroke="#0f172a"
            strokeWidth="1.5"
          />
          <path
            d={`M ${200 - soDo.headRadiusX - 4} ${soDo.headCenterY - 10} Q 200 ${soDo.headCenterY - 18} ${200 + soDo.headRadiusX + 4} ${soDo.headCenterY - 10}`}
            fill="none"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="1.2"
          />
        </g>
      )}

      {/* 3. Khăn mỏ quạ */}
      {hasKhanMoQua && !hasKhanPieu && (
        <g id="acc-khan-mo-qua">
          <path
            d={`
              M ${200 - soDo.headRadiusX - 2} ${soDo.headCenterY + 4}
              C ${200 - soDo.headRadiusX - 4} ${soDo.headTopY - 6}, ${200 + soDo.headRadiusX + 4} ${soDo.headTopY - 6}, ${200 + soDo.headRadiusX + 2} ${soDo.headCenterY + 4}
              L ${200 + soDo.headRadiusX - 6} ${soDo.headCenterY - 6}
              L 200 ${soDo.headCenterY - 4}
              L ${200 - soDo.headRadiusX + 6} ${soDo.headCenterY - 6}
              Z
            `}
            fill="#18181b"
            stroke="#09090b"
            strokeWidth="1.2"
          />
        </g>
      )}

      {/* 4. Nón quai thao */}
      {hasNonQuaiThao && (
        <g id="acc-non-quai-thao">
          <ellipse
            cx={200}
            cy={soDo.headTopY - 10}
            rx={soDo.headRadiusX + 54}
            ry="18"
            fill="#fef08a"
            stroke="#ca8a04"
            strokeWidth="2"
          />
          <ellipse
            cx={200}
            cy={soDo.headTopY - 14}
            rx="24"
            ry="8"
            fill="#fde047"
            stroke="#ca8a04"
            strokeWidth="1.2"
          />
          <path
            d={`M ${200 - 35} ${soDo.headTopY - 4} C ${200 - 45} ${soDo.shoulderY}, ${200 - 30} ${soDo.waistY - 10}, ${200 - 25} ${soDo.waistY + 15}`}
            fill="none"
            stroke="#713f12"
            strokeWidth="2.5"
          />
          <path
            d={`M ${200 + 35} ${soDo.headTopY - 4} C ${200 + 45} ${soDo.shoulderY}, ${200 + 30} ${soDo.waistY - 10}, ${200 + 25} ${soDo.waistY + 15}`}
            fill="none"
            stroke="#713f12"
            strokeWidth="2.5"
          />
        </g>
      )}

      {/* 5. Khăn piêu Thái */}
      {hasKhanPieu && (
        <g id="acc-khan-pieu">
          <path
            d={`
              M ${200 - soDo.headRadiusX - 4} ${soDo.headCenterY - 6}
              C ${200 - soDo.headRadiusX - 6} ${soDo.headTopY - 12}, ${200 + soDo.headRadiusX + 6} ${soDo.headTopY - 12}, ${200 + soDo.headRadiusX + 4} ${soDo.headCenterY - 6}
              L ${200 + soDo.headRadiusX + 2} ${soDo.shoulderY + 12}
              L ${200 + soDo.headRadiusX - 10} ${soDo.shoulderY + 12}
              L ${200 + soDo.headRadiusX - 6} ${soDo.headCenterY}
              Q 200 ${soDo.headCenterY - 10}, ${200 - soDo.headRadiusX + 6} ${soDo.headCenterY}
              L ${200 - soDo.headRadiusX + 10} ${soDo.shoulderY + 12}
              L ${200 - soDo.headRadiusX - 2} ${soDo.shoulderY + 12}
              Z
            `}
            fill="#18181b"
            stroke="#dc2626"
            strokeWidth="1.5"
          />
          <rect x={200 - soDo.headRadiusX - 2} y={soDo.shoulderY} width="12" height="12" fill="#ef4444" />
          <rect x={200 + soDo.headRadiusX - 10} y={soDo.shoulderY} width="12" height="12" fill="#ef4444" />
          <circle cx={200 - soDo.headRadiusX + 4} cy={soDo.shoulderY + 6} r="2" fill="#facc15" />
          <circle cx={200 + soDo.headRadiusX - 4} cy={soDo.shoulderY + 6} r="2" fill="#facc15" />
        </g>
      )}

      {/* 6. Trâm cài búi tóc */}
      {hasTramCai && (
        <line
          x1={178}
          y1={soDo.headTopY - 16}
          x2={222}
          y2={soDo.headTopY - 8}
          stroke="#d9a441"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
      )}
    </g>
  );
}
