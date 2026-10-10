/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * TẠO HÌNH: CHỢ PHIÊN (CHO PHIEN POSE)
 * Cò Em rộn ràng dạo chợ phiên thổ cẩm, cùng trao đổi sắc màu và nét thêu.
 */

import React from "react";
import CoMascot from "../mascot/CoMascot";
import { NarratorPoseProps } from "../types";

export default function ChoPhienPose({
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
      className={`narrator-pose narrator-pose--chophien flex flex-col items-center select-none ${className}`}
    >
      <CoMascot
        size={size}
        mood="cuoi"
        hat="non_la"
        glow={glow}
        animate={animate}
        title="Cò Em dạo chợ phiên"
      />
      {subtext && (
        <span className="mt-1 text-xs text-amber-800 dark:text-amber-200 font-medium text-center">
          {subtext}
        </span>
      )}
    </div>
  );
}
