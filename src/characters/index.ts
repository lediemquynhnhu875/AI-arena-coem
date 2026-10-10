/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * TRUNG TÂM QUẢN LÝ NHÂN VẬT CON NGƯỜI (HUMAN CHARACTER SYSTEM)
 * Phân bổ cấu trúc bài bản:
 * - types: Định nghĩa kiểu dữ liệu nhân vật & số đo
 * - dimensions: Phân bổ thước đo, tỉ lệ, tông da, viewports và kích thước vẽ
 * - gender: Đặc tính phân biệt theo giới tính (Nam, Nữ, Trung tính)
 * - body: Dựng thân, tay, chân, khuôn mặt và mái tóc
 * - garments: 9 trang phục văn hóa Việt Nam phân bổ theo file riêng biệt
 * - accessories: Nón lá, khăn đóng, khăn mỏ quạ, nón quai thao, khăn piêu, trâm cài, kiềng bạc...
 * - patterns: Hoa văn di sản SVG
 * - CharacterRenderer: Trình diễn nhân vật hoàn chỉnh
 */

export * from "./types";
export * from "./dimensions/proportions";
export * from "./dimensions/skinTones";
export * from "./dimensions/viewports";
export * from "./dimensions/clothingDynamicFit";
export * from "./croquis/FashionMannequin";
export * from "./croquis/BodyPartLayering";
export * from "./garments/types";
export * from "./garments/GarmentRegistry";
export * from "./accessories/HeadwearRenderer";
export * from "./accessories/BodyAccessoriesRenderer";
export * from "./accessories/FootwearRenderer";
export * from "./patterns/CulturalPatternsDefs";
export * from "./models/CharacterModel";
export * from "./services/CharacterStorageService";
export { default as CharacterRenderer } from "./CharacterRenderer";
export { HumanFigure2D } from "../components/HumanFigure2D";
