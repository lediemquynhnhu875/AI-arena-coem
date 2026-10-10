/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from "react";
import AvatarSVG from "../components/AvatarSVG";
import { CulturalPatternsDefs, renderGarmentLayers } from "../components/GarmentLayers";
import { NhanVatConfig, tinhSoDo, NHAN_VAT_MAC_DINH } from "../lib/avatar";
import { trangPhuc } from "../data/trangphuc";
import { mauSac } from "../data/mausac";
import { phuKien } from "../data/phukien";
import { evaluateColor, evaluateRemix } from "../lib/rules";
import { domdom } from "../copy/domdom";
import AppFooter from "../components/AppFooter";
import {
  OutfitSaved,
  docDanhSachGuiKyUc,
  xoaKhoiGuiKyUc,
  capNhatCaptionGuiKyUc,
  xuatThePNG,
  SAMPLE_OUTFIT,
  luuVaoGuiKyUc,
  goiYCaptionGemini,
  MAX_OUTFITS,
} from "../lib/guiKyUc";
import { dangBaiLenChoPhien } from "../lib/choPhien";
import { layHoSoHienTai, HoSo } from "../lib/hoSo";
import { ThoiTietState } from "../lib/thoitiet";
import { QueNhaData } from "../types";
import { keTomTatSoSanh, TT_LABEL } from "../lib/loiKe";
import GuiKyUcPose from "../narrator/poses/GuiKyUcPose";

interface Props {
  onBack: () => void;
  onWearOutfit: (outfit: OutfitSaved) => void;
  globalNhanVatConfig?: NhanVatConfig;
  onOpenChoPhien?: () => void;
  onOpenChaoBan?: () => void;
  weatherState?: ThoiTietState;
  queNhaData?: QueNhaData;
}

const noise = encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .95  0 0 0 0 .92  0 0 0 0 .85  0 0 0 .55 0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`
);

export default function GuiKyUcScreen({
  onBack,
  onWearOutfit,
  globalNhanVatConfig,
  onOpenChoPhien,
  onOpenChaoBan,
  weatherState,
  queNhaData,
}: Props) {
  const [hoSo, setHoSo] = useState<HoSo>(() => layHoSoHienTai());
  const [outfits, setOutfits] = useState<OutfitSaved[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCaption, setEditCaption] = useState("");
  const [loadingGeminiId, setLoadingGeminiId] = useState<string | null>(null);
  const [exportingId, setExportingId] = useState<string | null>(null);
  const [exportToast, setExportToast] = useState<string | null>(null);

  const handleDemRaCho = (outfit: OutfitSaved) => {
    const res = dangBaiLenChoPhien(outfit);
    setExportToast(res.message);
    setTimeout(() => setExportToast(null), 3500);
    if (onOpenChoPhien) {
      setTimeout(() => onOpenChoPhien(), 700);
    }
  };

  // Chọn 2 bộ bất kỳ để so sánh
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);

  // Lưu trữ tham chiếu SVG của từng bộ đồ để xuất PNG
  const svgRefs = useRef<Record<string, SVGSVGElement | null>>({});

  useEffect(() => {
    const list = docDanhSachGuiKyUc();
    setOutfits(list);

    const handleOutfitsChange = () => {
      setOutfits(docDanhSachGuiKyUc());
      setHoSo(layHoSoHienTai());
    };

    const handleProfileChange = (e: Event) => {
      const customEvent = e as CustomEvent<HoSo>;
      if (customEvent.detail) {
        setHoSo(customEvent.detail);
      } else {
        setHoSo(layHoSoHienTai());
      }
      setOutfits(docDanhSachGuiKyUc());
    };

    window.addEventListener("vpr:outfits-change", handleOutfitsChange);
    window.addEventListener("vpr:profile-change", handleProfileChange);
    return () => {
      window.removeEventListener("vpr:outfits-change", handleOutfitsChange);
      window.removeEventListener("vpr:profile-change", handleProfileChange);
    };
  }, []);

  const handleToggleCompare = (id: string) => {
    setSelectedForCompare((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 3) {
        // Thay thế bộ thứ ba nếu đã chọn đủ 3 bộ
        return [prev[0], prev[1], id];
      }
      return [...prev, id];
    });
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`${domdom.guiKyUc.xacNhanXoa}\n("${name}")`)) {
      const updated = xoaKhoiGuiKyUc(id);
      setOutfits(updated);
      setSelectedForCompare((prev) => prev.filter((item) => item !== id));
      if (editingId === id) setEditingId(null);
    }
  };

  const handleStartEdit = (outfit: OutfitSaved) => {
    setEditingId(outfit.id);
    setEditCaption(outfit.caption);
  };

  const handleSaveEdit = (id: string) => {
    const updated = capNhatCaptionGuiKyUc(id, editCaption);
    setOutfits(updated);
    setEditingId(null);
  };

  const handleGeminiForEdit = async (outfit: OutfitSaved) => {
    setLoadingGeminiId(outfit.id);
    const tpObj = trangPhuc.find((t) => t.id === outfit.trangPhucId);
    const mauObj = mauSac.find((m) => m.id === outfit.mauId);
    const tenPkList = outfit.phuKienIds.map(
      (pkId) => phuKien.find((p) => p.id === pkId)?.ten ?? pkId
    );

    try {
      const suggested = await goiYCaptionGemini({
        tenTrangPhuc: tpObj?.ten ?? outfit.trangPhucId,
        tenMau: mauObj?.ten ?? outfit.mauId,
        tenPhuKienList: tenPkList,
      });
      setEditCaption(suggested);
    } catch {
      setEditCaption("");
    } finally {
      setLoadingGeminiId(null);
    }
  };

  // Xuất thẻ PNG từ SVG qua Canvas
  const handleExportCard = async (outfit: OutfitSaved) => {
    const svgEl = svgRefs.current[outfit.id];
    if (!svgEl) {
      alert("Không tìm thấy mẫu vẽ nhân vật để in thẻ.");
      return;
    }

    setExportingId(outfit.id);
    const tpObj = trangPhuc.find((t) => t.id === outfit.trangPhucId);
    const mauObj = mauSac.find((m) => m.id === outfit.mauId);
    const tenPkList = outfit.phuKienIds.map(
      (pkId) => phuKien.find((p) => p.id === pkId)?.ten ?? pkId
    );

    const moTaPhu = `${mauObj?.ten ?? ""}${
      tenPkList.length > 0 ? ` · ${tenPkList.join(", ")}` : ""
    }`;

    const success = await xuatThePNG({
      svgElement: svgEl,
      tenBoDo: tpObj?.ten ?? "Việt Phục",
      moTaPhu,
      caption: outfit.caption,
      fileName: tpObj?.ten ?? "the_gui_ky_uc",
    });

    setExportingId(null);
    if (success) {
      setExportToast(`Đã xuất thẻ "${tpObj?.ten ?? "Việt Phục"}" thành công!`);
      setTimeout(() => setExportToast(null), 3500);
    }
  };

  const handleResetSample = () => {
    luuVaoGuiKyUc(SAMPLE_OUTFIT);
    setOutfits(docDanhSachGuiKyUc());
  };

  // 2 bộ được chọn để so sánh
  const compareOutfits = useMemo(() => {
    if (selectedForCompare.length < 2) return null;
    const first = outfits.find((o) => o.id === selectedForCompare[0]);
    const second = outfits.find((o) => o.id === selectedForCompare[1]);
    if (first && second) {
      return [first, second] as const;
    }
    return null;
  }, [selectedForCompare, outfits]);

  return (
    <main className="gui-screen">
      <style>{css}</style>
      <div className="gui-screen__noise" aria-hidden="true" />

      {/* Thông báo xuất thẻ thành công */}
      {exportToast && (
        <div className="gui-screen__toast" role="status">
          <span>✨ {exportToast}</span>
        </div>
      )}

      {/* Header */}
      <header className="gui-screen__header">
        <div className="flex items-center gap-3">
          <GuiKyUcPose size={64} animate={true} />
          <div>
            <h1 className="gui-screen__brand-name">
              {domdom.guiKyUc.tieuDeTrang}
              <span style={{ fontSize: "0.85rem", opacity: 0.8, fontWeight: "normal", marginLeft: "10px" }}>
                ({hoSo.laKhach ? "🍃 " : "👤 "}{hoSo.tenHienThi})
              </span>
            </h1>
          </div>
        </div>

        <div className="gui-screen__header-actions">
          <span className="gui-screen__count-badge">
            🎒 {outfits.length}/{MAX_OUTFITS} bộ
          </span>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("vpr:open-nhat-ky"))}
            className="gui-screen__back-btn"
            style={{ borderColor: "#10b981", color: "#10b981" }}
            title="Mở Nhật Ký Trải Nghiệm & Cảm Xúc"
          >
            📖 Nhật Ký
          </button>
          {onOpenChoPhien && (
            <button
              type="button"
              onClick={onOpenChoPhien}
              className="gui-screen__back-btn"
              style={{ borderColor: "var(--vang-nghe)", color: "var(--vang-nghe)" }}
              title="Mở màn hình Chợ Phiên"
            >
              🏮 {domdom.choPhien.tieuDe}
            </button>
          )}
          <button
            type="button"
            onClick={onBack}
            className="gui-screen__back-btn"
          >
            ← {domdom.common.back}
          </button>
        </div>
      </header>

      <div className="gui-screen__body">
        {/* Lời tựa Gùi Ký Ức */}
        <section className="gui-screen__intro">
          <p className="gui-screen__intro-quote">
            "{domdom.guiKyUc.moTaGui}"
          </p>
          <div className="gui-screen__intro-sub">
            <span>
              Lưu giữ tối đa 6 bộ trang phục bạn yêu thích cùng những dòng cảm nghĩ riêng tư.
            </span>
          </div>
        </section>

        {/* ============================================================== */}
        {/* KHỐI SO SÁNH 2 BỘ (HIỆN KHI ĐÃ CHỌN 2 BỘ)                      */}
        {/* ============================================================== */}
        {compareOutfits && (
          <section className="gui-compare-panel" aria-labelledby="gui-compare-title">
            <div className="gui-compare-panel__head">
              <div className="gui-compare-panel__title-wrap">
                <span className="gui-compare-panel__icon">⚖️</span>
                <h2 id="gui-compare-title" className="gui-compare-panel__title">
                  {domdom.guiKyUc.soSanhHaiBo}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedForCompare([])}
                className="gui-compare-panel__close-btn"
              >
                {domdom.guiKyUc.dongSoSanh} ✕
              </button>
            </div>

            <p className="gui-compare-panel__desc">
              {domdom.guiKyUc.huongDanSoSanh}
            </p>

            <div className="gui-compare-panel__grid">
              {compareOutfits.map((item, idx) => {
                const tpObj =
                  trangPhuc.find((t) => t.id === item.trangPhucId) ?? trangPhuc[0];
                const mauObj =
                  mauSac.find((m) => m.id === item.mauId) ?? mauSac[0];
                const pkObjs = item.phuKienIds.map(
                  (pkId) => phuKien.find((p) => p.id === pkId) ?? { id: pkId, ten: pkId }
                );

                const charConfig =
                  item.nhanVatConfig ?? globalNhanVatConfig ?? NHAN_VAT_MAC_DINH;
                const soDo = tinhSoDo(charConfig);
                const garmentLayers = renderGarmentLayers({
                  trangPhucId: item.trangPhucId,
                  soDo,
                  mauHex: mauObj.hex,
                  phuKienIds: item.phuKienIds,
                  hoaVanThem: item.hoaVanThem,
                  phongCach: item.phongCach,
                });

                // Hai huy hiệu từ S6
                const colorEval = evaluateColor(item.mauId, item.phuKienIds);
                const remixEval = evaluateRemix({
                  trangPhucId: item.trangPhucId,
                  mauId: item.mauId,
                  phuKienIds: item.phuKienIds,
                  hoaVanThem: item.hoaVanThem,
                });

                return (
                  <div key={item.id} className="gui-compare-col">
                    <div className="gui-compare-col__tag">
                      Bộ {idx === 0 ? "A" : "B"}
                    </div>

                    {/* Nhân vật */}
                    <div className="gui-compare-col__avatar">
                      <AvatarSVG
                        nhanVat={charConfig}
                        childrenDefs={<CulturalPatternsDefs />}
                        childrenVayQuan={garmentLayers.childrenVayQuan}
                        childrenAo={garmentLayers.childrenAo}
                        childrenPhuKienThan={garmentLayers.childrenPhuKienThan}
                        childrenTocTruocKhanNon={garmentLayers.childrenTocTruocKhanNon}
                      />
                    </div>

                    {/* Tên bộ đồ */}
                    <h3 className="gui-compare-col__name">{tpObj.ten}</h3>

                    {/* Màu sắc */}
                    <div className="gui-compare-col__detail-row">
                      <span className="gui-compare-col__label">Màu sắc:</span>
                      <span className="gui-compare-col__color-tag">
                        <span
                          className="gui-compare-col__swatch"
                          style={{ backgroundColor: mauObj.hex }}
                        />
                        {mauObj.ten}
                      </span>
                    </div>

                    {/* Phụ kiện */}
                    <div className="gui-compare-col__detail-row">
                      <span className="gui-compare-col__label">Phụ kiện:</span>
                      <span className="gui-compare-col__val">
                        {pkObjs.length > 0
                          ? pkObjs.map((p) => p.ten).join(", ")
                          : "Không kèm phụ kiện"}
                      </span>
                    </div>

                    {/* Huy hiệu 1 từ S6: Màu sắc */}
                    <div className="gui-compare-col__badge-box">
                      <div className="gui-badge-title">
                        <span className="gui-badge-dot" />
                        <span>Huy hiệu Màu sắc:</span>{" "}
                        <strong className={`gui-badge-tag gui-badge-tag--${colorEval.ketQua}`}>
                          {colorEval.nhanHienThi}
                        </strong>
                      </div>
                      <p className="gui-badge-lydo">{colorEval.lyDo}</p>
                    </div>

                    {/* Huy hiệu 2 từ S6: Văn hóa */}
                    <div className="gui-compare-col__badge-box">
                      <div className="gui-badge-title">
                        <span className="gui-badge-dot" />
                        <span>Huy hiệu Văn hóa:</span>{" "}
                        <strong className={`gui-badge-tag gui-badge-tag--${remixEval.nhan}`}>
                          {remixEval.nhanHienThi}
                        </strong>
                      </div>
                      <p className="gui-badge-lydo">{remixEval.lyDo}</p>
                    </div>

                    {/* Chú thích */}
                    {item.caption && (
                      <div className="gui-compare-col__caption">
                        "{item.caption}"
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ============================================================== */}
        {/* DANH SÁCH TỐI ĐA 6 BỘ TRONG GÙI                                */}
        {/* ============================================================== */}
        {outfits.length === 0 ? (
          <div className="gui-empty-box">
            <div className="gui-empty-box__icon">🎒</div>
            <p className="gui-empty-box__text">{domdom.guiKyUc.chuaCoBoNao}</p>
            <button
              type="button"
              onClick={handleResetSample}
              className="gui-btn gui-btn--primary"
            >
              ✦ Nạp lại bộ mẫu ({SAMPLE_OUTFIT.caption.slice(0, 20)}...)
            </button>
          </div>
        ) : (
          <div className="gui-cards-grid">
            {outfits.map((item) => {
              const tpObj =
                trangPhuc.find((t) => t.id === item.trangPhucId) ?? trangPhuc[0];
              const mauObj =
                mauSac.find((m) => m.id === item.mauId) ?? mauSac[0];
              const pkObjs = item.phuKienIds.map(
                (pkId) => phuKien.find((p) => p.id === pkId) ?? { id: pkId, ten: pkId }
              );

              const charConfig =
                item.nhanVatConfig ?? globalNhanVatConfig ?? NHAN_VAT_MAC_DINH;
              const soDo = tinhSoDo(charConfig);
              const garmentLayers = renderGarmentLayers({
                trangPhucId: item.trangPhucId,
                soDo,
                mauHex: mauObj.hex,
                phuKienIds: item.phuKienIds,
                hoaVanThem: item.hoaVanThem,
                phongCach: item.phongCach,
              });

              const isComparing = selectedForCompare.includes(item.id);
              const isEditing = editingId === item.id;
              const isExporting = exportingId === item.id;

              return (
                <article
                  key={item.id}
                  className={`gui-card ${isComparing ? "gui-card--comparing" : ""}`}
                >
                  {/* Khung avatar SVG (Đồng thời là nguồn để xuất Canvas PNG) */}
                  <div className="gui-card__avatar-wrap">
                    <svg
                      ref={(el) => {
                        svgRefs.current[item.id] = el;
                      }}
                      viewBox="0 0 400 560"
                      className="gui-card__avatar-svg"
                    >
                      <AvatarSVG
                        nhanVat={charConfig}
                        childrenDefs={<CulturalPatternsDefs />}
                        childrenVayQuan={garmentLayers.childrenVayQuan}
                        childrenAo={garmentLayers.childrenAo}
                        childrenPhuKienThan={garmentLayers.childrenPhuKienThan}
                        childrenTocTruocKhanNon={garmentLayers.childrenTocTruocKhanNon}
                      />
                    </svg>
                  </div>

                  {/* Chi tiết trang phục */}
                  <div className="gui-card__content">
                    <div className="gui-card__header">
                      <h2 className="gui-card__name">{tpObj.ten}</h2>
                      <span className="gui-card__date">
                        {new Date(item.taoLuc).toLocaleDateString("vi-VN")}
                      </span>
                    </div>

                    <div className="gui-card__meta">
                      <span className="gui-card__meta-item">
                        <span
                          className="gui-card__swatch"
                          style={{ backgroundColor: mauObj.hex }}
                        />
                        {mauObj.ten}
                      </span>
                      {pkObjs.length > 0 && (
                        <span className="gui-card__meta-item">
                          · {pkObjs.map((p) => p.ten).join(", ")}
                        </span>
                      )}
                    </div>

                    {/* Chú thích (Xem hoặc chỉnh sửa) */}
                    <div className="gui-card__caption-box">
                      {isEditing ? (
                        <div className="gui-edit-caption">
                          <textarea
                            value={editCaption}
                            onChange={(e) =>
                              setEditCaption(e.target.value.slice(0, 140))
                            }
                            rows={2}
                            maxLength={140}
                            className="gui-edit-caption__input"
                            placeholder="Nhập chú thích tối đa 140 ký tự..."
                          />
                          <div className="gui-edit-caption__actions">
                            <button
                              type="button"
                              onClick={() => handleGeminiForEdit(item)}
                              disabled={loadingGeminiId === item.id}
                              className="gui-btn-mini gui-btn-mini--gemini"
                            >
                              ✨ {loadingGeminiId === item.id ? "Đang gợi ý..." : "Nhờ Cò Em"}
                            </button>
                            <div className="gui-edit-caption__save-wrap">
                              <button
                                type="button"
                                onClick={() => setEditingId(null)}
                                className="gui-btn-mini"
                              >
                                Hủy
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSaveEdit(item.id)}
                                className="gui-btn-mini gui-btn-mini--primary"
                              >
                                {domdom.guiKyUc.luuChuThich}
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="gui-card__caption">
                          "{item.caption || "Một nếp áo kỷ niệm trong gùi."}"
                        </p>
                      )}
                    </div>

                    {/* Hàng nút tác vụ */}
                    <div className="gui-card__actions">
                      <button
                        type="button"
                        onClick={() => handleToggleCompare(item.id)}
                        className={`gui-action-btn ${
                          isComparing ? "gui-action-btn--active" : ""
                        }`}
                        title={
                          isComparing
                            ? domdom.guiKyUc.dangChonSoSanh
                            : domdom.guiKyUc.chonSoSanh
                        }
                      >
                        ⚖️ {isComparing ? domdom.guiKyUc.dangChonSoSanh : domdom.guiKyUc.chonSoSanh}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleExportCard(item)}
                        disabled={isExporting}
                        className="gui-action-btn gui-action-btn--export"
                        title="Tạo ảnh PNG từ SVG qua canvas và tải về"
                      >
                        {isExporting ? "⏳ Đang vẽ thẻ..." : "🖼️ " + domdom.guiKyUc.xuatThePNG}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDemRaCho(item)}
                        className="gui-action-btn"
                        style={{ borderColor: "var(--vang-nghe)", color: "var(--vang-nghe)" }}
                        title="Đem bộ trang phục này ra Chợ Phiên"
                      >
                        🏮 {domdom.choPhien.nutDemRaCho}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          isEditing ? setEditingId(null) : handleStartEdit(item)
                        }
                        className="gui-action-btn"
                      >
                        ✏️ {domdom.guiKyUc.suaChuThich}
                      </button>

                      <button
                        type="button"
                        onClick={() => onWearOutfit(item)}
                        className="gui-action-btn gui-action-btn--wear"
                      >
                        👗 {domdom.guiKyUc.macLaiBoNay}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(item.id, tpObj.ten)}
                        className="gui-action-btn gui-action-btn--delete"
                        title={domdom.guiKyUc.xoaKhoiGui}
                      >
                        🗑️ {domdom.guiKyUc.xoaKhoiGui}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      <AppFooter />
    </main>
  );
}

const css = `
.gui-screen {
  position: relative;
  min-height: 100vh;
  background-color: var(--nen-toi);
  color: var(--nen-sang);
  font-family: var(--font-than);
  overflow-x: hidden;
  padding-bottom: 40px;
}

.gui-screen__noise {
  position: fixed;
  inset: 0;
  background-image: url("data:image/svg+xml;utf8,${noise}");
  opacity: 0.12;
  pointer-events: none;
  z-index: 1;
}

.gui-screen__toast {
  position: fixed;
  top: 18px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 70;
  padding: 8px 18px;
  background: var(--dat-nung);
  color: var(--nen-sang);
  border-radius: var(--vien-lech-a);
  font-size: 0.84rem;
  font-weight: 500;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
  animation: popToast 0.3s ease-out;
}

@keyframes popToast {
  from {
    opacity: 0;
    transform: translate(-50%, -10px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}

.gui-screen__header {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid rgba(138, 129, 117, 0.25);
  background: rgba(27, 42, 46, 0.85);
  backdrop-filter: blur(8px);
}

.gui-screen__brand-sub {
  display: block;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--tro-tram);
}

.gui-screen__brand-name {
  margin: 2px 0 0;
  font-family: var(--font-tieu-de);
  font-size: 1.35rem;
  color: var(--vang-nghe);
}

.gui-screen__header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.gui-screen__count-badge {
  font-size: 0.8rem;
  color: var(--vang-nghe);
  padding: 5px 10px;
  background: rgba(217, 164, 65, 0.15);
  border: 1px solid rgba(217, 164, 65, 0.35);
  border-radius: var(--vien-lech-b);
}

.gui-screen__back-btn {
  padding: 7px 14px;
  background: transparent;
  border: 1px solid rgba(138, 129, 117, 0.4);
  border-radius: var(--vien-lech-b);
  color: var(--nen-sang);
  font-size: 0.82rem;
  cursor: pointer;
  transition: all var(--nhip-cham) ease;
}

.gui-screen__back-btn:hover {
  border-color: var(--vang-nghe);
  color: var(--vang-nghe);
}

.gui-screen__body {
  position: relative;
  z-index: 2;
  max-width: 1080px;
  margin: 0 auto;
  padding: 24px 20px 40px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.gui-screen__intro {
  text-align: center;
  padding: 12px 16px;
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(138, 129, 117, 0.25);
  border-radius: var(--vien-lech-a);
}

.gui-screen__intro-quote {
  margin: 0;
  font-family: var(--font-tieu-de);
  font-style: italic;
  font-size: 1.05rem;
  color: var(--vang-nghe);
}

.gui-screen__intro-sub {
  margin-top: 4px;
  font-size: 0.78rem;
  color: var(--tro-tram);
}

/* ================= SO SÁNH ================= */
.gui-compare-panel {
  padding: 18px 20px;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid var(--vang-nghe);
  border-radius: var(--vien-lech-a);
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}

.gui-compare-panel__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.gui-compare-panel__title-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}

.gui-compare-panel__icon {
  font-size: 1.3rem;
}

.gui-compare-panel__title {
  margin: 0;
  font-family: var(--font-tieu-de);
  font-size: 1.15rem;
  color: var(--vang-nghe);
}

.gui-compare-panel__close-btn {
  background: transparent;
  border: 1px solid rgba(138, 129, 117, 0.4);
  color: var(--tro-tram);
  padding: 4px 10px;
  border-radius: var(--vien-lech-b);
  font-size: 0.76rem;
  cursor: pointer;
}

.gui-compare-panel__close-btn:hover {
  color: var(--nen-sang);
  border-color: var(--nen-sang);
}

.gui-compare-panel__desc {
  margin: 6px 0 16px;
  font-size: 0.78rem;
  color: var(--tro-tram);
}

.gui-compare-panel__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.gui-compare-col {
  padding: 14px 16px;
  background: rgba(27, 42, 46, 0.6);
  border: 1px solid rgba(217, 164, 65, 0.3);
  border-radius: var(--vien-lech-b);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.gui-compare-col__tag {
  align-self: flex-start;
  font-size: 0.72rem;
  padding: 3px 8px;
  background: rgba(217, 164, 65, 0.2);
  color: var(--vang-nghe);
  border-radius: var(--vien-lech-b);
  font-weight: 600;
}

.gui-compare-col__avatar {
  width: 140px;
  height: 190px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.gui-compare-col__name {
  margin: 0;
  font-family: var(--font-tieu-de);
  font-size: 1.05rem;
  color: var(--nen-sang);
  text-align: center;
}

.gui-compare-col__detail-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.8rem;
  padding: 4px 0;
  border-bottom: 1px solid rgba(138, 129, 117, 0.15);
}

.gui-compare-col__label {
  color: var(--tro-tram);
}

.gui-compare-col__val {
  color: var(--nen-sang);
}

.gui-compare-col__color-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--nen-sang);
}

.gui-compare-col__swatch {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.gui-compare-col__badge-box {
  padding: 8px 10px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(138, 129, 117, 0.25);
  border-radius: var(--vien-lech-b);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.gui-badge-title {
  font-size: 0.76rem;
  color: var(--tro-tram);
  display: flex;
  align-items: center;
  gap: 6px;
}

.gui-badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--vang-nghe);
}

.gui-badge-tag {
  color: var(--nen-sang);
  font-weight: 600;
}

.gui-badge-tag--hai_hoa,
.gui-badge-tag--chuan_dung {
  color: #6ee7b7;
}

.gui-badge-tag--can_can_bang,
.gui-badge-tag--can_xem_lai {
  color: #fca5a5;
}

.gui-badge-tag--sang_tao_tu_do {
  color: var(--vang-nghe);
}

.gui-badge-lydo {
  margin: 0;
  font-size: 0.72rem;
  color: var(--tro-tram);
  line-height: 1.35;
}

.gui-compare-col__caption {
  font-size: 0.78rem;
  font-style: italic;
  color: var(--nen-sang);
  text-align: center;
  padding: 6px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: var(--vien-lech-b);
}

/* ================= DANH SÁCH THẺ ================= */
.gui-empty-box {
  text-align: center;
  padding: 48px 24px;
  background: rgba(0, 0, 0, 0.25);
  border: 1px dashed rgba(138, 129, 117, 0.35);
  border-radius: var(--vien-lech-a);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.gui-empty-box__icon {
  font-size: 2.8rem;
}

.gui-empty-box__text {
  margin: 0;
  font-size: 0.95rem;
  color: var(--tro-tram);
  max-width: 420px;
}

.gui-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.gui-card {
  display: flex;
  flex-direction: column;
  background: var(--nen-the);
  border: 1px solid var(--vien-the);
  border-radius: var(--vien-lech-a);
  overflow: hidden;
  box-shadow: var(--shadow-the);
  transition: all var(--nhip-cham) ease;
}

.gui-card:hover {
  border-color: var(--vang-nghe);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.2);
}

.gui-card--comparing {
  border-color: var(--vang-nghe);
  box-shadow: 0 0 0 2px rgba(217, 164, 65, 0.4);
}

.gui-card__avatar-wrap {
  width: 100%;
  height: 240px;
  background: var(--nen-the-phu);
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid var(--vien-the);
  padding: 12px 0;
}

.gui-card__avatar-svg {
  height: 100%;
  max-width: 100%;
}

.gui-card__content {
  padding: 14px 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
}

.gui-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}

.gui-card__name {
  margin: 0;
  font-family: var(--font-tieu-de);
  font-size: 1.05rem;
  color: var(--vang-nghe);
}

.gui-card__date {
  font-size: 0.7rem;
  color: var(--tro-tram);
}

.gui-card__meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.78rem;
  color: var(--tro-tram);
}

.gui-card__meta-item {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.gui-card__swatch {
  width: 11px;
  height: 11px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.gui-card__caption-box {
  min-height: 48px;
  padding: 8px 10px;
  background: var(--nen-the-phu);
  border: 1px solid var(--vien-the);
  border-radius: var(--vien-lech-b);
}

.gui-card__caption {
  margin: 0;
  font-size: 0.8rem;
  font-style: italic;
  line-height: 1.4;
  color: var(--nen-sang);
}

/* Chỉnh sửa chú thích */
.gui-edit-caption {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.gui-edit-caption__input {
  width: 100%;
  box-sizing: border-box;
  padding: 6px 8px;
  background: var(--nen-the);
  border: 1px solid var(--vang-nghe);
  border-radius: var(--vien-lech-b);
  color: var(--nen-sang);
  font-family: var(--font-than);
  font-size: 0.8rem;
  resize: none;
  outline: none;
}

.gui-edit-caption__actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
}

.gui-edit-caption__save-wrap {
  display: flex;
  gap: 6px;
}

.gui-btn-mini {
  padding: 4px 8px;
  font-size: 0.72rem;
  background: transparent;
  border: 1px solid rgba(138, 129, 117, 0.4);
  border-radius: var(--vien-lech-b);
  color: var(--nen-sang);
  cursor: pointer;
}

.gui-btn-mini--primary {
  background: var(--dat-nung);
  border-color: transparent;
}

.gui-btn-mini--gemini {
  color: var(--vang-nghe);
  border-color: rgba(217, 164, 65, 0.4);
}

/* Các nút tác vụ */
.gui-card__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: auto;
  padding-top: 8px;
  border-top: 1px solid rgba(138, 129, 117, 0.2);
}

.gui-action-btn {
  font-size: 0.72rem;
  padding: 5px 8px;
  background: var(--nen-the-phu);
  border: 1px solid var(--vien-the);
  border-radius: var(--vien-lech-b);
  color: var(--nen-sang);
  cursor: pointer;
  transition: all var(--nhip-cham) ease;
}

.gui-action-btn:hover {
  border-color: var(--vang-nghe);
  background: rgba(217, 164, 65, 0.1);
}

.gui-action-btn--active {
  border-color: var(--vang-nghe);
  background: rgba(217, 164, 65, 0.25);
  color: var(--vang-nghe);
  font-weight: 600;
}

.gui-action-btn--export {
  color: var(--vang-nghe);
}

.gui-action-btn--wear {
  background: rgba(184, 75, 41, 0.15);
  border-color: rgba(184, 75, 41, 0.4);
  color: #ffaa90;
}

.gui-action-btn--wear:hover {
  background: var(--dat-nung);
  color: var(--nen-sang);
}

.gui-action-btn--delete {
  color: #fca5a5;
  margin-left: auto;
}

.gui-action-btn--delete:hover {
  background: rgba(239, 68, 68, 0.2);
}

.gui-btn {
  padding: 8px 16px;
  border-radius: var(--vien-lech-b);
  font-size: 0.84rem;
  font-weight: 600;
  cursor: pointer;
}

.gui-btn--primary {
  background: var(--dat-nung);
  border: none;
  color: var(--nen-sang);
}

@media (max-width: 640px) {
  .gui-compare-panel__grid {
    grid-template-columns: 1fr;
  }
}
`;
