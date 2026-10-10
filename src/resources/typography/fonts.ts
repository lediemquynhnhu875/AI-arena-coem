/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * HỆ THỐNG PHÔNG CHỮ & KIỂU CHỮ (TYPOGRAPHY SYSTEM)
 * Quản lý tập trung font chữ, thang kích cỡ, độ dày và tỷ lệ dòng.
 */

export const FONT_FAMILIES = {
  heading: '"Be Vietnam Pro", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  body: '"Be Vietnam Pro", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  quote: '"Noto Serif", Georgia, serif',
  script: '"Charm", cursive',
} as const;

export const FONT_SIZES = {
  "2xs": "0.6875rem", // 11px
  xs: "0.75rem",      // 12px
  sm: "0.875rem",     // 14px
  base: "1rem",       // 16px
  lg: "1.125rem",     // 18px
  xl: "1.25rem",      // 20px
  "2xl": "1.5rem",    // 24px
  "3xl": "1.875rem",  // 30px
  "4xl": "2.25rem",   // 36px
  "5xl": "3rem",      // 48px
} as const;

export const FONT_WEIGHTS = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

export const LINE_HEIGHTS = {
  tight: 1.25,
  snug: 1.375,
  normal: 1.5,
  relaxed: 1.625,
  loose: 1.8,
} as const;

/**
 * Kiểu chữ quy chuẩn cho từng cấp độ hiển thị
 */
export const TYPOGRAPHY_PRESETS = {
  heroTitle: {
    fontFamily: FONT_FAMILIES.heading,
    fontSize: FONT_SIZES["3xl"],
    fontWeight: FONT_WEIGHTS.bold,
    lineHeight: LINE_HEIGHTS.tight,
    letterSpacing: "0.02em",
  },
  sectionTitle: {
    fontFamily: FONT_FAMILIES.heading,
    fontSize: FONT_SIZES["2xl"],
    fontWeight: FONT_WEIGHTS.bold,
    lineHeight: LINE_HEIGHTS.snug,
    letterSpacing: "0.01em",
  },
  cardTitle: {
    fontFamily: FONT_FAMILIES.heading,
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.semibold,
    lineHeight: LINE_HEIGHTS.snug,
  },
  bodyRegular: {
    fontFamily: FONT_FAMILIES.body,
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.regular,
    lineHeight: LINE_HEIGHTS.relaxed,
  },
  caption: {
    fontFamily: FONT_FAMILIES.body,
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.medium,
    lineHeight: LINE_HEIGHTS.normal,
  },
  verseQuote: {
    fontFamily: FONT_FAMILIES.quote,
    fontStyle: "italic",
    fontSize: FONT_SIZES.base,
    lineHeight: LINE_HEIGHTS.relaxed,
  },
} as const;
