/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { VungId } from "../data/vung";
import { nhom } from "../data/nhom";
import { layKhoaTheoHoSo } from "./hoSo";

export function layKhoaNhomKhamPha(): string {
  return layKhoaTheoHoSo("nhom_kham_pha");
}

export const KEY_NHOM_KHAM_PHA = "vpr:nhom_kham_pha";
export const EVENT_KHAM_PHA_CHANGE = "vpr:kham-pha-change";

/**
 * Đọc danh sách các nhóm đã khám phá từ localStorage theo từng hồ sơ
 */
export function docNhomDaKhamPha(): string[] {
  if (typeof window === "undefined" || !window.localStorage) {
    return [];
  }
  try {
    const raw = window.localStorage.getItem(layKhoaNhomKhamPha());
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch {
    // Bỏ qua nếu lỗi parse
  }
  return [];
}

/**
 * Đánh dấu một nhóm là đã khám phá, lưu vào localStorage và phát event cập nhật ngay
 */
export function danhDauNhomDaKhamPha(nhomId: string): string[] {
  if (typeof window === "undefined" || !window.localStorage) {
    return [nhomId];
  }
  try {
    const current = docNhomDaKhamPha();
    if (!current.includes(nhomId)) {
      const updated = [...current, nhomId];
      window.localStorage.setItem(layKhoaNhomKhamPha(), JSON.stringify(updated));
      window.dispatchEvent(
        new CustomEvent(EVENT_KHAM_PHA_CHANGE, { detail: { nhomId, updated } })
      );
      return updated;
    }
    return current;
  } catch {
    return [];
  }
}

/**
 * Đánh dấu tất cả nhóm thuộc một vùng là đã khám phá (khi người dùng bấm chọn vùng)
 */
export function danhDauTatCaNhomTrongVung(vungId: VungId): string[] {
  const cacNhomTrongVung = nhom.filter((n) => n.vung === vungId).map((n) => n.id);
  const current = docNhomDaKhamPha();
  const updatedSet = new Set([...current, ...cacNhomTrongVung]);
  const updated = Array.from(updatedSet);
  if (typeof window !== "undefined" && window.localStorage) {
    window.localStorage.setItem(layKhoaNhomKhamPha(), JSON.stringify(updated));
    window.dispatchEvent(
      new CustomEvent(EVENT_KHAM_PHA_CHANGE, { detail: { vungId, updated } })
    );
  }
  return updated;
}

/**
 * Kiểm tra xem một vùng đã khám phá xong chưa (tất cả nhóm thuộc vùng đều đã khám phá)
 */
export function kiemTraVungDaKhamPha(vungId: VungId, nhomDaKhamPha: string[]): boolean {
  const cacNhom = nhom.filter((n) => n.vung === vungId);
  if (cacNhom.length === 0) return false;
  return cacNhom.every((n) => nhomDaKhamPha.includes(n.id));
}

/**
 * Kiểm tra xem vùng đã có ít nhất 1 nhóm được khám phá chưa
 */
export function kiemTraVungDangKhamPha(vungId: VungId, nhomDaKhamPha: string[]): boolean {
  const cacNhom = nhom.filter((n) => n.vung === vungId);
  return cacNhom.some((n) => nhomDaKhamPha.includes(n.id));
}
