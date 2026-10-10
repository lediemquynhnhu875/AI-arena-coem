/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * BIỂU TƯỢNG VĂN HÓA DI SẢN (HERITAGE SVG ICONS)
 */

export const HERITAGE_ICONS = {
  // Con thoi dệt vải
  weavingShuttle: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M2 12C5 7 19 7 22 12C19 17 5 17 2 12Z"/>
      <ellipse cx="12" cy="12" rx="3" ry="1.5"/>
    </svg>
  `,
  // Nón lá
  conicalHat: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 3L2 19H22L12 3Z"/>
      <ellipse cx="12" cy="19" rx="10" ry="2"/>
    </svg>
  `,
  // Đèn lồng giấy
  lantern: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <rect x="8" y="2" width="8" height="2" rx="1"/>
      <ellipse cx="12" cy="13" rx="7" ry="9"/>
      <line x1="8" y1="13" x2="16" y2="13"/>
      <rect x="9" y="22" width="6" height="1.5" rx="0.5"/>
    </svg>
  `,
  // Kim chỉ thêu
  needleThread: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <line x1="4" y1="20" x2="18" y2="6"/>
      <path d="M18 6L21 3L18 6Z"/>
      <path d="M18 6C15 3 11 7 14 10C17 13 13 17 10 14"/>
    </svg>
  `,
  // Gùi tre
  basket: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d="M5 6L7 20H17L19 6H5Z"/>
      <path d="M9 6V3C9 2.5 10 2 12 2C14 2 15 2.5 15 3V6"/>
      <line x1="7" y1="11" x2="17" y2="11"/>
      <line x1="7" y1="15" x2="17" y2="15"/>
    </svg>
  `,
} as const;
