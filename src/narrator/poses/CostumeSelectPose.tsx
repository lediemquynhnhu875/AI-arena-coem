/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * TẠO HÌNH: KHÁM PHÁ TRANG PHỤC (COSTUME SELECT POSE - S2)
 * Cò Em lơ lửng, mắt mở to ngắm nghía từng thước lụa và tà áo.
 */

import React from "react";
import CoMascot from "../mascot/CoMascot";
import { NarratorPoseProps } from "../types";

export default function CostumeSelectPose({
  size = 76,
  glow = 0.9,
  animate = true,
  className = "",
  subtext,
  onClick,
}: NarratorPoseProps) {
  return (
    <div
      onClick={onClick}
      className={`narrator-pose narrator-pose--select flex flex-col items-center select-none ${className}`}
    >
      <CoMascot
        size={size}
        mood="cuoi"
        glow={glow}
        animate={animate}
        title="Cò Em dạo xem trang phục"
      />
      {subtext && (
        <p className="mt-1 text-xs text-amber-800/80 dark:text-amber-200/80 font-medium">
          {subtext}
        </p>
      )}
    </div>
  );
}
