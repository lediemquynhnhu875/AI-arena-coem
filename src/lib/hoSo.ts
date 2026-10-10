/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface HoSo {
  id: string;          // slug duy nhất, ví dụ: "khach", "lan_anh", "tuan_minh"
  tenHienThi: string;  // Tên hiển thị người dùng nhập, ví dụ: "Lan Anh", "Khách"
  laKhach: boolean;
  taoLuc: number;
}

export const CURRENT_PROFILE_KEY = "vpr:current_profile_id";
export const PROFILES_LIST_KEY = "vpr:profiles_list";
export const PROFILE_CHANGE_EVENT = "vpr:profile-change";

export const HO_SO_KHACH_MAC_DINH: HoSo = {
  id: "khach",
  tenHienThi: "Khách",
  laKhach: true,
  taoLuc: 1711000000000,
};

/**
 * Chuyển đổi tên tiếng Việt thành slug an toàn cho khóa localStorage
 */
export function slugifyTen(ten: string): string {
  const normalized = ten
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");

  return normalized || "nguoi_dung";
}

/**
 * Lấy danh sách tất cả các hồ sơ đã lưu
 */
export function layDanhSachHoSo(): HoSo[] {
  if (typeof window === "undefined" || !window.localStorage) {
    return [HO_SO_KHACH_MAC_DINH];
  }

  try {
    const raw = window.localStorage.getItem(PROFILES_LIST_KEY);
    if (!raw) {
      window.localStorage.setItem(
        PROFILES_LIST_KEY,
        JSON.stringify([HO_SO_KHACH_MAC_DINH])
      );
      return [HO_SO_KHACH_MAC_DINH];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Đảm bảo luôn có hồ sơ khách
      if (!parsed.some((p: HoSo) => p.id === "khach")) {
        parsed.unshift(HO_SO_KHACH_MAC_DINH);
      }
      return parsed;
    }
  } catch (err) {
    console.error("Lỗi đọc danh sách hồ sơ:", err);
  }

  return [HO_SO_KHACH_MAC_DINH];
}

/**
 * Lấy hồ sơ người dùng đang hoạt động hiện tại
 */
export function layHoSoHienTai(): HoSo {
  if (typeof window === "undefined" || !window.localStorage) {
    return HO_SO_KHACH_MAC_DINH;
  }

  try {
    const currentId = window.localStorage.getItem(CURRENT_PROFILE_KEY);
    const list = layDanhSachHoSo();

    if (currentId) {
      const found = list.find((p) => p.id === currentId);
      if (found) return found;
    }

    // Nếu chưa thiết lập, mặc định dùng hồ sơ khách
    window.localStorage.setItem(CURRENT_PROFILE_KEY, HO_SO_KHACH_MAC_DINH.id);
    return HO_SO_KHACH_MAC_DINH;
  } catch (err) {
    console.error("Lỗi đọc hồ sơ hiện tại:", err);
    return HO_SO_KHACH_MAC_DINH;
  }
}

/**
 * Tạo khóa lưu trữ localStorage theo định dạng yêu cầu: "vpr:<hoSo>:<suffix>"
 * Dữ liệu giữa các hồ sơ sẽ hoàn toàn tách biệt.
 */
export function layKhoaTheoHoSo(suffix: string): string {
  const hoSo = layHoSoHienTai();
  return `vpr:${hoSo.id}:${suffix}`;
}

/**
 * Chuyển đổi sang một hồ sơ đã có
 */
export function chuyenHoSo(hoSoId: string): HoSo {
  const list = layDanhSachHoSo();
  const target = list.find((p) => p.id === hoSoId) || HO_SO_KHACH_MAC_DINH;

  try {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(CURRENT_PROFILE_KEY, target.id);
      window.dispatchEvent(
        new CustomEvent(PROFILE_CHANGE_EVENT, { detail: target })
      );
    }
  } catch (err) {
    console.error("Lỗi chuyển hồ sơ:", err);
  }

  return target;
}

/**
 * Tạo hồ sơ mới hoặc đăng nhập theo tên hiển thị (không cần mật khẩu)
 */
export function taoHoacChonHoSo(tenHienThi: string): HoSo {
  const trimmed = tenHienThi.trim();
  if (!trimmed || trimmed.toLowerCase() === "khách" || trimmed.toLowerCase() === "khach") {
    return dungHoSoKhach();
  }

  let slug = slugifyTen(trimmed);
  const list = layDanhSachHoSo();

  // Kiểm tra xem đã có hồ sơ với slug này chưa
  const existing = list.find((p) => p.id === slug || p.tenHienThi.toLowerCase() === trimmed.toLowerCase());
  if (existing) {
    chuyenHoSo(existing.id);
    return existing;
  }

  // Nếu bị trùng slug nhưng khác tên, thêm hậu tố thời gian ngắn
  if (list.some((p) => p.id === slug)) {
    slug = `${slug}_${Date.now().toString(36).slice(-3)}`;
  }

  const newHoSo: HoSo = {
    id: slug,
    tenHienThi: trimmed,
    laKhach: false,
    taoLuc: Date.now(),
  };

  const updatedList = [...list, newHoSo];

  try {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(PROFILES_LIST_KEY, JSON.stringify(updatedList));
      window.localStorage.setItem(CURRENT_PROFILE_KEY, newHoSo.id);
      window.dispatchEvent(
        new CustomEvent(PROFILE_CHANGE_EVENT, { detail: newHoSo })
      );
    }
  } catch (err) {
    console.error("Lỗi tạo hồ sơ mới:", err);
  }

  return newHoSo;
}

/**
 * Chuyển nhanh sang chế độ hồ sơ khách (không chặn người dùng)
 */
export function dungHoSoKhach(): HoSo {
  return chuyenHoSo("khach");
}
