/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { VungThoiTiet, VungId, vungData, layVungTheoId } from "../data/vung";

export type ThoiTietLoai = "mua" | "nong" | "lanh" | "mat";
export type KhungGioLoai = "rang_dong" | "ngay" | "hoang_hon" | "dem";
export type NguonViTri = "gps" | "tim_kiem" | "mac_dinh";

export interface ThongTinViTri {
  ten: string;
  lat: number;
  lon: number;
  nguon: NguonViTri;
  vungId: VungId;
}

export interface ThoiTietState {
  vung: VungThoiTiet;
  thoiTiet: ThoiTietLoai;
  khungGio: KhungGioLoai;
  nhietDo: number;
  precipitation: number;
  weatherCode: number;
  moTaThoiTiet: string;
  moTaKhungGio: string;
  isFallback: boolean;
  timestamp: number;
  doAm?: number;
  viTri: ThongTinViTri;
}

// Ngưỡng nhiệt độ và mã thời tiết chuẩn để đội dễ tinh chỉnh
export const NGUONG_THOI_TIET = {
  NONG_MIN: 31, // ≥ 31°C: nong
  LANH_MAX: 19, // < 19°C: lanh
  // 51–67, 80–82, 95–99
  MUA_CODES_RANGE_1: [51, 67] as [number, number],
  MUA_CODES_RANGE_2: [80, 82] as [number, number],
  MUA_CODES_RANGE_3: [95, 99] as [number, number],
};

export function isRainCode(code: number): boolean {
  return (
    (code >= NGUONG_THOI_TIET.MUA_CODES_RANGE_1[0] && code <= NGUONG_THOI_TIET.MUA_CODES_RANGE_1[1]) ||
    (code >= NGUONG_THOI_TIET.MUA_CODES_RANGE_2[0] && code <= NGUONG_THOI_TIET.MUA_CODES_RANGE_2[1]) ||
    (code >= NGUONG_THOI_TIET.MUA_CODES_RANGE_3[0] && code <= NGUONG_THOI_TIET.MUA_CODES_RANGE_3[1])
  );
}

export function suyRaThoiTiet(
  nhietDo: number,
  precipitation: number,
  weatherCode: number
): ThoiTietLoai {
  if (precipitation > 0 || isRainCode(weatherCode)) {
    return "mua";
  }
  if (nhietDo >= NGUONG_THOI_TIET.NONG_MIN) {
    return "nong";
  }
  if (nhietDo < NGUONG_THOI_TIET.LANH_MAX) {
    return "lanh";
  }
  return "mat";
}

/**
 * Suy ra khung giờ theo sunrise/sunset:
 * - "rang_dong": từ sunrise − 30 phút đến + 90 phút
 * - "hoang_hon": từ sunset − 90 phút đến + 30 phút
 * - "ngay": giữa rạng đông và hoàng hôn
 * - "dem": còn lại
 */
export function suyRaKhungGio(
  sunriseStr?: string,
  sunsetStr?: string,
  now = new Date()
): KhungGioLoai {
  if (!sunriseStr || !sunsetStr) {
    return suyRaKhungGioTheoDongHo(now);
  }

  try {
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const sRiseParts = sunriseStr.split("T")[1]?.split(":") ?? [];
    const sSetParts = sunsetStr.split("T")[1]?.split(":") ?? [];

    if (sRiseParts.length < 2 || sSetParts.length < 2) {
      return suyRaKhungGioTheoDongHo(now);
    }

    const sRiseMin = parseInt(sRiseParts[0], 10) * 60 + parseInt(sRiseParts[1], 10);
    const sSetMin = parseInt(sSetParts[0], 10) * 60 + parseInt(sSetParts[1], 10);

    const rangDongStart = sRiseMin - 30;
    const rangDongEnd = sRiseMin + 90;

    const hoangHonStart = sSetMin - 90;
    const hoangHonEnd = sSetMin + 30;

    if (currentMinutes >= rangDongStart && currentMinutes < rangDongEnd) {
      return "rang_dong";
    }
    if (currentMinutes >= hoangHonStart && currentMinutes < hoangHonEnd) {
      return "hoang_hon";
    }
    if (currentMinutes >= rangDongEnd && currentMinutes < hoangHonStart) {
      return "ngay";
    }
    return "dem";
  } catch {
    return suyRaKhungGioTheoDongHo(now);
  }
}

/**
 * Khung giờ cố định theo đồng hồ thiết bị:
 * - 5–8h: rạng đông
 * - 8–16h: ngày
 * - 16–19h: hoàng hôn
 * - 19–5h: đêm
 */
export function suyRaKhungGioTheoDongHo(now = new Date()): KhungGioLoai {
  const h = now.getHours();
  if (h >= 5 && h < 8) return "rang_dong";
  if (h >= 8 && h < 16) return "ngay";
  if (h >= 16 && h < 19) return "hoang_hon";
  return "dem";
}

/**
 * Lấy thời tiết thủ công từ S7 nếu có, nếu không thì trả về "mat"
 */
export function layThoiTietThuCongS7(): ThoiTietLoai {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      const stored = window.localStorage.getItem("vpr:s7:thoiTiet");
      if (stored === "mua" || stored === "nong" || stored === "lanh" || stored === "mat") {
        return stored;
      }
    }
  } catch {
    // Bỏ qua
  }
  return "mat";
}

export function layMoTaThoiTiet(tt: ThoiTietLoai): string {
  switch (tt) {
    case "mua":
      return "Mưa nhẹ";
    case "nong":
      return "Nắng nóng";
    case "lanh":
      return "Se lạnh";
    case "mat":
    default:
      return "Dịu mát";
  }
}

export function layMoTaKhungGio(kg: KhungGioLoai): string {
  switch (kg) {
    case "rang_dong":
      return "rạng đông";
    case "ngay":
      return "ban ngày";
    case "hoang_hon":
      return "hoàng hôn";
    case "dem":
    default:
      return "đêm tối";
  }
}

const CACHE_TTL_MS = 30 * 60 * 1000; // 30 phút
const TIMEOUT_MS = 6000; // 6 giây

/**
 * Danh sách gợi ý địa điểm tiêu biểu tại Việt Nam (hỗ trợ tìm kiếm nhanh 0ms)
 */
export interface DiaDiemGoiY {
  ten: string;
  tinh?: string;
  lat: number;
  lon: number;
  vungId: VungId;
}

export const DIA_DIEM_VIET_NAM: DiaDiemGoiY[] = [
  { ten: "Hà Nội", tinh: "Hà Nội", lat: 21.0285, lon: 105.8542, vungId: "bac" },
  { ten: "Hải Phòng", tinh: "Hải Phòng", lat: 20.8449, lon: 106.6881, vungId: "bac" },
  { ten: "Hạ Long", tinh: "Quảng Ninh", lat: 20.9505, lon: 107.0734, vungId: "bac" },
  { ten: "Sa Pa", tinh: "Lào Cai", lat: 22.3364, lon: 103.8438, vungId: "bac" },
  { ten: "Ninh Bình", tinh: "Ninh Bình", lat: 20.2506, lon: 105.9745, vungId: "bac" },
  { ten: "Bắc Ninh", tinh: "Bắc Ninh", lat: 21.1861, lon: 106.0763, vungId: "bac" },
  { ten: "Hà Giang", tinh: "Hà Giang", lat: 22.8233, lon: 104.9839, vungId: "bac" },
  { ten: "Cao Bằng", tinh: "Cao Bằng", lat: 22.6667, lon: 106.25, vungId: "bac" },
  { ten: "Lạng Sơn", tinh: "Lạng Sơn", lat: 21.85, lon: 106.75, vungId: "bac" },
  { ten: "Thái Nguyên", tinh: "Thái Nguyên", lat: 21.5928, lon: 105.8442, vungId: "bac" },
  { ten: "Điện Biên Phủ", tinh: "Điện Biên", lat: 21.3833, lon: 103.0167, vungId: "bac" },
  { ten: "Sơn La", tinh: "Sơn La", lat: 21.3256, lon: 103.9189, vungId: "bac" },

  { ten: "Huế", tinh: "Thừa Thiên Huế", lat: 16.4637, lon: 107.5909, vungId: "trung" },
  { ten: "Đà Nẵng", tinh: "Đà Nẵng", lat: 16.0544, lon: 108.2022, vungId: "trung" },
  { ten: "Hội An", tinh: "Quảng Nam", lat: 15.8801, lon: 108.338, vungId: "trung" },
  { ten: "Nha Trang", tinh: "Khánh Hòa", lat: 12.2388, lon: 109.1967, vungId: "trung" },
  { ten: "Quy Nhơn", tinh: "Bình Định", lat: 13.782, lon: 109.2197, vungId: "trung" },
  { ten: "Vinh", tinh: "Nghệ An", lat: 18.6796, lon: 105.6813, vungId: "trung" },
  { ten: "Đồng Hới", tinh: "Quảng Bình", lat: 17.4689, lon: 106.6223, vungId: "trung" },
  { ten: "Đông Hà", tinh: "Quảng Trị", lat: 16.8167, lon: 107.1, vungId: "trung" },
  { ten: "Quảng Ngãi", tinh: "Quảng Ngãi", lat: 15.1167, lon: 108.8, vungId: "trung" },
  { ten: "Tuy Hòa", tinh: "Phú Yên", lat: 13.0833, lon: 109.3, vungId: "trung" },
  { ten: "Phan Thiết", tinh: "Bình Thuận", lat: 10.9333, lon: 108.1, vungId: "trung" },
  { ten: "Phan Rang", tinh: "Ninh Thuận", lat: 11.5667, lon: 108.9833, vungId: "trung" },

  { ten: "Buôn Ma Thuột", tinh: "Đắk Lắk", lat: 12.6667, lon: 108.05, vungId: "taynguyen" },
  { ten: "Đà Lạt", tinh: "Lâm Đồng", lat: 11.9404, lon: 108.4583, vungId: "taynguyen" },
  { ten: "Pleiku", tinh: "Gia Lai", lat: 13.9833, lon: 108.0, vungId: "taynguyen" },
  { ten: "Kon Tum", tinh: "Kon Tum", lat: 14.35, lon: 108.0, vungId: "taynguyen" },
  { ten: "Gia Nghĩa", tinh: "Đắk Nông", lat: 12.0, lon: 107.7, vungId: "taynguyen" },
  { ten: "Bảo Lộc", tinh: "Lâm Đồng", lat: 11.55, lon: 107.81, vungId: "taynguyen" },

  { ten: "TP. Hồ Chí Minh", tinh: "TP. Hồ Chí Minh", lat: 10.8231, lon: 106.6297, vungId: "nam" },
  { ten: "Cần Thơ", tinh: "Cần Thơ", lat: 10.0452, lon: 105.7469, vungId: "nam" },
  { ten: "Vũng Tàu", tinh: "Bà Rịa - Vũng Tàu", lat: 10.346, lon: 107.0843, vungId: "nam" },
  { ten: "Biên Hòa", tinh: "Đồng Nai", lat: 10.9574, lon: 106.8427, vungId: "nam" },
  { ten: "Thủ Dầu Một", tinh: "Bình Dương", lat: 10.9805, lon: 106.6519, vungId: "nam" },
  { ten: "Mỹ Tho", tinh: "Tiền Giang", lat: 10.3543, lon: 106.3653, vungId: "nam" },
  { ten: "Bến Tre", tinh: "Bến Tre", lat: 10.2415, lon: 106.3759, vungId: "nam" },
  { ten: "Long Xuyên", tinh: "An Giang", lat: 10.3759, lon: 105.4185, vungId: "nam" },
  { ten: "Châu Đốc", tinh: "An Giang", lat: 10.7, lon: 105.1167, vungId: "nam" },
  { ten: "Rạch Giá", tinh: "Kiên Giang", lat: 10.0125, lon: 105.0809, vungId: "nam" },
  { ten: "Phú Quốc", tinh: "Kiên Giang", lat: 10.2289, lon: 103.9572, vungId: "nam" },
  { ten: "Cà Mau", tinh: "Cà Mau", lat: 9.1769, lon: 105.15, vungId: "nam" },
  { ten: "Tây Ninh", tinh: "Tây Ninh", lat: 11.31, lon: 106.0983, vungId: "nam" },
  { ten: "Tân An", tinh: "Long An", lat: 10.5333, lon: 106.4167, vungId: "nam" },
  { ten: "Sóc Trăng", tinh: "Sóc Trăng", lat: 9.6, lon: 105.97, vungId: "nam" },
  { ten: "Bạc Liêu", tinh: "Bạc Liêu", lat: 9.2941, lon: 105.7278, vungId: "nam" },
  { ten: "Trà Vinh", tinh: "Trà Vinh", lat: 9.9347, lon: 106.3453, vungId: "nam" },
  { ten: "Vĩnh Long", tinh: "Vĩnh Long", lat: 10.25, lon: 105.97, vungId: "nam" },
  { ten: "Cao Lãnh", tinh: "Đồng Tháp", lat: 10.4592, lon: 105.6322, vungId: "nam" },
];

export function xacDinhVungTheoToaDo(lat: number, lon: number): VungId {
  if (lat >= 19.5) return "bac";
  if (lat >= 14.5 && lat < 19.5) return "trung";
  if (lat >= 11.5 && lat < 14.5 && lon <= 108.6) return "taynguyen";
  if (lat >= 11.5 && lat < 14.5 && lon > 108.6) return "trung";
  return "nam";
}

export function boDauTiengViet(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐÐð]/g, "d");
}

/**
 * Tìm kiếm địa điểm bằng API miễn phí của Open-Meteo (không cần khóa API):
 * https://geocoding-api.open-meteo.com/v1/search?name={từ_khóa}&count=5&language=vi&format=json
 * Trả về tối đa 5 kết quả dạng { ten, tinh, lat, lon, vungId }
 */
export async function timKiemDiaDiem(query: string): Promise<DiaDiemGoiY[]> {
  const q = query.trim();
  if (!q) return [];

  const noAccent = boDauTiengViet(q);
  const urls = [
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      q
    )}&count=5&language=vi&format=json`,
  ];
  if (noAccent !== q) {
    urls.push(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        noAccent
      )}&count=5&language=vi&format=json`
    );
  }

  try {
    const responses = await Promise.all(
      urls.map((u) => fetch(u).then((r) => (r.ok ? r.json() : {})).catch(() => ({})))
    );
    const allResults = responses.flatMap((r: any) => (Array.isArray(r?.results) ? r.results : []));

    if (allResults.length > 0) {
      // Loại trùng lặp theo tọa độ
      const seen = new Set<string>();
      const unique: any[] = [];
      for (const item of allResults) {
        const key = `${Math.round(item.latitude * 100)}_${Math.round(item.longitude * 100)}`;
        if (!seen.has(key)) {
          seen.add(key);
          unique.push(item);
        }
      }

      // Sắp xếp ưu tiên: địa điểm ở Việt Nam (country_code === "VN"), sau đó đến khớp tên
      unique.sort((a, b) => {
        const aVN = a.country_code === "VN" || a.country === "Vietnam" || a.country === "Việt Nam" ? 0 : 1;
        const bVN = b.country_code === "VN" || b.country === "Vietnam" || b.country === "Việt Nam" ? 0 : 1;
        if (aVN !== bVN) return aVN - bVN;

        const aExact = boDauTiengViet(a.name).toLowerCase() === noAccent.toLowerCase() ? 0 : 1;
        const bExact = boDauTiengViet(b.name).toLowerCase() === noAccent.toLowerCase() ? 0 : 1;
        return aExact - bExact;
      });

      return unique.slice(0, 5).map((r) => {
        const lat = r.latitude;
        const lon = r.longitude;
        const vungId = xacDinhVungTheoToaDo(lat, lon);
        const rawName = (r.name || "").replace(/^Ð/, "Đ");
        const tinhThanh = (r.admin1 || r.country || "").replace(/^Ð/, "Đ");
        return {
          ten: rawName,
          tinh: tinhThanh && tinhThanh !== rawName ? tinhThanh : undefined,
          lat,
          lon,
          vungId,
        };
      });
    }
  } catch (err) {
    console.warn("Lỗi gọi Open-Meteo Geocoding API:", err);
  }

  // Dự phòng ngoại tuyến từ danh sách địa điểm Việt Nam
  const qLower = q.toLowerCase();
  const noAccentLower = noAccent.toLowerCase();
  return DIA_DIEM_VIET_NAM.filter(
    (d) =>
      d.ten.toLowerCase().includes(qLower) ||
      boDauTiengViet(d.ten).toLowerCase().includes(noAccentLower) ||
      (d.tinh && d.tinh.toLowerCase().includes(qLower))
  ).slice(0, 5);
}

/**
 * Bước a: Xin quyền vị trí trình duyệt (CHỈ KHI NGƯỜI DÙNG BẤM)
 */
export function xinQuyenViTriTrinhDuyet(): Promise<ThongTinViTri> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      reject(new Error("Trình duyệt không hỗ trợ dịch vụ định vị"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        const vungId = xacDinhVungTheoToaDo(lat, lon);

        // Tìm thành phố/tỉnh gần nhất để hiển thị tên thân thiện
        let closest = DIA_DIEM_VIET_NAM[0];
        let minDist = Infinity;
        for (const d of DIA_DIEM_VIET_NAM) {
          const dist = Math.hypot(d.lat - lat, d.lon - lon);
          if (dist < minDist) {
            minDist = dist;
            closest = d;
          }
        }

        const ten = minDist < 0.5 ? closest.ten : "Vị trí của bạn";

        resolve({
          ten,
          lat,
          lon,
          nguon: "gps",
          vungId,
        });
      },
      (err) => {
        reject(err);
      },
      {
        timeout: 10000,
        enableHighAccuracy: false,
      }
    );
  });
}

/**
 * Quản lý vị trí trong SessionStorage (chỉ lưu trong phiên hiện tại, không lưu trên máy chủ)
 */
export function docViTriSession(): ThongTinViTri | null {
  try {
    if (typeof window !== "undefined" && window.sessionStorage) {
      const raw = window.sessionStorage.getItem("vpr:session:vi_tri");
      if (raw) return JSON.parse(raw);
    }
  } catch {
    // Bỏ qua
  }
  return null;
}

export function luuViTriSession(viTri: ThongTinViTri | null): void {
  try {
    if (typeof window !== "undefined" && window.sessionStorage) {
      if (viTri) {
        window.sessionStorage.setItem("vpr:session:vi_tri", JSON.stringify(viTri));
      } else {
        window.sessionStorage.removeItem("vpr:session:vi_tri");
      }
    }
  } catch {
    // Bỏ qua
  }
}

/**
 * Bước c: Vị trí mặc định theo vùng trên Toạ Độ Ký Ức
 */
export function layViTriMacDinhTheoVung(vungId: VungId): ThongTinViTri {
  const v = layVungTheoId(vungId);
  return {
    ten: v.noi,
    lat: v.lat,
    lon: v.lon,
    nguon: "mac_dinh",
    vungId,
  };
}

/**
 * Kiểm tra các tham số URL ghi đè (dành cho kiểm thử và quay video):
 * ?sky=rang_dong|ngay|hoang_hon|dem
 * ?weather=nong|mat|lanh|mua
 * ?vung=bac|trung|taynguyen|nam
 */
export function docThamSoURL(): {
  skyOverride?: KhungGioLoai;
  weatherOverride?: ThoiTietLoai;
  vungOverride?: VungId;
} {
  if (typeof window === "undefined") return {};
  try {
    const params = new URLSearchParams(window.location.search);
    const sky = params.get("sky");
    const weather = params.get("weather");
    const vung = params.get("vung");

    const res: {
      skyOverride?: KhungGioLoai;
      weatherOverride?: ThoiTietLoai;
      vungOverride?: VungId;
    } = {};

    if (sky === "rang_dong" || sky === "ngay" || sky === "hoang_hon" || sky === "dem") {
      res.skyOverride = sky;
    }
    if (weather === "nong" || weather === "mat" || weather === "lanh" || weather === "mua") {
      res.weatherOverride = weather;
    }
    if (vung === "bac" || vung === "trung" || vung === "taynguyen" || vung === "nam") {
      res.vungOverride = vung;
    }

    return res;
  } catch {
    return {};
  }
}

/**
 * Gọi API thời tiết Open-Meteo và tính toán thời tiết/khung giờ.
 * Nhận vị trí tùy chỉnh hoặc lấy từ session hoặc mặc định theo vùng.
 */
export async function layThoiTietVung(
  vungId: VungId = "trung",
  customViTri?: ThongTinViTri
): Promise<ThoiTietState> {
  const urlParams = docThamSoURL();
  const effectiveVungId: VungId = urlParams.vungOverride ?? vungId;
  const targetVung = layVungTheoId(effectiveVungId);

  // Xác định vị trí hiệu lực
  const sessionViTri = docViTriSession();
  const activeViTri: ThongTinViTri =
    customViTri ??
    sessionViTri ??
    layViTriMacDinhTheoVung(effectiveVungId);

  const effectiveLat = activeViTri.lat;
  const effectiveLon = activeViTri.lon;

  // 1. Kiểm tra cache trong localStorage
  const cacheKey = `vpr:troi:${Math.round(effectiveLat * 100)}_${Math.round(effectiveLon * 100)}`;
  let cachedData: any = null;
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      const raw = window.localStorage.getItem(cacheKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Date.now() - parsed.timestamp < CACHE_TTL_MS) {
          cachedData = parsed;
        }
      }
    }
  } catch {
    // Bỏ qua
  }

  // Fallback mặc định theo đồng hồ và S7
  const fallbackKhungGio = suyRaKhungGioTheoDongHo();
  const fallbackThoiTiet = layThoiTietThuCongS7();
  const fallbackTemp =
    fallbackThoiTiet === "nong"
      ? 32
      : fallbackThoiTiet === "lanh"
      ? 17
      : fallbackThoiTiet === "mua"
      ? 24
      : 26;

  const buildResult = (
    tt: ThoiTietLoai,
    kg: KhungGioLoai,
    temp: number,
    precip: number,
    code: number,
    doAmVal: number | undefined,
    isFb: boolean
  ): ThoiTietState => {
    const finalTt = urlParams.weatherOverride ?? tt;
    const finalKg = urlParams.skyOverride ?? kg;

    return {
      vung: targetVung,
      thoiTiet: finalTt,
      khungGio: finalKg,
      nhietDo: Math.round(temp),
      precipitation: precip,
      weatherCode: code,
      moTaThoiTiet: layMoTaThoiTiet(finalTt),
      moTaKhungGio: layMoTaKhungGio(finalKg),
      isFallback: isFb,
      timestamp: Date.now(),
      doAm: doAmVal,
      viTri: activeViTri,
    };
  };

  // Nếu có cache hợp lệ và không có URL override buộc fetch
  if (cachedData) {
    return buildResult(
      cachedData.thoiTiet,
      cachedData.khungGio,
      cachedData.nhietDo,
      cachedData.precipitation ?? 0,
      cachedData.weatherCode ?? 0,
      cachedData.doAm,
      cachedData.isFallback ?? false
    );
  }

  // 2. Gọi Open-Meteo với timeout 6 giây (bao gồm relative_humidity_2m)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${effectiveLat}&longitude=${effectiveLon}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code&daily=sunrise,sunset&timezone=auto`;

  try {
    const res = await fetch(apiUrl, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Open-Meteo HTTP ${res.status}`);
    }

    const data = await res.json();
    const temp = data?.current?.temperature_2m ?? fallbackTemp;
    const precip = data?.current?.precipitation ?? 0;
    const code = data?.current?.weather_code ?? 0;
    const humidity = data?.current?.relative_humidity_2m;

    const sunriseStr = data?.daily?.sunrise?.[0];
    const sunsetStr = data?.daily?.sunset?.[0];

    const thoiTiet = suyRaThoiTiet(temp, precip, code);
    const khungGio = suyRaKhungGio(sunriseStr, sunsetStr);

    const result = buildResult(thoiTiet, khungGio, temp, precip, code, humidity, false);

    // Lưu cache 30 phút
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem(
          cacheKey,
          JSON.stringify({
            thoiTiet: result.thoiTiet,
            khungGio: result.khungGio,
            nhietDo: result.nhietDo,
            precipitation: result.precipitation,
            weatherCode: result.weatherCode,
            doAm: result.doAm,
            isFallback: false,
            timestamp: Date.now(),
          })
        );
      }
    } catch {
      // Bỏ qua lỗi quota
    }

    return result;
  } catch {
    clearTimeout(timeoutId);
    return buildResult(
      fallbackThoiTiet,
      fallbackKhungGio,
      fallbackTemp,
      fallbackThoiTiet === "mua" ? 1.5 : 0,
      fallbackThoiTiet === "mua" ? 61 : 0,
      75,
      true
    );
  }
}
