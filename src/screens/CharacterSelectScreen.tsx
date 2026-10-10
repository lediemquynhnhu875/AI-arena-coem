/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * XƯỞNG MAY ĐO & TẠO DÁNG NHÂN VẬT (HERITAGE CHARACTER ATELIER)
 * - Tập trung đồ họa cao độ: Manơcanh 2D sắc nét, tỉ lệ giải phẫu cân xứng, không lỗi đồ họa
 * - Toàn bộ nút bấm đồng nhất 1 font chữ: font-sans (Be Vietnam Pro)
 * - Tách file mô-đun hóa: StudioTopBar, GarmentQuickTester, CustomTuningPanel, PresetSelectorPanel
 * - Bố cục chuẩn xác, không bị cắt góc, không bị ẩn hay tràn viền
 */

import React, { useState, useEffect } from "react";
import CharacterRenderer from "../characters/CharacterRenderer";
import { tinhSoDo } from "../characters/dimensions/proportions";
import { renderGarmentLayers } from "../characters/garments/GarmentRegistry";
import { toCroquisBodyType } from "../characters/croquis/BodyPartLayering";
import { CharacterModel } from "../characters/models/CharacterModel";
import { HERITAGE_PRESETS, HeritagePreset } from "../characters/presets/heritagePresets";
import { CharacterStorageService } from "../characters/services/CharacterStorageService";
import { NhanVatConfig } from "../lib/avatar";
import { ArrowLeft } from "lucide-react";
import {
  StudioTopBar,
  GarmentQuickTester,
  CustomTuningPanel,
  PresetSelectorPanel,
} from "../components/character-studio";

type Props = {
  initialConfig?: NhanVatConfig;
  onSave: (config: NhanVatConfig) => void;
  onBack: () => void;
};

export default function CharacterSelectScreen({
  initialConfig,
  onSave,
  onBack,
}: Props) {
  const [config, setConfig] = useState<NhanVatConfig>(() => {
    return CharacterStorageService.loadCharacter(initialConfig).toConfig();
  });

  const [activeTab, setActiveTab] = useState<"custom" | "presets">("custom");
  const [huongNhin, setHuongNhin] = useState<"truoc" | "sau" | "ca_hai">("ca_hai");
  const [viewMode, setViewMode] = useState<"toan_than" | "can_canh">("toan_than");
  const [previewGarment, setPreviewGarment] = useState<"yem" | "aodai" | "ngu_than" | "ba_ba" | "tu_than" | null>("aodai");

  useEffect(() => {
    CharacterStorageService.saveCharacter(config);
  }, [config]);

  const updateField = <K extends keyof NhanVatConfig>(field: K, val: NhanVatConfig[K]) => {
    setConfig((prev) => ({
      ...prev,
      [field]: val,
    }));
  };

  const handleApplyPreset = (preset: HeritagePreset) => {
    setConfig({
      ...preset.config,
    });
  };

  const handleComplete = () => {
    CharacterStorageService.saveCharacter(config);
    onSave(config);
  };

  // Chế độ cận cảnh và toàn thân: tâm đối xứng X=200 chuẩn croquis
  const currentViewBox = viewMode === "can_canh" ? "100 130 200 480" : "80 35 240 735";
  const soDo = tinhSoDo(config);

  const previewColor =
    previewGarment === "yem"
      ? "#B45309"
      : previewGarment === "aodai"
      ? "#0284C7"
      : previewGarment === "ba_ba"
      ? "#047857"
      : previewGarment === "tu_than"
      ? "#9F1239"
      : "#BE123C";

  const bodyType = toCroquisBodyType(config.tuoi);

  const garmentLayersFront = previewGarment ? renderGarmentLayers({
    trangPhucId: previewGarment,
    mauHex: previewColor,
    phuKienIds: [],
    soDo,
    bodyType,
    huongNhin: "truoc",
  }) : null;

  const garmentLayersBack = previewGarment ? renderGarmentLayers({
    trangPhucId: previewGarment,
    mauHex: previewColor,
    phuKienIds: [],
    soDo,
    bodyType,
    huongNhin: "sau",
  }) : null;

  return (
    <main className="character-screen min-h-screen flex flex-col font-sans px-3 sm:px-6 pb-6">
      
      {/* 1. THANH ĐIỀU HƯỚNG TRÊN CÙNG: TINH TẾ */}
      <header className="w-full max-w-7xl mx-auto flex items-center justify-between gap-3 mb-2.5">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-300/60 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 text-amber-900 dark:text-amber-200 text-xs sm:text-sm font-semibold hover:bg-amber-100/60 transition-all cursor-pointer font-sans shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại</span>
        </button>

        <h1 className="text-sm sm:text-base font-bold text-amber-950 dark:text-amber-100 tracking-wide font-sans">
          Xưởng Tạo Dáng Nhân Vật 2D
        </h1>

        <button
          type="button"
          onClick={() => {
            const def = CharacterModel.createDefault().toConfig();
            setConfig(def);
          }}
          className="text-xs font-semibold text-amber-800 dark:text-amber-300 hover:underline cursor-pointer px-2 py-1 font-sans"
        >
          Mặc định
        </button>
      </header>

      {/* 2. BỐ CỤC: KHUNG MANƠCANH PHỐI ĐỒ ƯU TIÊN 7 CỘT (7:5) ĐỂ NGƯỜI MẪU TO RÕ TỐI ĐA */}
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-4 items-stretch font-sans">
        
        {/* ============================================================== */}
        {/* CỘT TRÁI: KHUNG PHỐI ĐỒ CHÍNH TO LỚN, RÕ NÉT (7 COLS DESKTOP)   */}
        {/* ============================================================== */}
        <section className="lg:col-span-7 xl:col-span-7 flex flex-col">
          <div className="char-studio-card w-full p-3 sm:p-3.5 flex flex-col justify-between relative overflow-hidden h-full min-h-[560px] lg:min-h-[640px]">
            
            {/* Vầng hào quang nhẹ sau manơcanh */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-amber-200/35 dark:bg-amber-500/10 blur-3xl pointer-events-none" />

            {/* Dòng thanh tiêu đề nhỏ trong khung người mẫu (Mô-đun tách biệt) */}
            <StudioTopBar
              gioi={config.gioi}
              huongNhin={huongNhin}
              viewMode={viewMode}
              onHuongNhinChange={setHuongNhin}
              onViewModeChange={setViewMode}
            />

            {/* SÂN KHẤU CHÍNH: HIỂN THỊ MANNEQUIN 2D TO LỚN, ÔM SÁT KHUNG KHÔNG KHOẢNG TRỐNG THỪA */}
            {huongNhin === "ca_hai" ? (
              <div className="relative w-full flex-1 min-h-[480px] lg:min-h-[540px] flex items-center justify-center gap-3 sm:gap-6 overflow-hidden py-1">
                {/* MẪU MẶT TRƯỚC */}
                <div className="flex flex-col items-center h-full flex-1 max-w-[280px]">
                  <span className="text-[11px] font-bold text-amber-950 dark:text-amber-100 mb-1 bg-amber-100/90 dark:bg-slate-800 px-2.5 py-0.5 rounded-full border border-amber-300/50 shadow-xs font-sans">
                    Mặt trước
                  </span>
                  <CharacterRenderer
                    nhanVat={{ ...config, huongNhin: "truoc" }}
                    huongNhin="truoc"
                    hienDoLot={true}
                    scalePreset="xl"
                    customViewBox={currentViewBox}
                    className="w-auto h-full max-h-[520px] lg:max-h-[600px] drop-shadow-[0_12px_28px_rgba(30,41,59,0.18)] transition-all duration-300"
                    childrenAo={garmentLayersFront?.childrenAo}
                    childrenVayQuan={garmentLayersFront?.childrenVayQuan}
                    childrenPhuKienThan={garmentLayersFront?.childrenPhuKienThan}
                    childrenTocTruocKhanNon={garmentLayersFront?.childrenTocTruocKhanNon}
                  />
                </div>

                {/* MẪU MẶT SAU */}
                <div className="flex flex-col items-center h-full flex-1 max-w-[280px]">
                  <span className="text-[11px] font-bold text-amber-950 dark:text-amber-100 mb-1 bg-amber-100/90 dark:bg-slate-800 px-2.5 py-0.5 rounded-full border border-amber-300/50 shadow-xs font-sans">
                    Mặt sau
                  </span>
                  <CharacterRenderer
                    nhanVat={{ ...config, huongNhin: "sau" }}
                    huongNhin="sau"
                    hienDoLot={true}
                    scalePreset="xl"
                    customViewBox={currentViewBox}
                    className="w-auto h-full max-h-[520px] lg:max-h-[600px] drop-shadow-[0_12px_28px_rgba(30,41,59,0.18)] transition-all duration-300"
                    childrenAo={garmentLayersBack?.childrenAo}
                    childrenVayQuan={garmentLayersBack?.childrenVayQuan}
                    childrenPhuKienThan={garmentLayersBack?.childrenPhuKienThan}
                  />
                </div>
              </div>
            ) : (
              <div className="relative w-full flex-1 min-h-[480px] lg:min-h-[540px] flex items-center justify-center overflow-hidden py-1">
                <CharacterRenderer
                  nhanVat={{ ...config, huongNhin }}
                  huongNhin={huongNhin}
                  hienDoLot={true}
                  scalePreset="xl"
                  customViewBox={currentViewBox}
                  className="w-auto h-full max-h-[540px] lg:max-h-[620px] drop-shadow-[0_12px_28px_rgba(30,41,59,0.18)] transition-all duration-300"
                  childrenAo={huongNhin === "sau" ? garmentLayersBack?.childrenAo : garmentLayersFront?.childrenAo}
                  childrenVayQuan={huongNhin === "sau" ? garmentLayersBack?.childrenVayQuan : garmentLayersFront?.childrenVayQuan}
                  childrenPhuKienThan={huongNhin === "sau" ? garmentLayersBack?.childrenPhuKienThan : garmentLayersFront?.childrenPhuKienThan}
                  childrenTocTruocKhanNon={huongNhin === "truoc" ? garmentLayersFront?.childrenTocTruocKhanNon : undefined}
                />
              </div>
            )}

            {/* BẢNG ĐIỀU KHIỂN KHOÁC THỬ TRANG PHỤC GỌN GÀNG VÀ CHỈ BÁO HIỆU CHUẨN THỂ TRẠNG */}
            <GarmentQuickTester
              previewGarment={previewGarment}
              onPreviewGarmentChange={setPreviewGarment}
              fitStatusText={garmentLayersFront?.fitAdjustment?.fitStatusText}
              badgeLabel={garmentLayersFront?.fitAdjustment?.badgeLabel}
            />
          </div>
        </section>

        {/* ============================================================== */}
        {/* CỘT PHẢI: BỘ CHỌN KHUÔN MẪU & TÙY BIẾN GỌN GÀNG (5 COLS)        */}
        {/* ============================================================== */}
        <section className="lg:col-span-5 xl:col-span-5 flex flex-col justify-between">
          <div className="char-studio-card w-full p-3 sm:p-3.5 flex flex-col justify-between h-full min-h-[560px] lg:min-h-[640px]">
            
            {/* THANH CHUYỂN TAB ĐỒNG NHẤT 1 FONT CHỮ */}
            <div className="p-1 bg-amber-50/80 dark:bg-slate-800/80 rounded-xl border border-amber-200/60 dark:border-slate-700 flex items-center gap-1 mb-2.5 font-sans">
              <button
                type="button"
                onClick={() => setActiveTab("custom")}
                className={`flex-1 h-8.5 px-3 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer font-sans ${
                  activeTab === "custom"
                    ? "bg-amber-700 text-white shadow-xs"
                    : "text-amber-950 dark:text-amber-200 hover:bg-amber-100/60"
                }`}
              >
                <span>Tùy chỉnh</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("presets")}
                className={`flex-1 h-8.5 px-3 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer font-sans ${
                  activeTab === "presets"
                    ? "bg-amber-700 text-white shadow-xs"
                    : "text-amber-950 dark:text-amber-200 hover:bg-amber-100/60"
                }`}
              >
                <span>Khuôn mẫu (6)</span>
              </button>
            </div>

            {/* TAB 1: TÙY CHỈNH THÔNG SỐ (Mô-đun tách biệt) */}
            {activeTab === "custom" && (
              <CustomTuningPanel config={config} updateField={updateField} />
            )}

            {/* TAB 2: KHUÔN MẪU CÓ SẴN (Mô-đun tách biệt) */}
            {activeTab === "presets" && (
              <PresetSelectorPanel
                presets={HERITAGE_PRESETS}
                config={config}
                onApplyPreset={handleApplyPreset}
              />
            )}

            {/* NÚT LƯU & TIẾP TỤC DƯỚI CÙNG: CÙNG FONT VÀ CỠ CHỮ text-sm font-bold VỚI TAB */}
            <div className="w-full pt-2.5 mt-1 border-t border-amber-200/50 dark:border-slate-700 flex items-center justify-end font-sans">
              <button
                type="button"
                onClick={handleComplete}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 h-9 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 shadow-sm active:scale-95 transition-all cursor-pointer font-sans"
              >
                <span>Lưu & Phối đồ</span>
                <span className="font-bold">→</span>
              </button>
            </div>

          </div>
        </section>

      </div>
    </main>
  );
}
