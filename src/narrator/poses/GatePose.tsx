/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * TẠO HÌNH: CỔNG VÒM (GATE POSE)
 * Cò Em soi rọi lối vào không gian di sản cổ phục.
 */

import React from "react";
import CoMascot from "../mascot/CoMascot";
import { NarratorPoseProps } from "../types";

export default function GatePose({
  size = 120,
  glow = 1.2,
  animate = true,
  className = "",
  subtext,
  onClick,
}: NarratorPoseProps) {
  return (
    <div
      onClick={onClick}
      className={`narrator-pose narrator-pose--gate flex flex-col items-center select-none ${className}`}
    >
      <div className="relative group cursor-pointer">
        <CoMascot
          size={size}
          mood="vui"
          wave={true}
          glow={glow}
          animate={animate}
          title="Cò Em dẫn lối qua Cổng Di Sản"
        />
        {/* Vệt ánh sáng tỏa lan */}
        <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-xl -z-10 animate-pulse pointer-events-none" />
      </div>
      {subtext && (
        <span className="mt-3 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-300 font-medium">
          {subtext}
        </span>
      )}
    </div>
  );
}
