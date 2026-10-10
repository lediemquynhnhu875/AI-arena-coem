/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * TẠO HÌNH: DÒNG THỜI GIAN (DONG THOI GIAN POSE)
 * Cò Em lướt qua các mốc lịch sử, áo tấc, giao lĩnh, ngũ thân của ngàn năm văn hiến.
 */

import React from "react";
import CoMascot from "../mascot/CoMascot";
import { NarratorPoseProps } from "../types";

export default function DongThoiGianPose({
  size = 78,
  glow = 1.0,
  animate = true,
  className = "",
  subtext,
  onClick,
}: NarratorPoseProps) {
  return (
    <div
      onClick={onClick}
      className={`narrator-pose narrator-pose--timeline flex flex-col items-center select-none ${className}`}
    >
      <CoMascot
        size={size}
        mood="vui"
        glow={glow}
        animate={animate}
        title="Cò Em dạo bước dòng thời gian"
      />
      {subtext && (
        <span className="mt-1 text-xs text-amber-800/80 dark:text-amber-200/80 font-serif italic text-center">
          {subtext}
        </span>
      )}
    </div>
  );
}
