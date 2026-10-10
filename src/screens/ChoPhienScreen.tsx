/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from "react";
import AvatarSVG from "../components/AvatarSVG";
import { CulturalPatternsDefs, renderGarmentLayers } from "../components/GarmentLayers";
import { tinhSoDo } from "../lib/avatar";
import { trangPhuc } from "../data/trangphuc";
import { nhom } from "../data/nhom";
import { mauSac } from "../data/mausac";
import { phuKien } from "../data/phukien";
import { domdom } from "../copy/coem";
import {
  BaiChoPhien,
  LyDoBinhChon,
  docDanhSachChoPhien,
  docBinhChonCuaToi,
  binhChonBaiChoPhien,
  huyBinhChonBaiChoPhien,
  dangBaiLenChoPhien,
} from "../lib/choPhien";
import { docDanhSachGuiKyUc, OutfitSaved } from "../lib/guiKyUc";
import ChoPhienPose from "../narrator/poses/ChoPhienPose";

interface Props {
  onBack: () => void;
  onOpenCostumeDetail?: (trangPhucId: string) => void;
}

const noise = encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .95  0 0 0 0 .92  0 0 0 0 .85  0 0 0 .55 0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`
);

export default function ChoPhienScreen({ onBack, onOpenCostumeDetail }: Props) {
  const [posts, setPosts] = useState<BaiChoPhien[]>([]);
  const [myVotes, setMyVotes] = useState<Record<string, LyDoBinhChon>>({});
  const [filterNhom, setFilterNhom] = useState<string>("all");
  const [filterNhan, setFilterNhan] = useState<string>("all");
  const [activeVoteModalPostId, setActiveVoteModalPostId] = useState<string | null>(null);
  const [showPickFromGuiModal, setShowPickFromGuiModal] = useState<boolean>(false);
  const [myOutfits, setMyOutfits] = useState<OutfitSaved[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load posts & votes from localStorage
  useEffect(() => {
    setPosts(docDanhSachChoPhien());
    setMyVotes(docBinhChonCuaToi());
    setMyOutfits(docDanhSachGuiKyUc());

    const handleFeedChange = () => {
      setPosts(docDanhSachChoPhien());
      setMyVotes(docBinhChonCuaToi());
    };

    window.addEventListener("vpr:cho-phien-change", handleFeedChange);
    return () => window.removeEventListener("vpr:cho-phien-change", handleFeedChange);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Lọc theo nhóm và nhãn văn hóa; luôn sắp xếp mới nhất trước (sort by taoLuc desc)
  const filteredPosts = useMemo(() => {
    let result = [...posts];

    if (filterNhom !== "all") {
      result = result.filter((p) => p.nhomId === filterNhom);
    }

    if (filterNhan !== "all") {
      result = result.filter((p) => p.nhan === filterNhan);
    }

    // Sắp xếp mới nhất trước
    result.sort((a, b) => b.taoLuc - a.taoLuc);
    return result;
  }, [posts, filterNhom, filterNhan]);

  // Xử lý vote có lý do
  const handleVote = (postId: string, lyDo: LyDoBinhChon) => {
    const res = binhChonBaiChoPhien(postId, lyDo);
    if (res.success) {
      setPosts(docDanhSachChoPhien());
      setMyVotes(docBinhChonCuaToi());
      setActiveVoteModalPostId(null);
      showToast(`Đã ghi nhận bạn thích với lý do: "${domdom.choPhien.lyDo[lyDo]}"`);
    }
  };

  // Huỷ vote
  const handleCancelVote = (postId: string) => {
    const res = huyBinhChonBaiChoPhien(postId);
    if (res.success) {
      setPosts(docDanhSachChoPhien());
      setMyVotes(docBinhChonCuaToi());
      setActiveVoteModalPostId(null);
      showToast("Đã huỷ lượt thích.");
    }
  };

  // Đem bộ từ Gùi ra chợ
  const handlePostFromGui = (outfit: OutfitSaved) => {
    const res = dangBaiLenChoPhien(outfit);
    if (res.success) {
      setPosts(docDanhSachChoPhien());
      setShowPickFromGuiModal(false);
      showToast(res.message);
    } else {
      showToast(res.message);
    }
  };

  const getNhomTen = (nhomId: string) => {
    return nhom.find((n) => n.id === nhomId)?.ten || nhomId;
  };

  const getTrangPhucTen = (tpId: string) => {
    return trangPhuc.find((t) => t.id === tpId)?.ten || tpId;
  };

  const formatTime = (ts: number) => {
    const diff = Date.now() - ts;
    if (diff < 60000) return "Vừa xong";
    if (diff < 3600000) return `${Math.floor(diff / 60000)} phút trước`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} giờ trước`;
    const d = new Date(ts);
    return `${d.getDate()}/${d.getMonth() + 1}`;
  };

  return (
    <main className="cho-phien-screen">
      <style>{css}</style>
      <div className="cho-phien-screen__noise" aria-hidden="true" />

      {/* TOAST THÔNG BÁO */}
      {toastMessage && (
        <aside className="cho-phien-screen__toast" role="status" aria-live="polite">
          {toastMessage}
        </aside>
      )}

      {/* ĐẦU TRANG */}
      <header className="cho-phien-screen__header">
        <div className="cho-phien-screen__header-left flex items-center gap-3">
          <ChoPhienPose size={66} animate={true} />
          <div>
            <div className="cho-phien-screen__tag-row">
              <span className="cho-phien-screen__tag">🏮 Không gian giao lưu</span>
              <span className="cho-phien-screen__demo-notice">
                {domdom.choPhien.moDau}
              </span>
            </div>
            <h1 className="cho-phien-screen__title">{domdom.choPhien.tieuDe}</h1>
            <p className="cho-phien-screen__sub">{domdom.choPhien.phuDe}</p>
          </div>
        </div>

        <div className="cho-phien-screen__header-actions">
          <button
            type="button"
            onClick={() => {
              setMyOutfits(docDanhSachGuiKyUc());
              setShowPickFromGuiModal(true);
            }}
            className="cho-phien-screen__post-btn"
          >
            🎒 {domdom.choPhien.dangTuGui}
          </button>
          <button
            type="button"
            onClick={onBack}
            className="cho-phien-screen__back-btn"
          >
            ← {domdom.choPhien.quayLai}
          </button>
        </div>
      </header>

      {/* THANH BỘ LỌC VÀ SẮP XẾP */}
      <section className="cho-phien-screen__filter-bar" aria-label="Bộ lọc bài Chợ Phiên">
        <div className="cho-phien-screen__filter-group">
          <label htmlFor="filter-nhom" className="cho-phien-screen__filter-label">
            {domdom.choPhien.locTheoNhom}:
          </label>
          <select
            id="filter-nhom"
            value={filterNhom}
            onChange={(e) => setFilterNhom(e.target.value)}
            className="cho-phien-screen__filter-select"
          >
            <option value="all">{domdom.choPhien.tatCaNhom}</option>
            {nhom.map((n) => (
              <option key={n.id} value={n.id}>
                {n.ten}
              </option>
            ))}
          </select>
        </div>

        <div className="cho-phien-screen__filter-group">
          <label htmlFor="filter-nhan" className="cho-phien-screen__filter-label">
            {domdom.choPhien.locTheoNhan}:
          </label>
          <select
            id="filter-nhan"
            value={filterNhan}
            onChange={(e) => setFilterNhan(e.target.value)}
            className="cho-phien-screen__filter-select"
          >
            <option value="all">{domdom.choPhien.tatCaNhan}</option>
            <option value="chuan">🛡️ {domdom.choPhien.nhan.chuan}</option>
            <option value="sang_tao">✨ {domdom.choPhien.nhan.sang_tao}</option>
            <option value="can_xem_lai">⚠️ {domdom.choPhien.nhan.can_xem_lai}</option>
            <option value="chua_du_du_lieu">💬 Chưa đủ dữ liệu để nói</option>
          </select>
        </div>

        <div className="cho-phien-screen__sort-badge">
          <span>⏳ {domdom.choPhien.sapXepMoiNhat}</span>
          <span className="cho-phien-screen__count-chip">
            {filteredPosts.length} bài
          </span>
        </div>
      </section>

      {/* FEED BÀI ĐĂNG */}
      <div className="cho-phien-screen__feed">
        {filteredPosts.length === 0 ? (
          <div className="cho-phien-screen__empty-box">
            <span className="cho-phien-screen__empty-icon" aria-hidden="true">
              🏮
            </span>
            <p className="cho-phien-screen__empty-text">
              {domdom.choPhien.chuaCoBaiNao}
            </p>
            <button
              type="button"
              onClick={() => {
                setFilterNhom("all");
                setFilterNhan("all");
              }}
              className="cho-phien-screen__reset-filter-btn"
            >
              Xem tất cả bài
            </button>
          </div>
        ) : (
          <div className="cho-phien-screen__cards-grid">
            {filteredPosts.map((post) => {
              const soDo = tinhSoDo(post.nhanVatConfig);
              const tpObj = trangPhuc.find((t) => t.id === post.trangPhucId) || trangPhuc[0];
              const mauObj = mauSac.find((m) => m.id === post.mauId) || mauSac[0];
              const garmentLayers = renderGarmentLayers({
                trangPhucId: post.trangPhucId,
                soDo,
                mauHex: mauObj.hex,
                phuKienIds: post.phuKienIds,
                hoaVanThem: post.hoaVanThem,
                phongCach: post.phongCach,
              });
              const userVote = myVotes[post.id];
              const isVoteModalOpen = activeVoteModalPostId === post.id;

              return (
                <article key={post.id} className="cho-card">
                  {/* ĐẦU THẺ: TÁC GIẢ & THỜI GIAN */}
                  <div className="cho-card__header">
                    <div className="cho-card__author-info">
                      <span className="cho-card__avatar-badge" aria-hidden="true">
                        {post.laToi ? "👤" : "🏮"}
                      </span>
                      <div>
                        <div className="cho-card__author-name">
                          {post.nguoiDang}
                          {post.laToi && (
                            <span className="cho-card__me-tag">Của bạn</span>
                          )}
                        </div>
                        <div className="cho-card__meta-sub">
                          <span>{getNhomTen(post.nhomId)}</span>
                          <span>•</span>
                          <span>{formatTime(post.taoLuc)}</span>
                        </div>
                      </div>
                    </div>

                    {/* NHÃN VĂN HÓA (Đủ 3 nhãn) */}
                    <div className="cho-card__label-wrapper">
                      {post.nhan === "chuan" && (
                        <span className="cho-label cho-label--chuan">
                          🛡️ {domdom.choPhien.nhan.chuan}
                        </span>
                      )}
                      {post.nhan === "sang_tao" && (
                        <span className="cho-label cho-label--sang-tao">
                          ✨ {domdom.choPhien.nhan.sang_tao}
                        </span>
                      )}
                      {post.nhan === "can_xem_lai" && (
                        <span className="cho-label cho-label--can-xem-lai">
                          ⚠️ {domdom.choPhien.nhan.can_xem_lai}
                        </span>
                      )}
                      {post.nhan === "chua_du_du_lieu" && (
                        <span className="cho-label cho-label--chua-du-du-lieu" style={{ borderColor: "rgba(168, 162, 158, 0.4)", color: "var(--da-nhe)" }}>
                          💬 Chưa đủ dữ liệu
                        </span>
                      )}
                    </div>
                  </div>

                  {/* THÂN THẺ: KHUNG MINH HỌA NHÂN VẬT & TRANG PHỤC */}
                  <div className="cho-card__preview-box">
                    <svg
                      viewBox="0 0 400 560"
                      className="cho-card__svg"
                      aria-label={`Trang phục ${getTrangPhucTen(post.trangPhucId)} của ${post.nguoiDang}`}
                    >
                      <AvatarSVG
                        nhanVat={post.nhanVatConfig}
                        childrenDefs={<CulturalPatternsDefs />}
                        childrenVayQuan={garmentLayers.childrenVayQuan}
                        childrenAo={garmentLayers.childrenAo}
                        childrenPhuKienThan={garmentLayers.childrenPhuKienThan}
                        childrenTocTruocKhanNon={garmentLayers.childrenTocTruocKhanNon}
                      />
                    </svg>

                    <div className="cho-card__costume-pill">
                      <span className="cho-card__costume-dot" style={{ background: mauObj.hex }} />
                      <span className="cho-card__costume-title">
                        {getTrangPhucTen(post.trangPhucId)} • {mauObj.ten}
                      </span>
                    </div>
                  </div>

                  {/* CHÚ THÍCH CỦA BÀI */}
                  <div className="cho-card__content">
                    <p className="cho-card__caption">{post.caption}</p>

                    {/* LÝ DO TỪ S6 */}
                    {post.lyDo && (
                      <div className="cho-card__reason-box">
                        <span className="cho-card__reason-title">Ghi chép quy ước:</span>
                        <p className="cho-card__reason-text">{post.lyDo}</p>
                      </div>
                    )}
                  </div>

                  {/* CHÂN THẺ: BÌNH CHỌN CÓ LÝ DO (KHÔNG BẢNG XẾP HẠNG, KHÔNG ĐIỂM) */}
                  <div className="cho-card__vote-section">
                    <div className="cho-card__vote-action-bar">
                      {!userVote ? (
                        <button
                          type="button"
                          onClick={() => setActiveVoteModalPostId(post.id)}
                          className="cho-card__like-btn"
                          aria-label={`Tôi thích nếp áo của ${post.nguoiDang}`}
                        >
                          <span className="cho-card__like-icon" aria-hidden="true">
                            🏮
                          </span>
                          <span>{domdom.choPhien.nutToiThich}</span>
                        </button>
                      ) : (
                        <div className="cho-card__voted-badge-group">
                          <span className="cho-card__voted-chip">
                            ✓ {domdom.choPhien.daThich} (
                            <em>{domdom.choPhien.lyDo[userVote]}</em>)
                          </span>
                          <button
                            type="button"
                            onClick={() => setActiveVoteModalPostId(post.id)}
                            className="cho-card__change-vote-btn"
                            title="Đổi lý do khác"
                          >
                            {domdom.choPhien.doiLyDo}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCancelVote(post.id)}
                            className="cho-card__cancel-vote-btn"
                            title="Huỷ thích"
                          >
                            ×
                          </button>
                        </div>
                      )}
                    </div>

                    {/* BẢNG CHỌN MỘT LÝ DO KHI BẤM 'TÔI THÍCH' */}
                    {isVoteModalOpen && (
                      <div className="cho-vote-popup" role="dialog" aria-modal="true">
                        <div className="cho-vote-popup__head">
                          <span className="cho-vote-popup__title">
                            {domdom.choPhien.hopThoaiChonLyDo}
                          </span>
                          <button
                            type="button"
                            onClick={() => setActiveVoteModalPostId(null)}
                            className="cho-vote-popup__close-btn"
                          >
                            ✕
                          </button>
                        </div>
                        <div className="cho-vote-popup__options">
                          <button
                            type="button"
                            onClick={() => handleVote(post.id, "hop_dip")}
                            className={`cho-vote-option ${
                              userVote === "hop_dip" ? "cho-vote-option--selected" : ""
                            }`}
                          >
                            <span className="cho-vote-option__icon">🌿</span>
                            <span className="cho-vote-option__text">
                              {domdom.choPhien.lyDo.hop_dip}
                            </span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleVote(post.id, "phoi_mau")}
                            className={`cho-vote-option ${
                              userVote === "phoi_mau" ? "cho-vote-option--selected" : ""
                            }`}
                          >
                            <span className="cho-vote-option__icon">🎨</span>
                            <span className="cho-vote-option__text">
                              {domdom.choPhien.lyDo.phoi_mau}
                            </span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleVote(post.id, "ton_trong_vung_mien")}
                            className={`cho-vote-option ${
                              userVote === "ton_trong_vung_mien"
                                ? "cho-vote-option--selected"
                                : ""
                            }`}
                          >
                            <span className="cho-vote-option__icon">🏔️</span>
                            <span className="cho-vote-option__text">
                              {domdom.choPhien.lyDo.ton_trong_vung_mien}
                            </span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* HIỂN THỊ SỐ LƯỢT THEO TỪNG LÝ DO DƯỚI BÀI */}
                    <div className="cho-card__stats-list" aria-label="Thống kê lượt thích theo lý do">
                      <div className="cho-stat-item">
                        <span className="cho-stat-item__label">
                          🌿 {domdom.choPhien.lyDo.hop_dip}:
                        </span>
                        <span className="cho-stat-item__val">
                          {post.binhChon.hop_dip || 0}
                        </span>
                      </div>
                      <div className="cho-stat-item">
                        <span className="cho-stat-item__label">
                          🎨 {domdom.choPhien.lyDo.phoi_mau}:
                        </span>
                        <span className="cho-stat-item__val">
                          {post.binhChon.phoi_mau || 0}
                        </span>
                      </div>
                      <div className="cho-stat-item">
                        <span className="cho-stat-item__label">
                          🏔️ {domdom.choPhien.lyDo.ton_trong_vung_mien}:
                        </span>
                        <span className="cho-stat-item__val">
                          {post.binhChon.ton_trong_vung_mien || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* MODAL: CHỌN BỘ TỪ GÙI KÝ ỨC ĐỂ ĐEM RA CHỢ */}
      {showPickFromGuiModal && (
        <div
          className="cho-gui-modal-backdrop"
          role="dialog"
          aria-modal="true"
          onClick={() => setShowPickFromGuiModal(false)}
        >
          <div className="cho-gui-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cho-gui-modal__head">
              <h2 className="cho-gui-modal__title">
                Chọn bộ từ Gùi Ký Ức để đem ra chợ
              </h2>
              <button
                type="button"
                onClick={() => setShowPickFromGuiModal(false)}
                className="cho-gui-modal__close-btn"
                title="Đóng hộp thoại"
              >
                ✕ Đóng
              </button>
            </div>

            <p className="cho-gui-modal__sub">
              Trang phục từ Gùi Ký Ức của bạn sẽ được gắn nhãn văn hóa và lý do chuẩn xác theo quy ước S6.
            </p>

            {myOutfits.length === 0 ? (
              <div className="cho-gui-modal__empty">
                <p>Gùi Ký Ức của bạn đang trống.</p>
                <p style={{ fontSize: "0.85rem", opacity: 0.8 }}>
                  Hãy vào Phòng thử đồ (S4) phối một bộ trang phục ưng ý rồi cất vào Gùi nhé!
                </p>
              </div>
            ) : (
              <div className="cho-gui-modal__list">
                {myOutfits.map((outfit) => {
                  const tp = trangPhuc.find((t) => t.id === outfit.trangPhucId) || trangPhuc[0];
                  const mau = mauSac.find((m) => m.id === outfit.mauId) || mauSac[0];

                  return (
                    <div key={outfit.id} className="cho-gui-item">
                      <div className="cho-gui-item__info">
                        <strong className="cho-gui-item__name">
                          {tp.ten}
                        </strong>
                        <span className="cho-gui-item__desc">
                          Màu: {mau.ten} • {outfit.caption || "Chưa có chú thích"}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handlePostFromGui(outfit)}
                        className="cho-gui-item__action-btn"
                      >
                        Đem ra chợ 🏮
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

const css = `
.cho-phien-screen {
  position: relative;
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  background: var(--nen-toi, #131d20);
  color: var(--nen-sang, #f5f0e6);
  font-family: var(--font-than, sans-serif);
}

.cho-phien-screen__noise {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,${noise}");
  opacity: 0.12;
  pointer-events: none;
  z-index: 1;
}

.cho-phien-screen__toast {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(19, 29, 32, 0.95);
  border: 1px solid var(--vang-nghe, #d9a441);
  color: var(--vang-nghe, #d9a441);
  padding: 10px 20px;
  border-radius: var(--vien-lech-b, 3px 12px 4px 14px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  font-size: 0.88rem;
  z-index: 100;
  text-align: center;
  max-width: 90vw;
}

/* ĐẦU TRANG */
.cho-phien-screen__header {
  position: relative;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 22px;
  border-bottom: 1px solid rgba(217, 164, 65, 0.25);
  gap: 14px;
  flex-wrap: wrap;
}

.cho-phien-screen__tag-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 4px;
  flex-wrap: wrap;
}

.cho-phien-screen__tag {
  display: inline-block;
  font-size: 0.74rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--vang-nghe, #d9a441);
}

.cho-phien-screen__demo-notice {
  display: inline-block;
  font-size: 0.76rem;
  color: #c9bfb0;
  background: rgba(255, 255, 255, 0.08);
  padding: 2px 8px;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.cho-phien-screen__title {
  font-family: var(--font-tieu-de, serif);
  font-size: 1.45rem;
  margin: 0;
  color: var(--nen-sang, #f5f0e6);
}

.cho-phien-screen__sub {
  font-size: 0.84rem;
  color: #a89f91;
  margin: 2px 0 0;
}

.cho-phien-screen__header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.cho-phien-screen__post-btn {
  padding: 8px 16px;
  background: var(--vang-nghe, #d9a441);
  color: #111a1c;
  border: 1px solid var(--vang-nghe, #d9a441);
  border-radius: var(--vien-lech-b, 3px 12px 4px 14px);
  font-size: 0.86rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cho-phien-screen__post-btn:hover {
  background: #ecc26c;
}

.cho-phien-screen__back-btn {
  padding: 8px 16px;
  background: rgba(217, 164, 65, 0.12);
  border: 1px solid var(--vang-nghe, #d9a441);
  color: var(--vang-nghe, #d9a441);
  border-radius: var(--vien-lech-b, 3px 12px 4px 14px);
  font-size: 0.86rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cho-phien-screen__back-btn:hover {
  background: var(--vang-nghe, #d9a441);
  color: #111A1D !important;
}

/* BỘ LỌC VÀ SẮP XẾP */
.cho-phien-screen__filter-bar {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 22px;
  background: var(--nen-sidebar);
  border-bottom: 1px solid var(--sidebar-border);
  flex-wrap: wrap;
}

.cho-phien-screen__filter-group {
  display: flex;
  align-items: center;
  gap: 6px;
}

.cho-phien-screen__filter-label {
  font-size: 0.78rem;
  color: var(--vang-nghe, #d9a441);
  white-space: nowrap;
}

.cho-phien-screen__filter-select {
  padding: 6px 10px;
  background: var(--nen-the);
  border: 1px solid var(--vien-the);
  border-radius: var(--vien-lech-b, 3px 12px 4px 14px);
  color: var(--nen-sang);
  font-size: 0.82rem;
  cursor: pointer;
  outline: none;
}

.cho-phien-screen__filter-select:focus {
  border-color: var(--vang-nghe, #d9a441);
}

.cho-phien-screen__sort-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
  font-size: 0.78rem;
  color: var(--chu-mo);
}

.cho-phien-screen__count-chip {
  padding: 2px 8px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  font-size: 0.72rem;
  color: var(--vang-nghe, #d9a441);
}

/* FEED & CARDS */
.cho-phien-screen__feed {
  position: relative;
  z-index: 10;
  flex: 1;
  padding: 22px;
}

.cho-phien-screen__empty-box {
  text-align: center;
  padding: 60px 20px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px dashed rgba(255, 255, 255, 0.15);
  border-radius: var(--vien-lech-a, 4px 18px 6px 20px);
  max-width: 420px;
  margin: 40px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.cho-phien-screen__empty-icon {
  font-size: 2.5rem;
  opacity: 0.7;
}

.cho-phien-screen__empty-text {
  font-family: var(--font-tieu-de, serif);
  font-size: 1rem;
  color: #ded7c6;
  font-style: italic;
  margin: 0;
}

.cho-phien-screen__reset-filter-btn {
  padding: 6px 14px;
  background: rgba(217, 164, 65, 0.15);
  border: 1px solid var(--vang-nghe, #d9a441);
  color: var(--vang-nghe, #d9a441);
  border-radius: var(--vien-lech-b, 3px 12px 4px 14px);
  font-size: 0.8rem;
  cursor: pointer;
}

.cho-phien-screen__cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

@media (max-width: 640px) {
  .cho-phien-screen__cards-grid {
    grid-template-columns: 1fr;
  }
}

/* CARD CHI TIẾT BÀI ĐĂNG */
.cho-card {
  background: linear-gradient(135deg, rgba(27, 42, 46, 0.88) 0%, rgba(18, 28, 31, 0.95) 100%);
  border: 1px solid rgba(217, 164, 65, 0.3);
  border-radius: var(--vien-lech-a, 4px 18px 6px 20px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35);
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.cho-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
}

.cho-card__author-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.cho-card__avatar-badge {
  font-size: 1.3rem;
}

.cho-card__author-name {
  font-family: var(--font-tieu-de, serif);
  font-size: 0.95rem;
  color: var(--nen-sang, #f5f0e6);
  display: flex;
  align-items: center;
  gap: 6px;
}

.cho-card__me-tag {
  font-size: 0.68rem;
  padding: 1px 6px;
  background: var(--vang-nghe, #d9a441);
  color: #111a1c;
  border-radius: 8px;
  font-weight: 600;
}

.cho-card__meta-sub {
  font-size: 0.74rem;
  color: #8c8273;
  display: flex;
  gap: 4px;
}

/* NHÃN VĂN HÓA */
.cho-label {
  display: inline-flex;
  align-items: center;
  padding: 3px 8px;
  border-radius: var(--vien-lech-b, 3px 12px 4px 14px);
  font-size: 0.72rem;
  font-weight: 600;
  white-space: nowrap;
}

.cho-label--chuan {
  background: rgba(74, 222, 128, 0.12);
  border: 1px solid #4ade80;
  color: #86efac;
}

.cho-label--sang-tao {
  background: rgba(217, 164, 65, 0.15);
  border: 1px solid var(--vang-nghe, #d9a441);
  color: var(--vang-nghe, #d9a441);
}

.cho-label--can-xem-lai {
  background: rgba(248, 113, 113, 0.12);
  border: 1px solid #f87171;
  color: #fca5a5;
}

/* KHUNG MINH HỌA */
.cho-card__preview-box {
  position: relative;
  width: 100%;
  aspect-ratio: 320 / 380;
  max-height: 380px;
  background: radial-gradient(circle, rgba(40, 56, 60, 0.6) 0%, rgba(16, 24, 26, 0.9) 100%);
  border-radius: var(--vien-lech-b, 3px 12px 4px 14px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cho-card__svg {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.cho-card__costume-pill {
  position: absolute;
  bottom: 8px;
  left: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  background: rgba(19, 29, 32, 0.85);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
}

.cho-card__costume-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.4);
}

.cho-card__costume-title {
  font-size: 0.72rem;
  color: #e6dfd1;
}

/* NỘI DUNG */
.cho-card__content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.cho-card__caption {
  font-size: 0.86rem;
  line-height: 1.5;
  color: #ded7c6;
  margin: 0;
}

.cho-card__reason-box {
  padding: 8px 10px;
  background: rgba(0, 0, 0, 0.25);
  border-left: 2px solid var(--vang-nghe, #d9a441);
  border-radius: var(--vien-lech-b, 3px 12px 4px 14px);
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.cho-card__reason-title {
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--vang-nghe, #d9a441);
  opacity: 0.9;
}

.cho-card__reason-text {
  font-size: 0.78rem;
  color: #b5ad9e;
  line-height: 1.4;
  margin: 0;
}

/* BÌNH CHỌN CÓ LÝ DO */
.cho-card__vote-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.cho-card__vote-action-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.cho-card__like-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: rgba(217, 164, 65, 0.12);
  border: 1px solid var(--vang-nghe, #d9a441);
  color: var(--vang-nghe, #d9a441);
  border-radius: var(--vien-lech-b, 3px 12px 4px 14px);
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
}

.cho-card__like-btn:hover {
  background: var(--vang-nghe, #d9a441);
  color: #111a1c;
}

.cho-card__voted-badge-group {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.cho-card__voted-chip {
  font-size: 0.75rem;
  color: var(--vang-nghe, #d9a441);
  background: rgba(217, 164, 65, 0.15);
  padding: 4px 8px;
  border-radius: 12px;
}

.cho-card__change-vote-btn {
  background: none;
  border: none;
  color: #ded7c6;
  font-size: 0.72rem;
  text-decoration: underline;
  cursor: pointer;
  padding: 0;
}

.cho-card__cancel-vote-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #ff9999;
  font-size: 0.8rem;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* POPUP CHỌN LÝ DO */
.cho-vote-popup {
  background: rgba(19, 29, 32, 0.98);
  border: 1px solid var(--vang-nghe, #d9a441);
  border-radius: var(--vien-lech-b, 3px 12px 4px 14px);
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.4);
}

.cho-vote-popup__head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cho-vote-popup__title {
  font-size: 0.78rem;
  color: var(--vang-nghe, #d9a441);
  font-weight: 600;
}

.cho-vote-popup__close-btn {
  background: none;
  border: none;
  color: #a89f91;
  font-size: 0.8rem;
  cursor: pointer;
}

.cho-vote-popup__options {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.cho-vote-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: var(--vien-lech-b, 3px 12px 4px 14px);
  color: #ded7c6;
  font-size: 0.78rem;
  cursor: pointer;
  text-align: left;
  transition: all 0.15s ease;
}

.cho-vote-option:hover {
  background: rgba(217, 164, 65, 0.12);
  border-color: var(--vang-nghe, #d9a441);
  color: var(--vang-nghe, #d9a441);
}

.cho-vote-option--selected {
  background: rgba(217, 164, 65, 0.25);
  border-color: var(--vang-nghe, #d9a441);
  color: var(--vang-nghe, #d9a441);
  font-weight: 600;
}

/* THỐNG KÊ LÝ DO */
.cho-card__stats-list {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 6px 8px;
  background: rgba(0, 0, 0, 0.18);
  border-radius: var(--vien-lech-b, 3px 12px 4px 14px);
}

.cho-stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.74rem;
}

.cho-stat-item__label {
  color: #a89f91;
}

.cho-stat-item__val {
  color: var(--vang-nghe, #d9a441);
  font-weight: 600;
}

/* MODAL CHỌN TỪ GÙI */
.cho-gui-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 120;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.cho-gui-modal {
  width: 100%;
  max-width: 520px;
  max-height: 85vh;
  overflow-y: auto;
  background: var(--nen-the);
  border: 1px solid var(--vien-the);
  border-radius: var(--vien-lech-a, 4px 18px 6px 20px);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: var(--shadow-the);
  color: var(--nen-sang);
}

.cho-gui-modal__head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cho-gui-modal__title {
  font-family: var(--font-tieu-de, serif);
  font-size: 1.15rem;
  margin: 0;
  color: var(--vang-nghe, #d9a441);
}

.cho-gui-modal__close-btn {
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

.cho-gui-modal__close-btn:hover {
  background: #FEE2E2;
  border-color: #FCA5A5;
  color: #B91C1C;
}

.cho-gui-modal__sub {
  font-size: 0.8rem;
  color: #b5ad9e;
  margin: 0;
  line-height: 1.45;
}

.cho-gui-modal__empty {
  text-align: center;
  padding: 30px 10px;
  color: #a89f91;
}

.cho-gui-modal__list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.cho-gui-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--vien-lech-b, 3px 12px 4px 14px);
}

.cho-gui-item__info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}

.cho-gui-item__name {
  font-size: 0.9rem;
  color: var(--nen-sang, #f5f0e6);
}

.cho-gui-item__desc {
  font-size: 0.76rem;
  color: #a89f91;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.cho-gui-item__action-btn {
  padding: 6px 12px;
  background: var(--vang-nghe, #d9a441);
  color: #111a1c;
  border: 1px solid var(--vang-nghe, #d9a441);
  border-radius: var(--vien-lech-b, 3px 12px 4px 14px);
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
}

.cho-gui-item__action-btn:hover {
  background: #ecc26c;
}
`;
