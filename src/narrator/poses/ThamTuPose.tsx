/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * TẠO HÌNH: THÁM TỬ VIỆT PHỤC (THAM TU POSE)
 * Cò Em mang kính lúp và phong thái đăm chiêu ("nghi"), giúp soi nét chuẩn di sản.
 */

import React from "react";
import CoMascot from "../mascot/CoMascot";
import { NarratorPoseProps } from "../types";

export default function ThamTuPose({
  size = 84,
  glow = 1.1,
  animate = true,
  className = "",
  subtext,
  onClick,
}: NarratorPoseProps) {
  return (
    <div
      onClick={onClick}
      className={`narrator-pose narrator-pose--thamtu flex flex-col items-center select-none ${className}`}
    >
      <CoMascot
        size={size}
        mood="nghi"
        hat="tham_tu"
        wave={false}
        glow={glow}
        animate={animate}
        title="Cò Em Thám Tử Việt Phục"
      />
      {subtext && (
        <span className="mt-1 text-xs text-amber-800 dark:text-amber-200 font-serif italic text-center">
          {subtext}
        </span>
      )}
    </div>
  );
}
