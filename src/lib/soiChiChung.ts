/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * LOGIC SO SÁNH & TÌM SỢI CHỈ CHUNG (CULTURAL INTERSECTION ENGINE)
 * Tìm kiếm các mối liên hệ giao thoa văn hóa giữa các nhóm cộng đồng, vùng miền:
 * Kỹ nghệ dệt, chất liệu bạc, thích ứng khí hậu, dáng áo, nếp khăn truyền thống.
 * Tuyệt đối không để lộ tên biến code hay cấu trúc backend.
 */

import { Nhom, TrangPhuc } from "../types";
import { trangPhuc } from "../data/trangphuc";
import { nhom } from "../data/nhom";

export interface DiemChungItem {
  id: string;
  tieuDe: string;
  moTa: string;
  canCu: string;
  bieuTuong: string;
}

export interface TrangPhucNhomInfo {
  trangPhuc: TrangPhuc;
  suThat: string[];
}

export interface DiemRiengNhom {
  nhom: Nhom;
  trangPhucs: TrangPhucNhomInfo[];
  tatCaSuThat: string[];
}

/**
 * Lấy toàn bộ thông tin và điểm riêng (từ trangPhuc.suThat) của một nhóm,
 * loại bỏ trùng lặp với mô tả ngắn để tránh lặp từ.
 */
export function layDiemRiengCuaNhom(nhomItem: Nhom): DiemRiengNhom {
  const dsTrangPhuc = trangPhuc.filter((tp) => tp.nhomIds.includes(nhomItem.id));
  const tatCaSuThat: string[] = [];

  const trangPhucs: TrangPhucNhomInfo[] = dsTrangPhuc.map((tp) => {
    // Lọc bỏ những dòng trong suThat giống hệt moTaNgan
    const filteredSuThat = tp.suThat.filter(
      (st) => st.trim().toLowerCase() !== tp.moTaNgan.trim().toLowerCase()
    );

    filteredSuThat.forEach((st) => {
      if (!tatCaSuThat.includes(st)) {
        tatCaSuThat.push(st);
      }
    });

    return {
      trangPhuc: tp,
      suThat: filteredSuThat.length > 0 ? filteredSuThat : tp.suThat.slice(1),
    };
  });

  return {
    nhom: nhomItem,
    trangPhucs,
    tatCaSuThat,
  };
}

/**
 * Suy luận TRỰC TIẾP điểm chung giữa hai nhóm văn hóa.
 * Trình bày bằng ngôn ngữ văn hóa giàu cảm xúc, trang nhã, không chứa biến kỹ thuật.
 */
export function suyDiemChung(nhomA: Nhom, nhomB: Nhom): DiemChungItem[] {
  if (nhomA.id === nhomB.id) {
    return [
      {
        id: "cung_nhom",
        tieuDe: "Cùng một nhóm văn hóa",
        moTa: `Bạn đang chọn cùng nhóm ${nhomA.ten}. Hãy chọn hai nhóm khác nhau ở thanh chọn phía trên để so sánh nét riêng và tìm sợi chỉ chung giao thoa nhé.`,
        canCu: "Chọn hai nhóm khác nhau để so sánh",
        bieuTuong: "✨",
      },
    ];
  }

  const ketQua: DiemChungItem[] = [];

  const dsTpA = trangPhuc.filter((tp) => tp.nhomIds.includes(nhomA.id));
  const dsTpB = trangPhuc.filter((tp) => tp.nhomIds.includes(nhomB.id));

  // 1. CHIA SẺ TRANG PHỤC TRUYỀN THỐNG (cùng chia sẻ mẫu trang phục)
  const sharedCostumes = dsTpA.filter((tpA) =>
    dsTpB.some((tpB) => tpB.id === tpA.id)
  );

  if (sharedCostumes.length > 0) {
    const names = sharedCostumes.map((c) => c.ten).join(", ");
    ketQua.push({
      id: "chung_trang_phuc",
      tieuDe: "Chung dòng trang phục di sản",
      moTa: `Cả hai cộng đồng cùng chia sẻ biểu tượng y phục ${names} qua các thời kỳ lịch sử và đời sống lễ hội.`,
      canCu: `Cùng chung dòng trang phục: ${names}`,
      bieuTuong: "👘",
    });
  }

  // 2. KỸ NGHỆ DỆT THỦ CÔNG / THỔ CẨM
  const aCoDet = dsTpA.some(
    (tp) => tp.suThat.some((st) => /dệt/i.test(st)) || /dệt/i.test(tp.moTaNgan)
  );
  const bCoDet = dsTpB.some(
    (tp) => tp.suThat.some((st) => /dệt/i.test(st)) || /dệt/i.test(tp.moTaNgan)
  );

  if (aCoDet && bCoDet) {
    ketQua.push({
      id: "det_thu_cong",
      tieuDe: "Kỹ nghệ dệt sợi tự nhiên truyền đời",
      moTa: "Đều bảo tồn kỹ thuật xe sợi, dệt lanh và thổ cẩm thủ công, gắn liền với nhịp sống buôn làng và làng nghề cổ truyền Việt Nam.",
      canCu: "Kỹ thuật dệt sợi thủ công (lanh, tơ tằm, thổ cẩm) được lưu truyền qua nhiều thế hệ",
      bieuTuong: "🧵",
    });
  }

  // 3. CHẤT LIỆU BẠC / KIM HOÀN
  const aCoBac = dsTpA.some((tp) => tp.suThat.some((st) => /bạc/i.test(st)));
  const bCoBac = dsTpB.some((tp) => tp.suThat.some((st) => /bạc/i.test(st)));

  if (aCoBac && bCoBac) {
    ketQua.push({
      id: "trang_suc_bac",
      tieuDe: "Nghệ thuật kim hoàn & trang sức bạc",
      moTa: "Kim loại bạc tinh xảo (hàng cúc bướm bạc, kiềng bạc, vòng cổ) vừa là điểm nhấn quý phái, vừa mang ý nghĩa may mắn và chở che bình an.",
      canCu: "Nghệ thuật chạm khắc kim loại bạc làm trang sức và khuy cài",
      bieuTuong: "💍",
    });
  }

  // 4. CHUNG KHÔNG GIAN ĐỊA LÝ / VÙNG MIỀN
  if (nhomA.vung === nhomB.vung) {
    let tenVung = "";
    let moTaVung = "";
    if (nhomA.vung === "bac") {
      tenVung = "Bắc Bộ";
      moTaVung =
        "Cùng gắn bó với cảnh sắc thiên nhiên và không gian văn hóa bốn mùa Bắc Bộ & vùng núi phía Bắc.";
    } else if (nhomA.vung === "trung") {
      tenVung = "miền Trung";
      moTaVung =
        "Cùng sinh sống trên dải đất duyên hải miền Trung đầy nắng gió và bề dày trầm tích lịch sử.";
    } else if (nhomA.vung === "nam") {
      tenVung = "Nam Bộ";
      moTaVung =
        "Cùng hòa quyện trong không gian văn hóa sông nước trù phú, hào sảng và phóng khoáng phương Nam.";
    }

    if (tenVung) {
      ketQua.push({
        id: "cung_vung_mien",
        tieuDe: `Không gian văn hóa chung ${tenVung}`,
        moTa: moTaVung,
        canCu: `Thổ nhưỡng, khí hậu và môi trường sống chung của dải đất ${tenVung}`,
        bieuTuong: "🗺️",
      });
    }
  }

  // 5. VĂN HÓA KHĂN ĐỘI / KHĂN QUÀNG TRUYỀN THỐNG
  const aCoKhan = dsTpA.some((tp) => tp.suThat.some((st) => /khăn/i.test(st)));
  const bCoKhan = dsTpB.some((tp) => tp.suThat.some((st) => /khăn/i.test(st)));

  if (aCoKhan && bCoKhan && !ketQua.some((k) => k.id === "chung_trang_phuc")) {
    ketQua.push({
      id: "phu_kien_khan",
      tieuDe: "Nét duyên khăn đội & khăn choàng",
      moTa: "Nếp khăn truyền thống vừa che chở nắng gió, vừa định hình nét duyên đoan trang, kín đáo và nhận diện độc đáo của y phục.",
      canCu: "Tập quán đội và choàng khăn truyền thống trong sinh hoạt và lễ hội",
      bieuTuong: "🧣",
    });
  }

  // 6. DÁNG ÁO NGẮN GỌN GÀNG
  const aCoDangGon = dsTpA.some(
    (tp) =>
      tp.suThat.some((st) => /dáng gọn|áo ngắn/i.test(st)) ||
      /áo ngắn|gọn/i.test(tp.moTaNgan)
  );
  const bCoDangGon = dsTpB.some(
    (tp) =>
      tp.suThat.some((st) => /dáng gọn|áo ngắn/i.test(st)) ||
      /áo ngắn|gọn/i.test(tp.moTaNgan)
  );

  if (aCoDangGon && bCoDangGon && !ketQua.some((k) => k.id === "chung_trang_phuc")) {
    ketQua.push({
      id: "dang_ao_gon",
      tieuDe: "Dáng áo ngắn thanh thoát & tiện dụng",
      moTa: "Kiểu áo dáng ngắn hoặc ôm nhẹ thân người, vừa tôn nét đẹp tự nhiên vừa thích hợp cho nhịp sống lao động và sinh hoạt thường nhật.",
      canCu: "Thiết kế dáng áo ngắn gọn, thích ứng cao với đời sống đời thường",
      bieuTuong: "✂️",
    });
  }

  return ketQua;
}
