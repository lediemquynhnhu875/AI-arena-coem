/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { StyleProfileInfo } from "../lib/styleProfile";
import { VungId } from "../data/vung";
import { Sparkles, ArrowRight } from "lucide-react";

interface Props {
  profile: StyleProfileInfo;
  onSelectVung?: (vungId: VungId) => void;
  onSelectCostume?: (trangPhucId: string) => void;
}

export default function StyleProfileCard({
  profile,
  onSelectVung,
  onSelectCostume,
}: Props) {
  // Yêu cầu 2: Nếu chưa đủ dữ liệu (dưới 3 bộ đã lưu), ẩn khối này thay vì hiện số liệu vô nghĩa
  if (!profile.hienThiKhoi) {
    return null;
  }

  return (
    <aside
      className="vpr-style-profile-card my-4 p-4 rounded-xl border transition-all"
      style={{
        background: "rgba(23, 35, 38, 0.94)",
        borderColor: "rgba(217, 164, 65, 0.45)",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(217, 164, 65, 0.15)",
      }}
      aria-label="Khối phong cách của bạn"
    >
      {/* Tiêu đề khối */}
      <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-md bg-amber-500/15 text-amber-300 flex items-center justify-center flex-shrink-0" aria-hidden="true">
            <Sparkles className="w-3.5 h-3.5" />
          </span>
          <h2
            className="text-xs uppercase tracking-wider font-bold text-amber-300 font-serif m-0"
            style={{ fontFamily: "var(--font-tieu-de)" }}
          >
            Phong cách của bạn
          </h2>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-200 border border-amber-500/30">
            Từ {profile.tongBoDaLuu} bộ đã lưu
          </span>
        </div>

        {profile.boDoLuuGanNhat && onSelectCostume && (
          <button
            type="button"
            onClick={() => onSelectCostume(profile.boDoLuuGanNhat!.id)}
            className="text-xs text-amber-300 hover:text-amber-200 underline cursor-pointer bg-transparent border-0 p-0"
          >
            Tiếp tục với {profile.boDoLuuGanNhat.ten} →
          </button>
        )}
      </div>

      {/* Các chỉ số phong cách suy ra từ hành vi */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-3">
        {/* 1. Tông màu hay chọn */}
        <div
          className="p-2.5 rounded-lg border text-xs"
          style={{
            background: "rgba(16, 25, 28, 0.7)",
            borderColor: "rgba(217, 164, 65, 0.25)",
          }}
        >
          <span className="text-stone-400 block mb-1 font-medium">
            🎨 Tông màu quen thuộc
          </span>
          <p className="text-stone-100 font-semibold m-0">
            {profile.tongMauHayChon || (profile.mauNhieuNhat ? `Sắc ${profile.mauNhieuNhat}` : "Đa dạng sắc màu")}
          </p>
        </div>

        {/* 2. Vùng quan tâm nhiều nhất */}
        <div
          className="p-2.5 rounded-lg border text-xs"
          style={{
            background: "rgba(16, 25, 28, 0.7)",
            borderColor: "rgba(217, 164, 65, 0.25)",
          }}
        >
          <span className="text-stone-400 block mb-1 font-medium">
            🏛️ Vùng gắn bó nhất
          </span>
          <p className="text-stone-100 font-semibold m-0">
            {profile.vungQuanTamNhat
              ? `${profile.vungQuanTamNhat.ten} (${profile.vungQuanTamNhat.soBo} bộ)`
              : "Khắp các vùng miền"}
          </p>
        </div>

        {/* 3. Tỉ lệ mucRemix */}
        <div
          className="p-2.5 rounded-lg border text-xs"
          style={{
            background: "rgba(16, 25, 28, 0.7)",
            borderColor: "rgba(217, 164, 65, 0.25)",
          }}
        >
          <span className="text-stone-400 block mb-1 font-medium">
            🌿 Xu hướng phối đồ
          </span>
          <p className="text-stone-100 font-semibold m-0">
            {profile.nhanRemix || "Hài hòa kim cổ"}
          </p>
        </div>
      </div>

      {/* Yêu cầu 3: Gợi ý "Bạn chưa thử vùng X" / "Bạn đã lưu N bộ ở vùng Y" so khớp đơn giản */}
      {profile.cauGoiYVung && (
        <div
          className="p-2.5 rounded-lg flex items-center justify-between gap-3 text-xs"
          style={{
            background: "rgba(217, 164, 65, 0.08)",
            border: "1px dashed rgba(217, 164, 65, 0.4)",
          }}
        >
          <div className="flex items-center gap-2">
            <span className="text-amber-300" aria-hidden="true">
              💡
            </span>
            <span className="text-amber-100/90 leading-relaxed">
              {profile.cauGoiYVung}
            </span>
          </div>

          {profile.vungChuaThu.length > 0 && onSelectVung && (
            <button
              type="button"
              onClick={() => onSelectVung(profile.vungChuaThu[0].id)}
              className="shrink-0 px-2.5 py-1 text-[11px] font-semibold rounded bg-amber-500/20 text-amber-200 hover:bg-amber-500/30 border border-amber-400/40 cursor-pointer transition-colors"
            >
              Xem {profile.vungChuaThu[0].ten}
            </button>
          )}
        </div>
      )}
    </aside>
  );
}
