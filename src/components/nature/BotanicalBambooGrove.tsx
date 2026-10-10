/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * BotanicalBambooGrove — KHÓM TRE THƯ PHÁP BOTANICAL (NHIỀU CÂY, CAO VỪA PHẢI, RẬM LÁ)
 * - Tăng thêm thân tre (9 thân tre đan xen từ thân già sừng sững đến măng non thanh tú)
 * - Chiều cao thanh thoát, đốt tre bo tròn và ngấn khớp đốt sắc nét chuẩn hình mẫu
 * - Nhiều chùm lá hình mũi mác sum sê xếp tầng 4 sắc độ xanh tự nhiên
 */

import React from "react";

interface BotanicalBambooProps {
  className?: string;
  isNight?: boolean;
  flipped?: boolean;
}

export default function BotanicalBambooGrove({
  className = "",
  isNight = false,
  flipped = false,
}: BotanicalBambooProps) {
  // Bảng màu botanical chuẩn từ hình mẫu
  const c = isNight
    ? {
        darkLeaf: "#13331C",
        midDarkLeaf: "#1B4727",
        mainGreen: "#266035",
        lightLeaf: "#3D824E",
        paleSage: "#5BA86E",
        nodeRing: "#0D2413",
        stalkMain: "#22562F",
        stalkLight: "#2C6B3A",
        stalkDark: "#173E21",
        stalkPale: "#3B824E",
      }
    : {
        darkLeaf: "#1A3822",       // Xanh thẫm tiền cảnh
        midDarkLeaf: "#274F2F",    // Xanh rêu đậm lớp giữa
        mainGreen: "#3C6E44",      // Xanh tre chủ đạo
        lightLeaf: "#588C5E",      // Xanh mạ non đón nắng
        paleSage: "#84B28B",       // Xanh sage nhạt (chùm lá non dưới gốc)
        nodeRing: "#142B1A",       // Vòng khớp đốt tre đậm nét
        stalkMain: "#4A7C52",      // Thân tre chính
        stalkLight: "#5C9064",     // Thân tre sáng màu
        stalkDark: "#315A37",      // Thân tre tối phía sau
        stalkPale: "#72A37B",      // Thân tre non phía trước
      };

  return (
    <svg
      viewBox="0 0 400 930"
      className={`w-full h-full overflow-visible ${flipped ? "scale-x-[-1]" : ""} ${className}`}
      preserveAspectRatio="xMinYMax meet"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id={`bamboo-depth-${flipped ? "r" : "l"}`} x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="1.2" floodColor="#0A180E" floodOpacity="0.16" />
        </filter>
      </defs>

      {/* ========================================================================= */}
      {/* 1. THÂN TRE (13 THÂN TRE & BÚP MĂNG ĐAN CÀI: NHIỀU CÂY HƠN, CAO THÊM 1 XÍU)*/}
      {/* ========================================================================= */}
      <g id="bamboo-culms">
        {/* --- CÂY 10 MỚI: THÂN VÚT CAO PHÍA SAU TRUNG TÂM (CAO THÊM 1 XÍU, VƯƠN TẬN ĐỈNH) --- */}
        <g id="culm-10-tall-center-rear">
          <path d="M 188 930 L 187 810 L 195 810 L 197 930 Z" fill={c.stalkDark} opacity="0.85" />
          <path d="M 186 810 Q 191 807, 196 810" stroke={c.nodeRing} strokeWidth="1.8" strokeLinecap="round" />

          <path d="M 187 808 L 185 680 L 193 680 L 195 808 Z" fill={c.stalkDark} opacity="0.85" />
          <path d="M 184 680 Q 189 677, 194 680" stroke={c.nodeRing} strokeWidth="1.6" strokeLinecap="round" />

          <path d="M 185 678 L 181 550 L 188 550 L 193 678 Z" fill={c.stalkDark} opacity="0.85" />
          <path d="M 180 550 Q 185 547, 189 550" stroke={c.nodeRing} strokeWidth="1.5" strokeLinecap="round" />

          <path d="M 181 548 L 176 410 L 183 410 L 188 548 Z" fill={c.stalkDark} opacity="0.85" />
          <path d="M 175 410 Q 180 407, 184 410" stroke={c.nodeRing} strokeWidth="1.4" strokeLinecap="round" />

          <path d="M 176 408 L 170 270 L 176 270 L 183 408 Z" fill={c.stalkDark} opacity="0.85" />
          <path d="M 169 270 Q 173 267, 177 270" stroke={c.nodeRing} strokeWidth="1.3" strokeLinecap="round" />

          <path d="M 170 268 L 162 140 L 167 140 L 176 268 Z" fill={c.stalkDark} opacity="0.85" />
          <path d="M 161 140 Q 165 137, 168 140" stroke={c.nodeRing} strokeWidth="1.2" strokeLinecap="round" />

          <path d="M 162 138 L 154 20 L 158 20 L 167 138 Z" fill={c.stalkDark} opacity="0.85" />
        </g>

        {/* --- CÂY 1: THÂN C BÊN TRÁI NGOÀI (SẪM MÀU, VƯƠN CAO THÊM) --- */}
        <g id="culm-1">
          <path d="M 142 930 L 138 820 L 149 820 L 154 930 Z" fill={c.stalkDark} />
          <path d="M 137 820 Q 144 817, 150 820" stroke={c.nodeRing} strokeWidth="2.6" strokeLinecap="round" />

          <path d="M 138 818 L 128 700 L 138 700 L 149 818 Z" fill={c.stalkDark} />
          <path d="M 127 700 Q 133 697, 139 700" stroke={c.nodeRing} strokeWidth="2.4" strokeLinecap="round" />

          <path d="M 128 698 L 115 570 L 125 570 L 138 698 Z" fill={c.stalkDark} />
          <path d="M 114 570 Q 120 567, 126 570" stroke={c.nodeRing} strokeWidth="2.2" strokeLinecap="round" />

          <path d="M 115 568 L 98 440 L 107 440 L 125 568 Z" fill={c.stalkDark} />
          <path d="M 97 440 Q 102 437, 108 440" stroke={c.nodeRing} strokeWidth="2.0" strokeLinecap="round" />

          <path d="M 98 438 L 80 310 L 88 310 L 107 438 Z" fill={c.stalkDark} />
          <path d="M 79 310 Q 84 307, 89 310" stroke={c.nodeRing} strokeWidth="1.8" strokeLinecap="round" />

          <path d="M 80 308 L 62 180 L 69 180 L 88 308 Z" fill={c.stalkDark} />
          <path d="M 61 180 Q 65 178, 70 180" stroke={c.nodeRing} strokeWidth="1.6" strokeLinecap="round" />
          
          <path d="M 62 178 L 46 45 L 52 45 L 69 178 Z" fill={c.stalkDark} />
          <path d="M 45 45 Q 49 43, 53 45" stroke={c.nodeRing} strokeWidth="1.4" strokeLinecap="round" />
          <path d="M 46 43 L 38 18 L 42 18 L 52 43 Z" fill={c.stalkDark} />
        </g>

        {/* --- CÂY 11 MỚI: THÂN BÁNH TẺ BÊN TRÁI TIỀN CẢNH (TĂNG ĐỘ DÀY CÂY NỬA TRÁI) --- */}
        <g id="culm-11-left-sub">
          <path d="M 125 930 L 122 830 L 129 830 L 133 930 Z" fill={c.stalkPale} opacity="0.9" />
          <path d="M 121 830 Q 125 828, 130 830" stroke={c.nodeRing} strokeWidth="1.8" strokeLinecap="round" />

          <path d="M 122 828 L 115 720 L 121 720 L 129 828 Z" fill={c.stalkPale} opacity="0.9" />
          <path d="M 114 720 Q 118 718, 122 720" stroke={c.nodeRing} strokeWidth="1.6" strokeLinecap="round" />

          <path d="M 115 718 L 105 600 L 110 600 L 121 718 Z" fill={c.stalkPale} opacity="0.9" />
          <path d="M 104 600 Q 107 598, 111 600" stroke={c.nodeRing} strokeWidth="1.5" strokeLinecap="round" />

          <path d="M 105 598 L 94 480 L 98 480 L 110 598 Z" fill={c.stalkPale} opacity="0.9" />
        </g>

        {/* --- CÂY 2: THÂN F (THÂN PHỤ BÊN TRÁI PHÍA SAU) --- */}
        <g id="culm-2-extra-left">
          <path d="M 160 930 L 157 830 L 164 830 L 167 930 Z" fill={c.stalkDark} opacity="0.85" />
          <path d="M 156 830 Q 160 828, 165 830" stroke={c.nodeRing} strokeWidth="1.8" strokeLinecap="round" />

          <path d="M 157 828 L 150 710 L 156 710 L 164 828 Z" fill={c.stalkDark} opacity="0.85" />
          <path d="M 149 710 Q 153 708, 157 710" stroke={c.nodeRing} strokeWidth="1.6" strokeLinecap="round" />

          <path d="M 150 708 L 140 580 L 146 580 L 156 708 Z" fill={c.stalkDark} opacity="0.85" />
          <path d="M 139 580 Q 143 578, 147 580" stroke={c.nodeRing} strokeWidth="1.5" strokeLinecap="round" />

          <path d="M 140 578 L 126 450 L 131 450 L 146 578 Z" fill={c.stalkDark} opacity="0.85" />
          <path d="M 125 450 Q 128 448, 132 450" stroke={c.nodeRing} strokeWidth="1.4" strokeLinecap="round" />

          <path d="M 126 448 L 110 320 L 114 320 L 131 448 Z" fill={c.stalkDark} opacity="0.85" />
          <path d="M 109 320 Q 112 318, 115 320" stroke={c.nodeRing} strokeWidth="1.3" strokeLinecap="round" />

          <path d="M 110 318 L 96 190 L 100 190 L 114 318 Z" fill={c.stalkDark} opacity="0.85" />
        </g>

        {/* --- CÂY 13 MỚI: BÚP MĂNG NON CHÂN GỐC TRUNG TÂM (NÉT ĐẶC TRƯNG LÀNG QUÊ) --- */}
        <g id="culm-13-young-bamboo-shoot">
          <path d="M 166 930 L 168 850 L 174 850 L 174 930 Z" fill={c.paleSage} opacity="0.95" />
          <path d="M 167 850 Q 171 848, 175 850" stroke={c.nodeRing} strokeWidth="1.8" strokeLinecap="round" />

          <path d="M 168 848 L 171 770 L 176 770 L 174 848 Z" fill={c.paleSage} opacity="0.95" />
          <path d="M 170 770 Q 173 768, 177 770" stroke={c.nodeRing} strokeWidth="1.6" strokeLinecap="round" />

          <path d="M 171 768 L 174 700 L 177 700 L 176 768 Z" fill={c.paleSage} opacity="0.95" />
        </g>

        {/* --- CÂY 3: THÂN CHÍNH A (TRUNG TÂM, TO KHỎE, SỰNG SỮNG, CAO THÊM 1 XÍU) --- */}
        <g id="culm-3-main-center">
          <path d="M 178 930 L 176 810 L 191 810 L 194 930 Z" fill={c.stalkMain} />
          <path d="M 175 810 Q 183 806, 192 810" stroke={c.nodeRing} strokeWidth="3.4" strokeLinecap="round" />

          <path d="M 176 807 L 173 680 L 187 680 L 191 807 Z" fill={c.stalkMain} />
          <path d="M 172 680 Q 180 676, 188 680" stroke={c.nodeRing} strokeWidth="3.2" strokeLinecap="round" />

          <path d="M 173 677 L 168 550 L 181 550 L 187 677 Z" fill={c.stalkMain} />
          <path d="M 167 550 Q 174 546, 182 550" stroke={c.nodeRing} strokeWidth="2.8" strokeLinecap="round" />

          <path d="M 168 547 L 162 420 L 174 420 L 181 547 Z" fill={c.stalkMain} />
          <path d="M 161 420 Q 168 416, 175 420" stroke={c.nodeRing} strokeWidth="2.6" strokeLinecap="round" />

          <path d="M 162 417 L 154 290 L 164 290 L 174 417 Z" fill={c.stalkMain} />
          <path d="M 153 290 Q 159 287, 165 290" stroke={c.nodeRing} strokeWidth="2.3" strokeLinecap="round" />

          <path d="M 154 287 L 144 170 L 153 170 L 164 287 Z" fill={c.stalkMain} />
          <path d="M 143 170 Q 148 167, 154 170" stroke={c.nodeRing} strokeWidth="2.0" strokeLinecap="round" />

          <path d="M 144 168 L 134 50 L 141 50 L 153 168 Z" fill={c.stalkMain} />
          <path d="M 133 50 Q 137 48, 142 50" stroke={c.nodeRing} strokeWidth="1.8" strokeLinecap="round" />
          <path d="M 134 48 L 126 18 L 132 18 L 141 48 Z" fill={c.stalkMain} />
        </g>

        {/* --- CÂY 4: THÂN MĂNG NON TIỀN CẢNH (MÀU PALE SAGE) --- */}
        <g id="culm-4-front-shoot">
          <path d="M 194 930 L 195 835 L 202 835 L 202 930 Z" fill={c.stalkPale} opacity="0.95" />
          <path d="M 194 835 Q 198 833, 203 835" stroke={c.nodeRing} strokeWidth="1.8" strokeLinecap="round" />

          <path d="M 195 833 L 198 735 L 204 735 L 202 833 Z" fill={c.stalkPale} opacity="0.95" />
          <path d="M 197 735 Q 201 733, 205 735" stroke={c.nodeRing} strokeWidth="1.6" strokeLinecap="round" />

          <path d="M 198 733 L 203 630 L 208 630 L 204 733 Z" fill={c.stalkPale} opacity="0.95" />
          <path d="M 202 630 Q 205 628, 209 630" stroke={c.nodeRing} strokeWidth="1.5" strokeLinecap="round" />
        </g>

        {/* --- CÂY 5: THÂN G (THÂN THON THẲNG GIỮA A VÀ B) --- */}
        <g id="culm-5-extra-mid">
          <path d="M 208 930 L 210 820 L 216 820 L 215 930 Z" fill={c.stalkLight} opacity="0.9" />
          <path d="M 209 820 Q 213 818, 217 820" stroke={c.nodeRing} strokeWidth="1.8" strokeLinecap="round" />

          <path d="M 210 818 L 214 700 L 220 700 L 216 818 Z" fill={c.stalkLight} opacity="0.9" />
          <path d="M 213 700 Q 217 698, 221 700" stroke={c.nodeRing} strokeWidth="1.6" strokeLinecap="round" />

          <path d="M 214 698 L 221 570 L 226 570 L 220 698 Z" fill={c.stalkLight} opacity="0.9" />
          <path d="M 220 570 Q 223 568, 227 570" stroke={c.nodeRing} strokeWidth="1.5" strokeLinecap="round" />

          <path d="M 221 568 L 230 450 L 234 450 L 226 568 Z" fill={c.stalkLight} opacity="0.9" />
          <path d="M 229 450 Q 232 448, 235 450" stroke={c.nodeRing} strokeWidth="1.4" strokeLinecap="round" />

          <path d="M 230 448 L 238 330 L 242 330 L 234 448 Z" fill={c.stalkLight} opacity="0.9" />
        </g>

        {/* --- CÂY 6: THÂN B BÊN PHẢI (SÁNG MÀU, TƯƠI TẮN, CAO THÊM 1 XÍU) --- */}
        <g id="culm-6-main-right">
          <path d="M 220 930 L 222 800 L 234 800 L 235 930 Z" fill={c.stalkLight} />
          <path d="M 221 800 Q 228 797, 235 800" stroke={c.nodeRing} strokeWidth="2.8" strokeLinecap="round" />

          <path d="M 222 797 L 226 660 L 237 660 L 234 797 Z" fill={c.stalkLight} />
          <path d="M 225 660 Q 231 657, 238 660" stroke={c.nodeRing} strokeWidth="2.6" strokeLinecap="round" />

          <path d="M 226 657 L 232 520 L 242 520 L 237 657 Z" fill={c.stalkLight} />
          <path d="M 231 520 Q 237 517, 243 520" stroke={c.nodeRing} strokeWidth="2.4" strokeLinecap="round" />

          <path d="M 232 517 L 242 390 L 251 390 L 242 517 Z" fill={c.stalkLight} />
          <path d="M 241 390 Q 246 387, 252 390" stroke={c.nodeRing} strokeWidth="2.2" strokeLinecap="round" />

          <path d="M 242 387 L 255 260 L 263 260 L 251 387 Z" fill={c.stalkLight} />
          <path d="M 254 260 Q 259 257, 264 260" stroke={c.nodeRing} strokeWidth="2.0" strokeLinecap="round" />

          <path d="M 255 257 L 268 140 L 275 140 L 263 257 Z" fill={c.stalkLight} />
          <path d="M 267 140 Q 271 138, 276 140" stroke={c.nodeRing} strokeWidth="1.8" strokeLinecap="round" />

          <path d="M 268 138 L 280 40 L 286 40 L 275 138 Z" fill={c.stalkLight} />
          <path d="M 279 40 Q 283 38, 287 40" stroke={c.nodeRing} strokeWidth="1.6" strokeLinecap="round" />
          <path d="M 280 38 L 288 12 L 293 12 L 286 38 Z" fill={c.stalkLight} />
        </g>

        {/* --- CÂY 7: THÂN H (THÂN PHỤ PHÍA SAU BÊN PHẢI) --- */}
        <g id="culm-7-extra-right">
          <path d="M 242 930 L 245 830 L 251 830 L 248 930 Z" fill={c.stalkDark} opacity="0.85" />
          <path d="M 244 830 Q 248 828, 252 830" stroke={c.nodeRing} strokeWidth="1.8" strokeLinecap="round" />

          <path d="M 245 828 L 250 710 L 256 710 L 251 828 Z" fill={c.stalkDark} opacity="0.85" />
          <path d="M 249 710 Q 253 708, 257 710" stroke={c.nodeRing} strokeWidth="1.6" strokeLinecap="round" />

          <path d="M 250 708 L 258 580 L 263 580 L 256 708 Z" fill={c.stalkDark} opacity="0.85" />
          <path d="M 257 580 Q 260 578, 264 580" stroke={c.nodeRing} strokeWidth="1.5" strokeLinecap="round" />

          <path d="M 258 578 L 270 450 L 274 450 L 263 578 Z" fill={c.stalkDark} opacity="0.85" />
          <path d="M 269 450 Q 272 448, 275 450" stroke={c.nodeRing} strokeWidth="1.4" strokeLinecap="round" />

          <path d="M 270 448 L 280 320 L 284 320 L 274 448 Z" fill={c.stalkDark} opacity="0.85" />
        </g>

        {/* --- CÂY 12 MỚI: THÂN THON MỀM BÊN PHẢI (TĂNG ĐỘ DÀY CÂY NỬA PHẢI) --- */}
        <g id="culm-12-right-mid-sub">
          <path d="M 250 930 L 254 835 L 260 835 L 256 930 Z" fill={c.stalkPale} opacity="0.9" />
          <path d="M 253 835 Q 257 833, 261 835" stroke={c.nodeRing} strokeWidth="1.7" strokeLinecap="round" />

          <path d="M 254 833 L 260 725 L 265 725 L 260 833 Z" fill={c.stalkPale} opacity="0.9" />
          <path d="M 259 725 Q 263 723, 266 725" stroke={c.nodeRing} strokeWidth="1.5" strokeLinecap="round" />

          <path d="M 260 723 L 269 610 L 273 610 L 265 723 Z" fill={c.stalkPale} opacity="0.9" />
          <path d="M 268 610 Q 271 608, 274 610" stroke={c.nodeRing} strokeWidth="1.4" strokeLinecap="round" />

          <path d="M 269 608 L 281 480 L 285 480 L 273 608 Z" fill={c.stalkPale} opacity="0.9" />
          <path d="M 280 480 Q 283 478, 286 480" stroke={c.nodeRing} strokeWidth="1.3" strokeLinecap="round" />

          <path d="M 281 478 L 292 350 L 295 350 L 285 478 Z" fill={c.stalkPale} opacity="0.9" />
        </g>

        {/* --- CÂY 8: THÂN D PHÍA SAU NGOÀI CÙNG (THANH MẢNH, SẪM MÀU) --- */}
        <g id="culm-8-rear-thin">
          <path d="M 258 930 L 262 825 L 267 825 L 264 930 Z" fill={c.stalkDark} />
          <path d="M 261 825 Q 264 823, 268 825" stroke={c.nodeRing} strokeWidth="1.8" strokeLinecap="round" />

          <path d="M 262 823 L 268 705 L 273 705 L 267 823 Z" fill={c.stalkDark} />
          <path d="M 267 705 Q 270 703, 274 705" stroke={c.nodeRing} strokeWidth="1.6" strokeLinecap="round" />

          <path d="M 268 703 L 278 575 L 282 575 L 273 703 Z" fill={c.stalkDark} />
          <path d="M 277 575 Q 280 573, 283 575" stroke={c.nodeRing} strokeWidth="1.5" strokeLinecap="round" />

          <path d="M 278 573 L 290 445 L 294 445 L 282 573 Z" fill={c.stalkDark} />
          <path d="M 289 445 Q 292 443, 295 445" stroke={c.nodeRing} strokeWidth="1.4" strokeLinecap="round" />

          <path d="M 290 443 L 302 315 L 305 315 L 294 443 Z" fill={c.stalkDark} />
        </g>

        {/* --- CÂY 9: THÂN I (CHỒI MĂNG BÊN PHẢI TIỀN CẢNH) --- */}
        <g id="culm-9-extra-sprout-right">
          <path d="M 275 930 L 277 840 L 282 840 L 280 930 Z" fill={c.stalkPale} opacity="0.9" />
          <path d="M 276 840 Q 279 838, 283 840" stroke={c.nodeRing} strokeWidth="1.6" strokeLinecap="round" />

          <path d="M 277 838 L 281 745 L 286 745 L 282 838 Z" fill={c.stalkPale} opacity="0.9" />
          <path d="M 280 745 Q 283 743, 287 745" stroke={c.nodeRing} strokeWidth="1.5" strokeLinecap="round" />

          <path d="M 281 743 L 287 645 L 291 645 L 286 743 Z" fill={c.stalkPale} opacity="0.9" />
        </g>
      </g>

      {/* ========================================================================= */}
      {/* 2. CÀNH NHÁNH TRE THANH MẢNH ĐAN XEN                                      */}
      {/* ========================================================================= */}
      <g id="bamboo-twigs" stroke={c.midDarkLeaf} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
        {/* Nhánh trái tầng thấp */}
        <path d="M 133 700 Q 106 675, 80 682" />
        <path d="M 106 675 Q 90 655, 68 650" />
        <path d="M 115 720 Q 95 700, 75 708" />

        {/* Nhánh trái tầng trung */}
        <path d="M 120 570 Q 86 545, 54 560" />
        <path d="M 86 545 Q 70 520, 44 530" />
        <path d="M 105 600 Q 82 575, 60 585" />
        <path d="M 98 480 Q 75 450, 48 460" />

        {/* Nhánh trái tầng cao */}
        <path d="M 102 440 Q 72 405, 38 428" />
        <path d="M 72 405 Q 56 375, 26 388" />
        <path d="M 62 178 Q 38 150, 16 160" />

        {/* Nhánh giữa đan xen & thân cao vút */}
        <path d="M 174 550 Q 146 520, 124 528" />
        <path d="M 181 550 Q 204 525, 230 530" />
        <path d="M 168 420 Q 135 388, 108 398" />
        <path d="M 174 420 Q 200 388, 225 395" />
        <path d="M 181 548 Q 160 515, 142 522" />
        <path d="M 176 410 Q 155 375, 136 382" />

        {/* Nhánh đỉnh ngọn cao vút */}
        <path d="M 159 290 Q 128 255, 98 268" />
        <path d="M 164 290 Q 192 255, 220 262" />
        <path d="M 148 170 Q 118 135, 92 145" />
        <path d="M 153 170 Q 182 132, 210 140" />
        <path d="M 162 140 Q 142 105, 122 112" />
        <path d="M 167 140 Q 190 105, 215 110" />

        {/* Nhánh phải tầng trung & cao */}
        <path d="M 237 520 Q 270 488, 302 502" />
        <path d="M 270 488 Q 292 460, 318 472" />
        <path d="M 269 608 Q 298 580, 328 592" />
        <path d="M 281 480 Q 312 450, 342 462" />
        <path d="M 246 390 Q 284 352, 322 368" />
        <path d="M 284 352 Q 308 318, 340 334" />
        <path d="M 259 260 Q 298 220, 338 236" />
        <path d="M 298 220 Q 324 180, 355 195" />

        {/* Nhánh ngang vươn ra bên phải (gọn gàng, thanh nhã) */}
        <path d="M 174 420 Q 235 435, 318 416 L 348 400" strokeWidth="1.6" />
      </g>

      {/* ========================================================================= */}
      {/* 3. LÁ TRE DÀY ĐẶC & SUM SÊ (NHIỀU LÁ, XẾP LỚP ĐA TẦNG NGHỆ THUẬT)          */}
      {/* ========================================================================= */}
      <g id="bamboo-leaves" filter={`url(#bamboo-depth-${flipped ? "r" : "l"})`}>
        {/* --- 3.1 CHÙM LÁ ĐỈNH NGỌN (VƯƠN CAO THÊM 1 XÍU, XANH MƯỚT) --- */}
        <g id="top-leaves">
          {/* Đỉnh thân vút cao Culm 10 (x: 156, y: 20) */}
          <g id="top-culm-10">
            <path d="M 156 20 Q 154 -8, 157 -28 Q 160 -8, 158 20 Z" fill={c.darkLeaf} />
            <path d="M 156 20 Q 134 5, 112 8 Q 136 16, 158 20 Z" fill={c.midDarkLeaf} />
            <path d="M 156 20 Q 142 -10, 125 -20 Q 143 2, 158 20 Z" fill={c.mainGreen} />
            <path d="M 156 20 Q 172 -12, 192 -18 Q 175 4, 158 20 Z" fill={c.lightLeaf} />
            <path d="M 156 20 Q 178 5, 200 10 Q 176 17, 158 20 Z" fill={c.darkLeaf} />
          </g>

          {/* Đỉnh thân chính A (x: 129, y: 18) */}
          <g id="top-culm-3">
            <path d="M 129 18 Q 127 -6, 130 -26 Q 133 -6, 131 18 Z" fill={c.darkLeaf} />
            <path d="M 129 18 Q 107 3, 85 6 Q 109 14, 131 18 Z" fill={c.midDarkLeaf} />
            <path d="M 129 18 Q 115 -12, 96 -22 Q 116 0, 131 18 Z" fill={c.mainGreen} />
            <path d="M 129 18 Q 146 -14, 166 -20 Q 149 2, 131 18 Z" fill={c.lightLeaf} />
            <path d="M 129 18 Q 151 3, 175 8 Q 149 15, 131 18 Z" fill={c.darkLeaf} />
            <path d="M 129 18 Q 139 26, 155 36 Q 137 28, 131 18 Z" fill={c.mainGreen} />
          </g>

          {/* Đỉnh thân phải B (x: 290, y: 12) */}
          <g id="top-culm-6">
            <path d="M 290 12 Q 287 -14, 289 -34 Q 293 -14, 292 12 Z" fill={c.midDarkLeaf} />
            <path d="M 290 12 Q 269 -2, 247 0 Q 271 8, 292 12 Z" fill={c.darkLeaf} />
            <path d="M 290 12 Q 309 -6, 329 -10 Q 311 7, 292 12 Z" fill={c.mainGreen} />
            <path d="M 290 12 Q 315 10, 337 17 Q 312 22, 292 12 Z" fill={c.lightLeaf} />
            <path d="M 290 12 Q 302 27, 317 38 Q 299 30, 292 12 Z" fill={c.midDarkLeaf} />
          </g>

          {/* Đỉnh thân trái C (x: 40, y: 18) */}
          <g id="top-culm-1">
            <path d="M 40 18 Q 19 5, -1 7 Q 21 15, 42 18 Z" fill={c.darkLeaf} />
            <path d="M 40 18 Q 27 -9, 11 -19 Q 31 -1, 42 18 Z" fill={c.midDarkLeaf} />
            <path d="M 40 18 Q 45 -9, 49 -31 Q 53 -9, 42 18 Z" fill={c.mainGreen} />
            <path d="M 40 18 Q 61 1, 77 -5 Q 63 13, 42 18 Z" fill={c.lightLeaf} />
            <path d="M 40 18 Q 64 17, 85 21 Q 63 25, 42 18 Z" fill={c.darkLeaf} />
          </g>
        </g>

        {/* --- 3.2 TẦNG LÁ CAO --- */}
        {/* Chùm lá x: 92, y: 145 */}
        <g id="cluster-high-left">
          <path d="M 92 145 Q 70 128, 48 132 Q 72 142, 94 145 Z" fill={c.darkLeaf} />
          <path d="M 92 145 Q 76 114, 58 102 Q 80 124, 94 145 Z" fill={c.midDarkLeaf} />
          <path d="M 92 145 Q 96 110, 100 86 Q 105 112, 94 145 Z" fill={c.mainGreen} />
          <path d="M 92 145 Q 112 118, 128 108 Q 114 132, 94 145 Z" fill={c.lightLeaf} />
          <path d="M 92 145 Q 118 136, 140 140 Q 116 148, 94 145 Z" fill={c.darkLeaf} />
          <path d="M 92 145 Q 102 164, 115 178 Q 100 164, 94 145 Z" fill={c.mainGreen} />
        </g>

        {/* Chùm lá mới tầng cao thân 10 & 2 (x: 122, y: 112) */}
        <g id="cluster-high-culm-10-sub">
          <path d="M 122 112 Q 100 96, 78 100 Q 102 109, 124 112 Z" fill={c.midDarkLeaf} />
          <path d="M 122 112 Q 108 84, 92 72 Q 110 94, 124 112 Z" fill={c.lightLeaf} />
          <path d="M 122 112 Q 142 90, 158 80 Q 144 102, 124 112 Z" fill={c.mainGreen} />
          <path d="M 122 112 Q 146 110, 168 114 Q 144 120, 124 112 Z" fill={c.darkLeaf} />
        </g>

        {/* Chùm lá x: 210, y: 140 */}
        <g id="cluster-high-center-right">
          <path d="M 210 140 Q 188 126, 166 130 Q 190 138, 212 140 Z" fill={c.darkLeaf} />
          <path d="M 210 140 Q 196 114, 180 102 Q 198 122, 212 140 Z" fill={c.midDarkLeaf} />
          <path d="M 210 140 Q 215 108, 220 86 Q 225 110, 212 140 Z" fill={c.mainGreen} />
          <path d="M 210 140 Q 232 120, 248 110 Q 234 132, 212 140 Z" fill={c.lightLeaf} />
          <path d="M 210 140 Q 235 138, 258 142 Q 234 148, 212 140 Z" fill={c.darkLeaf} />
        </g>

        {/* Chùm lá x: 324, y: 180 */}
        <g id="cluster-high-right">
          <path d="M 324 180 Q 302 166, 280 170 Q 304 178, 326 180 Z" fill={c.midDarkLeaf} />
          <path d="M 324 180 Q 310 152, 294 140 Q 312 162, 326 180 Z" fill={c.lightLeaf} />
          <path d="M 324 180 Q 328 148, 332 126 Q 338 152, 326 180 Z" fill={c.mainGreen} />
          <path d="M 324 180 Q 346 160, 362 150 Q 348 172, 326 180 Z" fill={c.darkLeaf} />
          <path d="M 324 180 Q 348 176, 372 182 Q 348 188, 326 180 Z" fill={c.lightLeaf} />
        </g>

        {/* --- 3.3 TẦNG LÁ TRUNG (RẬM RẠP & SUM SÊ) --- */}
        {/* Chùm lá x: 26, y: 388 */}
        <g id="cluster-mid-left-compact">
          <path d="M 26 388 Q 5 375, -15 380 Q 8 388, 28 388 Z" fill={c.darkLeaf} />
          <path d="M 26 388 Q 12 362, -4 350 Q 14 372, 28 388 Z" fill={c.midDarkLeaf} />
          <path d="M 26 388 Q 30 356, 34 330 Q 38 356, 28 388 Z" fill={c.mainGreen} />
          <path d="M 26 388 Q 45 366, 64 355 Q 48 376, 28 388 Z" fill={c.lightLeaf} />
          <path d="M 26 388 Q 48 386, 70 390 Q 46 394, 28 388 Z" fill={c.darkLeaf} />
        </g>

        {/* Chùm lá x: 58, y: 375 */}
        <g id="cluster-mid-left-inner">
          <path d="M 58 375 Q 38 360, 18 365 Q 40 374, 60 375 Z" fill={c.midDarkLeaf} />
          <path d="M 58 375 Q 45 348, 30 336 Q 48 358, 60 375 Z" fill={c.darkLeaf} />
          <path d="M 58 375 Q 76 352, 94 342 Q 78 364, 60 375 Z" fill={c.lightLeaf} />
          <path d="M 58 375 Q 80 372, 102 376 Q 78 380, 60 375 Z" fill={c.mainGreen} />
        </g>

        {/* Chùm lá x: 108, y: 398 (trung tâm) */}
        <g id="cluster-mid-center-1">
          <path d="M 108 398 Q 86 384, 64 388 Q 88 396, 110 398 Z" fill={c.mainGreen} />
          <path d="M 108 398 Q 94 370, 78 358 Q 96 380, 110 398 Z" fill={c.darkLeaf} />
          <path d="M 108 398 Q 128 378, 146 368 Q 130 390, 110 398 Z" fill={c.lightLeaf} />
          <path d="M 108 398 Q 132 395, 155 400 Q 130 406, 110 398 Z" fill={c.midDarkLeaf} />
          <path d="M 108 398 Q 118 416, 130 432 Q 116 418, 110 398 Z" fill={c.darkLeaf} />
        </g>

        {/* Chùm lá x: 225, y: 395 */}
        <g id="cluster-mid-center-2">
          <path d="M 225 395 Q 204 380, 182 385 Q 206 394, 227 395 Z" fill={c.midDarkLeaf} />
          <path d="M 225 395 Q 212 368, 196 355 Q 214 376, 227 395 Z" fill={c.darkLeaf} />
          <path d="M 225 395 Q 244 375, 264 366 Q 248 386, 227 395 Z" fill={c.lightLeaf} />
          <path d="M 225 395 Q 248 392, 272 398 Q 246 402, 227 395 Z" fill={c.mainGreen} />
        </g>

        {/* Chùm lá x: 308, y: 318 */}
        <g id="cluster-mid-right-1">
          <path d="M 308 318 Q 286 304, 264 308 Q 288 316, 310 318 Z" fill={c.darkLeaf} />
          <path d="M 308 318 Q 294 292, 278 280 Q 296 302, 310 318 Z" fill={c.midDarkLeaf} />
          <path d="M 308 318 Q 328 300, 346 290 Q 330 310, 310 318 Z" fill={c.lightLeaf} />
          <path d="M 308 318 Q 332 316, 354 320 Q 330 326, 310 318 Z" fill={c.mainGreen} />
        </g>

        {/* Chùm lá x: 322, y: 368 */}
        <g id="cluster-mid-right-2">
          <path d="M 322 368 Q 300 354, 278 358 Q 302 366, 324 368 Z" fill={c.midDarkLeaf} />
          <path d="M 322 368 Q 308 342, 292 330 Q 310 352, 324 368 Z" fill={c.darkLeaf} />
          <path d="M 322 368 Q 342 348, 362 338 Q 345 360, 324 368 Z" fill={c.lightLeaf} />
          <path d="M 322 368 Q 346 365, 368 370 Q 344 376, 324 368 Z" fill={c.mainGreen} />
        </g>

        {/* Chùm lá x: 348, y: 400 (nhánh ngang) */}
        <g id="cluster-mid-right-spray">
          <path d="M 348 400 Q 368 386, 388 378 Q 370 398, 350 400 Z" fill={c.darkLeaf} />
          <path d="M 348 400 Q 372 398, 395 402 Q 370 408, 350 400 Z" fill={c.mainGreen} />
          <path d="M 348 400 Q 365 414, 380 425 Q 362 414, 350 400 Z" fill={c.lightLeaf} />
        </g>

        {/* --- 3.4 TẦNG LÁ THẤP & CHÙM LÁ XANH SAGE SƯƠNG MAI --- */}
        {/* Chùm lá x: 44, y: 530 */}
        <g id="cluster-low-left">
          <path d="M 44 530 Q 24 516, 2 520 Q 26 530, 46 530 Z" fill={c.darkLeaf} />
          <path d="M 44 530 Q 30 504, 14 492 Q 34 514, 46 530 Z" fill={c.midDarkLeaf} />
          <path d="M 44 530 Q 50 500, 54 476 Q 58 502, 46 530 Z" fill={c.mainGreen} />
          <path d="M 44 530 Q 64 512, 82 504 Q 66 524, 46 530 Z" fill={c.lightLeaf} />
          <path d="M 44 530 Q 68 528, 90 532 Q 66 536, 46 530 Z" fill={c.darkLeaf} />
        </g>

        {/* Chùm lá x: 124, y: 528 */}
        <g id="cluster-low-center">
          <path d="M 124 528 Q 102 514, 80 518 Q 104 528, 126 528 Z" fill={c.midDarkLeaf} />
          <path d="M 124 528 Q 110 502, 94 490 Q 112 512, 126 528 Z" fill={c.darkLeaf} />
          <path d="M 124 528 Q 142 510, 160 502 Q 145 522, 126 528 Z" fill={c.lightLeaf} />
          <path d="M 124 528 Q 148 526, 170 530 Q 146 536, 126 528 Z" fill={c.mainGreen} />
        </g>

        {/* Chùm lá non xanh sage sương mai dưới gốc (x: 80, y: 682 & x: 68, y: 650) */}
        <g id="cluster-pale-sage-sprout">
          <path d="M 80 682 Q 58 670, 34 674 Q 59 682, 82 682 Z" fill={c.paleSage} />
          <path d="M 80 682 Q 66 656, 50 645 Q 69 666, 82 682 Z" fill={c.lightLeaf} />
          <path d="M 80 682 Q 85 652, 89 628 Q 94 656, 82 682 Z" fill={c.paleSage} />
          <path d="M 80 682 Q 102 665, 120 656 Q 104 675, 82 682 Z" fill={c.lightLeaf} />
          <path d="M 80 682 Q 104 680, 128 684 Q 102 690, 82 682 Z" fill={c.paleSage} />

          <path d="M 68 650 Q 48 638, 26 642 Q 50 650, 70 650 Z" fill={c.paleSage} />
          <path d="M 68 650 Q 56 626, 40 615 Q 58 635, 70 650 Z" fill={c.lightLeaf} />
          <path d="M 68 650 Q 86 634, 102 626 Q 88 645, 70 650 Z" fill={c.paleSage} />
        </g>

        {/* Chùm lá non mới trên búp măng và thân mới (x: 174, y: 700) */}
        <g id="cluster-young-shoot-foliage">
          <path d="M 174 700 Q 155 685, 135 690 Q 157 700, 176 700 Z" fill={c.paleSage} />
          <path d="M 174 700 Q 164 675, 150 662 Q 166 685, 176 700 Z" fill={c.lightLeaf} />
          <path d="M 174 700 Q 178 670, 182 645 Q 186 672, 176 700 Z" fill={c.paleSage} />
          <path d="M 174 700 Q 192 682, 210 674 Q 194 695, 176 700 Z" fill={c.lightLeaf} />
        </g>

        {/* Chùm lá thân bánh tẻ bên trái (x: 48, y: 460) */}
        <g id="cluster-mid-left-culm11">
          <path d="M 48 460 Q 28 445, 8 450 Q 30 460, 50 460 Z" fill={c.midDarkLeaf} />
          <path d="M 48 460 Q 36 432, 20 420 Q 38 444, 50 460 Z" fill={c.darkLeaf} />
          <path d="M 48 460 Q 66 438, 84 430 Q 68 452, 50 460 Z" fill={c.lightLeaf} />
          <path d="M 48 460 Q 70 456, 92 462 Q 68 466, 50 460 Z" fill={c.mainGreen} />
        </g>

        {/* Chùm lá thân mới bên phải (x: 342, y: 462 & x: 328, y: 592) */}
        <g id="cluster-mid-right-culm12">
          <path d="M 342 462 Q 320 448, 298 452 Q 322 460, 344 462 Z" fill={c.midDarkLeaf} />
          <path d="M 342 462 Q 328 436, 312 425 Q 330 446, 344 462 Z" fill={c.darkLeaf} />
          <path d="M 342 462 Q 362 442, 382 432 Q 365 454, 344 462 Z" fill={c.lightLeaf} />
          <path d="M 342 462 Q 366 458, 390 464 Q 364 470, 344 462 Z" fill={c.mainGreen} />

          <path d="M 328 592 Q 308 578, 286 582 Q 310 590, 330 592 Z" fill={c.darkLeaf} />
          <path d="M 328 592 Q 346 574, 366 565 Q 350 585, 330 592 Z" fill={c.lightLeaf} />
          <path d="M 328 592 Q 350 590, 372 595 Q 348 600, 330 592 Z" fill={c.mainGreen} />
        </g>

        {/* Chùm lá nhỏ dưới gốc bên phải (x: 250, y: 710) */}
        <g id="cluster-base-right">
          <path d="M 250 710 Q 268 696, 286 690 Q 272 710, 252 710 Z" fill={c.darkLeaf} />
          <path d="M 250 710 Q 270 708, 290 712 Q 268 718, 252 710 Z" fill={c.midDarkLeaf} />
          <path d="M 250 710 Q 264 726, 274 738 Q 260 726, 252 710 Z" fill={c.mainGreen} />

          <path d="M 248 830 Q 266 818, 284 812 Q 270 828, 250 830 Z" fill={c.darkLeaf} />
          <path d="M 248 830 Q 268 828, 288 832 Q 268 838, 250 830 Z" fill={c.midDarkLeaf} />
        </g>
      </g>
    </svg>
  );
}
