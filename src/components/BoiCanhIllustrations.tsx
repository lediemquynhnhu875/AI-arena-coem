/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * BỘ TRANH MINH HỌA BỐI CẢNH & DỊP TRANG PHỤC VIỆT NAM (HERITAGE VIGNETTES)
 * Tranh minh họa màu nước, tranh khắc gỗ và lụa truyền thống thay thế emoji/icon công nghệ.
 */

import React from "react";

interface VignetteProps {
  className?: string;
  size?: number;
}

/**
 * 1. TẾT NGUYÊN ĐÁN: Cành mai vàng khoe sắc, phong bao lì xì gấm đỏ may mắn & bánh chưng xanh
 */
export function TetVignette({ className = "w-14 h-14", size }: VignetteProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Minh họa Tết Nguyên Đán"
    >
      <defs>
        <radialGradient id="tet-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#FEE2E2" stopOpacity="0.1" />
        </radialGradient>
        <linearGradient id="tet-lixi" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#DC2626" />
          <stop offset="100%" stopColor="#991B1B" />
        </linearGradient>
        <linearGradient id="tet-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="100%" stopColor="#CA8A04" />
        </linearGradient>
      </defs>

      {/* Vầng hào quang mùa xuân */}
      <circle cx="50" cy="50" r="46" fill="url(#tet-glow)" />

      {/* Phong bao lì xì gấm đỏ */}
      <g transform="translate(22, 28) rotate(-12 25 35)">
        <rect x="5" y="8" width="34" height="48" rx="6" fill="url(#tet-lixi)" stroke="#B91C1C" strokeWidth="1.5" />
        {/* Nắp bao lì xì */}
        <path d="M5 8 C16 18 28 18 39 8" fill="none" stroke="#FDE047" strokeWidth="1.2" />
        {/* Họa tiết đồng xu / hoa mai vàng trên bao */}
        <circle cx="22" cy="32" r="9" fill="#FEF08A" fillOpacity="0.25" stroke="#FDE047" strokeWidth="1" />
        <circle cx="22" cy="32" r="5" fill="url(#tet-gold)" />
        <rect x="20.5" y="30.5" width="3" height="3" fill="#991B1B" />
      </g>

      {/* Cành mai vàng bung cánh */}
      <path d="M78 82 C65 65 52 48 38 28 C35 23 28 16 22 14" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
      <path d="M52 48 C60 40 68 36 74 34" stroke="#78350F" strokeWidth="2" strokeLinecap="round" />

      {/* Bông hoa mai vàng 5 cánh chính */}
      <g transform="translate(68, 30)">
        <circle cx="-6" cy="-4" r="5.5" fill="url(#tet-gold)" />
        <circle cx="6" cy="-4" r="5.5" fill="url(#tet-gold)" />
        <circle cx="-8" cy="5" r="5.5" fill="url(#tet-gold)" />
        <circle cx="8" cy="5" r="5.5" fill="url(#tet-gold)" />
        <circle cx="0" cy="9" r="5.5" fill="url(#tet-gold)" />
        <circle cx="0" cy="3" r="3" fill="#DC2626" />
        {/* Nhụy hoa */}
        <circle cx="-1" cy="2" r="0.8" fill="#FEF08A" />
        <circle cx="1" cy="2" r="0.8" fill="#FEF08A" />
        <circle cx="0" cy="4" r="0.8" fill="#FEF08A" />
      </g>

      {/* Bông hoa mai nhỏ đang e ấp */}
      <g transform="translate(36, 20) scale(0.65)">
        <circle cx="-6" cy="-4" r="5.5" fill="url(#tet-gold)" />
        <circle cx="6" cy="-4" r="5.5" fill="url(#tet-gold)" />
        <circle cx="0" cy="8" r="5.5" fill="url(#tet-gold)" />
        <circle cx="0" cy="2" r="2.5" fill="#DC2626" />
      </g>

      {/* Nụ xuân xanh tươi */}
      <circle cx="56" cy="42" r="3" fill="#65A30D" />
      <circle cx="75" cy="55" r="2.5" fill="#65A30D" />
    </svg>
  );
}

/**
 * 2. NGÀY KHAI GIẢNG: Chiếc trống trường sơn đỏ gỗ mít, dùi trống thắt lụa & tà áo trắng tựu trường
 */
export function KhaiGiangVignette({ className = "w-14 h-14", size }: VignetteProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Minh họa Ngày khai giảng"
    >
      <defs>
        <radialGradient id="kg-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#E0F2FE" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#F0FDF4" stopOpacity="0.2" />
        </radialGradient>
        <linearGradient id="drum-wood" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#991B1B" />
          <stop offset="50%" stopColor="#DC2626" />
          <stop offset="100%" stopColor="#7F1D1D" />
        </linearGradient>
      </defs>

      <circle cx="50" cy="50" r="46" fill="url(#kg-glow)" />

      {/* Giá đỡ trống bằng gỗ */}
      <path d="M28 78 L40 50 L52 78" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
      <path d="M72 78 L60 50 L48 78" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
      <line x1="33" y1="68" x2="67" y2="68" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />

      {/* Thân trống trường tròn truyền thống */}
      <ellipse cx="50" cy="44" rx="28" ry="18" fill="url(#drum-wood)" stroke="#B91C1C" strokeWidth="1.5" />
      {/* Mặt trống da trâu có đinh tán */}
      <ellipse cx="50" cy="35" rx="28" ry="10" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" />
      <ellipse cx="50" cy="35" rx="22" ry="7" fill="none" stroke="#F59E0B" strokeWidth="1" strokeDasharray="3 3" />
      <circle cx="50" cy="35" r="3" fill="#D97706" />

      {/* Dải đinh tán đồng quanh tang trống */}
      <circle cx="28" cy="45" r="1.5" fill="#FDE047" />
      <circle cx="38" cy="48" r="1.5" fill="#FDE047" />
      <circle cx="50" cy="49" r="1.5" fill="#FDE047" />
      <circle cx="62" cy="48" r="1.5" fill="#FDE047" />
      <circle cx="72" cy="45" r="1.5" fill="#FDE047" />

      {/* Dùi trống thắt nơ lụa đỏ son */}
      <g transform="translate(62, 18) rotate(35)">
        <rect x="0" y="0" width="5" height="42" rx="2.5" fill="#FDE047" stroke="#CA8A04" strokeWidth="1" />
        <circle cx="2.5" cy="4" r="5" fill="#DC2626" />
        <path d="M2.5 12 C-5 16 -6 24 2.5 28 C10 24 9 16 2.5 12 Z" fill="#DC2626" opacity="0.8" />
      </g>
    </svg>
  );
}

/**
 * 3. LỄ CƯỚI: Đôi tráp trầu cau kết lụa hồng, hoa sen búp ngát hương & trâm vàng hạnh phúc
 */
export function LeCuoiVignette({ className = "w-14 h-14", size }: VignetteProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Minh họa Lễ cưới"
    >
      <defs>
        <radialGradient id="cuoi-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FCE7F3" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#FEF2F2" stopOpacity="0.2" />
        </radialGradient>
        <linearGradient id="sen-canh" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#F472B6" />
          <stop offset="100%" stopColor="#FDF2F8" />
        </linearGradient>
      </defs>

      <circle cx="50" cy="50" r="46" fill="url(#cuoi-glow)" />

      {/* Khay tráp sơn son tròn */}
      <ellipse cx="50" cy="68" rx="34" ry="14" fill="#B91C1C" stroke="#991B1B" strokeWidth="2" />
      <ellipse cx="50" cy="65" rx="31" ry="11" fill="#DC2626" stroke="#FDE047" strokeWidth="1.2" />

      {/* Lá trầu xanh xếp tròn têm cánh phượng */}
      <path d="M30 62 C32 50 44 48 50 56 C42 66 32 68 30 62 Z" fill="#15803D" stroke="#166534" strokeWidth="1" />
      <path d="M70 62 C68 50 56 48 50 56 C58 66 68 68 70 62 Z" fill="#16A34A" stroke="#15803D" strokeWidth="1" />

      {/* Quả cau vàng bổ đôi */}
      <circle cx="50" cy="57" r="7" fill="#65A30D" stroke="#4D7C0F" strokeWidth="1" />
      <circle cx="48" cy="56" r="4" fill="#FEF08A" />

      {/* Đóa hoa sen hồng búp thiêng liêng */}
      <g transform="translate(50, 32)">
        {/* Cánh hoa ngoài */}
        <path d="M0 24 C-16 18 -20 2 -8 -8 C-4 4 0 16 0 24 Z" fill="url(#sen-canh)" stroke="#DB2777" strokeWidth="1" />
        <path d="M0 24 C16 18 20 2 8 -8 C4 4 0 16 0 24 Z" fill="url(#sen-canh)" stroke="#DB2777" strokeWidth="1" />
        {/* Cánh hoa giữa */}
        <path d="M0 24 C-10 10 -8 -16 0 -22 C8 -16 10 10 0 24 Z" fill="#FDF2F8" stroke="#EC4899" strokeWidth="1.2" />
        {/* Đài sen vàng */}
        <circle cx="0" cy="2" r="3" fill="#F59E0B" />
      </g>

      {/* Dải lụa song hỷ uốn lượn */}
      <path d="M22 40 C32 30 40 45 50 35 C60 25 70 38 78 30" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="1 3" />
    </svg>
  );
}

/**
 * 4. CHỤP ẢNH KỶ YẾU: Cửa sổ tròn Khuê Văn Các cổ kính, tà áo tung bay & đóa cúc trắng
 */
export function KyYeuVignette({ className = "w-14 h-14", size }: VignetteProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Minh họa Chụp ảnh kỷ yếu"
    >
      <defs>
        <radialGradient id="ky-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FEF3C7" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#EFF6FF" stopOpacity="0.2" />
        </radialGradient>
      </defs>

      <circle cx="50" cy="50" r="46" fill="url(#ky-glow)" />

      {/* Cửa sổ tròn Khuê Văn Các tượng trưng cho thanh xuân Văn Miếu */}
      <circle cx="50" cy="46" r="28" fill="#FFFBEB" stroke="#B45309" strokeWidth="3.5" />
      <circle cx="50" cy="46" r="23" stroke="#D97706" strokeWidth="1.2" strokeDasharray="3 2" />

      {/* 8 nan hoa gỗ tỏa sáng đặc trưng của gác Khuê Văn */}
      <g stroke="#B45309" strokeWidth="2" strokeLinecap="round">
        <line x1="50" y1="23" x2="50" y2="69" />
        <line x1="27" y1="46" x2="73" y2="46" />
        <line x1="34" y1="30" x2="66" y2="62" />
        <line x1="66" y1="30" x2="34" y2="62" />
      </g>
      <circle cx="50" cy="46" r="6" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />

      {/* Mái ngói cong cổ kính phía trên */}
      <path d="M18 22 C32 18 50 14 68 18 L82 22 C72 16 50 12 18 22 Z" fill="#991B1B" />
      <path d="M22 24 C38 18 62 18 78 24" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />

      {/* Đóa cúc họa mi kỷ yếu thanh thuần */}
      <g transform="translate(32, 74)">
        <circle cx="0" cy="0" r="3.5" fill="#F59E0B" />
        <ellipse cx="0" cy="-7" rx="2" ry="4" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="0.8" />
        <ellipse cx="0" cy="7" rx="2" ry="4" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="0.8" />
        <ellipse cx="-7" cy="0" rx="4" ry="2" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="0.8" />
        <ellipse cx="7" cy="0" rx="4" ry="2" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="0.8" />
      </g>

      <g transform="translate(68, 72) scale(0.85)">
        <circle cx="0" cy="0" r="3.5" fill="#F59E0B" />
        <ellipse cx="0" cy="-7" rx="2" ry="4" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="0.8" />
        <ellipse cx="0" cy="7" rx="2" ry="4" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="0.8" />
        <ellipse cx="-7" cy="0" rx="4" ry="2" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="0.8" />
        <ellipse cx="7" cy="0" rx="4" ry="2" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="0.8" />
      </g>
    </svg>
  );
}

/**
 * 5. LỄ TỐT NGHIỆP: Cuộn bằng đại học thắt lụa son đỏ, cành nguyệt quế vàng & mũ vinh danh
 */
export function TotNghiepVignette({ className = "w-14 h-14", size }: VignetteProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Minh họa Lễ tốt nghiệp"
    >
      <defs>
        <radialGradient id="tn-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FEF9C3" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#EFF6FF" stopOpacity="0.2" />
        </radialGradient>
      </defs>

      <circle cx="50" cy="50" r="46" fill="url(#tn-glow)" />

      {/* Mũ cử nhân phương Tây giao hòa lễ nghi */}
      <g transform="translate(50, 34)">
        <polygon points="0,-18 36,-6 0,6 -36,-6" fill="#1E293B" stroke="#0F172A" strokeWidth="1.5" />
        <ellipse cx="0" cy="4" rx="14" ry="7" fill="#0F172A" />
        {/* Nút tròn & dải tua vàng */}
        <circle cx="0" cy="-6" r="2.5" fill="#EAB308" />
        <path d="M0 -6 C12 -6 24 2 26 12" stroke="#EAB308" strokeWidth="2" strokeLinecap="round" />
        <rect x="24" y="12" width="4" height="8" rx="1" fill="#CA8A04" />
      </g>

      {/* Cuộn văn bằng thắt ruy băng đỏ son */}
      <g transform="translate(24, 52) rotate(16)">
        <rect x="0" y="4" width="46" height="14" rx="3" fill="#FFFBEB" stroke="#D97706" strokeWidth="1.5" />
        <ellipse cx="0" cy="11" rx="4" ry="7" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.2" />
        {/* Dải nơ đỏ son */}
        <rect x="20" y="2" width="8" height="18" fill="#DC2626" />
        <path d="M24 20 L18 30 M24 20 L30 30" stroke="#DC2626" strokeWidth="3" strokeLinecap="round" />
      </g>

      {/* Cành lá nguyệt quế vàng thành tài */}
      <path d="M22 75 C38 84 62 84 78 75" stroke="#CA8A04" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="28" cy="74" rx="4" ry="2" fill="#EAB308" transform="rotate(-25 28 74)" />
      <ellipse cx="40" cy="79" rx="4" ry="2" fill="#EAB308" transform="rotate(-10 40 79)" />
      <ellipse cx="60" cy="79" rx="4" ry="2" fill="#EAB308" transform="rotate(10 60 79)" />
      <ellipse cx="72" cy="74" rx="4" ry="2" fill="#EAB308" transform="rotate(25 72 74)" />
    </svg>
  );
}

/**
 * 6. NGÀY NHÀ GIÁO: Cuộn thư tịch giấy Dó, bút lông cán trúc mực mài & đóa hoa tri ân
 */
export function NhaGiaoVignette({ className = "w-14 h-14", size }: VignetteProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Minh họa Ngày Nhà giáo"
    >
      <defs>
        <radialGradient id="ng-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FEF3C7" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#F5F5F4" stopOpacity="0.1" />
        </radialGradient>
      </defs>

      <circle cx="50" cy="50" r="46" fill="url(#ng-glow)" />

      {/* Trang sách / Thư tịch giấy Dó cổ truyền */}
      <g transform="translate(18, 25)">
        <path d="M5 8 C18 4 30 10 32 14 C34 10 46 4 59 8 L59 48 C46 44 34 50 32 54 C30 50 18 44 5 48 Z" fill="#FEFCE8" stroke="#D97706" strokeWidth="1.8" />
        {/* Nếp gáy sách */}
        <line x1="32" y1="14" x2="32" y2="54" stroke="#B45309" strokeWidth="2" />
        {/* Dòng chữ Hán Nôm / Quốc ngữ tượng trưng */}
        <line x1="12" y1="20" x2="25" y2="20" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
        <line x1="12" y1="26" x2="25" y2="26" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
        <line x1="12" y1="32" x2="22" y2="32" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />

        <line x1="39" y1="20" x2="52" y2="20" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
        <line x1="39" y1="26" x2="52" y2="26" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
        <line x1="39" y1="32" x2="48" y2="32" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      </g>

      {/* Cây bút lông cán trúc nghiêng mình */}
      <g transform="translate(70, 22) rotate(28)">
        <rect x="0" y="0" width="5" height="52" rx="2.5" fill="#CA8A04" stroke="#78350F" strokeWidth="1" />
        {/* Đầu lông ngòi mực nhọn */}
        <path d="M0 52 C0 58 2.5 66 2.5 66 C2.5 66 5 58 5 52 Z" fill="#0F172A" />
      </g>

      {/* Đóa hoa hướng dương / hoa cúc vàng tri ân */}
      <g transform="translate(30, 72) scale(0.9)">
        <circle cx="0" cy="0" r="5" fill="#78350F" />
        <circle cx="-9" cy="0" r="4" fill="#EAB308" />
        <circle cx="9" cy="0" r="4" fill="#EAB308" />
        <circle cx="0" cy="-9" r="4" fill="#EAB308" />
        <circle cx="0" cy="9" r="4" fill="#EAB308" />
        <circle cx="-6" cy="-6" r="4" fill="#EAB308" />
        <circle cx="6" cy="-6" r="4" fill="#EAB308" />
        <circle cx="-6" cy="6" r="4" fill="#EAB308" />
        <circle cx="6" cy="6" r="4" fill="#EAB308" />
      </g>
    </svg>
  );
}

/**
 * 7. DỊP LỄ HỘI: Đèn lồng đỏ Hội An tỏa sáng, mái đình cong vút & cờ ngũ sắc trẩy hội
 */
export function LeHoiVignette({ className = "w-14 h-14", size }: VignetteProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Minh họa Dịp lễ hội"
    >
      <defs>
        <radialGradient id="lh-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#FFEDD5" stopOpacity="0.2" />
        </radialGradient>
        <linearGradient id="long-den" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#DC2626" />
          <stop offset="50%" stopColor="#EF4444" />
          <stop offset="100%" stopColor="#B91C1C" />
        </linearGradient>
      </defs>

      <circle cx="50" cy="50" r="46" fill="url(#lh-glow)" />

      {/* Mái đình làng cong vút */}
      <path d="M12 30 C28 22 72 22 88 30 C82 24 64 16 50 16 C36 16 18 24 12 30 Z" fill="#991B1B" stroke="#78350F" strokeWidth="1" />
      <path d="M12 30 C20 33 80 33 88 30" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />

      {/* Chiếc đèn lồng quả trám phố Hội truyền thống */}
      <g transform="translate(50, 52)">
        {/* Dây treo */}
        <line x1="0" y1="-24" x2="0" y2="-15" stroke="#78350F" strokeWidth="2" />
        {/* Miệng đèn gỗ tròn */}
        <rect x="-10" y="-15" width="20" height="3" rx="1.5" fill="#78350F" />

        {/* Quả đèn lồng lụa đỏ tròn bầu */}
        <ellipse cx="0" cy="0" rx="20" ry="17" fill="url(#long-den)" stroke="#991B1B" strokeWidth="1.5" />
        {/* Nan tre uốn lượn bên trong */}
        <ellipse cx="0" cy="0" rx="11" ry="17" fill="none" stroke="#FDE047" strokeWidth="1" opacity="0.7" />
        <line x1="0" y1="-17" x2="0" y2="17" stroke="#FDE047" strokeWidth="1" opacity="0.7" />

        {/* Đáy đèn gỗ */}
        <rect x="-8" y="17" width="16" height="3" rx="1.5" fill="#78350F" />
        {/* Tua rua lụa vàng buông rủ */}
        <line x1="0" y1="20" x2="0" y2="34" stroke="#EAB308" strokeWidth="3" strokeLinecap="round" />
        <circle cx="0" cy="24" r="2.5" fill="#DC2626" />
      </g>

      {/* Đèn lồng phụ nhỏ bay xa */}
      <g transform="translate(24, 46) scale(0.55)">
        <ellipse cx="0" cy="0" rx="16" ry="14" fill="#F59E0B" />
        <line x1="0" y1="14" x2="0" y2="26" stroke="#CA8A04" strokeWidth="2" />
      </g>
      <g transform="translate(76, 44) scale(0.55)">
        <ellipse cx="0" cy="0" rx="16" ry="14" fill="#EA580C" />
        <line x1="0" y1="14" x2="0" y2="26" stroke="#CA8A04" strokeWidth="2" />
      </g>
    </svg>
  );
}

/**
 * 8. MẶC ĐỜI THƯỜNG: Nón lá chóp nhọn, dải khăn rằn Nam Bộ & rặng tre thanh bình
 */
export function DoiThuongVignette({ className = "w-14 h-14", size }: VignetteProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Minh họa Mặc đời thường"
    >
      <defs>
        <radialGradient id="dt-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#DCFCE7" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#F0FDF4" stopOpacity="0.2" />
        </radialGradient>
      </defs>

      <circle cx="50" cy="50" r="46" fill="url(#dt-glow)" />

      {/* Chiếc nón lá búp bàng nghiêng bóng */}
      <g transform="translate(50, 42)">
        {/* Chóp nón */}
        <path d="M0 -22 L-28 14 L28 14 Z" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.8" strokeLinejoin="round" />
        {/* Vành nón lá */}
        <ellipse cx="0" cy="14" rx="28" ry="8" fill="#FDE68A" stroke="#B45309" strokeWidth="1.5" />
        {/* Nan nón lá thanh mảnh */}
        <path d="M0 -22 L-14 17 M0 -22 L14 17 M0 -22 L0 18" stroke="#D97706" strokeWidth="0.8" opacity="0.6" />
        {/* Quai nón lụa hồng / xanh */}
        <path d="M-18 16 C-12 28 0 30 4 28" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* Dải khăn rằn caro Nam Bộ vắt ngang */}
      <g transform="translate(18, 62) rotate(-8)">
        <rect x="0" y="0" width="64" height="12" rx="3" fill="#FFFFFF" stroke="#334155" strokeWidth="1.2" />
        {/* Kẻ caro khăn rằn đen trắng đặc trưng */}
        <rect x="6" y="0" width="8" height="12" fill="#0F172A" />
        <rect x="20" y="0" width="8" height="12" fill="#0F172A" />
        <rect x="34" y="0" width="8" height="12" fill="#0F172A" />
        <rect x="48" y="0" width="8" height="12" fill="#0F172A" />
        {/* Dải tua rua khăn rằn */}
        <line x1="64" y1="2" x2="70" y2="2" stroke="#334155" strokeWidth="1.2" />
        <line x1="64" y1="6" x2="71" y2="6" stroke="#334155" strokeWidth="1.2" />
        <line x1="64" y1="10" x2="70" y2="10" stroke="#334155" strokeWidth="1.2" />
      </g>

      {/* Nhành lá tre ngà xanh tươi */}
      <path d="M72 20 C62 30 58 45 62 60" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" />
      <path d="M68 28 C76 26 84 30 84 30 C84 30 76 34 68 28 Z" fill="#22C55E" />
      <path d="M64 40 C72 38 80 44 80 44 C80 44 72 46 64 40 Z" fill="#16A34A" />
    </svg>
  );
}

/**
 * 9. CHỈ MUỐN DẠO NGẮM: Cánh cò trắng Cò Em soi bóng nước, áng mây cổ & sóng nước thủy ba
 */
export function DaoNgamVignette({ className = "w-14 h-14", size }: VignetteProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Minh họa Chỉ muốn dạo ngắm"
    >
      <defs>
        <radialGradient id="dn-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#E0F2FE" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#FEF3C7" stopOpacity="0.25" />
        </radialGradient>
      </defs>

      <circle cx="50" cy="50" r="46" fill="url(#dn-glow)" />

      {/* Áng mây ngũ sắc triều Lê bồng bềnh */}
      <path
        d="M20 38 C20 32 26 28 32 28 C34 22 42 20 48 24 C52 20 60 22 64 26 C70 26 76 32 74 38 C76 44 70 48 64 48 L26 48 C20 48 18 42 20 38 Z"
        fill="#FFFFFF"
        stroke="#93C5FD"
        strokeWidth="1.2"
        opacity="0.9"
      />

      {/* Cánh cò trắng Cò Em nghiêng mình chao liệng */}
      <g transform="translate(50, 44)">
        {/* Đôi cánh cò giang rộng */}
        <path
          d="M0 0 C-14 -16 -32 -18 -36 -12 C-28 -4 -12 -2 0 4 C12 -2 28 -4 36 -12 C32 -18 14 -16 0 0 Z"
          fill="#FFFFFF"
          stroke="#0F172A"
          strokeWidth="1.5"
        />
        {/* Thân cò mảnh mai */}
        <ellipse cx="0" cy="2" rx="4" ry="9" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.2" />
        {/* Đầu cò và chiếc mỏ vàng */}
        <circle cx="0" cy="-8" r="3" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1" />
        <path d="M0 -8 L0 -16" stroke="#EAB308" strokeWidth="2" strokeLinecap="round" />
        {/* Đôi chân cò gập nhẹ về sau */}
        <line x1="-2" y1="10" x2="-4" y2="20" stroke="#EA580C" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="2" y1="10" x2="4" y2="20" stroke="#EA580C" strokeWidth="1.5" strokeLinecap="round" />
      </g>

      {/* Làn sóng nước thủy ba gợn lăn tăn */}
      <path d="M18 76 C28 72 38 72 48 76 C58 80 68 80 78 76" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
      <path d="M26 83 C36 80 44 80 52 83 C60 86 68 86 74 83" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

/**
 * BẢNG ÁNH XẠ VIGNETTE CHO TỪNG DỊP
 */
export const OCCASION_VIGNETTES: Record<string, React.FC<VignetteProps>> = {
  tet: TetVignette,
  khai_giang: KhaiGiangVignette,
  cuoi: LeCuoiVignette,
  ky_yeu: KyYeuVignette,
  tot_nghiep: TotNghiepVignette,
  nha_giao: NhaGiaoVignette,
  le_hoi: LeHoiVignette,
  doi_thuong: DoiThuongVignette,
  chi_muon_kham_pha: DaoNgamVignette,
};

/**
 * MINH HỌA VÙNG MIỀN (HERITAGE REGION BADGES)
 */
export function NonQuaiThaoVignette({ className = "w-12 h-12" }: VignetteProps) {
  return (
    <svg viewBox="0 0 80 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="36" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5" />
      <ellipse cx="40" cy="40" rx="26" ry="12" fill="#FDE68A" stroke="#B45309" strokeWidth="2" />
      <circle cx="40" cy="40" r="6" fill="#CA8A04" />
      <path d="M22 42 C20 58 35 64 40 64 C45 64 60 58 58 42" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function HueCoDoVignette({ className = "w-12 h-12" }: VignetteProps) {
  return (
    <svg viewBox="0 0 80 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="36" fill="#F5F3FF" stroke="#7C3AED" strokeWidth="1.5" />
      <path d="M16 36 C28 28 52 28 64 36 L68 40 L12 40 Z" fill="#991B1B" stroke="#78350F" strokeWidth="1.2" />
      <rect x="22" y="40" width="36" height="22" fill="#FEF3C7" stroke="#B45309" strokeWidth="1.5" />
      <path d="M34 62 C34 50 46 50 46 62 Z" fill="#7C3AED" />
      <line x1="28" y1="48" x2="28" y2="56" stroke="#B45309" strokeWidth="1.2" />
      <line x1="52" y1="48" x2="52" y2="56" stroke="#B45309" strokeWidth="1.2" />
    </svg>
  );
}

export function NamBoSongNuocVignette({ className = "w-12 h-12" }: VignetteProps) {
  return (
    <svg viewBox="0 0 80 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="36" fill="#ECFDF5" stroke="#059669" strokeWidth="1.5" />
      {/* Chiếc xuồng ba lá */}
      <path d="M14 44 C28 54 52 54 66 44 C56 50 24 50 14 44 Z" fill="#78350F" stroke="#451A03" strokeWidth="1.5" />
      {/* Nón lá mini trong thuyền */}
      <path d="M40 32 L30 44 L50 44 Z" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.2" />
      {/* Sóng nước */}
      <path d="M18 56 C28 52 38 52 48 56 C58 60 64 58 70 56" stroke="#0EA5E9" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function ThaiTayBacVignette({ className = "w-12 h-12" }: VignetteProps) {
  return (
    <svg viewBox="0 0 80 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="36" fill="#FDF2F8" stroke="#DB2777" strokeWidth="1.5" />
      {/* Hoa ban trắng Tây Bắc */}
      <g transform="translate(40, 36)">
        <circle cx="0" cy="0" r="4" fill="#EAB308" />
        <ellipse cx="0" cy="-12" rx="6" ry="10" fill="#FFFFFF" stroke="#EC4899" strokeWidth="1" />
        <ellipse cx="-11" cy="-4" rx="10" ry="6" fill="#FFFFFF" stroke="#EC4899" strokeWidth="1" />
        <ellipse cx="11" cy="-4" rx="10" ry="6" fill="#FFFFFF" stroke="#EC4899" strokeWidth="1" />
        <ellipse cx="-8" cy="10" rx="8" ry="6" fill="#FFFFFF" stroke="#EC4899" strokeWidth="1" />
        <ellipse cx="8" cy="10" rx="8" ry="6" fill="#FFFFFF" stroke="#EC4899" strokeWidth="1" />
      </g>
      {/* Hàng cúc bướm bạc */}
      <circle cx="40" cy="62" r="3.5" fill="#E2E8F0" stroke="#64748B" strokeWidth="1" />
      <circle cx="30" cy="62" r="2.5" fill="#CBD5E1" />
      <circle cx="50" cy="62" r="2.5" fill="#CBD5E1" />
    </svg>
  );
}

export function MongThoCamVignette({ className = "w-12 h-12" }: VignetteProps) {
  return (
    <svg viewBox="0 0 80 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="36" fill="#EFF6FF" stroke="#2563EB" strokeWidth="1.5" />
      {/* Họa tiết hoa văn hình học lanh vẽ sáp ong */}
      <rect x="24" y="24" width="32" height="32" fill="#1E3A8A" stroke="#93C5FD" strokeWidth="1.5" />
      <rect x="30" y="30" width="20" height="20" fill="#DC2626" />
      <polygon points="40,32 48,40 40,48 32,40" fill="#FDE047" />
      <circle cx="40" cy="40" r="3" fill="#1E3A8A" />
      {/* Vòng bạc Mông */}
      <circle cx="40" cy="40" r="24" fill="none" stroke="#E2E8F0" strokeWidth="2.5" strokeDasharray="6 3" />
    </svg>
  );
}

export function EDeCongChiengVignette({ className = "w-12 h-12" }: VignetteProps) {
  return (
    <svg viewBox="0 0 80 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="36" fill="#FFFBEB" stroke="#D97706" strokeWidth="1.5" />
      {/* Cồng chiêng đồng có núm */}
      <circle cx="40" cy="40" r="26" fill="#B45309" stroke="#78350F" strokeWidth="2" />
      <circle cx="40" cy="40" r="18" fill="#D97706" stroke="#92400E" strokeWidth="1" strokeDasharray="3 2" />
      <circle cx="40" cy="40" r="8" fill="#FDE047" stroke="#78350F" strokeWidth="1.5" />
      {/* Tia sáng mặt trời Tây Nguyên */}
      <line x1="40" y1="8" x2="40" y2="2" stroke="#CA8A04" strokeWidth="2" strokeLinecap="round" />
      <line x1="40" y1="78" x2="40" y2="72" stroke="#CA8A04" strokeWidth="2" strokeLinecap="round" />
      <line x1="8" y1="40" x2="2" y2="40" stroke="#CA8A04" strokeWidth="2" strokeLinecap="round" />
      <line x1="78" y1="40" x2="72" y2="40" stroke="#CA8A04" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function ChamThapVignette({ className = "w-12 h-12" }: VignetteProps) {
  return (
    <svg viewBox="0 0 80 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="36" fill="#FFF7ED" stroke="#EA580C" strokeWidth="1.5" />
      {/* Tháp Chàm đất nung tầng tầng lớp lớp */}
      <polygon points="40,16 48,26 32,26" fill="#C2410C" />
      <rect x="30" y="26" width="20" height="12" fill="#9A3412" stroke="#EA580C" strokeWidth="1" />
      <rect x="25" y="38" width="30" height="14" fill="#C2410C" stroke="#7C2D12" strokeWidth="1" />
      <rect x="20" y="52" width="40" height="16" fill="#9A3412" stroke="#EA580C" strokeWidth="1" />
      <path d="M35 68 C35 58 45 58 45 68 Z" fill="#431407" />
    </svg>
  );
}

export function KhmerThapVignette({ className = "w-12 h-12" }: VignetteProps) {
  return (
    <svg viewBox="0 0 80 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="36" fill="#FEFCE8" stroke="#CA8A04" strokeWidth="1.5" />
      {/* Đỉnh tháp nhọn chùa Khmer vàng rực */}
      <path d="M40 12 L43 28 L37 28 Z" fill="#FDE047" stroke="#CA8A04" strokeWidth="1" />
      <path d="M32 28 C36 24 44 24 48 28 L54 44 L26 44 Z" fill="#EAB308" stroke="#A16207" strokeWidth="1.2" />
      <rect x="22" y="44" width="36" height="24" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1.5" />
      {/* Cột hoa văn Angkor */}
      <line x1="28" y1="44" x2="28" y2="68" stroke="#A16207" strokeWidth="2" />
      <line x1="52" y1="44" x2="52" y2="68" stroke="#A16207" strokeWidth="2" />
      <path d="M35 68 C35 56 45 56 45 68 Z" fill="#CA8A04" />
    </svg>
  );
}

export const REGION_VIGNETTES: Record<string, React.FC<VignetteProps>> = {
  kb: NonQuaiThaoVignette,
  kh: HueCoDoVignette,
  kn: NamBoSongNuocVignette,
  thai: ThaiTayBacVignette,
  mong: MongThoCamVignette,
  ede: EDeCongChiengVignette,
  champa: ChamThapVignette,
  khmer: KhmerThapVignette,
};

/**
 * MINH HỌA PHONG CÁCH
 */
export function CoPhongVignette({ className = "w-12 h-12" }: VignetteProps) {
  return (
    <svg viewBox="0 0 80 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="36" fill="#FEF3C7" stroke="#B45309" strokeWidth="1.5" />
      {/* Cuộn thư tịch & ngọc bội */}
      <rect x="24" y="20" width="32" height="40" rx="3" fill="#FFFBEB" stroke="#92400E" strokeWidth="1.5" />
      <circle cx="40" cy="40" r="8" fill="#15803D" stroke="#14532D" strokeWidth="1.2" />
      <line x1="40" y1="48" x2="40" y2="66" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" />
      <circle cx="40" cy="54" r="2" fill="#EAB308" />
    </svg>
  );
}

export function CachTanVignette({ className = "w-12 h-12" }: VignetteProps) {
  return (
    <svg viewBox="0 0 80 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="36" fill="#FDF2F8" stroke="#DB2777" strokeWidth="1.5" />
      {/* Cánh hoa đào bay cùng tà áo mềm */}
      <path d="M26 56 C30 38 48 30 58 24" stroke="#EC4899" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="34" cy="30" r="4" fill="#F472B6" />
      <circle cx="48" cy="44" r="3" fill="#F472B6" />
      <circle cx="24" cy="42" r="2.5" fill="#FB7185" />
    </svg>
  );
}

export function PhaCachVignette({ className = "w-12 h-12" }: VignetteProps) {
  return (
    <svg viewBox="0 0 80 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="36" fill="#F0FDF4" stroke="#16A34A" strokeWidth="1.5" />
      {/* Đa sắc remix độc đáo */}
      <polygon points="40,18 47,33 63,35 52,47 54,63 40,55 26,63 28,47 17,35 33,33" fill="#EAB308" stroke="#CA8A04" strokeWidth="1.2" />
      <circle cx="40" cy="40" r="5" fill="#15803D" />
    </svg>
  );
}

export const STYLE_VIGNETTES: Record<string, React.FC<VignetteProps>> = {
  truyen_thong: CoPhongVignette,
  cach_tan_nhe: CachTanVignette,
  ca_tinh: PhaCachVignette,
};
