/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * HỘP TRÒ CHUYỆN CỐ VẤN VĂN HÓA CÒ EM (NARRATOR CHAT)
 */

import React, { useState, useRef, useEffect } from "react";
import { coem } from "../../copy/coem";
import { hoiCoVanVanHoa } from "../../lib/gemini";
import { nguon } from "../../data/nguon";
import { trangPhuc } from "../../data/trangphuc";
import { openGiuChuanVanHoa } from "../../lib/giuChuan";
import CoMascot from "../mascot/CoMascot";

export interface ChatMessage {
  id: string;
  sender: "user" | "coem";
  text: string;
  nguonIds?: string[];
  isError?: boolean;
  thoiGian: number;
}

export interface CoEmChatProps {
  currentScreen?: string;
  selectedTrangPhucId?: string;
  mauId?: string;
  phuKienIds?: string[];
  isOpen?: boolean;
  onToggle?: () => void;
  hideTrigger?: boolean;
}

export type DomDomChatProps = CoEmChatProps;

export default function CoEmChat({
  selectedTrangPhucId,
  mauId,
  phuKienIds,
  isOpen: controlledIsOpen,
  onToggle: controlledOnToggle,
  hideTrigger = false,
}: CoEmChatProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const toggleOpen = controlledOnToggle || (() => setInternalIsOpen((prev) => !prev));
  const closeChat = () => {
    if (controlledOnToggle && controlledIsOpen) {
      controlledOnToggle();
    } else {
      setInternalIsOpen(false);
    }
  };

  const [inputVal, setInputVal] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: "welcome",
      sender: "coem",
      text: coem.chat.chaoDau,
      thoiGian: Date.now(),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Cuộn xuống tin nhắn mới nhất
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading, isOpen]);

  // Focus input khi mở chat
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen]);

  const tenTrangPhucHienTai = selectedTrangPhucId
    ? trangPhuc.find((t) => t.id === selectedTrangPhucId)?.ten
    : undefined;

  const handleSend = async (cauHoiGui?: string) => {
    const textToSend = (cauHoiGui ?? inputVal).trim();
    if (!textToSend || loading) return;

    setInputVal("");

    const userMsg: ChatMessage = {
      id: "u_" + Date.now(),
      sender: "user",
      text: textToSend,
      thoiGian: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await hoiCoVanVanHoa(textToSend, {
        trangPhucId: selectedTrangPhucId,
        mauId,
        phuKienIds,
      });

      const botMsg: ChatMessage = {
        id: "b_" + Date.now(),
        sender: "coem",
        text: res.cauTraLoi,
        nguonIds: res.nguonIds,
        isError: res.loi,
        thoiGian: Date.now(),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: "err_" + Date.now(),
          sender: "coem",
          text: coem.common.error,
          isError: true,
          thoiGian: Date.now(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const layTenNguon = (id: string) => {
    const found = nguon.find((n) => n.id === id);
    return found ? found.ten : id;
  };

  const handleBaoSai = (messageText: string) => {
    openGiuChuanVanHoa(`Cò Em Chat: "${messageText.slice(0, 80)}..."`);
  };

  return (
    <>
      {/* Nút chat nổi ở góc: Cò Em nhỏ đặc trưng (chỉ render khi không ẩn trigger) */}
      {!hideTrigger && (
        <button
          type="button"
          onClick={toggleOpen}
          className="fixed bottom-5 right-5 z-40 flex items-center justify-center transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none cursor-pointer group"
          aria-label={coem.chat.nutMoChat}
          title="Trò chuyện với Cố vấn Cò Em"
          style={{
            width: "56px",
            height: "56px",
          }}
        >
          {/* Vầng sáng vàng ấm lan tỏa */}
          <span
            className="absolute inset-0 rounded-full animate-ping opacity-35 pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(202, 138, 4, 0.6) 0%, rgba(234, 179, 8, 0.2) 70%, transparent 100%)",
              animationDuration: "3s",
            }}
          />

          {/* Nền tròn viền vàng di sản */}
          <div
            className="relative w-full h-full rounded-full flex items-center justify-center border shadow-lg overflow-hidden bg-white"
            style={{
              borderColor: "var(--vang-chinh)",
              boxShadow: "0 6px 20px rgba(26, 48, 34, 0.15), 0 0 12px rgba(234, 179, 8, 0.3)",
            }}
          >
            {/* Cò Em Mascot với đầy đủ nhịp thở & chớp mắt */}
            <div className="w-11 h-11 flex items-center justify-center transform translate-y-0.5">
              <CoMascot size={46} mood="cuoi" animate={true} />
            </div>

            {/* Dấu chấm báo trạng thái */}
            <span
              className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full border border-white bg-[var(--xanh-la)]"
              style={{
                boxShadow: "0 0 6px var(--xanh-la)",
              }}
            />
          </div>
        </button>
      )}

      {/* Cửa sổ chat / Bong bóng Cò Em */}
      {isOpen && (
        <div
          className="fixed bottom-[calc(var(--dock-h,64px)+16px)] right-4 md:right-6 z-50 w-[92vw] max-w-[370px] h-[510px] max-h-[calc(100vh-var(--top-bar-h,56px)-var(--dock-h,64px)-32px)] flex flex-col border shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
          style={{
            background: "var(--nen-the)",
            borderColor: "var(--vien-the)",
            borderRadius: "var(--vien-lech-a)",
            boxShadow: "var(--shadow-the)",
            color: "var(--chu-chinh, #0F172A)",
          }}
        >
          {/* Header */}
          <div
            className="p-3 px-4 border-b flex items-center justify-between"
            style={{
              borderColor: "var(--vien-the)",
              background: "var(--nen-the-phu)",
            }}
          >
            <div className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center border overflow-hidden bg-white shadow-xs"
                style={{
                  borderColor: "var(--vang-chinh)",
                }}
              >
                <CoMascot size={32} mood="cuoi" animate={false} />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3
                    className="text-sm font-semibold leading-tight text-[var(--nen-toi)]"
                    style={{ fontFamily: "var(--font-than)" }}
                  >
                    {coem.chat.tieuDe}
                  </h3>
                  <span
                    className="text-[10px] px-1.5 py-0.2 border rounded font-semibold bg-[var(--xanh-nhe)] border-[var(--xanh-mint)] text-[var(--xanh-chinh)]"
                  >
                    {coem.chat.phuDe}
                  </span>
                </div>
                {tenTrangPhucHienTai && (
                  <p className="text-[11px] mt-0.5 truncate max-w-[200px] text-[var(--tro-tram)]">
                    {coem.chat.dangXem}: <span className="font-semibold text-[var(--vang-chinh)]">{tenTrangPhucHienTai}</span>
                  </p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={closeChat}
              className="px-2.5 py-1 rounded-full text-xs font-bold border border-[var(--vien-the)] bg-[var(--nen-the)] hover:bg-rose-100 hover:text-rose-700 dark:hover:bg-rose-950 dark:hover:text-rose-300 text-[var(--chu-phu)] transition-colors cursor-pointer shadow-xs"
              aria-label={coem.chat.dongChat}
              title="Đóng cửa sổ trò chuyện"
            >
              ✕ Đóng
            </button>
          </div>

          {/* Suggested prompt chips (3 câu hỏi gợi ý) */}
          <div
            className="p-2.5 px-3 border-b flex flex-wrap gap-1.5"
            style={{ borderColor: "var(--vien-the)", background: "var(--nen-the-phu)" }}
          >
            {coem.chat.cauHoiGoiY.map((cauGoiY, idx) => (
              <button
                key={idx}
                type="button"
                disabled={loading}
                onClick={() => handleSend(cauGoiY)}
                className="text-[11px] px-2 py-1 border transition-all text-left truncate max-w-full cursor-pointer hover:border-amber-500 font-medium"
                style={{
                  borderColor: "var(--vien-the)",
                  color: "var(--chu-chinh, #0F172A)",
                  background: "var(--nen-the)",
                  borderRadius: "var(--vien-lech-b)",
                }}
              >
                💬 {cauGoiY}
              </button>
            ))}
          </div>

          {/* Vùng tin nhắn cuộn */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3.5 text-xs">
            {messages.map((m) => {
              const isUser = m.sender === "user";
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                >
                  <div
                    className="p-2.5 px-3 rounded-lg max-w-[88%] leading-relaxed border"
                    style={{
                      background: isUser
                        ? "var(--nen-the-phu)"
                        : "var(--nen-the)",
                      color: "var(--chu-chinh, #0F172A)",
                      borderColor: isUser
                        ? "var(--vang-chinh)"
                        : m.isError
                        ? "rgba(239, 68, 68, 0.5)"
                        : "var(--vien-the)",
                      borderRadius: isUser ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                    }}
                  >
                    <p className="whitespace-pre-line">{m.text}</p>

                    {/* Chip nguồn dưới mỗi câu trả lời */}
                    {m.nguonIds && m.nguonIds.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t flex flex-wrap gap-1 items-center" style={{ borderColor: "rgba(217, 164, 65, 0.2)" }}>
                        <span className="text-[10px] text-stone-400">Nguồn:</span>
                        {m.nguonIds.map((nid) => (
                          <span
                            key={nid}
                            className="text-[10px] px-1.5 py-0.5 border rounded"
                            style={{
                              borderColor: "rgba(217, 164, 65, 0.3)",
                              color: "var(--vang-chinh)",
                              background: "rgba(217, 164, 65, 0.12)",
                            }}
                          >
                            📖 {layTenNguon(nid)}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Nút "Báo sai" dưới câu trả lời của Cò Em */}
                    {!isUser && m.id !== "welcome" && (
                      <div className="mt-2 pt-1 flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleBaoSai(m.text)}
                          className="text-[10px] px-1.5 py-0.5 border flex items-center gap-1 cursor-pointer transition-colors text-[var(--chu-mo)] hover:text-amber-600"
                          style={{
                            borderColor: "var(--vien-the)",
                            borderRadius: "var(--vien-lech-b)",
                          }}
                          title="Góp ý hoặc báo sai sót văn hóa về câu trả lời này"
                        >
                          🚩 {coem.chat.baoSai}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Trạng thái đang tìm: "Cò Em đang lật tìm câu trả lời..." */}
            {loading && (
              <div className="flex items-start gap-2">
                <div
                  className="p-2.5 px-3 rounded-lg border max-w-[85%] flex items-center gap-2 bg-[var(--nen-the-phu)] border-[var(--vien-the)] text-[var(--vang-chinh)]"
                  style={{
                    borderRadius: "12px 12px 12px 2px",
                  }}
                >
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                  <span className="italic text-[11.5px] font-medium">
                    {coem.chat.dangTim}
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Ô nhập liệu chân cửa sổ */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-2.5 px-3 border-t bg-[var(--nen-the-phu)] border-[var(--vien-the)] flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              disabled={loading}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={coem.chat.placeholder}
              className="flex-1 bg-[var(--nen-the)] border border-[var(--vien-the)] text-[var(--chu-chinh)] text-xs px-2.5 py-2 rounded-lg focus:outline-none focus:border-[var(--vang-chinh)] transition-colors placeholder:text-[var(--chu-mo)]"
            />
            <button
              type="submit"
              disabled={loading || !inputVal.trim()}
              className="px-3.5 py-2 text-xs font-bold border border-[var(--vang-chinh)] bg-[var(--vang-chinh)] text-white hover:brightness-110 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs"
              style={{
                borderRadius: "var(--vien-lech-b)",
              }}
            >
              {coem.chat.nutGui}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
