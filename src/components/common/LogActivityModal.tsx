import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ActivityLog } from '../../types';
import { X, Zap, Clock, Flame, Footprints, FileText, Compass, Check } from 'lucide-react';

export const LogActivityModal: React.FC = () => {
  const {
    showLogActivity,
    setShowLogActivity,
    logCustomActivity,
    setShowOutdoorTracker,
    setOutdoorTrackerInitialMode
  } = useApp();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Strength' | 'Bodyweight' | 'Cardio' | 'Mobility'>('Cardio');
  const [duration, setDuration] = useState(30);
  const [calories, setCalories] = useState(250);
  const [steps, setSteps] = useState(4000);
  const [rpe, setRpe] = useState(7);
  const [trailNotes, setTrailNotes] = useState('');

  if (!showLogActivity) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newLog: ActivityLog = {
      id: `act-${Date.now()}`,
      title: title.trim(),
      category,
      durationMinutes: duration,
      caloriesBurned: calories,
      stepsRecorded: steps > 0 ? steps : undefined,
      rpe,
      notes: trailNotes.trim() || undefined,
      date: 'Today',
      xpEarned: Math.round(duration * 4 + 50)
    };

    logCustomActivity(title.trim(), category, duration, calories, rpe);
    setShowLogActivity(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#070f0a] border border-[#1b3d29] rounded-3xl p-5 sm:p-6 shadow-2xl my-auto text-[#f4f1ea]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#14261b] pb-3 mb-4">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-[#142e1d] text-[#34d399] border border-[#235335]">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[var(--accent-main)] uppercase tracking-wider">
                ACTIVITY TRACKER
              </span>
              <h2 className="text-lg font-bold font-['Cinzel'] text-[#f5ebd7]">
                Log Training or Trail Session
              </h2>
            </div>
          </div>
          <button
            onClick={() => setShowLogActivity(false)}
            className="p-1.5 rounded-full bg-[#0e1811] text-[#869f8f] hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
 
        {/* GPS Outdoor Tracker Quick Launch */}
        <div className="mb-4 p-3 rounded-2xl bg-[#0a1e12] border border-[#1b432a] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-[#143d24] text-[#34d399]">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#f5ebd7]">Live GPS Walking, Hike & Run</h4>
              <p className="text-[10px] text-[#7d9385]">
                Real-time maps, step counter & elevation profile tracking
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setShowLogActivity(false);
              setOutdoorTrackerInitialMode('walk');
              setShowOutdoorTracker(true);
            }}
            className="px-3 py-1.5 rounded-xl bg-[#10b981] hover:bg-[#059669] text-[#051108] text-[11px] font-black uppercase tracking-wider transition-all"
          >
            Launch GPS
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {/* Title */}
          <div>
            <label className="text-[#8ea496] block mb-1 font-semibold">Activity Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 5km Ngong Hills Trail Ruck or Morning Push-up Circuit"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d1c13] border border-[#1e3d29] text-[#f4f1ea] focus:outline-none focus:border-[var(--accent-main)]"
            />
          </div>

          {/* Category */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(['Cardio', 'Bodyweight', 'Strength', 'Mobility'] as const).map((cat) => (
              <button
                type="button"
                key={cat}
                onClick={() => setCategory(cat)}
                className={`py-2 rounded-xl font-bold border transition-all text-center ${
                  category === cat
                    ? 'bg-[#183d28] border-[var(--accent-main)] text-[#86efac]'
                    : 'bg-[#0a150e] border-[#183121] text-[#738f7d]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Duration & Calories */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[#8ea496] block mb-1 font-semibold flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-[var(--accent-main)]" />
                <span>Duration (minutes)</span>
              </label>
              <input
                type="number"
                min="1"
                max="300"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-[#0d1c13] border border-[#1e3d29] text-[#f4f1ea] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[#8ea496] block mb-1 font-semibold flex items-center space-x-1">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                <span>Est. Calories (kcal)</span>
              </label>
              <input
                type="number"
                min="0"
                max="3000"
                value={calories}
                onChange={(e) => setCalories(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-[#0d1c13] border border-[#1e3d29] text-[#f4f1ea] focus:outline-none"
              />
            </div>
          </div>

          {/* Steps & RPE */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[#8ea496] block mb-1 font-semibold flex items-center space-x-1">
                <Footprints className="w-3.5 h-3.5 text-emerald-400" />
                <span>Steps Recorded</span>
              </label>
              <input
                type="number"
                min="0"
                max="50000"
                value={steps}
                onChange={(e) => setSteps(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-[#0d1c13] border border-[#1e3d29] text-[#f4f1ea] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[#8ea496] block mb-1 font-semibold">
                Perceived Exertion (RPE 1-10): <span className="text-[var(--accent-main)]">{rpe}/10</span>
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={rpe}
                onChange={(e) => setRpe(Number(e.target.value))}
                className="w-full accent-[var(--accent-main)] mt-2"
              />
            </div>
          </div>

          {/* Notes & Route */}
          <div>
            <label className="text-[#8ea496] block mb-1 font-semibold">
              Trail Notes / Equipment Used
            </label>
            <textarea
              rows={2}
              value={trailNotes}
              onChange={(e) => setTrailNotes(e.target.value)}
              placeholder="e.g. 10kg weighted vest, muddy trails, steady cadence..."
              className="w-full px-3 py-2 rounded-xl bg-[#0d1c13] border border-[#1e3d29] text-[#f4f1ea] placeholder-[#516b5b] focus:outline-none resize-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[var(--accent-main)] to-[var(--accent-grad)] text-[#07130c] font-black uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg hover:scale-101 active:scale-98 transition-all"
          >
            <Check className="w-4 h-4" />
            <span>RECORD & EARN +{Math.round(duration * 4 + 50)} XP</span>
          </button>
        </form>
      </div>
    </div>
  );
};
