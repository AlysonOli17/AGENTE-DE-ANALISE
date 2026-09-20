import { VideoAnalysisResult, ScheduledPost, ConnectedAccount, SecurityConfig, AutomationRule, SystemAlert, InfraStatus } from '../types';

export const SAMPLE_VIDEOS: { title: string; url: string; author: string; duration: string; thumbnail: string; niche: string }[] = [
  {
    title: 'Como Hackear o Algoritmo do YouTube & TikTok em 2026',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    author: 'Growth Mastermind',
    duration: '14:28',
    thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&auto=format&fit=crop&q=80',
    niche: 'Marketing & Criação de Conteúdo',
  },
  {
    title: 'Podcast Revelações: O Segredo de 1 Milhão de Seguidores',
    url: 'https://www.youtube.com/watch?v=L_LUpnjgPso',
    author: 'Flow & Insights Pod',
    duration: '42:15',
    thumbnail: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&auto=format&fit=crop&q=80',
    niche: 'Podcasts & Entrevistas',
  },
  {
    title: 'IA e o Futuro do Trabalho: A Única Habilidade Essencial',
    url: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
    author: 'Tech DeepDive BR',
    duration: '18:50',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    niche: 'Inteligência Artificial & Futuro',
  },
];

export const INITIAL_ANALYSIS: VideoAnalysisResult = {
  videoId: 'dQw4w9WgXcQ',
  youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  title: 'Como Hackear o Algoritmo do YouTube & TikTok em 2026',
  author: 'Growth Mastermind',
  duration: '14:28',
  thumbnailUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&auto=format&fit=crop&q=80',
  videoSummary:
    'Análise algorítmica profunda revelando os pontos críticos de retenção. O vídeo possui 3 quebras de padrão nos primeiros 4 minutos que superam 94% de retenção na audiência.',
  estimatedViralityScore: 96,
  targetAudience: 'Criadores de conteúdo, streamers, editores de vídeo e empreendedores digitais.',
  retentionAnalysis: [
    { timeSecond: 0, timeLabel: '00:00', retentionPercentage: 100, spikeReason: 'Gancho Hipnótico (Hook em 2.4s)' },
    { timeSecond: 28, timeLabel: '00:28', retentionPercentage: 89, spikeReason: 'Introdução do problema oculto' },
    { timeSecond: 72, timeLabel: '01:12', retentionPercentage: 97, spikeReason: 'Revelação chocante com dados ao vivo (PICO 1)' },
    { timeSecond: 130, timeLabel: '02:10', retentionPercentage: 84, spikeReason: 'Transição temática' },
    { timeSecond: 198, timeLabel: '03:18', retentionPercentage: 95, spikeReason: 'Demonstração prática ao vivo (PICO 2)' },
    { timeSecond: 260, timeLabel: '04:20', retentionPercentage: 88, spikeReason: 'Caso de estudo real' },
    { timeSecond: 340, timeLabel: '05:40', retentionPercentage: 92, spikeReason: 'Frase de impacto sobre consistência (PICO 3)' },
    { timeSecond: 450, timeLabel: '07:30', retentionPercentage: 79, spikeReason: 'Explicação teórica' },
    { timeSecond: 600, timeLabel: '10:00', retentionPercentage: 73, spikeReason: 'Conclusão e chamada para ação' },
  ],
  clips: [
    {
      id: 'clip-alpha',
      title: 'A Regra dos Primeiros 3 Segundos',
      hook: 'Se você errar isso, ninguém assistirá seu vídeo até o final!',
      startSec: 68,
      endSec: 112,
      viralScore: 98,
      retentionPeak: 97,
      reason: 'Gatilho de urgência com contradição do senso comum. Alta taxa de replays.',
      category: 'Ganchos & Hooks',
      suggestedPostCaption: 'O segredo que os maiores canais usam nos primeiros 3 segundos. Salve esse corte para aplicar no próximo vídeo! 💥 #growth #dicas',
      dynamicCaptions: [
        { startSec: 68, endSec: 72, text: 'Pare de perder tempo com introduções longas!', emphasisWord: 'tempo' },
        { startSec: 72, endSec: 76, text: 'O espectador decide em 2.5 segundos se fica ou sai.', emphasisWord: '2.5 segundos' },
        { startSec: 76, endSec: 81, text: 'Comece direto no meio da ação ou no clímax.', emphasisWord: 'clímax' },
        { startSec: 81, endSec: 86, text: 'Veja essa curva de retenção disparar na hora.', emphasisWord: 'disparar' },
        { startSec: 86, endSec: 92, text: 'Aplique isso hoje e veja o algoritmo te impulsionar.', emphasisWord: 'impulsionar' },
      ],
      recommendedPlatforms: ['TikTok', 'Instagram Reels', 'YouTube Shorts'],
    },
    {
      id: 'clip-beta',
      title: 'O Erro que Zera seu Alcance',
      hook: 'Isso é o que os canais falidos fazem sem perceber...',
      startSec: 194,
      endSec: 236,
      viralScore: 95,
      retentionPeak: 95,
      reason: 'Medo de FOMO (perder oportunidade) + revelação prática de métrica.',
      category: 'Erros Fatais',
      suggestedPostCaption: 'Cuidado! Você pode estar cometendo esse erro sem saber. Envie para o seu amigo criador de conteúdo! 🚨 #marketing #creator',
      dynamicCaptions: [
        { startSec: 194, endSec: 199, text: '90% dos criadores postam no horário errado.', emphasisWord: 'horário errado' },
        { startSec: 199, endSec: 205, text: 'E pior: colocam links externos na legenda.', emphasisWord: 'pior' },
        { startSec: 205, endSec: 211, text: 'O algoritmo penaliza quando você tira as pessoas do app.', emphasisWord: 'penaliza' },
        { startSec: 211, endSec: 218, text: 'Mantenha a conversa nos comentários e veja a mágica.', emphasisWord: 'mágica' },
      ],
      recommendedPlatforms: ['Instagram Reels', 'TikTok'],
    },
    {
      id: 'clip-gamma',
      title: 'Fórmula Secreta de Legendas',
      hook: 'Como fazer pessoas lerem sua legenda linha por linha!',
      startSec: 335,
      endSec: 378,
      viralScore: 92,
      retentionPeak: 92,
      reason: 'Instrução prática rápida com estilo Hormozi e alto salvamento.',
      category: 'Edição & Retenção',
      suggestedPostCaption: 'Testei essa fórmula em 50 vídeos e o tempo de exibição dobrou! Deixe um like se curtiu. ⚡ #edicaodevideo #shorts',
      dynamicCaptions: [
        { startSec: 335, endSec: 340, text: 'Legendas estáticas estão MORTAS.', emphasisWord: 'MORTAS' },
        { startSec: 340, endSec: 345, text: 'Seu cérebro precisa de estímulo visual a cada 1.2s.', emphasisWord: '1.2s' },
        { startSec: 345, endSec: 351, text: 'Destaque palavras-chave em amarelo neon ou ciano.', emphasisWord: 'neon' },
        { startSec: 351, endSec: 358, text: 'Assim até quem assiste sem som continua vidrado.', emphasisWord: 'vidrado' },
      ],
      recommendedPlatforms: ['YouTube Shorts', 'TikTok', 'Instagram Reels'],
    },
  ],
  hashtagSuggestions: {
    trending: ['#viralvideo', '#fyp', '#foryou', '#reelsviral', '#shortsbrasil'],
    niche: ['#criadoresdeconteudo', '#dicasdeedicao', '#monetizacaoyoutube', '#crescernotiktok', '#viraltips'],
    highReach: ['#trending', '#explorepage', '#inovacao', '#empreendedordigital', '#marketingdigital'],
  },
  predictiveRecommendations: [
    'O vídeo possui 3 momentos de alto valor compartilhável entre 01:10 e 06:00.',
    'Adicione zoom digital rápido (1.15x) a cada corte nas legendas dinâmicas para elevar a retenção em até 22%.',
    'O gancho do Clip 1 atingiu 97% de pontuação preditiva no benchmark de virais verticais.',
  ],
};

export const INITIAL_SCHEDULED_POSTS: ScheduledPost[] = [
  {
    id: 'post-1',
    clipTitle: 'A Regra dos Primeiros 3 Segundos',
    platforms: ['tiktok', 'instagram'],
    scheduledDateTime: '2026-09-21T18:30:00',
    status: 'scheduled',
    caption: 'O segredo que os maiores canais usam nos primeiros 3 segundos! 💥 Salve para aplicar.',
    hashtags: ['#viral', '#growth', '#creator', '#reels'],
    estimatedReach: 48500,
  },
  {
    id: 'post-2',
    clipTitle: 'O Erro que Zera seu Alcance',
    platforms: ['instagram', 'youtube'],
    scheduledDateTime: '2026-09-22T12:00:00',
    status: 'scheduled',
    caption: 'Você pode estar cometendo esse erro e matando seu alcance! 🚨',
    hashtags: ['#dicas', '#shorts', '#marketing', '#fyp'],
    estimatedReach: 32000,
  },
  {
    id: 'post-3',
    clipTitle: 'Fórmula Secreta de Legendas',
    platforms: ['tiktok', 'youtube'],
    scheduledDateTime: '2026-09-19T20:15:00',
    status: 'published',
    caption: 'Legendas estáticas estão mortas. Faça isso agora! ⚡',
    hashtags: ['#edicao', '#tiktoktips', '#shorts'],
    estimatedReach: 74200,
  },
];

export const INITIAL_SECURITY: SecurityConfig = {
  is2FAEnabled: true,
  totpSecret: 'VIRAL2FA99XKEY77',
  backupCodes: ['4821-9920', '3910-8472', '8192-3019', '5529-1029'],
  isE2EEActive: true,
  encryptionFingerprint: 'SHA256:7f4a8b...3e9c12',
  lastAudit: '2026-09-20 16:30 UTC',
  vaultLocked: false,
};

export const INITIAL_ACCOUNTS: ConnectedAccount[] = [
  { id: 'acc-1', platform: 'youtube', accountName: '@GrowthMastermind (Canal Oficial)', connected: true, twoFactorGuarded: true, syncStatus: 'synced' },
  { id: 'acc-2', platform: 'tiktok', accountName: '@growth.corts.br (125k seguidores)', connected: true, twoFactorGuarded: true, syncStatus: 'synced' },
  { id: 'acc-3', platform: 'instagram', accountName: '@growth_oficial (Meta Graph API)', connected: true, twoFactorGuarded: true, syncStatus: 'synced' },
  { id: 'acc-4', platform: 'google_drive', accountName: 'Vault Cloud - Drive Pro', connected: true, twoFactorGuarded: true, syncStatus: 'synced' },
  { id: 'acc-5', platform: 'aws_s3', accountName: 's3://viralclip-storage-cluster', connected: true, twoFactorGuarded: true, syncStatus: 'synced' },
  { id: 'acc-6', platform: 'dropbox', accountName: 'Dropbox Business Sync', connected: false, twoFactorGuarded: false, syncStatus: 'idle' },
];

export const INITIAL_RULES: AutomationRule[] = [
  {
    id: 'rule-1',
    name: 'Alerta Crítico: Retenção Abaixo de 40%',
    priority: 'CRITICAL',
    condition: 'Se a taxa de retenção média nos primeiros 10s for menor que 40%',
    action: 'Disparar notificação push imediata + sugerir novo gancho com IA',
    enabled: true,
  },
  {
    id: 'rule-2',
    name: 'Auto-Exportação se Score Viral > 90%',
    priority: 'HIGH',
    condition: 'Se um corte atingir score viral acima de 90/100',
    action: 'Renderizar em 1080x1920 60fps com legendas Hormozi e enviar para rascunhos do TikTok',
    enabled: true,
  },
  {
    id: 'rule-3',
    name: 'Backup Criptografado no Google Drive',
    priority: 'MEDIUM',
    condition: 'Após renderização final de cada corte',
    action: 'Aplicar criptografia AES-GCM e enviar backup para o Google Drive conectado',
    enabled: true,
  },
  {
    id: 'rule-4',
    name: 'Alerta de Fila de Transcodificação Elevada',
    priority: 'CRITICAL',
    condition: 'Se fila de renderização exceder 10 vídeos em espera',
    action: 'Notificar administrador e provisionar nó GPU secundário',
    enabled: true,
  },
];

export const INITIAL_ALERTS: SystemAlert[] = [
  {
    id: 'alt-1',
    timestamp: 'Há 5 minutos',
    priority: 'CRITICAL',
    title: 'Pico de Retenção Detectado (97%)',
    message: 'O Clip "A Regra dos Primeiros 3 Segundos" atingiu 97% de probabilidade algorítmica. Recomendado agendamento imediato.',
    read: false,
  },
  {
    id: 'alt-2',
    timestamp: 'Há 25 minutos',
    priority: 'HIGH',
    title: 'Backup E2EE Concluído',
    message: '3 cortes virais sincronizados com sucesso no Google Drive com assinatura criptográfica SHA-256 válida.',
    read: false,
  },
  {
    id: 'alt-3',
    timestamp: 'Há 1 hora',
    priority: 'INFO',
    title: 'Cluster GPU Operando em 99.98% de Eficiência',
    message: 'Tempo médio de análise e renderização de cortes: 4.2 segundos por minuto de vídeo.',
    read: true,
  },
];

export const INITIAL_INFRA: InfraStatus = {
  uptimePct: 99.98,
  avgApiLatencyMs: 42,
  queueDepth: 2,
  activeTranscodeJobs: 1,
  gpuLoadPct: 34,
  nodes: [
    { name: 'GPU Cluster US-East (NVIDIA A100)', type: 'GPU Transcoder', status: 'operational', load: 38, latencyMs: 22 },
    { name: 'Gemini 3.8 Viral Engine Node', type: 'AI Inference', status: 'operational', load: 29, latencyMs: 35 },
    { name: 'Edge Ingress & Reverse Proxy', type: 'API Gateway', status: 'operational', load: 18, latencyMs: 12 },
    { name: 'E2EE AES-GCM Vault Cluster', type: 'E2EE Vault', status: 'operational', load: 14, latencyMs: 8 },
  ],
  lastFailoverCheck: 'Há 2 minutos (Status: Verde)',
};
