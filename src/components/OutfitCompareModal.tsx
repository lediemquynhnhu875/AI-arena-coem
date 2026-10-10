/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * MODAL SO SÁNH CÁC PHƯƠNG ÁN PHỐI ĐỒ (A/B COMPARE SIDE-BY-SIDE)
 * Đặt hai phương án phối đồ (A và B) cạnh nhau để người dùng dễ dàng so sánh
 * màu sắc, phụ kiện, điểm hài hòa ngũ hành và bối cảnh phù hợp nhất.
 */

import React from "react";
import { X, Check, ArrowRightLeft, Sparkles, Palette, ShieldCheck } from "lucide-react";
import { trangPhuc } from "../data/trangphuc";
import { mauSac } from "../data/mausac";
import { phuKien } from "../data/phukien";
import { kiemTraHaiHoaMauSac } from "../data/genzRemixData";

export interface OutfitOption {
  ten: string;
  trangPhucId: string;
  mauId: string;
  phuKienIds: string[];
  footwearId: string;
  hoaVanThem?: string | null;
  phongCach: string;
}

interface OutfitCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  optionA: OutfitOption;
  optionB: OutfitOption;
  onSelectOption: (option: OutfitOption) => void;
}

export default function OutfitCompareModal({
  isOpen,
  onClose,
  optionA,
  optionB,
  onSelectOption,
}: OutfitCompareModalProps) {
  if (!isOpen) return null;

  const getTrangPhucName = (id: string) =>
    trangPhuc.find((t) => t.id === id)?.ten || id;

  const getColorName = (id: string) =>
    mauSac.find((m) => m.id === id)?.ten || id;

  const getColorHex = (id: string) =>
    mauSac.find((m) => m.id === id)?.hex || "#DC2626";

  const getAccessoryNames = (ids: string[]) =>
    ids.map((id) => phuKien.find((p) => p.id === id)?.ten || id).join(", ") || "Không mang";

  const getFootwearName = (id: string) => {
    if (id === "sneaker") return "Sneaker trắng Gen Z";
    if (id === "hai_theu") return "Hài thêu cung đình";
    if (id === "guoc_moc") return "Guốc mộc mộc mạc";
    if (id === "dep_da_co") return "Dép da cổ truyền";
    return id;
  };

  const harmonyA = kiemTraHaiHoaMauSac(optionA.mauId, optionA.phuKienIds[0]);
  const harmonyB = kiemTraHaiHoaMauSac(optionB.mauId, optionB.phuKienIds[0]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label="So sánh phương án phối đồ"
    >
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-emerald-500/30 text-slate-800 dark:text-slate-100 p-6 sm:p-8 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Nút đóng */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
            <ArrowRightLeft className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 dark:text-white m-0">
              So Sánh Các Phương Án Phối Đồ
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 m-0">
              Đặt hai bộ trang phục cạnh nhau để đánh giá thẩm mỹ và tính ứng dụng
            </p>
          </div>
        </div>

        {/* 2 Cột so sánh side-by-side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 overflow-y-auto flex-1 pr-1 pb-2 custom-scrollbar">
          {/* CỘT PHƯƠNG ÁN A */}
          <div className="p-5 rounded-2xl border-2 border-emerald-500/40 bg-emerald-50/20 dark:bg-emerald-950/20 flex flex-col justify-between gap-4">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-emerald-200/60 dark:border-emerald-800/60 mb-3">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-600 text-white uppercase tracking-wider">
                  Phương Án A (Hiện Tại)
                </span>
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                  {harmonyA.diemSo}/100 Điểm
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                {getTrangPhucName(optionA.trangPhucId)}
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full border border-black/20"
                    style={{ backgroundColor: getColorHex(optionA.mauId) }}
                  />
                  <span>
                    <strong>Sắc màu:</strong> {getColorName(optionA.mauId)}
                  </span>
                </div>

                <p className="m-0">
                  <strong>Giày dép:</strong> {getFootwearName(optionA.footwearId)}
                </p>

                <p className="m-0">
                  <strong>Phụ kiện:</strong> {getAccessoryNames(optionA.phuKienIds)}
                </p>

                <p className="m-0">
                  <strong>Hài hòa:</strong> {harmonyA.nhan} ({harmonyA.quanHeNguHanh})
                </p>
              </div>

              <div className="mt-4 p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                {harmonyA.phanTich}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                onSelectOption(optionA);
                onClose();
              }}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer mt-3"
            >
              <Check className="w-4 h-4" />
              <span>Giữ Phương Án A</span>
            </button>
          </div>

          {/* CỘT PHƯƠNG ÁN B */}
          <div className="p-5 rounded-2xl border-2 border-amber-500/40 bg-amber-50/20 dark:bg-amber-950/20 flex flex-col justify-between gap-4">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-amber-200/60 dark:border-amber-800/60 mb-3">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-600 text-white uppercase tracking-wider">
                  Phương Án B (Gợi Ý Đổi)
                </span>
                <span className="text-xs font-bold text-amber-700 dark:text-amber-400">
                  {harmonyB.diemSo}/100 Điểm
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                {getTrangPhucName(optionB.trangPhucId)}
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full border border-black/20"
                    style={{ backgroundColor: getColorHex(optionB.mauId) }}
                  />
                  <span>
                    <strong>Sắc màu:</strong> {getColorName(optionB.mauId)}
                  </span>
                </div>

                <p className="m-0">
                  <strong>Giày dép:</strong> {getFootwearName(optionB.footwearId)}
                </p>

                <p className="m-0">
                  <strong>Phụ kiện:</strong> {getAccessoryNames(optionB.phuKienIds)}
                </p>

                <p className="m-0">
                  <strong>Hài hòa:</strong> {harmonyB.nhan} ({harmonyB.quanHeNguHanh})
                </p>
              </div>

              <div className="mt-4 p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                {harmonyB.phanTich}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                onSelectOption(optionB);
                onClose();
              }}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer mt-3"
            >
              <Sparkles className="w-4 h-4" />
              <span>Chọn Phương Án B Mới</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
