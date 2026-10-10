/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * QUY TẮC ĐÁNH GIÁ PHỐI ĐỒ VĂN HÓA (OUTFIT EVALUATION RULES)
 */

import { StylingAdvice } from "../types";

export function evaluateOutfitStyling(
  trangPhucId: string,
  mauId: string,
  phuKienIds: string[],
  hoaVanThem?: string | null
): StylingAdvice {
  const isSneaker = phuKienIds.includes("sneaker");
  const isTote = phuKienIds.includes("tote");
  const isRemix = isSneaker || isTote || (hoaVanThem !== null && hoaVanThem !== undefined);

  let isHarmonious = true;
  let colorNote = "Sắc màu hài hòa, tôn lên vóc dáng và tinh thần trang phục.";
  let cultureNote = "Bộ trang phục gìn giữ đúng nét đoan trang truyền thống.";
  let suggestion = undefined;

  // Đánh giá màu sắc theo trang phục
  if (trangPhucId === "tu_than" && mauId === "m_vang") {
    colorNote = "Màu vàng sáng làm mới mẻ tà áo tứ thân xưa (thường chuộng màu nâu gụ, đen đụp).";
  } else if (trangPhucId === "ba_ba" && mauId === "m_nau") {
    colorNote = "Màu nâu đất chuẩn mộc Nam Bộ, đậm tình phù sa đồng bằng.";
  } else if (trangPhucId === "aodai" && mauId === "m_trang") {
    colorNote = "Sắc trắng ngà thanh tao, biểu trưng bất hủ cho áo dài Việt Nam.";
  }

  // Đánh giá remix
  if (isRemix) {
    cultureNote = "Phối đồ phong cách Remix: dung hòa phụ kiện hiện đại với vẻ đẹp di sản.";
    if (isSneaker) {
      suggestion = "Sneaker tạo bước đi năng động, rất hợp cho giới trẻ dạo phố cùng cổ phục.";
    }
  }

  return {
    isHarmonious,
    colorNote,
    cultureNote,
    suggestion,
  };
}
