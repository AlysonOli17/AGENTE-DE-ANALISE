import React, { useState } from 'react';
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
} from 'lucide-react';
import { VideoAnalysisResult, ViralClip } from '../types';
import { SAMPLE_VIDEOS } from '../utils/sampleData';
import { VerticalClipPlayer } from './VerticalClipPlayer';

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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedClip, setSelectedClip] = useState<ViralClip>(currentAnalysis.clips[0] || null);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const handleAnalyze = async (urlToUse?: string, titleToUse?: string, nicheToUse?: string) => {
    const url = urlToUse || youtubeInput;
    if (!url.trim()) {
      setErrorMessage('Por favor, insira o link de um vídeo do YouTube.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

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

      if (!res.ok) {
        throw new Error(`Erro na API (${res.status})`);
      }

      const json = await res.json();
      const rawData = json.data;

      // Extract YouTube Video ID if present
      let videoId = 'viral-vid';
      const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
      if (match && match[1]) {
        videoId = match[1];
      }

      const formattedResult: VideoAnalysisResult = {
        videoId,
        youtubeUrl: url,
        title: titleToUse || videoTitleInput || 'Vídeo Analisado com Sucesso',
        author: 'Criador de Conteúdo',
        duration: '12:40',
        thumbnailUrl: `https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&auto=format&fit=crop&q=80`,
        videoSummary: rawData.videoSummary || 'Análise de retenção de público gerada pelo agente de IA.',
        estimatedViralityScore: rawData.estimatedViralityScore || 94,
        targetAudience: rawData.targetAudience || 'Público interessado em vídeos curtos e conteúdo engajador.',
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
    } catch (err: any) {
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

  const filteredClips =
    filterCategory === 'all'
      ? currentAnalysis.clips
      : currentAnalysis.clips.filter((c) => c.category.toLowerCase().includes(filterCategory.toLowerCase()));

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
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
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
                className="w-full rounded-xl border border-slate-700 bg-slate-900/90 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
              />
            </div>
            <button
              id="analyze-video-btn"
              disabled={isLoading}
              onClick={() => handleAnalyze()}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-rose-950/50 hover:brightness-110 active:scale-98 transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Analisando Retenção...</span>
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4" />
                  <span>Gerar Cortes com IA</span>
                </>
              )}
            </button>
          </div>

          {errorMessage && (
            <p className="mt-2 text-xs text-rose-400 font-medium">{errorMessage}</p>
          )}

          {/* Quick Preset Buttons for Beginners (User explicit requirement) */}
          <div className="mt-5 flex flex-wrap items-center gap-2 text-xs text-slate-400">
            <span className="font-semibold text-slate-300">Exemplos rápidos para testar:</span>
            {SAMPLE_VIDEOS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectPreset(preset)}
                className="rounded-lg border border-slate-800 bg-slate-900/70 px-2.5 py-1 text-slate-300 hover:border-slate-700 hover:bg-slate-800 hover:text-white transition-colors"
              >
                {preset.title.slice(0, 30)}...
              </button>
            ))}
          </div>
        </div>
      </section>

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
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-950/40 px-3 py-1 text-xs font-bold text-emerald-300">
              <Flame className="h-3.5 w-3.5 text-emerald-400" />
              Virality Score: {currentAnalysis.estimatedViralityScore}/100
            </div>
          </div>
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
      <section className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
              <Scissors className="h-5 w-5 text-rose-500" />
              Cortes Virais Prontos ({currentAnalysis.clips.length})
            </h3>
            <p className="text-xs text-slate-400">
              Selecione um corte para visualizar o player vertical 9:16 com legendas dinâmicas
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/60 p-1 text-xs">
            {['all', 'Ganchos', 'Erros', 'Edição', 'Storytelling'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`rounded-lg px-2.5 py-1 font-medium transition-colors ${
                  filterCategory === cat
                    ? 'bg-rose-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat === 'all' ? 'Todos' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Clip Selector Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredClips.map((clip) => {
            const isSelected = selectedClip?.id === clip.id;
            return (
              <div
                key={clip.id}
                onClick={() => setSelectedClip(clip)}
                className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                  isSelected
                    ? 'border-rose-500 bg-slate-900 shadow-lg shadow-rose-950/40 ring-2 ring-rose-500/20'
                    : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-900/50'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="rounded-md bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold text-rose-400 border border-rose-500/20">
                    {clip.category}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                    <Flame className="h-3 w-3" />
                    {clip.viralScore}%
                  </div>
                </div>

                <h4 className="mt-2 text-sm font-bold text-white line-clamp-1">{clip.title}</h4>
                <p className="mt-1 text-xs text-slate-400 line-clamp-2">"{clip.hook}"</p>

                <div className="mt-3 flex items-center justify-between border-t border-slate-800/80 pt-2 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="h-3 w-3" /> {clip.endSec - clip.startSec}s
                  </span>
                  <span className="text-rose-400 font-semibold hover:underline flex items-center gap-1">
                    <Play className="h-3 w-3 fill-rose-400" />
                    {isSelected ? 'Em visualização' : 'Selecionar'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Vertical Player & Captions Studio for the Selected Clip */}
        {selectedClip && (
          <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-950/80 p-6 sm:p-8">
            <div className="mb-6 flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
                  Estúdio de Edição Vertical 9:16
                </span>
                <h3 className="text-xl font-black text-white">Visualização em Tempo Real (Reels / TikTok)</h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                Corte Ativo: #{selectedClip.id}
              </span>
            </div>

            <VerticalClipPlayer
              clip={selectedClip}
              thumbnailUrl={currentAnalysis.thumbnailUrl}
              onExportToSocial={onExportToSocial}
              onSchedulePost={onSchedulePost}
            />
          </div>
        )}
      </section>
    </div>
  );
};
