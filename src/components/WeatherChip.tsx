/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { VungId, vungData } from "../data/vung";
import { ThoiTietState, ThongTinViTri } from "../lib/thoitiet";
import { domdom } from "../copy/coem";
import { locTrangPhucGoiY } from "../lib/rules";
import { keGoiYThoiTiet, dinhDangThoiTietChuoi } from "../lib/loiKe";
import ChonViTriSection from "./ChonViTriSection";
import { CloudRain, Sun, Snowflake, Wind, X } from "lucide-react";

interface Props {
  weatherState: ThoiTietState;
  onSelectVung: (vungId: VungId) => void;
  onSelectCostume?: (trangPhucId: string) => void;
  onViTriChange?: (newViTri: ThongTinViTri) => void;
}

export default function WeatherChip({
  weatherState,
  onSelectVung,
  onSelectCostume,
  onViTriChange,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const { vung, thoiTiet, khungGio, nhietDo, moTaThoiTiet, moTaKhungGio, doAm, viTri } = weatherState;

  const tenNoi = viTri?.ten || vung.noi;

  // Danh sách trang phục lọc theo luật S7 (thời tiết hiện tại)
  const matchingCostumes = locTrangPhucGoiY({ thoiTiet });

  // Định dạng hiển thị bắt buộc ở mọi nơi: "{Tên nơi} - {nhiệt độ}°C - {mô tả thời tiết}"
  const chipText = dinhDangThoiTietChuoi({
    noi: tenNoi,
    nhietDo,
    thoiTiet,
    moTa: moTaThoiTiet,
  });

  // Chuỗi chi tiết có độ ẩm khi hiển thị trong thẻ chi tiết
  const detailHeaderText = dinhDangThoiTietChuoi({
    noi: tenNoi,
    nhietDo,
    thoiTiet,
    moTa: moTaThoiTiet,
    doAm,
    kemDoAm: true,
  });

  // Câu nói Cò Em ghép từ luật qua loiKe, KHÔNG dùng Gemini, hiện ngay lập tức
  const cauNoiThoiTiet = keGoiYThoiTiet({
    noi: tenNoi,
    nhietDo,
    thoiTiet,
    khungGio,
    moTa: moTaThoiTiet,
    doAm,
    kemDoAm: true,
    soBo: matchingCostumes.length,
  });

  const cauNoiKhungGio = domdom.thoiTiet.cauNoiTheoKhungGio[khungGio] ?? "";

  // Biểu tượng Lucide hiển thị trên chip
  const renderWeatherIcon = (size = "w-3.5 h-3.5") => {
    switch (thoiTiet) {
      case "mua":
        return <CloudRain className={`${size} text-sky-500`} />;
      case "nong":
        return <Sun className={`${size} text-amber-500`} />;
      case "lanh":
        return <Snowflake className={`${size} text-blue-400`} />;
      default:
        return <Wind className={`${size} text-emerald-500`} />;
    }
  };

  return (
    <>
      {/* 1. CHIP THỜI TIẾT NHỎ Ở GÓC TRÊN */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="vpr-weather-chip"
        title="Nhấn để xem gợi ý trang phục theo thời tiết và chọn vùng miền"
        aria-label={`Thời tiết: ${chipText}. Nhấn để xem chi tiết.`}
      >
        <span className="vpr-weather-chip__icon" aria-hidden="true">
          {renderWeatherIcon("w-3.5 h-3.5")}
        </span>
        <span className="vpr-weather-chip__text">{chipText}</span>
      </button>

      {/* 2. MODAL / THẺ GỢI Ý KHI BẤM VÀO CHIP */}
      {isOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="vpr-weather-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="vpr-weather-title"
          >
            <div
              className="vpr-weather-modal__backdrop"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />

            <div className="vpr-weather-modal__card">
              {/* Header cố định luôn hiển thị nút đóng */}
              <div className="vpr-weather-modal__header">
                <div className="vpr-weather-modal__title-wrap">
                  <span className="vpr-weather-modal__icon" aria-hidden="true">
                    {renderWeatherIcon("w-5 h-5")}
                  </span>
                  <div>
                    <h3 id="vpr-weather-title" className="vpr-weather-modal__title">
                      {domdom.thoiTiet.tieuDeGoiY}
                    </h3>
                    <p className="vpr-weather-modal__sub font-mono">
                      {detailHeaderText}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="vpr-weather-modal__close-btn"
                  aria-label={domdom.thoiTiet.dongGoiY}
                  title="Đóng cửa sổ"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Đóng</span>
                </button>
              </div>

              <div className="vpr-weather-modal__body">
                {/* LUỒNG 3 BƯỚC CHỌN VỊ TRÍ: GPS -> TÌM KIẾM ĐỊA ĐIỂM -> MẶC ĐỊNH THEO VÙNG */}
                <div className="vpr-weather-modal__section">
                  <ChonViTriSection
                    weatherState={weatherState}
                    onViTriChange={(newLoc) => {
                      if (onViTriChange) onViTriChange(newLoc);
                    }}
                    onSelectVung={onSelectVung}
                  />
                </div>

                {/* MỘT CÂU GIẢI THÍCH TỪ LUẬT (GIỌNG CÒ EM) */}
                <div className="vpr-weather-modal__voice-box">
                  <p className="vpr-weather-modal__voice-main">
                    "{cauNoiThoiTiet}"
                  </p>
                  {cauNoiKhungGio && (
                    <p className="vpr-weather-modal__voice-sub">
                      "{cauNoiKhungGio}"
                    </p>
                  )}
                  <span className="vpr-weather-modal__voice-tag">
                    📜 Lời kể từ luật văn hóa (không dùng AI)
                  </span>
                </div>

                {/* DANH SÁCH TRANG PHỤC PHÙ HỢP TIẾT TRỜI NÀY */}
                <div className="vpr-weather-modal__section">
                  <label className="vpr-weather-modal__label">
                    {domdom.thoiTiet.trangPhucPhuHop} ({matchingCostumes.length} bộ):
                  </label>
                  <div className="vpr-weather-modal__costumes">
                    {matchingCostumes.map((c) => (
                      <div key={c.id} className="vpr-costume-item">
                        <div className="vpr-costume-item__info">
                          <span className="vpr-costume-item__name">{c.ten}</span>
                          <span className="vpr-costume-item__desc">{c.moTaNgan}</span>
                        </div>
                        {onSelectCostume && (
                          <button
                            type="button"
                            onClick={() => {
                              setIsOpen(false);
                              onSelectCostume(c.id);
                            }}
                            className="vpr-costume-item__btn"
                          >
                            Xem nếp áo →
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Nút đóng chân trang tiện lợi */}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-full py-2 px-4 rounded-lg border border-[var(--vien-the)] bg-[var(--nen-the-phu)] hover:bg-[var(--nen-the)] text-[var(--chu-chinh)] text-xs font-semibold cursor-pointer transition-colors mt-1"
                >
                  ✕ Đóng cửa sổ
                </button>

                {/* Ghi công nguồn dữ liệu Open-Meteo */}
                <div className="vpr-weather-modal__credit">
                  <span>{domdom.thoiTiet.ghiCong}</span>{" "}
                  <span className="text-stone-400">{domdom.thoiTiet.giayPhep}</span>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Style chip và modal */}
      <style>{`
        .vpr-weather-chip {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 6px 12px;
          background: var(--nen-the);
          color: var(--nen-sang);
          border: 1px solid var(--vien-the);
          border-radius: var(--vien-lech-a);
          font-family: var(--font-than);
          font-size: 0.78rem;
          font-weight: 500;
          cursor: pointer;
          backdrop-filter: blur(8px);
          box-shadow: var(--shadow-the);
          transition: all var(--nhip-cham) ease;
        }

        .vpr-weather-chip:hover {
          border-color: var(--vang-nghe);
          background: var(--nen-the-phu);
          transform: translateY(-1px);
        }

        .vpr-weather-chip__icon {
          font-size: 0.92rem;
        }

        .vpr-weather-chip__text {
          white-space: nowrap;
          color: var(--nen-sang);
        }

        /* Modal hiển thị gợi ý */
        .vpr-weather-modal {
          position: fixed;
          inset: 0;
          z-index: 60;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }

        .vpr-weather-modal__backdrop {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.65);
          backdrop-filter: blur(4px);
        }

        .vpr-weather-modal__card {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 480px;
          max-height: 85vh;
          overflow-y: auto;
          background: var(--nen-the);
          border: 1px solid var(--vien-the);
          border-radius: var(--vien-lech-a);
          box-shadow: var(--shadow-the);
          color: var(--nen-sang);
          box-sizing: border-box;
          animation: popWeather 0.2s ease-out;
        }

        @keyframes popWeather {
          from {
            opacity: 0;
            transform: scale(0.96);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .vpr-weather-modal__header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding: 14px 18px;
          border-bottom: 1px solid rgba(138, 129, 117, 0.25);
        }

        .vpr-weather-modal__title-wrap {
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }

        .vpr-weather-modal__icon {
          font-size: 1.4rem;
          margin-top: 2px;
        }

        .vpr-weather-modal__title {
          margin: 0;
          font-family: var(--font-tieu-de);
          font-size: 1.05rem;
          color: var(--vang-nghe);
        }

        .vpr-weather-modal__sub {
          margin: 2px 0 0;
          font-size: 0.76rem;
          color: var(--tro-tram);
        }

        .vpr-weather-modal__close-btn {
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

        .vpr-weather-modal__close-btn:hover {
          background: #FEE2E2;
          border-color: #FCA5A5;
          color: #B91C1C;
        }

        .vpr-weather-modal__body {
          padding: 16px 18px 20px;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .vpr-weather-modal__section {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .vpr-weather-modal__label {
          font-size: 0.74rem;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: var(--tro-tram);
          font-weight: 600;
        }

        .vpr-weather-modal__regions {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
        }

        .vpr-weather-modal__region-btn {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          padding: 8px 10px;
          border: 1px solid var(--vien-the);
          border-radius: var(--vien-lech-b);
          background: var(--nen-the-phu);
          color: var(--nen-sang);
          cursor: pointer;
          transition: all var(--nhip-cham) ease;
        }

        .vpr-weather-modal__region-btn:hover {
          border-color: var(--vang-nghe);
          background: var(--nen-the);
        }

        .vpr-weather-modal__region-btn--active {
          border-color: var(--vang-nghe);
          background: var(--nen-the);
          box-shadow: 0 0 0 1px var(--vang-nghe);
        }

        .vpr-region-name {
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--nen-sang);
        }

        .vpr-region-city {
          font-size: 0.72rem;
          color: var(--chu-mo);
        }

        /* Khung lời thoại Cò Em */
        .vpr-weather-modal__voice-box {
          padding: 12px 14px;
          background: var(--nen-the-phu);
          border: 1px solid var(--vien-the);
          border-radius: var(--vien-lech-b);
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .vpr-weather-modal__voice-main {
          margin: 0;
          font-family: var(--font-than);
          font-size: 0.88rem;
          line-height: 1.45;
          color: var(--nen-sang);
          font-style: italic;
        }

        .vpr-weather-modal__voice-sub {
          margin: 0;
          font-size: 0.8rem;
          color: var(--chu-mo);
          font-style: italic;
        }

        .vpr-weather-modal__voice-tag {
          font-size: 0.68rem;
          color: var(--vang-nghe);
          margin-top: 2px;
          font-weight: 600;
        }

        /* Danh sách trang phục */
        .vpr-weather-modal__costumes {
          display: flex;
          flex-direction: column;
          gap: 6px;
          max-height: 170px;
          overflow-y: auto;
          padding-right: 4px;
        }

        .vpr-costume-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 7px 10px;
          background: var(--nen-the-phu);
          border: 1px solid var(--vien-the);
          border-radius: var(--vien-lech-b);
          gap: 8px;
        }

        .vpr-costume-item__info {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }

        .vpr-costume-item__name {
          font-family: var(--font-tieu-de);
          font-size: 0.84rem;
          color: var(--nen-sang);
          font-weight: 600;
        }

        .vpr-costume-item__desc {
          font-size: 0.7rem;
          color: var(--chu-mo);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .vpr-costume-item__btn {
          font-size: 0.74rem;
          padding: 5px 9px;
          border: none;
          border-radius: var(--vien-lech-b);
          background: var(--vang-nghe);
          color: #111A1D;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .vpr-costume-item__btn:hover {
          opacity: 0.9;
        }

        .vpr-weather-modal__credit {
          font-size: 0.72rem;
          color: var(--tro-tram);
          text-align: center;
          margin-top: 4px;
        }

        @media (max-width: 500px) {
          .vpr-weather-chip {
            top: 10px;
            right: 12px;
            padding: 5px 10px;
            font-size: 0.72rem;
          }
        }
      `}</style>
    </>
  );
}
