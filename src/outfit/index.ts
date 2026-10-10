/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * TRUNG TÂM QUẢN LÝ PHỐI TRANG PHỤC (OUTFIT STYLING HUB)
 * Hệ thống phối trang phục Việt Nam phân bổ chuyên biệt:
 * - types: Định nghĩa kiểu dữ liệu phối đồ
 * - gender: Phối đồ theo giới tính (Nam, Nữ, Trung tính)
 * - regions: Phối đồ theo 4 khu vực địa lý văn hóa (Bắc Bộ, Trung Bộ, Tây Nguyên, Nam Bộ)
 * - patterns: Danh mục và bộ chọn hoa văn mượn
 * - colors: Bảng màu vải phong thủy & ngũ hành
 * - fabrics: Danh mục chất liệu & làng nghề truyền thống
 * - accessories: Phụ kiện mũ/nón, khăn quàng, trang sức, túi tote
 * - footwear: Giày dép cổ truyền & sneaker remix
 * - rules: Quy tắc đánh giá hài hòa và ranh giới sáng tạo
 * - presets: Bộ phối mẫu hoàn chỉnh (Styled combos)
 * - components: Thanh tab điều khiển, huy hiệu chỉ báo, thẻ lọc
 */

export * from "./types";
export * from "./gender";
export * from "./regions";
export * from "./patterns";
export * from "./colors";
export * from "./fabrics";
export * from "./accessories";
export * from "./footwear";
export * from "./rules";
export * from "./presets";

export { default as OutfitControlTabs, OUTFIT_TABS } from "./components/OutfitControlTabs";
export { default as GenderFilterCard } from "./components/GenderFilterCard";
export { default as RegionFilterCard } from "./components/RegionFilterCard";
export { default as OutfitIndicator } from "./components/OutfitIndicator";
