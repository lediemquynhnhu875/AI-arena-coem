/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * HỘP THOẠI CÀI ĐẶT TRẢI NGHIỆM (EXPERIENCE SETTINGS MODAL)
 * Thiết kế tinh gọn, chuẩn mực mỹ học Á Đông:
 * 1. Màu sắc đồng bộ với tông chủ đạo (ấm áp, hài hòa, không lỗi tương phản)
 * 2. Nội dung súc tích, loại bỏ văn bản trùng lặp và rườm rà
 * 3. Kiểu chữ nhất quán, phân cấp rõ ràng
 */

import React from "react";
import { useCaiDatTraiNghiem } from "../lib/caiDatTraiNghiem";
import { playFabricRustle, playSilverBell } from "../lib/audio";
import { ThoiTietState, ThongTinViTri } from "../lib/thoitiet";
import { VungId } from "../data/vung";
import ChonViTriSection from "./ChonViTriSection";
import { X, Volume2, Sparkles, Feather, CloudSun } from "lucide-react";

interface Props {
  onClose: () => void;
  weatherState?: ThoiTietState;
  onViTriChange?: (newViTri: ThongTinViTri) => void;
  onSelectVung?: (vungId: VungId) => void;
}

export default function CaiDatTraiNghiemModal({
  onClose,
  weatherState,
  onViTriChange,
  onSelectVung,
}: Props) {
  const [settings, updateSettings] = useCaiDatTraiNghiem();

  const handleToggleAudio = () => {
    const next = !settings.amThanh;
    updateSettings({ amThanh: next });
    if (next) {
      setTimeout(() => playSilverBell(), 50);
    }
  };

  const handleToggleReducedMotion = () => {
    const next = !settings.giamChuyenDong;
    updateSettings({ giamChuyenDong: next });
    if (settings.amThanh) {
      playFabricRustle();
    }
  };

  const handleSetLargeText = (enableLarge: boolean) => {
    if (settings.chuLonDeDoc === enableLarge) return;
    updateSettings({ chuLonDeDoc: enableLarge });
    if (settings.amThanh) {
      playFabricRustle();
    }
  };

  const handleToggleDisableSky = () => {
    const next = !settings.tatBauTroi;
    updateSettings({ tatBauTroi: next });
    if (settings.amThanh) {
      playFabricRustle();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cai-dat-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-amber-200/60 dark:border-slate-800 rounded-2xl shadow-2xl p-5 sm:p-6 text-slate-900 dark:text-slate-100 max-h-[90vh] overflow-y-auto select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Nút đóng góc trên phải */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
          aria-label="Đóng"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Tiêu đề bảng: Tier 1 (text-lg) & Tier 3 (text-xs) */}
        <header className="mb-3.5 pr-8">
          <h2
            id="cai-dat-title"
            className="text-lg font-bold text-slate-900 dark:text-slate-100 m-0"
          >
            Cài Đặt Trải Nghiệm
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 m-0">
            Tùy chỉnh âm thanh, cỡ chữ và thời tiết gợi ý.
          </p>
        </header>

        {/* Danh sách các tùy chọn cốt lõi */}
        <div className="space-y-2.5 mb-3.5">
          
          {/* 1. ÂM THANH MỘC */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 shrink-0">
                <Volume2 className="w-4 h-4" />
              </span>
              <div>
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 block">
                  Âm thanh
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-snug m-0">
                  Phát tiếng vải lụa và tiếng bước guốc khi tương tác.
                </p>
              </div>
            </div>

            {/* Switch gạt */}
            <button
              type="button"
              role="switch"
              aria-checked={settings.amThanh}
              onClick={handleToggleAudio}
              className={`w-11 h-6 rounded-full transition-colors relative shrink-0 cursor-pointer p-0.5 border ${
                settings.amThanh
                  ? "bg-amber-600 border-amber-700"
                  : "bg-slate-300 dark:bg-slate-700 border-slate-300 dark:border-slate-600"
              }`}
            >
              <span
                className={`block w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                  settings.amThanh ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* 2. GIẢM CHUYỂN ĐỘNG */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 shrink-0">
                <Feather className="w-4 h-4" />
              </span>
              <div>
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 block">
                  Giảm chuyển động
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-snug m-0">
                  Hạn chế hiệu ứng lướt và hoạt cảnh bay lượn.
                </p>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={settings.giamChuyenDong}
              onClick={handleToggleReducedMotion}
              className={`w-11 h-6 rounded-full transition-colors relative shrink-0 cursor-pointer p-0.5 border ${
                settings.giamChuyenDong
                  ? "bg-amber-600 border-amber-700"
                  : "bg-slate-300 dark:bg-slate-700 border-slate-300 dark:border-slate-600"
              }`}
            >
              <span
                className={`block w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                  settings.giamChuyenDong ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* 3. CỠ CHỮ HIỂN THỊ */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div>
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 block">
                Cỡ chữ hiển thị
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-snug m-0">
                Phóng to văn bản cho dễ đọc trên toàn ứng dụng.
              </p>
            </div>

            <div className="flex items-center bg-slate-200 dark:bg-slate-700 p-0.5 rounded-lg shrink-0 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => handleSetLargeText(false)}
                className={`px-3 py-1 rounded-md text-xs transition-all cursor-pointer ${
                  !settings.chuLonDeDoc
                    ? "bg-white dark:bg-slate-900 text-amber-950 dark:text-amber-200 shadow-xs font-semibold"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 font-medium"
                }`}
              >
                Aa Chuẩn
              </button>
              <button
                type="button"
                onClick={() => handleSetLargeText(true)}
                className={`px-3 py-1 rounded-md text-xs transition-all cursor-pointer ${
                  settings.chuLonDeDoc
                    ? "bg-amber-700 text-white shadow-xs font-semibold"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 font-medium"
                }`}
              >
                Aa Chữ lớn
              </button>
            </div>
          </div>

          {/* 4. BẦU TRỜI CHUYỂN ĐỘNG */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="p-1.5 rounded-lg bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 shrink-0">
                <Sparkles className="w-4 h-4" />
              </span>
              <div>
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 block">
                  Bầu trời động
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-snug m-0">
                  Hiệu ứng mây trôi và ánh sáng ngày đêm theo thời gian thực.
                </p>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={!settings.tatBauTroi}
              onClick={handleToggleDisableSky}
              className={`w-11 h-6 rounded-full transition-colors relative shrink-0 cursor-pointer p-0.5 border ${
                !settings.tatBauTroi
                  ? "bg-amber-600 border-amber-700"
                  : "bg-slate-300 dark:bg-slate-700 border-slate-300 dark:border-slate-600"
              }`}
            >
              <span
                className={`block w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                  !settings.tatBauTroi ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

        </div>

        {/* 5. VỊ TRÍ & THỜI TIẾT GỢI Ý */}
        {weatherState && (
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 mb-3.5">
            <div className="flex items-center gap-1.5 mb-2">
              <CloudSun className="w-4 h-4 text-amber-700 dark:text-amber-400" />
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 m-0">
                Vị trí & Thời tiết gợi ý
              </h3>
            </div>
            <ChonViTriSection
              weatherState={weatherState}
              onViTriChange={onViTriChange || (() => {})}
              onSelectVung={onSelectVung}
            />
          </div>
        )}

        {/* CHÂN BẢNG: Nút hoàn tất */}
        <footer className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 shadow-xs active:scale-95 transition-all cursor-pointer"
          >
            Đã xong
          </button>
        </footer>

      </div>
    </div>
  );
}
