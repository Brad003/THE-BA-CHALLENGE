import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import { useApp } from '../../context/AppContext';
import { PANTHER_LEVELS } from '../../data/initialData';
import { X, Share2, Download, Flame, Award, TreePine, Zap } from 'lucide-react';
import { RealisticEmblem } from '../common/RealisticEmblem';

interface Props {
  onClose: () => void;
}

export const ShareProgressModal: React.FC<Props> = ({ onClose }) => {
  const { user, currentLevelInfo } = useApp();
  const cardRef = useRef<HTMLDivElement>(null);

  const handleShare = async () => {
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#040906',
        scale: 2,
        useCORS: true,
      });
      const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'));
      
      if (!blob) return;

      const file = new File([blob], 'panther-progress.png', { type: 'image/png' });

      // Check if native share is supported and can share files
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'My Panther Brotherhood Progress',
          text: `Check out my progress in Panther Brotherhood! I'm Level ${user.pantherLevel} with a ${user.streak.current} day streak!`,
          files: [file],
        });
      } else {
        // Fallback to download
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'panther-progress.png';
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Error sharing progress:', err);
      // Fallback if html2canvas fails
      if (navigator.share) {
         await navigator.share({
          title: 'My Panther Brotherhood Progress',
          text: `I'm a Level ${user.pantherLevel} Panther with ${user.xp} XP and a ${user.streak.current} day discipline streak! Join me in the Brotherhood.`,
        });
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0a150e] border border-[#1b3826] w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-[#1b3826] flex justify-between items-center bg-[#060c08]">
          <h2 className="text-[#f5ebd7] font-['Cinzel'] font-bold flex items-center space-x-2">
            <Share2 className="w-5 h-5 text-[var(--accent-main)]" />
            <span>Share Progress</span>
          </h2>
          <button onClick={onClose} className="p-2 text-[#5c7566] hover:text-[var(--accent-main)] transition-colors rounded-full hover:bg-[#12291b]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex flex-col items-center space-y-6">
          <p className="text-sm text-[#8ea496] text-center">
            Generate your Panther Progress Card and share it with your brothers or on social media to inspire others.
          </p>

          {/* The Shareable Card */}
          <div 
            ref={cardRef} 
            className="w-full bg-gradient-to-br from-[#0e2417] via-[#09150e] to-[#040906] p-6 rounded-2xl border border-[#1e452b] relative overflow-hidden shadow-2xl"
          >
            {/* Subtle background element */}
            <div className="absolute top-0 right-0 -mt-8 -mr-8 text-[var(--accent-main)]/5">
               <svg viewBox="0 0 24 24" fill="currentColor" className="w-48 h-48">
                 <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
               </svg>
            </div>
            
            <div className="relative z-10 flex flex-col items-center space-y-4">
              {/* Header */}
              <div className="text-center space-y-1">
                <h3 className="text-[var(--accent-main)] font-bold text-[10px] tracking-widest uppercase">Panther Brotherhood</h3>
                <h2 className="text-xl font-['Cinzel'] font-bold text-[#f5ebd7]">{user.fullName}</h2>
                <div className="flex items-center justify-center space-x-2 text-xs text-[#86efac]">
                  {currentLevelInfo?.badgeIcon && (
                    <RealisticEmblem
                      icon={currentLevelInfo.badgeIcon}
                      size="sm"
                      variant="gold"
                      showHalo
                    />
                  )}
                  <span className="font-bold">LEVEL {user.pantherLevel}</span>
                </div>
              </div>

              {/* Avatar (Optional: might be tricky with html2canvas and external URLs due to CORS, but try) */}
              <img 
                src={user.avatarUrl} 
                alt={user.fullName} 
                className="w-20 h-20 rounded-2xl object-cover ring-2 ring-[var(--accent-main)] shadow-lg"
                crossOrigin="anonymous"
              />

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 w-full mt-2">
                <div className="bg-[#050b07] border border-[#12291b] rounded-xl p-3 text-center flex flex-col items-center">
                   <Flame className="w-5 h-5 text-amber-500 mb-1" />
                   <span className="text-lg font-black text-[#f5ebd7]">{user.streak.current}</span>
                   <span className="text-[9px] text-[#7d9987] uppercase tracking-wider">Day Streak</span>
                </div>
                <div className="bg-[#050b07] border border-[#12291b] rounded-xl p-3 text-center flex flex-col items-center">
                   <Zap className="w-5 h-5 text-[var(--accent-main)] mb-1" />
                   <span className="text-lg font-black text-[#f5ebd7]">{user.xp}</span>
                   <span className="text-[9px] text-[#7d9987] uppercase tracking-wider">Total XP</span>
                </div>
                <div className="bg-[#050b07] border border-[#12291b] rounded-xl p-3 text-center flex flex-col items-center">
                   <Award className="w-5 h-5 text-[#38bdf8] mb-1" />
                   <span className="text-lg font-black text-[#f5ebd7]">{user.hikesCompleted}</span>
                   <span className="text-[9px] text-[#7d9987] uppercase tracking-wider">Workouts</span>
                </div>
                <div className="bg-[#050b07] border border-[#12291b] rounded-xl p-3 text-center flex flex-col items-center">
                   <TreePine className="w-5 h-5 text-[#22c55e] mb-1" />
                   <span className="text-lg font-black text-[#f5ebd7]">{user.treesPlanted}</span>
                   <span className="text-[9px] text-[#7d9987] uppercase tracking-wider">Trees Planted</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-[#1b3826] bg-[#060c08] flex justify-end">
          <button
            onClick={handleShare}
            className="w-full py-3 rounded-xl bg-[var(--accent-main)] hover:bg-[var(--accent-hover)] text-[#040906] font-bold flex items-center justify-center space-x-2 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>Share Progress</span>
          </button>
        </div>
      </div>
    </div>
  );
};
