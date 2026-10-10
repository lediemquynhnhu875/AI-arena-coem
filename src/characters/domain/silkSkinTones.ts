/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * BẢNG MÀU TÔNG DA TƠ LỤA VIỆT NAM (SILK SKIN TONES DOMAIN VALUES)
 */

import { TongDa } from "../types";

export interface SilkSkinTone {
  id: TongDa;
  ten: string;
  yNghia: string;
  swatchGrad: string;
}

export const SILK_SKIN_TONES: Record<TongDa, SilkSkinTone> = {
  1: {
    id: 1,
    ten: "Bạch Ngọc",
    yNghia: "Trắng ngà cung đình thanh khiết",
    swatchGrad: "linear-gradient(135deg, #FFFDF8 0%, #F5EFE0 100%)",
  },
  2: {
    id: 2,
    ten: "Hoa Lê",
    yNghia: "Trắng hồng dịu dàng nắng sớm",
    swatchGrad: "linear-gradient(135deg, #FFF1E6 0%, #F6DEC8 100%)",
  },
  3: {
    id: 3,
    ten: "Tơ Tằm",
    yNghia: "Sắc vàng ngà óng ả tự nhiên",
    swatchGrad: "linear-gradient(135deg, #FDE68A 0%, #D4A373 100%)",
  },
  4: {
    id: 4,
    ten: "Bánh Mật",
    yNghia: "Ấm áp phù sa miền sông nước",
    swatchGrad: "linear-gradient(135deg, #E0A96D 0%, #BC8A5F 100%)",
  },
  5: {
    id: 5,
    ten: "Nâu Đồng",
    yNghia: "Khỏe khoắn nắng gió bazan",
    swatchGrad: "linear-gradient(135deg, #B07D62 0%, #8C5338 100%)",
  },
  6: {
    id: 6,
    ten: "Thổ Cẩm",
    yNghia: "Nâu trầm sâu lắng đất mẹ",
    swatchGrad: "linear-gradient(135deg, #7F4F24 0%, #582F0E 100%)",
  },
};
