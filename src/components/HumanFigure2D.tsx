/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * COMPONENT: NHÂN VẬT NGƯỜI 2D MINH HỌA TRUYỀN THỐNG ĐỒNG NHẤT (HUMAN FIGURE 2D)
 * - Tinh chỉnh tỷ lệ cơ thể: phần thân trên cân đối hoàn hảo với hông (Tỷ lệ đồng hồ cát thời trang 1:1).
 * - Các đường nét nối liền mạch giữa vai và cánh tay cũng như đùi và bắp chân bo tròn êm dịu, không bị nhọn.
 * - Bàn chân nối liền cẳng chân 100%, không bị vết cắt ngang mắt cá.
 * - Giữ nguyên phong cách tối giản thanh lịch không chi tiết khuôn mặt.
 */

import React from "react";
import {
  NhanVatConfig,
  HuongNhin,
  Gioi,
  Tuoi,
  VocDang,
  TongDa,
  CharacterScalePreset,
} from "../characters/types";
import { layThongSoViewport } from "../characters/dimensions/viewports";
import FashionMannequin from "../characters/croquis/FashionMannequin";

export interface HumanFigure2DProps {
  /** Cấu hình nhân vật tổng thể (nếu truyền vào sẽ ưu tiên) */
  nhanVat?: Partial<NhanVatConfig>;

  /** Giới tính: 'nu' (Nữ - Mặc định) hoặc 'nam' (Nam) */
  gioi?: Gioi;

  /** Độ tuổi: 'nguoi_lon' (Mặc định), 'tre_em', 'nguoi_cao_tuoi' */
  tuoi?: Tuoi;

  /** Vóc dáng: 'dong_ho_cat' | 'chu_nhat' | 'qua_le' | 'tam_giac_nguoc' | 'qua_tao' */
  vocDang?: VocDang;

  /** Tông da: 1 đến 6 (1: Trắng sứ, 2: Bạch ngọc, 3: Bánh mật, 4: Ngăm khỏe, 5: Nâu đồng, 6: Đậm) */
  tongDa?: TongDa;

  /** Kiểu tóc: 'bui_thap' | 'dai_xoa' | 'bui_cao' | 'ngan' */
  toc?: string;

  /** Hướng nhìn: 'truoc' (Mặt trước), 'sau' (Mặt sau), 'ca_hai' (Xem cả 2 mặt song song) */
  huongNhin?: HuongNhin | "ca_hai";

  /** Bật/tắt trang phục nội y nền */
  hienDoLot?: boolean;

  /** Bật/tắt lưới gióng tỷ lệ giải phẫu */
  hienThuocDo?: boolean;

  /** Kích thước hiển thị preset: 'xs' | 'sm' | 'md' | 'lg' | 'xl' */
  scalePreset?: CharacterScalePreset;

  /** Chiều rộng tùy chỉnh (px) */
  width?: number;

  /** Chiều cao tùy chỉnh (px) */
  height?: number;

  /** Class CSS bổ sung */
  className?: string;

  /** Các layer trang phục cắm vào theo kiến trúc mở (Slots) */
  childrenAo?: React.ReactNode;
  childrenVayQuan?: React.ReactNode;
  childrenPhuKien?: React.ReactNode;
  childrenNonKhan?: React.ReactNode;
}

export function HumanFigure2D({
  nhanVat,
  gioi = "nu",
  tuoi = "nguoi_lon",
  vocDang = "dong_ho_cat",
  tongDa = 2,
  toc = "bui_thap",
  huongNhin = "truoc",
  hienDoLot = true,
  hienThuocDo = false,
  scalePreset = "lg",
  width,
  height,
  className = "",
  childrenAo,
  childrenVayQuan,
  childrenPhuKien,
  childrenNonKhan,
}: HumanFigure2DProps) {
  // Hợp nhất cấu hình nhân vật
  const finalConfig: NhanVatConfig = {
    gioi: nhanVat?.gioi ?? gioi,
    tuoi: nhanVat?.tuoi ?? tuoi,
    vocDang: nhanVat?.vocDang ?? vocDang,
    tongDa: nhanVat?.tongDa ?? tongDa,
    toc: nhanVat?.toc ?? toc,
    huongNhin: (nhanVat?.huongNhin === "sau" ? "sau" : "truoc"),
  };

  const viewport = layThongSoViewport(scalePreset, width);

  // Kịch bản 1: Xem cả hai mặt trước và sau song song (Dual View)
  if (huongNhin === "ca_hai") {
    return (
      <div
        className={`human-figure-2d-dual flex items-center justify-center gap-4 sm:gap-8 w-full ${className}`}
        style={{ width: width ? `${width}px` : "100%", height: height ? `${height}px` : "auto" }}
      >
        {/* Hình Mặt Trước */}
        <div className="flex flex-col items-center flex-1 max-w-[280px]">
          <span className="text-xs font-bold text-amber-950 dark:text-amber-100 mb-1.5 bg-amber-100/90 dark:bg-slate-800 px-3 py-0.5 rounded-full border border-amber-300/60 shadow-xs">
            Mặt Trước
          </span>
          <svg
            viewBox={viewport.viewBox}
            width={width ? width / 2 : undefined}
            height={height}
            preserveAspectRatio="xMidYMid meet"
            className="w-full h-auto max-h-[560px] drop-shadow-[0_12px_24px_rgba(30,41,59,0.18)] transition-all duration-300"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Hình nhân vật 2D mặt trước tối giản thanh lịch"
          >
            <FashionMannequin
              nhanVat={{ ...finalConfig, huongNhin: "truoc" }}
              huongNhin="truoc"
              hienDoLot={hienDoLot}
              childrenVayQuan={childrenVayQuan}
              childrenAo={childrenAo}
              childrenPhuKienThan={childrenPhuKien}
              childrenTocTruocKhanNon={childrenNonKhan}
            />
          </svg>
        </div>

        {/* Hình Mặt Sau */}
        <div className="flex flex-col items-center flex-1 max-w-[280px]">
          <span className="text-xs font-bold text-amber-950 dark:text-amber-100 mb-1.5 bg-amber-100/90 dark:bg-slate-800 px-3 py-0.5 rounded-full border border-amber-300/60 shadow-xs">
            Mặt Sau
          </span>
          <svg
            viewBox={viewport.viewBox}
            width={width ? width / 2 : undefined}
            height={height}
            preserveAspectRatio="xMidYMid meet"
            className="w-full h-auto max-h-[560px] drop-shadow-[0_12px_24px_rgba(30,41,59,0.18)] transition-all duration-300"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Hình nhân vật 2D mặt sau tóc đen thanh lịch"
          >
            <FashionMannequin
              nhanVat={{ ...finalConfig, huongNhin: "sau" }}
              huongNhin="sau"
              hienDoLot={hienDoLot}
              childrenVayQuan={childrenVayQuan}
              childrenAo={childrenAo}
              childrenPhuKienThan={childrenPhuKien}
            />
          </svg>
        </div>
      </div>
    );
  }

  // Kịch bản 2: Hiển thị đơn lẻ (Mặt trước hoặc Mặt sau)
  const facingDirection: HuongNhin = huongNhin === "sau" ? "sau" : "truoc";

  return (
    <div
      className={`human-figure-2d-container flex items-center justify-center ${className}`}
      style={{ width: width ? `${width}px` : "auto", height: height ? `${height}px` : "auto" }}
    >
      <svg
        viewBox={viewport.viewBox}
        width={width}
        height={height}
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-full max-h-[620px] drop-shadow-[0_12px_24px_rgba(30,41,59,0.18)] transition-all duration-300"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={`Hình nhân vật người 2D ${facingDirection === "truoc" ? "mặt trước" : "mặt sau"} tối giản thanh lịch`}
      >
        <FashionMannequin
          nhanVat={{ ...finalConfig, huongNhin: facingDirection }}
          huongNhin={facingDirection}
          hienDoLot={hienDoLot}
          childrenVayQuan={childrenVayQuan}
          childrenAo={childrenAo}
          childrenPhuKienThan={childrenPhuKien}
          childrenTocTruocKhanNon={facingDirection === "truoc" ? childrenNonKhan : undefined}
        />
      </svg>
    </div>
  );
}

export default HumanFigure2D;
