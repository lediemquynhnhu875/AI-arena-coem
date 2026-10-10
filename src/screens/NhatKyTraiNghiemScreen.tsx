/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * MÀN HÌNH NHẬT KÝ TRẢI NGHIỆM (EXPERIENCE JOURNAL SCREEN)
 * - Hiển thị lịch sử các bộ trang phục người dùng đã phối hợp
 * - Cho phép thêm & chỉnh sửa ghi chú cảm xúc cá nhân vào từng lưu trữ trong Cloud Firestore
 * - Hỗ trợ lọc theo tâm trạng, tìm kiếm, mặc lại bộ đồ và đồng bộ tức thời
 */

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  BookOpen,
  Sparkles,
  Save,
  Trash2,
  Edit3,
  Search,
  CheckCircle2,
  Cloud,
  CloudOff,
  Shirt,
  Calendar,
  Tag,
  ArrowLeft,
  ChevronRight,
  Heart,
  Lightbulb,
  X,
  Share2,
} from "lucide-react";
import AvatarSVG from "../components/AvatarSVG";
import { CulturalPatternsDefs, renderGarmentLayers } from "../components/GarmentLayers";
import { NhanVatConfig, NHAN_VAT_MAC_DINH, tinhSoDo } from "../lib/avatar";
import { trangPhuc } from "../data/trangphuc";
import { mauSac } from "../data/mausac";
import { phuKien } from "../data/phukien";
import { OutfitSaved, docDanhSachGuiKyUc } from "../lib/guiKyUc";
import {
  JournalEntry,
  MOOD_OPTIONS,
  GOI_Y_CAM_XUC,
  taiVaDongBoJournal,
  capNhatGhiChuCamXuc,
  xoaMucNhatKy,
  getCurrentUserId,
  JOURNAL_CHANGE_EVENT,
} from "../lib/journal";
import { useAuth } from "../lib/auth";
import { auth as firebaseAuth } from "../lib/firebase";
import AppFooter from "../components/AppFooter";

interface Props {
  onBack: () => void;
  onWearOutfit: (outfit: OutfitSaved) => void;
  globalNhanVatConfig?: NhanVatConfig;
  onOpenChoPhien?: () => void;
  onOpenChaoBan?: () => void;
}

export default function NhatKyTraiNghiemScreen({
  onBack,
  onWearOutfit,
  globalNhanVatConfig,
  onOpenChoPhien,
  onOpenChaoBan,
}: Props) {
  const { user: authUser } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFirestoreSynced, setIsFirestoreSynced] = useState(false);

  // Bộ lọc và tìm kiếm
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMoodFilter, setSelectedMoodFilter] = useState<string>("tat_ca");

  // Chỉnh sửa ghi chú cảm xúc
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNote, setEditNote] = useState("");
  const [editMood, setEditMood] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Thông báo Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Tải dữ liệu nhật ký và đồng bộ với Firestore
  const loadJournalData = async () => {
    setLoading(true);
    try {
      const uid = getCurrentUserId();
      const res = await taiVaDongBoJournal(uid || undefined);
      setEntries(res.entries);
      setIsFirestoreSynced(res.fromFirestore || !!firebaseAuth.currentUser);
    } catch (err) {
      console.error("Lỗi nạp nhật ký:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJournalData();

    const handleJournalChange = () => {
      loadJournalData();
    };

    window.addEventListener(JOURNAL_CHANGE_EVENT, handleJournalChange);
    window.addEventListener("vpr:outfits-change", handleJournalChange);
    window.addEventListener("vpr:auth-change", handleJournalChange);

    return () => {
      window.removeEventListener(JOURNAL_CHANGE_EVENT, handleJournalChange);
      window.removeEventListener("vpr:outfits-change", handleJournalChange);
      window.removeEventListener("vpr:auth-change", handleJournalChange);
    };
  }, [authUser]);

  // Bắt đầu chỉnh sửa
  const handleStartEdit = (entry: JournalEntry) => {
    setEditingId(entry.id);
    setEditNote(entry.emotionalNote || "");
    setEditMood(entry.mood || "Hoài niệm di sản");
  };

  // Hủy chỉnh sửa
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditNote("");
    setEditMood("");
  };

  // Lưu ghi chú cảm xúc vào Cloud Firestore
  const handleSaveNote = async (entryId: string) => {
    if (!editNote.trim()) {
      showToast("Vui lòng ghi lại đôi dòng cảm xúc của bạn!");
      return;
    }

    setIsSaving(true);
    try {
      const res = await capNhatGhiChuCamXuc(entryId, editNote, editMood);
      if (res.success) {
        setEntries((prev) =>
          prev.map((item) => (item.id === entryId ? (res.entry as JournalEntry) : item))
        );
        setEditingId(null);
        if (res.syncedToFirestore) {
          showToast("✨ Đã lưu ghi chú cảm xúc thành công!");
          setIsFirestoreSynced(true);
        } else {
          showToast("💾 Đã lưu ghi chú cảm xúc thành công!");
        }
      }
    } catch (err) {
      console.error("Lỗi lưu ghi chú:", err);
      showToast("Có lỗi xảy ra khi lưu ghi chú. Vui lòng thử lại!");
    } finally {
      setIsSaving(false);
    }
  };

  // Xóa mục nhật ký
  const handleDeleteEntry = async (entryId: string, title: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa nhật ký phối đồ "${title}" không?`)) {
      const res = await xoaMucNhatKy(entryId);
      if (res.success) {
        setEntries((prev) => prev.filter((item) => item.id !== entryId));
        showToast("Đã xóa mục nhật ký thành công.");
      }
    }
  };

  // Chèn câu gợi ý cảm xúc
  const handleInsertPrompt = (prompt: string) => {
    setEditNote((prev) => (prev ? `${prev}\n${prompt}` : prompt));
  };

  // Mặc lại bộ trang phục
  const handleWearOutfit = (entry: JournalEntry) => {
    const savedOutfits = docDanhSachGuiKyUc();
    const existing = savedOutfits.find((o) => o.id === entry.outfitId);

    const outfitToWear: OutfitSaved = existing || {
      id: entry.outfitId,
      trangPhucId: entry.trangPhucId,
      mauId: entry.mauId,
      phuKienIds: entry.phuKienIds,
      caption: entry.caption || entry.emotionalNote,
      taoLuc: entry.taoLuc,
      nhanVatConfig: globalNhanVatConfig || NHAN_VAT_MAC_DINH,
    };

    onWearOutfit(outfitToWear);
  };

  // Lọc và tìm kiếm danh sách
  const filteredEntries = useMemo(() => {
    return entries.filter((item) => {
      // Tìm kiếm theo từ khóa
      const matchQuery =
        !searchQuery.trim() ||
        item.costumeTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.emotionalNote.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.caption && item.caption.toLowerCase().includes(searchQuery.toLowerCase()));

      // Lọc theo tâm trạng
      const matchMood =
        selectedMoodFilter === "tat_ca" ||
        (selectedMoodFilter === "hoai_niem" && item.mood?.includes("Hoài niệm")) ||
        (selectedMoodFilter === "tu_hao" && item.mood?.includes("Tự hào")) ||
        (selectedMoodFilter === "thanh_tao" && item.mood?.includes("Thanh tao")) ||
        (selectedMoodFilter === "han_hoan" && item.mood?.includes("Hân hoan")) ||
        (selectedMoodFilter === "binh_yen" && item.mood?.includes("Bình yên")) ||
        (selectedMoodFilter === "sang_tao" && item.mood?.includes("Phá cách"));

      return matchQuery && matchMood;
    });
  }, [entries, searchQuery, selectedMoodFilter]);

  // Thống kê nhanh
  const stats = useMemo(() => {
    return {
      total: entries.length,
      withNotes: entries.filter((e) => e.emotionalNote?.length > 10).length,
    };
  }, [entries]);

  return (
    <div className="nhat-ky-screen journal-screen min-h-screen text-[var(--nen-toi)] flex flex-col font-sans transition-colors duration-200">
      {/* Toast thông báo */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-full bg-stone-900/90 text-white dark:bg-amber-100 dark:text-stone-900 shadow-xl border border-amber-500/30 text-sm font-medium flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-400 dark:text-amber-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header màn hình */}
      <header className="bg-[var(--nen-the)]/90 backdrop-blur-md border-b border-[var(--vien-the)] px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-xl text-[var(--tro-tram)] hover:text-[var(--nen-toi)] hover:bg-[var(--nen-the-phu)] transition-colors cursor-pointer"
            title="Quay lại"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-700 dark:text-amber-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-[var(--nen-toi)] flex items-center gap-2">
                Nhật Ký Trải Nghiệm
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                  {stats.total} bộ đã phối
                </span>
              </h1>
              <p className="text-xs text-[var(--tro-tram)] hidden sm:block">
                Lịch sử cổ phục và lưu giữ ghi chú cảm xúc cá nhân của bạn
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {onOpenChoPhien && (
            <button
              type="button"
              onClick={onOpenChoPhien}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-500/30 bg-amber-50/70 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 hover:bg-amber-100 text-xs font-medium transition-colors cursor-pointer"
            >
              <span>🏮 Chợ Phiên</span>
            </button>
          )}
        </div>
      </header>

      {/* Nội dung chính */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Banner giới thiệu & Thống kê */}
        <section className="relative overflow-hidden rounded-2xl p-5 sm:p-6 bg-gradient-to-br from-amber-50/90 via-[var(--nen-the)] to-emerald-50/70 dark:from-stone-900/90 dark:via-slate-900/90 dark:to-amber-950/40 border border-amber-500/25 shadow-xs">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                Dấu Ấn Cá Nhân & Di Sản Văn Hóa
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--nen-toi)]">
                Nhật Ký Cảm Xúc Qua Từng Tà Áo
              </h2>
              <p className="text-sm text-[var(--tro-tram)] leading-relaxed">
                Mỗi bộ phục trang bạn hoàn thiện là một khoảnh khắc tương tác với lịch sử. Hãy ghi lại cảm nghĩ, tâm trạng hay kỷ niệm riêng của bạn — toàn bộ được lưu trữ an toàn trong tài khoản của bạn.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="p-3 rounded-xl bg-[var(--nen-the)] border border-[var(--vien-the)] text-center min-w-[90px] shadow-2xs">
                <div className="text-xl font-bold text-amber-700 dark:text-amber-400">
                  {stats.total}
                </div>
                <div className="text-[11px] text-[var(--tro-tram)]">Bộ phối hợp</div>
              </div>
              <div className="p-3 rounded-xl bg-[var(--nen-the)] border border-[var(--vien-the)] text-center min-w-[90px] shadow-2xs">
                <div className="text-xl font-bold text-emerald-700 dark:text-emerald-400">
                  {stats.withNotes}
                </div>
                <div className="text-[11px] text-[var(--tro-tram)]">Có ghi chú</div>
              </div>
            </div>
          </div>
        </section>

        {/* Thanh tìm kiếm & Bộ lọc tâm trạng */}
        <section className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Ô tìm kiếm */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[var(--tro-tram)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm theo tên trang phục, cảm xúc, hoặc nội dung ghi chú..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--vien-the)] bg-[var(--nen-the)] text-[var(--nen-toi)] text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all placeholder:text-[var(--tro-tram)]/60"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--tro-tram)] hover:text-[var(--nen-toi)] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Dải nút bấm lọc theo tâm trạng */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-[var(--tro-tram)] font-medium shrink-0 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" /> Tâm trạng:
            </span>
            <button
              type="button"
              onClick={() => setSelectedMoodFilter("tat_ca")}
              className={`px-3 py-1.5 rounded-lg border font-medium shrink-0 transition-colors cursor-pointer ${
                selectedMoodFilter === "tat_ca"
                  ? "bg-emerald-600 dark:bg-emerald-700 text-white border-emerald-600 font-semibold shadow-2xs"
                  : "bg-[var(--nen-the)] text-[var(--tro-tram)] border-[var(--vien-the)] hover:bg-[var(--nen-the-phu)]"
              }`}
            >
              Tất cả ({entries.length})
            </button>
            {MOOD_OPTIONS.map((mood) => {
              const count = entries.filter((e) => e.mood?.includes(mood.label.split(" ")[0])).length;
              const isSelected = selectedMoodFilter === mood.id;
              return (
                <button
                  key={mood.id}
                  type="button"
                  onClick={() => setSelectedMoodFilter(mood.id)}
                  className={`px-3 py-1.5 rounded-lg border font-medium shrink-0 transition-colors flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? "bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border-amber-400 dark:border-amber-700 shadow-xs"
                      : "bg-[var(--nen-the)] text-[var(--tro-tram)] border-[var(--vien-the)] hover:bg-[var(--nen-the-phu)]"
                  }`}
                >
                  <span>{mood.icon}</span>
                  <span>{mood.label}</span>
                  {count > 0 && <span className="opacity-70 text-[10px]">({count})</span>}
                </button>
              );
            })}
          </div>
        </section>

        {/* Danh sách các mục nhật ký */}
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-[var(--tro-tram)]">Đang tải nhật ký trải nghiệm...</p>
          </div>
        ) : filteredEntries.length === 0 ? (
          <div className="py-16 text-center space-y-4 rounded-2xl border-2 border-dashed border-[var(--vien-the)] bg-[var(--nen-the)]/80 p-8">
            <div className="w-14 h-14 rounded-full bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 flex items-center justify-center text-amber-800 dark:text-amber-300 mx-auto text-2xl">
              👘
            </div>
            <div className="space-y-1 max-w-md mx-auto">
              <h3 className="text-base font-bold text-[var(--nen-toi)]">
                {searchQuery || selectedMoodFilter !== "tat_ca"
                  ? "Không tìm thấy bộ trang phục phù hợp với bộ lọc"
                  : "Chưa có trang phục nào trong Nhật ký"}
              </h3>
              <p className="text-sm text-[var(--tro-tram)]">
                {searchQuery || selectedMoodFilter !== "tat_ca"
                  ? "Hãy thử thay đổi từ khóa tìm kiếm hoặc chọn tất cả tâm trạng."
                  : "Hãy vào Phối Đồ, sáng tạo bản phối cổ phục theo phong cách của bạn và cất vào Gùi Ký Ức để bắt đầu viết nhật ký!"}
              </p>
            </div>
            {searchQuery || selectedMoodFilter !== "tat_ca" ? (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedMoodFilter("tat_ca");
                }}
                className="px-4 py-2 rounded-xl bg-[var(--nen-the)] text-[var(--nen-toi)] border border-[var(--vien-the)] hover:bg-[var(--nen-the-phu)] text-sm font-medium transition-colors cursor-pointer"
              >
                Xóa bộ lọc
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  // Mặc bộ mẫu đầu tiên hoặc chuyển về phòng thử đồ
                  const saved = docDanhSachGuiKyUc();
                  if (saved.length > 0) {
                    onWearOutfit(saved[0]);
                  } else {
                    onBack();
                  }
                }}
                className="px-5 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-sm font-semibold shadow-md shadow-amber-900/10 transition-colors inline-flex items-center gap-2 cursor-pointer"
              >
                <Shirt className="w-4 h-4" />
                Vào Phối Đồ Ngay
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredEntries.map((entry) => {
              const isEditing = editingId === entry.id;
              const tpObj = trangPhuc.find((t) => t.id === entry.trangPhucId);
              const mauObj = mauSac.find((m) => m.id === entry.mauId) || mauSac[0];
              const pkObjs = entry.phuKienIds
                .map((id: string) => phuKien.find((p) => p.id === id))
                .filter((p): p is NonNullable<typeof p> => Boolean(p));

              // Cấu hình avatar thu nhỏ cho bộ trang phục
              const charConfig: NhanVatConfig = globalNhanVatConfig || NHAN_VAT_MAC_DINH;
              const soDo = tinhSoDo(charConfig);
              const garmentLayers = renderGarmentLayers({
                trangPhucId: entry.trangPhucId,
                soDo,
                mauHex: mauObj.hex,
                phuKienIds: entry.phuKienIds,
                hoaVanThem: null,
              });

              // Tìm thông tin tâm trạng
              const matchedMood = MOOD_OPTIONS.find((m) =>
                entry.mood ? entry.mood.includes(m.label.split(" ")[0]) : false
              ) || MOOD_OPTIONS[0];

              return (
                <article
                  key={entry.id}
                  className="rounded-2xl border border-[var(--vien-the)] bg-[var(--nen-the)] shadow-xs hover:shadow-md transition-shadow overflow-hidden"
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
                    {/* Cột trái: Hình ảnh trực quan của bộ trang phục (Avatar SVG thu nhỏ đầy đủ) */}
                    <div className="md:col-span-4 lg:col-span-3 bg-gradient-to-b from-stone-100/90 to-amber-50/50 dark:from-slate-900/90 dark:to-stone-900/90 p-4 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-[var(--vien-the)] relative">
                      <div className="w-36 h-56 sm:w-44 sm:h-64 relative flex items-center justify-center overflow-hidden">
                        <AvatarSVG
                          nhanVat={charConfig}
                          scalePreset="md"
                          customViewBox="80 -65 240 780"
                          className="w-full h-full drop-shadow-md select-none"
                          childrenDefs={<CulturalPatternsDefs />}
                          childrenVayQuan={garmentLayers.childrenVayQuan}
                          childrenAo={garmentLayers.childrenAo}
                          childrenPhuKienThan={garmentLayers.childrenPhuKienThan}
                          childrenTocTruocKhanNon={garmentLayers.childrenTocTruocKhanNon}
                        />
                      </div>

                      <div className="w-full mt-3 flex items-center justify-between text-xs text-[var(--tro-tram)] pt-2 border-t border-[var(--vien-the)]">
                        <span className="flex items-center gap-1.5 font-medium">
                          <span
                            className="w-3 h-3 rounded-full border border-stone-300 dark:border-stone-600 shrink-0"
                            style={{ backgroundColor: mauObj.hex }}
                          />
                          {mauObj.ten}
                        </span>
                        <span className="text-[11px]">
                          {new Date(entry.taoLuc).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                    </div>

                    {/* Cột phải: Thông tin trang phục & Ghi chú cảm xúc cá nhân */}
                    <div className="md:col-span-8 lg:col-span-9 p-5 sm:p-6 flex flex-col justify-between space-y-4">
                      {/* Tiêu đề & Nhãn tâm trạng */}
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-lg font-bold text-[var(--nen-toi)]">
                              {entry.costumeTitle || tpObj?.ten || "Cổ phục Việt"}
                            </h3>
                            {tpObj?.moTaNgan && (
                              <span className="text-xs px-2 py-0.5 rounded-md bg-[var(--nen-the-phu)] text-[var(--tro-tram)] border border-[var(--vien-the)] font-medium truncate max-w-[240px]">
                                {tpObj.moTaNgan}
                              </span>
                            )}
                          </div>

                          {pkObjs.length > 0 && (
                            <p className="text-xs text-[var(--tro-tram)]">
                              Phụ kiện: {pkObjs.map((p) => p?.ten).join(" · ")}
                            </p>
                          )}
                        </div>

                        {/* Huy hiệu tâm trạng */}
                        <div
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border shrink-0 ${matchedMood.badgeBg} ${matchedMood.color}`}
                        >
                          <span>{matchedMood.icon}</span>
                          <span>{entry.mood || matchedMood.label}</span>
                        </div>
                      </div>

                      {/* Khối Ghi chú cảm xúc cá nhân */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5 uppercase tracking-wide">
                            <Heart className="w-3.5 h-3.5 fill-amber-700/20 text-amber-700 dark:text-amber-400" />
                            Ghi chú cảm xúc cá nhân
                          </span>
                          {!isEditing && (
                            <button
                              type="button"
                              onClick={() => handleStartEdit(entry)}
                              className="text-[var(--tro-tram)] hover:text-amber-700 dark:hover:text-amber-400 flex items-center gap-1 font-medium hover:underline cursor-pointer"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>Sửa ghi chú</span>
                            </button>
                          )}
                        </div>

                        {isEditing ? (
                          /* Trình chỉnh sửa ghi chú cảm xúc */
                          <div className="p-4 rounded-xl border border-amber-400/80 dark:border-amber-600/80 bg-amber-50/60 dark:bg-amber-950/30 space-y-3">
                            {/* Chọn tâm trạng */}
                            <div className="space-y-1.5">
                              <label className="text-xs font-semibold text-[var(--nen-toi)]">
                                Tâm trạng của bạn khi chiêm ngưỡng bộ phục trang này:
                              </label>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                {MOOD_OPTIONS.map((m) => (
                                  <button
                                    key={m.id}
                                    type="button"
                                    onClick={() => setEditMood(m.label)}
                                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1 cursor-pointer ${
                                      editMood === m.label
                                        ? "bg-amber-600 text-white border-amber-600 shadow-2xs font-semibold"
                                        : "bg-[var(--nen-the)] text-[var(--nen-toi)] border-[var(--vien-the)] hover:bg-[var(--nen-the-phu)]"
                                    }`}
                                  >
                                    <span>{m.icon}</span>
                                    <span>{m.label}</span>
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Ô nhập cảm nghĩ */}
                            <div className="space-y-1">
                              <textarea
                                value={editNote}
                                onChange={(e) => setEditNote(e.target.value.slice(0, 1000))}
                                rows={3}
                                maxLength={1000}
                                placeholder="Ghi lại cảm nhận, ký ức hay suy tư của bạn khi nhìn ngắm bản phối này..."
                                className="w-full p-3 rounded-xl border border-[var(--vien-the)] bg-[var(--nen-the)] text-[var(--nen-toi)] text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-y leading-relaxed placeholder:text-[var(--tro-tram)]/60"
                              />
                              <div className="flex items-center justify-between text-[11px] text-[var(--tro-tram)]">
                                <div className="flex items-center gap-1">
                                  <Lightbulb className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                                  <span>Gợi ý cảm xúc nhanh:</span>
                                </div>
                                <span>{editNote.length}/1000 ký tự</span>
                              </div>
                            </div>

                            {/* Các nút bấm chèn gợi ý */}
                            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
                              {GOI_Y_CAM_XUC.slice(0, 3).map((prompt, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => handleInsertPrompt(prompt)}
                                  className="px-2.5 py-1 rounded-md bg-[var(--nen-the)] border border-amber-200 dark:border-amber-800/60 text-[var(--tro-tram)] hover:text-[var(--nen-toi)] hover:border-amber-400 shrink-0 truncate max-w-[240px] cursor-pointer"
                                  title={prompt}
                                >
                                  "{prompt}"
                                </button>
                              ))}
                            </div>

                            {/* Nút lưu hoặc hủy */}
                            <div className="flex items-center justify-end gap-2 pt-2 border-t border-amber-200/50 dark:border-amber-900/30">
                              <button
                                type="button"
                                onClick={handleCancelEdit}
                                disabled={isSaving}
                                className="px-3.5 py-1.5 rounded-lg border border-[var(--vien-the)] text-[var(--tro-tram)] hover:bg-[var(--nen-the-phu)] text-xs font-medium cursor-pointer"
                              >
                                Hủy bỏ
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSaveNote(entry.id)}
                                disabled={isSaving}
                                className="px-4 py-1.5 rounded-lg bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
                              >
                                {isSaving ? (
                                  <>
                                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    <span>Đang lưu...</span>
                                  </>
                                ) : (
                                  <>
                                    <Save className="w-3.5 h-3.5" />
                                    <span>Lưu ghi chú</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        ) : (
                          /* Hiển thị ghi chú cảm xúc khi xem */
                          <div className="p-3.5 rounded-xl bg-amber-500/5 dark:bg-slate-800/80 border border-amber-500/20 dark:border-slate-700/80 text-sm leading-relaxed text-[var(--nen-toi)] relative group">
                            <p className="italic font-serif">
                              "{entry.emotionalNote || "Chưa có ghi chú cảm xúc. Bấm 'Sửa ghi chú' để lưu giữ cảm nghĩ của bạn."}"
                            </p>

                            <div className="mt-2.5 pt-2 border-t border-[var(--vien-the)] flex items-center justify-between text-[11px] text-[var(--tro-tram)]">
                              <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-medium">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Đã lưu</span>
                              </span>
                              <span>Cập nhật: {new Date(entry.updatedAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Thanh tác vụ dưới cùng */}
                      <div className="pt-3 border-t border-[var(--vien-the)] flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleWearOutfit(entry)}
                            className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                            title="Thử lại bộ trang phục này trong Phối Đồ"
                          >
                            <Shirt className="w-3.5 h-3.5" />
                            <span>Mặc lại bộ này</span>
                          </button>

                          {onOpenChoPhien && (
                            <button
                              type="button"
                              onClick={onOpenChoPhien}
                              className="px-3 py-1.5 rounded-xl border border-[var(--vien-the)] bg-[var(--nen-the)] hover:bg-[var(--nen-the-phu)] text-[var(--nen-toi)] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                              title="Xem thêm tại Chợ Phiên Cổ Phục"
                            >
                              <Share2 className="w-3.5 h-3.5 text-[var(--tro-tram)]" />
                              <span className="hidden sm:inline">Chợ Phiên</span>
                            </button>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteEntry(entry.id, entry.costumeTitle)}
                          className="p-1.5 rounded-lg text-[var(--tro-tram)] hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                          title="Xóa mục nhật ký này"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      <AppFooter />
    </div>
  );
}
