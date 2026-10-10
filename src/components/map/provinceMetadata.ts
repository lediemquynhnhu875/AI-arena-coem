/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * DANH SÁCH & THÔNG TIN CHI TIẾT 34 TỈNH THÀNH VIỆT NAM (QĐ 19/2025/QĐ-TTg)
 * Dữ liệu chuẩn xác 100% kết nối với di sản trang phục truyền thống từng vùng
 */

import { Province34, RegionInfo } from "./types";

export const REGIONS_INFO: Record<string, RegionInfo> = {
  bac: {
    id: "bac",
    name: "Bắc Bộ",
    shortName: "Miền Bắc",
    provincesCount: 15,
    colorHex: "#15803D",
    accentHex: "#86EFAC",
    description: "Cái nôi ngàn năm văn hiến, áo tứ thân quan họ, áo dài Hà thành và thổ cẩm vùng cao",
  },
  trung: {
    id: "trung",
    name: "Trung Bộ",
    shortName: "Miền Trung",
    provincesCount: 8,
    colorHex: "#CA8A04",
    accentHex: "#FDE047",
    description: "Kinh đô Huế cổ kính, áo ngũ thân lập lĩnh chuẩn mực và di sản dệt thổ cẩm Chăm Pa",
  },
  taynguyen: {
    id: "taynguyen",
    name: "Tây Nguyên",
    shortName: "Tây Nguyên",
    provincesCount: 3,
    colorHex: "#C2410C",
    accentHex: "#FDBA74",
    description: "Đại ngàn cồng chiêng, hoa văn thổ cẩm Ê Đê, Jrai, Ba Na rực rỡ nắng gió bazan",
  },
  nam: {
    id: "nam",
    name: "Nam Bộ",
    shortName: "Miền Nam",
    provincesCount: 8,
    colorHex: "#0D9488",
    accentHex: "#99F6E4",
    description: "Sông nước Cửu Long trù phú, áo bà ba mộc mạc, khăn rằn và nếp sampot Khmer rực rỡ",
  },
};

export const PROVINCES_34_LIST: Province34[] = [
  {
    "id": "ha_noi",
    "code": 1,
    "tmsCode": 101,
    "name": "Hà Nội",
    "codename": "ha_noi",
    "divisionType": "thành phố",
    "region": "bac",
    "mergedFrom": [
      "Hà Nội",
      "Hà Tây"
    ],
    "communeCount": 126,
    "center": {
      "x": 245.3,
      "y": 172.3
    },
    "costumeIds": [
      "aodai",
      "ngu_than",
      "tu_than"
    ],
    "costumeNames": [
      "Áo Dài",
      "Áo Ngũ Thân",
      "Áo Tứ Thân"
    ],
    "heritageHighlight": "Thủ đô ngàn năm văn hiến, trung tâm giao thoa tơ lụa Vạn Phúc và áo dài cổ"
  },
  {
    "id": "bac_ninh",
    "code": 2,
    "tmsCode": 102,
    "name": "Bắc Ninh",
    "codename": "bac_ninh",
    "divisionType": "tỉnh",
    "region": "bac",
    "mergedFrom": [
      "Bắc Ninh",
      "Bắc Giang"
    ],
    "communeCount": 99,
    "center": {
      "x": 290.7,
      "y": 150
    },
    "costumeIds": [
      "tu_than"
    ],
    "costumeNames": [
      "Áo Tứ Thân Quan Họ"
    ],
    "heritageHighlight": "Cái nôi dân ca Quan họ, nón ba tầm, quai thao và áo tứ thân nền nã"
  },
  {
    "id": "quang_ninh",
    "code": 3,
    "tmsCode": 103,
    "name": "Quảng Ninh",
    "codename": "quang_ninh",
    "divisionType": "tỉnh",
    "region": "bac",
    "mergedFrom": [
      "Quảng Ninh"
    ],
    "communeCount": 54,
    "center": {
      "x": 353.3,
      "y": 163.6
    },
    "costumeIds": [
      "mong_lanh",
      "tu_than"
    ],
    "costumeNames": [
      "Áo Tứ Thân",
      "Trang phục Dao Thanh Y"
    ],
    "heritageHighlight": "Vùng đất di sản Vịnh Hạ Long, Yên Tử và sắc màu trang phục Dao, Tày"
  },
  {
    "id": "hai_phong",
    "code": 4,
    "tmsCode": 104,
    "name": "Hải Phòng",
    "codename": "hai_phong",
    "divisionType": "thành phố",
    "region": "bac",
    "mergedFrom": [
      "Hải Phòng",
      "Hải Dương"
    ],
    "communeCount": 106,
    "center": {
      "x": 300.4,
      "y": 181
    },
    "costumeIds": [
      "aodai",
      "tu_than"
    ],
    "costumeNames": [
      "Áo Dài",
      "Áo Tứ Thân"
    ],
    "heritageHighlight": "Thành phố cảng hoa phượng đỏ, làng gốm Chu Đậu và tơ đồng bằng"
  },
  {
    "id": "hung_yen",
    "code": 5,
    "tmsCode": 105,
    "name": "Hưng Yên",
    "codename": "hung_yen",
    "divisionType": "tỉnh",
    "region": "bac",
    "mergedFrom": [
      "Hưng Yên",
      "Thái Bình"
    ],
    "communeCount": 105,
    "center": {
      "x": 283.9,
      "y": 201.6
    },
    "costumeIds": [
      "tu_than"
    ],
    "costumeNames": [
      "Áo Tứ Thân",
      "Áo Cánh Đũi"
    ],
    "heritageHighlight": "Phố Hiến đệ nhị danh thắng, vựa lúa châu thổ sông Hồng và vải đũi dệt thủ công"
  },
  {
    "id": "ninh_binh",
    "code": 6,
    "tmsCode": 106,
    "name": "Ninh Bình",
    "codename": "ninh_binh",
    "divisionType": "tỉnh",
    "region": "bac",
    "mergedFrom": [
      "Ninh Bình",
      "Nam Định",
      "Hà Nam"
    ],
    "communeCount": 129,
    "center": {
      "x": 270.3,
      "y": 222.7
    },
    "costumeIds": [
      "tu_than",
      "ngu_than"
    ],
    "costumeNames": [
      "Áo Tứ Thân",
      "Áo Ngũ Thân"
    ],
    "heritageHighlight": "Cố đô Hoa Lư ngàn năm, đền Trần linh thiêng và cái nôi dệt tơ tằm Cổ Chất"
  },
  {
    "id": "cao_bang",
    "code": 7,
    "tmsCode": 107,
    "name": "Cao Bằng",
    "codename": "cao_bang",
    "divisionType": "tỉnh",
    "region": "bac",
    "mergedFrom": [
      "Cao Bằng"
    ],
    "communeCount": 56,
    "center": {
      "x": 268.8,
      "y": 44.8
    },
    "costumeIds": [
      "mong_lanh"
    ],
    "costumeNames": [
      "Trang phục Tày - Nùng",
      "Váy Lanh H'Mông"
    ],
    "heritageHighlight": "Thác Bản Giốc hùng vĩ, áo chàm nhuộm lá cây tự nhiên và hoa văn thổ cẩm"
  },
  {
    "id": "tuyen_quang",
    "code": 8,
    "tmsCode": 108,
    "name": "Tuyên Quang",
    "codename": "tuyen_quang",
    "divisionType": "tỉnh",
    "region": "bac",
    "mergedFrom": [
      "Tuyên Quang",
      "Hà Giang"
    ],
    "communeCount": 87,
    "center": {
      "x": 204.8,
      "y": 63.4
    },
    "costumeIds": [
      "mong_lanh"
    ],
    "costumeNames": [
      "Váy Lanh H'Mông Hoa",
      "Trang phục Lô Lô"
    ],
    "heritageHighlight": "Cao nguyên đá Đồng Văn, ruộng bậc thang và hoa văn vẽ sáp ong tinh xảo"
  },
  {
    "id": "lao_cai",
    "code": 9,
    "tmsCode": 109,
    "name": "Lào Cai",
    "codename": "lao_cai",
    "divisionType": "tỉnh",
    "region": "bac",
    "mergedFrom": [
      "Lào Cai",
      "Yên Bái"
    ],
    "communeCount": 88,
    "center": {
      "x": 147.7,
      "y": 94.5
    },
    "costumeIds": [
      "mong_lanh",
      "co_thai"
    ],
    "costumeNames": [
      "H'Mông Đen",
      "Dao Đỏ",
      "Cỏ Thái"
    ],
    "heritageHighlight": "Đỉnh Fansipan nóc nhà Đông Dương, chợ tình Sa Pa và trang phục rực rỡ sắc màu"
  },
  {
    "id": "thai_nguyen",
    "code": 10,
    "tmsCode": 110,
    "name": "Thái Nguyên",
    "codename": "thai_nguyen",
    "divisionType": "tỉnh",
    "region": "bac",
    "mergedFrom": [
      "Thái Nguyên",
      "Bắc Kạn"
    ],
    "communeCount": 75,
    "center": {
      "x": 256.1,
      "y": 101.4
    },
    "costumeIds": [
      "tu_than",
      "mong_lanh"
    ],
    "costumeNames": [
      "Trang phục Tày",
      "Nùng",
      "Dao"
    ],
    "heritageHighlight": "Hồ Ba Bể trong xanh, xứ trà Tân Cương trứ danh và điệu then đàn tính"
  },
  {
    "id": "lang_son",
    "code": 11,
    "tmsCode": 111,
    "name": "Lạng Sơn",
    "codename": "lang_son",
    "divisionType": "tỉnh",
    "region": "bac",
    "mergedFrom": [
      "Lạng Sơn"
    ],
    "communeCount": 65,
    "center": {
      "x": 310.6,
      "y": 111.9
    },
    "costumeIds": [
      "mong_lanh"
    ],
    "costumeNames": [
      "Áo Chàm Nùng",
      "Thổ Cẩm Tày"
    ],
    "heritageHighlight": "Ải Chi Lăng lịch sử, hoa hồi xứ Lạng và nếp áo chàm bình dị miền biên cương"
  },
  {
    "id": "phu_tho",
    "code": 12,
    "tmsCode": 112,
    "name": "Phú Thọ",
    "codename": "phu_tho",
    "divisionType": "tỉnh",
    "region": "bac",
    "mergedFrom": [
      "Phú Thọ",
      "Vĩnh Phúc",
      "Hòa Bình"
    ],
    "communeCount": 148,
    "center": {
      "x": 218.1,
      "y": 170.9
    },
    "costumeIds": [
      "tu_than",
      "co_thai"
    ],
    "costumeNames": [
      "Áo Tứ Thân",
      "Trang Phục Mường"
    ],
    "heritageHighlight": "Đền Hùng cội nguồn dân tộc, cái nôi người Mường cổ với cạp váy thêu rồng phụng"
  },
  {
    "id": "dien_bien",
    "code": 13,
    "tmsCode": 113,
    "name": "Điện Biên",
    "codename": "dien_bien",
    "divisionType": "tỉnh",
    "region": "bac",
    "mergedFrom": [
      "Điện Biên"
    ],
    "communeCount": 45,
    "center": {
      "x": 56.2,
      "y": 118.6
    },
    "costumeIds": [
      "co_thai",
      "mong_lanh"
    ],
    "costumeNames": [
      "Áo Cỏ Thái",
      "Váy Lanh H'Mông"
    ],
    "heritageHighlight": "Thung lũng Mường Thanh, hàng cúc bướm bạc óng ánh và hoa ban Tây Bắc"
  },
  {
    "id": "lai_chau",
    "code": 14,
    "tmsCode": 114,
    "name": "Lai Châu",
    "codename": "lai_chau",
    "divisionType": "tỉnh",
    "region": "bac",
    "mergedFrom": [
      "Lai Châu"
    ],
    "communeCount": 38,
    "center": {
      "x": 68.2,
      "y": 70.3
    },
    "costumeIds": [
      "co_thai",
      "mong_lanh"
    ],
    "costumeNames": [
      "Áo Cỏ Thái Trắng",
      "Trang phục Lự"
    ],
    "heritageHighlight": "Đèo Ô Quy Hồ quanh co, váy dệt hoa văn hình thoi và trang sức bạc thủ công"
  },
  {
    "id": "son_la",
    "code": 15,
    "tmsCode": 115,
    "name": "Sơn La",
    "codename": "son_la",
    "divisionType": "tỉnh",
    "region": "bac",
    "mergedFrom": [
      "Sơn La"
    ],
    "communeCount": 75,
    "center": {
      "x": 132.1,
      "y": 160.2
    },
    "costumeIds": [
      "co_thai"
    ],
    "costumeNames": [
      "Áo Cỏ Thái Đen",
      "Khăn Piêu"
    ],
    "heritageHighlight": "Cao nguyên Mộc Châu mùa hoa cải, chiếc khăn piêu thêu chỉ ngũ sắc huyền thoại"
  },
  {
    "id": "thanh_hoa",
    "code": 16,
    "tmsCode": 116,
    "name": "Thanh Hóa",
    "codename": "thanh_hoa",
    "divisionType": "tỉnh",
    "region": "trung",
    "mergedFrom": [
      "Thanh Hóa"
    ],
    "communeCount": 166,
    "center": {
      "x": 214.3,
      "y": 244.4
    },
    "costumeIds": [
      "ngu_than",
      "tu_than"
    ],
    "costumeNames": [
      "Áo Ngũ Thân",
      "Áo Tứ Thân"
    ],
    "heritageHighlight": "Thành nhà Hồ di sản thế giới, vùng đất địa linh nhân kiệt và tơ lụa sông Mã"
  },
  {
    "id": "nghe_an",
    "code": 17,
    "tmsCode": 117,
    "name": "Nghệ An",
    "codename": "nghe_an",
    "divisionType": "tỉnh",
    "region": "trung",
    "mergedFrom": [
      "Nghệ An"
    ],
    "communeCount": 130,
    "center": {
      "x": 190.6,
      "y": 298.8
    },
    "costumeIds": [
      "ngu_than",
      "aodai"
    ],
    "costumeNames": [
      "Áo Dài",
      "Áo Ngũ Thân Nam"
    ],
    "heritageHighlight": "Quê hương Chủ tịch Hồ Chí Minh, điệu ví giặm đò đưa và nếp áo nho sinh truyền thống"
  },
  {
    "id": "ha_tinh",
    "code": 18,
    "tmsCode": 118,
    "name": "Hà Tĩnh",
    "codename": "ha_tinh",
    "divisionType": "tỉnh",
    "region": "trung",
    "mergedFrom": [
      "Hà Tĩnh"
    ],
    "communeCount": 69,
    "center": {
      "x": 251.7,
      "y": 372.3
    },
    "costumeIds": [
      "aodai",
      "ngu_than"
    ],
    "costumeNames": [
      "Áo Dài Truyền Thống"
    ],
    "heritageHighlight": "Dãy Hồng Lĩnh 99 ngọn, quê hương Đại thi hào Nguyễn Du và tơ lụa sông Lam"
  },
  {
    "id": "quang_tri",
    "code": 19,
    "tmsCode": 119,
    "name": "Quảng Trị",
    "codename": "quang_tri",
    "divisionType": "tỉnh",
    "region": "trung",
    "mergedFrom": [
      "Quảng Trị",
      "Quảng Bình"
    ],
    "communeCount": 77,
    "center": {
      "x": 306.1,
      "y": 451.2
    },
    "costumeIds": [
      "aodai",
      "ngu_than"
    ],
    "costumeNames": [
      "Áo Dài Lập Lĩnh"
    ],
    "heritageHighlight": "Vườn quốc gia Phong Nha - Kẻ Bàng, dòng sông Thạch Hãn và nếp áo chững chạc miền cát trắng"
  },
  {
    "id": "hue",
    "code": 20,
    "tmsCode": 120,
    "name": "Huế",
    "codename": "hue",
    "divisionType": "thành phố",
    "region": "trung",
    "mergedFrom": [
      "Thừa Thiên Huế"
    ],
    "communeCount": 40,
    "center": {
      "x": 381.6,
      "y": 513.7
    },
    "costumeIds": [
      "ngu_than",
      "aodai"
    ],
    "costumeNames": [
      "Áo Ngũ Thân Lập Lĩnh",
      "Áo Nhật Bình",
      "Áo Tấc"
    ],
    "heritageHighlight": "Kinh đô triều Nguyễn, cái nôi chuẩn mực định hình chiếc áo ngũ thân và áo dài quốc phục"
  },
  {
    "id": "da_nang",
    "code": 21,
    "tmsCode": 121,
    "name": "Đà Nẵng",
    "codename": "da_nang",
    "divisionType": "thành phố",
    "region": "trung",
    "mergedFrom": [
      "Đà Nẵng",
      "Quảng Nam"
    ],
    "communeCount": 94,
    "center": {
      "x": 412.3,
      "y": 556
    },
    "costumeIds": [
      "aodai",
      "ngu_than"
    ],
    "costumeNames": [
      "Áo Dài Phố Hội",
      "Áo Tấc"
    ],
    "heritageHighlight": "Phố cổ Hội An đèn lồng rực rỡ, lụa Mã Châu danh tiếng và quần đảo Hoàng Sa thiêng liêng"
  },
  {
    "id": "quang_ngai",
    "code": 22,
    "tmsCode": 122,
    "name": "Quảng Ngãi",
    "codename": "quang_ngai",
    "divisionType": "tỉnh",
    "region": "trung",
    "mergedFrom": [
      "Quảng Ngãi",
      "Kon Tum"
    ],
    "communeCount": 100,
    "center": {
      "x": 422.5,
      "y": 623
    },
    "costumeIds": [
      "ede_tho_cam",
      "aodai"
    ],
    "costumeNames": [
      "Thổ Cẩm Ba Na",
      "Áo Dài"
    ],
    "heritageHighlight": "Đảo Lý Sơn tiền tiêu, nhà rông Tây Nguyên đại ngàn và thổ cẩm người Ba Na, Xơ Đăng"
  },
  {
    "id": "khanh_hoa",
    "code": 23,
    "tmsCode": 123,
    "name": "Khánh Hòa",
    "codename": "khanh_hoa",
    "divisionType": "tỉnh",
    "region": "trung",
    "mergedFrom": [
      "Khánh Hòa",
      "Ninh Thuận"
    ],
    "communeCount": 65,
    "center": {
      "x": 492.7,
      "y": 818
    },
    "costumeIds": [
      "champa_tho_cam",
      "aodai"
    ],
    "costumeNames": [
      "Trang Phục Cổ Chăm",
      "Váy Dệt Mỹ Nghiệp"
    ],
    "heritageHighlight": "Tháp Bà Ponagar nghìn năm, làng dệt thổ cẩm Mỹ Nghiệp và quần đảo Trường Sa chủ quyền biển đảo"
  },
  {
    "id": "gia_lai",
    "code": 24,
    "tmsCode": 124,
    "name": "Gia Lai",
    "codename": "gia_lai",
    "divisionType": "tỉnh",
    "region": "taynguyen",
    "mergedFrom": [
      "Gia Lai",
      "Bình Định"
    ],
    "communeCount": 135,
    "center": {
      "x": 457,
      "y": 689.5
    },
    "costumeIds": [
      "ede_tho_cam"
    ],
    "costumeNames": [
      "Thổ Cẩm Jrai",
      "Áo Dài Võ Cổ Truyền"
    ],
    "heritageHighlight": "Biển Hồ Pleiku đôi mắt ngọc, tiếng cồng chiêng vang vọng và miền đất võ Bình Định anh hùng"
  },
  {
    "id": "dak_lak",
    "code": 25,
    "tmsCode": 125,
    "name": "Đắk Lắk",
    "codename": "dak_lak",
    "divisionType": "tỉnh",
    "region": "taynguyen",
    "mergedFrom": [
      "Đắk Lắk",
      "Phú Yên"
    ],
    "communeCount": 102,
    "center": {
      "x": 460.3,
      "y": 761.7
    },
    "costumeIds": [
      "ede_tho_cam"
    ],
    "costumeNames": [
      "Áo Chui Đầu Ê Đê",
      "Váy Tấm Hoa Văn"
    ],
    "heritageHighlight": "Thủ phủ cà phê Buôn Ma Thuột, ghềnh Đá Đĩa Phú Yên và hoa văn cồng chiêng rực lửa"
  },
  {
    "id": "lam_dong",
    "code": 26,
    "tmsCode": 126,
    "name": "Lâm Đồng",
    "codename": "lam_dong",
    "divisionType": "tỉnh",
    "region": "taynguyen",
    "mergedFrom": [
      "Lâm Đồng",
      "Đắk Nông",
      "Bình Thuận"
    ],
    "communeCount": 124,
    "center": {
      "x": 414.5,
      "y": 858.7
    },
    "costumeIds": [
      "ede_tho_cam",
      "champa_tho_cam"
    ],
    "costumeNames": [
      "Thổ Cẩm M'Nông",
      "Cơ Ho",
      "Chăm"
    ],
    "heritageHighlight": "Thành phố ngàn hoa Đà Lạt, hồ Tà Đùng vịnh Hạ Long Tây Nguyên và đồi cát Mũi Né"
  },
  {
    "id": "tay_ninh",
    "code": 27,
    "tmsCode": 127,
    "name": "Tây Ninh",
    "codename": "tay_ninh",
    "divisionType": "tỉnh",
    "region": "nam",
    "mergedFrom": [
      "Tây Ninh",
      "Long An"
    ],
    "communeCount": 96,
    "center": {
      "x": 283.1,
      "y": 904
    },
    "costumeIds": [
      "ba_ba",
      "aodai"
    ],
    "costumeNames": [
      "Áo Bà Ba Nam Bộ",
      "Áo Dài Trắng"
    ],
    "heritageHighlight": "Núi Bà Đen nóc nhà Nam Bộ, vùng đất Vàm Cỏ Đông hào hùng và nếp áo bà ba mộc mạc"
  },
  {
    "id": "dong_nai",
    "code": 28,
    "tmsCode": 128,
    "name": "Đồng Nai",
    "codename": "dong_nai",
    "divisionType": "tỉnh",
    "region": "nam",
    "mergedFrom": [
      "Đồng Nai",
      "Bình Phước"
    ],
    "communeCount": 95,
    "center": {
      "x": 343,
      "y": 883.6
    },
    "costumeIds": [
      "ba_ba",
      "ede_tho_cam"
    ],
    "costumeNames": [
      "Áo Bà Ba",
      "Thổ Cẩm S'tiêng"
    ],
    "heritageHighlight": "Vườn quốc gia Cát Tiên, rừng cao su bạt ngàn và nếp sinh hoạt miền Đông gian lao mà anh dũng"
  },
  {
    "id": "ho_chi_minh",
    "code": 29,
    "tmsCode": 129,
    "name": "Hồ Chí Minh",
    "codename": "ho_chi_minh",
    "divisionType": "thành phố",
    "region": "nam",
    "mergedFrom": [
      "Hồ Chí Minh",
      "Bình Dương",
      "Bà Rịa - Vũng Tàu"
    ],
    "communeCount": 168,
    "center": {
      "x": 332.4,
      "y": 923.9
    },
    "costumeIds": [
      "aodai",
      "ba_ba"
    ],
    "costumeNames": [
      "Áo Dài Cách Tân Sài Gòn",
      "Áo Bà Ba Đen"
    ],
    "heritageHighlight": "Trung tâm kinh tế phồn hoa, sông Sài Gòn, bờ biển Vũng Tàu và quần đảo Côn Đảo bất khuất"
  },
  {
    "id": "vinh_long",
    "code": 30,
    "tmsCode": 130,
    "name": "Vĩnh Long",
    "codename": "vinh_long",
    "divisionType": "tỉnh",
    "region": "nam",
    "mergedFrom": [
      "Vĩnh Long",
      "Bến Tre",
      "Trà Vinh"
    ],
    "communeCount": 124,
    "center": {
      "x": 290.2,
      "y": 976.7
    },
    "costumeIds": [
      "ba_ba",
      "sampot"
    ],
    "costumeNames": [
      "Áo Bà Ba Khăn Rằn",
      "Sampot Khmer"
    ],
    "heritageHighlight": "Xứ dừa Bến Tre thanh bình, cầu Cổ Chiên nối đôi bờ phù sa và chùa Khmer cổ kính Trà Vinh"
  },
  {
    "id": "dong_thap",
    "code": 31,
    "tmsCode": 131,
    "name": "Đồng Tháp",
    "codename": "dong_thap",
    "divisionType": "tỉnh",
    "region": "nam",
    "mergedFrom": [
      "Đồng Tháp",
      "Tiền Giang"
    ],
    "communeCount": 102,
    "center": {
      "x": 270,
      "y": 942.5
    },
    "costumeIds": [
      "ba_ba"
    ],
    "costumeNames": [
      "Áo Bà Ba Sông Nước",
      "Khăn Rằn Nam Bộ"
    ],
    "heritageHighlight": "Đồng Tháp Mười sen hồng bát ngát, chợ nổi Cái Bè sầm uất và vườn trái cây trĩu quả Tiền Giang"
  },
  {
    "id": "an_giang",
    "code": 32,
    "tmsCode": 132,
    "name": "An Giang",
    "codename": "an_giang",
    "divisionType": "tỉnh",
    "region": "nam",
    "mergedFrom": [
      "An Giang",
      "Kiên Giang"
    ],
    "communeCount": 102,
    "center": {
      "x": 190.1,
      "y": 965.7
    },
    "costumeIds": [
      "ba_ba",
      "champa_tho_cam",
      "sampot"
    ],
    "costumeNames": [
      "Áo Bà Ba",
      "Thổ Cẩm Chăm Châu Phong",
      "Sampot"
    ],
    "heritageHighlight": "Rừng tràm Trà Sư xanh mướt, dãy Thất Sơn huyền bí, làng Chăm ven sông Hậu và đảo ngọc Phú Quốc"
  },
  {
    "id": "can_tho",
    "code": 33,
    "tmsCode": 133,
    "name": "Cần Thơ",
    "codename": "can_tho",
    "divisionType": "thành phố",
    "region": "nam",
    "mergedFrom": [
      "Cần Thơ",
      "Hậu Giang",
      "Sóc Trăng"
    ],
    "communeCount": 103,
    "center": {
      "x": 258.6,
      "y": 998.1
    },
    "costumeIds": [
      "ba_ba",
      "sampot"
    ],
    "costumeNames": [
      "Áo Bà Ba Trắng",
      "Sampot Lễ Hội Khmer"
    ],
    "heritageHighlight": "Đô thị miền Tây gạo trắng nước trong, chợ nổi Cái Răng, lễ hội đua ghe Ngo Ooc Om Boc tưng bừng"
  },
  {
    "id": "ca_mau",
    "code": 34,
    "tmsCode": 134,
    "name": "Cà Mau",
    "codename": "ca_mau",
    "divisionType": "tỉnh",
    "region": "nam",
    "mergedFrom": [
      "Cà Mau",
      "Bạc Liêu"
    ],
    "communeCount": 64,
    "center": {
      "x": 213,
      "y": 1043.5
    },
    "costumeIds": [
      "ba_ba"
    ],
    "costumeNames": [
      "Áo Bà Ba Đen Đước",
      "Khăn Rằn Quấn Cổ"
    ],
    "heritageHighlight": "Mũi Cà Mau điểm cực Nam Tổ quốc, rừng đước U Minh bạt ngàn và giai thoại Công tử Bạc Liêu hào sảng"
  }
];

export const PROVINCES_34_BY_ID: Record<string, Province34> = Object.fromEntries(
  PROVINCES_34_LIST.map((p) => [p.id, p])
);

export const PROVINCES_BY_REGION: Record<string, Province34[]> = {
  bac: PROVINCES_34_LIST.filter((p) => p.region === "bac"),
  trung: PROVINCES_34_LIST.filter((p) => p.region === "trung"),
  taynguyen: PROVINCES_34_LIST.filter((p) => p.region === "taynguyen"),
  nam: PROVINCES_34_LIST.filter((p) => p.region === "nam"),
};
