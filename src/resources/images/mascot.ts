/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * TÀI NGUYÊN HÌNH TƯỢNG CÒ EM (CO EM MASCOT ASSETS)
 * Quản lý các cấu hình hình ảnh, kích thước của linh vật Cò Em dẫn chuyện.
 */

export interface MascotConfig {
  size: number;
  glowIntensity: "subtle" | "medium" | "radiant";
  animate: boolean;
  lampColor: string;
}

export const MASCOT_SIZES = {
  icon: 32,
  badge: 48,
  compact: 80,
  default: 108,
  hero: 160,
} as const;

export const MASCOT_PRESETS = {
  logo: {
    size: MASCOT_SIZES.badge,
    glowIntensity: "medium" as const,
    animate: true,
    lampColor: "#FACC15",
  },
  gateHero: {
    size: MASCOT_SIZES.default,
    glowIntensity: "radiant" as const,
    animate: true,
    lampColor: "#FDE047",
  },
  sidebar: {
    size: MASCOT_SIZES.icon,
    glowIntensity: "subtle" as const,
    animate: false,
    lampColor: "#EAB308",
  },
} as const;
