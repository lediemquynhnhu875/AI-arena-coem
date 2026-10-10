/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * BỘ DỰNG HÌNH NHÂN VẬT THỜI TRANG (CHARACTER RENDERER - FASHION CROQUIS)
 * Tích hợp kiến trúc chia tách mô-đun chuẩn tỷ lệ thời trang 320x850:
 * - CroquisTorso: Thân mình, xương quai xanh, rốn, hông
 * - CroquisHead: Đỉnh đầu, búi tóc, tai, diện mạo
 * - CroquisArms: Cánh tay, cổ tay, 5 ngón tay búp măng
 * - CroquisLegs: Khớp gối, bắp chân, mắt cá, bàn chân kiễng
 * - CroquisMuscleShading: Khối đổ bóng 3D mềm mại
 * - CroquisUnderwear: Nội y tối giản
 * - CroquisProportionGrid: Thước đo tỷ lệ 9 đầu
 */

import React from "react";
import { NhanVatConfig, CharacterScalePreset, HuongNhin } from "./types";
import { layThongSoViewport } from "./dimensions/viewports";
import FashionMannequin from "./croquis/FashionMannequin";

export interface CharacterRendererProps {
  nhanVat: NhanVatConfig;
  hienAoGia?: boolean;
  scalePreset?: CharacterScalePreset;
  customWidth?: number;
  customViewBox?: string;
  className?: string;
  hienDoLot?: boolean;
  huongNhin?: HuongNhin;
  childrenDefs?: React.ReactNode;
  childrenVayQuan?: React.ReactNode;
  childrenAo?: React.ReactNode;
  childrenPhuKienThan?: React.ReactNode;
  childrenTocTruocKhanNon?: React.ReactNode;
}

export default function CharacterRenderer({
  nhanVat,
  scalePreset = "lg",
  customWidth,
  customViewBox,
  className = "",
  hienDoLot = true,
  huongNhin: huongNhinProp,
  childrenDefs,
  childrenVayQuan,
  childrenAo,
  childrenPhuKienThan,
  childrenTocTruocKhanNon,
}: CharacterRendererProps) {
  const huongNhin = huongNhinProp || nhanVat.huongNhin || "truoc";
  const viewport = layThongSoViewport(scalePreset, customWidth);

  return (
    <svg
      viewBox={customViewBox || viewport.viewBox}
      width={customWidth ? viewport.width : undefined}
      height={customWidth ? viewport.height : undefined}
      preserveAspectRatio="xMidYMid meet"
      className={`avatar-svg character-renderer ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Hình minh họa nhân vật trang phục truyền thống chuẩn phác thảo thời trang"
    >
      <defs>{childrenDefs}</defs>

      {/* SÂN KHẤU NGƯỜI MẪU CHUẨN TỶ LỆ PHÁC THẢO THỜI TRANG 320x850 */}
      <FashionMannequin
        nhanVat={nhanVat}
        huongNhin={huongNhin}
        hienDoLot={hienDoLot}
        childrenVayQuan={childrenVayQuan}
        childrenAo={childrenAo}
        childrenPhuKienThan={childrenPhuKienThan}
        childrenTocTruocKhanNon={childrenTocTruocKhanNon}
      />
    </svg>
  );
}
