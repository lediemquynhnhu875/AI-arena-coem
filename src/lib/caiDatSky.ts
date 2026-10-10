/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  docCaiDatTraiNghiem,
  luuCaiDatTraiNghiem,
  useCaiDatTraiNghiem,
  KEY_GIAM_CHUYEN_DONG,
  KEY_TAT_BAU_TROI,
} from "./caiDatTraiNghiem";

export { KEY_GIAM_CHUYEN_DONG, KEY_TAT_BAU_TROI };

export interface SkySettings {
  giamChuyenDong: boolean;
  tatBauTroi: boolean;
}

export function docCaiDatSky(): SkySettings {
  const current = docCaiDatTraiNghiem();
  return {
    giamChuyenDong: current.giamChuyenDong,
    tatBauTroi: current.tatBauTroi,
  };
}

export function luuCaiDatSky(settings: Partial<SkySettings>) {
  luuCaiDatTraiNghiem(settings);
}

export function useSkySettings(): [SkySettings, (update: Partial<SkySettings>) => void] {
  const [current, update] = useCaiDatTraiNghiem();
  return [
    { giamChuyenDong: current.giamChuyenDong, tatBauTroi: current.tatBauTroi },
    (s: Partial<SkySettings>) => update(s),
  ];
}

