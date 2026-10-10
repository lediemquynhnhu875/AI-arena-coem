/**
 * loiKe — "Lời kể từ luật": người kể chuyện KHÔNG dùng AI.
 * Nguyên tắc:
 *  1) Chỉ ghép câu từ DỮ LIỆU CÓ NGUỒN (suThat, dip, nhóm, thoiTiet, mucRemix). Không có câu nào tự nghĩ ra.
 *  2) Đa dạng nhờ bộ mẫu câu + chọn xác định theo mã món đồ (cùng món → luôn cùng giọng, món khác → giọng khác).
 *  3) Thiếu dữ liệu thì im lặng phần đó, không lấp chỗ trống. Không bao giờ gọi mạng.
 *  4) Tự nhiên: câu ngắn, có khoảng lặng "...", xưng "Cò Em", gọi "bạn".
 */
export interface KeTrangPhuc {
  id: string;
  ten: string;
  moTaNgan?: string;
  suThat: string[];
  dip: string[];
  thoiTiet?: string[];
  nhomIds: string[];
  mucRemix?: string;
  nguonIds?: string[];
}
export interface KeCtx {
  nhomTen: (id: string) => string;               // id nhóm -> tên nhóm
  tenDip: Record<string, string>;                // id dịp -> tên dịp
  seed?: string;                                 // đổi seed để đổi giọng (mặc định: id món đồ)
}

/* băm chuỗi -> số nguyên ổn định */
function h(s: string): number {
  let x = 2166136261;
  for (let i = 0; i < s.length; i++) {
    x ^= s.charCodeAt(i);
    x = Math.imul(x, 16777619);
  }
  return x >>> 0;
}
const pick = <T,>(a: T[], k: string): T => a[h(k) % a.length];
const dsChu = (a: string[]) =>
  a.length <= 1 ? (a[0] ?? "") : a.slice(0, -1).join(", ") + " và " + a[a.length - 1];
const sach = (s: string) => s.trim().replace(/\s+/g, " ");

const MO = [
  (t: string) => `Cò Em kể bạn nghe về ${t}...`,
  (t: string) => `Ta cùng nhìn ${t} một chút nhé...`,
  (t: string) => `Đây là ${t}... và vài điều đáng nhớ về nó.`,
  (t: string) => `Chạm vào ${t}, Cò Em nhớ ra mấy điều...`,
];
const NOI = {
  vung: [
    (n: string, d: string) => `Bạn hay gặp nó ở ${n}${d ? `, trong những dịp như ${d}` : ""}.`,
    (n: string, d: string) => `Nó gắn với ${n}${d ? `, thường xuất hiện lúc ${d}` : ""}.`,
    (n: string, d: string) => `${n} là nơi người ta mặc nó nhiều${d ? `, nhất là ${d}` : ""}.`,
  ],
  dip: [
    (d: string) => `Bạn có thể mặc vào dịp ${d}.`,
    (d: string) => `Những dịp hợp với nó: ${d}.`,
  ],
  remix: {
    tu_do: [
      "Bạn cứ tự do cách tân quanh bộ này, Cò Em chỉ nhắc nhẹ khi có gì cần lưu ý.",
      "Bộ này khá thoáng: thêm bớt phụ kiện, đổi màu đều được.",
    ],
    co_dieu_kien: [
      "Khi phối lại, nên giữ nét chính của nó, và nhớ ghi nguồn cảm hứng nếu mượn họa tiết.",
      "Bạn phối lại được, chỉ cần giữ những nét làm nên diện mạo riêng của nó.",
    ],
  } as Record<string, string[]>,
  thoiTiet: (t: string) => `Theo gợi ý của đội, hợp nhất khi trời ${t}.`,
};
const TT: Record<string, string> = { nong: "nóng", mat: "mát", lanh: "lạnh", mua: "mưa" };
export const TT_LABEL: Record<string, string> = {
  nong: "Nắng nóng",
  mat: "Dịu mát",
  lanh: "Se lạnh",
  mua: "Mưa nhẹ",
};

/**
 * Định dạng hiển thị bắt buộc: luôn dùng dấu " - " giữa các phần:
 * "{Tên nơi} - {nhiệt độ}°C - {mô tả thời tiết}"
 * Ví dụ: "TP. Hồ Chí Minh - 31°C - Mưa nhẹ"
 * Khi có độ ẩm: "TP. Hồ Chí Minh - 31°C - Mưa nhẹ - Độ ẩm 78%"
 */
export function dinhDangThoiTietChuoi(o: {
  noi: string;
  nhietDo?: number;
  thoiTiet?: string;
  moTa?: string;
  doAm?: number;
  kemDoAm?: boolean;
}): string {
  const parts: string[] = [o.noi];
  if (o.nhietDo != null) {
    parts.push(`${Math.round(o.nhietDo)}°C`);
  }
  const rawMoTa = o.moTa || (o.thoiTiet ? TT_LABEL[o.thoiTiet] ?? TT[o.thoiTiet] ?? o.thoiTiet : "");
  if (rawMoTa) {
    const formatted = rawMoTa.charAt(0).toUpperCase() + rawMoTa.slice(1);
    parts.push(formatted);
  }
  if (o.kemDoAm && o.doAm != null) {
    parts.push(`Độ ẩm ${Math.round(o.doAm)}%`);
  }
  return parts.join(" - ");
}

/** Một Trang Đời: 3–5 dòng, mỗi dòng là một "nhịp" của trang sách. */
export function keTrangDoi(tp: KeTrangPhuc, ctx: KeCtx): { dong: string[]; nguonIds: string[] } {
  const key = ctx.seed ?? tp.id;
  const dong: string[] = [];
  dong.push(pick(MO, key + "mo")(tp.ten));
  // 1–2 dữ kiện NGUYÊN VĂN (xoay điểm bắt đầu để món khác nhau đọc khác nhau)
  const facts = (tp.suThat.length ? tp.suThat : tp.moTaNgan ? [tp.moTaNgan] : []).map(sach);
  if (facts.length) {
    const start = h(key + "f") % facts.length;
    dong.push(facts[start]);
    if (facts.length > 1) dong.push(facts[(start + 1) % facts.length]);
  }
  // dòng vùng/dịp (chỉ khi có dữ liệu)
  const nhoms = tp.nhomIds.map(ctx.nhomTen).filter(Boolean);
  const dips = tp.dip.map((d) => ctx.tenDip[d]).filter(Boolean);
  if (nhoms.length) dong.push(pick(NOI.vung, key + "v")(dsChu(nhoms.slice(0, 2)), dsChu(dips.slice(0, 2))));
  else if (dips.length) dong.push(pick(NOI.dip, key + "d")(dsChu(dips.slice(0, 3))));
  // remix (từ mucRemix) + thời tiết (từ thoiTiet)
  const r = tp.mucRemix && NOI.remix[tp.mucRemix];
  if (r) dong.push(pick(r, key + "r"));
  const tt = (tp.thoiTiet ?? []).map((t) => TT[t]).filter(Boolean);
  if (tt.length && h(key + "t") % 2 === 0) dong.push(NOI.thoiTiet(dsChu(tt)));
  return { dong, nguonIds: tp.nguonIds ?? [] };
}

/** Vải Có Gốc: ghi chú bên lề về làng nghề. */
export interface KeVai {
  id: string;
  ten: string;
  langNghe?: string;
  kyThuat?: string;
  suThat: string[];
}
export function keVaiCoGoc(v: KeVai): string[] {
  const s = v.id;
  const dong: string[] = [];
  const mo = [
    `${v.ten}${v.langNghe ? ` — ${v.langNghe}` : ""}.`,
    `Hãy dừng lại bên ${v.ten}${v.langNghe ? `, nơi ${v.langNghe}` : ""}...`,
    `${v.langNghe ? `${v.langNghe}: ` : ""}${v.ten}.`,
  ];
  dong.push(pick(mo, s + "m"));
  if (v.kyThuat) {
    dong.push(
      pick([`Cách làm: ${v.kyThuat.toLowerCase()}.`, `Bàn tay làm nên nó: ${v.kyThuat.toLowerCase()}.`], s + "k")
    );
  }
  v.suThat.map(sach).forEach((f) => dong.push(f));
  return dong;
}

/** Gợi ý theo thời tiết/dịp: câu giải thích ghép từ luật, không AI. */
export function keGoiYThoiTiet(o: {
  noi: string;
  nhietDo?: number;
  thoiTiet: string;
  khungGio?: string;
  soBo?: number;
  moTa?: string;
  doAm?: number;
  kemDoAm?: boolean;
}): string {
  const dau = dinhDangThoiTietChuoi(o);
  const y: Record<string, string[]> = {
    mua: ["Trời ướt... Cò Em nghiêng về những bộ gọn và dễ di chuyển."],
    nong: ["Trời nóng... Cò Em ưu tiên những bộ thoáng và nhẹ."],
    lanh: ["Trời lạnh... những bộ có nhiều lớp sẽ ấm hơn."],
    mat: ["Trời dịu... bạn được chọn khá thoải mái."],
  };
  const phanGoiY = o.soBo != null ? ` Có ${o.soBo} gợi ý cho bạn.` : "";
  const cauGoiY = pick(y[o.thoiTiet] ?? [""], o.noi + o.thoiTiet);
  return `${dau}. ${cauGoiY}${phanGoiY}`.trim();
}

/** Dòng dẫn ở đầu S2: ghép từ cảm hứng ban đầu, không AI, hiện ngay lập tức. */
export function keDongDanS2(o: {
  camHungList: string[];
  nhomTen: (id: string) => string;
  seed?: string;
}): string {
  if (o.camHungList.length === 0) {
    return "Mời bạn dạo ngắm những dáng áo truyền thống đa dạng từ khắp các vùng miền...";
  }
  const tenCacNhom = o.camHungList.map(o.nhomTen).filter(Boolean);
  const tenStr = dsChu(tenCacNhom);
  const mau = [
    `Từ những cảm hứng ban đầu bạn đã chọn ở ${tenStr}... Cò Em gợi ý những dáng áo này.`,
    `Nương theo nét đẹp của ${tenStr} mà bạn yêu thích... cùng Cò Em ngắm những nếp áo dưới đây nhé.`,
    `Gửi gắm chút hồn xưa từ ${tenStr}... đây là những dáng áo thân thuộc dành cho bạn.`,
  ];
  return pick(mau, (o.seed ?? o.camHungList.join("-")) + "s2");
}

/** Câu giải thích ngắn của huy hiệu hài hòa màu cấp 1 (câu 1 dòng, không AI, hiện ngay). */
export function keGiaiThichMauCap1(o: {
  ketQua: "hai_hoa" | "can_can_bang";
  tenMauChinh: string;
  tenMauPhu?: string;
  lyDoGoc?: string;
}): string {
  if (o.lyDoGoc && o.lyDoGoc.trim()) {
    return o.lyDoGoc.trim();
  }
  if (o.ketQua === "hai_hoa") {
    return `Sắc ${o.tenMauChinh}${o.tenMauPhu ? ` đi cùng ${o.tenMauPhu}` : ""} tạo nên nhịp chuyển màu êm ái, vừa mắt.`;
  }
  return `Cặp màu ${o.tenMauChinh}${o.tenMauPhu ? ` và ${o.tenMauPhu}` : ""} có độ tương phản mạnh, nên tiết chế tỷ lệ để tổng thể dịu lại.`;
}

export interface GiaiThichVanHoa3PhanInput {
  nhan: "chuan" | "sang_tao" | "can_xem_lai" | "chua_du_du_lieu" | string;
  tenTrangPhuc: string;
  tenPhuKienOrHoaVan?: string;
  boiCanhA?: string;
  boiCanhB?: string;
  lyDo: string;
  goiYThayThe?: string;
}

export interface KetQuaGiaiThich3Phan {
  dong1: string;
  dong2?: string;
  dong3: string;
  toanBo: string;
}

/**
 * Nâng cấp cảnh báo văn hóa theo khuôn 3 phần chuẩn từ loiKe.ts:
 * Dòng 1 (điều đang phối): "Bạn đang phối {A} với {B}."
 * Dòng 2 (bối cảnh từng bên, chỉ hiện nếu dữ liệu có): "{A} thường gắn với {bối cảnh A}; {B} thường gắn với {bối cảnh B}."
 * Dòng 3 (vì sao và gợi ý): lấy nguyên lyDo đã có trong luật, thêm gợi ý thay thế NẾU luật có trường goiYThayThe.
 * (Mức thứ tư "chua_du_du_lieu": "Tôi chưa có đủ căn cứ để nói rõ về tổ hợp này.")
 */
export function keGiaiThichNhanVanHoa3Phan(o: GiaiThichVanHoa3PhanInput): KetQuaGiaiThich3Phan {
  const tenA = o.tenTrangPhuc || "Trang phục";
  const tenB = o.tenPhuKienOrHoaVan || "phụ kiện tự chọn";

  // Dòng 1 (điều đang phối): "Bạn đang phối {A} với {B}."
  const dong1 = `Bạn đang phối ${tenA} với ${tenB}.`;

  // Dòng 2 (bối cảnh từng bên, chỉ hiện nếu dữ liệu có): "{A} thường gắn với {bối cảnh A}; {B} thường gắn với {bối cảnh B}."
  let dong2: string | undefined;
  if (o.boiCanhA && o.boiCanhB) {
    dong2 = `${tenA} thường gắn với ${o.boiCanhA}; ${tenB} thường gắn với ${o.boiCanhB}.`;
  } else if (o.boiCanhA) {
    dong2 = `${tenA} thường gắn với ${o.boiCanhA}.`;
  } else if (o.boiCanhB) {
    dong2 = `${tenB} thường gắn với ${o.boiCanhB}.`;
  }

  // Dòng 3 (vì sao và gợi ý):
  // Mức thứ tư: "chua_du_du_lieu" -> "Tôi chưa có đủ căn cứ để nói rõ về tổ hợp này."
  let dong3: string;
  if (o.nhan === "chua_du_du_lieu") {
    dong3 = "Tôi chưa có đủ căn cứ để nói rõ về tổ hợp này.";
  } else {
    dong3 = o.lyDo;
    if (o.goiYThayThe && o.goiYThayThe.trim()) {
      dong3 += ` Gợi ý thay thế: ${o.goiYThayThe.trim()}`;
    }
  }

  const lines = [dong1];
  if (dong2) lines.push(dong2);
  lines.push(dong3);

  return {
    dong1,
    dong2,
    dong3,
    toanBo: lines.join(" "),
  };
}

/** Câu giải thích ngắn của nhãn văn hóa cấp 1 */
export function keGiaiThichNhanVanHoaCap1(o: {
  nhan: "chuan" | "sang_tao" | "can_xem_lai" | "chua_du_du_lieu" | string;
  tenTrangPhuc: string;
  tenPhuKienOrHoaVan?: string;
  boiCanhA?: string;
  boiCanhB?: string;
  lyDoGoc?: string;
  goiYThayThe?: string;
}): string {
  return keGiaiThichNhanVanHoa3Phan({
    nhan: o.nhan,
    tenTrangPhuc: o.tenTrangPhuc,
    tenPhuKienOrHoaVan: o.tenPhuKienOrHoaVan,
    boiCanhA: o.boiCanhA,
    boiCanhB: o.boiCanhB,
    lyDo: o.lyDoGoc || "",
    goiYThayThe: o.goiYThayThe,
  }).toanBo;
}

/**
 * Tóm tắt trung lập so sánh các phương án (2 hoặc 3 bộ)
 * Tuyệt đối không chấm điểm, không xếp hạng 1-2-3, không nói phương án nào tốt hơn.
 * Khuôn: "Phương án {X} giữ nhiều nét nguyên bản hơn; phương án {Y} có mức thay đổi hiện đại cao hơn."
 */
export function keTomTatSoSanh(phuongAns: Array<{
  nhanCot: string;
  ten: string;
  mucTruyenThong: "Cao" | "Vừa";
  soPhuKienHienDai: number;
}>): string {
  if (phuongAns.length < 2) return "";

  const sortedByTradition = [...phuongAns].sort((a, b) => {
    if (a.mucTruyenThong === "Cao" && b.mucTruyenThong !== "Cao") return -1;
    if (b.mucTruyenThong === "Cao" && a.mucTruyenThong !== "Cao") return 1;
    return a.soPhuKienHienDai - b.soPhuKienHienDai;
  });

  const phuongAnNguyenBan = sortedByTradition[0];
  const phuongAnHienDai = sortedByTradition[sortedByTradition.length - 1];

  if (phuongAnNguyenBan.nhanCot === phuongAnHienDai.nhanCot) {
    return `Các phương án đều duy trì sự cân bằng hài hòa giữa nét đẹp truyền thống và phong cách riêng của bạn.`;
  }

  return `Phương án ${phuongAnNguyenBan.nhanCot} (${phuongAnNguyenBan.ten}) giữ nhiều nét nguyên bản hơn; phương án ${phuongAnHienDai.nhanCot} (${phuongAnHienDai.ten}) có mức thay đổi hiện đại cao hơn.`;
}

/** Lời chào cá nhân hóa ở S2 sau Quê Nhà: ghép theo dữ liệu cục bộ đã lưu, không gọi Gemini */
export function keLoiChaoCaNhanHoa(o: {
  ten: string;
  thoiTietChuoi?: string;
  tenBoDoGanNhat?: string;
  mauNhieuNhat?: string;
  nhomXemNhieuNhat?: string;
  fallbackDongDan?: string;
}): string {
  const chao = `Chào ${o.ten}...`;
  const phanThoiTiet = o.thoiTietChuoi ? ` Hôm nay ${o.thoiTietChuoi}.` : "";

  if (o.tenBoDoGanNhat) {
    return `${chao}${phanThoiTiet} Lần trước bạn dừng ở ${o.tenBoDoGanNhat}, muốn tiếp tục hay thử một hướng khác?`;
  }
  if (o.nhomXemNhieuNhat) {
    return `${chao}${phanThoiTiet} Hôm nay bạn muốn tiếp tục ngắm nếp áo ${o.nhomXemNhieuNhat} hay dạo sang vùng khác?`;
  }
  if (o.mauNhieuNhat) {
    return `${chao}${phanThoiTiet} Cò Em thấy bạn có nét duyên với sắc ${o.mauNhieuNhat}, cùng Cò Em dạo ngắm tiếp nhé.`;
  }
  if (o.fallbackDongDan) {
    return `${chao}${phanThoiTiet} ${o.fallbackDongDan}`;
  }
  return `${chao}${phanThoiTiet} Cùng Cò Em dạo ngắm những nếp áo truyền thống hôm nay nhé.`;
}

/** Gợi ý khám phá vùng văn hóa: so khớp giữa các vùng/nhóm và lịch sử đã lưu, không cần AI */
export function keGoiYVungChuaThu(o: {
  vungChuaThu?: { id: string; ten: string }[];
  vungDaLuuNhieu?: { id: string; ten: string; soBo: number };
}): string | null {
  if (o.vungDaLuuNhieu && o.vungChuaThu && o.vungChuaThu.length > 0) {
    return `Bạn đã lưu ${o.vungDaLuuNhieu.soBo} bộ ở vùng ${o.vungDaLuuNhieu.ten}. Bạn có muốn thử khám phá thêm vùng ${o.vungChuaThu[0].ten} chưa?`;
  }
  if (o.vungChuaThu && o.vungChuaThu.length > 0) {
    const dsTen = o.vungChuaThu.map((v) => v.ten).join(", ");
    return `Bạn chưa thử vùng ${dsTen}. Hãy dạo ngắm một vòng nhé!`;
  }
  if (o.vungDaLuuNhieu) {
    return `Bạn đã lưu ${o.vungDaLuuNhieu.soBo} bộ ở vùng ${o.vungDaLuuNhieu.ten}.`;
  }
  return null;
}

/** 8 lý do remix đặc tả ở S4 */
export const DANH_SACH_LY_DO_REMIX = [
  "trẻ trung hơn",
  "thoải mái hơn",
  "hiện đại hơn",
  "phù hợp đi học",
  "phù hợp đi chơi",
  "giữ nhiều nét truyền thống",
  "thể hiện cá tính",
  "phối cho nhóm bạn",
] as const;

export type LyDoRemix = typeof DANH_SACH_LY_DO_REMIX[number];

/**
 * Remix Có Lý Do (S4): Ghép câu hoàn toàn cục bộ từ loiKe.ts
 * Khuôn câu: "{Tên gốc} → giữ {phần giữ nguyên theo mucRemix} → đổi {màu/phụ kiện đã đổi so với mặc định} → để {lý do đã chọn}."
 */
export function keLyDoRemix(o: {
  tenTrangPhuc: string;
  mucRemix?: string;
  mauMacDinh?: string;
  mauHienTai?: string;
  phuKienMacDinh?: string[];
  phuKienHienTai?: string[];
  tenMauHienTai?: string;
  tenPhuKienThem?: string[];
  tenPhuKienBot?: string[];
  lyDoDaChon: string[];
}): string {
  // 1. {Tên gốc}
  const tenGoc = o.tenTrangPhuc;

  // 2. {phần giữ nguyên theo mucRemix}
  let phanGiuNguyen = "phom dáng cơ bản";
  if (o.mucRemix === "co_dieu_kien") {
    phanGiuNguyen = "nếp cổ truyền và kết cấu chính";
  } else if (o.mucRemix === "cam" || o.mucRemix === "giu_nguyen") {
    phanGiuNguyen = "toàn bộ quy chuẩn dáng cổ";
  } else if (o.mucRemix === "tu_do") {
    phanGiuNguyen = "tinh thần và đường nét nguyên bản";
  }

  // 3. {màu/phụ kiện đã đổi so với mặc định}
  const cacDoiMoi: string[] = [];
  if (o.mauMacDinh && o.mauHienTai && o.mauMacDinh !== o.mauHienTai && o.tenMauHienTai) {
    cacDoiMoi.push(`sắc ${o.tenMauHienTai}`);
  }
  if (o.tenPhuKienThem && o.tenPhuKienThem.length > 0) {
    cacDoiMoi.push(`thêm ${o.tenPhuKienThem.join(", ")}`);
  }
  if (o.tenPhuKienBot && o.tenPhuKienBot.length > 0) {
    cacDoiMoi.push(`bớt ${o.tenPhuKienBot.join(", ")}`);
  }

  const phanDoi = cacDoiMoi.length > 0 ? cacDoiMoi.join(" và ") : "phối sắc và phụ kiện tự chọn";

  // 4. {lý do đã chọn}
  const lyDoStr = o.lyDoDaChon.length > 0 ? o.lyDoDaChon.join(", ") : "thỏa niềm sáng tạo";

  return `${tenGoc} → giữ ${phanGiuNguyen} → đổi ${phanDoi} → để ${lyDoStr}.`;
}

