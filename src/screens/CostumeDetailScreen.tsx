/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { domdom } from "../copy/coem";
import { trangPhuc } from "../data/trangphuc";
import { nhom } from "../data/nhom";
import { nguon } from "../data/nguon";
import MotTrangDoiModal from "../components/MotTrangDoiModal";
import AppFooter from "../components/AppFooter";
import { openGiuChuanVanHoa } from "../lib/giuChuan";
import CostumeDetailPose from "../narrator/poses/CostumeDetailPose";

type Props = {
  trangPhucId: string;
  onBackToCostumes: () => void;
  onProceedToS4?: (trangPhucId: string) => void;
  onOpenDongThoiGian?: () => void;
};

const noise = encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .95  0 0 0 0 .92  0 0 0 0 .85  0 0 0 .55 0'/></filter><rect width='100%' filter='url(#n)'/></svg>`
);

export default function CostumeDetailScreen({
  trangPhucId,
  onBackToCostumes,
  onProceedToS4,
  onOpenDongThoiGian,
}: Props) {
  const [showMotTrangDoi, setShowMotTrangDoi] = useState(false);

  const item = trangPhuc.find((tp) => tp.id === trangPhucId) ?? trangPhuc[0];

  const nhomNames = item.nhomIds
    .map((id) => nhom.find((n) => n.id === id)?.ten ?? id)
    .join(", ");

  const nguonList = item.nguonIds
    .map((id) => nguon.find((ng) => ng.id === id))
    .filter(Boolean);

  return (
    <main className="costume-detail">
      <style>{css}</style>
      <div className="costume-detail__noise" aria-hidden="true" />

      {/* Đầu trang */}
      <header className="costume-detail__header">
        <div>
          <h1 className="costume-detail__brand-name">{domdom.s3.tieuDe}</h1>
        </div>
        <button
          type="button"
          onClick={onBackToCostumes}
          className="costume-detail__back-btn"
        >
          {domdom.s3.veS2}
        </button>
      </header>

      <div className="costume-detail__content">
        <div className="flex items-center gap-3 mb-2">
          <CostumeDetailPose size={68} animate={true} />
          <div>
            <p className="costume-detail__prompt m-0">{domdom.s3.moDau}</p>
            <h1 className="costume-detail__title m-0">{item.ten}</h1>
          </div>
        </div>

        <div className="costume-detail__badges">
          {item.baoTon && (
            <span className="costume-detail__badge-danger">
              {item.baoTon.muc || domdom.s2.nguyCap}
            </span>
          )}
          <span
            className={`costume-detail__badge-check ${
              item.daKiemChung
                ? "costume-detail__badge-check--verified"
                : "costume-detail__badge-check--pending"
            }`}
          >
            {item.daKiemChung
              ? domdom.s3.daKiemChung
              : domdom.s3.chuaKiemChung}
          </span>
          <button
            type="button"
            onClick={() => setShowMotTrangDoi(true)}
            className="costume-detail__story-badge-btn"
          >
            📖 {domdom.motTrangDoi.nutDocCauChuyen}
          </button>
          {item.id === "aodai" && onOpenDongThoiGian && (
            <button
              type="button"
              onClick={onOpenDongThoiGian}
              className="costume-detail__story-badge-btn"
              style={{
                borderColor: "var(--vang-nghe)",
                background: "rgba(217, 164, 65, 0.18)",
                color: "var(--vang-nghe)",
              }}
              title="Xem 6 mốc cách tân lịch sử của áo dài"
            >
              ⏳ {domdom.dongThoiGian.tieuDe}
            </button>
          )}
        </div>

        {/* Thông tin cốt lõi */}
        <section className="costume-detail__card costume-detail__card--a">
          <p className="costume-detail__desc">{item.moTaNgan}</p>

          <div className="costume-detail__info-grid">
            <div className="costume-detail__info-item">
              <span className="costume-detail__lbl">{domdom.s2.nhomVung}</span>
              <span className="costume-detail__val">{nhomNames}</span>
            </div>
            <div className="costume-detail__info-item">
              <span className="costume-detail__lbl">{domdom.s3.gioiTinh}</span>
              <span className="costume-detail__val">
                {item.gioiTinh === "nu"
                  ? domdom.s3.gioiTinhNu
                  : item.gioiTinh === "nam"
                  ? domdom.s3.gioiTinhNam
                  : domdom.s3.gioiTinhChung}
              </span>
            </div>
            <div className="costume-detail__info-item">
              <span className="costume-detail__lbl">{domdom.s3.mucRemix}</span>
              <span className="costume-detail__val">
                {item.mucRemix === "tu_do"
                  ? domdom.s3.remixTuDo
                  : item.mucRemix === "co_dieu_kien"
                  ? domdom.s3.remixCoDieuKien
                  : domdom.s3.remixGiuNguyen}
              </span>
            </div>
          </div>
        </section>

        {/* Kiến thức văn hóa đã ghi chép */}
        <section className="costume-detail__card costume-detail__card--b">
          <div className="costume-detail__card-header-flex">
            <h2 className="costume-detail__subheading">{domdom.s3.suThatVui}</h2>
            <button
              type="button"
              onClick={() => openGiuChuanVanHoa(item.ten)}
              className="costume-detail__giu-chuan-pill"
              title="Đọc nguyên tắc Giữ chuẩn văn hóa"
            >
              🛡️ {domdom.giuChuanVanHoa.tieuDe}
            </button>
          </div>
          <ul className="costume-detail__facts">
            {item.suThat.map((fact, i) => (
              <li key={i} className="costume-detail__fact-item">
                <span className="costume-detail__fact-bullet">●</span>
                <span>{fact}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Nguồn khảo cứu */}
        {nguonList.length > 0 && (
          <section className="costume-detail__card costume-detail__card--a">
            <div className="costume-detail__card-header-flex">
              <h2 className="costume-detail__subheading">{domdom.s3.nguonKhaoCuu}</h2>
              <button
                type="button"
                onClick={() => openGiuChuanVanHoa(item.ten)}
                className="costume-detail__giu-chuan-pill"
                title="Đọc nguyên tắc Giữ chuẩn văn hóa"
              >
                🛡️ {domdom.giuChuanVanHoa.tieuDe}
              </button>
            </div>
            <div className="costume-detail__sources">
              {nguonList.map((ng, i) => (
                <div
                  key={i}
                  className="costume-detail__source-item"
                  onClick={() => openGiuChuanVanHoa(item.ten)}
                  role="button"
                  tabIndex={0}
                  title="Mở xem nguyên tắc Giữ chuẩn văn hóa"
                >
                  <span>{ng?.ten}</span>
                  {ng?.url && (
                    <a
                      href={ng.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="costume-detail__source-link"
                      onClick={(e) => e.stopPropagation()}
                      title="Mở liên kết nguồn ngoài"
                    >
                      ↗
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Nút tiếp tục sang S4 phối đồ & Đọc câu chuyện */}
        <footer className="costume-detail__actions">
          <button
            type="button"
            onClick={onBackToCostumes}
            className="costume-detail__btn costume-detail__btn--sub"
          >
            {domdom.s3.veS2}
          </button>
          <button
            type="button"
            onClick={() => setShowMotTrangDoi(true)}
            className="costume-detail__btn costume-detail__btn--story"
          >
            📖 {domdom.motTrangDoi.nutDocCauChuyen}
          </button>
          {onProceedToS4 && (
            <button
              type="button"
              onClick={() => onProceedToS4(item.id)}
              className="costume-detail__btn costume-detail__btn--pri"
            >
              {domdom.s3.sangS4}
            </button>
          )}
        </footer>
      </div>

      {/* Chân trang Giữ chuẩn văn hóa */}
      <AppFooter currentCostumeName={item.ten} />

      {/* Modal Một Trang Đời */}
      <MotTrangDoiModal
        trangPhucId={item.id}
        isOpen={showMotTrangDoi}
        onClose={() => setShowMotTrangDoi(false)}
      />
    </main>
  );
}

const css = `
.costume-detail {
  position: relative;
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  background: var(--nen-toi);
  color: var(--nen-sang);
  font-family: var(--font-than);
  overflow-x: hidden;
}

.costume-detail__noise {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,${noise}");
  opacity: .10;
  pointer-events: none;
}

.costume-detail__header {
  position: relative;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(138, 129, 117, 0.25);
}

.costume-detail__brand-name {
  display: block;
  font-family: var(--font-tieu-de);
  font-size: 1.25rem;
  letter-spacing: .04em;
}

.costume-detail__brand-sub {
  display: block;
  font-size: .75rem;
  letter-spacing: .12em;
  text-transform: uppercase;
  opacity: .72;
}

.costume-detail__back-btn {
  min-height: 44px;
  padding: 8px 16px;
  background: none;
  border: 1px solid var(--tro-tram);
  color: var(--nen-sang);
  border-radius: var(--vien-lech-b);
  cursor: pointer;
}

.costume-detail__back-btn:hover {
  border-color: var(--vang-nghe);
}

.costume-detail__content {
  position: relative;
  z-index: 10;
  max-width: 48rem;
  margin: 32px auto;
  padding: 0 20px 60px;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.costume-detail__prompt {
  font-family: var(--font-tieu-de);
  font-style: italic;
  font-size: 1.05rem;
  color: var(--vang-nghe);
  margin: 0;
}

.costume-detail__title {
  margin: 0;
  font-family: var(--font-tieu-de);
  font-size: clamp(1.6rem, 5vw, 2.2rem);
  border-left: 3px solid var(--dat-nung);
  padding-left: 14px;
  line-height: 1.3;
}

.costume-detail__badges {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
}

.costume-detail__badge-danger {
  padding: 3px 10px;
  font-size: 0.8rem;
  color: #ff8c82;
  border: 1px solid rgba(255, 140, 130, 0.4);
  border-radius: var(--vien-lech-b);
  background: rgba(180, 50, 40, 0.15);
}

.costume-detail__badge-check {
  padding: 3px 10px;
  font-size: 0.8rem;
  border-radius: var(--vien-lech-a);
}

.costume-detail__badge-check--verified {
  color: var(--vang-nghe);
  border: 1px solid rgba(217, 164, 65, 0.4);
  background: rgba(217, 164, 65, 0.1);
}

.costume-detail__badge-check--pending {
  color: var(--tro-tram);
  border: 1px solid rgba(138, 129, 117, 0.3);
  background: rgba(138, 129, 117, 0.08);
}

.costume-detail__story-badge-btn {
  min-height: 36px;
  padding: 4px 14px;
  background: rgba(217, 164, 65, 0.15);
  border: 1px solid var(--vang-nghe);
  color: var(--vang-nghe);
  border-radius: var(--vien-lech-b);
  font-size: 0.84rem;
  font-family: var(--font-than);
  cursor: pointer;
  transition: all var(--nhip-nhanh) ease;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.costume-detail__story-badge-btn:hover {
  background: var(--vang-nghe);
  color: #111A1D !important;
  font-weight: 600;
}

.costume-detail__card {
  padding: 20px 22px;
  background: var(--nen-the);
  border: 1px solid var(--vien-the);
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.costume-detail__card--a {
  border-radius: var(--vien-lech-a);
  border-left: 3px solid var(--dat-nung);
}

.costume-detail__card--b {
  border-radius: var(--vien-lech-b);
  border-left: 3px solid var(--vang-nghe);
}

.costume-detail__desc {
  margin: 0;
  font-size: 1.05rem;
  line-height: 1.6;
  color: var(--nen-sang);
}

.costume-detail__info-grid {
  display: grid;
  gap: 10px;
  border-top: 1px solid rgba(138, 129, 117, 0.25);
  padding-top: 14px;
}

.costume-detail__info-item {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 12px;
  font-size: 0.92rem;
}

.costume-detail__lbl {
  color: var(--vang-nghe);
  font-weight: 500;
  min-width: 140px;
}

.costume-detail__val {
  color: var(--nen-sang);
  opacity: 0.9;
}

.costume-detail__card-header-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.costume-detail__giu-chuan-pill {
  min-height: 32px;
  padding: 4px 10px;
  background: rgba(217, 164, 65, 0.12);
  border: 1px solid rgba(217, 164, 65, 0.45);
  color: var(--vang-nghe);
  border-radius: var(--vien-lech-b);
  font-size: 0.8rem;
  font-family: var(--font-than);
  cursor: pointer;
  transition: all var(--nhip-cham) ease;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.costume-detail__giu-chuan-pill:hover {
  background: var(--vang-nghe);
  color: #111A1D !important;
  font-weight: 600;
}

.costume-detail__subheading {
  margin: 0;
  font-family: var(--font-tieu-de);
  font-size: 1.15rem;
  color: var(--vang-nghe);
}

.costume-detail__facts {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 10px;
}

.costume-detail__fact-item {
  display: flex;
  gap: 10px;
  line-height: 1.55;
  font-size: 0.95rem;
  color: var(--nen-sang);
  opacity: 0.92;
}

.costume-detail__fact-bullet {
  color: var(--vang-nghe);
  font-size: 0.75rem;
  margin-top: 3px;
  flex-shrink: 0;
}

.costume-detail__sources {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.costume-detail__source-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: rgba(27, 42, 46, 0.5);
  border: 1px solid var(--tro-tram);
  border-radius: var(--vien-lech-a);
  font-size: 0.88rem;
  cursor: pointer;
  transition: all var(--nhip-nhanh) ease;
}

.costume-detail__source-item:hover {
  border-color: var(--vang-nghe);
  background: rgba(217, 164, 65, 0.12);
  color: var(--vang-nghe);
}

.costume-detail__source-link {
  color: var(--vang-nghe);
  text-decoration: none;
}

.costume-detail__actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 10px;
  flex-wrap: wrap;
}

.costume-detail__btn {
  min-height: 44px;
  padding: 10px 20px;
  font-size: 0.95rem;
  cursor: pointer;
  font-family: var(--font-than);
  transition: all var(--nhip-cham) ease;
}

.costume-detail__btn--pri {
  background: var(--vang-nghe);
  border: 1px solid var(--vang-nghe);
  color: var(--nen-toi);
  border-radius: var(--vien-lech-b);
  font-weight: 500;
}

.costume-detail__btn--sub {
  background: none;
  border: 1px solid var(--tro-tram);
  color: var(--nen-sang);
  border-radius: var(--vien-lech-a);
}

.costume-detail__btn--story {
  background: rgba(217, 164, 65, 0.12);
  border: 1px solid var(--vang-nghe);
  color: var(--vang-nghe);
  border-radius: var(--vien-lech-b);
}

.costume-detail__btn--story:hover {
  background: var(--vang-nghe);
  color: var(--nen-toi);
}
`;
