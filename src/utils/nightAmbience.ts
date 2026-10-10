/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Tạo âm thanh tiếng dế/côn trùng đêm thanh vắng mộc mạc bằng Web Audio API
 * Tự sinh âm sắc tự nhiên, không phụ thuộc file ngoài, không bị lỗi mạng.
 */

class NightAmbiencePlayer {
  private ctx: AudioContext | null = null;
  private isRunning: boolean = false;
  private intervalId: number | null = null;

  public toggle(): boolean {
    if (this.isRunning) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  public getIsPlaying(): boolean {
    return this.isRunning;
  }

  public start() {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!this.ctx) {
        this.ctx = new AudioCtx();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      this.isRunning = true;
      this.scheduleCricketChirps();
    } catch {
      this.isRunning = false;
    }
  }

  public stop() {
    this.isRunning = false;
    if (this.intervalId !== null) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.ctx && this.ctx.state === 'running') {
      this.ctx.suspend();
    }
  }

  private scheduleCricketChirps() {
    if (this.intervalId !== null) {
      window.clearInterval(this.intervalId);
    }

    const chirpSequence = () => {
      if (!this.isRunning || !this.ctx) return;
      
      const now = this.ctx.currentTime;
      // Chuỗi 3 tiếng dế reo nhỏ nhẹ
      const pulses = 3;
      for (let i = 0; i < pulses; i++) {
        const time = now + i * 0.08;
        this.playSoftPulse(time);
      }
    };

    chirpSequence();
    // Tiếng kêu ngắt quãng không đều theo nhịp tự nhiên đêm hè
    this.intervalId = window.setInterval(chirpSequence, 2800 + Math.random() * 2400);
  }

  private playSoftPulse(time: number) {
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      // Tần số dế đêm nhẹ nhàng
      osc.frequency.setValueAtTime(4200, time);
      osc.frequency.exponentialRampToValueAtTime(3900, time + 0.045);

      // Âm lượng rất nhỏ (0.015) để chỉ tạo không khí êm đềm
      gain.gain.setValueAtTime(0.0001, time);
      gain.gain.linearRampToValueAtTime(0.015, time + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.045);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(time);
      osc.stop(time + 0.05);
    } catch {
      // Bỏ qua nếu audio context bận
    }
  }
}

export const nightAmbience = new NightAmbiencePlayer();
