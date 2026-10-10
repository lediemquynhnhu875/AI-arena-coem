/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * THANH CÔNG CỤ ĐỈNH SÂN KHẤU (STUDIO TOP BAR)
 * - Thiết kế 2 hàng cân xứng, thoáng đãng
 * - Hàng 1: Huy hiệu Giới tính (trái) + Bộ Thu Phóng [Toàn thân | Cận cảnh] (phải)
 * - Hàng 2: Bộ Chuyển Hướng Nhìn [Mặt trước | Mặt sau | Cả 2 mặt] chia đều 3 cột 100%
 * - Tuyệt đối không bao giờ bị cắt góc, tràn viền hay rớt chữ
 */

import React from "react";
import { Sparkles, Maximize2, ZoomIn } from "lucide-react";
import { Gioi, HuongNhin } from "../../characters/types";

export interface StudioTopBarProps {
  gioi: Gioi;
  huongNhin: HuongNhin | "ca_hai";
  viewMode: "toan_than" | "can_canh";
  onHuongNhinChange: (huongNhin: HuongNhin | "ca_hai") => void;
  onViewModeChange: (viewMode: "toan_than" | "can_canh") => void;
}

export function StudioTopBar({
  gioi,
  huongNhin,
  viewMode,
  onHuongNhinChange,
  onViewModeChange,
}: StudioTopBarProps) {
  return (
    <div className="w-full flex flex-col gap-2 z-10 mb-2 font-sans select-none">
      
      {/* HÀNG 1: HUY HIỆU GIỚI TÍNH & BỘ NÚT THU PHÓNG (TOÀN THÂN / CẬN CẢNH) */}
      <div className="w-full flex items-center justify-between gap-2">
        <span className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5 font-sans shrink-0 bg-amber-100/60 dark:bg-slate-800/80 px-2.5 py-1 rounded-lg border border-amber-200/50 dark:border-slate-700">
          <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span className="whitespace-nowrap">{gioi === "nu" ? "Thiếu nữ" : "Nam nhân"}</span>
        </span>

        {/* Bộ nút thu phóng [ Toàn thân | Cận cảnh ] nằm trọn vẹn bên phải */}
        <div className="inline-flex items-center bg-amber-100/70 dark:bg-slate-800 p-0.5 rounded-lg border border-amber-200/60 dark:border-slate-700 shrink-0 font-sans shadow-xs">
          <button
            type="button"
            onClick={() => onViewModeChange("toan_than")}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer font-sans ${
              viewMode === "toan_than"
                ? "bg-amber-700 text-white shadow-xs"
                : "text-amber-900 dark:text-amber-200 hover:text-amber-950"
            }`}
            title="Xem toàn thân"
          >
            <Maximize2 className="w-3.5 h-3.5 shrink-0" />
            <span>Toàn thân</span>
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("can_canh")}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer font-sans ${
              viewMode === "can_canh"
                ? "bg-amber-700 text-white shadow-xs"
                : "text-amber-900 dark:text-amber-200 hover:text-amber-950"
            }`}
            title="Xem cận cảnh"
          >
            <ZoomIn className="w-3.5 h-3.5 shrink-0" />
            <span>Cận cảnh</span>
          </button>
        </div>
      </div>

      {/* HÀNG 2: BỘ CHUYỂN HƯỚNG NHÌN [MẶT TRƯỚC | MẶT SAU | CẢ 2 MẶT] CHIA ĐỀU 3 CỘT */}
      <div className="w-full grid grid-cols-3 gap-1 bg-amber-100/60 dark:bg-slate-800/80 p-1 rounded-xl border border-amber-200/60 dark:border-slate-700 font-sans">
        <button
          type="button"
          onClick={() => onHuongNhinChange("truoc")}
          className={`py-1.5 px-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer text-center font-sans ${
            huongNhin === "truoc"
              ? "bg-amber-800 text-white shadow-xs font-bold"
              : "text-amber-900 dark:text-amber-200 hover:text-amber-950 hover:bg-amber-200/40"
          }`}
        >
          Mặt trước
        </button>
        <button
          type="button"
          onClick={() => onHuongNhinChange("sau")}
          className={`py-1.5 px-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer text-center font-sans ${
            huongNhin === "sau"
              ? "bg-amber-800 text-white shadow-xs font-bold"
              : "text-amber-900 dark:text-amber-200 hover:text-amber-950 hover:bg-amber-200/40"
          }`}
        >
          Mặt sau
        </button>
        <button
          type="button"
          onClick={() => onHuongNhinChange("ca_hai")}
          className={`py-1.5 px-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer text-center font-sans ${
            huongNhin === "ca_hai"
              ? "bg-amber-800 text-white shadow-xs font-bold"
              : "text-amber-900 dark:text-amber-200 hover:text-amber-950 hover:bg-amber-200/40"
          }`}
        >
          Cả 2 mặt
        </button>
      </div>

    </div>
  );
}

export default StudioTopBar;
