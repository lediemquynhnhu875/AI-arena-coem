/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * QUẢN LÝ KÍCH THƯỚC VÀ KHUNG VẼ (VIEWPORTS & SCALING SYSTEM)
 * Phân bổ các kích thước để vẽ nhân vật theo ngữ cảnh hiển thị:
 * - xs: Icon nhỏ / danh sách (48x48)
 * - sm: Thẻ hồ sơ / avatar tròn (80x80)
 * - md: Thẻ trang phục (Toàn thân)
 * - lg: Khung thử đồ tiêu chuẩn / Standard dressing room (Khung ôm sát, nhân vật to rõ, không khoảng trống thừa)
 * - can_canh: Cận cảnh diện mạo & nếp áo (Portrait zoom)
 * - xl: Sân khấu trình diễn / 3D Showcase
 */

import { CharacterScalePreset, ViewportScaleConfig } from "../types";

export const VIEWPORT_CANVAS = {
  BASE_WIDTH: 320,
  BASE_HEIGHT: 830,
  CENTER_X: 200,
  // Khung nhìn bao trọn toàn bộ phụ kiện đội đầu (nón lá, nón quai thao, khăn đóng, trâm) đến gót chân và giày dép
  VIEWBOX: "60 -75 280 885",
} as const;

export const CHARACTER_VIEWPORT_PRESETS: Record<CharacterScalePreset, ViewportScaleConfig> = {
  xs: {
    width: 48,
    height: 96,
    viewBox: "135 -40 130 280", // Crop tập trung vào mặt và vai, không cắt nón
    label: "Avatar nhỏ (Icon)",
  },
  sm: {
    width: 80,
    height: 160,
    viewBox: "125 -45 150 360", // Bán thân trên, đủ chỗ phụ kiện đội đầu
    label: "Avatar thẻ (Bán thân)",
  },
  md: {
    width: 250,
    height: 600,
    viewBox: VIEWPORT_CANVAS.VIEWBOX,
    label: "Thẻ trang phục (Toàn thân)",
  },
  lg: {
    width: 320,
    height: 830,
    viewBox: VIEWPORT_CANVAS.VIEWBOX,
    label: "Phối đồ tiêu chuẩn (To rõ)",
  },
  xl: {
    width: 320,
    height: 830,
    viewBox: VIEWPORT_CANVAS.VIEWBOX,
    label: "Trình diễn sàn diễn Việt phục 3D",
  },
};

/**
 * Lấy kích thước hiển thị theo preset hoặc kích thước tùy chỉnh
 */
export function layThongSoViewport(preset: CharacterScalePreset = "lg", customWidth?: number) {
  const config = CHARACTER_VIEWPORT_PRESETS[preset] ?? CHARACTER_VIEWPORT_PRESETS.lg;

  if (customWidth) {
    const ratio = config.height / config.width;
    return {
      width: customWidth,
      height: Math.round(customWidth * ratio),
      viewBox: config.viewBox,
      label: config.label,
    };
  }

  return config;
}
