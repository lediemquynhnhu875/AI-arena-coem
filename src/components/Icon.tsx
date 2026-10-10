import type { CSSProperties } from "react";

/**
Icon system của Đóm Dáng — MỘT bộ duy nhất, không dùng emoji, không trộn thư viện icon khác.
Quy chuẩn: khung 24×24 · vùng an toàn 2–22 · nét 1.75 · đầu nét và góc nối bo tròn · không fill kín.
"Duotone": mỗi icon có thể có MỘT mảng nền (body) tô currentColor ở độ mờ 16% để có chút chất liệu.
Màu chỉ đi theo tone: text | muted | accent | primary | ok | warn | bad | info → luôn dùng token, không hex.
Quy tắc dùng: chỉ đặt icon ở (1) thanh điều hướng, (2) trạng thái, (3) nút hành động phụ.
KHÔNG đặt icon trước tiêu đề thẻ, đoạn văn, hoặc chip chỉ chứa chữ. Chức năng quan trọng dùng minh họa/chuyển động thay icon.
*/

export type IconName =
  | "kham-pha" | "phong-thu-do" | "gui" | "cho-phien" | "toi" | "ban-do" | "sach" | "khien" | "kinh-lup" | "soi-chi"
  | "dong-thoi-gian" | "dieu-chinh" | "mat-troi" | "mat-trang" | "may" | "mua" | "xoay" | "chup" | "luu" | "chia-se"
  | "dong" | "quay-lai" | "tiep" | "them" | "tick" | "vi-tri" | "ngon-ngu" | "nguoi-doi";

type Def = { body?: string; lines: string[]; dots?: [number, number, number][] };

const I: Record<IconName, Def> = {
  "kham-pha": { body: "M15.6 8.4l-2.1 5.1-5.1 2.1 2.1-5.1 5.1-2.1Z", lines: ["M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z", "M15.6 8.4l-2.1 5.1-5.1 2.1 2.1-5.1 5.1-2.1Z"] },
  "phong-thu-do": { body: "M9.2 3.6 12 5.1l2.8-1.5 4.1 3.3-1.6 4-1.6-.9L15.4 20.5H8.6L8.3 9.5l-1.6.9-1.6-4 4.1-3.3Z", lines: ["M9.2 3.6 12 5.1l2.8-1.5 4.1 3.3-1.6 4-1.6-.9L15.4 20.5H8.6L8.3 9.5l-1.6.9-1.6-4 4.1-3.3Z", "M12 5.1V9"] },
  "gui": { body: "M6.2 8.5h11.6l-1.5 10.6a1.6 1.6 0 0 1-1.6 1.4H9.3a1.6 1.6 0 0 1-1.6-1.4L6.2 8.5Z", lines: ["M6.2 8.5h11.6l-1.5 10.6a1.6 1.6 0 0 1-1.6 1.4H9.3a1.6 1.6 0 0 1-1.6-1.4L6.2 8.5Z", "M4.8 8.5h14.4", "M8.6 8.5C8.6 5.9 9.7 4 12 4s3.4 1.9 3.4 4.5", "M7.6 12.6h8.8", "M7.9 16.2h8.2"] },
  "cho-phien": { body: "M7 9.6a5 4.7 0 0 1 10 0v3.2a5 4.7 0 0 1-10 0V9.6Z", lines: ["M7 9.6a5 4.7 0 0 1 10 0v3.2a5 4.7 0 0 1-10 0V9.6Z", "M9.6 4.2h4.8", "M12 4.2v.9", "M9.6 6c-.9 2.7-.9 6.7 0 9.4", "M14.4 6c.9 2.7.9 6.7 0 9.4", "M10.6 17.4v2.3M13.4 17.4v2.3M9.4 19.7h5.2"] },
  "toi": { body: "M5.2 20c.5-3.6 3.3-5.6 6.8-5.6s6.3 2 6.8 5.6H5.2Z", lines: ["M12 4.2a3.6 3.6 0 1 0 0 7.2 3.6 3.6 0 0 0 0-7.2Z", "M5.2 20c.5-3.6 3.3-5.6 6.8-5.6s6.3 2 6.8 5.6"] },
  "ban-do": { body: "M12 20.6s5.8-4.9 5.8-9.7a5.8 5.8 0 0 0-11.6 0c0 4.8 5.8 9.7 5.8 9.7Z", lines: ["M12 20.6s5.8-4.9 5.8-9.7a5.8 5.8 0 0 0-11.6 0c0 4.8 5.8 9.7 5.8 9.7Z", "M12 8.8a2.1 2.1 0 1 0 0 4.2 2.1 2.1 0 0 0 0-4.2Z"] },
  "sach": { body: "M12 6.6c-1.7-1.2-4.2-1.7-7.5-1.5v12.7c3.3-.2 5.8.3 7.5 1.5 1.7-1.2 4.2-1.7 7.5-1.5V5.1c-3.3-.2-5.8.3-7.5 1.5Z", lines: ["M12 6.6c-1.7-1.2-4.2-1.7-7.5-1.5v12.7c3.3-.2 5.8.3 7.5 1.5 1.7-1.2 4.2-1.7 7.5-1.5V5.1c-3.3-.2-5.8.3-7.5 1.5Z", "M12 6.6v12.7"] },
  "khien": { body: "M12 3.6l7 2.6v5.3c0 4.3-2.9 7.5-7 8.9-4.1-1.4-7-4.6-7-8.9V6.2l7-2.6Z", lines: ["M12 3.6l7 2.6v5.3c0 4.3-2.9 7.5-7 8.9-4.1-1.4-7-4.6-7-8.9V6.2l7-2.6Z", "M8.8 12l2.3 2.3 4.2-4.6"] },
  "kinh-lup": { lines: ["M10.5 4.8a5.7 5.7 0 1 0 0 11.4 5.7 5.7 0 0 0 0-11.4Z", "M14.8 15l5 5"] },
  "soi-chi": { lines: ["M3.8 8.2c3.4-3.6 6.2 3.6 8.2 0s4.8-3.6 8.2 0", "M3.8 15.8c3.4-3.6 6.2 3.6 8.2 0s4.8-3.6 8.2 0"] },
  "dong-thoi-gian": { lines: ["M3.5 12h17"], dots: [[7, 12, 1.9], [12, 12, 1.9], [17, 12, 1.9]] },
  "dieu-chinh": { lines: ["M4 7h8", "M17 7h3", "M4 17h3", "M12 17h8"], dots: [[14.5, 7, 2.4], [9.5, 17, 2.4]] },
  "mat-troi": { lines: ["M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z", "M12 2.8v2M12 19.2v2M2.8 12h2M19.2 12h2M5.5 5.5l1.4 1.4M17.1 17.1l1.4 1.4M5.5 18.5l1.4-1.4M17.1 6.9l1.4-1.4"] },
  "mat-trang": { body: "M20 14.6A8 8 0 0 1 9.4 4a8 8 0 1 0 10.6 10.6Z", lines: ["M20 14.6A8 8 0 0 1 9.4 4a8 8 0 1 0 10.6 10.6Z"] },
  "may": { body: "M7.6 18.2a4 4 0 0 1-.7-7.9A5.6 5.6 0 0 1 17.6 9a4.6 4.6 0 0 1-.6 9.2H7.6Z", lines: ["M7.6 18.2a4 4 0 0 1-.7-7.9A5.6 5.6 0 0 1 17.6 9a4.6 4.6 0 0 1-.6 9.2H7.6Z"] },
  "mua": { body: "M7.6 15a4 4 0 0 1-.7-7.9A5.6 5.6 0 0 1 17.6 5.8 4.6 4.6 0 0 1 17 15H7.6Z", lines: ["M7.6 15a4 4 0 0 1-.7-7.9A5.6 5.6 0 0 1 17.6 5.8 4.6 4.6 0 0 1 17 15H7.6Z", "M8.6 18l-.8 2.4M12.6 18l-.8 2.4M16.6 18l-.8 2.4"] },
  "xoay": { lines: ["M20 12a8 8 0 1 1-2.7-6", "M20 4v4.6h-4.6"] },
  "chup": { body: "M4 8.6A1.6 1.6 0 0 1 5.6 7h2.2l1.3-2h5.8l1.3 2h2.2A1.6 1.6 0 0 1 20 8.6v8.8a1.6 1.6 0 0 1-1.6 1.6H5.6A1.6 1.6 0 0 1 4 17.4V8.6Z", lines: ["M4 8.6A1.6 1.6 0 0 1 5.6 7h2.2l1.3-2h5.8l1.3 2h2.2A1.6 1.6 0 0 1 20 8.6v8.8a1.6 1.6 0 0 1-1.6 1.6H5.6A1.6 1.6 0 0 1 4 17.4V8.6Z", "M12 9.9a3.1 3.1 0 1 0 0 6.2 3.1 3.1 0 0 0 0-6.2Z"] },
  "luu": { body: "M7 4.2h10a1 1 0 0 1 1 1V20l-6-4-6 4V5.2a1 1 0 0 1 1-1Z", lines: ["M7 4.2h10a1 1 0 0 1 1 1V20l-6-4-6 4V5.2a1 1 0 0 1 1-1Z"] },
  "chia-se": { lines: ["M12 15.2V4", "M7.8 8.2 12 4l4.2 4.2", "M5 13v5.2A1.8 1.8 0 0 0 6.8 20h10.4a1.8 1.8 0 0 0 1.8-1.8V13"] },
  "dong": { lines: ["M6 6l12 12", "M18 6 6 18"] },
  "quay-lai": { lines: ["M14.6 5.4 8 12l6.6 6.6"] },
  "tiep": { lines: ["M9.4 5.4 16 12l-6.6 6.6"] },
  "them": { lines: ["M12 5v14", "M5 12h14"] },
  "tick": { lines: ["M5.4 12.6l4.3 4.3 8.9-9.3"] },
  "vi-tri": { lines: ["M12 3v3M12 18v3M3 12h3M18 12h3", "M12 7.6a4.4 4.4 0 1 0 0 8.8 4.4 4.4 0 0 0 0-8.8Z"], dots: [[12, 12, 1.3]] },
  "ngon-ngu": { lines: ["M12 3.2a8.8 8.8 0 1 0 0 17.6 8.8 8.8 0 0 0 0-17.6Z", "M3.4 12h17.2", "M12 3.2c2.5 2.4 3.8 5.4 3.8 8.8s-1.3 6.4-3.8 8.8c-2.5-2.4-3.8-5.4-3.8-8.8s1.3-6.4 3.8-8.8Z"] },
  "nguoi-doi": { lines: ["M8.6 5.2a2.8 2.8 0 1 0 0 5.6 2.8 2.8 0 0 0 0-5.6Z", "M3.4 19c.4-2.9 2.5-4.5 5.2-4.5s4.8 1.6 5.2 4.5", "M16.6 6.6a2.4 2.4 0 1 1 0 4.8", "M17.2 14.6c2 .3 3.1 1.7 3.4 4.4"] },
};

const TONE: Record<string, string> = {
  text: "var(--text)",
  muted: "var(--text-muted)",
  accent: "var(--accent-text)",
  primary: "var(--primary-text)",
  ok: "var(--ok)",
  warn: "var(--warn)",
  bad: "var(--bad)",
  info: "var(--info)",
};

export interface IconProps {
  name: IconName;
  size?: number;
  tone?: keyof typeof TONE | "inherit";
  duotone?: boolean;
  title?: string;
  style?: CSSProperties;
  className?: string;
}

export default function Icon({
  name,
  size = 22,
  tone = "inherit",
  duotone = true,
  title,
  style,
  className,
}: IconProps) {
  const d = I[name];
  if (!d) return null;
  const color = tone === "inherit" ? "currentColor" : (TONE[tone] || "currentColor");
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      className={className}
      style={{ color, flex: "none", ...style }}
    >
      {title && <title>{title}</title>}
      {duotone && d.body && <path d={d.body} fill="currentColor" fillOpacity={0.16} stroke="none" />}
      {d.lines.map((p, i) => <path key={i} d={p} />)}
      {d.dots?.map(([cx, cy, r], i) => (
        <circle key={"d" + i} cx={cx} cy={cy} r={r} fill="currentColor" stroke="none" />
      ))}
    </svg>
  );
}

export const ICON_NAMES = Object.keys(I) as IconName[];
