import React from 'react';
import { X, Bell, AlertOctagon, AlertTriangle, Info, Check } from 'lucide-react';
import { SystemAlert } from '../types';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: SystemAlert[];
  onMarkAllRead: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  alerts,
  onMarkAllRead,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 p-4 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-rose-500" />
            <h3 className="text-sm font-bold text-white">Central de Notificações Push</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onMarkAllRead}
              className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
            >
              <Check className="h-3 w-3" /> Ler tudo
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {alerts.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              Nenhuma notificação recente.
            </div>
          ) : (
            alerts.map((alert) => {
              const isCrit = alert.priority === 'CRITICAL';
              const isHigh = alert.priority === 'HIGH';
              return (
                <div
                  key={alert.id}
                  className={`rounded-xl border p-3 text-xs transition-colors ${
                    alert.read
                      ? 'border-slate-800/80 bg-slate-950/40 text-slate-400'
                      : isCrit
                      ? 'border-rose-500/40 bg-rose-950/20 text-slate-200'
                      : isHigh
                      ? 'border-amber-500/40 bg-amber-950/20 text-slate-200'
                      : 'border-slate-700 bg-slate-800/40 text-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5 font-bold text-white">
                      {isCrit ? (
                        <AlertOctagon className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                      ) : isHigh ? (
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                      ) : (
                        <Info className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                      )}
                      <span>{alert.title}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono shrink-0">
                      {alert.timestamp}
                    </span>
                  </div>
                  <p className="mt-1 text-slate-300 leading-relaxed">{alert.message}</p>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-800 p-3 bg-slate-950/60 text-center">
          <p className="text-[10px] text-slate-500">
            Notificações push integradas com prioridade em tempo real (RFC Web Push)
          </p>
        </div>
      </div>
    </div>
  );
};
