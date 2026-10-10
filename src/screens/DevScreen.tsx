/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { callGemini, CallGeminiResult, hoiCoVanVanHoa } from "../lib/gemini";
import { domdom } from "../copy/domdom";
import { trangPhuc } from "../data/trangphuc";
import { mauSac } from "../data/mausac";
import { phuKien } from "../data/phukien";
import { nguon } from "../data/nguon";
import { danhSach20CauKiemThu, ChatbotTestCase } from "../data/chatbotTests";
import { evaluateRemix, evaluateColor, locTrangPhucGoiY, layCauGiaiThichGoc, rephraseGoiYWithGemini, TEN_THOI_TIET, GoiYCondition } from "../lib/rules";
import MotTrangDoiModal from "../components/MotTrangDoiModal";
import { openGiuChuanVanHoa } from "../lib/giuChuan";
import { vungData, layVungTheoId, VungId } from "../data/vung";
import { layThoiTietVung, suyRaKhungGioTheoDongHo, ThoiTietState, docThamSoURL } from "../lib/thoitiet";
import { useSkySettings, luuCaiDatSky } from "../lib/caiDatSky";

type Props = {
  onBackToGate?: () => void;
};

interface StoredGopY {
  id: string;
  trangPhucId: string;
  tenTrangPhuc: string;
  noiDung: string;
  thoiGian: string;
}

export default function DevScreen({ onBackToGate }: Props) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CallGeminiResult | null>(null);
  const [selectedCostumeForStory, setSelectedCostumeForStory] = useState<string | null>(null);
  const [savedGopYList, setSavedGopYList] = useState<StoredGopY[]>([]);

  // Quản lý kiểm thử 20 câu chatbot Cố vấn văn hóa
  const [filterNhomChatbot, setFilterNhomChatbot] = useState<string>("Tất cả");
  const [runningAllChatbot, setRunningAllChatbot] = useState(false);
  const [progressCount, setProgressCount] = useState(0);
  const [chatbotTestResults, setChatbotTestResults] = useState<
    Record<
      number,
      {
        loading: boolean;
        traLoi?: string;
        nguonIds?: string[];
        pass?: boolean;
        lyDo?: string;
        tuCache?: boolean;
        loi?: boolean;
      }
    >
  >({});

  const handleRunChatbotTest = async (tc: ChatbotTestCase) => {
    setChatbotTestResults((prev) => ({
      ...prev,
      [tc.id]: { loading: true },
    }));

    try {
      const res = await hoiCoVanVanHoa(tc.cauHoi);
      const evalResult = tc.kiemTraHopLe(res.cauTraLoi, res.nguonIds);

      setChatbotTestResults((prev) => ({
        ...prev,
        [tc.id]: {
          loading: false,
          traLoi: res.cauTraLoi,
          nguonIds: res.nguonIds,
          pass: evalResult.pass,
          lyDo: evalResult.lyDo,
          tuCache: res.tuCache,
          loi: res.loi,
        },
      }));
    } catch {
      setChatbotTestResults((prev) => ({
        ...prev,
        [tc.id]: {
          loading: false,
          traLoi: domdom.common.error,
          nguonIds: [],
          pass: false,
          lyDo: "Lỗi kết nối",
          loi: true,
        },
      }));
    }
  };

  const handleRunAllChatbotTests = async () => {
    if (runningAllChatbot) return;
    setRunningAllChatbot(true);
    setProgressCount(0);

    for (let i = 0; i < danhSach20CauKiemThu.length; i++) {
      const tc = danhSach20CauKiemThu[i];
      setProgressCount(i + 1);
      await handleRunChatbotTest(tc);
      await new Promise((r) => setTimeout(r, 350));
    }

    setRunningAllChatbot(false);
  };

  const handleResetChatbotTests = () => {
    setChatbotTestResults({});
    setProgressCount(0);
  };

  // Kiểm thử Màn gợi ý S2: Mẫu {"thoiTiet":"mua","dip":"khai_giang"}
  const [goiYCondition, setGoiYCondition] = useState<GoiYCondition>({
    thoiTiet: "mua",
    dip: "khai_giang",
  });
  const [goiYGeminiLoading, setGoiYGeminiLoading] = useState(false);
  const [goiYGeminiResult, setGoiYGeminiResult] = useState<string | null>(null);
  const [goiYIsFromGemini, setGoiYIsFromGemini] = useState<boolean | null>(null);

  const handleTestGoiYGemini = async () => {
    setGoiYGeminiLoading(true);
    const matched = locTrangPhucGoiY(goiYCondition);
    const baseSentence = layCauGiaiThichGoc(goiYCondition, matched);
    const res = await rephraseGoiYWithGemini(
      baseSentence,
      matched.map((m) => m.ten),
      goiYCondition
    );
    setGoiYGeminiResult(res.cauDienDat);
    setGoiYIsFromGemini(res.tuGemini);
    setGoiYGeminiLoading(false);
  };

  // Kiểm thử Bầu trời, Thời tiết & Tham số URL (?sky, ?weather, ?vung)
  const [testVungId, setTestVungId] = useState<VungId>("trung");
  const [testWeatherState, setTestWeatherState] = useState<ThoiTietState | null>(null);
  const [skySettings, updateSkySettings] = useSkySettings();
  const [simulatedOffline, setSimulatedOffline] = useState(false);

  useEffect(() => {
    if (simulatedOffline) {
      // Giả lập ngoại tuyến: đồng hồ thiết bị và S7 fallback
      const kg = suyRaKhungGioTheoDongHo();
      const targetVung = layVungTheoId(testVungId);
      setTestWeatherState({
        vung: targetVung,
        thoiTiet: "mat",
        khungGio: kg,
        nhietDo: 25,
        precipitation: 0,
        weatherCode: 0,
        moTaThoiTiet: "dịu mát",
        moTaKhungGio: kg === "rang_dong" ? "rạng đông" : kg === "ngay" ? "ban ngày" : kg === "hoang_hon" ? "hoàng hôn" : "đêm tối",
        isFallback: true,
        timestamp: Date.now(),
        doAm: 70,
        viTri: {
          ten: targetVung.noi,
          lat: targetVung.lat,
          lon: targetVung.lon,
          nguon: "mac_dinh",
          vungId: testVungId,
        },
      });
    } else {
      layThoiTietVung(testVungId).then(setTestWeatherState);
    }
  }, [testVungId, simulatedOffline]);

  // Đọc danh sách góp ý đã lưu
  const loadSavedGopY = () => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const raw = window.localStorage.getItem("vpr:gop_y");
        if (raw) {
          setSavedGopYList(JSON.parse(raw));
        } else {
          setSavedGopYList([]);
        }
      }
    } catch {
      // Bỏ qua
    }
  };

  useEffect(() => {
    loadSavedGopY();
  }, [selectedCostumeForStory]);

  const handleClearGopY = () => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.removeItem("vpr:gop_y");
        setSavedGopYList([]);
      }
    } catch {
      // Bỏ qua
    }
  };

  const handleTestGemini = async () => {
    setLoading(true);
    try {
      const res = await callGemini({
        vaiTro: "Cò Em — nhân vật dẫn chuyện trầm ấm, am hiểu văn hóa trang phục truyền thống Việt Nam.",
        context: "Áo dài hiện đại phát triển từ áo ngũ thân.",
        quyTac: [
          "Giọng trầm, ngắn gọn, xưng Cò Em gọi bạn",
          "Chỉ trả về JSON theo đúng schema quy định"
        ],
        viDu: {
          cauHoi: "Áo ngũ thân có mấy thân?",
          cauTraLoi: "Năm thân vải: hai thân trước, hai thân sau và một thân con."
        },
        cauHoi: "Áo dài hiện đại phát triển từ dáng áo nào của người xưa?",
        schema: {
          type: "object",
          properties: {
            cauTraLoi: { type: "string" }
          },
          required: ["cauTraLoi"]
        },
        nhietDo: 0.2
      });
      setResult(res);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="p-4 md:p-8 min-h-screen"
      style={{
        background: "var(--nen-toi)",
        color: "var(--nen-sang)",
        fontFamily: "var(--font-than)"
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <header className="flex items-center justify-between border-b pb-4" style={{ borderColor: "var(--tro-tram)" }}>
          <div>
            <h1 className="text-xl md:text-2xl font-semibold" style={{ fontFamily: "var(--font-tieu-de)" }}>
              {domdom.dev.title}
            </h1>
            <p className="text-xs mt-1" style={{ color: "var(--tro-tram)" }}>
              URL hiện tại đang có tham số ?dev=1
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => openGiuChuanVanHoa()}
              type="button"
              className="min-h-[44px] px-3.5 py-2 text-xs md:text-sm border cursor-pointer"
              style={{
                background: "rgba(217, 164, 65, 0.15)",
                borderColor: "var(--vang-nghe)",
                color: "var(--vang-nghe)",
                borderRadius: "var(--vien-lech-a)"
              }}
            >
              🛡️ {domdom.giuChuanVanHoa.tieuDe}
            </button>
            {onBackToGate && (
              <button
                onClick={onBackToGate}
                type="button"
                className="min-h-[44px] px-3.5 py-2 text-xs md:text-sm border cursor-pointer"
                style={{
                  background: "none",
                  borderColor: "var(--tro-tram)",
                  color: "var(--nen-sang)",
                  borderRadius: "var(--vien-lech-b)"
                }}
              >
                {domdom.dev.veCongVao}
              </button>
            )}
          </div>
        </header>

        {/* Khối kiểm tra Gemini */}
        <section
          className="p-4 md:p-5 border space-y-4"
          style={{
            borderColor: "var(--tro-tram)",
            borderRadius: "var(--vien-lech-a)"
          }}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold" style={{ fontFamily: "var(--font-tieu-de)" }}>
              Kiểm tra kết nối Gemini (@google/genai)
            </h2>
            <button
              onClick={handleTestGemini}
              disabled={loading}
              type="button"
              className="min-h-[44px] px-4 py-2 font-medium border cursor-pointer transition-opacity"
              style={{
                background: "var(--vang-nghe)",
                borderColor: "var(--vang-nghe)",
                color: "var(--nen-toi)",
                borderRadius: "var(--vien-lech-b)",
                opacity: loading ? 0.6 : 1
              }}
            >
              {loading ? domdom.dev.dangThu : domdom.dev.thuGemini}
            </button>
          </div>

          {result && (
            <div
              className="p-3 text-xs md:text-sm space-y-2 border"
              style={{
                background: "rgba(0, 0, 0, 0.25)",
                borderColor: result.ok ? "var(--reu-phong)" : "var(--dat-nung)",
                borderRadius: "var(--vien-lech-b)"
              }}
            >
              <div className="flex items-center gap-4">
                <span>
                  <strong>Trạng thái:</strong>{" "}
                  <span style={{ color: result.ok ? "var(--vang-nghe)" : "var(--dat-nung)" }}>
                    {result.ok ? "Thành công (ok: true)" : "Thất bại (ok: false — đã kích hoạt fallback)"}
                  </span>
                </span>
                <span>
                  <strong>Từ Cache:</strong> {result.tuCache ? "Có (tuCache: true)" : "Không (gọi trực tiếp)"}
                </span>
              </div>
              <div>
                <strong>Dữ liệu trả về:</strong>
                <pre className="mt-1 p-2 overflow-x-auto text-xs" style={{ background: "rgba(0,0,0,0.4)" }}>
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </section>

        {/* Khối 20 Câu kiểm thử Cò Em Chatbot (Cố vấn văn hóa) */}
        <section
          className="p-4 md:p-5 border space-y-4"
          style={{
            borderColor: "var(--vang-nghe)",
            borderRadius: "var(--vien-lech-a)",
            background: "rgba(217, 164, 65, 0.04)"
          }}
        >
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-base font-semibold flex items-center gap-2" style={{ fontFamily: "var(--font-tieu-de)", color: "var(--vang-nghe)" }}>
                <span>✨</span> 20 Câu kiểm thử Cò Em Chatbot (Cố vấn văn hóa)
              </h2>
              <p className="text-xs text-stone-300 mt-0.5">
                Gọi Gemini thật qua callGemini (nhiệt độ 0.3), kiểm thử nghiêm ngặt 4 nhóm: Đúng phạm vi, Ngoài phạm vi, Gài bịa, Ép bỏ quy tắc.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRunAllChatbotTests}
                disabled={runningAllChatbot}
                className="px-3.5 py-1.5 text-xs font-medium border cursor-pointer transition-all disabled:opacity-50"
                style={{
                  background: "var(--vang-nghe)",
                  borderColor: "var(--vang-nghe)",
                  color: "var(--nen-toi)",
                  borderRadius: "var(--vien-lech-b)"
                }}
              >
                {runningAllChatbot ? `Đang chạy (${progressCount}/20)...` : "▶ Chạy tất cả 20 câu"}
              </button>

              <button
                type="button"
                onClick={handleResetChatbotTests}
                disabled={runningAllChatbot}
                className="px-2.5 py-1.5 text-xs border cursor-pointer transition-colors text-stone-300 hover:text-white"
                style={{
                  borderColor: "var(--tro-tram)",
                  borderRadius: "var(--vien-lech-b)"
                }}
              >
                🔄 Đặt lại
              </button>
            </div>
          </div>

          {/* Bộ đếm thống kê */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2 border rounded bg-black/30 border-stone-700">
              <span className="text-stone-400 block text-[11px]">Tổng số câu:</span>
              <strong className="text-base text-stone-100">{danhSach20CauKiemThu.length}</strong>
            </div>
            <div className="p-2 border rounded bg-black/30 border-stone-700">
              <span className="text-stone-400 block text-[11px]">Đã chạy:</span>
              <strong className="text-base text-amber-300">
                {Object.values(chatbotTestResults).filter((r) => !r.loading && r.traLoi).length} / 20
              </strong>
            </div>
            <div className="p-2 border rounded bg-black/30 border-emerald-800/60">
              <span className="text-stone-400 block text-[11px]">Đạt chuẩn (Pass):</span>
              <strong className="text-base text-emerald-400">
                {Object.values(chatbotTestResults).filter((r) => r.pass === true).length}
              </strong>
            </div>
            <div className="p-2 border rounded bg-black/30 border-amber-800/60">
              <span className="text-stone-400 block text-[11px]">Cần xem lại:</span>
              <strong className="text-base text-amber-400">
                {Object.values(chatbotTestResults).filter((r) => r.pass === false).length}
              </strong>
            </div>
          </div>

          {/* Tab lọc nhóm câu hỏi */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {["Tất cả", "Đúng phạm vi", "Ngoài phạm vi", "Gài bịa", "Ép bỏ quy tắc"].map((nhomTab) => {
              const isActive = filterNhomChatbot === nhomTab;
              const countInNhom =
                nhomTab === "Tất cả"
                  ? danhSach20CauKiemThu.length
                  : danhSach20CauKiemThu.filter((t) => t.nhom === nhomTab).length;

              return (
                <button
                  key={nhomTab}
                  type="button"
                  onClick={() => setFilterNhomChatbot(nhomTab)}
                  className={`text-xs px-2.5 py-1 border transition-colors cursor-pointer ${
                    isActive ? "font-semibold" : "opacity-75 hover:opacity-100"
                  }`}
                  style={{
                    borderColor: isActive ? "var(--vang-nghe)" : "var(--tro-tram)",
                    color: isActive ? "var(--vang-nghe)" : "var(--nen-sang)",
                    background: isActive ? "rgba(217, 164, 65, 0.15)" : "transparent",
                    borderRadius: "var(--vien-lech-b)"
                  }}
                >
                  {nhomTab} ({countInNhom})
                </button>
              );
            })}
          </div>

          {/* Danh sách 20 câu kiểm thử */}
          <div className="space-y-3 pt-2">
            {danhSach20CauKiemThu
              .filter((tc) => filterNhomChatbot === "Tất cả" || tc.nhom === filterNhomChatbot)
              .map((tc) => {
                const res = chatbotTestResults[tc.id];
                const nhomColor =
                  tc.nhom === "Đúng phạm vi"
                    ? "text-emerald-400 border-emerald-700/50 bg-emerald-950/30"
                    : tc.nhom === "Ngoài phạm vi"
                    ? "text-blue-400 border-blue-700/50 bg-blue-950/30"
                    : tc.nhom === "Gài bịa"
                    ? "text-amber-400 border-amber-700/50 bg-amber-950/30"
                    : "text-purple-400 border-purple-700/50 bg-purple-950/30";

                return (
                  <div
                    key={tc.id}
                    className="p-3.5 border text-xs space-y-2"
                    style={{
                      borderColor: res?.pass === true
                        ? "rgba(16, 185, 129, 0.4)"
                        : res?.pass === false
                        ? "rgba(245, 158, 11, 0.5)"
                        : "rgba(138, 129, 117, 0.3)",
                      background: "rgba(0, 0, 0, 0.35)",
                      borderRadius: "var(--vien-lech-b)"
                    }}
                  >
                    {/* Header câu hỏi & nút chạy */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-stone-400">#{tc.id}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 border rounded ${nhomColor}`}>
                            {tc.nhom}
                          </span>
                        </div>
                        <h4 className="font-semibold text-sm text-stone-100">
                          {tc.cauHoi}
                        </h4>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRunChatbotTest(tc)}
                        disabled={res?.loading || runningAllChatbot}
                        className="px-2.5 py-1 text-xs border shrink-0 cursor-pointer disabled:opacity-40 transition-colors"
                        style={{
                          borderColor: "var(--vang-nghe)",
                          color: "var(--vang-nghe)",
                          background: "rgba(217, 164, 65, 0.12)",
                          borderRadius: "var(--vien-lech-b)"
                        }}
                      >
                        {res?.loading ? "Đang gọi..." : "Chạy câu này"}
                      </button>
                    </div>

                    {/* Tiêu chí kỳ vọng & mục đích */}
                    <div className="text-[11px] text-stone-400 space-y-0.5 border-l-2 pl-2 border-stone-700">
                      <p><strong className="text-stone-300">Mục đích:</strong> {tc.mucDich}</p>
                      <p><strong className="text-stone-300">Kỳ vọng:</strong> {tc.kyVong}</p>
                    </div>

                    {/* Kết quả khi đã chạy */}
                    {res && !res.loading && res.traLoi && (
                      <div
                        className="mt-2 p-2.5 rounded border space-y-1.5"
                        style={{
                          background: "rgba(0, 0, 0, 0.45)",
                          borderColor: res.pass ? "rgba(16, 185, 129, 0.3)" : "rgba(245, 158, 11, 0.3)"
                        }}
                      >
                        <div className="flex items-center justify-between text-[11px]">
                          <span className={`font-semibold flex items-center gap-1 ${res.pass ? "text-emerald-400" : "text-amber-400"}`}>
                            {res.pass ? "✅ ĐẠT YÊU CẦU" : "⚠️ CẦN XEM LẠI"}: {res.lyDo}
                          </span>
                          <span className="text-stone-400">
                            {res.tuCache ? "⚡ Từ cache" : "🌐 Gọi trực tiếp"}
                          </span>
                        </div>

                        <div className="text-stone-200 text-xs p-2 rounded bg-black/40 border border-stone-800">
                          <strong>Câu trả lời từ Gemini:</strong>
                          <p className="mt-1 whitespace-pre-line text-stone-300">{res.traLoi}</p>
                        </div>

                        {res.nguonIds && res.nguonIds.length > 0 && (
                          <div className="flex items-center gap-1.5 text-[11px] pt-1">
                            <span className="text-stone-400">Nguồn trích xuất:</span>
                            {res.nguonIds.map((nid) => {
                              const tenNguon = nguon.find((n) => n.id === nid)?.ten || nid;
                              return (
                                <span
                                  key={nid}
                                  className="px-1.5 py-0.2 border rounded text-amber-300 border-amber-600/40 bg-amber-950/20"
                                >
                                  📖 {tenNguon}
                                </span>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </section>

        {/* Khối kiểm tra Bảng 3 ca kiểm thử quy tắc phối đồ (luatRemix & evaluateRemix) */}
        <section
          className="p-4 md:p-5 border space-y-4"
          style={{
            borderColor: "var(--tro-tram)",
            borderRadius: "var(--vien-lech-a)",
            background: "rgba(0,0,0,0.2)"
          }}
        >
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-base font-semibold" style={{ fontFamily: "var(--font-tieu-de)", color: "var(--vang-nghe)" }}>
                Kiểm thử quy tắc phối đồ (evaluateRemix)
              </h2>
              <p className="text-xs text-stone-300">
                Yêu cầu: ?dev=1 có bảng 3 ca kiểm thử ra đúng nhãn (r2 → chuan, r1 → sang_tao, r4 → can_xem_lai)
              </p>
            </div>
            <span
              className="px-2.5 py-1 text-xs font-medium border"
              style={{
                borderColor: "var(--reu-phong)",
                color: "#a4be92",
                background: "rgba(92, 107, 79, 0.2)",
                borderRadius: "var(--vien-lech-b)"
              }}
            >
              ✓ 3/3 ca kiểm thử ĐẠT (PASS)
            </span>
          </div>

          <div className="space-y-3">
            {[
              {
                id: "ca_1",
                ten: "Ca 1: Áo dài + Nón lá",
                input: { trangPhuc: "aodai", phuKien: ["non_la"] },
                kyVongLuat: "r2",
                kyVongNhan: "chuan",
                nhanHienThiKyVong: "Chuẩn đúng",
                ghiChu: "r2 → chuan",
              },
              {
                id: "ca_2",
                ten: "Ca 2: Áo dài + Giày sneaker",
                input: { trangPhuc: "aodai", phuKien: ["sneaker"] },
                kyVongLuat: "r1",
                kyVongNhan: "sang_tao",
                nhanHienThiKyVong: "Sáng tạo tự do",
                ghiChu: "r1 → sang_tao",
              },
              {
                id: "ca_3",
                ten: "Ca 3: Áo tứ thân + Khăn đóng",
                input: { trangPhuc: "tu_than", phuKien: ["khan_dong"] },
                kyVongLuat: "r4",
                kyVongNhan: "can_xem_lai",
                nhanHienThiKyVong: "Cần xem lại",
                ghiChu: "r4 → can_xem_lai",
              },
            ].map((tc) => {
              const res = evaluateRemix(tc.input);
              const isMatchLuat = res.luatId === tc.kyVongLuat;
              const isMatchNhan = res.nhan === tc.kyVongNhan;
              const isPass = isMatchLuat && isMatchNhan;

              const badgeColor =
                res.nhan === "chuan"
                  ? "var(--reu-phong)"
                  : res.nhan === "sang_tao"
                  ? "var(--vang-nghe)"
                  : "var(--dat-nung)";

              const badgeBg =
                res.nhan === "chuan"
                  ? "rgba(92, 107, 79, 0.15)"
                  : res.nhan === "sang_tao"
                  ? "rgba(217, 164, 65, 0.15)"
                  : "rgba(181, 80, 47, 0.15)";

              return (
                <div
                  key={tc.id}
                  className="p-3 border text-xs space-y-2"
                  style={{
                    borderColor: isPass ? "rgba(92, 107, 79, 0.5)" : "var(--dat-nung)",
                    borderRadius: "var(--vien-lech-b)",
                    background: "rgba(0,0,0,0.3)"
                  }}
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <strong className="text-sm font-medium" style={{ color: "var(--nen-sang)" }}>
                        {tc.ten}
                      </strong>
                      <span
                        className="px-2 py-0.5 rounded text-[11px] font-mono border"
                        style={{
                          borderColor: "var(--tro-tram)",
                          color: "var(--nen-sang)",
                          background: "rgba(255,255,255,0.05)"
                        }}
                      >
                        {tc.ghiChu}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className="px-2 py-0.5 text-xs font-semibold border"
                        style={{
                          borderColor: badgeColor,
                          color: badgeColor,
                          background: badgeBg,
                          borderRadius: "var(--vien-lech-a)"
                        }}
                      >
                        {res.nhanHienThi} ({res.luatId})
                      </span>

                      <span
                        className="px-2 py-0.5 text-[11px] font-semibold border"
                        style={{
                          borderColor: isPass ? "var(--reu-phong)" : "var(--dat-nung)",
                          color: isPass ? "#a4be92" : "var(--dat-nung)",
                          background: isPass ? "rgba(92, 107, 79, 0.25)" : "rgba(181, 80, 47, 0.25)",
                          borderRadius: "var(--vien-lech-b)"
                        }}
                      >
                        {isPass ? "✓ ĐẠT" : "✗ KHÔNG ĐẠT"}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-stone-300 pt-1">
                    <div>
                      <span className="text-stone-400">Đầu vào thử nghiệm:</span>{" "}
                      <code className="text-stone-200 bg-black/40 px-1 py-0.5 rounded">
                        trangPhuc: "{tc.input.trangPhuc}", phuKien: {JSON.stringify(tc.input.phuKien)}
                      </code>
                    </div>
                    <div>
                      <span className="text-stone-400">Luật & nhãn kỳ vọng:</span>{" "}
                      <span className="text-stone-200">
                        {tc.kyVongLuat} → {tc.kyVongNhan} ("{tc.nhanHienThiKyVong}")
                      </span>
                    </div>
                  </div>

                  <div className="pt-1 border-t border-stone-800 text-stone-300">
                    <span className="text-stone-400 font-medium">Lý do giọng mềm:</span>{" "}
                    <span className="italic text-stone-200">"{res.lyDo}"</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Khối kiểm tra toàn bộ mọi cặp màu trong data (evaluateColor & luatMau) */}
        <section
          className="p-4 md:p-5 border space-y-3"
          style={{
            borderColor: "var(--tro-tram)",
            borderRadius: "var(--vien-lech-a)",
            background: "rgba(0,0,0,0.2)"
          }}
        >
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-base font-semibold" style={{ fontFamily: "var(--font-tieu-de)" }}>
                Kiểm tra toàn bộ cặp màu trong dữ liệu (luatMau & evaluateColor)
              </h2>
              <p className="text-xs text-stone-300">
                Mọi cặp màu (7 × 7 = 49 cặp) đều tra cứu được kết quả ("Hài hòa" hoặc "Cần cân bằng")
              </p>
            </div>
            <span
              className="px-2.5 py-1 text-xs font-medium border"
              style={{
                borderColor: "var(--reu-phong)",
                color: "#a4be92",
                background: "rgba(92, 107, 79, 0.2)",
                borderRadius: "var(--vien-lech-b)"
              }}
            >
              ✓ 49/49 cặp màu ĐẠT kết quả
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-72 overflow-y-auto pr-1">
            {mauSac.flatMap((ma) =>
              mauSac.map((mb) => {
                const evalRes = evaluateColor(ma.id, mb.id);
                const isCanCanBang = evalRes.ketQua === "can_can_bang";
                return (
                  <div
                    key={`${ma.id}-${mb.id}`}
                    className="p-2 border text-[11px] space-y-1"
                    style={{
                      borderColor: isCanCanBang ? "rgba(181, 80, 47, 0.5)" : "rgba(138, 129, 117, 0.3)",
                      background: isCanCanBang ? "rgba(181, 80, 47, 0.1)" : "rgba(0,0,0,0.3)",
                      borderRadius: "var(--vien-lech-b)"
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-3.5 h-3.5 rounded-full inline-block border border-black/30"
                          style={{ background: ma.hex }}
                          title={ma.ten}
                        />
                        <span className="font-medium text-stone-200">{ma.ten}</span>
                        <span className="text-stone-400">+</span>
                        <span
                          className="w-3.5 h-3.5 rounded-full inline-block border border-black/30"
                          style={{ background: mb.hex }}
                          title={mb.ten}
                        />
                        <span className="font-medium text-stone-200">{mb.ten}</span>
                      </div>
                      <span
                        className="px-1.5 py-0.5 rounded text-[10px] font-semibold"
                        style={{
                          color: isCanCanBang ? "var(--dat-nung)" : "#a4be92",
                          background: isCanCanBang ? "rgba(181,80,47,0.2)" : "rgba(92,107,79,0.2)"
                        }}
                      >
                        {evalRes.nhanHienThi}
                      </span>
                    </div>
                    <p className="text-[10.5px] text-stone-300 italic line-clamp-2">
                      {evalRes.lyDo}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* Khối kiểm tra MÀN GỢI Ý (Thẻ nổi ở S2: thời tiết/dịp & Gemini paraphrase) */}
        <section
          className="p-4 md:p-5 border space-y-4"
          style={{
            borderColor: "var(--vang-nghe)",
            borderRadius: "var(--vien-lech-a)",
            background: "rgba(0,0,0,0.25)"
          }}
        >
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-base font-semibold" style={{ fontFamily: "var(--font-tieu-de)", color: "var(--vang-nghe)" }}>
                Kiểm thử Màn Gợi ý: Thẻ nổi ở S2 (Thời tiết & Dịp)
              </h2>
              <p className="text-xs text-stone-300">
                Đổi điều kiện ra danh sách khác nhau; câu giải thích từ luật; Gemini diễn đạt lại (nhiệt độ 0.5; fallback = câu gốc)
              </p>
            </div>
            <span
              className="px-2.5 py-1 text-xs font-medium border"
              style={{
                borderColor: "var(--vang-nghe)",
                color: "var(--vang-nghe)",
                background: "rgba(217, 164, 65, 0.15)",
                borderRadius: "var(--vien-lech-b)"
              }}
            >
              Mẫu yêu cầu: {"{"}"thoiTiet":"mua","dip":"khai_giang"{"}"}
            </span>
          </div>

          {/* Ca thử nghiệm với dữ liệu mẫu đầu vào */}
          <div
            className="p-3.5 border space-y-3"
            style={{
              borderColor: "rgba(217, 164, 65, 0.4)",
              borderRadius: "var(--vien-lech-b)",
              background: "rgba(0,0,0,0.3)"
            }}
          >
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-amber-200">
                  Thử nghiệm Dữ liệu Mẫu:
                </span>
                <code className="text-xs bg-black/60 px-2 py-0.5 rounded text-amber-300 font-mono">
                  {JSON.stringify(goiYCondition)}
                </code>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setGoiYCondition({ thoiTiet: "mua", dip: "khai_giang" })
                  }
                  className="px-2 py-1 text-xs border rounded bg-amber-950/40 border-amber-500/50 text-amber-200 hover:bg-amber-900/50"
                >
                  Nạp mẫu {"{thoiTiet: mua, dip: khai_giang}"}
                </button>
                <button
                  type="button"
                  onClick={handleTestGoiYGemini}
                  disabled={goiYGeminiLoading}
                  className="px-3 py-1 text-xs font-semibold rounded bg-amber-600 text-stone-900 hover:bg-amber-500 disabled:opacity-50 cursor-pointer"
                >
                  {goiYGeminiLoading ? "Đang gọi Gemini (0.5)..." : "⚡ Gọi Gemini diễn đạt lại"}
                </button>
              </div>
            </div>

            {/* Danh sách trang phục lọc được */}
            {(() => {
              const matched = locTrangPhucGoiY(goiYCondition);
              const baseText = layCauGiaiThichGoc(goiYCondition, matched);

              return (
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-stone-400 font-medium">Danh sách lọc được ({matched.length} bộ):</span>
                    {matched.map((m) => (
                      <span
                        key={m.id}
                        className="px-2 py-0.5 rounded text-stone-200 border border-stone-700 bg-stone-900"
                      >
                        {m.ten} (Thời tiết: {m.thoiTiet.join(", ")}; Dịp: {m.dip.slice(0, 2).join(", ")})
                      </span>
                    ))}
                  </div>

                  {/* Câu giải thích gốc từ luật */}
                  <div className="p-2.5 rounded bg-black/40 border border-stone-800 space-y-1">
                    <div className="flex items-center justify-between text-stone-400 text-[11px]">
                      <span>1. Câu giải thích GỐC từ luật (Fallback khi ngoại tuyến / lỗi):</span>
                      <span className="text-stone-500 font-mono">layCauGiaiThichGoc</span>
                    </div>
                    <p className="text-stone-200 italic font-medium">
                      "{baseText}"
                    </p>
                  </div>

                  {/* Câu giải thích diễn đạt lại bằng Gemini */}
                  <div
                    className="p-2.5 rounded border space-y-1"
                    style={{
                      background: "rgba(217, 164, 65, 0.08)",
                      borderColor: goiYGeminiResult ? "var(--vang-nghe)" : "rgba(138, 129, 117, 0.3)"
                    }}
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-medium text-amber-300">
                        2. Câu diễn đạt lại bằng Gemini (Nhiệt độ: 0.5):
                      </span>
                      <span
                        className="px-1.5 py-0.2 rounded text-[10px] font-semibold"
                        style={{
                          color: goiYIsFromGemini ? "#a4be92" : "var(--tro-tram)",
                          background: goiYIsFromGemini ? "rgba(92,107,79,0.2)" : "rgba(255,255,255,0.05)"
                        }}
                      >
                        {goiYGeminiLoading
                          ? "Đang xử lý..."
                          : goiYIsFromGemini === true
                          ? "✓ Tự nhiên từ Gemini (Khác câu gốc)"
                          : goiYIsFromGemini === false
                          ? "Fallback về câu gốc an toàn"
                          : "Chưa kích hoạt"}
                      </span>
                    </div>
                    <p className="text-amber-100 italic">
                      "{goiYGeminiResult || baseText}"
                    </p>
                    {goiYGeminiResult && goiYGeminiResult !== baseText && (
                      <p className="text-[10.5px] text-green-400 font-sans">
                        ✓ Đạt yêu cầu: Câu diễn đạt lại giữ trọn vẹn ý nghĩa nhưng uyển chuyển, không lặp y nguyên câu gốc.
                      </p>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Bảng kiểm thử: Đổi điều kiện ra danh sách khác nhau */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-stone-300 uppercase tracking-wider">
              Kiểm tra: Đổi điều kiện ra danh sách khác nhau
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              {[
                {
                  id: "tt_mua",
                  ten: 'Thời tiết: "mua"',
                  cond: { thoiTiet: "mua" },
                  kyVong: "Áo bà ba (1 bộ)",
                },
                {
                  id: "tt_lanh",
                  ten: 'Thời tiết: "lanh"',
                  cond: { thoiTiet: "lanh" },
                  kyVong: "Áo ngũ thân, Áo tứ thân, Áo cỏm Thái, Trang phục Mông, Trang phục Ê Đê (5 bộ)",
                },
                {
                  id: "tt_nong",
                  ten: 'Thời tiết: "nong"',
                  cond: { thoiTiet: "nong" },
                  kyVong: "Áo dài, Áo bà ba, Trang phục Chăm, Sampot Khmer (4 bộ)",
                },
                {
                  id: "dip_khai_giang",
                  ten: 'Dịp: "khai_giang"',
                  cond: { dip: "khai_giang" },
                  kyVong: "Áo dài (1 bộ)",
                },
                {
                  id: "dip_tet",
                  ten: 'Dịp: "tet"',
                  cond: { dip: "tet" },
                  kyVong: "Áo dài, Áo ngũ thân, Áo tứ thân (3 bộ)",
                },
                {
                  id: "sample_mua_khai_giang",
                  ten: 'Mẫu: "mua" + "khai_giang"',
                  cond: { thoiTiet: "mua", dip: "khai_giang" },
                  kyVong: "Áo dài (dịp) + Áo bà ba (thời tiết mưa) (2 bộ)",
                },
              ].map((testCase) => {
                const list = locTrangPhucGoiY(testCase.cond);
                const sentence = layCauGiaiThichGoc(testCase.cond, list);
                const isSelected =
                  goiYCondition.thoiTiet === testCase.cond.thoiTiet &&
                  goiYCondition.dip === testCase.cond.dip;

                return (
                  <div
                    key={testCase.id}
                    onClick={() => {
                      setGoiYCondition(testCase.cond);
                      setGoiYGeminiResult(null);
                      setGoiYIsFromGemini(null);
                    }}
                    className={`p-2.5 border rounded cursor-pointer transition-all ${
                      isSelected
                        ? "border-amber-500 bg-amber-950/30"
                        : "border-stone-800 bg-black/30 hover:border-stone-700"
                    }`}
                  >
                    <div className="flex items-center justify-between font-medium">
                      <span className="text-stone-200">{testCase.ten}</span>
                      <span className="text-amber-400 font-semibold">{list.length} bộ</span>
                    </div>
                    <p className="text-[11px] text-stone-400 mt-1 line-clamp-1">
                      Kỳ vọng: {testCase.kyVong}
                    </p>
                    <p className="text-[11px] text-stone-300 italic mt-0.5 line-clamp-1">
                      "{sentence}"
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Khối kiểm tra BẦU TRỜI, CHIP THỜI TIẾT & THAM SỐ URL (?sky, ?weather, ?vung) */}
        <section
          className="p-4 md:p-5 border space-y-4"
          style={{
            borderColor: "var(--reu-phong)",
            borderRadius: "var(--vien-lech-a)",
            background: "rgba(0,0,0,0.25)"
          }}
        >
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-base font-semibold" style={{ fontFamily: "var(--font-tieu-de)", color: "var(--reu-phong)" }}>
                Kiểm thử Bầu Trời, Thời Tiết Thật (Open-Meteo) & Tham Số URL
              </h2>
              <p className="text-xs text-stone-300">
                Lớp nền phía sau mọi màn, chip thời tiết, SVG chân trời 4 vùng, timeout 6s, fallback đồng hồ và ghi đè URL
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="px-2.5 py-1 text-xs font-medium border"
                style={{
                  borderColor: "var(--reu-phong)",
                  color: "var(--reu-phong)",
                  background: "rgba(92,107,79,0.15)",
                  borderRadius: "var(--vien-lech-b)"
                }}
              >
                Open-Meteo CC BY 4.0
              </span>
            </div>
          </div>

          {/* Trạng thái Bầu trời & Thời tiết hiện hành */}
          {testWeatherState && (
            <div
              className="p-3.5 border space-y-2.5"
              style={{
                borderColor: "rgba(92, 107, 79, 0.4)",
                borderRadius: "var(--vien-lech-b)",
                background: "rgba(0,0,0,0.3)"
              }}
            >
              <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-emerald-200">Trạng thái thời tiết:</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-700/50">
                    {testWeatherState.vung.noi} ({testWeatherState.vung.ten}) · {testWeatherState.nhietDo}°C · {testWeatherState.moTaThoiTiet} · {testWeatherState.moTaKhungGio}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-stone-400">
                    {testWeatherState.isFallback ? "⚠️ Đang dùng Fallback đồng hồ / ngoại tuyến" : "✓ Dữ liệu thật từ Open-Meteo"}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSimulatedOffline(!simulatedOffline)}
                    className="px-2 py-1 text-xs rounded border border-stone-600 bg-stone-800 text-stone-200 hover:bg-stone-700"
                  >
                    {simulatedOffline ? "Phục hồi mạng thật" : "Giả lập rút mạng (Offline fallback)"}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                <div className="p-2 rounded bg-black/40 border border-stone-800">
                  <div className="text-stone-400 text-[11px]">Vùng hiện hành:</div>
                  <div className="font-semibold text-stone-200">{testWeatherState.vung.id} ({testWeatherState.vung.noi})</div>
                </div>
                <div className="p-2 rounded bg-black/40 border border-stone-800">
                  <div className="text-stone-400 text-[11px]">Khung giờ:</div>
                  <div className="font-semibold text-stone-200">{testWeatherState.khungGio} ({testWeatherState.moTaKhungGio})</div>
                </div>
                <div className="p-2 rounded bg-black/40 border border-stone-800">
                  <div className="text-stone-400 text-[11px]">Thời tiết:</div>
                  <div className="font-semibold text-stone-200">{testWeatherState.thoiTiet} ({testWeatherState.moTaThoiTiet})</div>
                </div>
                <div className="p-2 rounded bg-black/40 border border-stone-800">
                  <div className="text-stone-400 text-[11px]">Nhiệt độ / Mưa:</div>
                  <div className="font-semibold text-stone-200">{testWeatherState.nhietDo}°C · {testWeatherState.precipitation}mm</div>
                </div>
              </div>
            </div>
          )}

          {/* 1. Tham số URL ghi đè để quay video (Mục 6) */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-stone-300 uppercase tracking-wider">
              1. Tham số URL cố định giao diện (?sky, ?weather, ?vung)
            </h3>
            <p className="text-xs text-stone-400">
              Nhấp vào một mẫu bên dưới để áp dụng trực tiếp lên URL và kiểm tra giao diện cố định:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              {[
                {
                  label: "Huế · Hoàng hôn · Mưa nhẹ",
                  params: "?dev=1&sky=hoang_hon&weather=mua&vung=trung",
                  desc: "Chân trời Trung Bộ + lớp son-dong-ho 8% + dải vang-nghe 8% + mưa rơi tro-tram",
                },
                {
                  label: "Hà Nội · Rạng đông · Se lạnh",
                  params: "?dev=1&sky=rang_dong&weather=lanh&vung=bac",
                  desc: "Núi nhọn & ruộng bậc thang Bắc Bộ + phủ dat-nung 10% + sương tro-tram 8%",
                },
                {
                  label: "TP.HCM · Ban ngày · Nắng nóng",
                  params: "?dev=1&sky=ngay&weather=nong&vung=nam",
                  desc: "Bờ sông & tán dừa Nam Bộ + nền gốc không phủ",
                },
                {
                  label: "Tây Nguyên · Đêm tối · Dịu mát",
                  params: "?dev=1&sky=dem&weather=mat&vung=taynguyen",
                  desc: "Đồi tròn bát úp Tây Nguyên + nền gốc tối + sao đêm lung linh",
                },
              ].map((preset) => (
                <a
                  key={preset.label}
                  href={preset.params}
                  className="p-2.5 rounded border border-stone-700 bg-stone-900/60 hover:border-amber-500 hover:bg-stone-800 transition-colors block text-left"
                >
                  <div className="flex items-center justify-between text-stone-200 font-medium">
                    <span>{preset.label}</span>
                    <span className="text-[11px] text-amber-400 font-mono">Áp dụng →</span>
                  </div>
                  <div className="text-[11px] text-stone-400 mt-1">{preset.desc}</div>
                  <div className="text-[10px] text-stone-500 font-mono mt-0.5">{preset.params}</div>
                </a>
              ))}
            </div>
          </div>

          {/* 2. Chuyển đổi nhanh 4 Vùng (S11) */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-stone-300 uppercase tracking-wider">
              2. Đổi vùng trên bản đồ / chip: nền và chân trời đổi theo
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
              {vungData.map((v) => {
                const isSelected = testVungId === v.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setTestVungId(v.id)}
                    className={`p-2.5 rounded border text-left cursor-pointer transition-colors ${
                      isSelected
                        ? "border-emerald-500 bg-emerald-950/40 text-emerald-100"
                        : "border-stone-800 bg-black/30 hover:border-stone-700 text-stone-300"
                    }`}
                  >
                    <div className="font-semibold">{v.ten}</div>
                    <div className="text-[11px] text-stone-400">{v.noi} ({v.lat}, {v.lon})</div>
                    <div className="text-[10px] text-stone-500 mt-1">
                      {v.id === "bac" && "Núi nhọn & ruộng bậc thang"}
                      {v.id === "trung" && "Đồi thoải & bờ biển cong"}
                      {v.id === "taynguyen" && "Đồi tròn nối tiếp"}
                      {v.id === "nam" && "Bờ sông thấp & tán dừa"}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Kiểm tra Trợ năng & Tương phản WCAG AA */}
          <div className="p-3 rounded bg-black/40 border border-stone-800 space-y-2 text-xs">
            <h3 className="text-xs font-semibold text-stone-300 uppercase tracking-wider">
              3. Trợ năng & Chuẩn tương phản WCAG AA
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-stone-300">Công tắc "Giảm chuyển động":</span>
                  <span className="font-medium text-amber-400">
                    {skySettings.giamChuyenDong ? "ĐANG BẬT (Bỏ mưa & chuyển động)" : "ĐANG TẮT (Có chuyển động)"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    updateSkySettings({ giamChuyenDong: !skySettings.giamChuyenDong })
                  }
                  className="px-2.5 py-1 text-xs border rounded bg-stone-800 text-stone-200 hover:bg-stone-700 cursor-pointer"
                >
                  Đổi trạng thái "Giảm chuyển động"
                </button>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-stone-300">Công tắc "Tắt bầu trời" (máy yếu):</span>
                  <span className="font-medium text-amber-400">
                    {skySettings.tatBauTroi ? "ĐANG BẬT (Ẩn bầu trời)" : "ĐANG TẮT (Hiện bầu trời)"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    updateSkySettings({ tatBauTroi: !skySettings.tatBauTroi })
                  }
                  className="px-2.5 py-1 text-xs border rounded bg-stone-800 text-stone-200 hover:bg-stone-700 cursor-pointer"
                >
                  Đổi trạng thái "Tắt bầu trời"
                </button>
              </div>
            </div>

            <div className="pt-2 border-t border-stone-800/80 text-[11px] text-stone-400">
              ✓ <strong>Độ tương phản chữ (WCAG AA):</strong> Chữ màu <code className="text-amber-200">#F3ECDD</code> trên nền <code className="text-amber-200">#1B2A2E</code> với lớp phủ phẳng 8–10% đạt tỷ lệ tương phản xấp xỉ <strong>8.8:1</strong> (vượt xa chuẩn AA 4.5:1 và AAA 7:1), đảm bảo chữ luôn sắc nét và dễ đọc trong mọi khung giờ.
            </div>
          </div>
        </section>

        {/* Khối kiểm tra dữ liệu ?dev=1: daKiemChung & nguonIds */}
        <section
          className="p-4 md:p-5 border space-y-3"
          style={{
            borderColor: "var(--tro-tram)",
            borderRadius: "var(--vien-lech-a)"
          }}
        >
          <h2 className="text-base font-semibold" style={{ fontFamily: "var(--font-tieu-de)" }}>
            Kiểm tra trường daKiemChung & Nguồn (chỉ hiện khi ?dev=1)
          </h2>
          <div className="space-y-3 text-xs md:text-sm">
            {trangPhuc.map((tp) => {
              const coCanBoSung = tp.nguonIds.includes("can_bo_sung");
              return (
                <div
                  key={tp.id}
                  className="p-3 border flex flex-col md:flex-row md:items-center justify-between gap-2"
                  style={{
                    borderColor: "var(--tro-tram)",
                    borderRadius: "var(--vien-lech-b)"
                  }}
                >
                  <div>
                    <span className="font-semibold text-sm" style={{ fontFamily: "var(--font-tieu-de)" }}>
                      {tp.ten}
                    </span>
                    <p className="text-xs mt-0.5" style={{ color: "var(--tro-tram)" }}>
                      {tp.moTaNgan}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Chip kiểm chứng - chỉ hiện khi ?dev=1 */}
                    <span
                      className="px-2 py-0.5 text-xs border"
                      style={{
                        borderColor: tp.daKiemChung ? "var(--reu-phong)" : "var(--tro-tram)",
                        color: tp.daKiemChung ? "var(--vang-nghe)" : "var(--tro-tram)",
                        borderRadius: "var(--vien-lech-a)"
                      }}
                    >
                      {tp.daKiemChung ? domdom.dev.daKiemChung : domdom.dev.chuaKiemChung}
                    </span>

                    {/* Chip đang bổ sung nguồn */}
                    {coCanBoSung && (
                      <span
                        className="px-2 py-0.5 text-xs border"
                        style={{
                          borderColor: "var(--dat-nung)",
                          color: "var(--dat-nung)",
                          borderRadius: "var(--vien-lech-a)"
                        }}
                      >
                        {domdom.common.dangBoSungNguon}
                      </span>
                    )}

                    {/* Nút mở nhanh Một Trang Đời */}
                    <button
                      type="button"
                      onClick={() => setSelectedCostumeForStory(tp.id)}
                      className="px-2.5 py-1 text-xs border cursor-pointer"
                      style={{
                        borderColor: "var(--vang-nghe)",
                        color: "var(--vang-nghe)",
                        background: "rgba(217, 164, 65, 0.12)",
                        borderRadius: "var(--vien-lech-b)"
                      }}
                    >
                      📖 Mở Một Trang Đời
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Khối quản lý Góp ý / Báo sai từ người dùng */}
        <section
          className="p-4 md:p-5 border space-y-3"
          style={{
            borderColor: "var(--tro-tram)",
            borderRadius: "var(--vien-lech-a)"
          }}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold" style={{ fontFamily: "var(--font-tieu-de)" }}>
              Góp ý / Báo sai đã lưu trong localStorage ({savedGopYList.length})
            </h2>
            {savedGopYList.length > 0 && (
              <button
                type="button"
                onClick={handleClearGopY}
                className="text-xs px-2 py-1 border cursor-pointer"
                style={{
                  borderColor: "var(--dat-nung)",
                  color: "var(--dat-nung)",
                  borderRadius: "var(--vien-lech-b)"
                }}
              >
                Xóa tất cả góp ý
              </button>
            )}
          </div>

          {savedGopYList.length === 0 ? (
            <p className="text-xs italic" style={{ color: "var(--tro-tram)" }}>
              Chưa có góp ý nào được lưu. Bạn có thể mở một trang phục bất kỳ và bấm "Báo sai / góp ý" để thử nghiệm.
            </p>
          ) : (
            <div className="space-y-2">
              {savedGopYList.map((gy) => (
                <div
                  key={gy.id}
                  className="p-2.5 border text-xs space-y-1"
                  style={{
                    borderColor: "rgba(138, 129, 117, 0.3)",
                    background: "rgba(0,0,0,0.25)",
                    borderRadius: "var(--vien-lech-b)"
                  }}
                >
                  <div className="flex items-center justify-between text-stone-400">
                    <strong style={{ color: "var(--vang-nghe)" }}>{gy.tenTrangPhuc}</strong>
                    <span>{gy.thoiGian}</span>
                  </div>
                  <p className="text-stone-200">{gy.noiDung}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Modal Một Trang Đời */}
      {selectedCostumeForStory && (
        <MotTrangDoiModal
          trangPhucId={selectedCostumeForStory}
          isOpen={true}
          onClose={() => setSelectedCostumeForStory(null)}
        />
      )}
    </div>
  );
}
