/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { domdom } from "../copy/domdom";
import { caThamTu } from "../data/tham_tu";
import { trangPhuc } from "../data/trangphuc";
import { NhanVatConfig, NHAN_VAT_MAC_DINH, tinhSoDo } from "../lib/avatar";
import AvatarSVG from "../components/AvatarSVG";
import { renderGarmentLayers, CulturalPatternsDefs } from "../components/GarmentLayers";
import AppFooter from "../components/AppFooter";
import { ThamTuPose } from "../narrator";

interface Props {
  onProceedToS4: () => void;
  onSkipToS4: () => void;
  onBackToS2?: () => void;
  nhanVatConfig?: NhanVatConfig;
}

type VungChon = "headwear" | "garment" | "accessories" | "pattern" | "all_good";

export default function ThamTuScreen({
  onProceedToS4,
  onSkipToS4,
  onBackToS2,
  nhanVatConfig = NHAN_VAT_MAC_DINH,
}: Props) {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedZone, setSelectedZone] = useState<VungChon | null>(null);
  const [feedback, setFeedback] = useState<{
    isCorrect: boolean;
    title: string;
    message: string;
  } | null>(null);
  const [isCompletedAll, setIsCompletedAll] = useState<boolean>(false);

  const currentCa = caThamTu[currentIdx];
  const totalCases = caThamTu.length;

  // Lấy thông tin trang phục của ca hiện tại
  const currentTrangPhucObj = useMemo(() => {
    return trangPhuc.find((t) => t.id === currentCa.boPhoi.trangPhuc);
  }, [currentCa]);

  // Màu sắc tượng trưng nhã nhặn cho mỗi ca
  const mauHex = useMemo(() => {
    if (currentCa.id === "t1") return "#4A3B32"; // Màu nâu gụ áo tứ thân
    if (currentCa.id === "t2") return "#2A4B53"; // Màu chàm xanh áo cóm
    return "#E8E1D5"; // Màu trắng ngà áo dài
  }, [currentCa]);

  // Nhân vật hiển thị phù hợp giới tính trang phục
  const characterForCase = useMemo(() => {
    if (currentCa.id === "t1") {
      // Áo tứ thân nữ
      return {
        ...nhanVatConfig,
        gioi: "nu" as const,
        tuoi: "nguoi_lon" as const,
        toc: "dai_xoa",
      };
    }
    if (currentCa.id === "t2") {
      // Áo cóm Thái nữ
      return {
        ...nhanVatConfig,
        gioi: "nu" as const,
        tuoi: "nguoi_lon" as const,
        toc: "bui_cao",
      };
    }
    // Áo dài
    return {
      ...nhanVatConfig,
      gioi: "nu" as const,
      tuoi: "nguoi_lon" as const,
      toc: "dai_xoa",
    };
  }, [currentCa, nhanVatConfig]);

  const soDo = useMemo(() => tinhSoDo(characterForCase), [characterForCase]);

  // Tạo các lớp trang phục tương ứng với bộ phối của ca
  const garmentLayers = useMemo(() => {
    return renderGarmentLayers({
      trangPhucId: currentCa.boPhoi.trangPhuc,
      soDo,
      mauHex,
      phuKienIds: currentCa.boPhoi.phuKien || [],
      hoaVanThem: currentCa.boPhoi.hoaVanThem || null,
      phongCach: "truyen_thong",
    });
  }, [currentCa, soDo, mauHex]);

  // Xử lý khi người chơi bấm vào vùng chọn
  const handleSelectZone = (zone: VungChon) => {
    setSelectedZone(zone);

    // Ca 1: Lỗi là khăn đóng (phuKien:khan_dong) -> vùng "headwear"
    if (currentCa.id === "t1") {
      if (zone === "headwear") {
        setFeedback({
          isCorrect: true,
          title: "Bạn nhìn ra rồi đấy!",
          message: currentCa.lyDo,
        });
      } else {
        setFeedback({
          isCorrect: false,
          title: "Chi tiết này vẫn chuẩn mực...",
          message: "Chi tiết này vốn rất đúng điệu Bắc Bộ xưa. Bạn thử quan sát lại phần đầu xem chiếc khăn đội có chút gì lạ lẫm không nhé?",
        });
      }
      return;
    }

    // Ca 2: Lỗi là họa tiết mượn (hoaVanThem: "mong") trên áo cóm Thái -> vùng "pattern"
    if (currentCa.id === "t2") {
      if (zone === "pattern") {
        setFeedback({
          isCorrect: true,
          title: "Mắt bạn tinh lắm!",
          message: currentCa.lyDo,
        });
      } else {
        setFeedback({
          isCorrect: false,
          title: "Chi tiết này không bị lệch...",
          message: "Dáng áo cóm ôm và phụ kiện này rất đẹp và đúng lề thói. Nhưng bạn hãy ngắm kỹ hoa văn trang trí thêu trên nếp vải xem nhé?",
        });
      }
      return;
    }

    // Ca 3: Không có lỗi sai (loiSai: null) -> Lựa chọn "all_good" (Bộ này ổn)
    if (currentCa.id === "t3") {
      if (zone === "all_good") {
        setFeedback({
          isCorrect: true,
          title: "Cảm nhận của bạn rất chuẩn xác!",
          message: currentCa.lyDo,
        });
      } else {
        setFeedback({
          isCorrect: false,
          title: "Chi tiết này rất vừa vặn...",
          message: "Áo dài kết hợp với chiếc nón lá này là cặp hình tượng rất đỗi thân quen và chuẩn mực. Bạn thử nhìn lại tổng thể xem có cần soi lỗi không, hay bộ này vốn đã rất ổn rồi nhé?",
        });
      }
      return;
    }
  };

  // Sang ca tiếp theo
  const handleNextCase = () => {
    if (currentIdx < totalCases - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedZone(null);
      setFeedback(null);
    } else {
      setIsCompletedAll(true);
    }
  };

  // Màn kết thúc sau khi hoàn thành 3 ca
  if (isCompletedAll) {
    return (
      <main className="tham-tu-screen relative min-h-screen flex flex-col items-center justify-center p-4 md:p-8 text-[var(--nen-sang)] overflow-y-auto">
        {/* Nút thoát ở góc trên */}
        <div className="absolute top-[calc(var(--top-bar-h,56px)+12px)] right-5 z-20">
          <button
            type="button"
            onClick={onProceedToS4}
            className="px-3.5 py-1.5 text-xs border border-[var(--vien-the)] bg-[var(--nen-the)] text-[var(--nen-sang)] hover:border-amber-400 transition-colors cursor-pointer"
            style={{ borderRadius: "var(--vien-lech-b)" }}
          >
            {domdom.thamTu.nutBoQua}
          </button>
        </div>

        <div
          className="relative max-w-lg w-full p-6 md:p-8 border shadow-2xl space-y-6 text-center animate-in fade-in zoom-in-95 duration-300"
          style={{
            background: "var(--nen-the)",
            borderColor: "var(--vang-nghe)",
            borderRadius: "var(--vien-lech-a)",
            boxShadow: "var(--shadow-the, 0 16px 40px rgba(0,0,0,0.1))",
          }}
        >
          {/* Biểu tượng Cò Em thám tử lấp lánh */}
          <div className="flex justify-center">
            <ThamTuPose size={84} />
          </div>

          <div className="space-y-2">
            <span
              className="text-xs tracking-wider uppercase px-2.5 py-0.5 border"
              style={{
                borderColor: "rgba(217, 164, 65, 0.4)",
                color: "var(--vang-nghe)",
                background: "rgba(217, 164, 65, 0.1)",
                borderRadius: "var(--vien-lech-b)",
              }}
            >
              Cò Em chiêm nghiệm
            </span>
            <h1
              className="text-xl md:text-2xl font-bold"
              style={{ fontFamily: "var(--font-tieu-de)", color: "var(--vang-nghe)" }}
            >
              Nét Đẹp Của Sự Thấu Hiểu
            </h1>
          </div>

          <p className="text-sm md:text-base leading-relaxed text-[var(--chu-mo)] italic px-2">
            &ldquo;{domdom.thamTu.khauHieuKhepLai}&rdquo;
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={onProceedToS4}
              className="w-full sm:w-auto px-6 py-3 text-sm font-semibold border shadow-lg cursor-pointer transition-all transform hover:scale-[1.02] active:scale-95"
              style={{
                background: "var(--vang-nghe)",
                borderColor: "var(--vang-nghe)",
                color: "#111A1C",
                borderRadius: "var(--vien-lech-b)",
              }}
            >
              {domdom.thamTu.nutVaoS4}
            </button>

            {onBackToS2 && (
              <button
                type="button"
                onClick={onBackToS2}
                className="w-full sm:w-auto px-4 py-2.5 text-xs border border-[var(--vien-the)] bg-[var(--nen-the-phu)] text-[var(--nen-sang)] hover:border-amber-400 transition-colors cursor-pointer"
                style={{ borderRadius: "var(--vien-lech-b)" }}
              >
                ← Xem lại danh sách trang phục
              </button>
            )}
          </div>
        </div>

        <AppFooter />
      </main>
    );
  }

  return (
    <main className="tham-tu-screen relative min-h-screen flex flex-col text-[var(--nen-sang)] pb-16">
      {/* THANH ĐIỀU HƯỚNG TRÊN CÙNG: LUÔN CÓ "Để sau nhé..." */}
      <header
        className="w-full px-4 md:px-8 py-3.5 border-b flex items-center justify-between sticky top-[var(--top-bar-h,56px)] z-30"
        style={{
          background: "var(--nen-sidebar, rgba(17, 26, 28, 0.92))",
          backdropFilter: "blur(8px)",
          borderColor: "var(--sidebar-border, rgba(217, 164, 65, 0.3))",
        }}
      >
        <div className="flex items-center gap-3">
          {onBackToS2 && (
            <button
              type="button"
              onClick={onBackToS2}
              className="text-xs text-[var(--chu-mo)] hover:text-[var(--nen-sang)] transition-colors cursor-pointer"
              title="Quay lại chọn trang phục"
            >
              ← S2
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h1
                className="text-sm md:text-base font-semibold leading-none"
                style={{ fontFamily: "var(--font-tieu-de)", color: "var(--vang-nghe)" }}
              >
                {domdom.thamTu.tieuDe}
              </h1>
              <span
                className="text-[11px] px-2 py-0.5 border"
                style={{
                  borderColor: "var(--vien-the)",
                  color: "var(--vang-nghe)",
                  borderRadius: "var(--vien-lech-b)",
                  background: "var(--nen-the-phu)",
                }}
              >
                {domdom.thamTu.caTienTrinh(currentIdx + 1, totalCases)}
              </span>
            </div>
            <p className="text-[11px] text-[var(--chu-mo)] mt-0.5 hidden sm:block">
              {domdom.thamTu.phuDe}
            </p>
          </div>
        </div>

        {/* Luôn có nút "Để sau nhé..." ở góc phải trên */}
        <button
          type="button"
          onClick={onSkipToS4}
          className="px-3.5 py-1.5 text-xs border border-[var(--vien-the)] bg-[var(--nen-the)] text-[var(--nen-sang)] hover:border-amber-400 transition-colors cursor-pointer"
          style={{
            borderRadius: "var(--vien-lech-b)",
          }}
          title="Bỏ qua thám tử và vào phòng thử đồ S4"
        >
          {domdom.thamTu.nutBoQua}
        </button>
      </header>

      {/* NỘI DUNG CHÍNH */}
      <div className="max-w-4xl w-full mx-auto p-4 md:p-6 flex-1 flex flex-col space-y-6">
        {/* Lời mở đầu của Cò Em */}
        <div
          className="p-3.5 px-4 border text-xs md:text-sm text-[var(--nen-sang)] flex items-start gap-3"
          style={{
            background: "var(--nen-the)",
            borderColor: "var(--vien-the)",
            borderRadius: "var(--vien-lech-b)",
          }}
        >
          <div className="shrink-0 -mt-1">
            <ThamTuPose size={52} animate={true} />
          </div>
          <div>
            <p className="leading-relaxed">
              <strong className="text-[var(--vang-nghe)]">
                Ca {currentIdx + 1}: {currentTrangPhucObj?.ten || "Trang phục"}
              </strong>{" "}
              — Bạn hãy nhìn ngắm nhân vật bên dưới và chỉ ra chi tiết có chút &ldquo;lệch điệu xưa&rdquo; (hoặc xác nhận nếu bộ này đã chuẩn mực).
            </p>
          </div>
        </div>

        {/* KHUNG SO SÁNH / THAO TÁC: 2 CỘT (SVG NHÂN VẬT & CÁC VÙNG BẤM) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* CỘT 1: HÌNH NHÂN VẬT SVG KÈM CÁC VÙNG HOTSPOT TƯƠNG TÁC TRỰC QUAN */}
          <div className="md:col-span-6 flex flex-col items-center">
            <div
              className="relative w-full max-w-[270px] sm:max-w-[310px] aspect-[1/1.5] border shadow-xl flex items-center justify-center overflow-hidden"
              style={{
                background: "radial-gradient(ellipse at center, #1E2D30 0%, #111A1C 90%)",
                borderColor: "rgba(217, 164, 65, 0.5)",
                borderRadius: "var(--vien-lech-a)",
              }}
            >
              {/* Nhân vật SVG */}
              <AvatarSVG
                nhanVat={characterForCase}
                className="w-full h-full object-contain filter drop-shadow-md"
                childrenDefs={<CulturalPatternsDefs />}
                childrenVayQuan={garmentLayers.childrenVayQuan}
                childrenAo={garmentLayers.childrenAo}
                childrenPhuKienThan={garmentLayers.childrenPhuKienThan}
                childrenTocTruocKhanNon={garmentLayers.childrenTocTruocKhanNon}
              />

              {/* CÁC ĐIỂM CHẠM NỔI (HOTSPOTS) TRỰC TIẾP TRÊN HÌNH */}
              {/* 1. Hotspot Nón / Khăn đội đầu (vùng đầu) */}
              <button
                type="button"
                onClick={() => handleSelectZone("headwear")}
                className={`absolute top-[16%] left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-full text-[11px] font-medium border shadow transition-all cursor-pointer ${
                  selectedZone === "headwear"
                    ? "bg-amber-400 text-stone-900 border-amber-300 ring-2 ring-amber-300/60 scale-105"
                    : "bg-black/60 text-amber-200 border-amber-400/50 hover:bg-black/80 hover:scale-105"
                }`}
                title="Bấm để soi vùng Nón / Khăn"
              >
                👒 Nón / Khăn
              </button>

              {/* 2. Hotspot Thân áo chính (vùng ngực/vai) */}
              <button
                type="button"
                onClick={() => handleSelectZone("garment")}
                className={`absolute top-[42%] left-[22%] px-2.5 py-1 rounded-full text-[11px] font-medium border shadow transition-all cursor-pointer ${
                  selectedZone === "garment"
                    ? "bg-amber-400 text-stone-900 border-amber-300 ring-2 ring-amber-300/60 scale-105"
                    : "bg-black/60 text-amber-200 border-amber-400/50 hover:bg-black/80 hover:scale-105"
                }`}
                title="Bấm để soi vùng Thân áo"
              >
                👘 Thân áo
              </button>

              {/* 3. Hotspot Họa tiết mượn / hoa văn (vùng giữa áo) */}
              <button
                type="button"
                onClick={() => handleSelectZone("pattern")}
                className={`absolute top-[42%] right-[18%] px-2 py-1 rounded-full text-[11px] font-medium border shadow transition-all cursor-pointer ${
                  selectedZone === "pattern"
                    ? "bg-amber-400 text-stone-900 border-amber-300 ring-2 ring-amber-300/60 scale-105"
                    : "bg-black/60 text-amber-200 border-amber-400/50 hover:bg-black/80 hover:scale-105"
                }`}
                title="Bấm để soi Họa tiết"
              >
                🎨 Họa tiết
              </button>

              {/* 4. Hotspot Phụ kiện đi kèm (vùng eo / thắt lưng) */}
              <button
                type="button"
                onClick={() => handleSelectZone("accessories")}
                className={`absolute top-[60%] left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-full text-[11px] font-medium border shadow transition-all cursor-pointer ${
                  selectedZone === "accessories"
                    ? "bg-amber-400 text-stone-900 border-amber-300 ring-2 ring-amber-300/60 scale-105"
                    : "bg-black/60 text-amber-200 border-amber-400/50 hover:bg-black/80 hover:scale-105"
                }`}
                title="Bấm để soi Phụ kiện"
              >
                📿 Phụ kiện
              </button>
            </div>
            <p className="text-[11px] text-stone-400 mt-2 italic text-center">
              (Chạm vào các vị trí trên hình hoặc chọn các thẻ bên phải)
            </p>
          </div>

          {/* CỘT 2: BẢNG CHỌN VÙNG VÀ PHẢN HỒI */}
          <div className="md:col-span-6 space-y-4">
            <div className="space-y-2">
              <h2
                className="text-sm font-semibold tracking-wide uppercase text-[var(--vang-nghe)]"
                style={{ fontFamily: "var(--font-tieu-de)" }}
              >
                Theo bạn, điểm nào chưa thật đúng điệu?
              </h2>
              <p className="text-xs text-[var(--chu-mo)]">
                Hãy bấm vào chi tiết bạn nghi ngờ có sự lệch bối cảnh văn hóa:
              </p>
            </div>

            {/* 3-4 VÙNG BẤM ĐƯỢC */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* Vùng 1: Nón / Khăn */}
              <button
                type="button"
                onClick={() => handleSelectZone("headwear")}
                className={`p-3 text-left border transition-all cursor-pointer rounded ${
                  selectedZone === "headwear"
                    ? "border-amber-400 bg-amber-400/20 ring-1 ring-amber-400"
                    : "border-[var(--vien-the)] bg-[var(--nen-the)] hover:border-amber-400/50"
                }`}
                style={{ borderRadius: "var(--vien-lech-b)" }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">👒</span>
                  <span className="text-xs font-semibold text-[var(--nen-sang)]">
                    {domdom.thamTu.vungChon.headwear}
                  </span>
                </div>
                <p className="text-[11px] text-[var(--chu-mo)] mt-1">
                  {currentCa.boPhoi.phuKien?.includes("khan_dong")
                    ? "Đang đội: Khăn đóng"
                    : currentCa.boPhoi.phuKien?.includes("non_la")
                    ? "Đang đội: Nón lá"
                    : "Tóc búi gọn gàng"}
                </p>
              </button>

              {/* Vùng 2: Thân áo */}
              <button
                type="button"
                onClick={() => handleSelectZone("garment")}
                className={`p-3 text-left border transition-all cursor-pointer rounded ${
                  selectedZone === "garment"
                    ? "border-amber-400 bg-amber-400/20 ring-1 ring-amber-400"
                    : "border-[var(--vien-the)] bg-[var(--nen-the)] hover:border-amber-400/50"
                }`}
                style={{ borderRadius: "var(--vien-lech-b)" }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">👘</span>
                  <span className="text-xs font-semibold text-[var(--nen-sang)]">
                    {domdom.thamTu.vungChon.garment}
                  </span>
                </div>
                <p className="text-[11px] text-[var(--chu-mo)] mt-1">
                  {currentTrangPhucObj?.ten || "Thân áo chính"}
                </p>
              </button>

              {/* Vùng 3: Phụ kiện */}
              <button
                type="button"
                onClick={() => handleSelectZone("accessories")}
                className={`p-3 text-left border transition-all cursor-pointer rounded ${
                  selectedZone === "accessories"
                    ? "border-amber-400 bg-amber-400/20 ring-1 ring-amber-400"
                    : "border-[var(--vien-the)] bg-[var(--nen-the)] hover:border-amber-400/50"
                }`}
                style={{ borderRadius: "var(--vien-lech-b)" }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">📿</span>
                  <span className="text-xs font-semibold text-[var(--nen-sang)]">
                    {domdom.thamTu.vungChon.accessories}
                  </span>
                </div>
                <p className="text-[11px] text-[var(--chu-mo)] mt-1">
                  {currentCa.boPhoi.phuKien && currentCa.boPhoi.phuKien.length > 0
                    ? "Phụ kiện phối kèm"
                    : "Không đeo thêm phụ kiện"}
                </p>
              </button>

              {/* Vùng 4: Họa tiết mượn */}
              <button
                type="button"
                onClick={() => handleSelectZone("pattern")}
                className={`p-3 text-left border transition-all cursor-pointer rounded ${
                  selectedZone === "pattern"
                    ? "border-amber-400 bg-amber-400/20 ring-1 ring-amber-400"
                    : "border-[var(--vien-the)] bg-[var(--nen-the)] hover:border-amber-400/50"
                }`}
                style={{ borderRadius: "var(--vien-lech-b)" }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">🎨</span>
                  <span className="text-xs font-semibold text-[var(--nen-sang)]">
                    {domdom.thamTu.vungChon.pattern}
                  </span>
                </div>
                <p className="text-[11px] text-[var(--chu-mo)] mt-1">
                  {currentCa.boPhoi.hoaVanThem
                    ? `Họa tiết mượn: ${currentCa.boPhoi.hoaVanThem}`
                    : "Hoa văn dệt trơn"}
                </p>
              </button>
            </div>

            {/* NÚT ĐẶC BIỆT CỦA CA 3: "Bộ này ổn" */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => handleSelectZone("all_good")}
                className={`w-full p-3 flex items-center justify-center gap-2 border transition-all cursor-pointer text-xs font-semibold ${
                  selectedZone === "all_good"
                    ? "border-amber-400 bg-amber-400/20 text-amber-800 dark:text-amber-200 ring-2 ring-amber-400/50"
                    : "border-[var(--vien-the)] bg-[var(--nen-the-phu)] text-[var(--nen-sang)] hover:border-amber-400"
                }`}
                style={{ borderRadius: "var(--vien-lech-b)" }}
              >
                <span>⭐</span>
                <span>{domdom.thamTu.nutBoNayOn}</span>
                <span className="text-[10px] opacity-75 font-normal">
                  (Tôi thấy cách phối này đã chuẩn mực)
                </span>
              </button>
            </div>

            {/* PHẢN HỒI ĐÚNG / SAI RÕ RÀNG KÈM LÝ DO GIỌNG MỀM */}
            {feedback && (
              <div
                className={`p-4 border space-y-3 animate-in fade-in slide-in-from-top-2 duration-200 rounded ${
                  feedback.isCorrect
                    ? "border-emerald-600/60 bg-emerald-500/10 text-emerald-950 dark:text-emerald-100"
                    : "border-amber-600/60 bg-amber-500/10 text-amber-950 dark:text-amber-100"
                }`}
                style={{ borderRadius: "var(--vien-lech-a)" }}
              >
                <div className="flex items-start gap-2.5">
                  <span className="text-xl shrink-0 mt-0.5">
                    {feedback.isCorrect ? "🌿" : "🌾"}
                  </span>
                  <div className="space-y-1">
                    <h3
                      className={`text-sm font-bold ${
                        feedback.isCorrect ? "text-emerald-700 dark:text-emerald-300" : "text-amber-800 dark:text-amber-300"
                      }`}
                    >
                      {feedback.title}
                    </h3>
                    <p className="text-xs leading-relaxed text-[var(--nen-sang)]">
                      {feedback.message}
                    </p>
                  </div>
                </div>

                {/* HÀNH ĐỘNG TIẾP THEO */}
                <div className="flex items-center justify-end gap-2.5 pt-1">
                  {!feedback.isCorrect ? (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedZone(null);
                        setFeedback(null);
                      }}
                      className="px-3 py-1.5 text-xs border border-stone-600 text-stone-300 hover:text-white hover:border-stone-400 transition-colors cursor-pointer"
                      style={{ borderRadius: "var(--vien-lech-b)" }}
                    >
                      {domdom.thamTu.nutThuLai}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleNextCase}
                      className="px-4 py-2 text-xs font-semibold border cursor-pointer transition-all shadow"
                      style={{
                        background: "var(--vang-nghe)",
                        borderColor: "var(--vang-nghe)",
                        color: "#111A1C",
                        borderRadius: "var(--vien-lech-b)",
                      }}
                    >
                      {currentIdx < totalCases - 1
                        ? domdom.thamTu.nutSangCaTiep
                        : "Xem lời khép lại của Cò Em ✨"}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <AppFooter />
    </main>
  );
}
