import React, { useState } from 'react';
import { UserReadinessData, Workout } from '../../types';
import { HRVRecoveryGraph } from './HRVRecoveryGraph';
import {
  HeartPulse,
  Activity,
  Zap,
  Moon,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  Play,
  RotateCw,
  Clock,
  TrendingUp,
  SlidersHorizontal,
  Flame
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ReadinessScoreCardProps {
  readiness: UserReadinessData;
  scheduledWorkout?: Workout;
  onStartWorkout?: (workout: Workout) => void;
  onRecalibrate?: (offsetDelta: number) => void;
  onQuickPulseCheck?: () => void;
}

export const ReadinessScoreCard: React.FC<ReadinessScoreCardProps> = ({
  readiness,
  scheduledWorkout,
  onStartWorkout,
  onRecalibrate,
  onQuickPulseCheck
}) => {
  const [showGraph, setShowGraph] = useState(false);
  const [showCalibrateMenu, setShowCalibrateMenu] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  // Determine styling based on readiness state
  const isOptimal = readiness.state === 'optimal';
  const isModerate = readiness.state === 'moderate';
  const isLow = readiness.state === 'low';

  const badgeColor = isOptimal
    ? 'text-[var(--accent-bright)] bg-[var(--accent-main)]/15 border-[var(--accent-main)]/40'
    : isModerate
    ? 'text-sky-400 bg-sky-500/15 border-sky-500/40'
    : 'text-amber-400 bg-amber-500/15 border-amber-500/40';

  const glowClass = isOptimal
    ? 'shadow-[0_0_25px_rgba(212,163,75,0.18)]'
    : isModerate
    ? 'shadow-[0_0_25px_rgba(56,189,248,0.15)]'
    : 'shadow-[0_0_25px_rgba(245,158,11,0.15)]';

  // SVG Circular progress math
  const strokeWidth = 8;
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (readiness.score / 100) * circumference;

  const handleStartScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          if (onQuickPulseCheck) onQuickPulseCheck();
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  return (
    <div
      id="readiness-score-card"
      className={`rounded-3xl border border-[#21432f] bg-gradient-to-b from-[#08170f] via-[#05100a] to-[#040906] p-5 sm:p-6 transition-all ${glowClass} relative overflow-hidden`}
    >
      {/* Background Accent Mesh */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-[var(--accent-main)]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Card Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#183624]">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-[#0f2a1b] border border-[#27643e] flex items-center justify-center text-[var(--accent-bright)] shadow-inner">
            <HeartPulse className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold text-[var(--accent-main)] uppercase tracking-wider">
                BIOMETRIC READINESS ENGINE
              </span>
              <span className="text-[10px] text-[#7d9987]">• MORNING CALIBRATION</span>
            </div>
            <h2 className="font-['Cinzel'] text-lg sm:text-xl font-bold text-[#f5ebd7] tracking-wide">
              Pre-Session Readiness Score
            </h2>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <button
            onClick={handleStartScan}
            disabled={isScanning}
            id="btn-quick-hrv-scan"
            title="Perform 10s Autonomic Pulse Check"
            className="px-3 py-1.5 rounded-xl bg-[#0f2619] hover:bg-[#163825] border border-[#204a31] text-[11px] font-bold text-[#e6f4ec] flex items-center space-x-1.5 transition-colors disabled:opacity-50"
          >
            <RotateCw className={`w-3.5 h-3.5 text-[var(--accent-bright)] ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? `Calibrating ${scanProgress}%` : 'Quick HRV Check'}</span>
          </button>

          <button
            onClick={() => setShowCalibrateMenu(!showCalibrateMenu)}
            id="btn-readiness-presets"
            title="Adjust or test readiness scenarios"
            className="p-1.5 rounded-xl bg-[#0f2619] hover:bg-[#163825] border border-[#204a31] text-[#8ea898] hover:text-[#f5ebd7] transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowGraph(!showGraph)}
            id="btn-toggle-hrv-graph"
            className="px-3 py-1.5 rounded-xl bg-[#143322] hover:bg-[#1b442d] border border-[#2a6341] text-[11px] font-bold text-[#86efac] flex items-center space-x-1.5 transition-all shadow-sm"
          >
            <Activity className="w-3.5 h-3.5 text-[var(--accent-bright)]" />
            <span>{showGraph ? 'Hide Graph' : 'HRV & Recovery Graph'}</span>
            {showGraph ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Preset Calibration Popover */}
      {showCalibrateMenu && (
        <div className="p-3 my-3 rounded-2xl bg-[#0a1810] border border-[#224b33] flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="text-[#8da696] font-medium">Test / Calibrate Readiness Scenario:</span>
          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => {
                if (onRecalibrate) onRecalibrate(10);
                setShowCalibrateMenu(false);
              }}
              className="px-2.5 py-1 rounded-lg bg-[var(--accent-main)]/20 border border-[var(--accent-main)]/40 text-[var(--accent-bright)] font-bold text-[11px] hover:bg-[var(--accent-main)]/30"
            >
              Optimal (88%)
            </button>
            <button
              onClick={() => {
                if (onRecalibrate) onRecalibrate(-8);
                setShowCalibrateMenu(false);
              }}
              className="px-2.5 py-1 rounded-lg bg-sky-500/20 border border-sky-500/40 text-sky-300 font-bold text-[11px] hover:bg-sky-500/30"
            >
              Balanced (74%)
            </button>
            <button
              onClick={() => {
                if (onRecalibrate) onRecalibrate(-28);
                setShowCalibrateMenu(false);
              }}
              className="px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-[11px] hover:bg-amber-500/30"
            >
              Fatigued / Rest (56%)
            </button>
          </div>
        </div>
      )}

      {/* Core Readiness Display Row */}
      <div className="relative z-10 py-4 grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        {/* Dial & Score Section */}
        <div className="md:col-span-4 flex items-center space-x-4">
          <div className="relative flex-shrink-0">
            <svg width="104" height="104" className="transform -rotate-90">
              {/* Background Track */}
              <circle
                cx="52"
                cy="52"
                r={radius}
                stroke="#12261b"
                strokeWidth={strokeWidth}
                fill="transparent"
              />
              {/* Animated Value Arc */}
              <circle
                cx="52"
                cy="52"
                r={radius}
                stroke={
                  isOptimal
                    ? 'var(--accent-bright)'
                    : isModerate
                    ? '#38bdf8'
                    : '#f59e0b'
                }
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                style={{
                  transition: 'stroke-dashoffset 1s ease-in-out, stroke 0.5s ease'
                }}
              />
            </svg>

            {/* Center Dial Metric */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl sm:text-3xl font-black text-[#f5ebd7] leading-none">
                {readiness.score}
              </span>
              <span className="text-[10px] uppercase font-bold text-[#7d9987] tracking-wider mt-0.5">
                / 100
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <span
              className={`inline-flex items-center space-x-1.5 text-[11px] font-black uppercase px-2.5 py-1 rounded-full border ${badgeColor}`}
            >
              <Zap className="w-3 h-3 fill-current" />
              <span>{readiness.stateLabel}</span>
            </span>
            <p className="text-xs text-[#9eb6a8] leading-tight">
              {readiness.nervousSystemStatus}
            </p>
            <div className="text-[11px] text-[#708a79] flex items-center space-x-1 pt-0.5">
              <span>Intensity Cap:</span>
              <span className="font-bold text-[#f5ebd7]">{readiness.recommendedIntensity}</span>
            </div>
          </div>
        </div>

        {/* Biometric Tiles */}
        <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {/* Tile 1: HRV (rMSSD) */}
          <div className="p-3 rounded-2xl bg-[#09150d] border border-[#193824] flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#8ea696]">
              <span className="text-[10px] uppercase font-bold tracking-wider">HRV (rMSSD)</span>
              <HeartPulse className="w-3.5 h-3.5 text-[var(--accent-bright)]" />
            </div>
            <div className="mt-1.5">
              <div className="flex items-baseline space-x-1">
                <span className="text-xl font-black text-[#f5ebd7]">{readiness.hrvCurrent}</span>
                <span className="text-[10px] text-[#7d9987] font-semibold">ms</span>
              </div>
              <span className="text-[10px] text-[var(--accent-bright)] font-semibold block">
                {readiness.hrvTrendPercent >= 0 ? `+${readiness.hrvTrendPercent}%` : `${readiness.hrvTrendPercent}%`} vs base ({readiness.hrvBaseline}ms)
              </span>
            </div>
          </div>

          {/* Tile 2: Resting Heart Rate */}
          <div className="p-3 rounded-2xl bg-[#09150d] border border-[#193824] flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#8ea696]">
              <span className="text-[10px] uppercase font-bold tracking-wider">Resting HR</span>
              <Activity className="w-3.5 h-3.5 text-sky-400" />
            </div>
            <div className="mt-1.5">
              <div className="flex items-baseline space-x-1">
                <span className="text-xl font-black text-[#f5ebd7]">{readiness.restingHeartRate}</span>
                <span className="text-[10px] text-[#7d9987] font-semibold">bpm</span>
              </div>
              <span className="text-[10px] text-sky-400 font-semibold block">
                {readiness.restingHeartRate <= readiness.rhrBaseline ? 'Optimal Low RHR' : 'Slightly Elevated'}
              </span>
            </div>
          </div>

          {/* Tile 3: Sleep Restoration */}
          <div className="p-3 rounded-2xl bg-[#09150d] border border-[#193824] flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#8ea696]">
              <span className="text-[10px] uppercase font-bold tracking-wider">Sleep</span>
              <Moon className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <div className="mt-1.5">
              <div className="flex items-baseline space-x-1">
                <span className="text-xl font-black text-[#f5ebd7]">{readiness.sleepHours}</span>
                <span className="text-[10px] text-[#7d9987] font-semibold">hrs</span>
              </div>
              <span className="text-[10px] text-purple-300 font-semibold block">
                {readiness.sleepQualityPercent}% Restored
              </span>
            </div>
          </div>

          {/* Tile 4: Recovery Index */}
          <div className="p-3 rounded-2xl bg-[#09150d] border border-[#193824] flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#8ea696]">
              <span className="text-[10px] uppercase font-bold tracking-wider">Recovery</span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="mt-1.5">
              <div className="flex items-baseline space-x-1">
                <span className="text-xl font-black text-emerald-400">{readiness.recoveryPercent}</span>
                <span className="text-[10px] text-[#7d9987] font-semibold">%</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-semibold block">
                {readiness.recoveryPercent >= 80 ? 'Vagal Tone High' : 'Adaptive Phase'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Pre-Session Briefing & Tactical Guidance */}
      <div className="relative z-10 pt-3 border-t border-[#173823] space-y-3">
        <div className="p-3.5 rounded-2xl bg-[#0b1c12] border border-[#1e472c] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-3.5 h-3.5 text-[var(--accent-bright)]" />
              <span className="text-[10px] uppercase font-bold text-[#86efac] tracking-wider">
                TACTICAL COACH ASSESSMENT FOR NEXT SESSION
              </span>
            </div>
            <p className="text-xs text-[#d1e0d7] leading-relaxed">
              {readiness.trainingRecommendation}
            </p>
          </div>

          {/* If scheduled workout exists, offer direct start with readiness stamp */}
          {scheduledWorkout && onStartWorkout && (
            <div className="flex-shrink-0 self-start sm:self-auto">
              <button
                onClick={() => onStartWorkout(scheduledWorkout)}
                id="btn-readiness-start-session"
                className={`px-4 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center space-x-2 transition-all shadow-md ${
                  isLow
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                    : 'bg-gradient-to-r from-[var(--accent-main)] via-[var(--accent-bright)] to-[var(--accent-main)] text-[#07130c] hover:scale-[1.02] active:scale-95'
                }`}
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>
                  {isLow ? 'Scale & Start Session' : `Launch ${scheduledWorkout.title.split(' ')[0]}`}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Expandable HRV & Recovery Graph */}
      <AnimatePresence>
        {showGraph && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="pt-4 border-t border-[#1a3d28] overflow-hidden"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#f5ebd7] flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-[var(--accent-bright)]" />
                  <span>AUTONOMIC HRV & RECOVERY CURVE (D3 / RECHARTS)</span>
                </span>
                <span className="text-[10px] text-[#7d9987]">
                  rMSSD Normalized Against 30-Day Baselines
                </span>
              </div>
              <HRVRecoveryGraph readiness={readiness} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
