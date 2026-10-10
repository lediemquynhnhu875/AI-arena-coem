/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * HỆ THỐNG PHÂN TẦNG CÁC PHẦN HÌNH THỂ CROQUIS (CENTRALIZED BODY-PART LAYERING)
 * Chuẩn hóa kiến trúc phân lớp Z-index và liên kết không gian cho:
 * 1. Tóc (Lớp sau lưng & Lớp trước trán)
 * 2. Hình thể ma-nơ-canh vector gốc
 * 3. Trang phục dưới (Quần / Váy / Giày guốc)
 * 4. Trang phục trên (Áo / Tà áo / Tay áo / Thân áo)
 * 5. Phụ kiện thân mình (Kiềng bạc, khăn rằn, thắt lưng, túi vải)
 * 6. Phụ kiện đội đầu (Nón lá, khăn đóng, khăn mỏ quạ, trâm cài)
 * 
 * Ánh xạ chuẩn mô-đun hóa cho 3 nhóm đối tượng thể chất:
 * - 'adult' (Người lớn - Tỷ lệ thời trang 9 đầu thanh thoát chuẩn croquis)
 * - 'child' (Trẻ em - Nhỏ nhắn, ngộ nghĩnh, tỉ lệ đầu/thân cân xứng, phụ kiện và trang phục thu nhỏ)
 * - 'elderly' (Người cao tuổi - Dáng dấp ung dung, hơi chùng vai nhẹ, tóc hoa râm, phục sức phúc hậu)
 */

import React, { useMemo } from "react";
import { NhanVatConfig, HuongNhin, Tuoi } from "../types";
import { BANG_MAU_DA } from "../dimensions/skinTones";
import { CroquisBehindHair, CroquisHairRenderer } from "./HairStyles";
import { validateClothingDynamicFit, ClothingDynamicFitResult } from "../dimensions/clothingDynamicFit";

export type CroquisBodyType = "adult" | "child" | "elderly";

export function toCroquisBodyType(tuoi?: Tuoi | string): CroquisBodyType {
  if (tuoi === "tre_em") return "child";
  if (tuoi === "nguoi_cao_tuoi") return "elderly";
  return "adult";
}

export interface BodyZoneConfig {
  bodyType: CroquisBodyType;
  isMale: boolean;
  kVocDang: number;
  bodyTransform?: string;
  headTransform?: string;
  hairTransform?: string;
  accessoriesTransform?: string;
  headwearTransform?: string;
  hairHex: string;
  skinHex: string;
  fitResult: ClothingDynamicFitResult;
  baseMannequinTransform: string;
}

/**
 * Tính toán các ma trận biến đổi tọa độ và liên kết không gian đồng bộ cho từng nhóm đối tượng
 * Chuẩn hóa tỷ lệ:
 * - 'adult': Người lớn tỷ lệ chuẩn thời trang 9 đầu
 * - 'child': Trẻ em tỷ lệ nhỏ nhắn (5.5 - 6 đầu), đầu to hơn so với thân, yếm/áo/quần thu nhỏ đồng bộ
 * - 'elderly': Người cao tuổi dáng ung dung phúc hậu, tóc hoa râm, phục sức trang nhã
 */
export function calculateBodyZoneConfig(
  nhanVat: NhanVatConfig,
  _huongNhin: HuongNhin = "truoc"
): BodyZoneConfig {
  const bodyType = toCroquisBodyType(nhanVat.tuoi);
  const isMale = nhanVat.gioi === "nam";

  // 1. Tông da từ bảng màu
  const skinInfo = BANG_MAU_DA[nhanVat.tongDa] || BANG_MAU_DA[2];
  const skinHex = skinInfo.nen;

  // 2. Màu tóc tự nhiên hoặc hoa râm theo độ tuổi
  const hairHex =
    nhanVat.toc === "bac_bui" || bodyType === "elderly"
      ? "#a8a4a1"
      : "#2b2420";

  // 3. Động cơ tính toán kiểm tra thể trạng & tỷ lệ co giãn động
  const fitResult = validateClothingDynamicFit(bodyType, isMale, nhanVat.vocDang);
  const kVocDang = fitResult.kVocDang;

  const neckBaseY = fitResult.neckPivotY;
  const headBaseY = fitResult.headPivotY;
  const maleHeadOffsetY = fitResult.maleHeadOffsetY;

  let bodyTransform: string | undefined;
  let headTransform: string | undefined;
  let hairTransform: string | undefined;
  let accessoriesTransform: string | undefined;
  let headwearTransform: string | undefined;

  switch (bodyType) {
    case "child": {
      // Trẻ em: dáng nhỏ nhắn, tỷ lệ thân 0.82 x 0.84 từ gốc chân cổ
      const kChildX = fitResult.scaleX;
      const kChildY = fitResult.scaleY;
      const kChildHead = 0.92;
      bodyTransform = `translate(200, ${neckBaseY}) scale(${kChildX}, ${kChildY}) translate(-200, -${neckBaseY})`;
      
      // Đầu trẻ em: tỷ lệ 0.92, đồng bộ hoàn hảo cùng tóc và nón/khăn
      headTransform = `translate(200, ${headBaseY}) scale(${kChildHead}, ${kChildHead}) translate(-200, -${headBaseY})`;
      hairTransform = isMale
        ? `translate(200, ${headBaseY}) scale(${kChildHead}, ${kChildHead}) translate(-200, -${headBaseY}) translate(0, ${maleHeadOffsetY})`
        : `translate(200, ${headBaseY}) scale(${kChildHead}, ${kChildHead}) translate(-200, -${headBaseY})`;
      headwearTransform = isMale
        ? `translate(200, ${headBaseY}) scale(${kChildHead}, ${kChildHead}) translate(-200, -${headBaseY}) translate(0, ${maleHeadOffsetY})`
        : `translate(200, ${headBaseY}) scale(${kChildHead}, ${kChildHead}) translate(-200, -${headBaseY})`;
      accessoriesTransform = fitResult.accessoriesTransform || undefined;
      break;
    }

    case "elderly": {
      // Người cao tuổi: dáng ung dung, vai chùng nhẹ 2.5px
      const kElderlyY = fitResult.scaleY;
      const kElderlyX = fitResult.scaleX;
      bodyTransform = `translate(200, ${neckBaseY}) scale(${kElderlyX}, ${kElderlyY}) translate(-200, -${neckBaseY}) translate(0, ${fitResult.bodyOffsetY})`;
      
      headTransform = `translate(0, ${fitResult.bodyOffsetY})`;
      hairTransform = isMale
        ? `translate(0, ${maleHeadOffsetY + fitResult.bodyOffsetY})`
        : `translate(0, ${fitResult.bodyOffsetY})`;
      headwearTransform = isMale
        ? `translate(0, ${maleHeadOffsetY + fitResult.bodyOffsetY})`
        : `translate(0, ${fitResult.bodyOffsetY})`;
      accessoriesTransform = fitResult.accessoriesTransform || undefined;
      break;
    }

    case "adult":
    default: {
      // Người lớn: tỷ lệ chuẩn thời trang 9 đầu
      bodyTransform = kVocDang !== 1.0
        ? `translate(200, 0) scale(${kVocDang}, 1) translate(-200, 0)`
        : undefined;

      headTransform = undefined;
      hairTransform = isMale ? `translate(0, ${maleHeadOffsetY})` : undefined;
      headwearTransform = isMale ? `translate(0, ${maleHeadOffsetY})` : undefined;
      accessoriesTransform = undefined;
      break;
    }
  }

  // Hệ số transform nội bộ trang phục đồng bộ chính xác với <g class="body"> của SVG gốc:
  // - Nữ (chuan_mau.svg): scale(1, 0.9200) quanh Y=130
  // - Nam (chang_trai.svg): translate(0, -36.76) và scale(1, 0.9752) quanh Y=130
  // Toàn bộ tỷ lệ co giãn thể trạng (kVocDang, child, elderly) đã được áp dụng thống nhất ở bodyTransform cha
  const internalScaleY = isMale ? 0.9752 : 0.9200;

  return {
    bodyType,
    isMale,
    kVocDang,
    bodyTransform,
    headTransform,
    hairTransform,
    accessoriesTransform,
    headwearTransform,
    hairHex,
    skinHex,
    fitResult,
    baseMannequinTransform: isMale
      ? `translate(0, ${maleHeadOffsetY}) translate(200, 130) scale(1, ${internalScaleY}) translate(-200, -130)`
      : `translate(200, 130) scale(1, ${internalScaleY}) translate(-200, -130)`,
  };
}

export interface CentralizedBodyLayerSystemProps {
  nhanVat: NhanVatConfig;
  huongNhin?: HuongNhin;
  bodyHtmlContent?: string;
  headHtmlContent?: string;
  mannequinHtmlContent?: string;
  childrenVayQuan?: React.ReactNode;
  childrenAo?: React.ReactNode;
  childrenPhuKienThan?: React.ReactNode;
  childrenTocTruocKhanNon?: React.ReactNode;
}

/**
 * COMPONENT TỔ CHỨC CÁC LỚP HÌNH THỂ THEO CHUẨN Z-INDEX TẬP TRUNG
 * Tách biệt hoàn toàn:
 * - Khối Đầu (Head Zone: Tóc sau, Đầu & Mặt croquis, Tóc trước, Nón lá/Khăn)
 * - Khối Thân & Trang phục (Body Zone: Thân vector, Váy/Quần, Áo/Sơ mi/Yếm, Phụ kiện thân)
 * Đảm bảo 100% khớp nối không bao giờ bị lệch vóc dáng hay hở cổ tay.
 */
export function CentralizedBodyLayerSystem({
  nhanVat,
  huongNhin = "truoc",
  bodyHtmlContent,
  headHtmlContent,
  mannequinHtmlContent,
  childrenVayQuan,
  childrenAo,
  childrenPhuKienThan,
  childrenTocTruocKhanNon,
}: CentralizedBodyLayerSystemProps) {
  const zoneConfig = useMemo(
    () => calculateBodyZoneConfig(nhanVat, huongNhin),
    [nhanVat, huongNhin]
  );

  const effectiveBodyHtml = bodyHtmlContent || mannequinHtmlContent || "";
  const effectiveHeadHtml = headHtmlContent || "";

  return (
    <g
      id="centralized-croquis-body-system"
      className={`croquis-body-system body-type-${zoneConfig.bodyType}`}
      style={
        {
          "--skin": zoneConfig.skinHex,
          "--hair": zoneConfig.hairHex,
        } as React.CSSProperties
      }
    >
      {/* ============================================================== */}
      {/* TẦNG 1: LỚP TÓC SAU LƯNG (Dành cho tóc dài buông xõa)           */}
      {/* Gắn liền với hệ tọa độ Đầu                                      */}
      {/* ============================================================== */}
      <g
        id="layer-1-behind-hair"
        transform={zoneConfig.hairTransform}
        className="z-layer-behind-hair"
      >
        <g transform="translate(200, 0)">
          <CroquisBehindHair
            styleId={nhanVat.toc}
            hairColor={zoneConfig.hairHex}
            isMale={zoneConfig.isMale}
            bodyType={zoneConfig.bodyType}
          />
        </g>
      </g>

      {/* ============================================================== */}
      {/* TẦNG 2 - 5: KHUNG THÂN MÌNH & TOÀN BỘ TRANG PHỤC CO GIÃN ĐỒNG BỘ */}
      {/* Toàn bộ hình thể thân + trang phục nằm chung ma trận bodyTransform */}
      {/* đảm bảo ôm khít 100% không bao giờ trượt lệch hay hở rời rạc   */}
      {/* ============================================================== */}
      <g
        id={`layer-body-and-wardrobe-${huongNhin}`}
        transform={zoneConfig.bodyTransform}
        className={`z-layer-body-wardrobe body-${zoneConfig.bodyType}`}
      >
        {/* TẦNG 2: Khung ma-nơ-canh thân mình vector croquis nguyên bản */}
        <g
          id={`croquis-model-body-${huongNhin}`}
          className="layer-model-body"
          transform="translate(200, 0)"
          dangerouslySetInnerHTML={{ __html: effectiveBodyHtml }}
        />

        {/* CONTAINER TRANG PHỤC VÀ PHỤ KIỆN ĐỒNG BỘ 100% VỚI KHUNG MA-NƠ-CANH GỐC */}
        <g
          id={`croquis-wardrobe-aligned-${huongNhin}`}
          transform={zoneConfig.baseMannequinTransform}
          className="layer-wardrobe-aligned transition-all duration-300"
        >
          {/* TẦNG 3: Trang phục thân dưới (Váy đụp / Quần lụa / Giày guốc) */}
          {childrenVayQuan && (
            <g id="layer-3-vay-quan" className="layer-vay-quan transition-all duration-300">
              {childrenVayQuan}
            </g>
          )}

          {/* TẦNG 4: Trang phục thân trên (Áo dài / Áo bà ba / Yếm đào / Ngũ thân) */}
          {childrenAo && (
            <g id="layer-4-ao" className="layer-ao transition-all duration-300">
              {childrenAo}
            </g>
          )}

          {/* TẦNG 5: Phụ kiện thân mình (Kiềng bạc, thắt lưng, túi gấm) */}
          {childrenPhuKienThan && (
            <g
              id="layer-5-phu-kien-than"
              transform={zoneConfig.accessoriesTransform}
              className="layer-phu-kien-than transition-all duration-300"
            >
              {childrenPhuKienThan}
            </g>
          )}
        </g>
      </g>

      {/* ============================================================== */}
      {/* TẦNG 6: KHUNG ĐẦU VÀ KHUÔN MẶT MA-NƠ-CANH CROQUIS GỐC          */}
      {/* Gắn liền với hệ tọa độ Đầu                                      */}
      {/* ============================================================== */}
      {effectiveHeadHtml && (
        <g
          id={`croquis-model-head-${huongNhin}`}
          transform={zoneConfig.headTransform}
          className="layer-model-head"
        >
          <g
            transform="translate(200, 0)"
            dangerouslySetInnerHTML={{ __html: effectiveHeadHtml }}
          />
        </g>
      )}

      {/* ============================================================== */}
      {/* TẦNG 7: LỚP TÓC PHÍA TRƯỚC (Búi tóc, mái, rẽ ngôi, tóc tân thời) */}
      {/* Gắn liền với hệ tọa độ Đầu                                      */}
      {/* ============================================================== */}
      <g
        id="layer-7-front-hair"
        transform={zoneConfig.hairTransform}
        className="z-layer-front-hair"
      >
        <g transform="translate(200, 0)">
          <CroquisHairRenderer
            styleId={nhanVat.toc}
            view={huongNhin}
            hairColor={zoneConfig.hairHex}
            isMale={zoneConfig.isMale}
            bodyType={zoneConfig.bodyType}
          />
        </g>
      </g>

      {/* ============================================================== */}
      {/* TẦNG 8: PHỤ KIỆN ĐỘI ĐẦU (Nón lá, khăn đóng, khăn mỏ quạ)     */}
      {/* Gắn liền với hệ tọa độ Đầu                                      */}
      {/* ============================================================== */}
      {childrenTocTruocKhanNon && huongNhin === "truoc" && (
        <g
          id="layer-8-headwear"
          transform={zoneConfig.headwearTransform}
          className="layer-headwear transition-all duration-300"
        >
          {childrenTocTruocKhanNon}
        </g>
      )}
    </g>
  );
}
