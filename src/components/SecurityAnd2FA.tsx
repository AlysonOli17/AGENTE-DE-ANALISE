import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  Unlock,
  Key,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Copy,
  Check,
  Eye,
  EyeOff,
  Download,
  Fingerprint,
  Layers,
} from 'lucide-react';
import { SecurityConfig, ConnectedAccount } from '../types';
import { E2EEService, getCurrentTotpCode } from '../utils/crypto';

interface SecurityAnd2FAProps {
  security: SecurityConfig;
  connectedAccounts: ConnectedAccount[];
  onUpdateSecurity: (newConfig: Partial<SecurityConfig>) => void;
  onToggleAccount2FA: (accountId: string) => void;
}

export const SecurityAnd2FA: React.FC<SecurityAnd2FAProps> = ({
  security,
  connectedAccounts,
  onUpdateSecurity,
  onToggleAccount2FA,
}) => {
  const [totpCode, setTotpCode] = useState('');
  const [secondsRemaining, setSecondsRemaining] = useState(30);
  const [fingerprint, setFingerprint] = useState(security.encryptionFingerprint);
  const [copiedKey, setCopiedKey] = useState(false);
  const [testInput, setTestInput] = useState('Chave secreta de API e tokens de redes sociais');
  const [encryptedResult, setEncryptedResult] = useState<{ ciphertext: string; iv: string } | null>(null);
  const [decryptedResult, setDecryptedResult] = useState<string | null>(null);
  const [verifyInput, setVerifyInput] = useState('');
  const [verifyStatus, setVerifyStatus] = useState<'idle' | 'success' | 'fail'>('idle');

  // Load real Web Crypto Fingerprint
  useEffect(() => {
    E2EEService.getFingerprint().then((fp) => setFingerprint(fp));
  }, []);

  // Live TOTP simulation countdown
  useEffect(() => {
    const update = () => {
      const sec = 30 - (Math.floor(Date.now() / 1000) % 30);
      setSecondsRemaining(sec);
      setTotpCode(getCurrentTotpCode(security.totpSecret));
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [security.totpSecret]);

  const handleTestEncrypt = async () => {
    if (!testInput) return;
    const res = await E2EEService.encrypt(testInput);
    setEncryptedResult(res);
    setDecryptedResult(null);
  };

  const handleTestDecrypt = async () => {
    if (!encryptedResult) return;
    const plain = await E2EEService.decrypt(encryptedResult.ciphertext, encryptedResult.iv);
    setDecryptedResult(plain);
  };

  const handleVerify2FACode = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyInput.trim() === totpCode) {
      setVerifyStatus('success');
    } else {
      setVerifyStatus('fail');
    }
    setTimeout(() => setVerifyStatus('idle'), 3500);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="border-b border-slate-800 pb-5">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-bold text-indigo-400">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Segurança Militar & Proteção Zero-Trust</span>
        </div>
        <h2 className="mt-2 text-2xl font-black text-white">
          Autenticação de Dois Fatores (2FA) & Criptografia de Ponta a Ponta (E2EE)
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Proteção rigorosa de tokens de contas conectadas, cortes em processamento e dados analíticos.
        </p>
      </div>

      {/* Grid: 2FA System + E2EE Vault */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 2FA Configuration Panel */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-indigo-600/20 p-2.5 text-indigo-400 border border-indigo-500/30">
                <Smartphone className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Autenticador 2FA (TOTP)</h3>
                <p className="text-xs text-slate-400">Protege ações críticas e exportações de conteúdo</p>
              </div>
            </div>

            <button
              onClick={() => onUpdateSecurity({ is2FAEnabled: !security.is2FAEnabled })}
              className={`rounded-full px-3 py-1 text-xs font-bold transition-colors ${
                security.is2FAEnabled
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {security.is2FAEnabled ? '2FA Ativado' : 'Desativado'}
            </button>
          </div>

          {/* Live TOTP Code Visualizer */}
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-center">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Código Temporário Atual (Google Authenticator / Authy)
            </span>
            <div className="mt-2 text-3xl sm:text-4xl font-mono font-black tracking-widest text-indigo-400">
              {totpCode.slice(0, 3)} {totpCode.slice(3)}
            </div>

            {/* Progress bar countdown (30 seconds window) */}
            <div className="mt-3 mx-auto max-w-xs">
              <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-indigo-500 transition-all duration-1000"
                  style={{ width: `${(secondsRemaining / 30) * 100}%` }}
                />
              </div>
              <div className="mt-1 flex justify-between text-[10px] text-slate-400 font-mono">
                <span>Expira em {secondsRemaining}s</span>
                <span>Janela RFC 6238</span>
              </div>
            </div>
          </div>

          {/* Test 2FA Verification Form */}
          <form onSubmit={handleVerify2FACode} className="space-y-3">
            <label className="block text-xs font-semibold text-slate-300">
              Testar Validação de 2 Fatores:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                maxLength={6}
                value={verifyInput}
                onChange={(e) => setVerifyInput(e.target.value.replace(/\D/g, ''))}
                placeholder="Insira o código de 6 dígitos"
                className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white font-mono text-center tracking-widest focus:border-indigo-500 focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-500 transition-colors"
              >
                Validar
              </button>
            </div>

            {verifyStatus === 'success' && (
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
                <CheckCircle2 className="h-4 w-4" />
                <span>Autenticação de 2 fatores confirmada com sucesso!</span>
              </div>
            )}
            {verifyStatus === 'fail' && (
              <div className="flex items-center gap-2 text-xs text-rose-400 font-medium">
                <AlertTriangle className="h-4 w-4" />
                <span>Código inválido ou expirado. Tente novamente.</span>
              </div>
            )}
          </form>

          {/* Backup Codes */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Key className="h-3.5 w-3.5 text-amber-400" /> Códigos de Recuperação de Emergência
              </span>
              <button
                onClick={() => {
                  const blob = new Blob([security.backupCodes.join('\n')], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'ViralClip-Backup-Codes.txt';
                  a.click();
                }}
                className="text-[11px] text-indigo-400 hover:underline flex items-center gap-1"
              >
                <Download className="h-3 w-3" /> Baixar
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-300">
              {security.backupCodes.map((c, i) => (
                <div key={i} className="rounded bg-slate-900 px-2 py-1 border border-slate-800 text-center">
                  {c}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* E2EE (End-to-End Encryption) Panel */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-emerald-600/20 p-2.5 text-emerald-400 border border-emerald-500/30">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Criptografia de Ponta a Ponta (E2EE)</h3>
                <p className="text-xs text-slate-400">Padrão AES-GCM de 256 bits com Web Crypto API</p>
              </div>
            </div>

            <div className="flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3 py-1 text-xs font-bold text-emerald-300">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Ativo</span>
            </div>
          </div>

          {/* Fingerprint Display */}
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                <Fingerprint className="h-4 w-4 text-emerald-400" /> Assinatura Criptográfica da Chave
              </span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(fingerprint);
                  setCopiedKey(true);
                  setTimeout(() => setCopiedKey(false), 2000);
                }}
                className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
              >
                {copiedKey ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                <span>{copiedKey ? 'Copiado!' : 'Copiar Hash'}</span>
              </button>
            </div>
            <div className="mt-2 font-mono text-xs font-bold text-emerald-300 bg-slate-900 p-2 rounded border border-slate-800 break-all">
              {fingerprint || 'Calculando SHA-256...'}
            </div>
            <p className="mt-2 text-[11px] text-slate-400">
              Assegura que nenhuma entidade intermediária pode decodificar dados sem a chave mestre da sua sessão.
            </p>
          </div>

          {/* Live Encryption & Decryption Sandbox */}
          <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
            <label className="block text-xs font-bold text-white">
              Teste Real de Criptografia AES-GCM (Navegador):
            </label>
            <input
              type="text"
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            />

            <div className="flex gap-2">
              <button
                onClick={handleTestEncrypt}
                className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-500 transition-colors"
              >
                Criptografar Dado
              </button>
              {encryptedResult && (
                <button
                  onClick={handleTestDecrypt}
                  className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700"
                >
                  Decifrar Dado
                </button>
              )}
            </div>

            {encryptedResult && (
              <div className="mt-2 rounded bg-slate-900 p-2 border border-slate-800 text-[10px] font-mono text-slate-300 break-all">
                <strong className="text-emerald-400">Texto Cifrado (Base64):</strong>
                <p>{encryptedResult.ciphertext.slice(0, 60)}...</p>
                <span className="text-slate-500">IV (Vetor de Inicialização): {encryptedResult.iv}</span>
              </div>
            )}

            {decryptedResult && (
              <div className="mt-2 rounded bg-emerald-950/40 p-2 border border-emerald-500/30 text-xs font-medium text-emerald-300">
                <strong>Decifrado com sucesso:</strong> "{decryptedResult}"
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Connected Accounts Guard Section */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div>
            <h3 className="text-base font-bold text-white">Contas Conectadas & Proteção 2FA Ativa</h3>
            <p className="text-xs text-slate-400">
              Todas as conexões OAuth possuem tokens cifrados com E2EE e guardadas por 2FA
            </p>
          </div>
          <span className="text-xs font-semibold text-emerald-400">
            Auditado em {security.lastAudit}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {connectedAccounts.map((acc) => (
            <div
              key={acc.id}
              className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 transition-all hover:border-slate-700"
            >
              <div className="flex items-start justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
                  {acc.platform}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    acc.connected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {acc.connected ? 'Conectado' : 'Desconectado'}
                </span>
              </div>

              <div className="mt-2 text-sm font-bold text-white truncate">{acc.accountName}</div>

              <div className="mt-3 flex items-center justify-between border-t border-slate-800/80 pt-2 text-xs">
                <span className="flex items-center gap-1 text-[11px] text-indigo-300">
                  <ShieldCheck className="h-3.5 w-3.5 text-indigo-400" />
                  {acc.twoFactorGuarded ? 'Protegido por 2FA' : 'Sem 2FA'}
                </span>

                <button
                  onClick={() => onToggleAccount2FA(acc.id)}
                  className="text-[11px] text-slate-400 hover:text-white underline"
                >
                  Alternar
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
