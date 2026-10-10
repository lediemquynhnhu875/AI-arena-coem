/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { domdom } from "../copy/coem";
import {
  OutfitSaved,
  luuVaoGuiKyUc,
  goiYCaptionGemini,
  docDanhSachGuiKyUc,
  MAX_OUTFITS,
} from "../lib/guiKyUc";
import { ghiNhanOutfitVaoNhatKy } from "../lib/journal";
import { playChimeSound } from "../lib/sound";

interface Props {
  trangPhucId: string;
  tenTrangPhuc: string;
  mauId: string;
  tenMau: string;
  phuKienIds: string[];
  tenPhuKienList: string[];
  hoaVanThem?: string | null;
  phongCach?: string | null;
  nhanVatPreview?: React.ReactNode;
  lyDoRemix?: string[];
  cauLyDoRemix?: string;
  onClose: () => void;
  onOpenGuiKyUc: () => void;
}

export default function CatVaoGuiModal({
  trangPhucId,
  tenTrangPhuc,
  mauId,
  tenMau,
  phuKienIds,
  tenPhuKienList,
  hoaVanThem,
  phongCach,
  nhanVatPreview,
  lyDoRemix,
  cauLyDoRemix,
  onClose,
  onOpenGuiKyUc,
}: Props) {
  const [caption, setCaption] = useState(() => cauLyDoRemix || "");
  const [loadingGemini, setLoadingGemini] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const currentCount = docDanhSachGuiKyUc().length;

  // Xử lý nút "Nhờ Cò Em gợi ý"
  const handleNhoDomDom = async () => {
    setLoadingGemini(true);
    setErrorMessage(null);
    try {
      const suggestedCaption = await goiYCaptionGemini({
        tenTrangPhuc,
        tenMau,
        tenPhuKienList,
      });
      // "lỗi thì để trống ô"
      setCaption(suggestedCaption);
    } catch {
      setCaption("");
    } finally {
      setLoadingGemini(false);
    }
  };

  // Xử lý nút "Cất vào Gùi Ký Ức"
  const handleLuu = () => {
    setErrorMessage(null);
    const result = luuVaoGuiKyUc({
      trangPhucId,
      mauId,
      phuKienIds,
      caption: caption.trim() || cauLyDoRemix || "",
      hoaVanThem,
      phongCach,
      lyDoRemix,
      cauLyDoRemix,
    });

    if (result.success) {
      playChimeSound();
      setSavedSuccess(true);
      const savedOutfit: OutfitSaved = {
        id: result.list[0]?.id || `outfit_${Date.now()}`,
        trangPhucId,
        mauId,
        phuKienIds,
        caption: caption.trim() || cauLyDoRemix || "",
        taoLuc: Date.now(),
        hoaVanThem,
        phongCach,
        lyDoRemix,
        cauLyDoRemix,
      };
      ghiNhanOutfitVaoNhatKy(savedOutfit);
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("vpr:outfit-completed", {
            detail: { trangPhucId, action: "save" },
          })
        );
      }
    } else {
      setErrorMessage(result.error || domdom.guiKyUc.guiDay);
    }
  };

  return (
    <div
      className="cat-gui-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cat-gui-title"
    >
      <div className="cat-gui-modal__backdrop" onClick={onClose} aria-hidden="true" />

      <div className="cat-gui-modal__card">
        {/* Header */}
        <div className="cat-gui-modal__header">
          <div className="cat-gui-modal__title-wrap">
            <span className="cat-gui-modal__icon" aria-hidden="true">
              🎒
            </span>
            <div>
              <h2 id="cat-gui-title" className="cat-gui-modal__title">
                {domdom.guiKyUc.hopThoaiTieuDe}
              </h2>
              <p className="cat-gui-modal__sub">
                {tenTrangPhuc} · {tenMau} · {domdom.guiKyUc.soLuongDaLuu(currentCount)}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cat-gui-modal__close-btn"
            aria-label="Đóng hộp thoại"
            title="Đóng hộp thoại"
          >
            ✕ <span>Đóng</span>
          </button>
        </div>

        {/* Nội dung */}
        <div className="cat-gui-modal__body">
          {savedSuccess ? (
            <div className="cat-gui-modal__success-box">
              <div className="cat-gui-modal__success-icon">✨🎒✨</div>
              <h3 className="cat-gui-modal__success-title">
                {domdom.guiKyUc.luuThanhCong}
              </h3>
              <p className="cat-gui-modal__success-desc">
                "{caption || "Một nếp áo kỷ niệm đong đầy ký ức."}"
              </p>
              <div className="cat-gui-modal__success-actions">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenGuiKyUc();
                  }}
                  className="cat-gui-btn cat-gui-btn--primary"
                >
                  🎒 {domdom.guiKyUc.moTrangGui}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    window.dispatchEvent(new CustomEvent("vpr:open-nhat-ky"));
                  }}
                  className="cat-gui-btn cat-gui-btn--secondary"
                  style={{ borderColor: "var(--vang-nghe)", color: "var(--vang-nghe)" }}
                >
                  📖 Viết Nhật Ký
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="cat-gui-btn cat-gui-btn--secondary"
                >
                  Ở lại phối tiếp
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Xem trước nhỏ */}
              {nhanVatPreview && (
                <div className="cat-gui-modal__preview-box">
                  <div className="cat-gui-modal__preview-avatar">{nhanVatPreview}</div>
                  <div className="cat-gui-modal__preview-info">
                    <span className="cat-gui-modal__preview-name">{tenTrangPhuc}</span>
                    <span className="cat-gui-modal__preview-sub">
                      Màu: {tenMau}
                      {tenPhuKienList.length > 0 &&
                        ` · Phụ kiện: ${tenPhuKienList.join(", ")}`}
                    </span>
                  </div>
                </div>
              )}

              {/* Lý do remix đã chọn */}
              {cauLyDoRemix && (
                <div
                  className="mb-3 p-2.5 rounded text-xs border"
                  style={{
                    background: "rgba(217, 164, 65, 0.12)",
                    borderColor: "rgba(217, 164, 65, 0.4)",
                    borderRadius: "var(--vien-lech-a)",
                  }}
                >
                  <span className="text-amber-300 font-semibold block mb-0.5 text-[11px] uppercase tracking-wide">
                    💭 Tâm sự remix:
                  </span>
                  <p className="text-stone-200 m-0 italic leading-relaxed">
                    {cauLyDoRemix}
                  </p>
                </div>
              )}

              {/* Ô nhập chú thích & Nút Cò Em */}
              <div className="cat-gui-modal__field">
                <div className="cat-gui-modal__field-head">
                  <label htmlFor="cat-gui-caption" className="cat-gui-modal__label">
                    {domdom.guiKyUc.nhapChuThich}
                  </label>
                  <span
                    className={`cat-gui-modal__char-count ${
                      caption.length >= 140 ? "cat-gui-modal__char-count--max" : ""
                    }`}
                  >
                    {caption.length}/140
                  </span>
                </div>

                <textarea
                  id="cat-gui-caption"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value.slice(0, 140))}
                  placeholder={domdom.guiKyUc.placeholderChuThich}
                  rows={3}
                  className="cat-gui-modal__textarea"
                  maxLength={140}
                />

                <div className="cat-gui-modal__assistant-row">
                  <button
                    type="button"
                    onClick={handleNhoDomDom}
                    disabled={loadingGemini}
                    className="cat-gui-modal__gemini-btn"
                  >
                    <span aria-hidden="true">{loadingGemini ? "⏳" : "✨"}</span>
                    <span>
                      {loadingGemini
                        ? domdom.guiKyUc.dangGoiY
                        : domdom.guiKyUc.nhoDomDomGoiY}
                    </span>
                  </button>
                  <span className="cat-gui-modal__gemini-note">
                    (1–2 câu, giọng nhẹ, tối đa 1 emoji)
                  </span>
                </div>
              </div>

              {/* Thông báo lỗi nếu có */}
              {errorMessage && (
                <div className="cat-gui-modal__error-box">
                  <span>⚠️ {errorMessage}</span>
                </div>
              )}

              {/* Chân hộp thoại */}
              <div className="cat-gui-modal__footer">
                <button
                  type="button"
                  onClick={onClose}
                  className="cat-gui-btn cat-gui-btn--secondary"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleLuu}
                  disabled={loadingGemini}
                  className="cat-gui-btn cat-gui-btn--primary"
                >
                  🎒 {domdom.guiKyUc.nutCatVaoGui}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <style>{`
        .cat-gui-modal {
          position: fixed;
          inset: 0;
          z-index: 65;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }

        .cat-gui-modal__backdrop {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(5px);
        }

        .cat-gui-modal__card {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 480px;
          background: rgba(27, 42, 46, 0.98);
          border: 1px solid var(--vang-nghe);
          border-radius: var(--vien-lech-a);
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.75);
          color: var(--nen-sang);
          overflow: hidden;
          animation: catGuiPop 0.2s ease-out;
        }

        @keyframes catGuiPop {
          from {
            opacity: 0;
            transform: scale(0.96);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .cat-gui-modal__header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding: 16px 18px;
          border-bottom: 1px solid rgba(138, 129, 117, 0.25);
        }

        .cat-gui-modal__title-wrap {
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }

        .cat-gui-modal__icon {
          font-size: 1.5rem;
          margin-top: 2px;
        }

        .cat-gui-modal__title {
          margin: 0;
          font-family: var(--font-tieu-de);
          font-size: 1.1rem;
          color: var(--vang-nghe);
        }

        .cat-gui-modal__sub {
          margin: 3px 0 0;
          font-size: 0.78rem;
          color: var(--tro-tram);
        }

        .cat-gui-modal__close-btn {
          background: var(--nen-the-phu);
          border: 1px solid var(--vien-the);
          border-radius: 9999px;
          color: var(--chu-phu);
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
          padding: 5px 12px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          transition: all 0.2s ease;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .cat-gui-modal__close-btn:hover {
          background: #FEE2E2;
          border-color: #FCA5A5;
          color: #B91C1C;
        }

        .cat-gui-modal__body {
          padding: 16px 18px 20px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .cat-gui-modal__preview-box {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(138, 129, 117, 0.25);
          border-radius: var(--vien-lech-b);
        }

        .cat-gui-modal__preview-avatar {
          width: 52px;
          height: 64px;
          overflow: hidden;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cat-gui-modal__preview-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }

        .cat-gui-modal__preview-name {
          font-family: var(--font-tieu-de);
          font-size: 0.92rem;
          color: var(--nen-sang);
        }

        .cat-gui-modal__preview-sub {
          font-size: 0.75rem;
          color: var(--tro-tram);
        }

        .cat-gui-modal__field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .cat-gui-modal__field-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .cat-gui-modal__label {
          font-size: 0.8rem;
          color: var(--tro-tram);
          font-weight: 500;
        }

        .cat-gui-modal__char-count {
          font-size: 0.72rem;
          font-family: monospace;
          color: var(--tro-tram);
        }

        .cat-gui-modal__char-count--max {
          color: #f87171;
        }

        .cat-gui-modal__textarea {
          width: 100%;
          box-sizing: border-box;
          padding: 10px 12px;
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(138, 129, 117, 0.35);
          border-radius: var(--vien-lech-b);
          color: var(--nen-sang);
          font-family: var(--font-than);
          font-size: 0.86rem;
          line-height: 1.45;
          resize: none;
          outline: none;
        }

        .cat-gui-modal__textarea:focus {
          border-color: var(--vang-nghe);
        }

        .cat-gui-modal__assistant-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: gap;
          margin-top: 4px;
        }

        .cat-gui-modal__gemini-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 10px;
          background: rgba(217, 164, 65, 0.15);
          border: 1px solid var(--vang-nghe);
          border-radius: var(--vien-lech-b);
          color: var(--vang-nghe);
          font-family: var(--font-than);
          font-size: 0.76rem;
          font-weight: 500;
          cursor: pointer;
          transition: all var(--nhip-cham) ease;
        }

        .cat-gui-modal__gemini-btn:hover:not(:disabled) {
          background: rgba(217, 164, 65, 0.25);
          transform: translateY(-1px);
        }

        .cat-gui-modal__gemini-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .cat-gui-modal__gemini-note {
          font-size: 0.7rem;
          color: var(--tro-tram);
          font-style: italic;
        }

        .cat-gui-modal__error-box {
          padding: 8px 12px;
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid rgba(239, 68, 68, 0.4);
          border-radius: var(--vien-lech-b);
          color: #fca5a5;
          font-size: 0.78rem;
        }

        .cat-gui-modal__footer {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 10px;
          padding-top: 8px;
          border-top: 1px solid rgba(138, 129, 117, 0.2);
        }

        .cat-gui-btn {
          padding: 8px 16px;
          border-radius: var(--vien-lech-b);
          font-family: var(--font-than);
          font-size: 0.84rem;
          font-weight: 600;
          cursor: pointer;
          transition: all var(--nhip-cham) ease;
        }

        .cat-gui-btn--primary {
          background: var(--dat-nung);
          border: 1px solid transparent;
          color: var(--nen-sang);
        }

        .cat-gui-btn--primary:hover {
          background: #c95c37;
        }

        .cat-gui-btn--secondary {
          background: transparent;
          border: 1px solid rgba(138, 129, 117, 0.4);
          color: var(--nen-sang);
        }

        .cat-gui-btn--secondary:hover {
          border-color: var(--nen-sang);
        }

        /* Thành công */
        .cat-gui-modal__success-box {
          text-align: center;
          padding: 16px 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        .cat-gui-modal__success-icon {
          font-size: 2.2rem;
        }

        .cat-gui-modal__success-title {
          margin: 0;
          font-family: var(--font-tieu-de);
          font-size: 1.15rem;
          color: var(--vang-nghe);
        }

        .cat-gui-modal__success-desc {
          margin: 0;
          font-size: 0.86rem;
          font-style: italic;
          color: var(--nen-sang);
          max-width: 360px;
        }

        .cat-gui-modal__success-actions {
          display: flex;
          gap: 10px;
          margin-top: 8px;
        }
      `}</style>
    </div>
  );
}
