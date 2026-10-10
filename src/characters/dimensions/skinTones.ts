/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * BẢNG MÀU DA VÀ ĐỔ KHỐI 3D (SKIN TONES & GRADIENT LIGHTING)
 */

import { TongDa } from "../types";

export interface MauDaChiTiet {
  nen: string;
  vien: string;
  bong: string;
  sang: string;
}

export const BANG_MAU_DA: Record<TongDa, MauDaChiTiet> = {
  1: { nen: "#fcf0e4", vien: "#e6c7ab", bong: "#f2dbc5", sang: "#ffffff" },
  2: { nen: "#f5dcc3", vien: "#dbb595", bong: "#e9cbb0", sang: "#fff5eb" },
  3: { nen: "#e8be9b", vien: "#c99a74", bong: "#d8ab87", sang: "#fae2cd" },
  4: { nen: "#d5a47e", vien: "#af7e58", bong: "#c28e67", sang: "#eac09e" },
  5: { nen: "#b9845c", vien: "#925f38", bong: "#a56f47", sang: "#d4a27c" },
  6: { nen: "#916240", vien: "#6c4223", bong: "#7b4e2d", sang: "#af815d" },
};
