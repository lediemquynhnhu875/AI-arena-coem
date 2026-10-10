/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * DANH MỤC ÂM THANH DI SẢN (HERITAGE SOUND CATALOG)
 * Quản lý danh mục âm thanh truyền thống và cấu hình âm học.
 */

export interface SoundCue {
  id: string;
  name: string;
  category: "ambient" | "sfx" | "nature";
  description: string;
  region?: "bac" | "trung" | "taynguyen" | "nam";
}

export const SOUND_CATALOG: SoundCue[] = [
  {
    id: "firefly-sparkle",
    name: "Cò Em Vỗ Cánh",
    category: "sfx",
    description: "Tiếng vỗ cánh êm tai dịu dàng khi Cò Em dạo bước trên đồng sen.",
  },
  {
    id: "page-turn",
    name: "Lật Giấy Dó Cổ",
    category: "sfx",
    description: "Âm thanh xào xạc thanh tao khi giở trang thư tịch cổ.",
  },
  {
    id: "rain-bamboo",
    name: "Mưa Rơi Mái Tranh",
    category: "nature",
    description: "Tiếng mưa rơi nhẹ êm dịu trên mái lá quê nhà.",
    region: "bac",
  },
  {
    id: "flute-wind",
    name: "Sáo Trúc Thoảng Gió",
    category: "ambient",
    description: "Giai điệu sáo trúc réo rắt bên sườn đồi.",
    region: "taynguyen",
  },
  {
    id: "bell-temple",
    name: "Chuông Chùa Xa Vọng",
    category: "ambient",
    description: "Tiếng chuông ngân xa lắng đọng lòng người.",
    region: "trung",
  },
  {
    id: "river-flow",
    name: "Nước Chảy Vàm Sông",
    category: "nature",
    description: "Tiếng sóng nước lăn tăn vỗ mạn thuyền tam bản.",
    region: "nam",
  },
];
