import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Trophy, Activity, Target, X, Share2, Flame, Award } from 'lucide-react';
import { PANTHER_LEVELS } from '../../data/initialData';

export const WeeklySummaryModal: React.FC = () => {
  const { user, activityLogs, showWeeklySummaryModal, setShowWeeklySummaryModal, updateUserProfile } = useApp();

  // Calculate metrics for the last 7 days
  const weeklyMetrics = useMemo(() => {
    const today = new Date();
    const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    // Filter activity logs from the last 7 days
    const recentLogs = activityLogs.filter(log => {
      const logDate = new Date(log.date);
      return logDate >= oneWeekAgo && logDate <= today;
    });

    const xpEarned = recentLogs.reduce((acc, log) => acc + log.xpEarned, 0);
    const workoutsCompleted = recentLogs.length; // Assuming each log is a workout/activity
    
    // Determine level info
    const currentLevel = PANTHER_LEVELS.find(l => l.id === user.pantherLevel);

    return {
      xpEarned,
      workoutsCompleted,
      levelName: currentLevel?.name || 'Panther',
    };
  }, [activityLogs, user.pantherLevel]);

  if (!showWeeklySummaryModal) return null;

  const handleClose = () => {
    setShowWeeklySummaryModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#09130d] border border-[var(--accent-main)]/50 rounded-3xl overflow-hidden shadow-2xl relative">
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 text-[#8ea496] hover:text-[var(--accent-main)] transition-colors p-2"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 text-center space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[var(--accent-main)]/10 border-2 border-[var(--accent-main)] mb-2 shadow-[0_0_20px_rgba(201,151,56,0.3)]">
            <Trophy className="w-10 h-10 text-[var(--accent-main)]" />
          </div>
          
          <div className="space-y-2">
            <h2 className="font-['Cinzel'] text-2xl font-black text-[#f5ebd7] tracking-wider uppercase">
              Weekly Debrief
            </h2>
            <p className="text-sm text-[#8ea496]">
              A retrospective of your discipline over the past 7 days.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-[#0c1811] border border-[#1b3424] flex flex-col items-center justify-center space-y-2">
              <Flame className="w-6 h-6 text-orange-500" />
              <span className="text-[10px] uppercase font-bold text-[#6d8a77] tracking-wider">XP Earned</span>
              <span className="text-2xl font-black text-[#f5ebd7]">{weeklyMetrics.xpEarned}</span>
            </div>
            
            <div className="p-4 rounded-2xl bg-[#0c1811] border border-[#1b3424] flex flex-col items-center justify-center space-y-2">
              <Activity className="w-6 h-6 text-emerald-500" />
              <span className="text-[10px] uppercase font-bold text-[#6d8a77] tracking-wider">Workouts</span>
              <span className="text-2xl font-black text-[#f5ebd7]">{weeklyMetrics.workoutsCompleted}</span>
            </div>
          </div>
          
          <div className="p-4 rounded-2xl bg-[var(--accent-main)]/5 border border-[var(--accent-main)]/30 flex items-center justify-between">
             <div className="flex items-center space-x-3">
               <Award className="w-8 h-8 text-[var(--accent-main)]" />
               <div className="text-left">
                 <h4 className="text-xs font-bold text-[#f5ebd7]">Current Rank</h4>
                 <p className="text-[10px] text-[var(--accent-main)] uppercase font-semibold">{weeklyMetrics.levelName}</p>
               </div>
             </div>
             <span className="text-[10px] font-bold px-2 py-1 bg-[var(--accent-main)]/20 text-[var(--accent-main)] rounded">Active</span>
          </div>

          <button 
            onClick={handleClose}
            className="w-full py-3.5 rounded-xl bg-[var(--accent-main)] hover:bg-[var(--accent-hover)] text-[#0a150e] font-black tracking-widest uppercase transition-colors"
          >
            Acknowledge & Proceed
          </button>
        </div>
      </div>
    </div>
  );
};
