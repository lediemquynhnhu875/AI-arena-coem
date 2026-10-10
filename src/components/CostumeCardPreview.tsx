/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState, useEffect } from "react";
import AvatarSVG from "./AvatarSVG";
import { CulturalPatternsDefs, renderGarmentLayers } from "./GarmentLayers";
import { NhanVatConfig, tinhSoDo } from "../lib/avatar";
import { layThemeHienTai, THEME_CHANGE_EVENT, ThemeMode } from "../lib/theme";

interface CostumeCardPreviewProps {
  trangPhucId: string;
  className?: string;
}

const COSTUME_STYLES_DARK: Record<string, string> = {
  aodai: "linear-gradient(180deg, #1C0F18 0%, #151F2F 65%, #0B192E 100%)",
  ngu_than: "linear-gradient(180deg, #241C0E 0%, #1A2331 55%, #0B192E 100%)",
  tu_than: "linear-gradient(180deg, #22140D 0%, #19202E 60%, #0B192E 100%)",
  ba_ba: "linear-gradient(180deg, #0D2218 0%, #10262E 60%, #0B192E 100%)",
  co_thai: "linear-gradient(180deg, #141E28 0%, #122234 50%, #0B192E 100%)",
  mong_lanh: "linear-gradient(180deg, #0E1A33 0%, #11223F 60%, #0B192E 100%)",
  ede_tho_cam: "linear-gradient(180deg, #131A24 0%, #152232 60%, #0B192E 100%)",
  champa_tho_cam: "linear-gradient(180deg, #28200B 0%, #1B2332 60%, #0B192E 100%)",
  sampot: "linear-gradient(180deg, #241D0C 0%, #1A2332 60%, #0B192E 100%)",
};

const COSTUME_STYLES: Record<
  string,
  {
    mauHex: string;
    phuKienIds: string[];
    gioi: "nu" | "nam";
    toc: string;
    bgGradient: string;
  }
> = {
  aodai: {
    mauHex: "#DC2626", // Đỏ son truyền thống
    phuKienIds: ["non_la"],
    gioi: "nu",
    toc: "dai_xoa",
    bgGradient: "linear-gradient(180deg, #FEF2F2 0%, #FEF9C3 65%, #F0FDF4 100%)",
  },
  ngu_than: {
    mauHex: "#CA8A04", // Hoàng yến / Vàng nghệ
    phuKienIds: ["khan_dong"],
    gioi: "nam",
    toc: "ngan",
    bgGradient: "linear-gradient(180deg, #FEF9C3 0%, #FEF08A 55%, #F0FDF4 100%)",
  },
  tu_than: {
    mauHex: "#B45309", // Nâu sồng / Đất nung
    phuKienIds: ["khan_mo_qua"],
    gioi: "nu",
    toc: "bui_cao",
    bgGradient: "linear-gradient(180deg, #FFFBEB 0%, #FEF3C7 60%, #F0FDF4 100%)",
  },
  ba_ba: {
    mauHex: "#15803D", // Xanh lá mạ / chàm Nam Bộ
    phuKienIds: ["khan_ran"],
    gioi: "nu",
    toc: "dai_xoa",
    bgGradient: "linear-gradient(180deg, #F0FDF4 0%, #DCFCE7 60%, #FEF9C3 100%)",
  },
  co_thai: {
    mauHex: "#F8FAFC", // Áo cóm trắng bạc
    phuKienIds: ["khan_pieu"],
    gioi: "nu",
    toc: "bui_cao",
    bgGradient: "linear-gradient(180deg, #F8FAFC 0%, #E2E8F0 50%, #DCFCE7 100%)",
  },
  mong_lanh: {
    mauHex: "#1E3A8A", // Chàm lanh thêu hoa
    phuKienIds: ["kieng_bac"],
    gioi: "nu",
    toc: "bui_cao",
    bgGradient: "linear-gradient(180deg, #EFF6FF 0%, #DBEAFE 60%, #FEF9C3 100%)",
  },
  ede_tho_cam: {
    mauHex: "#0F172A", // Thổ cẩm Tây Nguyên
    phuKienIds: [],
    gioi: "nu",
    toc: "dai_xoa",
    bgGradient: "linear-gradient(180deg, #F1F5F9 0%, #E2E8F0 60%, #FEF9C3 100%)",
  },
  champa_tho_cam: {
    mauHex: "#EAB308", // Thổ cẩm Chăm vàng óng
    phuKienIds: ["khan_cham"],
    gioi: "nu",
    toc: "dai_xoa",
    bgGradient: "linear-gradient(180deg, #FEF9C3 0%, #FDE047 60%, #F0FDF4 100%)",
  },
  sampot: {
    mauHex: "#CA8A04", // Sampot dệt chỉ vàng
    phuKienIds: [],
    gioi: "nu",
    toc: "bui_cao",
    bgGradient: "linear-gradient(180deg, #FEF9C3 0%, #FEF08A 60%, #DCFCE7 100%)",
  },
};

export default function CostumeCardPreview({
  trangPhucId,
  className = "",
}: CostumeCardPreviewProps) {
  const [themeMode, setThemeMode] = useState<ThemeMode>(layThemeHienTai);

  useEffect(() => {
    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ theme: ThemeMode }>;
      if (customEvent.detail?.theme) {
        setThemeMode(customEvent.detail.theme);
      } else {
        setThemeMode(layThemeHienTai());
      }
    };
    window.addEventListener(THEME_CHANGE_EVENT, handleThemeChange);
    return () => window.removeEventListener(THEME_CHANGE_EVENT, handleThemeChange);
  }, []);

  const cfg = COSTUME_STYLES[trangPhucId] || COSTUME_STYLES.aodai;
  const isDark = themeMode === "dark";
  const darkGradient = COSTUME_STYLES_DARK[trangPhucId] || "linear-gradient(180deg, #102542 0%, #0B192E 100%)";
  const activeBg = isDark ? darkGradient : cfg.bgGradient;

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
      trangPhucId,
      soDo,
      mauHex: cfg.mauHex,
      phuKienIds: cfg.phuKienIds,
    });
  }, [trangPhucId, soDo, cfg.mauHex, cfg.phuKienIds]);

  return (
    <div
      className={`costume-card-preview relative w-full h-[280px] sm:h-[310px] flex items-center justify-center overflow-hidden rounded-t-[14px] select-none ${className}`}
      style={{
        background: activeBg,
        ["--dark-card-gradient" as any]: darkGradient,
      }}
    >
      {/* Nền hoa văn mờ nhạt Đông Sơn */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at center, #15803D 1px, transparent 1px)`,
          backgroundSize: "16px 16px",
        }}
        aria-hidden="true"
      />

      {/* Hiệu ứng hào quang dịu nhẹ */}
      <div
        className="absolute w-44 h-44 rounded-full blur-2xl pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(234, 179, 8, 0.28) 0%, transparent 70%)",
          top: "15%",
        }}
        aria-hidden="true"
      />

      {/* Hình minh hoạ trang phục */}
      <div className="relative z-10 w-full h-full flex items-center justify-center transform scale-[1.0] group-hover:scale-[1.03] transition-transform duration-500 ease-out py-1 px-1">
        <AvatarSVG
          nhanVat={nhanVat}
          scalePreset="md"
          customViewBox="80 -65 240 780"
          className="w-full h-full drop-shadow-md"
          childrenDefs={<CulturalPatternsDefs />}
          childrenVayQuan={garmentLayers.childrenVayQuan}
          childrenAo={garmentLayers.childrenAo}
          childrenPhuKienThan={garmentLayers.childrenPhuKienThan}
          childrenTocTruocKhanNon={garmentLayers.childrenTocTruocKhanNon}
        />
      </div>
    </div>
  );
}
