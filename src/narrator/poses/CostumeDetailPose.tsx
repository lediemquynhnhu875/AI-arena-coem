/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * TẠO HÌNH: CHI TIẾT TRANG PHỤC (COSTUME DETAIL POSE - S3)
 * Cò Em làm vai trò Cố vấn Văn hóa: giải thích nguồn gốc, chất liệu, nẹp áo.
 */

import React from "react";
import CoMascot from "../mascot/CoMascot";
import { NarratorPoseProps } from "../types";

export default function CostumeDetailPose({
  size = 72,
  glow = 0.95,
  animate = true,
  className = "",
  subtext,
  onClick,
}: NarratorPoseProps) {
  return (
    <div
      onClick={onClick}
      className={`narrator-pose narrator-pose--detail flex items-center gap-2 select-none ${className}`}
    >
      <CoMascot
        size={size}
        mood="vui"
        glow={glow}
        animate={animate}
        title="Cò Em thuyết minh chi tiết trang phục"
      />
      {subtext && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-2.5 py-1.5 text-xs text-amber-900 dark:text-amber-100 font-serif">
          {subtext}
        </div>
      )}
    </div>
  );
}
