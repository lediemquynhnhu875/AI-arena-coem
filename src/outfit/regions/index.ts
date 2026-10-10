/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export * from "./bac_bo/bacBoStyling";
export * from "./trung_bo/trungBoStyling";
export * from "./tay_nguyen/tayNguyenStyling";
export * from "./nam_bo/namBoStyling";

import { BAC_BO_STYLING } from "./bac_bo/bacBoStyling";
import { TRUNG_BO_STYLING } from "./trung_bo/trungBoStyling";
import { TAY_NGUYEN_STYLING } from "./tay_nguyen/tayNguyenStyling";
import { NAM_BO_STYLING } from "./nam_bo/namBoStyling";

export const REGIONAL_STYLING_LIST = [
  BAC_BO_STYLING,
  TRUNG_BO_STYLING,
  TAY_NGUYEN_STYLING,
  NAM_BO_STYLING,
];
