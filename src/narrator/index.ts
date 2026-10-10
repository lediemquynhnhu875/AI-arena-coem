/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * TRUNG TÂM QUẢN LÝ NGƯỜI DẪN CHUYỆN (NARRATOR HUB)
 * Thư mục riêng biệt dành cho Cò Em — Người kể chuyện & Cố vấn văn hóa:
 * - logo: Logo Cò Em & biểu tượng nón lá mini, khăn rằn Nam Bộ
 * - mascot: Linh vật Cò Em 3D/vector đa tầng
 * - poses: 11+ tạo hình theo từng trang chuyên biệt
 * - chat: Cửa sổ trò chuyện hỏi đáp văn hóa
 * - dialogues: Lời thoại và kịch bản dẫn chuyện
 */

export * from "./types";
export { default as CoLogo, type CoLogoProps } from "./logo/CoLogo";
export { default as CoMascot, type CoMascotProps } from "./mascot/CoMascot";

// Poses theo từng trang
export { default as WelcomePose } from "./poses/WelcomePose";
export { default as GatePose } from "./poses/GatePose";
export { default as QueNhaPose } from "./poses/QueNhaPose";
export { default as CostumeSelectPose } from "./poses/CostumeSelectPose";
export { default as CostumeDetailPose } from "./poses/CostumeDetailPose";
export { default as OutfitPose } from "./poses/OutfitPose";
export { default as ChoPhienPose } from "./poses/ChoPhienPose";
export { default as ThamTuPose } from "./poses/ThamTuPose";
export { default as DongThoiGianPose } from "./poses/DongThoiGianPose";
export { default as SoiChiChungPose } from "./poses/SoiChiChungPose";
export { default as GuiKyUcPose } from "./poses/GuiKyUcPose";
export { default as NarratorPose, type NarratorPoseSelectorProps } from "./poses/PoseSelector";

// Chat & Dialogues
export { default as CoEmChat, type CoEmChatProps } from "./chat/CoEmChat";
export * from "./dialogues/dialogues";
