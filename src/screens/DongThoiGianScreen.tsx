/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from "react";
import { mocThoiGian } from "../data/mocthoigian";
import { domdom } from "../copy/domdom";
import { laySvgTheoMoc } from "../components/AoDaiTimelineSVGs";
import { openGiuChuanVanHoa } from "../lib/giuChuan";
import Tooltip from "../components/Tooltip";
import DongThoiGianPose from "../narrator/poses/DongThoiGianPose";

interface Props {
  onBack: () => void;
  onRemixInS4?: (costumeId: string) => void;
}

const noise = encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .95  0 0 0 0 .92  0 0 0 0 .85  0 0 0 .55 0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`
);

export default function DongThoiGianScreen({ onBack, onRemixInS4 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  // Lắng nghe sự kiện scroll để cập nhật mốc đang xem
  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollLeft, clientWidth } = containerRef.current;
    const cardWidth = clientWidth * 0.85; // ước lượng kích cỡ cuộn
    const newIdx = Math.round(scrollLeft / (cardWidth > 0 ? cardWidth : 320));
    setActiveIndex(Math.max(0, Math.min(newIdx, mocThoiGian.length)));
  };

  const scrollToMoc = (index: number) => {
    if (!containerRef.current) return;
    const cards = containerRef.current.querySelectorAll<HTMLElement>(".timeline-card");
    if (cards[index]) {
      cards[index].scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
      setActiveIndex(index);
    }
  };

  return (
    <main className="dong-thoi-gian">
      <style>{css}</style>
      <div className="dong-thoi-gian__noise" aria-hidden="true" />

      {/* HEADER */}
      <header className="dong-thoi-gian__header">
        <div className="flex items-center gap-3">
          <DongThoiGianPose size={64} animate={true} />
          <div>
            <span className="dong-thoi-gian__brand-tag">Áo dài Việt Nam</span>
            <h1 className="dong-thoi-gian__title">{domdom.dongThoiGian.tieuDe}</h1>
            <p className="dong-thoi-gian__sub">{domdom.dongThoiGian.phuDe}</p>
          </div>
        </div>
        <Tooltip
          title="Quay lại"
          content="Đóng dòng thời gian và trở lại kho cổ phục."
          shortcut="Quay lại"
          position="bottom"
        >
          <button
            type="button"
            onClick={onBack}
            className="dong-thoi-gian__back-btn cursor-pointer"
            aria-label={domdom.dongThoiGian.nutDong}
          >
            ← {domdom.dongThoiGian.nutDong}
          </button>
        </Tooltip>
      </header>

      {/* THANH ĐIỀU HƯỚNG MỐC THỜI GIAN (Chạm để nhảy nhanh) */}
      <nav className="dong-thoi-gian__nav" aria-label="Danh sách các mốc lịch sử áo dài">
        <div className="dong-thoi-gian__nav-track">
          {mocThoiGian.map((m, idx) => {
            const isActive = activeIndex === idx;
            return (
              <Tooltip
                key={m.id}
                title={`${m.nam} · Mốc ${idx + 1}`}
                content={m.ten}
                shortcut="Nhấp để xem"
                position="bottom"
              >
                <button
                  type="button"
                  onClick={() => scrollToMoc(idx)}
                  className={`dong-thoi-gian__step-btn ${
                    isActive ? "dong-thoi-gian__step-btn--active" : ""
                  }`}
                  aria-current={isActive ? "step" : undefined}
                  title={`${m.nam}: ${m.ten}`}
                >
                  <span className="dong-thoi-gian__step-num">{idx + 1}</span>
                  <span className="dong-thoi-gian__step-label">{m.nam}</span>
                </button>
              </Tooltip>
            );
          })}
          <Tooltip
            title="Đến lượt bạn"
            content="Kể tiếp câu chuyện cách tân Áo Dài bằng cách tự phối một nếp áo của riêng bạn."
            shortcut="Sáng tạo"
            position="bottom"
          >
            <button
              type="button"
              onClick={() => scrollToMoc(mocThoiGian.length)}
              className={`dong-thoi-gian__step-btn ${
                activeIndex === mocThoiGian.length ? "dong-thoi-gian__step-btn--active" : ""
              }`}
              title={domdom.dongThoiGian.khungDenLuotBan}
            >
              <span className="dong-thoi-gian__step-num">✨</span>
              <span className="dong-thoi-gian__step-label">Kể tiếp</span>
            </button>
          </Tooltip>
        </div>
      </nav>

      {/* CHỈ DẪN CUỘN */}
      <div className="dong-thoi-gian__hint">
        <span>👈 👉 {domdom.dongThoiGian.huongDan}</span>
      </div>

      {/* DANH SÁCH THẺ SCROLL-SNAP NGANG */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="dong-thoi-gian__slider"
        role="region"
        aria-label="Dải thời gian kéo ngang các mốc áo dài"
        tabIndex={0}
      >
        {mocThoiGian.map((m, idx) => {
          const isSuThatRong = !m.suThat || m.suThat.length === 0;

          return (
            <article
              key={m.id}
              className={`timeline-card ${
                idx % 2 === 0 ? "timeline-card--a" : "timeline-card--b"
              }`}
            >
              {/* NHÃN THỜI KỲ */}
              <div className="timeline-card__badge-row">
                <span className="timeline-card__period-badge">
                  {m.nam}
                </span>
                <span className="timeline-card__step-indicator">
                  Mốc {idx + 1}/6
                </span>
              </div>

              {/* TÊN KIỂU ÁO */}
              <h2 className="timeline-card__title">{m.ten}</h2>

              {/* HÌNH SVG PHẲNG ĐƠN GIẢN CỦA KIỂU ÁO */}
              <div
                className="timeline-card__svg-container"
                aria-hidden="true"
              >
                {laySvgTheoMoc(m.id, {
                  className: "timeline-card__svg",
                  width: "100%",
                  height: "220px",
                })}
              </div>

              {/* NỘI DUNG ĐOẠN NGẮN:
                  Mốc nào suThat rỗng thì chỉ hiển thị "thayDoi" và chip "Đang bổ sung nguồn" */}
              <div className="timeline-card__content">
                <p className="timeline-card__change-text">
                  {m.thayDoi}
                </p>

                {/* Nếu có suThat thì hiển thị thêm */}
                {!isSuThatRong && (
                  <div className="timeline-card__facts">
                    {m.suThat.map((fact, fIdx) => (
                      <p key={fIdx} className="timeline-card__fact-line">
                        ✦ {fact}
                      </p>
                    ))}
                  </div>
                )}
              </div>

              {/* CHIP NGUỒN:
                  Mốc nào suThat rỗng thì chỉ hiển thị chip "Đang bổ sung nguồn" */}
              <div className="timeline-card__footer">
                <div className="timeline-card__sources">
                  {isSuThatRong ? (
                    <button
                      type="button"
                      onClick={() => openGiuChuanVanHoa(m.ten)}
                      className="timeline-card__source-chip timeline-card__source-chip--pending"
                      title="Tư liệu đang được thẩm định"
                    >
                      <span aria-hidden="true">🏷️</span>
                      <span>{domdom.dongThoiGian.dangBoSungNguon}</span>
                    </button>
                  ) : (
                    m.nguonIds.map((ngId) => (
                      <button
                        key={ngId}
                        type="button"
                        onClick={() => openGiuChuanVanHoa(m.ten)}
                        className="timeline-card__source-chip"
                      >
                        <span aria-hidden="true">🏛️</span>
                        <span>{ngId}</span>
                      </button>
                    ))
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => openGiuChuanVanHoa(m.ten)}
                  className="timeline-card__giu-chuan-link"
                >
                  Giữ chuẩn →
                </button>
              </div>
            </article>
          );
        })}

        {/* THẺ KẾT THÚC: BÂY GIỜ ĐẾN LƯỢT BẠN */}
        <section className="timeline-card timeline-card--final">
          <div className="timeline-card__final-icon" aria-hidden="true">
            ✨
          </div>
          <div className="timeline-card__period-badge" style={{ alignSelf: "center", marginBottom: "8px" }}>
            {domdom.dongThoiGian.khungDenLuotBan}
          </div>
          <h2 className="timeline-card__final-title">
            {domdom.dongThoiGian.khungDenLuotBan}
          </h2>
          <blockquote className="timeline-card__final-quote" style={{ fontSize: "1.05rem", fontStyle: "normal", fontWeight: 500 }}>
            &ldquo;{domdom.dongThoiGian.cauDanDenLuotBan}&rdquo;
          </blockquote>
          <p className="timeline-card__final-desc">
            Từ nếp áo ngũ thân kín đáo, qua ngòi bút cách tân Lemur, vẻ nền nã của Lê Phổ,
            đường xẻ raglan phóng khoáng đến tà áo cách tân và trào lưu Việt phục đương đại — mỗi thời đại
            đều gửi gắm vào tà áo tình yêu và hơi thở của chính thế hệ mình.
          </p>
          <div className="timeline-card__final-actions" style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%", maxWidth: "340px", margin: "16px auto 0" }}>
            <button
              type="button"
              onClick={() => {
                if (onRemixInS4) {
                  onRemixInS4("aodai");
                } else {
                  onBack();
                }
              }}
              className="timeline-card__final-btn"
              style={{
                background: "var(--vang-nghe)",
                color: "var(--nen-toi)",
                fontWeight: 700,
                boxShadow: "0 4px 14px rgba(217, 164, 65, 0.4)",
              }}
            >
              ✦ {domdom.dongThoiGian.nutThuRemix}
            </button>
            <button
              type="button"
              onClick={onBack}
              style={{
                background: "transparent",
                border: "1px solid rgba(234, 224, 204, 0.3)",
                color: "var(--nen-sang)",
                padding: "8px 16px",
                borderRadius: "var(--vien-lech-a)",
                fontFamily: "var(--font-than)",
                fontSize: "0.85rem",
                cursor: "pointer",
              }}
            >
              ← Quay lại
            </button>
          </div>
        </section>
      </div>

      {/* NÚT ĐIỀU HƯỚNG TRƯỚC / SAU CHO MÀN HÌNH LỚN */}
      <footer className="dong-thoi-gian__bottom-bar">
        <button
          type="button"
          onClick={() => scrollToMoc(Math.max(0, activeIndex - 1))}
          disabled={activeIndex === 0}
          className="dong-thoi-gian__arrow-btn"
        >
          ← Mốc trước
        </button>
        <span className="dong-thoi-gian__counter">
          {activeIndex < mocThoiGian.length
            ? `Mốc ${activeIndex + 1} / ${mocThoiGian.length}`
            : domdom.dongThoiGian.khungDenLuotBan}
        </span>
        <button
          type="button"
          onClick={() => scrollToMoc(Math.min(mocThoiGian.length, activeIndex + 1))}
          disabled={activeIndex >= mocThoiGian.length}
          className="dong-thoi-gian__arrow-btn"
        >
          Mốc kế tiếp →
        </button>
      </footer>
    </main>
  );
}

const css = `
.dong-thoi-gian {
  position: relative;
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  background: transparent;
  color: var(--chu-chinh, #0f172a);
  font-family: var(--font-than, sans-serif);
  overflow-x: hidden;
}

.dong-thoi-gian__noise {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,${noise}");
  opacity: 0.05;
  pointer-events: none;
  z-index: 1;
}

.dong-thoi-gian__header {
  position: relative;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: var(--nen-the, #ffffff);
  border-bottom: 1px solid var(--vien-the, rgba(217, 164, 65, 0.25));
  gap: 12px;
  flex-wrap: wrap;
}

.dong-thoi-gian__brand-tag {
  display: inline-block;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--vang-chinh, #ca8a04);
  margin-bottom: 2px;
}

.dong-thoi-gian__title {
  font-family: var(--font-tieu-de, serif);
  font-size: 1.35rem;
  margin: 0;
  color: var(--chu-chinh, #0f172a);
}

.dong-thoi-gian__sub {
  font-size: 0.82rem;
  color: var(--chu-mo, #64748b);
  margin: 2px 0 0;
}

.dong-thoi-gian__back-btn {
  padding: 8px 16px;
  background: var(--nen-the-phu, #f7faf5);
  border: 1px solid var(--vien-the, rgba(202, 138, 4, 0.4));
  color: var(--chu-chinh, #0f172a);
  border-radius: var(--vien-lech-b, 3px 12px 4px 14px);
  font-size: 0.86rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.dong-thoi-gian__back-btn:hover {
  background: var(--vang-chinh, #ca8a04);
  color: #ffffff;
}

/* THANH TRACK NAVIGATION */
.dong-thoi-gian__nav {
  position: relative;
  z-index: 10;
  padding: 10px 16px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  background: var(--nen-the, #ffffff);
  border-bottom: 1px solid var(--vien-the, rgba(0, 0, 0, 0.08));
}

.dong-thoi-gian__nav-track {
  display: flex;
  gap: 8px;
  min-width: max-content;
  margin: 0 auto;
}

.dong-thoi-gian__step-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  background: var(--nen-the-phu, #f7faf5);
  border: 1px solid var(--vien-the, rgba(0, 0, 0, 0.12));
  border-radius: var(--vien-lech-b, 3px 12px 4px 14px);
  color: var(--chu-phu, #334155);
  font-size: 0.78rem;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.dong-thoi-gian__step-btn:hover {
  border-color: var(--vang-chinh, #ca8a04);
  color: var(--vang-chinh, #ca8a04);
}

.dong-thoi-gian__step-btn--active {
  background: rgba(202, 138, 4, 0.15);
  border-color: var(--vang-chinh, #ca8a04);
  color: var(--vang-chinh, #ca8a04);
  font-weight: 600;
}

.dong-thoi-gian__step-num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: rgba(202, 138, 4, 0.2);
  color: var(--vang-chinh, #ca8a04);
  font-size: 0.7rem;
  font-weight: 700;
}

.dong-thoi-gian__step-btn--active .dong-thoi-gian__step-num {
  background: var(--vang-chinh, #ca8a04);
  color: #ffffff;
}

.dong-thoi-gian__hint {
  position: relative;
  z-index: 10;
  text-align: center;
  padding: 8px 16px 2px;
  font-size: 0.78rem;
  color: var(--chu-mo, #64748b);
}

/* KHỐI SLIDER CHÍNH CÓ SCROLL-SNAP */
.dong-thoi-gian__slider {
  position: relative;
  z-index: 10;
  flex: 1;
  display: flex;
  gap: 18px;
  padding: 16px 20px 24px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scroll-padding: 0 20px;
}

.timeline-card {
  flex: 0 0 min(86vw, 380px);
  scroll-snap-align: center;
  background: var(--nen-the, #ffffff);
  border: 1px solid var(--vien-the, rgba(202, 138, 4, 0.25));
  box-shadow: var(--shadow-the, 0 4px 20px rgba(0, 0, 0, 0.06));
  padding: 18px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  word-break: break-word;
  overflow-wrap: break-word;
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.timeline-card--a {
  border-radius: var(--vien-lech-a, 4px 18px 6px 20px);
}

.timeline-card--b {
  border-radius: var(--vien-lech-b, 3px 12px 4px 14px);
}

.timeline-card__badge-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.timeline-card__period-badge {
  display: inline-block;
  padding: 3px 10px;
  background: rgba(202, 138, 4, 0.12);
  border: 1px solid var(--vang-chinh, #ca8a04);
  color: var(--vang-chinh, #ca8a04);
  border-radius: var(--vien-lech-b, 3px 12px 4px 14px);
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.timeline-card__step-indicator {
  font-size: 0.75rem;
  color: var(--chu-mo, #64748b);
}

.timeline-card__title {
  font-family: var(--font-tieu-de, serif);
  font-size: 1.15rem;
  margin: 0 0 10px;
  color: var(--chu-chinh, #0f172a);
  line-height: 1.35;
}

.timeline-card__svg-container {
  width: 100%;
  height: 220px;
  background: var(--nen-the-phu, #f7faf5);
  border: 1px solid var(--vien-the, rgba(0, 0, 0, 0.08));
  border-radius: var(--vien-lech-b, 3px 12px 4px 14px);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  overflow: hidden;
}

.timeline-card__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 14px;
}

.timeline-card__change-text {
  font-size: 0.88rem;
  line-height: 1.55;
  color: var(--chu-chinh, #0f172a);
  margin: 0;
}

.timeline-card__facts {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-top: 6px;
  border-top: 1px dashed var(--vien-the, rgba(0, 0, 0, 0.1));
}

.timeline-card__fact-line {
  font-size: 0.82rem;
  color: var(--chu-mo, #64748b);
  line-height: 1.45;
  margin: 0;
}

.timeline-card__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
  border-top: 1px solid var(--vien-the, rgba(0, 0, 0, 0.08));
  gap: 8px;
  flex-wrap: wrap;
}

.timeline-card__sources {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.timeline-card__source-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  background: var(--nen-the-phu, #f7faf5);
  border: 1px solid var(--vien-the, rgba(0, 0, 0, 0.12));
  border-radius: var(--vien-lech-b, 3px 12px 4px 14px);
  color: var(--chu-phu, #334155);
  font-size: 0.74rem;
  cursor: pointer;
  transition: all 0.15s ease;
}

.timeline-card__source-chip:hover {
  border-color: var(--vang-chinh, #ca8a04);
  color: var(--vang-chinh, #ca8a04);
}

.timeline-card__source-chip--pending {
  border-color: rgba(202, 138, 4, 0.45);
  color: var(--vang-chinh, #ca8a04);
  background: rgba(202, 138, 4, 0.1);
}

.timeline-card__giu-chuan-link {
  background: none;
  border: none;
  color: var(--vang-chinh, #ca8a04);
  font-size: 0.78rem;
  cursor: pointer;
  text-decoration: underline;
  padding: 0;
  font-weight: 600;
}

/* THẺ CUỐI - THÔNG ĐIỆP REMIX */
.timeline-card--final {
  background: var(--nen-the, #ffffff);
  border: 2px solid var(--vang-chinh, #ca8a04);
  box-shadow: 0 8px 30px rgba(202, 138, 4, 0.15);
  align-items: center;
  text-align: center;
  justify-content: center;
  gap: 12px;
  padding: 28px 22px;
}

.timeline-card__final-icon {
  font-size: 2.2rem;
}

.timeline-card__final-title {
  font-family: var(--font-tieu-de, serif);
  font-size: 1.3rem;
  color: var(--vang-chinh, #ca8a04);
  margin: 0;
}

.timeline-card__final-quote {
  font-family: var(--font-tieu-de, serif);
  font-size: 1.15rem;
  font-style: italic;
  line-height: 1.5;
  color: var(--chu-chinh, #0f172a);
  margin: 6px 0;
  padding: 0 10px;
}

.timeline-card__final-desc {
  font-size: 0.85rem;
  line-height: 1.6;
  color: var(--chu-mo, #64748b);
  margin: 0;
}

.timeline-card__final-btn {
  margin-top: 10px;
  padding: 10px 22px;
  background: var(--vang-chinh, #ca8a04);
  color: #ffffff;
  border: 1px solid var(--vang-chinh, #ca8a04);
  border-radius: var(--vien-lech-b, 3px 12px 4px 14px);
  font-size: 0.92rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(202, 138, 4, 0.25);
  transition: all 0.2s ease;
}

.timeline-card__final-btn:hover {
  background: #b47803;
  transform: translateY(-1px);
}

/* THANH ĐIỀU HƯỚNG DƯỚI */
.dong-thoi-gian__bottom-bar {
  position: relative;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background: var(--nen-the, #ffffff);
  border-top: 1px solid var(--vien-the, rgba(0, 0, 0, 0.08));
  box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.05);
}

.dong-thoi-gian__arrow-btn {
  padding: 6px 14px;
  background: var(--nen-the-phu, #f7faf5);
  border: 1px solid var(--vien-the, rgba(202, 138, 4, 0.3));
  border-radius: var(--vien-lech-b, 3px 12px 4px 14px);
  color: var(--chu-chinh, #0f172a);
  font-size: 0.82rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
}

.dong-thoi-gian__arrow-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.dong-thoi-gian__arrow-btn:not(:disabled):hover {
  border-color: var(--vang-chinh, #ca8a04);
  color: var(--vang-chinh, #ca8a04);
}

.dong-thoi-gian__counter {
  font-size: 0.8rem;
  color: var(--chu-chinh, #0f172a);
  font-weight: 600;
}
`;
