/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * THẺ CHI TIẾT TỈNH THÀNH & DI SẢN TRANG PHỤC
 * Chuẩn tối đa 3 font chữ:
 * 1. font-serif text-xl font-bold: Tiêu đề tỉnh thành
 * 2. font-sans text-sm: Nội dung thông tin, sáp nhập & cảnh sắc di sản
 * 3. font-sans text-xs font-semibold: Huy hiệu vùng miền, tên cổ phục & nút bấm
 */

import React from "react";
import { Province34 } from "./types";
import { REGIONS_INFO } from "./provinceMetadata";
import { VIETNAM_ISLANDS } from "./paths/islands";
import { MapPin, Layers, ArrowRight, X, Anchor, Sparkles } from "lucide-react";

interface ProvinceDetailCardProps {
  province: Province34 | null;
  onClose?: () => void;
  onSelectCostume?: (costumeId: string) => void;
  onExploreInCostumeScreen?: (province: Province34) => void;
}

export default function ProvinceDetailCard({
  province,
  onClose,
  onSelectCostume,
  onExploreInCostumeScreen,
}: ProvinceDetailCardProps) {
  // Trạng thái khi chưa chọn tỉnh
  if (!province) {
    return (
      <div className="p-4 sm:p-5 rounded-[var(--vien-lech-a)] bg-[var(--nen-the)] border border-[var(--vien-the)] shadow-sm text-center">
        <MapPin className="w-7 h-7 text-[var(--vang-chinh)] mx-auto mb-2 opacity-70 animate-bounce" />
        {/* Font 1 */}
        <h3 className="font-serif text-xl font-bold text-[var(--nen-toi)] m-0 mb-1">
          Chọn một tỉnh thành
        </h3>
        {/* Font 2 */}
        <p className="font-sans text-sm text-[var(--tro-tram)] m-0 leading-relaxed">
          Nhấp chuột trên bản đồ để xem thông tin hành chính và nếp cổ phục truyền thống.
        </p>
      </div>
    );
  }

  const regionInfo = REGIONS_INFO[province.region];
  const isMerged = province.mergedFrom && province.mergedFrom.length > 1;
  const relatedIslands = VIETNAM_ISLANDS.filter((i) => i.provinceId === province.id);

  return (
    <article className="relative flex flex-col p-4 sm:p-5 rounded-[var(--vien-lech-b)] bg-[var(--nen-the)] border border-[var(--vien-the)] shadow-md transition-all">
      {/* Nút đóng */}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng bảng thông tin"
          className="absolute top-3 right-3 px-2 py-1 rounded-full flex items-center gap-1 font-sans text-xs font-semibold bg-[var(--nen-the-phu)] hover:bg-rose-50 dark:hover:bg-rose-950/40 text-[var(--tro-tram)] hover:text-rose-600 border border-[var(--vien-the)] transition-all cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
          <span>Đóng</span>
        </button>
      )}

      {/* 1. HUY HIỆU VÙNG MIỀN (Font 3: font-sans text-xs font-semibold) */}
      <div className="flex items-center gap-1.5 flex-wrap mb-1.5 pr-14">
        <span
          className="font-sans text-xs font-semibold px-2 py-0.5 rounded-full text-white shadow-xs"
          style={{ backgroundColor: regionInfo.colorHex }}
        >
          {regionInfo.name}
        </span>

        <span className="font-sans text-xs font-semibold text-[var(--tro-tram)] bg-[var(--nen-the-phu)] border border-[var(--vien-the)] px-2 py-0.5 rounded-full">
          {province.divisionType === "thành phố" ? "Thành phố TW" : "Tỉnh"}
        </span>

        {isMerged && (
          <span className="font-sans text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-500/15 px-2 py-0.5 rounded-full border border-amber-500/30">
            Sáp nhập 2025
          </span>
        )}
      </div>

      {/* 2. TÊN TỈNH THÀNH (Font 1: font-serif text-xl font-bold) */}
      <h2 className="font-serif text-xl font-bold text-[var(--nen-toi)] m-0 mb-2 leading-tight">
        {province.name}
      </h2>

      {/* 3. THÔNG TIN HÀNH CHÍNH & SÁP NHẬP (Font 2: font-sans text-sm) */}
      <div className="font-sans text-sm text-[var(--tro-tram)] mb-2.5 leading-snug">
        {isMerged ? (
          <span>
            Hợp nhất từ: <strong className="text-[var(--nen-toi)] font-semibold">{province.mergedFrom.join(" + ")}</strong> ({province.communeCount} xã/phường)
          </span>
        ) : (
          <span>
            Đơn vị hành chính: <strong className="text-[var(--nen-toi)] font-semibold">{province.communeCount}</strong> xã, phường, thị trấn
          </span>
        )}
      </div>

      {/* 4. DẤU ẤN CẢNH SẮC & VĂN HÓA (Font 2: font-sans text-sm) */}
      <div className="font-sans text-sm text-[var(--nen-toi)] mb-3 p-2.5 rounded-lg bg-[var(--nen-the-phu)] border border-[var(--vien-the)] leading-relaxed">
        {province.heritageHighlight}
      </div>

      {/* 5. HẢI ĐẢO THIÊNG LIÊNG NẾU CÓ (Font 3: font-sans text-xs font-semibold) */}
      {relatedIslands.length > 0 && (
        <div className="mb-3 px-2.5 py-1.5 rounded-lg bg-sky-500/10 dark:bg-sky-950/40 border border-sky-400/30 flex items-center gap-1.5">
          <Anchor className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" />
          <span className="font-sans text-xs font-semibold text-sky-900 dark:text-sky-200">
            Hải đảo: {relatedIslands.map((isl) => isl.name).join(" · ")}
          </span>
        </div>
      )}

      {/* 6. CỔ PHỤC TIÊU BIỂU (Font 3: font-sans text-xs font-semibold) */}
      <div className="mb-3">
        <div className="flex items-center gap-1 mb-1.5 text-[var(--tro-tram)]">
          <Sparkles className="w-3.5 h-3.5 text-[var(--vang-chinh)]" />
          <span className="font-sans text-xs font-semibold">Cổ phục tiêu biểu:</span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {province.costumeNames.map((cName, idx) => {
            const costumeId = province.costumeIds[idx] || province.costumeIds[0];
            return (
              <button
                key={cName}
                type="button"
                onClick={() => onSelectCostume && onSelectCostume(costumeId)}
                className="font-sans text-xs font-semibold inline-flex items-center gap-1 px-2.5 py-1 rounded-[var(--vien-lech-a)] bg-[var(--xanh-chinh)] text-white hover:bg-[var(--xanh-dam)] transition-colors shadow-xs cursor-pointer"
                title={`Thử trang phục ${cName}`}
              >
                <span>✦ {cName}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 7. NÚT ĐIỀU HƯỚNG (Font 3: font-sans text-xs font-semibold) */}
      <div className="flex items-center gap-2 mt-auto pt-1">
        {onExploreInCostumeScreen && (
          <button
            type="button"
            onClick={() => onExploreInCostumeScreen(province)}
            className="flex-1 font-sans text-xs font-semibold inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-[var(--vien-lech-b)] bg-[var(--vang-chinh)] text-white hover:brightness-110 shadow-xs transition-all cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Kho đồ {regionInfo.name}</span>
            <ArrowRight className="w-3.5 h-3.5 ml-auto" />
          </button>
        )}
      </div>
    </article>
  );
}
