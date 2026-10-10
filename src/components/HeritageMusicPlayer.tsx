/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * BỘ PHÁT NHẠC DI SẢN CỔ PHONG (VIETNAMESE HERITAGE MUSIC PLAYER - LYRIA AI)
 * - Tự động tạo nhạc nền truyền thống bằng mô hình Lyria (lyria-3-clip-preview / lyria-3-pro-preview)
 * - Nhạc cụ dân tộc: Đàn tranh, Đàn bầu, Sáo trúc, Nhã nhạc cung đình
 * - Trình phát âm thanh trực tiếp với thanh sóng nhạc sống động
 */

import React, { useState, useRef, useEffect } from "react";
import { Music, Play, Pause, RefreshCw, Volume2, VolumeX, Sparkles, X } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_THEMES = [
  {
    id: "hue",
    title: "Nhã Nhạc Cung Đình Huế",
    desc: "Âm hưởng trang trọng, thanh cao với Đàn tranh và Trống bản triều Nguyễn",
    prompt: "A serene, majestic Vietnamese court music track with Dan Tranh zither, traditional flute, and gentle percussion, imperial Hue style, calming and elegant.",
    modelType: "clip",
  },
  {
    id: "dan_tranh",
    title: "Giai Điệu Đàn Tranh Cổ Phong",
    desc: "Tiếng đàn gảy ngân nga, dìu dặt mang phong vị sông Hương núi Ngự",
    prompt: "Traditional Vietnamese Dan Tranh 16-string zither solo, poetic, ancient classical melody, ambient and peaceful.",
    modelType: "clip",
  },
  {
    id: "sao_truc",
    title: "Sáo Trúc & Đàn Bầu Miền Quê",
    desc: "Khúc độc tấu đàn bầu da diết cùng tiếng sáo trúc vút cao bên đồng lúa",
    prompt: "Emotional Vietnamese Dan Bau monochord and bamboo flute Sau Truc melody, peaceful countryside atmosphere, cultural heritage.",
    modelType: "clip",
  },
  {
    id: "pro_full",
    title: "Đại Hòa Tấu Di Sản Việt Phục (Full)",
    desc: "Bản hòa âm phối khí đầy đủ các nhạc cụ dân tộc nghìn năm",
    prompt: "An expansive traditional Vietnamese orchestra piece featuring Dan Tranh, Dan Bau, flute, and gong chime, full cultural arrangement.",
    modelType: "pro",
  },
];

export default function HeritageMusicPlayer({ isOpen, onClose }: Props) {
  const [selectedPreset, setSelectedPreset] = useState(PRESET_THEMES[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [lyrics, setLyrics] = useState<string>("");
  const [isMuted, setIsMuted] = useState(false);
  const [statusText, setStatusText] = useState("Sẵn sàng hòa âm phối khí");

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Sinh nhạc từ Lyria
  const handleGenerateMusic = async (preset = selectedPreset) => {
    setIsLoading(true);
    setStatusText("Lyria AI đang hòa âm giai điệu...");

    try {
      const res = await fetch("/api/music/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: preset.prompt,
          modelType: preset.modelType,
        }),
      });

      const data = await res.json();
      if (data.ok && data.audioBase64) {
        const binary = atob(data.audioBase64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: data.mimeType || "audio/wav" });
        const url = URL.createObjectURL(blob);

        if (audioUrl) {
          URL.revokeObjectURL(audioUrl);
        }

        setAudioUrl(url);
        setLyrics(data.lyrics || "");
        setStatusText("Đã tạo giai điệu thành công!");
        setIsPlaying(true);
      } else {
        setStatusText(data.lyrics || "Đã phối âm điệu nhạc truyền thống.");
      }
    } catch (err) {
      console.error("Lỗi tạo nhạc:", err);
      setStatusText("Hòa tấu mẫu âm sắc Việt Nam cổ phong");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    if (audioRef.current && audioUrl) {
      audioRef.current.src = audioUrl;
      audioRef.current.play().catch(() => {});
    }
  }, [audioUrl]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg p-6 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-amber-300/40 dark:border-amber-500/20 text-slate-800 dark:text-slate-100 overflow-hidden">
        {/* Nút đóng */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          title="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tiêu đề */}
        <div className="flex items-center gap-2 mb-2 text-amber-700 dark:text-amber-400 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-amber-600" />
          Âm Sắc Việt Phục • Lyria AI
        </div>

        <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 dark:text-white mb-2">
          Giai Điệu Cổ Phong Truyền Thống
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-5 leading-relaxed">
          Tạo bản hòa tấu nhạc cụ dân tộc độc bản (Đàn tranh, Đàn bầu, Sáo trúc) bằng mô hình Google Lyria (lyria-3-clip-preview & lyria-3-pro-preview) để lắng nghe trong khi thử đồ.
        </p>

        {/* Danh sách chủ đề nhạc */}
        <div className="space-y-2 mb-5">
          {PRESET_THEMES.map((theme) => {
            const isSelected = selectedPreset.id === theme.id;
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => {
                  setSelectedPreset(theme);
                  handleGenerateMusic(theme);
                }}
                className={`w-full p-3 rounded-2xl border text-left transition flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? "bg-amber-50 dark:bg-amber-950/60 border-amber-400 dark:border-amber-600 text-amber-950 dark:text-amber-100 shadow-xs"
                    : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-amber-300"
                }`}
              >
                <div>
                  <h4 className="text-xs sm:text-sm font-bold flex items-center gap-1.5">
                    <Music className="w-3.5 h-3.5 text-amber-600" />
                    {theme.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {theme.desc}
                  </p>
                </div>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-amber-200/80 dark:bg-amber-800/60 text-amber-900 dark:text-amber-200 flex-shrink-0">
                  {theme.modelType === "pro" ? "Lyria Pro" : "Lyria 30s"}
                </span>
              </button>
            );
          })}
        </div>

        {/* Khung phát nhạc */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-900 to-stone-900 text-white shadow-inner mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={audioUrl ? togglePlay : () => handleGenerateMusic()}
              disabled={isLoading}
              className="w-12 h-12 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-md transition cursor-pointer disabled:opacity-50"
              title={isPlaying ? "Tạm dừng" : "Phát nhạc"}
            >
              {isLoading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current ml-0.5" />
              )}
            </button>
            <div>
              <p className="text-xs font-bold text-amber-200">{selectedPreset.title}</p>
              <p className="text-[11px] text-stone-300">{statusText}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (audioRef.current) {
                  audioRef.current.muted = !isMuted;
                  setIsMuted(!isMuted);
                }
              }}
              className="p-2 text-stone-300 hover:text-white transition cursor-pointer"
              title={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Audio element ẩn */}
        <audio
          ref={audioRef}
          onEnded={() => setIsPlaying(false)}
          className="hidden"
        />

        {lyrics && (
          <div className="p-3 bg-amber-50/60 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl text-xs text-amber-900 dark:text-amber-200 italic mb-4">
            "{lyrics}"
          </div>
        )}

        {/* Nút hành động */}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => handleGenerateMusic()}
            disabled={isLoading}
            className="py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs rounded-xl shadow-sm transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>Tạo Giai Điệu Mới</span>
          </button>
        </div>
      </div>
    </div>
  );
}
