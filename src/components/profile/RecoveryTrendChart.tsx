import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  Legend
} from 'recharts';
import { ActivityLog } from '../../types';
import { compute30DayRecoveryTrend } from '../../utils/readinessService';
import {
  HeartPulse,
  TrendingUp,
  Activity,
  Calendar,
  Zap,
  Info,
  SlidersHorizontal,
  ShieldCheck,
  ArrowUpRight,
  ArrowDownRight,
  Flame,
  CheckCircle2
} from 'lucide-react';

interface RecoveryTrendChartProps {
  activityLogs: ActivityLog[];
  baselineHrv?: number;
  baselineRhr?: number;
}

export const RecoveryTrendChart: React.FC<RecoveryTrendChartProps> = ({
  activityLogs,
  baselineHrv = 66,
  baselineRhr = 54
}) => {
  // Time span selector: 30 days (default per specification), 14 days, 7 days
  const [timeSpan, setTimeSpan] = useState<'30d' | '14d' | '7d'>('30d');
  // Metric display mode
  const [chartMode, setChartMode] = useState<'combined' | 'hrv' | 'rhr' | 'recovery'>('combined');
  // Toggle rolling averages and baselines
  const [showRollingAverage, setShowRollingAverage] = useState(true);
  const [showBaselines, setShowBaselines] = useState(true);

  // Compute 30-day recovery data from activity logs
  const recoveryData = useMemo(() => {
    return compute30DayRecoveryTrend(activityLogs, baselineHrv, baselineRhr);
  }, [activityLogs, baselineHrv, baselineRhr]);

  // Filter points according to selected time span
  const filteredPoints = useMemo(() => {
    if (timeSpan === '7d') {
      return recoveryData.points.slice(23, 30);
    }
    if (timeSpan === '14d') {
      return recoveryData.points.slice(16, 30);
    }
    return recoveryData.points;
  }, [recoveryData.points, timeSpan]);

  // Dynamic axis limits for clean scaling
  const hrvMin = Math.max(40, Math.floor((recoveryData.minHrv - 5) / 5) * 5);
  const hrvMax = Math.min(95, Math.ceil((recoveryData.maxHrv + 5) / 5) * 5);
  const rhrMin = Math.max(40, Math.floor((recoveryData.minRhr - 4) / 2) * 2);
  const rhrMax = Math.min(75, Math.ceil((recoveryData.maxRhr + 4) / 2) * 2);

  // Custom high-contrast dark tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;
    const point = payload[0]?.payload;
    if (!point) return null;

    const isOptimal = point.readinessState === 'optimal';
    const isModerate = point.readinessState === 'moderate';

    return (
      <div className="p-3.5 rounded-2xl bg-[#08140c] border border-[#234b32] shadow-2xl text-xs space-y-2 min-w-[240px] max-w-[280px]">
        <div className="flex items-center justify-between border-b border-[#1b3d28] pb-1.5">
          <div>
            <span className="font-bold text-[#f5ebd7] block">{point.displayDate} ({point.dayOfWeek})</span>
            <span className="text-[10px] text-[#7d9987]">Day {point.dayNumber} of 30</span>
          </div>
          <span
            className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider ${
              isOptimal
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : isModerate
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
            }`}
          >
            {point.readinessState}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-0.5">
          <div className="bg-[#0b1c11] p-2 rounded-xl border border-[#183924]">
            <span className="text-[10px] text-[#86efac] block font-semibold flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
              <span>HRV (rMSSD)</span>
            </span>
            <span className="text-base font-black text-[#f5ebd7] font-mono">
              {point.hrv} <span className="text-[10px] font-normal text-[#8ea496]">ms</span>
            </span>
            {showRollingAverage && (
              <span className="text-[9px] text-[#7d9987] block mt-0.5">
                7d avg: {point.rollingAvgHrv} ms
              </span>
            )}
          </div>

          <div className="bg-[#0b1c11] p-2 rounded-xl border border-[#183924]">
            <span className="text-[10px] text-sky-400 block font-semibold flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 inline-block" />
              <span>Resting HR</span>
            </span>
            <span className="text-base font-black text-[#f5ebd7] font-mono">
              {point.restingHeartRate} <span className="text-[10px] font-normal text-[#8ea496]">bpm</span>
            </span>
            {showRollingAverage && (
              <span className="text-[9px] text-[#7d9987] block mt-0.5">
                7d avg: {point.rollingAvgRhr} bpm
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-[#173422] text-[11px] text-[#b0c4b8]">
          <span>Recovery Score:</span>
          <span className="font-bold text-[var(--accent-bright)] font-mono">{point.recoveryScore}%</span>
        </div>

        <div className="flex items-center justify-between text-[11px] text-[#b0c4b8]">
          <span>Restorative Sleep:</span>
          <span className="font-bold text-[#c084fc] font-mono">{point.sleepHours}h ({point.sleepScore}%)</span>
        </div>

        {point.strainDescription && (
          <div className="p-1.5 rounded-lg bg-[#07110a] text-[10px] text-[#9eb6a8] border border-[#142b1d] truncate">
            <span className="text-[#6d8a77]">Load: </span>
            <span>{point.strainDescription}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 rounded-3xl bg-[#09130d] border border-[#1e452b] shadow-xl space-y-5">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/40 text-emerald-400">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--accent-main)]">
                  AUTONOMIC CARDIOVASCULAR HEALTH
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-bold">
                  30-Day Long-Term
                </span>
              </div>
              <h2 className="font-['Cinzel'] text-lg sm:text-xl font-bold text-[#f5ebd7]">
                Recovery Trend & Biometrics
              </h2>
            </div>
          </div>
          <p className="text-xs text-[#8ea496] max-w-2xl">
            Continuous tracking of nocturnal Heart Rate Variability (rMSSD) and Resting Heart Rate (RHR).
            An elevated HRV accompanied by a lowered resting heart rate signals deep parasympathetic adaptation.
          </p>
        </div>

        {/* Action / View Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Time range switcher */}
          <div className="flex items-center space-x-1 bg-[#050e08] p-1 rounded-xl border border-[#163321]">
            <button
              onClick={() => setTimeSpan('7d')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                timeSpan === '7d'
                  ? 'bg-[#183d25] text-[#86efac] shadow-sm'
                  : 'text-[#7d9987] hover:text-[#f5ebd7]'
              }`}
            >
              7D
            </button>
            <button
              onClick={() => setTimeSpan('14d')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                timeSpan === '14d'
                  ? 'bg-[#183d25] text-[#86efac] shadow-sm'
                  : 'text-[#7d9987] hover:text-[#f5ebd7]'
              }`}
            >
              14D
            </button>
            <button
              onClick={() => setTimeSpan('30d')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                timeSpan === '30d'
                  ? 'bg-gradient-to-r from-[var(--accent-main)] to-[var(--accent-bright)] text-[#07130c] shadow-sm'
                  : 'text-[#7d9987] hover:text-[#f5ebd7]'
              }`}
            >
              30 Days
            </button>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center space-x-1 bg-[#050e08] p-1 rounded-xl border border-[#163321]">
            <button
              onClick={() => setChartMode('combined')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                chartMode === 'combined'
                  ? 'bg-[#183d25] text-[#f5ebd7] shadow-sm'
                  : 'text-[#7d9987] hover:text-[#f5ebd7]'
              }`}
              title="Dual-axis view of HRV and Resting Heart Rate"
            >
              Dual Axis
            </button>
            <button
              onClick={() => setChartMode('hrv')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                chartMode === 'hrv'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-[#7d9987] hover:text-[#f5ebd7]'
              }`}
              title="Focus on HRV rMSSD"
            >
              HRV Focus
            </button>
            <button
              onClick={() => setChartMode('rhr')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                chartMode === 'rhr'
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm'
                  : 'text-[#7d9987] hover:text-[#f5ebd7]'
              }`}
              title="Focus on Resting Heart Rate"
            >
              RHR Focus
            </button>
          </div>
        </div>
      </div>

      {/* 30-Day High-Impact Key Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Metric 1: Average HRV */}
        <div className="p-3.5 rounded-2xl bg-[#0c1a11] border border-[#1d3d29] relative overflow-hidden">
          <div className="flex items-center justify-between text-[#8ea496] mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">30-Day Avg HRV</span>
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl font-black text-emerald-400 font-mono">
              {recoveryData.avgHrv}
            </span>
            <span className="text-xs text-[#8ea496]">ms</span>
          </div>
          <div className="mt-1 flex items-center space-x-1 text-[11px] font-semibold text-emerald-400">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+{recoveryData.hrvTrendDeltaPercent}% trend</span>
            <span className="text-[10px] text-[#6d8a77] font-normal">vs week 1</span>
          </div>
        </div>

        {/* Metric 2: Average Resting Heart Rate */}
        <div className="p-3.5 rounded-2xl bg-[#0c1a11] border border-[#1d3d29] relative overflow-hidden">
          <div className="flex items-center justify-between text-[#8ea496] mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">30-Day Avg RHR</span>
            <HeartPulse className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl font-black text-sky-400 font-mono">
              {recoveryData.avgRhr}
            </span>
            <span className="text-xs text-[#8ea496]">bpm</span>
          </div>
          <div className="mt-1 flex items-center space-x-1 text-[11px] font-semibold text-sky-400">
            <ArrowDownRight className="w-3.5 h-3.5" />
            <span>{recoveryData.rhrTrendDeltaBpm} bpm</span>
            <span className="text-[10px] text-[#6d8a77] font-normal">efficiency</span>
          </div>
        </div>

        {/* Metric 3: Recovery Consistency */}
        <div className="p-3.5 rounded-2xl bg-[#0c1a11] border border-[#1d3d29] relative overflow-hidden">
          <div className="flex items-center justify-between text-[#8ea496] mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Optimal Days</span>
            <ShieldCheck className="w-3.5 h-3.5 text-[var(--accent-bright)]" />
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl font-black text-[var(--accent-bright)] font-mono">
              {recoveryData.optimalDays}
            </span>
            <span className="text-xs text-[#8ea496]">/ {recoveryData.points.length} d</span>
          </div>
          <div className="mt-1 flex items-center space-x-1 text-[11px] text-[#86efac]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{recoveryData.recoveryConsistencyPercent}% readiness</span>
          </div>
        </div>

        {/* Metric 4: Dynamic HRV Range */}
        <div className="p-3.5 rounded-2xl bg-[#0c1a11] border border-[#1d3d29] relative overflow-hidden">
          <div className="flex items-center justify-between text-[#8ea496] mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">HRV Range</span>
            <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-xl font-black text-[#f5ebd7] font-mono">
              {recoveryData.minHrv} - {recoveryData.maxHrv}
            </span>
            <span className="text-xs text-[#8ea496]">ms</span>
          </div>
          <span className="text-[10px] text-[#7d9987] block mt-1">
            Autonomic Elasticity
          </span>
        </div>
      </div>

      {/* Main Recharts Chart Area */}
      <div className="p-4 rounded-2xl bg-[#061009] border border-[#153120] space-y-3">
        {/* Chart Sub-controls & Legend Toggles */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-b border-[#132c1c] pb-2.5">
          <div className="flex flex-wrap items-center gap-4">
            {(chartMode === 'combined' || chartMode === 'hrv') && (
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-emerald-400 border border-emerald-300 inline-block shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                <span className="font-bold text-emerald-300">
                  HRV (rMSSD ms)
                </span>
              </div>
            )}

            {(chartMode === 'combined' || chartMode === 'rhr') && (
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-sky-400 border border-sky-300 inline-block shadow-[0_0_8px_rgba(56,189,248,0.5)]" />
                <span className="font-bold text-sky-300">
                  Resting Heart Rate (bpm)
                </span>
              </div>
            )}

            {showRollingAverage && (
              <div className="flex items-center space-x-2 text-[#9eb6a8]">
                <span className="w-4 h-0.5 bg-[var(--accent-main)] inline-block border-t border-dashed" />
                <span>7-Day Rolling Trend</span>
              </div>
            )}

            {showBaselines && (
              <div className="flex items-center space-x-2 text-[#7d9987]">
                <span className="w-4 h-0.5 bg-[#427a55] inline-block border-t border-dotted" />
                <span>Baseline ({baselineHrv}ms / {baselineRhr}bpm)</span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowRollingAverage(!showRollingAverage)}
              className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors flex items-center space-x-1 ${
                showRollingAverage ? 'bg-[#153422] text-[#86efac]' : 'text-[#627e6d] hover:text-[#9eb6a8]'
              }`}
            >
              <span>{showRollingAverage ? '✓ Rolling Avg' : '+ Rolling Avg'}</span>
            </button>

            <button
              onClick={() => setShowBaselines(!showBaselines)}
              className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors flex items-center space-x-1 ${
                showBaselines ? 'bg-[#153422] text-[#86efac]' : 'text-[#627e6d] hover:text-[#9eb6a8]'
              }`}
            >
              <span>{showBaselines ? '✓ Baselines' : '+ Baselines'}</span>
            </button>
          </div>
        </div>

        {/* Recharts SVG Visualization */}
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={filteredPoints}
              margin={{ top: 10, right: 15, left: -10, bottom: 0 }}
            >
              <defs>
                {/* Emerald Gradient for HRV Area */}
                <linearGradient id="hrvAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>

                {/* Sky Gradient for RHR Area */}
                <linearGradient id="rhrAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#132a1d" vertical={false} />

              <XAxis
                dataKey="displayDate"
                stroke="#5c7566"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#1a3a26' }}
                interval={timeSpan === '30d' ? 3 : 1}
                dy={6}
              />

              {/* Left Y Axis: HRV in ms */}
              {(chartMode === 'combined' || chartMode === 'hrv') && (
                <YAxis
                  yAxisId="leftHrv"
                  domain={[hrvMin, hrvMax]}
                  stroke="#10b981"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `${val}ms`}
                />
              )}

              {/* Right Y Axis: Resting Heart Rate in bpm */}
              {(chartMode === 'combined' || chartMode === 'rhr') && (
                <YAxis
                  yAxisId="rightRhr"
                  orientation="right"
                  domain={[rhrMin, rhrMax]}
                  stroke="#38bdf8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `${val}bpm`}
                />
              )}

              {/* Baselines Reference Lines */}
              {showBaselines && (chartMode === 'combined' || chartMode === 'hrv') && (
                <ReferenceLine
                  yAxisId="leftHrv"
                  y={baselineHrv}
                  stroke="#22c55e"
                  strokeDasharray="4 4"
                  strokeOpacity={0.4}
                  label={{
                    value: `HRV Baseline (${baselineHrv}ms)`,
                    fill: '#4ade80',
                    fontSize: 9,
                    position: 'insideTopLeft'
                  }}
                />
              )}

              {showBaselines && (chartMode === 'combined' || chartMode === 'rhr') && (
                <ReferenceLine
                  yAxisId="rightRhr"
                  y={baselineRhr}
                  stroke="#38bdf8"
                  strokeDasharray="4 4"
                  strokeOpacity={0.4}
                  label={{
                    value: `RHR Target (${baselineRhr}bpm)`,
                    fill: '#7dd3fc',
                    fontSize: 9,
                    position: 'insideBottomRight'
                  }}
                />
              )}

              <Tooltip content={<CustomTooltip />} />

              {/* HRV Area & Line */}
              {(chartMode === 'combined' || chartMode === 'hrv') && (
                <Area
                  yAxisId="leftHrv"
                  type="monotone"
                  dataKey="hrv"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#hrvAreaGrad)"
                  dot={{ fill: '#061009', stroke: '#10b981', strokeWidth: 1.5, r: 3 }}
                  activeDot={{ r: 5, fill: '#34d399', stroke: '#fff', strokeWidth: 1.5 }}
                  name="HRV (rMSSD)"
                />
              )}

              {/* Resting Heart Rate Line */}
              {(chartMode === 'combined' || chartMode === 'rhr') && (
                <Line
                  yAxisId="rightRhr"
                  type="monotone"
                  dataKey="restingHeartRate"
                  stroke="#38bdf8"
                  strokeWidth={2.2}
                  strokeDasharray={chartMode === 'combined' ? '5 3' : undefined}
                  dot={{ fill: '#061009', stroke: '#38bdf8', strokeWidth: 1.5, r: 3 }}
                  activeDot={{ r: 5, fill: '#38bdf8', stroke: '#fff', strokeWidth: 1.5 }}
                  name="Resting Heart Rate"
                />
              )}

              {/* 7-Day Rolling Averages */}
              {showRollingAverage && (chartMode === 'combined' || chartMode === 'hrv') && (
                <Line
                  yAxisId="leftHrv"
                  type="monotone"
                  dataKey="rollingAvgHrv"
                  stroke="var(--accent-main)"
                  strokeWidth={1.8}
                  dot={false}
                  strokeDasharray="3 3"
                  name="7-Day Rolling HRV"
                />
              )}

              {showRollingAverage && chartMode === 'rhr' && (
                <Line
                  yAxisId="rightRhr"
                  type="monotone"
                  dataKey="rollingAvgRhr"
                  stroke="#93c5fd"
                  strokeWidth={1.8}
                  dot={false}
                  strokeDasharray="3 3"
                  name="7-Day Rolling RHR"
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sports Science Insight Callout */}
      <div className="p-4 rounded-2xl bg-[#06120a] border border-[#193a24] flex items-start space-x-3 text-xs">
        <div className="p-2 rounded-xl bg-[var(--accent-main)]/10 text-[var(--accent-main)] flex-shrink-0 mt-0.5">
          <Info className="w-4 h-4" />
        </div>
        <div className="space-y-1">
          <h4 className="font-bold text-[#f5ebd7] text-xs">
            Sports Science Breakdown: Autonomic Nervous System Adaptations
          </h4>
          <p className="text-[#9eb6a8] leading-relaxed">
            The inverse convergence seen in your last 30 days—where Heart Rate Variability trended{' '}
            <strong className="text-emerald-400">+{recoveryData.hrvTrendDeltaPercent}%</strong> while resting heart rate shifted by{' '}
            <strong className="text-sky-400">{recoveryData.rhrTrendDeltaBpm} bpm</strong>—demonstrates positive cardiovascular remodelling and parasympathetic vagal dominance. You are absorbing the Panther high-volume training blocks without entering chronic autonomic overload.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-[#7d9987]">
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Optimal: {recoveryData.optimalDays} days</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-sky-400" />
              <span>Balanced: {recoveryData.balancedDays} days</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>High Fatigue: {recoveryData.fatiguedDays} days</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
