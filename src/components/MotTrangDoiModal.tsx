/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from "react";
import { TrangPhuc } from "../types";
import { trangPhuc } from "../data/trangphuc";
import { nhom } from "../data/nhom";
import { nguon } from "../data/nguon";
import { domdom } from "../copy/coem";
import { callGemini } from "../lib/gemini";
import { openGiuChuanVanHoa } from "../lib/giuChuan";

interface Props {
  trangPhucId: string;
  isOpen: boolean;
  onClose: () => void;
}

interface GopYEntry {
  id: string;
  trangPhucId: string;
  tenTrangPhuc: string;
  noiDung: string;
  thoiGian: string;
}

const STORAGE_GOP_Y_KEY = "vpr:gop_y";

const noise = encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .95  0 0 0 0 .92  0 0 0 0 .85  0 0 0 .55 0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`
);

export default function MotTrangDoiModal({ trangPhucId, isOpen, onClose }: Props) {
  const item: TrangPhuc = useMemo(() => {
    return trangPhuc.find((t) => t.id === trangPhucId) ?? trangPhuc[0];
  }, [trangPhucId]);

  // Nhóm văn hóa
  const nhomNames = useMemo(() => {
    return item.nhomIds
      .map((id) => nhom.find((n) => n.id === id)?.ten ?? id)
      .join(", ");
  }, [item]);

  // Danh sách nguồn
  const nguonItems = useMemo(() => {
    return item.nguonIds.map((id) => {
      if (id === "can_bo_sung") {
        return { id, ten: domdom.motTrangDoi.dangBoSungNguon, url: undefined };
      }
      const found = nguon.find((n) => n.id === id);
      return found ?? { id, ten: id, url: undefined };
    });
  }, [item]);

  // Trạng thái câu chuyện chiêm nghiệm từ Gemini
  const [storyParagraph, setStoryParagraph] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [showRawFacts, setShowRawFacts] = useState<boolean>(false);

  // Trạng thái báo sai / góp ý
  const [showGopY, setShowGopY] = useState<boolean>(false);
  const [gopYText, setGopYText] = useState<string>("");
  const [gopYSuccess, setGopYSuccess] = useState<boolean>(false);

  // Reset và gọi Gemini khi mở modal hoặc đổi trang phục
  useEffect(() => {
    if (!isOpen) {
      setShowGopY(false);
      setGopYText("");
      setGopYSuccess(false);
      return;
    }

    let isMounted = true;
    setStoryParagraph(null);
    setIsGenerating(true);
    setShowRawFacts(false);

    // Chuẩn bị context chỉ gồm suThat + moTaNgan + dip của món đồ
    const dipNames = item.dip
      .map((d) => (domdom.s2.tenDip as Record<string, string>)[d] || d)
      .join(", ");

    const contextParts = [
      `Tên trang phục: ${item.ten}`,
      `Mô tả ngắn: ${item.moTaNgan}`,
      `Dịp mặc: ${dipNames}`,
      item.suThat && item.suThat.length > 0
        ? `Ghi chép về trang phục:\n${item.suThat.map((s) => `- ${s}`).join("\n")}`
        : "",
    ]
      .filter(Boolean)
      .join("\n\n");

    const requestGemini = async () => {
      try {
        const result = await callGemini({
          vaiTro:
            'Bạn viết một "trang sách" 2–3 câu bằng tiếng Việt, giọng trầm, ấm, nhìn vào một tấm áo.',
          context: contextParts,
          quyTac: [
            "chỉ dùng CONTEXT; không thêm tên người, năm, địa danh, con số không có trong CONTEXT; CONTEXT ít thì viết ngắn hơn, không bịa.",
          ],
          cauHoi: "Viết 2–3 câu cho trang sách nhìn vào tấm áo này.",
          schema: {
            type: "object",
            properties: {
              doan: { type: "string" },
            },
            required: ["doan"],
          },
          nhietDo: 0.3,
          callerKey: "mot_trang_doi",
        });

        if (!isMounted) return;

        if (
          result.ok &&
          result.data &&
          typeof result.data === "object" &&
          "doan" in result.data &&
          typeof (result.data as { doan: unknown }).doan === "string"
        ) {
          const text = (result.data as { doan: string }).doan.trim();
          if (text) {
            setStoryParagraph(text);
          }
        }
      } catch {
        // Giữ nguyên bản dự phòng, không hiển thị lỗi thô
      } finally {
        if (isMounted) {
          setIsGenerating(false);
        }
      }
    };

    requestGemini();

    return () => {
      isMounted = false;
    };
  }, [isOpen, item]);

  // Xử lý gửi góp ý vào localStorage
  const handleGuiGopY = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = gopYText.trim();
    if (!trimmed) return;

    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const existingRaw = window.localStorage.getItem(STORAGE_GOP_Y_KEY);
        const existing: GopYEntry[] = existingRaw ? JSON.parse(existingRaw) : [];

        const newEntry: GopYEntry = {
          id: `gopy_${Date.now()}`,
          trangPhucId: item.id,
          tenTrangPhuc: item.ten,
          noiDung: trimmed,
          thoiGian: new Date().toLocaleString("vi-VN"),
        };

        existing.unshift(newEntry);
        window.localStorage.setItem(STORAGE_GOP_Y_KEY, JSON.stringify(existing));
      }
      setGopYSuccess(true);
      setGopYText("");
      setTimeout(() => {
        setGopYSuccess(false);
        setShowGopY(false);
      }, 2500);
    } catch {
      // Bỏ qua lỗi lưu nếu localStorage bị chặn
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="mtd-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Một Trang Đời — ${item.ten}`}
    >
      <style>{css}</style>
      <div className="mtd-container" onClick={(e) => e.stopPropagation()}>
        {/* Lớp nền giấy dó hữu cơ */}
        <div className="mtd-book-noise" aria-hidden="true" />
        {/* Nếp gáy sách cổ ở mép trái */}
        <div className="mtd-book-spine" aria-hidden="true" />

        {/* Đầu trang sách */}
        <header className="mtd-header">
          <div className="mtd-meta-sub">
            <span className="mtd-badge-brand">{domdom.motTrangDoi.tieuDe}</span>
            <span className="mtd-dot">•</span>
            <span className="mtd-nhom">{nhomNames}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="mtd-close-btn"
            aria-label={domdom.motTrangDoi.dongTrangSach}
            title="Đóng trang sách"
          >
            ✕ <span>{domdom.motTrangDoi.dongTrangSach || "Đóng"}</span>
          </button>
        </header>

        {/* Tiêu đề trang phục */}
        <h1 className="mtd-title">{item.ten}</h1>

        {/* Nội dung câu chuyện: Thay thế mượt giữa bản dự phòng và lời chiêm nghiệm */}
        <div className="mtd-story-flow">
          {storyParagraph ? (
            <div className="mtd-story-paragraph mtd-fade-in">
              <p className="mtd-gemini-text">{storyParagraph}</p>
            </div>
          ) : (
            <div className="mtd-fallback-box mtd-fade-in">
              <p className="mtd-fallback-lead">{item.moTaNgan}</p>
              {item.suThat && item.suThat.length > 0 && (
                <ul className="mtd-facts-list">
                  {item.suThat.map((fact, idx) => (
                    <li key={idx} className="mtd-fact-item">
                      <span className="mtd-bullet">✦</span>
                      <span>{fact}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Đang lắng nghe nếp áo (khi gọi Gemini ngầm) */}
          {isGenerating && (
            <div className="mtd-generating-hint">
              <span className="mtd-firefly">●</span>
              <span>{domdom.motTrangDoi.dangLangNghe}</span>
            </div>
          )}

          {/* Khi đã có lời chiêm nghiệm, cho phép mở rộng xem lại ghi chép gốc nếu muốn */}
          {storyParagraph && (
            <div className="mtd-raw-toggle-wrap">
              <button
                type="button"
                onClick={() => setShowRawFacts(!showRawFacts)}
                className="mtd-raw-toggle-btn"
              >
                {showRawFacts ? domdom.motTrangDoi.thuGonGhiChep : domdom.motTrangDoi.xemThemGhiChep}
              </button>

              {showRawFacts && (
                <div className="mtd-raw-facts-expand mtd-fade-in">
                  <p className="mtd-fallback-lead-small">{item.moTaNgan}</p>
                  <ul className="mtd-facts-list">
                    {item.suThat.map((fact, idx) => (
                      <li key={idx} className="mtd-fact-item">
                        <span className="mtd-bullet">✦</span>
                        <span>{fact}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Dịp mặc phù hợp */}
        <div className="mtd-dip-section">
          <span className="mtd-section-label">{domdom.s2.dipPhuHop}</span>
          <div className="mtd-dip-chips">
            {item.dip.map((d) => (
              <span key={d} className="mtd-dip-chip">
                {(domdom.s2.tenDip as Record<string, string>)[d] || d}
              </span>
            ))}
          </div>
        </div>

        {/* Dưới thẻ luôn có chip nguồn (từ nguonIds) */}
        <div className="mtd-sources-section">
          <div className="mtd-sources-header">
            <span className="mtd-section-label">{domdom.motTrangDoi.nguonKhaoCuu}:</span>
            <button
              type="button"
              onClick={() => openGiuChuanVanHoa(item.ten)}
              className="mtd-giu-chuan-badge"
              title="Đọc nguyên tắc Giữ chuẩn văn hóa"
            >
              🛡️ {domdom.giuChuanVanHoa.tieuDe}
            </button>
          </div>
          <div className="mtd-source-chips">
            {nguonItems.map((ng, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => openGiuChuanVanHoa(item.ten)}
                className={`mtd-source-chip ${
                  ng.id === "can_bo_sung" ? "mtd-source-chip--pending" : ""
                }`}
                title="Mở xem nguyên tắc Giữ chuẩn văn hóa"
              >
                <span>{ng.ten}</span>
                {ng.url && (
                  <a
                    href={ng.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mtd-source-link"
                    title="Mở tài liệu nguồn"
                    onClick={(e) => e.stopPropagation()}
                  >
                    ↗
                  </a>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Khu vực Góp ý / Báo sai lưu vào localStorage & Giữ chuẩn văn hóa */}
        <footer className="mtd-footer">
          <div className="mtd-footer-actions">
            {!showGopY ? (
              <button
                type="button"
                onClick={() => setShowGopY(true)}
                className="mtd-gopy-trigger-btn"
              >
                ✎ {domdom.motTrangDoi.baoGopY}
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => openGiuChuanVanHoa(item.ten)}
              className="mtd-giu-chuan-footer-btn"
            >
              🛡️ {domdom.giuChuanVanHoa.nutMoTrang}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mtd-close-footer-btn"
              title="Đóng trang sách"
            >
              ✕ {domdom.motTrangDoi.dongTrangSach || "Đóng trang sách"}
            </button>
          </div>

          {showGopY && (
            <form onSubmit={handleGuiGopY} className="mtd-gopy-form mtd-fade-in">
              <label htmlFor="mtd-gopy-input" className="mtd-gopy-label">
                {domdom.motTrangDoi.baoGopY}:
              </label>
              <textarea
                id="mtd-gopy-input"
                rows={2}
                value={gopYText}
                onChange={(e) => setGopYText(e.target.value)}
                placeholder={domdom.motTrangDoi.placeholderGopY}
                className="mtd-gopy-textarea"
                autoFocus
              />
              <div className="mtd-gopy-actions">
                <button
                  type="button"
                  onClick={() => setShowGopY(false)}
                  className="mtd-gopy-btn mtd-gopy-btn--cancel"
                >
                  {domdom.motTrangDoi.dongGopY}
                </button>
                <button
                  type="submit"
                  disabled={!gopYText.trim()}
                  className="mtd-gopy-btn mtd-gopy-btn--submit"
                >
                  {domdom.motTrangDoi.guiGopY}
                </button>
              </div>
            </form>
          )}

          {gopYSuccess && (
            <div className="mtd-gopy-success mtd-fade-in" role="status">
              ✓ {domdom.motTrangDoi.camOnGopY}
            </div>
          )}
        </footer>
      </div>
    </div>
  );
}

const css = `
.mtd-backdrop {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgba(15, 23, 26, 0.78);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  animation: mtdFadeIn 220ms ease;
}

@keyframes mtdFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes mtdBookFlip {
  0% {
    opacity: 0;
    transform: perspective(1200px) rotateY(-18deg) scale(0.96);
  }
  100% {
    opacity: 1;
    transform: perspective(1200px) rotateY(0deg) scale(1);
  }
}

.mtd-container {
  position: relative;
  width: 100%;
  max-width: 38rem;
  max-height: 90vh;
  max-height: 90dvh;
  overflow-y: auto;
  box-sizing: border-box;
  padding: 30px 28px 26px 34px;
  background: var(--nen-the, #FFFFFF);
  color: var(--chu-chinh, #0F172A);
  border: 1px solid var(--vien-the, #DCFCE7);
  border-radius: var(--vien-lech-a);
  box-shadow: var(--shadow-dock, 0 16px 40px rgba(0, 0, 0, 0.38));
  transform-origin: left center;
  animation: mtdBookFlip 340ms cubic-bezier(0.16, 1, 0.3, 1);
  font-family: var(--font-than);
}

.mtd-book-noise {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,${noise}");
  opacity: .08;
  pointer-events: none;
}

/* Nếp gáy sách ở mép trái */
.mtd-book-spine {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 14px;
  background: linear-gradient(to right, rgba(0,0,0,0.12), rgba(0,0,0,0.02) 60%, transparent);
  pointer-events: none;
  border-top-left-radius: var(--vien-lech-a);
  border-bottom-left-radius: var(--vien-lech-a);
}

.mtd-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
  gap: 12px;
}

.mtd-meta-sub {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.82rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--chu-mo, #64748B);
  flex-wrap: wrap;
}

.mtd-badge-brand {
  font-family: var(--font-than);
  font-weight: 700;
  color: var(--vang-chinh, #CA8A04);
}

.mtd-dot {
  color: var(--chu-mo, #64748B);
  opacity: 0.6;
}

.mtd-nhom {
  color: var(--chu-phu, #334155);
  font-weight: 600;
}

.mtd-close-btn {
  min-height: 34px;
  padding: 5px 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  background: var(--nen-the-phu, #F7FAF5);
  border: 1px solid var(--vien-the, #DCFCE7);
  border-radius: 9999px;
  color: var(--chu-chinh, #0F172A);
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  transition: all var(--nhip-cham) ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  flex-shrink: 0;
}

.mtd-close-btn:hover {
  background: #FEE2E2;
  border-color: #FCA5A5;
  color: #B91C1C;
  transform: translateY(-1px);
}

.mtd-title {
  font-family: var(--font-than);
  font-size: 1.75rem;
  font-weight: 700;
  line-height: 1.25;
  color: var(--chu-chinh, #0F172A);
  margin: 0 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 1px dashed var(--vien-the, rgba(138, 129, 117, 0.45));
}

.mtd-story-flow {
  position: relative;
  min-height: 90px;
  margin-bottom: 20px;
}

.mtd-fade-in {
  animation: mtdFadeIn 320ms ease;
}

.mtd-story-paragraph {
  background: rgba(202, 138, 4, 0.1);
  border-left: 3.5px solid var(--vang-chinh, #CA8A04);
  padding: 14px 18px;
  border-radius: 6px;
}

.mtd-gemini-text {
  font-size: 1.02rem;
  line-height: 1.7;
  color: var(--chu-chinh, #0F172A);
  font-family: var(--font-than);
  margin: 0;
  font-style: italic;
}

.mtd-fallback-box {
  background: var(--nen-the-phu, #F7FAF5);
  border: 1px solid var(--vien-the, #DCFCE7);
  padding: 14px 16px;
  border-radius: 6px;
}

.mtd-fallback-lead {
  font-size: 1rem;
  line-height: 1.6;
  color: var(--chu-chinh, #0F172A);
  margin: 0 0 12px 0;
  font-weight: 600;
}

.mtd-fallback-lead-small {
  font-size: 0.94rem;
  line-height: 1.5;
  color: var(--chu-phu, #334155);
  margin: 0 0 8px 0;
}

.mtd-facts-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mtd-fact-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 0.94rem;
  line-height: 1.55;
  color: var(--chu-phu, #334155);
}

.mtd-bullet {
  color: var(--vang-chinh, #CA8A04);
  font-size: 0.8rem;
  margin-top: 3px;
  flex-shrink: 0;
}

.mtd-generating-hint {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
  font-size: 0.84rem;
  color: var(--chu-mo, #64748B);
  font-style: italic;
}

.mtd-firefly {
  color: var(--vang-chinh, #CA8A04);
  font-size: 0.75rem;
  animation: mtdPulse 1.2s infinite ease-in-out;
}

@keyframes mtdPulse {
  0%, 100% { opacity: 0.3; transform: scale(0.9); }
  50% { opacity: 1; transform: scale(1.2); }
}

.mtd-raw-toggle-wrap {
  margin-top: 12px;
}

.mtd-raw-toggle-btn {
  background: none;
  border: none;
  padding: 4px 0;
  font-size: 0.82rem;
  color: var(--chu-mo, #64748B);
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.mtd-raw-toggle-btn:hover {
  color: var(--chu-chinh, #0F172A);
}

.mtd-raw-facts-expand {
  margin-top: 10px;
  padding: 12px 14px;
  background: var(--nen-the-phu, #F7FAF5);
  border: 1px solid var(--vien-the, #DCFCE7);
  border-radius: 6px;
}

.mtd-dip-section, .mtd-sources-section {
  margin-bottom: 16px;
}

.mtd-sources-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.mtd-giu-chuan-badge {
  background: rgba(202, 138, 4, 0.1);
  border: 1px solid rgba(202, 138, 4, 0.35);
  color: var(--vang-chinh, #CA8A04);
  padding: 3px 8px;
  border-radius: var(--vien-lech-b);
  font-size: 0.78rem;
  font-family: var(--font-than);
  cursor: pointer;
  transition: all var(--nhip-cham) ease;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.mtd-giu-chuan-badge:hover {
  background: var(--vang-chinh, #CA8A04);
  color: #fff;
}

.mtd-section-label {
  display: block;
  font-size: 0.8rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--chu-mo, #64748B);
  font-weight: 600;
}

.mtd-dip-chips, .mtd-source-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.mtd-dip-chip {
  display: inline-block;
  padding: 4px 10px;
  background: var(--vang-nhe, #FEF9C3);
  color: var(--vang-chinh, #CA8A04);
  border: 1px solid var(--vang-sang, #FDE047);
  border-radius: var(--vien-lech-b);
  font-size: 0.84rem;
  font-weight: 600;
}

.mtd-source-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  background: var(--nen-the-phu, #F7FAF5);
  color: var(--chu-phu, #334155);
  border: 1px solid var(--vien-the, #DCFCE7);
  border-radius: var(--vien-lech-b);
  font-size: 0.84rem;
  font-family: var(--font-than);
  cursor: pointer;
  transition: all var(--nhip-nhanh) ease;
}

.mtd-source-chip:hover {
  border-color: var(--vang-chinh, #CA8A04);
  background: rgba(202, 138, 4, 0.08);
}

.mtd-source-chip--pending {
  background: rgba(220, 38, 38, 0.06);
  border-color: rgba(220, 38, 38, 0.25);
  color: #DC2626;
  font-style: italic;
}

.mtd-source-link {
  color: var(--vang-chinh, #CA8A04);
  text-decoration: none;
  font-weight: 600;
}

.mtd-source-link:hover {
  text-decoration: underline;
}

.mtd-footer {
  margin-top: 20px;
  padding-top: 14px;
  border-top: 1px solid var(--vien-the, rgba(138, 129, 117, 0.3));
}

.mtd-footer-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  margin-bottom: 10px;
}

.mtd-giu-chuan-footer-btn {
  background: var(--vang-nhe, #FEF9C3);
  border: 1px solid var(--vang-sang, #FDE047);
  padding: 8px 14px;
  border-radius: var(--vien-lech-a);
  font-size: 0.84rem;
  font-weight: 600;
  color: var(--vang-chinh, #CA8A04);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all var(--nhip-nhanh) ease;
}

.mtd-giu-chuan-footer-btn:hover {
  background: var(--vang-chinh, #CA8A04);
  color: #ffffff;
}

.mtd-close-footer-btn {
  background: var(--nen-the-phu, #F7FAF5);
  border: 1px solid var(--vien-the, #DCFCE7);
  padding: 8px 14px;
  border-radius: var(--vien-lech-a);
  font-size: 0.84rem;
  font-weight: 600;
  color: var(--chu-phu, #334155);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all var(--nhip-nhanh) ease;
  margin-left: auto;
}

.mtd-close-footer-btn:hover {
  background: #FEE2E2;
  border-color: #FCA5A5;
  color: #B91C1C;
}

.mtd-gopy-trigger-btn {
  background: none;
  border: 1px dashed var(--vien-the, rgba(68, 64, 60, 0.35));
  padding: 8px 14px;
  border-radius: var(--vien-lech-b);
  font-size: 0.84rem;
  color: var(--chu-phu, #334155);
  cursor: pointer;
  transition: all var(--nhip-nhanh) ease;
}

.mtd-gopy-trigger-btn:hover {
  border-color: var(--vang-chinh, #CA8A04);
  color: var(--vang-chinh, #CA8A04);
  background: rgba(202, 138, 4, 0.05);
}

.mtd-gopy-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mtd-gopy-label {
  font-size: 0.84rem;
  font-weight: 600;
  color: var(--chu-chinh, #0F172A);
}

.mtd-gopy-textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 8px 12px;
  font-family: var(--font-than);
  font-size: 0.88rem;
  background: var(--nen-the-phu, #F7FAF5);
  color: var(--chu-chinh, #0F172A);
  border: 1px solid var(--vien-the, #DCFCE7);
  border-radius: var(--vien-lech-b);
  resize: vertical;
}

.mtd-gopy-textarea:focus {
  outline: none;
  border-color: var(--vang-chinh, #CA8A04);
}

.mtd-gopy-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.mtd-gopy-btn {
  min-height: 38px;
  padding: 6px 14px;
  font-size: 0.84rem;
  border-radius: var(--vien-lech-b);
  cursor: pointer;
  transition: all var(--nhip-nhanh) ease;
}

.mtd-gopy-btn--cancel {
  background: none;
  border: 1px solid var(--vien-the, rgba(68, 64, 60, 0.25));
  color: var(--chu-mo, #64748B);
}

.mtd-gopy-btn--cancel:hover {
  background: rgba(0, 0, 0, 0.05);
  color: var(--chu-chinh, #0F172A);
}

.mtd-gopy-btn--submit {
  background: var(--vang-chinh, #CA8A04);
  border: 1px solid var(--vang-chinh, #CA8A04);
  color: #ffffff;
  font-weight: 600;
}

.mtd-gopy-btn--submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.mtd-gopy-btn--submit:not(:disabled):hover {
  filter: brightness(1.1);
}

.mtd-gopy-success {
  margin-top: 10px;
  padding: 8px 12px;
  background: rgba(34, 197, 94, 0.12);
  border: 1px solid rgba(34, 197, 94, 0.35);
  color: var(--xanh-chinh, #15803D);
  border-radius: var(--vien-lech-b);
  font-size: 0.86rem;
  font-weight: 600;
}
`;
