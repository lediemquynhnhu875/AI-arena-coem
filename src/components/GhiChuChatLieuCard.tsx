/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Vai } from "../types";
import { vai as allVaiList } from "../data/vai";
import { nguon } from "../data/nguon";
import { openGiuChuanVanHoa } from "../lib/giuChuan";
import { taoGhiChuChoVai, GHI_CHU_CHAT_LIEU_FALLBACK } from "../lib/ghiChuChatLieu";

interface Props {
  vai: Vai;
  onSelectVai?: (selected: Vai) => void;
  className?: string;
}

export default function GhiChuChatLieuCard({ vai, onSelectVai, className = "" }: Props) {
  const [ghiChuText, setGhiChuText] = useState<string>(() => {
    return vai.suThat.join(" ");
  });
  const [isAiGenerated, setIsAiGenerated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    let isCancelled = false;

    // Khởi tạo ngay bằng bản fallback = suThat nối lại
    setGhiChuText(vai.suThat.join(" "));
    setIsLoading(true);

    taoGhiChuChoVai(vai).then((res) => {
      if (!isCancelled) {
        setGhiChuText(res.text);
        setIsAiGenerated(res.tuAi);
        setIsLoading(false);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [vai.id]);

  // Lấy thông tin nguồn
  const nguonItems = vai.nguonIds.map((id) => {
    const item = nguon.find((n) => n.id === id);
    return item ? { id, ten: item.ten } : { id, ten: id };
  });

  return (
    <aside
      className={`vpr-ghi-chu-chat-lieu border p-4 shadow-lg transition-all ${className}`}
      style={{
        background: "linear-gradient(135deg, rgba(30, 41, 44, 0.95) 0%, rgba(17, 26, 28, 0.98) 100%)",
        borderColor: "rgba(217, 164, 65, 0.45)",
        borderRadius: "var(--vien-lech-a)",
        boxShadow: "0 6px 20px rgba(0,0,0,0.35)",
      }}
      aria-label="Ghi chú bên lề về chất liệu"
    >
      {/* TIÊU ĐỀ KHỐI GHI CHÚ */}
      <div className="flex items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-stone-700/60">
        <div className="flex items-center gap-2">
          <span className="text-base" aria-hidden="true">
            🧵
          </span>
          <div>
            <h3
              className="text-xs uppercase tracking-wider font-bold"
              style={{ color: "var(--vang-nghe)", fontFamily: "var(--font-tieu-de)" }}
            >
              Ghi chú bên lề · Chất liệu & Làng nghề
            </h3>
            <span className="text-[11px] text-stone-400">
              Chuyện kể về bàn tay thợ dệt và nguồn gốc sợi vải
            </span>
          </div>
        </div>

        {/* Trạng thái AI hoặc Fallback */}
        <span
          className="text-[10px] px-2 py-0.5 border rounded-full text-stone-300"
          style={{ borderColor: "rgba(217, 164, 65, 0.3)", background: "rgba(0,0,0,0.2)" }}
          title={isAiGenerated ? "Đoạn văn được viết lại bởi Gemini" : "Dữ liệu kiểm chứng chuẩn xác"}
        >
          {isLoading ? "Cò Em đang lật tìm câu chuyện..." : isAiGenerated ? "✨ Lời Cò Em" : "📖 Sử liệu chuẩn"}
        </span>
      </div>

      {/* THANH CHỌN NHANH 5 VẢI ĐỂ XEM ĐỦ CẢ 5 CHẤT LIỆU */}
      <div className="flex flex-wrap gap-1.5 mb-3" role="tablist" aria-label="5 chất liệu truyền thống">
        {allVaiList.map((v) => {
          const isCurrent = v.id === vai.id;
          return (
            <button
              key={v.id}
              type="button"
              onClick={() => onSelectVai && onSelectVai(v)}
              className={`px-2 py-0.5 text-[11px] border transition-all cursor-pointer ${
                isCurrent
                  ? "border-amber-400 bg-amber-400/20 text-amber-200 font-semibold"
                  : "border-stone-700 text-stone-400 hover:text-stone-200 hover:border-stone-500 bg-stone-800/40"
              }`}
              style={{ borderRadius: "var(--vien-lech-b)" }}
            >
              {v.ten}
            </button>
          );
        })}
      </div>

      {/* TÊN VẢI VÀ THÔNG TIN KỸ THUẬT / LÀNG NGHỀ */}
      <div className="mb-2">
        <div className="flex items-baseline gap-2 flex-wrap">
          <h4 className="text-sm font-bold text-stone-100">{vai.ten}</h4>
          <span className="text-xs text-amber-300/90 font-medium">
            📍 {vai.langNghe}
          </span>
          <span className="text-xs text-stone-400">
            · 🪡 {vai.kyThuat}
          </span>
        </div>
      </div>

      {/* ĐOẠN KỂ 2-3 CÂU CÓ CẢM XÚC */}
      <div
        className="relative pl-3 my-2 text-xs sm:text-[13px] leading-relaxed text-stone-200 italic border-l-2"
        style={{ borderColor: "var(--vang-nghe)" }}
      >
        <p className="min-h-[2.8rem]">
          &ldquo;{ghiChuText}&rdquo;
        </p>
      </div>

      {/* CHIP NGUỒN (kèm chip nguồn, bấm vào để mở kiểm chứng) */}
      <div className="mt-3 pt-2 border-t border-stone-800 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-stone-400">Nguồn:</span>
          {nguonItems.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => openGiuChuanVanHoa(`Chất liệu: ${vai.ten}`)}
              className="text-[10px] px-2 py-0.5 border border-stone-600 hover:border-amber-400 text-stone-300 hover:text-amber-200 transition-colors cursor-pointer flex items-center gap-1"
              style={{ borderRadius: "var(--vien-lech-b)", background: "rgba(24, 37, 40, 0.6)" }}
              title="Bấm để xem tư liệu giữ chuẩn văn hóa"
            >
              <span>🏛️</span>
              <span>{n.ten}</span>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => openGiuChuanVanHoa(`Chất liệu: ${vai.ten}`)}
          className="text-[11px] text-amber-400/90 hover:text-amber-300 hover:underline cursor-pointer ml-auto"
        >
          Giữ chuẩn văn hóa →
        </button>
      </div>
    </aside>
  );
}
