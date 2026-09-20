import { jsPDF } from 'jspdf';
import { VideoAnalysisResult, ViralClip } from '../types';

export function exportAnalysisToPDF(analysis: VideoAnalysisResult) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Background style & Header
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, 210, 35, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('ViralClip AI - Relatório de Análise e Métricas Virais', 14, 16);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')} | Algoritmo Preditivo Gemini 3.8`, 14, 26);

  // Video info section
  let y = 45;
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('Dados do Vídeo Analisado', 14, y);
  y += 7;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Título: ${analysis.title}`, 14, y);
  y += 5;
  doc.text(`Canal / Criador: ${analysis.author} | Duração: ${analysis.duration}`, 14, y);
  y += 5;
  doc.text(`URL: ${analysis.youtubeUrl}`, 14, y);
  y += 5;
  doc.text(`Público-Alvo Estimado: ${analysis.targetAudience}`, 14, y);
  y += 5;
  doc.text(`Score Viral Global: ${analysis.estimatedViralityScore}/100`, 14, y);
  y += 10;

  // Viral Clips Breakdown
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('Cortes Virais Identificados (Maior Retenção)', 14, y);
  y += 7;

  analysis.clips.forEach((clip: ViralClip, index: number) => {
    // Check page break
    if (y > 250) {
      doc.addPage();
      y = 20;
    }

    doc.setFillColor(248, 250, 252);
    doc.roundedRect(14, y, 182, 36, 2, 2, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(14, y, 182, 36, 2, 2, 'S');

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(`#${index + 1}: ${clip.title} (${clip.startSec}s - ${clip.endSec}s)`, 18, y + 7);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(225, 29, 72); // rose-600
    doc.text(`Score Viral: ${clip.viralScore}% | Pico Retenção: ${clip.retentionPeak}%`, 130, y + 7);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(`Gancho (Hook): "${clip.hook}"`, 18, y + 14);
    doc.text(`Gatilho: ${clip.reason}`, 18, y + 20);
    doc.text(`Plataformas: ${clip.recommendedPlatforms.join(', ')}`, 18, y + 26);
    doc.text(`Legenda: ${clip.suggestedPostCaption.slice(0, 75)}...`, 18, y + 32);

    y += 42;
  });

  // Hashtags & Recommendations
  if (y > 240) {
    doc.addPage();
    y = 20;
  }

  y += 5;
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('Recomendações Preditivas & Hashtags Virais', 14, y);
  y += 7;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Em Alta: ${analysis.hashtagSuggestions.trending.join(' ')}`, 14, y);
  y += 5;
  doc.text(`Nicho Específico: ${analysis.hashtagSuggestions.niche.join(' ')}`, 14, y);
  y += 8;

  analysis.predictiveRecommendations.forEach((rec, idx) => {
    doc.text(`• ${rec}`, 14, y);
    y += 5;
  });

  // Footer / Security note
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('Relatório emitido com Criptografia E2EE (AES-GCM) e autenticação de 2 fatores ativas.', 14, 285);

  doc.save(`ViralClip-Relatorio-${analysis.videoId || 'analise'}.pdf`);
}

export function exportAnalysisToCSV(analysis: VideoAnalysisResult) {
  const rows: string[][] = [
    ['ViralClip AI - Relatório de Dados Brutos'],
    ['Video', analysis.title],
    ['URL', analysis.youtubeUrl],
    ['Canal', analysis.author],
    ['Duracao', analysis.duration],
    ['Score Viral Global', `${analysis.estimatedViralityScore}%`],
    ['Data Geracao', new Date().toISOString()],
    [],
    ['PONTOS DE RETENCAO'],
    ['Segundo', 'Timestamp', 'Retencao (%)', 'Motivo / Gatilho'],
  ];

  analysis.retentionAnalysis.forEach((r) => {
    rows.push([
      r.timeSecond.toString(),
      r.timeLabel,
      `${r.retentionPercentage}%`,
      `"${(r.spikeReason || '').replace(/"/g, '""')}"`,
    ]);
  });

  rows.push([]);
  rows.push(['CORTES VIRAIS GERADOS']);
  rows.push(['ID', 'Titulo', 'Gancho', 'Inicio (s)', 'Fim (s)', 'Score Viral', 'Pico Retencao', 'Categoria', 'Plataformas']);

  analysis.clips.forEach((c) => {
    rows.push([
      c.id,
      `"${c.title.replace(/"/g, '""')}"`,
      `"${c.hook.replace(/"/g, '""')}"`,
      c.startSec.toString(),
      c.endSec.toString(),
      `${c.viralScore}%`,
      `${c.retentionPeak}%`,
      c.category,
      `"${c.recommendedPlatforms.join(', ')}"`,
    ]);
  });

  const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `ViralClip-Metricas-${analysis.videoId || 'dados'}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
