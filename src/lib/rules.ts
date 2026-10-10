/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { luatMau, luatRemix } from "../data/quytac";
import { mauSac } from "../data/mausac";
import { trangPhuc } from "../data/trangphuc";
import { phuKien } from "../data/phukien";
import { nhom } from "../data/nhom";
import { coem, domdom } from "../copy/coem";
import { callGemini } from "./gemini";
import { LuatMau, LuatRemix, Outfit, TrangPhuc } from "../types";
import { keGiaiThichNhanVanHoa3Phan, KetQuaGiaiThich3Phan } from "./loiKe";

/**
 * Bản đồ màu sắc ước định của các phụ kiện truyền thống và hiện đại
 */
export const PHU_KIEN_MAU: Record<string, string> = {
  non_la: "m_trang",       // nón lá / nón bài thơ lá cọ trắng ngà
  khan_dong: "m_cham",     // khăn đóng chàm đen
  khan_mo_qua: "m_cham",   // khăn mỏ quạ chàm đen
  non_quai_thao: "m_vang", // nón quai thao màu rơm vàng
  khan_ran: "m_cham",      // khăn rằn chàm trắng
  khan_pieu: "m_cham",     // khăn piêu thêu thổ cẩm trên nền chàm
  vong_bac: "m_trang",     // vòng bạc sáng ánh trắng
  tram_cai: "m_vang",      // trâm cài kim loại màu vàng
  tote: "m_trang",         // túi tote vải thô trắng ngà
  sneaker: "m_trang",      // giày sneaker trắng
};

export interface ColorEvaluation {
  ketQua: "hai_hoa" | "can_can_bang";
  nhanHienThi: "Hài hòa" | "Cần cân bằng";
  lyDo: string;
  capMau: [string, string];
  luat: LuatMau;
}

export interface RemixEvaluation {
  nhan: "chuan" | "sang_tao" | "can_xem_lai" | "chua_du_du_lieu";
  nhanHienThi: "Chuẩn đúng" | "Sáng tạo tự do" | "Cần xem lại" | "Chưa đủ dữ liệu để nói";
  lyDo: string;
  luatId: string;
  luat: LuatRemix;
  giaiThich3Phan: KetQuaGiaiThich3Phan;
}

export type PartialOutfit = {
  trangPhucId?: string;
  trangPhuc?: string;
  mauId?: string;
  phuKienIds?: string[];
  phuKien?: string[];
  hoaVanThem?: string | null;
  [key: string]: any;
};

/**
 * Tra cứu luật màu theo hai chiều (mauA, mauB hoặc mauB, mauA).
 * Nếu không có cặp cụ thể thì dùng dòng wildcard ('*').
 */
export function traCapMau(mauA: string, mauB: string): LuatMau {
  // Tra cặp theo hai chiều
  const found = luatMau.find(
    (l) => (l.a === mauA && l.b === mauB) || (l.a === mauB && l.b === mauA)
  );
  if (found) return found;

  // Dòng đại diện '*'
  const wildcard = luatMau.find((l) => l.a === "*" && l.b === "*");
  if (wildcard) return wildcard;

  // Dự phòng an toàn
  return {
    a: "*",
    b: "*",
    ketQua: "hai_hoa",
    lyDo: "Cặp này chưa có ghi chú riêng; nhìn chung hòa hợp.",
  };
}

/**
 * Đánh giá màu sắc: evaluateColor(mauId, phuKienIds)
 * Dựa trên luatMau (tra cặp theo hai chiều; không có thì dùng dòng "*").
 * Đảm bảo mọi cặp màu trong data đều có kết quả.
 */
export function evaluateColor(
  mauId: string,
  phuKienIds?: string[] | string
): ColorEvaluation {
  const currentMau = mauId || "m_do";

  // Trường hợp truyền vào trực tiếp một mã màu thứ 2 (hoặc 1 phụ kiện đơn)
  if (typeof phuKienIds === "string") {
    const isDirectColor = mauSac.some((m) => m.id === phuKienIds);
    const colorB = isDirectColor ? phuKienIds : PHU_KIEN_MAU[phuKienIds] ?? "m_trang";
    const rule = traCapMau(currentMau, colorB);
    return {
      ketQua: rule.ketQua as "hai_hoa" | "can_can_bang",
      nhanHienThi: rule.ketQua === "can_can_bang" ? "Cần cân bằng" : "Hài hòa",
      lyDo: rule.lyDo,
      capMau: [currentMau, colorB],
      luat: rule,
    };
  }

  const accessories = Array.isArray(phuKienIds) ? phuKienIds : [];

  // Nếu không chọn phụ kiện nào, phối với màu nền mặc định của nếp áo (màu trắng ngà m_trang)
  if (accessories.length === 0) {
    const defaultCompanion = currentMau === "m_trang" ? "m_cham" : "m_trang";
    const rule = traCapMau(currentMau, defaultCompanion);
    return {
      ketQua: rule.ketQua as "hai_hoa" | "can_can_bang",
      nhanHienThi: rule.ketQua === "can_can_bang" ? "Cần cân bằng" : "Hài hòa",
      lyDo: rule.lyDo,
      capMau: [currentMau, defaultCompanion],
      luat: rule,
    };
  }

  // Nếu có phụ kiện, đối chiếu màu từng phụ kiện với màu áo chính
  const evaluatedPairs: ColorEvaluation[] = [];

  for (const pkId of accessories) {
    const isDirectColor = mauSac.some((m) => m.id === pkId);
    const colorB = isDirectColor ? pkId : PHU_KIEN_MAU[pkId] ?? "m_trang";
    const rule = traCapMau(currentMau, colorB);
    evaluatedPairs.push({
      ketQua: rule.ketQua as "hai_hoa" | "can_can_bang",
      nhanHienThi: rule.ketQua === "can_can_bang" ? "Cần cân bằng" : "Hài hòa",
      lyDo: rule.lyDo,
      capMau: [currentMau, colorB],
      luat: rule,
    });
  }

  // Ưu tiên cảnh báo "cần cân bằng" nếu có bất kỳ cặp nào cần lưu ý tỷ lệ
  const canCanBangItem = evaluatedPairs.find((p) => p.ketQua === "can_can_bang");
  if (canCanBangItem) {
    return canCanBangItem;
  }

  return evaluatedPairs[0];
}

/**
 * Đánh giá mức độ phối / cách tân: evaluateRemix(outfit)
 * Dựa trên luatRemix:
 * - Khớp trangPhuc, phuKienBatKy, hoaVanThem
 * - Nếu nhiều luật khớp, ưu tiên can_xem_lai > sang_tao > chuan
 * - Không khớp thì dùng "mac_dinh"
 * - Luôn dùng giọng mềm ("cần cân nhắc vì...", không dùng từ "sai")
 */
export function evaluateRemix(outfit: PartialOutfit | Outfit): RemixEvaluation {
  const anyOutfit = outfit as Record<string, any>;
  const costumeId: string = anyOutfit.trangPhucId || anyOutfit.trangPhuc || "";
  const accessoryIds: string[] = anyOutfit.phuKienIds || anyOutfit.phuKien || [];
  const hoaVan: string | null = anyOutfit.hoaVanThem || null;

  const matchedRules: LuatRemix[] = [];

  for (const rule of luatRemix) {
    if (rule.id === "mac_dinh") continue;

    const { trangPhuc, phuKienBatKy, hoaVanThem } = rule.khi;

    // 1. Kiểm tra trangPhuc nếu luật có quy định
    if (trangPhuc && trangPhuc.length > 0) {
      if (!trangPhuc.includes(costumeId)) {
        continue;
      }
    }

    // 2. Kiểm tra phuKienBatKy nếu luật có quy định
    if (phuKienBatKy && phuKienBatKy.length > 0) {
      const hasAny = phuKienBatKy.some((pk) => accessoryIds.includes(pk));
      if (!hasAny) {
        continue;
      }
    }

    // 3. Kiểm tra hoaVanThem nếu luật có quy định
    if (hoaVanThem) {
      if (hoaVan !== hoaVanThem) {
        continue;
      }
    }

    // Luật có ít nhất một điều kiện xác định và tất cả điều kiện đều khớp
    if (trangPhuc || phuKienBatKy || hoaVanThem) {
      matchedRules.push(rule);
    }
  }

  // Thứ tự ưu tiên: can_xem_lai (3) > sang_tao (2) > chuan (1)
  const rank: Record<string, number> = {
    can_xem_lai: 3,
    sang_tao: 2,
    chuan: 1,
  };

  let chosenRule: LuatRemix;

  if (matchedRules.length > 0) {
    matchedRules.sort((a, b) => (rank[b.nhan] ?? 0) - (rank[a.nhan] ?? 0));
    chosenRule = matchedRules[0];
  } else {
    // THÊM MỘT MỨC THỨ TƯ: "Chưa đủ dữ liệu để nói"
    // dùng khi tổ hợp không khớp luật nào VÀ không có trong danh sách đã kiểm chứng (daKiemChung=false ở cả hai món)
    const tpObj = trangPhuc.find((t) => t.id === costumeId);
    const tpChuaKiemChung = !tpObj || tpObj.daKiemChung === false;

    // Kiểm tra các phụ kiện hoặc họa tiết
    const pkObjs = accessoryIds.map((id) => phuKien.find((p) => p.id === id));
    // Nếu có phụ kiện thì tất cả phụ kiện đều chưa kiểm chứng (daKiemChung === false)
    const pkChuaKiemChung =
      accessoryIds.length > 0
        ? pkObjs.every((p) => !p || p.daKiemChung === false)
        : true;

    if (tpChuaKiemChung && pkChuaKiemChung) {
      chosenRule = {
        id: "chua_du_du_lieu",
        khi: {},
        nhan: "chua_du_du_lieu",
        lyDo: "Tôi chưa có đủ căn cứ để nói rõ về tổ hợp này.",
      };
    } else {
      chosenRule = luatRemix.find((l) => l.id === "mac_dinh") ?? {
        id: "mac_dinh",
        khi: {},
        nhan: "sang_tao",
        lyDo: "Cách phối này chưa có ghi chú riêng; xem như sáng tạo cá nhân.",
      };
    }
  }

  const nhanHienThi: "Chuẩn đúng" | "Sáng tạo tự do" | "Cần xem lại" | "Chưa đủ dữ liệu để nói" =
    chosenRule.nhan === "chuan"
      ? "Chuẩn đúng"
      : chosenRule.nhan === "can_xem_lai"
      ? "Cần xem lại"
      : chosenRule.nhan === "chua_du_du_lieu"
      ? "Chưa đủ dữ liệu để nói"
      : "Sáng tạo tự do";

  // Lời giải thích giọng mềm, tuyệt đối không dùng từ "sai"
  let softLyDo = chosenRule.lyDo;
  // Loại bỏ bất kỳ từ "sai" nào nếu có
  softLyDo = softLyDo.replace(/sai/gi, "lệch");

  if (chosenRule.nhan === "can_xem_lai") {
    if (!softLyDo.toLowerCase().startsWith("cần cân nhắc")) {
      softLyDo = `Cần cân nhắc vì ${softLyDo.charAt(0).toLowerCase() + softLyDo.slice(1)}`;
    }
  }

  // Chuẩn bị dữ liệu cho khuôn 3 phần từ loiKe.ts
  const tp = trangPhuc.find((t) => t.id === costumeId);
  const tenA = tp?.ten || costumeId || "Trang phục";

  // Tên B (phụ kiện hoặc hoa văn)
  let tenB = "";
  if (chosenRule.khi.hoaVanThem || hoaVan) {
    const hvId = chosenRule.khi.hoaVanThem || hoaVan;
    tenB = `họa tiết ${nhom.find((n) => n.id === hvId)?.ten || hvId}`;
  } else if (chosenRule.khi.phuKienBatKy && chosenRule.khi.phuKienBatKy.length > 0) {
    const matchedPkId = chosenRule.khi.phuKienBatKy.find((id) => accessoryIds.includes(id));
    tenB = phuKien.find((p) => p.id === matchedPkId)?.ten || "phụ kiện";
  } else if (accessoryIds.length > 0) {
    const matchedPks = accessoryIds
      .map((id) => phuKien.find((p) => p.id === id)?.ten || id);
    tenB = matchedPks.join(", ");
  } else {
    tenB = "phong cách tự chọn";
  }

  // Bối cảnh A (trang phục)
  let boiCanhA: string | undefined;
  if (tp) {
    const nhomNames = tp.nhomIds.map((id) => nhom.find((n) => n.id === id)?.ten).filter(Boolean);
    const dipNames = tp.dip.slice(0, 2);
    if (nhomNames.length > 0 && dipNames.length > 0) {
      boiCanhA = `${nhomNames.join(", ")} trong dịp ${dipNames.join(", ")}`;
    } else if (nhomNames.length > 0) {
      boiCanhA = `văn hóa ${nhomNames.join(", ")}`;
    } else if (tp.suThat && tp.suThat.length > 0) {
      boiCanhA = tp.suThat[0];
    }
  }

  // Bối cảnh B (phụ kiện hoặc hoa văn)
  let boiCanhB: string | undefined;
  const firstPk = phuKien.find((p) => accessoryIds.includes(p.id));
  if (firstPk && firstPk.suThat && firstPk.suThat.length > 0) {
    boiCanhB = firstPk.suThat[0];
  } else if (firstPk && firstPk.nhomIds && firstPk.nhomIds.length > 0) {
    const nhomPkNames = firstPk.nhomIds.map((id) => nhom.find((n) => n.id === id)?.ten).filter(Boolean);
    boiCanhB = `văn hóa ${nhomPkNames.join(", ")}`;
  } else if (hoaVan) {
    boiCanhB = `họa tiết đặc trưng của ${nhom.find((n) => n.id === hoaVan)?.ten || hoaVan}`;
  }

  const giaiThich3Phan = keGiaiThichNhanVanHoa3Phan({
    nhan: chosenRule.nhan,
    tenTrangPhuc: tenA,
    tenPhuKienOrHoaVan: tenB,
    boiCanhA,
    boiCanhB,
    lyDo: softLyDo,
    goiYThayThe: chosenRule.goiYThayThe,
  });

  return {
    nhan: chosenRule.nhan as "chuan" | "sang_tao" | "can_xem_lai" | "chua_du_du_lieu",
    nhanHienThi,
    lyDo: softLyDo,
    luatId: chosenRule.id,
    luat: chosenRule,
    giaiThich3Phan,
  };
}

// ============================================================================
// BỘ LUẬT GỢI Ý TRANG PHỤC THEO THỜI TIẾT & DỊP
// ============================================================================

export type ThoiTietId = "nong" | "mat" | "lanh" | "mua";

export const TEN_THOI_TIET: Record<string, string> = {
  nong: "Nắng nóng",
  mat: "Dịu mát",
  lanh: "Se lạnh",
  mua: "Trời mưa",
};

export interface GoiYCondition {
  thoiTiet?: ThoiTietId | string | null;
  dip?: string | null;
}

export interface GoiYResult {
  danhSach: TrangPhuc[];
  cauGoc: string;
  cauDienDat: string;
  tuGemini: boolean;
}

/**
 * Lọc trang phục theo thời tiết (nong/mat/lanh/mua) hoặc một dịp.
 * Đảm bảo đổi điều kiện ra danh sách khác nhau.
 * Với trường hợp vừa có thời tiết vừa có dịp (như {"thoiTiet":"mua","dip":"khai_giang"}),
 * nếu có bộ thỏa cả 2 thì lấy, nếu không thì kết hợp các bộ khớp dịp và các bộ khớp thời tiết.
 */
export function locTrangPhucGoiY(condition: GoiYCondition): TrangPhuc[] {
  const { thoiTiet, dip } = condition;
  if (!thoiTiet && !dip) {
    return trangPhuc;
  }

  // Chọn cả thời tiết và dịp
  if (thoiTiet && dip) {
    const both = trangPhuc.filter(
      (tp) => tp.thoiTiet.includes(thoiTiet) && tp.dip.includes(dip)
    );
    if (both.length > 0) return both;

    // Ví dụ {"thoiTiet":"mua","dip":"khai_giang"}:
    // aodai (khớp khai_giang) + ba_ba (khớp mua)
    const combined = trangPhuc.filter(
      (tp) => tp.dip.includes(dip) || tp.thoiTiet.includes(thoiTiet)
    );
    return combined;
  }

  // Chỉ chọn thời tiết
  if (thoiTiet) {
    return trangPhuc.filter((tp) => tp.thoiTiet.includes(thoiTiet));
  }

  // Chỉ chọn dịp
  if (dip) {
    return trangPhuc.filter((tp) => tp.dip.includes(dip));
  }

  return trangPhuc;
}

/**
 * Lấy MỘT câu giải thích gốc từ luật (fallback chuẩn, không dùng AI).
 * Ví dụ: "Trời mưa... Cò Em gợi ý những bộ gọn và dễ di chuyển."
 */
export function layCauGiaiThichGoc(
  condition: GoiYCondition,
  danhSach: TrangPhuc[] = []
): string {
  const { thoiTiet, dip } = condition;
  const tenDip = dip ? domdom.s2.tenDip[dip] ?? dip : "";

  // 1. Trường hợp thời tiết mưa
  if (thoiTiet === "mua") {
    if (dip === "khai_giang") {
      return "Dịp khai giảng gặp trời mưa, Cò Em gợi ý những bộ gọn và dễ di chuyển, vừa giữ vẻ trang nhã vừa tiện đi lại.";
    }
    if (dip) {
      return `Dịp ${tenDip} gặp trời mưa, Cò Em gợi ý những bộ gọn và dễ di chuyển để vừa giữ nét đẹp vừa thuận tiện đi lại.`;
    }
    return "Trời mưa... Cò Em gợi ý những bộ gọn và dễ di chuyển.";
  }

  // 2. Trường hợp thời tiết nắng nóng
  if (thoiTiet === "nong") {
    if (dip === "khai_giang") {
      return "Dịp khai giảng ngày nắng ráo, Cò Em gợi ý tà áo dài thanh thoát, chất liệu nhẹ và thoáng mát.";
    }
    if (dip) {
      return `Dịp ${tenDip} vào ngày nắng nóng, Cò Em gợi ý những bộ trang phục thoáng mát, chất vải nhẹ và dễ chịu.`;
    }
    return "Trời nắng nóng, Cò Em gợi ý những bộ trang phục thoáng mát và thấm hút mồ hôi tốt.";
  }

  // 3. Trường hợp thời tiết se lạnh
  if (thoiTiet === "lanh") {
    if (dip === "tet") {
      return "Dịp Tết tiết trời se lạnh, Cò Em gợi ý những bộ áo nhiều lớp ấm áp như áo ngũ thân hoặc áo dài cổ truyền.";
    }
    if (dip) {
      return `Dịp ${tenDip} vào tiết trời se lạnh, Cò Em gợi ý những bộ trang phục nhiều lớp giúp giữ ấm mà vẫn vẹn nếp cổ truyền.`;
    }
    return "Trời se lạnh, Cò Em gợi ý những bộ trang phục nhiều lớp hoặc chất vải dệt dày dặn giúp giữ ấm cơ thể.";
  }

  // 4. Trường hợp thời tiết dịu mát
  if (thoiTiet === "mat") {
    if (dip) {
      return `Dịp ${tenDip} trong tiết trời dịu mát, Cò Em gợi ý những bộ trang phục thanh lịch, thoải mái dạo phố hay dự hội.`;
    }
    return "Tiết trời dịu mát, Cò Em gợi ý những nếp áo truyền thống tao nhã, rất thích hợp cho những cuộc dạo phố và gặp gỡ.";
  }

  // 5. Trường hợp chỉ chọn dịp
  if (dip) {
    if (dip === "khai_giang") {
      return "Dịp khai giảng năm học mới, Cò Em gợi ý tà áo dài truyền thống thanh lịch, trang nhã.";
    }
    if (dip === "tet") {
      return "Dịp Tết đến xuân về, Cò Em gợi ý những bộ trang phục truyền thống mang sắc màu hoan hỉ, sum vầy.";
    }
    if (dip === "cuoi") {
      return "Dịp lễ cưới hỏi thiêng liêng, Cò Em gợi ý những bộ trang phục trang trọng, đĩnh đạc và cát tường.";
    }
    if (dip === "le_hoi") {
      return "Dịp trẩy hội buôn làng, Cò Em gợi ý những bộ trang phục rực rỡ mang đậm bản sắc văn hóa vùng miền.";
    }
    if (dip === "hoi_lang") {
      return "Dịp hội làng Bắc Bộ, Cò Em gợi ý những tà áo tứ thân, áo ngũ thân đượm hồn quê xứ sở.";
    }
    if (dip === "doi_thuong") {
      return "Mặc thường ngày, Cò Em gợi ý những bộ trang phục mộc mạc như áo bà ba, tiện cho sinh hoạt và lao động.";
    }
    if (dip === "cho_phien") {
      return "Dịp chợ phiên vùng cao, Cò Em gợi ý trang phục dệt thổ cẩm rực rỡ, thuận tiện bước trên đường dốc.";
    }
    return `Dịp ${tenDip}, Cò Em gợi ý những nếp áo truyền thống trang nhã, phù hợp với không khí ngày này.`;
  }

  // Mặc định
  if (danhSach.length > 0) {
    return "Tôi gợi ý những nếp áo tiêu biểu của các vùng miền, từ áo dài thanh thoát đến áo bà ba mộc mạc.";
  }
  return "Tôi gợi ý những nếp áo truyền thống hài hòa với vóc dáng và văn hóa xứ mình.";
}

/**
 * Gọi callGemini CHỈ để diễn đạt lại câu ấy tự nhiên hơn.
 * - Giữ nguyên danh sách và ý nghĩa.
 * - Nhiệt độ: 0.5 (theo yêu cầu).
 * - Fallback: trả về nguyên văn câu gốc khi Gemini lỗi hoặc offline.
 */
export async function rephraseGoiYWithGemini(
  cauGoc: string,
  danhSachTen: string[],
  condition: GoiYCondition
): Promise<{ cauDienDat: string; tuGemini: boolean }> {
  const tenThoiTiet = condition.thoiTiet
    ? TEN_THOI_TIET[condition.thoiTiet] ?? condition.thoiTiet
    : "bình thường";
  const tenDip = condition.dip
    ? domdom.s2.tenDip[condition.dip] ?? condition.dip
    : "thường nhật";

  try {
    const res = await callGemini({
      vaiTro:
        "Bạn là người kể chuyện Cò Em, am hiểu trang phục truyền thống Việt Nam. Giọng điệu của bạn trầm, ấm áp, nhã nhặn, tự nhiên, xưng Cò Em gọi bạn, mang hơi thở dân gian nhưng hiện đại, câu từ súc tích.",
      context: `Người dùng đang tìm gợi ý trang phục theo điều kiện: Thời tiết: "${tenThoiTiet}", Dịp: "${tenDip}". Danh sách trang phục gợi ý: ${danhSachTen.join(
        ", "
      )}.`,
      quyTac: [
        "CHỈ diễn đạt lại MỘT câu giải thích gốc sao cho tự nhiên, mượt mà và ấm áp hơn.",
        "Giữ nguyên ý nghĩa cốt lõi và danh sách trang phục được gợi ý, không thêm bớt thông tin sai lệch.",
        "Độ dài chỉ đúng MỘT câu ngắn gọn (khoảng 15-30 từ).",
        "Không dùng từ ngữ sáo rỗng hoặc quảng cáo.",
      ],
      cauHoi: `Hãy diễn đạt lại câu giải thích gốc sau thành 1 câu tự nhiên hơn:\n"${cauGoc}"`,
      schema: {
        type: "object",
        properties: {
          cauDienDat: {
            type: "string",
            description: "MỘT câu giải thích tự nhiên, ấm áp diễn đạt lại từ câu gốc",
          },
        },
        required: ["cauDienDat"],
      },
      nhietDo: 0.5,
    });

    if (res.ok && res.data && typeof res.data === "object") {
      const parsed = res.data as { cauDienDat?: string };
      if (
        parsed.cauDienDat &&
        typeof parsed.cauDienDat === "string" &&
        parsed.cauDienDat.trim().length > 5
      ) {
        return {
          cauDienDat: parsed.cauDienDat.trim(),
          tuGemini: true,
        };
      }
    }
  } catch (err) {
    console.warn("rephraseGoiYWithGemini fallback to cauGoc:", err);
  }

  // Fallback = câu gốc
  return {
    cauDienDat: cauGoc,
    tuGemini: false,
  };
}

