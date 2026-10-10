/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CaThamTu } from "../types";

export const caThamTu: CaThamTu[] = [
  {
    id: "t1",
    boPhoi: { trangPhuc: "tu_than", phuKien: ["khan_dong"] },
    loiSai: "phuKien:khan_dong",
    lyDo: "Khăn đóng thường gắn với nam giới; đội với áo tứ thân nữ Bắc Bộ là lệch bối cảnh."
  },
  {
    id: "t2",
    boPhoi: { trangPhuc: "co_thai", hoaVanThem: "mong" },
    loiSai: "hoaVanThem",
    lyDo: "Trộn hoa văn đặc trưng của hai dân tộc trong cùng một bộ dễ làm mất ý nghĩa riêng."
  },
  {
    id: "t3",
    boPhoi: { trangPhuc: "aodai", phuKien: ["non_la"] },
    loiSai: null,
    lyDo: "Bộ này ổn: áo dài và nón lá là cặp quen thuộc."
  }
];
