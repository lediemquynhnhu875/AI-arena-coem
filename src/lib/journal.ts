/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * DỊCH VỤ NHẬT KÝ TRẢI NGHIỆM PHỐI ĐỒ & GHI CHÚ CẢM XÚC CÁ NHÂN (EXPERIENCE JOURNAL SERVICE)
 * - Quản lý lịch sử các bộ trang phục người dùng đã phối hợp
 * - Đồng bộ ghi chú cảm xúc cá nhân lên Cloud Firestore theo từng tài khoản
 * - Lưu trữ đệm an toàn ngoại tuyến (localStorage) và tự động đồng bộ lên Firestore
 */

import {
  auth,
  saveJournalEntryToFirestore,
  getJournalEntriesFromFirestore,
  deleteJournalEntryFromFirestore,
  type JournalEntry,
} from "./firebase";
import { AuthService } from "./auth";
import { layKhoaTheoHoSo } from "./hoSo";
import { OutfitSaved, docDanhSachGuiKyUc } from "./guiKyUc";
import { trangPhuc } from "../data/trangphuc";

export type { JournalEntry };

export interface MoodOption {
  id: string;
  label: string;
  icon: string;
  color: string;
  badgeBg: string;
}

export const MOOD_OPTIONS: MoodOption[] = [
  { id: "hoai_niem", label: "Hoài niệm di sản", icon: "🌿", color: "text-emerald-700 dark:text-emerald-300", badgeBg: "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800" },
  { id: "tu_hao", label: "Tự hào truyền thống", icon: "🇻🇳", color: "text-rose-700 dark:text-rose-300", badgeBg: "bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800" },
  { id: "thanh_tao", label: "Thanh tao tao nhã", icon: "🌸", color: "text-pink-700 dark:text-pink-300", badgeBg: "bg-pink-50 dark:bg-pink-950/50 border-pink-200 dark:border-pink-800" },
  { id: "han_hoan", label: "Hân hoan ngày hội", icon: "🎉", color: "text-amber-700 dark:text-amber-300", badgeBg: "bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800" },
  { id: "binh_yen", label: "Bình yên sâu lắng", icon: "🕊️", color: "text-sky-700 dark:text-sky-300", badgeBg: "bg-sky-50 dark:bg-sky-950/50 border-sky-200 dark:border-sky-800" },
  { id: "sang_tao", label: "Phá cách đương đại", icon: "✨", color: "text-indigo-700 dark:text-indigo-300", badgeBg: "bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200 dark:border-indigo-800" },
];

export const GOI_Y_CAM_XUC = [
  "Khoác lên tà áo này cảm giác như được chạm vào dòng chảy trăm năm của tiền nhân...",
  "Sắc vải trầm ấm làm lòng mình lắng lại giữa nhịp sống hối hả hiện đại.",
  "Phối bộ này dự định sẽ mặc vào dịp lễ Tết hoặc ngày hội đầu năm với gia đình.",
  "Rất yêu thích đường nét vạt áo và sự kín đáo, trang nhã đậm chất văn hóa Việt.",
  "Một sự giao thoa thú vị giữa chất liệu truyền thống và cảm hứng phối màu đương đại.",
];

export const JOURNAL_CHANGE_EVENT = "vpr:journal-change";

export function layKhoaJournal(): string {
  return layKhoaTheoHoSo("journal_entries");
}

/**
 * Lấy User ID hiện tại (ưu tiên Firebase Auth UID, sau đó đến session AuthUser ID, hoặc fallback)
 */
export function getCurrentUserId(): string | null {
  if (auth.currentUser?.uid) {
    return auth.currentUser.uid;
  }
  const localUser = AuthService.getUser();
  if (localUser?.id) {
    return localUser.id;
  }
  return null;
}

/**
 * Đọc toàn bộ danh sách nhật ký trải nghiệm từ LocalStorage
 */
export function docDanhSachJournalLocal(): JournalEntry[] {
  if (typeof window === "undefined" || !window.localStorage) return [];
  const key = layKhoaJournal();
  try {
    const raw = window.localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error("Lỗi đọc nhật ký local:", err);
  }

  // Nếu local chưa có mục nhật ký nào, tự động tạo từ danh sách outfits đã lưu
  const savedOutfits = docDanhSachGuiKyUc();
  const initialEntries: JournalEntry[] = savedOutfits.map((outfit) => {
    const tp = trangPhuc.find((t) => t.id === outfit.trangPhucId);
    return {
      id: `journal_${outfit.id}`,
      userId: getCurrentUserId() || "guest",
      outfitId: outfit.id,
      trangPhucId: outfit.trangPhucId,
      costumeTitle: tp ? tp.ten : "Cổ phục Việt",
      mauId: outfit.mauId,
      phuKienIds: outfit.phuKienIds || [],
      caption: outfit.caption || "",
      emotionalNote: outfit.cauLyDoRemix || "Ấn tượng sâu sắc với dáng hình và văn hóa trang phục cổ truyền.",
      mood: "Hoài niệm di sản",
      taoLuc: outfit.taoLuc || Date.now(),
      updatedAt: new Date(outfit.taoLuc || Date.now()).toISOString(),
    };
  });

  if (initialEntries.length > 0 && typeof window !== "undefined") {
    try {
      window.localStorage.setItem(key, JSON.stringify(initialEntries));
    } catch {
      // ignore
    }
  }

  return initialEntries;
}

/**
 * Lưu danh sách nhật ký vào LocalStorage
 */
export function luuDanhSachJournalLocal(entries: JournalEntry[]): void {
  if (typeof window === "undefined" || !window.localStorage) return;
  const key = layKhoaJournal();
  try {
    window.localStorage.setItem(key, JSON.stringify(entries));
    window.dispatchEvent(new CustomEvent(JOURNAL_CHANGE_EVENT, { detail: entries }));
  } catch (err) {
    console.error("Lỗi lưu nhật ký local:", err);
  }
}

/**
 * Đồng bộ hoặc tải dữ liệu nhật ký từ Firestore (khi đã đăng nhập)
 */
export async function taiVaDongBoJournal(userId?: string): Promise<{
  entries: JournalEntry[];
  fromFirestore: boolean;
}> {
  const targetUid = userId || getCurrentUserId();
  const localList = docDanhSachJournalLocal();

  if (!targetUid) {
    return { entries: localList, fromFirestore: false };
  }

  try {
    // Tải từ Firestore
    const firestoreEntries = await getJournalEntriesFromFirestore(targetUid);
    if (firestoreEntries && firestoreEntries.length > 0) {
      // Kết hợp giữa Firestore và local (Firestore làm gốc, thêm các entry local mới chưa có trên cloud)
      const firestoreIds = new Set(firestoreEntries.map((e) => e.id));
      const combined = [...firestoreEntries];

      for (const loc of localList) {
        if (!firestoreIds.has(loc.id)) {
          combined.push(loc);
          // Đẩy ngầm lên Firestore để đồng bộ
          saveJournalEntryToFirestore(targetUid, { ...loc, userId: targetUid }).catch(() => {});
        }
      }

      luuDanhSachJournalLocal(combined);
      return { entries: combined, fromFirestore: true };
    } else if (localList.length > 0) {
      // Nếu Firestore chưa có gì nhưng local có, đồng bộ local lên Firestore
      for (const entry of localList) {
        saveJournalEntryToFirestore(targetUid, { ...entry, userId: targetUid }).catch(() => {});
      }
      return { entries: localList, fromFirestore: true };
    }
  } catch (err) {
    console.warn("Không thể tải nhật ký từ Firestore, sử dụng bộ nhớ nội bộ:", err);
  }

  return { entries: localList, fromFirestore: false };
}

/**
 * Cập nhật hoặc thêm ghi chú cảm xúc cho một bộ trang phục trong Nhật ký & Firestore
 */
export async function capNhatGhiChuCamXuc(
  journalId: string,
  emotionalNote: string,
  mood: string
): Promise<{ success: boolean; entry?: JournalEntry; syncedToFirestore: boolean }> {
  const localList = docDanhSachJournalLocal();
  const index = localList.findIndex((e) => e.id === journalId);

  if (index === -1) {
    return { success: false, syncedToFirestore: false };
  }

  const updatedEntry: JournalEntry = {
    ...localList[index],
    emotionalNote: emotionalNote.trim(),
    mood: mood.trim(),
    updatedAt: new Date().toISOString(),
  };

  localList[index] = updatedEntry;
  luuDanhSachJournalLocal(localList);

  const uid = getCurrentUserId();
  let synced = false;

  if (uid) {
    try {
      await saveJournalEntryToFirestore(uid, updatedEntry);
      synced = true;
    } catch (err) {
      console.error("Lỗi đồng bộ ghi chú cảm xúc lên Firestore:", err);
    }
  }

  return { success: true, entry: updatedEntry, syncedToFirestore: synced };
}

/**
 * Xóa một mục nhật ký khỏi hệ thống và Firestore
 */
export async function xoaMucNhatKy(
  journalId: string
): Promise<{ success: boolean; syncedToFirestore: boolean }> {
  const localList = docDanhSachJournalLocal();
  const filtered = localList.filter((e) => e.id !== journalId);
  luuDanhSachJournalLocal(filtered);

  const uid = getCurrentUserId();
  let synced = false;
  if (uid) {
    try {
      await deleteJournalEntryFromFirestore(uid, journalId);
      synced = true;
    } catch (err) {
      console.error("Lỗi xóa mục nhật ký trên Firestore:", err);
    }
  }

  return { success: true, syncedToFirestore: synced };
}

/**
 * Tự động tạo mục nhật ký mới khi người dùng vừa lưu bộ đồ vào Gùi Ký Ức
 */
export function ghiNhanOutfitVaoNhatKy(outfit: OutfitSaved): void {
  const localList = docDanhSachJournalLocal();
  const journalId = `journal_${outfit.id}`;
  const existing = localList.find((e) => e.id === journalId);

  const tp = trangPhuc.find((t) => t.id === outfit.trangPhucId);
  const entry: JournalEntry = {
    id: journalId,
    userId: getCurrentUserId() || "guest",
    outfitId: outfit.id,
    trangPhucId: outfit.trangPhucId,
    costumeTitle: tp ? tp.ten : "Cổ phục Việt",
    mauId: outfit.mauId,
    phuKienIds: outfit.phuKienIds || [],
    caption: outfit.caption || "",
    emotionalNote: existing?.emotionalNote || outfit.cauLyDoRemix || "Vừa hoàn thiện bộ phối đồ mang đậm bản sắc di sản.",
    mood: existing?.mood || "Hoài niệm di sản",
    taoLuc: outfit.taoLuc || Date.now(),
    updatedAt: new Date().toISOString(),
  };

  const updatedList = [entry, ...localList.filter((e) => e.id !== journalId)];
  luuDanhSachJournalLocal(updatedList);

  const uid = getCurrentUserId();
  if (uid) {
    saveJournalEntryToFirestore(uid, entry).catch((err) => {
      console.warn("Lỗi lưu nhật ký lên Firestore khi hoàn tất phối đồ:", err);
    });
  }
}
