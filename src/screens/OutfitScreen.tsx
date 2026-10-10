/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect } from "react";
import AvatarSVG from "../components/AvatarSVG";
import { CulturalPatternsDefs, renderGarmentLayers } from "../components/GarmentLayers";
import { NhanVatConfig, tinhSoDo, NHAN_VAT_MAC_DINH, toCroquisBodyType } from "../lib/avatar";
import { mauSac } from "../data/mausac";
import { phuKien } from "../data/phukien";
import { nhom } from "../data/nhom";
import { trangPhuc } from "../data/trangphuc";
import { domdom } from "../copy/coem";
import {
  isAudioEnabled,
  setAudioEnabled,
  playFabricRustle,
  playSilverBell,
  playClogSteps,
} from "../lib/audio";
import { docCaiDatTraiNghiem } from "../lib/caiDatTraiNghiem";
import MotTrangDoiModal from "../components/MotTrangDoiModal";
import AppFooter from "../components/AppFooter";
import { openGiuChuanVanHoa } from "../lib/giuChuan";
import { evaluateColor, evaluateRemix } from "../lib/rules";
import CatVaoGuiModal from "../components/CatVaoGuiModal";
import { docDanhSachGuiKyUc } from "../lib/guiKyUc";
import { Vai } from "../types";
import { layChatLieuTuTrangPhuc } from "../lib/ghiChuChatLieu";
import GhiChuChatLieuCard from "../components/GhiChuChatLieuCard";
import Tooltip from "../components/Tooltip";
import { layKhoaTheoHoSo, layHoSoHienTai } from "../lib/hoSo";
import { keGiaiThichMauCap1, keGiaiThichNhanVanHoaCap1, DANH_SACH_LY_DO_REMIX, keLyDoRemix } from "../lib/loiKe";
import { callGemini } from "../lib/gemini";
import { ThoiTietState } from "../lib/thoitiet";
import GenzEventSelector from "../components/GenzEventSelector";
import ColorHarmonyChecker from "../components/ColorHarmonyChecker";
import CulturalWarningCard from "../components/CulturalWarningCard";
import OutfitCompareModal, { OutfitOption } from "../components/OutfitCompareModal";
import LookbookModal from "../components/LookbookModal";
import { SU_KIEN_GENZ, SuKienGenZ } from "../data/genzRemixData";
import { ArrowRightLeft, BookOpen, Share2, Compass, Sparkles, Check } from "lucide-react";
import {
  OutfitControlTabs,
  ColorSelector,
  FabricSelector,
  PatternSelector,
  AccessorySelector,
  FootwearSelector,
  GenderFilterCard,
  RegionFilterCard,
  type OutfitTab,
  type VaiNangCao,
} from "../outfit";

type Props = {
  trangPhucId: string;
  nhanVatConfig?: NhanVatConfig;
  weatherState?: ThoiTietState;
  onBackToDetail: () => void;
  onOpenCharacterSelect: () => void;
  onSelectAnotherCostume: () => void;
  onOpenGuiKyUc?: () => void;
  onOpenDongThoiGian?: () => void;
};

const noise = encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .95  0 0 0 0 .92  0 0 0 0 .85  0 0 0 .55 0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`
);

const GOI_Y_PRESETS_BY_COSTUME: Record<
  string,
  Array<{
    ten: string;
    moTa: string;
    mauId: string;
    phuKienIds: string[];
    footwearId: string;
    phongCach: string;
  }>
> = {
  aodai: [
    {
      ten: "Đài Các Cung Đình",
      moTa: "Nón lá bài thơ duyên dáng, kiềng bạc và hài thêu hoa sen trên nền lụa đỏ son.",
      mauId: "m_do",
      phuKienIds: ["non_la", "kieng_bac"],
      footwearId: "hai_theu",
      phongCach: "truyen_thong",
    },
    {
      ten: "Thanh Tân Phố Thị",
      moTa: "Lụa trắng thanh lịch kết hợp cùng sneaker trắng hiện đại và kiềng bạc.",
      mauId: "m_trang",
      phuKienIds: ["kieng_bac"],
      footwearId: "sneaker",
      phongCach: "cach_tan_nhe",
    },
    {
      ten: "Hoài Niệm Trầm Mặc",
      moTa: "Lụa xanh biếc nhã nhặn cùng guốc mộc quai nhung mộc mạc cổ phong.",
      mauId: "m_lam",
      phuKienIds: ["non_la"],
      footwearId: "guoc_moc",
      phongCach: "truyen_thong",
    },
  ],
  ngu_than: [
    {
      ten: "Kinh Kỳ Quý Phái",
      moTa: "Gấm vàng nghệ triều Nguyễn, khăn đóng chữ Nhất và hài thêu cung đình.",
      mauId: "m_vang",
      phuKienIds: ["khan_dong", "quat_lua"],
      footwearId: "hai_theu",
      phongCach: "truyen_thong",
    },
    {
      ten: "Nho Sinh Phong Nhã",
      moTa: "Sắc xanh lục điềm đạm, khăn đóng trang nhã cùng guốc mộc cổ phong.",
      mauId: "m_luc",
      phuKienIds: ["khan_dong"],
      footwearId: "guoc_moc",
      phongCach: "truyen_thong",
    },
  ],
  tu_than: [
    {
      ten: "Hội Làng Kinh Bắc",
      moTa: "Nâu sồng đất nung đằm thắm, khăn mỏ quạ, nón quai thao và guốc mộc.",
      mauId: "m_nau",
      phuKienIds: ["khan_mo_qua", "non_quai_thao"],
      footwearId: "guoc_moc",
      phongCach: "truyen_thong",
    },
    {
      ten: "Quan Họ Duyên Dáng",
      moTa: "Yếm đào đỏ son tươi tắn, khăn mỏ quạ thắt duyên và guốc mộc truyền thống.",
      mauId: "m_do",
      phuKienIds: ["khan_mo_qua"],
      footwearId: "guoc_moc",
      phongCach: "truyen_thong",
    },
  ],
  ba_ba: [
    {
      ten: "Sông Nước Nam Bộ",
      moTa: "Xanh lá mạ mát lành, khăn rằn vắt vai, nón lá bài thơ và guốc mộc.",
      mauId: "m_luc",
      phuKienIds: ["khan_ran", "non_la"],
      footwearId: "guoc_moc",
      phongCach: "truyen_thong",
    },
    {
      ten: "Bình Dị Miền Tây",
      moTa: "Sắc đen tuyền chân chất, khăn rằn Nam Bộ và dép da thủ công êm bước.",
      mauId: "m_den",
      phuKienIds: ["khan_ran"],
      footwearId: "dep_da_co",
      phongCach: "truyen_thong",
    },
  ],
  co_thai: [
    {
      ten: "Thiếu Nữ Hoa Ban",
      moTa: "Áo cóm trắng ngà cúc bướm bạc, khăn piêu thêu hoa và guốc mộc thanh thoát.",
      mauId: "m_trang",
      phuKienIds: ["khan_pieu"],
      footwearId: "guoc_moc",
      phongCach: "truyen_thong",
    },
  ],
  mong_lanh: [
    {
      ten: "Sắc Màu Vùng Cao",
      moTa: "Vải chàm lanh sáp ong, kiềng bạc đúc truyền thống và hài thêu rực rỡ.",
      mauId: "m_cham",
      phuKienIds: ["kieng_bac"],
      footwearId: "hai_theu",
      phongCach: "truyen_thong",
    },
  ],
  ede_tho_cam: [
    {
      ten: "Đại Ngàn Cồng Chiêng",
      moTa: "Thổ cẩm đen sẫm Tây Nguyên, hoa văn cồng chiêng và dép da mộc mạc.",
      mauId: "m_den",
      phuKienIds: [],
      footwearId: "dep_da_co",
      phongCach: "truyen_thong",
    },
  ],
  champa_tho_cam: [
    {
      ten: "Mỹ Nghiệp Cổ Truyền",
      moTa: "Thổ cẩm dệt chỉ vàng óng ả, khăn Talei Ka-in và hài thêu trang trọng.",
      mauId: "m_vang",
      phuKienIds: [],
      footwearId: "hai_theu",
      phongCach: "truyen_thong",
    },
  ],
  sampot: [
    {
      ten: "Lễ Hội Ánh Kim",
      moTa: "Nếp váy Sampot dệt vàng, khăn Sbai vắt chéo ngực quý phái và hài thêu sen.",
      mauId: "m_vang",
      phuKienIds: [],
      footwearId: "hai_theu",
      phongCach: "truyen_thong",
    },
  ],
};

export default function OutfitScreen({
  trangPhucId,
  nhanVatConfig,
  weatherState,
  onBackToDetail,
  onOpenCharacterSelect,
  onSelectAnotherCostume,
  onOpenGuiKyUc,
  onOpenDongThoiGian,
}: Props) {
  const defaultMauId = "m_do";
  const defaultPhuKienIds = ["non_la"];

  const currentTrangPhuc = useMemo(() => {
    return (
      trangPhuc.find((t) => t.id === trangPhucId) ??
      trangPhuc.find((t) => t.id === "aodai") ??
      trangPhuc[0]
    );
  }, [trangPhucId]);

  const nhanVat: NhanVatConfig = nhanVatConfig ?? NHAN_VAT_MAC_DINH;
  const soDo = useMemo(() => tinhSoDo(nhanVat), [nhanVat]);

  // Khôi phục hoặc khởi tạo outfit state theo từng hồ sơ (ưu tiên URL params nếu được chia sẻ)
  const [selectedMauId, setSelectedMauId] = useState<string>(() => {
    try {
      if (typeof window !== "undefined") {
        const urlParams = new URLSearchParams(window.location.search);
        const urlMau = urlParams.get("m");
        if (urlMau && mauSac.some((m) => m.id === urlMau)) return urlMau;

        if (window.localStorage) {
          const saved = window.localStorage.getItem(layKhoaTheoHoSo(`outfit:${currentTrangPhuc.id}`));
          if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed.mauId) return parsed.mauId;
          }
        }
      }
    } catch {
      // Bỏ qua
    }
    return defaultMauId;
  });

  const [selectedPhuKienIds, setSelectedPhuKienIds] = useState<string[]>(() => {
    try {
      if (typeof window !== "undefined") {
        const urlParams = new URLSearchParams(window.location.search);
        const urlPk = urlParams.get("pk");
        if (urlPk) {
          const items = urlPk.split(",").filter(Boolean);
          if (items.length > 0) return items;
        }

        if (window.localStorage) {
          const saved = window.localStorage.getItem(layKhoaTheoHoSo(`outfit:${currentTrangPhuc.id}`));
          if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed.phuKienIds)) return parsed.phuKienIds;
          }
        }
      }
    } catch {
      // Bỏ qua
    }
    return defaultPhuKienIds;
  });

  const [hoaVanThem, setHoaVanThem] = useState<string | null>(() => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const saved = window.localStorage.getItem(layKhoaTheoHoSo(`outfit:${currentTrangPhuc.id}`));
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.hoaVanThem !== undefined) return parsed.hoaVanThem;
        }
      }
    } catch {
      // Bỏ qua
    }
    return null;
  });

  const [phongCach, setPhongCach] = useState<string>("truyen_thong");

  // Âm thanh
  const [soundOn, setSoundOn] = useState<boolean>(() => isAudioEnabled());

  useEffect(() => {
    const handleAudioChange = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && detail.enabled !== undefined) {
        setSoundOn(detail.enabled);
      } else {
        setSoundOn(isAudioEnabled());
      }
    };
    window.addEventListener("vpr:audio-setting-change", handleAudioChange);
    return () => window.removeEventListener("vpr:audio-setting-change", handleAudioChange);
  }, []);

  const [hoveredColorId, setHoveredColorId] = useState<string | null>(null);

  // Tab điều khiển phối đồ theo thư mục
  const [activeOutfitTab, setActiveOutfitTab] = useState<OutfitTab>("mau_sac");
  const [selectedFootwearId, setSelectedFootwearId] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const urlFw = new URLSearchParams(window.location.search).get("fw");
      if (urlFw) return urlFw;
    }
    return defaultPhuKienIds.includes("sneaker") ? "sneaker" : "guoc_moc";
  });

  // Trạng thái trình diễn hoàn tất
  const [isPerforming, setIsPerforming] = useState<boolean>(false);
  const [completedMoment, setCompletedMoment] = useState<boolean>(false);
  const [showStory, setShowStory] = useState<boolean>(false);
  const [showCatGuiModal, setShowCatGuiModal] = useState<boolean>(false);
  const [showCulturalNotes, setShowCulturalNotes] = useState<boolean>(false);
  const [savedOutfitsCount, setSavedOutfitsCount] = useState<number>(() => {
    return docDanhSachGuiKyUc().length;
  });

  // State cho Đề thi Audition: Sự kiện Gen Z, Lookbook & So sánh A/B
  const [selectedEventId, setSelectedEventId] = useState<string | null>("ky_yeu");
  const [showCompareModal, setShowCompareModal] = useState<boolean>(false);
  const [showLookbookModal, setShowLookbookModal] = useState<boolean>(false);
  const activeHoSo = layHoSoHienTai();

  const [optionBForCompare, setOptionBForCompare] = useState<OutfitOption>({
    ten: "Phương án Gợi ý Đổi",
    trangPhucId: currentTrangPhuc.id,
    mauId: selectedMauId === "m_do" ? "m_trang" : "m_do",
    phuKienIds: selectedMauId === "m_do" ? ["kieng_bac"] : ["non_la", "kieng_bac"],
    footwearId: "sneaker",
    phongCach: "y2k_remix",
  });

  const defaultVai = useMemo(() => {
    return layChatLieuTuTrangPhuc(currentTrangPhuc.id, selectedMauId);
  }, [currentTrangPhuc.id, selectedMauId]);

  const [customSelectedVai, setCustomSelectedVai] = useState<Vai | null>(null);

  useEffect(() => {
    setCustomSelectedVai(null);
  }, [currentTrangPhuc.id, selectedMauId]);

  const currentVai = customSelectedVai ?? defaultVai;

  useEffect(() => {
    const handleUpdateCount = () => {
      setSavedOutfitsCount(docDanhSachGuiKyUc().length);
    };
    window.addEventListener("vpr:outfits-change", handleUpdateCount);
    return () => window.removeEventListener("vpr:outfits-change", handleUpdateCount);
  }, []);

  // Tự động lưu outfit
  useEffect(() => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const data = {
          trangPhucId: currentTrangPhuc.id,
          mauId: selectedMauId,
          phuKienIds: selectedPhuKienIds,
          hoaVanThem,
          phongCach,
        };
        window.localStorage.setItem(
          layKhoaTheoHoSo(`outfit:${currentTrangPhuc.id}`),
          JSON.stringify(data)
        );
      }
    } catch {
      // Bỏ qua
    }
  }, [currentTrangPhuc.id, selectedMauId, selectedPhuKienIds, hoaVanThem, phongCach]);

  const activeColorObj = useMemo(() => {
    return mauSac.find((m) => m.id === selectedMauId) ?? mauSac[0];
  }, [selectedMauId]);

  // Xử lý đổi lựa chọn
  const handleSelectColor = (mauId: string) => {
    setSelectedMauId(mauId);
    playFabricRustle();
  };

  const handleToggleAccessory = (pkId: string) => {
    setSelectedPhuKienIds((prev) => {
      let next: string[];
      if (prev.includes(pkId)) {
        next = prev.filter((id) => id !== pkId);
      } else {
        const targetPk = phuKien.find((p) => p.id === pkId);
        if (targetPk && (targetPk.loai === "non" || targetPk.loai === "khan")) {
          next = prev.filter((id) => {
            const existing = phuKien.find((p) => p.id === id);
            return !existing || existing.loai !== targetPk.loai;
          });
          next.push(pkId);
        } else {
          next = [...prev, pkId];
        }
      }
      playFabricRustle();
      return next;
    });
  };

  const handleSelectHoaVan = (nhomId: string | null) => {
    setHoaVanThem(nhomId);
    playFabricRustle();
  };

  const handleSelectFootwear = (id: string) => {
    setSelectedFootwearId(id);
    playClogSteps();
    // Đồng bộ vào selectedPhuKienIds nếu là sneaker hoặc footwear khác
    setSelectedPhuKienIds((prev) => {
      const filtered = prev.filter(
        (x) => !["guoc_moc", "hai_theu", "sneaker", "dep_da_co"].includes(x)
      );
      return id === "sneaker" ? [...filtered, "sneaker"] : filtered;
    });
  };

  const handleApplyPreset = (preset: {
    ten: string;
    moTa: string;
    mauId: string;
    phuKienIds: string[];
    footwearId: string;
    phongCach: string;
  }) => {
    setSelectedMauId(preset.mauId);
    setSelectedPhuKienIds(preset.phuKienIds);
    setSelectedFootwearId(preset.footwearId);
    setPhongCach(preset.phongCach);
    playFabricRustle();
  };

  // Áp dụng gợi ý sự kiện Gen Z (Đề thi Audition)
  const handleSelectEvent = (event: SuKienGenZ) => {
    setSelectedEventId(event.id);
  };

  const handleApplyEventRecommendation = (event: SuKienGenZ) => {
    setSelectedEventId(event.id);
    if (event.mauDeXuat[0]) {
      setSelectedMauId(event.mauDeXuat[0]);
    }
    setSelectedPhuKienIds(event.phuKienDeXuat);
    setSelectedFootwearId(event.giayDeXuat);
    setPhongCach(event.phongCachMacDinh);
    playSilverBell();
    setCompletedMoment(true);
  };

  // Mở modal so sánh A/B
  const handleOpenCompareModal = () => {
    // Chuẩn bị optionB từ preset đối trọng hoặc gợi ý
    const presetCandidates = GOI_Y_PRESETS_BY_COSTUME[currentTrangPhuc.id] || [];
    const altPreset = presetCandidates.find((p) => p.mauId !== selectedMauId) || presetCandidates[0];
    
    setOptionBForCompare({
      ten: altPreset ? altPreset.ten : "Bản Phối Cách Tân Hiện Đại",
      trangPhucId: currentTrangPhuc.id,
      mauId: altPreset ? altPreset.mauId : (selectedMauId === "m_do" ? "m_trang" : "m_do"),
      phuKienIds: altPreset ? altPreset.phuKienIds : ["kieng_bac"],
      footwearId: altPreset ? altPreset.footwearId : "sneaker",
      phongCach: altPreset ? altPreset.phongCach : "y2k_remix",
    });

    setShowCompareModal(true);
  };

  const handleApplyOptionFromCompare = (opt: OutfitOption) => {
    setSelectedMauId(opt.mauId);
    setSelectedPhuKienIds(opt.phuKienIds);
    setSelectedFootwearId(opt.footwearId);
    setPhongCach(opt.phongCach);
    playFabricRustle();
  };

  const handleSelectFabric = (f: VaiNangCao) => {
    setCustomSelectedVai(f);
    playFabricRustle();
  };

  const handleToggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setAudioEnabled(next);
  };

  const handleFinishOutfit = () => {
    playClogSteps();
    const isReduced = docCaiDatTraiNghiem().giamChuyenDong;
    if (isReduced) {
      setIsPerforming(false);
      setCompletedMoment(true);
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("vpr:outfit-completed", {
            detail: { trangPhucId: currentTrangPhuc.id, action: "finish" },
          })
        );
      }
      return;
    }

    setIsPerforming(true);
    playSilverBell();

    setTimeout(() => {
      setIsPerforming(false);
      setCompletedMoment(true);
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("vpr:outfit-completed", {
            detail: { trangPhucId: currentTrangPhuc.id, action: "finish" },
          })
        );
      }
    }, 1500);
  };

  const garmentLayers = useMemo(() => {
    return renderGarmentLayers({
      trangPhucId: currentTrangPhuc.id,
      soDo,
      mauHex: activeColorObj.hex,
      phuKienIds: selectedPhuKienIds,
      footwearId: selectedFootwearId,
      hoaVanThem,
      phongCach,
      bodyType: toCroquisBodyType(nhanVat.tuoi),
    });
  }, [
    currentTrangPhuc.id,
    soDo,
    activeColorObj.hex,
    selectedPhuKienIds,
    selectedFootwearId,
    hoaVanThem,
    phongCach,
    nhanVat.tuoi,
  ]);

  // LOGIC KIỂM TRA BOUNDING BOX VÀ TỰ ĐỘNG MỞ RỘNG VIEWBOX:
  // Ngăn chặn 100% tình trạng tay áo, cổ áo, nón lá, khăn đội đầu hoặc giày guốc bị cắt góc
  const computedViewBox = useMemo(() => {
    let minX = 60;
    let maxX = 340;
    let minY = -75;
    let maxY = 810;

    // Phụ kiện đội đầu cao (Nón lá, khăn đóng, nón quai thao, khăn piêu)
    const hasTallHeadwear = selectedPhuKienIds.some((id) =>
      ["non_la", "khan_dong", "khan_mo_qua", "non_quai_thao", "khan_pieu", "tram_cai"].includes(id)
    );
    if (hasTallHeadwear || nhanVat.gioi === "nam") {
      minY = Math.min(minY, -85);
    }
    if (selectedPhuKienIds.includes("non_quai_thao")) {
      minX = Math.min(minX, 45);
      maxX = Math.max(maxX, 355);
    }

    // Tay áo xòe hoặc tà áo dài phủ rộng (Áo dài, Ngũ thân, Tứ thân)
    if (["aodai", "ngu_than", "tu_than"].includes(currentTrangPhuc.id)) {
      minX = Math.min(minX, 50);
      maxX = Math.max(maxX, 350);
    }

    // Giày dép và đế guốc mộc ở gót chân
    if (selectedFootwearId) {
      maxY = Math.max(maxY, 815);
    }

    const width = maxX - minX;
    const height = maxY - minY;
    return `${minX} ${minY} ${width} ${height}`;
  }, [selectedPhuKienIds, nhanVat.gioi, currentTrangPhuc.id, selectedFootwearId]);

  const tenNhomHoaVan = useMemo(() => {
    if (!hoaVanThem) return null;
    const n = nhom.find((g) => g.id === hoaVanThem);
    return n ? n.ten : hoaVanThem;
  }, [hoaVanThem]);

  const colorEvaluation = useMemo(() => {
    return evaluateColor(selectedMauId, selectedPhuKienIds);
  }, [selectedMauId, selectedPhuKienIds]);

  const remixEvaluation = useMemo(() => {
    return evaluateRemix({
      trangPhucId: currentTrangPhuc.id,
      phuKienIds: selectedPhuKienIds,
      hoaVanThem,
      phongCach,
    });
  }, [currentTrangPhuc.id, selectedPhuKienIds, hoaVanThem, phongCach]);

  const [selectedLyDoRemix, setSelectedLyDoRemix] = useState<string[]>([]);
  const cauLyDoRemix = useMemo(() => {
    if (selectedLyDoRemix.length === 0) return null;
    return keLyDoRemix({
      tenTrangPhuc: currentTrangPhuc.ten,
      mucRemix: currentTrangPhuc.mucRemix,
      mauHienTai: selectedMauId,
      tenMauHienTai: activeColorObj.ten,
      phuKienHienTai: selectedPhuKienIds,
      lyDoDaChon: selectedLyDoRemix,
    });
  }, [currentTrangPhuc.ten, currentTrangPhuc.mucRemix, selectedMauId, activeColorObj.ten, selectedPhuKienIds, selectedLyDoRemix]);

  const [showViSaoModal, setShowViSaoModal] = useState<boolean>(false);
  const [viSaoLoading, setViSaoLoading] = useState<boolean>(false);
  const [viSaoText, setViSaoText] = useState<string>("");

  const handleOpenViSao = async () => {
    setShowViSaoModal(true);
    setViSaoLoading(true);
    try {
      const tenMau = activeColorObj.ten;
      const tenPhuKien = selectedPhuKienIds
        .map((id) => phuKien.find((p) => p.id === id)?.ten ?? id)
        .join(", ");
      const prompt = `Bạn là Cò Em, người bạn đồng hành am hiểu cổ phục Việt Nam, xưng Cò Em gọi bạn. Người dùng đang phối trang phục "${currentTrangPhuc.ten}", chọn màu "${tenMau}", phụ kiện: "${tenPhuKien || "không có"}", hoa văn mượn: "${tenNhomHoaVan || "vải trơn"}", phong cách: "${phongCach}". Nhãn văn hóa hiện tại là: "${remixEvaluation.nhanHienThi}".
Hãy viết 2-3 câu ngắn gọn, ấm áp, giải thích vì sao bộ phối này mang tinh thần như vậy và ý nghĩa chiều sâu văn hóa của sự kết hợp này. Giữ giọng điệu tôn trọng và khơi gợi cảm hứng.`;

      const aiResponse = await callGemini({
        cauHoi: prompt,
        callerKey: "vi_sao",
      });
      if (aiResponse?.ok && typeof aiResponse.data === "string" && aiResponse.data.trim()) {
        setViSaoText(aiResponse.data);
        setViSaoLoading(false);
        return;
      }
    } catch (err) {
      console.warn("Lỗi gọi Gemini cho giải thích sâu:", err);
    }

    setViSaoText(
      remixEvaluation.giaiThich3Phan.toanBo ||
        "Mỗi nếp áo xưa đều mang theo câu chuyện đời sống và nghi lễ của tiền nhân. Giữ nét cũ, mở lối mới để trang phục luôn sống động cùng thời gian."
    );
    setViSaoLoading(false);
  };

  return (
    <main className="outfit-screen">
      <style>{css}</style>
      <div className="outfit-screen__noise" aria-hidden="true" />

      {/* Đầu trang tối giản, thanh lịch */}
      <header className="outfit-screen__header">
        <div className="flex items-center gap-2.5">
          <div>
            <span className="outfit-screen__brand-name">Phối Đồ</span>
            <span className="outfit-screen__brand-sub">
              {currentTrangPhuc.ten}
            </span>
          </div>
        </div>

        <div className="outfit-screen__header-actions">
          <button
            type="button"
            onClick={() => setShowStory(true)}
            className="outfit-screen__pill-btn"
            title={domdom.motTrangDoi.nutDocCauChuyen}
          >
            📖 Chuyện xưa
          </button>
          {onOpenGuiKyUc && (
            <button
              type="button"
              onClick={onOpenGuiKyUc}
              className="outfit-screen__pill-btn outfit-screen__pill-btn--highlight"
              title={domdom.guiKyUc.tieuDeTrang}
            >
              🎒 Gùi ({savedOutfitsCount}/6)
            </button>
          )}
          {onOpenDongThoiGian && (currentTrangPhuc.id === "aodai" || currentTrangPhuc.id === "ngu_than") && (
            <Tooltip
              title="Dòng Thời Gian"
              content="Xem 6 mốc cách tân lịch sử từ triều Nguyễn đến nay."
              shortcut="Niên biểu"
              position="bottom"
            >
              <button
                type="button"
                onClick={onOpenDongThoiGian}
                className="outfit-screen__pill-btn"
                title="Xem dòng thời gian áo dài"
              >
                ⏳ Dòng thời gian
              </button>
            </Tooltip>
          )}
          <Tooltip
            title="Quy Chuẩn Di Sản"
            content="Kiểm tra mức độ chuẩn mực và quy tắc phối đồ truyền thống."
            shortcut="Quy chuẩn"
            position="bottom"
          >
            <button
              type="button"
              onClick={() => openGiuChuanVanHoa(currentTrangPhuc.ten)}
              className="outfit-screen__pill-btn"
              title={domdom.giuChuanVanHoa.tieuDe}
            >
              🛡️ Chuẩn di sản
            </button>
          </Tooltip>

          <Tooltip
            title="Hiệu Ứng Âm Thanh"
            content="Âm thanh sột soạt vải lụa, tiếng chuông bạc và guốc mộc khi tương tác."
            shortcut={soundOn ? "Bật" : "Tắt"}
            position="bottom"
          >
            <button
              type="button"
              onClick={handleToggleSound}
              className="outfit-screen__pill-btn"
              title={soundOn ? domdom.s4.amThanhTat : domdom.s4.amThanhBat}
              aria-label={soundOn ? domdom.s4.amThanhTat : domdom.s4.amThanhBat}
            >
              {soundOn ? "🔔 Bật" : "🔕 Tắt"}
            </button>
          </Tooltip>

          <Tooltip
            title="Nhân Vật Người Mẫu"
            content="Tùy chỉnh vóc dáng, số đo chiều cao và gương mặt nhân vật thử áo."
            shortcut="Đổi dáng"
            position="bottom"
          >
            <button
              type="button"
              onClick={onOpenCharacterSelect}
              className="outfit-screen__pill-btn"
            >
              👥 Đổi nhân vật
            </button>
          </Tooltip>

          <Tooltip
            title="Kho Cổ Phục"
            content="Quay lại bộ sưu tập để chọn nếp áo di sản khác."
            shortcut="Quay lại"
            position="bottom"
          >
            <button
              type="button"
              onClick={onBackToDetail}
              className="outfit-screen__back-btn"
            >
              ← {domdom.nhanVat.quayLai}
            </button>
          </Tooltip>
        </div>
      </header>

      <div className="outfit-screen__body">
        {/* ============================================================== */}
        {/* KHỐI 1: XEM TRƯỚC LỚN (Nhân vật 2D + Trang phục phối)           */}
        {/* ============================================================== */}
        <section className="outfit-screen__preview-section">
          <div
            className={`outfit-screen__stage ${
              isPerforming ? "outfit-screen__stage--performing" : ""
            }`}
          >
            {isPerforming && (
              <div className="outfit-screen__firefly-trace" aria-hidden="true">
                <span className="outfit-screen__firefly-sparkle" />
              </div>
            )}

            <AvatarSVG
              nhanVat={nhanVat}
              customViewBox={computedViewBox}
              className="outfit-screen__avatar-svg"
              childrenDefs={<CulturalPatternsDefs />}
              childrenVayQuan={garmentLayers.childrenVayQuan}
              childrenAo={garmentLayers.childrenAo}
              childrenPhuKienThan={garmentLayers.childrenPhuKienThan}
              childrenTocTruocKhanNon={garmentLayers.childrenTocTruocKhanNon}
            />
          </div>

          {/* Dòng tóm lược trang phục */}
          <div className="outfit-screen__stage-meta">
            <span className="outfit-screen__stage-tag">
              {currentTrangPhuc.ten} · {activeColorObj.ten}
            </span>
            {tenNhomHoaVan && (
              <span className="outfit-screen__stage-badge">
                ✦ Hoa văn {tenNhomHoaVan}
              </span>
            )}
          </div>

          {/* CHỈ BÁO TINH GỌN: KHÔNG DÀI DÒNG, TẬP TRUNG THỊ GIÁC */}
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-[420px] w-full">
            <Tooltip
              title="Phối Màu Truyền Thống"
              content="Đánh giá tính tương sinh, tương khắc ngũ hành và lễ nghi cổ truyền."
              shortcut="Ngũ hành"
              position="top"
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 text-xs font-semibold shadow-xs cursor-help">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>{colorEvaluation.nhanHienThi}</span>
              </div>
            </Tooltip>

            <Tooltip
              title="Độ Chuẩn Mực / Sáng Tạo"
              content="Nhận diện mức độ giữ nguyên bản phục dựng hay kết hợp yếu tố cách tân."
              shortcut="Chuẩn mực"
              position="top"
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 text-xs font-semibold shadow-xs cursor-help">
                <span>✨</span>
                <span>{remixEvaluation.nhanHienThi}</span>
              </div>
            </Tooltip>

            <Tooltip
              title="Cố Vấn Cò Em"
              content="Lắng nghe Cò Em phân tích triết lý và câu chuyện lịch sử của bộ phối này."
              shortcut="Hỏi Cò Em"
              position="top"
            >
              <button
                type="button"
                onClick={handleOpenViSao}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-[var(--vien-the)] bg-[var(--nen-the)] text-[var(--vang-chinh)] text-xs font-medium hover:border-[var(--vang-chinh)] cursor-pointer shadow-xs transition-colors"
                title="Cò Em lý giải góc nhìn văn hóa"
              >
                <span>💡 Ý nghĩa nếp áo</span>
              </button>
            </Tooltip>
          </div>

          {/* NÚT HOÀN TẤT & CẤT VÀO GÙI & LOOKBOOK & SO SÁNH */}
          <div className="outfit-screen__stage-actions flex flex-wrap items-center justify-center gap-2">
            <Tooltip
              title="Trình Diễn Trang Phục"
              content="Xem nhân vật tạo dáng uyển chuyển và hoàn tất bộ phối này."
              shortcut="Trình diễn"
              position="top"
            >
              <button
                type="button"
                onClick={handleFinishOutfit}
                disabled={isPerforming}
                className="outfit-screen__finish-btn"
              >
                ✦ {domdom.s4.hoanTatBoNay}
              </button>
            </Tooltip>

            <Tooltip
              title="Tủ Đồ Gùi Ký Ức"
              content="Cất giữ bộ phối này vào tủ đồ cá nhân để xem lại và chia sẻ."
              shortcut="Lưu đồ"
              position="top"
            >
              <button
                type="button"
                onClick={() => setShowCatGuiModal(true)}
                className="outfit-screen__cat-gui-btn"
                title={domdom.guiKyUc.nutCatVaoGui}
              >
                🎒 {domdom.guiKyUc.nutCatVaoGui}
              </button>
            </Tooltip>

            <Tooltip
              title="Lookbook Việt Phục Gen Z"
              content="Tạo thẻ tạp chí thời trang nghệ thuật, lưu giữ bảng màu và chia sẻ với bạn bè."
              shortcut="Lookbook"
              position="top"
            >
              <button
                type="button"
                onClick={() => setShowLookbookModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-amber-600/25 hover:scale-[1.02] active:scale-95 transition cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-200" />
                <span>Lookbook Gen Z</span>
              </button>
            </Tooltip>

            <Tooltip
              title="So Sánh Phương Án (A/B)"
              content="Đặt hai cách phối đồ cạnh nhau để so sánh màu sắc, phụ kiện và sự kiện."
              shortcut="So sánh"
              position="top"
            >
              <button
                type="button"
                onClick={handleOpenCompareModal}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-emerald-500 text-slate-800 dark:text-slate-200 font-semibold text-xs sm:text-sm shadow-xs hover:scale-[1.02] active:scale-95 transition cursor-pointer"
              >
                <ArrowRightLeft className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>So Sánh (A/B)</span>
              </button>
            </Tooltip>
          </div>

          {/* Toast hoàn tất */}
          {completedMoment && !isPerforming && (
            <div className="outfit-screen__completed-toast flex flex-col gap-1.5 text-left max-w-[420px] w-full">
              <div className="flex items-center gap-2">
                <span className="outfit-screen__toast-sparkle">✨</span>
                <span className="font-semibold text-emerald-800">{domdom.s4.chucMung}</span>
              </div>
              <div className="flex items-center gap-3 mt-1 flex-wrap text-xs">
                <button
                  type="button"
                  onClick={onSelectAnotherCostume}
                  className="text-[var(--vang-chinh)] font-semibold hover:underline cursor-pointer bg-transparent border-0 p-0"
                >
                  {domdom.s4.doiTrangPhuc} →
                </button>
                {onOpenDongThoiGian && (currentTrangPhuc.id === "aodai" || currentTrangPhuc.id === "ngu_than") && (
                  <button
                    type="button"
                    onClick={onOpenDongThoiGian}
                    className="text-[var(--xanh-chinh)] hover:underline cursor-pointer bg-transparent border-0 p-0 font-medium"
                  >
                    ⏳ Dòng thời gian áo dài →
                  </button>
                )}
              </div>
            </div>
          )}
        </section>

        {/* ============================================================== */}
        {/* KHỐI 2: BÀN PHỐI ĐỒ THEO THƯ MỤC TRỰC QUAN (Folder Tabs)         */}
        {/* ============================================================== */}
        <section className="outfit-screen__controls-section">
          {/* BANNER GỢI Ý THỜI TIẾT THỰC TẾ & KHÍ HẬU */}
          {weatherState && (
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-sky-50 via-teal-50 to-emerald-50 dark:from-slate-800 dark:via-teal-950/40 dark:to-emerald-950/40 border border-teal-200/80 dark:border-teal-700/60 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-base">
                  {weatherState.thoiTiet === "nong" ? "☀️" : weatherState.thoiTiet === "lanh" ? "❄️" : weatherState.thoiTiet === "mua" ? "🌧️" : "🌤️"}
                </span>
                <span className="text-slate-700 dark:text-slate-300">
                  Thời tiết {weatherState.viTri?.ten || "quê nhà"}: <strong>{weatherState.nhietDo}°C · {weatherState.moTaThoiTiet}</strong>
                </span>
              </div>
              <span className="text-[11px] font-semibold text-teal-800 dark:text-teal-300 hidden sm:inline">
                {weatherState.thoiTiet === "nong"
                  ? "✦ Ưu tiên Lụa tơ tằm, Đũi thoáng khí"
                  : weatherState.thoiTiet === "lanh"
                  ? "✦ Ưu tiên Gấm dày dặn, Áo ngũ thân nhiều lớp"
                  : weatherState.thoiTiet === "mua"
                  ? "✦ Ưu tiên Áo bà ba, Guốc mộc gọn gàng"
                  : "✦ Thời tiết lý tưởng để diện mọi loại cổ phục"}
              </span>
            </div>
          )}

          {/* Thanh Tab Thư Mục Phối Đồ: Sự kiện, Màu vải, Loại vải, Họa tiết, Phụ kiện, Giày dép, Hài hòa, Giới tính, Khu vực */}
          <div className="mb-2">
            <OutfitControlTabs
              activeTab={activeOutfitTab}
              onSelectTab={setActiveOutfitTab}
            />
          </div>

          {/* 0. THƯ MỤC: SỰ KIỆN & NHU CẦU GEN Z */}
          {activeOutfitTab === "su_kien" && (
            <div>
              <GenzEventSelector
                selectedEventId={selectedEventId}
                onSelectEvent={handleSelectEvent}
                onApplyRecommendation={handleApplyEventRecommendation}
              />
            </div>
          )}

          {/* 1. THƯ MỤC: MÀU VẢI */}
          {activeOutfitTab === "mau_sac" && (
            <div className="outfit-control-card">
              <ColorSelector
                selectedColorId={selectedMauId}
                onSelectColor={handleSelectColor}
                hoveredColorId={hoveredColorId}
                onHoverColor={setHoveredColorId}
              />
            </div>
          )}

          {/* 2. THƯ MỤC: LOẠI VẢI */}
          {activeOutfitTab === "loai_vai" && (
            <div className="outfit-control-card">
              <FabricSelector
                selectedFabricId={currentVai?.id || "lua_van_phuc"}
                onSelectFabric={handleSelectFabric}
              />
            </div>
          )}

          {/* 3. THƯ MỤC: HỌA TIẾT DI SẢN MƯỢN */}
          {activeOutfitTab === "hoa_tiet" && (
            <div className="outfit-control-card">
              <PatternSelector
                selectedPatternId={hoaVanThem}
                onSelectPattern={handleSelectHoaVan}
              />
            </div>
          )}

          {/* 4. THƯ MỤC: PHỤ KIỆN */}
          {activeOutfitTab === "phu_kien" && (
            <div className="outfit-control-card">
              <AccessorySelector
                selectedIds={selectedPhuKienIds}
                onToggleAccessory={handleToggleAccessory}
              />
            </div>
          )}

          {/* 5. THƯ MỤC: GIÀY DÉP */}
          {activeOutfitTab === "giay_dep" && (
            <div className="outfit-control-card">
              <FootwearSelector
                selectedFootwearId={selectedFootwearId}
                onSelectFootwear={handleSelectFootwear}
              />
            </div>
          )}

          {/* 6. THƯ MỤC: HÀI HÒA NGŨ HÀNH & GÁC CỔNG VĂN HÓA */}
          {activeOutfitTab === "hai_hoa" && (
            <div className="space-y-3">
              <ColorHarmonyChecker
                selectedColorId={selectedMauId}
                selectedAccessoryColorId={selectedPhuKienIds[0]}
              />
              <CulturalWarningCard
                trangPhucId={currentTrangPhuc.id}
                mauId={selectedMauId}
                phuKienIds={selectedPhuKienIds}
                giayId={selectedFootwearId}
                phongCachId={phongCach}
              />
            </div>
          )}

          {/* 6. THƯ MỤC: GIỚI TÍNH */}
          {activeOutfitTab === "gioi_tinh" && (
            <div className="outfit-control-card">
              <GenderFilterCard
                currentGender={nhanVat.gioi}
                onSelectGender={() => onOpenCharacterSelect()}
              />
            </div>
          )}

          {/* 7. THƯ MỤC: KHU VỰC VĂN HÓA */}
          {activeOutfitTab === "khu_vuc" && (
            <div className="outfit-control-card">
              <RegionFilterCard
                onSelectRegion={() => onSelectAnotherCostume()}
              />
            </div>
          )}

          {/* GỢI Ý PHỐI ĐỒ DI SẢN CHUẨN ĐIỆU */}
          {GOI_Y_PRESETS_BY_COSTUME[currentTrangPhuc.id] &&
            GOI_Y_PRESETS_BY_COSTUME[currentTrangPhuc.id].length > 0 && (
              <div className="outfit-control-card mt-2 border border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-amber-500 text-sm">✨</span>
                    <h2 className="text-xs font-bold text-[var(--vang-chinh)] uppercase tracking-wider m-0">
                      Gợi Ý Phối Đồ Di Sản Chuẩn Điệu
                    </h2>
                  </div>
                  <span className="text-[10px] text-amber-700/80 dark:text-amber-300/80 italic">
                    1-Chạm mặc chuẩn văn hóa
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {GOI_Y_PRESETS_BY_COSTUME[currentTrangPhuc.id].map((preset, idx) => {
                    const isMatching =
                      selectedMauId === preset.mauId &&
                      selectedFootwearId === preset.footwearId &&
                      preset.phuKienIds.every((id) => selectedPhuKienIds.includes(id));
                    return (
                      <div
                        key={idx}
                        className={`p-2.5 rounded-lg border transition-all text-left flex flex-col justify-between gap-1.5 ${
                          isMatching
                            ? "border-amber-500 bg-amber-100/70 dark:bg-amber-900/40 shadow-xs"
                            : "border-[var(--vien-the)] bg-[var(--nen-the)] hover:border-amber-400/60"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[var(--nen-toi)]">
                              {preset.ten}
                            </span>
                            {isMatching && (
                              <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-1.5 py-0.5 rounded-full">
                                Đang chọn
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-[var(--chu-mo)] mt-1 line-clamp-2 leading-tight">
                            {preset.moTa}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleApplyPreset(preset)}
                          className={`w-full py-1 px-2 rounded text-xs font-medium cursor-pointer transition-colors mt-1 ${
                            isMatching
                              ? "bg-amber-600 text-white font-semibold"
                              : "bg-[var(--nen-the-phu)] hover:bg-amber-500 hover:text-white text-[var(--nen-toi)] border border-[var(--vien-the)]"
                          }`}
                        >
                          {isMatching ? "✓ Đã áp dụng gợi ý này" : "✦ Áp dụng gợi ý phối này"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          {/* PHONG CÁCH PHỐI ĐỒ TRỰC QUAN */}
          <div className="outfit-control-card mt-1">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xs font-semibold text-[var(--nen-toi)] uppercase tracking-wider m-0">
                {domdom.s4.phongCach}
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { id: "truyen_thong", ten: "🌿 " + domdom.s4.phongCachTruyenThong },
                { id: "cach_tan_nhe", ten: "🌾 " + domdom.s4.phongCachCachTan },
                { id: "ca_tinh", ten: "⚡ " + domdom.s4.phongCachCaTinh },
              ].map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => {
                    setPhongCach(st.id);
                    playFabricRustle();
                  }}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                    phongCach === st.id
                      ? "bg-[var(--xanh-chinh)] text-white border-[var(--xanh-la)] shadow-xs"
                      : "bg-[var(--nen-the)] border-[var(--vien-the)] text-[var(--chu-mo)] hover:text-[var(--nen-toi)] hover:bg-[var(--xanh-nhe)]"
                  }`}
                  style={{ borderRadius: "var(--vien-lech-a)" }}
                >
                  {st.ten}
                </button>
              ))}
            </div>
          </div>

          {/* GHI CHÚ CHẤT LIỆU & LÝ DO REMIX: THU GỌN THEO Ý MUỐN (Tránh nhiều chữ gây phân tâm) */}
          <div className="border border-[var(--vien-the)] bg-[var(--nen-the)] rounded-lg p-2.5">
            <button
              type="button"
              onClick={() => setShowCulturalNotes((v) => !v)}
              className="w-full flex items-center justify-between text-xs text-[var(--chu-mo)] hover:text-[var(--nen-toi)] bg-transparent border-0 cursor-pointer p-1"
            >
              <span className="font-semibold flex items-center gap-1.5">
                <span>📜</span>
                <span>Thông tin mở rộng: Chất liệu làng nghề & Tâm sự nếp áo</span>
              </span>
              <span>{showCulturalNotes ? "▲ Thu gọn" : "▼ Xem thêm"}</span>
            </button>

            {showCulturalNotes && (
              <div className="pt-3 border-t border-[var(--vien-the)] mt-2 space-y-3">
                {currentVai && (
                  <GhiChuChatLieuCard
                    vai={currentVai}
                    onSelectVai={(v) => setCustomSelectedVai(v)}
                  />
                )}

                <div className="p-3 rounded-lg border border-[var(--vien-the)] bg-[var(--nen-the-phu)] text-left">
                  <div className="text-xs font-semibold text-[var(--vang-chinh)] uppercase tracking-wider mb-2">
                    💭 Bạn muốn remix vì điều gì? (Tuỳ chọn)
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {DANH_SACH_LY_DO_REMIX.map((lyDo) => {
                      const isSelected = selectedLyDoRemix.includes(lyDo);
                      return (
                        <button
                          key={lyDo}
                          type="button"
                          onClick={() => {
                            setSelectedLyDoRemix((prev) =>
                              prev.includes(lyDo)
                                ? prev.filter((x) => x !== lyDo)
                                : [...prev, lyDo]
                            );
                          }}
                          className={`px-2.5 py-1 text-xs transition-all cursor-pointer rounded ${
                            isSelected
                              ? "bg-[var(--xanh-chinh)] text-white font-medium"
                              : "bg-[var(--nen-the)] text-[var(--chu-mo)] border border-[var(--vien-the)] hover:text-[var(--nen-toi)]"
                          }`}
                          style={{ borderRadius: "var(--vien-lech-a)" }}
                        >
                          {isSelected ? "✓ " : ""}{lyDo}
                        </button>
                      );
                    })}
                  </div>
                  {cauLyDoRemix && (
                    <div className="p-2 rounded text-xs bg-[var(--nen-the-phu)] border border-[var(--vien-the)] text-[var(--nen-toi)] italic">
                      &ldquo;{cauLyDoRemix}&rdquo;
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      <AppFooter currentCostumeName={currentTrangPhuc.ten} />

      {/* Modal Một Trang Đời */}
      <MotTrangDoiModal
        trangPhucId={currentTrangPhuc.id}
        isOpen={showStory}
        onClose={() => setShowStory(false)}
      />

      {/* Modal Cất vào Gùi Ký Ức */}
      {showCatGuiModal && (
        <CatVaoGuiModal
          trangPhucId={currentTrangPhuc.id}
          tenTrangPhuc={currentTrangPhuc.ten}
          mauId={selectedMauId}
          tenMau={activeColorObj.ten}
          phuKienIds={selectedPhuKienIds}
          tenPhuKienList={selectedPhuKienIds.map(
            (id) => phuKien.find((p) => p.id === id)?.ten ?? id
          )}
          hoaVanThem={hoaVanThem}
          phongCach={phongCach}
          lyDoRemix={selectedLyDoRemix}
          cauLyDoRemix={cauLyDoRemix || undefined}
          nhanVatPreview={
            <AvatarSVG
              nhanVat={nhanVat}
              customViewBox={computedViewBox}
              childrenDefs={<CulturalPatternsDefs />}
              childrenVayQuan={garmentLayers.childrenVayQuan}
              childrenAo={garmentLayers.childrenAo}
              childrenPhuKienThan={garmentLayers.childrenPhuKienThan}
              childrenTocTruocKhanNon={garmentLayers.childrenTocTruocKhanNon}
            />
          }
          onClose={() => setShowCatGuiModal(false)}
          onOpenGuiKyUc={() => {
            setShowCatGuiModal(false);
            onOpenGuiKyUc?.();
          }}
        />
      )}

      {/* Modal Cố Vấn Văn Hóa Cò Em */}
      {showViSaoModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
          onClick={() => setShowViSaoModal(false)}
        >
          <div
            className="relative w-full max-w-lg bg-[var(--nen-the)] border border-[var(--vien-the)] rounded-xl p-6 text-[var(--nen-toi)] shadow-xl"
            style={{ borderRadius: "var(--vien-lech-a)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">✨</span>
                <h3 className="font-serif text-base font-bold text-[var(--vang-chinh)] m-0">
                  Cố vấn văn hóa Cò Em · Ý nghĩa nếp áo
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowViSaoModal(false)}
                className="px-2.5 py-1 rounded-full text-xs font-bold bg-[var(--nen-the-phu)] hover:bg-rose-100 hover:text-rose-700 dark:hover:bg-rose-950 dark:hover:text-rose-300 text-[var(--chu-phu)] border border-[var(--vien-the)] cursor-pointer transition-colors shadow-xs"
                aria-label="Đóng"
              >
                ✕ Đóng
              </button>
            </div>

            <div className="min-h-[80px]">
              {viSaoLoading ? (
                <div className="flex items-center gap-2.5 py-6 text-[var(--vang-chinh)] text-sm">
                  <span className="w-2.5 h-2.5 rounded-full bg-[var(--vang-chinh)] animate-ping" />
                  <span>{domdom.chat.dangTim}</span>
                </div>
              ) : (
                <div className="text-sm leading-relaxed text-[var(--nen-toi)] space-y-3">
                  <p className="m-0">{viSaoText}</p>
                  <div className="text-xs text-[var(--tro-tram)] pt-2 border-t border-[var(--vien-the)]">
                    <span>✦ Nguồn đối chiếu: Phục trang và chuẩn mực truyền thống các dân tộc Việt Nam.</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end mt-5">
              <button
                type="button"
                onClick={() => setShowViSaoModal(false)}
                className="bg-[var(--vang-nghe)] text-[#1A3022] font-semibold text-xs px-4 py-2 rounded-lg cursor-pointer hover:brightness-105 shadow-sm border-0"
                style={{ borderRadius: "var(--vien-lech-a)" }}
              >
                Đã hiểu, tiếp tục phối đồ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL SO SÁNH PHƯƠNG ÁN (A/B) */}
      <OutfitCompareModal
        isOpen={showCompareModal}
        onClose={() => setShowCompareModal(false)}
        optionA={{
          ten: "Phương án đang chọn (A)",
          trangPhucId: currentTrangPhuc.id,
          mauId: selectedMauId,
          phuKienIds: selectedPhuKienIds,
          footwearId: selectedFootwearId,
          hoaVanThem,
          phongCach,
        }}
        optionB={optionBForCompare}
        onSelectOption={handleApplyOptionFromCompare}
      />

      {/* MODAL XUẤT THẺ LOOKBOOK VIỆT PHỤC GEN Z */}
      <LookbookModal
        isOpen={showLookbookModal}
        onClose={() => setShowLookbookModal(false)}
        trangPhucId={currentTrangPhuc.id}
        mauId={selectedMauId}
        phuKienIds={selectedPhuKienIds}
        footwearId={selectedFootwearId}
        activeHoSo={activeHoSo}
        onSaveToGui={() => setShowCatGuiModal(true)}
      />
    </main>
  );
}

const css = `
.outfit-screen {
  position: relative;
  min-height: 100vh;
  min-height: 100dvh;
  background: transparent;
  color: var(--nen-toi);
  font-family: var(--font-than);
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
}

.outfit-screen__noise {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,${noise}");
  opacity: .03;
  pointer-events: none;
}

.outfit-screen__header {
  position: relative;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background: var(--nen-sidebar);
  border-bottom: 1px solid var(--sidebar-border);
  flex-wrap: wrap;
  gap: 12px;
  backdrop-filter: blur(8px);
}

.outfit-screen__brand-name {
  display: block;
  font-family: var(--font-tieu-de);
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--nen-toi);
}

.outfit-screen__brand-sub {
  display: block;
  font-size: .8rem;
  color: var(--xanh-chinh);
  font-weight: 500;
}

.outfit-screen__header-actions {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}

.outfit-screen__pill-btn {
  padding: 5px 11px;
  background: var(--nen-the);
  border: 1px solid var(--vien-the);
  color: var(--nen-toi);
  border-radius: var(--vien-lech-a);
  font-size: 0.8rem;
  font-family: var(--font-than);
  cursor: pointer;
  transition: all var(--nhip-cham) ease;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.outfit-screen__pill-btn:hover {
  background: var(--xanh-nhe);
  border-color: var(--xanh-la);
  color: var(--xanh-dam);
}

.outfit-screen__pill-btn--highlight {
  border-color: var(--vang-nghe);
  background: var(--vang-nhe);
  color: var(--vang-chinh);
  font-weight: 600;
}

.outfit-screen__back-btn {
  padding: 5px 12px;
  background: var(--nen-the);
  border: 1px solid var(--vien-the);
  color: var(--nen-toi);
  border-radius: var(--vien-lech-b);
  font-size: 0.8rem;
  cursor: pointer;
  transition: all var(--nhip-cham) ease;
}

.outfit-screen__back-btn:hover {
  background: var(--xanh-nhe);
  border-color: var(--xanh-la);
}

.outfit-screen__body {
  position: relative;
  z-index: 10;
  max-width: 86rem;
  margin: 0 auto;
  padding: 16px 20px 60px;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

@media (min-width: 1024px) {
  .outfit-screen__body {
    flex-direction: row;
    align-items: flex-start;
    justify-content: center;
    gap: 36px;
  }

  .outfit-screen__preview-section {
    position: sticky;
    top: 72px;
    flex: 0 0 320px;
    max-width: 320px;
    width: 320px;
  }

  .outfit-screen__controls-section {
    flex: 1 1 0;
    min-width: 0;
    max-width: 760px;
  }
}

.outfit-screen__preview-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.outfit-screen__stage {
  position: relative;
  width: 100%;
  max-width: 320px;
  max-height: 480px;
  aspect-ratio: 320 / 480;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.92) 0%, rgba(245, 251, 247, 0.88) 100%);
  border: 1px solid var(--vien-the);
  border-radius: var(--vien-lech-a);
  border-left: 3px solid var(--xanh-la);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  box-sizing: border-box;
  box-shadow: var(--shadow-the);
  overflow: hidden;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  transition: transform var(--nhip-cham) ease, background var(--nhip-cham) ease, border-color var(--nhip-cham) ease;
}

html[data-theme="dark"] .outfit-screen__stage,
html.theme-dark .outfit-screen__stage,
html.dark .outfit-screen__stage {
  background: linear-gradient(180deg, rgba(16, 37, 66, 0.85) 0%, rgba(11, 25, 46, 0.95) 100%) !important;
  border-color: rgba(56, 189, 248, 0.35) !important;
  border-left: 3px solid var(--xanh-la) !important;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(16, 185, 129, 0.15) !important;
}

.outfit-screen__stage--performing {
  animation: characterTiltSway 1.5s ease-in-out;
}

@keyframes characterTiltSway {
  0% { transform: rotate(0deg) scale(1); }
  25% { transform: rotate(2deg) translateY(-2px) scale(1.01); }
  60% { transform: rotate(-1.5deg) translateY(-1px) scale(1.01); }
  100% { transform: rotate(0deg) scale(1); }
}

.outfit-screen__avatar-svg {
  width: 100%;
  height: 100%;
  max-height: 520px;
}

.outfit-screen__firefly-trace {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 25;
}

.outfit-screen__firefly-sparkle {
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--vang-sang);
  box-shadow: 0 0 16px 6px rgba(250, 204, 21, 0.7);
  animation: fireflyFlight 1.5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
}

@keyframes fireflyFlight {
  0% { top: 65%; left: -20px; opacity: 0; }
  20% { opacity: 1; }
  50% { top: 30%; left: 45%; transform: scale(1.3); opacity: 0.95; }
  80% { opacity: 0.8; }
  100% { top: 15%; left: 105%; opacity: 0; }
}

.outfit-screen__stage-meta {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  text-align: center;
}

.outfit-screen__stage-tag {
  font-family: var(--font-tieu-de);
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--nen-toi);
}

.outfit-screen__stage-badge {
  font-size: 0.82rem;
  color: var(--vang-chinh);
  font-weight: 500;
}

.outfit-screen__stage-actions {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  width: 100%;
  margin-top: 4px;
}

.outfit-screen__finish-btn {
  min-height: 42px;
  padding: 10px 24px;
  background: var(--vang-nghe) !important;
  border: 1px solid var(--vang-chinh);
  color: #1A3022 !important;
  border-radius: var(--vien-lech-a);
  font-family: var(--font-than);
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 3px 12px rgba(202, 138, 4, 0.25);
  transition: all var(--nhip-cham) ease;
}

.outfit-screen__finish-btn:hover {
  filter: brightness(1.06);
  transform: translateY(-1px);
}

.outfit-screen__cat-gui-btn {
  min-height: 42px;
  padding: 10px 20px;
  background: var(--xanh-chinh);
  border: 1px solid var(--xanh-dam);
  color: #FFFFFF;
  border-radius: var(--vien-lech-b);
  font-family: var(--font-than);
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 3px 12px rgba(21, 128, 61, 0.2);
  transition: all var(--nhip-cham) ease;
}

.outfit-screen__cat-gui-btn:hover {
  background: var(--xanh-la);
  transform: translateY(-1px);
}

.outfit-screen__completed-toast {
  padding: 8px 16px;
  background: var(--xanh-nhe);
  border: 1px solid var(--xanh-mint);
  border-radius: var(--vien-lech-a);
  font-size: 0.88rem;
  box-shadow: var(--shadow-the);
}

.outfit-screen__toast-sparkle {
  color: var(--vang-chinh);
}

.outfit-screen__controls-section {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.outfit-control-card {
  padding: 16px;
  background: var(--nen-the);
  border: 1px solid var(--vien-the);
  border-radius: var(--vien-lech-a);
  box-shadow: var(--shadow-the);
  box-sizing: border-box;
}
`;
