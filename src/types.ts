export interface RetentionPoint {
  timeSecond: number;
  timeLabel: string;
  retentionPercentage: number;
  spikeReason?: string;
}

export interface DynamicCaptionItem {
  startSec: number;
  endSec: number;
  text: string;
  emphasisWord?: string;
}

export type CaptionStyle = 'hormozi' | 'karaoke' | 'neon' | 'minimal' | 'fire';

export interface ViralClip {
  id: string;
  title: string;
  hook: string;
  startSec: number;
  endSec: number;
  viralScore: number;
  retentionPeak: number;
  reason: string;
  category: string;
  suggestedPostCaption: string;
  dynamicCaptions: DynamicCaptionItem[];
  recommendedPlatforms: string[];
}

export interface VideoAnalysisResult {
  videoId: string;
  youtubeUrl: string;
  title: string;
  author: string;
  duration: string;
  thumbnailUrl: string;
  videoSummary: string;
  estimatedViralityScore: number;
  targetAudience: string;
  retentionAnalysis: RetentionPoint[];
  clips: ViralClip[];
  hashtagSuggestions: {
    trending: string[];
    niche: string[];
    highReach: string[];
  };
  predictiveRecommendations: string[];
}

export interface ScheduledPost {
  id: string;
  clipTitle: string;
  platforms: ('tiktok' | 'instagram' | 'youtube')[];
  scheduledDateTime: string;
  status: 'scheduled' | 'published' | 'processing';
  caption: string;
  hashtags: string[];
  estimatedReach: number;
}

export interface ConnectedAccount {
  id: string;
  platform: 'youtube' | 'tiktok' | 'instagram' | 'google_drive' | 'aws_s3' | 'dropbox';
  accountName: string;
  connected: boolean;
  twoFactorGuarded: boolean;
  syncStatus: 'synced' | 'idle' | 'warning';
}

export interface SecurityConfig {
  is2FAEnabled: boolean;
  totpSecret: string;
  backupCodes: string[];
  isE2EEActive: boolean;
  encryptionFingerprint: string;
  lastAudit: string;
  vaultLocked: boolean;
}

export interface AutomationRule {
  id: string;
  name: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  condition: string;
  action: string;
  enabled: boolean;
  lastTriggered?: string;
}

export interface SystemAlert {
  id: string;
  timestamp: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'INFO';
  title: string;
  message: string;
  read: boolean;
}

export interface InfraNode {
  name: string;
  type: 'GPU Transcoder' | 'AI Inference' | 'API Gateway' | 'E2EE Vault';
  status: 'operational' | 'degraded' | 'maintenance';
  load: number;
  latencyMs: number;
}

export interface InfraStatus {
  uptimePct: number;
  avgApiLatencyMs: number;
  queueDepth: number;
  activeTranscodeJobs: number;
  gpuLoadPct: number;
  nodes: InfraNode[];
  lastFailoverCheck: string;
}
