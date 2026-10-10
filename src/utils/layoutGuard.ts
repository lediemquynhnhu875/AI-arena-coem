/**
 * layoutGuard — phát hiện thành phần CHỒNG CHÉO lên nhau (chỉ dùng khi phát triển).
 * Bật: thêm ?guard=1 vào URL. Phần tử vi phạm được viền đỏ + in bảng trong console.
 * Cũng dùng được từ console:  __vprAudit()  → mảng các cặp chồng chéo.
 * Quy tắc: hai phần tử nhìn thấy, không lồng nhau, giao nhau > 12% diện tích của phần tử nhỏ hơn => lỗi.
 */
export type OverlapPair = { a: string; b: string; area: number; ratio: number };

const SELECTOR = "button, a[href], input, select, textarea, label, h1, h2, h3, h4, p, [role='button'], [data-guard]";

function label(el: Element): string {
  const t = (el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 28);
  const cls = (el.getAttribute("class") || "").split(" ")[0];
  return `${el.tagName.toLowerCase()}${cls ? "." + cls : ""}${t ? ` "${t}"` : ""}`;
}

function visible(el: Element): DOMRect | null {
  const cs = getComputedStyle(el);
  if (cs.display === "none" || cs.visibility === "hidden" || parseFloat(cs.opacity) < 0.05) return null;
  if (cs.pointerEvents === "none" && el.tagName !== "P") return null;
  const r = el.getBoundingClientRect();
  if (r.width < 6 || r.height < 6) return null;
  if (r.bottom < 0 || r.top > innerHeight || r.right < 0 || r.left > innerWidth) return null; // ngoài khung nhìn
  return r;
}

export function auditOverlaps(root: ParentNode = document, minRatio = 0.12): OverlapPair[] {
  const items: { el: Element; r: DOMRect }[] = [];
  root.querySelectorAll(SELECTOR).forEach((el) => {
    const r = visible(el);
    if (r) items.push({ el, r });
  });
  const out: OverlapPair[] = [];
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      const A = items[i], B = items[j];
      if (A.el.contains(B.el) || B.el.contains(A.el)) continue;
      const w = Math.min(A.r.right, B.r.right) - Math.max(A.r.left, B.r.left);
      const h = Math.min(A.r.bottom, B.r.bottom) - Math.max(A.r.top, B.r.top);
      if (w <= 2 || h <= 2) continue;
      const area = w * h;
      const small = Math.min(A.r.width * A.r.height, B.r.width * B.r.height);
      const ratio = area / small;
      if (ratio >= minRatio) out.push({ a: label(A.el), b: label(B.el), area: Math.round(area), ratio: +ratio.toFixed(2) });
      if (ratio >= minRatio) { (A.el as HTMLElement).style.outline = "2px solid #e11d48"; (B.el as HTMLElement).style.outline = "2px solid #e11d48"; }
    }
  }
  return out;
}

export function installLayoutGuard() {
  if (typeof window === "undefined") return;
  (window as any).__vprAudit = () => auditOverlaps();
  if (new URLSearchParams(location.search).get("guard") !== "1") return;
  let t = 0;
  const run = () => { const r = auditOverlaps(); if (r.length) console.table(r); };
  new MutationObserver(() => { clearTimeout(t); t = window.setTimeout(run, 600); }).observe(document.body, { childList: true, subtree: true });
  addEventListener("resize", run);
  run();
}
