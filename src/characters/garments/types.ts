/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { SoDoNhanVat, HuongNhin } from "../types";
import { CroquisBodyType } from "../croquis/BodyPartLayering";

export interface GarmentRenderProps {
  soDo: SoDoNhanVat;
  mauHex: string;
  patternFill?: string | null;
  hasSneaker?: boolean;
  huongNhin?: HuongNhin;
  bodyType?: CroquisBodyType;
}

export interface GarmentRenderResult {
  childrenVayQuan: React.ReactNode;
  childrenAo: React.ReactNode;
}

export const COMMON_GARMENT_STYLE = `
  .garment-transition path, .garment-transition rect, .garment-transition polygon, .garment-transition circle, .garment-transition ellipse {
    transition: fill 500ms ease, stroke 500ms ease;
  }
`;
