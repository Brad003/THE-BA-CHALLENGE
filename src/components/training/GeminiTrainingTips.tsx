import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Activity, RefreshCw } from 'lucide-react';

export const GeminiTrainingTips: React.FC = () => {
  const { user } = useApp();
  const [tips, setTips] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTips = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Mocking some recent intensity data for the prompt
      const intensityData = {
        avgHeartRateZone: user.streak.workoutsThisMonth > 10 ? 'Anaerobic' : 'Aerobic',
        recentVolume: `${user.streak.workoutsThisMonth * 45} mins`,
        workoutsThisMonth: user.streak.workoutsThisMonth,
        streak: user.streak.current,
      };

      const response = await fetch('/api/training-tips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userStats: {
            fitnessLevel: user.fitnessLevel,
            primaryGoal: user.primaryGoal,
            pantherLevel: user.pantherLevel,
          },
          intensityData,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate tips');
      }

      const data = await response.json();
      if (data.tips && data.tips.length > 0) {
        setTips(data.tips);
      } else {
        throw new Error('No tips generated');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Could not load personalized tips.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTips();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  if (!user) return null;

  return (
    <div className="p-5 rounded-3xl bg-gradient-to-br from-[#0c1a11] to-[#07130c] border border-[#1b3424] space-y-4 shadow-xl">
      <div className="flex items-center justify-between border-b border-[#1b3424] pb-3">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-[var(--accent-main)] animate-pulse" />
          <h2 className="font-['Cinzel'] text-sm font-bold text-[#f5ebd7] tracking-wider uppercase flex items-center">
            AI Coach Insights
            <span className="ml-2 text-[8px] bg-[var(--accent-main)]/20 text-[var(--accent-main)] px-1.5 py-0.5 rounded uppercase tracking-widest border border-[var(--accent-main)]/30">
              Powered by Gemini
            </span>
          </h2>
        </div>
        <button 
          onClick={fetchTips} 
          disabled={isLoading}
          className="p-1.5 rounded-lg bg-[#112417] text-[#8ea496] hover:text-[var(--accent-main)] transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="min-h-[100px] flex flex-col justify-center">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center space-y-3 py-4">
            <Activity className="w-6 h-6 text-[var(--accent-main)] animate-bounce" />
            <span className="text-xs text-[#5c7566] tracking-widest uppercase animate-pulse">
              Analyzing Biomarkers...
            </span>
          </div>
        ) : error ? (
          <div className="text-center text-[#ef4444] text-xs py-2">
            {error}
          </div>
        ) : (
          <ul className="space-y-3">
            {tips.map((tip, idx) => (
              <li key={idx} className="flex items-start space-x-2.5">
                <span className="w-5 h-5 rounded-full bg-[#112417] text-[var(--accent-main)] border border-[#1b3424] flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className="text-xs text-[#a0b5a8] leading-relaxed">
                  {tip}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
