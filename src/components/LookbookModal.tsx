/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * TẠO & CHIA SẺ LOOKBOOK VIỆT PHỤC (EDITORIAL LOOKBOOK GENERATOR & SHARING LOGIC)
 * Cung cấp:
 * 1. Web Share API & Sao chép liên kết chia sẻ động kèm thông số outfit
 * 2. Xuất và tải ảnh thẻ Lookbook chất lượng cao dạng PNG bằng Canvas 2D
 * 3. Chia sẻ 1-chạm lên Facebook, X (Twitter) hoặc tin nhắn
 * 4. Cất giữ vào Gùi Ký Ức & Lưu trữ thông tin nhà thiết kế
 */

import React, { useState, useRef } from "react";
import {
  X,
  Share2,
  Bookmark,
  Check,
  Sparkles,
  Download,
  Copy,
  Feather,
  ShieldCheck,
  Palette,
  ExternalLink,
  QrCode,
} from "lucide-react";
import { trangPhuc } from "../data/trangphuc";
import { mauSac } from "../data/mausac";
import { phuKien } from "../data/phukien";
import { MAU_NGU_HANH, kiemTraHaiHoaMauSac } from "../data/genzRemixData";
import { HoSo } from "../lib/hoSo";

interface LookbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  trangPhucId: string;
  mauId: string;
  phuKienIds: string[];
  footwearId: string;
  activeHoSo: HoSo;
  onSaveToGui?: () => void;
}

export default function LookbookModal({
  isOpen,
  onClose,
  trangPhucId,
  mauId,
  phuKienIds,
  footwearId,
  activeHoSo,
  onSaveToGui,
}: LookbookModalProps) {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);

  if (!isOpen) return null;

  const currentTrangPhuc =
    trangPhuc.find((t) => t.id === trangPhucId) || trangPhuc[0];
  const currentColor = mauSac.find((m) => m.id === mauId) || mauSac[0];
  const colorNguHanh = MAU_NGU_HANH[mauId] || MAU_NGU_HANH["m_do"];
  const harmony = kiemTraHaiHoaMauSac(mauId, phuKienIds[0]);

  const footwearTitle =
    footwearId === "sneaker"
      ? "Sneaker trắng Gen Z"
      : footwearId === "hai_theu"
      ? "Hài thêu cung đình"
      : footwearId === "dep_da_co"
      ? "Dép da cổ truyền"
      : "Guốc mộc truyền thống";

  const accessoriesList =
    phuKienIds
      .map((id) => phuKien.find((p) => p.id === id)?.ten || id)
      .join(" · ") || "Nguyên bản tinh giản";

  // Tạo URL chia sẻ chứa đầy đủ thông số bộ đồ
  const getShareUrl = () => {
    if (typeof window === "undefined") return "";
    const origin = window.location.origin;
    const pathname = window.location.pathname;
    const params = new URLSearchParams();
    params.set("screen", "s4");
    params.set("tp", trangPhucId);
    params.set("m", mauId);
    if (phuKienIds.length > 0) {
      params.set("pk", phuKienIds.join(","));
    }
    params.set("fw", footwearId);
    params.set("author", activeHoSo.tenHienThi);
    return `${origin}${pathname}?${params.toString()}`;
  };

  const getShareText = () => {
    return `✨ Lookbook Việt Phục: "${currentTrangPhuc.ten} — Sắc ${currentColor.ten}"\n🎨 Điểm hài hòa Ngũ Hành: ${harmony.diemSo}/100 (${harmony.nhan})\n🌿 Thiết kế bởi: ${activeHoSo.tenHienThi} trên Cò Em Heritage\nKhám phá tại:`;
  };

  // 1. Chia sẻ qua Web Share API hoặc sao chép Link
  const handleShare = async () => {
    const shareUrl = getShareUrl();
    const shareText = getShareText();

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Lookbook Việt Phục: ${currentTrangPhuc.ten}`,
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch (err: unknown) {
        // Nếu người dùng nhấn Hủy chia sẻ thì không hiện lỗi
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }
      }
    }

    // Fallback: Sao chép link vào Clipboard
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    }
  };

  // 2. Chia sẻ lên Facebook
  const handleShareFacebook = () => {
    const shareUrl = getShareUrl();
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(fbUrl, "_blank", "noopener,noreferrer");
  };

  // 3. Chia sẻ lên X (Twitter)
  const handleShareTwitter = () => {
    const shareUrl = getShareUrl();
    const text = `Lookbook Việt Phục "${currentTrangPhuc.ten}" phối bởi ${activeHoSo.tenHienThi} trên Cò Em!`;
    const twUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twUrl, "_blank", "noopener,noreferrer");
  };

  // 4. Xuất ảnh Thẻ Lookbook độ nét cao (Download PNG via Canvas 2D)
  const handleDownloadImage = () => {
    setIsExporting(true);

    try {
      const canvas = document.createElement("canvas");
      canvas.width = 1200;
      canvas.height = 1500;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        setIsExporting(false);
        return;
      }

      // 1. Nền thẻ giấy dó ấm áp
      const bgGrad = ctx.createLinearGradient(0, 0, 1200, 1500);
      bgGrad.addColorStop(0, "#FBF9F5");
      bgGrad.addColorStop(1, "#F3EDE2");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1200, 1500);

      // 2. Khung viền kim tuyến sang trọng
      ctx.strokeStyle = "rgba(217, 119, 6, 0.4)";
      ctx.lineWidth = 6;
      ctx.strokeRect(36, 36, 1128, 1428);

      ctx.strokeStyle = "rgba(21, 128, 61, 0.25)";
      ctx.lineWidth = 2;
      ctx.strokeRect(48, 48, 1104, 1404);

      // 3. Header Tạp chí
      ctx.fillStyle = "#B45309";
      ctx.font = "bold 22px system-ui, sans-serif";
      ctx.letterSpacing = "6px";
      ctx.fillText("VIỆT PHỤC REMIX · GEN Z HERITAGE", 70, 110);

      ctx.fillStyle = "#1E293B";
      ctx.font = "bold 64px Georgia, serif";
      ctx.letterSpacing = "0px";
      ctx.fillText(currentTrangPhuc.ten, 70, 190);

      ctx.fillStyle = "#64748B";
      ctx.font = "20px system-ui, sans-serif";
      ctx.fillText("BỘ SƯU TẬP DI SẢN 2026 · CÒ EM", 70, 230);

      // Đường kẻ ngang mỏng
      ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(70, 260);
      ctx.lineTo(1130, 260);
      ctx.stroke();

      // 4. Khối Khung Visual Trang phục
      const boxGrad = ctx.createLinearGradient(70, 290, 1130, 750);
      boxGrad.addColorStop(0, "#FFFFFF");
      boxGrad.addColorStop(1, "#FAFAF9");
      ctx.fillStyle = boxGrad;
      ctx.beginPath();
      ctx.roundRect(70, 290, 1060, 480, 24);
      ctx.fill();
      ctx.strokeStyle = "rgba(217, 119, 6, 0.25)";
      ctx.stroke();

      // Vòng tròn lớn hiển thị màu áo chính
      ctx.fillStyle = currentColor.hex;
      ctx.beginPath();
      ctx.arc(600, 520, 150, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
      ctx.lineWidth = 12;
      ctx.stroke();

      // Vòng hào quang phụ kiện
      ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
      ctx.beginPath();
      ctx.arc(600, 520, 80, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#1E293B";
      ctx.font = "bold 26px Georgia, serif";
      ctx.textAlign = "center";
      ctx.fillText(currentColor.ten, 600, 515);
      ctx.font = "18px system-ui, sans-serif";
      ctx.fillStyle = "#B45309";
      ctx.fillText(`Hành: ${colorNguHanh.hanh}`, 600, 545);
      ctx.textAlign = "left";

      // 5. Thẻ thông tin phối đồ chi tiết
      ctx.fillStyle = "#1E293B";
      ctx.font = "italic 26px Georgia, serif";
      ctx.fillText(`"${currentTrangPhuc.moTaNgan}"`, 70, 830);

      // Bảng màu Swatch
      ctx.fillStyle = "#475569";
      ctx.font = "bold 20px system-ui, sans-serif";
      ctx.fillText("BẢNG MÀU NGŨ HÀNH:", 70, 890);

      // Swatch 1
      ctx.fillStyle = currentColor.hex;
      ctx.beginPath();
      ctx.arc(90, 930, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#CBD5E1";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = "#1E293B";
      ctx.font = "20px system-ui, sans-serif";
      ctx.fillText(`${currentColor.ten} (Chính)`, 120, 936);

      // Swatch 2 (Bạch lụa)
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.arc(360, 930, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#1E293B";
      ctx.fillText("Bạch Lụa (Lót / Quần)", 390, 936);

      // Phụ kiện & Giày dép
      ctx.fillStyle = "#F8FAFC";
      ctx.beginPath();
      ctx.roundRect(70, 980, 510, 160, 18);
      ctx.fill();
      ctx.strokeStyle = "rgba(0, 0, 0, 0.08)";
      ctx.stroke();

      ctx.fillStyle = "#B45309";
      ctx.font = "bold 18px system-ui, sans-serif";
      ctx.fillText("PHỤ KIỆN ĐI KÈM", 95, 1025);
      ctx.fillStyle = "#1E293B";
      ctx.font = "bold 24px system-ui, sans-serif";
      ctx.fillText(accessoriesList, 95, 1075);

      ctx.fillStyle = "#F8FAFC";
      ctx.beginPath();
      ctx.roundRect(620, 980, 510, 160, 18);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#0D9488";
      ctx.font = "bold 18px system-ui, sans-serif";
      ctx.fillText("GIÀY DÉP HOÀN THIỆN", 645, 1025);
      ctx.fillStyle = "#1E293B";
      ctx.font = "bold 24px system-ui, sans-serif";
      ctx.fillText(footwearTitle, 645, 1075);

      // Điểm hài hòa & Chứng nhận
      ctx.fillStyle = "#ECFDF5";
      ctx.beginPath();
      ctx.roundRect(70, 1170, 1060, 120, 20);
      ctx.fill();
      ctx.strokeStyle = "#A7F3D0";
      ctx.stroke();

      ctx.fillStyle = "#065F46";
      ctx.font = "bold 26px system-ui, sans-serif";
      ctx.fillText(`✦ ĐIỂM HÀI HÒA: ${harmony.diemSo} / 100 ĐIỂM`, 105, 1225);
      ctx.font = "20px system-ui, sans-serif";
      ctx.fillText(`${harmony.nhan} · ${harmony.quanHeNguHanh}`, 105, 1260);

      // Footer: Tác giả & Chữ ký
      ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";
      ctx.beginPath();
      ctx.moveTo(70, 1340);
      ctx.lineTo(1130, 1340);
      ctx.stroke();

      ctx.fillStyle = "#64748B";
      ctx.font = "22px system-ui, sans-serif";
      ctx.fillText(`Phối bởi Nhà thiết kế: `, 70, 1395);
      ctx.fillStyle = "#1E293B";
      ctx.font = "bold 24px Georgia, serif";
      ctx.fillText(activeHoSo.tenHienThi, 300, 1395);

      ctx.fillStyle = "#B45309";
      ctx.font = "italic 24px Georgia, serif";
      ctx.textAlign = "right";
      ctx.fillText("Cò Em · Không gian Cổ phục Việt Nam", 1130, 1395);

      // Xuất file tải về
      const dataUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `VietPhuc_Lookbook_${currentTrangPhuc.id}_${activeHoSo.tenHienThi.replace(/\s+/g, "_")}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch {
      // Fallback
    } finally {
      setIsExporting(false);
    }
  };

  // 5. Lưu vào Gùi Ký Ức
  const handleSave = () => {
    if (onSaveToGui) {
      onSaveToGui();
      setSaved(true);
      setTimeout(() => setSaved(false), 2400);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label="Thẻ Lookbook Việt phục"
    >
      <div className="relative w-full max-w-xl bg-[#FAF8F5] dark:bg-slate-900 rounded-3xl shadow-2xl border border-amber-300/60 dark:border-amber-600/40 text-slate-800 dark:text-slate-100 p-5 sm:p-7 overflow-hidden max-h-[94vh] flex flex-col">
        {/* Nút đóng */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition cursor-pointer z-10"
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ================================================================= */}
        {/* THẺ TẠP CHÍ LOOKBOOK NGHỆ THUẬT (EDITORIAL CARD PREVIEW)          */}
        {/* ================================================================= */}
        <div className="lookbook-magazine-card flex-1 overflow-y-auto p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-800/90 border border-amber-200/80 dark:border-slate-700 shadow-sm flex flex-col justify-between custom-scrollbar">
          {/* Header tạp chí */}
          <div className="border-b border-amber-200/70 dark:border-slate-700 pb-3 mb-3.5 flex items-center justify-between">
            <div>
              <span className="text-[10px] tracking-[0.25em] uppercase font-bold text-amber-700 dark:text-amber-400 block">
                VIỆT PHỤC REMIX · GEN Z HERITAGE
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 dark:text-white mt-0.5 mb-0">
                {currentTrangPhuc.ten}
              </h2>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block font-mono">BỘ SƯU TẬP</span>
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                Năm 2026 ✦ Mùa Du Xuân
              </span>
            </div>
          </div>

          {/* Khối ý nghĩa & Điểm nhấn di sản */}
          <div className="space-y-3 mb-3">
            <p className="text-xs italic text-slate-600 dark:text-slate-300 leading-relaxed m-0">
              "{currentTrangPhuc.moTaNgan}"
            </p>

            {/* Visual Box Minh Họa Sắc Vải */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-50/60 via-white to-orange-50/40 dark:from-slate-900/80 dark:to-slate-800/80 border border-amber-200/80 dark:border-slate-700 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-14 h-14 rounded-2xl border-2 border-white shadow-md flex items-center justify-center text-white font-serif font-bold text-lg"
                  style={{ backgroundColor: currentColor.hex }}
                >
                  ✦
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-800 dark:text-amber-300 block">
                    Nếp Áo Chủ Đạo
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white m-0">
                    Sắc {currentColor.ten}
                  </h4>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Ngũ hành: {colorNguHanh.hanh}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">Điểm hài hòa</span>
                <span className="text-lg font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {harmony.diemSo}/100
                </span>
              </div>
            </div>

            {/* Bảng màu Palette nghệ thuật */}
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                Bảng Màu Di Sản (Color Palette):
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
                  <div
                    className="w-3.5 h-3.5 rounded-full border border-black/20"
                    style={{ backgroundColor: currentColor.hex }}
                  />
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {currentColor.ten}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
                  <div className="w-3.5 h-3.5 rounded-full border border-black/20 bg-white" />
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    Bạch Lụa (Lót)
                  </span>
                </div>
              </div>
            </div>

            {/* Thông số phối đồ */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40">
                <span className="text-[10px] text-amber-800 dark:text-amber-400 block font-semibold">
                  Phụ kiện điểm xuyết:
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-200 line-clamp-1">
                  {accessoriesList}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-teal-50/50 dark:bg-teal-950/20 border border-teal-200/60 dark:border-teal-800/40">
                <span className="text-[10px] text-teal-800 dark:text-teal-400 block font-semibold">
                  Giày dép hoàn thiện:
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-200 line-clamp-1">
                  {footwearTitle}
                </span>
              </div>
            </div>

            {/* Dấu ấn chứng nhận di sản */}
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span className="text-emerald-900 dark:text-emerald-200 font-medium">
                  {harmony.nhan}
                </span>
              </div>
              <span className="text-[10px] text-emerald-800 dark:text-emerald-300 font-semibold">
                Chứng nhận chuẩn di sản ✦
              </span>
            </div>
          </div>

          {/* Footer thẻ Lookbook: Người tạo & Chữ ký */}
          <div className="pt-2.5 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5">
              <Feather className="w-3.5 h-3.5 text-amber-600" />
              <span>
                Nhà thiết kế: <strong>{activeHoSo.tenHienThi}</strong>
              </span>
            </div>
            <span className="italic font-serif">Cò Em Di Sản</span>
          </div>
        </div>

        {/* ================================================================= */}
        {/* THANH THAO TÁC CHIA SẺ, TẢI ẢNH & LƯU GÙI                        */}
        {/* ================================================================= */}
        <div className="mt-3.5 space-y-2">
          {/* Hàng nút chính: Chia sẻ liên kết + Tải ảnh Lookbook + Cất vào Gùi */}
          <div className="grid grid-cols-3 gap-2">
            {/* Nút 1: Chia sẻ */}
            <button
              type="button"
              onClick={handleShare}
              className="py-2.5 px-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-amber-500 text-slate-800 dark:text-slate-200 font-semibold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
              title="Chia sẻ liên kết hoặc sao chép vào bộ nhớ tạm"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600">Đã chép link!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>Chia sẻ link</span>
                </>
              )}
            </button>

            {/* Nút 2: Tải ảnh PNG */}
            <button
              type="button"
              onClick={handleDownloadImage}
              disabled={isExporting}
              className="py-2.5 px-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-emerald-500 text-slate-800 dark:text-slate-200 font-semibold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="Xuất thẻ Lookbook thành file ảnh PNG độ nét cao để đăng mạng xã hội"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isExporting ? "Đang xuất..." : "Tải ảnh thẻ"}</span>
            </button>

            {/* Nút 3: Cất vào Gùi */}
            {onSaveToGui && (
              <button
                type="button"
                onClick={handleSave}
                className="py-2.5 px-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                title="Lưu vào Gùi Ký Ức của bạn"
              >
                {saved ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>Đã cất!</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-3.5 h-3.5 text-white" />
                    <span>Cất vào Gùi</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Dải nút mạng xã hội (Facebook, X/Twitter, Mở rộng) */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-200/80 dark:border-slate-800 text-[11px] text-slate-500">
            <span>Chia sẻ nhanh lên:</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleShareFacebook}
                className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 hover:bg-blue-100 font-medium transition cursor-pointer flex items-center gap-1"
              >
                <span>Facebook</span>
              </button>
              <button
                type="button"
                onClick={handleShareTwitter}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 font-medium transition cursor-pointer flex items-center gap-1"
              >
                <span>X / Twitter</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
