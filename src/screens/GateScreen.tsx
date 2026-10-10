/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * GateScreen — Trang Chủ (Toàn Cảnh Làng Quê Sống Động & Cò Em)
 * - Khung cảnh sống: Làng quê truyền thống với luỹ tre, hoa cỏ và ngày đêm luân chuyển
 * - Vòng ngày đêm luân chuyển 300 giây (5 phút)
 * - Các nút thao tác tinh gọn, trực quan, nổi bật, dễ hiểu
 */

import React, { useState, useEffect } from "react";
import HeritageVillageScene from "../components/nature/HeritageVillageScene";
import { openGiuChuanVanHoa } from "../lib/giuChuan";
import { initAudioOnFirstTouch } from "../lib/audio";
import { layThemeHienTai, THEME_CHANGE_EVENT } from "../lib/theme";
import { Compass, ShieldCheck } from "lucide-react";
import Tooltip from "../components/Tooltip";

type Props = {
  onEnter: () => void;
  onEnterQueNha?: () => void;
  onSkip?: () => void;
  onOpenChaoBan?: () => void;
  onOpenStudio?: () => void;
  onOpenChat?: () => void;
  onOpenCharacter?: () => void;
};

export default function GateScreen({
  onEnter,
  onOpenStudio,
  onOpenCharacter,
}: Props) {
  const [isDark, setIsDark] = useState(() => layThemeHienTai() === "dark");

  useEffect(() => {
    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ theme: string }>;
      if (customEvent.detail?.theme) {
        setIsDark(customEvent.detail.theme === "dark");
      }
    };
    window.addEventListener(THEME_CHANGE_EVENT, handleThemeChange);
    return () => window.removeEventListener(THEME_CHANGE_EVENT, handleThemeChange);
  }, []);

  const handleEnterOutfits = () => {
    initAudioOnFirstTouch();
    onEnter();
  };

  const handleOpenStudio = () => {
    initAudioOnFirstTouch();
    if (onOpenStudio) onOpenStudio();
    else onEnter();
  };

  return (
    <main className="gate gate-screen min-h-screen text-[var(--nen-toi)] flex flex-col items-center relative px-4 select-none pb-24">
      <style>{`
        .gate-screen {
          background: transparent;
        }
        html[data-theme="dark"] .gate-sun-element,
        html.theme-dark .gate-sun-element,
        html.dark .gate-sun-element,
        [data-theme="dark"] .gate-sun-element,
        .dark .gate-sun-element {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
        }
      `}</style>

      {/* 1. TIÊU ĐỀ: MẶT TRỜI TRÊN CAO + CHỮ CÒ EM THƯ PHÁP TRUYỀN THỐNG ĐẸP (ĐỐI XỨNG TRỤC GIỮA) */}
      <header className="relative z-10 text-center w-full max-w-4xl mx-auto pt-3 sm:pt-6 md:pt-8 pb-2 flex flex-col items-center">
        {/* KHỐI MẶT TRỜI BÌNH MINH LÊN CAO NGAY TRÊN CHỮ CÒ EM (ĐỐI XỨNG TRỤC GIỮA, ẨN Ở DARK THEME) */}
        <div className="relative flex flex-col items-center select-none w-full">
          {/* Vầng mặt trời bình minh trên cao - chỉ hiển thị ở theme sáng, xóa hoàn toàn ở theme tối */}
          {!isDark && (
            <div className="gate-sun-element relative -mb-5 sm:-mb-7 md:-mb-9 pointer-events-none flex items-center justify-center z-0">
              {/* Vầng hào quang bình minh tỏa rộng êm dịu, không chói gắt */}
              <div className="absolute w-40 h-40 sm:w-52 sm:h-52 md:w-60 md:h-60 rounded-full blur-3xl bg-amber-300/30" />
              <div className="absolute w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 rounded-full blur-xl bg-orange-200/35" />
              
              {/* Vòng hào quang nắng mai rung nhẹ */}
              <div className="absolute -inset-3 sm:-inset-4 rounded-full border border-amber-300/25 animate-pulse" style={{ animationDuration: "5s" }} />

              {/* Quả cầu mặt trời bình minh tươi sáng, tròn đều, mịn màng và dịu dàng (không có xẹt ngang) */}
              <div className="relative w-15 h-15 sm:w-19 sm:h-19 md:w-22 md:h-22 rounded-full bg-gradient-to-tr from-[#EA580C] via-[#F59E0B] to-[#FEF08A] shadow-[0_0_36px_rgba(245,158,11,0.45),_inset_0_0_14px_rgba(255,255,255,0.85)]" />
            </div>
          )}

          {/* CHỮ "CÒ EM" VIẾT BẰNG FONT CHỮ THƯ PHÁP TRUYỀN THỐNG VIỆT NAM ĐẸP */}
          <div className="relative inline-flex flex-col items-center">
            <h1
              className="relative z-10 font-normal tracking-normal m-0 leading-none text-transparent bg-clip-text bg-gradient-to-b from-[#241005] via-[#4A1E0B] to-[#732F10] dark:from-[#FFFBEB] dark:via-[#FEF3C7] dark:to-[#FDE68A] drop-shadow-[0_4px_16px_rgba(36,16,5,0.22)] select-none"
              style={{
                fontFamily: "var(--font-thu-phap, 'Charm', cursive)",
                fontSize: "clamp(5.6rem, 13vw, 10.2rem)",
                padding: "0.08em 0.35em 0.16em",
                lineHeight: 1.1,
              }}
            >
              Cò Em
            </h1>
            {/* Tagline định vị mục đích rõ ràng cho đề thi Audition */}
            <div className="relative z-10 mt-1 flex flex-col items-center text-center px-4">
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300 bg-amber-100/80 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-800 px-3 py-1 rounded-full shadow-xs">
                Việt Phục Remix · Phong Cách Gen Z
              </span>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 max-w-lg mt-1.5 font-medium leading-relaxed">
                Khám phá & phối trang phục truyền thống theo sự kiện, địa phương và phong cách cá nhân — sáng tạo hiện đại, vẹn nguyên giá trị văn hóa.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* 2. SÂN KHẤU LINH VẬT CÒ EM Ở TRUNG TÂM */}
      <section className="relative z-10 w-full px-2 sm:px-4 my-auto flex-1 flex flex-col items-center justify-center">
        <HeritageVillageScene onMascotClick={handleEnterOutfits} />

        {/* Nút hành động trực quan, nổi bật */}
        <div className="mt-2 flex items-center justify-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={handleEnterOutfits}
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 shadow-md shadow-emerald-900/20 hover:scale-[1.03] active:scale-95 transition-all duration-200 cursor-pointer border border-emerald-400/30"
          >
            <Compass className="w-4 h-4 text-emerald-200" />
            <span>Khám Phá Cổ Phục Ngay »</span>
          </button>

          <button
            type="button"
            onClick={handleOpenStudio}
            className="inline-flex items-center gap-2 px-5 sm:px-7 py-2.5 sm:py-3 rounded-full font-bold text-xs sm:text-sm text-amber-950 dark:text-amber-100 bg-amber-100/90 dark:bg-amber-950/80 hover:bg-amber-200 dark:hover:bg-amber-900/80 border border-amber-300 dark:border-amber-700 shadow-xs hover:scale-[1.03] active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <span>🎓 Phối Đồ Theo Sự Kiện Gen Z »</span>
          </button>
        </div>
      </section>

      {/* 3. CHÂN TRANG DI SẢN TINH GỌN */}
      <footer className="relative z-10 flex flex-col sm:flex-row items-center justify-between w-full max-w-4xl text-xs text-[var(--tro-tram)] pt-4 pb-2 border-t border-[var(--vien-the)] gap-2 mb-4">
        <Tooltip
          title="Tư liệu khảo cứu"
          content="Nguyên tắc phục dựng di sản"
          position="top"
        >
          <button
            type="button"
            onClick={() => openGiuChuanVanHoa()}
            className="inline-flex items-center gap-1.5 text-[var(--xanh-chinh)] hover:text-[var(--vang-chinh)] font-semibold transition-colors bg-transparent border-0 p-0 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Khảo cứu di sản</span>
          </button>
        </Tooltip>

        <span className="text-[11px] opacity-75">
          Cò Em · Không gian trang phục truyền thống Việt Nam
        </span>
      </footer>
    </main>
  );
}
