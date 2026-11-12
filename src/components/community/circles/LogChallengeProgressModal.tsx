import React, { useState } from 'react';
import { X, Plus, Target, CheckCircle2, Flame, Trophy } from 'lucide-react';
import { CircleChallenge } from '../../../types';

interface LogChallengeProgressModalProps {
  isOpen: boolean;
  challenge: CircleChallenge | null;
  circleId: string;
  onClose: () => void;
  onSubmit: (addedValue: number, note?: string) => void;
}

export const LogChallengeProgressModal: React.FC<LogChallengeProgressModalProps> = ({
  isOpen,
  challenge,
  circleId,
  onClose,
  onSubmit
}) => {
  const [valueToAdd, setValueToAdd] = useState<number>(0);
  const [note, setNote] = useState('');

  if (!isOpen || !challenge) return null;

  // Find current user's progress
  const userParticipant = challenge.participants.find(
    (p) => p.memberName.includes('You') || p.memberId === 'current-user'
  );
  const currentVal = userParticipant ? userParticipant.currentValue : 0;
  const remaining = Math.max(0, Math.round((challenge.targetValue - currentVal) * 10) / 10);
  const projectedVal = Math.round((currentVal + (Number(valueToAdd) || 0)) * 10) / 10;
  const willComplete = projectedVal >= challenge.targetValue && currentVal < challenge.targetValue;

  // Quick increment buttons based on metric
  const getQuickButtons = () => {
    switch (challenge.metric) {
      case 'reps':
        return [25, 50, 100, 200];
      case 'distance':
        return [3, 5, 10, 15];
      case 'elevation':
        return [100, 250, 500, 1000];
      case 'workouts':
        return [1, 2];
      case 'calories':
        return [250, 500, 750, 1000];
      default:
        return [1, 5, 10];
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (valueToAdd <= 0) return;
    onSubmit(Number(valueToAdd), note.trim() || undefined);
    setValueToAdd(0);
    setNote('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-[#0c1911] border border-[#234e32] rounded-2xl shadow-2xl p-6 text-[#f4f1ea]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-[#789a83] hover:text-[#e4efe8] hover:bg-[#153421] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-[#143422] border border-[#2d6844] flex items-center justify-center">
            <Flame className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#86efac] tracking-widest uppercase">
              Log Brotherhood Progress
            </span>
            <h2 className="text-lg font-bold font-['Cinzel'] text-[#f5ebd7] line-clamp-1">
              {challenge.title}
            </h2>
          </div>
        </div>

        {/* Current Standing Card */}
        <div className="p-3.5 bg-[#07110b] border border-[#1b3b27] rounded-xl mb-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#8ca595]">Your Logged Progress:</span>
            <span className="font-bold text-[#f5ebd7]">
              {currentVal} / {challenge.targetValue} {challenge.metricUnit}
            </span>
          </div>

          <div className="w-full bg-[#13271b] rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-green-400 transition-all duration-300"
              style={{
                width: `${Math.min(100, Math.round((currentVal / challenge.targetValue) * 100))}%`
              }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#718d7c]">
            <span>{Math.round((currentVal / challenge.targetValue) * 100)}% Complete</span>
            <span>{remaining > 0 ? `${remaining} ${challenge.metricUnit} remaining` : 'Target Met! 🎉'}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Progress to Add */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#a7c4b1] mb-1.5">
              Add Today&apos;s Progress ({challenge.metricUnit}) *
            </label>
            <div className="relative">
              <input
                type="number"
                required
                autoFocus
                min={0.1}
                step="any"
                value={valueToAdd || ''}
                onChange={(e) => setValueToAdd(parseFloat(e.target.value) || 0)}
                placeholder={`e.g. 10`}
                className="w-full pl-3.5 pr-14 py-3 bg-[#07110b] border border-[#1d3d28] rounded-xl text-lg font-bold text-[#4ade80] placeholder-[#4f6f5b] focus:outline-none focus:border-[#4ade80]"
              />
              <span className="absolute right-3.5 top-3.5 text-xs text-[#718d7c] font-medium">
                {challenge.metricUnit}
              </span>
            </div>
          </div>

          {/* Quick Increment Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1">
            <span className="text-[10px] text-[#698574] shrink-0 font-medium">Quick:</span>
            {getQuickButtons().map((inc) => (
              <button
                key={inc}
                type="button"
                onClick={() => setValueToAdd((prev) => Math.round(((prev || 0) + inc) * 10) / 10)}
                className="px-2.5 py-1 bg-[#143422] hover:bg-[#1e4c32] border border-[#27643f] rounded-lg text-xs font-bold text-[#86efac] transition-colors"
              >
                +{inc}
              </button>
            ))}
          </div>

          {/* Optional Note for Circle Feed */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#a7c4b1] mb-1.5">
              Brotherhood Note (Optional)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Morning 5am trail lap, strict chest-to-deck form"
              className="w-full px-3.5 py-2.5 bg-[#07110b] border border-[#1d3d28] rounded-xl text-sm text-[#f4f1ea] placeholder-[#4f6f5b] focus:outline-none focus:border-[#4ade80]"
            />
          </div>

          {/* Projected Completion Highlight */}
          {willComplete && (
            <div className="p-3 bg-gradient-to-r from-amber-950/60 to-emerald-950/60 border border-yellow-500/60 rounded-xl flex items-center space-x-2.5 text-xs text-yellow-200">
              <Trophy className="w-5 h-5 text-yellow-400 shrink-0 animate-bounce" />
              <div>
                <span className="font-bold">Victory Imminent!</span>
                <p className="text-[11px] text-yellow-300/80">
                  This entry completes the challenge target! You will claim +{challenge.xpReward} XP for your rank.
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#183122]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#8ba495] hover:text-[#e4efe8] hover:bg-[#142e1e] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={valueToAdd <= 0}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-black bg-[#4ade80] hover:bg-[#22c55e] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-green-900/30 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Log Progress (+{valueToAdd || 0})</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
