/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * HOA VĂN & HỌA TIẾT DI SẢN TRUYỀN THỐNG (PATTERNS & TEXTURES)
 * Chứa các SVG vector hoa văn trống đồng, mây cổ, sóng nước thủy ba, giấy dó.
 */

// Texture nhiễu giấy Dó truyền thống
export const DO_PAPER_NOISE_SVG = `data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='220'%20height='220'%3E%3Cfilter%20id='n'%3E%3CfeTurbulence%20type='fractalNoise'%20baseFrequency='.85'%20numOctaves='2'%20stitchTiles='stitch'/%3E%3CfeColorMatrix%20values='0%200%200%200%20.95%20%200%200%200%200%20.92%20%200%200%200%200%20.85%20%200%200%200%20.55%200'/%3E%3C/filter%3E%3Crect%20width='100%25'%20height='100%25'%20filter='url(%23n)'/%3E%3C/svg%3E`;

// Mặt trời & Vành chim Lạc Trống đồng Đông Sơn
export const DONG_SON_SUN_SVG = `
<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="48" stroke="currentColor" stroke-width="1.2" stroke-dasharray="2 2" />
  <circle cx="50" cy="50" r="38" stroke="currentColor" stroke-width="1" />
  <circle cx="50" cy="50" r="14" fill="currentColor" fill-opacity="0.15" stroke="currentColor" stroke-width="1.2" />
  <!-- 14 tia sáng mặt trời Đông Sơn -->
  <g stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
    <line x1="50" y1="36" x2="50" y2="24" />
    <line x1="50" y1="64" x2="50" y2="76" />
    <line x1="36" y1="50" x2="24" y2="50" />
    <line x1="64" y1="50" x2="76" y2="50" />
    <line x1="40" y1="40" x2="31" y2="31" />
    <line x1="60" y1="60" x2="69" y2="69" />
    <line x1="40" y1="60" x2="31" y2="69" />
    <line x1="60" y1="40" x2="69" y2="31" />
  </g>
</svg>
`;

// Họa tiết Sóng Nước Thủy Ba thời Nguyễn
export const THUY_BA_WAVE_SVG = `
<svg viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M0 35 C15 35 20 20 30 20 C40 20 45 35 60 35 C75 35 80 20 90 20 C100 20 105 35 120 35" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
  <path d="M0 25 C15 25 20 10 30 10 C40 10 45 25 60 25 C75 25 80 10 90 10 C100 10 105 25 120 25" stroke="currentColor" stroke-width="1" stroke-linecap="round" opacity="0.6" />
  <circle cx="30" cy="10" r="2" fill="currentColor" opacity="0.8" />
  <circle cx="90" cy="10" r="2" fill="currentColor" opacity="0.8" />
</svg>
`;

// Họa tiết Vân Mây Cuộn Triều Lê
export const VAN_MAY_CLOUD_SVG = `
<svg viewBox="0 0 80 50" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M15 35 C10 35 5 30 5 24 C5 18 10 15 16 15 C17 10 23 5 30 5 C38 5 44 11 45 18 C49 16 54 18 56 22 C60 22 64 26 64 30 C64 35 60 38 55 38 L15 38" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
  <path d="M22 26 C26 22 34 22 38 26 C41 29 46 29 48 27" stroke="currentColor" stroke-width="1" stroke-linecap="round" opacity="0.7" />
</svg>
`;

export const PATTERNS = {
  doPaperNoise: DO_PAPER_NOISE_SVG,
  dongSonSun: DONG_SON_SUN_SVG,
  thuyBaWave: THUY_BA_WAVE_SVG,
  vanMayCloud: VAN_MAY_CLOUD_SVG,
} as const;
