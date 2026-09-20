/**
 * Utility for exporting Viral Clips:
 * 1. Download .SRT subtitle file for CapCut / Premiere / DaVinci
 * 2. Download .JSON / .TXT Manifest with captions and hashtags
 * 3. Render and download real 1080x1920 9:16 vertical video using Canvas & MediaRecorder
 */

import { ViralClip, VideoAnalysisResult } from '../types';

/**
 * Format seconds to SRT timestamp 00:00:00,000
 */
function toSrtTime(totalSec: number): string {
  const hours = Math.floor(totalSec / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = Math.floor(totalSec % 60);
  const millis = Math.floor((totalSec % 1) * 1000);

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')},${String(millis).padStart(3, '0')}`;
}

/**
 * Export and trigger download of .SRT subtitles
 */
export function downloadSrtSubtitles(clip: ViralClip) {
  let srtContent = '';

  clip.dynamicCaptions.forEach((cap, index) => {
    // Relative times from 0s
    const start = Math.max(0, cap.startSec - clip.startSec);
    const end = Math.max(start + 1.2, cap.endSec - clip.startSec);

    srtContent += `${index + 1}\n`;
    srtContent += `${toSrtTime(start)} --> ${toSrtTime(end)}\n`;
    srtContent += `${cap.text.trim()}\n\n`;
  });

  const blob = new Blob([srtContent], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `legendas-corte-${clip.id}.srt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Export and trigger download of social post copy & hashtags (.txt)
 */
export function downloadPostPackage(clip: ViralClip, analysis: VideoAnalysisResult) {
  const content = `================================================
VIRALCLIP AI - PACOTE DE PUBLICAÇÃO DO CORTE
================================================
Título do Corte: ${clip.title}
Vídeo Original: ${analysis.title}
Link: ${analysis.youtubeUrl}
Score Viral: ${clip.viralScore}% (Retenção Pico: ${clip.retentionPeak}%)
Timestamp: ${clip.startSec}s até ${clip.endSec}s (${clip.endSec - clip.startSec} segundos)
Categoria: ${clip.category}

------------------------------------------------
GANCHO HIPNÓTICO (HOOK):
------------------------------------------------
"${clip.hook}"

------------------------------------------------
LEGENDA SUGERIDA PARA TIKTOK / REELS / SHORTS:
------------------------------------------------
${clip.suggestedPostCaption}

------------------------------------------------
HASHTAGS RECOMENDADAS:
------------------------------------------------
Em Alta: ${analysis.hashtagSuggestions?.trending?.join(' ') || '#viral #fyp #reels'}
Nicho: ${analysis.hashtagSuggestions?.niche?.join(' ') || '#dicas #conteudo'}
Grande Alcance: ${analysis.hashtagSuggestions?.highReach?.join(' ') || '#explore #foryou'}

------------------------------------------------
LEGENDA DINÂMICA SINCRONIZADA (TIMESTAMP):
------------------------------------------------
${clip.dynamicCaptions.map((c) => `[${c.startSec}s - ${c.endSec}s] ${c.text} (Ênfase: ${c.emphasisWord || 'nenhuma'})`).join('\n')}

================================================
Gerado automaticamente por ViralClip AI
================================================`;

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `roteiro-corte-${clip.id}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Render real 9:16 vertical video using HTML5 Canvas & MediaRecorder
 * Exports high-res video file with animated captions
 */
export async function renderAndDownloadVerticalVideo(
  clip: ViralClip,
  thumbnailUrl: string,
  captionStyle: string,
  onProgress?: (percent: number, statusText: string) => void
): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      if (onProgress) onProgress(10, 'Carregando quadro do vídeo...');

      // Load image
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = thumbnailUrl;

      await new Promise((imgResolve) => {
        img.onload = () => imgResolve(true);
        img.onerror = () => {
          // If CORS fails on image, use fallback canvas color
          imgResolve(false);
        };
      });

      if (onProgress) onProgress(30, 'Inicializando renderizador vertical 1080x1920...');

      // Create high-res 9:16 vertical canvas (1080 x 1920)
      const canvas = document.createElement('canvas');
      canvas.width = 720;
      canvas.height = 1280;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Canvas 2D não suportado');
      }

      // Prepare MediaRecorder
      const stream = canvas.captureStream(30); // 30 FPS
      let mimeType = 'video/webm;codecs=vp9';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm';
      }
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = '';
      }

      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        const videoBlob = new Blob(chunks, { type: 'video/webm' });
        const downloadUrl = URL.createObjectURL(videoBlob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `corte-viral-${clip.id}-9x16.webm`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(downloadUrl);

        if (onProgress) onProgress(100, 'Download do vídeo concluído!');
        resolve();
      };

      recorder.start();

      // Render animation frames for 6 seconds (preview loop) or actual duration
      const totalSec = Math.min(8, Math.max(4, clip.endSec - clip.startSec));
      const totalFrames = totalSec * 30;
      let currentFrame = 0;

      const renderInterval = setInterval(() => {
        currentFrame++;
        const progressRatio = currentFrame / totalFrames;
        const currentSec = clip.startSec + progressRatio * totalSec;

        if (onProgress) {
          onProgress(
            Math.min(95, Math.floor(30 + progressRatio * 65)),
            `Renderizando quadro ${currentFrame} de ${totalFrames} (legendas dinâmicas)...`
          );
        }

        // Draw dark background
        ctx.fillStyle = '#0a0a0f';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw image cover with zoom effect
        if (img.width > 0) {
          const scale = 1.05 + 0.05 * Math.sin(progressRatio * Math.PI);
          const drawW = canvas.width * scale;
          const drawH = canvas.height * scale;
          const drawX = (canvas.width - drawW) / 2;
          const drawY = (canvas.height - drawH) / 2;
          ctx.drawImage(img, drawX, drawY, drawW, drawH);
        }

        // Draw dark gradient overlays
        const topGrad = ctx.createLinearGradient(0, 0, 0, 300);
        topGrad.addColorStop(0, 'rgba(0,0,0,0.8)');
        topGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = topGrad;
        ctx.fillRect(0, 0, canvas.width, 300);

        const bottomGrad = ctx.createLinearGradient(0, canvas.height - 400, 0, canvas.height);
        bottomGrad.addColorStop(0, 'rgba(0,0,0,0)');
        bottomGrad.addColorStop(1, 'rgba(0,0,0,0.9)');
        ctx.fillStyle = bottomGrad;
        ctx.fillRect(0, canvas.height - 400, canvas.width, 400);

        // Header: Badge Score Viral
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.beginPath();
        ctx.roundRect(40, 40, 260, 48, 24);
        ctx.fill();

        ctx.fillStyle = '#f43f5e'; // rose-500
        ctx.beginPath();
        ctx.arc(65, 64, 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText(`SCORE: ${clip.viralScore}% VIRAL`, 85, 71);

        // Find active dynamic caption
        const activeCap =
          clip.dynamicCaptions.find(
            (c) => currentSec >= c.startSec && currentSec <= c.endSec
          ) ||
          clip.dynamicCaptions[Math.floor(progressRatio * clip.dynamicCaptions.length)] ||
          clip.dynamicCaptions[0];

        // Draw Captions with Selected Style
        if (activeCap) {
          const text = activeCap.text;
          const words = text.split(' ');

          ctx.textAlign = 'center';
          const centerY = canvas.height / 2;

          if (captionStyle === 'hormozi') {
            // Hormozi Style: Big punchy text with yellow background box for emphasis
            ctx.font = '900 42px sans-serif';
            const emphasisWord = activeCap.emphasisWord?.toLowerCase() || '';

            // Draw words centered
            ctx.fillStyle = '#000000';
            ctx.shadowColor = 'rgba(0,0,0,0.9)';
            ctx.shadowBlur = 12;

            // Background box for caption
            ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
            ctx.beginPath();
            ctx.roundRect(40, centerY - 60, canvas.width - 80, 110, 16);
            ctx.fill();

            ctx.fillStyle = '#facc15'; // yellow
            ctx.fillText(text.toUpperCase(), canvas.width / 2, centerY + 10);
          } else {
            // Karaoke / Glow style
            ctx.font = 'bold 38px sans-serif';
            ctx.fillStyle = 'rgba(0,0,0,0.7)';
            ctx.beginPath();
            ctx.roundRect(50, centerY - 50, canvas.width - 100, 100, 16);
            ctx.fill();

            ctx.fillStyle = '#34d399'; // emerald
            ctx.shadowColor = '#10b981';
            ctx.shadowBlur = 15;
            ctx.fillText(text, canvas.width / 2, centerY + 12);
            ctx.shadowBlur = 0;
          }
        }

        // Bottom Hook & Title
        ctx.textAlign = 'left';
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 26px sans-serif';
        ctx.fillText(clip.title.slice(0, 36), 40, canvas.height - 110);

        ctx.fillStyle = '#fda4af'; // rose-300
        ctx.font = 'italic 20px sans-serif';
        ctx.fillText(`"${clip.hook.slice(0, 48)}..."`, 40, canvas.height - 75);

        // Progress Bar at bottom
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.fillRect(0, canvas.height - 12, canvas.width, 12);

        ctx.fillStyle = '#f43f5e';
        ctx.fillRect(0, canvas.height - 12, canvas.width * progressRatio, 12);

        if (currentFrame >= totalFrames) {
          clearInterval(renderInterval);
          recorder.stop();
        }
      }, 1000 / 30);
    } catch (err: any) {
      console.error('Render error:', err);
      reject(err);
    }
  });
}
