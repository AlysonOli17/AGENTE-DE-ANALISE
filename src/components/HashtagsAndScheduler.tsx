import React, { useState } from 'react';
import {
  Hash,
  Copy,
  Check,
  Calendar,
  Clock,
  Send,
  Sparkles,
  Share2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { VideoAnalysisResult, ScheduledPost, ViralClip } from '../types';

interface HashtagsAndSchedulerProps {
  analysis: VideoAnalysisResult;
  scheduledPosts: ScheduledPost[];
  onAddScheduledPost: (post: ScheduledPost) => void;
  onDeleteScheduledPost: (id: string) => void;
}

export const HashtagsAndScheduler: React.FC<HashtagsAndSchedulerProps> = ({
  analysis,
  scheduledPosts,
  onAddScheduledPost,
  onDeleteScheduledPost,
}) => {
  const [copiedGroup, setCopiedGroup] = useState<string | null>(null);
  const [selectedClipId, setSelectedClipId] = useState<string>(analysis.clips[0]?.id || '');
  const [selectedPlatforms, setSelectedPlatforms] = useState<('tiktok' | 'instagram' | 'youtube')[]>([
    'tiktok',
    'instagram',
  ]);
  const [scheduledDateTime, setScheduledDateTime] = useState('2026-09-22T19:00');
  const [customCaption, setCustomCaption] = useState(
    analysis.clips[0]?.suggestedPostCaption || 'Corte viral exclusivo analisado por IA. Salve e compartilhe! 🚀'
  );
  const [isScheduling, setIsScheduling] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const handleCopy = (tags: string[], groupName: string) => {
    navigator.clipboard.writeText(tags.join(' '));
    setCopiedGroup(groupName);
    setTimeout(() => setCopiedGroup(null), 2500);
  };

  const togglePlatform = (p: 'tiktok' | 'instagram' | 'youtube') => {
    if (selectedPlatforms.includes(p)) {
      if (selectedPlatforms.length > 1) {
        setSelectedPlatforms(selectedPlatforms.filter((item) => item !== p));
      }
    } else {
      setSelectedPlatforms([...selectedPlatforms, p]);
    }
  };

  const handleSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    const clip = analysis.clips.find((c) => c.id === selectedClipId) || analysis.clips[0];
    if (!clip) return;

    setIsScheduling(true);

    setTimeout(() => {
      const newPost: ScheduledPost = {
        id: `post-${Date.now()}`,
        clipTitle: clip.title,
        platforms: selectedPlatforms,
        scheduledDateTime,
        status: 'scheduled',
        caption: customCaption,
        hashtags: analysis.hashtagSuggestions.trending.slice(0, 3),
        estimatedReach: Math.floor(35000 + Math.random() * 45000),
      };

      onAddScheduledPost(newPost);
      setIsScheduling(false);
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
    }, 600);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="border-b border-slate-800 pb-5">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-400">
          <Hash className="h-3.5 w-3.5" />
          <span>SEO Viral & Agendamento Integrado</span>
        </div>
        <h2 className="mt-2 text-2xl font-black text-white">
          Sugestões de Hashtags & Agendamento de Publicações
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Hashtags preditivas para acelerar a entrega algorítmica e fila de postagens automatizadas.
        </p>
      </div>

      {/* Hashtag Suggestions Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-400" />
            Grupos de Hashtags Virais Recomendadas
          </h3>
          <span className="text-xs text-slate-400">Clique para copiar o bloco completo</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Trending */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
                Em Alta (Geral)
              </span>
              <button
                onClick={() => handleCopy(analysis.hashtagSuggestions.trending, 'trending')}
                className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-2 py-1 text-[11px] font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
              >
                {copiedGroup === 'trending' ? (
                  <>
                    <Check className="h-3 w-3 text-emerald-400" /> Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" /> Copiar
                  </>
                )}
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {analysis.hashtagSuggestions.trending.map((tag, idx) => (
                <span
                  key={idx}
                  className="rounded-lg bg-slate-950 px-2.5 py-1 text-xs font-mono font-medium text-rose-300 border border-slate-800"
                >
                  {tag}
                </span>
              ))}
            </div>
            <p className="mt-3 text-[11px] text-slate-400">
              Taxa de descoberta: <strong>Alta</strong> (+150k impressões médias)
            </p>
          </div>

          {/* Niche Specific */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Nicho & Audiência
              </span>
              <button
                onClick={() => handleCopy(analysis.hashtagSuggestions.niche, 'niche')}
                className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-2 py-1 text-[11px] font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
              >
                {copiedGroup === 'niche' ? (
                  <>
                    <Check className="h-3 w-3 text-emerald-400" /> Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" /> Copiar
                  </>
                )}
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {analysis.hashtagSuggestions.niche.map((tag, idx) => (
                <span
                  key={idx}
                  className="rounded-lg bg-slate-950 px-2.5 py-1 text-xs font-mono font-medium text-amber-300 border border-slate-800"
                >
                  {tag}
                </span>
              ))}
            </div>
            <p className="mt-3 text-[11px] text-slate-400">
              Engajamento qualificado: <strong>Excelente</strong> (Alta conversão de seguidores)
            </p>
          </div>

          {/* High Reach / Explore */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Explorar & FYP
              </span>
              <button
                onClick={() => handleCopy(analysis.hashtagSuggestions.highReach, 'highReach')}
                className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-2 py-1 text-[11px] font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
              >
                {copiedGroup === 'highReach' ? (
                  <>
                    <Check className="h-3 w-3 text-emerald-400" /> Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" /> Copiar
                  </>
                )}
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {analysis.hashtagSuggestions.highReach.map((tag, idx) => (
                <span
                  key={idx}
                  className="rounded-lg bg-slate-950 px-2.5 py-1 text-xs font-mono font-medium text-cyan-300 border border-slate-800"
                >
                  {tag}
                </span>
              ))}
            </div>
            <p className="mt-3 text-[11px] text-slate-400">
              Entrega rápida: <strong>Imediata</strong> no feed de recomendação
            </p>
          </div>
        </div>
      </section>

      {/* Post Scheduler Form & Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Schedule Form */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg">
          <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
            <Calendar className="h-4 w-4 text-rose-400" />
            Agendar Nova Publicação
          </h3>

          <form onSubmit={handleSchedule} className="space-y-4">
            {/* Clip Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Selecione o Corte Viral
              </label>
              <select
                value={selectedClipId}
                onChange={(e) => {
                  setSelectedClipId(e.target.value);
                  const found = analysis.clips.find((c) => c.id === e.target.value);
                  if (found) setCustomCaption(found.suggestedPostCaption);
                }}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white focus:border-rose-500 focus:outline-none"
              >
                {analysis.clips.map((clip) => (
                  <option key={clip.id} value={clip.id}>
                    {clip.title} ({clip.endSec - clip.startSec}s - {clip.viralScore}%)
                  </option>
                ))}
              </select>
            </div>

            {/* Target Platforms */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Plataformas de Publicação Simultânea
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'tiktok', name: 'TikTok', color: 'border-cyan-500/50 bg-cyan-950/20 text-cyan-300' },
                  { id: 'instagram', name: 'Reels', color: 'border-pink-500/50 bg-pink-950/20 text-pink-300' },
                  { id: 'youtube', name: 'Shorts', color: 'border-red-500/50 bg-red-950/20 text-red-300' },
                ].map((p) => {
                  const isSelected = selectedPlatforms.includes(p.id as any);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => togglePlatform(p.id as any)}
                      className={`rounded-xl border p-2 text-center text-xs font-bold transition-all ${
                        isSelected
                          ? `${p.color} ring-1 ring-rose-500`
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {p.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Schedule Date & Time */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Data e Horário (Horário Nobre Recomendado)
              </label>
              <div className="relative">
                <input
                  type="datetime-local"
                  value={scheduledDateTime}
                  onChange={(e) => setScheduledDateTime(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white focus:border-rose-500 focus:outline-none"
                />
              </div>
              <div className="mt-1 flex gap-2 text-[10px] text-slate-400">
                <button
                  type="button"
                  onClick={() => setScheduledDateTime('2026-09-21T18:30')}
                  className="hover:underline text-rose-400"
                >
                  Hoje às 18:30
                </button>
                •
                <button
                  type="button"
                  onClick={() => setScheduledDateTime('2026-09-22T20:00')}
                  className="hover:underline text-rose-400"
                >
                  Amanhã às 20:00
                </button>
              </div>
            </div>

            {/* Caption & Hashtags Textarea */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Legenda & Chamada para Ação (CTA)
              </label>
              <textarea
                rows={3}
                value={customCaption}
                onChange={(e) => setCustomCaption(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white focus:border-rose-500 focus:outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isScheduling}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 p-3 text-xs font-bold text-white shadow-lg hover:brightness-110 active:scale-98 transition-all disabled:opacity-50"
            >
              {isScheduling ? (
                <span>Sincronizando com API...</span>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Confirmar Agendamento Automático</span>
                </>
              )}
            </button>

            {showSuccessToast && (
              <div className="flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-950/60 p-2.5 text-xs text-emerald-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Post agendado na fila com sucesso!</span>
              </div>
            )}
          </form>
        </div>

        {/* Scheduled Posts Queue View */}
        <div className="lg:col-span-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Clock className="h-4 w-4 text-cyan-400" />
                  Fila de Publicações Agendadas ({scheduledPosts.length})
                </h3>
                <p className="text-xs text-slate-400">
                  Integração ativa com Buffer, Hootsuite e APIs oficiais Meta/TikTok
                </p>
              </div>
            </div>

            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
              {scheduledPosts.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400">
                  Nenhuma publicação na fila. Agende um corte ao lado.
                </div>
              ) : (
                scheduledPosts.map((post) => {
                  const isPublished = post.status === 'published';
                  return (
                    <div
                      key={post.id}
                      className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 transition-all hover:border-slate-700"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                isPublished
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              }`}
                            >
                              {isPublished ? 'Publicado' : 'Agendado'}
                            </span>
                            <span className="text-xs font-bold text-white">{post.clipTitle}</span>
                          </div>
                          <p className="mt-1 text-xs text-slate-300 line-clamp-2">{post.caption}</p>
                        </div>

                        <button
                          onClick={() => onDeleteScheduledPost(post.id)}
                          className="rounded p-1 text-slate-500 hover:text-rose-400 transition-colors"
                          title="Remover post"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center justify-between border-t border-slate-800/80 pt-2 text-[11px] text-slate-400">
                        <div className="flex items-center gap-2">
                          <span className="font-mono">
                            📅 {new Date(post.scheduledDateTime).toLocaleString('pt-BR')}
                          </span>
                          <span className="text-slate-600">•</span>
                          <span>Alcance Est: ~{post.estimatedReach.toLocaleString()}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {post.platforms.map((p) => (
                            <span
                              key={p}
                              className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-200"
                            >
                              {p}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Social Webhook integrations status bar */}
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" /> Webhooks de postagem sincronizados (TikTok & Reels)
            </span>
            <span className="text-[11px]">Latência API: 28ms</span>
          </div>
        </div>
      </div>
    </div>
  );
};
