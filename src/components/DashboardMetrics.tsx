import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Flame,
  Users,
  Eye,
  Share2,
  Clock,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowUpRight,
  Filter,
} from 'lucide-react';
import { VideoAnalysisResult, ViralClip } from '../types';
import { exportAnalysisToPDF, exportAnalysisToCSV } from '../utils/exportPdfCsv';

interface DashboardMetricsProps {
  analysis: VideoAnalysisResult;
}

export const DashboardMetrics: React.FC<DashboardMetricsProps> = ({ analysis }) => {
  const [activePlatformFilter, setActivePlatformFilter] = useState<'all' | 'tiktok' | 'instagram' | 'youtube'>('all');

  // Computed summary metrics
  const totalClips = analysis.clips.length;
  const avgViralScore = Math.round(
    analysis.clips.reduce((acc, c) => acc + c.viralScore, 0) / (totalClips || 1)
  );
  const avgRetention = Math.round(
    analysis.retentionAnalysis.reduce((acc, r) => acc + r.retentionPercentage, 0) /
      (analysis.retentionAnalysis.length || 1)
  );

  return (
    <div className="space-y-8">
      {/* Top Header with Report Export Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Métricas de Performance & Análise Preditiva em Tempo Real</span>
          </div>
          <h2 className="mt-2 text-2xl font-black text-white">
            Dashboard de Engajamento & Inteligência Viral
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Monitoramento preditivo baseado no algoritmo de retenção do TikTok, Instagram Reels e YouTube Shorts
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => exportAnalysisToPDF(analysis)}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-rose-950/40 hover:brightness-110 active:scale-95 transition-all"
          >
            <Download className="h-4 w-4" />
            <span>Exportar Relatório PDF</span>
          </button>
          <button
            onClick={() => exportAnalysisToCSV(analysis)}
            className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-bold text-slate-200 hover:bg-slate-700 hover:text-white transition-all"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Alcance Estimado Total</span>
            <Eye className="h-4 w-4 text-rose-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">482.6k</span>
            <span className="flex items-center text-xs font-bold text-emerald-400">
              <ArrowUpRight className="h-3.5 w-3.5" /> +34%
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Estimativa baseada em 3 cortes publicados</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Score Viral Médio</span>
            <Flame className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{avgViralScore}/100</span>
            <span className="flex items-center text-xs font-bold text-emerald-400">
              <ArrowUpRight className="h-3.5 w-3.5" /> Top 5%
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Potencial de recomendação algorítmica</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Taxa Média de Retenção</span>
            <Clock className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{avgRetention}%</span>
            <span className="flex items-center text-xs font-bold text-emerald-400">
              <ArrowUpRight className="h-3.5 w-3.5" /> +18.4%
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Acima do benchmark da categoria (65%)</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">K-Factor (Viralidade)</span>
            <Share2 className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">1.42x</span>
            <span className="rounded bg-cyan-950/60 px-1.5 py-0.5 text-[10px] font-bold text-cyan-300">
              Exponencial
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Cada espectador atrai 1.4 novos usuários</p>
        </div>
      </div>

      {/* Charts Section: 1. Curva de Retenção Detalhada 2. Distribuição por Plataforma */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Curva de Retenção Segundo a Segundo */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-rose-400" />
                Retenção Preditiva vs. Linha de Abandono Crítico
              </h3>
              <p className="text-[11px] text-slate-400">
                Picos de atenção nos primeiros 3 minutos geram a maior probabilidade de viralização
              </p>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-1 rounded border border-emerald-500/20">
              Retenção Otimizada
            </span>
          </div>

          <div className="mt-4 h-60 w-full relative flex items-end justify-between gap-3 pt-6 px-3 bg-slate-950/60 rounded-xl border border-slate-800">
            {/* Horizontal benchmark line (70% safe threshold) */}
            <div className="absolute inset-x-3 top-[30%] border-b border-dashed border-emerald-500/40 z-10 flex justify-end">
              <span className="text-[9px] font-mono text-emerald-400 bg-slate-950 px-1">Meta 70% Viral</span>
            </div>

            {/* Critical drop line (40%) */}
            <div className="absolute inset-x-3 top-[60%] border-b border-dashed border-rose-500/40 z-10 flex justify-end">
              <span className="text-[9px] font-mono text-rose-400 bg-slate-950 px-1">Zona Crítica (40%)</span>
            </div>

            {analysis.retentionAnalysis.map((item, index) => {
              const isPeak = item.retentionPercentage >= 90;
              return (
                <div key={index} className="flex-1 flex flex-col items-center group relative z-20">
                  <div className="absolute -top-9 hidden group-hover:flex flex-col items-center bg-slate-800 text-white text-[10px] px-2 py-1 rounded shadow-xl whitespace-nowrap border border-slate-700">
                    <span className="font-bold">{item.retentionPercentage}%</span>
                    <span className="text-slate-300">{item.timeLabel}</span>
                  </div>

                  <div
                    className={`w-full max-w-[28px] rounded-t transition-all duration-500 ${
                      isPeak
                        ? 'bg-gradient-to-t from-rose-600 to-amber-400'
                        : item.retentionPercentage >= 70
                        ? 'bg-gradient-to-t from-emerald-700 to-emerald-400'
                        : 'bg-slate-700'
                    }`}
                    style={{ height: `${item.retentionPercentage * 1.8}px` }}
                  />
                  <span className="mt-2 text-[10px] font-mono text-slate-400">{item.timeLabel}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-400 px-1">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-rose-500" /> Picos de Alta Retenção (&gt;90%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> Faixa Segura de Engajamento
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-slate-600" /> Zonas de Transição
            </span>
          </div>
        </div>

        {/* Platform Share & Distribution */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="h-4 w-4 text-cyan-400" />
              Projeção por Plataforma
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Distribuição estimada do alcance algorítmico
            </p>

            <div className="mt-6 space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" /> TikTok
                  </span>
                  <span>56% (270k)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full rounded-full bg-cyan-400" style={{ width: '56%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-pink-500" /> Instagram Reels
                  </span>
                  <span>32% (154k)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full rounded-full bg-pink-500" style={{ width: '32%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-500" /> YouTube Shorts
                  </span>
                  <span>12% (58k)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full rounded-full bg-red-500" style={{ width: '12%' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950 p-3 text-[11px] text-slate-400">
            <strong className="text-white block mb-1">Insight do Algoritmo:</strong>
            O corte com o gancho "A Regra dos Primeiros 3 Segundos" possui 2.3x mais aderência no formato do TikTok devido à velocidade da fala.
          </div>
        </div>
      </div>

      {/* Relatório Mensal & Análise Preditiva do Sistema */}
      <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/30 to-slate-900 p-6 shadow-lg">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-indigo-600/20 p-2.5 border border-indigo-500/30 text-indigo-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Relatório Mensal Preditivo & Recomendações Operacionais</h3>
              <p className="text-xs text-slate-300">
                Gerado automaticamente pelo modelo Gemini 3.8 com base nos padrões virais do canal
              </p>
            </div>
          </div>
          <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-bold text-indigo-300 border border-indigo-500/30">
            Ciclo Setembro / 2026
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {analysis.predictiveRecommendations.map((rec, i) => (
            <div
              key={i}
              className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-xs leading-relaxed text-slate-300 shadow-sm"
            >
              <div className="flex items-center gap-2 font-bold text-indigo-300 mb-2">
                <CheckCircle2 className="h-4 w-4 text-indigo-400 shrink-0" />
                <span>Diretriz #{i + 1}</span>
              </div>
              <p>{rec}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Per-Clip Performance Breakdown Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white">Métricas Comparativas por Corte Viral</h3>
            <p className="text-xs text-slate-400">Acompanhamento detalhado de retenção, tempo e alcance previsto</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3">Corte</th>
                <th className="p-3">Categoria</th>
                <th className="p-3">Duração</th>
                <th className="p-3">Pico Retenção</th>
                <th className="p-3">Score Viral</th>
                <th className="p-3">Plataformas Recomendadas</th>
                <th className="p-3 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {analysis.clips.map((clip) => (
                <tr key={clip.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3">
                    <div className="font-bold text-white">{clip.title}</div>
                    <div className="text-[11px] text-slate-400 line-clamp-1">{clip.hook}</div>
                  </td>
                  <td className="p-3">
                    <span className="rounded bg-rose-500/10 px-2 py-0.5 text-[10px] font-semibold text-rose-400 border border-rose-500/20">
                      {clip.category}
                    </span>
                  </td>
                  <td className="p-3 font-mono">{clip.endSec - clip.startSec}s</td>
                  <td className="p-3">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                      <TrendingUp className="h-3.5 w-3.5" />
                      {clip.retentionPeak}%
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1 font-bold text-amber-400">
                      <Flame className="h-3.5 w-3.5" />
                      {clip.viralScore}%
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {clip.recommendedPlatforms.map((p, i) => (
                        <span key={i} className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-300">
                          {p}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => exportAnalysisToPDF(analysis)}
                      className="rounded-lg bg-slate-800 px-2.5 py-1 text-[11px] font-semibold text-slate-200 hover:bg-slate-700 hover:text-white"
                    >
                      Exportar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
