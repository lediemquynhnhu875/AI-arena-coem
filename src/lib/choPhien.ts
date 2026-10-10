/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { NhanVatConfig, NHAN_VAT_MAC_DINH } from "./avatar";
import { OutfitSaved } from "./guiKyUc";
import { evaluateRemix } from "./rules";
import { trangPhuc } from "../data/trangphuc";
import { layKhoaTheoHoSo } from "./hoSo";

export type LyDoBinhChon = "hop_dip" | "phoi_mau" | "ton_trong_vung_mien";

export interface BinhChonStats {
  hop_dip: number;
  phoi_mau: number;
  ton_trong_vung_mien: number;
}

export interface BaiChoPhien {
  id: string;
  nguoiDang: string;
  laToi?: boolean;
  outfitId?: string;
  trangPhucId: string;
  nhomId: string;
  mauId: string;
  phuKienIds: string[];
  hoaVanThem?: string | null;
  phongCach?: string | null;
  caption: string;
  nhan: "chuan" | "sang_tao" | "can_xem_lai" | "chua_du_du_lieu";
  lyDo: string;
  nhanVatConfig: NhanVatConfig;
  taoLuc: number;
  binhChon: BinhChonStats;
}

export const CHO_PHIEN_STORAGE_KEY = "vpr:cho_phien_posts";
export const CHO_PHIEN_VOTES_KEY = "vpr:cho_phien_my_votes";

export function layKhoaBinhChonChoPhien(): string {
  return layKhoaTheoHoSo("cho_phien_my_votes");
}

// 8 BÀI MẪU DO ĐỘI SOẠN SẴN: Nhân vật đa dạng về ngoại hình, vóc dáng, màu da, giới tính, đầy đủ 3 nhãn văn hóa
export const SAMPLE_CHO_PHIEN_POSTS: BaiChoPhien[] = [
  {
    id: "cp1",
    nguoiDang: "Thảo Vy (Bắc Ninh)",
    trangPhucId: "tu_than",
    nhomId: "kb",
    mauId: "m_cham",
    phuKienIds: ["khan_mo_qua", "non_quai_thao"],
    caption: "Chiều hội Lim... nếp áo tứ thân chàm mộc mạc cùng vành nón quai thao che nghiêng câu quan họ trao duyên.",
    nhan: "chuan",
    lyDo: "Áo tứ thân đi cùng khăn mỏ quạ và nón quai thao là cách phối chuẩn nếp phụ nữ Bắc Bộ xưa.",
    taoLuc: 1711200000000,
    binhChon: {
      hop_dip: 14,
      phoi_mau: 18,
      ton_trong_vung_mien: 25,
    },
    nhanVatConfig: {
      tuoi: "nguoi_lon",
      gioi: "nu",
      vocDang: "manh",
      tongDa: 1,
      toc: "bui_cao",
    },
  },
  {
    id: "cp2",
    nguoiDang: "Minh Khôi (Huế)",
    trangPhucId: "aodai",
    nhomId: "kh",
    mauId: "m_trang",
    phuKienIds: ["sneaker", "tote"],
    caption: "Áo dài trắng thong thả dạo phố cuối tuần, mang cùng đôi sneaker để thoải mái đạp xe qua cầu Trường Tiền.",
    nhan: "sang_tao",
    lyDo: "Cách tân phụ kiện hiện đại (sneaker, túi tote) cùng tà áo dài truyền thống là hướng remix quen thuộc, trẻ trung.",
    taoLuc: 1711210000000,
    binhChon: {
      hop_dip: 20,
      phoi_mau: 12,
      ton_trong_vung_mien: 8,
    },
    nhanVatConfig: {
      tuoi: "nguoi_lon",
      gioi: "nam",
      vocDang: "trung_binh",
      tongDa: 3,
      toc: "ngan",
    },
  },
  {
    id: "cp3",
    nguoiDang: "Út Nhỏ (Bến Tre)",
    trangPhucId: "ba_ba",
    nhomId: "kn",
    mauId: "m_nau",
    phuKienIds: ["khan_ran", "non_la"],
    caption: "Sáng ra vườn dừa, khoác chiếc áo bà ba màu nâu đất cùng chiếc khăn rằn quấn cổ đón ngọn gió sông rượi mát.",
    nhan: "chuan",
    lyDo: "Áo bà ba và khăn rằn thường đi cùng nhau, thể hiện lối sống giản dị, thuận hòa miền sông nước.",
    taoLuc: 1711220000000,
    binhChon: {
      hop_dip: 16,
      phoi_mau: 15,
      ton_trong_vung_mien: 22,
    },
    nhanVatConfig: {
      tuoi: "nguoi_lon",
      gioi: "nu",
      vocDang: "day_dan",
      tongDa: 4,
      toc: "dai_xoa",
    },
  },
  {
    id: "cp4",
    nguoiDang: "Lò Thị Mai (Sơn La)",
    trangPhucId: "co_thai",
    nhomId: "thai",
    mauId: "m_trang",
    phuKienIds: ["khan_pieu", "vong_bac"],
    caption: "Áo cỏm trắng ôm eo thon, cài hàng cúc bạc và choàng chiếc khăn piêu thêu chỉ ngũ sắc đi hội xòe mùa xuân.",
    nhan: "chuan",
    lyDo: "Áo cỏm cài cúc bạc đi cùng khăn piêu là nét đẹp trang nhã mẫu mực của phụ nữ Thái Tây Bắc.",
    taoLuc: 1711230000000,
    binhChon: {
      hop_dip: 19,
      phoi_mau: 21,
      ton_trong_vung_mien: 28,
    },
    nhanVatConfig: {
      tuoi: "nguoi_lon",
      gioi: "nu",
      vocDang: "manh",
      tongDa: 2,
      toc: "bui_cao",
    },
  },
  {
    id: "cp5",
    nguoiDang: "Vàng A Súa (Hà Giang)",
    trangPhucId: "mong_lanh",
    nhomId: "mong",
    mauId: "m_cham",
    phuKienIds: ["vong_bac"],
    caption: "Vải lanh dệt tay vẽ sáp ong tỉ mỉ cả năm trời, đeo chiếc vòng bạc gia truyền xuống phiên chợ sớm đầu năm.",
    nhan: "chuan",
    lyDo: "Trang phục dệt lanh truyền thống phối cùng trang sức bạc nguyên khối thể hiện trọn vẹn bản sắc người Mông.",
    taoLuc: 1711240000000,
    binhChon: {
      hop_dip: 22,
      phoi_mau: 17,
      ton_trong_vung_mien: 31,
    },
    nhanVatConfig: {
      tuoi: "nguoi_lon",
      gioi: "nam",
      vocDang: "dam_nguoi",
      tongDa: 5,
      toc: "ngan",
    },
  },
  {
    id: "cp6",
    nguoiDang: "H'Hen Niê (Đắk Lắk)",
    trangPhucId: "ede_tho_cam",
    nhomId: "ede",
    mauId: "m_cham",
    phuKienIds: ["vong_bac"],
    caption: "Nếp áo thổ cẩm dệt tay với dải hoa văn đỏ rực quanh ngực, hòa nhịp cùng tiếng cồng chiêng bên bếp lửa nhà dài.",
    nhan: "chuan",
    lyDo: "Thổ cẩm dệt tay hoa văn hình học gắn với đời sống buôn làng và lễ hội cồng chiêng Tây Nguyên.",
    taoLuc: 1711250000000,
    binhChon: {
      hop_dip: 15,
      phoi_mau: 24,
      ton_trong_vung_mien: 26,
    },
    nhanVatConfig: {
      tuoi: "nguoi_lon",
      gioi: "nu",
      vocDang: "manh",
      tongDa: 4,
      toc: "ngan",
    },
  },
  {
    id: "cp7",
    nguoiDang: "Phương Linh (Đà Nẵng)",
    trangPhucId: "aodai",
    nhomId: "kb",
    mauId: "m_hongsen",
    phuKienIds: ["khan_pieu"],
    caption: "Thử điểm xuyết chiếc khăn piêu Tây Bắc trên nền áo dài lụa hồng cánh sen, một thoáng giao duyên giữa miền xuôi và miền ngược.",
    nhan: "sang_tao",
    lyDo: "Lấy cảm hứng từ khăn piêu của phụ nữ Thái; nên ghi rõ nguồn cảm hứng khi phối cùng áo dài truyền thống.",
    taoLuc: 1711260000000,
    binhChon: {
      hop_dip: 11,
      phoi_mau: 26,
      ton_trong_vung_mien: 14,
    },
    nhanVatConfig: {
      tuoi: "nguoi_lon",
      gioi: "nu",
      vocDang: "trung_binh",
      tongDa: 2,
      toc: "dai_xoa",
    },
  },
  {
    id: "cp8",
    nguoiDang: "Hoàng An (Hải Phòng)",
    trangPhucId: "tu_than",
    nhomId: "kb",
    mauId: "m_vang",
    phuKienIds: ["khan_dong"],
    caption: "Một thử nghiệm phá cách khi thử đội khăn đóng nhiều vòng cùng tà áo tứ thân vàng óng.",
    nhan: "can_xem_lai",
    lyDo: "Khăn đóng thường gắn với nam giới hoặc áo ngũ thân; đội với trang phục nữ Bắc Bộ là kết hợp lệch bối cảnh.",
    taoLuc: 1711270000000,
    binhChon: {
      hop_dip: 5,
      phoi_mau: 13,
      ton_trong_vung_mien: 6,
    },
    nhanVatConfig: {
      tuoi: "nguoi_cao_tuoi",
      gioi: "nu",
      vocDang: "trung_binh",
      tongDa: 3,
      toc: "bac_bui",
    },
  },
];

/**
 * Đọc danh sách bài đăng Chợ Phiên từ localStorage
 * Khởi tạo với 8 bài mẫu nếu chưa có dữ liệu
 */
export function docDanhSachChoPhien(): BaiChoPhien[] {
  if (typeof window === "undefined" || !window.localStorage) {
    return SAMPLE_CHO_PHIEN_POSTS;
  }

  try {
    const raw = window.localStorage.getItem(CHO_PHIEN_STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(CHO_PHIEN_STORAGE_KEY, JSON.stringify(SAMPLE_CHO_PHIEN_POSTS));
      return SAMPLE_CHO_PHIEN_POSTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (err) {
    console.error("Lỗi đọc bài Chợ Phiên:", err);
  }

  return SAMPLE_CHO_PHIEN_POSTS;
}

/**
 * Đăng bài từ "Gùi Ký Ức của tôi" lên Chợ Phiên
 */
export function dangBaiLenChoPhien(outfit: OutfitSaved): {
  success: boolean;
  message: string;
  post?: BaiChoPhien;
} {
  const currentPosts = docDanhSachChoPhien();

  // Kiểm tra nếu bộ đồ từ outfitId này đã được đăng chưa
  const existingPostIndex = currentPosts.findIndex(
    (p) => p.outfitId === outfit.id || p.id === `user_${outfit.id}`
  );

  const tp = trangPhuc.find((t) => t.id === outfit.trangPhucId) ?? trangPhuc[0];
  const nhomId = tp.nhomIds[0] || "kb";

  // Đánh giá nhãn văn hóa và lý do từ luatRemix (S6)
  const remixEval = evaluateRemix({
    trangPhucId: outfit.trangPhucId,
    phuKienIds: outfit.phuKienIds,
    hoaVanThem: outfit.hoaVanThem,
  });

  const newPost: BaiChoPhien = {
    id: `user_${outfit.id}_${Date.now()}`,
    nguoiDang: "Tôi (Gùi Ký Ức)",
    laToi: true,
    outfitId: outfit.id,
    trangPhucId: outfit.trangPhucId,
    nhomId: nhomId,
    mauId: outfit.mauId,
    phuKienIds: outfit.phuKienIds,
    hoaVanThem: outfit.hoaVanThem,
    phongCach: outfit.phongCach,
    caption: outfit.caption || tp.fallbackText || "Nếp áo cất giữ từ ký ức của Cò Em...",
    nhan: remixEval.nhan,
    lyDo: remixEval.lyDo,
    nhanVatConfig: outfit.nhanVatConfig || NHAN_VAT_MAC_DINH,
    taoLuc: Date.now(),
    binhChon: existingPostIndex >= 0 ? currentPosts[existingPostIndex].binhChon : {
      hop_dip: 1,
      phoi_mau: 1,
      ton_trong_vung_mien: 1,
    },
  };

  let updatedList: BaiChoPhien[];
  if (existingPostIndex >= 0) {
    // Cập nhật lại bài đã đăng
    updatedList = [...currentPosts];
    updatedList[existingPostIndex] = {
      ...newPost,
      id: currentPosts[existingPostIndex].id,
      binhChon: currentPosts[existingPostIndex].binhChon,
    };
  } else {
    // Đưa bài mới lên đầu danh sách
    updatedList = [newPost, ...currentPosts];
  }

  try {
    window.localStorage.setItem(CHO_PHIEN_STORAGE_KEY, JSON.stringify(updatedList));
    window.dispatchEvent(new CustomEvent("vpr:cho-phien-change", { detail: updatedList }));
    return {
      success: true,
      message: "Đã đem trang phục ra Chợ Phiên thành công!",
      post: newPost,
    };
  } catch (err) {
    console.error("Lỗi lưu bài Chợ Phiên:", err);
    return {
      success: false,
      message: "Chưa thể đăng bài, bạn thử lại sau nhé.",
    };
  }
}

/**
 * Đọc trạng thái bình chọn của người dùng hiện tại { [postId]: LyDoBinhChon }
 */
export function docBinhChonCuaToi(): Record<string, LyDoBinhChon> {
  if (typeof window === "undefined" || !window.localStorage) {
    return {};
  }
  try {
    const raw = window.localStorage.getItem(layKhoaBinhChonChoPhien());
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error("Lỗi đọc lượt bình chọn của tôi:", err);
  }
  return {};
}

/**
 * Lưu trạng thái bình chọn có lý do cho một bài đăng
 * Người dùng chọn MỘT lý do trong 3: 'hop_dip' | 'phoi_mau' | 'ton_trong_vung_mien'
 */
export function binhChonBaiChoPhien(
  postId: string,
  lyDo: LyDoBinhChon
): { success: boolean; post?: BaiChoPhien; myVote: LyDoBinhChon } {
  const currentPosts = docDanhSachChoPhien();
  const myVotes = docBinhChonCuaToi();
  const previousVote = myVotes[postId];

  const postIndex = currentPosts.findIndex((p) => p.id === postId);
  if (postIndex < 0) {
    return { success: false, myVote: lyDo };
  }

  const post = { ...currentPosts[postIndex] };
  const binhChon = { ...post.binhChon };

  // Nếu người dùng đã từng bình chọn lý do khác trước đó, giảm số lượt của lý do cũ
  if (previousVote && previousVote !== lyDo) {
    binhChon[previousVote] = Math.max(0, binhChon[previousVote] - 1);
  }

  // Nếu chưa chọn lý do này thì tăng 1
  if (previousVote !== lyDo) {
    binhChon[lyDo] = (binhChon[lyDo] || 0) + 1;
  }

  post.binhChon = binhChon;
  currentPosts[postIndex] = post;
  myVotes[postId] = lyDo;

  try {
    window.localStorage.setItem(CHO_PHIEN_STORAGE_KEY, JSON.stringify(currentPosts));
    window.localStorage.setItem(layKhoaBinhChonChoPhien(), JSON.stringify(myVotes));
    window.dispatchEvent(new CustomEvent("vpr:cho-phien-change", { detail: currentPosts }));
    return { success: true, post, myVote: lyDo };
  } catch (err) {
    console.error("Lỗi lưu bình chọn Chợ Phiên:", err);
    return { success: false, myVote: lyDo };
  }
}

/**
 * Huỷ bình chọn bài đăng
 */
export function huyBinhChonBaiChoPhien(
  postId: string
): { success: boolean; post?: BaiChoPhien } {
  const currentPosts = docDanhSachChoPhien();
  const myVotes = docBinhChonCuaToi();
  const previousVote = myVotes[postId];

  if (!previousVote) {
    return { success: true };
  }

  const postIndex = currentPosts.findIndex((p) => p.id === postId);
  if (postIndex < 0) {
    return { success: false };
  }

  const post = { ...currentPosts[postIndex] };
  const binhChon = { ...post.binhChon };

  binhChon[previousVote] = Math.max(0, binhChon[previousVote] - 1);
  post.binhChon = binhChon;
  currentPosts[postIndex] = post;

  delete myVotes[postId];

  try {
    window.localStorage.setItem(CHO_PHIEN_STORAGE_KEY, JSON.stringify(currentPosts));
    window.localStorage.setItem(layKhoaBinhChonChoPhien(), JSON.stringify(myVotes));
    window.dispatchEvent(new CustomEvent("vpr:cho-phien-change", { detail: currentPosts }));
    return { success: true, post };
  } catch (err) {
    console.error("Lỗi huỷ bình chọn Chợ Phiên:", err);
    return { success: false };
  }
}
