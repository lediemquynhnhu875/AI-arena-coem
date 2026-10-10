/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type VungId = "bac" | "trung" | "taynguyen" | "nam";

export interface VungThoiTiet {
  id: VungId;
  ten: string;
  noi: string;
  lat: number;
  lon: number;
}

export const vungData: VungThoiTiet[] = [
  { id: "bac", ten: "Bắc Bộ", noi: "Hà Nội", lat: 21.03, lon: 105.85 },
  { id: "trung", ten: "Trung Bộ", noi: "Huế", lat: 16.46, lon: 107.59 },
  { id: "taynguyen", ten: "Tây Nguyên", noi: "Buôn Ma Thuột", lat: 12.67, lon: 108.05 },
  { id: "nam", ten: "Nam Bộ", noi: "TP. Hồ Chí Minh", lat: 10.82, lon: 106.63 },
];

export const VUNG_MAC_DINH_ID: VungId = "trung";

export function layVungTheoId(id?: string | null): VungThoiTiet {
  if (!id) {
    return vungData.find((v) => v.id === VUNG_MAC_DINH_ID)!;
  }
  const found = vungData.find((v) => v.id === id);
  return found ?? vungData.find((v) => v.id === VUNG_MAC_DINH_ID)!;
}
