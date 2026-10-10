/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect } from "react";
import { trangPhuc } from "../data/trangphuc";
import { nhom } from "../data/nhom";
import { QueNhaData, TrangPhuc } from "../types";
import MotTrangDoiModal from "../components/MotTrangDoiModal";
import CostumeCardPreview from "../components/CostumeCardPreview";
import AppFooter from "../components/AppFooter";
import Tooltip from "../components/Tooltip";
import CostumeSelectPose from "../narrator/poses/CostumeSelectPose";
import { HoSo } from "../lib/hoSo";
import { ThoiTietState } from "../lib/thoitiet";
import { locTrangPhucGoiY } from "../lib/rules";
import {
  Sparkles,
  Search,
  History,
  BookOpen,
  Map,
  ArrowRight,
  Filter,
  Check,
  CloudRain,
  Sun,
  Snowflake,
  Wind,
  X,
} from "lucide-react";

type Props = {
  queNhaData: QueNhaData;
  onBackToQueNha: () => void;
  onSelectTrangPhuc: (trangPhucId: string, directToS4?: boolean) => void;
  onOpenCharacter?: () => void;
  onOpenGuiKyUc?: () => void;
  onOpenThamTu?: () => void;
  onOpenBanDo?: () => void;
  onOpenDongThoiGian?: () => void;
  onOpenSoiChiChung?: () => void;
  onOpenChoPhien?: () => void;
  onOpenChaoBan?: () => void;
  initialNhomFilter?: string;
  activeHoSo?: HoSo;
  weatherState?: ThoiTietState;
};

// Phân loại nhóm gọn gàng, trực quan
interface CategoryTab {
  id: string;
  label: string;
  desc: string;
  icon?: string;
  filter: (tp: TrangPhuc) => boolean;
}

const CATEGORIES: CategoryTab[] = [
  {
    id: "all",
    label: "Tất Cả (9)",
    desc: "Xem toàn bộ các trang phục truyền thống tiêu biểu của các vùng miền Việt Nam.",
    filter: () => true,
  },
  {
    id: "cung_dinh",
    label: "Áo Dài & Cung Đình (2)",
    desc: "Áo Dài lập lĩnh và Áo Ngũ Thân quý phái thời chúa Nguyễn và triều Nguyễn.",
    filter: (tp) => tp.id === "aodai" || tp.id === "ngu_than",
  },
  {
    id: "dan_gian",
    label: "Dân Gian Làng Quê (2)",
    desc: "Áo Tứ Thân hội làng Bắc Bộ và Áo Bà Ba bình dị miền sông nước Nam Bộ.",
    filter: (tp) => tp.id === "tu_than" || tp.id === "ba_ba",
  },
  {
    id: "mien_nui",
    label: "Sắc Màu Vùng Cao (2)",
    desc: "Áo Cỏ Thái hàng cúc bướm bạc và váy lanh H'Mông thêu chỉ màu vẽ sáp ong.",
    filter: (tp) => tp.id === "co_thai" || tp.id === "mong_lanh",
  },
  {
    id: "tay_nguyen_duyen_hai",
    label: "Tây Nguyên & Duyên Hải (3)",
    desc: "Thổ cẩm Ê Đê cồng chiêng, váy áo Chăm Mỹ Nghiệp và nếp Sampot Khmer lộng lẫy.",
    filter: (tp) =>
      tp.id === "ede_tho_cam" || tp.id === "champa_tho_cam" || tp.id === "sampot",
  },
];

// Thông tin vùng miền và niên đại tóm tắt cho từng nếp áo
const REGION_BADGES: Record<string, { vung: string; tag: string }> = {
  aodai: { vung: "Toàn quốc", tag: "🏛️ Thế kỷ XIX - Nay · Quốc phục" },
  ngu_than: { vung: "Kinh đô Huế", tag: "👑 Triều Nguyễn · Ngũ thân lập lĩnh" },
  tu_than: { vung: "Bắc Bộ", tag: "🌾 Đồng bằng Bắc Bộ · Hội làng" },
  ba_ba: { vung: "Nam Bộ", tag: "🚣 Sông nước Nam Bộ · Đời thường" },
  co_thai: { vung: "Tây Bắc", tag: "🌸 Dân tộc Thái · Cúc bướm bạc" },
  mong_lanh: { vung: "Đông & Tây Bắc", tag: "⛰️ Dân tộc H'Mông · Thổ cẩm & sáp ong" },
  ede_tho_cam: { vung: "Tây Nguyên", tag: "🪕 Dân tộc Ê Đê · Hoa văn cồng chiêng" },
  champa_tho_cam: { vung: "Nam Trung Bộ", tag: "☀️ Dân tộc Chăm · Mỹ Nghiệp dệt thủ công" },
  sampot: { vung: "Tây Nam Bộ", tag: "✨ Dân tộc Khmer · Lễ hội Chol Chnam Thmay" },
};

// Gợi ý phối phụ kiện & sắc màu chuẩn văn hóa cho từng nếp áo
const GOI_Y_PHOI_DO: Record<string, string> = {
  aodai: "Nón lá bài thơ, Kiềng bạc cung đình, Lụa đỏ son",
  ngu_than: "Khăn đóng chữ Nhất, Quạt lụa cầm tay, Gấm vàng nghệ",
  tu_than: "Khăn mỏ quạ, Nón quai thao, Yếm đào nâu sồng",
  ba_ba: "Khăn rằn Nam Bộ, Nón lá, Guốc mộc mạc",
  co_thai: "Khăn piêu thêu hoa, Cúc bướm bạc, Thắt lưng xanh",
  mong_lanh: "Vòng kiềng bạc đúc, Hoa văn sáp ong, Xà cạp chàm",
  ede_tho_cam: "Vòng tay đồng Tây Nguyên, Chuỗi hạt cườm cồng chiêng",
  champa_tho_cam: "Khăn vắt vai Talei Ka-in, Thắt lưng chỉ vàng",
  sampot: "Khăn Sbai thắt chéo ngực, Thắt lưng vàng ánh kim",
};

export default function CostumeSelectScreen({
  queNhaData,
  onBackToQueNha,
  onSelectTrangPhuc,
  onOpenCharacter,
  onOpenGuiKyUc,
  onOpenBanDo,
  onOpenDongThoiGian,
  initialNhomFilter,
  activeHoSo,
  weatherState,
}: Props) {
  const [activeCategory, setActiveCategory] = useState<string>(() => {
    if (initialNhomFilter && initialNhomFilter !== "all") {
      const match = CATEGORIES.find((cat) =>
        trangPhuc.some((tp) => cat.filter(tp) && tp.nhomIds.includes(initialNhomFilter))
      );
      if (match) return match.id;
    }
    return "all";
  });

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [storyCostumeId, setStoryCostumeId] = useState<string | null>(null);

  // Dữ liệu thời tiết hiện tại và thông báo gợi ý
  const thoiTiet = weatherState?.thoiTiet || "mat";
  const nhietDo = weatherState?.nhietDo ?? 26;
  const moTaThoiTiet = weatherState?.moTaThoiTiet || "Dịu mát";
  const tenNoi = weatherState?.viTri?.ten || weatherState?.vung?.noi || "Việt Nam";

  const [showWeatherToast, setShowWeatherToast] = useState(true);
  const [filterByWeather, setFilterByWeather] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Danh sách trang phục khớp với thời tiết hiện tại
  const matchingWeatherCostumes = useMemo(() => {
    return locTrangPhucGoiY({ thoiTiet });
  }, [thoiTiet]);

  // Lời khuyên văn hóa từ Cò Em theo thời tiết thực tế
  const cauGoiYThoiTiet = useMemo(() => {
    if (thoiTiet === "mua") {
      return `Ở ${tenNoi} lúc này trời đang mưa (${nhietDo}°C)... Cò Em gợi ý nếp Áo bà ba gọn gàng hoặc Áo tứ thân buộc vạt để bạn thảnh thơi di chuyển.`;
    }
    if (thoiTiet === "nong") {
      return `Ở ${tenNoi} lúc này trời đang nắng ráo (${nhietDo}°C)... Cò Em gợi ý diện Áo dài lụa thoáng nhẹ hay Áo bà ba mộc mạc mát mẻ.`;
    }
    if (thoiTiet === "lanh") {
      return `Ở ${tenNoi} lúc này tiết trời se lạnh (${nhietDo}°C)... Cò Em gợi ý nếp Áo ngũ thân nhiều lớp giữ ấm hoặc Váy lanh thổ cẩm H'Mông.`;
    }
    return `Ở ${tenNoi} lúc này trời dịu mát (${nhietDo}°C)... Rất tuyệt để khoác lên nếp Áo dài trang nhã, Áo cỏm Thái hay Áo ngũ thân.`;
  }, [thoiTiet, tenNoi, nhietDo]);

  // Bộ 3 gợi ý phối đồ tiêu biểu được tuyển chọn theo thời tiết & bối cảnh văn hóa
  const outfitSuggestions = useMemo(() => {
    if (thoiTiet === "mua" || thoiTiet === "nong") {
      return [
        {
          id: "ba_ba",
          title: "Áo Bà Ba & Khăn Rằn",
          tag: "🚣 Thoáng mát",
          occasion: "Đời thường Nam Bộ",
          detail: "Lụa chàm mạ mát dịu phối cùng Khăn rằn Nam Bộ và nón lá che mưa nắng.",
        },
        {
          id: "aodai",
          title: "Áo Dài & Nón Lá Bài Thơ",
          tag: "🏛️ Quốc phục",
          occasion: "Dạo phố thanh lịch",
          detail: "Lụa tơ tằm mềm mại phối cùng Nón lá bài thơ duyên dáng và Kiềng bạc.",
        },
        {
          id: "tu_than",
          title: "Áo Tứ Thân & Yếm Đào",
          tag: "🌾 Hội làng",
          occasion: "Duyên quan họ",
          detail: "Vạt áo buộc bụng gọn gàng phối Khăn mỏ quạ và Yếm đào nâu sồng.",
        },
      ];
    }
    if (thoiTiet === "lanh") {
      return [
        {
          id: "ngu_than",
          title: "Áo Ngũ Thân & Khăn Đóng",
          tag: "👑 Cung đình",
          occasion: "Trang trọng giữ ấm",
          detail: "Gấm vàng hoàng yến năm thân kín gió phối Khăn đóng chữ Nhất quý phái.",
        },
        {
          id: "mong_lanh",
          title: "Váy Lanh Thổ Cẩm H'Mông",
          tag: "⛰️ Sắc màu vùng cao",
          occasion: "Tiết trời se lạnh",
          detail: "Vải lanh dệt sáp ong dày dặn phối Vòng kiềng bạc đúc và Xà cạp chàm.",
        },
        {
          id: "aodai",
          title: "Áo Dài Gấm Cung Đình",
          tag: "✨ Thanh nhã",
          occasion: "Du xuân ấm áp",
          detail: "Gấm hoa văn cổ phối cùng Kiềng bạc hoàng gia giữ ấm thanh lịch.",
        },
      ];
    }
    return [
      {
        id: "aodai",
        title: "Áo Dài Son & Nón Lá",
        tag: "🌤️ Tiêu biểu",
        occasion: "Dạo cảnh, lễ hội",
        detail: "Sắc đỏ son rực rỡ phối cùng Nón lá bài thơ lá cọ và Kiềng bạc cung đình.",
      },
      {
        id: "co_thai",
        title: "Áo Cỏm Thái & Khăn Piêu",
        tag: "🌸 Duyên Tây Bắc",
        occasion: "Ngày hội hoa ban",
        detail: "Hàng cúc bướm bạc óng ánh, Khăn piêu dệt hoa và Thắt lưng xanh biếc tôn eo.",
      },
      {
        id: "ngu_than",
        title: "Áo Ngũ Thân Hoàng Yến",
        tag: "👑 Triều Nguyễn",
        occasion: "Nho nhã quý phái",
        detail: "Năm thân cài khuy đồng, sắc vàng nghệ vương giả phối Khăn đóng chuẩn mực.",
      },
    ];
  }, [thoiTiet]);

  const renderWeatherIcon = (size = "w-4 h-4") => {
    switch (thoiTiet) {
      case "mua":
        return <CloudRain className={`${size} text-sky-500 flex-shrink-0`} />;
      case "nong":
        return <Sun className={`${size} text-amber-500 flex-shrink-0`} />;
      case "lanh":
        return <Snowflake className={`${size} text-blue-400 flex-shrink-0`} />;
      default:
        return <Wind className={`${size} text-emerald-500 flex-shrink-0`} />;
    }
  };

  // Lọc danh sách trang phục theo category, thời tiết và từ khóa
  const filteredCostumes = useMemo(() => {
    const cat = CATEGORIES.find((c) => c.id === activeCategory) || CATEGORIES[0];
    let list = trangPhuc.filter(cat.filter);

    if (filterByWeather) {
      list = list.filter((tp) => tp.thoiTiet.includes(thoiTiet));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (tp) =>
          tp.ten.toLowerCase().includes(q) ||
          tp.moTaNgan.toLowerCase().includes(q) ||
          tp.nhomIds.some((id) => {
            const n = nhom.find((item) => item.id === id);
            return n && n.ten.toLowerCase().includes(q);
          })
      );
    }

    return list;
  }, [activeCategory, searchQuery, filterByWeather, thoiTiet]);

  return (
    <main className="costume-s2 min-h-screen bg-[var(--nen-bright)] text-[var(--nen-toi)]">
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-4">
        
        {/* ============================================================== */}
        {/* THANH ĐẦU TRANG TINH GỌN: KHÔNG CHỮ THỪA, TẬP TRUNG MỤC ĐÍCH  */}
        {/* ============================================================== */}
        <header className="mb-3 sm:mb-4 flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[var(--xanh-mint)] pb-3">
          <div className="flex items-center gap-3">
            <CostumeSelectPose size={56} animate={true} />
            <div>
              <Tooltip
                title="Di Sản Việt Phục"
                content="Không gian phục dựng và lưu truyền nếp áo truyền thống của các dân tộc Việt Nam."
                shortcut="Cò Em"
                position="bottom"
              >
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[var(--xanh-nhe)] border border-[var(--xanh-mint)] text-[var(--xanh-chinh)] text-[11px] font-semibold uppercase tracking-wider mb-0.5 cursor-help">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  <span>Cò Em · Việt Phục Truyền Thống</span>
                </div>
              </Tooltip>
              <h1 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-[var(--nen-toi)] m-0 leading-tight">
                Kho Cổ Phục Việt Nam
              </h1>
              <p className="text-xs sm:text-sm text-[var(--tro-tram)] mt-0.5 mb-0 max-w-xl">
                Chọn nếp áo di sản để ngắm nhìn hình mẫu và trực tiếp phối màu, chất liệu, phụ kiện
              </p>
            </div>
          </div>

          {/* Phím tắt công cụ văn hóa nhanh */}
          <div className="flex items-center gap-2 flex-wrap">
            {onOpenBanDo && (
              <button
                type="button"
                onClick={onOpenBanDo}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--vien-lech-a)] bg-[var(--nen-the)] border border-[var(--vien-the)] text-[var(--nen-toi)] hover:border-emerald-500/40 text-xs font-medium shadow-xs transition-all cursor-pointer"
                title="Bản Đồ 3 Miền"
              >
                <Map className="w-3.5 h-3.5 text-[var(--xanh-chinh)]" />
                <span>Bản Đồ 3 Miền</span>
              </button>
            )}
            {onOpenDongThoiGian && (
              <button
                type="button"
                onClick={onOpenDongThoiGian}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--vien-lech-b)] bg-[var(--nen-the)] border border-[var(--vien-the)] text-[var(--nen-toi)] hover:border-emerald-500/40 text-xs font-medium shadow-xs transition-all cursor-pointer"
                title="Dòng Lịch Sử"
              >
                <History className="w-3.5 h-3.5 text-emerald-600" />
                <span>Dòng Lịch Sử</span>
              </button>
            )}
            {onOpenGuiKyUc && (
              <button
                type="button"
                onClick={onOpenGuiKyUc}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--vien-lech-a)] bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-xs font-semibold shadow-xs transition-all cursor-pointer"
                title="Tủ Đồ Đã Lưu"
              >
                <span>🎒 Tủ Đồ</span>
              </button>
            )}
          </div>
        </header>

        {/* ============================================================== */}
        {/* THANH ĐIỀU HƯỚNG DANH MỤC & TÌM KIẾM NHANH                     */}
        {/* ============================================================== */}
        <section className="mb-3 sm:mb-4 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5">
          {/* Nhóm nút phân loại danh mục */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none flex-nowrap">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <Tooltip
                  key={cat.id}
                  title={cat.label}
                  content={cat.desc}
                  shortcut="Lọc nhanh"
                  position="bottom"
                >
                  <button
                    type="button"
                    onClick={() => setActiveCategory(cat.id)}
                    className={`shrink-0 relative px-3 py-1.5 text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 cursor-pointer rounded-xl ${
                      isActive
                        ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold shadow-md shadow-emerald-600/25 ring-2 ring-emerald-400/50 scale-[1.02]"
                        : "bg-[var(--nen-the)] text-[var(--nen-toi)] border border-[var(--vien-the)] hover:border-emerald-500/40 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/20"
                    }`}
                  >
                    {isActive && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-teal-300 shadow-[0_0_6px_#2dd4bf] animate-ping" />
                    )}
                    {cat.label}
                  </button>
                </Tooltip>
              );
            })}
          </div>

          {/* Ô tìm kiếm nhanh */}
          <div className="relative w-full lg:w-64 shrink-0">
            <Tooltip
              title="Tìm Kiếm Nhanh"
              content="Nhập tên áo (Áo Dài, Bà Ba, Tứ Thân...), nét hoa văn hoặc địa danh để tìm trang phục."
              shortcut="Tìm kiếm"
              position="bottom"
              asBlock
            >
              <div className="relative w-full">
                <Search className="w-4 h-4 text-[var(--tro-tram)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm tên trang phục, vùng miền..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm rounded-[var(--vien-lech-b)] bg-[var(--nen-the)] border border-[var(--vien-the)] text-[var(--nen-toi)] placeholder:text-[var(--tro-tram)]/60 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 shadow-2xs"
                />
              </div>
            </Tooltip>
          </div>
        </section>

        {/* ============================================================== */}
        {/* KHỐI GỢI Ý PHỐI ĐỒ CHUYÊN BIỆT (OUTFIT RECOMMENDATIONS)        */}
        {/* ============================================================== */}
        <section className="mb-3 sm:mb-4 p-3 sm:p-3.5 rounded-xl bg-[var(--nen-the)] border border-emerald-500/30 shadow-2xs transition-all">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Sparkles className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-[var(--nen-toi)] flex items-center gap-1.5 m-0">
                  Gợi Ý Phối Đồ Hôm Nay
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-semibold border border-emerald-500/30">
                    {tenNoi} · {nhietDo}°C ({moTaThoiTiet})
                  </span>
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
              <button
                type="button"
                onClick={() => setFilterByWeather((prev) => !prev)}
                className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg font-medium transition-all cursor-pointer ${
                  filterByWeather
                    ? "bg-emerald-600 text-white shadow-2xs font-semibold"
                    : "bg-[var(--nen-the-phu)] text-[var(--nen-toi)] border border-emerald-500/30 hover:border-emerald-500"
                }`}
              >
                <span>{filterByWeather ? "✓ Đang lọc theo thời tiết" : "🌤️ Lọc theo thời tiết"}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowSuggestions((prev) => !prev)}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg border border-[var(--vien-the)] bg-[var(--nen-the-phu)] text-[var(--tro-tram)] hover:text-[var(--nen-toi)] cursor-pointer"
                title={showSuggestions ? "Thu gọn gợi ý" : "Xem gợi ý"}
              >
                <span>{showSuggestions ? "Thu gọn ▴" : "Xem 3 gợi ý ▾"}</span>
              </button>
            </div>
          </div>

          {showSuggestions && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 mt-2.5 border-t border-[var(--vien-the)]/50">
              {outfitSuggestions.map((sug) => (
                <div
                  key={sug.id}
                  className="p-3 rounded-xl bg-[var(--nen-the-phu)] border border-[var(--vien-the)] hover:border-emerald-500/50 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100/90 dark:bg-amber-950/70 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                        {sug.tag}
                      </span>
                      <span className="text-[10px] text-[var(--tro-tram)]">
                        {sug.occasion}
                      </span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-[var(--nen-toi)] mb-1">
                      {sug.title}
                    </h4>
                    <p className="text-[11px] text-[var(--tro-tram)] leading-relaxed mb-2.5 line-clamp-2">
                      {sug.detail}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onSelectTrangPhuc(sug.id, true)}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition cursor-pointer shadow-2xs"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>✦ Thử Phối Bộ Này</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Dải thông tin trạng thái danh mục khi đang lọc */}
        {(activeCategory !== "all" || searchQuery || filterByWeather) && (
          <div className="mb-3 px-3 py-1.5 rounded-xl bg-[var(--nen-the)] border border-[var(--vien-the)] flex items-center justify-between text-xs text-[var(--tro-tram)]">
            <span className="flex items-center gap-1.5">
              <span>Đang hiển thị <strong>{filteredCostumes.length}</strong> trang phục</span>
              {searchQuery && <span>· Từ khóa "{searchQuery}"</span>}
              {filterByWeather && <span>· Phù hợp tiết trời</span>}
            </span>
            <button
              type="button"
              onClick={() => {
                setActiveCategory("all");
                setSearchQuery("");
                setFilterByWeather(false);
              }}
              className="text-emerald-700 dark:text-emerald-400 font-semibold hover:underline cursor-pointer"
            >
              Xem tất cả 9 bộ di sản ↺
            </button>
          </div>
        )}

        {/* ============================================================== */}
        {/* LƯỚI THẺ TRANG PHỤC HÌNH ẢNH SỐNG ĐỘNG (VISUAL-FIRST GRID)     */}
        {/* ============================================================== */}
        {filteredCostumes.length === 0 ? (
          <div className="py-12 text-center bg-[var(--nen-the)] rounded-[var(--vien-lech-a)] border border-[var(--vien-the)] p-6 shadow-sm">
            <p className="text-[var(--tro-tram)] text-sm mb-3">
              Không tìm thấy trang phục phù hợp với từ khóa "{searchQuery}"
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveCategory("all");
                setSearchQuery("");
              }}
              className="px-4 py-2 text-xs font-semibold rounded-[var(--vien-lech-b)] bg-[var(--xanh-chinh)] text-white hover:bg-[var(--xanh-dam)] transition-colors cursor-pointer"
            >
              Xem tất cả trang phục
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-5">
            {filteredCostumes.map((item, idx) => {
              const meta = REGION_BADGES[item.id] || {
                vung: "Việt Nam",
                tag: "🌿 Di sản trang phục truyền thống",
              };
              const isAsymA = idx % 2 === 0;

              return (
                <article
                  key={item.id}
                  className={`group costume-card relative flex flex-col bg-[var(--nen-the)] border border-[var(--vien-the)] hover:border-[var(--vang-chinh)] shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden ${
                    isAsymA ? "rounded-[var(--vien-lech-a)]" : "rounded-[var(--vien-lech-b)]"
                  }`}
                >
                  {/* Khung minh họa Avatar + Trang phục */}
                  <Tooltip
                    title={item.ten}
                    content={`Nhấp để mặc thử nếp áo ${item.ten} lên hình mẫu trong phòng phối đồ ảo.`}
                    shortcut="Thử ngay"
                    position="top"
                    asBlock
                  >
                    <div
                      onClick={() => onSelectTrangPhuc(item.id, true)}
                      className="cursor-pointer overflow-hidden"
                      title={`Bấm để thử trang phục ${item.ten}`}
                    >
                      <CostumeCardPreview trangPhucId={item.id} />
                    </div>
                  </Tooltip>

                  {/* Thân thẻ thông tin */}
                  <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Huy hiệu vùng miền / triều đại + chỉ báo thời tiết */}
                      <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                        <Tooltip
                          title="Vùng miền & Bối cảnh"
                          content={meta.tag}
                          shortcut={meta.vung}
                          position="top"
                        >
                          <span className="text-[11px] font-medium text-[var(--xanh-dam)] bg-[var(--xanh-nhe)] px-2.5 py-0.5 rounded-full border border-[var(--xanh-mint)] inline-block cursor-help">
                            {meta.tag}
                          </span>
                        </Tooltip>

                        <div className="flex items-center gap-1.5">
                          {item.thoiTiet.includes(thoiTiet) && (
                            <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30 inline-flex items-center gap-1">
                              <span>🌤️ Hợp tiết trời</span>
                            </span>
                          )}

                          {item.id === "aodai" && onOpenDongThoiGian && (
                            <Tooltip
                              title="Lịch Sử Áo Dài"
                              content="Xem 6 mốc cách tân lịch sử từ áo Ngũ Thân thời Chúa Nguyễn đến Áo Dài ngày nay."
                              shortcut="Niên biểu"
                              position="top"
                            >
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onOpenDongThoiGian();
                                }}
                                className="text-[11px] text-[var(--vang-chinh)] hover:underline inline-flex items-center gap-1 font-semibold cursor-pointer"
                                title="Xem 6 mốc cách tân lịch sử"
                              >
                                <History className="w-3 h-3" />
                                <span>Lịch sử</span>
                              </button>
                            </Tooltip>
                          )}
                        </div>
                      </div>

                      {/* Tên nếp áo */}
                      <h2
                        onClick={() => onSelectTrangPhuc(item.id, true)}
                        className="font-serif text-xl sm:text-2xl font-bold text-[var(--nen-toi)] group-hover:text-[var(--xanh-dam)] transition-colors cursor-pointer m-0 mb-1.5"
                      >
                        {item.ten}
                      </h2>

                      {/* Lời tóm lược súc tích */}
                      <p className="text-xs sm:text-sm text-[var(--tro-tram)] line-clamp-2 leading-relaxed m-0 mb-3">
                        {item.moTaNgan}
                      </p>

                      {/* Gợi ý phối phụ kiện & sắc màu */}
                      <div className="mb-4 text-[11px] flex items-center gap-1.5 flex-wrap text-emerald-800 dark:text-emerald-300 bg-emerald-50/70 dark:bg-emerald-950/40 p-2 rounded-lg border border-emerald-500/20">
                        <span className="font-semibold flex items-center gap-1 shrink-0">
                          <Sparkles className="w-3 h-3 text-amber-500" /> Gợi ý phối:
                        </span>
                        <span className="text-[var(--tro-tram)] dark:text-slate-300 line-clamp-1">
                          {GOI_Y_PHOI_DO[item.id] || "Phụ kiện truyền thống, hoa văn ngũ hành"}
                        </span>
                      </div>
                    </div>

                    {/* Hàng nút bấm tương tác dứt khoát */}
                    <div className="flex items-center gap-2 pt-2 border-t border-[var(--xanh-mint)]/60">
                      {/* NÚT CHÍNH: VÀO PHỐI ĐỒ NGAY */}
                      <Tooltip
                        title="Phòng Phối Đồ Ảo"
                        content={`Tùy biến màu sắc ngũ hành, chất liệu lụa/gấm, hoa văn và phụ kiện cho ${item.ten}.`}
                        shortcut="Phối đồ"
                        position="top"
                        asBlock
                      >
                        <button
                          type="button"
                          onClick={() => onSelectTrangPhuc(item.id, true)}
                          className="w-full inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-[var(--vien-lech-b)] bg-[var(--xanh-chinh)] hover:bg-[var(--xanh-dam)] text-white text-xs sm:text-sm font-semibold shadow-xs hover:shadow-sm transition-all cursor-pointer"
                          title={`Bắt đầu phối màu & phụ kiện cho ${item.ten}`}
                        >
                          <Sparkles className="w-3.5 h-3.5 text-[var(--vang-sang)]" />
                          <span>✦ Thử Phối Đồ</span>
                        </button>
                      </Tooltip>

                      {/* NÚT PHỤ: TÌM HIỂU VĂN HÓA & NGUỒN */}
                      <Tooltip
                        title="Sự Tích & Nguồn"
                        content={`Xem câu chuyện Một Trang Đời, ý nghĩa nhân văn và nguồn khảo cứu của ${item.ten}.`}
                        shortcut="Chi tiết"
                        position="top"
                      >
                        <button
                          type="button"
                          onClick={() => setStoryCostumeId(item.id)}
                          className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-[var(--vien-lech-a)] bg-[var(--nen-the)] border border-[var(--vien-the)] hover:border-[var(--vang-chinh)] text-[var(--nen-toi)] text-xs sm:text-sm font-medium transition-colors cursor-pointer"
                          title={`Xem sự tích & tư liệu khảo cứu của ${item.ten}`}
                        >
                          <BookOpen className="w-3.5 h-3.5 text-[var(--vang-chinh)]" />
                          <span>Chi tiết</span>
                        </button>
                      </Tooltip>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Chân trang Giữ chuẩn văn hóa tinh giản */}
      <AppFooter />

      {/* Modal Đọc sự tích / Một Trang Đời / Nguồn khảo cứu chuẩn xác */}
      {storyCostumeId && (
        <MotTrangDoiModal
          trangPhucId={storyCostumeId}
          isOpen={true}
          onClose={() => setStoryCostumeId(null)}
        />
      )}

      {/* THÔNG BÁO GỢI Ý TRANG PHỤC THEO THỜI TIẾT (TOAST CÒ EM) */}
      {showWeatherToast ? (
        <aside
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-4 sm:right-6 z-40 max-w-[calc(100vw-2rem)] sm:max-w-md w-full bg-[var(--nen-sidebar,rgba(255,255,255,0.96))] dark:bg-slate-900/96 backdrop-blur-md border border-emerald-500/35 dark:border-emerald-400/30 rounded-2xl p-4 shadow-xl shadow-emerald-950/15 text-[var(--nen-toi)] transition-all animate-in fade-in slide-in-from-bottom-4 duration-300"
          style={{ borderRadius: "var(--vien-lech-a)" }}
        >
          {/* Header toast */}
          <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-[var(--vien-the)]">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 shadow-2xs">
                {renderWeatherIcon("w-4 h-4")}
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 truncate">
                    Gợi Ý Trang Phục Thời Tiết
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-500/20">
                    Cò Em
                  </span>
                </div>
                <div className="text-[11px] text-[var(--tro-tram)] truncate">
                  📍 {tenNoi} · {nhietDo}°C · {moTaThoiTiet}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowWeatherToast(false)}
              className="w-7 h-7 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800 text-[var(--tro-tram)] hover:text-[var(--nen-toi)] flex items-center justify-center transition-colors cursor-pointer flex-shrink-0"
              aria-label="Đóng thông báo gợi ý thời tiết"
              title="Đóng thông báo"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Lời khuyên ấm áp của Cò Em */}
          <p className="text-xs sm:text-[13px] leading-relaxed text-[var(--nen-toi)] mb-3 m-0">
            {cauGoiYThoiTiet}
          </p>

          {/* Nút gợi ý nhanh */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-[var(--vien-the)]/50">
            <span className="text-[11px] font-semibold text-[var(--tro-tram)]">Gợi ý diện ngay:</span>
            {matchingWeatherCostumes.slice(0, 3).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTrangPhuc(item.id, true)}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/80 text-emerald-800 dark:text-emerald-200 font-medium border border-emerald-500/30 transition-all cursor-pointer shadow-2xs hover:scale-102"
                title={`Thử phối trang phục ${item.ten}`}
              >
                <span>✦</span>
                <span>{item.ten}</span>
              </button>
            ))}

            <button
              type="button"
              onClick={() => setFilterByWeather((prev) => !prev)}
              className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg transition-all cursor-pointer font-medium ml-auto ${
                filterByWeather
                  ? "bg-emerald-600 text-white shadow-xs font-semibold"
                  : "bg-[var(--nen-the)] text-[var(--nen-toi)] border border-[var(--vien-the)] hover:border-emerald-500/40"
              }`}
              title={filterByWeather ? "Hiển thị lại toàn bộ" : `Chỉ xem ${matchingWeatherCostumes.length} trang phục hợp thời tiết`}
            >
              <span>{filterByWeather ? "✓ Đang lọc" : "Lọc danh sách"}</span>
            </button>
          </div>
        </aside>
      ) : (
        <button
          type="button"
          onClick={() => setShowWeatherToast(true)}
          className="fixed bottom-5 right-4 sm:right-6 z-40 flex items-center gap-2 px-3.5 py-2 rounded-full bg-[var(--nen-sidebar,rgba(255,255,255,0.96))] dark:bg-slate-900/96 backdrop-blur-md border border-emerald-500/40 text-emerald-800 dark:text-emerald-300 text-xs font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all cursor-pointer"
          style={{ borderRadius: "var(--vien-lech-b)" }}
          title="Mở lại gợi ý trang phục theo thời tiết của Cò Em"
        >
          {renderWeatherIcon("w-3.5 h-3.5")}
          <span>Gợi ý thời tiết ({nhietDo}°C)</span>
        </button>
      )}
    </main>
  );
}
