import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Workout, Exercise } from '../../types';
import { RealisticEmblem } from '../common/RealisticEmblem';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Check,
  ChevronRight,
  ChevronLeft,
  Timer,
  Flame,
  Zap,
  Repeat,
  Info,
  Share2,
  Film,
  Lock,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Trophy
} from 'lucide-react';

export const WorkoutPlayerModal: React.FC = () => {
  const {
    workoutPlayerWorkout,
    setWorkoutPlayerWorkout,
    exercises,
    completeWorkout,
    substituteWorkoutExercise,
    addCommunityPost,
    openFormAnalysis
  } = useApp();

  const workout = workoutPlayerWorkout;
  if (!workout) return null;

  // Track completed sets per exercise: exerciseIndex -> completedSetsCount
  const [currentExIndex, setCurrentExIndex] = useState<number>(0);
  const [completedSets, setCompletedSets] = useState<{ [index: number]: number }>({});
  const [restTimerSec, setRestTimerSec] = useState<number | null>(null);
  const [isResting, setIsResting] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [elapsedSec, setElapsedSec] = useState<number>(0);
  const [showSubstituteModal, setShowSubstituteModal] = useState<boolean>(false);
  const [strictWarning, setStrictWarning] = useState<string | null>(null);
  const [shakeLock, setShakeLock] = useState<boolean>(false);
  const [sessionRpe, setSessionRpe] = useState<number>(
    workout.difficulty === 'Beginner' ? 7 : workout.difficulty === 'Intermediate' ? 8 : 9
  );

  // Overall workout timer
  useEffect(() => {
    if (isFinished) return;
    const interval = setInterval(() => {
      setElapsedSec((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isFinished]);

  // Rest countdown timer
  useEffect(() => {
    if (!isResting || restTimerSec === null || restTimerSec <= 0) return;
    const interval = setInterval(() => {
      setRestTimerSec((prev) => {
        if (prev === null || prev <= 1) {
          setIsResting(false);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isResting, restTimerSec]);

  const currentWorkoutEx = workout.exercises[currentExIndex];
  const currentExerciseData: Exercise | undefined = exercises.find(
    (e) => e.id === currentWorkoutEx?.exerciseId
  );

  const completedSetsForCurrent = completedSets[currentExIndex] || 0;
  const totalSetsForCurrent = currentWorkoutEx?.sets || 3;
  const isCurrentExerciseComplete = completedSetsForCurrent >= totalSetsForCurrent;

  const handleToggleSet = (setNumber: number) => {
    const nextCompleted = completedSetsForCurrent >= setNumber ? setNumber - 1 : setNumber;
    setCompletedSets((prev) => ({ ...prev, [currentExIndex]: nextCompleted }));
    setStrictWarning(null);

    // If set completed and not last set, start rest timer
    if (nextCompleted > completedSetsForCurrent) {
      if (nextCompleted < totalSetsForCurrent) {
        setRestTimerSec(currentWorkoutEx.restSec || 45);
        setIsResting(true);
      } else {
        setIsResting(false);
        setRestTimerSec(null);
      }
    }
  };

  const handleQuickCompleteAllSets = () => {
    setCompletedSets((prev) => ({ ...prev, [currentExIndex]: totalSetsForCurrent }));
    setStrictWarning(null);
    setIsResting(false);
    setRestTimerSec(null);
  };

  const triggerStrictLockWarning = (targetExName?: string) => {
    const setsRemaining = totalSetsForCurrent - completedSetsForCurrent;
    setStrictWarning(
      `Strict Protocol Active: Complete all ${totalSetsForCurrent} sets of "${currentExerciseData?.name || 'this exercise'}" before advancing (${setsRemaining} set${setsRemaining > 1 ? 's' : ''} remaining). No cutting corners.`
    );
    setShakeLock(true);
    setTimeout(() => setShakeLock(false), 700);
  };

  const handleNextExercise = () => {
    // STRICT RULE: User cannot advance without completing all sets of current exercise
    if (!isCurrentExerciseComplete) {
      triggerStrictLockWarning();
      return;
    }

    setStrictWarning(null);
    setIsResting(false);
    setRestTimerSec(null);
    if (currentExIndex < workout.exercises.length - 1) {
      setCurrentExIndex(currentExIndex + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handlePrevExercise = () => {
    setIsResting(false);
    setRestTimerSec(null);
    setStrictWarning(null);
    if (currentExIndex > 0) {
      setCurrentExIndex(currentExIndex - 1);
    }
  };

  const handleSelectExerciseStep = (targetIndex: number) => {
    if (targetIndex === currentExIndex) return;

    // Strict Rule: Allowed to revisit previous exercises or already-finished exercises
    const targetSetsDone = completedSets[targetIndex] || 0;
    const targetRequired = workout.exercises[targetIndex]?.sets || 3;
    const targetIsComplete = targetSetsDone >= targetRequired;

    if (targetIndex < currentExIndex || targetIsComplete) {
      setCurrentExIndex(targetIndex);
      setIsResting(false);
      setRestTimerSec(null);
      setStrictWarning(null);
    } else {
      // Trying to skip ahead past an incomplete exercise
      triggerStrictLockWarning();
    }
  };

  const handleFinishWorkout = () => {
    const durationMin = Math.max(1, Math.round(elapsedSec / 60));
    completeWorkout(workout, durationMin, workout.estimatedCalories, workout.xpReward, sessionRpe);
    setWorkoutPlayerWorkout(null);
  };

  const handleShareToPride = () => {
    const durationMin = Math.max(1, Math.round(elapsedSec / 60));
    completeWorkout(workout, durationMin, workout.estimatedCalories, workout.xpReward, sessionRpe);
    addCommunityPost(
      `Conquered "${workout.title}" in ${durationMin} mins at RPE ${sessionRpe}/10. Total grit, no excuses. Hold the line, brothers!`,
      undefined,
      `${workout.title} • ${durationMin}m • RPE ${sessionRpe}/10 • ${workout.estimatedCalories} kcal`
    );
    setWorkoutPlayerWorkout(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Find substitute exercises for current
  const availableSubstitutes = exercises.filter(
    (ex) =>
      ex.id !== currentExerciseData?.id &&
      (currentExerciseData?.substitutes?.includes(ex.id) ||
        ex.category === currentExerciseData?.category ||
        ex.subcategory === currentExerciseData?.subcategory)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#070e0a] border border-[#1d3d2a] rounded-3xl p-5 sm:p-6 shadow-2xl my-auto text-[#f4f1ea]">
        {/* Header with Title and Close */}
        <div className="flex items-center justify-between border-b border-[#14261b] pb-3 mb-4">
          <div>
            <span className="text-[10px] font-bold text-[var(--accent-main)] uppercase tracking-wider">
              ACTIVE PANTHER SESSION • {formatTime(elapsedSec)}
            </span>
            <h2 className="text-base sm:text-lg font-bold truncate max-w-[260px] sm:max-w-xs font-['Cinzel'] text-[#f5ebd7]">
              {workout.title}
            </h2>
          </div>
          <button
            onClick={() => setWorkoutPlayerWorkout(null)}
            className="p-1.5 rounded-full bg-[#121c15] text-[#869f8f] hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Finished Celebration View */}
        {isFinished ? (
          <div className="text-center py-6 space-y-5">
            <div className="flex justify-center">
              <RealisticEmblem
                icon="panther"
                size="xl"
                variant="gold"
                showHalo
              />
            </div>
            <div>
              <span className="text-xs font-bold text-[var(--accent-main)] tracking-widest uppercase">
                TRAINING CONQUERED
              </span>
              <h3 className="font-['Cinzel'] text-2xl font-bold text-[#f5ebd7] mt-1">
                Outstanding Effort, Panther.
              </h3>
              <p className="text-xs text-[#8da696] max-w-sm mx-auto mt-2">
                “Silent consistency over loud excuses.” Another brick placed in your physical and mental armor.
              </p>
            </div>

            {/* Session stats recap */}
            <div className="grid grid-cols-3 gap-2 bg-[#0c1810] p-4 rounded-2xl border border-[#1b3624]">
              <div>
                <span className="text-[10px] text-[#6d8a77] uppercase font-semibold">Time</span>
                <p className="text-base font-bold text-[#e6f0ea]">{formatTime(elapsedSec)}</p>
              </div>
              <div>
                <span className="text-[10px] text-[#6d8a77] uppercase font-semibold">Calories</span>
                <p className="text-base font-bold text-[#e2b955]">{workout.estimatedCalories} kcal</p>
              </div>
              <div>
                <span className="text-[10px] text-[#6d8a77] uppercase font-semibold">XP Earned</span>
                <p className="text-base font-bold text-[#4ade80]">+{workout.xpReward} XP</p>
              </div>
            </div>

            {/* Rate of Perceived Exertion (RPE / Intensity) */}
            <div className="bg-[#09150e] p-3.5 rounded-2xl border border-[#173822] text-left space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#f5ebd7] flex items-center space-x-1.5">
                  <Zap className="w-3.5 h-3.5 text-[var(--accent-main)]" />
                  <span>Session Intensity (RPE)</span>
                </span>
                <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-[#13301d] text-[var(--accent-main)] border border-[var(--accent-main)]/40 font-mono">
                  {sessionRpe} / 10 • {sessionRpe >= 9 ? 'Max Effort' : sessionRpe >= 8 ? 'Very Hard (2 RIR)' : sessionRpe >= 7 ? 'Hard (3 RIR)' : 'Moderate'}
                </span>
              </div>
              <div className="flex items-center space-x-1 justify-between pt-1">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setSessionRpe(val)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      sessionRpe === val
                        ? 'bg-[var(--accent-main)] text-[#07130c] shadow-md scale-105'
                        : 'bg-[#102216] text-[#718d7b] hover:text-[#e4efe8] hover:bg-[#183623]'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-[#6b8b76]">
                Logged directly to your Volume & Intensity Progress Analytics in Training.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={handleShareToPride}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[var(--accent-main)] to-[var(--accent-bright)] text-[#07130c] font-black text-xs flex items-center justify-center space-x-2 shadow-lg hover:opacity-95 transition-all"
              >
                <Share2 className="w-4 h-4" />
                <span>LOG & SHARE TO BROTHERHOOD</span>
              </button>
              <button
                onClick={handleFinishWorkout}
                className="w-full py-2.5 rounded-xl bg-[#112217] text-[#a4baa9] text-xs font-bold hover:bg-[#183222] transition-colors"
              >
                Close & Return To Dashboard
              </button>
            </div>
          </div>
        ) : (
          /* Active Workout Step View */
          <div className="space-y-4">
            {/* Strict Discipline Protocol Indicator Banner */}
            <div className="flex items-center justify-between text-[11px] px-3 py-2 rounded-xl bg-[#0b1b11] border border-[#1d4229]">
              <div className="flex items-center space-x-1.5 text-[var(--accent-main)] font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-[var(--accent-main)]" />
                <span className="tracking-wide">Strict Discipline Protocol Active</span>
              </div>
              <span className="font-mono text-[10px]">
                {isCurrentExerciseComplete ? (
                  <span className="text-emerald-400 font-bold flex items-center space-x-1 bg-[#122e1d] px-2 py-0.5 rounded-md border border-emerald-500/40">
                    <Check className="w-3 h-3 inline" /> Movement Unlocked
                  </span>
                ) : (
                  <span className="text-amber-300 font-bold flex items-center space-x-1 bg-[#261706] px-2 py-0.5 rounded-md border border-amber-500/40">
                    <Lock className="w-3 h-3 inline text-amber-400" /> {totalSetsForCurrent - completedSetsForCurrent} set{totalSetsForCurrent - completedSetsForCurrent > 1 ? 's' : ''} remaining
                  </span>
                )}
              </span>
            </div>

            {/* Strict Protocol Warning Alert (Shown if user tries to skip ahead) */}
            {strictWarning && (
              <div className="p-3 rounded-xl bg-gradient-to-r from-[#291206] to-[#1f0d05] border border-amber-500/70 text-amber-200 text-xs flex items-start space-x-2.5 shadow-[0_0_18px_rgba(245,158,11,0.25)] animate-bounce">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-bold text-amber-300 uppercase tracking-wider text-[10px]">
                    Strict Rule Enforced
                  </p>
                  <p className="text-[11px] text-amber-200/90 mt-0.5 leading-snug">
                    {strictWarning}
                  </p>
                </div>
                <button
                  onClick={() => setStrictWarning(null)}
                  className="text-amber-400 hover:text-amber-100 p-0.5 rounded transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Exercise Stepper / Roadmap */}
            <div>
              <div className="flex items-center justify-between text-xs text-[#7d9987] mb-1.5">
                <span>
                  Exercise {currentExIndex + 1} of {workout.exercises.length}
                </span>
                <span className="font-semibold text-[var(--accent-main)]">
                  {Math.round(((currentExIndex + 1) / workout.exercises.length) * 100)}% Complete
                </span>
              </div>
              <div className="w-full bg-[#111f16] h-1.5 rounded-full overflow-hidden mb-2.5">
                <div
                  className="bg-gradient-to-r from-[#1b5336] to-[var(--accent-main)] h-full transition-all duration-300"
                  style={{ width: `${((currentExIndex + 1) / workout.exercises.length) * 100}%` }}
                />
              </div>

              {/* Step Sequence Pills */}
              <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
                {workout.exercises.map((item, idx) => {
                  const exData = exercises.find((e) => e.id === item.exerciseId);
                  const setsDone = completedSets[idx] || 0;
                  const reqSets = item.sets || 3;
                  const isDone = setsDone >= reqSets;
                  const isCurrent = idx === currentExIndex;
                  const isLocked = idx > currentExIndex && !isDone;

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectExerciseStep(idx)}
                      className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold flex items-center space-x-1.5 transition-all whitespace-nowrap border shrink-0 ${
                        isCurrent
                          ? 'bg-[#1a4128] border-[var(--accent-main)] text-[#f5ebd7] shadow-[0_0_12px_rgba(201,151,56,0.3)] ring-1 ring-[var(--accent-main)]/50'
                          : isDone
                          ? 'bg-[#0e2417] border-[#205133] text-[#7de0a3] hover:bg-[#143221]'
                          : 'bg-[#09120c] border-[#15241b] text-[#5b7364] opacity-80 hover:opacity-100 hover:border-[#1e3427]'
                      }`}
                      title={
                        isDone
                          ? `${exData?.name} (Completed)`
                          : isCurrent
                          ? `${exData?.name} (In Progress - ${setsDone}/${reqSets} sets)`
                          : `${exData?.name} (Locked - Complete current exercise first)`
                      }
                    >
                      <span className="font-mono text-[10px] text-[#8ea496]">#{idx + 1}</span>
                      <span className="truncate max-w-[85px]">{exData?.name || `Ex ${idx + 1}`}</span>
                      {isDone ? (
                        <Check className="w-3.5 h-3.5 text-[#34d399] stroke-[2.5]" />
                      ) : isCurrent ? (
                        <span className="text-[10px] text-[var(--accent-main)] font-mono bg-[#112d1b] px-1 rounded">
                          {setsDone}/{reqSets}
                        </span>
                      ) : (
                        <Lock className="w-3 h-3 text-[#506859]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Current Exercise Card */}
            <div
              className={`p-4 rounded-2xl bg-[#0b1710] border transition-all duration-300 relative ${
                shakeLock
                  ? 'border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.4)] scale-[0.99]'
                  : isCurrentExerciseComplete
                  ? 'border-emerald-500/80 shadow-[0_0_15px_rgba(52,211,153,0.15)]'
                  : 'border-[#1a3825]'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-[#132c1c] text-[#7de0a3] border border-[#1f4a2f]">
                      {currentExerciseData?.subcategory || 'Core'}
                    </span>
                    {isCurrentExerciseComplete && (
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#163a23] text-[#4ade80] border border-[#276e42] flex items-center space-x-1">
                        <Check className="w-3 h-3" />
                        <span>Completed</span>
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-[#f5ebd7] mt-1.5">
                    {currentExerciseData?.name || 'Exercise'}
                  </h3>
                  <p className="text-xs text-[#8ea496] mt-0.5">
                    Target: {currentExerciseData?.targetMuscles.join(', ')}
                  </p>
                </div>

                {/* Substitute Exercise Button */}
                <button
                  onClick={() => setShowSubstituteModal(true)}
                  className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-[#122418] hover:bg-[#1b3523] border border-[#234b31] text-[11px] font-semibold text-[var(--accent-main)] transition-colors"
                  title="Substitute Exercise"
                >
                  <Repeat className="w-3.5 h-3.5" />
                  <span>Substitute</span>
                </button>
              </div>

              {/* Form & Posture Cues */}
              <div className="mt-3 p-3 rounded-xl bg-[#070e0a] border border-[#162a1c] text-xs text-[#a4baa9] space-y-1">
                <div className="flex items-center space-x-1 text-[var(--accent-main)] font-semibold text-[11px]">
                  <Info className="w-3.5 h-3.5" />
                  <span>Panther Technique Cues:</span>
                </div>
                {currentExerciseData?.cueTips?.map((tip, i) => (
                  <p key={i} className="text-[11px] leading-relaxed">
                    • {tip}
                  </p>
                ))}
              </div>

              {/* Target Reps and Sets Banner */}
              <div className="mt-3 flex items-center justify-between text-xs py-2 px-3 rounded-xl bg-[#122417] border border-[#1e3c28]">
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-[var(--accent-main)]" />
                  <span className="font-semibold text-[#f5ebd7]">
                    Target: {currentWorkoutEx.reps}
                  </span>
                </div>
                <span className="text-[11px] text-[#8ea496]">
                  Rest: {currentWorkoutEx.restSec}s
                </span>
              </div>

              {/* AI Video Form Biomechanics Check Button */}
              <button
                id="workout-player-record-form-button"
                onClick={() =>
                  openFormAnalysis({
                    name: currentExerciseData?.name || 'Exercise',
                    category: workout.category,
                    targetMuscles: currentExerciseData?.targetMuscles || [],
                    subcategory: currentExerciseData?.subcategory,
                  })
                }
                className="w-full mt-3 flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-[#0d2a1b] to-[#143e27] border border-[#27663e] hover:border-[var(--accent-main)] text-xs font-bold text-[#e6f4ec] hover:shadow-[0_0_15px_rgba(52,211,153,0.25)] transition-all group"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-lg bg-[#18482c] border border-[#2d774a] flex items-center justify-center text-[#34d399] group-hover:text-[var(--accent-main)]">
                    <Film className="w-3.5 h-3.5" />
                  </div>
                  <span>Record Form Check (AI Biomechanics)</span>
                </div>
                <div className="flex items-center space-x-1 text-[10px] text-[#34d399] font-mono">
                  <span>VIDEO AI</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#34d399]" />
                </div>
              </button>
            </div>

            {/* Interactive Sets Checklist */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#c5ceca] uppercase tracking-wider flex items-center space-x-1.5">
                  <span>Mark Completed Sets</span>
                  <span className="text-[var(--accent-main)] font-mono font-bold">
                    ({completedSetsForCurrent}/{totalSetsForCurrent})
                  </span>
                </span>

                {!isCurrentExerciseComplete && (
                  <button
                    type="button"
                    onClick={handleQuickCompleteAllSets}
                    className="text-[10px] font-semibold text-[var(--accent-main)] hover:text-amber-300 flex items-center space-x-1 bg-[#14291c] px-2 py-0.5 rounded-md border border-[#214b30] transition-colors"
                  >
                    <Check className="w-3 h-3" />
                    <span>Mark All Sets Complete</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                {Array.from({ length: totalSetsForCurrent }).map((_, idx) => {
                  const setNum = idx + 1;
                  const isDone = completedSetsForCurrent >= setNum;
                  return (
                    <button
                      key={setNum}
                      onClick={() => handleToggleSet(setNum)}
                      className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all ${
                        isDone
                          ? 'bg-[#18462b] border-[var(--accent-main)] text-[#f5ebd7] shadow-[0_0_10px_rgba(201,151,56,0.2)]'
                          : 'bg-[#0c1610] border-[#1c3523] text-[#7d9987] hover:border-[#2f553a]'
                      }`}
                    >
                      <span className="text-[10px] uppercase font-bold">Set {setNum}</span>
                      <div className="mt-1">
                        {isDone ? (
                          <Check className="w-4 h-4 text-[var(--accent-main)] stroke-[3]" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-[#3b5e47]" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {isCurrentExerciseComplete && (
                <div className="p-2.5 rounded-xl bg-[#0f2d1c] border border-[#2d7a4b] text-emerald-300 text-xs flex items-center justify-between shadow-[0_0_12px_rgba(52,211,153,0.15)] animate-in fade-in duration-200">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#34d399]" />
                    <span className="font-bold text-[#e6f7ee]">
                      All {totalSetsForCurrent} sets verified & complete!
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-[var(--accent-main)] uppercase tracking-wider">
                    {currentExIndex < workout.exercises.length - 1 ? 'Ready to advance' : 'Ready to finish'}
                  </span>
                </div>
              )}
            </div>

            {/* Rest Timer Banner if resting */}
            {isResting && restTimerSec !== null && (
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#102416] via-[#163620] to-[#102416] border border-[var(--accent-main)]/50 flex items-center justify-between animate-pulse">
                <div className="flex items-center space-x-2.5">
                  <Timer className="w-5 h-5 text-[var(--accent-main)]" />
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[var(--accent-main)] font-bold">
                      Rest & Recover
                    </span>
                    <p className="text-lg font-mono font-black text-[#f5ebd7]">
                      {restTimerSec}s remaining
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsResting(false);
                    setRestTimerSec(null);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#09140c] text-xs font-semibold text-[#8ea496] hover:text-white border border-[#1b3924]"
                >
                  Skip Rest
                </button>
              </div>
            )}

            {/* Next / Previous Navigation with Strict Rule Protection */}
            <div className="flex items-center justify-between pt-2 border-t border-[#14261b]">
              <button
                onClick={handlePrevExercise}
                disabled={currentExIndex === 0}
                className={`flex items-center space-x-1 px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  currentExIndex === 0
                    ? 'opacity-30 cursor-not-allowed text-[#4b6053]'
                    : 'bg-[#111e16] text-[#93ab9c] hover:bg-[#182e21]'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev Exercise</span>
              </button>

              <button
                onClick={handleNextExercise}
                className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg border ${
                  isCurrentExerciseComplete
                    ? 'bg-gradient-to-r from-[#1b5336] to-[#247043] hover:from-[#22633e] hover:to-[#2c8853] text-[#f5ebd7] border-[var(--accent-main)] shadow-[0_0_15px_rgba(52,211,153,0.2)]'
                    : 'bg-[#132219] hover:bg-[#192f22] text-[#8ea496] border-[#203a2a] hover:border-amber-500/50'
                }`}
              >
                {isCurrentExerciseComplete ? (
                  <>
                    <span>
                      {currentExIndex < workout.exercises.length - 1 ? 'Next Exercise' : 'Finish Workout'}
                    </span>
                    {currentExIndex < workout.exercises.length - 1 ? (
                      <ChevronRight className="w-4 h-4 text-[var(--accent-main)]" />
                    ) : (
                      <Trophy className="w-4 h-4 text-amber-400" />
                    )}
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>
                      Complete Sets ({completedSetsForCurrent}/{totalSetsForCurrent})
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Substitute Exercise Modal */}
        {showSubstituteModal && (
          <div className="absolute inset-0 z-20 bg-[#060c08]/95 backdrop-blur-md p-5 rounded-3xl flex flex-col">
            <div className="flex items-center justify-between border-b border-[#152a1d] pb-3 mb-3">
              <div>
                <h4 className="text-sm font-bold text-[#f5ebd7]">Substitute Exercise</h4>
                <p className="text-[11px] text-[#8ea496]">
                  Swap for equipment, injury recovery, or variety
                </p>
              </div>
              <button
                onClick={() => setShowSubstituteModal(false)}
                className="p-1 rounded-full bg-[#111e15] text-[#869f8f]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {availableSubstitutes.map((sub) => (
                <div
                  key={sub.id}
                  onClick={() => {
                    substituteWorkoutExercise(
                      workout.id,
                      currentExerciseData!.id,
                      sub.id
                    );
                    setShowSubstituteModal(false);
                  }}
                  className="p-3 rounded-xl bg-[#0c1610] hover:bg-[#14261b] border border-[#1b3624] hover:border-[var(--accent-main)]/60 cursor-pointer transition-all flex items-center justify-between"
                >
                  <div>
                    <h5 className="text-xs font-bold text-[#e6f0ea]">{sub.name}</h5>
                    <p className="text-[10px] text-[#7d9987]">
                      {sub.equipmentNeeded} • {sub.subcategory}
                    </p>
                  </div>
                  <span className="text-[11px] text-[var(--accent-main)] font-bold">Select</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
