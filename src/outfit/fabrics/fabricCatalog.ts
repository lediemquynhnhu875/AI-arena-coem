/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * DANH MỤC LOẠI VẢI & CHẤT LIỆU DI SẢN (FABRICS CATALOG)
 */

import { Vai } from "../../types";

export interface VaiNangCao extends Vai {
  camGiac: string;
  doDay: "mỏng nhẹ" | "trung bình" | "dày dặn";
  phuHopTrangPhuc: string[];
}

export const FABRIC_CATALOG: VaiNangCao[] = [
  {
    id: "lua_van_phuc",
    ten: "Lụa Vạn Phúc",
    langNghe: "Làng Vạn Phúc, Hà Đông, Hà Nội",
    kyThuat: "Dệt tơ tằm cổ truyền nghìn năm",
    camGiac: "Mịn màng, óng ả, mát rượi vào hè, ấm áp vào đông.",
    doDay: "mỏng nhẹ",
    phuHopTrangPhuc: ["aodai", "ngu_than", "tu_than"],
    suThat: [
      "Vạn Phúc là làng nghề dệt lụa tơ tằm cổ kính nổi tiếng bậc nhất Bắc Bộ.",
      "Từng được chọn dệt trang phục cho triều đình nhà Nguyễn."
    ],
    nguonIds: ["nguon_van_phuc"]
  },
  {
    id: "cham_nhuom",
    ten: "Vải chàm tự nhiên",
    langNghe: "Bản làng Tày, Nùng, Dao, Thái Tây Bắc",
    kyThuat: "Nhuộm thảo mộc từ cao cây chàm lên men vôi",
    camGiac: "Chắc sợi, màu trầm thơm mùi cỏ cây, bền màu qua nhiều năm.",
    doDay: "trung bình",
    phuHopTrangPhuc: ["co_thai", "ba_ba", "tu_than"],
    suThat: [
      "Màu chàm bảo vệ làn da khỏi muỗi rừng và nắng gắt vùng cao.",
      "Mỗi tấm vải chàm phải nhuộm đi nhuộm lại hàng chục lần dưới nắng."
    ],
    nguonIds: ["nguon_tay_bac"]
  },
  {
    id: "tho_cam_champa",
    ten: "Thổ cẩm Chăm Mỹ Nghiệp",
    langNghe: "Làng Mỹ Nghiệp, Ninh Thuận",
    kyThuat: "Dệt thoi tay hoa văn tháp Chăm & quả trám",
    camGiac: "Dày dặn, gờ nổi hoa văn sắc sảo, màu son trầm quý phái.",
    doDay: "dày dặn",
    phuHopTrangPhuc: ["champa_tho_cam"],
    suThat: [
      "Làng dệt Mỹ Nghiệp lưu giữ nghệ thuật dệt thổ cẩm cổ xưa hàng trăm năm.",
      "Khung cửi Chăm truyền thống vận hành hoàn toàn bằng chân và đôi bàn tay khéo léo."
    ],
    nguonIds: ["nguon_my_nghiep"]
  },
  {
    id: "lanh_mong",
    ten: "Vải lanh H'Mông vẽ sáp ong",
    langNghe: "Cao nguyên đá Đồng Văn & vùng cao Hà Giang",
    kyThuat: "Tước vỏ cây lanh, vẽ sáp ong nóng chảy và nhuộm chàm",
    camGiac: "Thô mộc nguyên bản, xếp ly đanh chắc, càng giặt càng mềm.",
    doDay: "dày dặn",
    phuHopTrangPhuc: ["mong_lanh"],
    suThat: [
      "Phụ nữ Mông tước vỏ lanh thành sợi mảnh, xe sợi thành vải kỳ công suốt nhiều tháng.",
      "Bút vẽ sáp ong đòi hỏi sự tập trung cao độ tạo nên họa tiết đối xứng hoàn hảo."
    ],
    nguonIds: ["nguon_dong_van"]
  },
  {
    id: "tho_cam_ede",
    ten: "Thổ cẩm Ê Đê",
    langNghe: "Buôn làng Đắk Lắk & Tây Nguyên",
    kyThuat: "Dệt thắt lưng (backstrap loom) với sọc chỉ hình học",
    camGiac: "Cứng cáp, sợi chỉ nổi rõ rệt, màu đỏ vàng tương phản rực rỡ.",
    doDay: "dày dặn",
    phuHopTrangPhuc: ["ede_tho_cam"],
    suThat: [
      "Kỹ thuật dệt dùng lưng căng cửi chỉ có ở những vùng văn hóa cổ xưa.",
      "Hoa văn sọc đỏ trên nền đen tượng trưng cho ngọn lửa ấm trong căn nhà dài."
    ],
    nguonIds: ["nguon_tay_nguyen"]
  },
  {
    id: "lanh_my_a",
    ten: "Lãnh Mỹ A (Lụa mặc nưa)",
    langNghe: "Tân Châu, An Giang",
    kyThuat: "Dệt tơ tằm nhuộm trái mặc nưa tự nhiên",
    camGiac: "Đen tuyền huyền ảo, bóng bẩy như da thuộc, mềm mướt tuyệt đỉnh.",
    doDay: "trung bình",
    phuHopTrangPhuc: ["ba_ba", "aodai"],
    suThat: [
      "Được mệnh danh là 'Nữ hoàng của các loại lụa' vùng Nam Bộ.",
      "Trái mặc nưa nhuộm vải qua cả trăm lần phơi nắng tạo nên sắc đen sâu thẳm."
    ],
    nguonIds: ["nguon_tan_chau"]
  }
];
