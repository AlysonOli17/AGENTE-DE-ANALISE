import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Sparkles,
  Scissors,
  TrendingUp,
  Play,
  Flame,
  CheckCircle,
  ExternalLink,
  Clock,
  Layers,
  HelpCircle,
  Film,
  Zap,
  Clipboard,
  Check,
  Download,
  FileText,
  ArrowDown,
} from 'lucide-react';
import { VideoAnalysisResult, ViralClip } from '../types';
import { SAMPLE_VIDEOS } from '../utils/sampleData';
import { VerticalClipPlayer } from './VerticalClipPlayer';
import { downloadSrtSubtitles, renderAndDownloadVerticalVideo } from '../utils/exportClipVideo';

interface VideoAnalyzerProps {
  currentAnalysis: VideoAnalysisResult;
  onAnalysisComplete: (result: VideoAnalysisResult) => void;
  onExportToSocial: (clip: ViralClip, platform: 'tiktok' | 'instagram' | 'youtube') => void;
  onSchedulePost: (clip: ViralClip) => void;
}

export const VideoAnalyzer: React.FC<VideoAnalyzerProps> = ({
  currentAnalysis,
  onAnalysisComplete,
  onExportToSocial,
  onSchedulePost,
}) => {
  const [youtubeInput, setYoutubeInput] = useState(currentAnalysis.youtubeUrl);
  const [videoTitleInput, setVideoTitleInput] = useState(currentAnalysis.title);
  const [selectedNiche, setSelectedNiche] = useState('Marketing & Criação de Conteúdo');
  const [isLoading, setIsLoading] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);
  const [selectedClip, setSelectedClip] = useState<ViralClip>(currentAnalysis.clips[0] || null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [pastedFeedback, setPastedFeedback] = useState(false);
  const [engineInfo, setEngineInfo] = useState<{ source: string; modelUsed?: string }>({
    source: 'gemini-ai',
    modelUsed: 'gemini-3.1-flash-lite',
  });

  const resultsRef = useRef<HTMLDivElement>(null);

  // Sync selectedClip if currentAnalysis changes
  useEffect(() => {
    if (currentAnalysis.clips && currentAnalysis.clips.length > 0) {
      if (!selectedClip || !currentAnalysis.clips.some((c) => c.id === selectedClip.id)) {
        setSelectedClip(currentAnalysis.clips[0]);
      }
    }
  }, [currentAnalysis]);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setYoutubeInput(text.trim());
        setPastedFeedback(true);
        setTimeout(() => setPastedFeedback(false), 2000);
      }
    } catch {
      // Fallback if permission denied
    }
  };

  const handleAnalyze = async (urlToUse?: string, titleToUse?: string, nicheToUse?: string) => {
    const url = (urlToUse || youtubeInput || '').trim();
    if (!url) {
      setErrorMessage('Por favor, cole o link de um vídeo do YouTube.');
      return;
    }

    setIsLoading(true);
    setAnalysisStep(1);
    setErrorMessage(null);
    setSuccessBanner(null);

    // Step animation progress simulation
    const stepInterval = setInterval(() => {
      setAnalysisStep((prev) => (prev < 4 ? prev + 1 : prev));
    }, 1800);

    try {
      const res = await fetch('/api/analyze-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          youtubeUrl: url,
          videoTitle: titleToUse || videoTitleInput,
          niche: nicheToUse || selectedNiche,
        }),
      });

      clearInterval(stepInterval);
      setAnalysisStep(4);

      if (!res.ok) {
        throw new Error(`Erro no processamento (${res.status}). O agente tentará novamente.`);
      }

      const json = await res.json();
      if (json.source) {
        setEngineInfo({ source: json.source, modelUsed: json.modelUsed });
      }
      const rawData = json.data;

      // Extract YouTube Video ID
      let videoId = json.videoId || '';
      if (!videoId) {
        const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
        if (match && match[1]) {
          videoId = match[1];
        }
      }

      const extractedTitle = json.videoTitle || titleToUse || videoTitleInput || 'Vídeo Analisado com Sucesso';
      const extractedAuthor = json.author || 'Canal do YouTube';
      const extractedThumbnail = json.thumbnailUrl || (videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : `https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&auto=format&fit=crop&q=80`);

      const formattedResult: VideoAnalysisResult = {
        videoId,
        youtubeUrl: url,
        title: extractedTitle,
        author: extractedAuthor,
        duration: json.duration || '10:00',
        thumbnailUrl: extractedThumbnail,
        videoSummary: rawData.videoSummary || 'Análise de retenção de público gerada pelo agente de IA.',
        estimatedViralityScore: rawData.estimatedViralityScore || 95,
        targetAudience: rawData.targetAudience || 'Público que consome vídeos em formato vertical no Reels, TikTok e Shorts.',
        retentionAnalysis: rawData.retentionAnalysis || [],
        clips: rawData.clips || [],
        hashtagSuggestions: rawData.hashtagSuggestions || {
          trending: ['#viral', '#fyp', '#reels'],
          niche: ['#dicas', '#conteudo'],
          highReach: ['#explore', '#trending'],
        },
        predictiveRecommendations: rawData.predictiveRecommendations || [],
      };

      onAnalysisComplete(formattedResult);
      if (formattedResult.clips.length > 0) {
        setSelectedClip(formattedResult.clips[0]);
      }

      setSuccessBanner(`Vídeo "${extractedTitle}" analisado! ${formattedResult.clips.length} cortes virais identificados.`);

      // Smooth scroll directly to the cuts
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    } catch (err: any) {
      clearInterval(stepInterval);
      console.error('Falha ao analisar vídeo:', err);
      setErrorMessage(err.message || 'Erro ao conectar ao servidor de análise.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPreset = (preset: (typeof SAMPLE_VIDEOS)[0]) => {
    setYoutubeInput(preset.url);
    setVideoTitleInput(preset.title);
    setSelectedNiche(preset.niche);
    handleAnalyze(preset.url, preset.title, preset.niche);
  };

  // Dynamic list of categories from the clips
  const availableCategories = ['all', ...Array.from(new Set(currentAnalysis.clips.map((c) => c.category || 'Geral')))];

  const filteredClips =
    filterCategory === 'all'
      ? currentAnalysis.clips
      : currentAnalysis.clips.filter((c) => (c.category || '').toLowerCase().includes(filterCategory.toLowerCase()));

  return (
    <div className="space-y-8">
      {/* Search Bar / YouTube Link Input */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-xs font-bold text-rose-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Agente Autônomo de Detecção de Cortes Virais</span>
          </div>
          <h1 className="mt-3 text-2xl sm:text-3xl font-black tracking-tight text-white">
            Transforme qualquer vídeo do YouTube em cortes verticais virais
          </h1>
          <p className="mt-2 text-sm text-slate-300">
            O algoritmo analisa a curva de retenção de audiência, isola os ganchos mais magnéticos e gera legendas dinâmicas prontas para TikTok, Reels e Shorts.
          </p>

          {/* Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAnalyze();
            }}
            className="mt-6 flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Search className="h-4 w-4" />
              </div>
              <input
                id="youtube-url-input"
                type="text"
                value={youtubeInput}
                onChange={(e) => setYoutubeInput(e.target.value)}
                placeholder="Cole o link do YouTube (ex: https://youtube.com/watch?v=...)"
                className="w-full rounded-xl border border-slate-700 bg-slate-900/90 py-3.5 pl-10 pr-24 text-sm text-white placeholder-slate-500 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
              />
              {/* Paste button inside input */}
              <div className="absolute inset-y-0 right-1.5 flex items-center">
                <button
                  type="button"
                  onClick={handlePaste}
                  className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800/90 px-2.5 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-all shadow-sm"
                  title="Colar link da área de transferência"
                >
                  {pastedFeedback ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Colado!</span>
                    </>
                  ) : (
                    <>
                      <Clipboard className="h-3.5 w-3.5" />
                      <span>Colar</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <button
              id="analyze-video-btn"
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 px-6 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-rose-950/50 hover:brightness-110 active:scale-98 transition-all disabled:opacity-50 shrink-0"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Processando Vídeo...</span>
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4" />
                  <span>Gerar Cortes com IA</span>
                </>
              )}
            </button>
          </form>

          {/* Real-time Multi-step Processing Indicator */}
          {isLoading && (
            <div className="mt-4 rounded-2xl border border-rose-500/40 bg-slate-950/90 p-4 shadow-xl">
              <div className="flex items-center justify-between text-xs text-white mb-3">
                <span className="font-bold flex items-center gap-2 text-rose-400">
                  <Film className="h-4 w-4 animate-spin text-rose-500" />
                  Análise de Retenção e Cortes em Execução...
                </span>
                <span className="font-mono text-slate-400">Etapa {analysisStep}/4</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-[11px]">
                <div
                  className={`p-2 rounded-lg border transition-all ${
                    analysisStep >= 1
                      ? 'border-rose-500/50 bg-rose-950/40 text-rose-200'
                      : 'border-slate-800 bg-slate-900/50 text-slate-500'
                  }`}
                >
                  <strong>1. Metadados</strong>
                  <p className="text-[10px] opacity-80">Localizando vídeo</p>
                </div>
                <div
                  className={`p-2 rounded-lg border transition-all ${
                    analysisStep >= 2
                      ? 'border-rose-500/50 bg-rose-950/40 text-rose-200'
                      : 'border-slate-800 bg-slate-900/50 text-slate-500'
                  }`}
                >
                  <strong>2. Retenção</strong>
                  <p className="text-[10px] opacity-80">Mapeando picos</p>
                </div>
                <div
                  className={`p-2 rounded-lg border transition-all ${
                    analysisStep >= 3
                      ? 'border-rose-500/50 bg-rose-950/40 text-rose-200'
                      : 'border-slate-800 bg-slate-900/50 text-slate-500'
                  }`}
                >
                  <strong>3. Cortes</strong>
                  <p className="text-[10px] opacity-80">Isolando ganchos</p>
                </div>
                <div
                  className={`p-2 rounded-lg border transition-all ${
                    analysisStep >= 4
                      ? 'border-emerald-500/50 bg-emerald-950/40 text-emerald-200'
                      : 'border-slate-800 bg-slate-900/50 text-slate-500'
                  }`}
                >
                  <strong>4. Formato 9:16</strong>
                  <p className="text-[10px] opacity-80">Legendas dinâmicas</p>
                </div>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="mt-3 flex items-center gap-2 rounded-xl border border-rose-500/50 bg-rose-950/50 p-3 text-xs text-rose-300 font-medium">
              <HelpCircle className="h-4 w-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Quick Preset Buttons for Testing */}
          <div className="mt-5 flex flex-wrap items-center gap-2 text-xs text-slate-400">
            <span className="font-semibold text-slate-300">Exemplos rápidos para testar:</span>
            {SAMPLE_VIDEOS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className="rounded-lg border border-slate-800 bg-slate-900/70 px-2.5 py-1 text-slate-300 hover:border-slate-700 hover:bg-slate-800 hover:text-white transition-colors"
              >
                {preset.title.slice(0, 30)}...
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Success Notification Banner */}
      {successBanner && (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-emerald-500/40 bg-emerald-950/40 p-4 text-xs font-semibold text-emerald-300 shadow-lg">
          <div className="flex items-center gap-2.5">
            <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />
            <span>{successBanner}</span>
          </div>
          <button
            onClick={() => resultsRef.current?.scrollIntoView({ behavior: 'smooth' })}
            className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-white hover:bg-emerald-500 transition-colors shrink-0 font-bold"
          >
            <span>Ver Cortes Abaixo</span>
            <ArrowDown className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Retention Curve & AI Diagnostics Banner */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              <h2 className="text-base font-bold text-white">Curva de Retenção & Picos Virais</h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Identificação matemática de picos de atenção para cortes de alta conversão
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/90 px-2.5 py-1 text-xs font-semibold text-slate-300">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>
                {engineInfo.source === 'gemini-ai'
                  ? `IA Ativa (${engineInfo.modelUsed?.replace('gemini-', '') || 'Gemini'})`
                  : 'Motor Heurístico Resiliente'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-950/40 px-3 py-1 text-xs font-bold text-emerald-300">
              <Flame className="h-3.5 w-3.5 text-emerald-400" />
              Virality Score: {currentAnalysis.estimatedViralityScore}/100
            </div>
          </div>
        </div>

        {/* Video Active Information Card */}
        <div className="mt-4 flex flex-wrap items-center gap-4 bg-slate-950/80 p-3 rounded-xl border border-slate-800/80">
          <img
            src={currentAnalysis.thumbnailUrl}
            alt={currentAnalysis.title}
            className="h-14 w-24 object-cover rounded-lg border border-slate-800 shadow"
          />
          <div className="flex-1 min-w-[200px]">
            <h4 className="text-sm font-bold text-white line-clamp-1">{currentAnalysis.title}</h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Canal: <strong className="text-slate-200">{currentAnalysis.author}</strong> | Duração:{' '}
              <strong className="text-slate-200">{currentAnalysis.duration}</strong>
            </p>
          </div>
          {currentAnalysis.youtubeUrl && (
            <a
              href={currentAnalysis.youtubeUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 bg-rose-950/40 border border-rose-500/30 px-3 py-1.5 rounded-lg font-semibold transition-colors"
            >
              <span>Abrir no YouTube</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>

        {/* SVG Interactive Retention Graph */}
        <div className="mt-4 overflow-x-auto">
          <div className="min-w-[640px] h-44 relative bg-slate-950/70 rounded-xl p-4 border border-slate-800/80">
            {/* Background Grid Lines */}
            <div className="absolute inset-x-4 top-4 bottom-8 flex flex-col justify-between pointer-events-none opacity-20">
              <div className="border-b border-slate-700 w-full" />
              <div className="border-b border-slate-700 w-full" />
              <div className="border-b border-slate-700 w-full" />
              <div className="border-b border-slate-700 w-full" />
            </div>

            {/* Retention Points & Bars */}
            <div className="relative h-28 flex items-end justify-between px-2 gap-2">
              {currentAnalysis.retentionAnalysis.map((pt, idx) => {
                const isPeak = pt.retentionPercentage >= 90;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center group relative">
                    {/* Tooltip on hover */}
                    <div className="absolute -top-12 z-20 hidden group-hover:flex flex-col items-center bg-slate-800 text-white text-[10px] px-2 py-1 rounded shadow-xl whitespace-nowrap border border-slate-700">
                      <span className="font-bold text-rose-400">{pt.retentionPercentage}% de retenção</span>
                      <span className="text-slate-300">{pt.spikeReason}</span>
                    </div>

                    {/* Bar visualization */}
                    <div
                      className={`w-full max-w-[32px] rounded-t-md transition-all duration-300 ${
                        isPeak
                          ? 'bg-gradient-to-t from-rose-600 to-amber-400 shadow-md shadow-rose-600/30'
                          : 'bg-slate-700 group-hover:bg-slate-600'
                      }`}
                      style={{ height: `${pt.retentionPercentage * 0.9}%` }}
                    />
                    <span className="mt-2 text-[10px] font-mono text-slate-400">{pt.timeLabel}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 px-2 border-t border-slate-800/60 pt-1">
              <span>Início do Vídeo</span>
              <span className="flex items-center gap-1 text-amber-400 font-semibold">
                <Sparkles className="h-3 w-3" /> Picos identificados como cortes automáticos
              </span>
              <span>Final ({currentAnalysis.duration})</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Workspace: Left = Clips List, Right = Vertical 9:16 Editor & Social Exporter */}
      <section ref={resultsRef} className="space-y-6 pt-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <Scissors className="h-5 w-5 text-rose-500" />
              Cortes Virais Prontos ({currentAnalysis.clips.length})
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Clique em um corte para editar no Estúdio 9:16 ou faça download imediato do vídeo ou legendas.
            </p>
          </div>

          {/* Dynamic Category Filter */}
          <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/60 p-1 text-xs">
            {availableCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilterCategory(cat)}
                className={`rounded-lg px-2.5 py-1 font-medium transition-colors ${
                  filterCategory === cat
                    ? 'bg-rose-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat === 'all' ? 'Todos os Cortes' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Clip Selector Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredClips.map((clip, idx) => {
            const isSelected = selectedClip?.id === clip.id;
            return (
              <div
                key={clip.id || idx}
                className={`rounded-2xl border p-4 transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-rose-500 bg-slate-900 shadow-xl shadow-rose-950/40 ring-2 ring-rose-500/30'
                    : 'border-slate-800 bg-slate-950/70 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="rounded-md bg-rose-500/15 px-2 py-0.5 text-[10px] font-bold text-rose-400 border border-rose-500/25">
                      Corte #{idx + 1} &bull; {clip.category}
                    </span>
                    <div className="flex items-center gap-1 text-[11px] font-extrabold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      <Flame className="h-3 w-3" />
                      {clip.viralScore}%
                    </div>
                  </div>

                  <h4 className="mt-2.5 text-sm font-bold text-white line-clamp-1">{clip.title}</h4>
                  <p className="mt-1 text-xs text-slate-300 italic line-clamp-2">"{clip.hook}"</p>

                  <div className="mt-2 text-[11px] font-mono text-slate-400">
                    ⏱️ {Math.floor(clip.startSec / 60)}:{(clip.startSec % 60).toString().padStart(2, '0')} -{' '}
                    {Math.floor(clip.endSec / 60)}:{(clip.endSec % 60).toString().padStart(2, '0')} ({clip.endSec - clip.startSec}s)
                  </div>
                </div>

                {/* Card Direct Action Buttons */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-col gap-2">
                  <button
                    onClick={() => {
                      setSelectedClip(clip);
                      // Scroll to studio
                      setTimeout(() => {
                        const studio = document.getElementById('clip-studio-container');
                        studio?.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }}
                    className={`w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-rose-600 text-white shadow-md'
                        : 'bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    <Play className="h-3.5 w-3.5 fill-current" />
                    <span>{isSelected ? 'Corte em Edição 9:16' : 'Abrir no Estúdio 9:16'}</span>
                  </button>

                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        renderAndDownloadVerticalVideo(clip, currentAnalysis.thumbnailUrl, 'hormozi');
                      }}
                      className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg border border-slate-700 bg-slate-900/80 text-[11px] font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                      title="Baixar vídeo vertical (9:16)"
                    >
                      <Download className="h-3 w-3 text-emerald-400" />
                      <span>Baixar Vídeo</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadSrtSubtitles(clip);
                      }}
                      className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg border border-slate-700 bg-slate-900/80 text-[11px] font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                      title="Baixar arquivo de legendas .SRT para CapCut"
                    >
                      <FileText className="h-3 w-3 text-amber-400" />
                      <span>Legendas .SRT</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Vertical Player & Captions Studio for the Selected Clip */}
        {selectedClip && (
          <div id="clip-studio-container" className="mt-8 rounded-3xl border border-slate-800 bg-slate-950/80 p-6 sm:p-8">
            <div className="mb-6 flex flex-wrap items-center justify-between border-b border-slate-800 pb-4 gap-2">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
                  Estúdio de Edição Vertical 9:16
                </span>
                <h3 className="text-xl font-black text-white">Visualização e Exportação (Reels / TikTok / Shorts)</h3>
              </div>
              <span className="text-xs text-slate-400 font-mono bg-slate-900 border border-slate-800 px-3 py-1 rounded-lg">
                Corte Selecionado: <strong className="text-white">{selectedClip.title}</strong>
              </span>
            </div>

            <VerticalClipPlayer
              clip={selectedClip}
              thumbnailUrl={currentAnalysis.thumbnailUrl}
              videoId={currentAnalysis.videoId}
              videoTitle={currentAnalysis.title}
              analysis={currentAnalysis}
              onExportToSocial={onExportToSocial}
              onSchedulePost={onSchedulePost}
            />
          </div>
        )}
      </section>
    </div>
  );
};
