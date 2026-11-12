import React, { useState, useEffect } from 'react';
import { X, Play, Pause, FastForward, Timer, Flame, CheckCircle2 } from 'lucide-react';
import { Workout } from '../../types';

interface PreWorkoutPrepModalProps {
  workout: Workout;
  onClose: () => void;
  onSkipOrComplete: () => void;
}

interface StretchingMove {
  name: string;
  duration: number; // in seconds
  description: string;
}

export const PreWorkoutPrepModal: React.FC<PreWorkoutPrepModalProps> = ({ workout, onClose, onSkipOrComplete }) => {
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  
  // Determine routine based on difficulty and category
  const routine: StretchingMove[] = React.useMemo(() => {
    let moves: StretchingMove[] = [];
    
    if (workout.category === 'Cardio') {
      moves = [
        { name: 'Light Jog in Place', duration: 60, description: 'Get the heart rate up slightly.' },
        { name: 'High Knees', duration: 60, description: 'Warm up the legs and core.' },
        { name: 'Leg Swings (Front/Back)', duration: 60, description: 'Open up the hip flexors.' },
        { name: 'Ankle Circles', duration: 60, description: 'Prepare the ankles for impact.' },
        { name: 'Torso Twists', duration: 60, description: 'Loosen the core.' }
      ];
    } else if (workout.category === 'Strength') {
       if (workout.difficulty === 'Advanced') {
          moves = [
            { name: 'Jumping Jacks', duration: 60, description: 'Full body temperature increase.' },
            { name: 'World\'s Greatest Stretch', duration: 60, description: 'Deep hip and thoracic spine opener.' },
            { name: 'Shoulder Dislocates (with band/stick)', duration: 60, description: 'Open up the shoulder girdle.' },
            { name: 'Deep Squat Hold', duration: 60, description: 'Improve ankle and hip mobility.' },
            { name: 'Inchworms', duration: 60, description: 'Warm up the posterior chain and core.' }
          ];
       } else {
          moves = [
            { name: 'Arm Circles', duration: 60, description: 'Forward and backward to loosen shoulders.' },
            { name: 'Torso Twists', duration: 60, description: 'Rotate core side to side.' },
            { name: 'Bodyweight Squats', duration: 60, description: 'Slow and controlled.' },
            { name: 'Alternating Lunges', duration: 60, description: 'Warm up quads and glutes.' },
            { name: 'Plank Hold', duration: 60, description: 'Activate the core.' }
          ];
       }
    } else { // Bodyweight, Mobility, etc.
      moves = [
        { name: 'Neck Rolls', duration: 60, description: 'Gently roll the neck.' },
        { name: 'Arm Circles', duration: 60, description: 'Warm up shoulders.' },
        { name: 'Hip Circles', duration: 60, description: 'Loosen the lower back and hips.' },
        { name: 'High Knees', duration: 60, description: 'Increase heart rate.' },
        { name: 'Cat-Cow', duration: 60, description: 'Spinal mobility.' }
      ];
    }
    return moves;
  }, [workout.category, workout.difficulty]);

  useEffect(() => {
    setTimeLeft(routine[currentMoveIndex].duration);
  }, [currentMoveIndex, routine]);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      if (currentMoveIndex < routine.length - 1) {
        setCurrentMoveIndex(i => i + 1);
      } else {
        setIsActive(false);
        // Completed
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, currentMoveIndex, routine.length]);

  const toggleTimer = () => setIsActive(!isActive);

  const nextMove = () => {
    if (currentMoveIndex < routine.length - 1) {
      setCurrentMoveIndex(i => i + 1);
      setIsActive(true);
    } else {
      setTimeLeft(0);
      setIsActive(false);
    }
  };

  const prevMove = () => {
    if (currentMoveIndex > 0) {
      setCurrentMoveIndex(i => i - 1);
      setIsActive(true);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const currentMove = routine[currentMoveIndex];
  const isFinished = timeLeft === 0 && currentMoveIndex === routine.length - 1;

  return (
    <div className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#09130d] border border-[var(--accent-main)]/50 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        <div className="p-4 border-b border-[#1b3424] flex items-center justify-between bg-[#0c1811]">
          <div className="flex items-center space-x-3">
            <Flame className="w-5 h-5 text-[var(--accent-main)]" />
            <h2 className="font-['Cinzel'] text-xl font-bold text-[#f5ebd7]">
              Pre-Workout Prep
            </h2>
          </div>
          <button onClick={onClose} className="p-2 text-[#8ea496] hover:text-[var(--accent-main)] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 flex flex-col items-center justify-center space-y-6">
          <div className="text-center">
             <span className="text-[10px] font-bold text-[#8ea496] tracking-widest uppercase mb-1 block">
               DYNAMIC WARM-UP • {workout.difficulty}
             </span>
             <h3 className="text-2xl font-black text-[#f5ebd7]">{currentMove.name}</h3>
             <p className="text-sm text-[#5c7566] mt-2">{currentMove.description}</p>
          </div>

          <div className="relative w-48 h-48 flex items-center justify-center">
             <svg className="absolute inset-0 w-full h-full -rotate-90">
               <circle cx="96" cy="96" r="88" className="stroke-[#1b3424] fill-none" strokeWidth="8" />
               <circle 
                 cx="96" 
                 cy="96" 
                 r="88" 
                 className="stroke-[var(--accent-main)] fill-none transition-all duration-1000 linear" 
                 strokeWidth="8" 
                 strokeDasharray={2 * Math.PI * 88}
                 strokeDashoffset={(2 * Math.PI * 88) * (1 - timeLeft / currentMove.duration)}
                 strokeLinecap="round"
               />
             </svg>
             <div className="text-5xl font-black text-[#f5ebd7] font-mono tracking-tighter">
               {formatTime(timeLeft)}
             </div>
          </div>

          <div className="flex items-center justify-center space-x-6">
            <button 
              onClick={prevMove} 
              disabled={currentMoveIndex === 0}
              className="p-3 rounded-full bg-[#112417] text-[#8ea496] hover:text-[#f5ebd7] disabled:opacity-50 transition-colors"
            >
               <FastForward className="w-5 h-5 rotate-180" />
            </button>
            <button 
              onClick={toggleTimer} 
              className="w-16 h-16 rounded-full bg-[var(--accent-main)] text-[#0a150e] flex items-center justify-center hover:bg-[var(--accent-hover)] transition-colors shadow-lg shadow-[var(--accent-main)]/20"
            >
               {isActive ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
            </button>
            <button 
              onClick={nextMove}
              disabled={isFinished}
              className="p-3 rounded-full bg-[#112417] text-[#8ea496] hover:text-[#f5ebd7] disabled:opacity-50 transition-colors"
            >
               <FastForward className="w-5 h-5" />
            </button>
          </div>

          <div className="w-full flex space-x-1 mt-4">
            {routine.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-1.5 flex-1 rounded-full ${idx < currentMoveIndex ? 'bg-[var(--accent-main)]' : idx === currentMoveIndex ? 'bg-[var(--accent-main)]/50 animate-pulse' : 'bg-[#1b3424]'}`}
              />
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-[#1b3424] bg-[#0c1811] flex flex-col sm:flex-row gap-3">
           <button 
             onClick={onSkipOrComplete}
             className="w-full py-3 rounded-xl bg-[#143a25] hover:bg-[#1b4b30] text-[#f5ebd7] text-xs font-bold flex items-center justify-center space-x-2 border border-[#225838] transition-all shadow-md active:scale-98"
           >
             {isFinished ? <CheckCircle2 className="w-4 h-4 text-[var(--accent-main)]" /> : <FastForward className="w-4 h-4 text-[#8ea496]" />}
             <span>{isFinished ? 'CONTINUE TO WORKOUT' : 'SKIP WARM-UP & START'}</span>
           </button>
        </div>
      </div>
    </div>
  );
};
