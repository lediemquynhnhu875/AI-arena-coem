/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * BẢNG ĐIỀU KHIỂN & DUYỆT TÀI NGUYÊN (RESOURCE GALLERY MODAL)
 * Cho phép người dùng và lập trình viên xem trực quan, sao chép mã màu,
 * kiểm tra phông chữ, hoa văn di sản và cấu hình tài nguyên của ứng dụng.
 */

import React, { useState } from "react";
import {
  HERITAGE_COLORS,
  THEME_COLOR_TOKENS,
  FONT_FAMILIES,
  FONT_SIZES,
  PATTERNS,
  MASCOT_PRESETS,
  SOUND_CATALOG,
} from "../resources";

interface Props {
  onClose: () => void;
}

type TabType = "colors" | "typography" | "patterns" | "mascot" | "audio";

export default function ResourceGalleryModal({ onClose }: Props) {
  const [activeTab, setActiveTab] = useState<TabType>("colors");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    try {
      navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label="Kho tài nguyên thiết kế di sản"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden bg-[var(--nen-the)] text-[var(--chu-chinh)] border-[var(--vien-the)]"
        style={{ borderRadius: "var(--vien-lech-a)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER MODAL */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[var(--sidebar-border)] bg-[var(--nen-sidebar)]">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl" aria-hidden="true">🏮</span>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[var(--chu-chinh)]" style={{ fontFamily: "var(--font-than)" }}>
                Kho Tài Nguyên & Hệ Thống Thiết Kế
              </h2>
              <p className="text-xs text-[var(--chu-mo)]">
                Bảng màu Cổ Phong, Phông chữ, Hoa văn & Cấu hình Cò Em
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold bg-[var(--nen-the-phu)] hover:bg-rose-100 hover:text-rose-700 dark:hover:bg-rose-950 dark:hover:text-rose-300 text-[var(--chu-phu)] border border-[var(--vien-the)] transition-colors shadow-xs cursor-pointer"
            aria-label="Đóng"
          >
            <span>✕ Đóng</span>
          </button>
        </div>

        {/* THANH TAB ĐIỀU HƯỚNG */}
        <div className="flex items-center gap-1.5 p-2 px-4 border-b border-[var(--sidebar-border)] overflow-x-auto text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab("colors")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === "colors"
                ? "bg-[var(--vang-nghe)] text-[#141F22] font-bold shadow-sm"
                : "text-[var(--chu-mo)] hover:bg-[var(--nen-the-phu)]"
            }`}
          >
            🎨 Bảng Màu Di Sản
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("typography")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === "typography"
                ? "bg-[var(--vang-nghe)] text-[#141F22] font-bold shadow-sm"
                : "text-[var(--chu-mo)] hover:bg-[var(--nen-the-phu)]"
            }`}
          >
            ✍️ Phông Chữ & Cỡ Chữ
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("patterns")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === "patterns"
                ? "bg-[var(--vang-nghe)] text-[#141F22] font-bold shadow-sm"
                : "text-[var(--chu-mo)] hover:bg-[var(--nen-the-phu)]"
            }`}
          >
            🌀 Hoa Văn Truyền Thống
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("mascot")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === "mascot"
                ? "bg-[var(--vang-nghe)] text-[#141F22] font-bold shadow-sm"
                : "text-[var(--chu-mo)] hover:bg-[var(--nen-the-phu)]"
            }`}
          >
            ✨ Linh Vật Cò Em
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("audio")}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === "audio"
                ? "bg-[var(--vang-nghe)] text-[#141F22] font-bold shadow-sm"
                : "text-[var(--chu-mo)] hover:bg-[var(--nen-the-phu)]"
            }`}
          >
            🔊 Âm Thanh Di Sản
          </button>
        </div>

        {/* NỘI DUNG TỪNG TAB */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* TAB 1: BẢNG MÀU */}
          {activeTab === "colors" && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--vang-nghe)]">
                    1. Hệ Màu Di Sản Cốt Lõi (Core Heritage Colors)
                  </h3>
                  <span className="text-[11px] text-[var(--chu-mo)]">
                    Bấm vào thẻ màu để chép mã HEX
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {Object.values(HERITAGE_COLORS).map((c) => (
                    <div
                      key={c.name}
                      onClick={() => handleCopy(c.hex)}
                      className="group p-3 rounded-xl border border-[var(--vien-the)] bg-[var(--nen-the-phu)] hover:border-[var(--vang-nghe)] cursor-pointer transition-all hover:scale-[1.01]"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-lg shadow-inner border border-black/10 flex-shrink-0 flex items-center justify-center text-white text-[10px] font-bold"
                          style={{ backgroundColor: c.hex }}
                        >
                          {copiedCode === c.hex ? "✓ Đã chép" : ""}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-bold text-[var(--chu-chinh)] truncate">
                            {c.vietnameseName}
                          </div>
                          <div className="font-mono text-[11px] text-[var(--vang-nghe)] font-semibold">
                            {c.hex}
                          </div>
                          <div className="text-[10px] text-[var(--chu-mo)] truncate">
                            {c.culturalOrigin}
                          </div>
                        </div>
                      </div>
                      <p className="mt-2 text-[11px] text-[var(--chu-mo)] line-clamp-2 italic leading-relaxed">
                        {c.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* TOKENS THEO CHỦ ĐỀ SÁNG / TỐI */}
              <div className="pt-4 border-t border-[var(--vien-the)]">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--vang-nghe)] mb-3">
                  2. Cấu Trúc Tokens Giao Diện Sáng & Tối
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* BẢNG SÁNG */}
                  <div className="p-4 rounded-xl border border-[var(--vien-the)] bg-white text-stone-900 shadow-sm">
                    <div className="flex items-center justify-between pb-2 border-b border-stone-200 mb-3">
                      <span className="text-xs font-bold">☀️ Chế Độ Sáng (Bạch Nhật)</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold">
                        Mặc định
                      </span>
                    </div>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-stone-600">Nền Canvas:</span>
                        <code className="font-bold text-stone-900">{THEME_COLOR_TOKENS.light.canvas}</code>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-600">Thẻ Card:</span>
                        <code className="font-bold text-stone-900">{THEME_COLOR_TOKENS.light.card}</code>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-600">Chữ chính (Than Mộc):</span>
                        <code className="font-bold text-stone-900">{THEME_COLOR_TOKENS.light.textPrimary}</code>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-600">Điểm nhấn Vàng nghệ:</span>
                        <code className="font-bold text-amber-700">{THEME_COLOR_TOKENS.light.accentGold}</code>
                      </div>
                    </div>
                  </div>

                  {/* BẢNG TỐI */}
                  <div className="p-4 rounded-xl border border-stone-700 bg-stone-900 text-stone-100 shadow-sm">
                    <div className="flex items-center justify-between pb-2 border-b border-stone-800 mb-3">
                      <span className="text-xs font-bold">🌙 Chế Độ Tối (Huyền Dạ)</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-stone-800 text-amber-400 font-bold">
                        Đêm Cổ Phong
                      </span>
                    </div>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-stone-400">Nền Canvas:</span>
                        <code className="font-bold text-stone-100">{THEME_COLOR_TOKENS.dark.canvas}</code>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-400">Thẻ Card:</span>
                        <code className="font-bold text-stone-100">{THEME_COLOR_TOKENS.dark.card}</code>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-400">Chữ sáng ngà:</span>
                        <code className="font-bold text-amber-200">{THEME_COLOR_TOKENS.dark.textPrimary}</code>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-400">Điểm nhấn Vàng trăng:</span>
                        <code className="font-bold text-amber-400">{THEME_COLOR_TOKENS.dark.accentGold}</code>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TYPOGRAPHY */}
          {activeTab === "typography" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--vang-nghe)] mb-3">
                  1. Hai Phông Chữ Chuẩn Quốc Gia
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-[var(--vien-the)] bg-[var(--nen-the-phu)]">
                    <div className="text-xs font-semibold text-[var(--vang-nghe)] uppercase tracking-wider mb-1">
                      Phông Tiêu Đề & Lời Thơ
                    </div>
                    <div className="text-2xl font-bold mb-2" style={{ fontFamily: FONT_FAMILIES.heading }}>
                      Noto Serif
                    </div>
                    <p className="text-xs text-[var(--chu-mo)] italic leading-relaxed" style={{ fontFamily: FONT_FAMILIES.heading }}>
                      &ldquo;Gùi trên vai một ánh lửa rừng nhỏ, mang theo sắc áo của các dân tộc anh em.&rdquo;
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-[var(--vien-the)] bg-[var(--nen-the-phu)]">
                    <div className="text-xs font-semibold text-[var(--vang-nghe)] uppercase tracking-wider mb-1">
                      Phông Nội Dung & Giao Diện
                    </div>
                    <div className="text-2xl font-bold mb-2" style={{ fontFamily: FONT_FAMILIES.body }}>
                      Be Vietnam Pro
                    </div>
                    <p className="text-xs text-[var(--chu-mo)] leading-relaxed" style={{ fontFamily: FONT_FAMILIES.body }}>
                      Được thiết kế tối ưu hóa đặc biệt cho bảng dấu thanh điệu tiếng Việt, đảm bảo không bị lỗi dấu ở mọi kích thước.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--vien-the)]">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--vang-nghe)] mb-3">
                  2. Thang Cỡ Chữ Quy Chuẩn (Size Scale)
                </h3>
                <div className="space-y-2 border border-[var(--vien-the)] rounded-xl p-4 bg-[var(--nen-the-phu)]">
                  {Object.entries(FONT_SIZES).map(([key, val]) => (
                    <div key={key} className="flex items-center gap-4 py-1.5 border-b border-[var(--vien-the)] last:border-0">
                      <span className="font-mono text-xs w-16 text-[var(--vang-nghe)] font-bold">{key}</span>
                      <span className="font-mono text-[11px] text-[var(--chu-mo)] w-20">{val}</span>
                      <span className="truncate text-[var(--chu-chinh)]" style={{ fontSize: val }}>
                        Việt Nam Cổ Phục Di Sản
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PATTERNS */}
          {activeTab === "patterns" && (
            <div className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--vang-nghe)] mb-1">
                Hoa Văn Vector Truyền Thống
              </h3>
              <p className="text-xs text-[var(--chu-mo)]">
                Tất cả hoa văn được chuẩn hóa dưới dạng vector SVG với `currentColor`, tự động đổi màu theo chủ đề.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border border-[var(--vien-the)] bg-[var(--nen-the-phu)] flex flex-col items-center text-center">
                  <div
                    className="w-24 h-24 mb-3 text-[var(--vang-nghe)] flex items-center justify-center"
                    dangerouslySetInnerHTML={{ __html: PATTERNS.dongSonSun }}
                  />
                  <div className="text-xs font-bold">Mặt Trời Đông Sơn</div>
                  <div className="text-[11px] text-[var(--chu-mo)]">Họa tiết trống đồng cổ</div>
                </div>

                <div className="p-4 rounded-xl border border-[var(--vien-the)] bg-[var(--nen-the-phu)] flex flex-col items-center text-center">
                  <div
                    className="w-28 h-20 mb-3 text-[var(--dat-nung)] flex items-center justify-center"
                    dangerouslySetInnerHTML={{ __html: PATTERNS.thuyBaWave }}
                  />
                  <div className="text-xs font-bold">Sóng Nước Thủy Ba</div>
                  <div className="text-[11px] text-[var(--chu-mo)]">Điển tích sóng gợn hoàng bào</div>
                </div>

                <div className="p-4 rounded-xl border border-[var(--vien-the)] bg-[var(--nen-the-phu)] flex flex-col items-center text-center">
                  <div
                    className="w-24 h-20 mb-3 text-[var(--reu-phong)] flex items-center justify-center"
                    dangerouslySetInnerHTML={{ __html: PATTERNS.vanMayCloud }}
                  />
                  <div className="text-xs font-bold">Vân Mây Cuộn</div>
                  <div className="text-[11px] text-[var(--chu-mo)]">Mây lành chạm khắc triều Lê</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: MASCOT */}
          {activeTab === "mascot" && (
            <div className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--vang-nghe)] mb-2">
                Cấu Hình Nhân Vật Cò Em
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {Object.entries(MASCOT_PRESETS).map(([key, preset]) => (
                  <div key={key} className="p-4 rounded-xl border border-[var(--vien-the)] bg-[var(--nen-the-phu)] text-center">
                    <div className="text-xs font-bold uppercase text-[var(--vang-nghe)] mb-2">
                      {key}
                    </div>
                    <div className="text-2xl font-bold mb-1">{preset.size}px</div>
                    <div className="text-xs text-[var(--chu-mo)]">
                      Độ sáng: {preset.glowIntensity}
                    </div>
                    <div className="mt-2 text-[11px] px-2 py-1 rounded bg-[var(--nen-the)] border border-[var(--vien-the)]">
                      Màu đèn: {preset.lampColor}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: AUDIO */}
          {activeTab === "audio" && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--vang-nghe)] mb-1">
                Danh Mục Âm Thanh Di Sản & Thiên Nhiên
              </h3>
              <div className="space-y-2">
                {SOUND_CATALOG.map((cue) => (
                  <div
                    key={cue.id}
                    className="p-3 rounded-xl border border-[var(--vien-the)] bg-[var(--nen-the-phu)] flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold flex items-center gap-2">
                        <span>🎵 {cue.name}</span>
                        {cue.region && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--vang-nghe)]/15 text-[var(--vang-nghe)] uppercase font-semibold">
                            {cue.region}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[var(--chu-mo)] mt-0.5">
                        {cue.description}
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-[var(--chu-mo)]">
                      {cue.category}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="p-3.5 px-5 border-t border-[var(--sidebar-border)] bg-[var(--nen-sidebar)] flex items-center justify-between text-xs">
          <span className="text-[var(--chu-mo)]">
            Thư mục nguồn: <code>src/resources/</code>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[var(--vang-nghe)] text-[#141F22] font-semibold hover:opacity-90 transition-opacity"
          >
            Đóng bảng tài nguyên
          </button>
        </div>
      </div>
    </div>
  );
}
