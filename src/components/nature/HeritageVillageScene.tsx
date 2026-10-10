/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * HeritageVillageScene — Trung Tâm Sân Khấu Cò Em
 * - Hiển thị linh vật Cò Em duyên dáng ở trung tâm màn hình
 * - Hòa hợp tuyệt đối với nền thiên nhiên toàn màn hình (không khung hộp, không cắt cảnh)
 * - Tối ưu mã nguồn ngắn gọn, mượt mà và tương tác cao
 */

import React, { useState, useEffect } from "react";
import CoMascot from "../../narrator/mascot/CoMascot";
import { layThemeHienTai, THEME_CHANGE_EVENT } from "../../lib/theme";

interface Props {
  onMascotClick?: () => void;
  className?: string;
}

export default function HeritageVillageScene({ onMascotClick, className = "" }: Props) {
  const [isNight, setIsNight] = useState(() => layThemeHienTai() === "dark");
  const [isMobile, setIsMobile] = useState(() => typeof window !== "undefined" && window.innerWidth < 640);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ theme: string }>;
      if (customEvent.detail?.theme) {
        setIsNight(customEvent.detail.theme === "dark");
      }
    };
    window.addEventListener(THEME_CHANGE_EVENT, handleThemeChange);
    return () => window.removeEventListener(THEME_CHANGE_EVENT, handleThemeChange);
  }, []);

  const mascotSize = isMobile ? 240 : 320;

  return (
    <div className={`relative flex flex-col items-center justify-center py-6 select-none ${className}`}>
      {/* Vị trí đứng của Cò Em ở trung tâm */}
      <div
        onClick={onMascotClick}
        className="cursor-pointer group z-10 flex flex-col items-center transition-transform duration-300 hover:scale-105 active:scale-95"
        title="Bấm vào Cò Em để bắt đầu khám phá Việt Phục"
      >
        {/* Linh vật Cò Em cỡ lớn, rõ nét và sống động */}
        <CoMascot size={mascotSize} mood="cuoi" animate={true} wave={true} hat="non_la" isNight={isNight} />
      </div>
    </div>
  );
}

