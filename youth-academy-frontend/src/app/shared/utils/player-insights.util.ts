import { Player } from '../../core/models/player.model';

export interface PlayerTier {
  label: string;
  cssClass: 'good' | 'mid' | 'bad';
}

/** تصنيف مستوى اللاعب بناءً على أحدث تقييم والإحصائيات التراكمية (تم تأمينها لتقرأ المسطح أو المتداخل) */
export function classifyPlayer(p: any): PlayerTier {
  const ratings = p.rating || [];
  const latestRating = ratings[ratings.length - 1] ?? 60;
  
  // تأمين قراءة الأرقام سواء كانت مسطحة أو قادمة داخل كائن stats
  const goals = p.goals ?? p.stats?.goals ?? 0;
  const assists = p.assists ?? p.stats?.assists ?? 0;
  const injuries = p.injuries ?? p.stats?.injuries ?? 0;

  const score = latestRating + goals * 2 + assists * 1.5 - injuries * 5;

  if (score >= 110) return { label: '🔥 ready for firstteam', cssClass: 'good' };
  if (score >= 85) return { label: '⚖ Rotation player', cssClass: 'mid' };
  return { label: 'need develop', cssClass: 'bad' };
}

export const SEASON_LABELS = ['2022', '2023', '2024', '2025', '2026'];

export interface SeasonDevelopment {
  labels: string[];
  values: number[];
  deltaPoints: number;
  deltaPercent: number;
  trend: 'up' | 'stable' | 'down' | 'new';
  trendLabel: string;
  trendClass: 'good' | 'mid' | 'bad';
  summary: string;
}

/**
 * تحليل تطور اللاعب ديناميكياً بناءً على مواسمه المتاحة في قاعدة البيانات
 * تم تعديلها لتستقبل وتدعم أي لاعب حتى لو لديه موسم واحد فقط دون أن تختفي الشاشة
 */
export function analyzeLastThreeSeasons(p: Player): SeasonDevelopment {
  const ratings = p.rating ?? [];
  
  // إذا كان اللاعب جديداً تماماً ولديه تقييم لموسم واحد فقط
  if (ratings.length <= 1) {
    const currentRating = ratings[0] ?? 60;
    return {
      labels: [SEASON_LABELS[SEASON_LABELS.length - 1]], // يعرض عام 2026 فقط
      values: [currentRating],
      deltaPoints: 0,
      deltaPercent: 0,
      trend: 'new',
      trendClass: 'mid',
      trendLabel: '⭐ Initial Entry',
      summary: `${p.name} has registered an initial career rating of ${currentRating} points. More seasons will unlock dynamic trend analysis.`
    };
  }

  // إذا كان لديه موسمان أو أكثر، نأخذ آخر 3 مواسم كحد أقصى للتحليل
  const last3 = ratings.slice(-3);
  const labels = SEASON_LABELS.slice(-last3.length);

  const first = last3[0] ?? 0;
  const last = last3[last3.length - 1] ?? 0;
  const deltaPoints = Math.round((last - first) * 10) / 10;
  const deltaPercent = first !== 0 ? Math.round((deltaPoints / first) * 1000) / 10 : 0;

  let trend: SeasonDevelopment['trend'] = 'stable';
  let trendClass: SeasonDevelopment['trendClass'] = 'mid';
  let trendLabel = '⚖ stable';
  let summary = `${p.name}'s level has been relatively stable over the last ${last3.length} seasons.`;

  if (deltaPoints > 3) {
    trend = 'up';
    trendClass = 'good';
    trendLabel = '📈 Significant Improvement';
    summary = `${p.name} improved by ${deltaPoints} rating points (${deltaPercent > 0 ? '+' : ''}${deltaPercent}%) over the last ${last3.length} seasons.`;
  } else if (deltaPoints < -3) {
    trend = 'down';
    trendClass = 'bad';
    trendLabel = '📉 Decline';
    summary = `${p.name}'s level declined by ${Math.abs(deltaPoints)} rating points (${deltaPercent}%) over the last ${last3.length} seasons, needs monitoring.`;
  }

  return { labels, values: last3, deltaPoints, deltaPercent, trend, trendLabel, trendClass, summary };
}
