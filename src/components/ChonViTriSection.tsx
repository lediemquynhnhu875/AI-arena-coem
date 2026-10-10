/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * CHỌN VỊ TRÍ & THỜI TIẾT (LOCATION & WEATHER SELECTION)
 * Thiết kế tinh gọn, màu sắc hài hòa theo tông chủ đạo, không bị lỗi tương phản.
 */

import React, { useState, useEffect, useRef } from "react";
import {
  ThoiTietState,
  ThongTinViTri,
  DiaDiemGoiY,
  timKiemDiaDiem,
  xinQuyenViTriTrinhDuyet,
  luuViTriSession,
  layViTriMacDinhTheoVung,
} from "../lib/thoitiet";
import { VungId, vungData } from "../data/vung";
import { dinhDangThoiTietChuoi } from "../lib/loiKe";
import { MapPin, Search, Landmark, AlertCircle, Loader2, RotateCcw } from "lucide-react";

interface Props {
  weatherState: ThoiTietState;
  onViTriChange: (newViTri: ThongTinViTri) => void;
  onSelectVung?: (vungId: VungId) => void;
  compact?: boolean;
}

export default function ChonViTriSection({
  weatherState,
  onViTriChange,
  onSelectVung,
}: Props) {
  const { viTri, nhietDo, thoiTiet, moTaThoiTiet, doAm, vung } = weatherState;

  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<DiaDiemGoiY[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchBox, setShowSearchBox] = useState(false);

  const [isRequestingGps, setIsRequestingGps] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  const debounceTimer = useRef<number | null>(null);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    if (debounceTimer.current) {
      window.clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = window.setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await timKiemDiaDiem(searchQuery);
        setSuggestions(results);
      } finally {
        setIsSearching(false);
      }
    }, 200);

    return () => {
      if (debounceTimer.current) window.clearTimeout(debounceTimer.current);
    };
  }, [searchQuery]);

  const handleRequestGeolocation = async () => {
    setIsRequestingGps(true);
    setGpsError(null);
    try {
      const result = await xinQuyenViTriTrinhDuyet();
      luuViTriSession(result);
      onViTriChange(result);
      if (onSelectVung && result.vungId !== vung.id) {
        onSelectVung(result.vungId);
      }
      setShowSearchBox(false);
    } catch {
      setGpsError("Không thể lấy vị trí từ trình duyệt.");
      setShowSearchBox(true);
    } finally {
      setIsRequestingGps(false);
    }
  };

  const handleSelectLocation = (loc: DiaDiemGoiY) => {
    const tenHienThi = loc.tinh && loc.tinh !== loc.ten ? `${loc.ten} - ${loc.tinh}` : loc.ten;
    const newViTri: ThongTinViTri = {
      ten: tenHienThi,
      lat: loc.lat,
      lon: loc.lon,
      nguon: "tim_kiem",
      vungId: loc.vungId,
    };
    luuViTriSession(newViTri);
    onViTriChange(newViTri);
    if (onSelectVung && loc.vungId !== vung.id) {
      onSelectVung(loc.vungId);
    }
    setSearchQuery("");
    setSuggestions([]);
    setShowSearchBox(false);
  };

  const handleResetToDefault = (targetVungId: VungId = vung.id) => {
    const defaultViTri = layViTriMacDinhTheoVung(targetVungId);
    luuViTriSession(null);
    onViTriChange(defaultViTri);
    if (onSelectVung && targetVungId !== vung.id) {
      onSelectVung(targetVungId);
    }
    setShowSearchBox(false);
    setGpsError(null);
  };

  const chuoiThoiTietHienTai = dinhDangThoiTietChuoi({
    noi: viTri.ten,
    nhietDo,
    thoiTiet,
    moTa: moTaThoiTiet,
    doAm,
    kemDoAm: true,
  });

  return (
    <div className="vpr-chon-vi-tri space-y-2.5">
      {/* 1. THẺ THỜI TIẾT HIỆN TẠI: Màu sắc hài hòa, chữ rõ ràng */}
      <div className="p-3 rounded-xl bg-amber-50/80 dark:bg-slate-800/80 border border-amber-200/60 dark:border-slate-700 flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full inline-flex items-center gap-1 bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border border-amber-300/50 dark:border-amber-700/50">
            {viTri.nguon === "gps" && (
              <>
                <MapPin className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span>Vị trí GPS</span>
              </>
            )}
            {viTri.nguon === "tim_kiem" && (
              <>
                <Search className="w-3 h-3 text-sky-600 dark:text-sky-400" />
                <span>Địa điểm tùy chọn</span>
              </>
            )}
            {viTri.nguon === "mac_dinh" && (
              <>
                <Landmark className="w-3 h-3 text-amber-700 dark:text-amber-400" />
                <span>Mặc định theo vùng</span>
              </>
            )}
          </span>

          {viTri.nguon !== "mac_dinh" && (
            <button
              type="button"
              onClick={() => handleResetToDefault(vung.id)}
              className="text-xs text-amber-800 dark:text-amber-300 hover:underline cursor-pointer inline-flex items-center gap-1 font-medium"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Về mặc định ({vung.noi})</span>
            </button>
          )}
        </div>

        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 m-0">
          {chuoiThoiTietHienTai}
        </p>
      </div>

      {/* 2. CÁC NÚT THAO TÁC: DÙNG GPS HOẶC TÌM KIẾM */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={handleRequestGeolocation}
          disabled={isRequestingGps}
          className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-xl border border-amber-300 dark:border-amber-700/60 bg-white dark:bg-slate-800 text-amber-950 dark:text-amber-200 hover:bg-amber-50/70 transition-all cursor-pointer shadow-xs"
        >
          {isRequestingGps ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-700" />
          ) : (
            <MapPin className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
          )}
          <span>{isRequestingGps ? "Đang định vị..." : "Dùng GPS"}</span>
        </button>

        <button
          type="button"
          onClick={() => setShowSearchBox((prev) => !prev)}
          className={`flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-xl border transition-all cursor-pointer shadow-xs ${
            showSearchBox
              ? "bg-amber-100 dark:bg-slate-700 border-amber-400 text-amber-950 dark:text-amber-100 font-bold"
              : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50"
          }`}
        >
          <Search className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
          <span>Tìm nơi khác</span>
        </button>
      </div>

      {/* Báo lỗi GPS nếu có */}
      {gpsError && (
        <div className="p-2 text-xs text-amber-800 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-lg flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>{gpsError}</span>
        </div>
      )}

      {/* Ô tìm kiếm địa điểm khi bấm mở */}
      {showSearchBox && (
        <div className="p-2.5 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl space-y-2">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Gõ tên thành phố (ví dụ: Đà Lạt, Sa Pa, Nha Trang...)"
              className="w-full py-1.5 px-3 pr-8 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-500"
              autoFocus
            />
            {isSearching && (
              <span className="absolute right-2.5 top-2 text-amber-600 animate-spin">
                <Loader2 className="w-3.5 h-3.5" />
              </span>
            )}
          </div>

          {suggestions.length > 0 && (
            <ul className="max-h-36 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 m-0 p-0 list-none">
              {suggestions.slice(0, 5).map((item, idx) => {
                const label = item.tinh && item.tinh !== item.ten ? `${item.ten} - ${item.tinh}` : item.ten;
                return (
                  <li key={`${item.ten}-${idx}`}>
                    <button
                      type="button"
                      onClick={() => handleSelectLocation(item)}
                      className="w-full text-left py-1.5 px-2.5 text-xs hover:bg-amber-50 dark:hover:bg-slate-800 flex items-center justify-between text-slate-800 dark:text-slate-200 cursor-pointer"
                    >
                      <span className="font-semibold">{label}</span>
                      <span className="text-[11px] text-amber-700 dark:text-amber-400 font-bold">
                        {item.vungId.toUpperCase()}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}

      {/* 3. CHỌN NHANH 4 VÙNG DI SẢN: Trực quan, đồng bộ màu sắc */}
      {onSelectVung && (
        <div className="pt-1">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            {vungData.map((v) => {
              const isSelected = v.id === vung.id && viTri.nguon === "mac_dinh";
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => handleResetToDefault(v.id)}
                  className={`py-1.5 px-2 text-xs rounded-xl border text-center transition-all cursor-pointer ${
                    isSelected
                      ? "bg-amber-700 text-white border-amber-800 font-bold shadow-xs"
                      : "bg-white dark:bg-slate-800 border-amber-200/50 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-amber-50/50 font-medium"
                  }`}
                >
                  <div className="text-xs font-semibold leading-tight">{v.noi}</div>
                  <div className={`text-[11px] mt-0.5 ${isSelected ? "text-amber-100" : "text-slate-400"}`}>
                    {v.ten}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
