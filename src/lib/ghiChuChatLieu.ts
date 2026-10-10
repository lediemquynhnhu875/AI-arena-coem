/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Vai } from "../types";
import { vai } from "../data/vai";
import { nguon } from "../data/nguon";
import { callGemini } from "./gemini";

/**
 * Ánh xạ trang phục & màu sắc sang chất liệu tương ứng:
 * - mong_lanh → lanh_mong
 * - champa_tho_cam → tho_cam_champa
 * - ede_tho_cam → tho_cam_ede
 * - aodai / tu_than / ngu_than → lua_van_phuc
 * - các trang phục dùng chàm (co_thai hoặc chọn màu m_cham) → cham_nhuom
 */
export function layChatLieuTuTrangPhuc(trangPhucId: string, mauId?: string): Vai | null {
  // Ưu tiên màu chàm nếu trang phục dùng sắc chàm
  if (mauId === "m_cham" && (trangPhucId === "co_thai" || trangPhucId === "ba_ba" || trangPhucId === "tu_than")) {
    return vai.find((v) => v.id === "cham_nhuom") ?? null;
  }

  if (trangPhucId === "mong_lanh") {
    return vai.find((v) => v.id === "lanh_mong") ?? null;
  }
  if (trangPhucId === "champa_tho_cam") {
    return vai.find((v) => v.id === "tho_cam_champa") ?? null;
  }
  if (trangPhucId === "ede_tho_cam") {
    return vai.find((v) => v.id === "tho_cam_ede") ?? null;
  }
  if (trangPhucId === "aodai" || trangPhucId === "tu_than" || trangPhucId === "ngu_than") {
    if (mauId === "m_cham") {
      return vai.find((v) => v.id === "cham_nhuom") ?? null;
    }
    return vai.find((v) => v.id === "lua_van_phuc") ?? null;
  }
  if (trangPhucId === "co_thai") {
    return vai.find((v) => v.id === "cham_nhuom") ?? null;
  }

  // Nếu người dùng chọn màu chàm ở bất kỳ trang phục nào
  if (mauId === "m_cham") {
    return vai.find((v) => v.id === "cham_nhuom") ?? null;
  }

  return null;
}

/**
 * Hướng dẫn phong cách / giọng điệu cho từng loại vải
 * Đảm bảo: đổi cấu trúc câu, không lặp mở đầu, giữ nguyên vẹn tính chân xác
 */
const TONE_GUIDES: Record<string, { moTaGiong: string; goiYMoDau: string }> = {
  lua_van_phuc: {
    moTaGiong: "Giọng thanh tao, hoài niệm, nâng niu sự mềm mại của tơ lụa kinh kỳ.",
    goiYMoDau: "Bắt đầu bằng không gian làng nghề cổ kính bên dòng sông Nhuệ ở Hà Đông, Hà Nội.",
  },
  cham_nhuom: {
    moTaGiong: "Giọng sâu lắng, đượm màu thiên nhiên mộc mạc và gắn bó với cuộc sống núi rừng.",
    goiYMoDau: "Bắt đầu bằng sắc nhuộm tự nhiên được chắt chiu từ cây chàm của đồng bào miền núi phía Bắc.",
  },
  tho_cam_champa: {
    moTaGiong: "Giọng nắng gió duyên hải, tự hào về đôi tay cần mẫn gìn giữ kỹ nghệ thủ công.",
    goiYMoDau: "Bắt đầu bằng danh tiếng của làng dệt thủ công Mỹ Nghiệp nơi mảnh đất Ninh Thuận.",
  },
  lanh_mong: {
    moTaGiong: "Giọng khỏe khoắn, tỉ mỉ, trân trọng từng nét vẽ sáp ong và đường thêu may chắp.",
    goiYMoDau: "Bắt đầu bằng hành trình kỳ công từ cây lanh đến từng đường vẽ sáp ong và thêu may của người Mông.",
  },
  tho_cam_ede: {
    moTaGiong: "Giọng trầm hùng, khoáng đạt, gắn với tiếng chiêng và mái nhà dài buôn làng Tây Nguyên.",
    goiYMoDau: "Bắt đầu bằng những mảng hoa văn hình học giàu biểu tượng được dệt tay nơi buôn làng Tây Nguyên.",
  },
};

/**
 * Đoạn kể cảm xúc mẫu (Fallback chất lượng cao, tuân thủ tuyệt đối quy tắc: không thêm chi tiết ngoài dữ liệu)
 */
export const GHI_CHU_CHAT_LIEU_FALLBACK: Record<string, string> = {
  lua_van_phuc:
    "Nằm bên dòng sông Nhuệ, làng Vạn Phúc ở Hà Đông, Hà Nội là cái nôi dệt lụa lâu đời nổi danh. Từng thớ lụa dệt nên mang vẻ óng ả, mềm mại, đã cùng tà áo truyền thống đi qua biết bao thăng trầm lịch sử.",
  cham_nhuom:
    "Được chiết xuất từ sắc xanh của cây chàm mộc mạc, kỹ thuật nhuộm chàm truyền thống đã gắn bó sâu sắc với đời sống của nhiều dân tộc miền núi phía Bắc. Mỗi nếp áo đượm màu chàm bền bỉ ấy chở che con người qua bao mùa sương gió đại ngàn.",
  tho_cam_champa:
    "Nhắc đến thổ cẩm Chăm là nhắc tới làng Mỹ Nghiệp ở vùng đất Ninh Thuận với kỹ thuật dệt thủ công trứ danh. Dưới đôi bàn tay kiên nhẫn bên khung dệt, từng mảnh vải thổ cẩm hiện lên đầy sức sống và đậm đà bản sắc.",
  lanh_mong:
    "Đôi bàn tay người phụ nữ Mông dệt nên từng thước vải lanh bền chắc, rồi tỉ mỉ vẽ họa tiết bằng sáp ong, thêu chỉ màu và may chắp cầu kỳ. Mỗi nếp hoa văn trên tấm vải lanh ấy vừa là kỹ thuật tài hoa, vừa là tình yêu bền chặt gửi gắm vào trang phục truyền thống.",
  tho_cam_ede:
    "Giữa không gian buôn làng Tây Nguyên mộc mạc, những tấm thổ cẩm Ê Đê được dệt tay tỉ mỉ với các dải hoa văn hình học đặc trưng. Từng nhịp thoi đưa như hòa cùng tiếng chiêng ngân, dệt nên tấm áo thân thương của đất rừng.",
};

/**
 * Đọc tên nguồn từ nguonIds
 */
export function layTenNguon(nguonIds: string[]): string[] {
  return nguonIds.map((id) => {
    const item = nguon.find((n) => n.id === id);
    return item ? item.ten : id;
  });
}

/**
 * Gọi callGemini viết lại dữ liệu vai thành đoạn kể 2-3 câu có cảm xúc (nhiệt độ 0.5)
 * Tuân thủ nghiêm ngặt QUY TẮC:
 * - Giữ đúng sự kiện
 * - Không đặt tên người, số người, số năm nếu dữ liệu không có
 * - Đổi cấu trúc câu, mỗi vải một giọng khác nhau, không lặp mở đầu
 * - Fallback = suThat nối lại
 */
export async function taoGhiChuChoVai(vaiItem: Vai): Promise<{ text: string; tuAi: boolean }> {
  // Chuẩn bị fallback theo đúng quy định: suThat nối lại
  const fallbackGoc = vaiItem.suThat.join(" ");
  const tone = TONE_GUIDES[vaiItem.id] || {
    moTaGiong: "Giọng cảm xúc, trân trọng nghề thủ công.",
    goiYMoDau: `Bắt đầu bằng nét độc đáo của ${vaiItem.ten}.`,
  };

  const contextData = [
    `Tên chất liệu: ${vaiItem.ten}`,
    `Làng nghề / Xuất xứ: ${vaiItem.langNghe}`,
    `Kỹ thuật dệt/nhuộm: ${vaiItem.kyThuat}`,
    `Sự thật đã kiểm chứng: ${vaiItem.suThat.join("; ")}`,
  ].join("\n");

  try {
    const res = await callGemini({
      vaiTro: `Bạn là người ghi chép văn hóa truyền thống của ứng dụng Đóm Dáng, viết lời kể ngắn gọn, truyền cảm về các làng nghề và kỹ thuật dệt may cổ truyền Việt Nam.`,
      context: contextData,
      quyTac: [
        "Viết đúng từ 2 đến 3 câu kể ngắn gọn về làng nghề và kỹ thuật dệt/nhuộm của loại vải này.",
        "Giọng văn giàu cảm xúc, mộc mạc và chân thành.",
        "QUY TẮC BẮT BUỘC:",
        "- Giữ đúng các sự kiện và địa danh có trong CONTEXT.",
        "- TUYỆT ĐỐI KHÔNG đặt tên người, KHÔNG bịa số người, KHÔNG bịa số năm nếu dữ liệu CONTEXT không có.",
        "- TUYỆT ĐỐI KHÔNG thêm bất kỳ chi tiết lịch sử nào ngoài dữ liệu đã cho.",
        `- Hướng dẫn giọng điệu riêng cho vải này: ${tone.moTaGiong}`,
        `- Hướng dẫn cấu trúc câu: ${tone.goiYMoDau} Tuyệt đối không mở đầu bằng công thức sáo rỗng hay lặp lại mở đầu của các vải khác.`,
      ],
      cauHoi: `Hãy viết đoạn ghi chú 2-3 câu giàu cảm xúc cho chất liệu "${vaiItem.ten}".`,
      nhietDo: 0.5,
    });

    if (res.ok && typeof res.data === "string") {
      const generated = res.data.replace(/```[a-z]*\n?/g, "").trim();

      // Kiểm tra tính hợp lệ: không rỗng, độ dài hợp lý, không chứa năm sinh/năm mất giả mạo
      const hasFakeYear = /\b(1[0-9]{3}|20[0-2][0-9])\b/.test(generated) && !vaiItem.suThat.some((s) => /\b(1[0-9]{3}|20[0-2][0-9])\b/.test(s));

      if (generated.length > 30 && !hasFakeYear) {
        return { text: generated, tuAi: true };
      }
    }
  } catch {
    // Kích hoạt fallback
  }

  // Fallback = suThat nối lại (tuân thủ nghiêm ngặt quy định)
  return {
    text: fallbackGoc,
    tuAi: false,
  };
}
