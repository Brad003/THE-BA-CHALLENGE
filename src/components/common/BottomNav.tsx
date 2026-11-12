import React from 'react';
import { useApp } from '../../context/AppContext';
import { Home, Dumbbell, Target, Users, User, PlusCircle } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, setShowLogActivity } = useApp();

  const navItems: { id: 'home' | 'train' | 'challenges' | 'community' | 'profile'; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'train', label: 'Train', icon: Dumbbell },
    { id: 'challenges', label: 'Discipline', icon: Target },
    { id: 'community', label: 'Brotherhood', icon: Users },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-[#070c09]/95 backdrop-blur-lg border-t border-[#1a2f22] max-w-lg mx-auto shadow-2xl pb-safe">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              id={`btn-nav-${item.id}`}
              className={`flex flex-col items-center justify-center flex-1 py-1 px-1 transition-all duration-200 relative ${
                isActive ? 'text-[var(--accent-bright)]' : 'text-[#7d9385] hover:text-[#b4c4b9]'
              }`}
            >
              {isActive && (
                <div className="absolute -top-2 w-8 h-1 bg-[var(--accent-main)] rounded-full shadow-[0_0_8px_var(--accent-main)]" />
              )}
              <div
                className={`p-1 rounded-xl transition-all ${
                  isActive ? 'bg-[#14291c] text-[#f0cb64]' : ''
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              </div>
              <span className={`text-[10px] tracking-wide font-medium mt-0.5 ${isActive ? 'font-bold' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}

        {/* Quick Floating Log Action Button in center or right */}
        <button
          onClick={() => setShowLogActivity(true)}
          id="btn-nav-quick-log"
          className="flex flex-col items-center justify-center px-2 py-1 text-[#22c55e] hover:text-[#4ade80] transition-transform hover:scale-105"
          title="Quick Log Activity"
        >
          <div className="p-1 rounded-full bg-[#0d2a1a] border border-[#235837]">
            <PlusCircle className="w-5 h-5 text-[#34d399]" />
          </div>
          <span className="text-[10px] font-medium mt-0.5 text-[#34d399]">Log</span>
        </button>
      </div>
    </nav>
  );
};
