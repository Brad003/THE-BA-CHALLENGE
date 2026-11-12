import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, Edit2, Check, X, Target, Bell } from 'lucide-react';
import { CompletionSpark } from '../common/CompletionSpark';

export const DailyGoals: React.FC = () => {
  const { user, toggleDailyHabit, editDailyHabit, triggerCelebration, updateUserProfile } = useApp();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [showReminderPicker, setShowReminderPicker] = useState(false);
  const [reminderTime, setReminderTime] = useState(user.habitReminderTime || '');
  
  // Track which habit just got completed for the spark
  const [sparkingHabitId, setSparkingHabitId] = useState<string | null>(null);

  if (!user.dailyHabits || user.dailyHabits.length === 0) return null;

  const startEdit = (id: string, currentLabel: string) => {
    setEditingId(id);
    setEditValue(currentLabel);
  };

  const saveEdit = (id: string) => {
    if (editValue.trim()) {
      editDailyHabit(id, editValue.trim());
    }
    setEditingId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter') saveEdit(id);
    if (e.key === 'Escape') setEditingId(null);
  };

  const allCompleted = user.dailyHabits.every(h => h.completed);

  const handleToggle = (id: string, currentlyCompleted: boolean) => {
    toggleDailyHabit(id);
    
    if (!currentlyCompleted) {
      setSparkingHabitId(id);
      setTimeout(() => {
        setSparkingHabitId(null);
      }, 1500);

      const willBeCompleted = user.dailyHabits.every(h => h.id === id || h.completed);
      if (willBeCompleted) {
        triggerCelebration('habit');
      }
    }
  };

  const saveReminder = () => {
    updateUserProfile({ habitReminderTime: reminderTime });
    setShowReminderPicker(false);
  };

  return (
    <div className={`p-5 rounded-3xl border transition-all duration-500 ${allCompleted ? 'bg-[#12291b] border-[#29633e]' : 'bg-[#0a150e] border-[#1b3826]'} space-y-4 relative`}>
      {allCompleted && <CompletionSpark trigger={allCompleted} />}
      
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center space-x-2">
          <Target className={`w-4 h-4 ${allCompleted ? 'text-[#22c55e]' : 'text-[var(--accent-main)]'}`} />
          <h3 className="font-['Cinzel'] font-bold text-sm text-[#f5ebd7]">
            DAILY NON-WORKOUT HABITS
          </h3>
        </div>
        
        <div className="flex items-center space-x-3">
          {allCompleted ? (
            <span className="text-xs font-bold text-[#22c55e] animate-pulse uppercase tracking-widest">
              Cleared
            </span>
          ) : (
            <div className="relative">
              {showReminderPicker ? (
                <div className="flex items-center space-x-2 bg-[#0d1a12] border border-[#2b5138] rounded-xl px-2 py-1">
                  <input
                    type="time"
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                    className="bg-transparent text-xs text-[#86efac] focus:outline-none"
                  />
                  <button onClick={saveReminder} className="text-[#86efac] hover:text-[#4ade80]">
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setShowReminderPicker(false)} className="text-[#f87171] hover:text-[#fca5a5]">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowReminderPicker(true)}
                  className={`flex items-center space-x-1 text-xs font-bold transition-colors ${
                    user.habitReminderTime ? 'text-[#86efac] hover:text-[#4ade80]' : 'text-[#5c7566] hover:text-[var(--accent-main)]'
                  }`}
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>{user.habitReminderTime || 'Set Reminder'}</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        {user.dailyHabits.map(habit => (
          <div key={habit.id} className={`relative flex items-center justify-between p-3.5 rounded-2xl transition-all ${habit.completed ? 'bg-[#0d1f14] border border-[#21432f]' : 'bg-[#0e1c14] border border-[#22402d]'}`}>
            <CompletionSpark trigger={sparkingHabitId === habit.id} />
            
            {editingId === habit.id ? (
              <div className="flex-1 flex items-center space-x-3 z-10">
                <input 
                  type="text" 
                  value={editValue} 
                  onChange={e => setEditValue(e.target.value)}
                  onKeyDown={e => handleKeyDown(e, habit.id)}
                  className="flex-1 bg-transparent border-b border-[var(--accent-main)] text-sm text-[#f5ebd7] focus:outline-none focus:border-[var(--accent-hover)] pb-1"
                  autoFocus
                />
                <button onClick={() => saveEdit(habit.id)} className="text-[#22c55e] hover:text-[#4ade80] transition-colors p-1">
                  <Check className="w-4 h-4" />
                </button>
                <button onClick={() => setEditingId(null)} className="text-[#ef4444] hover:text-[#f87171] transition-colors p-1">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-between group z-10">
                <div 
                  className="flex-1 flex items-center space-x-3 cursor-pointer" 
                  onClick={() => handleToggle(habit.id, habit.completed)}
                >
                  <button className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${habit.completed ? 'bg-[#22c55e] text-[#07150c]' : 'border-2 border-[#41684f]'}`}>
                    {habit.completed && <CheckCircle2 className="w-4 h-4" />}
                  </button>
                  <span className={`text-sm font-semibold transition-all ${habit.completed ? 'text-[#7d9987] line-through' : 'text-[#e8ebe9]'}`}>
                    {habit.label}
                  </span>
                </div>
                <button 
                  onClick={() => startEdit(habit.id, habit.label)} 
                  className="opacity-0 group-hover:opacity-100 p-1.5 text-[#5c7566] hover:text-[var(--accent-main)] transition-all ml-2"
                  title="Edit Habit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
