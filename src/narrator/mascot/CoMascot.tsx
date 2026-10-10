/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * CoMascot — LINH VẬT CÒ EM (RENDER 3D ĐẲNG CẤP NHƯ ẢNH)
 * Vẽ lại theo phong cách render 3D chân thực, sắc nét và mỹ miều:
 * - Ánh sáng thể tích (Volumetric 3D Shading) mềm mại, đổ bóng tự nhiên
 * - Lông vũ trắng mượt mà với nhiều tầng lớp, điểm ánh bình minh ấm áp
 * - Cánh vẫy chào nồng nhiệt với lớp lông cánh chính xanh Navy thẫm bóng bẩy
 * - Mỏ vàng hổ phách cong dài thanh tú, có vệt phản quang bóng loáng sắc nét
 * - Đôi mắt to tròn long lanh có chiều sâu tròng mắt, đốm sáng kép sống động
 * - Đôi chân thon dài vàng cam vươn vững chãi, khớp gối và móng vuốt tinh xảo
 * - Nón lá mini hoặc khăn rằn truyền thống dệt tinh tế
 */

import React, { useId } from "react";
import { DomMood, DomHat } from "../types";

export interface CoMascotProps {
  size?: number;
  mood?: DomMood | "vui" | "cuoi" | "nghi" | "ngu" | "chao";
  hat?: DomHat | "none" | "non_la" | "tham_tu";
  wave?: boolean; // Vẫy cánh chào
  animate?: boolean; // Nhịp thở & chuyển động mềm mại
  isNight?: boolean;
  glow?: number;
  className?: string;
  title?: string;
}

export default function CoMascot({
  size = 140,
  hat = "non_la",
  wave = true,
  animate = true,
  isNight = false,
  className = "",
  title = "Cò Em — Linh vật dẫn chuyện",
}: CoMascotProps) {
  const uid = useId().replace(/:/g, "");
  const id = (n: string) => `${n}-${uid}`;

  return (
    <svg
      viewBox="0 0 400 400"
      width={size}
      height={size}
      role="img"
      aria-label={title}
      className={`co-mascot ${animate ? "co-mascot--anim" : ""} ${className}`}
      style={{ overflow: "visible", display: "inline-block", flex: "none" }}
    >
      <title>{title}</title>
      <defs>
        {/* BỘ LỌC ĐỔ BÓNG VÀ ÁNH SÁNG MỀM */}
        <filter id={id("softShadow")} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id={id("groundBlur")} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <filter id={id("glowFilter")} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="5" result="glow" />
          <feComposite in="SourceGraphic" in2="glow" operator="over" />
        </filter>

        {/* 1. GRADIENT THÂN MÌNH: TRẮNG SÁNG ÁNH BÌNH MINH (3D SPHERICAL SHADING) */}
        <radialGradient id={id("bodyGrad")} cx="38%" cy="32%" r="65%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="45%" stopColor="#F8FAFC" />
          <stop offset="78%" stopColor="#E2E8F0" />
          <stop offset="100%" stopColor="#CBD5E1" />
        </radialGradient>

        {/* 2. GRADIENT BỤNG DƯỚI: HẮT SÁNG NẮNG MAI ẤM ÁP */}
        <linearGradient id={id("bellyGrad")} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="60%" stopColor="#F1F5F9" />
          <stop offset="100%" stopColor="#E2E8F0" />
        </linearGradient>

        {/* 3. GRADIENT CỔ: HÌNH TRỤ 3D KHỐI UỐN LƯỢN S-CURVE */}
        <linearGradient id={id("neckGrad")} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="40%" stopColor="#F8FAFC" />
          <stop offset="85%" stopColor="#E2E8F0" />
          <stop offset="100%" stopColor="#CBD5E1" />
        </linearGradient>

        {/* 4. GRADIENT MỎ VÀNG ÓNG BÓNG BẨY (3D GLOSSY KERATIN BEAK) */}
        <linearGradient id={id("beakGrad")} x1="0%" y1="0%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="22%" stopColor="#FBBF24" />
          <stop offset="65%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>

        <linearGradient id={id("beakLowerGrad")} x1="0%" y1="0%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#FCD34D" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>

        {/* 5. GRADIENT LÔNG CÁNH XANH NAVY THẪM SANG TRỌNG (DEEP INDIGO-NAVY FLIGHTS) */}
        <linearGradient id={id("navyFlightGrad")} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E3A8A" />
          <stop offset="35%" stopColor="#0F172A" />
          <stop offset="80%" stopColor="#0A1120" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>

        <linearGradient id={id("navyWingCovert")} x1="0%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="40%" stopColor="#1E293B" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>

        {/* 6. GRADIENT ĐÔI CHÂN DÀI VÀNG CAM HỔ PHÁCH */}
        <linearGradient id={id("legGrad")} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="40%" stopColor="#F59E0B" />
          <stop offset="85%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>

        {/* 7. NÓN LÁ TRUYỀN THỐNG VIỆT NAM (NÓN LÁ NẮNG VÀNG) */}
        <linearGradient id={id("nonLaGrad")} x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#FEF9C3" />
          <stop offset="30%" stopColor="#FDE047" />
          <stop offset="75%" stopColor="#CA8A04" />
          <stop offset="100%" stopColor="#A16207" />
        </linearGradient>

        {/* 8. KHĂN RẰN CARO NAM BỘ NẾU CẦN */}
        <pattern id={id("khanRanPattern")} width="12" height="12" patternUnits="userSpaceOnUse">
          <rect width="6" height="6" fill="#1E293B" />
          <rect x="6" width="6" height="6" fill="#F8FAFC" />
          <rect y="6" width="6" height="6" fill="#F8FAFC" />
          <rect x="6" y="6" width="6" height="6" fill="#1E293B" />
        </pattern>

        <style>{`
          .co-mascot--anim .co-body-breathe {
            animation: coRenderBreathe 4.5s cubic-bezier(0.4, 0, 0.2, 1) infinite alternate;
            transform-origin: 235px 235px;
          }
          .co-mascot--anim .co-wing-wave {
            animation: coRenderWave 2.4s cubic-bezier(0.4, 0, 0.2, 1) infinite alternate;
            transform-origin: 186px 150px;
          }
          .co-mascot--anim .co-head-bob {
            animation: coRenderHead 3.8s ease-in-out infinite alternate;
            transform-origin: 235px 135px;
          }
          .co-mascot--anim .co-tail-wag {
            animation: coRenderTail 2.8s ease-in-out infinite alternate;
            transform-origin: 285px 230px;
          }
          @keyframes coRenderBreathe {
            0% { transform: scale(1) translateY(0); }
            100% { transform: scale(1.025, 1.015) translateY(-3px); }
          }
          @keyframes coRenderWave {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(-3.5deg); }
          }
          @keyframes coRenderHead {
            0% { transform: rotate(0deg) translateY(0); }
            100% { transform: rotate(1.8deg) translateY(-2px); }
          }
          @keyframes coRenderTail {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(2.5deg) translateY(-1px); }
          }
          @media (prefers-reduced-motion: reduce) {
            .co-mascot * { animation: none !important; }
          }
        `}</style>
      </defs>

      {/* ================================================================= */}
      {/* 0. ĐỔ BÓNG TIẾP XÚC TRÊN MẶT ĐẤT (REALISTIC GROUND DROP SHADOW)     */}
      {/* ================================================================= */}
      <g opacity="0.32">
        <ellipse cx="235" cy="376" rx="98" ry="14" fill="#0F172A" filter={`url(#${id("groundBlur")})`} />
        <ellipse cx="232" cy="375" rx="55" ry="7" fill="#020617" opacity="0.5" />
      </g>

      {/* ================================================================= */}
      {/* 1. LÔNG ĐUÔI PHÍA SAU (NAVY TAIL FEATHERS WITH 3D DEPTH)           */}
      {/* ================================================================= */}
      <g className="co-tail-wag">
        {/* Lông đuôi dưới cùng */}
        <path
          d="M 280 230 Q 330 255, 365 282 Q 338 288, 305 272 Q 288 255, 280 230 Z"
          fill={`url(#${id("navyFlightGrad")})`}
          filter={`url(#${id("softShadow")})`}
        />
        <path d="M 285 240 Q 325 262, 355 278" stroke="#38BDF8" strokeWidth="1" opacity="0.35" fill="none" />

        {/* Lông đuôi thứ 2 */}
        <path
          d="M 285 220 Q 340 240, 375 264 Q 345 272, 310 255 Q 295 240, 285 220 Z"
          fill={`url(#${id("navyFlightGrad")})`}
        />
        <path d="M 290 228 Q 335 248, 365 260" stroke="#38BDF8" strokeWidth="1.2" opacity="0.4" fill="none" />

        {/* Lông đuôi thứ 3 */}
        <path
          d="M 288 210 Q 345 225, 378 245 Q 350 255, 312 240 Q 298 225, 288 210 Z"
          fill={`url(#${id("navyFlightGrad")})`}
        />
        {/* Lớp lông viền trắng trên đuôi */}
        <path
          d="M 275 205 Q 315 220, 335 238 Q 308 242, 280 228 Z"
          fill="#FFFFFF"
          opacity="0.85"
        />
      </g>

      {/* ================================================================= */}
      {/* 2. ĐÔI CHÂN DÀI VÀNG CAM HỔ PHÁCH (SLENDER 3D STORK LEGS)          */}
      {/* ================================================================= */}
      <g>
        {/* CHÂN PHẢI (BÊN TRONG / HƠI LÙI VỀ SAU) */}
        <g opacity="0.88">
          {/* Cẳng chân phải */}
          <path d="M 268 258 L 285 310 L 298 365" stroke={`url(#${id("legGrad")})`} strokeWidth="5.5" strokeLinecap="round" fill="none" />
          {/* Vệt phản quang mặt trước cẳng chân */}
          <path d="M 269 260 L 284 310 L 297 364" stroke="#FEF08A" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.75" />
          {/* Khớp gối chân phải */}
          <ellipse cx="285" cy="310" rx="4.8" ry="4.2" fill="#D97706" />
          <ellipse cx="284.5" cy="309" rx="2.5" ry="2" fill="#FEF08A" />
          {/* Bàn chân phải 3 ngón xòe tự nhiên trên mặt đất */}
          <path d="M 298 365 Q 280 368, 258 370 Q 252 373, 260 376 Q 278 375, 296 369 Z" fill="#D97706" />
          <path d="M 298 365 Q 284 376, 266 384 Q 262 388, 272 389 Q 288 384, 300 372 Z" fill="#F59E0B" />
          <path d="M 298 365 Q 312 376, 326 385 Q 334 386, 336 380 Q 324 374, 302 366 Z" fill="#D97706" />
          {/* Cựa sau */}
          <path d="M 298 365 Q 315 368, 330 372 Q 335 370, 328 366 Q 314 364, 298 365 Z" fill="#B45309" />
        </g>

        {/* CHÂN TRÁI (BÊN NGOÀI / ĐỨNG THẲNG ĐẦY UY NGHI) */}
        <g>
          {/* Cẳng chân trái đứng thẳng */}
          <path d="M 232 262 L 230 310 L 226 362" stroke={`url(#${id("legGrad")})`} strokeWidth="6.5" strokeLinecap="round" fill="none" />
          {/* Vệt phản quang 3D sáng rực dọc cẳng chân */}
          <path d="M 231 264 L 229 310 L 225 360" stroke="#FFFFFF" strokeWidth="2.0" strokeLinecap="round" fill="none" opacity="0.9" />
          {/* Khớp gối chân trái tròn trịa */}
          <ellipse cx="230" cy="310" rx="5.5" ry="4.8" fill="#F59E0B" />
          <ellipse cx="229" cy="308.5" rx="3" ry="2.2" fill="#FFFFFF" />
          <circle cx="231" cy="311" r="1.5" fill="#B45309" />

          {/* Bàn chân trái 3 ngón xòe vững chãi */}
          {/* Ngón trong */}
          <path d="M 226 362 Q 206 366, 182 368 Q 174 371, 184 374 Q 205 373, 222 366 Z" fill="#D97706" />
          <path d="M 224 363 Q 205 366, 185 368" stroke="#FEF08A" strokeWidth="1.2" fill="none" />
          {/* Ngón giữa vươn dài */}
          <path d="M 226 362 Q 204 376, 178 386 Q 172 390, 182 392 Q 204 386, 226 368 Z" fill="#F59E0B" />
          <path d="M 224 363 Q 204 376, 184 384" stroke="#FFFFFF" strokeWidth="1.6" fill="none" />
          {/* Móng vuốt ngón giữa */}
          <path d="M 178 386 Q 170 388, 168 392 Q 174 393, 182 390 Z" fill="#78350F" />
          {/* Ngón ngoài */}
          <path d="M 226 362 Q 235 376, 245 388 Q 252 391, 252 384 Q 244 374, 230 364 Z" fill="#D97706" />
          {/* Cựa sau */}
          <path d="M 226 362 Q 238 368, 255 374 Q 260 371, 252 366 Q 238 363, 226 362 Z" fill="#B45309" />
        </g>
      </g>

      {/* ================================================================= */}
      {/* 3. THÂN BỤNG TRẮNG 3D (3D SCULPTED VOLUMETRIC TORSO)               */}
      {/* ================================================================= */}
      <g className="co-body-breathe">
        {/* Đổ bóng phía sau thân mình */}
        <path
          d="M 178 152 Q 164 196, 182 242 Q 202 276, 238 274 Q 252 280, 268 272 Q 284 252, 282 218 Q 278 172, 250 135 Z"
          fill="#CBD5E1"
          opacity="0.6"
        />

        {/* Khối thân chính với chất liệu lông tơ trắng sứ bóng mịn */}
        <path
          d="M 180 150 Q 166 192, 184 238 Q 202 272, 238 270 Q 252 276, 266 268 Q 282 248, 280 216 Q 276 170, 248 132 Z"
          fill={`url(#${id("bodyGrad")})`}
          filter={`url(#${id("softShadow")})`}
        />

        {/* Khối ngực căng tròn trắng sáng lấp lánh */}
        <path
          d="M 180 150 Q 170 185, 185 220 Q 205 250, 235 250 Q 215 220, 205 180 Q 200 155, 180 150 Z"
          fill="#FFFFFF"
          opacity="0.85"
        />

        {/* Nếp lông tơ mềm mại quanh ức và bụng */}
        <path d="M 195 210 Q 185 235, 205 242" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7" />
        <path d="M 215 230 Q 208 252, 228 258" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7" />
        <path d="M 235 245 Q 232 265, 250 266" stroke="#CBD5E1" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.6" />

        {/* Vệt ánh sáng ven (Rim light) ấm áp ở viền ngoài thân */}
        <path
          d="M 180 150 Q 166 192, 184 238 Q 192 255, 205 265"
          stroke="#FFFFFF"
          strokeWidth="3.2"
          strokeLinecap="round"
          fill="none"
          opacity="0.95"
        />

        {/* =============================================================== */}
        {/* CÁNH PHẢI GẬP BÊN HÔNG (3D FOLDED FLANK WING)                    */}
        {/* =============================================================== */}
        {/* Lớp lông cánh sơ cấp Navy thẫm bên dưới cánh gập */}
        <g>
          <path
            d="M 252 210 Q 282 228, 320 252 Q 324 245, 315 235 Q 288 218, 262 202 Z"
            fill={`url(#${id("navyFlightGrad")})`}
          />
          <path d="M 260 208 L 315 244" stroke="#38BDF8" strokeWidth="1.2" opacity="0.4" fill="none" />

          <path
            d="M 262 202 Q 295 220, 330 242 Q 334 235, 324 224 Q 298 206, 270 192 Z"
            fill={`url(#${id("navyFlightGrad")})`}
          />
          <path d="M 270 198 L 324 232" stroke="#38BDF8" strokeWidth="1.2" opacity="0.4" fill="none" />

          <path
            d="M 270 192 Q 302 206, 335 226 Q 338 218, 326 208 Q 302 190, 278 180 Z"
            fill={`url(#${id("navyFlightGrad")})`}
          />
        </g>

        {/* Khối cánh gập màu trắng sứ xếp tầng mềm mại */}
        <path
          d="M 226 130 Q 210 168, 215 200 Q 222 220, 240 218 Q 252 226, 268 216 Q 280 222, 294 208 Q 306 192, 302 165 Q 294 135, 258 125 Z"
          fill={`url(#${id("bodyGrad")})`}
          filter={`url(#${id("softShadow")})`}
        />
        {/* Nếp uốn điêu khắc khối 3D trên cánh gập */}
        <path
          d="M 228 178 Q 250 196, 278 188"
          stroke="#CBD5E1"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 230 176 Q 250 194, 278 186"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 252 162 Q 272 178, 296 168"
          stroke="#CBD5E1"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 254 160 Q 272 176, 296 166"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* =============================================================== */}
        {/* 4. CÁNH TRÁI VẪY CHÀO LIỀN KHỐI VỚI THÂN & DÍNH LIỀN LÔNG ĐEN  */}
        {/* =============================================================== */}
        {/* Khối cơ bả vai & nách kết nối liền lạc tuyệt đối vào thân */}
        <path
          d="M 180 148 Q 164 186, 178 226 Q 198 214, 216 192 Q 224 165, 218 144 Z"
          fill={`url(#${id("bodyGrad")})`}
        />

        <g className="co-wing-wave">
          {/* 4A. LỚP LÔNG CÁNH BAY MÀU ĐEN NAVY ÁNH XANH LIỀN KHỐI (DÍNH TRỰC TIẾP VÀO CÁNH TRẮNG) */}
          {/* Mảng lông bay đặc, liền lạc, không tách rời, ăn sâu vào thân và cánh trắng */}
          <path
            d="
              M 225 142
              L 160 146
              L 76 154
              L 28 168
              Q 18 178, 16 186 Q 18 192, 34 192
              Q 24 202, 24 210 Q 28 216, 50 212
              Q 40 224, 44 232 Q 52 236, 74 228
              Q 66 242, 74 250 Q 86 252, 106 240
              Q 102 254, 114 260 Q 128 258, 144 244
              Q 144 256, 158 258 Q 172 252, 184 238
              Q 186 246, 198 246 Q 210 238, 218 222
              L 225 210
              Z
            "
            fill={`url(#${id("navyFlightGrad")})`}
          />

          {/* Sống lông bay óng ánh màu thiên thanh (Feather shafts radiating naturally) */}
          <path d="M 85 168 Q 45 178, 20 186" stroke="#38BDF8" strokeWidth="1.4" opacity="0.65" fill="none" />
          <path d="M 100 178 Q 55 196, 30 210" stroke="#38BDF8" strokeWidth="1.4" opacity="0.65" fill="none" />
          <path d="M 118 188 Q 75 214, 50 230" stroke="#38BDF8" strokeWidth="1.3" opacity="0.6" fill="none" />
          <path d="M 136 196 Q 100 226, 80 246" stroke="#38BDF8" strokeWidth="1.2" opacity="0.55" fill="none" />
          <path d="M 154 202 Q 128 234, 118 254" stroke="#38BDF8" strokeWidth="1.2" opacity="0.5" fill="none" />
          <path d="M 172 208 Q 155 236, 160 254" stroke="#38BDF8" strokeWidth="1.1" opacity="0.45" fill="none" />
          <path d="M 190 212 Q 182 232, 200 242" stroke="#38BDF8" strokeWidth="1.0" opacity="0.4" fill="none" />

          {/* 4B. PHẦN CÁNH TRẮNG SỨ DÍNH LIỀN TRỰC TIẾP LÊN LỚP LÔNG ĐEN & NỐI THẲNG VÀO THÂN */}
          <path
            d="
              M 225 142
              Q 186 146, 140 144
              Q 90 146, 50 156
              Q 28 164, 28 168
              Q 42 178, 62 178
              Q 82 188, 106 188
              Q 126 198, 150 198
              Q 170 206, 192 206
              Q 214 212, 225 208
              Z
            "
            fill={`url(#${id("bodyGrad")})`}
          />

          {/* Nếp lông bao cánh trắng sứ tầng 2 mềm mại */}
          <path
            d="M 52 162 Q 86 172, 126 174 Q 166 176, 206 180"
            stroke="#FFFFFF"
            strokeWidth="3.2"
            strokeLinecap="round"
            fill="none"
            opacity="0.95"
          />
          <path
            d="M 72 170 Q 112 180, 154 182 Q 186 184, 218 186"
            stroke="#E2E8F0"
            strokeWidth="2.0"
            strokeLinecap="round"
            fill="none"
            opacity="0.85"
          />

          {/* Vệt phản quang bờ trước cánh nối mượt mà từ ức ra chóp cánh */}
          <path
            d="M 186 146 Q 130 144, 48 158"
            stroke="#FFFFFF"
            strokeWidth="3.6"
            strokeLinecap="round"
            fill="none"
            opacity="0.95"
          />
        </g>
      </g>

      {/* ================================================================= */}
      {/* 5. CỔ, ĐẦU, MẮT VÀ MỎ (3D REALISTIC SCULPTED HEAD, EYES & BEAK)   */}
      {/* ================================================================= */}
      <g className="co-head-bob">
        {/* CỔ TRẮNG UỐN LƯỢN HÌNH CHỮ S THANH THOÁT */}
        <path
          d="M 186 156 Q 198 128, 216 98 L 240 90 Q 252 114, 260 142 L 224 142 Q 204 146, 186 156 Z"
          fill={`url(#${id("neckGrad")})`}
          filter={`url(#${id("softShadow")})`}
        />
        {/* Vệt sáng rực trên bờ cong cổ chữ S */}
        <path
          d="M 188 154 Q 198 128, 218 96"
          stroke="#FFFFFF"
          strokeWidth="3.6"
          strokeLinecap="round"
          fill="none"
          opacity="0.95"
        />

        {/* ĐẦU TRẮNG TRÒN TRỊA & CHỎM LÔNG GÁY BỒNG BỀNH */}
        {/* Chỏm lông gáy 1 */}
        <path d="M 252 38 Q 275 36, 282 46 Q 268 52, 256 50 Z" fill="#FFFFFF" />
        {/* Chỏm lông gáy 2 */}
        <path d="M 256 50 Q 282 52, 285 64 Q 266 68, 252 64 Z" fill="#F1F5F9" />
        {/* Chỏm lông gáy 3 */}
        <path d="M 250 64 Q 275 70, 276 80 Q 258 82, 246 76 Z" fill="#E2E8F0" />

        {/* Khối đầu chính */}
        <path
          d="M 200 62 Q 208 26, 242 24 Q 260 24, 266 36 Q 274 38, 272 52 Q 268 66, 262 72 Q 258 90, 240 102 Q 216 110, 200 90 Z"
          fill={`url(#${id("bodyGrad")})`}
          filter={`url(#${id("softShadow")})`}
        />
        {/* Vầng sáng vòm sọ */}
        <ellipse cx="236" cy="46" rx="24" ry="16" fill="#FFFFFF" opacity="0.6" />

        {/* =============================================================== */}
        {/* MỎ VÀNG CONG DÀI BÓNG BẨY (3D GLOSSY GOLDEN BEAK)                 */}
        {/* =============================================================== */}
        {/* Khoang miệng đỏ thẫm khi há to cười tươi */}
        <path
          d="M 208 72 Q 174 84, 146 112 Q 178 114, 230 84 Q 220 76, 208 72 Z"
          fill="#4C0519"
        />
        {/* Lưỡi hồng xinh xắn căng mọng uốn cong */}
        <path
          d="M 186 106 Q 200 90, 214 88 Q 222 95, 208 102 Q 194 108, 186 106 Z"
          fill="#F43F5E"
        />
        <ellipse cx="204" cy="94" rx="4" ry="2.5" fill="#FDA4AF" />

        {/* MỎ TRÊN MÀU VÀNG HỔ PHÁCH UỐN CONG DUYÊN DÁNG */}
        <path
          d="M 204 64 Q 168 72, 144 110 Q 166 98, 214 74 Q 208 68, 204 64 Z"
          fill={`url(#${id("beakGrad")})`}
          filter={`url(#${id("softShadow")})`}
        />
        {/* VỆT PHẢN QUANG BÓNG SÁNG (GLOSSY SPECULAR HIGHLIGHT) TRÊN SỐNG MỎ */}
        <path
          d="M 202 66 Q 172 74, 148 106"
          stroke="#FFFFFF"
          strokeWidth="2.8"
          strokeLinecap="round"
          fill="none"
          opacity="0.95"
        />
        <path
          d="M 198 67 Q 174 74, 155 98"
          stroke="#FEF08A"
          strokeWidth="1.2"
          strokeLinecap="round"
          fill="none"
        />
        {/* Lỗ mũi nhỏ thanh tú */}
        <ellipse cx="198" cy="71" rx="2.5" ry="1.2" fill="#78350F" transform="rotate(-12 198 71)" />

        {/* MỎ DƯỚI CƯỜI RẠNG RỠ */}
        <path
          d="M 166 114 Q 196 112, 234 84 Q 226 94, 218 100 Q 196 112, 166 114 Z"
          fill={`url(#${id("beakLowerGrad")})`}
        />
        <path
          d="M 172 113 Q 196 111, 226 89"
          stroke="#FEF08A"
          strokeWidth="1.4"
          fill="none"
          opacity="0.8"
        />

        {/* Khóe cười ngọt ngào duyên dáng */}
        <path
          d="M 228 78 Q 236 82, 240 90"
          stroke="#B45309"
          strokeWidth="2.8"
          strokeLinecap="round"
          fill="none"
        />

        {/* =============================================================== */}
        {/* ĐÔI MẮT LONG LANH CÓ HỒN (LIFELIKE SPARKLING EYES WITH DEPTH)     */}
        {/* =============================================================== */}
        {/* MẮT TRÁI (BÊN NGOÀI) */}
        <g>
          {/* Hốc mắt & mí mắt trên mềm mại */}
          <path d="M 194 40 Q 206 35, 218 42" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" fill="none" />
          
          {/* Lòng trắng mắt */}
          <ellipse cx="208" cy="54" rx="10" ry="15" fill="#FFFFFF" filter={`url(#${id("softShadow")})`} transform="rotate(-6 208 54)" />
          
          {/* Vòng tròng đen màu hạt dẻ hổ phách sâu thẳm */}
          <ellipse cx="207" cy="52" rx="7.2" ry="10" fill="#0F172A" />
          <ellipse cx="206.5" cy="52" rx="6.5" ry="9" fill="#1E293B" />
          {/* Vòng mống mắt màu mật ong óng ánh */}
          <path d="M 203 56 Q 207 60, 211 56" stroke="#D97706" strokeWidth="1.4" fill="none" opacity="0.8" />
          
          {/* ĐỐM SÁNG KÉP CỰC KỲ LONG LANH (DUAL SPECULAR CATCHLIGHTS) */}
          <circle cx="204.5" cy="46" r="3.2" fill="#FFFFFF" />
          <circle cx="209" cy="56" r="1.6" fill="#FFFFFF" opacity="0.85" />
          <circle cx="204" cy="54" r="0.9" fill="#FEF08A" />

          {/* Lông mày hớn hở cong vút */}
          <path d="M 196 36 Q 208 30, 222 36" stroke="#0F172A" strokeWidth="3.2" strokeLinecap="round" fill="none" />
          <path d="M 198 35 Q 208 30, 220 35" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.7" />
        </g>

        {/* MẮT PHẢI (BÊN TRONG) */}
        <g>
          <ellipse cx="236" cy="52" rx="9.5" ry="14" fill="#FFFFFF" filter={`url(#${id("softShadow")})`} transform="rotate(4 236 52)" />
          <ellipse cx="234.5" cy="50" rx="6.8" ry="9.5" fill="#0F172A" />
          <ellipse cx="234" cy="50" rx="6" ry="8.5" fill="#1E293B" />
          <path d="M 230 54 Q 234 58, 238 54" stroke="#D97706" strokeWidth="1.4" fill="none" opacity="0.8" />
          
          {/* Đốm sáng mắt phải */}
          <circle cx="232" cy="45" r="3.0" fill="#FFFFFF" />
          <circle cx="236.5" cy="54" r="1.5" fill="#FFFFFF" opacity="0.85" />

          {/* Lông mày mắt phải */}
          <path d="M 226 33 Q 238 28, 248 34" stroke="#0F172A" strokeWidth="3.2" strokeLinecap="round" fill="none" />
        </g>

        {/* =============================================================== */}
        {/* NÓN LÁ TRUYỀN THỐNG VIỆT NAM (ĐỘI CHÍNH DIỆN NGAY NGẮN ĐỐI XỨNG) */}
        {/* =============================================================== */}
        {hat === "non_la" && (
          <g transform="translate(198, 2)">
            {/* Vệt bóng đổ dưới vành nón lá lên trán */}
            <ellipse cx="35" cy="34" rx="30" ry="4" fill="#0F172A" opacity="0.16" />

            {/* Chóp nón và vành nón lá 3D chính diện đối xứng (không dùng quai để gương mặt cò thanh thoát, rõ nét) */}
            <path
              d="M 35 2 L 68 33 Q 35 41, 2 33 Z"
              fill={`url(#${id("nonLaGrad")})`}
              filter={`url(#${id("softShadow")})`}
            />
            {/* Các vòng nan nón lá tinh tế đối xứng chính diện */}
            <ellipse cx="35" cy="33" rx="33" ry="6.5" fill="none" stroke="#CA8A04" strokeWidth="0.9" />
            <ellipse cx="35" cy="27" rx="26" ry="5.2" fill="none" stroke="#EAB308" strokeWidth="0.8" />
            <ellipse cx="35" cy="21" rx="19" ry="4.0" fill="none" stroke="#FEF08A" strokeWidth="0.8" />
            <ellipse cx="35" cy="15" rx="13" ry="2.8" fill="none" stroke="#FEF08A" strokeWidth="0.8" />
            <ellipse cx="35" cy="9" rx="7" ry="1.6" fill="none" stroke="#FEF08A" strokeWidth="0.8" />

            {/* Vệt nắng óng ả trên sống chóp nón chính diện */}
            <path d="M 35 3 L 35 36" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" opacity="0.8" />
            {/* Chóp nón lá màu đồng */}
            <circle cx="35" cy="2.5" r="2.2" fill="#CA8A04" />
          </g>
        )}
      </g>
    </svg>
  );
}

