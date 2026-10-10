/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * TẠO HÌNH: QUÊ NHÀ (QUE NHA POSE)
 * Cò Em đội nón lá mộc mạc, mắt hiền hòa ngắm nhìn các vùng văn hóa.
 */

import React from "react";
import CoMascot from "../mascot/CoMascot";
import { NarratorPoseProps } from "../types";

export default function QueNhaPose({
  size = 80,
  glow = 0.9,
  animate = true,
  className = "",
  subtext,
  onClick,
}: NarratorPoseProps) {
  return (
    <div
      onClick={onClick}
      className={`narrator-pose narrator-pose--quenha flex flex-col items-center select-none ${className}`}
    >
      <CoMascot
        size={size}
        mood="vui"
        hat="non_la"
        wave={false}
        glow={glow}
        animate={animate}
        title="Cò Em nón lá quê hương"
      />
      {subtext && (
        <p className="mt-1 text-xs text-amber-900/70 dark:text-amber-100/70 font-serif italic text-center">
          {subtext}
        </p>
      )}
    </div>
  );
}
