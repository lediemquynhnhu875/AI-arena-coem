/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * DOMAIN MODEL: NHÂN VẬT VIỆT NAM (CHARACTER DOMAIN ENTITY)
 * Tuân thủ nguyên lý OOP (Encapsulation, Invariant Validation, Immutability)
 * Chỉ hỗ trợ 2 giới tính: Nam ('nam') và Nữ ('nu').
 */

import { NhanVatConfig, Tuoi, Gioi, VocDang, TongDa, KhuonMat, HuongNhin } from "../types";
import { toCroquisBodyType, CroquisBodyType } from "../croquis/BodyPartLayering";
import { validateClothingDynamicFit, ClothingDynamicFitResult } from "../dimensions/clothingDynamicFit";

export class CharacterModel {
  readonly tuoi: Tuoi;
  readonly gioi: Gioi;
  readonly vocDang: VocDang;
  readonly tongDa: TongDa;
  readonly toc: string;
  readonly khuonMat: KhuonMat;
  readonly huongNhin: HuongNhin;

  constructor(config: {
    tuoi: Tuoi;
    gioi: Gioi;
    vocDang: VocDang;
    tongDa: TongDa;
    toc: string;
    khuonMat?: KhuonMat;
    huongNhin?: HuongNhin;
  }) {
    // Invariant validation: Giới tính chỉ có thể là nam hoặc nu
    if (config.gioi !== "nam" && config.gioi !== "nu") {
      throw new Error(`Giới tính không hợp lệ: ${config.gioi}. Chỉ chấp nhận 'nam' hoặc 'nu'.`);
    }

    this.tuoi = config.tuoi;
    this.gioi = config.gioi;
    this.vocDang = config.vocDang;
    this.tongDa = config.tongDa;
    this.toc = config.toc;
    // Mặt trái xoan với phụ nữ, nam thì chữ điền
    this.khuonMat = config.khuonMat || (config.gioi === "nu" ? "trai_xoan" : "chu_dien");
    this.huongNhin = config.huongNhin || "truoc";
  }

  /**
   * Tạo đối tượng mặc định: Thiếu nữ Việt Nam thanh xuân (Mặt trái xoan, tóc búi thấp)
   */
  static createDefault(): CharacterModel {
    return new CharacterModel({
      tuoi: "nguoi_lon",
      gioi: "nu",
      vocDang: "trung_binh",
      tongDa: 2,
      toc: "bui_thap",
      khuonMat: "trai_xoan",
      huongNhin: "truoc",
    });
  }

  /**
   * Khởi tạo từ config thô với cơ chế fallback an toàn
   */
  static fromConfig(raw?: Partial<NhanVatConfig> | null): CharacterModel {
    if (!raw) return CharacterModel.createDefault();

    // Chuẩn hóa giới tính: nếu dữ liệu cũ là trung_tinh hoặc null, tự động chuyển về nu
    const safeGioi: Gioi = raw.gioi === "nam" ? "nam" : "nu";
    const safeTuoi: Tuoi = raw.tuoi === "tre_em" || raw.tuoi === "nguoi_cao_tuoi" ? raw.tuoi : "nguoi_lon";
    const safeVocDang: VocDang = raw.vocDang || "trung_binh";
    const safeTongDa: TongDa = (raw.tongDa && raw.tongDa >= 1 && raw.tongDa <= 6) ? raw.tongDa : 2;
    const safeToc: string = raw.toc || "bui_thap";
    const safeKhuonMat: KhuonMat = raw.khuonMat || (safeGioi === "nu" ? "trai_xoan" : "chu_dien");
    const safeHuongNhin: HuongNhin = raw.huongNhin === "sau" ? "sau" : "truoc";

    return new CharacterModel({
      tuoi: safeTuoi,
      gioi: safeGioi,
      vocDang: safeVocDang,
      tongDa: safeTongDa,
      toc: safeToc,
      khuonMat: safeKhuonMat,
      huongNhin: safeHuongNhin,
    });
  }

  /**
   * Clone bất biến khi cập nhật 1 trường
   */
  withField<K extends keyof NhanVatConfig>(field: K, value: NhanVatConfig[K]): CharacterModel {
    // Nếu đổi giới tính mà không chỉ định khuôn mặt, tự động chọn mặt tương ứng
    let updatedKhuonMat = this.khuonMat;
    if (field === "gioi") {
      updatedKhuonMat = value === "nu" ? "trai_xoan" : "chu_dien";
    }

    return CharacterModel.fromConfig({
      ...this.toConfig(),
      khuonMat: updatedKhuonMat,
      [field]: value,
    });
  }

  isFemale(): boolean {
    return this.gioi === "nu";
  }

  isMale(): boolean {
    return this.gioi === "nam";
  }

  isChild(): boolean {
    return this.tuoi === "tre_em";
  }

  isElder(): boolean {
    return this.tuoi === "nguoi_cao_tuoi";
  }

  isAdult(): boolean {
    return this.tuoi === "nguoi_lon";
  }

  /**
   * Ánh xạ phân nhóm thể chất chuẩn croquis: 'adult' | 'child' | 'elderly'
   */
  getBodyType(): CroquisBodyType {
    return toCroquisBodyType(this.tuoi);
  }

  /**
   * Tính toán ma trận biến đổi và căn chỉnh động của trang phục theo thể trạng
   */
  getClothingDynamicFit(): ClothingDynamicFitResult {
    return validateClothingDynamicFit(this.getBodyType(), this.isMale(), this.vocDang);
  }

  /**
   * Logic check: Xác thực tính khớp nối giải phẫu giữa hình thể nhân vật và trang phục
   */
  validateClothingAlignment(_trangPhucId?: string): {
    isAligned: boolean;
    bodyType: CroquisBodyType;
    fitResult: ClothingDynamicFitResult;
  } {
    const fitResult = this.getClothingDynamicFit();
    return {
      isAligned: !fitResult.isDetached,
      bodyType: fitResult.bodyType,
      fitResult,
    };
  }

  toConfig(): NhanVatConfig {
    return {
      tuoi: this.tuoi,
      gioi: this.gioi,
      vocDang: this.vocDang,
      tongDa: this.tongDa,
      toc: this.toc,
      khuonMat: this.khuonMat,
      huongNhin: this.huongNhin,
    };
  }
}
