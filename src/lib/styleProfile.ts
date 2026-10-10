/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { OutfitSaved } from "./guiKyUc";
import { trangPhuc } from "../data/trangphuc";
import { mauSac } from "../data/mausac";
import { nhom } from "../data/nhom";
import { vungData, VungId } from "../data/vung";
import { keGoiYVungChuaThu } from "./loiKe";

export interface StyleProfileInfo {
  tongBoDaLuu: number;
  hienThiKhoi: boolean; // Chỉ hiện khi có ít nhất 3 bộ đã lưu (outfits.length >= 3)
  boDoLuuGanNhat?: {
    id: string;
    ten: string;
  };
  mauNhieuNhat?: string;
  tongMauHayChon?: string; // Nhóm màu xuất hiện >= 40% số bộ đã lưu
  vungQuanTamNhat?: {
    id: VungId;
    ten: string;
    soBo: number;
  };
  nhanRemix?: "Bạn thích cách tân" | "Bạn thích giữ nét truyền thống";
  vungChuaThu: { id: VungId; ten: string }[];
  vungDaLuuNhieu?: { id: VungId; ten: string; soBo: number };
  cauGoiYVung?: string | null;
}

// Phân nhóm tông màu
const TONG_MAU_MAP: Record<string, "am" | "tram" | "sang"> = {
  m_do: "am",
  m_vang: "am",
  m_nau: "am",
  m_hongsen: "am",
  m_cham: "tram",
  m_reu: "tram",
  m_trang: "sang",
};

const TEN_TONG_MAU: Record<"am" | "tram" | "sang", string> = {
  am: "Tông ấm (Đỏ điều, Vàng nghệ, Nâu, Hồng sen)",
  tram: "Tông trầm (Chàm, Xanh rêu)",
  sang: "Tông thanh sáng (Trắng ngà)",
};

/**
 * Suy ra hồ sơ phong cách (Style Profile) hoàn toàn từ hành vi và dữ liệu đã lưu
 * Không hỏi thêm người dùng, không gọi AI, hoạt động hoàn toàn cục bộ
 */
export function layThongTinStyleProfile(outfits: OutfitSaved[]): StyleProfileInfo {
  const tongBoDaLuu = outfits.length;
  const hienThiKhoi = tongBoDaLuu >= 3;

  if (tongBoDaLuu === 0) {
    return {
      tongBoDaLuu: 0,
      hienThiKhoi: false,
      vungChuaThu: vungData.map((v) => ({ id: v.id, ten: v.ten })),
    };
  }

  // Sắp xếp các bộ đã lưu theo thời gian tạo mới nhất
  const sorted = [...outfits].sort((a, b) => b.taoLuc - a.taoLuc);
  const latest = sorted[0];
  const latestTp = trangPhuc.find((t) => t.id === latest.trangPhucId);
  const boDoLuuGanNhat = latestTp
    ? {
        id: latestTp.id,
        ten: latestTp.ten,
      }
    : undefined;

  // 1. Tần suất màu sắc
  const mauCounts: Record<string, number> = {};
  const tongCounts: Record<"am" | "tram" | "sang", number> = { am: 0, tram: 0, sang: 0 };

  for (const o of outfits) {
    if (o.mauId) {
      mauCounts[o.mauId] = (mauCounts[o.mauId] || 0) + 1;
      const tong = TONG_MAU_MAP[o.mauId];
      if (tong) {
        tongCounts[tong] = (tongCounts[tong] || 0) + 1;
      }
    }
  }

  // Màu xuất hiện nhiều nhất
  let maxMauId = "";
  let maxMauCount = 0;
  for (const [mid, cnt] of Object.entries(mauCounts)) {
    if (cnt > maxMauCount) {
      maxMauCount = cnt;
      maxMauId = mid;
    }
  }
  const mauNhieuNhatObj = mauSac.find((m) => m.id === maxMauId);
  const mauNhieuNhat = mauNhieuNhatObj?.ten;

  // Tông màu hay chọn (nhóm/tông màu xuất hiện >= 40% số bộ)
  let tongMauHayChon: string | undefined;

  // Kiểm tra màu đơn lẻ >= 40%
  if (maxMauCount / tongBoDaLuu >= 0.4 && mauNhieuNhatObj) {
    const pt = Math.round((maxMauCount / tongBoDaLuu) * 100);
    tongMauHayChon = `Sắc ${mauNhieuNhatObj.ten} (${pt}% số bộ)`;
  } else {
    // Kiểm tra nhóm tông màu >= 40%
    for (const [tKey, cnt] of Object.entries(tongCounts) as ["am" | "tram" | "sang", number][]) {
      if (cnt / tongBoDaLuu >= 0.4) {
        const pt = Math.round((cnt / tongBoDaLuu) * 100);
        tongMauHayChon = `${TEN_TONG_MAU[tKey]} (${pt}% số bộ)`;
        break;
      }
    }
  }

  // 2. Thống kê theo vùng văn hóa (Toạ Độ Ký Ức)
  const vungCounts: Record<VungId, number> = {
    bac: 0,
    trung: 0,
    taynguyen: 0,
    nam: 0,
  };

  let tuDoCount = 0;
  let coDieuKienCount = 0;

  for (const o of outfits) {
    const tp = trangPhuc.find((t) => t.id === o.trangPhucId);
    if (tp) {
      // Tìm vùng dựa trên nhóm văn hóa của trang phục
      const nhomObj = nhom.find((n) => tp.nhomIds.includes(n.id));
      const vungId = nhomObj?.vung as VungId | undefined;
      if (vungId && vungCounts[vungId] !== undefined) {
        vungCounts[vungId]++;
      }
      if (tp.mucRemix === "tu_do") {
        tuDoCount++;
      } else if (tp.mucRemix === "co_dieu_kien") {
        coDieuKienCount++;
      }
    }
  }

  // Vùng quan tâm nhiều nhất
  let topVungId: VungId = "trung";
  let topVungCount = 0;
  for (const [vid, cnt] of Object.entries(vungCounts) as [VungId, number][]) {
    if (cnt > topVungCount) {
      topVungCount = cnt;
      topVungId = vid;
    }
  }

  const vungQuanTamNhat =
    topVungCount > 0
      ? {
          id: topVungId,
          ten: vungData.find((v) => v.id === topVungId)?.ten || topVungId,
          soBo: topVungCount,
        }
      : undefined;

  // Vùng đã lưu nhiều
  const vungDaLuuNhieu = vungQuanTamNhat;

  // Các vùng chưa thử (số bộ = 0)
  const vungChuaThu = vungData
    .filter((v) => vungCounts[v.id] === 0)
    .map((v) => ({ id: v.id, ten: v.ten }));

  // 3. Tỉ lệ mucRemix
  const nhanRemix: "Bạn thích cách tân" | "Bạn thích giữ nét truyền thống" =
    tuDoCount > coDieuKienCount
      ? "Bạn thích cách tân"
      : "Bạn thích giữ nét truyền thống";

  // 4. Câu gợi ý so khớp đơn giản không dùng AI
  const cauGoiYVung = keGoiYVungChuaThu({
    vungChuaThu,
    vungDaLuuNhieu,
  });

  return {
    tongBoDaLuu,
    hienThiKhoi,
    boDoLuuGanNhat,
    mauNhieuNhat,
    tongMauHayChon,
    vungQuanTamNhat,
    nhanRemix,
    vungChuaThu,
    vungDaLuuNhieu,
    cauGoiYVung,
  };
}
