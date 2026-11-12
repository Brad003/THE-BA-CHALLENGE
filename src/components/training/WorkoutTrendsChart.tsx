import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ActivityLog, ExerciseCategory } from '../../types';
import {
  ResponsiveContainer,
  ComposedChart,
  BarChart,
  LineChart,
  Bar,
  Line,
  Area,
  AreaChart,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  Legend
} from 'recharts';
import {
  TrendingUp,
  Activity,
  Dumbbell,
  Flame,
  Calendar,
  Layers,
  Zap,
  Info,
  ChevronDown,
  BarChart2,
  LineChart as LineChartIcon,
  Maximize2,
  Minimize2,
  Plus
} from 'lucide-react';

type TimeRange = '7d' | '14d' | '30d' | '8w';
type ChartMode = 'combined' | 'volume' | 'intensity';
type VolumeUnit = 'tonnage' | 'sets';

interface ChartPoint {
  dateKey: string;
  label: string;
  fullDate: string;
  dayName: string;
  totalVolumeKg: number;
  totalSets: number;
  avgRpe: number;
  maxRpe: number;
  durationMinutes: number;
  caloriesBurned: number;
  workoutsCount: number;
  sessionTitles: string[];
  categoryBreakdown: { [cat: string]: number };
}

export const WorkoutTrendsChart: React.FC = () => {
  const { activityLogs, setShowLogActivity } = useApp();

  const [timeRange, setTimeRange] = useState<TimeRange>('14d');
  const [chartMode, setChartMode] = useState<ChartMode>('combined');
  const [volumeUnit, setVolumeUnit] = useState<VolumeUnit>('tonnage');
  const [selectedCategory, setSelectedCategory] = useState<ExerciseCategory | 'All'>('All');
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  // Parse and normalize activity logs
  const normalizedLogs = useMemo(() => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    return activityLogs.map((log) => {
      let iso = log.isoDate;
      if (!iso) {
        if (log.date === 'Today') {
          iso = todayStr;
        } else if (log.date === 'Yesterday') {
          const y = new Date(today);
          y.setDate(y.getDate() - 1);
          iso = y.toISOString().split('T')[0];
        } else if (log.id.startsWith('act-202')) {
          // e.g. act-2026-09-10
          iso = log.id.replace('act-', '').slice(0, 10);
        } else if (log.id.startsWith('act-') && !isNaN(Number(log.id.split('-')[1]))) {
          const t = Number(log.id.split('-')[1]);
          iso = new Date(t).toISOString().split('T')[0];
        } else {
          // Fallback to today or recent
          iso = todayStr;
        }
      }

      // Ensure sensible volume defaults if missing
      const sets = log.totalSets || Math.max(3, Math.round(log.durationMinutes / 3));
      const volumeKg =
        log.totalVolumeKg ||
        (log.category === 'Strength'
          ? log.durationMinutes * 115
          : log.category === 'Bodyweight'
          ? log.durationMinutes * 90
          : log.category === 'Cardio'
          ? log.durationMinutes * 70
          : log.durationMinutes * 40);

      const rpe = log.rpe || (log.category === 'Strength' ? 8.2 : log.category === 'Cardio' ? 7.6 : 6.5);

      return {
        ...log,
        isoDate: iso,
        computedVolumeKg: volumeKg,
        computedSets: sets,
        computedRpe: rpe
      };
    });
  }, [activityLogs]);

  // Aggregate data according to timeRange
  const { chartData, previousPeriodVolume, currentPeriodVolume, avgRpeOverall, peakRpeSession, totalSetsOverall } =
    useMemo(() => {
      const now = new Date();
      now.setHours(23, 59, 59, 999);

      let daysCount = 14;
      if (timeRange === '7d') daysCount = 7;
      else if (timeRange === '14d') daysCount = 14;
      else if (timeRange === '30d') daysCount = 30;
      else if (timeRange === '8w') daysCount = 56;

      const isWeekly = timeRange === '8w';

      if (isWeekly) {
        // Group by 8 weeks
        const weeksData: ChartPoint[] = [];
        const numWeeks = 8;

        for (let w = numWeeks - 1; w >= 0; w--) {
          const weekStart = new Date(now);
          weekStart.setDate(weekStart.getDate() - (w * 7 + 6));
          weekStart.setHours(0, 0, 0, 0);

          const weekEnd = new Date(now);
          weekEnd.setDate(weekEnd.getDate() - (w * 7));
          weekEnd.setHours(23, 59, 59, 999);

          const startStr = weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          const label = `Wk ${numWeeks - w}`;

          const logsInWeek = normalizedLogs.filter((log) => {
            if (selectedCategory !== 'All' && log.category !== selectedCategory) return false;
            const logTime = new Date(log.isoDate || '').getTime();
            return logTime >= weekStart.getTime() && logTime <= weekEnd.getTime();
          });

          let totalVol = 0;
          let totalSets = 0;
          let rpeSum = 0;
          let maxRpe = 0;
          let duration = 0;
          let calories = 0;
          const titles: string[] = [];
          const categoryBreakdown: { [cat: string]: number } = {};

          logsInWeek.forEach((l) => {
            totalVol += l.computedVolumeKg;
            totalSets += l.computedSets;
            rpeSum += l.computedRpe;
            maxRpe = Math.max(maxRpe, l.computedRpe);
            duration += l.durationMinutes;
            calories += l.caloriesBurned;
            titles.push(l.title);
            categoryBreakdown[l.category] = (categoryBreakdown[l.category] || 0) + l.computedVolumeKg;
          });

          const avgRpe = logsInWeek.length > 0 ? Number((rpeSum / logsInWeek.length).toFixed(1)) : 0;

          weeksData.push({
            dateKey: `week-${w}`,
            label,
            fullDate: `${startStr} (Week ${numWeeks - w})`,
            dayName: `Week ${numWeeks - w}`,
            totalVolumeKg: Math.round(totalVol),
            totalSets,
            avgRpe,
            maxRpe,
            durationMinutes: duration,
            caloriesBurned: calories,
            workoutsCount: logsInWeek.length,
            sessionTitles: titles,
            categoryBreakdown
          });
        }

        const currentVol = weeksData.slice(4).reduce((s, p) => s + p.totalVolumeKg, 0);
        const prevVol = weeksData.slice(0, 4).reduce((s, p) => s + p.totalVolumeKg, 0);
        const activeRpes = weeksData.filter((w) => w.avgRpe > 0).map((w) => w.avgRpe);
        const avgRpeVal =
          activeRpes.length > 0 ? Number((activeRpes.reduce((a, b) => a + b, 0) / activeRpes.length).toFixed(1)) : 7.6;
        const totalSetsSum = weeksData.reduce((s, p) => s + p.totalSets, 0);

        return {
          chartData: weeksData,
          previousPeriodVolume: prevVol,
          currentPeriodVolume: currentVol,
          avgRpeOverall: avgRpeVal,
          peakRpeSession: 9.0,
          totalSetsOverall: totalSetsSum
        };
      }

      // Daily resolution for 7d, 14d, 30d
      const dailyPoints: ChartPoint[] = [];
      const weekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

      for (let i = daysCount - 1; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const iso = d.toISOString().split('T')[0];
        const dayName = weekdayNames[d.getDay()];
        const shortDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const label = daysCount <= 14 ? `${dayName} ${d.getDate()}` : `${d.getMonth() + 1}/${d.getDate()}`;

        const logsOnDay = normalizedLogs.filter((log) => {
          if (selectedCategory !== 'All' && log.category !== selectedCategory) return false;
          return log.isoDate === iso;
        });

        let totalVol = 0;
        let totalSets = 0;
        let rpeSum = 0;
        let maxRpe = 0;
        let duration = 0;
        let calories = 0;
        const titles: string[] = [];
        const categoryBreakdown: { [cat: string]: number } = {};

        logsOnDay.forEach((l) => {
          totalVol += l.computedVolumeKg;
          totalSets += l.computedSets;
          rpeSum += l.computedRpe;
          maxRpe = Math.max(maxRpe, l.computedRpe);
          duration += l.durationMinutes;
          calories += l.caloriesBurned;
          titles.push(l.title);
          categoryBreakdown[l.category] = (categoryBreakdown[l.category] || 0) + l.computedVolumeKg;
        });

        const avgRpe = logsOnDay.length > 0 ? Number((rpeSum / logsOnDay.length).toFixed(1)) : 0;

        dailyPoints.push({
          dateKey: iso,
          label,
          fullDate: shortDate,
          dayName,
          totalVolumeKg: Math.round(totalVol),
          totalSets,
          avgRpe,
          maxRpe,
          durationMinutes: duration,
          caloriesBurned: calories,
          workoutsCount: logsOnDay.length,
          sessionTitles: titles,
          categoryBreakdown
        });
      }

      // Compute stats
      const half = Math.floor(dailyPoints.length / 2);
      const prevHalf = dailyPoints.slice(0, half);
      const currHalf = dailyPoints.slice(half);

      const prevVol = prevHalf.reduce((sum, p) => sum + (volumeUnit === 'tonnage' ? p.totalVolumeKg : p.totalSets), 0);
      const currVol = currHalf.reduce((sum, p) => sum + (volumeUnit === 'tonnage' ? p.totalVolumeKg : p.totalSets), 0);

      const daysWithRpe = dailyPoints.filter((p) => p.avgRpe > 0);
      const avgRpeVal =
        daysWithRpe.length > 0
          ? Number((daysWithRpe.reduce((sum, p) => sum + p.avgRpe, 0) / daysWithRpe.length).toFixed(1))
          : 7.5;

      let peakRpe = 0;
      dailyPoints.forEach((p) => {
        if (p.maxRpe > peakRpe) peakRpe = p.maxRpe;
      });

      const totalSetsSum = dailyPoints.reduce((sum, p) => sum + p.totalSets, 0);

      return {
        chartData: dailyPoints,
        previousPeriodVolume: prevVol,
        currentPeriodVolume: currVol,
        avgRpeOverall: avgRpeVal,
        peakRpeSession: peakRpe || 8.8,
        totalSetsOverall: totalSetsSum
      };
    }, [normalizedLogs, timeRange, selectedCategory, volumeUnit]);

  // Volume overload percentage change
  const volumeGrowthPct = useMemo(() => {
    if (previousPeriodVolume === 0) return currentPeriodVolume > 0 ? 100 : 0;
    const diff = currentPeriodVolume - previousPeriodVolume;
    return Number(((diff / previousPeriodVolume) * 100).toFixed(1));
  }, [currentPeriodVolume, previousPeriodVolume]);

  // Acute:Chronic Workload Ratio (ACWR) proxy
  const workloadRatio = useMemo(() => {
    if (previousPeriodVolume === 0) return 1.05;
    const ratio = currentPeriodVolume / (previousPeriodVolume || 1);
    return Number(Math.max(0.7, Math.min(1.65, ratio)).toFixed(2));
  }, [currentPeriodVolume, previousPeriodVolume]);

  // Category list
  const categories: (ExerciseCategory | 'All')[] = ['All', 'Strength', 'Bodyweight', 'Cardio', 'Mobility'];

  return (
    <div
      id="workout-trends-container"
      className="rounded-3xl bg-gradient-to-b from-[#09150e] to-[#070f0a] border border-[#1b3b27] shadow-2xl p-4 sm:p-6 space-y-5 text-[#f4f1ea] transition-all"
    >
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#14281c] pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-[#143020] border border-[var(--accent-main)]/50 text-[var(--accent-main)]">
              <TrendingUp className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-extrabold text-[var(--accent-main)] uppercase tracking-widest">
              PERFORMANCE PROGRESSION ENGINE
            </span>
          </div>
          <h2 className="font-['Cinzel'] text-xl sm:text-2xl font-black text-[#f5ebd7] tracking-wide mt-1">
            Workout Volume & Intensity Trends
          </h2>
          <p className="text-xs text-[#8ea496] mt-0.5">
            Real-time mechanical load (tonnage/sets) correlated with Rate of Perceived Exertion (RPE).
          </p>
        </div>

        {/* Action buttons & expand */}
        <div className="flex items-center space-x-2 self-start md:self-auto flex-wrap gap-y-2">
          <button
            id="log-training-session-btn"
            onClick={() => setShowLogActivity(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#143a24] hover:bg-[#1b4b2f] text-xs font-bold text-[#86efac] border border-[#27593c] transition-all shadow-md active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 text-[var(--accent-main)]" />
            <span>Log Session</span>
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-xl bg-[#0c1911] border border-[#1b3425] text-[#8ea496] hover:text-[#f5ebd7] transition-colors"
            title={isExpanded ? 'Collapse Analytics' : 'Expand Analytics'}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <>
          {/* Top Performance Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Total Volume */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-[#0a1810] border border-[#1b3826] space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#769381] uppercase tracking-wider">
                  {volumeUnit === 'tonnage' ? 'Total Volume Load' : 'Total Sets'}
                </span>
                <Dumbbell className="w-3.5 h-3.5 text-[var(--accent-main)]" />
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-lg sm:text-2xl font-extrabold text-[#f5ebd7] font-mono">
                  {volumeUnit === 'tonnage'
                    ? `${(currentPeriodVolume + previousPeriodVolume).toLocaleString()} kg`
                    : `${totalSetsOverall} sets`}
                </span>
              </div>
              <div className="flex items-center space-x-1.5 text-[11px] pt-0.5">
                <span
                  className={`font-bold flex items-center ${
                    volumeGrowthPct >= 0 ? 'text-emerald-400' : 'text-amber-400'
                  }`}
                >
                  {volumeGrowthPct >= 0 ? `+${volumeGrowthPct}%` : `${volumeGrowthPct}%`}
                </span>
                <span className="text-[#6d8a77] text-[10px]">vs previous cycle</span>
              </div>
            </div>

            {/* Average Intensity (RPE) */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-[#0a1810] border border-[#1b3826] space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#769381] uppercase tracking-wider">
                  Avg Intensity (RPE)
                </span>
                <Zap className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-lg sm:text-2xl font-extrabold text-[#f5ebd7] font-mono">
                  {avgRpeOverall}
                </span>
                <span className="text-xs text-[#7d9987] font-bold">/ 10</span>
              </div>
              <div className="text-[10px] text-amber-300 font-semibold truncate">
                {avgRpeOverall >= 8.5
                  ? 'Peak Overload (Near Limit)'
                  : avgRpeOverall >= 7.2
                  ? 'Optimal Hypertrophy Sweet Spot'
                  : 'Aerobic & Base Building'}
              </div>
            </div>

            {/* Workload Status (ACWR) */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-[#0a1810] border border-[#1b3826] space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#769381] uppercase tracking-wider">
                  Progression Ratio
                </span>
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-lg sm:text-2xl font-extrabold text-[#f5ebd7] font-mono">
                  {workloadRatio}
                </span>
                <span className="text-[10px] text-[#7d9987]">ACWR</span>
              </div>
              <div className="text-[10px] text-emerald-300 font-semibold truncate">
                {workloadRatio >= 1.4
                  ? 'High Strain / Deload Soon'
                  : workloadRatio >= 0.95
                  ? 'Sweet Spot (Adaptive Zone)'
                  : 'Recovery / Tapered'}
              </div>
            </div>

            {/* Peak Effort Session */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-[#0a1810] border border-[#1b3826] space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#769381] uppercase tracking-wider">
                  Peak Intensity
                </span>
                <Flame className="w-3.5 h-3.5 text-rose-400" />
              </div>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-lg sm:text-2xl font-extrabold text-[#f5ebd7] font-mono">
                  RPE {peakRpeSession}
                </span>
              </div>
              <div className="text-[10px] text-rose-300 font-semibold truncate">
                Maximum Mechanical Exertion
              </div>
            </div>
          </div>

          {/* Interactive Filters & Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-[#07130b] p-3 rounded-2xl border border-[#152e1f]">
            {/* Chart Mode Switcher */}
            <div className="flex items-center space-x-1 bg-[#0d1f14] p-1 rounded-xl border border-[#1d3d2a] self-start sm:self-auto">
              <button
                onClick={() => setChartMode('combined')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  chartMode === 'combined'
                    ? 'bg-gradient-to-r from-[var(--accent-main)] to-[var(--accent-grad)] text-[#07130c] shadow-sm'
                    : 'text-[#8ba294] hover:text-[#f5ebd7]'
                }`}
              >
                Combined Trends
              </button>
              <button
                onClick={() => setChartMode('volume')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  chartMode === 'volume'
                    ? 'bg-gradient-to-r from-[var(--accent-main)] to-[var(--accent-grad)] text-[#07130c] shadow-sm'
                    : 'text-[#8ba294] hover:text-[#f5ebd7]'
                }`}
              >
                Volume Focus
              </button>
              <button
                onClick={() => setChartMode('intensity')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  chartMode === 'intensity'
                    ? 'bg-gradient-to-r from-[var(--accent-main)] to-[var(--accent-grad)] text-[#07130c] shadow-sm'
                    : 'text-[#8ba294] hover:text-[#f5ebd7]'
                }`}
              >
                Intensity & RPE
              </button>
            </div>

            {/* Right Controls: Unit & Time Range */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0">
              {/* Volume Unit Toggle (Tonnage vs Sets) */}
              {chartMode !== 'intensity' && (
                <div className="flex items-center bg-[#0d1f14] p-0.5 rounded-lg border border-[#1d3d2a] text-[11px] font-bold">
                  <button
                    onClick={() => setVolumeUnit('tonnage')}
                    className={`px-2 py-1 rounded ${
                      volumeUnit === 'tonnage'
                        ? 'bg-[#1b4329] text-[#86efac]'
                        : 'text-[#6b8976] hover:text-[#b4c7bb]'
                    }`}
                  >
                    Kg Load
                  </button>
                  <button
                    onClick={() => setVolumeUnit('sets')}
                    className={`px-2 py-1 rounded ${
                      volumeUnit === 'sets'
                        ? 'bg-[#1b4329] text-[#86efac]'
                        : 'text-[#6b8976] hover:text-[#b4c7bb]'
                    }`}
                  >
                    Sets
                  </button>
                </div>
              )}

              {/* Time Horizon Pills */}
              <div className="flex items-center space-x-1 bg-[#0d1f14] p-0.5 rounded-lg border border-[#1d3d2a] text-[11px] font-bold">
                {(['7d', '14d', '30d', '8w'] as TimeRange[]).map((tr) => (
                  <button
                    key={tr}
                    onClick={() => setTimeRange(tr)}
                    className={`px-2.5 py-1 rounded uppercase tracking-wider transition-colors ${
                      timeRange === tr
                        ? 'bg-[var(--accent-main)] text-[#07130c] font-black'
                        : 'text-[#6d8a77] hover:text-[#c4d6cb]'
                    }`}
                  >
                    {tr === '8w' ? '8 Wks' : tr}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            <span className="text-[10px] uppercase font-bold text-[#6d8a77] mr-1">Regimen Filter:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-[#173a24] text-[#86efac] border border-[#2b6440]'
                    : 'bg-[#0a150e] text-[#6d8a77] hover:text-[#c3d5c9] border border-[#14281c]'
                }`}
              >
                {cat === 'All' ? 'All Disciplines' : cat}
              </button>
            ))}
          </div>

          {/* Chart Canvas */}
          <div className="bg-[#06110a] p-4 rounded-2xl border border-[#152c1e] space-y-2">
            {/* Chart Legend & Zone indicator */}
            <div className="flex flex-wrap items-center justify-between text-xs text-[#8ea496] gap-2 pb-2">
              <div className="flex items-center space-x-4">
                {(chartMode === 'combined' || chartMode === 'volume') && (
                  <div className="flex items-center space-x-1.5">
                    <span className="w-3 h-3 rounded-sm bg-[#10b981] inline-block" />
                    <span className="font-semibold text-[#b8cbbe]">
                      {volumeUnit === 'tonnage' ? 'Volume Load (kg)' : 'Sets Completed'}
                    </span>
                  </div>
                )}
                {(chartMode === 'combined' || chartMode === 'intensity') && (
                  <div className="flex items-center space-x-1.5">
                    <span className="w-3 h-3 rounded-full bg-[var(--accent-main)] inline-block" />
                    <span className="font-semibold text-[var(--accent-main)]">Intensity (RPE 1-10)</span>
                  </div>
                )}
              </div>

              <div className="text-[10px] text-[#6b8975] flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>RPE 7.0–8.5 Hypertrophy Sweet Spot</span>
              </div>
            </div>

            {/* Recharts Container */}
            <div className="h-64 sm:h-72 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                {chartMode === 'combined' ? (
                  <ComposedChart data={chartData} margin={{ top: 15, right: 10, left: -10, bottom: 5 }}>
                    <defs>
                      <linearGradient id="volumeBarGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity={0.9} />
                        <stop offset="100%" stopColor="#064e3b" stopOpacity={0.4} />
                      </linearGradient>
                      <linearGradient id="rpeAreaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#c99738" stopOpacity={0.25} />
                        <stop offset="100%" stopColor="#c99738" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#13291b" vertical={false} />
                    <XAxis
                      dataKey="label"
                      stroke="#5a7565"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: '#1a3825' }}
                    />
                    {/* Left Axis: Volume */}
                    <YAxis
                      yAxisId="left"
                      stroke="#4ade80"
                      fontSize={10}
                      tickLine={false}
                      axisLine={{ stroke: '#1a3825' }}
                      tickFormatter={(val) =>
                        volumeUnit === 'tonnage'
                          ? val >= 1000
                            ? `${(val / 1000).toFixed(1)}k`
                            : `${val}`
                          : `${val}`
                      }
                    />
                    {/* Right Axis: Intensity RPE */}
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      stroke="var(--accent-main)"
                      fontSize={10}
                      domain={[0, 10]}
                      ticks={[0, 2, 4, 6, 8, 10]}
                      tickLine={false}
                      axisLine={{ stroke: '#1a3825' }}
                      tickFormatter={(val) => `${val}`}
                    />
                    <Tooltip content={<CustomWorkoutTooltip volumeUnit={volumeUnit} />} />
                    <ReferenceLine
                      yAxisId="right"
                      y={7.5}
                      stroke="#c99738"
                      strokeDasharray="4 4"
                      strokeOpacity={0.5}
                    />

                    {/* Volume Bar */}
                    <Bar
                      yAxisId="left"
                      dataKey={volumeUnit === 'tonnage' ? 'totalVolumeKg' : 'totalSets'}
                      name={volumeUnit === 'tonnage' ? 'Volume (kg)' : 'Sets'}
                      fill="url(#volumeBarGrad)"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={36}
                    />

                    {/* Intensity Line */}
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="avgRpe"
                      name="Intensity (RPE)"
                      stroke="var(--accent-main)"
                      strokeWidth={3}
                      dot={{ fill: '#0a170f', stroke: 'var(--accent-main)', strokeWidth: 2, r: 3.5 }}
                      activeDot={{ r: 6, fill: '#f5ebd7', stroke: 'var(--accent-main)', strokeWidth: 2 }}
                    />
                  </ComposedChart>
                ) : chartMode === 'volume' ? (
                  <BarChart data={chartData} margin={{ top: 15, right: 10, left: -10, bottom: 5 }}>
                    <defs>
                      <linearGradient id="volumeBarOnly" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#34d399" stopOpacity={0.95} />
                        <stop offset="100%" stopColor="#064e3b" stopOpacity={0.4} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#13291b" vertical={false} />
                    <XAxis
                      dataKey="label"
                      stroke="#5a7565"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: '#1a3825' }}
                    />
                    <YAxis
                      stroke="#4ade80"
                      fontSize={10}
                      tickLine={false}
                      axisLine={{ stroke: '#1a3825' }}
                      tickFormatter={(val) =>
                        volumeUnit === 'tonnage'
                          ? val >= 1000
                            ? `${(val / 1000).toFixed(1)}k`
                            : `${val}`
                          : `${val}`
                      }
                    />
                    <Tooltip content={<CustomWorkoutTooltip volumeUnit={volumeUnit} />} />
                    <Bar
                      dataKey={volumeUnit === 'tonnage' ? 'totalVolumeKg' : 'totalSets'}
                      name={volumeUnit === 'tonnage' ? 'Volume Load (kg)' : 'Sets'}
                      fill="url(#volumeBarOnly)"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={40}
                    />
                  </BarChart>
                ) : (
                  <AreaChart data={chartData} margin={{ top: 15, right: 10, left: -10, bottom: 5 }}>
                    <defs>
                      <linearGradient id="intensityAreaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#e2b955" stopOpacity={0.7} />
                        <stop offset="100%" stopColor="#78350f" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#13291b" vertical={false} />
                    <XAxis
                      dataKey="label"
                      stroke="#5a7565"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: '#1a3825' }}
                    />
                    <YAxis
                      stroke="var(--accent-main)"
                      fontSize={10}
                      domain={[0, 10]}
                      ticks={[0, 2, 4, 6, 8, 10]}
                      tickLine={false}
                      axisLine={{ stroke: '#1a3825' }}
                    />
                    <Tooltip content={<CustomWorkoutTooltip volumeUnit={volumeUnit} />} />
                    <ReferenceLine y={8} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'Hard', fill: '#f87171', fontSize: 10 }} />
                    <ReferenceLine y={7} stroke="#10b981" strokeDasharray="3 3" label={{ value: 'Target', fill: '#34d399', fontSize: 10 }} />
                    <Area
                      type="monotone"
                      dataKey="avgRpe"
                      name="RPE Intensity"
                      stroke="var(--accent-main)"
                      strokeWidth={3}
                      fill="url(#intensityAreaGrad)"
                      dot={{ fill: '#0a170f', stroke: 'var(--accent-main)', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, fill: '#f5ebd7', stroke: 'var(--accent-main)', strokeWidth: 2 }}
                    />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          {/* Periodization & Progressive Overload Insights Box */}
          <div className="p-4 rounded-2xl bg-[#0a1a11] border border-[#1b3f29] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Info className="w-4 h-4 text-[var(--accent-main)]" />
                <h4 className="text-xs font-bold text-[#f5ebd7] uppercase tracking-wider">
                  Tactical Training Advisory • Progressive Overload Analysis
                </h4>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#133520] text-[#86efac] border border-[#215132]">
                STATUS: {volumeGrowthPct > 0 ? 'PROGRESSING' : 'MAINTAINING'}
              </span>
            </div>

            <p className="text-xs text-[#9cb4a5] leading-relaxed">
              {volumeGrowthPct >= 8 ? (
                <>
                  <strong className="text-[#86efac]">Progressive Overload Verified:</strong> Your training volume has expanded by{' '}
                  <strong className="text-[var(--accent-main)]">+{volumeGrowthPct}%</strong> over this period while holding an average exertion of{' '}
                  <strong className="text-white">RPE {avgRpeOverall}/10</strong>. This indicates positive neuromuscular adaptation without premature central fatigue. Maintain nutritional intake and joint mobility.
                </>
              ) : volumeGrowthPct >= 0 ? (
                <>
                  <strong className="text-[#86efac]">Stable Work Capacity:</strong> Volume is locked in steady maintenance mode ({volumeGrowthPct}%). Intensity is centered around{' '}
                  <strong className="text-[var(--accent-main)]">RPE {avgRpeOverall}</strong>. To spark new hypertrophy or strength gains, introduce 1-2 additional sets on compound lifts in your next microcycle.
                </>
              ) : (
                <>
                  <strong className="text-amber-300">Deload & Recovery Phase:</strong> Volume is down{' '}
                  <strong className="text-amber-300">{volumeGrowthPct}%</strong>, which is optimal if recovering from high-intensity ridge ascents or heavy barbell microcycles. Prime your nervous system for the next ramp-up.
                </>
              )}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

// Custom interactive Tooltip component
interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  volumeUnit: VolumeUnit;
}

const CustomWorkoutTooltip: React.FC<CustomTooltipProps> = ({ active, payload, volumeUnit }) => {
  if (!active || !payload || payload.length === 0) return null;

  const data: ChartPoint = payload[0]?.payload;
  if (!data) return null;

  const hasActivity = data.workoutsCount > 0 || data.totalVolumeKg > 0;

  return (
    <div className="p-3.5 rounded-2xl bg-[#07130c]/95 border border-[var(--accent-main)]/50 shadow-2xl backdrop-blur-md text-[#f5ebd7] min-w-[210px] space-y-2">
      {/* Date Header */}
      <div className="border-b border-[#1b3d27] pb-1.5 flex items-center justify-between">
        <span className="text-xs font-black text-[#f5ebd7]">{data.fullDate}</span>
        <span className="text-[10px] font-bold text-[#71907d] uppercase tracking-wider">
          {data.dayName}
        </span>
      </div>

      {hasActivity ? (
        <div className="space-y-2 text-xs">
          {/* Workout Titles */}
          {data.sessionTitles.length > 0 && (
            <div className="space-y-0.5">
              <span className="text-[10px] text-[#6d8b77] uppercase font-bold">Sessions Logged:</span>
              {data.sessionTitles.map((title, idx) => (
                <div key={idx} className="text-xs font-semibold text-[#86efac] truncate max-w-[200px]">
                  • {title}
                </div>
              ))}
            </div>
          )}

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#132a1b]">
            <div>
              <span className="text-[10px] text-[#6d8b77] block">Volume Load</span>
              <span className="text-xs font-bold text-[#f5ebd7] font-mono">
                {data.totalVolumeKg.toLocaleString()} kg
              </span>
            </div>
            <div>
              <span className="text-[10px] text-[#6d8b77] block">Sets Completed</span>
              <span className="text-xs font-bold text-[#86efac] font-mono">
                {data.totalSets} sets
              </span>
            </div>
            <div>
              <span className="text-[10px] text-[#6d8b77] block">Avg Intensity</span>
              <span className="text-xs font-bold text-[var(--accent-main)] font-mono">
                RPE {data.avgRpe > 0 ? data.avgRpe : '—'}/10
              </span>
            </div>
            <div>
              <span className="text-[10px] text-[#6d8b77] block">Calories Burned</span>
              <span className="text-xs font-bold text-amber-400 font-mono">
                {data.caloriesBurned > 0 ? `${data.caloriesBurned} kcal` : '—'}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-1 text-center text-xs text-[#718f7d] italic">
          Active Rest / Recovery Day
        </div>
      )}
    </div>
  );
};
