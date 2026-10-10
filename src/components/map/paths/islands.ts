/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * TỌA ĐỘ VÀ VECTOR HẢI ĐẢO & QUẦN ĐẢO THIÊNG LIÊNG CỦA TỔ QUỐC VIỆT NAM
 * Chuẩn xác 100% theo hệ tọa độ địa lý Biển Đông (ViewBox chuẩn 0 0 920 1180):
 * - Quần đảo Hoàng Sa (Huyện đảo Hoàng Sa, trực thuộc Thành phố Đà Nẵng)
 * - Quần đảo Trường Sa (Huyện đảo Trường Sa, trực thuộc Tỉnh Khánh Hòa)
 * - Đảo ngọc Phú Quốc & Quần đảo Thổ Chu (Trực thuộc Tỉnh An Giang / Kiên Giang)
 * - Quần đảo Côn Đảo (Huyện Côn Đảo, trực thuộc TP. Hồ Chí Minh / Bà Rịa - Vũng Tàu)
 * - Đảo Bạch Long Vĩ & Quần đảo Cát Bà (Trực thuộc TP. Hải Phòng)
 * - Quần đảo Cô Tô & Đảo Vân Đồn (Trực thuộc Tỉnh Quảng Ninh)
 * - Đảo Cồn Cỏ (Trực thuộc Tỉnh Quảng Trị)
 * - Đảo Lý Sơn (Trực thuộc Tỉnh Quảng Ngãi)
 * - Đảo Phú Quý (Trực thuộc duyên hải Nam Trung Bộ / Bình Thuận)
 */

export interface IslandItem {
  id: string;
  name: string;
  subText: string;
  provinceId: string;
  path: string;
  atollPath?: string;
  labelPoint: { x: number; y: number };
  category: "archipelago" | "island";
  majorIslands: string[];
  sovereigntyNote: string;
  latLong: string;
  focusPoint: { x: number; y: number; zoom: number };
}

export const VIETNAM_ISLANDS: IslandItem[] = [
  // 1. QUẦN ĐẢO HOÀNG SA (THÀNH PHỐ ĐÀ NẴNG)
  {
    id: "hoang_sa",
    name: "Quần đảo Hoàng Sa",
    subText: "Thành phố Đà Nẵng",
    provinceId: "da_nang",
    category: "archipelago",
    latLong: "15°45' – 17°15' B, 111°00' – 113°00' Đ",
    sovereigntyNote: "Huyện đảo Hoàng Sa trực thuộc TP. Đà Nẵng. Cương vực thiêng liêng đời đời của Tổ quốc Việt Nam từ thời các chúa Nguyễn khai phá lập đội Hoàng Sa.",
    focusPoint: { x: -180, y: -80, zoom: 1.85 },
    majorIslands: [
      "Đảo Hoàng Sa",
      "Đảo Phú Lâm",
      "Đảo Tri Tôn",
      "Đảo Linh Côn",
      "Đảo Cây",
      "Đảo Quang Hòa",
      "Đảo Hữu Nhật",
      "Đảo Duy Mộng",
      "Đá Bắc"
    ],
    // Vành san hô ngầm / Atoll bao quanh các cụm đảo
    atollPath: "M 650 490 C 655 485 675 488 678 502 C 679 515 668 520 656 518 C 648 514 645 498 650 490 Z M 700 460 C 715 455 745 470 742 495 C 738 508 718 505 704 492 C 695 480 695 465 700 460 Z M 625 548 C 632 544 640 550 638 564 C 634 570 622 566 625 548 Z",
    // Các đảo nổi và đá san hô lớn: Cụm Lưỡi Liềm, Cụm An Vĩnh và Đảo Tri Tôn
    path: `
      M 658 497 C 662 494 667 498 665 503 C 662 506 657 503 658 497 Z
      M 655 500 C 658 499 660 502 658 505 C 656 507 653 504 655 500 Z
      M 665 504 C 670 502 672 507 669 510 C 665 512 662 508 665 504 Z
      M 668 502 C 672 501 674 505 671 508 C 668 509 666 506 668 502 Z
      M 708 474 C 714 471 718 477 714 482 C 709 485 705 480 708 474 Z
      M 704 463 C 708 461 711 465 709 468 C 706 470 702 467 704 463 Z
      M 736 487 C 742 485 744 491 740 495 C 735 497 732 492 736 487 Z
      M 707 466 C 711 465 712 469 710 472 C 707 473 705 470 707 466 Z
      M 629 552 C 634 550 636 556 633 559 C 628 562 625 557 629 552 Z
      M 650 455 C 655 453 658 458 655 462 C 650 464 647 459 650 455 Z
    `,
    labelPoint: { x: 685, y: 435 },
  },

  // 2. QUẦN ĐẢO TRƯỜNG SA (TỈNH KHÁNH HÒA)
  {
    id: "truong_sa",
    name: "Quần đảo Trường Sa",
    subText: "Tỉnh Khánh Hòa",
    provinceId: "khanh_hoa",
    category: "archipelago",
    latLong: "6°30' – 12°00' B, 111°30' – 117°20' Đ",
    sovereigntyNote: "Huyện đảo Trường Sa trực thuộc Tỉnh Khánh Hòa. Bao gồm các cụm Song Tử, Thị Tứ, Nam Yết, Sinh Tồn, Trường Sa Lớn, An Bang, vững vàng nơi đầu sóng ngọn gió.",
    focusPoint: { x: -240, y: -420, zoom: 1.85 },
    majorIslands: [
      "Đảo Trường Sa Lớn",
      "Đảo Song Tử Tây",
      "Đảo Sinh Tồn",
      "Đảo Nam Yết",
      "Đảo Sơn Ca",
      "Đảo Phan Vinh",
      "Đảo An Bang",
      "Đảo Thuyền Chài",
      "Đảo Tiên Nữ",
      "Đảo Trường Sa Đông",
      "Đá Tây"
    ],
    // Vành san hô atoll biển sâu Trường Sa
    atollPath: "M 842 872 C 852 868 860 875 858 888 C 852 895 840 885 842 872 Z M 840 950 C 865 945 872 970 864 985 C 855 995 842 985 840 950 Z M 840 985 C 858 980 870 990 866 1005 C 858 1012 842 1005 840 985 Z M 670 1075 C 688 1070 695 1092 688 1102 C 678 1106 668 1095 670 1075 Z M 768 1112 C 785 1108 792 1128 784 1138 C 772 1142 764 1130 768 1112 Z M 740 1135 C 755 1130 760 1148 754 1156 C 745 1160 738 1148 740 1135 Z",
    // Các đảo nổi và điểm tựa chủ quyền thiêng liêng
    path: `
      M 848 877 C 853 874 856 879 853 883 C 849 886 845 882 848 877 Z
      M 851 876 C 855 874 857 878 855 881 C 852 883 849 880 851 876 Z
      M 844 905 C 849 902 853 907 850 911 C 846 914 842 910 844 905 Z
      M 857 956 C 862 953 866 958 863 962 C 859 965 855 961 857 956 Z
      M 850 970 C 855 967 858 972 855 976 C 851 979 847 975 850 970 Z
      M 848 993 C 853 990 856 995 853 999 C 849 1002 845 998 848 993 Z
      M 862 991 C 866 989 868 993 866 996 C 863 998 860 995 862 991 Z
      M 679 1084 C 686 1081 690 1087 686 1092 C 681 1096 676 1091 679 1084 Z
      M 709 1063 C 714 1061 717 1066 714 1070 C 710 1073 707 1068 709 1063 Z
      M 748 1069 C 754 1067 756 1072 753 1076 C 749 1079 745 1075 748 1069 Z
      M 803 1061 C 809 1058 812 1064 809 1068 C 804 1071 800 1067 803 1061 Z
      M 822 1072 C 827 1070 829 1075 826 1078 C 822 1080 819 1076 822 1072 Z
      M 870 1068 C 875 1066 878 1071 875 1074 C 871 1076 867 1072 870 1068 Z
      M 775 1120 C 781 1117 784 1123 781 1127 C 777 1130 772 1126 775 1120 Z
      M 747 1141 C 753 1139 756 1144 752 1148 C 748 1151 744 1147 747 1141 Z
    `,
    labelPoint: { x: 780, y: 848 },
  },

  // 3. ĐẢO NGỌC PHÚ QUỐC (TỈNH AN GIANG / KIÊN GIANG)
  {
    id: "phu_quoc",
    name: "Đảo Phú Quốc",
    subText: "Tỉnh An Giang",
    provinceId: "an_giang",
    category: "island",
    latLong: "10°01' – 10°27' B, 103°50' – 104°05' Đ",
    sovereigntyNote: "Thành phố đảo Phú Quốc, hòn ngọc giữa Vịnh Thái Lan, thiên đường du lịch và nguồn cội nước mắm cá cơm truyền thống trăm năm.",
    focusPoint: { x: 230, y: -330, zoom: 2.1 },
    majorIslands: [
      "Đảo Phú Quốc",
      "Quần đảo An Thới",
      "Hòn Thơm",
      "Hòn Mây Rút",
      "Hòn Móng Tay"
    ],
    path: `
      M 116 952 C 122 948 128 952 130 960 C 132 970 128 980 126 990 C 124 996 120 994 118 986 C 114 976 112 962 116 952 Z
      M 124 998 C 126 996 128 998 127 1002 C 125 1004 123 1002 124 998 Z
    `,
    labelPoint: { x: 123, y: 938 },
  },

  // 4. QUẦN ĐẢO THỔ CHU (TỈNH AN GIANG / KIÊN GIANG)
  {
    id: "tho_chu",
    name: "Quần đảo Thổ Chu",
    subText: "Tỉnh An Giang",
    provinceId: "an_giang",
    category: "archipelago",
    latLong: "9°18' B, 103°29' Đ",
    sovereigntyNote: "Quần đảo tiền tiêu phía Tây Nam Tổ quốc, nằm giữa Vịnh Thái Lan.",
    focusPoint: { x: 260, y: -380, zoom: 2.3 },
    majorIslands: ["Đảo Thổ Chu", "Hòn Nhạn", "Hòn Xanh", "Hòn Cao"],
    path: "M 88 1036 C 92 1034 96 1037 94 1041 C 91 1044 87 1042 88 1036 Z",
    labelPoint: { x: 88, y: 1052 },
  },

  // 5. QUẦN ĐẢO CÔN ĐẢO (TP. HỒ CHÍ MINH / BÀ RỊA - VŨNG TÀU)
  {
    id: "con_dao",
    name: "Quần đảo Côn Đảo",
    subText: "TP. Hồ Chí Minh",
    provinceId: "ho_chi_minh",
    category: "archipelago",
    latLong: "8°41' B, 106°36' Đ",
    sovereigntyNote: "Huyện Côn Đảo, vùng đất lịch sử thiêng liêng bất khuất, vườn quốc gia Côn Đảo xanh ngát giữa biển khơi Đông Nam Bộ.",
    focusPoint: { x: 60, y: -410, zoom: 2.2 },
    majorIslands: [
      "Côn Sơn",
      "Hòn Bảy Cạnh",
      "Hòn Cau",
      "Hòn Bà",
      "Hòn Trứng"
    ],
    path: `
      M 306 1082 C 312 1078 322 1080 324 1086 C 322 1092 314 1094 308 1090 C 304 1087 304 1083 306 1082 Z
      M 326 1086 C 330 1084 333 1088 331 1091 C 328 1093 325 1090 326 1086 Z
      M 312 1094 C 315 1093 317 1096 315 1098 C 313 1099 311 1097 312 1094 Z
    `,
    labelPoint: { x: 316, y: 1068 },
  },

  // 6. ĐẢO BẠCH LONG VĨ (TP. HẢI PHÒNG)
  {
    id: "bach_long_vi",
    name: "Đảo Bạch Long Vĩ",
    subText: "TP. Hải Phòng",
    provinceId: "hai_phong",
    category: "island",
    latLong: "20°08' B, 107°43' Đ",
    sovereigntyNote: "Huyện đảo Bạch Long Vĩ, 'chiếc đuôi rồng trắng' trấn giữ trung tâm Vịnh Bắc Bộ thiêng liêng.",
    focusPoint: { x: 0, y: 120, zoom: 2.2 },
    majorIslands: ["Đảo Bạch Long Vĩ"],
    path: "M 386 230 C 390 228 393 232 391 235 C 388 238 385 235 386 230 Z",
    labelPoint: { x: 410, y: 232 },
  },

  // 7. QUẦN ĐẢO CÔ TÔ (TỈNH QUẢNG NINH)
  {
    id: "co_to",
    name: "Quần đảo Cô Tô",
    subText: "Tỉnh Quảng Ninh",
    provinceId: "quang_ninh",
    category: "archipelago",
    latLong: "20°59' B, 107°46' Đ",
    sovereigntyNote: "Huyện đảo Cô Tô - viên ngọc xanh phía Đông Bắc, nơi Bác Hồ cho phép dựng tượng Người khi Người về thăm năm 1961.",
    focusPoint: { x: -20, y: 180, zoom: 2.2 },
    majorIslands: ["Cô Tô Lớn", "Cô Tô Con", "Đảo Thanh Lân", "Hòn Trần"],
    path: `
      M 386 166 C 391 164 394 168 392 172 C 388 174 385 171 386 166 Z
      M 394 169 C 397 167 399 170 398 173 C 395 175 393 173 394 169 Z
    `,
    labelPoint: { x: 405, y: 165 },
  },

  // 8. QUẦN ĐẢO CÁT BÀ (TP. HẢI PHÒNG)
  {
    id: "cat_ba",
    name: "Quần đảo Cát Bà",
    subText: "TP. Hải Phòng",
    provinceId: "hai_phong",
    category: "archipelago",
    latLong: "20°44' B, 107°03' Đ",
    sovereigntyNote: "Khu dự trữ sinh quyển thế giới Cát Bà & Di sản Thiên nhiên Thế giới Vịnh Hạ Long - Quần đảo Cát Bà (UNESCO).",
    focusPoint: { x: 10, y: 170, zoom: 2.2 },
    majorIslands: ["Đảo Cát Bà", "Hòn Cát Ông", "Hòn Mây"],
    path: "M 336 184 C 342 181 346 186 344 191 C 340 194 335 191 336 184 Z",
    labelPoint: { x: 345, y: 198 },
  },

  // 9. ĐẢO CỒN CỎ (TỈNH QUẢNG TRỊ)
  {
    id: "con_co",
    name: "Đảo Cồn Cỏ",
    subText: "Tỉnh Quảng Trị",
    provinceId: "quang_tri",
    category: "island",
    latLong: "17°09' B, 107°22' Đ",
    sovereigntyNote: "Huyện đảo Cồn Cỏ - con mắt thần canh giữ biển trời Trung Bộ, hòn đảo tiền tiêu kiên cường trong kháng chiến.",
    focusPoint: { x: 0, y: -20, zoom: 2.2 },
    majorIslands: ["Đảo Cồn Cỏ"],
    path: "M 361 450 C 365 448 368 452 366 455 C 363 458 360 455 361 450 Z",
    labelPoint: { x: 382, y: 452 },
  },

  // 10. ĐẢO LÝ SƠN (TỈNH QUẢNG NGÃI)
  {
    id: "ly_son",
    name: "Đảo Lý Sơn",
    subText: "Tỉnh Quảng Ngãi",
    provinceId: "quang_ngai",
    category: "island",
    latLong: "15°23' B, 109°07' Đ",
    sovereigntyNote: "Quê hương của Đội Hùng binh Hoàng Sa kiêm quản Trường Sa, cái nôi Lễ khao lề thế lính Hoàng Sa di sản văn hóa phi vật thể quốc gia.",
    focusPoint: { x: -80, y: -130, zoom: 2.1 },
    majorIslands: ["Đảo Lớn (Cù Lao Ré)", "Đảo Bé (Cù Lao Bờ Bãi)", "Hòn Mù Cu"],
    path: "M 486 584 C 491 582 494 586 492 590 C 488 593 485 589 486 584 Z",
    labelPoint: { x: 508, y: 586 },
  },

  // 11. ĐẢO PHÚ QUÝ (TỈNH BÌNH THUẬN / NAM TRUNG BỘ)
  {
    id: "phu_quy",
    name: "Đảo Phú Quý",
    subText: "Nam Trung Bộ",
    provinceId: "khanh_hoa", // Liên kết vùng Duyên hải Nam Trung Bộ
    category: "island",
    latLong: "10°32' B, 108°57' Đ",
    sovereigntyNote: "Huyện đảo Phú Quý (Cù Lao Thu), hòn đảo trù phú và thanh bình giữa biển khơi Duyên hải Nam Trung Bộ.",
    focusPoint: { x: -70, y: -340, zoom: 2.2 },
    majorIslands: ["Đảo Phú Quý", "Hòn Tranh", "Hòn Đen", "Hòn Trứng"],
    path: "M 471 944 C 476 942 479 946 477 950 C 473 953 470 949 471 944 Z",
    labelPoint: { x: 494, y: 946 },
  },
];
