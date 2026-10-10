/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * ÁO DÀI TRUYỀN THỐNG VIỆT NAM (AODAI GARMENT RENDERER)
 * Tái hiện chuẩn mực di sản trang phục áo dài truyền thống Việt Nam:
 * - Dáng tay raglan ôm trọn đường cong giải phẫu cánh tay, không hở nách hay cổ tay
 * - Tà áo ôm ngực, thắt eo mềm mại và xòe phủ trọn vẹn hông (không để lộ sườn/hông hở)
 * - Quần lụa ống suông phủ mềm từ eo qua hông xuống gấu chân, để lộ ống quần trắng thanh lịch tại xẻ tà
 * - Phân định chuẩn xác mặt trước (cổ đứng + cúc ngọc bấm chéo) và mặt sau (đường sống lưng thanh thoát, không cúc)
 */

import React from "react";
import { GarmentRenderProps, GarmentRenderResult, COMMON_GARMENT_STYLE } from "./types";
import { renderFootwear } from "../accessories/FootwearRenderer";

export function renderAoDaiGarment({
  soDo,
  mauHex,
  patternFill,
  hasSneaker = false,
  huongNhin = "truoc",
}: GarmentRenderProps): GarmentRenderResult {
  const isBack = huongNhin === "sau";
  const isMale = soDo.isMale;

  // Màu quần lụa truyền thống: lụa mỡ gà / lụa trắng ngọc thanh khiết
  const pantsFill = isMale ? "#1e293b" : "#fdfbf7";
  const pantsStroke = isMale ? "#0f172a" : "#e2d9cc";

  // =========================================================================
  // 1. TỌA ĐỘ VÀ ĐƯỜNG NÉT QUẦN LỤA ỐNG SUÔNG (TRADITIONAL SILK PANTS)
  // =========================================================================
  // Quần ôm vừa eo tại Y = 285, ôm trọn cung hông tại Y = 367, suông rộng xuống gấu Y = 745
  const waistHalf = isMale ? 63 : 37;
  const hipHalf = isMale ? 76 : 61;
  const ankleOuterHalf = isMale ? 60 : 52;
  const ankleInnerHalf = isMale ? 10 : 8;

  const silkPantsPath = `
    M ${200 - waistHalf} 285
    C ${200 - (waistHalf + 10)} 318, ${200 - (hipHalf - 2)} 342, ${200 - hipHalf} 367
    C ${200 - (hipHalf - 1)} 430, ${200 - (hipHalf - 3)} 510, ${200 - (hipHalf - 5)} 580
    C ${200 - (hipHalf - 6)} 640, ${200 - (ankleOuterHalf + 1)} 700, ${200 - ankleOuterHalf} 745
    L ${200 - ankleInnerHalf} 745
    Q ${200 - 4} 540, 200 410
    Q ${200 + 4} 540, ${200 + ankleInnerHalf} 745
    L ${200 + ankleOuterHalf} 745
    C ${200 + (ankleOuterHalf + 1)} 700, ${200 + (hipHalf - 6)} 640, ${200 + (hipHalf - 5)} 580
    C ${200 + (hipHalf - 3)} 510, ${200 + (hipHalf - 1)} 430, ${200 + hipHalf} 367
    C ${200 + (hipHalf - 2)} 342, ${200 + (waistHalf + 10)} 318, ${200 + waistHalf} 285
    Q 200 289, ${200 - waistHalf} 285
    Z
  `;

  const childrenVayQuan = (
    <g id="aodai-quan" className="garment-transition">
      <style>{COMMON_GARMENT_STYLE}</style>

      {/* Thân quần lụa suông mềm */}
      <path
        d={silkPantsPath}
        fill={pantsFill}
        stroke={pantsStroke}
        strokeWidth="1.2"
      />

      {/* Đường ly chỉ giữa hai ống quần tạo chiều sâu 3D */}
      <line
        x1={200 - (hipHalf * 0.5)}
        y1="375"
        x2={200 - (ankleOuterHalf * 0.55)}
        y2="745"
        stroke={pantsStroke}
        strokeWidth="0.8"
        opacity="0.65"
      />
      <line
        x1={200 + (hipHalf * 0.5)}
        y1="375"
        x2={200 + (ankleOuterHalf * 0.55)}
        y2="745"
        stroke={pantsStroke}
        strokeWidth="0.8"
        opacity="0.65"
      />

      {/* Đường nẹp lưng quần */}
      <path
        d={`M ${200 - waistHalf} 285 Q 200 289, ${200 + waistHalf} 285`}
        fill="none"
        stroke={pantsStroke}
        strokeWidth="0.9"
        opacity="0.8"
      />

      {hasSneaker && renderFootwear(soDo, ["sneaker"])}
    </g>
  );

  // =========================================================================
  // 2. TỌA ĐỘ VÀ ĐƯỜNG NÉT TAY ÁO RAGLAN ÔM KHÍT CÁNH TAY MA-NƠ-CANH
  // =========================================================================
  // Đồng bộ 100% với đường cong Bezier giải phẫu từ cổ (Y=148), mỏm cùng vai (Y=166),
  // cơ delta (Y=188), khuỷu tay (Y=262) xuống cổ tay (Y=388.3 / Y=390).
  const neckSeamX = isMale ? 19 : 14;
  const shoulderTipX = isMale ? 84 : 60;
  const shoulderTipY = isMale ? 165 : 166;
  const deltoidX = isMale ? 92 : 69;
  const elbowOutX = isMale ? 102 : 74;
  const forearmOutX = isMale ? 106 : 80;
  const wristOutX = isMale ? 97 : 88.5;
  const wristInX = isMale ? 81 : 72.5;
  const forearmInX = isMale ? 71 : 58.5;
  const elbowInX = isMale ? 64 : 46;
  const armpitInX = isMale ? 55 : 41;

  const leftSleevePath = `
    M ${200 - neckSeamX} 148
    C ${200 - (neckSeamX + 12)} 154, ${200 - (shoulderTipX - 10)} 160, ${200 - shoulderTipX} ${shoulderTipY}
    C ${200 - (deltoidX - 6)} 172, ${200 - (deltoidX - 1)} 182, ${200 - deltoidX} 188
    C ${200 - (deltoidX + 1)} 205, ${200 - (elbowOutX - 1)} 230, ${200 - elbowOutX} 262
    C ${200 - (elbowOutX + 1)} 290, ${200 - (forearmOutX - 1)} 320, ${200 - forearmOutX} 348.5
    C ${200 - (forearmOutX + 3)} 365, ${200 - (wristOutX - 2)} 382, ${200 - wristOutX} 390
    L ${200 - wristInX} 388.3
    C ${200 - (wristInX - 2)} 378, ${200 - (forearmInX + 4)} 358, ${200 - forearmInX} 348.5
    C ${200 - (forearmInX - 4)} 322, ${200 - (elbowInX + 3)} 290, ${200 - elbowInX} 262
    C ${200 - (elbowInX - 2)} 245, ${200 - (armpitInX + 2)} 230, ${200 - armpitInX} 210
    C ${200 - (armpitInX - 7)} 190, ${200 - (neckSeamX + 12)} 168, ${200 - neckSeamX} 148
    Z
  `;

  const rightSleevePath = `
    M ${200 + neckSeamX} 148
    C ${200 + (neckSeamX + 12)} 154, ${200 + (shoulderTipX - 10)} 160, ${200 + shoulderTipX} ${shoulderTipY}
    C ${200 + (deltoidX - 6)} 172, ${200 + (deltoidX - 1)} 182, ${200 + deltoidX} 188
    C ${200 + (deltoidX + 1)} 205, ${200 + (elbowOutX - 1)} 230, ${200 + elbowOutX} 262
    C ${200 + (elbowOutX + 1)} 290, ${200 + (forearmOutX - 1)} 320, ${200 + forearmOutX} 348.5
    C ${200 + (forearmOutX + 3)} 365, ${200 + (wristOutX - 2)} 382, ${200 + wristOutX} 390
    L ${200 + wristInX} 388.3
    C ${200 + (wristInX - 2)} 378, ${200 + (forearmInX + 4)} 358, ${200 + forearmInX} 348.5
    C ${200 + (forearmInX - 4)} 322, ${200 + (elbowInX + 3)} 290, ${200 + elbowInX} 262
    C ${200 + (elbowInX - 2)} 245, ${200 + (armpitInX + 2)} 230, ${200 + armpitInX} 210
    C ${200 + (armpitInX - 7)} 190, ${200 + (neckSeamX + 12)} 168, ${200 + neckSeamX} 148
    Z
  `;

  // =========================================================================
  // 3. TỌA ĐỘ VÀ ĐƯỜNG NÉT THÂN & TÀ ÁO DÀI (FRONT & BACK TUNIC FLAPS)
  // =========================================================================
  // Vạt áo ôm khít ngực, eo thắt chuẩn tại Y = 285.
  // Từ eo xẻ tà mở rộng mượt mà phủ trọn vẹn bề rộng hông, không bao giờ làm hông bị lộ trồi ra ngoài.
  const chestHalf = isMale ? 66 : 48.0;
  const waistTunicHalf = isMale ? 63 : 37.0;
  const hipTunicHalf = isMale ? 77 : 62.0;
  const kneeTunicHalf = isMale ? 75 : 64.5;
  const hemTunicHalf = isMale ? 73 : 67.0;

  // Tà trước (Front Flap)
  const frontTunicPath = `
    M ${200 - neckSeamX} 148
    C ${200 - (neckSeamX + 14)} 158, ${200 - (chestHalf + 2)} 185, ${200 - chestHalf} 210
    C ${200 - (chestHalf - 2)} 235, ${200 - (waistTunicHalf + 4)} 260, ${200 - waistTunicHalf} 285
    C ${200 - (waistTunicHalf + 3)} 312, ${200 - (hipTunicHalf - 10)} 338, ${200 - hipTunicHalf} 367
    C ${200 - (hipTunicHalf + 1)} 430, ${200 - (kneeTunicHalf - 1)} 500, ${200 - kneeTunicHalf} 570
    C ${200 - (kneeTunicHalf + 1)} 630, ${200 - (hemTunicHalf - 1)} 680, ${200 - hemTunicHalf} 725
    Q 200 730, ${200 + hemTunicHalf} 725
    C ${200 + (hemTunicHalf - 1)} 680, ${200 + (kneeTunicHalf + 1)} 630, ${200 + kneeTunicHalf} 570
    C ${200 + (kneeTunicHalf - 1)} 500, ${200 + (hipTunicHalf + 1)} 430, ${200 + hipTunicHalf} 367
    C ${200 + (hipTunicHalf - 10)} 338, ${200 + (waistTunicHalf + 3)} 312, ${200 + waistTunicHalf} 285
    C ${200 + (waistTunicHalf + 4)} 260, ${200 + (chestHalf - 2)} 235, ${200 + chestHalf} 210
    C ${200 + (chestHalf + 2)} 185, ${200 + (neckSeamX + 14)} 158, ${200 + neckSeamX} 148
    Z
  `;

  // Tà sau (Back Flap - Rộng hơn tà trước 1px tạo độ sâu)
  const backTunicPath = `
    M ${200 - neckSeamX} 148
    C ${200 - (neckSeamX + 15)} 158, ${200 - (chestHalf + 3)} 185, ${200 - (chestHalf + 1)} 210
    C ${200 - (chestHalf - 1)} 235, ${200 - (waistTunicHalf + 5)} 260, ${200 - (waistTunicHalf + 1)} 285
    C ${200 - (waistTunicHalf + 4)} 312, ${200 - (hipTunicHalf - 9)} 338, ${200 - (hipTunicHalf + 1)} 367
    C ${200 - (hipTunicHalf + 2)} 430, ${200 - kneeTunicHalf} 500, ${200 - (kneeTunicHalf + 1)} 570
    C ${200 - (kneeTunicHalf + 2)} 630, ${200 - hemTunicHalf} 680, ${200 - (hemTunicHalf + 1)} 725
    Q 200 730.5, ${200 + (hemTunicHalf + 1)} 725
    C ${200 + hemTunicHalf} 680, ${200 + (kneeTunicHalf + 2)} 630, ${200 + (kneeTunicHalf + 1)} 570
    C ${200 + kneeTunicHalf} 500, ${200 + (hipTunicHalf + 2)} 430, ${200 + (hipTunicHalf + 1)} 367
    C ${200 + (hipTunicHalf - 9)} 338, ${200 + (waistTunicHalf + 4)} 312, ${200 + (waistTunicHalf + 1)} 285
    C ${200 + (waistTunicHalf + 5)} 260, ${200 + (chestHalf - 1)} 235, ${200 + (chestHalf + 1)} 210
    C ${200 + (chestHalf + 3)} 185, ${200 + (neckSeamX + 15)} 158, ${200 + neckSeamX} 148
    Z
  `;

  // Cổ áo đứng truyền thống (Cổ lập lĩnh / Cổ tàu)
  const collarHeight = isMale ? 14 : 15;
  const collarPathFront = `
    M ${200 - neckSeamX} 148
    L ${200 - (neckSeamX - 1.5)} ${148 - collarHeight}
    Q 200 ${148 - collarHeight + 2}, ${200 + (neckSeamX - 1.5)} ${148 - collarHeight}
    L ${200 + neckSeamX} 148
    Z
  `;

  const collarPathBack = `
    M ${200 - neckSeamX} 148
    L ${200 - (neckSeamX - 1.5)} ${148 - collarHeight + 2}
    Q 200 ${148 - collarHeight + 4}, ${200 + (neckSeamX - 1.5)} ${148 - collarHeight + 2}
    L ${200 + neckSeamX} 148
    Z
  `;

  const childrenAo = (
    <g id="aodai-ao" className="garment-transition">
      <style>{COMMON_GARMENT_STYLE}</style>

      {/* ============================================================== */}
      {/* TRƯỜNG HỢP 1: MẶT TRƯỚC (FRONT VIEW)                             */}
      {/* ============================================================== */}
      {!isBack ? (
        <>
          {/* Lớp 1: Tà sau lót dưới (tạo bóng và chiều sâu tà kép) */}
          <path
            d={backTunicPath}
            fill={mauHex}
            stroke="rgba(0,0,0,0.18)"
            strokeWidth="0.9"
            style={{ filter: "brightness(0.92)" }}
          />

          {/* Lớp 2: Tay áo raglan trái & phải ôm trọn cánh tay */}
          <path
            d={leftSleevePath}
            fill={mauHex}
            stroke="rgba(0,0,0,0.2)"
            strokeWidth="1"
          />
          <path
            d={rightSleevePath}
            fill={mauHex}
            stroke="rgba(0,0,0,0.2)"
            strokeWidth="1"
          />

          {/* Đường raglan may chéo từ nách lên cổ tạo điểm nhấn kinh điển */}
          <path
            d={`M ${200 - chestHalf} 210 Q ${200 - 28} 175, ${200 - neckSeamX} 148`}
            fill="none"
            stroke="rgba(0,0,0,0.18)"
            strokeWidth="0.9"
          />
          <path
            d={`M ${200 + chestHalf} 210 Q ${200 + 28} 175, ${200 + neckSeamX} 148`}
            fill="none"
            stroke="rgba(0,0,0,0.18)"
            strokeWidth="0.9"
          />

          {/* Lớp 3: Thân trước & tà trước lượn tha thướt */}
          <path
            d={frontTunicPath}
            fill={mauHex}
            stroke="rgba(0,0,0,0.22)"
            strokeWidth="1.2"
          />

          {/* Hoa văn truyền thống phủ trên tà trước (nếu có) */}
          {patternFill && (
            <path
              d={frontTunicPath}
              fill={patternFill}
              style={{ mixBlendMode: "screen" }}
            />
          )}

          {/* Lớp 4: Cổ đứng cao trang nhã */}
          <path
            d={collarPathFront}
            fill={mauHex}
            stroke="rgba(0,0,0,0.28)"
            strokeWidth="1.1"
          />

          {/* Lớp 5: Đường nẹp cúc bấm chéo từ chân cổ qua ngực phải xuống eo (CHỈ MẶT TRƯỚC) */}
          {!isMale ? (
            <>
              {/* Nẹp cúc chéo mềm mại thiếu nữ */}
              <path
                d={`
                  M 200 ${148 - collarHeight + 4}
                  Q ${200 + 10} 148, ${200 + 22} 168
                  Q ${200 + chestHalf - 4} 205, ${200 + (chestHalf - 2)} 220
                  Q ${200 + (waistTunicHalf + 4)} 258, ${200 + waistTunicHalf} 285
                `}
                fill="none"
                stroke="rgba(255,255,255,0.55)"
                strokeWidth="1.2"
                strokeDasharray="2.5 3"
              />

              {/* 5 Hạt cúc ngọc vàng bấm chéo */}
              {[
                { x: 200 + 3, y: 144 },
                { x: 200 + 15, y: 160 },
                { x: 200 + 29, y: 188 },
                { x: 200 + 38, y: 228 },
                { x: 200 + waistTunicHalf - 1, y: 285 },
              ].map((cuc, idx) => (
                <circle
                  key={idx}
                  cx={cuc.x}
                  cy={cuc.y}
                  r="2.2"
                  fill="#fef08a"
                  stroke="#b45309"
                  strokeWidth="0.6"
                />
              ))}
            </>
          ) : (
            <>
              {/* Áo dài nam: 5 cúc thẳng / vạt hò sang trọng */}
              <line
                x1="200"
                y1="148"
                x2="200"
                y2="285"
                stroke="rgba(255,255,255,0.45)"
                strokeWidth="1.2"
                strokeDasharray="3 3"
              />
              {[152, 185, 218, 252, 285].map((y, idx) => (
                <circle
                  key={idx}
                  cx="200"
                  cy={y}
                  r="2.2"
                  fill="#fef08a"
                  stroke="#b45309"
                  strokeWidth="0.6"
                />
              ))}
            </>
          )}
        </>
      ) : (
        /* ============================================================== */
        /* TRƯỜNG HỢP 2: MẶT SAU (BACK VIEW)                               */
        /* KHÔNG CÓ CÚC BẤM CHÉO, THÂN SAU PHẲNG PHIU CÙNG ĐƯỜNG MAY SỐNG   */
        /* ============================================================== */
        <>
          {/* Lớp 1: Tay áo raglan trái & phải mặt sau */}
          <path
            d={leftSleevePath}
            fill={mauHex}
            stroke="rgba(0,0,0,0.2)"
            strokeWidth="1"
          />
          <path
            d={rightSleevePath}
            fill={mauHex}
            stroke="rgba(0,0,0,0.2)"
            strokeWidth="1"
          />

          {/* Đường raglan vai sau */}
          <path
            d={`M ${200 - chestHalf} 210 Q ${200 - 30} 175, ${200 - neckSeamX} 148`}
            fill="none"
            stroke="rgba(0,0,0,0.18)"
            strokeWidth="0.9"
          />
          <path
            d={`M ${200 + chestHalf} 210 Q ${200 + 30} 175, ${200 + neckSeamX} 148`}
            fill="none"
            stroke="rgba(0,0,0,0.18)"
            strokeWidth="0.9"
          />

          {/* Lớp 2: Thân sau & Tà sau phủ phẳng phiu trọn vẹn */}
          <path
            d={backTunicPath}
            fill={mauHex}
            stroke="rgba(0,0,0,0.22)"
            strokeWidth="1.2"
          />

          {/* Hoa văn truyền thống mặt sau (nếu có) */}
          {patternFill && (
            <path
              d={backTunicPath}
              fill={patternFill}
              style={{ mixBlendMode: "screen" }}
            />
          )}

          {/* Lớp 3: Cổ sau ôm gáy cong nhẹ nhàng, thanh thoát (KHÔNG CÓ CÚC) */}
          <path
            d={collarPathBack}
            fill={mauHex}
            stroke="rgba(0,0,0,0.28)"
            strokeWidth="1.1"
          />

          {/* Lớp 4: Đường may sống lưng thẳng thanh thoát đặc trưng tà sau */}
          <line
            x1="200"
            y1={148 - collarHeight + 4}
            x2="200"
            y2="725"
            stroke="rgba(0,0,0,0.16)"
            strokeWidth="0.8"
          />
        </>
      )}
    </g>
  );

  return { childrenVayQuan, childrenAo };
}
