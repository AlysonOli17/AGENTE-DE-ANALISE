import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Share2,
  Heart,
  MessageCircle,
  Bookmark,
  Music2,
  Download,
  Send,
  CheckCircle2,
  Sliders,
  Type,
  Maximize2,
} from 'lucide-react';
import { ViralClip, CaptionStyle } from '../types';

interface VerticalClipPlayerProps {
  clip: ViralClip;
  thumbnailUrl: string;
  onExportToSocial: (clip: ViralClip, platform: 'tiktok' | 'instagram' | 'youtube') => void;
  onSchedulePost: (clip: ViralClip) => void;
}

export const VerticalClipPlayer: React.FC<VerticalClipPlayerProps> = ({
  clip,
  thumbnailUrl,
  onExportToSocial,
  onSchedulePost,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(clip.startSec);
  const [captionStyle, setCaptionStyle] = useState<CaptionStyle>('hormozi');
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);
  const [captionScale, setCaptionScale] = useState<number>(1);
  const [activeWordIndex, setActiveWordIndex] = useState(0);

  const duration = Math.max(1, clip.endSec - clip.startSec);
  const relativeTime = currentTime - clip.startSec;

  // Playback timer simulation
  useEffect(() => {
    setCurrentTime(clip.startSec);
    setIsPlaying(true);
  }, [clip.id, clip.startSec]);

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= clip.endSec) {
            return clip.startSec;
          }
          return prev + 0.2;
        });
      }, 200);
    }
    return () => clearInterval(interval);
  }, [isPlaying, clip.startSec, clip.endSec]);

  // Find active dynamic caption item
  const activeCaption = clip.dynamicCaptions.find(
    (cap) => currentTime >= cap.startSec && currentTime <= cap.endSec
  ) || clip.dynamicCaptions[0];

  // Cycle active words for karaoke animation
  useEffect(() => {
    const wordTimer = setInterval(() => {
      setActiveWordIndex((prev) => (prev + 1) % 5);
    }, 450);
    return () => clearInterval(wordTimer);
  }, []);

  const handleExport = (platform: 'tiktok' | 'instagram' | 'youtube') => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setExportSuccess(platform);
      onExportToSocial(clip, platform);
      setTimeout(() => setExportSuccess(null), 3500);
    }, 1200);
  };

  // Helper for rendering caption with selected style
  const renderStyledCaption = () => {
    if (!activeCaption) return null;

    const words = activeCaption.text.split(' ');
    const emphasis = activeCaption.emphasisWord?.toLowerCase();

    switch (captionStyle) {
      case 'hormozi':
        return (
          <div className="flex flex-wrap justify-center items-center gap-1.5 px-4 text-center">
            {words.map((w, i) => {
              const isEmphasis = emphasis && w.toLowerCase().includes(emphasis);
              return (
                <span
                  key={i}
                  className={`font-black uppercase tracking-tight transition-transform ${
                    isEmphasis
                      ? 'bg-yellow-400 text-black px-2 py-0.5 rounded shadow-lg scale-110 rotate-[-1deg]'
                      : 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] text-lg sm:text-xl'
                  }`}
                  style={{ transform: isEmphasis ? 'scale(1.12)' : 'scale(1)' }}
                >
                  {w}
                </span>
              );
            })}
          </div>
        );

      case 'karaoke':
        return (
          <div className="flex flex-wrap justify-center items-center gap-1.5 px-4 text-center">
            {words.map((w, i) => {
              const isHighlighted = i <= activeWordIndex;
              return (
                <span
                  key={i}
                  className={`font-extrabold text-lg sm:text-xl transition-colors duration-200 ${
                    isHighlighted
                      ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)] scale-105'
                      : 'text-slate-300/80 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]'
                  }`}
                >
                  {w}
                </span>
              );
            })}
          </div>
        );

      case 'neon':
        return (
          <div className="flex flex-wrap justify-center items-center gap-1 px-4 text-center">
            {words.map((w, i) => (
              <span
                key={i}
                className="font-black text-cyan-300 text-lg sm:text-xl tracking-wider drop-shadow-[0_0_10px_#06b6d4]"
              >
                {w}
              </span>
            ))}
          </div>
        );

      case 'fire':
        return (
          <div className="flex flex-wrap justify-center items-center gap-1.5 px-4 text-center">
            {words.map((w, i) => (
              <span
                key={i}
                className="font-black text-amber-400 text-lg sm:text-xl drop-shadow-[0_0_12px_#f59e0b] animate-pulse"
              >
                {w}
              </span>
            ))}
          </div>
        );

      case 'minimal':
      default:
        return (
          <div className="rounded-lg bg-black/70 backdrop-blur-md px-3 py-1.5 text-center text-sm sm:text-base font-semibold text-white shadow-xl">
            {activeCaption.text}
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-center lg:items-start justify-center">
      {/* 9:16 Vertical Smartphone Canvas Simulation */}
      <div className="relative w-[300px] sm:w-[320px] h-[580px] sm:h-[620px] shrink-0 rounded-3xl border-4 border-slate-800 bg-black overflow-hidden shadow-2xl shadow-rose-950/20">
        {/* Mock Video Feed / Frame */}
        <div className="absolute inset-0 z-0">
          <img
            src={thumbnailUrl}
            alt="Vídeo Viral"
            className={`h-full w-full object-cover transition-transform duration-700 ${
              isPlaying ? 'scale-105 filter brightness-90' : 'scale-100 filter brightness-75'
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80" />
        </div>

        {/* Top Header info (TikTok/Reels format) */}
        <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between text-white drop-shadow-md">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-ping" />
            <span className="rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold tracking-wider backdrop-blur-sm">
              SCORE: {clip.viralScore}% VIRAL
            </span>
          </div>
          <span className="text-[11px] font-mono font-bold bg-black/50 px-2 py-0.5 rounded">
            {Math.floor(relativeTime)}s / {Math.floor(duration)}s
          </span>
        </div>

        {/* Center: Dynamic Captions Overlay (The Core Feature) */}
        <div
          className="absolute inset-x-2 top-1/2 -translate-y-1/2 z-20 pointer-events-none flex flex-col items-center justify-center min-h-[90px]"
          style={{ transform: `scale(${captionScale})` }}
        >
          {renderStyledCaption()}
        </div>

        {/* Right side social interactions (TikTok & Reels Mock) */}
        <div className="absolute right-3 bottom-20 z-10 flex flex-col items-center gap-4 text-white">
          <button className="flex flex-col items-center gap-1 group">
            <div className="rounded-full bg-black/40 p-2.5 backdrop-blur-sm group-hover:bg-rose-600 transition-colors">
              <Heart className="h-5 w-5 text-rose-500 fill-rose-500" />
            </div>
            <span className="text-[10px] font-semibold">142.8k</span>
          </button>
          <button className="flex flex-col items-center gap-1 group">
            <div className="rounded-full bg-black/40 p-2.5 backdrop-blur-sm group-hover:bg-slate-800 transition-colors">
              <MessageCircle className="h-5 w-5 text-white" />
            </div>
            <span className="text-[10px] font-semibold">3.4k</span>
          </button>
          <button className="flex flex-col items-center gap-1 group">
            <div className="rounded-full bg-black/40 p-2.5 backdrop-blur-sm group-hover:bg-amber-600 transition-colors">
              <Bookmark className="h-5 w-5 text-amber-400 fill-amber-400" />
            </div>
            <span className="text-[10px] font-semibold">18.9k</span>
          </button>
          <button className="flex flex-col items-center gap-1 group">
            <div className="rounded-full bg-black/40 p-2.5 backdrop-blur-sm group-hover:bg-indigo-600 transition-colors">
              <Share2 className="h-5 w-5 text-white" />
            </div>
            <span className="text-[10px] font-semibold">Partilhar</span>
          </button>
          <div className="rounded-full border-2 border-white/80 bg-slate-900 p-1.5 animate-spin-slow">
            <Music2 className="h-4 w-4 text-rose-400" />
          </div>
        </div>

        {/* Bottom Metadata & Hook Preview */}
        <div className="absolute bottom-4 left-3 right-16 z-10 text-white">
          <h4 className="text-xs font-bold drop-shadow-md line-clamp-1">{clip.title}</h4>
          <p className="text-[11px] text-slate-200 drop-shadow line-clamp-2 mt-0.5">
            {clip.hook}
          </p>
          <div className="mt-1 flex items-center gap-1 text-[10px] text-rose-300 font-mono">
            <Sparkles className="h-3 w-3" />
            Pico de retenção aos {clip.startSec}s ({clip.retentionPeak}%)
          </div>
        </div>

        {/* Scrubber Progress Bar */}
        <div className="absolute bottom-0 inset-x-0 h-1.5 bg-slate-800/80 z-20">
          <div
            className="h-full bg-rose-500 transition-all duration-200"
            style={{ width: `${(relativeTime / duration) * 100}%` }}
          />
        </div>

        {/* Play/Pause center overlay control */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="absolute inset-0 z-10 flex items-center justify-center bg-transparent group"
          title={isPlaying ? 'Pausar' : 'Reproduzir'}
        >
          {!isPlaying && (
            <div className="rounded-full bg-black/60 p-4 backdrop-blur-md text-white shadow-2xl scale-110">
              <Play className="h-8 w-8 fill-white" />
            </div>
          )}
        </button>
      </div>

      {/* Control Panel & Social Export Options */}
      <div className="flex-1 w-full max-w-xl space-y-5">
        {/* Header of Clip */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="rounded-md bg-rose-500/20 px-2 py-0.5 text-xs font-bold text-rose-400 border border-rose-500/30">
                {clip.category}
              </span>
              <h3 className="text-lg font-bold text-white mt-1">{clip.title}</h3>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-400">Intervalo do Corte</div>
              <div className="font-mono text-sm font-bold text-white">
                {Math.floor(clip.startSec / 60)}:{(clip.startSec % 60).toString().padStart(2, '0')} -{' '}
                {Math.floor(clip.endSec / 60)}:{(clip.endSec % 60).toString().padStart(2, '0')} ({duration}s)
              </div>
            </div>
          </div>

          <p className="mt-2 text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
            <strong className="text-rose-400">Por que é viral:</strong> {clip.reason}
          </p>

          {/* Quick Playback Bar Controls */}
          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-md transition-transform hover:bg-rose-500 active:scale-95"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-white" />}
              <span>{isPlaying ? 'Pausar Visualização' : 'Reproduzir Corte'}</span>
            </button>
            <button
              onClick={() => {
                setCurrentTime(clip.startSec);
                setIsPlaying(true);
              }}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reiniciar
            </button>
          </div>
        </div>

        {/* Dynamic Caption Styles Chooser (Requested Feature) */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Type className="h-4 w-4 text-amber-400" />
              <h4 className="text-sm font-bold text-white">Estilos de Legendas Dinâmicas</h4>
            </div>
            <span className="text-[11px] text-slate-400">Estilo Viral Selecionado</span>
          </div>

          <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { id: 'hormozi', name: 'Hormozi Pop', desc: 'Amarelo vivo + Pop', color: 'border-yellow-500/50 bg-yellow-950/20 text-yellow-300' },
              { id: 'karaoke', name: 'Karaokê Glow', desc: 'Preenchimento em tempo real', color: 'border-emerald-500/50 bg-emerald-950/20 text-emerald-300' },
              { id: 'neon', name: 'Cyber Neon', desc: 'Ciano elétrico com brilho', color: 'border-cyan-500/50 bg-cyan-950/20 text-cyan-300' },
              { id: 'fire', name: 'Fire Boost', desc: 'Gradiente quente pulsante', color: 'border-rose-500/50 bg-rose-950/20 text-rose-300' },
              { id: 'minimal', name: 'Minimal Dark', desc: 'Fundo preto translúcido', color: 'border-slate-600 bg-slate-800 text-slate-200' },
            ].map((style) => (
              <button
                key={style.id}
                onClick={() => setCaptionStyle(style.id as CaptionStyle)}
                className={`flex flex-col text-left p-2.5 rounded-xl border transition-all ${
                  captionStyle === style.id
                    ? `${style.color} ring-2 ring-rose-500 shadow-md`
                    : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <span className="text-xs font-bold">{style.name}</span>
                <span className="text-[10px] opacity-80">{style.desc}</span>
              </button>
            ))}
          </div>

          {/* Size slider */}
          <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Sliders className="h-3.5 w-3.5" /> Tamanho da Legenda:
            </span>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0.8"
                max="1.3"
                step="0.05"
                value={captionScale}
                onChange={(e) => setCaptionScale(parseFloat(e.target.value))}
                className="h-1.5 w-24 accent-rose-500"
              />
              <span className="font-mono text-[11px] text-white">{(captionScale * 100).toFixed(0)}%</span>
            </div>
          </div>
        </div>

        {/* Direct Export to TikTok & Instagram Reels (Requested Feature) */}
        <div className="rounded-2xl border border-rose-500/30 bg-gradient-to-b from-rose-950/30 to-slate-900 p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Share2 className="h-4 w-4 text-rose-400" />
                Exportação Direta para Redes Sociais
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Formatação automática em 1080x1920 (9:16), 60 FPS com legendas dinâmicas embutidas.
              </p>
            </div>
          </div>

          {/* Export Action Buttons */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              id="export-tiktok-btn"
              disabled={isExporting}
              onClick={() => handleExport('tiktok')}
              className="flex items-center justify-center gap-2 rounded-xl bg-black border border-slate-700 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:border-rose-500 hover:bg-slate-950 transition-all disabled:opacity-50"
            >
              <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>Exportar TikTok</span>
            </button>

            <button
              id="export-instagram-btn"
              disabled={isExporting}
              onClick={() => handleExport('instagram')}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:brightness-110 transition-all disabled:opacity-50"
            >
              <span>Exportar Reels</span>
            </button>

            <button
              id="export-youtube-btn"
              disabled={isExporting}
              onClick={() => handleExport('youtube')}
              className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-red-500 transition-all disabled:opacity-50"
            >
              <span>YouTube Shorts</span>
            </button>
          </div>

          {/* Schedule & Download secondary actions */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-800">
            <button
              onClick={() => onSchedulePost(clip)}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700"
            >
              <Send className="h-3.5 w-3.5 text-amber-400" />
              Agendar Publicação Automática
            </button>

            <button
              onClick={() => {
                // Download clip spec & captions as JSON
                const blob = new Blob([JSON.stringify(clip, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `corte-${clip.id}-viral.json`;
                a.click();
              }}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
            >
              <Download className="h-3.5 w-3.5" />
              Baixar Manifesto (.json / .srt)
            </button>
          </div>

          {/* Feedback message */}
          {exportSuccess && (
            <div className="mt-3 flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-950/60 p-2.5 text-xs font-medium text-emerald-300">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Corte enviado com sucesso para o canal conectado ({exportSuccess.toUpperCase()})!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
