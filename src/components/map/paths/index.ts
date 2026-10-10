/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * TỔNG HỢP SVG PATHS 34 TỈNH THÀNH & BIỂN ĐẢO VIỆT NAM
 * Tách biệt theo 4 miền địa lý văn hóa để code gọn gàng, modular
 */

import { NORTH_PROVINCE_PATHS } from "./northProvinces";
import { CENTRAL_PROVINCE_PATHS } from "./centralProvinces";
import { HIGHLAND_PROVINCE_PATHS } from "./highlandProvinces";
import { SOUTH_PROVINCE_PATHS } from "./southProvinces";

export * from "./northProvinces";
export * from "./centralProvinces";
export * from "./highlandProvinces";
export * from "./southProvinces";
export * from "./islands";

/**
 * Bản đồ tổng hợp đầy đủ 34 SVG Path chuẩn xác 100% của 34 tỉnh thành
 */
export const PROVINCES_34_SVG_PATHS: Record<string, string> = {
  ...NORTH_PROVINCE_PATHS,
  ...CENTRAL_PROVINCE_PATHS,
  ...HIGHLAND_PROVINCE_PATHS,
  ...SOUTH_PROVINCE_PATHS,
};
