/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { createPortal } from "react-dom";

// ============================================================================
// CONTEXT: Quản lý trạng thái Bật/Tắt hướng dẫn nhanh (Tooltips) toàn ứng dụng
// ============================================================================

interface TooltipContextType {
  tooltipsEnabled: boolean;
  setTooltipsEnabled: (enabled: boolean) => void;
  toggleTooltips: () => void;
}

const TooltipContext = createContext<TooltipContextType>({
  tooltipsEnabled: true,
  setTooltipsEnabled: () => {},
  toggleTooltips: () => {},
});

export function TooltipProvider({ children }: { children: ReactNode }) {
  const [tooltipsEnabled, setTooltipsEnabled] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = window.localStorage.getItem("vpr:tooltips_enabled");
      if (saved !== null) {
        return saved === "true";
      }
    }
    return true; // Mặc định bật để hỗ trợ người dùng
  });

  const toggleTooltips = useCallback(() => {
    setTooltipsEnabled((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem("vpr:tooltips_enabled", String(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  return (
    <TooltipContext.Provider
      value={{ tooltipsEnabled, setTooltipsEnabled, toggleTooltips }}
    >
      {children}
    </TooltipContext.Provider>
  );
}

export function useTooltips() {
  return useContext(TooltipContext);
}

// ============================================================================
// COMPONENT: Tooltip hiển thị gợi ý ngắn gọn, súc tích khi di chuột
// ============================================================================

export type TooltipPosition = "top" | "bottom" | "left" | "right";

export interface TooltipProps {
  /** Nội dung hướng dẫn ngắn gọn */
  content: ReactNode;
  /** Tiêu đề ngắn nổi bật (tùy chọn) */
  title?: string;
  /** Huy hiệu / phím tắt / mẹo nhỏ (ví dụ: "Bấm để mở", "Khuyên dùng") */
  shortcut?: string;
  /** Hướng hiển thị */
  position?: TooltipPosition;
  /** Độ trễ trước khi hiện (ms) - mặc định 140ms để tránh giật lag khi lướt chuột */
  delay?: number;
  /** Vô hiệu hóa tooltip này */
  disabled?: boolean;
  /** Class bổ sung cho trigger container */
  className?: string;
  /** Kiểu wrapper inline-block hay flex block */
  asBlock?: boolean;
  children: ReactNode;
}

export default function Tooltip({
  content,
  title,
  shortcut,
  position = "top",
  delay = 140,
  disabled = false,
  className = "",
  asBlock = false,
  children,
}: TooltipProps) {
  const { tooltipsEnabled } = useTooltips();
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState<{
    top: number;
    left: number;
    actualPosition: TooltipPosition;
  }>({
    top: 0,
    left: 0,
    actualPosition: position,
  });

  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const calculatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;

    // Kích thước ước lượng của tooltip box
    const tooltipWidth = tooltipRef.current?.offsetWidth || 220;
    const tooltipHeight = tooltipRef.current?.offsetHeight || 60;
    const gap = 8; // Khoảng cách tới đối tượng

    let actualPos = position;
    let top = 0;
    let left = 0;

    // Kiểm tra lật vị trí nếu sát viền màn hình (Auto-flip)
    if (actualPos === "top" && triggerRect.top - tooltipHeight - gap < 10) {
      actualPos = "bottom";
    } else if (
      actualPos === "bottom" &&
      triggerRect.bottom + tooltipHeight + gap > window.innerHeight - 10
    ) {
      actualPos = "top";
    } else if (actualPos === "left" && triggerRect.left - tooltipWidth - gap < 10) {
      actualPos = "right";
    } else if (
      actualPos === "right" &&
      triggerRect.right + tooltipWidth + gap > window.innerWidth - 10
    ) {
      actualPos = "left";
    }

    if (actualPos === "top") {
      top = triggerRect.top + scrollY - tooltipHeight - gap;
      left = triggerRect.left + scrollX + triggerRect.width / 2 - tooltipWidth / 2;
    } else if (actualPos === "bottom") {
      top = triggerRect.bottom + scrollY + gap;
      left = triggerRect.left + scrollX + triggerRect.width / 2 - tooltipWidth / 2;
    } else if (actualPos === "left") {
      top = triggerRect.top + scrollY + triggerRect.height / 2 - tooltipHeight / 2;
      left = triggerRect.left + scrollX - tooltipWidth - gap;
    } else if (actualPos === "right") {
      top = triggerRect.top + scrollY + triggerRect.height / 2 - tooltipHeight / 2;
      left = triggerRect.right + scrollX + gap;
    }

    // Giữ tooltip không bao giờ tràn ra ngoài lề màn hình
    const padding = 10;
    const minLeft = scrollX + padding;
    const maxLeft = scrollX + window.innerWidth - tooltipWidth - padding;
    left = Math.max(minLeft, Math.min(maxLeft, left));

    setCoords({ top, left, actualPosition: actualPos });
  }, [position]);

  const showTooltip = useCallback(() => {
    if (disabled || !tooltipsEnabled || !content) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      calculatePosition();
      setIsVisible(true);
    }, delay);
  }, [disabled, tooltipsEnabled, content, delay, calculatePosition]);

  const hideTooltip = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsVisible(false);
  }, []);

  // Cập nhật vị trí khi scroll hoặc resize
  useEffect(() => {
    if (isVisible) {
      const handleReposition = () => calculatePosition();
      window.addEventListener("scroll", handleReposition, true);
      window.addEventListener("resize", handleReposition);
      return () => {
        window.removeEventListener("scroll", handleReposition, true);
        window.removeEventListener("resize", handleReposition);
      };
    }
  }, [isVisible, calculatePosition]);

  // Dọn dẹp timer khi unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div
      ref={triggerRef}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
      onClick={hideTooltip}
      className={`vpr-tooltip-trigger ${asBlock ? "block w-full" : "inline-block"} ${className}`}
    >
      {children}

      {isVisible &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={tooltipRef}
            role="tooltip"
            style={{
              position: "absolute",
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              zIndex: 9999,
            }}
            className="vpr-tooltip-portal pointer-events-none select-none transition-opacity duration-150 animate-in fade-in zoom-in-95"
          >
            <div className="relative max-w-xs sm:max-w-sm px-3 py-2 rounded-lg bg-[#14231A]/95 text-stone-100 backdrop-blur-md border border-amber-400/35 shadow-xl text-left">
              {/* Header của tooltip: Tiêu đề + Shortcut badge */}
              {(title || shortcut) && (
                <div className="flex items-center justify-between gap-2 mb-1 pb-1 border-b border-white/10">
                  {title && (
                    <span className="font-serif font-semibold text-xs text-amber-300 flex items-center gap-1.5">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                      {title}
                    </span>
                  )}
                  {shortcut && (
                    <span className="text-[10px] font-sans font-medium px-1.5 py-0.5 rounded bg-white/10 text-emerald-300">
                      {shortcut}
                    </span>
                  )}
                </div>
              )}

              {/* Nội dung gợi ý ngắn gọn */}
              <div className="text-[11.5px] leading-relaxed text-stone-200 font-sans">
                {content}
              </div>

              {/* Mũi tên nhỏ trỏ vào mục được hover */}
              <div
                className={`absolute w-2 h-2 bg-[#14231A] border-amber-400/35 transform rotate-45 ${
                  coords.actualPosition === "top"
                    ? "bottom-[-5px] left-1/2 -translate-x-1/2 border-b border-r"
                    : coords.actualPosition === "bottom"
                    ? "top-[-5px] left-1/2 -translate-x-1/2 border-t border-l"
                    : coords.actualPosition === "left"
                    ? "right-[-5px] top-1/2 -translate-y-1/2 border-t border-r"
                    : "left-[-5px] top-1/2 -translate-y-1/2 border-b border-l"
                }`}
              />
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

// ============================================================================
// COMPONENT: Nút Bật / Tắt chế độ Tooltips nhanh đặt ở TopBar / Header
// ============================================================================

export function TooltipToggleButton({ className = "" }: { className?: string }) {
  const { tooltipsEnabled, toggleTooltips } = useTooltips();

  return (
    <Tooltip
      title="Chế độ Hướng Dẫn Nhanh"
      content={
        tooltipsEnabled
          ? "Đang BẬT chú thích khi rê chuột. Nhấp để tắt nếu bạn đã quen thao tác."
          : "Đang TẮT chú thích khi rê chuột. Nhấp để bật lại để xem giải thích các khu vực."
      }
      shortcut={tooltipsEnabled ? "Đang bật" : "Đã tắt"}
      position="bottom"
    >
      <button
        type="button"
        onClick={toggleTooltips}
        aria-label={tooltipsEnabled ? "Tắt chú thích nhanh" : "Bật chú thích nhanh"}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-[var(--vien-lech-a)] text-xs font-medium transition-all cursor-pointer ${
          tooltipsEnabled
            ? "bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-300 hover:bg-amber-500/25"
            : "bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-500 hover:text-stone-700 dark:hover:text-stone-300"
        } ${className}`}
      >
        <span
          className={`w-2 h-2 rounded-full transition-colors ${
            tooltipsEnabled ? "bg-amber-500 animate-pulse" : "bg-stone-400"
          }`}
          aria-hidden="true"
        />
        <span className="hidden sm:inline">
          {tooltipsEnabled ? "Mẹo Nhanh: Bật" : "Mẹo: Tắt"}
        </span>
        <span className="sm:hidden">Mẹo</span>
      </button>
    </Tooltip>
  );
}
