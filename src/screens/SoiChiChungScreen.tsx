/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { nhom } from "../data/nhom";
import { domdom } from "../copy/domdom";
import { layDiemRiengCuaNhom, suyDiemChung } from "../lib/soiChiChung";
import { openGiuChuanVanHoa } from "../lib/giuChuan";
import SoiChiChungPose from "../narrator/poses/SoiChiChungPose";

interface Props {
  onBack: () => void;
  initialNhomAId?: string;
  initialNhomBId?: string;
  onSelectCostume?: (trangPhucId: string) => void;
}

const noise = encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .95  0 0 0 0 .92  0 0 0 0 .85  0 0 0 .55 0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`
);

export default function SoiChiChungScreen({
  onBack,
  initialNhomAId = "kb",
  initialNhomBId = "thai",
  onSelectCostume,
}: Props) {
  const [selectedIdA, setSelectedIdA] = useState<string>(initialNhomAId);
  const [selectedIdB, setSelectedIdB] = useState<string>(
    initialNhomBId !== initialNhomAId ? initialNhomBId : "thai"
  );
  const [mobileTab, setMobileTab] = useState<"all" | "chung" | "a" | "b">("all");

  const nhomA = useMemo(() => {
    return nhom.find((n) => n.id === selectedIdA) ?? nhom[0];
  }, [selectedIdA]);

  const nhomB = useMemo(() => {
    return nhom.find((n) => n.id === selectedIdB) ?? nhom[1];
  }, [selectedIdB]);

  const diemRiengA = useMemo(() => layDiemRiengCuaNhom(nhomA), [nhomA]);
  const diemRiengB = useMemo(() => layDiemRiengCuaNhom(nhomB), [nhomB]);
  const danhSachDiemChung = useMemo(() => suyDiemChung(nhomA, nhomB), [nhomA, nhomB]);

  const handleSwap = () => {
    const temp = selectedIdA;
    setSelectedIdA(selectedIdB);
    setSelectedIdB(temp);
  };

  const getVungLabel = (vungId: string) => {
    switch (vungId) {
      case "bac":
        return "Bắc Bộ";
      case "trung":
        return "Trung Bộ";
      case "nam":
        return "Nam Bộ";
      case "taynguyen":
        return "Tây Nguyên";
      default:
        return vungId;
    }
  };

  return (
    <main className="soi-chi-screen">
      <style>{css}</style>
      <div className="soi-chi-screen__noise" aria-hidden="true" />

      {/* ĐẦU TRANG */}
      <header className="soi-chi-screen__header">
        <div className="flex items-center gap-3">
          <SoiChiChungPose size={64} animate={true} />
          <div>
            <span className="soi-chi-screen__brand-tag">Giao thoa văn hóa</span>
            <h1 className="soi-chi-screen__title">{domdom.soiChiChung.tieuDe}</h1>
            <p className="soi-chi-screen__sub">{domdom.soiChiChung.phuDe}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="soi-chi-screen__back-btn"
          aria-label={domdom.soiChiChung.quayLai}
        >
          ← {domdom.soiChiChung.quayLai}
        </button>
      </header>

      {/* KHỐI CHỌN 2 NHÓM */}
      <section className="soi-chi-screen__selectors-bar" aria-label="Chọn 2 nhóm để so sánh">
        <div className="soi-chi-screen__selector-group">
          <label htmlFor="select-nhom-a" className="soi-chi-screen__selector-label">
            Nhóm thứ nhất:
          </label>
          <div className="soi-chi-screen__select-wrapper">
            <select
              id="select-nhom-a"
              value={selectedIdA}
              onChange={(e) => setSelectedIdA(e.target.value)}
              className="soi-chi-screen__select"
            >
              {nhom.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.ten} ({getVungLabel(n.vung)})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* NÚT HOÁN ĐỔI ⇄ */}
        <button
          type="button"
          onClick={handleSwap}
          className="soi-chi-screen__swap-btn"
          title="Hoán đổi vị trí 2 nhóm"
          aria-label="Hoán đổi hai nhóm"
        >
          ⇄
        </button>

        <div className="soi-chi-screen__selector-group">
          <label htmlFor="select-nhom-b" className="soi-chi-screen__selector-label">
            Nhóm thứ hai:
          </label>
          <div className="soi-chi-screen__select-wrapper">
            <select
              id="select-nhom-b"
              value={selectedIdB}
              onChange={(e) => setSelectedIdB(e.target.value)}
              className="soi-chi-screen__select"
            >
              {nhom.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.ten} ({getVungLabel(n.vung)})
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* GỢI Ý CẶP NHANH */}
      <div className="soi-chi-screen__presets" aria-label="Gợi ý các cặp đối chiếu tiêu biểu">
        <span className="soi-chi-screen__presets-label">Gợi ý đối chiếu:</span>
        <button
          type="button"
          onClick={() => {
            setSelectedIdA("mong");
            setSelectedIdB("ede");
          }}
          className="soi-chi-screen__preset-btn"
        >
          🧵 Mông & Ê Đê (Dệt thổ cẩm)
        </button>
        <button
          type="button"
          onClick={() => {
            setSelectedIdA("thai");
            setSelectedIdB("mong");
          }}
          className="soi-chi-screen__preset-btn"
        >
          💍 Thái & Mông (Trang sức bạc)
        </button>
        <button
          type="button"
          onClick={() => {
            setSelectedIdA("kb");
            setSelectedIdB("kn");
          }}
          className="soi-chi-screen__preset-btn"
        >
          👘 Bắc & Nam (Áo dài & Khăn xưa)
        </button>
        <button
          type="button"
          onClick={() => {
            setSelectedIdA("champa");
            setSelectedIdB("ede");
          }}
          className="soi-chi-screen__preset-btn"
        >
          🧵 Chăm & Ê Đê (Dệt thủ công)
        </button>
      </div>

      {/* NGUYÊN TẮC GIỮ CHUẨN */}
      <div className="soi-chi-screen__note-banner">
        <span>🛡️ {domdom.soiChiChung.khongGhepTrangPhuc}</span>
      </div>

      {/* TABS CHUYỂN ĐỔI GÓC NHÌN TRÊN MÀN HÌNH NHỎ */}
      <div className="soi-chi-screen__mobile-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={mobileTab === "all"}
          onClick={() => setMobileTab("all")}
          className={`soi-chi-screen__mobile-tab ${
            mobileTab === "all" ? "soi-chi-screen__mobile-tab--active" : ""
          }`}
        >
          Toàn cảnh 3 cột
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mobileTab === "chung"}
          onClick={() => setMobileTab("chung")}
          className={`soi-chi-screen__mobile-tab ${
            mobileTab === "chung" ? "soi-chi-screen__mobile-tab--active" : ""
          }`}
        >
          🧵 Sợi chỉ chung ({danhSachDiemChung.length})
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mobileTab === "a"}
          onClick={() => setMobileTab("a")}
          className={`soi-chi-screen__mobile-tab ${
            mobileTab === "a" ? "soi-chi-screen__mobile-tab--active" : ""
          }`}
        >
          Nét riêng: {nhomA.ten}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mobileTab === "b"}
          onClick={() => setMobileTab("b")}
          className={`soi-chi-screen__mobile-tab ${
            mobileTab === "b" ? "soi-chi-screen__mobile-tab--active" : ""
          }`}
        >
          Nét riêng: {nhomB.ten}
        </button>
      </div>

      {/* BỐ CỤC CHÍNH 3 CỘT */}
      <div className={`soi-chi-screen__grid soi-chi-screen__grid--tab-${mobileTab}`}>
        {/* CỘT 1: ĐIỂM RIÊNG CỦA NHÓM A */}
        <section
          className={`soi-col soi-col--group-a ${
            mobileTab === "b" || mobileTab === "chung" ? "soi-col--hidden-mobile" : ""
          }`}
          aria-labelledby="heading-col-a"
        >
          <header className="soi-col__header">
            <span className="soi-col__tag">Cột 1</span>
            <h2 id="heading-col-a" className="soi-col__title">
              {domdom.soiChiChung.diemRieng}: {nhomA.ten}
            </h2>
            <div className="soi-col__badge-row">
              <span className="soi-col__region-badge">
                Vùng {getVungLabel(nhomA.vung)}
              </span>
              <span className="soi-col__count-badge">
                {diemRiengA.trangPhucs.length} kiểu trang phục
              </span>
            </div>
          </header>

          <div className="soi-col__body">
            {/* Danh sách trang phục & sự thật văn hóa */}
            {diemRiengA.trangPhucs.map((item) => (
              <article key={item.trangPhuc.id} className="soi-costume-card">
                <div className="soi-costume-card__head">
                  <h3 className="soi-costume-card__name">
                    {item.trangPhuc.ten}
                  </h3>
                  {onSelectCostume && (
                    <button
                      type="button"
                      onClick={() => onSelectCostume(item.trangPhuc.id)}
                      className="soi-costume-card__explore-btn"
                      title={`Xem chi tiết ${item.trangPhuc.ten}`}
                    >
                      Chi tiết →
                    </button>
                  )}
                </div>

                <p className="soi-costume-card__short-desc">
                  {item.trangPhuc.moTaNgan}
                </p>

                <div className="soi-costume-card__facts-list">
                  <span className="soi-costume-card__facts-title">
                    Ghi chép sự thật văn hóa:
                  </span>
                  {item.suThat.map((st, sIdx) => (
                    <div key={sIdx} className="soi-fact-item">
                      <span className="soi-fact-item__bullet">✦</span>
                      <p className="soi-fact-item__text">{st}</p>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* CỘT 2 (Ở GIỮA): SỢI CHỈ CHUNG */}
        <section
          className={`soi-col soi-col--center ${
            mobileTab === "a" || mobileTab === "b" ? "soi-col--hidden-mobile" : ""
          }`}
          aria-labelledby="heading-col-center"
        >
          <header className="soi-col__header soi-col__header--center">
            <div className="soi-col__thread-icon" aria-hidden="true">
              🧵
            </div>
            <h2 id="heading-col-center" className="soi-col__title soi-col__title--center">
              {domdom.soiChiChung.soiChiChung}
            </h2>
            <p className="soi-col__sub--center">
              Chỉ hiện những điểm chung suy ra trực tiếp từ dữ liệu
            </p>
          </header>

          <div className="soi-col__body soi-col__body--center">
            {danhSachDiemChung.length > 0 ? (
              <div className="soi-thread-list">
                {danhSachDiemChung.map((item) => (
                  <article key={item.id} className="soi-thread-card">
                    <div className="soi-thread-card__header">
                      <span className="soi-thread-card__icon" aria-hidden="true">
                        {item.bieuTuong}
                      </span>
                      <h3 className="soi-thread-card__title">{item.tieuDe}</h3>
                    </div>

                    <p className="soi-thread-card__desc">{item.moTa}</p>

                    <div className="soi-thread-card__evidence">
                      <span className="soi-thread-card__evidence-lbl">
                        {domdom.soiChiChung.canCu}
                      </span>
                      <span className="soi-thread-card__evidence-val">
                        {item.canCu}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              /* NẾU DỮ LIỆU CHƯA ĐỦ ĐỂ NÊU ĐIỂM CHUNG:
                 HIỂN THỊ CHÍNH XÁC domdom.common.noData */
              <div className="soi-nodata-box">
                <span className="soi-nodata-box__icon" aria-hidden="true">
                  🌾
                </span>
                <p className="soi-nodata-box__text">
                  {domdom.common.noData}
                </p>
                <p className="soi-nodata-box__sub">
                  Dữ liệu hiện tại chưa ghi nhận điểm chung trực tiếp giữa {nhomA.ten} và {nhomB.ten}. Mỗi nếp áo vẫn đang giữ trọn nét độc bản của riêng mình.
                </p>
                <button
                  type="button"
                  onClick={() => openGiuChuanVanHoa("Sợi chỉ chung")}
                  className="soi-nodata-box__link-btn"
                >
                  Góp ý / Bổ sung nguồn tại Giữ chuẩn →
                </button>
              </div>
            )}
          </div>
        </section>

        {/* CỘT 3: ĐIỂM RIÊNG CỦA NHÓM B */}
        <section
          className={`soi-col soi-col--group-b ${
            mobileTab === "a" || mobileTab === "chung" ? "soi-col--hidden-mobile" : ""
          }`}
          aria-labelledby="heading-col-b"
        >
          <header className="soi-col__header">
            <span className="soi-col__tag">Cột 2</span>
            <h2 id="heading-col-b" className="soi-col__title">
              {domdom.soiChiChung.diemRieng}: {nhomB.ten}
            </h2>
            <div className="soi-col__badge-row">
              <span className="soi-col__region-badge">
                Vùng {getVungLabel(nhomB.vung)}
              </span>
              <span className="soi-col__count-badge">
                {diemRiengB.trangPhucs.length} kiểu trang phục
              </span>
            </div>
          </header>

          <div className="soi-col__body">
            {/* Danh sách trang phục & sự thật văn hóa */}
            {diemRiengB.trangPhucs.map((item) => (
              <article key={item.trangPhuc.id} className="soi-costume-card">
                <div className="soi-costume-card__head">
                  <h3 className="soi-costume-card__name">
                    {item.trangPhuc.ten}
                  </h3>
                  {onSelectCostume && (
                    <button
                      type="button"
                      onClick={() => onSelectCostume(item.trangPhuc.id)}
                      className="soi-costume-card__explore-btn"
                      title={`Xem chi tiết ${item.trangPhuc.ten}`}
                    >
                      Chi tiết →
                    </button>
                  )}
                </div>

                <p className="soi-costume-card__short-desc">
                  {item.trangPhuc.moTaNgan}
                </p>

                <div className="soi-costume-card__facts-list">
                  <span className="soi-costume-card__facts-title">
                    Ghi chép sự thật văn hóa:
                  </span>
                  {item.suThat.map((st, sIdx) => (
                    <div key={sIdx} className="soi-fact-item">
                      <span className="soi-fact-item__bullet">✦</span>
                      <p className="soi-fact-item__text">{st}</p>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      {/* CHÂN TRANG */}
      <footer className="soi-chi-screen__footer">
        <p className="soi-chi-screen__footer-text">
          {domdom.soiChiChung.moDau}
        </p>
      </footer>
    </main>
  );
}

const css = `
.soi-chi-screen {
  position: relative;
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  background: transparent;
  color: var(--chu-chinh, #0f172a);
  font-family: var(--font-than, sans-serif);
}

.soi-chi-screen__noise {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,${noise}");
  opacity: 0.05;
  pointer-events: none;
  z-index: 1;
}

.soi-chi-screen__header {
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

.soi-chi-screen__brand-tag {
  display: inline-block;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--vang-chinh, #ca8a04);
  margin-bottom: 2px;
}

.soi-chi-screen__title {
  font-family: var(--font-tieu-de, serif);
  font-size: 1.35rem;
  margin: 0;
  color: var(--chu-chinh, #0f172a);
}

.soi-chi-screen__sub {
  font-size: 0.82rem;
  color: var(--chu-mo, #64748b);
  margin: 2px 0 0;
}

.soi-chi-screen__back-btn {
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

.soi-chi-screen__back-btn:hover {
  background: var(--vang-chinh, #ca8a04);
  color: #ffffff;
}

/* THANH CHỌN 2 NHÓM */
.soi-chi-screen__selectors-bar {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 14px 20px;
  background: var(--nen-the, #ffffff);
  border-bottom: 1px solid var(--vien-the, rgba(0, 0, 0, 0.08));
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  flex-wrap: wrap;
}

.soi-chi-screen__selector-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 220px;
  max-width: 340px;
}

.soi-chi-screen__selector-label {
  font-size: 0.78rem;
  color: var(--vang-chinh, #ca8a04);
  font-weight: 600;
}

.soi-chi-screen__select-wrapper {
  position: relative;
}

.soi-chi-screen__select {
  width: 100%;
  padding: 9px 12px;
  background: var(--nen-the-phu, #f7faf5);
  border: 1.5px solid var(--vien-the, rgba(202, 138, 4, 0.4));
  border-radius: var(--vien-lech-b, 3px 12px 4px 14px);
  color: var(--chu-chinh, #0f172a);
  font-size: 0.88rem;
  font-family: var(--font-than, sans-serif);
  cursor: pointer;
  outline: none;
  transition: border-color 0.2s ease;
}

.soi-chi-screen__select:focus {
  border-color: var(--vang-chinh, #ca8a04);
  box-shadow: 0 0 0 2px rgba(202, 138, 4, 0.2);
}

.soi-chi-screen__swap-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  margin-top: 18px;
  background: var(--nen-the-phu, #f7faf5);
  border: 1.5px solid var(--vang-chinh, #ca8a04);
  border-radius: 50%;
  color: var(--vang-chinh, #ca8a04);
  font-size: 1.15rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.soi-chi-screen__swap-btn:hover {
  background: var(--vang-chinh, #ca8a04);
  color: #ffffff;
  transform: rotate(180deg);
}

/* THANH GỢI Ý PRESET */
.soi-chi-screen__presets {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 20px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  background: var(--nen-the-phu, #f7faf5);
  border-bottom: 1px solid var(--vien-the, rgba(0, 0, 0, 0.06));
}

.soi-chi-screen__presets-label {
  font-size: 0.75rem;
  color: var(--chu-mo, #64748b);
  white-space: nowrap;
}

.soi-chi-screen__preset-btn {
  padding: 4px 10px;
  background: var(--nen-the, #ffffff);
  border: 1px solid var(--vien-the, rgba(0, 0, 0, 0.12));
  border-radius: var(--vien-lech-b, 3px 12px 4px 14px);
  color: var(--chu-phu, #334155);
  font-size: 0.75rem;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s ease;
}

.soi-chi-screen__preset-btn:hover {
  border-color: var(--vang-chinh, #ca8a04);
  color: var(--vang-chinh, #ca8a04);
  background: var(--nen-the-phu, #f7faf5);
}

.soi-chi-screen__note-banner {
  position: relative;
  z-index: 10;
  text-align: center;
  padding: 6px 16px;
  font-size: 0.78rem;
  color: var(--dat-nung, #c2410c);
  background: rgba(202, 138, 4, 0.08);
}

/* MOBILE TABS */
.soi-chi-screen__mobile-tabs {
  position: relative;
  z-index: 10;
  display: none;
  overflow-x: auto;
  gap: 6px;
  padding: 8px 16px;
  background: var(--nen-the, #ffffff);
  border-bottom: 1px solid var(--vien-the, rgba(0, 0, 0, 0.08));
}

@media (max-width: 860px) {
  .soi-chi-screen__mobile-tabs {
    display: flex;
  }
}

.soi-chi-screen__mobile-tab {
  padding: 6px 12px;
  background: var(--nen-the-phu, #f7faf5);
  border: 1px solid var(--vien-the, rgba(0, 0, 0, 0.12));
  border-radius: var(--vien-lech-b, 3px 12px 4px 14px);
  color: var(--chu-phu, #334155);
  font-size: 0.78rem;
  white-space: nowrap;
  cursor: pointer;
}

.soi-chi-screen__mobile-tab--active {
  background: rgba(202, 138, 4, 0.15);
  border-color: var(--vang-chinh, #ca8a04);
  color: var(--vang-chinh, #ca8a04);
  font-weight: 600;
}

/* GRID 3 CỘT */
.soi-chi-screen__grid {
  position: relative;
  z-index: 10;
  flex: 1;
  display: grid;
  grid-template-columns: 1fr minmax(290px, 1.25fr) 1fr;
  gap: 16px;
  padding: 20px;
  align-items: start;
}

@media (max-width: 860px) {
  .soi-chi-screen__grid {
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 14px;
  }

  .soi-col--hidden-mobile {
    display: none !important;
  }
}

/* KHỐI CỘT */
.soi-col {
  background: var(--nen-the, #ffffff);
  border: 1px solid var(--vien-the, rgba(202, 138, 4, 0.25));
  border-radius: var(--vien-lech-a, 4px 18px 6px 20px);
  box-shadow: var(--shadow-the, 0 4px 20px rgba(0, 0, 0, 0.06));
  padding: 18px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  word-break: break-word;
  overflow-wrap: break-word;
}

.soi-col--center {
  background: var(--nen-the, #ffffff);
  border: 2px solid var(--vang-chinh, #ca8a04);
  box-shadow: 0 8px 30px rgba(202, 138, 4, 0.12);
}

.soi-col__header {
  margin-bottom: 14px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--vien-the, rgba(0, 0, 0, 0.08));
}

.soi-col__header--center {
  text-align: center;
  border-bottom-color: var(--vien-the, rgba(202, 138, 4, 0.3));
}

.soi-col__tag {
  display: inline-block;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--vang-chinh, #ca8a04);
  margin-bottom: 4px;
  font-weight: 600;
}

.soi-col__thread-icon {
  font-size: 2rem;
  margin-bottom: 4px;
}

.soi-col__title {
  font-family: var(--font-tieu-de, serif);
  font-size: 1.15rem;
  margin: 0 0 6px;
  color: var(--chu-chinh, #0f172a);
  line-height: 1.35;
}

.soi-col__title--center {
  color: var(--vang-chinh, #ca8a04);
  font-size: 1.3rem;
}

.soi-col__sub--center {
  font-size: 0.8rem;
  color: var(--chu-mo, #64748b);
  margin: 0;
}

.soi-col__badge-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.soi-col__region-badge {
  padding: 3px 8px;
  background: rgba(202, 138, 4, 0.12);
  border: 1px solid var(--vang-chinh, #ca8a04);
  border-radius: var(--vien-lech-b, 3px 12px 4px 14px);
  color: var(--vang-chinh, #ca8a04);
  font-size: 0.74rem;
  font-weight: 600;
}

.soi-col__count-badge {
  padding: 3px 8px;
  background: var(--nen-the-phu, #f7faf5);
  border: 1px solid var(--vien-the, rgba(0, 0, 0, 0.1));
  border-radius: var(--vien-lech-b, 3px 12px 4px 14px);
  color: var(--chu-phu, #334155);
  font-size: 0.74rem;
}

.soi-col__body {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.soi-col__body--center {
  gap: 12px;
}

/* THẺ TRANG PHỤC Ở CỘT RIÊNG */
.soi-costume-card {
  background: var(--nen-the-phu, #f7faf5);
  border: 1px solid var(--vien-the, rgba(0, 0, 0, 0.08));
  border-radius: var(--vien-lech-b, 3px 12px 4px 14px);
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.soi-costume-card__head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.soi-costume-card__name {
  font-family: var(--font-tieu-de, serif);
  font-size: 1rem;
  margin: 0;
  color: var(--chu-chinh, #0f172a);
}

.soi-costume-card__explore-btn {
  background: none;
  border: none;
  color: var(--vang-chinh, #ca8a04);
  font-size: 0.78rem;
  cursor: pointer;
  padding: 0;
  font-weight: 600;
  text-decoration: underline;
}

.soi-costume-card__short-desc {
  font-size: 0.82rem;
  color: var(--chu-mo, #64748b);
  line-height: 1.45;
  margin: 0;
}

.soi-costume-card__facts-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-top: 6px;
  border-top: 1px dashed var(--vien-the, rgba(0, 0, 0, 0.08));
}

.soi-costume-card__facts-title {
  font-size: 0.74rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--vang-chinh, #ca8a04);
  font-weight: 600;
}

.soi-fact-item {
  display: flex;
  gap: 6px;
  align-items: flex-start;
}

.soi-fact-item__bullet {
  color: var(--vang-chinh, #ca8a04);
  font-size: 0.72rem;
  margin-top: 2px;
  flex-shrink: 0;
}

.soi-fact-item__text {
  font-size: 0.82rem;
  color: var(--chu-chinh, #0f172a);
  line-height: 1.5;
  margin: 0;
}

/* DANH SÁCH THẺ SỢI CHỈ CHUNG */
.soi-thread-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.soi-thread-card {
  background: var(--nen-the-phu, #f7faf5);
  border: 1px solid var(--vien-the, rgba(202, 138, 4, 0.3));
  border-radius: var(--vien-lech-b, 3px 12px 4px 14px);
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.soi-thread-card__header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.soi-thread-card__icon {
  font-size: 1.25rem;
}

.soi-thread-card__title {
  font-family: var(--font-tieu-de, serif);
  font-size: 1rem;
  color: var(--vang-chinh, #ca8a04);
  margin: 0;
}

.soi-thread-card__desc {
  font-size: 0.85rem;
  line-height: 1.55;
  color: var(--chu-chinh, #0f172a);
  margin: 0;
}

.soi-thread-card__evidence {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 6px 10px;
  background: var(--nen-the, #ffffff);
  border-radius: var(--vien-lech-b, 3px 12px 4px 14px);
  border-left: 3px solid var(--vang-chinh, #ca8a04);
}

.soi-thread-card__evidence-lbl {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--chu-mo, #64748b);
}

.soi-thread-card__evidence-val {
  font-size: 0.78rem;
  color: var(--chu-chinh, #0f172a);
  line-height: 1.35;
  font-weight: 500;
}

/* HỘP KHÔNG CÓ DỮ LIỆU ĐIỂM CHUNG TRỰC TIẾP */
.soi-nodata-box {
  text-align: center;
  padding: 28px 18px;
  background: var(--nen-the-phu, #f7faf5);
  border: 1px dashed var(--vien-the, rgba(0, 0, 0, 0.15));
  border-radius: var(--vien-lech-b, 3px 12px 4px 14px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.soi-nodata-box__icon {
  font-size: 2rem;
  opacity: 0.8;
}

.soi-nodata-box__text {
  font-family: var(--font-tieu-de, serif);
  font-size: 1rem;
  color: var(--chu-chinh, #0f172a);
  font-style: italic;
  margin: 0;
}

.soi-nodata-box__sub {
  font-size: 0.82rem;
  color: var(--chu-mo, #64748b);
  line-height: 1.5;
  margin: 0;
  max-width: 320px;
}

.soi-nodata-box__link-btn {
  margin-top: 6px;
  background: none;
  border: none;
  color: var(--vang-chinh, #ca8a04);
  font-size: 0.8rem;
  cursor: pointer;
  text-decoration: underline;
  padding: 0;
  font-weight: 600;
}

/* CHÂN TRANG */
.soi-chi-screen__footer {
  position: relative;
  z-index: 10;
  text-align: center;
  padding: 16px 20px;
  background: var(--nen-the, #ffffff);
  border-top: 1px solid var(--vien-the, rgba(0, 0, 0, 0.08));
}

.soi-chi-screen__footer-text {
  font-size: 0.82rem;
  color: var(--chu-mo, #64748b);
  font-style: italic;
  margin: 0;
}
`;
