/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * BỘ HOA VĂN DI SẢN VĂN HÓA SVG (CULTURAL PATTERNS SVG DEFINITIONS)
 * 8 hệ thống hoa văn thổ cẩm và họa tiết truyền thống của các dân tộc Việt Nam:
 * 1. Thái: Họa tiết quả trám & zic-zac
 * 2. Mông: Chữ thập & xoắn ốc sáp ong
 * 3. Ê Đê: Sọc chỉ & răng cưa Tây Nguyên
 * 4. Chăm: Quả trám và tháp Chăm
 * 5. Khmer: Vân sen cách điệu Nam Bộ
 * 6. Kinh Bắc: Hoa cúc & vân mây Đồng Sơn
 * 7. Kinh Huế: Vân mây cung đình & chữ thọ
 * 8. Kinh Nam Bộ: Kẻ ô vuông rằn
 */

export function CulturalPatternsDefs() {
  return (
    <defs>
      {/* 1. Thái: Họa tiết quả trám & zic-zac dệt thổ cẩm */}
      <pattern id="hoa-van-thai" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 0 10 L 10 0 L 20 10 L 10 20 Z" fill="none" stroke="#ffffff" strokeWidth="1.2" opacity="0.32" />
        <circle cx="10" cy="10" r="2.5" fill="#ffffff" opacity="0.4" />
      </pattern>

      {/* 2. Mông: Họa tiết chữ thập & xoắn ốc sáp ong */}
      <pattern id="hoa-van-mong" width="24" height="24" patternUnits="userSpaceOnUse">
        <path d="M 12 4 L 12 20 M 4 12 L 20 12" stroke="#ffffff" strokeWidth="1.5" opacity="0.35" />
        <rect x="2" y="2" width="6" height="6" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.28" />
        <rect x="16" y="16" width="6" height="6" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.28" />
      </pattern>

      {/* 3. Ê Đê: Họa tiết sọc chỉ & răng cưa Tây Nguyên */}
      <pattern id="hoa-van-ede" width="20" height="16" patternUnits="userSpaceOnUse">
        <line x1="0" y1="4" x2="20" y2="4" stroke="#ffffff" strokeWidth="1.2" opacity="0.32" />
        <line x1="0" y1="12" x2="20" y2="12" stroke="#ffffff" strokeWidth="1.2" opacity="0.32" />
        <path d="M 0 8 L 5 4 L 10 8 L 15 4 L 20 8" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.3" />
      </pattern>

      {/* 4. Chăm: Hoa văn quả trám và tháp Chăm */}
      <pattern id="hoa-van-champa" width="22" height="22" patternUnits="userSpaceOnUse">
        <polygon points="11,2 20,11 11,20 2,11" fill="none" stroke="#ffffff" strokeWidth="1.3" opacity="0.32" />
        <polygon points="11,6 16,11 11,16 6,11" fill="#ffffff" opacity="0.2" />
      </pattern>

      {/* 5. Khmer: Vân sen cách điệu Nam Bộ */}
      <pattern id="hoa-van-khmer" width="24" height="24" patternUnits="userSpaceOnUse">
        <path d="M 4 20 C 6 12 10 8 12 4 C 14 8 18 12 20 20 Z" fill="none" stroke="#ffffff" strokeWidth="1.2" opacity="0.3" />
      </pattern>

      {/* 6. Kinh Bắc (kb): Họa tiết hoa cúc & vân mây Đồng Sơn */}
      <pattern id="hoa-van-kb" width="24" height="24" patternUnits="userSpaceOnUse">
        <circle cx="12" cy="12" r="5" fill="none" stroke="#ffffff" strokeWidth="1.2" opacity="0.3" />
        <path d="M 12 2 Q 18 6 18 12 Q 18 18 12 22 Q 6 18 6 12 Q 6 6 12 2" fill="none" stroke="#ffffff" strokeWidth="0.8" opacity="0.25" />
      </pattern>

      {/* 7. Kinh Huế (kh): Vân mây cung đình & chữ thọ */}
      <pattern id="hoa-van-kh" width="26" height="26" patternUnits="userSpaceOnUse">
        <path d="M 6 14 Q 10 8 16 10 Q 22 12 20 18 Q 14 22 8 18" fill="none" stroke="#ffffff" strokeWidth="1.2" opacity="0.3" />
      </pattern>

      {/* 8. Kinh Nam Bộ (kn): Kẻ ô vuông rằn */}
      <pattern id="hoa-van-kn" width="16" height="16" patternUnits="userSpaceOnUse">
        <rect x="0" y="0" width="8" height="8" fill="#ffffff" opacity="0.25" />
        <rect x="8" y="8" width="8" height="8" fill="#ffffff" opacity="0.25" />
      </pattern>
    </defs>
  );
}
