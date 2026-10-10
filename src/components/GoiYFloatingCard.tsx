/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo, useRef } from "react";
import { TrangPhuc } from "../types";
import { domdom } from "../copy/coem";
import {
  ThoiTietId,
  TEN_THOI_TIET,
  GoiYCondition,
  locTrangPhucGoiY,
  layCauGiaiThichGoc,
} from "../lib/rules";
import { keGoiYThoiTiet, dinhDangThoiTietChuoi } from "../lib/loiKe";
import { docViTriSession } from "../lib/thoitiet";
import { Sun, Wind, Snowflake, CloudRain, Sparkles, X, type LucideIcon } from "lucide-react";

interface Props {
  onSelectTrangPhuc: (trangPhucId: string) => void;
  onApplyToMainList?: (filteredIds: string[] | null) => void;
  initialCondition?: GoiYCondition;
}

const THOI_TIET_OPTIONS: { id: ThoiTietId; ten: string; icon: LucideIcon }[] = [
  { id: "nong", ten: "Nắng nóng", icon: Sun },
  { id: "mat", ten: "Dịu mát", icon: Wind },
  { id: "lanh", ten: "Se lạnh", icon: Snowflake },
  { id: "mua", ten: "Trời mưa", icon: CloudRain },
];

const DIP_OPTIONS: { id: string; ten: string }[] = [
  { id: "khai_giang", ten: "Khai giảng" },
  { id: "tet", ten: "Tết" },
  { id: "cuoi", ten: "Cưới hỏi" },
  { id: "le_hoi", ten: "Lễ hội" },
  { id: "doi_thuong", ten: "Đời thường" },
  { id: "hoi_lang", ten: "Hội làng" },
  { id: "cho_phien", ten: "Chợ phiên" },
];

export default function GoiYFloatingCard({
  onSelectTrangPhuc,
  onApplyToMainList,
  initialCondition,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedThoiTiet, setSelectedThoiTiet] = useState<ThoiTietId | null>(
    (initialCondition?.thoiTiet as ThoiTietId) || null
  );
  const [selectedDip, setSelectedDip] = useState<string | null>(
    initialCondition?.dip || null
  );

  // Lắng nghe sự kiện mở từ Khay Nổi (FloatingDock)
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("vpr:open-goi-y", handleOpen);
    return () => window.removeEventListener("vpr:open-goi-y", handleOpen);
  }, []);

  // Điều kiện hiện tại
  const condition: GoiYCondition = useMemo(
    () => ({
      thoiTiet: selectedThoiTiet,
      dip: selectedDip,
    }),
    [selectedThoiTiet, selectedDip]
  );

  // Danh sách trang phục lọc theo luật
  const filteredCostumes: TrangPhuc[] = useMemo(() => {
    return locTrangPhucGoiY(condition);
  }, [condition]);

  // Biến thể câu kể
  const [variationIndex, setVariationIndex] = useState(0);

  // Câu giải thích từ loiKe.ts, KHÔNG dùng Gemini, hiển thị NGAY LẬP TỨC
  const cauHienThi = useMemo(() => {
    if (selectedThoiTiet) {
      const sessionViTri = docViTriSession();
      const tenDip = selectedDip ? domdom.s2.tenDip[selectedDip] ?? selectedDip : "";
      const noiText = sessionViTri ? sessionViTri.ten : (tenDip ? `Dịp ${tenDip}` : "Hôm nay");
      return keGoiYThoiTiet({
        noi: noiText,
        thoiTiet: selectedThoiTiet,
        soBo: filteredCostumes.length,
      });
    }
    return layCauGiaiThichGoc(condition, filteredCostumes);
  }, [condition, filteredCostumes, selectedThoiTiet, selectedDip]);

  // Áp dụng mẫu kiểm thử yêu cầu: {"thoiTiet":"mua","dip":"khai_giang"}
  const handleApplySample = () => {
    setSelectedThoiTiet("mua");
    setSelectedDip("khai_giang");
    if (!isOpen) setIsOpen(true);
  };

  // Đặt lại bộ lọc
  const handleReset = () => {
    setSelectedThoiTiet(null);
    setSelectedDip(null);
    if (onApplyToMainList) {
      onApplyToMainList(null);
    }
  };

  const hasFilter = Boolean(selectedThoiTiet || selectedDip);

  return (
    <>
      {/* Thẻ nổi Gợi ý ở S2 (mở qua Khay Nổi / FloatingDock) */}
      {isOpen && (
        <div
          className="costume-floating-card"
          role="region"
          aria-label="Thẻ nổi gợi ý trang phục theo thời tiết và dịp"
        >
          {/* Thanh tiêu đề thẻ */}
          <div className="costume-floating-card__header">
            <div className="costume-floating-card__header-title">
              <span className="w-6 h-6 rounded-md bg-amber-500/15 text-amber-500 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                <Sparkles className="w-3.5 h-3.5" />
              </span>
              <div>
                <h3 className="costume-floating-card__title">Gợi ý từ Cò Em</h3>
                <p className="costume-floating-card__sub">
                  Chọn thời tiết hoặc dịp để lọc trang phục và nghe lời kể
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="costume-floating-card__close-btn flex items-center justify-center"
              aria-label="Thu gọn thẻ gợi ý"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="costume-floating-card__body">
            {/* Lựa chọn Thời tiết */}
            <div className="costume-floating-card__section">
              <label className="costume-floating-card__label">
                Thời tiết ({THOI_TIET_OPTIONS.length} lựa chọn)
              </label>
              <div className="costume-floating-card__pills">
                {THOI_TIET_OPTIONS.map((tt) => {
                  const isSelected = selectedThoiTiet === tt.id;
                  const IconComp = tt.icon;
                  return (
                    <button
                      key={tt.id}
                      type="button"
                      onClick={() =>
                        setSelectedThoiTiet(isSelected ? null : tt.id)
                      }
                      className={`costume-floating-card__pill inline-flex items-center gap-1.5 ${
                        isSelected ? "costume-floating-card__pill--active" : ""
                      }`}
                    >
                      <IconComp className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" aria-hidden="true" />
                      <span>{tt.ten}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Lựa chọn Dịp */}
            <div className="costume-floating-card__section">
              <label className="costume-floating-card__label">
                Dịp phục sức ({DIP_OPTIONS.length} dịp)
              </label>
              <div className="costume-floating-card__pills">
                {DIP_OPTIONS.map((d) => {
                  const isSelected = selectedDip === d.id;
                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setSelectedDip(isSelected ? null : d.id)}
                      className={`costume-floating-card__pill ${
                        isSelected ? "costume-floating-card__pill--active" : ""
                      }`}
                    >
                      <span>{d.ten}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Hàng nút thao tác nhanh: Mẫu thử & Đặt lại */}
            <div className="costume-floating-card__quick-row">
              <button
                type="button"
                onClick={handleApplySample}
                className="costume-floating-card__quick-btn inline-flex items-center gap-1.5"
                title='Dữ liệu mẫu: {"thoiTiet":"mua","dip":"khai_giang"}'
              >
                <CloudRain className="w-3.5 h-3.5 text-sky-500" />
                <span>Thử mẫu: Mưa + Khai giảng</span>
              </button>
              {hasFilter && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="costume-floating-card__reset-btn"
                >
                  Xóa lọc
                </button>
              )}
            </div>

            {/* KHUNG HIỂN THỊ MỘT CÂU GIẢI THÍCH (loiKe, không AI, hiện ngay) */}
            <div className="costume-floating-card__explanation-box">
              <div className="costume-floating-card__explanation-header">
                <span className="costume-floating-card__explanation-tag inline-flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>Lời gợi ý từ Cò Em</span>
                </span>
              </div>

              <p className="costume-floating-card__sentence">
                "{cauHienThi}"
              </p>
            </div>

            {/* DANH SÁCH TRANG PHỤC GỢI Ý */}
            <div className="costume-floating-card__results-section">
              <div className="costume-floating-card__results-header">
                <span className="costume-floating-card__results-count">
                  Danh sách gợi ý ({filteredCostumes.length} bộ):
                </span>
                {onApplyToMainList && (
                  <button
                    type="button"
                    onClick={() =>
                      onApplyToMainList(filteredCostumes.map((c) => c.id))
                    }
                    className="costume-floating-card__apply-btn"
                  >
                    Lọc ngoài màn hình
                  </button>
                )}
              </div>

              <div className="costume-floating-card__costumes-list">
                {filteredCostumes.length === 0 ? (
                  <p className="costume-floating-card__empty">
                    Chưa tìm thấy trang phục phù hợp hoàn toàn với điều kiện này.
                  </p>
                ) : (
                  filteredCostumes.map((costume) => (
                    <div
                      key={costume.id}
                      className="costume-floating-card__costume-item"
                    >
                      <div className="costume-floating-card__costume-info">
                        <h4 className="costume-floating-card__costume-name">
                          {costume.ten}
                        </h4>
                        <p className="costume-floating-card__costume-desc">
                          {costume.moTaNgan}
                        </p>
                        <div className="costume-floating-card__costume-tags">
                          <span className="costume-tag">
                            {costume.thoiTiet
                              .map((t) => TEN_THOI_TIET[t] ?? t)
                              .join(", ")}
                          </span>
                          <span className="costume-tag costume-tag--dip">
                            {costume.dip
                              .slice(0, 2)
                              .map((d) => domdom.s2.tenDip[d] ?? d)
                              .join(", ")}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => onSelectTrangPhuc(costume.id)}
                        className="costume-floating-card__choose-btn"
                        title={`Xem chi tiết và phối ${costume.ten}`}
                      >
                        Chọn →
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CSS Nhúng trực tiếp cho Thẻ Nổi Gợi Ý */}
      <style>{`
        .costume-floating-trigger {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 50;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 11px 18px;
          background: rgba(28, 25, 23, 0.95);
          color: var(--nen-sang);
          border: 1px solid var(--vang-nghe);
          border-radius: var(--vien-lech-a);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.55), 0 0 16px rgba(217, 164, 65, 0.25);
          cursor: pointer;
          font-family: var(--font-than);
          font-size: 0.9rem;
          font-weight: 600;
          backdrop-filter: blur(10px);
          transition: all var(--nhip-vua) ease;
        }

        .costume-floating-trigger:hover {
          background: rgba(41, 37, 36, 0.98);
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(0, 0, 0, 0.65), 0 0 20px rgba(217, 164, 65, 0.4);
        }

        .costume-floating-trigger__icon {
          font-size: 1.15rem;
        }

        .costume-floating-trigger__dot {
          width: 8px;
          height: 8px;
          background: var(--vang-nghe);
          border-radius: 50%;
          box-shadow: 0 0 8px var(--vang-nghe);
        }

        /* Khung thẻ nổi */
        .costume-floating-card {
          position: fixed;
          bottom: calc(var(--dock-h, 64px) + 16px);
          right: 16px;
          z-index: 50;
          width: calc(100vw - 32px);
          max-width: 440px;
          max-height: calc(100vh - var(--top-bar-h, 56px) - var(--dock-h, 64px) - 32px);
          overflow-y: auto;
          background: rgba(24, 22, 20, 0.98);
          border: 1px solid var(--vang-nghe);
          border-radius: var(--vien-lech-a);
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.75), 0 0 24px rgba(217, 164, 65, 0.2);
          backdrop-filter: blur(14px);
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          animation: popFadeIn 0.22s ease-out;
        }

        @media (min-width: 769px) {
          .costume-floating-card {
            bottom: 24px;
            right: 24px;
            max-height: calc(100vh - var(--top-bar-h, 56px) - 48px);
          }
        }

        @keyframes popFadeIn {
          from {
            opacity: 0;
            transform: translateY(16px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .costume-floating-card__header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding: 14px 16px 10px;
          border-bottom: 1px solid rgba(138, 129, 117, 0.25);
        }

        .costume-floating-card__header-title {
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }

        .costume-floating-card__spark {
          font-size: 1.25rem;
          color: var(--vang-nghe);
          margin-top: 2px;
        }

        .costume-floating-card__title {
          margin: 0;
          font-family: var(--font-tieu-de);
          font-size: 1.1rem;
          color: var(--vang-nghe);
          font-weight: 600;
        }

        .costume-floating-card__sub {
          margin: 2px 0 0;
          font-size: 0.76rem;
          color: var(--tro-tram);
          line-height: 1.3;
        }

        .costume-floating-card__close-btn {
          background: transparent;
          border: none;
          color: var(--tro-tram);
          font-size: 1.1rem;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 4px;
          line-height: 1;
          transition: color var(--nhip-nhanh) ease;
        }

        .costume-floating-card__close-btn:hover {
          color: var(--nen-sang);
        }

        .costume-floating-card__body {
          padding: 14px 16px 18px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .costume-floating-card__section {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .costume-floating-card__label {
          font-size: 0.76rem;
          color: var(--tro-tram);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .costume-floating-card__pills {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .costume-floating-card__pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 5px 10px;
          font-size: 0.8rem;
          font-family: var(--font-than);
          background: rgba(255, 255, 255, 0.05);
          color: var(--nen-sang);
          border: 1px solid var(--tro-tram);
          border-radius: var(--vien-lech-b);
          cursor: pointer;
          transition: all var(--nhip-nhanh) ease;
        }

        .costume-floating-card__pill:hover {
          border-color: var(--vang-nghe);
          background: rgba(217, 164, 65, 0.1);
        }

        .costume-floating-card__pill--active {
          background: rgba(217, 164, 65, 0.22);
          border-color: var(--vang-nghe);
          color: var(--vang-nghe);
          font-weight: 600;
        }

        .costume-floating-card__quick-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 2px;
        }

        .costume-floating-card__quick-btn {
          font-size: 0.76rem;
          padding: 5px 9px;
          border-radius: var(--vien-lech-b);
          background: rgba(92, 107, 79, 0.2);
          border: 1px dashed var(--reu-phong);
          color: #a4be92;
          cursor: pointer;
          transition: all var(--nhip-nhanh) ease;
        }

        .costume-floating-card__quick-btn:hover {
          background: rgba(92, 107, 79, 0.35);
          color: #c0dcb0;
        }

        .costume-floating-card__reset-btn {
          font-size: 0.74rem;
          color: var(--tro-tram);
          background: transparent;
          border: none;
          text-decoration: underline;
          cursor: pointer;
          padding: 4px;
        }

        .costume-floating-card__reset-btn:hover {
          color: var(--nen-sang);
        }

        /* Khung câu giải thích */
        .costume-floating-card__explanation-box {
          padding: 12px;
          background: rgba(0, 0, 0, 0.35);
          border: 1px solid rgba(217, 164, 65, 0.35);
          border-radius: var(--vien-lech-b);
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .costume-floating-card__explanation-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 4px;
        }

        .costume-floating-card__explanation-tag {
          font-size: 0.72rem;
          color: var(--vang-nghe);
          font-weight: 600;
        }

        .costume-floating-card__rephrase-btn {
          font-size: 0.72rem;
          padding: 2px 7px;
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid var(--tro-tram);
          color: var(--nen-sang);
          cursor: pointer;
          transition: all var(--nhip-nhanh) ease;
        }

        .costume-floating-card__rephrase-btn:hover:not(:disabled) {
          border-color: var(--vang-nghe);
          color: var(--vang-nghe);
        }

        .costume-floating-card__rephrase-btn:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }

        .costume-floating-card__sentence {
          margin: 0;
          font-family: var(--font-than);
          font-size: 0.88rem;
          line-height: 1.45;
          color: var(--nen-sang);
          font-style: italic;
        }

        .costume-floating-card__fallback-note {
          margin: 0;
          font-size: 0.7rem;
          color: var(--tro-tram);
        }

        /* Danh sách trang phục gợi ý */
        .costume-floating-card__results-section {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .costume-floating-card__results-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .costume-floating-card__results-count {
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--tro-tram);
        }

        .costume-floating-card__apply-btn {
          font-size: 0.72rem;
          padding: 2px 8px;
          border-radius: 4px;
          background: rgba(92, 107, 79, 0.25);
          border: 1px solid var(--reu-phong);
          color: #a4be92;
          cursor: pointer;
        }

        .costume-floating-card__apply-btn:hover {
          background: rgba(92, 107, 79, 0.4);
        }

        .costume-floating-card__costumes-list {
          display: flex;
          flex-direction: column;
          gap: 7px;
          max-height: 180px;
          overflow-y: auto;
          padding-right: 4px;
        }

        .costume-floating-card__costume-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 10px;
          background: rgba(0, 0, 0, 0.28);
          border: 1px solid rgba(138, 129, 117, 0.3);
          border-radius: var(--vien-lech-b);
          gap: 8px;
          transition: border-color var(--nhip-nhanh) ease;
        }

        .costume-floating-card__costume-item:hover {
          border-color: rgba(217, 164, 65, 0.5);
        }

        .costume-floating-card__costume-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }

        .costume-floating-card__costume-name {
          margin: 0;
          font-family: var(--font-tieu-de);
          font-size: 0.88rem;
          color: var(--nen-sang);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .costume-floating-card__costume-desc {
          margin: 0;
          font-size: 0.72rem;
          color: var(--tro-tram);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .costume-floating-card__costume-tags {
          display: flex;
          gap: 4px;
          margin-top: 2px;
        }

        .costume-tag {
          font-size: 0.68rem;
          padding: 1px 6px;
          border-radius: 3px;
          background: rgba(255, 255, 255, 0.06);
          color: var(--tro-tram);
          border: 1px solid rgba(138, 129, 117, 0.2);
        }

        .costume-tag--dip {
          color: #a4be92;
          background: rgba(92, 107, 79, 0.15);
          border-color: rgba(92, 107, 79, 0.3);
        }

        .costume-floating-card__choose-btn {
          font-size: 0.76rem;
          font-weight: 600;
          padding: 6px 11px;
          background: var(--dat-nung);
          color: var(--nen-sang);
          border: none;
          border-radius: var(--vien-lech-b);
          cursor: pointer;
          white-space: nowrap;
          flex-shrink: 0;
          transition: background var(--nhip-nhanh) ease;
        }

        .costume-floating-card__choose-btn:hover {
          background: #c95c37;
        }

        .costume-floating-card__empty {
          margin: 0;
          font-size: 0.8rem;
          color: var(--tro-tram);
          text-align: center;
          padding: 12px 0;
        }
      `}</style>
    </>
  );
}
