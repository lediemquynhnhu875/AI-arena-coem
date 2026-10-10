/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * TẠO HÌNH: PHÒNG THỬ ĐỒ & PHỐI REMIX (OUTFIT POSE - S4)
 * Cò Em sáng tạo với nếp áo, cổ vũ người dùng tự do phối phụ kiện và màu sắc.
 */

import React from "react";
import CoMascot from "../mascot/CoMascot";
import { NarratorPoseProps } from "../types";

export default function OutfitPose({
  size = 72,
  glow = 1.05,
  animate = true,
  className = "",
  subtext,
  onClick,
}: NarratorPoseProps) {
  return (
    <div
      onClick={onClick}
      className={`narrator-pose narrator-pose--outfit flex flex-col items-center select-none ${className}`}
    >
      <CoMascot
        size={size}
        mood="cuoi"
        wave={true}
        glow={glow}
        animate={animate}
        title="Cò Em phối đồ Việt Phục Remix"
      />
      {subtext && (
        <span className="mt-1 text-[11px] text-amber-700 dark:text-amber-300 font-medium">
          {subtext}
        </span>
      )}
    </div>
  );
}
