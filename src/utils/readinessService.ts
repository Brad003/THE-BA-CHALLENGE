import {
  ActivityLog,
  HRVDayData,
  IntradayHRVPoint,
  ReadinessState,
  UserReadinessData,
  Workout,
  ThirtyDayRecoveryPoint,
  ThirtyDayRecoverySummary
} from '../types';

/**
 * Calculates physiological HRV and recovery readiness score for the user.
 * In sports science, HRV (RMSSD in ms) relative to an athlete's 30-day rolling baseline
 * reflects autonomic nervous system balance:
 * - High HRV + low RHR = Parasympathetic dominance (Rest, recovery, readiness for high strain).
 * - Low HRV + elevated RHR = Sympathetic overload / fatigue (Needs light recovery).
 */

const STORAGE_KEY_READINESS_OVERRIDE = 'ba_panther_readiness_override';

export function getStoredReadinessOffset(): number {
  try {
    const val = localStorage.getItem(STORAGE_KEY_READINESS_OVERRIDE);
    return val ? parseInt(val, 10) : 0;
  } catch {
    return 0;
  }
}

export function setStoredReadinessOffset(offset: number): void {
  try {
    localStorage.setItem(STORAGE_KEY_READINESS_OVERRIDE, offset.toString());
  } catch {
    // Ignore storage issues in restricted frames
  }
}

export function computeUserReadiness(
  activityLogs: ActivityLog[],
  workoutTitle?: string,
  userOffset: number = 0
): UserReadinessData {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  // Analyze recent workouts for acute training strain
  const recentHighStrainWorkouts = activityLogs.filter(log => {
    return (log.rpe && log.rpe >= 8) || (log.durationMinutes && log.durationMinutes >= 45);
  });

  // Base parameters for a fit male Panther athlete
  const baselineHrv = 66; // ms rMSSD
  const baselineRhr = 54; // bpm

  // 7 days historical data
  const history: HRVDayData[] = [];
  const baseHrvValues = [62, 65, 59, 70, 68, 64, 74];
  const baseRecoveryValues = [78, 82, 66, 88, 84, 76, 89];
  const baseRhrValues = [55, 53, 58, 52, 53, 56, 51];
  const baseSleepHours = [7.4, 7.8, 6.5, 8.2, 7.9, 7.1, 8.3];
  const baseSleepScores = [84, 88, 72, 94, 90, 81, 93];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dayName = days[d.getDay()];
    const dateStr = d.toISOString().split('T')[0];

    const idx = 6 - i;
    let hrv = baseHrvValues[idx];
    let recovery = baseRecoveryValues[idx];
    let rhr = baseRhrValues[idx];
    let sleepHours = baseSleepHours[idx];
    let sleepScore = baseSleepScores[idx];

    // Today is i === 0, apply offset if user calibrated
    if (i === 0) {
      recovery = Math.min(99, Math.max(38, recovery + userOffset));
      hrv = Math.round(baselineHrv * (recovery / 82));
      rhr = Math.round(baselineRhr + (85 - recovery) * 0.15);
    }

    let state: ReadinessState = 'optimal';
    if (recovery < 65) state = 'low';
    else if (recovery < 82) state = 'moderate';

    history.push({
      day: i === 0 ? 'Today' : dayName,
      dateStr,
      hrv,
      baselineHrv,
      recoveryScore: recovery,
      restingHeartRate: rhr,
      sleepScore,
      sleepHours,
      readinessState: state
    });
  }

  const todayData = history[history.length - 1];
  const currentScore = todayData.recoveryScore;
  const currentHrv = todayData.hrv;
  const currentRhr = todayData.restingHeartRate;
  const currentSleepHours = todayData.sleepHours;
  const currentSleepQuality = todayData.sleepScore;

  const hrvDiff = currentHrv - baselineHrv;
  const hrvTrendPercent = Math.round((hrvDiff / baselineHrv) * 100);

  let state: ReadinessState = 'optimal';
  let stateLabel = 'Prime to Train • High Readiness';
  let nervousSystemStatus = 'Parasympathetic Dominance (Optimal Vagal Tone)';
  let recommendedIntensity: 'High' | 'Moderate' | 'Active Recovery' = 'High';
  let trainingRecommendation = '';

  const workoutContext = workoutTitle ? `for "${workoutTitle}"` : 'for today\'s session';

  if (currentScore >= 85) {
    state = 'optimal';
    stateLabel = 'Optimal Readiness • Prime to Train';
    nervousSystemStatus = 'Parasympathetic Dominance (Deep Recovery & Resilience)';
    recommendedIntensity = 'High';
    trainingRecommendation = `Your autonomic nervous system is fully restored. HRV is +${Math.abs(hrvTrendPercent)}% above your 30-day baseline and resting heart rate is lowered to ${currentRhr} bpm. You have the green light ${workoutContext} to push high-intensity intervals, heavy explosive sets, and personal record loads.`;
  } else if (currentScore >= 65) {
    state = 'moderate';
    stateLabel = 'Balanced State • Steady Training Load';
    nervousSystemStatus = 'Balanced Autonomic Tone (Normal Adaptive Capacity)';
    recommendedIntensity = 'Moderate';
    trainingRecommendation = `Your nervous system is in an adaptable, steady state. HRV (${currentHrv} ms) matches baseline. You are primed to execute ${workoutContext} with controlled RPE 7-8, focusing on rhythmic stamina and clean mechanics.`;
  } else {
    state = 'low';
    stateLabel = 'Recovery Deficit • Active Rest Advised';
    nervousSystemStatus = 'Sympathetic Dominance (Elevated Cardiac & Muscular Fatigue)';
    recommendedIntensity = 'Active Recovery';
    trainingRecommendation = `Your body is carrying acute systemic fatigue (HRV is down at ${currentHrv} ms, RHR elevated to ${currentRhr} bpm). Before launching ${workoutContext}, consider reducing working sets by 20%, subbing in mobility work, or taking an active recovery walk to avoid overreaching.`;
  }

  // Intraday Nocturnal Wave (Sleep & Wake)
  const intraday: IntradayHRVPoint[] = [
    { time: '23:00', hrv: 54, heartRate: 64, stage: 'Light Sleep' },
    { time: '01:00', hrv: 68, heartRate: 53, stage: 'Deep Sleep' },
    { time: '02:30', hrv: 76, heartRate: 50, stage: 'Deep Sleep' },
    { time: '04:00', hrv: 62, heartRate: 56, stage: 'REM Sleep' },
    { time: '05:30', hrv: 71, heartRate: 51, stage: 'Deep Sleep' },
    { time: '06:45', hrv: 65, heartRate: 54, stage: 'REM Sleep' },
    { time: '07:30', hrv: Math.max(50, currentHrv - 2), heartRate: currentRhr + 2, stage: 'Light Sleep' },
    { time: '08:00 (Wake)', hrv: currentHrv, heartRate: currentRhr, stage: 'Awake / Morning Baseline' }
  ];

  return {
    score: currentScore,
    state,
    stateLabel,
    hrvCurrent: currentHrv,
    hrvBaseline: baselineHrv,
    hrvTrendPercent,
    restingHeartRate: currentRhr,
    rhrBaseline: baselineRhr,
    sleepHours: currentSleepHours,
    sleepQualityPercent: currentSleepQuality,
    recoveryPercent: currentScore,
    nervousSystemStatus,
    trainingRecommendation,
    recommendedIntensity,
    history,
    intraday
  };
}

/**
 * Provides quick advice based on scheduled workout duration and intensity
 */
export function getReadinessSessionAdvice(
  readiness: UserReadinessData,
  workout?: Workout
): {
  headline: string;
  badgeText: string;
  badgeBg: string;
  badgeColor: string;
  actionText: string;
  caution: boolean;
} {
  if (!workout) {
    return {
      headline: 'Autonomic System Ready',
      badgeText: `${readiness.score}% READY`,
      badgeBg: 'bg-emerald-500/20',
      badgeColor: 'text-emerald-400',
      actionText: 'Ready to Train',
      caution: false
    };
  }

  if (readiness.state === 'optimal') {
    return {
      headline: `Primed for ${workout.title} • Peak Performance Capable`,
      badgeText: `${readiness.score}% OPTIMAL READINESS`,
      badgeBg: 'bg-[var(--accent-main)]/20',
      badgeColor: 'text-[var(--accent-bright)]',
      actionText: 'Crush Today\'s Session',
      caution: false
    };
  } else if (readiness.state === 'moderate') {
    return {
      headline: `Good Capacity for ${workout.title} • Maintain Clean Form`,
      badgeText: `${readiness.score}% MODERATE READINESS`,
      badgeBg: 'bg-sky-500/20',
      badgeColor: 'text-sky-400',
      actionText: 'Execute Steady Effort',
      caution: false
    };
  } else {
    return {
      headline: `High Fatigue Detected • Scale ${workout.title}`,
      badgeText: `${readiness.score}% LOW READINESS`,
      badgeBg: 'bg-amber-500/20',
      badgeColor: 'text-amber-400',
      actionText: 'Scale or Active Recovery',
      caution: true
    };
  }
}

/**
 * Computes a detailed 30-day long-term recovery trend tracking HRV (rMSSD in ms)
 * and resting heart rate (RHR in bpm), taking into account workout load,
 * rest days, and autonomic nervous system adaptations.
 */
export function compute30DayRecoveryTrend(
  activityLogs: ActivityLog[] = [],
  baseHrv: number = 66,
  baseRhr: number = 54
): ThirtyDayRecoverySummary {
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Map activity logs by ISO date string (YYYY-MM-DD) for lookup
  const logsByDate = new Map<string, ActivityLog>();
  activityLogs.forEach(log => {
    if (log.isoDate) {
      logsByDate.set(log.isoDate, log);
    }
  });

  // Base deterministic sinusoidal / cycle pattern for natural athlete recovery wave
  // 30 days pattern with peak adaptation over weeks 3-4
  const points: ThirtyDayRecoveryPoint[] = [];

  // Seed variations for natural athletic biometrics over 30 days
  const hrvSeedDeltas = [
    -3, -1, 4, 6, 2, -4, 5, 
    7, 3, -2, -5, 1, 6, 8, 
    4, -1, 3, 5, 7, 2, -3, 
    1, 6, 9, 8, 5, 3, 7, 6, 8
  ];

  const rhrSeedDeltas = [
    2, 1, -2, -3, -1, 2, -2,
    -3, -1, 1, 3, 0, -2, -4,
    -2, 1, -1, -2, -3, -1, 2,
    0, -3, -4, -3, -2, -1, -3, -3, -4
  ];

  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const displayDate = `${months[d.getMonth()]} ${d.getDate()}`;
    const dayOfWeek = daysOfWeek[d.getDay()];
    const dayIndex = 29 - i; // 0 to 29

    let strainDescription = 'Rest / Active Recovery';
    let strainModifier = 0;

    // Check if there was an activity log on this date or relative days
    const log = logsByDate.get(dateStr);
    if (log) {
      strainDescription = `${log.title} (${log.durationMinutes}m, RPE ${log.rpe || 7.5})`;
      if ((log.rpe && log.rpe >= 8) || (log.durationMinutes && log.durationMinutes >= 45)) {
        strainModifier = -3; // slight acute fatigue next morning
      } else {
        strainModifier = 1;
      }
    } else {
      // Simulate typical workout days for athletic realism (Mon, Wed, Fri, Sat)
      const dayNum = d.getDay();
      if (dayNum === 1 || dayNum === 3 || dayNum === 5) {
        strainDescription = 'Panther High-Load Conditioning';
      } else if (dayNum === 6) {
        strainDescription = 'Trail Long Endurance';
      } else if (dayNum === 0) {
        strainDescription = 'Full Restoration & Vagal Reset';
      } else {
        strainDescription = 'Mobility & Joint Flow';
      }
    }

    // Natural progressive conditioning: over 30 days, vagal tone improves (+3ms HRV, -2 bpm RHR)
    const conditioningDriftHrv = Math.round((dayIndex / 29) * 4);
    const conditioningDriftRhr = Math.round((dayIndex / 29) * -2);

    const rawHrv = baseHrv + hrvSeedDeltas[dayIndex] + conditioningDriftHrv + strainModifier;
    const hrv = Math.max(48, Math.min(84, rawHrv));

    const rawRhr = baseRhr + rhrSeedDeltas[dayIndex] + conditioningDriftRhr - Math.round(strainModifier * 0.5);
    const restingHeartRate = Math.max(46, Math.min(64, rawRhr));

    // Recovery score based on HRV and RHR
    const hrvRatio = hrv / baseHrv;
    const rhrRatio = baseRhr / restingHeartRate;
    let recoveryScore = Math.round(((hrvRatio * 0.6) + (rhrRatio * 0.4)) * 82);
    recoveryScore = Math.max(42, Math.min(98, recoveryScore));

    let readinessState: ReadinessState = 'optimal';
    if (recoveryScore < 64) readinessState = 'low';
    else if (recoveryScore < 82) readinessState = 'moderate';

    // Sleep realistic metrics
    const sleepHours = Number((7.0 + ((recoveryScore / 100) * 1.5) + (dayIndex % 3 === 0 ? 0.4 : -0.2)).toFixed(1));
    const sleepScore = Math.min(98, Math.round(recoveryScore * 0.95 + 4));

    points.push({
      dayNumber: dayIndex + 1,
      dateStr,
      displayDate,
      dayOfWeek,
      hrv,
      restingHeartRate,
      recoveryScore,
      baselineHrv: baseHrv,
      baselineRhr: baseRhr,
      rollingAvgHrv: hrv, // will compute smoothed next
      rollingAvgRhr: restingHeartRate,
      sleepHours,
      sleepScore,
      readinessState,
      strainDescription
    });
  }

  // Compute 7-day rolling averages for smooth trendlines
  for (let i = 0; i < points.length; i++) {
    const windowStart = Math.max(0, i - 6);
    const windowPoints = points.slice(windowStart, i + 1);
    const sumHrv = windowPoints.reduce((acc, p) => acc + p.hrv, 0);
    const sumRhr = windowPoints.reduce((acc, p) => acc + p.restingHeartRate, 0);

    points[i].rollingAvgHrv = Number((sumHrv / windowPoints.length).toFixed(1));
    points[i].rollingAvgRhr = Number((sumRhr / windowPoints.length).toFixed(1));
  }

  // Aggregates & Trends
  const totalHrv = points.reduce((acc, p) => acc + p.hrv, 0);
  const totalRhr = points.reduce((acc, p) => acc + p.restingHeartRate, 0);
  const avgHrv = Math.round(totalHrv / points.length);
  const avgRhr = Math.round(totalRhr / points.length);

  const hrvValues = points.map(p => p.hrv);
  const rhrValues = points.map(p => p.restingHeartRate);
  const minHrv = Math.min(...hrvValues);
  const maxHrv = Math.max(...hrvValues);
  const minRhr = Math.min(...rhrValues);
  const maxRhr = Math.max(...rhrValues);

  // Compare first 7 days vs last 7 days for long-term physiological trajectory
  const first7Hrv = points.slice(0, 7).reduce((acc, p) => acc + p.hrv, 0) / 7;
  const last7Hrv = points.slice(23, 30).reduce((acc, p) => acc + p.hrv, 0) / 7;
  const hrvTrendDeltaPercent = Number((((last7Hrv - first7Hrv) / first7Hrv) * 100).toFixed(1));

  const first7Rhr = points.slice(0, 7).reduce((acc, p) => acc + p.restingHeartRate, 0) / 7;
  const last7Rhr = points.slice(23, 30).reduce((acc, p) => acc + p.restingHeartRate, 0) / 7;
  const rhrTrendDeltaBpm = Number((last7Rhr - first7Rhr).toFixed(1));

  const optimalDays = points.filter(p => p.readinessState === 'optimal').length;
  const balancedDays = points.filter(p => p.readinessState === 'moderate').length;
  const fatiguedDays = points.filter(p => p.readinessState === 'low').length;
  const recoveryConsistencyPercent = Math.round(((optimalDays + balancedDays) / points.length) * 100);

  return {
    points,
    avgHrv,
    avgRhr,
    minHrv,
    maxHrv,
    minRhr,
    maxRhr,
    hrvTrendDeltaPercent,
    rhrTrendDeltaBpm,
    optimalDays,
    balancedDays,
    fatiguedDays,
    recoveryConsistencyPercent
  };
}
