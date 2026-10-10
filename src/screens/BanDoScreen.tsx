/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * BẢN ĐỒ VIỆT NAM 34 TỈNH THÀNH (BẢN ĐỒ SAU SÁP NHẬP THEO QĐ 19/2025/QĐ-TTg)
 * Kiến trúc tách file modular, kết nối chính xác 100% hình dạng SVG và di sản văn hóa
 */

import React, { useState, useEffect, useMemo } from "react";
import { VungId } from "../data/vung";
import { nhom } from "../data/nhom";
import { ThemeMode } from "../lib/theme";
import {
  Vietnam34MapSVG,
  ProvinceDetailCard,
  RegionFilterBar,
  Province34,
  PROVINCES_34_LIST,
  PROVINCES_34_BY_ID,
  REGIONS_INFO,
} from "../components/map";
import AppFooter from "../components/AppFooter";
import Tooltip from "../components/Tooltip";
import { domdom } from "../copy/coem";
import { Sparkles, Trophy, CheckCircle2 } from "lucide-react";

interface Props {
  onBack: () => void;
  onSelectNhomAndNavigateToS2: (nhomId: string, vungId: VungId) => void;
  onSelectVungOnly: (vungId: VungId) => void;
  currentVungId: VungId;
  theme?: ThemeMode;
}

const STORAGE_EXPLORED_KEY = "vpr:explored_provinces_34";

export default function BanDoScreen({
  onBack,
  onSelectNhomAndNavigateToS2,
  onSelectVungOnly,
  currentVungId,
  theme,
}: Props) {
  // 1. Quản lý danh sách các tỉnh thành đã khám phá
  const [exploredIds, setExploredIds] = useState<string[]>(() => {
    try {
      if (typeof window !== "undefined") {
        const saved = window.localStorage.getItem(STORAGE_EXPLORED_KEY);
        if (saved) return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    // Mặc định khám phá thủ đô Hà Nội và tỉnh hiện tại
    return ["ha_noi"];
  });

  // 2. Tỉnh thành đang được chọn (mặc định lấy tỉnh tiêu biểu theo vùng hiện tại)
  const defaultProvince = useMemo(() => {
    const match = PROVINCES_34_LIST.find((p) => p.region === currentVungId);
    return match || PROVINCES_34_LIST[0]; // Hà Nội
  }, [currentVungId]);

  const [selectedProvince, setSelectedProvince] = useState<Province34 | null>(defaultProvince);
  const [hoveredProvinceId, setHoveredProvinceId] = useState<string | null>(null);

  // 3. Bộ lọc khu vực và tìm kiếm
  const [activeRegion, setActiveRegion] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Lưu tiến trình khám phá vào localStorage
  const markProvinceExplored = (id: string) => {
    setExploredIds((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      try {
        window.localStorage.setItem(STORAGE_EXPLORED_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Lọc danh sách tỉnh thành theo bộ lọc khu vực và từ khóa tìm kiếm
  const filteredProvinceIds = useMemo(() => {
    let list = PROVINCES_34_LIST;

    if (activeRegion !== "all") {
      list = list.filter((p) => p.region === activeRegion);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.codename.includes(q) ||
          p.mergedFrom.some((m) => m.toLowerCase().includes(q)) ||
          p.heritageHighlight.toLowerCase().includes(q)
      );
    }

    return list.map((p) => p.id);
  }, [activeRegion, searchQuery]);

  // Xử lý khi click vào 1 tỉnh trên bản đồ hoặc danh sách
  const handleSelectProvince = (province: Province34 | null) => {
    setSelectedProvince(province);
    if (province) {
      markProvinceExplored(province.id);
      onSelectVungOnly(province.region);
    }
  };

  // Điều hướng sang màn Kho Cổ Phục hoặc Thử Đồ khi bấm nút trên thẻ
  const handleExploreInCostume = (province: Province34) => {
    markProvinceExplored(province.id);
    const relatedGroup = nhom.find((n) => n.vung === province.region);
    const nhomId = relatedGroup ? relatedGroup.id : "all";
    onSelectNhomAndNavigateToS2(nhomId, province.region);
  };

  const handleSelectCostumeDirect = (costumeId: string) => {
    if (selectedProvince) {
      markProvinceExplored(selectedProvince.id);
      onSelectNhomAndNavigateToS2(costumeId, selectedProvince.region);
    }
  };

  const totalProvinces = PROVINCES_34_LIST.length; // 34
  const exploredCount = exploredIds.length;
  const isAllExplored = exploredCount >= totalProvinces;
  const progressPercent = Math.min(100, Math.round((exploredCount / totalProvinces) * 100));

  return (
    <main className="ban-do-screen min-h-screen flex flex-col bg-[var(--nen-bright)] text-[var(--nen-toi)]">
      {/* ============================================================== */}
      {/* 1. THANH TIÊU ĐỀ & TIẾN TRÌNH KHÁM PHÁ                         */}
      {/* ============================================================== */}
      <header className="sticky top-[var(--top-bar-h,56px)] z-30 w-full px-4 sm:px-6 lg:px-8 py-3 bg-[var(--nen-sidebar)] backdrop-blur-md border-b border-[var(--sidebar-border)] shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <Tooltip title="Quay lại" content="Trở về kho cổ phục." shortcut="Quay lại" position="bottom">
              <button
                type="button"
                onClick={onBack}
                className="px-3 py-1.5 text-xs font-semibold rounded-[var(--vien-lech-a)] bg-[var(--nen-the)] text-[var(--tro-tram)] hover:bg-[var(--xanh-nhe)] hover:text-[var(--xanh-dam)] border border-[var(--vien-the)] transition-colors cursor-pointer"
              >
                ← {domdom.banDo.quayLai}
              </button>
            </Tooltip>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-lg sm:text-xl font-bold text-[var(--nen-toi)] m-0 leading-tight">
                  Bản Đồ 34 Tỉnh Thành Việt Nam
                </h1>
                <span className="hidden sm:inline-block text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                  QĐ 19/2025/QĐ-TTg
                </span>
              </div>
              <p className="text-xs text-[var(--tro-tram)] m-0 mt-0.5">
                Bản đồ chuẩn xác 100% hình thể sau sáp nhập & không gian di sản trang phục 3 miền
              </p>
            </div>
          </div>

          {/* TIẾN TRÌNH KHÁM PHÁ 34 TỈNH */}
          <Tooltip
            title="Hành Trình Di Sản"
            content={`Bạn đã khám phá ${exploredCount}/${totalProvinces} tỉnh thành trên bản đồ số.`}
            shortcut={`${progressPercent}%`}
            position="bottom"
          >
            <div className="flex items-center gap-2.5 bg-[var(--xanh-nhe)] px-3 py-1.5 rounded-full border border-[var(--xanh-mint)] cursor-help">
              <Sparkles className="w-4 h-4 text-[var(--vang-chinh)]" />
              <div className="text-right">
                <span className="text-xs font-bold text-[var(--xanh-dam)] block leading-none">
                  {exploredCount}/{totalProvinces} Tỉnh Thành
                </span>
                <div className="w-24 sm:w-32 h-1.5 bg-stone-200 rounded-full overflow-hidden mt-1">
                  <div
                    className="h-full bg-gradient-to-r from-[var(--xanh-chinh)] to-[var(--vang-chinh)] transition-all duration-500 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </Tooltip>
        </div>
      </header>

      {/* THÔNG ĐIỆP CHÚC MỪNG KHI HOÀN THÀNH 34/34 */}
      {isAllExplored && (
        <div className="bg-gradient-to-r from-amber-500 to-emerald-600 text-white py-2 px-4 text-center text-xs font-semibold flex items-center justify-center gap-2 shadow-sm animate-in fade-in">
          <Trophy className="w-4 h-4 text-yellow-200" />
          <span>Chúc mừng! Bạn đã hoàn thành hành trình khám phá trọn vẹn 34 tỉnh thành Việt Nam!</span>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. NỘI DUNG CHÍNH: BỘ LỌC + BẢN ĐỒ SVG + THẺ CHI TIẾT          */}
      {/* ============================================================== */}
      <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex-1 flex flex-col gap-4">
        {/* THANH LỌC 4 MIỀN & TÌM KIẾM NHANH */}
        <RegionFilterBar
          activeRegion={activeRegion}
          onSelectRegion={setActiveRegion}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          matchedCount={filteredProvinceIds.length}
          onReset={() => {
            setActiveRegion("all");
            setSearchQuery("");
          }}
        />

        {/* BỐ CỤC 2 CỘT: BẢN ĐỒ SVG 100% CHUẨN XÁC + THẺ TỈNH THÀNH */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* CỘT TRÁI: BẢN ĐỒ VECTOR SVG 34 TỈNH */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center">
            <Vietnam34MapSVG
              selectedProvinceId={selectedProvince?.id || null}
              onSelectProvince={handleSelectProvince}
              hoveredProvinceId={hoveredProvinceId}
              onHoverProvince={setHoveredProvinceId}
              filteredProvinceIds={filteredProvinceIds}
              activeRegionFilter={activeRegion}
              showLabelsByDefault={true}
              theme={theme}
            />

            {/* Ghi chú hướng dẫn tương tác 4 miền */}
            <div className="mt-2.5 text-xs text-[var(--tro-tram)] text-center flex items-center justify-center gap-2.5 sm:gap-3.5 flex-wrap font-medium">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                <span className="w-2.5 h-2.5 rounded-full bg-[#34D399] inline-block shadow-xs" />
                <span className="text-emerald-950 dark:text-emerald-200 font-semibold">Bắc Bộ (15)</span>
              </span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FBBF24] inline-block shadow-xs" />
                <span className="text-amber-950 dark:text-amber-200 font-semibold">Trung Bộ (8)</span>
              </span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/30">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FB923C] inline-block shadow-xs" />
                <span className="text-orange-950 dark:text-orange-200 font-semibold">Tây Nguyên (3)</span>
              </span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/30">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2DD4BF] inline-block shadow-xs" />
                <span className="text-teal-950 dark:text-teal-200 font-semibold">Nam Bộ (8)</span>
              </span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-500/10 border border-sky-500/30">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0284C7] inline-block shadow-xs" />
                <span className="text-sky-950 dark:text-sky-200 font-semibold">Hải Đảo Thiêng Liêng (Hoàng Sa · Trường Sa)</span>
              </span>
            </div>
          </div>

          {/* CỘT PHẢI: THẺ CHI TIẾT TỈNH THÀNH ĐANG CHỌN (TRÊN DESKTOP) */}
          <div className="hidden lg:block lg:col-span-5 sticky top-[calc(var(--top-bar-h,56px)+64px)] space-y-4">
            <ProvinceDetailCard
              province={selectedProvince}
              onClose={() => setSelectedProvince(null)}
              onSelectCostume={handleSelectCostumeDirect}
              onExploreInCostumeScreen={handleExploreInCostume}
            />
          </div>
        </div>

        {/* THẺ TỈNH THÀNH TRÊN GIAO DIỆN DI ĐỘNG / MÀN HÌNH NHỎ (MODAL POPUP CÓ NÚT TẮT) */}
        {selectedProvince && (
          <div
            className="fixed inset-0 z-50 lg:hidden flex items-end sm:items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
            role="dialog"
            aria-modal="true"
            aria-label={`Thông tin di sản tỉnh ${selectedProvince.name}`}
            onClick={() => setSelectedProvince(null)}
          >
            <div
              className="w-full max-w-lg max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <ProvinceDetailCard
                province={selectedProvince}
                onClose={() => setSelectedProvince(null)}
                onSelectCostume={handleSelectCostumeDirect}
                onExploreInCostumeScreen={handleExploreInCostume}
              />
            </div>
          </div>
        )}
      </div>

      {/* CHÂN TRANG */}
      <AppFooter />
    </main>
  );
}
