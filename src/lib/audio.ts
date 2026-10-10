/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Quản lý âm thanh tổng hợp bằng Web Audio API thuần (không dùng tệp âm thanh tĩnh).
 * m thanh gồm:
 * 1. Tiếng vải sột soạt: Nhiễu lọc bandpass ~150ms
 * 2. Tiếng chuông bạc: 2–3 sóng sin hài, tắt dần ~600ms
 * 3. Tiếng bước guốc: Hai xung ngắn khi hoàn tất bộ đồ
 * m lượng luôn giữ ở mức thấp dịu nhẹ.
 */

let audioCtx: AudioContext | null = null;
const KEY_AUDIO_ENABLED = "vpr:audio_enabled";
const KEY_AUDIO_INITIALIZED = "vpr:audio_first_touched";

/**
 * Kiểm tra xem âm thanh có đang được bật không.
 * Mặc định: tắt cho đến lần chạm đầu (hoặc do người dùng bật trong cài đặt).
 */
export function isAudioEnabled(): boolean {
  if (typeof window === "undefined" || !window.localStorage) return false;
  try {
    const val = window.localStorage.getItem(KEY_AUDIO_ENABLED);
    if (val !== null) {
      return val === "1" || val === "true";
    }
  } catch {
    // Bỏ qua
  }
  return false;
}

/**
 * Cập nhật trạng thái bật/tắt âm thanh
 */
export function setAudioEnabled(enabled: boolean): void {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(KEY_AUDIO_ENABLED, enabled ? "1" : "0");
      window.dispatchEvent(
        new CustomEvent("vpr:audio-setting-change", { detail: { enabled } })
      );
    }
  } catch {
    // Bỏ qua
  }
}

/**
 * Khởi tạo AudioContext sau thao tác chạm đầu tiên của người dùng.
 * Có thể gọi từ onEnter của GateScreen hoặc bất kỳ tương tác đầu tiên nào.
 */
export function initAudioOnFirstTouch(): AudioContext | null {
  if (typeof window === "undefined") return null;

  try {
    if (!audioCtx) {
      const AudioContextClass =
        window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }

    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume().catch(() => {});
    }

    // Nếu người dùng chưa từng tương tác âm thanh, lần chạm đầu tiên đánh dấu đã chạm
    if (window.localStorage && !window.localStorage.getItem(KEY_AUDIO_INITIALIZED)) {
      window.localStorage.setItem(KEY_AUDIO_INITIALIZED, "1");
      // Bật âm thanh nếu chưa có cấu hình cấm trước đó
      if (window.localStorage.getItem(KEY_AUDIO_ENABLED) === null) {
        window.localStorage.setItem(KEY_AUDIO_ENABLED, "1");
        window.dispatchEvent(
          new CustomEvent("vpr:audio-setting-change", { detail: { enabled: true } })
        );
      }
    }
  } catch (err) {
    console.warn("Không thể khởi tạo Web Audio:", err);
  }

  return audioCtx;
}

function getActiveAudioContext(): AudioContext | null {
  if (!isAudioEnabled()) return null;
  if (typeof window === "undefined") return null;

  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }

  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }

  return audioCtx;
}

/**
 * Tiếng vải sột soạt: Nhiễu lọc bandpass ~150ms, âm lượng thấp.
 * Thích hợp khi chạm đổi phụ kiện, lật tà áo, vuốt họa tiết.
 */
export function playFabricRustle(): void {
  const ctx = getActiveAudioContext();
  if (!ctx) return;

  try {
    const duration = 0.15; // ~150ms
    const sampleRate = ctx.sampleRate;
    const bufferSize = Math.floor(sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);

    // Tạo pink/brown noise nhẹ nhàng
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      data[i] = (b0 + b1 + b2) * 0.1;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;

    // Bộ lọc dải băng (bandpass) ở tần số ~1350Hz để tạo âm sột soạt như lụa/đũi
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(1350, ctx.currentTime);
    filter.Q.setValueAtTime(1.9, ctx.currentTime);

    const gain = ctx.createGain();
    const now = ctx.currentTime;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.06, now + 0.03); // Âm lượng thấp
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    noiseSource.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noiseSource.start(now);
    noiseSource.stop(now + duration + 0.01);
  } catch {
    // Bỏ qua nếu có lỗi AudioContext
  }
}

/**
 * Tiếng chuông bạc: 2–3 sóng sin hài, tắt dần ~600ms, âm lượng thấp.
 * Thích hợp cho khoảnh khắc lưu thành công, đổi màu sắc, điểm xuyết trang sức.
 */
export function playSilverBell(): void {
  const ctx = getActiveAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const duration = 0.6; // ~600ms
    // 3 sóng sin hài nhẹ: f0 (1760Hz - nốt A6 thanh thoát), 1.5 * f0 (2640Hz), 2.0 * f0 (3520Hz)
    const harmonics = [
      { freq: 1760, vol: 0.05 },
      { freq: 2640, vol: 0.025 },
      { freq: 3520, vol: 0.015 },
    ];

    harmonics.forEach(({ freq, vol }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(vol, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + duration + 0.02);
    });
  } catch {
    // Bỏ qua
  }
}

/**
 * Tiếng bước guốc: Hai xung ngắn (gõ cộp - cộp trên nền gỗ/gạch xưa) khi hoàn tất bộ đồ.
 * m lượng thấp, ấm áp và tự nhiên.
 */
export function playClogSteps(): void {
  const ctx = getActiveAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;

    // Bước 1: t = 0
    triggerClogPulse(ctx, now, 320, 0.06);

    // Bước 2: t = now + 110ms (pitch cao hơn chút như nhịp bước tiếp theo)
    triggerClogPulse(ctx, now + 0.11, 380, 0.055);
  } catch {
    // Bỏ qua
  }
}

function triggerClogPulse(
  ctx: AudioContext,
  startTime: number,
  baseFreq: number,
  peakGain: number
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  // Dùng sóng tam giác kết hợp pitch drop nhanh để mô phỏng tiếng gỗ gõ
  osc.type = "triangle";
  osc.frequency.setValueAtTime(baseFreq * 1.8, startTime);
  osc.frequency.exponentialRampToValueAtTime(baseFreq, startTime + 0.025);

  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.linearRampToValueAtTime(peakGain, startTime + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.055); // Xung ngắn ~55ms

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(startTime);
  osc.stop(startTime + 0.06);
}

// Giữ lại tên alias tương thích với sound.ts cũ
export const phatTiengVaiSotSoat = playFabricRustle;
export const phatTiengChuongBac = playSilverBell;
export const phatTiengBuocGuoc = playClogSteps;
export const playChimeSound = playSilverBell;
