/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * BỘ ĐIỀU PHỐI CÁC LỚP TRANG PHỤC (GARMENTS REGISTRY)
 * Kết nối 9 bộ trang phục văn hóa Việt Nam cùng phụ kiện và hoa văn.
 */

import React from "react";
import { SoDoNhanVat, HuongNhin } from "../types";
import { renderAoDaiGarment } from "./AoDaiGarment";
import { renderNguThanGarment } from "./NguThanGarment";
import { renderTuThanGarment } from "./TuThanGarment";
import { renderBaBaGarment } from "./BaBaGarment";
import { renderCoThaiGarment } from "./CoThaiGarment";
import { renderMongGarment } from "./MongGarment";
import { renderEDeGarment } from "./EDeGarment";
import { renderChamGarment } from "./ChamGarment";
import { renderSampotGarment } from "./SampotGarment";
import { renderYemGarment } from "./YemGarment";
import { renderHeadwear } from "../accessories/HeadwearRenderer";
import { renderBodyAccessories } from "../accessories/BodyAccessoriesRenderer";
import { renderFootwear } from "../accessories/FootwearRenderer";
import { CroquisBodyType } from "../croquis/BodyPartLayering";
import {
  validateClothingDynamicFit,
  ClothingDynamicFitResult,
} from "../dimensions/clothingDynamicFit";

export {
  validateClothingDynamicFit,
  type ClothingDynamicFitResult,
};

export interface GarmentLayersProps {
  trangPhucId: string;
  soDo: SoDoNhanVat;
  mauHex: string;
  phuKienIds: string[];
  footwearId?: string | null;
  hoaVanThem?: string | null;
  phongCach?: string | null;
  bodyType?: CroquisBodyType;
  huongNhin?: HuongNhin;
}

export interface GarmentLayersResult {
  childrenVayQuan: React.ReactNode;
  childrenAo: React.ReactNode;
  childrenPhuKienThan: React.ReactNode;
  childrenTocTruocKhanNon: React.ReactNode;
  fitAdjustment: ClothingDynamicFitResult;
}

export function renderGarmentLayers({
  trangPhucId,
  soDo,
  mauHex,
  phuKienIds,
  footwearId,
  hoaVanThem,
  bodyType = "adult",
  huongNhin = "truoc",
}: GarmentLayersProps): GarmentLayersResult {
  // Logic check: Kiểm tra và hiệu chuẩn ma trận co giãn động cho trang phục theo thể trạng
  const fitAdjustment = validateClothingDynamicFit(bodyType, soDo.isMale);

  const patternFill = hoaVanThem ? `url(#hoa-van-${hoaVanThem})` : null;
  const hasSneaker = phuKienIds.includes("sneaker") || footwearId === "sneaker";

  const commonProps = {
    soDo,
    mauHex,
    patternFill,
    hasSneaker: false, // Quản lý tập trung qua renderFootwear bên dưới để tránh trùng lặp
    bodyType,
    huongNhin,
  };

  let garmentResult;

  switch (trangPhucId) {
    case "aodai":
      garmentResult = renderAoDaiGarment(commonProps);
      break;
    case "ngu_than":
      garmentResult = renderNguThanGarment(commonProps);
      break;
    case "tu_than":
      garmentResult = renderTuThanGarment(commonProps);
      break;
    case "ba_ba":
      garmentResult = renderBaBaGarment(commonProps);
      break;
    case "co_thai":
      garmentResult = renderCoThaiGarment(commonProps);
      break;
    case "mong_lanh":
      garmentResult = renderMongGarment(commonProps);
      break;
    case "ede_tho_cam":
      garmentResult = renderEDeGarment(commonProps);
      break;
    case "champa_tho_cam":
      garmentResult = renderChamGarment(commonProps);
      break;
    case "sampot":
      garmentResult = renderSampotGarment(commonProps);
      break;
    case "yem":
      garmentResult = renderYemGarment(commonProps);
      break;
    default:
      garmentResult = renderAoDaiGarment(commonProps);
      break;
  }

  return {
    childrenVayQuan: (
      <>
        {garmentResult.childrenVayQuan}
        {renderFootwear(soDo, phuKienIds, footwearId)}
      </>
    ),
    childrenAo: garmentResult.childrenAo,
    childrenPhuKienThan: renderBodyAccessories(soDo, phuKienIds, bodyType),
    childrenTocTruocKhanNon: renderHeadwear(soDo, phuKienIds, bodyType),
    fitAdjustment,
  };
}
