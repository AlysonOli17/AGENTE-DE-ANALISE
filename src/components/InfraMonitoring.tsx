import React, { useState } from 'react';
import {
  Cpu,
  Activity,
  Server,
  ShieldCheck,
  Zap,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Clock,
  HardDrive,
  Download,
} from 'lucide-react';
import { InfraStatus } from '../types';

interface InfraMonitoringProps {
  infra: InfraStatus;
  onSimulateFailover: () => void;
}

export const InfraMonitoring: React.FC<InfraMonitoringProps> = ({ infra, onSimulateFailover }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [failoverMessage, setFailoverMessage] = useState<string | null>(null);

  const handleTriggerFailover = () => {
    setIsRefreshing(true);
    onSimulateFailover();
    setTimeout(() => {
      setIsRefreshing(false);
      setFailoverMessage('Failover executado com sucesso: Tráfego redirecionado para o Cluster GPU Secundário sem queda de SLA!');
      setTimeout(() => setFailoverMessage(null), 4000);
    }, 1000);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-400">
            <Activity className="h-3.5 w-3.5" />
            <span>Disponibilidade Contínua & Central de Infraestrutura</span>
          </div>
          <h2 className="mt-2 text-2xl font-black text-white">
            Monitoramento de Infraestrutura & SLA de Alta Disponibilidade
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Gestão remota de nós de renderização GPU, fila de transcodificação e resposta imediata a falhas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleTriggerFailover}
            disabled={isRefreshing}
            className="flex items-center gap-2 rounded-xl bg-slate-800 border border-slate-700 px-4 py-2.5 text-xs font-bold text-slate-200 hover:bg-slate-700 hover:text-white transition-all disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
            <span>Testar Resposta a Falhas (Failover)</span>
          </button>
        </div>
      </div>

      {failoverMessage && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-950/60 p-3 text-xs text-emerald-300">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{failoverMessage}</span>
        </div>
      )}

      {/* KPI Cards: SLA, Latency, Queue Depth, GPU Load */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">SLA de Disponibilidade</span>
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-400">{infra.uptimePct}%</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Últimos 30 dias (Zero downtime crítico)</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Latência Média de API</span>
            <Activity className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{infra.avgApiLatencyMs}ms</span>
            <span className="text-xs font-bold text-emerald-400">Rápido</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Edge Gateway + Cache de inferência</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Fila de Transcodificação</span>
            <Clock className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{infra.queueDepth} vídeos</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Tempo estimado por corte: ~3.8s</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Carga do Cluster GPU</span>
            <Cpu className="h-4 w-4 text-rose-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{infra.gpuLoadPct}%</span>
            <span className="text-xs font-bold text-emerald-400">Estável</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">NVIDIA A100 Tensor Core</p>
        </div>
      </div>

      {/* Cluster Nodes Health Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Server className="h-4 w-4 text-cyan-400" />
              Nós do Cluster em Execução
            </h3>
            <p className="text-xs text-slate-400">
              Topologia distribuída para decodificação de vídeo, inferência de IA e criptografia E2EE
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Checagem automática: {infra.lastFailoverCheck}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {infra.nodes.map((node, i) => (
            <div
              key={i}
              className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">{node.name}</h4>
                  <span className="text-[11px] text-slate-400">{node.type}</span>
                </div>
                <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Operacional
                </span>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Carga de Processamento</span>
                  <span className="font-mono text-white">{node.load}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-cyan-400"
                    style={{ width: `${node.load}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-800/80 pt-2">
                <span>Latência: {node.latencyMs}ms</span>
                <span className="text-emerald-400 font-semibold">Health: 100% OK</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Relatórios Mensais Detalhados & Análise Preditiva de Infraestrutura */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg">
        <h3 className="text-base font-bold text-white mb-2">
          Relatório Operacional Mensal & Previsão de Capacidade
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Algoritmo preditivo de provisionamento automático de nós para picos de renderização viral
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
            <strong className="text-emerald-400 block mb-1">Tempo Médio de Resposta:</strong>
            Redução de 18% no tempo de extração de legendas dinâmicas após ativação da GPU dedicada.
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
            <strong className="text-cyan-400 block mb-1">Auto-Scaling Inteligente:</strong>
            Capacidade de transcodificar até 450 cortes verticais simultâneos sem aumento de latência.
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
            <strong className="text-amber-400 block mb-1">Zero-Trust & E2EE:</strong>
            100% dos dados em trânsito e em repouso verificados contra violações de integridade.
          </div>
        </div>
      </div>
    </div>
  );
};
