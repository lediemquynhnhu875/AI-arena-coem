/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * BẢN ĐỒ VIỆT NAM 34 TỈNH THÀNH (SVG RENDERER)
 * Hình dạng chính xác 100% theo bản đồ Việt Nam sau sáp nhập (QĐ 19/2025/QĐ-TTg)
 * Nguồn dữ liệu vector chuẩn từ github.com/hoccungduy/vietnam-map-34-provinces
 * Thiết kế thoáng sạch: Thanh công cụ đặt ở đầu, không che khuất phần đuôi bản đồ (Cà Mau/Nam Bộ)
 */

import React, { useState, useMemo, useRef, useEffect } from "react";
import { Province34 } from "./types";
import { PROVINCES_34_LIST, REGIONS_INFO } from "./provinceMetadata";
import { PROVINCES_34_SVG_PATHS, VIETNAM_ISLANDS } from "./paths";
import Tooltip from "../Tooltip";
import { ZoomIn, ZoomOut, RotateCcw, Eye, Compass, Anchor } from "lucide-react";
import { ThemeMode, layThemeHienTai, THEME_CHANGE_EVENT } from "../../lib/theme";

interface Vietnam34MapSVGProps {
  selectedProvinceId: string | null;
  onSelectProvince: (province: Province34) => void;
  hoveredProvinceId: string | null;
  onHoverProvince: (id: string | null) => void;
  filteredProvinceIds?: string[];
  activeRegionFilter?: string;
  showLabelsByDefault?: boolean;
  theme?: ThemeMode;
}

export default function Vietnam34MapSVG({
  selectedProvinceId,
  onSelectProvince,
  hoveredProvinceId,
  onHoverProvince,
  filteredProvinceIds,
  activeRegionFilter,
  showLabelsByDefault = true,
  theme: propTheme,
}: Vietnam34MapSVGProps) {
  const [activeTheme, setActiveTheme] = useState<ThemeMode>(() => propTheme || layThemeHienTai());

  useEffect(() => {
    if (propTheme) {
      setActiveTheme(propTheme);
      return;
    }
    const handleThemeChange = (e: Event) => {
      const custom = e as CustomEvent<{ theme: ThemeMode }>;
      if (custom.detail?.theme) {
        setActiveTheme(custom.detail.theme);
      } else {
        setActiveTheme(layThemeHienTai());
      }
    };
    window.addEventListener(THEME_CHANGE_EVENT, handleThemeChange);
    return () => window.removeEventListener(THEME_CHANGE_EVENT, handleThemeChange);
  }, [propTheme]);

  const isLight = activeTheme === "light";

  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [showAllLabels, setShowAllLabels] = useState<boolean>(showLabelsByDefault);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [hoveredIslandId, setHoveredIslandId] = useState<string | null>(null);
  const [activeFocusKey, setActiveFocusKey] = useState<string>("overview");
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleZoomIn = () => setZoomLevel((z) => Math.min(3.8, z + 0.3));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(0.7, z - 0.3));
  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
    setActiveFocusKey("overview");
  };

  const handleFocusIsland = (islandId: string) => {
    setActiveFocusKey(islandId);
    if (islandId === "overview") {
      setZoomLevel(1);
      setPanOffset({ x: 0, y: 0 });
      return;
    }
    const target = VIETNAM_ISLANDS.find((i) => i.id === islandId);
    if (target) {
      setPanOffset(target.focusPoint);
      setZoomLevel(target.focusPoint.zoom);
      const prov = PROVINCES_34_LIST.find((p) => p.id === target.provinceId);
      if (prov) onSelectProvince(prov);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - panOffset.x, y: e.clientY - panOffset.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Danh sách các đô thị đặc biệt và thành phố lớn luôn hiện nhãn rõ nét
  const MAJOR_CITY_IDS = useMemo(
    () => new Set(["ha_noi", "ho_chi_minh", "da_nang", "hue", "hai_phong", "can_tho", "dien_bien", "ca_mau"]),
    []
  );

  const hoveredIsland = useMemo(
    () => (hoveredIslandId ? VIETNAM_ISLANDS.find((i) => i.id === hoveredIslandId) : null),
    [hoveredIslandId]
  );

  return (
    <div
      className={`flex flex-col w-full rounded-[var(--vien-lech-a)] border transition-colors overflow-hidden ${
        isLight
          ? "bg-gradient-to-b from-[#EBF7FC] via-[#F2FAF6] to-[#E3F2F9] border-sky-300/80 shadow-md"
          : "bg-gradient-to-b from-[#061424] via-[#091D33] to-[#040E1B] border-sky-500/30 shadow-xl"
      }`}
    >
      {/* ============================================================== */}
      {/* 1. THANH ĐIỀU KHIỂN & TIÊU ĐIỂM (ĐẶT Ở TRÊN ĐẦU, THOÁNG ĐÃNG)   */}
      {/* KHÔNG ĐẶT Ở DƯỚI ĐỂ TRÁNH CHE KHUẤT PHẦN ĐUÔI CÀ MAU/NAM BỘ     */}
      {/* ============================================================== */}
      <div className="flex items-center justify-between gap-2 p-2 sm:px-3 sm:py-2 border-b border-sky-200/50 dark:border-sky-500/20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm flex-wrap text-xs">
        {/* Nhóm trái: La bàn + Các nút Tiêu điểm */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span
            className={`flex items-center gap-1 px-2 py-0.5 rounded font-semibold text-[11px] border ${
              isLight
                ? "bg-white border-sky-300 text-sky-900 shadow-2xs"
                : "bg-slate-800 border-amber-400/40 text-amber-300 shadow-2xs"
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>BẮC (N)</span>
          </span>

          <span className="text-[11px] font-bold text-sky-800 dark:text-sky-300 px-1 flex items-center gap-1">
            <Anchor className="w-3 h-3 text-amber-500" />
            <span>Tiêu điểm:</span>
          </span>

          <button
            type="button"
            onClick={() => handleFocusIsland("overview")}
            className={`px-2 py-0.5 rounded font-semibold text-[11px] transition-all cursor-pointer ${
              activeFocusKey === "overview"
                ? "bg-sky-600 text-white shadow-2xs"
                : "text-slate-700 dark:text-slate-300 hover:bg-sky-100 dark:hover:bg-slate-800"
            }`}
          >
            Toàn cảnh
          </button>

          <button
            type="button"
            onClick={() => handleFocusIsland("hoang_sa")}
            className={`px-2 py-0.5 rounded font-bold text-[11px] transition-all cursor-pointer ${
              activeFocusKey === "hoang_sa"
                ? "bg-amber-500 text-white shadow-2xs"
                : "text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-950/60"
            }`}
          >
            ★ Hoàng Sa
          </button>

          <button
            type="button"
            onClick={() => handleFocusIsland("truong_sa")}
            className={`px-2 py-0.5 rounded font-bold text-[11px] transition-all cursor-pointer ${
              activeFocusKey === "truong_sa"
                ? "bg-amber-500 text-white shadow-2xs"
                : "text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-950/60"
            }`}
          >
            ★ Trường Sa
          </button>

          <button
            type="button"
            onClick={() => handleFocusIsland("phu_quoc")}
            className={`px-2 py-0.5 rounded font-semibold text-[11px] transition-all cursor-pointer ${
              activeFocusKey === "phu_quoc"
                ? "bg-teal-600 text-white shadow-2xs"
                : "text-teal-700 dark:text-teal-400 hover:bg-teal-100 dark:hover:bg-teal-950/60"
            }`}
          >
            Phú Quốc
          </button>

          <button
            type="button"
            onClick={() => handleFocusIsland("con_dao")}
            className={`px-2 py-0.5 rounded font-semibold text-[11px] transition-all cursor-pointer ${
              activeFocusKey === "con_dao"
                ? "bg-teal-600 text-white shadow-2xs"
                : "text-teal-700 dark:text-teal-400 hover:bg-teal-100 dark:hover:bg-teal-950/60"
            }`}
          >
            Côn Đảo
          </button>

          {/* Huy hiệu thông báo nhỏ gọn khi rê chuột lên đảo */}
          {hoveredIsland && (
            <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300 font-semibold text-[11px] border border-amber-400/40 animate-in fade-in">
              ★ {hoveredIsland.name} ({hoveredIsland.subText})
            </span>
          )}
        </div>

        {/* Nhóm phải: Nút thu phóng & bật/tắt nhãn */}
        <div className="flex items-center gap-1 ml-auto">
          <Tooltip title="Phóng to" content="Xem chi tiết các tỉnh thành" position="bottom">
            <button
              type="button"
              onClick={handleZoomIn}
              aria-label="Phóng to"
              className="w-6.5 h-6.5 flex items-center justify-center rounded hover:bg-sky-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </Tooltip>

          <Tooltip title="Thu nhỏ" content="Bao quát toàn cảnh đất nước" position="bottom">
            <button
              type="button"
              onClick={handleZoomOut}
              aria-label="Thu nhỏ"
              className="w-6.5 h-6.5 flex items-center justify-center rounded hover:bg-sky-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
          </Tooltip>

          <Tooltip title="Đặt lại" content="Trở về toàn cảnh ban đầu" position="bottom">
            <button
              type="button"
              onClick={handleResetZoom}
              aria-label="Đặt lại"
              className="w-6.5 h-6.5 flex items-center justify-center rounded hover:bg-sky-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </Tooltip>

          <Tooltip
            title="Bật/Tắt tên tỉnh"
            content={showAllLabels ? "Ẩn nhãn tên để ngắm trọn hình thể" : "Hiện đầy đủ tên tỉnh"}
            position="bottom"
          >
            <button
              type="button"
              onClick={() => setShowAllLabels(!showAllLabels)}
              aria-label="Hiện tên tỉnh"
              className={`w-6.5 h-6.5 flex items-center justify-center rounded transition-colors ${
                showAllLabels
                  ? "bg-sky-600 text-white"
                  : "text-slate-600 dark:text-slate-400 hover:bg-sky-100 dark:hover:bg-slate-800"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          </Tooltip>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. KHUNG BẢN ĐỒ SVG (CHUẨN 920 x 1200)                         */}
      {/* TOÀN BỘ KHÔNG BỊ Ô NÀO CHE KHUẤT PHẦN ĐUÔI BẢN ĐỒ              */}
      {/* ============================================================== */}
      <div className="relative w-full aspect-[920/1200] max-h-[82vh] flex items-center justify-center overflow-hidden select-none">
        <svg
          viewBox="0 0 920 1200"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className={`w-full h-full select-none ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
            transformOrigin: "center center",
            transition: isDragging ? "none" : "transform 0.25s ease-out",
          }}
        >
          <defs>
            {/* Lưới hải văn tọa độ hải đồ cổ */}
            <pattern id="grid-sea" width="90" height="90" patternUnits="userSpaceOnUse">
              <path
                d="M 90 0 L 0 0 0 90"
                fill="none"
                stroke={isLight ? "rgba(3, 105, 161, 0.12)" : "rgba(56, 189, 248, 0.1)"}
                strokeWidth="0.5"
              />
            </pattern>

            {/* Vành san hô atoll phát sáng */}
            <radialGradient id="atoll-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={isLight ? "#06B6D4" : "#22D3EE"} stopOpacity="0.45" />
              <stop offset="100%" stopColor={isLight ? "#0EA5E9" : "#0284C7"} stopOpacity="0" />
            </radialGradient>

            {/* Hiệu ứng hào quang khi chọn tỉnh */}
            <filter id="glow-gold" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="4.5" floodColor={isLight ? "#EA580C" : "#F59E0B"} floodOpacity={isLight ? "0.75" : "0.9"} />
            </filter>

            {/* Hiệu ứng hào quang cho hải đảo */}
            <filter id="glow-island" x="-40%" y="-40%" width="180%" height="180%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#F59E0B" floodOpacity="0.85" />
            </filter>
          </defs>

          {/* Lớp nền biển Đông & lưới hải văn (Click vào biển để bỏ chọn tỉnh) */}
          <rect
            width="920"
            height="1200"
            fill="url(#grid-sea)"
            className="cursor-default"
            onClick={() => {
              if (selectedProvinceId) {
                onSelectProvince(null as any);
              }
            }}
          />

          {/* ============================================================== */}
          {/* LƯỚI TỌA ĐỘ VĨ TUYẾN & KINH TUYẾN CHUẨN XÁC BIỂN ĐÔNG           */}
          {/* ============================================================== */}
          <g id="nautical-graticules-layer" className="pointer-events-none opacity-35">
            {/* Vĩ tuyến 20°B */}
            <line x1="310" y1="241" x2="900" y2="241" stroke={isLight ? "#0284C7" : "#38BDF8"} strokeDasharray="3 4" strokeWidth="0.6" />
            <text x="895" y="238" textAnchor="end" fill={isLight ? "#0369A1" : "#7DD3FC"} fontSize="7" fontFamily="sans-serif">20° BẮC</text>

            {/* Vĩ tuyến 16°B (ngang Hoàng Sa / Đà Nẵng) */}
            <line x1="420" y1="539" x2="900" y2="539" stroke={isLight ? "#0284C7" : "#38BDF8"} strokeDasharray="3 4" strokeWidth="0.6" />
            <text x="895" y="536" textAnchor="end" fill={isLight ? "#0369A1" : "#7DD3FC"} fontSize="7" fontFamily="sans-serif">16° BẮC</text>

            {/* Vĩ tuyến 12°B */}
            <line x1="495" y1="837" x2="900" y2="837" stroke={isLight ? "#0284C7" : "#38BDF8"} strokeDasharray="3 4" strokeWidth="0.6" />
            <text x="895" y="834" textAnchor="end" fill={isLight ? "#0369A1" : "#7DD3FC"} fontSize="7" fontFamily="sans-serif">12° BẮC</text>

            {/* Vĩ tuyến 8°B (Trường Sa / Côn Đảo) */}
            <line x1="260" y1="1136" x2="900" y2="1136" stroke={isLight ? "#0284C7" : "#38BDF8"} strokeDasharray="3 4" strokeWidth="0.6" />
            <text x="895" y="1133" textAnchor="end" fill={isLight ? "#0369A1" : "#7DD3FC"} fontSize="7" fontFamily="sans-serif">8° BẮC</text>

            {/* Kinh tuyến 108°Đ */}
            <line x1="407" y1="100" x2="407" y2="1160" stroke={isLight ? "#0284C7" : "#38BDF8"} strokeDasharray="3 4" strokeWidth="0.6" />
            <text x="407" y="1175" textAnchor="middle" fill={isLight ? "#0369A1" : "#7DD3FC"} fontSize="7" fontFamily="sans-serif">108° ĐÔNG</text>

            {/* Kinh tuyến 112°Đ (ngang cụm Hoàng Sa) */}
            <line x1="687" y1="350" x2="687" y2="1160" stroke={isLight ? "#0284C7" : "#38BDF8"} strokeDasharray="3 4" strokeWidth="0.6" />
            <text x="687" y="1175" textAnchor="middle" fill={isLight ? "#0369A1" : "#7DD3FC"} fontSize="7" fontFamily="sans-serif">112° ĐÔNG</text>

            {/* Kinh tuyến 116°Đ (phía đông Trường Sa) */}
            <line x1="880" y1="500" x2="880" y2="1160" stroke={isLight ? "#0284C7" : "#38BDF8"} strokeDasharray="3 4" strokeWidth="0.6" />
            <text x="880" y="1175" textAnchor="middle" fill={isLight ? "#0369A1" : "#7DD3FC"} fontSize="7" fontFamily="sans-serif">116° ĐÔNG</text>
          </g>

          {/* Chữ ghi dấu Vịnh Bắc Bộ */}
          <text
            x="375"
            y="295"
            fill={isLight ? "rgba(3, 105, 161, 0.35)" : "rgba(56, 189, 248, 0.3)"}
            fontSize="12"
            fontFamily="var(--font-than)"
            letterSpacing="3"
            textAnchor="middle"
            className="pointer-events-none select-none font-bold italic"
          >
            VỊNH BẮC BỘ
          </text>

          {/* Chữ ghi dấu Vịnh Thái Lan */}
          <text
            x="95"
            y="915"
            fill={isLight ? "rgba(3, 105, 161, 0.35)" : "rgba(56, 189, 248, 0.3)"}
            fontSize="12"
            fontFamily="var(--font-than)"
            letterSpacing="3"
            textAnchor="middle"
            className="pointer-events-none select-none font-bold italic"
          >
            VỊNH THÁI LAN
          </text>

          {/* Chữ ghi dấu Biển Đông */}
          <text
            x="685"
            y="675"
            fill={isLight ? "rgba(3, 105, 161, 0.42)" : "rgba(251, 191, 36, 0.38)"}
            fontSize="21"
            fontFamily="var(--font-than)"
            letterSpacing="6"
            textAnchor="middle"
            className="pointer-events-none select-none font-bold italic"
          >
            BIỂN ĐÔNG VIỆT NAM
          </text>

          {/* ============================================================== */}
          {/* 34 TỈNH THÀNH VIỆT NAM (CHUẨN XÁC 100% SHAPE GEOJSON)          */}
          {/* ============================================================== */}
          <g id="vietnam-34-provinces-layer">
            {PROVINCES_34_LIST.map((province) => {
              const pathData = PROVINCES_34_SVG_PATHS[province.id];
              if (!pathData) return null;

              const isSelected = selectedProvinceId === province.id;
              const isHovered = hoveredProvinceId === province.id;
              const isFilteredOut =
                (filteredProvinceIds && !filteredProvinceIds.includes(province.id)) ||
                (activeRegionFilter && activeRegionFilter !== "all" && province.region !== activeRegionFilter);

              let fillColor = "";
              let strokeColor = "";

              if (isSelected) {
                fillColor = isLight ? "#EA580C" : "#F59E0B";
                strokeColor = "#FFFFFF";
              } else if (isHovered) {
                fillColor = isLight ? "#FBBF24" : "#FDE047";
                strokeColor = isLight ? "#B45309" : "#FFFFFF";
              } else if (isFilteredOut) {
                fillColor = isLight ? "#F1F5F9" : "#1E293B";
                strokeColor = isLight ? "#CBD5E1" : "#334155";
              } else {
                switch (province.region) {
                  case "bac":
                    fillColor = isLight ? "#86EFAC" : "#15803D";
                    strokeColor = isLight ? "#166534" : "#4ADE80";
                    break;
                  case "trung":
                    fillColor = isLight ? "#FDE047" : "#B45309";
                    strokeColor = isLight ? "#A16207" : "#FACC15";
                    break;
                  case "taynguyen":
                    fillColor = isLight ? "#FDBA74" : "#9A3412";
                    strokeColor = isLight ? "#C2410C" : "#FB923C";
                    break;
                  case "nam":
                    fillColor = isLight ? "#99F6E4" : "#0F766E";
                    strokeColor = isLight ? "#0F766E" : "#2DD4BF";
                    break;
                  default:
                    fillColor = isLight ? "#E2E8F0" : "#334155";
                    strokeColor = isLight ? "#94A3B8" : "#64748B";
                }
              }

              const strokeWidth = isSelected ? 3 : isHovered ? 2.2 : isLight ? 1.3 : 1.4;

              return (
                <path
                  key={province.id}
                  id={`province-${province.id}`}
                  d={pathData}
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  filter={isSelected ? "url(#glow-gold)" : undefined}
                  className="transition-all duration-200 cursor-pointer"
                  onMouseEnter={() => onHoverProvince(province.id)}
                  onMouseLeave={() => onHoverProvince(null)}
                  onClick={() => {
                    if (selectedProvinceId === province.id) {
                      onSelectProvince(null as any);
                    } else {
                      onSelectProvince(province);
                    }
                  }}
                />
              );
            })}
          </g>

          {/* ============================================================== */}
          {/* LỚP VÀNH SAN HÔ & ATOLL BIỂN SÂU (HOÀNG SA & TRƯỜNG SA)        */}
          {/* ============================================================== */}
          <g id="vietnam-atolls-layer" className="pointer-events-none">
            {VIETNAM_ISLANDS.map((island) => {
              if (!island.atollPath) return null;
              return (
                <path
                  key={`atoll-${island.id}`}
                  d={island.atollPath}
                  fill={isLight ? "rgba(6, 182, 212, 0.22)" : "rgba(34, 211, 238, 0.2)"}
                  stroke={isLight ? "rgba(14, 165, 233, 0.55)" : "rgba(56, 189, 248, 0.5)"}
                  strokeWidth="1.2"
                  strokeDasharray="4 2"
                />
              );
            })}
          </g>

          {/* ============================================================== */}
          {/* HẢI ĐẢO & QUẦN ĐẢO THIÊNG LIÊNG (GỌN GÀNG, KHÔNG RỐI CHỮ)     */}
          {/* ============================================================== */}
          <g id="vietnam-islands-layer">
            {VIETNAM_ISLANDS.map((island) => {
              const isProvHovered = hoveredProvinceId === island.provinceId;
              const isProvSelected = selectedProvinceId === island.provinceId;
              const isIslandHovered = hoveredIslandId === island.id;
              const isMajorGroup = island.category === "archipelago" || island.id === "phu_quoc";

              return (
                <g
                  key={island.id}
                  className="cursor-pointer group"
                  onMouseEnter={() => {
                    setHoveredIslandId(island.id);
                    onHoverProvince(island.provinceId);
                  }}
                  onMouseLeave={() => {
                    setHoveredIslandId(null);
                    onHoverProvince(null);
                  }}
                  onClick={() => {
                    const prov = PROVINCES_34_LIST.find((p) => p.id === island.provinceId);
                    if (prov) onSelectProvince(prov);
                  }}
                >
                  {/* Đảo nổi / Đá san hô chính */}
                  <path
                    d={island.path}
                    fill={
                      isProvSelected || isIslandHovered
                        ? isLight
                          ? "#F59E0B"
                          : "#FDE047"
                        : isProvHovered
                        ? isLight
                          ? "#FDE047"
                          : "#FEF08A"
                        : isMajorGroup
                        ? isLight
                          ? "#D97706"
                          : "#F59E0B"
                        : isLight
                        ? "#0284C7"
                        : "#38BDF8"
                    }
                    stroke="#FFFFFF"
                    strokeWidth={isProvHovered || isIslandHovered ? 2.4 : isMajorGroup ? 1.6 : 1.2}
                    filter={isIslandHovered || isProvSelected ? "url(#glow-island)" : undefined}
                    className="transition-all duration-200"
                  />

                  {/* 1 DÒNG TÊN GỌN GÀNG CHO HOÀNG SA & TRƯỜNG SA (KHÔNG BỊ QUÁ NHIỀU CHỮ) */}
                  {island.id === "hoang_sa" || island.id === "truong_sa" ? (
                    <g transform={`translate(${island.labelPoint.x}, ${island.labelPoint.y})`} className="pointer-events-none select-none">
                      <text
                        x="0"
                        y="0"
                        textAnchor="middle"
                        fill={isLight ? "#9A3412" : "#FDE047"}
                        fontSize="8.5"
                        fontFamily="var(--font-than)"
                        fontWeight="700"
                        style={{
                          textShadow: isLight
                            ? "0 1px 3px #FFFFFF, 0 -1px 3px #FFFFFF, 1px 0 3px #FFFFFF, -1px 0 3px #FFFFFF, 0 0 5px #FFFFFF"
                            : "0 1px 4px #000000, 0 0 5px rgba(0,0,0,0.9)",
                        }}
                      >
                        ★ {island.id === "hoang_sa" ? "QĐ. Hoàng Sa" : "QĐ. Trường Sa"}
                      </text>
                    </g>
                  ) : island.id === "phu_quoc" || island.id === "con_dao" ? (
                    /* Phú Quốc & Côn Đảo: 1 dòng chữ gọn nhẹ */
                    <g transform={`translate(${island.labelPoint.x}, ${island.labelPoint.y})`} className="pointer-events-none select-none">
                      <text
                        x="0"
                        y="0"
                        textAnchor="middle"
                        fill={
                          isProvSelected || isIslandHovered
                            ? isLight
                              ? "#B45309"
                              : "#FDE047"
                            : isLight
                            ? "#1E293B"
                            : "#F8FAFC"
                        }
                        fontSize="7.5"
                        fontFamily="var(--font-than)"
                        fontWeight="600"
                        style={{
                          textShadow: isLight
                            ? "0 1px 2px #FFFFFF, 0 -1px 2px #FFFFFF, 1px 0 2px #FFFFFF, -1px 0 2px #FFFFFF, 0 0 4px #FFFFFF"
                            : "0 1px 3px #000000, 0 0 4px rgba(0,0,0,0.9)",
                        }}
                      >
                        {island.id === "phu_quoc" ? "Phú Quốc" : "Côn Đảo"}
                      </text>
                    </g>
                  ) : (
                    /* Các đảo nhỏ ven bờ: chỉ hiện nhãn khi rê chuột để bản đồ không bị rối */
                    (isIslandHovered || isProvHovered || isProvSelected) && (
                      <g transform={`translate(${island.labelPoint.x}, ${island.labelPoint.y})`} className="pointer-events-none select-none">
                        <text
                          x="0"
                          y="0"
                          textAnchor="middle"
                          fill={isLight ? "#B45309" : "#FDE047"}
                          fontSize="6.8"
                          fontFamily="var(--font-than)"
                          fontWeight="600"
                          style={{
                            textShadow: isLight
                              ? "0 1px 2px #FFFFFF, 0 -1px 2px #FFFFFF, 1px 0 2px #FFFFFF, -1px 0 2px #FFFFFF"
                              : "0 1px 3px #000000",
                          }}
                        >
                          {island.name.replace(/^Đảo\s+|^Quần đảo\s+/, "")}
                        </text>
                      </g>
                    )
                  )}
                </g>
              );
            })}
          </g>

          {/* ============================================================== */}
          {/* NHÃN TÊN TỈNH THÀNH (LABELS & MARKERS)                          */}
          {/* ============================================================== */}
          <g id="vietnam-province-labels-layer" className="pointer-events-none select-none">
            {PROVINCES_34_LIST.map((province) => {
              const isSelected = selectedProvinceId === province.id;
              const isHovered = hoveredProvinceId === province.id;
              const isMajor = MAJOR_CITY_IDS.has(province.id);
              const isFilteredOut =
                (filteredProvinceIds && !filteredProvinceIds.includes(province.id)) ||
                (activeRegionFilter && activeRegionFilter !== "all" && province.region !== activeRegionFilter);

              if (isFilteredOut) return null;
              if (!showAllLabels && !isMajor && !isSelected && !isHovered) return null;

              const cx = province.center.x;
              const cy = province.center.y;

              return (
                <g
                  key={`label-${province.id}`}
                  transform={`translate(${cx}, ${cy})`}
                  className="transition-all duration-200"
                >
                  {/* Chấm tâm thành phố / tỉnh lỵ */}
                  <circle
                    r={isSelected ? 3.8 : isMajor ? 2.6 : 1.8}
                    fill={
                      isSelected
                        ? "#FFF"
                        : isHovered
                        ? isLight
                          ? "#D97706"
                          : "#FDE047"
                        : isMajor
                        ? isLight
                          ? "#D97706"
                          : "#FBBF24"
                        : isLight
                        ? "#059669"
                        : "#86EFAC"
                    }
                    stroke={isLight ? "#FFFFFF" : "#0F172A"}
                    strokeWidth="0.8"
                  />

                  {/* Nhãn chữ tên tỉnh */}
                  <text
                    y={isMajor ? -6 : -4}
                    textAnchor="middle"
                    fill={
                      isSelected
                        ? isLight
                          ? "#78350F"
                          : "#FFFFFF"
                        : isHovered
                        ? isLight
                          ? "#92400E"
                          : "#FEF08A"
                        : isMajor
                        ? isLight
                          ? "#0F172A"
                          : "#FDE047"
                        : isLight
                        ? "#1E293B"
                        : "#F8FAFC"
                    }
                    fontSize={isSelected ? "9.5" : isMajor ? "8.2" : "6.8"}
                    fontFamily="var(--font-than)"
                    fontWeight={isSelected || isMajor ? "700" : "600"}
                    style={{
                      textShadow: isLight
                        ? "0 1px 2px #FFFFFF, 0 -1px 2px #FFFFFF, 1px 0 2px #FFFFFF, -1px 0 2px #FFFFFF, 0 0 3px #FFFFFF"
                        : "0 1px 3px rgba(0,0,0,0.95), 0 0 3px rgba(0,0,0,0.9)",
                    }}
                  >
                    {province.name}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>
    </div>
  );
}
