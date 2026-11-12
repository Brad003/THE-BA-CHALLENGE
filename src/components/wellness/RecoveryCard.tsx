import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Activity } from 'lucide-react';

const RECOVERY_TIPS = {
  highIntensity: [
    { title: "Deep Stretching & Mobility", desc: "Your nervous system is strained. Spend 15 minutes doing deep, static stretching targeting the hips, hamstrings, and thoracic spine." },
    { title: "Cold Exposure / Ice Bath", desc: "Reduce systemic inflammation. Aim for 3-5 minutes in cold water, followed by natural re-warming to stimulate recovery." },
    { title: "Foam Rolling Protocol", desc: "Break up myofascial adhesions. Focus on the quads, calves, and lats for 2 minutes each." }
  ],
  activeRecovery: [
    { title: "Light Ruck or Walk", desc: "Get blood flowing without straining the central nervous system. A 30-minute light walk will flush out lactic acid." },
    { title: "Dynamic Yoga Flow", desc: "Maintain joint mobility. A gentle 20-minute vinyasa flow focuses on breathing and structural alignment." },
    { title: "Active Rest Day", desc: "Keep moving, but keep the intensity low. Today is about recovery, not PRs." }
  ],
  general: [
    { title: "Hydration & Sleep", desc: "The foundation of recovery. Ensure you drink at least 3 liters of water and aim for 8 hours of deep sleep." },
    { title: "Mobility Maintenance", desc: "Spend 10 minutes moving through your full range of motion. Keep the joints lubricated." },
    { title: "Breathwork Down-regulation", desc: "Use box breathing for 5 minutes to shift from a sympathetic (fight/flight) to parasympathetic (rest/digest) state." }
  ]
};

export const RecoveryCard: React.FC = () => {
  const { activityLogs } = useApp();

  const tip = useMemo(() => {
    const today = new Date();
    const seed = today.getFullYear() * 1000 + today.getMonth() * 100 + today.getDate();
    
    // Calculate average RPE of the last 3 activities
    const recentLogs = [...activityLogs]
      .filter(log => log.rpe !== undefined)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3);
      
    let category: 'highIntensity' | 'activeRecovery' | 'general' = 'general';
    
    if (recentLogs.length > 0) {
      const avgRpe = recentLogs.reduce((sum, log) => sum + (log.rpe || 0), 0) / recentLogs.length;
      if (avgRpe >= 7.5) {
        category = 'highIntensity';
      } else {
        category = 'activeRecovery';
      }
    }
    
    const pool = RECOVERY_TIPS[category];
    const selected = pool[seed % pool.length];
    
    return { ...selected, category };
  }, [activityLogs]);

  return (
    <div className="p-4 rounded-2xl bg-[#0d1611] border border-[#1b3123] mt-4 space-y-3">
      <div className="flex items-center space-x-2">
        <Activity className={`w-4 h-4 ${tip.category === 'highIntensity' ? 'text-red-400' : 'text-[#86efac]'}`} />
        <h4 className="text-sm font-bold text-[#f5ebd7]">Prescribed Recovery</h4>
      </div>
      <div>
        <h5 className="text-xs font-bold text-[var(--accent-main)]">{tip.title}</h5>
        <p className="text-[11px] text-[#a4baa9] mt-1 leading-relaxed">{tip.desc}</p>
      </div>
    </div>
  );
};
