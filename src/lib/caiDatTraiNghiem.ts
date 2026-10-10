/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { isAudioEnabled, setAudioEnabled } from "./audio";

export const KEY_GIAM_CHUYEN_DONG = "vpr:giam_chuyen_dong";
export const KEY_CHU_LON_DE_DOC = "vpr:chu_lon_de_doc";
export const KEY_TAT_BAU_TROI = "vpr:tat_bau_troi";
export const EVENT_CAI_DAT_TRAI_NGHIEM = "vpr:cai-dat-trai-nghiem-change";

export interface CaiDatTraiNghiem {
  amThanh: boolean;
  giamChuyenDong: boolean;
  chuLonDeDoc: boolean;
  tatBauTroi: boolean;
}

/**
 * Đọc cấu hình trải nghiệm hiện tại
 */
export function docCaiDatTraiNghiem(): CaiDatTraiNghiem {
  if (typeof window === "undefined") {
    return {
      amThanh: false,
      giamChuyenDong: false,
      chuLonDeDoc: false,
      tatBauTroi: false,
    };
  }

  // 1. m thanh: theo isAudioEnabled()
  const amThanh = isAudioEnabled();

  // 2. Giảm chuyển động: mặc định theo prefers-reduced-motion của OS nếu người dùng chưa can thiệp
  const sysReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const userReducedMotion = window.localStorage?.getItem(KEY_GIAM_CHUYEN_DONG);
  const giamChuyenDong =
    userReducedMotion !== null ? userReducedMotion === "1" : sysReducedMotion;

  // 3. Chữ lớn, dễ đọc
  const userLargeText = window.localStorage?.getItem(KEY_CHU_LON_DE_DOC);
  const chuLonDeDoc = userLargeText === "1";

  // 4. Tắt bầu trời (Lượt 13b)
  const userDisableSky = window.localStorage?.getItem(KEY_TAT_BAU_TROI);
  const tatBauTroi = userDisableSky === "1";

  return {
    amThanh,
    giamChuyenDong,
    chuLonDeDoc,
    tatBauTroi,
  };
}

/**
 * Cập nhật DOM classes và các biến liên quan
 */
export function apDungClassGiaoDien(settings: CaiDatTraiNghiem): void {
  if (typeof document === "undefined") return;

  const root = document.documentElement;

  // Áp dụng hoặc gỡ bỏ class giảm chuyển động
  if (settings.giamChuyenDong) {
    root.classList.add("giam-chuyen-dong");
  } else {
    root.classList.remove("giam-chuyen-dong");
  }

  // Áp dụng hoặc gỡ bỏ class chữ lớn, dễ đọc
  if (settings.chuLonDeDoc) {
    root.classList.add("chu-lon-de-doc");
  } else {
    root.classList.remove("chu-lon-de-doc");
  }
}

/**
 * Lưu cài đặt trải nghiệm
 */
export function luuCaiDatTraiNghiem(update: Partial<CaiDatTraiNghiem>): CaiDatTraiNghiem {
  if (typeof window === "undefined" || !window.localStorage) {
    return docCaiDatTraiNghiem();
  }

  if (update.amThanh !== undefined) {
    setAudioEnabled(update.amThanh);
  }

  if (update.giamChuyenDong !== undefined) {
    window.localStorage.setItem(KEY_GIAM_CHUYEN_DONG, update.giamChuyenDong ? "1" : "0");
  }

  if (update.chuLonDeDoc !== undefined) {
    window.localStorage.setItem(KEY_CHU_LON_DE_DOC, update.chuLonDeDoc ? "1" : "0");
  }

  if (update.tatBauTroi !== undefined) {
    window.localStorage.setItem(KEY_TAT_BAU_TROI, update.tatBauTroi ? "1" : "0");
  }

  const current = docCaiDatTraiNghiem();
  apDungClassGiaoDien(current);

  window.dispatchEvent(
    new CustomEvent(EVENT_CAI_DAT_TRAI_NGHIEM, { detail: current })
  );
  // Đồng bộ với caiDatSky nếu có thành phần nghe
  window.dispatchEvent(
    new CustomEvent("vpr:cai-dat-sky-change", {
      detail: {
        giamChuyenDong: current.giamChuyenDong,
        tatBauTroi: current.tatBauTroi,
      },
    })
  );

  return current;
}

/**
 * React Hook theo dõi trạng thái cài đặt trải nghiệm
 */
export function useCaiDatTraiNghiem(): [
  CaiDatTraiNghiem,
  (update: Partial<CaiDatTraiNghiem>) => void
] {
  const [settings, setSettings] = useState<CaiDatTraiNghiem>(docCaiDatTraiNghiem);

  useEffect(() => {
    // Áp dụng ngay khi mount
    apDungClassGiaoDien(settings);

    const handleUpdate = () => {
      const updated = docCaiDatTraiNghiem();
      setSettings(updated);
      apDungClassGiaoDien(updated);
    };

    window.addEventListener(EVENT_CAI_DAT_TRAI_NGHIEM, handleUpdate);
    window.addEventListener("vpr:audio-setting-change", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    mql.addEventListener?.("change", handleUpdate);

    return () => {
      window.removeEventListener(EVENT_CAI_DAT_TRAI_NGHIEM, handleUpdate);
      window.removeEventListener("vpr:audio-setting-change", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
      mql.removeEventListener?.("change", handleUpdate);
    };
  }, []);

  return [settings, luuCaiDatTraiNghiem];
}
