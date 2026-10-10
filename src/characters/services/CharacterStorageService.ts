/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * SERVICE: LƯU TRỮ VÀ QUẢN LÝ HỒ SƠ NHÂN VẬT (CHARACTER STORAGE SERVICE)
 * Hỗ trợ đồng bộ đa tầng: Bộ nhớ cục bộ (localStorage) và Máy chủ CSDL an toàn (/api/character)
 */

import { CharacterModel } from "../models/CharacterModel";
import { NhanVatConfig } from "../types";
import { layKhoaTheoHoSo } from "../../lib/hoSo";

export class CharacterStorageService {
  private static readonly STORAGE_KEY_PREFIX = "nhan_vat";

  /**
   * Tải cấu hình nhân vật từ bộ nhớ ứng dụng
   */
  static loadCharacter(initial?: NhanVatConfig): CharacterModel {
    if (initial) {
      return CharacterModel.fromConfig(initial);
    }

    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const key = layKhoaTheoHoSo(this.STORAGE_KEY_PREFIX);
        const stored = window.localStorage.getItem(key);
        if (stored) {
          const parsed = JSON.parse(stored);
          return CharacterModel.fromConfig(parsed);
        }
      }
    } catch (err) {
      console.warn("Không thể tải hồ sơ nhân vật từ localStorage:", err);
    }

    return CharacterModel.createDefault();
  }

  /**
   * Lưu cấu hình nhân vật an toàn (đồng bộ cả LocalStorage và Backend CSDL)
   */
  static saveCharacter(character: CharacterModel | NhanVatConfig): void {
    const config = character instanceof CharacterModel ? character.toConfig() : character;

    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const key = layKhoaTheoHoSo(this.STORAGE_KEY_PREFIX);
        window.localStorage.setItem(key, JSON.stringify(config));
      }
    } catch (err) {
      console.warn("Không thể lưu hồ sơ nhân vật vào localStorage:", err);
    }

    // Đồng bộ nền tới máy chủ CSDL (không chặn UI)
    try {
      if (typeof window !== "undefined" && typeof fetch === "function") {
        fetch("/api/character", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: "default",
            name: "Người mẫu Việt Phục",
            gioi: config.gioi,
            tuoi: config.tuoi,
            vocDang: config.vocDang,
            tongDa: config.tongDa,
            toc: config.toc,
            huongNhin: config.huongNhin,
          }),
        }).catch(() => {
          // Bỏ qua lỗi mạng nếu offline
        });
      }
    } catch {
      // Offline safe
    }
  }
}
