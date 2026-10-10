/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * GarmentLayers — Bridge chuyển tiếp tới src/characters/garments/GarmentRegistry
 * Duy trì tính tương thích ngược cho toàn bộ các màn hình hiện hữu.
 */

export {
  CulturalPatternsDefs,
} from "../characters/patterns/CulturalPatternsDefs";

export {
  renderGarmentLayers,
  validateClothingDynamicFit,
  type GarmentLayersProps,
  type GarmentLayersResult,
  type ClothingDynamicFitResult,
} from "../characters/garments/GarmentRegistry";
