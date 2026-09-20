/**
 * ViralClip AI - Agente de Análise de Vídeos Virais & Cortes Automáticos
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { VideoAnalyzer } from './components/VideoAnalyzer';
import { DashboardMetrics } from './components/DashboardMetrics';
import { HashtagsAndScheduler } from './components/HashtagsAndScheduler';
import { SecurityAnd2FA } from './components/SecurityAnd2FA';
import { AutomationAndAlerts } from './components/AutomationAndAlerts';
import { InfraMonitoring } from './components/InfraMonitoring';
import { NotificationModal } from './components/NotificationModal';
import {
  INITIAL_ANALYSIS,
  INITIAL_SCHEDULED_POSTS,
  INITIAL_SECURITY,
  INITIAL_ACCOUNTS,
  INITIAL_RULES,
  INITIAL_ALERTS,
  INITIAL_INFRA,
} from './utils/sampleData';
import {
  VideoAnalysisResult,
  ScheduledPost,
  SecurityConfig,
  ConnectedAccount,
  AutomationRule,
  SystemAlert,
  InfraStatus,
  ViralClip,
} from './types';
import { Flame, ShieldCheck, Lock, Activity, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('cuts');
  const [currentAnalysis, setCurrentAnalysis] = useState<VideoAnalysisResult>(INITIAL_ANALYSIS);
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>(INITIAL_SCHEDULED_POSTS);
  const [security, setSecurity] = useState<SecurityConfig>(INITIAL_SECURITY);
  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccount[]>(INITIAL_ACCOUNTS);
  const [rules, setRules] = useState<AutomationRule[]>(INITIAL_RULES);
  const [alerts, setAlerts] = useState<SystemAlert[]>(INITIAL_ALERTS);
  const [infra, setInfra] = useState<InfraStatus>(INITIAL_INFRA);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAnalysisComplete = (result: VideoAnalysisResult) => {
    setCurrentAnalysis(result);
    // Add an alert for the newly analyzed video
    const newAlert: SystemAlert = {
      id: `alt-${Date.now()}`,
      timestamp: 'Agora',
      priority: 'HIGH',
      title: `Análise Concluída (${result.estimatedViralityScore}% Viral)`,
      message: `O vídeo "${result.title}" gerou ${result.clips.length} cortes automáticos com curva de retenção otimizada.`,
      read: false,
    };
    setAlerts((prev) => [newAlert, ...prev]);
    showToast(`Vídeo analisado com sucesso! ${result.clips.length} cortes virais identificados.`);
  };

  const handleExportToSocial = (clip: ViralClip, platform: 'tiktok' | 'instagram' | 'youtube') => {
    const platformNames: Record<string, string> = {
      tiktok: 'TikTok',
      instagram: 'Instagram Reels',
      youtube: 'YouTube Shorts',
    };
    const newAlert: SystemAlert = {
      id: `alt-${Date.now()}`,
      timestamp: 'Agora',
      priority: 'HIGH',
      title: `Corte Exportado para ${platformNames[platform]}`,
      message: `"${clip.title}" enviado com formato 1080x1920 (9:16) e legendas dinâmicas embutidas.`,
      read: false,
    };
    setAlerts((prev) => [newAlert, ...prev]);
    showToast(`Corte "${clip.title}" exportado para ${platformNames[platform]}!`);
  };

  const handleSchedulePostFromClip = (clip: ViralClip) => {
    setActiveTab('scheduler');
    showToast(`Corte "${clip.title}" selecionado para agendamento.`);
  };

  const handleUpdateSecurity = (newConfig: Partial<SecurityConfig>) => {
    setSecurity((prev) => ({ ...prev, ...newConfig }));
    showToast('Configurações de segurança atualizadas.');
  };

  const handleToggleAccount2FA = (accountId: string) => {
    setConnectedAccounts((prev) =>
      prev.map((acc) => (acc.id === accountId ? { ...acc, twoFactorGuarded: !acc.twoFactorGuarded } : acc))
    );
    showToast('Status 2FA da conta atualizado.');
  };

  const handleAddRule = (rule: AutomationRule) => {
    setRules((prev) => [rule, ...prev]);
    showToast(`Regra "${rule.name}" ativada.`);
  };

  const handleToggleRule = (id: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const handleDeleteRule = (id: string) => {
    setRules((prev) => prev.filter((r) => r.id !== id));
    showToast('Regra de automação removida.');
  };

  const handleAddScheduledPost = (post: ScheduledPost) => {
    setScheduledPosts((prev) => [post, ...prev]);
    showToast('Publicação agendada com sucesso!');
  };

  const handleDeleteScheduledPost = (id: string) => {
    setScheduledPosts((prev) => prev.filter((p) => p.id !== id));
    showToast('Publicação removida da fila.');
  };

  const handleMarkAlertsRead = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
  };

  const handleSendTestNotification = (priority: 'CRITICAL' | 'HIGH' | 'INFO') => {
    const alert: SystemAlert = {
      id: `alt-${Date.now()}`,
      timestamp: 'Agora',
      priority,
      title:
        priority === 'CRITICAL'
          ? 'Alerta Crítico: Desvio no Algoritmo de Retenção'
          : priority === 'HIGH'
          ? 'Alerta Alto: Pico de Engajamento em Tempo Real'
          : 'Status: Cluster de Transcodificação Operacional',
      message:
        priority === 'CRITICAL'
          ? 'Detecção de queda abrupta de retenção na introdução. O agente recomenda revisar o gancho.'
          : priority === 'HIGH'
          ? 'O corte gerado no TikTok atingiu 10.000 visualizações na primeira hora.'
          : 'Todos os 4 nós GPU e servidores de inferência estão operando em 99.98% de SLA.',
      read: false,
    };
    setAlerts((prev) => [alert, ...prev]);
    setIsNotificationOpen(true);
    showToast(`Alerta de prioridade ${priority} emitido no sistema.`);
  };

  const handleSimulateFailover = () => {
    setInfra((prev) => ({
      ...prev,
      lastFailoverCheck: 'Executado agora com 100% de sucesso',
      activeTranscodeJobs: 2,
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        alerts={alerts}
        security={security}
        currentAnalysis={currentAnalysis}
        onOpenNotifications={() => setIsNotificationOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === 'cuts' && (
          <VideoAnalyzer
            currentAnalysis={currentAnalysis}
            onAnalysisComplete={handleAnalysisComplete}
            onExportToSocial={handleExportToSocial}
            onSchedulePost={handleSchedulePostFromClip}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardMetrics analysis={currentAnalysis} />
        )}

        {activeTab === 'scheduler' && (
          <HashtagsAndScheduler
            analysis={currentAnalysis}
            scheduledPosts={scheduledPosts}
            onAddScheduledPost={handleAddScheduledPost}
            onDeleteScheduledPost={handleDeleteScheduledPost}
          />
        )}

        {activeTab === 'security' && (
          <SecurityAnd2FA
            security={security}
            connectedAccounts={connectedAccounts}
            onUpdateSecurity={handleUpdateSecurity}
            onToggleAccount2FA={handleToggleAccount2FA}
          />
        )}

        {activeTab === 'automation' && (
          <AutomationAndAlerts
            rules={rules}
            alerts={alerts}
            connectedAccounts={connectedAccounts}
            onAddRule={handleAddRule}
            onToggleRule={handleToggleRule}
            onDeleteRule={handleDeleteRule}
            onMarkAlertsRead={handleMarkAlertsRead}
            onSendTestNotification={handleSendTestNotification}
          />
        )}

        {activeTab === 'infra' && (
          <InfraMonitoring infra={infra} onSimulateFailover={handleSimulateFailover} />
        )}
      </main>

      {/* Global Toast Message */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl border border-rose-500/40 bg-slate-900/95 p-4 text-xs font-semibold text-white shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="h-4 w-4 text-rose-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Notification Center Modal */}
      <NotificationModal
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        alerts={alerts}
        onMarkAllRead={handleMarkAlertsRead}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-400">
            <Flame className="h-4 w-4 text-rose-500" />
            <span className="font-bold text-white">ViralClip AI</span>
            <span>— Agente de Inteligência Viral & Cortes Automáticos</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1 text-emerald-400">
              <Lock className="h-3 w-3" /> E2EE AES-GCM Ativo
            </span>
            <span className="flex items-center gap-1 text-indigo-400">
              <ShieldCheck className="h-3 w-3" /> 2FA Autenticado
            </span>
            <span className="flex items-center gap-1 text-cyan-400">
              <Activity className="h-3 w-3" /> 99.98% SLA
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
