/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * BỘ CHỌN TẠO HÌNH NGƯỜI DẪN CHUYỆN THEO TRANG (NARRATOR POSE SELECTOR)
 * Dễ dàng hiển thị tạo hình Cò Em thích hợp cho từng trang của ứng dụng.
 */

import React from "react";
import { NarratorPage, NarratorPoseProps } from "../types";
import WelcomePose from "./WelcomePose";
import GatePose from "./GatePose";
import QueNhaPose from "./QueNhaPose";
import CostumeSelectPose from "./CostumeSelectPose";
import CostumeDetailPose from "./CostumeDetailPose";
import OutfitPose from "./OutfitPose";
import ChoPhienPose from "./ChoPhienPose";
import ThamTuPose from "./ThamTuPose";
import DongThoiGianPose from "./DongThoiGianPose";
import SoiChiChungPose from "./SoiChiChungPose";
import GuiKyUcPose from "./GuiKyUcPose";

export interface NarratorPoseSelectorProps extends NarratorPoseProps {
  page: NarratorPage;
}

export default function NarratorPose({ page, ...props }: NarratorPoseSelectorProps) {
  switch (page) {
    case "chao_ban":
      return <WelcomePose {...props} />;
    case "gate":
      return <GatePose {...props} />;
    case "que_nha":
      return <QueNhaPose {...props} />;
    case "s2":
      return <CostumeSelectPose {...props} />;
    case "s3":
      return <CostumeDetailPose {...props} />;
    case "s4":
      return <OutfitPose {...props} />;
    case "cho_phien":
      return <ChoPhienPose {...props} />;
    case "tham_tu":
      return <ThamTuPose {...props} />;
    case "dong_thoi_gian":
      return <DongThoiGianPose {...props} />;
    case "soi_chi_chung":
      return <SoiChiChungPose {...props} />;
    case "gui_ky_uc":
      return <GuiKyUcPose {...props} />;
    default:
      return <WelcomePose {...props} />;
  }
}
