import React, { useState, useEffect } from 'react';
import { Activity, Flame, Shield, Trophy, Target, ArrowRight } from 'lucide-react';

const MOCK_ACTIVITIES = [
  { id: 1, user: "Brother Marcus", action: "completed his 100th workout", type: "milestone", time: "2 mins ago", icon: Trophy, color: "text-yellow-500" },
  { id: 2, user: "Brother David", action: "logged a 10km ruck march", type: "workout", time: "15 mins ago", icon: Flame, color: "text-orange-500" },
  { id: 3, user: "Brother James", action: "earned the 'Iron Will' badge", type: "badge", time: "1 hour ago", icon: Shield, color: "text-[var(--accent-main)]" },
  { id: 4, user: "Brother Michael", action: "crushed the daily mobility routine", type: "workout", time: "2 hours ago", icon: Activity, color: "text-green-500" },
  { id: 5, user: "Brother Thomas", action: "hit a 30-day discipline streak", type: "streak", time: "3 hours ago", icon: Target, color: "text-blue-500" },
];

export const GlobalActivityFeed: React.FC = () => {
  const [activities, setActivities] = useState(MOCK_ACTIVITIES);

  // In a real app, this would poll or listen to a WebSocket for new global events.
  // We'll simulate a new event every 30 seconds for immersion.
  useEffect(() => {
    const interval = setInterval(() => {
      const newEvent = {
        id: Date.now(),
        user: "Brother John",
        action: "just logged an intense strength session",
        type: "workout",
        time: "Just now",
        icon: Flame,
        color: "text-orange-500"
      };
      setActivities(prev => [newEvent, ...prev.slice(0, 4)]);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#09130d] border border-[#1b3826] rounded-3xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-[var(--accent-main)]" />
          <h3 className="text-sm font-bold text-[#f5ebd7] uppercase tracking-wider">Global Activity Feed</h3>
        </div>
        <span className="text-[10px] text-[#8ea496] bg-[#132c1c] px-2 py-1 rounded border border-[#1e4028] flex items-center space-x-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span>LIVE</span>
        </span>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div key={activity.id} className="flex items-start space-x-3 group animate-in slide-in-from-right-4 fade-in duration-500">
              <div className="w-8 h-8 rounded-full bg-[#13281b] border border-[#1d4029] flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                <Icon className={`w-3.5 h-3.5 ${activity.color}`} />
              </div>
              <div className="flex-1">
                <p className="text-xs text-[#d8e3dc] leading-relaxed">
                  <span className="font-bold text-[var(--accent-main)]">{activity.user}</span> {activity.action}
                </p>
                <span className="text-[10px] text-[#738f7d] mt-1 block">{activity.time}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
