/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * TẠO HÌNH: SỢI CHỈ CHUNG (SOI CHI CHUNG POSE)
 * Cò Em chắp nối những điểm tương đồng văn hóa giữa các dân tộc anh em.
 */

import React from "react";
import CoMascot from "../mascot/CoMascot";
import { NarratorPoseProps } from "../types";

export default function SoiChiChungPose({
  size = 78,
  glow = 1.05,
  animate = true,
  className = "",
  subtext,
  onClick,
}: NarratorPoseProps) {
  return (
    <div
      onClick={onClick}
      className={`narrator-pose narrator-pose--soichi flex flex-col items-center select-none ${className}`}
    >
      <CoMascot
        size={size}
        mood="cuoi"
        glow={glow}
        animate={animate}
        title="Cò Em dệt sợi chỉ chung"
      />
      {subtext && (
        <span className="mt-1 text-xs text-amber-800 dark:text-amber-200 font-serif italic text-center">
          {subtext}
        </span>
      )}
    </div>
  );
}
