/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * HỆ THỐNG MINH HỌA DÒNG THỜI GIAN ÁO DÀI (UNIFIED TIMELINE MANNEQUIN)
 * Tận dụng và đồng bộ 100% với hệ thống AvatarSVG & GarmentLayers cốt lõi:
 * - Dùng chung một hệ khung tỷ lệ ma-nơ-canh duy nhất
 * - Khắc phục tình trạng "3 loại người khác nhau" giữa S2, S4 và Dòng Thời Gian
 * - Thể hiện chuẩn mực 6 mốc tiến trình áo dài Việt Nam
 */

import React, { useMemo } from "react";
import AvatarSVG from "./AvatarSVG";
import { CulturalPatternsDefs, renderGarmentLayers } from "./GarmentLayers";
import { NhanVatConfig, tinhSoDo } from "../lib/avatar";

export interface SVGProps {
  className?: string;
  width?: number | string;
  height?: number | string;
}

export interface TimelineMannequinProps {
  mocId: string;
  className?: string;
}

const TIMELINE_CONFIGS: Record<
  string,
  {
    trangPhucId: string;
    mauHex: string;
    phuKienIds: string[];
    gioi: "nu" | "nam";
    toc: string;
  }
> = {
  tg1: {
    // Mốc 1: Trước thế kỷ 20 - Áo ngũ thân cổ truyền, khăn đóng nam thanh nhã
    trangPhucId: "ngu_than",
    mauHex: "#78350F", // Nâu sồng / Đất nung cổ
    phuKienIds: ["khan_dong"],
    gioi: "nam",
    toc: "ngan",
  },
  tg2: {
    // Mốc 2: Thập niên 1930 - Áo dài Lemur (Cát Tường) hồng cánh sen cách tân
    trangPhucId: "aodai",
    mauHex: "#BE185D", // Hồng sen Tây phương tươi thắm
    phuKienIds: [],
    gioi: "nu",
    toc: "dai_xoa",
  },
  tg3: {
    // Mốc 3: Khoảng thập niên 1930 - Áo dài Lê Phổ kín đáo thanh nhã xanh ngọc
    trangPhucId: "aodai",
    mauHex: "#0F766E", // Xanh ngọc bích đoan trang
    phuKienIds: [],
    gioi: "nu",
    toc: "dai_xoa",
  },
  tg4: {
    // Mốc 4: Thập niên 1960 - Áo dài Raglan tay ráp giác-lăng vàng nghệ
    trangPhucId: "aodai",
    mauHex: "#D97706", // Vàng nghệ rực rỡ
    phuKienIds: [],
    gioi: "nu",
    toc: "dai_xoa",
  },
  tg5: {
    // Mốc 5: Cuối thập niên 1960 - Áo dài Mini tà ngắn thanh xuân
    trangPhucId: "aodai",
    mauHex: "#7C3AED", // Tím hoa cà duyên dáng
    phuKienIds: [],
    gioi: "nu",
    toc: "bui_cao",
  },
  tg6: {
    // Mốc 6: Thế kỷ 21 - Áo dài ngày nay đỏ thắm quốc phục kèm nón lá
    trangPhucId: "aodai",
    mauHex: "#DC2626", // Đỏ son rạng rỡ
    phuKienIds: ["non_la"],
    gioi: "nu",
    toc: "dai_xoa",
  },
};

/**
 * Trình diễn ma-nơ-canh đồng bộ cho từng mốc dòng thời gian
 */
export function TimelineMannequinItem({ mocId, className = "" }: TimelineMannequinProps) {
  const cfg = TIMELINE_CONFIGS[mocId] || TIMELINE_CONFIGS.tg1;

  const nhanVat: NhanVatConfig = useMemo(
    () => ({
      tuoi: "nguoi_lon",
      gioi: cfg.gioi,
      vocDang: "trung_binh",
      tongDa: 3,
      toc: cfg.toc,
    }),
    [cfg.gioi, cfg.toc]
  );

  const soDo = useMemo(() => tinhSoDo(nhanVat), [nhanVat]);

  const garmentLayers = useMemo(() => {
    return renderGarmentLayers({
      trangPhucId: cfg.trangPhucId,
      soDo,
      mauHex: cfg.mauHex,
      phuKienIds: cfg.phuKienIds,
    });
  }, [cfg.trangPhucId, soDo, cfg.mauHex, cfg.phuKienIds]);

  return (
    <div className={`w-full h-full flex items-center justify-center transform scale-90 translate-y-1 select-none ${className}`}>
      <AvatarSVG
        nhanVat={nhanVat}
        scalePreset="md"
        className="w-full h-full drop-shadow-sm"
        childrenDefs={<CulturalPatternsDefs />}
        childrenVayQuan={garmentLayers.childrenVayQuan}
        childrenAo={garmentLayers.childrenAo}
        childrenPhuKienThan={garmentLayers.childrenPhuKienThan}
        childrenTocTruocKhanNon={garmentLayers.childrenTocTruocKhanNon}
      />
    </div>
  );
}

/**
 * Hàm lấy component SVG tương ứng theo milestone ID
 */
export function laySvgTheoMoc(mocId: string, props?: SVGProps) {
  return <TimelineMannequinItem mocId={mocId} className={props?.className} />;
}
