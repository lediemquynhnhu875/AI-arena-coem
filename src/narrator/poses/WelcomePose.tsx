/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * TẠO HÌNH: CHÀO BẠN (WELCOME POSE)
 * Tạo hình Cò Em tươi cười, vẫy tay hân hoan đón chào người dùng đến với thế giới Việt phục.
 */

import React from "react";
import CoMascot from "../mascot/CoMascot";
import { NarratorPoseProps } from "../types";

export default function WelcomePose({
  size = 110,
  glow = 1,
  animate = true,
  className = "",
  subtext,
  onClick,
}: NarratorPoseProps) {
  return (
    <div
      onClick={onClick}
      className={`narrator-pose narrator-pose--welcome flex flex-col items-center select-none ${className}`}
    >
      <div className="relative">
        <CoMascot
          size={size}
          mood="cuoi"
          wave={true}
          glow={glow}
          animate={animate}
          title="Cò Em chào bạn"
        />
        {/* Vòng hào quang pháo hoa nhẹ */}
        <div className="absolute -inset-2 rounded-full border border-amber-400/30 animate-ping pointer-events-none -z-10" />
      </div>
      {subtext && (
        <p className="mt-2 text-xs text-amber-800/80 dark:text-amber-200/80 font-medium italic text-center max-w-[200px]">
          {subtext}
        </p>
      )}
    </div>
  );
}
