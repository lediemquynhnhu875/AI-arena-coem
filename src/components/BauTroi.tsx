/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * BauTroi — Bối cảnh Bầu Trời & Sân Khấu Thiên Nhiên Di Sản (Cò Em)
 * Tự động đồng bộ chuẩn xác với theme Sáng / Tối và khí hậu quê nhà
 */

import React from "react";
import { VungId } from "../data/vung";
import { KhungGioLoai, ThoiTietLoai } from "../lib/thoitiet";
import NatureBackground, { DayNightPhase } from "./nature/NatureBackground";
import { ThemeMode, layThemeHienTai } from "../lib/theme";

interface Props {
  vungId: VungId;
  khungGio: KhungGioLoai;
  thoiTiet: ThoiTietLoai;
  theme?: ThemeMode;
}

export default function BauTroi({ vungId, khungGio, thoiTiet, theme }: Props) {
  const currentTheme = theme || layThemeHienTai();
  const manualPhase: DayNightPhase | null =
    currentTheme === "dark"
      ? "dem"
      : khungGio === "hoang_hon"
      ? "hoang_hon"
      : khungGio === "rang_dong"
      ? "binh_minh"
      : "ngay";

  return (
    <NatureBackground
      vungId={vungId}
      thoiTiet={thoiTiet}
      manualPhase={manualPhase}
      theme={currentTheme}
    />
  );
}
