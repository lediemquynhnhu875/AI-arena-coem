/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * ĐỊNH NGHĨA KIỂU DỮ LIỆU NGƯỜI DẪN CHUYỆN (NARRATOR / CÒ EM STORYTELLER)
 */

export type CoMood = "vui" | "cuoi" | "nghi" | "ngu";
export type DomMood = CoMood;

export type CoHat = "none" | "non_la" | "tham_tu" | "khan_dong";
export type DomHat = CoHat;

export type NarratorPage =
  | "chao_ban"
  | "gate"
  | "que_nha"
  | "s2" // Khám phá trang phục
  | "s3" // Chi tiết trang phục
  | "s4" // Phối đồ thử đồ
  | "cho_phien"
  | "tham_tu"
  | "dong_thoi_gian"
  | "soi_chi_chung"
  | "gui_ky_uc";

export interface NarratorPoseProps {
  size?: number;
  mood?: CoMood;
  glow?: number;
  animate?: boolean;
  className?: string;
  subtext?: string;
  onClick?: () => void;
}
