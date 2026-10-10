/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * FIREBASE INITIALIZATION & CLIENT SDK (AUTH & FIRESTORE)
 * - Tích hợp Google Sign-in bằng Firebase Auth
 * - Đồng bộ dữ liệu người dùng, tủ đồ, nhân vật vào Cloud Firestore
 * - Kiểm tra kết nối máy chủ Firestore tự động
 * - Chuẩn hóa xử lý lỗi Firestore theo tiêu chuẩn kỹ thuật
 */

import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  collection,
  query,
  getDocs,
  getDocFromServer,
  Firestore,
} from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";

// Khởi tạo ứng dụng Firebase duy nhất
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

// CRITICAL: Phải truyền databaseId từ firebaseConfig để kết nối chính xác database instance
export const db: Firestore = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

export const firestore: Firestore = db;

// Chuẩn hóa loại thao tác Firestore
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Kiểm tra kết nối Firestore lúc khởi động theo tiêu chuẩn kỹ thuật
export async function validateFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, "test", "connection"));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes("the client is offline")) {
      console.warn("Firestore: Không thể kết nối trực tiếp hoặc client đang offline.");
      return false;
    }
    // Lỗi quyền permission-denied khi đọc test doc là bình thường vì rules bảo vệ
    return true;
  }
}

// Gọi kiểm tra khi nạp module
validateFirestoreConnection().catch(() => {});

/**
 * Đăng nhập bằng tài khoản Google (Firebase Auth Popup)
 */
export async function signInWithGoogle(): Promise<FirebaseUser | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Tự động lưu hoặc cập nhật thông tin hồ sơ vào Firestore (không chặn luồng xác thực nếu tạm thời lỗi)
    if (user) {
      const userRef = doc(db, "users", user.uid);
      try {
        await setDoc(
          userRef,
          {
            userId: user.uid,
            displayName: user.displayName || "Người Mến Cổ Phục",
            email: user.email || "",
            photoURL: user.photoURL || "",
            lastLoginAt: new Date().toISOString(),
          },
          { merge: true }
        );
      } catch (err) {
        console.warn("Không thể lưu profile Firestore (sẽ lưu cục bộ):", err);
      }
    }

    return user;
  } catch (err: unknown) {
    console.error("Lỗi đăng nhập Google với Firebase:", err);
    throw err;
  }
}

/**
 * Đăng xuất khỏi Firebase Auth
 */
export async function signOutFirebase(): Promise<void> {
  await firebaseSignOut(auth);
}

/**
 * Lưu cấu hình nhân vật của người dùng vào Firestore
 */
export async function saveUserCharacterToFirestore(
  userId: string,
  charData: Record<string, unknown>
): Promise<void> {
  if (!userId) return;
  if (!auth.currentUser || auth.currentUser.uid !== userId) return;
  const path = `users/${userId}/character/current`;
  try {
    const charRef = doc(db, "users", userId, "character", "current");
    await setDoc(charRef, { ...charData, updatedAt: new Date().toISOString() }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

/**
 * Lấy cấu hình nhân vật của người dùng từ Firestore
 */
export async function getUserCharacterFromFirestore(userId: string): Promise<Record<string, unknown> | null> {
  if (!userId) return null;
  if (!auth.currentUser || auth.currentUser.uid !== userId) return null;
  const path = `users/${userId}/character/current`;
  try {
    const charRef = doc(db, "users", userId, "character", "current");
    const snap = await getDoc(charRef);
    return snap.exists() ? snap.data() : null;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
  }
}

/**
 * Lưu bộ phối đồ vào Firestore
 */
export async function saveUserOutfitToFirestore(
  userId: string,
  outfitId: string,
  outfitData: Record<string, unknown>
): Promise<void> {
  if (!userId || !outfitId) return;
  if (!auth.currentUser || auth.currentUser.uid !== userId) return;
  const path = `users/${userId}/outfits/${outfitId}`;
  try {
    const outfitRef = doc(db, "users", userId, "outfits", outfitId);
    await setDoc(outfitRef, { ...outfitData, createdAt: new Date().toISOString() }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

/**
 * Lấy danh sách bộ phối đồ của người dùng từ Firestore
 */
export async function getUserOutfitsFromFirestore(userId: string): Promise<Record<string, unknown>[]> {
  if (!userId) return [];
  if (!auth.currentUser || auth.currentUser.uid !== userId) return [];
  const path = `users/${userId}/outfits`;
  try {
    const outfitsRef = collection(db, "users", userId, "outfits");
    const snap = await getDocs(query(outfitsRef));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
  }
}

/**
 * CẤU TRÚC DỮ LIỆU NHẬT KÝ TRẢI NGHIỆM PHỐI ĐỒ (EXPERIENCE JOURNAL)
 */
export interface JournalEntry {
  id: string; // ID mục nhật ký
  userId: string; // ID người dùng sở hữu
  outfitId: string; // Mã bộ trang phục liên kết
  trangPhucId: string; // ID loại cổ phục (ví dụ: tu_than, nhat_binh, tac...)
  costumeTitle: string; // Tên hiển thị trang phục
  mauId: string; // Mã màu chủ đạo
  phuKienIds: string[]; // Danh sách mã phụ kiện
  caption?: string; // Lời tóm tắt / mô tả
  emotionalNote: string; // Ghi chú cảm xúc cá nhân của người dùng
  mood?: string; // Tâm trạng / nhãn cảm xúc
  taoLuc: number; // Thời điểm tạo (timestamp ms)
  updatedAt: string; // Thời điểm cập nhật ISO
}

/**
 * Lưu hoặc cập nhật mục nhật ký trải nghiệm kèm ghi chú cảm xúc vào Cloud Firestore
 */
export async function saveJournalEntryToFirestore(
  userId: string,
  entry: Omit<JournalEntry, "userId" | "updatedAt"> & { userId?: string }
): Promise<void> {
  if (!userId || !entry.id) return;
  if (!auth.currentUser || auth.currentUser.uid !== userId) return;
  const path = `users/${userId}/journal/${entry.id}`;
  const now = new Date().toISOString();
  try {
    const journalRef = doc(db, "users", userId, "journal", entry.id);
    await setDoc(
      journalRef,
      {
        ...entry,
        userId,
        updatedAt: now,
      },
      { merge: true }
    );

    // Đồng bộ ngược lại ghi chú cảm xúc vào bộ outfit tương ứng nếu có
    if (entry.outfitId) {
      const outfitRef = doc(db, "users", userId, "outfits", entry.outfitId);
      await setDoc(
        outfitRef,
        {
          emotionalNote: entry.emotionalNote,
          mood: entry.mood || "",
          notes: entry.emotionalNote,
        },
        { merge: true }
      ).catch(() => {});
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

/**
 * Lấy danh sách toàn bộ nhật ký trải nghiệm phối đồ của người dùng từ Cloud Firestore
 */
export async function getJournalEntriesFromFirestore(userId: string): Promise<JournalEntry[]> {
  if (!userId) return [];
  if (!auth.currentUser || auth.currentUser.uid !== userId) return [];
  const path = `users/${userId}/journal`;
  try {
    const journalColRef = collection(db, "users", userId, "journal");
    const snap = await getDocs(query(journalColRef));
    const entries: JournalEntry[] = snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        userId: data.userId || userId,
        outfitId: data.outfitId || d.id,
        trangPhucId: data.trangPhucId || "tu_than",
        costumeTitle: data.costumeTitle || "Cổ phục Việt",
        mauId: data.mauId || "m_cham",
        phuKienIds: Array.isArray(data.phuKienIds) ? data.phuKienIds : [],
        caption: data.caption || "",
        emotionalNote: data.emotionalNote || "",
        mood: data.mood || "Hoài niệm di sản",
        taoLuc: typeof data.taoLuc === "number" ? data.taoLuc : Date.now(),
        updatedAt: data.updatedAt || new Date().toISOString(),
      };
    });
    // Sắp xếp thời gian mới nhất lên đầu
    return entries.sort((a, b) => b.taoLuc - a.taoLuc);
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
  }
}

/**
 * Xóa một mục nhật ký khỏi Cloud Firestore
 */
export async function deleteJournalEntryFromFirestore(userId: string, entryId: string): Promise<void> {
  if (!userId || !entryId) return;
  if (!auth.currentUser || auth.currentUser.uid !== userId) return;
  const path = `users/${userId}/journal/${entryId}`;
  try {
    const journalRef = doc(db, "users", userId, "journal", entryId);
    await deleteDoc(journalRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

