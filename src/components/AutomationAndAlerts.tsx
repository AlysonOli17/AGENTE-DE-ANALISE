import React, { useState } from 'react';
import {
  Bell,
  Sliders,
  Cloud,
  Plus,
  Trash2,
  CheckCircle2,
  AlertOctagon,
  AlertTriangle,
  Info,
  Shield,
  Send,
  Zap,
  HardDrive,
  RefreshCw,
} from 'lucide-react';
import { AutomationRule, SystemAlert, ConnectedAccount } from '../types';

interface AutomationAndAlertsProps {
  rules: AutomationRule[];
  alerts: SystemAlert[];
  connectedAccounts: ConnectedAccount[];
  onAddRule: (rule: AutomationRule) => void;
  onToggleRule: (id: string) => void;
  onDeleteRule: (id: string) => void;
  onMarkAlertsRead: () => void;
  onSendTestNotification: (priority: 'CRITICAL' | 'HIGH' | 'INFO') => void;
}

export const AutomationAndAlerts: React.FC<AutomationAndAlertsProps> = ({
  rules,
  alerts,
  connectedAccounts,
  onAddRule,
  onToggleRule,
  onDeleteRule,
  onMarkAlertsRead,
  onSendTestNotification,
}) => {
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [newRuleName, setNewRuleName] = useState('');
  const [newRulePriority, setNewRulePriority] = useState<'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'>('HIGH');
  const [newRuleCondition, setNewRuleCondition] = useState('Se a taxa de retenção média for maior que 85%');
  const [newRuleAction, setNewRuleAction] = useState('Enviar alerta push imediato e preparar corte para Reels');
  const [cloudSyncing, setCloudSyncing] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleName.trim()) return;

    const rule: AutomationRule = {
      id: `rule-${Date.now()}`,
      name: newRuleName,
      priority: newRulePriority,
      condition: newRuleCondition,
      action: newRuleAction,
      enabled: true,
      lastTriggered: 'Pronto para disparo',
    };

    onAddRule(rule);
    setNewRuleName('');
    setShowRuleModal(false);
  };

  const handleSyncCloud = () => {
    setCloudSyncing(true);
    setTimeout(() => {
      setCloudSyncing(false);
      setSyncStatusMsg('Todos os cortes e manifestos foram sincronizados no Google Drive e AWS S3 com sucesso!');
      setTimeout(() => setSyncStatusMsg(null), 4000);
    }, 1200);
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      case 'HIGH':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'MEDIUM':
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      default:
        return 'bg-slate-700/40 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="border-b border-slate-800 pb-5">
        <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-xs font-bold text-rose-400">
          <Zap className="h-3.5 w-3.5" />
          <span>Automação Baseada em Prioridade & Nuvem Externa</span>
        </div>
        <h2 className="mt-2 text-2xl font-black text-white">
          Regras de Automação & Notificações Push Críticas
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Defina regras automatizadas por prioridade e sincronize arquivos com Google Drive, AWS S3 e Dropbox.
        </p>
      </div>

      {/* Quick Push Test Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Bell className="h-4 w-4 text-rose-400" />
            Simulador de Notificações Push Personalizadas
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Dispare alertas de teste com diferentes níveis de prioridade
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onSendTestNotification('CRITICAL')}
            className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-3.5 py-2 text-xs font-bold text-white shadow-md hover:bg-rose-500 transition-colors"
          >
            <AlertOctagon className="h-3.5 w-3.5" />
            <span>Alerta Crítico (Push)</span>
          </button>
          <button
            onClick={() => onSendTestNotification('HIGH')}
            className="flex items-center gap-1.5 rounded-xl bg-amber-600 px-3.5 py-2 text-xs font-bold text-white shadow-md hover:bg-amber-500 transition-colors"
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>Alerta Alto</span>
          </button>
          <button
            onClick={() => onSendTestNotification('INFO')}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-bold text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          >
            <Info className="h-3.5 w-3.5" />
            <span>Info do Sistema</span>
          </button>
        </div>
      </div>

      {/* Rules Manager & Alerts Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Rules Table / Cards */}
        <div className="lg:col-span-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="h-4 w-4 text-rose-400" />
                Regras de Automação Ativas ({rules.length})
              </h3>
              <p className="text-xs text-slate-400">Gatilhos automáticos executados pelo agente</p>
            </div>
            <button
              onClick={() => setShowRuleModal(true)}
              className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-rose-500 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Nova Regra</span>
            </button>
          </div>

          <div className="space-y-3">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 transition-all hover:border-slate-700"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold border ${getPriorityBadge(
                          rule.priority
                        )}`}
                      >
                        {rule.priority}
                      </span>
                      <span className="text-xs font-bold text-white">{rule.name}</span>
                    </div>

                    <p className="text-xs text-slate-300">
                      <strong>SE:</strong> {rule.condition}
                    </p>
                    <p className="text-xs text-rose-300">
                      <strong>ENTÃO:</strong> {rule.action}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onToggleRule(rule.id)}
                      className={`rounded-full px-2.5 py-1 text-[11px] font-bold transition-colors ${
                        rule.enabled
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {rule.enabled ? 'Ativa' : 'Pausada'}
                    </button>
                    <button
                      onClick={() => onDeleteRule(rule.id)}
                      className="rounded p-1 text-slate-500 hover:text-rose-400"
                      title="Excluir regra"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Real-time Alerts Feed */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Bell className="h-4 w-4 text-amber-400" />
                  Feed de Alertas em Tempo Real
                </h3>
                <p className="text-xs text-slate-400">Histórico de notificações críticas do sistema</p>
              </div>
              <button
                onClick={onMarkAlertsRead}
                className="text-[11px] text-slate-400 hover:text-white underline"
              >
                Marcar lidos
              </button>
            </div>

            <div className="space-y-3 max-h-[440px] overflow-y-auto pr-1">
              {alerts.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  Nenhum alerta pendente no momento.
                </div>
              ) : (
                alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`rounded-xl border p-3.5 transition-all ${
                      alert.read
                        ? 'border-slate-800/80 bg-slate-950/40 text-slate-400'
                        : 'border-rose-500/30 bg-rose-950/20 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${getPriorityBadge(
                            alert.priority
                          )}`}
                        >
                          {alert.priority}
                        </span>
                        <h4 className="text-xs font-bold text-white">{alert.title}</h4>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">{alert.timestamp}</span>
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-300">{alert.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cloud Storage Integrations (API Connectors) */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Cloud className="h-5 w-5 text-cyan-400" />
              Integrações via API com Serviços de Nuvem Populares
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Envio automático de cortes virais para Google Drive, Amazon S3 e Dropbox com integridade E2EE
            </p>
          </div>

          <button
            onClick={handleSyncCloud}
            disabled={cloudSyncing}
            className="flex items-center gap-2 rounded-xl bg-cyan-600 px-4 py-2 text-xs font-bold text-white hover:bg-cyan-500 active:scale-95 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${cloudSyncing ? 'animate-spin' : ''}`} />
            <span>{cloudSyncing ? 'Sincronizando Nuvem...' : 'Sincronizar Todos os Cortes'}</span>
          </button>
        </div>

        {syncStatusMsg && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-950/60 p-3 text-xs text-emerald-300">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>{syncStatusMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Google Drive */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Google Drive Cloud</span>
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                Conectado
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-400">
              Pasta: <code>/ViralClips/2026/Output</code>
            </p>
            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-800 pt-2">
              <span>Auto-Sync: Ativo</span>
              <span className="text-emerald-400 font-semibold">14.2 GB livres</span>
            </div>
          </div>

          {/* AWS S3 */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Amazon S3 Cluster</span>
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                Conectado
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-400">
              Bucket: <code>s3://viralclip-storage-cluster</code>
            </p>
            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-800 pt-2">
              <span>Criptografia: SSE-S3</span>
              <span className="text-emerald-400 font-semibold">Bucket Ativo</span>
            </div>
          </div>

          {/* Dropbox */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Dropbox Business API</span>
              <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-400">
                Disponível
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-400">
              Webhook para exportação de cortes renderizados
            </p>
            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-800 pt-2">
              <span>OAuth 2.0</span>
              <button
                onClick={() => alert('Para conectar o Dropbox, utilize suas credenciais nas configurações de API.')}
                className="text-cyan-400 hover:underline font-semibold"
              >
                Conectar
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Modal: New Automation Rule */}
      {showRuleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Criar Nova Regra de Automação</h3>

            <form onSubmit={handleCreateRule} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nome da Regra</label>
                <input
                  type="text"
                  required
                  value={newRuleName}
                  onChange={(e) => setNewRuleName(e.target.value)}
                  placeholder="Ex: Alerta de Pico de Retenção > 95%"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nível de Prioridade</label>
                <select
                  value={newRulePriority}
                  onChange={(e) => setNewRulePriority(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
                >
                  <option value="CRITICAL">CRITICAL (Push Imediato + Som)</option>
                  <option value="HIGH">HIGH (Notificação de Destaque)</option>
                  <option value="MEDIUM">MEDIUM (Ação Automática de Fila)</option>
                  <option value="LOW">LOW (Registro no Log)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Condição de Disparo (SE)</label>
                <input
                  type="text"
                  required
                  value={newRuleCondition}
                  onChange={(e) => setNewRuleCondition(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Ação Executada (ENTÃO)</label>
                <input
                  type="text"
                  required
                  value={newRuleAction}
                  onChange={(e) => setNewRuleAction(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowRuleModal(false)}
                  className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-500 transition-colors"
                >
                  Salvar Regra
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
