/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { NhanVatConfig, NHAN_VAT_MAC_DINH } from "./avatar";
import { callGemini } from "./gemini";
import { layKhoaTheoHoSo } from "./hoSo";

export interface OutfitSaved {
  id: string;
  trangPhucId: string;
  mauId: string;
  phuKienIds: string[];
  caption: string;
  taoLuc: number;
  hoaVanThem?: string | null;
  phongCach?: string | null;
  nhanVatConfig?: NhanVatConfig;
  lyDoRemix?: string[];
  cauLyDoRemix?: string;
}

export function layKhoaOutfits(): string {
  return layKhoaTheoHoSo("outfits");
}

export const OUTFITS_STORAGE_KEY = "vpr:outfits";
export const MAX_OUTFITS = 6;

// Dữ liệu mẫu đầu vào theo yêu cầu:
// {"id":"o1","trangPhucId":"tu_than","mauId":"m_cham","phuKienIds":["khan_mo_qua"],"caption":"Chiều hội làng...","taoLuc":1790000000000}
export const SAMPLE_OUTFIT: OutfitSaved = {
  id: "o1",
  trangPhucId: "tu_than",
  mauId: "m_cham",
  phuKienIds: ["khan_mo_qua"],
  caption: "Chiều hội làng... gió đung đưa tà áo tứ thân nhuộm sắc chàm trầm mặc.",
  taoLuc: 1790000000000,
  hoaVanThem: null,
  phongCach: "truyen_thong",
  nhanVatConfig: NHAN_VAT_MAC_DINH,
};

/**
 * Đọc danh sách trang phục đã cất trong Gùi Ký Ức của hồ sơ hiện tại
 * Khóa theo hồ sơ: "vpr:<hoSo>:outfits"
 */
export function docDanhSachGuiKyUc(): OutfitSaved[] {
  if (typeof window === "undefined" || !window.localStorage) {
    return [SAMPLE_OUTFIT];
  }

  const storageKey = layKhoaOutfits();
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) {
      // Nếu là hồ sơ khách và chưa có khóa scoped nhưng có khóa cũ "vpr:outfits", chuyển đổi sang
      const oldRaw = window.localStorage.getItem("vpr:outfits");
      if (oldRaw && storageKey === "vpr:khach:outfits") {
        window.localStorage.setItem(storageKey, oldRaw);
        return JSON.parse(oldRaw);
      }
      // Khởi tạo dữ liệu mẫu
      window.localStorage.setItem(storageKey, JSON.stringify([SAMPLE_OUTFIT]));
      return [SAMPLE_OUTFIT];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      if (parsed.length === 0) {
        return [];
      }
      return parsed.slice(0, MAX_OUTFITS);
    }
  } catch (err) {
    console.error("Lỗi đọc Gùi Ký Ức:", err);
  }

  return [SAMPLE_OUTFIT];
}

/**
 * Cất một bộ trang phục mới vào Gùi Ký Ức (tối đa 6 bộ)
 */
export function luuVaoGuiKyUc(
  item: Omit<OutfitSaved, "id" | "taoLuc"> & { id?: string; taoLuc?: number }
): { success: boolean; error?: string; list: OutfitSaved[] } {
  const currentList = docDanhSachGuiKyUc();
  const storageKey = layKhoaOutfits();

  // Kiểm tra nếu bộ đồ đã tồn tại (cập nhật)
  if (item.id) {
    const existingIndex = currentList.findIndex((o) => o.id === item.id);
    if (existingIndex >= 0) {
      const updated: OutfitSaved = {
        ...currentList[existingIndex],
        ...item,
        id: item.id,
        caption: (item.caption || "").slice(0, 140),
        taoLuc: item.taoLuc || Date.now(),
      };
      currentList[existingIndex] = updated;
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(currentList));
        window.dispatchEvent(new CustomEvent("vpr:outfits-change", { detail: currentList }));
      } catch (err) {
        console.error("Lỗi lưu Gùi Ký Ức:", err);
      }
      return { success: true, list: currentList };
    }
  }

  // Nếu là cất mới: kiểm tra số lượng tối đa 6 bộ
  if (currentList.length >= MAX_OUTFITS) {
    return {
      success: false,
      error: `Gùi Ký Ức đã đầy (tối đa ${MAX_OUTFITS} bộ). Bạn hãy xóa bớt một bộ để cất thêm bộ mới nhé.`,
      list: currentList,
    };
  }

  const newOutfit: OutfitSaved = {
    ...item,
    id: item.id || `o_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    caption: (item.caption || "").slice(0, 140),
    taoLuc: item.taoLuc || Date.now(),
  };

  const newList = [newOutfit, ...currentList].slice(0, MAX_OUTFITS);

  try {
    window.localStorage.setItem(storageKey, JSON.stringify(newList));
    window.dispatchEvent(new CustomEvent("vpr:outfits-change", { detail: newList }));
    window.dispatchEvent(
      new CustomEvent("vpr:outfit-completed", {
        detail: { trangPhucId: newOutfit.trangPhucId, id: newOutfit.id, action: "save" },
      })
    );

    // Đồng bộ an toàn tới CSDL máy chủ
    if (typeof fetch === "function") {
      fetch("/api/outfits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: newOutfit.id,
          title: newOutfit.caption || "Bộ phối đồ Việt phục",
          trang_phuc_id: newOutfit.trangPhucId,
          mau_hex: newOutfit.mauId,
          phu_kien_ids: newOutfit.phuKienIds,
          nhan_vat_config: newOutfit.nhanVatConfig,
          notes: newOutfit.cauLyDoRemix || "",
        }),
      }).catch(() => {});
    }
  } catch (err) {
    console.error("Lỗi lưu Gùi Ký Ức:", err);
  }

  return { success: true, list: newList };
}

/**
 * Xóa một bộ trang phục khỏi Gùi Ký Ức
 */
export function xoaKhoiGuiKyUc(id: string): OutfitSaved[] {
  const currentList = docDanhSachGuiKyUc();
  const newList = currentList.filter((o) => o.id !== id);
  const storageKey = layKhoaOutfits();

  try {
    window.localStorage.setItem(storageKey, JSON.stringify(newList));
    window.dispatchEvent(new CustomEvent("vpr:outfits-change", { detail: newList }));

    // Đồng bộ xóa trên CSDL máy chủ
    if (typeof fetch === "function") {
      fetch(`/api/outfits/${encodeURIComponent(id)}`, { method: "DELETE" }).catch(() => {});
    }
  } catch (err) {
    console.error("Lỗi xóa khỏi Gùi Ký Ức:", err);
  }

  return newList;
}

/**
 * Cập nhật chú thích của một bộ trong Gùi (tối đa 140 ký tự)
 */
export function capNhatCaptionGuiKyUc(id: string, caption: string): OutfitSaved[] {
  const currentList = docDanhSachGuiKyUc();
  const target = currentList.find((o) => o.id === id);
  if (!target) return currentList;

  target.caption = caption.slice(0, 140);
  const storageKey = layKhoaOutfits();

  try {
    window.localStorage.setItem(storageKey, JSON.stringify(currentList));
    window.dispatchEvent(new CustomEvent("vpr:outfits-change", { detail: currentList }));
  } catch (err) {
    console.error("Lỗi cập nhật chú thích:", err);
  }

  return [...currentList];
}

/**
 * Gọi Gemini để nhờ Cò Em gợi ý chú thích cho bộ đồ
 * - Đầu vào: tên trang phục, màu, phụ kiện
 * - Đầu ra: {"caption":"..."} 1–2 câu, giọng nhẹ, không thêm sự thật văn hóa mới, tối đa 1 emoji
 * - Nhiệt độ 0.7
 * - Lỗi thì để trống ô (fallback = "")
 */
export async function goiYCaptionGemini(params: {
  tenTrangPhuc: string;
  tenMau: string;
  tenPhuKienList: string[];
}): Promise<string> {
  const { tenTrangPhuc, tenMau, tenPhuKienList } = params;

  try {
    const phuKienStr =
      tenPhuKienList.length > 0 ? tenPhuKienList.join(", ") : "Không kèm phụ kiện cầu kỳ";

    const promptContext = `Bộ trang phục: ${tenTrangPhuc}, Sắc màu: ${tenMau}, Phụ kiện: ${phuKienStr}.`;

    const res = await callGemini({
      vaiTro:
        "Bạn là Cò Em — người bạn đồng hành ấm áp, trầm tĩnh của Cò Em — Việt Phục Remix, xưng Cò Em gọi bạn.",
      context: promptContext,
      quyTac: [
        "Viết 1 đến 2 câu chú thích (caption) ngắn cho bộ trang phục khi người dùng cất vào Gùi Ký Ức.",
        "Giọng nhẹ nhàng, hoài niệm, thì thầm như lời kể một sớm mai hay chiều hội làng.",
        "Tuyệt đối KHÔNG thêm sự thật văn hóa mới, không bịa đặt niên đại lịch sử.",
        "Tối đa duy nhất 1 emoji nhẹ nhàng (như 🌾, ✨, 🏮, 🍃).",
        "Độ dài tối đa 140 ký tự.",
      ],
      cauHoi:
        'Gợi ý một chú thích ngắn để cất vào Gùi Ký Ức. Trả về định dạng JSON {"caption": "..."}.',
      schema: {
        type: "object",
        properties: {
          caption: {
            type: "string",
            description: "Câu chú thích 1-2 câu, tối đa 140 ký tự, tối đa 1 emoji",
          },
        },
        required: ["caption"],
      },
      nhietDo: 0.7,
    });

    if (res.ok && res.data && typeof res.data === "object") {
      const dataObj = res.data as { caption?: string };
      if (dataObj.caption && typeof dataObj.caption === "string") {
        return dataObj.caption.trim().slice(0, 140);
      }
    }
  } catch (err) {
    console.error("Lỗi gọi Gemini cho caption Gùi Ký Ức:", err);
  }

  // Yêu cầu: "lỗi thì để trống ô"
  return "";
}

/**
 * Xuất thẻ kỷ niệm PNG từ SVG qua Canvas:
 * (nhân vật + tên bộ đồ + chú thích + dòng "Đóm Dáng — Việt Phục Remix") và cho tải về.
 */
export async function xuatThePNG(params: {
  svgElement: SVGSVGElement;
  tenBoDo: string;
  moTaPhu?: string;
  caption: string;
  fileName?: string;
}): Promise<boolean> {
  const { svgElement, tenBoDo, moTaPhu, caption, fileName } = params;

  return new Promise((resolve) => {
    try {
      // 1. Nhân bản SVG và thiết lập namespace đầy đủ
      const clonedSvg = svgElement.cloneNode(true) as SVGSVGElement;
      clonedSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      clonedSvg.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");

      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(clonedSvg);
      const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);

      const img = new Image();
      img.onload = () => {
        // 2. Kích thước thẻ hình chữ nhật đứng (640 x 920)
        const canvas = document.createElement("canvas");
        const scale = 2; // Tăng nét cho màn hình Retina
        const width = 560;
        const height = 820;

        canvas.width = width * scale;
        canvas.height = height * scale;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          URL.revokeObjectURL(url);
          resolve(false);
          return;
        }

        ctx.scale(scale, scale);

        // a. Nền tối sơn mài (#1B2A2E)
        ctx.fillStyle = "#1B2A2E";
        ctx.fillRect(0, 0, width, height);

        // b. Khung viền kép màu vàng nghệ & đất nung
        ctx.strokeStyle = "rgba(217, 164, 65, 0.45)";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(18, 18, width - 36, height - 36);

        ctx.strokeStyle = "rgba(184, 75, 41, 0.35)";
        ctx.lineWidth = 1;
        ctx.strokeRect(24, 24, width - 48, height - 48);

        // c. Header nhỏ: GÙI KÝ ỨC · KỶ NIỆM VIỆT PHỤC
        ctx.fillStyle = "#D9A441";
        ctx.font = "600 11px 'Be Vietnam Pro', sans-serif";
        ctx.textAlign = "center";
        ctx.letterSpacing = "2px";
        ctx.fillText("✦ GÙI KÝ ỨC ✦", width / 2, 52);

        // d. Vẽ nhân vật SVG ở trung tâm
        // Kích thước vẽ nhân vật: 340 x 480
        const charW = 340;
        const charH = 470;
        const charX = (width - charW) / 2;
        const charY = 70;
        ctx.drawImage(img, charX, charY, charW, charH);

        // e. Tên bộ đồ
        ctx.fillStyle = "#D9A441";
        ctx.font = "bold 22px 'Noto Serif', serif, Georgia";
        ctx.textAlign = "center";
        ctx.fillText(tenBoDo, width / 2, 580);

        // f. Mô tả phụ (màu sắc, phụ kiện)
        if (moTaPhu) {
          ctx.fillStyle = "#8A8175";
          ctx.font = "500 13px 'Be Vietnam Pro', sans-serif";
          ctx.fillText(moTaPhu, width / 2, 608);
        }

        // g. Chú thích (Caption tối đa 140 ký tự)
        if (caption && caption.trim()) {
          ctx.fillStyle = "#F3ECDD";
          ctx.font = "italic 14px 'Be Vietnam Pro', sans-serif";
          // Tách dòng nếu dài
          const words = caption.trim().split(" ");
          let line = "";
          let lineY = 645;
          const maxLineWidth = width - 90;

          for (let i = 0; i < words.length; i++) {
            const testLine = line + words[i] + " ";
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxLineWidth && i > 0) {
              ctx.fillText(`"${line.trim()}"`, width / 2, lineY);
              line = words[i] + " ";
              lineY += 22;
            } else {
              line = testLine;
            }
          }
          if (line.trim()) {
            ctx.fillText(`"${line.trim()}"`, width / 2, lineY);
          }
        }

        // h. Dòng thương hiệu bắt buộc: "Đóm Dáng — Việt Phục Remix"
        ctx.fillStyle = "#D9A441";
        ctx.font = "600 13px 'Be Vietnam Pro', sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Đóm Dáng — Việt Phục Remix", width / 2, 755);

        // Dòng phụ chú thiết bị
        ctx.fillStyle = "#8A8175";
        ctx.font = "10px 'Be Vietnam Pro', sans-serif";
        ctx.fillText("Lưu giữ nếp áo di sản văn hóa Việt Nam", width / 2, 775);

        // 3. Chuyển canvas thành PNG và kích hoạt tải về
        const pngDataUrl = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        const safeName = (fileName || tenBoDo || "trang_phuc")
          .toLowerCase()
          .replace(/[^a-z0-9_]/gi, "_");
        downloadLink.download = `${safeName}_gui_ky_uc.png`;
        downloadLink.href = pngDataUrl;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        URL.revokeObjectURL(url);
        resolve(true);
      };

      img.onerror = (e) => {
        console.error("Lỗi vẽ SVG vào canvas:", e);
        URL.revokeObjectURL(url);
        resolve(false);
      };

      img.src = url;
    } catch (err) {
      console.error("Lỗi xuất thẻ PNG:", err);
      resolve(false);
    }
  });
}
