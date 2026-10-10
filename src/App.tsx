/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from "react";
import GateScreen from "./screens/GateScreen";
import QueNhaScreen from "./screens/QueNhaScreen";
import CostumeSelectScreen from "./screens/CostumeSelectScreen";
import CostumeDetailScreen from "./screens/CostumeDetailScreen";
import CharacterSelectScreen from "./screens/CharacterSelectScreen";
import OutfitScreen from "./screens/OutfitScreen";
import GuiKyUcScreen from "./screens/GuiKyUcScreen";
import GiuChuanVanHoaScreen from "./screens/GiuChuanVanHoaScreen";
import ThamTuScreen from "./screens/ThamTuScreen";
import BanDoScreen from "./screens/BanDoScreen";
import DongThoiGianScreen from "./screens/DongThoiGianScreen";
import SoiChiChungScreen from "./screens/SoiChiChungScreen";
import ChoPhienScreen from "./screens/ChoPhienScreen";
import ChaoBanScreen from "./screens/ChaoBanScreen";
import NhatKyTraiNghiemScreen from "./screens/NhatKyTraiNghiemScreen";
import CaiDatTraiNghiemModal from "./components/CaiDatTraiNghiemModal";
import AuthModal from "./components/AuthModal";
import BauTroi from "./components/BauTroi";
import TopBar from "./components/TopBar";
import SidebarNav from "./components/SidebarNav";
import CoEmChat from "./components/CoEmChat";
import { TooltipProvider } from "./components/Tooltip";
import { coem, domdom } from "./copy/coem";
import { QueNhaData } from "./types";
import { NhanVatConfig, NHAN_VAT_MAC_DINH } from "./lib/avatar";
import { CharacterModel, CharacterStorageService } from "./characters";
import { VungId, layVungTheoId } from "./data/vung";
import { nhom } from "./data/nhom";
import {
  layThoiTietVung,
  ThoiTietState,
  ThongTinViTri,
  docViTriSession,
  docThamSoURL,
} from "./lib/thoitiet";
import { OutfitSaved } from "./lib/guiKyUc";
import {
  HoSo,
  layHoSoHienTai,
  layKhoaTheoHoSo,
  taoHoacChonHoSo,
  PROFILE_CHANGE_EVENT,
} from "./lib/hoSo";
import { useCaiDatTraiNghiem } from "./lib/caiDatTraiNghiem";
import {
  ThemeMode,
  layThemeHienTai,
  apDungTheme,
  THEME_CHANGE_EVENT,
} from "./lib/theme";

type Screen =
  | "chao_ban"
  | "gate"
  | "que_nha"
  | "s2"
  | "s3"
  | "nhan_vat"
  | "s4"
  | "test"
  | "giu_chuan"
  | "gui_ky_uc"
  | "nhat_ky"
  | "tham_tu"
  | "ban_do"
  | "dong_thoi_gian"
  | "soi_chi_chung"
  | "cho_phien";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>(() => {
    if (typeof window !== "undefined") {
      const urlScreen = new URLSearchParams(window.location.search).get("screen") as Screen;
      if (urlScreen) return urlScreen;
    }
    return "gate";
  });

  const [activeHoSo, setActiveHoSo] = useState<HoSo>(() => layHoSoHienTai());
  const [showChaoBanModal, setShowChaoBanModal] = useState(false);
  const [showTraiNghiemModal, setShowTraiNghiemModal] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "register">("login");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [caiDatTraiNghiem] = useCaiDatTraiNghiem();

  const [selectedTrangPhucId, setSelectedTrangPhucId] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const tp = urlParams.get("tp");
      const m = urlParams.get("m");
      const pk = urlParams.get("pk");
      const fw = urlParams.get("fw");
      if (tp) {
        if (m || pk || fw) {
          try {
            const data = {
              trangPhucId: tp,
              mauId: m || "m_do",
              phuKienIds: pk ? pk.split(",") : [],
              footwearId: fw || "guoc_moc",
            };
            window.localStorage.setItem(
              layKhoaTheoHoSo(`outfit:${tp}`),
              JSON.stringify(data)
            );
          } catch {
            // bỏ qua
          }
        }
        return tp;
      }
    }
    return "aodai";
  });
  const [selectedNhomFilterForS2, setSelectedNhomFilterForS2] = useState<string>("all");
  const [returnScreenFromChar, setReturnScreenFromChar] = useState<Screen>("s3");
  const [returnScreenFromGui, setReturnScreenFromGui] = useState<Screen>("s4");
  const [returnScreenFromDongThoiGian, setReturnScreenFromDongThoiGian] = useState<Screen>("s2");
  const [returnScreenFromSoiChi, setReturnScreenFromSoiChi] = useState<Screen>("s2");
  const [returnScreenFromChoPhien, setReturnScreenFromChoPhien] = useState<Screen>("s2");
  const [giuChuanModal, setGiuChuanModal] = useState<{
    open: boolean;
    costumeName?: string;
  }>({ open: false });

  const [theme, setTheme] = useState<ThemeMode>(() => layThemeHienTai());

  useEffect(() => {
    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ theme: ThemeMode }>;
      if (customEvent.detail?.theme) {
        setTheme(customEvent.detail.theme);
      }
    };
    window.addEventListener(THEME_CHANGE_EVENT, handleThemeChange);
    return () => window.removeEventListener(THEME_CHANGE_EVENT, handleThemeChange);
  }, []);

  useEffect(() => {
    const handleOpenAuth = (e: Event) => {
      const customEvent = e as CustomEvent<{ mode?: "login" | "register" }>;
      if (customEvent.detail?.mode === "register") {
        setAuthModalMode("register");
      } else {
        setAuthModalMode("login");
      }
      setIsAuthModalOpen(true);
    };
    window.addEventListener("vpr:open-auth-modal", handleOpenAuth);
    return () => window.removeEventListener("vpr:open-auth-modal", handleOpenAuth);
  }, []);

  useEffect(() => {
    const handleAuthChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ name?: string } | null>;
      if (customEvent.detail?.name) {
        const hoSo = taoHoacChonHoSo(customEvent.detail.name);
        setActiveHoSo(hoSo);
      } else {
        setActiveHoSo(layHoSoHienTai());
      }
    };
    window.addEventListener("vpr:auth-change", handleAuthChange);
    return () => window.removeEventListener("vpr:auth-change", handleAuthChange);
  }, []);

  useEffect(() => {
    const handleOpenProfile = () => setShowChaoBanModal(true);
    window.addEventListener("vpr:open-profile", handleOpenProfile);
    return () => window.removeEventListener("vpr:open-profile", handleOpenProfile);
  }, []);

  useEffect(() => {
    const handleOpenNhatKy = () => {
      setReturnScreenFromGui(currentScreen);
      setCurrentScreen("nhat_ky");
    };
    window.addEventListener("vpr:open-nhat-ky", handleOpenNhatKy);
    return () => window.removeEventListener("vpr:open-nhat-ky", handleOpenNhatKy);
  }, [currentScreen]);

  const handleToggleTheme = () => {
    const next: ThemeMode = theme === "light" ? "dark" : "light";
    setTheme(next);
    apDungTheme(next);
  };

  const handleNavigateFromSidebar = (screen: Screen) => {
    if (screen === "gui_ky_uc" || screen === "nhat_ky") {
      setReturnScreenFromGui(currentScreen);
    } else if (screen === "dong_thoi_gian") {
      setReturnScreenFromDongThoiGian(currentScreen);
    } else if (screen === "soi_chi_chung") {
      setReturnScreenFromSoiChi(currentScreen);
    } else if (screen === "cho_phien") {
      setReturnScreenFromChoPhien(currentScreen);
    }
    setCurrentScreen(screen);
  };

  useEffect(() => {
    const handleOpen = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setGiuChuanModal({
        open: true,
        costumeName: detail?.costumeName,
      });
    };
    window.addEventListener("vpr:open-giu-chuan", handleOpen);
    return () => window.removeEventListener("vpr:open-giu-chuan", handleOpen);
  }, []);

  // Lắng nghe thay đổi hồ sơ để tải lại dữ liệu nhân vật, quê nhà và gùi ký ức
  useEffect(() => {
    const handleProfileChange = (e: Event) => {
      const customEvent = e as CustomEvent<HoSo>;
      const newHoSo = customEvent.detail || layHoSoHienTai();
      setActiveHoSo(newHoSo);

      // Tải lại characterConfig theo hồ sơ mới
      try {
        const charModel = CharacterStorageService.loadCharacter();
        setCharacterConfig(charModel.toConfig());
      } catch {
        setCharacterConfig(NHAN_VAT_MAC_DINH);
      }

      // Tải lại queNhaData theo hồ sơ mới
      try {
        const qnRaw = window.localStorage.getItem(`vpr:${newHoSo.id}:que_nha`);
        if (qnRaw) {
          const parsed = JSON.parse(qnRaw);
          const camHungIds = Array.isArray(parsed.camHungIds)
            ? parsed.camHungIds
            : parsed.nhomQueId
            ? [parsed.nhomQueId]
            : [];
          setQueNhaData({
            dip: parsed.dip ?? [],
            camHungIds,
            phongCach: parsed.phongCach ?? [],
            nhomQueId: camHungIds[0] || null,
          });
        } else {
          setQueNhaData({ dip: [], camHungIds: [], phongCach: [], nhomQueId: null });
        }
      } catch {
        setQueNhaData({ dip: [], camHungIds: [], phongCach: [], nhomQueId: null });
      }

      // Thông báo các màn hình cập nhật Gùi Ký Ức
      window.dispatchEvent(new CustomEvent("vpr:outfits-change"));
    };

    window.addEventListener(PROFILE_CHANGE_EVENT, handleProfileChange);
    return () => window.removeEventListener(PROFILE_CHANGE_EVENT, handleProfileChange);
  }, []);

  const [characterConfig, setCharacterConfig] = useState<NhanVatConfig>(() => {
    return CharacterStorageService.loadCharacter().toConfig();
  });

  const [queNhaData, setQueNhaData] = useState<QueNhaData>(() => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const stored = window.localStorage.getItem(layKhoaTheoHoSo("que_nha"));
        if (stored) {
          const parsed = JSON.parse(stored);
          const camHungIds = Array.isArray(parsed.camHungIds)
            ? parsed.camHungIds
            : parsed.nhomQueId
            ? [parsed.nhomQueId]
            : [];
          return {
            dip: parsed.dip ?? [],
            camHungIds,
            phongCach: parsed.phongCach ?? [],
            nhomQueId: camHungIds[0] || null,
          };
        }
      }
    } catch {
      // Bỏ qua
    }
    return { dip: [], camHungIds: [], phongCach: [], nhomQueId: null };
  });

  // Vùng đang dùng = tham số URL (?vung=...) hoặc người dùng bấm chọn hoặc nhóm cảm hứng; chưa có thì dùng "trung"
  const [manualVungId, setManualVungId] = useState<VungId | null>(null);
  const [customViTri, setCustomViTri] = useState<ThongTinViTri | null>(() => docViTriSession());

  const currentVungId: VungId = useMemo(() => {
    const urlParams = docThamSoURL();
    if (urlParams.vungOverride) {
      return urlParams.vungOverride;
    }
    if (customViTri?.vungId) {
      return customViTri.vungId;
    }
    if (manualVungId) {
      return manualVungId;
    }
    const primaryCamHung = queNhaData.camHungIds?.[0] || queNhaData.nhomQueId;
    if (primaryCamHung) {
      const foundNhom = nhom.find((n) => n.id === primaryCamHung);
      if (
        foundNhom?.vung === "bac" ||
        foundNhom?.vung === "trung" ||
        foundNhom?.vung === "taynguyen" ||
        foundNhom?.vung === "nam"
      ) {
        return foundNhom.vung;
      }
    }
    return "trung";
  }, [manualVungId, customViTri, queNhaData.camHungIds, queNhaData.nhomQueId]);

  const [weatherState, setWeatherState] = useState<ThoiTietState>(() => {
    const targetVung = layVungTheoId(currentVungId);
    const initialViTri: ThongTinViTri = customViTri || {
      ten: targetVung.noi,
      lat: targetVung.lat,
      lon: targetVung.lon,
      nguon: "mac_dinh",
      vungId: currentVungId,
    };
    return {
      vung: targetVung,
      thoiTiet: "mat",
      khungGio: "ngay",
      nhietDo: 26,
      precipitation: 0,
      weatherCode: 0,
      moTaThoiTiet: "Dịu mát",
      moTaKhungGio: "ban ngày",
      isFallback: true,
      timestamp: Date.now(),
      doAm: 70,
      viTri: initialViTri,
    };
  });

  useEffect(() => {
    let isCancelled = false;
    layThoiTietVung(currentVungId, customViTri ?? undefined).then((res) => {
      if (!isCancelled) {
        setWeatherState(res);
      }
    });
    return () => {
      isCancelled = true;
    };
  }, [currentVungId, customViTri]);

  const handleSelectVung = (vungId: VungId) => {
    setManualVungId(vungId);
  };

  const handleViTriChange = (newViTri: ThongTinViTri) => {
    setCustomViTri(newViTri);
    setManualVungId(newViTri.vungId);
  };

  const handleSelectCostumeFromWeather = (trangPhucId: string) => {
    setSelectedTrangPhucId(trangPhucId);
    setCurrentScreen("s3");
  };

  const handleEnterGate = () => {
    setCurrentScreen("que_nha");
  };

  const handleSkipGate = () => {
    setCurrentScreen("que_nha");
  };

  const handleQueNhaComplete = (data: QueNhaData) => {
    setQueNhaData(data);
    setCurrentScreen("s2");
  };

  const handleBackToGate = () => {
    setCurrentScreen("gate");
  };

  const handleBackToQueNha = () => {
    setCurrentScreen("que_nha");
  };

  const handleOpenGuiKyUc = (from: Screen = "s4") => {
    setReturnScreenFromGui(from);
    setCurrentScreen("gui_ky_uc");
  };

  const handleOpenDongThoiGian = (from: Screen = "s2") => {
    setReturnScreenFromDongThoiGian(from);
    setCurrentScreen("dong_thoi_gian");
  };

  const handleOpenSoiChiChung = (from: Screen = "s2") => {
    setReturnScreenFromSoiChi(from);
    setCurrentScreen("soi_chi_chung");
  };

  const handleOpenChoPhien = (from: Screen = "s2") => {
    setReturnScreenFromChoPhien(from);
    setCurrentScreen("cho_phien");
  };

  const handleWearOutfitFromGui = (outfit: OutfitSaved) => {
    setSelectedTrangPhucId(outfit.trangPhucId);
    try {
      const data = {
        trangPhucId: outfit.trangPhucId,
        mauId: outfit.mauId,
        phuKienIds: outfit.phuKienIds,
        hoaVanThem: outfit.hoaVanThem ?? null,
        phongCach: outfit.phongCach ?? "truyen_thong",
      };
      window.localStorage.setItem(
        layKhoaTheoHoSo(`outfit:${outfit.trangPhucId}`),
        JSON.stringify(data)
      );
    } catch (err) {
      console.error("Lỗi lưu outfit để mặc lại:", err);
    }
    if (outfit.nhanVatConfig) {
      setCharacterConfig(outfit.nhanVatConfig);
    }
    setCurrentScreen("s4");
  };

  return (
    <TooltipProvider>
      <div className="relative min-h-screen">
        {/* Lớp nền Bầu trời nằm cố định sau mọi màn */}
      <BauTroi
        vungId={weatherState.vung.id}
        khungGio={weatherState.khungGio}
        thoiTiet={weatherState.thoiTiet}
        theme={theme}
      />

      {/* Dải thông tin trên cùng (TopBar - 56px): Menu mobile & chip thời tiết */}
      {currentScreen !== "chao_ban" && (
        <TopBar
          weatherState={weatherState}
          onSelectVung={handleSelectVung}
          onSelectCostume={handleSelectCostumeFromWeather}
          onViTriChange={handleViTriChange}
          theme={theme}
          onLogoClick={() => setCurrentScreen("gate")}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
        />
      )}

      {/* KHUNG NỘI DUNG CHÍNH: Cách đều TopBar (56px) và Cột Sidebar (250px) để không bao giờ bị đè lấn */}
      <div
        className={`vpr-main-content-layout min-h-screen ${
          currentScreen !== "chao_ban" ? "pt-[56px] lg:pl-[250px]" : ""
        } transition-all duration-300`}
      >
        {currentScreen === "chao_ban" && (
          <ChaoBanScreen
            onProceed={(hoSo) => {
              window.localStorage.setItem("vpr:has_seen_chao_ban", "1");
              setActiveHoSo(hoSo);
              setCurrentScreen("gate");
            }}
            onBack={() => {
              window.localStorage.setItem("vpr:has_seen_chao_ban", "1");
              setCurrentScreen("gate");
            }}
          />
        )}

      {currentScreen === "gate" && (
        <GateScreen
          onEnter={() => setCurrentScreen("s2")}
          onEnterQueNha={() => setCurrentScreen("que_nha")}
          onSkip={() => setCurrentScreen("s2")}
          onOpenChaoBan={() => setShowChaoBanModal(true)}
          onOpenStudio={() => setCurrentScreen("s4")}
          onOpenChat={() => setIsChatOpen(true)}
          onOpenCharacter={() => setCurrentScreen("nhan_vat")}
        />
      )}

      {currentScreen === "que_nha" && (
        <QueNhaScreen
          onComplete={handleQueNhaComplete}
          onBackToGate={handleBackToGate}
          onDirectToOutfit={(trangPhucId) => {
            setSelectedTrangPhucId(trangPhucId);
            setCurrentScreen("s4");
          }}
        />
      )}

      {currentScreen === "s2" && (
        <CostumeSelectScreen
          queNhaData={queNhaData}
          onBackToQueNha={handleBackToQueNha}
          onSelectTrangPhuc={(id, directToS4) => {
            setSelectedTrangPhucId(id);
            setCurrentScreen(directToS4 ? "s4" : "s3");
          }}
          onOpenCharacter={() => {
            setReturnScreenFromChar("s2");
            setCurrentScreen("nhan_vat");
          }}
          onOpenGuiKyUc={() => handleOpenGuiKyUc("s2")}
          onOpenThamTu={() => setCurrentScreen("tham_tu")}
          onOpenBanDo={() => setCurrentScreen("ban_do")}
          onOpenDongThoiGian={() => handleOpenDongThoiGian("s2")}
          onOpenSoiChiChung={() => handleOpenSoiChiChung("s2")}
          onOpenChoPhien={() => handleOpenChoPhien("s2")}
          onOpenChaoBan={() => setShowChaoBanModal(true)}
          initialNhomFilter={selectedNhomFilterForS2}
          activeHoSo={activeHoSo}
          weatherState={weatherState}
        />
      )}

      {currentScreen === "s3" && (
        <CostumeDetailScreen
          trangPhucId={selectedTrangPhucId}
          onBackToCostumes={() => setCurrentScreen("s2")}
          onProceedToS4={() => setCurrentScreen("s4")}
          onOpenDongThoiGian={() => handleOpenDongThoiGian("s3")}
        />
      )}

      {currentScreen === "s4" && (
        <OutfitScreen
          trangPhucId={selectedTrangPhucId}
          nhanVatConfig={characterConfig}
          weatherState={weatherState}
          onBackToDetail={() => setCurrentScreen("s3")}
          onOpenCharacterSelect={() => {
            setReturnScreenFromChar("s4");
            setCurrentScreen("nhan_vat");
          }}
          onSelectAnotherCostume={() => setCurrentScreen("s2")}
          onOpenGuiKyUc={() => handleOpenGuiKyUc("s4")}
          onOpenDongThoiGian={() => handleOpenDongThoiGian("s4")}
        />
      )}

      {currentScreen === "gui_ky_uc" && (
        <GuiKyUcScreen
          onBack={() => setCurrentScreen(returnScreenFromGui)}
          onWearOutfit={handleWearOutfitFromGui}
          globalNhanVatConfig={characterConfig}
          onOpenChoPhien={() => handleOpenChoPhien("gui_ky_uc")}
          onOpenChaoBan={() => setShowChaoBanModal(true)}
        />
      )}

      {currentScreen === "nhat_ky" && (
        <NhatKyTraiNghiemScreen
          onBack={() => setCurrentScreen(returnScreenFromGui || "gate")}
          onWearOutfit={handleWearOutfitFromGui}
          globalNhanVatConfig={characterConfig}
          onOpenChoPhien={() => handleOpenChoPhien("nhat_ky")}
          onOpenChaoBan={() => setShowChaoBanModal(true)}
        />
      )}

      {currentScreen === "nhan_vat" && (
        <CharacterSelectScreen
          initialConfig={characterConfig}
          onSave={(cfg) => {
            const model = CharacterModel.fromConfig(cfg);
            CharacterStorageService.saveCharacter(model);
            setCharacterConfig(model.toConfig());
            setCurrentScreen(returnScreenFromChar);
          }}
          onBack={() => setCurrentScreen(returnScreenFromChar)}
        />
      )}

      {currentScreen === "giu_chuan" && (
        <GiuChuanVanHoaScreen
          onClose={() => setCurrentScreen("gate")}
        />
      )}

      {currentScreen === "tham_tu" && (
        <ThamTuScreen
          onProceedToS4={() => setCurrentScreen("s4")}
          onSkipToS4={() => setCurrentScreen("s4")}
          onBackToS2={() => setCurrentScreen("s2")}
          nhanVatConfig={characterConfig}
        />
      )}

      {currentScreen === "ban_do" && (
        <BanDoScreen
          onBack={() => setCurrentScreen("s2")}
          currentVungId={currentVungId}
          theme={theme}
          onSelectVungOnly={(vungId) => {
            setManualVungId(vungId);
          }}
          onSelectNhomAndNavigateToS2={(nhomId, vungId) => {
            setManualVungId(vungId);
            setSelectedNhomFilterForS2(nhomId);
            setCurrentScreen("s2");
          }}
        />
      )}

      {currentScreen === "dong_thoi_gian" && (
        <DongThoiGianScreen
          onBack={() => setCurrentScreen(returnScreenFromDongThoiGian)}
          onRemixInS4={(costumeId) => {
            setSelectedTrangPhucId(costumeId);
            try {
              window.localStorage.removeItem(layKhoaTheoHoSo(`outfit:${costumeId}`));
            } catch {
              // ignore
            }
            setCurrentScreen("s4");
          }}
        />
      )}

      {currentScreen === "soi_chi_chung" && (
        <SoiChiChungScreen
          initialNhomAId={queNhaData.camHungIds?.[0] || queNhaData.nhomQueId || "kb"}
          initialNhomBId="thai"
          onBack={() => setCurrentScreen(returnScreenFromSoiChi)}
          onSelectCostume={(trangPhucId) => {
            setSelectedTrangPhucId(trangPhucId);
            setCurrentScreen("s3");
          }}
        />
      )}

      {currentScreen === "cho_phien" && (
        <ChoPhienScreen
          onBack={() => setCurrentScreen(returnScreenFromChoPhien)}
          onOpenCostumeDetail={(tpId) => {
            setSelectedTrangPhucId(tpId);
            setCurrentScreen("s3");
          }}
        />
      )}
      </div>

      {/* Màn ChaoBan dạng Modal mở khi bấm "Đổi hồ sơ" */}
      {showChaoBanModal && (
        <ChaoBanScreen
          isModal
          onProceed={(hoSo) => {
            setActiveHoSo(hoSo);
            setShowChaoBanModal(false);
          }}
          onBack={() => setShowChaoBanModal(false)}
        />
      )}

      {/* Modal Bảng "Cách bạn muốn trải nghiệm" */}
      {showTraiNghiemModal && (
        <CaiDatTraiNghiemModal
          onClose={() => setShowTraiNghiemModal(false)}
          weatherState={weatherState}
          onViTriChange={handleViTriChange}
          onSelectVung={handleSelectVung}
        />
      )}

      {/* Màn/Modal Giữ chuẩn văn hóa mở từ chân trang và chip nguồn */}
      {giuChuanModal.open && (
        <GiuChuanVanHoaScreen
          sourceCostumeName={giuChuanModal.costumeName}
          onClose={() => setGiuChuanModal({ open: false })}
        />
      )}

      {/* Cửa sổ chat Cò Em (ẩn nút trigger độc lập, điều khiển qua Khay Nổi) */}
      <CoEmChat
        currentScreen={currentScreen}
        selectedTrangPhucId={selectedTrangPhucId}
        isOpen={isChatOpen}
        onToggle={() => setIsChatOpen((prev) => !prev)}
        hideTrigger={true}
      />

      {/* CỘT CÔNG CỤ & ĐIỀU HƯỚNG BÊN TRÁI MÀN HÌNH (SidebarNav) */}
      <SidebarNav
        currentScreen={currentScreen}
        onNavigate={handleNavigateFromSidebar}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        activeHoSo={activeHoSo}
        onOpenChaoBan={() => setShowChaoBanModal(true)}
        onOpenTraiNghiem={() => setShowTraiNghiemModal(true)}
        hasActiveTraiNghiem={Boolean(
          caiDatTraiNghiem.amThanh ||
          caiDatTraiNghiem.giamChuyenDong ||
          caiDatTraiNghiem.chuLonDeDoc ||
          caiDatTraiNghiem.tatBauTroi
        )}
        onToggleChat={() => setIsChatOpen((prev) => !prev)}
        isChatOpen={isChatOpen}
        showGoiYBtn={currentScreen === "s2"}
        onOpenGoiY={() => window.dispatchEvent(new CustomEvent("vpr:open-goi-y"))}
      />

      {/* Cửa sổ Modal Đăng nhập Gmail & Xác thực mã OTP */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authModalMode}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
    </TooltipProvider>
  );
}
