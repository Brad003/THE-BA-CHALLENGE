import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Workout, ExerciseCategory } from '../../types';
import { PreWorkoutPrepModal } from './PreWorkoutPrepModal';
import { WorkoutJourneyMap } from './WorkoutJourneyMap';
import { GeminiTrainingTips } from './GeminiTrainingTips';
import { WorkoutTrendsChart } from './WorkoutTrendsChart';
import {
  Dumbbell,
  Flame,
  Clock,
  Compass,
  Zap,
  Play,
  Filter,
  CheckCircle2,
  Calendar,
  Layers,
  ChevronRight,
  Activity,
  Crown,
  Footprints,
  Mountain,
  Navigation,
  Film
} from 'lucide-react';

export const TrainingView: React.FC = () => {
  const {
    workouts,
    exercises,
    setWorkoutPlayerWorkout,
    trainingPlans,
    setShowTrainingPlansModal,
    setShowBuildWorkoutModal,
    setShowOutdoorTracker,
    setOutdoorTrackerInitialMode,
    setShowDeepAnalysisModal,
    isPremium,
    openPremiumUpgrade,
    openFormAnalysis
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<ExerciseCategory | 'All'>('All');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('All');
  const [prepWorkout, setPrepWorkout] = useState<Workout | null>(null);

  // Filter workouts based on category
  const filteredWorkouts = workouts.filter((w) => {
    if (selectedCategory !== 'All' && w.category !== selectedCategory) return false;
    if (selectedSubcategory !== 'All' && w.subcategory !== selectedSubcategory) return false;
    return true;
  });

  const categories: (ExerciseCategory | 'All')[] = ['All', 'Bodyweight', 'Strength', 'Cardio', 'Mobility'];

  // Current active enrolled plan
  const activePlan = trainingPlans.find((p) => p.isEnrolled) || trainingPlans[0];

  return (
    <div className="space-y-6 pb-24 max-w-5xl mx-auto px-4 pt-4 text-[#f4f1ea]">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <span className="text-[10px] font-bold text-[var(--accent-main)] uppercase tracking-widest">
            THE BA CHALLENGE TRAINING SYSTEM
          </span>
          <h1 className="font-['Cinzel'] text-2xl sm:text-3xl font-extrabold text-[#f5ebd7] tracking-wide mt-1">
            Workout Library & Regimens
          </h1>
          <p className="text-xs text-[#8da696] mt-1">
            Master your mass with bodyweight armor or lift heavy iron. Zero excuses.
          </p>
        </div>

        
        <div className="flex items-center space-x-2 self-start sm:self-auto overflow-x-auto pb-1 sm:pb-0">
          {/* AI Video Form Biomechanics Lab */}
          <button
            id="training-view-ai-form-check-button"
            onClick={() => openFormAnalysis({ name: 'Barbell Back Squat', category: 'Strength', targetMuscles: ['Quadriceps', 'Glutes', 'Core'] })}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#1b432a] to-[#0f2e1c] border border-[#2e7447] text-xs font-bold text-[#e6f4ec] hover:border-[var(--accent-main)] hover:shadow-[0_0_20px_rgba(52,211,153,0.3)] transition-all whitespace-nowrap flex-shrink-0"
          >
            <Film className="w-4 h-4 text-[var(--accent-main)]" />
            <span>AI FORM CHECK</span>
            <span className="text-[9px] bg-[var(--accent-main)]/20 text-[var(--accent-main)] px-1.5 py-0.5 rounded font-mono font-bold">VIDEO</span>
          </button>

          {/* Deep Workout Analysis (Apex) */}
          <button
            onClick={() => setShowDeepAnalysisModal(true)}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#173022] to-[#12241a] border border-amber-500/40 text-xs font-bold text-amber-300 hover:border-amber-400 hover:shadow-[0_0_20px_rgba(251,191,36,0.25)] transition-all whitespace-nowrap flex-shrink-0"
          >
            <Activity className="w-4 h-4 text-amber-400" />
            <span>DEEP ANALYSIS</span>
            {isPremium ? (
              <span className="text-[9px] bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded font-black font-mono">APEX</span>
            ) : (
              <span className="text-[9px] bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded font-black font-mono">PRO</span>
            )}
          </button>

          {/* Outdoor GPS Trail & Tracking Button */}
          <button
            onClick={() => {
              setOutdoorTrackerInitialMode('walk');
              setShowOutdoorTracker(true);
            }}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#0e2c1b] to-[#144229] border border-[#2b6d46] text-xs font-bold text-[#34d399] hover:border-[#34d399] hover:shadow-[0_0_20px_rgba(52,211,153,0.3)] transition-all whitespace-nowrap flex-shrink-0"
          >
            <Compass className="w-4 h-4 text-[#34d399]" />
            <span>WALK • HIKE • RUN</span>
          </button>

          {/* Build My Own Button */}
          <button
            onClick={() => setShowBuildWorkoutModal(true)}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#0a140e] border border-[var(--accent-main)]/50 text-xs font-bold text-[var(--accent-main)] hover:bg-[#122418] transition-colors whitespace-nowrap flex-shrink-0"
          >
            <Dumbbell className="w-4 h-4" />
            <span>BUILD MY OWN</span>
          </button>
          
          {/* Adaptive Training Plans Button */}
          <button
            onClick={() => setShowTrainingPlansModal(true)}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#12281a] border border-[#235335] text-xs font-bold text-[#86efac] hover:bg-[#183925] transition-colors whitespace-nowrap flex-shrink-0"
          >
            <Calendar className="w-4 h-4 text-[var(--accent-main)]" />
            <span>TRAINING PLANS</span>
          </button>
        </div>
      </div>

      {/* Outdoor GPS & Trail Tracking Banner */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-[#07170e] via-[#0f2d1c] to-[#07170e] border border-[#235837] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div className="p-3 rounded-2xl bg-[#143d25] border border-[#2a6d45] text-[#34d399] flex-shrink-0 shadow-lg">
            <Compass className="w-6 h-6 text-[#34d399]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#17442a] text-[#34d399] uppercase tracking-wider">
                GPS TRAIL & MAPS
              </span>
              <span className="text-[10px] text-[#7d9385] font-mono">• ALTIMETER & STEPS</span>
            </div>
            <h3 className="font-['Cinzel'] text-base sm:text-lg font-bold text-[#f5ebd7] mt-1">
              Outdoor Walk, Mountain Hike & Trail Run
            </h3>
            <p className="text-xs text-[#8da696] mt-0.5">
              Track live GPS routes, measure elevation gain (+m), step count, cadence, and pace along Great Rift Valley & local trails.
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
          <button
            onClick={() => {
              setOutdoorTrackerInitialMode('walk');
              setShowOutdoorTracker(true);
            }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#10b981] to-[#059669] text-[#051108] text-xs font-black uppercase tracking-wider shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:scale-105 transition-all"
          >
            Track GPS
          </button>
        </div>
      </div>

      {/* Panther Apex Tier Feature Spotlight (3D Maps & Deep Biomechanical Analysis) */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-[#0d1c12] via-[#14291c] to-[#0a170f] border border-amber-500/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3.5">
          <div className="p-3 rounded-2xl bg-[#1d3d28] border border-amber-500/40 text-amber-400 flex-shrink-0 shadow-lg">
            <Crown className="w-6 h-6 text-amber-400 fill-amber-400/20" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">
                PANTHER APEX MEMBERSHIP
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/30">
                {isPremium ? 'ACTIVE' : 'PREMIUM TIER'}
              </span>
            </div>
            <h3 className="font-['Cinzel'] text-base sm:text-lg font-bold text-[#f5ebd7] mt-1">
              Photorealistic 3D Maps & Deep Workout Analysis
            </h3>
            <p className="text-xs text-[#8da696] mt-0.5">
              Explore 3D mountain flight paths, acute-to-chronic workload ratios (ACWR), and biomechanical muscle load distribution.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 self-start md:self-auto">
          <button
            onClick={() => setShowDeepAnalysisModal(true)}
            className="px-4 py-2 rounded-xl bg-[#143d25] border border-amber-500/40 text-amber-300 hover:bg-[#1a4f30] text-xs font-bold transition-all shadow-md"
          >
            Deep Analysis
          </button>
          {!isPremium && (
            <button
              onClick={() => openPremiumUpgrade('Panther Apex All-Access')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-black text-xs font-black uppercase tracking-wider shadow-[0_0_15px_rgba(251,191,36,0.3)] hover:scale-105 transition-all"
            >
              Upgrade to Apex
            </button>
          )}
        </div>
      </div>

      {/* Active Enrolled Plan Spotlight Card */}
      {activePlan && (
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-[#09150e] via-[#0d2217] to-[#09150e] border border-[#1e452b] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#163822] text-[var(--accent-main)] uppercase tracking-wider">
              YOUR CURRENT REGIMEN • WEEK {activePlan.currentWeek} OF {activePlan.durationWeeks}
            </span>
            <h3 className="font-['Cinzel'] text-base sm:text-lg font-bold text-[#f5ebd7]">
              {activePlan.title}
            </h3>
            <p className="text-xs text-[#9eb6a8] max-w-xl">{activePlan.description}</p>
          </div>

          <button
            onClick={() => setShowTrainingPlansModal(true)}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-[#183724] hover:bg-[#204a30] text-xs font-bold text-[#f5ebd7] border border-[#2c613e] transition-colors flex-shrink-0"
          >
            <span>View Plan Roadmap</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Workout Volume & Intensity Trends Chart */}
      <WorkoutTrendsChart />

      {/* Workout Journey Map */}
      <WorkoutJourneyMap />

      {/* AI Coaching Tips */}
      <GeminiTrainingTips />

      {/* Category Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              setSelectedSubcategory('All');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex-shrink-0 ${
              selectedCategory === cat
                ? 'bg-gradient-to-r from-[var(--accent-main)] to-[var(--accent-grad)] text-[#07130c] shadow-[0_0_12px_rgba(201,151,56,0.3)]'
                : 'bg-[#0a140e] border border-[#1b3424] text-[#869f8f] hover:border-[#2b553a]'
            }`}
          >
            {cat === 'All' ? 'All Regimens' : cat}
          </button>
        ))}
      </div>

      {/* Subcategory helper chips */}
      {selectedCategory === 'Strength' && (
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs text-[#8da696]">
          <span className="text-[11px] font-semibold text-[var(--accent-main)]">Focus:</span>
          {['All', 'Full body', 'Upper body', 'Lower body', 'Core', 'Push', 'Pull', 'Legs'].map(
            (sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubcategory(sub)}
                className={`px-2.5 py-1 rounded-lg text-[11px] transition-colors ${
                  selectedSubcategory === sub
                    ? 'bg-[#183925] text-[#86efac] font-bold border border-[#2b6340]'
                    : 'bg-[#0c1610] text-[#738c7c] hover:text-[#b4c4b9]'
                }`}
              >
                {sub}
              </button>
            )
          )}
        </div>
      )}

      {selectedCategory === 'Bodyweight' && (
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs text-[#8da696]">
          <span className="text-[11px] font-semibold text-[var(--accent-main)]">Equipment:</span>
          <span className="px-2.5 py-1 rounded-lg text-[11px] bg-[#142e1d] text-[#86efac] font-bold border border-[#245233]">
            Zero Equipment Required (Anywhere / Anytime)
          </span>
        </div>
      )}

      {selectedCategory === 'Cardio' && (
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs text-[#8da696]">
          <span className="text-[11px] font-semibold text-[var(--accent-main)]">Trail Pace:</span>
          {['All', 'Hiking', 'Running', 'HIIT', 'Walking'].map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubcategory(sub)}
              className={`px-2.5 py-1 rounded-lg text-[11px] transition-colors ${
                selectedSubcategory === sub
                  ? 'bg-[#183925] text-[#86efac] font-bold border border-[#2b6340]'
                  : 'bg-[#0c1610] text-[#738c7c] hover:text-[#b4c4b9]'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      )}

      {/* Workout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredWorkouts.map((workout) => {
          return (
            <div
              key={workout.id}
              className="p-5 rounded-3xl bg-[#09130d] border border-[#1a3625] hover:border-[#2b593d] transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#112417] text-[#86efac] border border-[#1b3d27] uppercase">
                    {workout.category} • {workout.subcategory}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase ${
                      workout.difficulty === 'Beginner'
                        ? 'text-emerald-400'
                        : workout.difficulty === 'Intermediate'
                        ? 'text-amber-400'
                        : 'text-rose-400'
                    }`}
                  >
                    {workout.difficulty}
                  </span>
                </div>

                <h3 className="font-['Cinzel'] text-lg font-bold text-[#f5ebd7] group-hover:text-[var(--accent-bright)] transition-colors">
                  {workout.title}
                </h3>

                <p className="text-xs text-[#8ea496] line-clamp-2">{workout.description}</p>

                {/* Metrics */}
                <div className="flex items-center space-x-3 text-xs text-[#a0b5a8] pt-1">
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-[var(--accent-main)]" />
                    <span>{workout.durationMinutes}m</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center space-x-1">
                    <Flame className="w-3.5 h-3.5 text-amber-500" />
                    <span>{workout.estimatedCalories} kcal</span>
                  </span>
                  <span>•</span>
                  <span className="text-[#86efac] font-semibold">+{workout.xpReward} XP</span>
                </div>

                {/* Exercises list preview */}
                <div className="pt-2 border-t border-[#14261a] space-y-1.5">
                  <span className="text-[10px] text-[#6d8a77] uppercase font-semibold">
                    Exercises ({workout.exercises.length}):
                  </span>
                  <div className="space-y-1">
                    {workout.exercises.slice(0, 3).map((item, idx) => {
                      const ex = exercises.find((e) => e.id === item.exerciseId);
                      return (
                        <div
                          key={idx}
                          className="text-[11px] text-[#b8cbbf] flex items-center justify-between"
                        >
                          <span className="truncate max-w-[200px] sm:max-w-xs">
                            • {ex?.name || 'Exercise'}
                          </span>
                          <span className="text-[10px] text-[#6d8a77] font-mono">
                            {item.sets} x {item.reps}
                          </span>
                        </div>
                      );
                    })}
                    {workout.exercises.length > 3 && (
                      <span className="text-[10px] text-[var(--accent-main)] block">
                        + {workout.exercises.length - 3} more exercises
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Start Workout Button */}
              <button
                onClick={() => setPrepWorkout(workout)}
                className="w-full py-3 rounded-xl bg-[#143a25] hover:bg-[#1b4b30] text-[#f5ebd7] text-xs font-bold flex items-center justify-center space-x-2 border border-[#225838] transition-all shadow-md active:scale-98"
              >
                <Play className="w-4 h-4 fill-current text-[var(--accent-main)]" />
                <span>START THIS WORKOUT</span>
              </button>
            </div>
          );
        })}
      
      </div>

      {prepWorkout && (
        <PreWorkoutPrepModal 
          workout={prepWorkout}
          onClose={() => setPrepWorkout(null)}
          onSkipOrComplete={() => {
            setWorkoutPlayerWorkout(prepWorkout);
            setPrepWorkout(null);
          }}
        />
      )}
    </div>
  );
};