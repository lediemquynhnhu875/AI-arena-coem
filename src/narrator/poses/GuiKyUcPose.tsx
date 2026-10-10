/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * TẠO HÌNH: GÙI KÝ ỨC (GUI KY UC POSE)
 * Cò Em chở che những bộ trang phục bạn đã cất giữ vào gùi tre đan.
 */

import React from "react";
import CoMascot from "../mascot/CoMascot";
import { NarratorPoseProps } from "../types";

export default function GuiKyUcPose({
  size = 78,
  glow = 0.9,
  animate = true,
  className = "",
  subtext,
  onClick,
}: NarratorPoseProps) {
  return (
    <div
      onClick={onClick}
      className={`narrator-pose narrator-pose--guikyuc flex flex-col items-center select-none ${className}`}
    >
      <CoMascot
        size={size}
        mood="vui"
        wave={true}
        glow={glow}
        animate={animate}
        title="Cò Em cùng Gùi Ký Ức"
      />
      {subtext && (
        <span className="mt-1 text-xs text-amber-800/80 dark:text-amber-200/80 font-serif italic text-center">
          {subtext}
        </span>
      )}
    </div>
  );
}
