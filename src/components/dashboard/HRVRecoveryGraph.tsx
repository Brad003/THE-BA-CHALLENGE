import React, { useState } from 'react';
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
import { UserReadinessData } from '../../types';
import { Activity, Moon, Zap, ShieldCheck, HeartPulse, Info } from 'lucide-react';

interface HRVRecoveryGraphProps {
  readiness: UserReadinessData;
  compact?: boolean;
}

export const HRVRecoveryGraph: React.FC<HRVRecoveryGraphProps> = ({
  readiness,
  compact = false
}) => {
  const [activeView, setActiveView] = useState<'7day' | 'intraday'>('7day');
  const [showRHR, setShowRHR] = useState(false);

  // Custom high-contrast dark tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    if (activeView === '7day') {
      const data = payload[0]?.payload;
      return (
        <div className="p-3 rounded-xl bg-[#07130b] border border-[#214a30] shadow-2xl text-xs space-y-1.5 min-w-[190px]">
          <div className="flex items-center justify-between border-b border-[#1b3b27] pb-1">
            <span className="font-bold text-[#f5ebd7]">{data?.day} ({data?.dateStr})</span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                data?.readinessState === 'optimal'
                  ? 'bg-amber-500/20 text-amber-300'
                  : data?.readinessState === 'moderate'
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : 'bg-rose-500/20 text-rose-300'
              }`}
            >
              {data?.readinessState === 'optimal'
                ? 'OPTIMAL'
                : data?.readinessState === 'moderate'
                ? 'BALANCED'
                : 'FATIGUED'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <div>
              <span className="text-[10px] text-[#7d9987] block">HRV (rMSSD)</span>
              <span className="text-sm font-black text-[var(--accent-bright)]">
                {data?.hrv} <span className="text-[10px] font-normal text-[#9eb6a8]">ms</span>
              </span>
            </div>
            <div>
              <span className="text-[10px] text-[#7d9987] block">Recovery Score</span>
              <span className="text-sm font-black text-[#34d399]">
                {data?.recoveryScore}%
              </span>
            </div>
            <div>
              <span className="text-[10px] text-[#7d9987] block">Resting HR</span>
              <span className="text-sm font-bold text-[#38bdf8]">
                {data?.restingHeartRate} <span className="text-[10px] font-normal text-[#9eb6a8]">bpm</span>
              </span>
            </div>
            <div>
              <span className="text-[10px] text-[#7d9987] block">Sleep Duration</span>
              <span className="text-sm font-bold text-[#c084fc]">
                {data?.sleepHours}h
              </span>
            </div>
          </div>

          <div className="pt-1 text-[10px] text-[#86efac] flex items-center space-x-1 border-t border-[#1b3b27]/60">
            <span>Baseline: {data?.baselineHrv} ms</span>
            <span>•</span>
            <span>{data?.hrv >= data?.baselineHrv ? 'Normal / High Vagal Tone' : 'Suppressed Autonomic Tone'}</span>
          </div>
        </div>
      );
    } else {
      const data = payload[0]?.payload;
      return (
        <div className="p-3 rounded-xl bg-[#07130b] border border-[#214a30] shadow-2xl text-xs space-y-1 min-w-[180px]">
          <div className="flex items-center justify-between border-b border-[#1b3b27] pb-1">
            <span className="font-bold text-[#f5ebd7]">{data?.time}</span>
            <span className="text-[10px] text-[#9eb6a8] bg-[#122e1e] px-1.5 py-0.5 rounded">
              {data?.stage}
            </span>
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="text-[#8da696]">HRV (rMSSD):</span>
            <span className="font-bold text-[var(--accent-bright)]">{data?.hrv} ms</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#8da696]">Heart Rate:</span>
            <span className="font-bold text-[#38bdf8]">{data?.heartRate} bpm</span>
          </div>
        </div>
      );
    }
  };

  const avg7DayHRV = Math.round(
    readiness.history.reduce((acc, h) => acc + h.hrv, 0) / readiness.history.length
  );
  const avg7DayRecovery = Math.round(
    readiness.history.reduce((acc, h) => acc + h.recoveryScore, 0) / readiness.history.length
  );

  return (
    <div className="space-y-3">
      {/* View Switcher & Toggles Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-1.5 bg-[#07130b] border border-[#1b3926] p-1 rounded-xl">
          <button
            onClick={() => setActiveView('7day')}
            id="btn-hrv-view-7day"
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeView === '7day'
                ? 'bg-gradient-to-r from-[var(--accent-main)] to-[var(--accent-bright)] text-[#07140b] shadow-md'
                : 'text-[#8da696] hover:text-[#f5ebd7]'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>7-Day Recovery Trend</span>
          </button>

          <button
            onClick={() => setActiveView('intraday')}
            id="btn-hrv-view-intraday"
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeView === 'intraday'
                ? 'bg-gradient-to-r from-[var(--accent-main)] to-[var(--accent-bright)] text-[#07140b] shadow-md'
                : 'text-[#8da696] hover:text-[#f5ebd7]'
            }`}
          >
            <Moon className="w-3.5 h-3.5" />
            <span>Sleep & Wake Wave</span>
          </button>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <label className="flex items-center space-x-1.5 text-[#8da696] cursor-pointer hover:text-[#f5ebd7] select-none">
            <input
              type="checkbox"
              checked={showRHR}
              onChange={(e) => setShowRHR(e.target.checked)}
              className="accent-[var(--accent-main)] rounded w-3.5 h-3.5"
            />
            <span className="text-[11px] font-semibold">Overlay Resting HR</span>
          </label>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className={`${compact ? 'h-52' : 'h-64'} w-full relative`}>
        <ResponsiveContainer width="100%" height="100%">
          {activeView === '7day' ? (
            <ComposedChart
              data={readiness.history}
              margin={{ top: 12, right: 12, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="hrvGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent-bright)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="var(--accent-main)" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="recoveryGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#163121" vertical={false} />

              <XAxis
                dataKey="day"
                stroke="#5c7566"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                dy={6}
              />

              {/* Left Axis: HRV (rMSSD in ms) */}
              <YAxis
                yAxisId="hrv"
                domain={['dataMin - 10', 'dataMax + 10']}
                stroke="var(--accent-main)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `${val}ms`}
              />

              {/* Right Axis: Recovery Score (%) */}
              <YAxis
                yAxisId="recovery"
                orientation="right"
                domain={[40, 100]}
                stroke="#10b981"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `${val}%`}
              />

              {/* Optional RHR Axis */}
              {showRHR && (
                <YAxis
                  yAxisId="rhr"
                  orientation="right"
                  domain={[40, 80]}
                  hide={true}
                />
              )}

              {/* Baseline Reference Line */}
              <ReferenceLine
                yAxisId="hrv"
                y={readiness.hrvBaseline}
                stroke="#d4a34b"
                strokeDasharray="4 4"
                strokeOpacity={0.7}
                label={{
                  value: `Baseline (${readiness.hrvBaseline}ms)`,
                  fill: '#d4a34b',
                  fontSize: 10,
                  position: 'insideBottomRight'
                }}
              />

              <Tooltip content={<CustomTooltip />} />

              {/* HRV Area */}
              <Area
                yAxisId="hrv"
                type="monotone"
                dataKey="hrv"
                name="HRV (rMSSD)"
                stroke="var(--accent-bright)"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#hrvGradient)"
                dot={{ fill: '#0a150e', stroke: 'var(--accent-bright)', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: 'var(--accent-bright)' }}
              />

              {/* Recovery Score Line */}
              <Line
                yAxisId="recovery"
                type="monotone"
                dataKey="recoveryScore"
                name="Recovery %"
                stroke="#10b981"
                strokeWidth={2.5}
                dot={{ fill: '#0a150e', stroke: '#10b981', strokeWidth: 2, r: 3.5 }}
                activeDot={{ r: 5, fill: '#10b981' }}
              />

              {/* Optional Resting HR Line */}
              {showRHR && (
                <Line
                  yAxisId="rhr"
                  type="monotone"
                  dataKey="restingHeartRate"
                  name="Resting HR (bpm)"
                  stroke="#38bdf8"
                  strokeWidth={2}
                  strokeDasharray="3 3"
                  dot={{ fill: '#38bdf8', r: 3 }}
                />
              )}
            </ComposedChart>
          ) : (
            <ComposedChart
              data={readiness.intraday}
              margin={{ top: 12, right: 12, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="intradayGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#163121" vertical={false} />

              <XAxis
                dataKey="time"
                stroke="#5c7566"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                dy={6}
              />

              <YAxis
                yAxisId="hrv"
                domain={['dataMin - 10', 'dataMax + 10']}
                stroke="var(--accent-main)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `${val}ms`}
              />

              <YAxis
                yAxisId="hr"
                orientation="right"
                domain={['dataMin - 5', 'dataMax + 10']}
                stroke="#38bdf8"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `${val}bpm`}
              />

              <Tooltip content={<CustomTooltip />} />

              <Area
                yAxisId="hrv"
                type="monotone"
                dataKey="hrv"
                name="Sleep HRV (ms)"
                stroke="var(--accent-bright)"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#intradayGrad)"
              />

              <Line
                yAxisId="hr"
                type="monotone"
                dataKey="heartRate"
                name="Sleep Pulse (bpm)"
                stroke="#38bdf8"
                strokeWidth={2}
                dot={{ fill: '#38bdf8', r: 3 }}
              />
            </ComposedChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Legend & Summary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#173322]">
        <div className="bg-[#09150d] p-2.5 rounded-xl border border-[#193824]">
          <span className="text-[10px] text-[#7d9987] uppercase font-bold tracking-wider block">
            7-Day Avg HRV
          </span>
          <div className="flex items-baseline space-x-1.5 mt-0.5">
            <span className="text-base font-black text-[#f5ebd7]">{avg7DayHRV} ms</span>
            <span className="text-[10px] text-[var(--accent-bright)] font-semibold">
              {avg7DayHRV >= readiness.hrvBaseline ? '↑ Balanced' : '↓ Strained'}
            </span>
          </div>
        </div>

        <div className="bg-[#09150d] p-2.5 rounded-xl border border-[#193824]">
          <span className="text-[10px] text-[#7d9987] uppercase font-bold tracking-wider block">
            7-Day Avg Recovery
          </span>
          <div className="flex items-baseline space-x-1.5 mt-0.5">
            <span className="text-base font-black text-[#34d399]">{avg7DayRecovery}%</span>
            <span className="text-[10px] text-[#86efac]">Solid Base</span>
          </div>
        </div>

        <div className="bg-[#09150d] p-2.5 rounded-xl border border-[#193824]">
          <span className="text-[10px] text-[#7d9987] uppercase font-bold tracking-wider block">
            Parasympathetic Tone
          </span>
          <div className="flex items-baseline space-x-1.5 mt-0.5">
            <span className="text-base font-black text-[#38bdf8]">
              {readiness.state === 'optimal' ? 'High' : readiness.state === 'moderate' ? 'Steady' : 'Depleted'}
            </span>
            <span className="text-[10px] text-[#9eb6a8]">Vagal Index</span>
          </div>
        </div>

        <div className="bg-[#09150d] p-2.5 rounded-xl border border-[#193824]">
          <span className="text-[10px] text-[#7d9987] uppercase font-bold tracking-wider block">
            Nocturnal Dip
          </span>
          <div className="flex items-baseline space-x-1.5 mt-0.5">
            <span className="text-base font-black text-[#c084fc]">-15% RHR</span>
            <span className="text-[10px] text-[#86efac]">Optimal Dip</span>
          </div>
        </div>
      </div>
    </div>
  );
};
