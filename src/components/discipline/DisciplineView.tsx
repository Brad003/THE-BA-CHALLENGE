import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RealisticEmblem } from '../common/RealisticEmblem';
import {
  Flame,
  CheckCircle2,
  Calendar as CalendarIcon,
  Award,
  Sparkles,
  Shield,
  ChevronLeft,
  ChevronRight,
  Target,
  Dumbbell,
  Footprints,
  Brain,
  Droplet,
  BookOpen,
  ShieldCheck,
  Sun,
  HeartHandshake
} from 'lucide-react';

export const DisciplineView: React.FC = () => {
  const {
    user,
    disciplineTasks,
    toggleDisciplineTask,
    badges
  } = useApp();

  const [selectedMonth] = useState('September 2026');

  // Days in month simulation for consistency calendar
  // 30 days, mark active days matching user's streak and past consistency
  const daysInMonth = Array.from({ length: 30 }, (_, i) => {
    const dayNum = i + 1;
    // Simulate active days: current day is 11. Days 1 to 11 are completed.
    const isToday = dayNum === 11;
    const isCompleted = dayNum <= 11 || (dayNum > 11 && dayNum < 14 && Math.random() > 0.3);
    return {
      day: dayNum,
      isToday,
      isCompleted: dayNum <= 11
    };
  });

  const getTaskIcon = (iconName: string) => {
    switch (iconName) {
      case 'Dumbbell': return <Dumbbell className="w-4 h-4 text-emerald-400" />;
      case 'Flame': return <Flame className="w-4 h-4 text-amber-400" />;
      case 'Footprints': return <Footprints className="w-4 h-4 text-emerald-400" />;
      case 'Brain': return <Brain className="w-4 h-4 text-sky-400" />;
      case 'Droplet': return <Droplet className="w-4 h-4 text-blue-400" />;
      case 'BookOpen': return <BookOpen className="w-4 h-4 text-amber-300" />;
      case 'ShieldCheck': return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      case 'Sun': return <Sun className="w-4 h-4 text-amber-400" />;
      case 'HeartHandshake': return <HeartHandshake className="w-4 h-4 text-[var(--accent-main)]" />;
      default: return <Target className="w-4 h-4 text-[var(--accent-main)]" />;
    }
  };

  const completedCount = disciplineTasks.filter((t) => t.completed).length;

  return (
    <div className="space-y-6 pb-24 max-w-5xl mx-auto px-4 pt-4 text-[#f4f1ea]">
      {/* Header */}
      <div>
        <span className="text-[10px] font-bold text-[var(--accent-main)] uppercase tracking-widest">
          THE PANTHER CODE OF CONDUCT
        </span>
        <h1 className="font-['Cinzel'] text-2xl sm:text-3xl font-extrabold text-[#f5ebd7] tracking-wide mt-1">
          Daily Discipline & Streaks
        </h1>
        <p className="text-xs text-[#8da696] mt-1">
          Character is not forged on the stage; it is forged in silent, unglamorous consistency.
        </p>
      </div>

      {/* Streak Showcase Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#09150e] via-[#10291a] to-[#09150e] border border-[#235336] shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-14 h-14 rounded-2xl bg-[#194229] border border-[var(--accent-main)] flex items-center justify-center shadow-[0_0_20px_rgba(201,151,56,0.3)]">
              <Flame className="w-8 h-8 text-amber-400 fill-amber-400/20 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent-main)]">
                UNBROKEN BROTHERHOOD STREAK
              </span>
              <div className="flex items-baseline space-x-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#f5ebd7]">
                  {user.streak.current} Days Strong
                </h2>
              </div>
              <p className="text-xs text-[#9eb6a8]">
                Personal Record: <strong className="text-[#e2b955]">{user.streak.longest} consecutive days</strong>
              </p>
            </div>
          </div>

          {/* Non-punitive motivational recovery banner */}
          <div className="p-3 rounded-2xl bg-[#070e0a]/90 border border-[#1d3d29] max-w-xs self-start sm:self-auto">
            <span className="text-[10px] uppercase font-bold text-[var(--accent-main)] tracking-wider block mb-0.5">
              The Trail Philosophy
            </span>
            <p className="text-xs text-[#a4baa9] italic font-serif leading-relaxed">
              “The trail is still there. Get back on it. A panther never mourns missed ground; he locks eyes on the next sunrise.”
            </p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#173322]">
          <div className="p-3 rounded-xl bg-[#09140e] border border-[#193322]">
            <span className="text-[10px] text-[#6d8a77] uppercase font-semibold">Active This Month</span>
            <p className="text-base font-bold text-[#f5ebd7]">{user.streak.workoutsThisMonth} Days</p>
          </div>
          <div className="p-3 rounded-xl bg-[#09140e] border border-[#193322]">
            <span className="text-[10px] text-[#6d8a77] uppercase font-semibold">Total Days Active</span>
            <p className="text-base font-bold text-[#f5ebd7]">{user.streak.daysActiveTotal} Days</p>
          </div>
          <div className="p-3 rounded-xl bg-[#09140e] border border-[#193322]">
            <span className="text-[10px] text-[#6d8a77] uppercase font-semibold">Challenges Conquered</span>
            <p className="text-base font-bold text-[#4ade80]">{user.streak.challengesCompletedTotal}</p>
          </div>
          <div className="p-3 rounded-xl bg-[#09140e] border border-[#193322]">
            <span className="text-[10px] text-[#6d8a77] uppercase font-semibold">Trees Planted</span>
            <p className="text-base font-bold text-[#86efac]">{user.treesPlanted} Trees</p>
          </div>
        </div>
      </div>

      {/* Daily Discipline Checklist */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-[var(--accent-main)]" />
            <h2 className="font-['Cinzel'] text-lg font-bold text-[#f5ebd7]">
              Today's Discipline Checklist ({completedCount}/{disciplineTasks.length})
            </h2>
          </div>
          <span className="text-xs text-[#86efac] font-mono">
            {Math.round((completedCount / disciplineTasks.length) * 100)}% Complete
          </span>
        </div>

        {/* Task Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {disciplineTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => toggleDisciplineTask(task.id)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                task.completed
                  ? 'bg-[#112418] border-[#255737] text-[#a4baa9]'
                  : 'bg-[#09130d] border-[#1a3323] text-[#f4f1ea] hover:border-[var(--accent-main)]'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                    task.completed
                      ? 'bg-[#22c55e] text-[#050f08]'
                      : 'border-2 border-[#385943]'
                  }`}
                >
                  {task.completed && <CheckCircle2 className="w-4 h-4" />}
                </div>

                <div>
                  <div className="flex items-center space-x-1.5">
                    {getTaskIcon(task.iconName)}
                    <h3
                      className={`text-xs font-semibold ${
                        task.completed ? 'line-through opacity-75 text-[#869f8f]' : 'text-[#f5ebd7]'
                      }`}
                    >
                      {task.title}
                    </h3>
                  </div>
                  <p className="text-[10px] text-[#738f7d] mt-0.5">
                    {task.target} • <span className="text-[#86efac]">+{task.xp} XP</span>
                  </p>
                </div>
              </div>

              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                  task.completed
                    ? 'bg-[#163823] text-[#86efac]'
                    : 'bg-[#121f17] text-[var(--accent-main)]'
                }`}
              >
                {task.completed ? 'DONE' : 'CHECK IN'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Consistency Calendar */}
      <div className="p-5 rounded-3xl bg-[#09130d] border border-[#1b3624] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="w-4 h-4 text-[var(--accent-main)]" />
            <h2 className="font-['Cinzel'] text-sm sm:text-base font-bold text-[#f5ebd7]">
              Monthly Consistency Calendar
            </h2>
          </div>
          <span className="text-xs font-bold text-[var(--accent-main)]">{selectedMonth}</span>
        </div>

        {/* 30 Day Grid */}
        <div className="grid grid-cols-7 sm:grid-cols-10 gap-1.5 sm:gap-2">
          {daysInMonth.map((d) => (
            <div
              key={d.day}
              className={`p-2 rounded-xl text-center border transition-all ${
                d.isCompleted
                  ? 'bg-[#143522] border-[#28633e] text-[#86efac] shadow-[0_0_8px_rgba(34,197,94,0.15)]'
                  : d.isToday
                  ? 'bg-[#1c2e22] border-[var(--accent-main)] text-[#f5ebd7]'
                  : 'bg-[#0a140e] border-[#16291d] text-[#556e5f]'
              }`}
            >
              <span className="text-[10px] block font-bold">{d.day}</span>
              <div className="mt-1 flex justify-center">
                {d.isCompleted ? (
                  <CheckCircle2 className="w-3 h-3 text-[#4ade80]" />
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-[#1b3424]" />
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between text-[11px] text-[#738f7d] pt-2 border-t border-[#14261a]">
          <span className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#4ade80]" />
            <span>= Discipline Fulfilled</span>
          </span>
          <span className="text-[#86efac] font-semibold">11 Active Days in Sep</span>
        </div>
      </div>

      {/* Badges Section */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Award className="w-5 h-5 text-[var(--accent-main)]" />
          <h2 className="font-['Cinzel'] text-lg font-bold text-[#f5ebd7]">
            Earned Badges & Milestones
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {badges.map((badge) => {
            const isUnlocked = badge.progress >= badge.maxProgress;
            return (
              <div
                key={badge.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isUnlocked
                    ? 'bg-[#102417] border-[var(--accent-main)]/80 shadow-[0_0_15px_rgba(201,151,56,0.15)]'
                    : 'bg-[#09130d] border-[#172c1e] opacity-75'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <RealisticEmblem
                    icon={badge.icon}
                    size="sm"
                    variant={isUnlocked ? 'gold' : 'obsidian'}
                    showHalo={isUnlocked}
                  />
                  <div>
                    <h3 className="text-xs font-bold font-['Cinzel'] text-[#f5ebd7]">
                      {badge.title}
                    </h3>
                    <span className="text-[10px] text-[var(--accent-main)] font-semibold uppercase">
                      {badge.category}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-[#8ea496] mt-2.5 leading-relaxed">
                  {badge.description}
                </p>

                <div className="mt-3">
                  <div className="flex justify-between text-[10px] text-[#6d8a77] mb-1">
                    <span>{isUnlocked ? 'Unlocked' : 'Progress'}</span>
                    <span className="font-bold text-[#f5ebd7]">
                      {badge.progress} / {badge.maxProgress}
                    </span>
                  </div>
                  <div className="w-full bg-[#0e1b13] h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        isUnlocked ? 'bg-[var(--accent-main)]' : 'bg-[#2b6441]'
                      }`}
                      style={{
                        width: `${Math.min(100, (badge.progress / badge.maxProgress) * 100)}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
