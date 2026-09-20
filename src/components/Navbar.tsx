import React from 'react';
import {
  Scissors,
  BarChart3,
  Calendar,
  ShieldCheck,
  Bell,
  Cpu,
  Lock,
  Download,
  Flame,
  FileSpreadsheet,
} from 'lucide-react';
import { SystemAlert, SecurityConfig, VideoAnalysisResult } from '../types';
import { exportAnalysisToPDF, exportAnalysisToCSV } from '../utils/exportPdfCsv';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  alerts: SystemAlert[];
  security: SecurityConfig;
  currentAnalysis: VideoAnalysisResult;
  onOpenNotifications: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  alerts,
  security,
  currentAnalysis,
  onOpenNotifications,
}) => {
  const unreadAlertsCount = alerts.filter((a) => !a.read).length;

  const navItems = [
    { id: 'cuts', label: 'Cortes & IA', icon: Scissors },
    { id: 'dashboard', label: 'Métricas & Retenção', icon: BarChart3 },
    { id: 'scheduler', label: 'Hashtags & Agendamento', icon: Calendar },
    { id: 'security', label: 'Segurança 2FA / E2EE', icon: ShieldCheck },
    { id: 'automation', label: 'Automação & Nuvem', icon: Bell },
    { id: 'infra', label: 'Infra & SLA', icon: Cpu },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand & Status */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 shadow-lg shadow-rose-950/50">
            <Flame className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-extrabold tracking-tight text-white">ViralClip AI</span>
              <span className="rounded-full border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold text-rose-400">
                PRO AGENT
              </span>
            </div>
            <p className="text-xs text-slate-400">Cortes de Alta Retenção & Automação Social</p>
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-900/60 p-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`tab-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right side actions: E2EE status, 2FA, Exports, Notifications */}
        <div className="flex items-center gap-2">
          {/* Security Badges */}
          <div className="hidden sm:flex items-center gap-2 text-[11px] font-medium">
            <span
              className={`flex items-center gap-1 rounded-md px-2 py-1 border ${
                security.isE2EEActive
                  ? 'border-emerald-500/30 bg-emerald-950/40 text-emerald-300'
                  : 'border-slate-800 bg-slate-900 text-slate-400'
              }`}
              title="Criptografia AES-GCM 256 bits ativada"
            >
              <Lock className="h-3 w-3 text-emerald-400" />
              E2EE
            </span>
            <span
              className={`flex items-center gap-1 rounded-md px-2 py-1 border ${
                security.is2FAEnabled
                  ? 'border-indigo-500/30 bg-indigo-950/40 text-indigo-300'
                  : 'border-slate-800 bg-slate-900 text-slate-400'
              }`}
              title="Autenticação de 2 Fatores ativa"
            >
              <ShieldCheck className="h-3 w-3 text-indigo-400" />
              2FA
            </span>
          </div>

          {/* Quick export dropdown/buttons */}
          <div className="flex items-center gap-1.5">
            <button
              id="export-pdf-btn"
              onClick={() => exportAnalysisToPDF(currentAnalysis)}
              title="Exportar Relatório Completo em PDF"
              className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-slate-700 hover:bg-slate-800 hover:text-white"
            >
              <Download className="h-3.5 w-3.5 text-rose-400" />
              <span className="hidden md:inline">PDF</span>
            </button>
            <button
              id="export-csv-btn"
              onClick={() => exportAnalysisToCSV(currentAnalysis)}
              title="Exportar Métricas em CSV"
              className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-slate-700 hover:bg-slate-800 hover:text-white"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-400" />
              <span className="hidden md:inline">CSV</span>
            </button>
          </div>

          {/* Notifications Bell */}
          <button
            id="notifications-bell-btn"
            onClick={onOpenNotifications}
            className="relative rounded-lg border border-slate-800 bg-slate-900 p-2 text-slate-300 transition-colors hover:border-slate-700 hover:bg-slate-800 hover:text-white"
            title="Central de Alertas Push"
          >
            <Bell className="h-4 w-4" />
            {unreadAlertsCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[9px] font-bold text-white shadow-sm">
                {unreadAlertsCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Scrollbar */}
      <div className="flex lg:hidden overflow-x-auto border-t border-slate-900 px-3 py-1.5 gap-1.5 bg-slate-950/95 scrollbar-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium ${
                isActive ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
