/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { domdom } from "../copy/domdom";
import { nhom } from "../data/nhom";
import { useSkySettings } from "../lib/caiDatSky";

interface Props {
  onClose: () => void;
  sourceCostumeName?: string;
}

const noise = encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .95  0 0 0 0 .92  0 0 0 0 .85  0 0 0 .55 0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`
);

export default function GiuChuanVanHoaScreen({ onClose, sourceCostumeName }: Props) {
  const [showGopY, setShowGopY] = useState(false);
  const [gopYText, setGopYText] = useState("");
  const [gopYSuccess, setGopYSuccess] = useState(false);
  const [skySettings, updateSkySettings] = useSkySettings();

  const handleSendGopY = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gopYText.trim()) return;

    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const stored = window.localStorage.getItem("vpr:gop_y");
        const list = stored ? JSON.parse(stored) : [];
        list.push({
          id: `gopy-${Date.now()}`,
          trangPhucId: sourceCostumeName ? `from-${sourceCostumeName}` : "chung",
          tenTrangPhuc: sourceCostumeName || "Nguyên tắc Giữ chuẩn văn hóa",
          noiDung: gopYText.trim(),
          thoiGian: new Date().toLocaleString("vi-VN"),
        });
        window.localStorage.setItem("vpr:gop_y", JSON.stringify(list));
      }
      setGopYSuccess(true);
      setGopYText("");
      setTimeout(() => {
        setGopYSuccess(false);
        setShowGopY(false);
      }, 2500);
    } catch {
      // Bỏ qua nếu lỗi
    }
  };

  const sections = [
    {
      stt: "1",
      tieuDe: domdom.giuChuanVanHoa.muc1.tieuDe,
      noiDung: domdom.giuChuanVanHoa.muc1.noiDung,
      icon: "📜",
    },
    {
      stt: "2",
      tieuDe: domdom.giuChuanVanHoa.muc2.tieuDe,
      noiDung: domdom.giuChuanVanHoa.muc2.noiDung,
      icon: "🔍",
    },
    {
      stt: "3",
      tieuDe: domdom.giuChuanVanHoa.muc3.tieuDe,
      noiDung: domdom.giuChuanVanHoa.muc3.noiDung,
      icon: "⚖️",
    },
    {
      stt: "4",
      tieuDe: domdom.giuChuanVanHoa.muc4.tieuDe,
      noiDung: domdom.giuChuanVanHoa.muc4.noiDung,
      icon: "✨",
    },
    {
      stt: "5",
      tieuDe: domdom.giuChuanVanHoa.muc5.tieuDe,
      noiDung: domdom.giuChuanVanHoa.muc5.noiDung,
      icon: "🌸",
    },
    {
      stt: "6",
      tieuDe: domdom.giuChuanVanHoa.muc6.tieuDe,
      noiDung: domdom.giuChuanVanHoa.muc6.noiDung,
      icon: "📝",
      coNutGopY: true,
    },
  ];

  return (
    <div
      className="gc-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="gc-heading"
    >
      <style>{css}</style>
      <div className="gc-backdrop" onClick={onClose} aria-hidden="true" />

      <div className="gc-container">
        <div className="gc-noise" aria-hidden="true" />

        {/* Thanh tiêu đề đỉnh trang */}
        <header className="gc-header">
          <div className="gc-brand">
            <span className="gc-brand__name">{domdom.giuChuanVanHoa.tieuDe}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="gc-close-btn"
            aria-label={domdom.giuChuanVanHoa.dong}
          >
            ✕ {domdom.giuChuanVanHoa.dong}
          </button>
        </header>

        <div className="gc-content">
          {/* Lời dẫn nhập */}
          <div className="gc-hero">
            {sourceCostumeName && (
              <div className="gc-from-tag">
                <span>Nguồn từ:</span>
                <strong>{sourceCostumeName}</strong>
              </div>
            )}
            <h1 id="gc-heading" className="gc-title">
              {domdom.giuChuanVanHoa.tieuDe}
            </h1>
            <p className="gc-subtitle">{domdom.giuChuanVanHoa.phuDe}</p>
            <blockquote className="gc-quote">
              <span className="gc-firefly">●</span>
              <span>"{domdom.giuChuanVanHoa.moTaChung}"</span>
            </blockquote>
          </div>

          {/* 6 mục quy chuẩn chính: rõ ràng, trầm và rõ, đọc tốt trên 360px */}
          <div className="gc-sections">
            {sections.map((sec, idx) => (
              <article
                key={sec.stt}
                className={`gc-card ${idx % 2 === 0 ? "gc-card--a" : "gc-card--b"}`}
              >
                <div className="gc-card__header">
                  <span className="gc-card__badge">{sec.stt}</span>
                  <h2 className="gc-card__title">
                    <span className="gc-card__icon" aria-hidden="true">{sec.icon}</span>
                    <span>{sec.tieuDe}</span>
                  </h2>
                </div>
                <p className="gc-card__body">{sec.noiDung}</p>

                {sec.coNutGopY && (
                  <div className="gc-card__action-wrap">
                    <button
                      type="button"
                      onClick={() => setShowGopY(!showGopY)}
                      className="gc-btn-gopy"
                    >
                      ✍️ {domdom.giuChuanVanHoa.nutBaoGopY}
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>

          {/* Biểu mẫu Báo sai / góp ý mở rộng */}
          {showGopY && (
            <div className="gc-gopy-panel">
              <h3 className="gc-gopy-title">
                Gửi phản hồi / Góp ý tư liệu
              </h3>
              <p className="gc-gopy-desc">
                Ý kiến của bạn sẽ được lưu vào thiết bị để nhóm nghiên cứu đối chiếu và hiệu đính.
              </p>
              {gopYSuccess ? (
                <div className="gc-gopy-success">
                  ✓ {domdom.motTrangDoi.camOnGopY}
                </div>
              ) : (
                <form onSubmit={handleSendGopY} className="gc-gopy-form">
                  <textarea
                    rows={3}
                    value={gopYText}
                    onChange={(e) => setGopYText(e.target.value)}
                    placeholder={domdom.motTrangDoi.placeholderGopY}
                    className="gc-gopy-input"
                    required
                  />
                  <div className="gc-gopy-actions">
                    <button
                      type="button"
                      onClick={() => setShowGopY(false)}
                      className="gc-gopy-cancel"
                    >
                      {domdom.motTrangDoi.dongGopY}
                    </button>
                    <button type="submit" className="gc-gopy-submit">
                      {domdom.motTrangDoi.guiGopY}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Đoạn đối chiếu 8 nhóm văn hóa & dòng lưu trữ thiết bị */}
          <div className="gc-note-box">
            <div className="gc-note-item">
              <span className="gc-note-bullet">✦</span>
              <div>
                <p className="gc-note-text">
                  {domdom.giuChuanVanHoa.doanNhom}
                </p>
                <div className="gc-group-chips">
                  {nhom.map((n) => (
                    <span key={n.id} className="gc-group-chip">
                      {n.ten}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="gc-note-item gc-note-item--secondary">
              <span className="gc-note-bullet">ⓘ</span>
              <p className="gc-note-text gc-note-text--dim">
                {domdom.giuChuanVanHoa.dongLuuTru}
              </p>
            </div>
          </div>

          {/* S17: Trợ năng & Tùy biến hiển thị */}
          <div
            className="p-4 border space-y-3 mt-4"
            style={{
              borderColor: "var(--tro-tram)",
              borderRadius: "var(--vien-lech-a)",
              background: "rgba(0,0,0,0.3)",
            }}
          >
            <h3
              className="text-sm font-semibold flex items-center gap-2"
              style={{ color: "var(--vang-nghe)", fontFamily: "var(--font-tieu-de)" }}
            >
              <span>⚙️</span>
              <span>{domdom.giuChuanVanHoa.troNangTieuDe}</span>
            </h3>

            <div className="space-y-2.5 text-xs">
              {/* Công tắc Giảm chuyển động */}
              <label className="flex items-center justify-between p-2.5 rounded bg-black/30 border border-stone-800 cursor-pointer hover:border-stone-700">
                <div className="pr-3">
                  <div className="font-medium text-stone-200">
                    {domdom.giuChuanVanHoa.giamChuyenDong}
                  </div>
                  <div className="text-[11px] text-stone-400">
                    Tắt hiệu ứng mưa rơi và chuyển động, chỉ giữ lại lớp phủ tĩnh.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={skySettings.giamChuyenDong}
                  onChange={(e) =>
                    updateSkySettings({ giamChuyenDong: e.target.checked })
                  }
                  className="w-4 h-4 accent-amber-500 cursor-pointer"
                />
              </label>

              {/* Công tắc Tắt bầu trời cho máy yếu */}
              <label className="flex items-center justify-between p-2.5 rounded bg-black/30 border border-stone-800 cursor-pointer hover:border-stone-700">
                <div className="pr-3">
                  <div className="font-medium text-stone-200">
                    {domdom.giuChuanVanHoa.tatBauTroi}
                  </div>
                  <div className="text-[11px] text-stone-400">
                    Ẩn hoàn toàn lớp nền bầu trời và đường chân trời để tiết kiệm tài nguyên máy.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={skySettings.tatBauTroi}
                  onChange={(e) =>
                    updateSkySettings({ tatBauTroi: e.target.checked })
                  }
                  className="w-4 h-4 accent-amber-500 cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Chân màn hình */}
          <footer className="gc-footer">
            <button
              type="button"
              onClick={onClose}
              className="gc-footer-close-btn"
            >
              ← {domdom.giuChuanVanHoa.dong}
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
}

const css = `
.gc-modal {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 16px 10px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.gc-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(14, 23, 26, 0.88);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}

.gc-container {
  position: relative;
  width: 100%;
  max-width: 680px;
  min-height: calc(100vh - 32px);
  margin: auto 0;
  background: var(--nen-toi);
  color: var(--nen-sang);
  border: 1px solid var(--tro-tram);
  border-radius: var(--vien-lech-a);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.gc-noise {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,${noise}");
  opacity: .10;
  pointer-events: none;
}

.gc-header {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 18px;
  background: rgba(27, 42, 46, 0.96);
  border-bottom: 1px solid rgba(138, 129, 117, 0.25);
  backdrop-filter: blur(4px);
}

.gc-brand {
  display: flex;
  flex-direction: column;
}

.gc-brand__name {
  font-family: var(--font-tieu-de);
  font-size: 1.15rem;
  color: var(--vang-nghe);
}

.gc-brand__sub {
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--tro-tram);
}

.gc-close-btn {
  min-height: 44px;
  min-width: 44px;
  padding: 8px 14px;
  background: rgba(138, 129, 117, 0.12);
  border: 1px solid var(--tro-tram);
  color: var(--nen-sang);
  border-radius: var(--vien-lech-b);
  font-family: var(--font-than);
  font-size: 0.85rem;
  cursor: pointer;
  transition: all var(--nhip-cham) ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.gc-close-btn:hover {
  border-color: var(--vang-nghe);
  color: var(--vang-nghe);
  background: rgba(217, 164, 65, 0.15);
}

.gc-content {
  position: relative;
  z-index: 5;
  padding: 20px 18px 28px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.gc-hero {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.gc-from-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  color: var(--tro-tram);
  background: rgba(138, 129, 117, 0.1);
  padding: 4px 10px;
  border-radius: var(--vien-lech-a);
  align-self: flex-start;
}

.gc-from-tag strong {
  color: var(--vang-nghe);
}

.gc-title {
  margin: 0;
  font-family: var(--font-tieu-de);
  font-size: clamp(1.45rem, 5.5vw, 1.9rem);
  color: var(--vang-nghe);
  line-height: 1.3;
}

.gc-subtitle {
  margin: 0;
  font-size: 0.92rem;
  color: var(--tro-tram);
  font-style: italic;
}

.gc-quote {
  margin: 8px 0 0 0;
  padding: 12px 14px;
  background: rgba(217, 164, 65, 0.08);
  border-left: 3px solid var(--vang-nghe);
  border-radius: var(--vien-lech-b);
  font-family: var(--font-tieu-de);
  font-style: italic;
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--nen-sang);
  display: flex;
  gap: 8px;
  align-items: flex-start;
}

.gc-firefly {
  color: var(--vang-nghe);
  font-size: 0.75rem;
  line-height: 1.8;
}

.gc-sections {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.gc-card {
  padding: 16px 16px 18px;
  background: rgba(27, 42, 46, 0.75);
  border: 1px solid rgba(138, 129, 117, 0.28);
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: border-color var(--nhip-cham) ease;
}

.gc-card--a {
  border-radius: var(--vien-lech-a);
}

.gc-card--b {
  border-radius: var(--vien-lech-b);
  border-left: 2px solid var(--dat-nung);
}

.gc-card:hover {
  border-color: rgba(217, 164, 65, 0.5);
}

.gc-card__header {
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.gc-card__badge {
  display: none;
}

.gc-card__title {
  margin: 0;
  font-family: var(--font-tieu-de);
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--vang-nghe);
  line-height: 1.45;
  display: flex;
  align-items: center;
  gap: 8px;
}

.gc-card__icon {
  font-size: 1.1rem;
}

.gc-card__body {
  margin: 0;
  font-size: 0.98rem;
  line-height: 1.68;
  color: #E6DFD1;
  word-break: break-word;
}

.gc-card__action-wrap {
  margin-top: 6px;
  padding-top: 8px;
  border-top: 1px dashed rgba(138, 129, 117, 0.25);
}

.gc-btn-gopy {
  min-height: 44px;
  padding: 8px 16px;
  background: rgba(181, 80, 47, 0.15);
  border: 1px solid var(--dat-nung);
  color: #F8B39B;
  border-radius: var(--vien-lech-a);
  font-size: 0.88rem;
  font-family: var(--font-than);
  cursor: pointer;
  transition: all var(--nhip-cham) ease;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.gc-btn-gopy:hover {
  background: var(--dat-nung);
  color: var(--nen-sang);
}

.gc-gopy-panel {
  padding: 16px;
  background: rgba(14, 23, 26, 0.92);
  border: 1px solid var(--dat-nung);
  border-radius: var(--vien-lech-b);
  display: flex;
  flex-direction: column;
  gap: 10px;
  animation: gcFadeIn 300ms ease;
}

.gc-gopy-title {
  margin: 0;
  font-family: var(--font-tieu-de);
  font-size: 1rem;
  color: var(--dat-nung);
}

.gc-gopy-desc {
  margin: 0;
  font-size: 0.84rem;
  color: var(--tro-tram);
  line-height: 1.5;
}

.gc-gopy-success {
  padding: 12px;
  background: rgba(92, 107, 79, 0.25);
  border: 1px solid var(--reu-phong);
  color: var(--nen-sang);
  border-radius: var(--vien-lech-a);
  font-size: 0.9rem;
}

.gc-gopy-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.gc-gopy-input {
  width: 100%;
  box-sizing: border-box;
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--tro-tram);
  border-radius: var(--vien-lech-a);
  color: var(--nen-sang);
  font-family: var(--font-than);
  font-size: 0.92rem;
  resize: vertical;
}

.gc-gopy-input:focus {
  outline: none;
  border-color: var(--vang-nghe);
}

.gc-gopy-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.gc-gopy-cancel {
  min-height: 44px;
  padding: 8px 14px;
  background: none;
  border: 1px solid var(--tro-tram);
  color: var(--tro-tram);
  border-radius: var(--vien-lech-b);
  cursor: pointer;
}

.gc-gopy-submit {
  min-height: 44px;
  padding: 8px 18px;
  background: var(--dat-nung);
  border: 1px solid var(--dat-nung);
  color: var(--nen-sang);
  border-radius: var(--vien-lech-a);
  font-weight: 500;
  cursor: pointer;
}

.gc-note-box {
  padding: 16px;
  background: rgba(138, 129, 117, 0.1);
  border: 1px solid rgba(138, 129, 117, 0.25);
  border-radius: var(--vien-lech-a);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.gc-note-item {
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

.gc-note-bullet {
  color: var(--vang-nghe);
  font-size: 0.9rem;
  line-height: 1.5;
}

.gc-note-text {
  margin: 0;
  font-size: 0.92rem;
  line-height: 1.6;
  color: var(--nen-sang);
}

.gc-note-text--dim {
  color: var(--tro-tram);
  font-style: italic;
  font-size: 0.85rem;
}

.gc-group-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
}

.gc-group-chip {
  padding: 3px 8px;
  background: rgba(217, 164, 65, 0.12);
  border: 1px solid rgba(217, 164, 65, 0.35);
  color: var(--vang-nghe);
  border-radius: var(--vien-lech-b);
  font-size: 0.78rem;
}

.gc-footer {
  margin-top: 8px;
  display: flex;
  justify-content: center;
}

.gc-footer-close-btn {
  width: 100%;
  min-height: 48px;
  padding: 12px 20px;
  background: rgba(217, 164, 65, 0.15);
  border: 1px solid var(--vang-nghe);
  color: var(--vang-nghe);
  border-radius: var(--vien-lech-a);
  font-family: var(--font-than);
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--nhip-cham) ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.gc-footer-close-btn:hover {
  background: var(--vang-nghe);
  color: var(--nen-toi);
}

@keyframes gcFadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Tối ưu hóa trên màn hình 360px */
@media (max-width: 400px) {
  .gc-modal {
    padding: 8px 4px;
  }
  .gc-container {
    border-radius: 0;
    min-height: 100vh;
  }
  .gc-header {
    padding: 10px 14px;
  }
  .gc-content {
    padding: 16px 12px 24px;
    gap: 16px;
  }
  .gc-card {
    padding: 14px 12px;
  }
  .gc-card__title {
    font-size: 0.98rem;
  }
  .gc-card__body {
    font-size: 0.92rem;
    line-height: 1.62;
  }
  .gc-title {
    font-size: 1.45rem;
  }
}
`;
