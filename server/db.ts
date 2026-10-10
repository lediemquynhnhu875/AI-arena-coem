/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * HỆ THỐNG CƠ SỞ DỮ LIỆU ĐỒNG BỘ CHO DỰ ÁN CÒ EM (DATABASE SYSTEM)
 * - Sử dụng SQLite tích hợp sẵn (Node 22 node:sqlite) với cơ chế fallback JSON an toàn
 * - Hỗ trợ đầy đủ: characters, outfits, memories, orders, ai_cache, users, otp_codes, sessions
 * - Ghi dữ liệu nguyên tử (Atomic write), chống rò rỉ và bảo vệ an toàn thông tin
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, "../data_store");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export interface UserRecord {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  created_at: string;
  last_login: string;
}

export interface OtpRecord {
  id: string;
  email: string;
  code: string;
  expires_at: number; // timestamp ms
  attempts: number;
  created_at: string;
}

export interface SessionRecord {
  token: string;
  user_id: string;
  email: string;
  expires_at: number; // timestamp ms
  created_at: string;
}

export interface CharacterRecord {
  id: string;
  user_id?: string;
  name: string;
  gioi: "nu" | "nam";
  tuoi: "nguoi_lon" | "tre_em" | "nguoi_cao_tuoi";
  vocDang: string;
  tongDa: number;
  toc: string;
  huongNhin: "truoc" | "sau";
  updated_at: string;
}

export interface OutfitRecord {
  id: string;
  user_id?: string;
  title: string;
  trang_phuc_id: string;
  mau_hex: string;
  phu_kien_ids: string[];
  nhan_vat_config: Record<string, unknown>;
  notes?: string;
  created_at: string;
}

export interface MemoryRecord {
  id: string;
  user_id?: string;
  sender_name: string;
  content: string;
  trang_phuc_name: string;
  era: string;
  created_at: string;
}

export interface OrderRecord {
  id: string;
  user_id?: string;
  item_id: string;
  item_name: string;
  size: string;
  quantity: number;
  status: "pending" | "confirmed" | "completed";
  created_at: string;
}

// Lớp điều phối CSDL bền vững
class DatabaseManager {
  private dbFile = path.join(DATA_DIR, "coem_heritage.db");
  private jsonBackupFile = path.join(DATA_DIR, "coem_heritage.json");
  private sqliteDb: any = null;
  private isSqliteActive = false;

  constructor() {
    this.initDatabase();
  }

  private initDatabase() {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const sqliteModule = Function("return import('node:sqlite')")();
      sqliteModule
        .then(({ DatabaseSync }: any) => {
          try {
            this.sqliteDb = new DatabaseSync(this.dbFile);
            this.createSqliteTables();
            this.isSqliteActive = true;
            this.seedInitialData();
          } catch {
            this.fallbackToJson();
          }
        })
        .catch(() => {
          this.fallbackToJson();
        });
    } catch {
      this.fallbackToJson();
    }
  }

  private fallbackToJson() {
    this.isSqliteActive = false;
    if (!fs.existsSync(this.jsonBackupFile)) {
      const initialJson = {
        users: {},
        otp_codes: [],
        sessions: {},
        characters: {},
        outfits: [],
        memories: [],
        orders: [],
        ai_cache: {},
      };
      fs.writeFileSync(this.jsonBackupFile, JSON.stringify(initialJson, null, 2), "utf-8");
    }
    this.seedInitialData();
  }

  private createSqliteTables() {
    if (!this.sqliteDb) return;

    this.sqliteDb.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE,
        name TEXT,
        avatar TEXT,
        created_at TEXT,
        last_login TEXT
      );

      CREATE TABLE IF NOT EXISTS otp_codes (
        id TEXT PRIMARY KEY,
        email TEXT,
        code TEXT,
        expires_at INTEGER,
        attempts INTEGER,
        created_at TEXT
      );

      CREATE TABLE IF NOT EXISTS sessions (
        token TEXT PRIMARY KEY,
        user_id TEXT,
        email TEXT,
        expires_at INTEGER,
        created_at TEXT
      );

      CREATE TABLE IF NOT EXISTS characters (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        name TEXT,
        gioi TEXT,
        tuoi TEXT,
        vocDang TEXT,
        tongDa INTEGER,
        toc TEXT,
        huongNhin TEXT,
        updated_at TEXT
      );

      CREATE TABLE IF NOT EXISTS outfits (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        title TEXT,
        trang_phuc_id TEXT,
        mau_hex TEXT,
        phu_kien_ids TEXT,
        nhan_vat_config TEXT,
        notes TEXT,
        created_at TEXT
      );

      CREATE TABLE IF NOT EXISTS memories (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        sender_name TEXT,
        content TEXT,
        trang_phuc_name TEXT,
        era TEXT,
        created_at TEXT
      );

      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        item_id TEXT,
        item_name TEXT,
        size TEXT,
        quantity INTEGER,
        status TEXT,
        created_at TEXT
      );

      CREATE TABLE IF NOT EXISTS ai_cache (
        cache_key TEXT PRIMARY KEY,
        response_data TEXT,
        created_at TEXT
      );
    `);

    // Tự động di trú các cột mới nếu CSDL đã tồn tại từ phiên trước
    try {
      this.sqliteDb.exec(`ALTER TABLE characters ADD COLUMN user_id TEXT;`);
    } catch {
      // Bỏ qua nếu cột đã tồn tại
    }
    try {
      this.sqliteDb.exec(`ALTER TABLE outfits ADD COLUMN user_id TEXT;`);
    } catch {
      // Bỏ qua
    }
    try {
      this.sqliteDb.exec(`ALTER TABLE memories ADD COLUMN user_id TEXT;`);
    } catch {
      // Bỏ qua
    }
    try {
      this.sqliteDb.exec(`ALTER TABLE orders ADD COLUMN user_id TEXT;`);
    } catch {
      // Bỏ qua
    }
  }

  private seedInitialData() {
    const initialMemories: MemoryRecord[] = [
      {
        id: "mem-01",
        sender_name: "Hoàng Oanh",
        content: "Bà nội tôi từng mặc Áo Tấc màu thiên thanh trong ngày thành hôn năm 1954 tại đất kinh kỳ Huế.",
        trang_phuc_name: "Áo Tấc Ngũ Thân Tay Thụ",
        era: "Triều Nguyễn",
        created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
      },
      {
        id: "mem-02",
        sender_name: "Minh Triết",
        content: "Tôi yêu thích nét khoáng đạt của tà Áo Giao Lĩnh thời Hậu Lê với phong cách cổ phong trang nhã.",
        trang_phuc_name: "Áo Giao Lĩnh",
        era: "Thời Lê Trung Hưng",
        created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
    ];

    for (const mem of initialMemories) {
      if (!this.getMemoryById(mem.id)) {
        this.saveMemory(mem);
      }
    }
  }

  // --- Helpers for JSON store ---
  private readJsonStore(): any {
    try {
      if (!fs.existsSync(this.jsonBackupFile)) {
        return {
          users: {},
          otp_codes: [],
          sessions: {},
          characters: {},
          outfits: [],
          memories: [],
          orders: [],
          ai_cache: {},
        };
      }
      const data = fs.readFileSync(this.jsonBackupFile, "utf-8");
      const parsed = JSON.parse(data);
      if (!parsed.users) parsed.users = {};
      if (!parsed.otp_codes) parsed.otp_codes = [];
      if (!parsed.sessions) parsed.sessions = {};
      return parsed;
    } catch {
      return {
        users: {},
        otp_codes: [],
        sessions: {},
        characters: {},
        outfits: [],
        memories: [],
        orders: [],
        ai_cache: {},
      };
    }
  }

  private writeJsonStore(data: any): void {
    const tempFile = `${this.jsonBackupFile}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), "utf-8");
    fs.renameSync(tempFile, this.jsonBackupFile);
  }

  // =========================================================================
  // 1. QUẢN LÝ NGƯỜI DÙNG & XÁC THỰC OTP (USERS & AUTHENTICATION)
  // =========================================================================
  public saveUser(user: UserRecord): void {
    if (this.isSqliteActive && this.sqliteDb) {
      const stmt = this.sqliteDb.prepare(`
        INSERT INTO users (id, email, name, avatar, created_at, last_login)
        VALUES (?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          email=excluded.email,
          name=excluded.name,
          avatar=excluded.avatar,
          last_login=excluded.last_login
      `);
      stmt.run(user.id, user.email, user.name, user.avatar || "", user.created_at, user.last_login);
    }

    const json = this.readJsonStore();
    json.users[user.id] = user;
    this.writeJsonStore(json);
  }

  public getUserByEmail(email: string): UserRecord | null {
    const normalizedEmail = email.toLowerCase().trim();
    if (this.isSqliteActive && this.sqliteDb) {
      try {
        const stmt = this.sqliteDb.prepare(`SELECT * FROM users WHERE LOWER(email) = ?`);
        const row = stmt.get(normalizedEmail);
        if (row) return row as UserRecord;
      } catch {
        // Fallback
      }
    }

    const json = this.readJsonStore();
    for (const key of Object.keys(json.users)) {
      if (json.users[key].email.toLowerCase().trim() === normalizedEmail) {
        return json.users[key];
      }
    }
    return null;
  }

  public getUserById(id: string): UserRecord | null {
    if (this.isSqliteActive && this.sqliteDb) {
      try {
        const stmt = this.sqliteDb.prepare(`SELECT * FROM users WHERE id = ?`);
        const row = stmt.get(id);
        if (row) return row as UserRecord;
      } catch {
        // Fallback
      }
    }

    const json = this.readJsonStore();
    return json.users[id] || null;
  }

  // OTP Codes
  public saveOtp(otp: OtpRecord): void {
    if (this.isSqliteActive && this.sqliteDb) {
      const stmt = this.sqliteDb.prepare(`
        INSERT INTO otp_codes (id, email, code, expires_at, attempts, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          code=excluded.code,
          expires_at=excluded.expires_at,
          attempts=excluded.attempts
      `);
      stmt.run(otp.id, otp.email.toLowerCase().trim(), otp.code, otp.expires_at, otp.attempts, otp.created_at);
    }

    const json = this.readJsonStore();
    json.otp_codes = json.otp_codes.filter((o: OtpRecord) => o.email.toLowerCase() !== otp.email.toLowerCase());
    json.otp_codes.push(otp);
    this.writeJsonStore(json);
  }

  public getLatestOtp(email: string): OtpRecord | null {
    const normalizedEmail = email.toLowerCase().trim();
    if (this.isSqliteActive && this.sqliteDb) {
      try {
        const stmt = this.sqliteDb.prepare(`
          SELECT * FROM otp_codes 
          WHERE LOWER(email) = ? 
          ORDER BY expires_at DESC 
          LIMIT 1
        `);
        const row = stmt.get(normalizedEmail);
        if (row) return row as OtpRecord;
      } catch {
        // Fallback
      }
    }

    const json = this.readJsonStore();
    const list = json.otp_codes.filter((o: OtpRecord) => o.email.toLowerCase() === normalizedEmail);
    if (list.length === 0) return null;
    list.sort((a: OtpRecord, b: OtpRecord) => b.expires_at - a.expires_at);
    return list[0];
  }

  public incrementOtpAttempts(id: string): void {
    if (this.isSqliteActive && this.sqliteDb) {
      try {
        const stmt = this.sqliteDb.prepare(`UPDATE otp_codes SET attempts = attempts + 1 WHERE id = ?`);
        stmt.run(id);
      } catch {
        // Fallback
      }
    }

    const json = this.readJsonStore();
    const target = json.otp_codes.find((o: OtpRecord) => o.id === id);
    if (target) {
      target.attempts = (target.attempts || 0) + 1;
      this.writeJsonStore(json);
    }
  }

  public deleteOtp(id: string): void {
    if (this.isSqliteActive && this.sqliteDb) {
      try {
        const stmt = this.sqliteDb.prepare(`DELETE FROM otp_codes WHERE id = ?`);
        stmt.run(id);
      } catch {
        // Fallback
      }
    }

    const json = this.readJsonStore();
    json.otp_codes = json.otp_codes.filter((o: OtpRecord) => o.id !== id);
    this.writeJsonStore(json);
  }

  // Sessions
  public saveSession(session: SessionRecord): void {
    if (this.isSqliteActive && this.sqliteDb) {
      const stmt = this.sqliteDb.prepare(`
        INSERT INTO sessions (token, user_id, email, expires_at, created_at)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(token) DO UPDATE SET
          expires_at=excluded.expires_at
      `);
      stmt.run(session.token, session.user_id, session.email, session.expires_at, session.created_at);
    }

    const json = this.readJsonStore();
    json.sessions[session.token] = session;
    this.writeJsonStore(json);
  }

  public getSession(token: string): SessionRecord | null {
    if (!token) return null;

    if (this.isSqliteActive && this.sqliteDb) {
      try {
        const stmt = this.sqliteDb.prepare(`SELECT * FROM sessions WHERE token = ?`);
        const row = stmt.get(token) as SessionRecord | undefined;
        if (row) {
          if (row.expires_at < Date.now()) {
            this.deleteSession(token);
            return null;
          }
          return row;
        }
      } catch {
        // Fallback
      }
    }

    const json = this.readJsonStore();
    const session = json.sessions[token];
    if (session) {
      if (session.expires_at < Date.now()) {
        delete json.sessions[token];
        this.writeJsonStore(json);
        return null;
      }
      return session;
    }
    return null;
  }

  public deleteSession(token: string): void {
    if (this.isSqliteActive && this.sqliteDb) {
      try {
        const stmt = this.sqliteDb.prepare(`DELETE FROM sessions WHERE token = ?`);
        stmt.run(token);
      } catch {
        // Fallback
      }
    }

    const json = this.readJsonStore();
    delete json.sessions[token];
    this.writeJsonStore(json);
  }

  // =========================================================================
  // 2. QUẢN LÝ NHÂN VẬT (CHARACTERS)
  // =========================================================================
  public saveCharacter(record: CharacterRecord): void {
    if (this.isSqliteActive && this.sqliteDb) {
      const stmt = this.sqliteDb.prepare(`
        INSERT INTO characters (id, user_id, name, gioi, tuoi, vocDang, tongDa, toc, huongNhin, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          user_id=excluded.user_id,
          name=excluded.name,
          gioi=excluded.gioi,
          tuoi=excluded.tuoi,
          vocDang=excluded.vocDang,
          tongDa=excluded.tongDa,
          toc=excluded.toc,
          huongNhin=excluded.huongNhin,
          updated_at=excluded.updated_at
      `);
      stmt.run(
        record.id,
        record.user_id || "",
        record.name,
        record.gioi,
        record.tuoi,
        record.vocDang,
        record.tongDa,
        record.toc,
        record.huongNhin,
        record.updated_at
      );
    }

    const json = this.readJsonStore();
    json.characters[record.id] = record;
    this.writeJsonStore(json);
  }

  public getCharacter(id = "default"): CharacterRecord | null {
    if (this.isSqliteActive && this.sqliteDb) {
      try {
        const stmt = this.sqliteDb.prepare(`SELECT * FROM characters WHERE id = ?`);
        const row = stmt.get(id);
        if (row) return row as CharacterRecord;
      } catch {
        // Fallback to JSON
      }
    }

    const json = this.readJsonStore();
    return json.characters[id] || null;
  }

  // =========================================================================
  // 3. QUẢN LÝ BỘ PHỐI ĐỒ (OUTFITS)
  // =========================================================================
  public saveOutfit(record: OutfitRecord): void {
    if (this.isSqliteActive && this.sqliteDb) {
      const stmt = this.sqliteDb.prepare(`
        INSERT INTO outfits (id, user_id, title, trang_phuc_id, mau_hex, phu_kien_ids, nhan_vat_config, notes, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          user_id=excluded.user_id,
          title=excluded.title,
          trang_phuc_id=excluded.trang_phuc_id,
          mau_hex=excluded.mau_hex,
          phu_kien_ids=excluded.phu_kien_ids,
          nhan_vat_config=excluded.nhan_vat_config,
          notes=excluded.notes
      `);
      stmt.run(
        record.id,
        record.user_id || "",
        record.title,
        record.trang_phuc_id,
        record.mau_hex,
        JSON.stringify(record.phu_kien_ids),
        JSON.stringify(record.nhan_vat_config),
        record.notes || "",
        record.created_at
      );
    }

    const json = this.readJsonStore();
    const idx = json.outfits.findIndex((o: OutfitRecord) => o.id === record.id);
    if (idx >= 0) {
      json.outfits[idx] = record;
    } else {
      json.outfits.unshift(record);
    }
    this.writeJsonStore(json);
  }

  public getAllOutfits(userId?: string): OutfitRecord[] {
    if (this.isSqliteActive && this.sqliteDb) {
      try {
        const sql = userId
          ? `SELECT * FROM outfits WHERE user_id = ? OR user_id = '' OR user_id IS NULL ORDER BY created_at DESC`
          : `SELECT * FROM outfits ORDER BY created_at DESC`;
        const stmt = this.sqliteDb.prepare(sql);
        const rows = userId ? stmt.all(userId) : stmt.all();
        return rows.map((r: any) => ({
          ...r,
          phu_kien_ids: JSON.parse(r.phu_kien_ids || "[]"),
          nhan_vat_config: JSON.parse(r.nhan_vat_config || "{}"),
        }));
      } catch {
        // Fallback to JSON
      }
    }

    const json = this.readJsonStore();
    if (userId) {
      return json.outfits.filter((o: OutfitRecord) => !o.user_id || o.user_id === userId);
    }
    return json.outfits || [];
  }

  public deleteOutfit(id: string): boolean {
    if (this.isSqliteActive && this.sqliteDb) {
      try {
        const stmt = this.sqliteDb.prepare(`DELETE FROM outfits WHERE id = ?`);
        stmt.run(id);
      } catch {
        // Ignore
      }
    }

    const json = this.readJsonStore();
    const prevLen = json.outfits.length;
    json.outfits = json.outfits.filter((o: OutfitRecord) => o.id !== id);
    this.writeJsonStore(json);
    return json.outfits.length < prevLen;
  }

  // =========================================================================
  // 4. QUẢN LÝ KÝ ỨC VIỆT PHỤC (MEMORIES)
  // =========================================================================
  public saveMemory(record: MemoryRecord): void {
    if (this.isSqliteActive && this.sqliteDb) {
      const stmt = this.sqliteDb.prepare(`
        INSERT INTO memories (id, user_id, sender_name, content, trang_phuc_name, era, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          content=excluded.content,
          trang_phuc_name=excluded.trang_phuc_name,
          era=excluded.era
      `);
      stmt.run(
        record.id,
        record.user_id || "",
        record.sender_name,
        record.content,
        record.trang_phuc_name,
        record.era,
        record.created_at
      );
    }

    const json = this.readJsonStore();
    const idx = json.memories.findIndex((m: MemoryRecord) => m.id === record.id);
    if (idx >= 0) {
      json.memories[idx] = record;
    } else {
      json.memories.unshift(record);
    }
    this.writeJsonStore(json);
  }

  public getAllMemories(): MemoryRecord[] {
    if (this.isSqliteActive && this.sqliteDb) {
      try {
        const stmt = this.sqliteDb.prepare(`SELECT * FROM memories ORDER BY created_at DESC`);
        return stmt.all() as MemoryRecord[];
      } catch {
        // Fallback
      }
    }

    const json = this.readJsonStore();
    return json.memories || [];
  }

  public getMemoryById(id: string): MemoryRecord | null {
    const list = this.getAllMemories();
    return list.find((m) => m.id === id) || null;
  }

  // =========================================================================
  // 5. QUẢN LÝ ĐƠN HÀNG CHỢ PHIÊN (ORDERS)
  // =========================================================================
  public saveOrder(record: OrderRecord): void {
    if (this.isSqliteActive && this.sqliteDb) {
      const stmt = this.sqliteDb.prepare(`
        INSERT INTO orders (id, user_id, item_id, item_name, size, quantity, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      stmt.run(
        record.id,
        record.user_id || "",
        record.item_id,
        record.item_name,
        record.size,
        record.quantity,
        record.status,
        record.created_at
      );
    }

    const json = this.readJsonStore();
    json.orders.unshift(record);
    this.writeJsonStore(json);
  }

  public getAllOrders(userId?: string): OrderRecord[] {
    if (this.isSqliteActive && this.sqliteDb) {
      try {
        const sql = userId
          ? `SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC`
          : `SELECT * FROM orders ORDER BY created_at DESC`;
        const stmt = this.sqliteDb.prepare(sql);
        return (userId ? stmt.all(userId) : stmt.all()) as OrderRecord[];
      } catch {
        // Fallback
      }
    }

    const json = this.readJsonStore();
    if (userId) {
      return json.orders.filter((o: OrderRecord) => o.user_id === userId);
    }
    return json.orders || [];
  }

  // =========================================================================
  // 6. CACHE AI TRÊN MÁY CHỦ (AI CACHE)
  // =========================================================================
  public getAiCache(key: string): unknown | null {
    if (this.isSqliteActive && this.sqliteDb) {
      try {
        const stmt = this.sqliteDb.prepare(`SELECT response_data FROM ai_cache WHERE cache_key = ?`);
        const row = stmt.get(key) as { response_data: string } | undefined;
        if (row?.response_data) {
          return JSON.parse(row.response_data);
        }
      } catch {
        // Fallback
      }
    }

    const json = this.readJsonStore();
    return json.ai_cache[key] || null;
  }

  public setAiCache(key: string, data: unknown): void {
    if (this.isSqliteActive && this.sqliteDb) {
      try {
        const stmt = this.sqliteDb.prepare(`
          INSERT INTO ai_cache (cache_key, response_data, created_at)
          VALUES (?, ?, ?)
          ON CONFLICT(cache_key) DO UPDATE SET response_data=excluded.response_data
        `);
        stmt.run(key, JSON.stringify(data), new Date().toISOString());
      } catch {
        // Fallback
      }
    }

    const json = this.readJsonStore();
    json.ai_cache[key] = data;
    this.writeJsonStore(json);
  }
}

export const db = new DatabaseManager();
export default db;
