/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { domdom } from "../copy/coem";
import { nhom } from "../data/nhom";
import { QueNhaData } from "../types";
import AppFooter from "../components/AppFooter";
import { QueNhaPose } from "../narrator";
import { layKhoaTheoHoSo } from "../lib/hoSo";
import { phanTichBoiCanhVaGoiY, GoiYPhanTichBoiCanh } from "../lib/gemini";
import {
  OCCASION_VIGNETTES,
  REGION_VIGNETTES,
  STYLE_VIGNETTES,
} from "../components/BoiCanhIllustrations";
import {
  Check,
  Compass,
  ArrowRight,
  ChevronLeft,
  Calendar,
  MapPin,
  Palette,
  Shirt,
  X,
  Feather,
} from "lucide-react";

type Props = {
  onComplete: (data: QueNhaData) => void;
  onBackToGate?: () => void;
  onDirectToOutfit?: (trangPhucId: string) => void;
};

const noise = encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .95  0 0 0 0 .92  0 0 0 0 .85  0 0 0 .55 0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`
);

export default function QueNhaScreen({ onComplete, onBackToGate, onDirectToOutfit }: Props) {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Trạng thái cho phần gợi ý theo bối cảnh riêng
  const [customBoiCanh, setCustomBoiCanh] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<GoiYPhanTichBoiCanh | null>(null);

  // Khởi tạo từ localStorage theo hồ sơ hiện tại
  const [formData, setFormData] = useState<QueNhaData>(() => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const stored = window.localStorage.getItem(layKhoaTheoHoSo("que_nha"));
        if (stored) {
          const parsed = JSON.parse(stored);
          let camHungIds: string[] = [];
          if (Array.isArray(parsed.camHungIds)) {
            camHungIds = parsed.camHungIds;
          } else if (parsed.nhomQueId) {
            camHungIds = [parsed.nhomQueId];
          }

          let dip: string[] = [];
          if (Array.isArray(parsed.dip)) {
            dip = parsed.dip;
          } else if (typeof parsed.dip === "string" && parsed.dip) {
            dip = [parsed.dip];
          }

          let phongCach: string[] = [];
          if (Array.isArray(parsed.phongCach)) {
            phongCach = parsed.phongCach;
          } else if (typeof parsed.phongCach === "string" && parsed.phongCach) {
            phongCach = [parsed.phongCach];
          }

          return {
            dip,
            camHungIds,
            phongCach,
            nhomQueId: camHungIds[0] || null,
          };
        }
      }
    } catch {
      // Bỏ qua lỗi truy cập localStorage
    }
    return { dip: [], camHungIds: [], phongCach: [], nhomQueId: null };
  });

  const persistData = (updated: QueNhaData) => {
    setFormData(updated);
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem(layKhoaTheoHoSo("que_nha"), JSON.stringify(updated));
      }
    } catch {
      // Bỏ qua
    }
  };

  // 1) Xử lý Câu 1: Dịp chuẩn bị (Multi-select)
  const handleToggleDip = (val: string) => {
    const current = Array.isArray(formData.dip)
      ? formData.dip
      : formData.dip
      ? [formData.dip]
      : [];
    const next = current.includes(val)
      ? current.filter((x) => x !== val)
      : [...current, val];
    persistData({ ...formData, dip: next });
  };

  const handleNextStep1 = () => {
    setStep(2);
  };

  const handleSkipStep1 = () => {
    persistData({ ...formData, dip: [] });
    setStep(2);
  };

  // 2) Xử lý Câu 2: Cảm hứng hôm nay
  const handleToggleCamHung = (id: string) => {
    const current = formData.camHungIds || [];
    const next = current.includes(id)
      ? current.filter((x) => x !== id)
      : [...current, id];
    persistData({
      ...formData,
      camHungIds: next,
      nhomQueId: next[0] || null,
    });
  };

  const handleSelectKhamPhaDan = () => {
    persistData({
      ...formData,
      camHungIds: [],
      nhomQueId: null,
    });
  };

  const handleNextStep2 = () => {
    setStep(3);
  };

  const handleSkipStep2 = () => {
    persistData({ ...formData, camHungIds: [], nhomQueId: null });
    setStep(3);
  };

  // 3) Xử lý Câu 3: Phong cách mong muốn
  const handleTogglePhongCach = (val: string) => {
    const current = Array.isArray(formData.phongCach)
      ? formData.phongCach
      : formData.phongCach
      ? [formData.phongCach]
      : [];
    const next = current.includes(val)
      ? current.filter((x) => x !== val)
      : [...current, val];
    persistData({ ...formData, phongCach: next });
  };

  const handleFinish = (overridePhongCach?: string[]) => {
    const finalPhongCach =
      overridePhongCach !== undefined
        ? overridePhongCach
        : Array.isArray(formData.phongCach)
        ? formData.phongCach
        : formData.phongCach
        ? [formData.phongCach]
        : [];

    const finalData: QueNhaData = {
      dip: formData.dip,
      camHungIds: formData.camHungIds,
      phongCach: finalPhongCach,
      nhomQueId: formData.camHungIds[0] || null,
    };
    persistData(finalData);
    onComplete(finalData);
  };

  // Xử lý nhờ Cò Em gợi ý bối cảnh
  const handlePhanTichBoiCanh = async () => {
    if (!customBoiCanh.trim()) return;
    setIsAnalyzing(true);
    try {
      const result = await phanTichBoiCanhVaGoiY(customBoiCanh);
      setAiResult(result);
    } catch (err) {
      console.error("Lỗi phân tích bối cảnh:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Áp dụng gợi ý vào cấu hình và chuyển tiếp
  const handleApplyAiSuggestion = () => {
    if (!aiResult) return;
    const nextDips = Array.from(new Set([...(formData.dip || []), ...(aiResult.dipTuongUng || [])]));
    const nextCamHung = aiResult.vungTuongUng
      ? Array.from(new Set([...(formData.camHungIds || []), aiResult.vungTuongUng]))
      : formData.camHungIds;
    const nextPhongCach = aiResult.phongCachKhuyenNghi ? [aiResult.phongCachKhuyenNghi] : formData.phongCach;

    const updated: QueNhaData = {
      ...formData,
      dip: nextDips,
      camHungIds: nextCamHung,
      phongCach: nextPhongCach,
      nhomQueId: nextCamHung[0] || null,
    };
    persistData(updated);
    setStep(2);
  };

  // Áp dụng gợi ý và chuyển thẳng đến phòng thử đồ S4
  const handleGoDirectToOutfit = () => {
    if (!aiResult) return;
    const nextDips = Array.from(new Set([...(formData.dip || []), ...(aiResult.dipTuongUng || [])]));
    const nextCamHung = aiResult.vungTuongUng ? [aiResult.vungTuongUng] : formData.camHungIds;
    const nextPhongCach = aiResult.phongCachKhuyenNghi ? [aiResult.phongCachKhuyenNghi] : formData.phongCach;

    const updated: QueNhaData = {
      dip: nextDips,
      camHungIds: nextCamHung,
      phongCach: nextPhongCach,
      nhomQueId: nextCamHung[0] || null,
    };
    persistData(updated);

    if (onDirectToOutfit) {
      onDirectToOutfit(aiResult.trangPhucId);
    } else {
      onComplete(updated);
    }
  };

  const currentDips = Array.isArray(formData.dip)
    ? formData.dip
    : formData.dip
    ? [formData.dip]
    : [];

  const currentPhongCachs = Array.isArray(formData.phongCach)
    ? formData.phongCach
    : formData.phongCach
    ? [formData.phongCach]
    : [];

  const isKhamPhaDanActive = (formData.camHungIds || []).length === 0;

  return (
    <main className="que-nha">
      <style>{css}</style>
      <div className="que-nha__noise" aria-hidden="true" />

      {/* Cò Em dẫn chuyện */}
      <div className="que-nha__fly" aria-hidden="true">
        <QueNhaPose size={88} animate={true} />
      </div>

      {/* Thanh tiến trình 3 bước văn hóa */}
      <header className="que-nha__brand">
        <div className="que-nha__brand-text">
          <span className="text-xl" role="img" aria-hidden="true">🎋</span>
          <div>
            <span className="que-nha__name">Cảm Hứng Quê Nhà</span>
            <span className="hidden sm:inline-block text-xs text-stone-500 dark:text-stone-400 ml-2 font-normal">
              • Chọn bối cảnh & phong vị trang phục
            </span>
          </div>
        </div>

        <nav className="que-nha__steps-indicator" aria-label="Tiến trình chọn bối cảnh">
          <button
            type="button"
            onClick={() => setStep(1)}
            className={`que-nha__step-pill ${step === 1 ? "que-nha__step-pill--active" : ""}`}
          >
            <Calendar size={13} className="inline-block" />
            <span>1. Dịp & Bối cảnh</span>
          </button>
          <button
            type="button"
            onClick={() => setStep(2)}
            className={`que-nha__step-pill ${step === 2 ? "que-nha__step-pill--active" : ""}`}
          >
            <MapPin size={13} className="inline-block" />
            <span>2. Vùng miền</span>
          </button>
          <button
            type="button"
            onClick={() => setStep(3)}
            className={`que-nha__step-pill ${step === 3 ? "que-nha__step-pill--active" : ""}`}
          >
            <Palette size={13} className="inline-block" />
            <span>3. Phong cách</span>
          </button>
        </nav>
      </header>

      {/* Nội dung từng câu hỏi */}
      <div className="que-nha__container">
        {/* CÂU 1: DỊP / BỐI CẢNH (Tranh minh họa văn hóa mỹ thuật, không dùng emoji công nghệ) */}
        {step === 1 && (
          <section className="que-nha__card" aria-labelledby="cau-1-heading">
            <header className="que-nha__card-header">
              <p className="que-nha__domdom-line">
                <Feather size={15} className="text-amber-600 dark:text-amber-400 flex-shrink-0" />
                <span>{domdom.queNha.moDau}</span>
              </p>
              <div className="que-nha__question-row">
                <h1 id="cau-1-heading" className="que-nha__question">
                  {domdom.queNha.cau1.cauHoi}
                </h1>
                {currentDips.length > 0 && (
                  <span className="que-nha__selected-badge">
                    <Check size={14} className="text-amber-700 dark:text-amber-300 stroke-[3]" />
                    Đã chọn {currentDips.length} dịp
                  </span>
                )}
              </div>
              <p className="que-nha__sub-hint">
                {domdom.queNha.cau1.ghiChu}
              </p>
            </header>

            {/* A. CÁC Ô CHỌN DỊP: SỬ DỤNG TRANH MINH HỌA VĂN HÓA TRUYỀN THỐNG */}
            <div className="que-nha__options que-nha__options--grid">
              {(Object.keys(domdom.queNha.cau1.danhSach) as Array<keyof typeof domdom.queNha.cau1.danhSach>).map(
                (key) => {
                  const isSelected = currentDips.includes(key);
                  const VignetteComponent = OCCASION_VIGNETTES[key];
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleToggleDip(key)}
                      className={`que-nha__option-btn ${
                        isSelected ? "que-nha__option-btn--active" : ""
                      }`}
                      aria-pressed={isSelected}
                    >
                      {/* Tranh minh họa màu nước / khắc gỗ truyền thống */}
                      <div className="que-nha__vignette-frame">
                        {VignetteComponent && <VignetteComponent className="w-11 h-11" />}
                      </div>

                      {/* Tên dịp trang trọng, thanh lịch */}
                      <span className="que-nha__option-title flex-1">
                        {domdom.queNha.cau1.danhSach[key]}
                      </span>

                      {/* Dấu tích tròn */}
                      <div className={`que-nha__marker-badge ${isSelected ? "que-nha__marker-badge--active" : ""}`}>
                        {isSelected ? (
                          <Check size={14} strokeWidth={3} className="text-white" />
                        ) : (
                          <div className="que-nha__marker-circle" />
                        )}
                      </div>
                    </button>
                  );
                }
              )}
            </div>

            {/* B. PHẦN TƯ VẤN BỐI CẢNH RIÊNG TỰ DO CÙNG CÒ EM */}
            <div className="que-nha__ai-section">
              <div className="flex items-center gap-2 mb-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-600 text-white shrink-0">
                  <Feather size={13} />
                </span>
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 m-0">
                    Gợi ý theo bối cảnh của bạn
                  </h2>
                  <p className="text-[11px] text-stone-600 dark:text-stone-400 m-0">
                    Nhập điểm đến hoặc sự kiện để Cò Em tìm dáng áo phù hợp.
                  </p>
                </div>
              </div>

              {/* Khung nhập liệu bối cảnh: Tách biệt hoàn toàn, không đè nút lên chữ */}
              <div className="mt-2">
                <textarea
                  value={customBoiCanh}
                  onChange={(e) => setCustomBoiCanh(e.target.value)}
                  placeholder="Ví dụ: Đi tiệc cưới ở Huế, chụp kỷ yếu Văn Miếu, trẩy hội đầu xuân..."
                  className="w-full p-2.5 rounded-xl border border-amber-300/80 dark:border-amber-700/60 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 text-xs focus:outline-none focus:border-amber-600 resize-none min-h-[52px] transition-all"
                  rows={2}
                  disabled={isAnalyzing}
                />
              </div>

              {/* Dải điều khiển bên dưới: Gợi ý nhanh bên trái, nút hành động bên phải */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">Gợi ý nhanh:</span>
                  {[
                    { label: "Tiệc cưới", text: "Đi dự tiệc cưới bạn thân ở Huế, thanh lịch và trang nhã" },
                    { label: "Kỷ yếu", text: "Chụp ảnh kỷ yếu ở Văn Miếu Quốc Tử Giám, tinh khôi và trang nghiêm" },
                    { label: "Lễ hội", text: "Đi lễ chùa và trẩy hội đầu năm cùng gia đình, trang nghiêm đằm thắm" },
                    { label: "Dạo phố", text: "Dạo chơi sông nước miền Tây, nhẹ nhàng, thoải mái" },
                  ].map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCustomBoiCanh(item.text)}
                      className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-white dark:bg-slate-800 hover:bg-amber-100/80 dark:hover:bg-amber-950/60 text-slate-700 dark:text-slate-300 border border-stone-200 dark:border-slate-700 transition-colors cursor-pointer"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handlePhanTichBoiCanh}
                  disabled={isAnalyzing || !customBoiCanh.trim()}
                  className="self-end sm:self-auto px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-800 hover:to-amber-700 disabled:opacity-40 text-white font-semibold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Đang ngẫm...</span>
                    </>
                  ) : (
                    <>
                      <Feather size={12} />
                      <span>Nhờ Cò Em chọn</span>
                    </>
                  )}
                </button>
              </div>

              {/* KẾT QUẢ GỢI Ý TỪ CÒ EM */}
              {aiResult && (
                <div className="que-nha__ai-result">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🎋</span>
                      <div>
                        <h3 className="text-base font-bold text-amber-900 dark:text-amber-200 m-0">
                          Lời khuyên trang phục từ Cò Em
                        </h3>
                        <p className="text-xs text-amber-800/80 dark:text-amber-300/80 m-0">
                          {aiResult.tongQuan}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAiResult(null)}
                      className="p-1 rounded-full text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 cursor-pointer"
                      title="Đóng kết quả"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {/* Chi tiết trang phục & phối màu */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3.5">
                    {/* Hộp 1: Dáng áo gợi ý */}
                    <div className="p-3.5 rounded-xl bg-white/95 dark:bg-slate-900/95 border border-amber-300/40">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-800 dark:text-amber-300 mb-1">
                        <Shirt size={14} />
                        <span>Dáng áo khuyên mặc</span>
                      </div>
                      <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {aiResult.tenTrangPhuc}
                      </div>
                      <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 m-0 leading-relaxed">
                        {aiResult.lyDo}
                      </p>
                    </div>

                    {/* Hộp 2: Sắc màu & Phụ kiện */}
                    <div className="p-3.5 rounded-xl bg-white/95 dark:bg-slate-900/95 border border-amber-300/40">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-800 dark:text-amber-300 mb-1">
                        <Palette size={14} />
                        <span>Phối sắc & Phụ kiện</span>
                      </div>
                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        Màu chính: <span className="text-amber-700 dark:text-amber-300 font-bold">{aiResult.phoiMau.mauChinh}</span> • Phối: {aiResult.phoiMau.mauPhoi}
                      </div>
                      <div className="text-xs text-stone-500 dark:text-stone-400 italic mt-0.5">
                        {aiResult.phoiMau.yNghia}
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap mt-2">
                        {aiResult.phuKien.map((pk, idx) => (
                          <span key={idx} className="text-[11px] px-2 py-0.5 rounded-md bg-stone-100 dark:bg-slate-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-slate-700">
                            + {pk}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Lời dặn văn hóa từ Cò Em */}
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-2 mb-3">
                    <span className="text-sm mt-0.5">💡</span>
                    <p className="text-xs text-amber-900 dark:text-amber-200 m-0 leading-relaxed font-medium">
                      <strong>Cò Em nhắn nhủ:</strong> {aiResult.luuYVanHoa}
                    </p>
                  </div>

                  {/* Các nút hành động nhanh */}
                  <div className="flex items-center justify-end gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={handleApplyAiSuggestion}
                      className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-amber-300/50 hover:bg-amber-50 dark:hover:bg-slate-700 transition-all cursor-pointer"
                    >
                      Áp dụng bối cảnh này & Đi tiếp
                    </button>
                    <button
                      type="button"
                      onClick={handleGoDirectToOutfit}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-800 hover:to-amber-700 text-white shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Shirt size={14} />
                      <span>Mặc bộ này ngay (Đến phòng thử đồ)</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <footer className="que-nha__actions">
              {onBackToGate && (
                <button
                  type="button"
                  onClick={onBackToGate}
                  className="que-nha__btn que-nha__btn--sub"
                >
                  <ChevronLeft size={16} />
                  <span>{domdom.common.back}</span>
                </button>
              )}
              <button
                type="button"
                onClick={handleSkipStep1}
                className="que-nha__btn que-nha__btn--sub"
              >
                {domdom.queNha.nutBoQua}
              </button>
              <button
                type="button"
                onClick={handleNextStep1}
                className="que-nha__btn que-nha__btn--pri"
              >
                <span>{domdom.queNha.nutTiep}</span>
                {currentDips.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-white/25 text-xs font-bold">
                    {currentDips.length}
                  </span>
                )}
                <ArrowRight size={16} />
              </button>
            </footer>
          </section>
        )}

        {/* CÂU 2: CẢM HỨNG VÙNG MIỀN (Sử dụng biểu tượng di sản nghệ thuật) */}
        {step === 2 && (
          <section className="que-nha__card" aria-labelledby="cau-2-heading">
            <header className="que-nha__card-header">
              <p className="que-nha__domdom-line">
                <Feather size={15} className="text-amber-600 dark:text-amber-400 flex-shrink-0" />
                <span>{domdom.queNha.tieuDe}</span>
              </p>
              <div className="que-nha__question-row">
                <h1 id="cau-2-heading" className="que-nha__question">
                  {domdom.queNha.cau2.cauHoi}
                </h1>
                {formData.camHungIds.length > 0 && (
                  <span className="que-nha__selected-badge">
                    <Check size={14} className="text-amber-700 dark:text-amber-300 stroke-[3]" />
                    Đã chọn {formData.camHungIds.length} vùng
                  </span>
                )}
              </div>

              {/* Dòng phụ nhỏ */}
              <div className="que-nha__subline" role="note">
                <span className="text-base flex-shrink-0 mt-0.5">✨</span>
                <span>{domdom.queNha.cau2.phuDe}</span>
              </div>
            </header>

            <div className="que-nha__options que-nha__options--grid">
              {/* Lựa chọn không chọn gì: Cứ để Cò Em khám phá dần */}
              <button
                type="button"
                onClick={handleSelectKhamPhaDan}
                className={`que-nha__option-btn que-nha__option-btn--special ${
                  isKhamPhaDanActive ? "que-nha__option-btn--active" : ""
                }`}
                aria-pressed={isKhamPhaDanActive}
              >
                <div className="que-nha__vignette-frame">
                  <Compass className="w-7 h-7 text-amber-600 dark:text-amber-400" />
                </div>
                <span className="que-nha__option-title flex-1">
                  {domdom.queNha.cau2.khamPhaDan}
                </span>
                <div className={`que-nha__marker-badge ${isKhamPhaDanActive ? "que-nha__marker-badge--active" : ""}`}>
                  {isKhamPhaDanActive ? (
                    <Check size={14} strokeWidth={3} className="text-white" />
                  ) : (
                    <div className="que-nha__marker-circle" />
                  )}
                </div>
              </button>

              {/* Danh sách các nhóm lấy cảm hứng */}
              {nhom.map((item) => {
                const isSelected = formData.camHungIds.includes(item.id);
                const RegionVignette = REGION_VIGNETTES[item.id];
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleToggleCamHung(item.id)}
                    className={`que-nha__option-btn ${
                      isSelected ? "que-nha__option-btn--active" : ""
                    }`}
                    aria-pressed={isSelected}
                  >
                    <div className="que-nha__vignette-frame">
                      {RegionVignette ? (
                        <RegionVignette className="w-11 h-11" />
                      ) : (
                        <span className="text-xl">🎋</span>
                      )}
                    </div>
                    <span className="que-nha__option-title flex-1">
                      {item.ten}
                    </span>
                    <div className={`que-nha__marker-badge ${isSelected ? "que-nha__marker-badge--active" : ""}`}>
                      {isSelected ? (
                        <Check size={14} strokeWidth={3} className="text-white" />
                      ) : (
                        <div className="que-nha__marker-circle" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <footer className="que-nha__actions">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="que-nha__btn que-nha__btn--sub"
              >
                <ChevronLeft size={16} />
                <span>{domdom.queNha.nutQuayLai}</span>
              </button>
              <button
                type="button"
                onClick={handleSkipStep2}
                className="que-nha__btn que-nha__btn--sub"
              >
                {domdom.queNha.nutBoQua}
              </button>
              <button
                type="button"
                onClick={handleNextStep2}
                className="que-nha__btn que-nha__btn--pri"
              >
                <span>{domdom.queNha.nutTiep}</span>
                {formData.camHungIds.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-white/25 text-xs font-bold">
                    {formData.camHungIds.length}
                  </span>
                )}
                <ArrowRight size={16} />
              </button>
            </footer>
          </section>
        )}

        {/* CÂU 3: PHONG CÁCH (Sử dụng tranh minh họa phong vị cổ truyền) */}
        {step === 3 && (
          <section className="que-nha__card" aria-labelledby="cau-3-heading">
            <header className="que-nha__card-header">
              <p className="que-nha__domdom-line">
                <Feather size={15} className="text-amber-600 dark:text-amber-400 flex-shrink-0" />
                <span>{domdom.queNha.tieuDe}</span>
              </p>
              <div className="que-nha__question-row">
                <h1 id="cau-3-heading" className="que-nha__question">
                  {domdom.queNha.cau3.cauHoi}
                </h1>
                {currentPhongCachs.length > 0 && (
                  <span className="que-nha__selected-badge">
                    <Check size={14} className="text-amber-700 dark:text-amber-300 stroke-[3]" />
                    Đã chọn {currentPhongCachs.length} phong cách
                  </span>
                )}
              </div>
              <p className="que-nha__sub-hint">
                {domdom.queNha.cau3.ghiChu}
              </p>
            </header>

            <div className="que-nha__options que-nha__options--stack">
              {(Object.keys(domdom.queNha.cau3.danhSach) as Array<keyof typeof domdom.queNha.cau3.danhSach>).map(
                (key) => {
                  const isSelected = currentPhongCachs.includes(key);
                  const StyleVignette = STYLE_VIGNETTES[key];
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleTogglePhongCach(key)}
                      className={`que-nha__option-btn que-nha__option-btn--lg ${
                        isSelected ? "que-nha__option-btn--active" : ""
                      }`}
                      aria-pressed={isSelected}
                    >
                      <div className="que-nha__vignette-frame">
                        {StyleVignette ? (
                          <StyleVignette className="w-12 h-12" />
                        ) : (
                          <span className="text-xl">🌸</span>
                        )}
                      </div>
                      <span className="que-nha__option-title flex-1">
                        {domdom.queNha.cau3.danhSach[key]}
                      </span>
                      <div className={`que-nha__marker-badge ${isSelected ? "que-nha__marker-badge--active" : ""}`}>
                        {isSelected ? (
                          <Check size={14} strokeWidth={3} className="text-white" />
                        ) : (
                          <div className="que-nha__marker-circle" />
                        )}
                      </div>
                    </button>
                  );
                }
              )}
            </div>

            <footer className="que-nha__actions">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="que-nha__btn que-nha__btn--sub"
              >
                <ChevronLeft size={16} />
                <span>{domdom.queNha.nutQuayLai}</span>
              </button>
              <button
                type="button"
                onClick={() => handleFinish([])}
                className="que-nha__btn que-nha__btn--sub"
              >
                {domdom.queNha.nutBoQua}
              </button>
              <button
                type="button"
                onClick={() => handleFinish()}
                className="que-nha__btn que-nha__btn--pri"
              >
                <span>{domdom.queNha.nutTiep}</span>
                {currentPhongCachs.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-white/25 text-xs font-bold">
                    {currentPhongCachs.length}
                  </span>
                )}
                <ArrowRight size={16} />
              </button>
            </footer>
          </section>
        )}
      </div>

      <AppFooter />
    </main>
  );
}

const css = `
.que-nha {
  position: relative;
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  background: transparent;
  color: var(--nen-toi);
  padding-top: 16px;
  padding-bottom: calc(var(--dock-h, 64px) + 24px);
  box-sizing: border-box;
}

.que-nha__noise {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,${noise}");
  opacity: 0.08;
  pointer-events: none;
  z-index: 0;
}

.que-nha__fly {
  position: absolute;
  right: max(3%, calc(50% - 32rem));
  top: 96px;
  pointer-events: none;
  z-index: 3;
  opacity: 0.95;
  filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.12));
}

@media (max-width: 1080px) {
  .que-nha__fly {
    right: 18px;
    top: 76px;
    transform: scale(0.85);
  }
}

@media (max-width: 720px) {
  .que-nha__fly {
    display: none;
  }
}

.que-nha__brand {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 62rem;
  width: calc(100% - 32px);
  margin: 0 auto 16px;
  padding: 12px 24px;
  z-index: 2;
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1.5px solid rgba(202, 138, 4, 0.35);
  border-radius: 9999px;
  box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(21, 128, 61, 0.12);
}

html[data-theme="dark"] .que-nha__brand,
html.dark .que-nha__brand {
  background: rgba(11, 25, 46, 0.92);
  border-color: rgba(250, 204, 21, 0.4);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.6);
}

.que-nha__brand-text {
  display: flex;
  align-items: center;
  gap: 10px;
}

.que-nha__name {
  font-family: var(--font-tieu-de);
  font-size: 1.15rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: var(--nen-toi);
}

.que-nha__steps-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.que-nha__step-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 9999px;
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--tro-tram);
  background: rgba(15, 23, 42, 0.05);
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 200ms ease;
}

.que-nha__step-pill--active {
  background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%);
  color: #78350F;
  border-color: #D97706;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(217, 119, 6, 0.2);
}

html[data-theme="dark"] .que-nha__step-pill {
  color: #94A3B8;
  background: rgba(255, 255, 255, 0.08);
}

html[data-theme="dark"] .que-nha__step-pill--active {
  background: linear-gradient(135deg, rgba(202, 138, 4, 0.35) 0%, rgba(217, 119, 6, 0.25) 100%);
  color: #FEF08A;
  border-color: #FDE047;
}

.que-nha__container {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px 24px;
  z-index: 2;
  width: 100%;
  box-sizing: border-box;
}

.que-nha__card {
  width: 100%;
  max-width: 62rem;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 32px 36px 28px;
  background: rgba(255, 255, 255, 0.98);
  border: 2px solid rgba(202, 138, 4, 0.38);
  border-radius: 28px;
  box-shadow: 0 24px 60px -12px rgba(15, 23, 42, 0.16), 0 0 0 1px rgba(21, 128, 61, 0.15);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  animation: hienLen 400ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

@media (max-width: 768px) {
  .que-nha__card {
    padding: 22px 18px 20px;
    gap: 16px;
    border-radius: 22px;
  }
}

.que-nha__card-header {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.que-nha__domdom-line {
  margin: 0;
  font-family: var(--font-tieu-de);
  font-style: italic;
  font-size: 1.05rem;
  color: #B45309;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
}

html[data-theme="dark"] .que-nha__domdom-line {
  color: #FDE047;
}

.que-nha__question-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  flex-wrap: wrap;
}

.que-nha__question {
  margin: 0;
  font-family: var(--font-tieu-de);
  font-size: clamp(1.35rem, 2.5vw, 1.85rem);
  font-weight: 700;
  line-height: 1.35;
  color: var(--nen-toi);
  border-left: 4px solid var(--dat-nung);
  padding-left: 14px;
}

.que-nha__selected-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 9999px;
  background: rgba(202, 138, 4, 0.12);
  border: 1px solid rgba(202, 138, 4, 0.35);
  color: #B45309;
  font-size: 0.85rem;
  font-weight: 600;
  white-space: nowrap;
}

html[data-theme="dark"] .que-nha__selected-badge {
  background: rgba(253, 224, 71, 0.15);
  border-color: rgba(253, 224, 71, 0.4);
  color: #FEF08A;
}

.que-nha__sub-hint {
  margin: 0;
  font-size: 0.92rem;
  color: var(--tro-tram);
  line-height: 1.5;
}

.que-nha__subline {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.5;
  color: #92400E;
  background: rgba(254, 243, 199, 0.7);
  border-left: 3px solid #D97706;
  padding: 10px 14px;
  border-radius: 12px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

html[data-theme="dark"] .que-nha__subline {
  color: #FEF08A;
  background: rgba(202, 138, 4, 0.18);
  border-left-color: #FDE047;
}

.que-nha__options {
  display: grid;
  gap: 14px;
  margin: 4px 0 6px;
}

.que-nha__options--grid {
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
}

@media (max-width: 640px) {
  .que-nha__options--grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }
}

.que-nha__options--stack {
  grid-template-columns: 1fr;
  gap: 12px;
}

.que-nha__option-btn {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 18px;
  min-height: 72px;
  background: #FFFFFF;
  color: var(--nen-toi);
  border: 1.5px solid rgba(203, 213, 225, 0.9);
  border-radius: 18px;
  font-family: var(--font-than);
  text-align: left;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
  transition: all 200ms cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
}

.que-nha__option-btn--lg {
  padding: 16px 20px;
  min-height: 78px;
}

.que-nha__option-btn--special {
  grid-column: 1 / -1;
  background: #F8FAFC;
  border-color: rgba(202, 138, 4, 0.45);
}

.que-nha__option-btn:hover {
  background: #FFFDF5;
  border-color: #CA8A04;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(202, 138, 4, 0.16);
}

.que-nha__option-btn--active {
  background: linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%) !important;
  border: 2px solid #D97706 !important;
  color: #78350F !important;
  box-shadow: 0 8px 24px rgba(217, 119, 6, 0.22), inset 0 0 0 1px #F59E0B !important;
  transform: translateY(-2px);
}

html[data-theme="dark"] .que-nha__option-btn {
  background: #102542;
  border: 1.5px solid rgba(56, 189, 248, 0.25);
  color: #F8FAFC;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
}

html[data-theme="dark"] .que-nha__option-btn:hover {
  background: #173259;
  border-color: #FDE047;
  box-shadow: 0 8px 22px rgba(250, 204, 21, 0.22);
}

html[data-theme="dark"] .que-nha__option-btn--active {
  background: linear-gradient(135deg, rgba(202, 138, 4, 0.35) 0%, rgba(217, 119, 6, 0.22) 100%) !important;
  border: 2px solid #FDE047 !important;
  color: #FEF08A !important;
  box-shadow: 0 8px 28px rgba(250, 204, 21, 0.25) !important;
}

/* KHUNG TRANH MINH HỌA DI SẢN TINH TẾ */
.que-nha__vignette-frame {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(202, 138, 4, 0.16);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  transition: transform 200ms ease;
}

.que-nha__option-btn:hover .que-nha__vignette-frame {
  transform: scale(1.06);
}

.que-nha__option-btn--active .que-nha__vignette-frame {
  background: rgba(255, 255, 255, 0.95);
  border-color: rgba(217, 119, 6, 0.4);
  box-shadow: 0 4px 12px rgba(217, 119, 6, 0.2);
}

.que-nha__option-title {
  font-size: 1.05rem;
  font-weight: 700;
  line-height: 1.3;
  color: inherit;
}

.que-nha__marker-badge {
  width: 26px;
  height: 26px;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 200ms ease;
}

.que-nha__marker-circle {
  width: 20px;
  height: 20px;
  border-radius: 9999px;
  border: 2px solid #CBD5E1;
  background: transparent;
  transition: all 200ms ease;
}

html[data-theme="dark"] .que-nha__marker-circle {
  border-color: #475569;
}

.que-nha__option-btn:hover .que-nha__marker-circle {
  border-color: #CA8A04;
}

.que-nha__marker-badge--active {
  background: #D97706;
  box-shadow: 0 2px 8px rgba(217, 119, 6, 0.35);
}

html[data-theme="dark"] .que-nha__marker-badge--active {
  background: #F59E0B;
}

/* KHỐI TƯ VẤN BỐI CẢNH RIÊNG TỰ DO */
.que-nha__ai-section {
  margin-top: 14px;
  padding: 18px 20px;
  border-radius: 20px;
  background: linear-gradient(135deg, rgba(254, 243, 199, 0.45) 0%, rgba(254, 249, 195, 0.75) 100%);
  border: 1.5px solid rgba(245, 158, 11, 0.35);
  box-shadow: 0 4px 16px rgba(245, 158, 11, 0.08);
}

html[data-theme="dark"] .que-nha__ai-section {
  background: linear-gradient(135deg, rgba(16, 37, 66, 0.8) 0%, rgba(20, 48, 86, 0.9) 100%);
  border-color: rgba(250, 204, 21, 0.3);
}

.que-nha__ai-result {
  margin-top: 14px;
  padding: 16px 18px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.96);
  border: 1.5px solid rgba(217, 119, 6, 0.35);
  box-shadow: 0 8px 24px rgba(217, 119, 6, 0.12);
  animation: hienLen 300ms ease-out both;
}

html[data-theme="dark"] .que-nha__ai-result {
  background: rgba(11, 25, 46, 0.95);
  border-color: rgba(250, 204, 21, 0.4);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
}

.que-nha__actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 14px;
  margin-top: 6px;
  flex-wrap: wrap;
  padding-top: 14px;
  border-top: 1px solid rgba(203, 213, 225, 0.5);
}

html[data-theme="dark"] .que-nha__actions {
  border-top-color: rgba(56, 189, 248, 0.15);
}

.que-nha__btn {
  padding: 12px 22px;
  min-height: 48px;
  font-family: var(--font-than);
  font-size: 0.95rem;
  cursor: pointer;
  transition: all var(--nhip-vua) ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 600;
}

.que-nha__btn--pri {
  background: linear-gradient(135deg, #D97706 0%, #B45309 100%) !important;
  color: #FFFFFF !important;
  border: 1px solid #B45309;
  border-radius: 14px;
  box-shadow: 0 4px 16px rgba(217, 119, 6, 0.35);
}

.que-nha__btn--pri:hover {
  background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%) !important;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(217, 119, 6, 0.45);
}

.que-nha__btn--sub {
  background: #FFFFFF !important;
  color: var(--nen-toi) !important;
  border: 1.5px solid rgba(203, 213, 225, 0.9);
  border-radius: 14px;
}

html[data-theme="dark"] .que-nha__btn--sub {
  background: #102542 !important;
  color: #F8FAFC !important;
  border-color: rgba(56, 189, 248, 0.25);
}

.que-nha__btn--sub:hover {
  border-color: #CA8A04;
  background: #FFFDF5 !important;
  transform: translateY(-1px);
}

html[data-theme="dark"] .que-nha__btn--sub:hover {
  background: #173259 !important;
  border-color: #FDE047;
}

@keyframes hienLen {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
`;
