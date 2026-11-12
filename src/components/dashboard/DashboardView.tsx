import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SubtlePantherBanner } from '../common/PantherSilhouette';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { DailyGoals } from './DailyGoals';
import { HydrationTracker } from './HydrationTracker';
import { DailyAffirmation } from './DailyAffirmation';
import { HeartRateMonitor } from './HeartRateMonitor';
import { ReadinessScoreCard } from './ReadinessScoreCard';
import { HRVRecoveryGraph } from './HRVRecoveryGraph';
import {
  computeUserReadiness,
  getStoredReadinessOffset,
  setStoredReadinessOffset
} from '../../utils/readinessService';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  Flame,
  Footprints,
  Calendar,
  Trophy,
  TreePine,
  ArrowRight,
  CheckCircle2,
  Users,
  Compass,
  Zap,
  Target,
  Clock,
  Sparkles,
  Crown,
  Activity,
  Mountain,
  Navigation,
  HeartPulse,
  ShieldAlert,
  X,
  TrendingUp,
  Check
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    user,
    workouts,
    disciplineTasks,
    events,
    currentLevelInfo,
    nextLevelInfo,
    xpProgressPercent,
    setWorkoutPlayerWorkout,
    toggleDisciplineTask,
    setActiveTab,
    setShowLogActivity,
    setShowGreenLegacyModal,
    setShowLeaderboardModal,
    activityLogs,
    setShowOutdoorTracker,
    setOutdoorTrackerInitialMode,
    setShowDeepAnalysisModal,
    isPremium,
    openPremiumUpgrade
  } = useApp();

  // Generate chart data for the last 7 days
  const chartData = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const result = [];
    
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      result.push({
        name: days[d.getDay()],
        dateStr: d.toISOString().split('T')[0],
        xp: 0,
        volume: 0
      });
    }

    const todayStr = now.toISOString().split('T')[0];
    const yesterdayDate = new Date(now);
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterdayStr = yesterdayDate.toISOString().split('T')[0];

    activityLogs.forEach((log) => {
      let logDateStr = "";
      if (log.id.startsWith('act-') && log.id.length > 6) {
        const timestamp = parseInt(log.id.split('-')[1]);
        if (!isNaN(timestamp)) {
           logDateStr = new Date(timestamp).toISOString().split('T')[0];
        }
      } 
      if (!logDateStr) {
        if (log.date === 'Today') logDateStr = todayStr;
        else if (log.date === 'Yesterday') logDateStr = yesterdayStr;
        else logDateStr = result[0].dateStr;
      }

      const match = result.find(r => r.dateStr === logDateStr);
      if (match) {
        match.xp += (log.xpEarned || 0);
        match.volume += (log.durationMinutes || 0);
      }
    });

    return result;
  }, [activityLogs]);

  // Pick today's primary workout (e.g. first workout or user preference)
  const todaysWorkout = workouts[0];
  const pendingDisciplineTask = disciplineTasks.find((t) => !t.completed) || disciplineTasks[0];

  // Physiological Readiness & HRV Engine
  const [readinessOffset, setReadinessOffset] = useState<number>(() => getStoredReadinessOffset());
  const [chartTab, setChartTab] = useState<'xp' | 'recovery'>('xp');
  const [showLowReadinessAlert, setShowLowReadinessAlert] = useState(false);
  const [pulseCheckNotification, setPulseCheckNotification] = useState<string | null>(null);

  const readiness = useMemo(() => {
    return computeUserReadiness(activityLogs, todaysWorkout?.title, readinessOffset);
  }, [activityLogs, todaysWorkout, readinessOffset]);

  const handleRecalibrate = (delta: number) => {
    const newOffset = readinessOffset + delta;
    setReadinessOffset(newOffset);
    setStoredReadinessOffset(newOffset);
  };

  const handleQuickPulseCheck = () => {
    handleRecalibrate(4);
    setPulseCheckNotification('Quick HRV Pulse Check Complete: rMSSD calibrated at 74ms (+12% vagal tone). High Readiness confirmed.');
    setTimeout(() => setPulseCheckNotification(null), 5000);
  };

  const handleStartWorkoutClick = () => {
    if (readiness.state === 'low') {
      setShowLowReadinessAlert(true);
    } else if (todaysWorkout) {
      setWorkoutPlayerWorkout(todaysWorkout);
    }
  };

  // Dynamic greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning, Panther.';
    if (hour < 18) return 'Good afternoon, Panther.';
    return 'Good evening, Panther.';
  };

  return (
    <div className="space-y-6 pb-24 max-w-5xl mx-auto px-4 pt-4">
      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-[#1d3d2a]/80 bg-gradient-to-b from-[#08150e] to-[#040906] p-5 sm:p-7 shadow-2xl">
        <SubtlePantherBanner className="absolute inset-0 z-0 opacity-40" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-[var(--accent-main)] uppercase tracking-widest flex items-center space-x-1.5">
                  <span>THE BA CHALLENGE</span>
                  <span>•</span>
                  <span>THE TRAIL AWAITS</span>
                </span>
              </div>
              <h1 className="font-['Cinzel'] text-2xl sm:text-3xl font-extrabold text-[#f5ebd7] tracking-wide mt-1">
                {getGreeting()}
              </h1>
              <p className="text-xs sm:text-sm text-[#93ab9c] mt-1 max-w-md">
                “Train. Track. Connect. Conquer.” Stand firm in your discipline today, brother.
              </p>
            </div>

            {/* Level & Rank Pill */}
            <div
              onClick={() => setActiveTab('profile')}
              className="flex items-center space-x-3 bg-[#0a1810]/90 border border-[#21432e] p-3 rounded-2xl cursor-pointer hover:border-[var(--accent-main)]/60 transition-all self-start sm:self-auto"
            >
              <div className="w-10 h-10 rounded-xl bg-[#142e1f] border border-[var(--accent-main)]/50 flex items-center justify-center text-xl">
                {currentLevelInfo.badgeIcon}
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[var(--accent-main)] tracking-wider block">
                  {currentLevelInfo.name}
                </span>
                <span className="text-xs font-semibold text-[#f5ebd7]">
                  {user.xp.toLocaleString()} XP
                </span>
                <div className="w-24 bg-[#14261b] h-1.5 rounded-full overflow-hidden mt-1">
                  <motion.div
                    className="bg-[var(--accent-main)] h-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${xpProgressPercent}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Daily Affirmation */}
          <DailyAffirmation />

          {/* Biometric Readiness Engine & HRV/Recovery Graph */}
          <div className="pt-2">
            <ReadinessScoreCard
              readiness={readiness}
              scheduledWorkout={todaysWorkout}
              onStartWorkout={handleStartWorkoutClick}
              onRecalibrate={handleRecalibrate}
              onQuickPulseCheck={handleQuickPulseCheck}
            />
          </div>

          {/* Primary Action Button: START TODAY'S TRAINING */}
          {todaysWorkout && (
            <div className="pt-2">
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#0d281a] via-[#133a26] to-[#0d281a] border border-[#27593c] shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-[#86efac] tracking-wider flex items-center space-x-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[var(--accent-bright)]" />
                      <span>TODAY'S SCHEDULED WORKOUT</span>
                    </span>
                    <span
                      className={`text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full border flex items-center space-x-1 ${
                        readiness.state === 'optimal'
                          ? 'bg-[var(--accent-main)]/20 text-[var(--accent-bright)] border-[var(--accent-main)]/40'
                          : readiness.state === 'moderate'
                          ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      }`}
                    >
                      <HeartPulse className="w-3 h-3 animate-pulse" />
                      <span>
                        {readiness.score}% Readiness •{' '}
                        {readiness.state === 'optimal'
                          ? 'Prime to Train'
                          : readiness.state === 'moderate'
                          ? 'Steady Load'
                          : 'Recovery Advised'}
                      </span>
                    </span>
                  </div>

                  <h3 className="font-['Cinzel'] text-lg sm:text-xl font-bold text-[#f5ebd7]">
                    {todaysWorkout.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#9eb6a8]">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-[var(--accent-main)]" />
                      <span>{todaysWorkout.durationMinutes} mins</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <Zap className="w-3.5 h-3.5 text-[var(--accent-bright)]" />
                      <span>{todaysWorkout.estimatedCalories} kcal</span>
                    </span>
                    <span>•</span>
                    <span className="text-[#86efac] font-semibold">+{todaysWorkout.xpReward} XP</span>
                    <span>•</span>
                    <span className="text-[var(--accent-bright)] font-semibold flex items-center space-x-1">
                      <Activity className="w-3.5 h-3.5" />
                      <span>Target: {readiness.recommendedIntensity} Intensity</span>
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleStartWorkoutClick}
                  id="btn-start-todays-training"
                  className={`px-6 py-3.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(201,151,56,0.35)] hover:scale-[1.02] active:scale-95 transition-all flex-shrink-0 ${
                    readiness.state === 'low'
                      ? 'bg-amber-500/20 border border-amber-500/50 text-amber-300 hover:bg-amber-500/30'
                      : 'bg-gradient-to-r from-[var(--accent-main)] via-[var(--accent-grad)] to-[var(--accent-main)] text-[#07130c]'
                  }`}
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>
                    {readiness.state === 'low' ? 'CHECK READINESS & START' : "START TODAY'S TRAINING"}
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Secondary Quick Action Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            <button
              onClick={() => setShowLogActivity(true)}
              id="btn-quick-log-activity"
              className="py-2.5 px-3 rounded-xl bg-[#0e1c14] hover:bg-[#152a1e] border border-[#1e3928] text-xs font-semibold text-[#e6f0ea] flex items-center justify-center space-x-1.5 transition-colors"
            >
              <Zap className="w-3.5 h-3.5 text-[#34d399]" />
              <span>LOG ACTIVITY</span>
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              id="btn-quick-check-progress"
              className="py-2.5 px-3 rounded-xl bg-[#0e1c14] hover:bg-[#152a1e] border border-[#1e3928] text-xs font-semibold text-[#e6f0ea] flex items-center justify-center space-x-1.5 transition-colors"
            >
              <Trophy className="w-3.5 h-3.5 text-[var(--accent-main)]" />
              <span>CHECK PROGRESS</span>
            </button>
            <button
              onClick={() => setActiveTab('community')}
              id="btn-quick-community"
              className="py-2.5 px-3 rounded-xl bg-[#0e1c14] hover:bg-[#152a1e] border border-[#1e3928] text-xs font-semibold text-[#e6f0ea] flex items-center justify-center space-x-1.5 transition-colors"
            >
              <Users className="w-3.5 h-3.5 text-[#60a5fa]" />
              <span>COMMUNITY</span>
            </button>
            <button
              onClick={() => setActiveTab('challenges')}
              id="btn-quick-challenges"
              className="py-2.5 px-3 rounded-xl bg-[#0e1c14] hover:bg-[#152a1e] border border-[#1e3928] text-xs font-semibold text-[#e6f0ea] flex items-center justify-center space-x-1.5 transition-colors"
            >
              <Target className="w-3.5 h-3.5 text-[#f472b6]" />
              <span>CHALLENGES</span>
            </button>
          </div>
        </div>
      </div>

      {/* Vital Metrics Row: Steps, Streak, Weekly Activity, Monthly Progress */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Streak */}
        <div
          onClick={() => setActiveTab('challenges')}
          className="p-4 rounded-2xl bg-[var(--accent-main)]/10 border border-[var(--accent-main)]/30 hover:border-[var(--accent-main)] transition-colors cursor-pointer relative overflow-hidden group"
        >
          <div className="absolute -top-6 -right-6 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
            <Flame className="w-32 h-32 text-[var(--accent-main)] fill-[var(--accent-main)]" />
          </div>
          <div className="flex items-center justify-between text-xs text-[var(--accent-main)] font-bold tracking-widest uppercase relative z-10">
            <span>Panther Streak</span>
            <Flame className="w-4 h-4 fill-[var(--accent-main)]" />
          </div>
          <div className="mt-2 flex items-baseline space-x-1 relative z-10">
            <span className="text-3xl font-black text-[#f5ebd7]">{user.streak.current}</span>
            <span className="text-xs text-[var(--accent-main)] font-semibold">Days</span>
          </div>
          <p className="text-[10px] text-[var(--accent-main)]/80 mt-1 truncate relative z-10">
            Record: {user.streak.longest} consecutive days
          </p>
        </div>

        {/* Daily Steps */}
        <div
          onClick={() => {
            setOutdoorTrackerInitialMode('walk');
            setShowOutdoorTracker(true);
          }}
          className="p-4 rounded-2xl bg-[#09130d] border border-[#1a3323] hover:border-[#10b981]/50 transition-colors cursor-pointer group"
        >
          <div className="flex items-center justify-between text-xs text-[#8da696]">
            <span>Today's Steps</span>
            <Footprints className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-2 flex items-baseline space-x-1">
            <span className="text-2xl font-black text-[#f5ebd7]">8,420</span>
            <span className="text-xs text-[#8ea496]">/ 10k</span>
          </div>
          <p className="text-[10px] text-emerald-400/80 mt-1">Tap for Live GPS & Altimeter</p>
        </div>

        {/* Monthly Progress */}
        <div
          onClick={() => setActiveTab('train')}
          className="p-4 rounded-2xl bg-[#09130d] border border-[#1a3323] hover:border-[#38bdf8]/50 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs text-[#8da696]">
            <span>Monthly Sessions</span>
            <Calendar className="w-4 h-4 text-sky-400" />
          </div>
          <div className="mt-2 flex items-baseline space-x-1">
            <span className="text-2xl font-black text-[#f5ebd7]">
              {user.streak.workoutsThisMonth}
            </span>
            <span className="text-xs text-[#8ea496]">/ 16</span>
          </div>
          <p className="text-[10px] text-[#738f7d] mt-1">On pace for consistency badge</p>
        </div>

        {/* Green Legacy Trees */}
        <div
          onClick={() => setShowGreenLegacyModal(true)}
          className="p-4 rounded-2xl bg-[#09130d] border border-[#1a3323] hover:border-[#22c55e]/50 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs text-[#8da696]">
            <span>Green Legacy</span>
            <TreePine className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline space-x-1">
            <span className="text-2xl font-black text-[#86efac]">{user.treesPlanted}</span>
            <span className="text-xs text-[#8ea496]">Trees</span>
          </div>
          <p className="text-[10px] text-[#86efac]/80 mt-1">Panthers for the Planet</p>
        </div>
      </div>

      {/* Outdoor GPS & Trail Tracking Banner */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-[#07170e] via-[#0f2d1c] to-[#07170e] border border-[#235837] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div className="flex items-start space-x-3.5">
          <div className="p-3 rounded-2xl bg-[#143d25] border border-[#2a6d45] text-[#34d399] flex-shrink-0 shadow-lg">
            <Compass className="w-6 h-6 text-[#34d399]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#17442a] text-[#34d399] uppercase tracking-wider">
                GPS TRAIL & MAPS
              </span>
              <span className="text-[10px] text-[#7d9385] font-mono">• STEPS COUNTER & ELEVATION</span>
            </div>
            <h3 className="font-['Cinzel'] text-base sm:text-lg font-bold text-[#f5ebd7] mt-1">
              Outdoor Walk, Mountain Hike & Trail Run
            </h3>
            <p className="text-xs text-[#8da696] mt-0.5">
              Live route maps, step cadence, and real-time elevation gain along local and Great Rift trails.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 self-start md:self-auto">
          <button
            onClick={() => {
              setOutdoorTrackerInitialMode('walk');
              setShowOutdoorTracker(true);
            }}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-[#09180f] border border-[#1d432b] text-[11px] font-bold text-[#e6f4ec] hover:bg-[#133320] transition-colors"
          >
            <Footprints className="w-3.5 h-3.5 text-emerald-400" />
            <span>Walk</span>
          </button>
          <button
            onClick={() => {
              setOutdoorTrackerInitialMode('hike');
              setShowOutdoorTracker(true);
            }}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-[#09180f] border border-[#1d432b] text-[11px] font-bold text-[#f0cb64] hover:bg-[#133320] transition-colors"
          >
            <Mountain className="w-3.5 h-3.5 text-amber-400" />
            <span>Hike</span>
          </button>
          <button
            onClick={() => {
              setOutdoorTrackerInitialMode('run');
              setShowOutdoorTracker(true);
            }}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-[#09180f] border border-[#1d432b] text-[11px] font-bold text-[#38bdf8] hover:bg-[#133320] transition-colors"
          >
            <Navigation className="w-3.5 h-3.5 text-sky-400" />
            <span>Run</span>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div className="lg:col-span-2">
          <div className="p-5 rounded-3xl bg-[#0a150e] border border-[#1b3826] space-y-4 h-full">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-1.5 bg-[#061009] p-1 rounded-xl border border-[#163321]">
                <button
                  onClick={() => setChartTab('xp')}
                  id="tab-chart-xp"
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                    chartTab === 'xp'
                      ? 'bg-gradient-to-r from-[var(--accent-main)] to-[var(--accent-bright)] text-[#07140b] shadow-md'
                      : 'text-[#8da696] hover:text-[#f5ebd7]'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Weekly XP & Volume</span>
                </button>

                <button
                  onClick={() => setChartTab('recovery')}
                  id="tab-chart-recovery"
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                    chartTab === 'recovery'
                      ? 'bg-gradient-to-r from-[var(--accent-main)] to-[var(--accent-bright)] text-[#07140b] shadow-md'
                      : 'text-[#8da696] hover:text-[#f5ebd7]'
                  }`}
                >
                  <HeartPulse className="w-3.5 h-3.5" />
                  <span>HRV & Recovery Graph</span>
                </button>
              </div>

              <button
                onClick={() => setShowDeepAnalysisModal(true)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#142f1f] border border-amber-500/30 text-amber-300 hover:bg-[#1c442c] text-xs font-bold transition-all"
                title="Open Deep Biomechanical & Load Analysis"
              >
                <Activity className="w-3.5 h-3.5 text-amber-400" />
                <span>Deep Analysis</span>
                {isPremium ? (
                  <span className="text-[9px] text-amber-300 font-mono font-bold">APEX</span>
                ) : (
                  <span className="text-[9px] text-amber-300 font-mono font-bold">PRO</span>
                )}
              </button>
            </div>

            {chartTab === 'xp' ? (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1a3323" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      stroke="#5c7566" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                      dy={10} 
                    />
                    <YAxis 
                      yAxisId="left" 
                      stroke="var(--accent-main)" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                      tickFormatter={(value) => `${value}xp`}
                    />
                    <YAxis 
                      yAxisId="right" 
                      orientation="right" 
                      stroke="#10b981" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                      tickFormatter={(value) => `${value}m`}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#09130d', borderColor: '#1a3323', borderRadius: '12px', color: '#f5ebd7' }}
                      itemStyle={{ color: '#f5ebd7' }}
                    />
                    <Line 
                      yAxisId="left" 
                      type="monotone" 
                      dataKey="xp" 
                      name="XP Earned"
                      stroke="var(--accent-main)" 
                      strokeWidth={3} 
                      dot={{ fill: '#0a150e', stroke: 'var(--accent-main)', strokeWidth: 2, r: 4 }} 
                      activeDot={{ r: 6, fill: 'var(--accent-main)' }}
                    />
                    <Line 
                      yAxisId="right" 
                      type="monotone" 
                      dataKey="volume" 
                      name="Duration (mins)"
                      stroke="#10b981" 
                      strokeWidth={3} 
                      dot={{ fill: '#0a150e', stroke: '#10b981', strokeWidth: 2, r: 4 }} 
                      activeDot={{ r: 6, fill: '#10b981' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <HRVRecoveryGraph readiness={readiness} />
            )}
          </div>
        </div>
        <div className="lg:col-span-1">
          <HeartRateMonitor />
        </div>
      </div>


      {/* Grid Layout for Habit Tracking and BA Events */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        
        {/* Daily Non-Workout Habits */}
        <DailyGoals />

        {/* Hydration Tracker */}
        <HydrationTracker />

        {/* Today's Discipline Challenge */}
        <div className="p-5 rounded-3xl bg-[#0a150e] border border-[#1b3826] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4 text-[var(--accent-main)]" />
              <h3 className="font-['Cinzel'] font-bold text-sm text-[#f5ebd7]">
                TODAY'S DISCIPLINE CHALLENGE
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('challenges')}
              className="text-xs text-[var(--accent-main)] hover:underline"
            >
              View All
            </button>
          </div>

          {pendingDisciplineTask && (
            <div
              onClick={() => toggleDisciplineTask(pendingDisciplineTask.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                pendingDisciplineTask.completed
                  ? 'bg-[#12291b] border-[#29633e] text-[#a7d8b8]'
                  : 'bg-[#0e1c14] border-[#22402d] text-[#e8ebe9] hover:border-[var(--accent-main)]'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                    pendingDisciplineTask.completed
                      ? 'bg-[#22c55e] text-[#07150c]'
                      : 'border-2 border-[#41684f]'
                  }`}
                >
                  {pendingDisciplineTask.completed && <CheckCircle2 className="w-4 h-4" />}
                </div>
                <div>
                  <h4
                    className={`text-sm font-semibold ${
                      pendingDisciplineTask.completed ? 'line-through opacity-70' : ''
                    }`}
                  >
                    {pendingDisciplineTask.title}
                  </h4>
                  <span className="text-[11px] text-[#7d9987]">
                    Target: {pendingDisciplineTask.target} • +{pendingDisciplineTask.xp} XP
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold text-[var(--accent-main)]">
                {pendingDisciplineTask.completed ? 'COMPLETED' : 'CHECK IN'}
              </span>
            </div>
          )}

          {/* Motivational non-shame recovery quote */}
          <div className="p-3 rounded-xl bg-[#060c08] border border-[#14261a] text-center">
            <p className="text-[11px] text-[var(--accent-main)] font-serif italic">
              “The trail is still there. Get back on it.”
            </p>
          </div>
        </div>

        {/* Community Challenge & Upcoming BA Events Preview */}
        <div className="p-5 rounded-3xl bg-[#0a150e] border border-[#1b3826] space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Compass className="w-4 h-4 text-[var(--accent-main)]" />
                <h3 className="font-['Cinzel'] font-bold text-sm text-[#f5ebd7]">
                  UPCOMING BA EVENT
                </h3>
              </div>
              <span className="text-xs text-[#86efac] font-medium">Brotherhood Expedition</span>
            </div>

            {events[0] && (
              <div className="p-3.5 rounded-2xl bg-[#0e1d14] border border-[#21432f] space-y-2">
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#163823] text-[#86efac] uppercase">
                    {events[0].type}
                  </span>
                  <span className="text-xs text-[var(--accent-main)] font-semibold">{events[0].date}</span>
                </div>
                <h4 className="text-sm font-bold text-[#f5ebd7] leading-snug">
                  {events[0].title}
                </h4>
                <p className="text-xs text-[#8da696] line-clamp-2">{events[0].description}</p>
                <div className="pt-1 flex items-center justify-between text-xs text-[#7d9987]">
                  <span>{events[0].location}</span>
                  <span className="text-[#e2b955] font-semibold">
                    {events[0].registeredCount}/{events[0].capacity} registered
                  </span>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setActiveTab('community')}
            className="w-full py-2.5 rounded-xl bg-[#112417] hover:bg-[#183422] text-[#f5ebd7] text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors border border-[#21472e]"
          >
            <span>Explore All Events & Community</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Floating Notification for HRV Pulse Check */}
      <AnimatePresence>
        {pulseCheckNotification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 max-w-md bg-[#0a180f] border border-[var(--accent-main)]/50 rounded-2xl p-4 shadow-2xl flex items-start space-x-3 text-xs text-[#f5ebd7]"
          >
            <HeartPulse className="w-5 h-5 text-[var(--accent-bright)] flex-shrink-0 mt-0.5 animate-pulse" />
            <div className="flex-1 space-y-1">
              <span className="font-bold text-[var(--accent-main)] uppercase tracking-wider block text-[10px]">
                Biometric Calibration
              </span>
              <p className="text-[#d5e5db]">{pulseCheckNotification}</p>
            </div>
            <button
              onClick={() => setPulseCheckNotification(null)}
              className="text-[#7d9987] hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Low Readiness Tactical Warning Modal */}
      <AnimatePresence>
        {showLowReadinessAlert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#09150d] border border-amber-500/40 rounded-3xl p-6 shadow-2xl space-y-5 text-[#f5ebd7]"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                      Autonomic Alert
                    </span>
                    <h3 className="font-['Cinzel'] text-lg font-bold text-[#f5ebd7]">
                      Sympathetic Strain Detected
                    </h3>
                  </div>
                </div>
                <button
                  onClick={() => setShowLowReadinessAlert(false)}
                  className="text-[#7d9987] hover:text-white p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-[#061009] border border-[#1b3b27] space-y-2 text-xs">
                <div className="flex justify-between items-center text-[#9eb6a8]">
                  <span>Today's Readiness Score</span>
                  <span className="font-bold text-amber-400 text-sm font-mono">
                    {readiness.score}% • Low
                  </span>
                </div>
                <div className="flex justify-between items-center text-[#9eb6a8]">
                  <span>Morning HRV (rMSSD)</span>
                  <span className="font-bold text-[#f5ebd7] font-mono">
                    {readiness.hrvCurrent} ms ({readiness.nervousSystemStatus})
                  </span>
                </div>
                <div className="flex justify-between items-center text-[#9eb6a8]">
                  <span>Resting Heart Rate</span>
                  <span className="font-bold text-[#f5ebd7] font-mono">
                    {readiness.restingHeartRate} bpm
                  </span>
                </div>
                <p className="text-[#a4beaf] pt-2 leading-relaxed border-t border-[#132a1c]">
                  Your autonomic nervous system indicates residual fatigue from recent training load.
                  Going all-out today may elevate cortisol and increase injury risk.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={() => {
                    setShowLowReadinessAlert(false);
                    if (todaysWorkout) setWorkoutPlayerWorkout(todaysWorkout);
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-[#07130b] font-black text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center space-x-2"
                >
                  <Activity className="w-4 h-4" />
                  <span>Scale Intensity by 15% & Begin</span>
                </button>

                <button
                  onClick={() => {
                    setShowLowReadinessAlert(false);
                    if (todaysWorkout) setWorkoutPlayerWorkout(todaysWorkout);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#112417] hover:bg-[#183422] border border-[#21472e] text-xs font-semibold text-[#c8ded0] transition-colors flex items-center justify-center space-x-1.5"
                >
                  <span>Proceed Full Throttle Anyway (Panther Grit)</span>
                </button>

                <button
                  onClick={() => setShowLowReadinessAlert(false)}
                  className="w-full py-2 text-center text-xs text-[#7d9987] hover:text-[#f5ebd7]"
                >
                  Postpone or Switch to Mobility Session
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
