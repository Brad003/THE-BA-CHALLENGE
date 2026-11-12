import React, { useState } from 'react';
import { X, Swords, Trophy, Target, Calendar, Award, Sparkles } from 'lucide-react';
import { CircleChallengeCategory, CircleChallengeMetric } from '../../../types';

interface CreateChallengeModalProps {
  isOpen: boolean;
  circleId: string;
  circleName: string;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description: string;
    category: CircleChallengeCategory;
    metric: CircleChallengeMetric;
    metricUnit: string;
    targetValue: number;
    endDate: string;
    xpReward: number;
    badgeRewardName?: string;
  }) => void;
}

const METRICS: {
  metric: CircleChallengeMetric;
  label: string;
  defaultUnit: string;
  defaultTarget: number;
}[] = [
  { metric: 'distance', label: 'Distance', defaultUnit: 'km', defaultTarget: 50 },
  { metric: 'reps', label: 'Repetitions', defaultUnit: 'reps', defaultTarget: 500 },
  { metric: 'elevation', label: 'Elevation Gain', defaultUnit: 'meters', defaultTarget: 1500 },
  { metric: 'workouts', label: 'Workout Sessions', defaultUnit: 'sessions', defaultTarget: 14 },
  { metric: 'calories', label: 'Calories Burned', defaultUnit: 'kcal', defaultTarget: 5000 },
  { metric: 'streak', label: 'Day Streak', defaultUnit: 'days', defaultTarget: 14 }
];

const CATEGORIES: CircleChallengeCategory[] = [
  'Strength',
  'Endurance',
  'Trail & Elevation',
  'Daily Discipline',
  'Metabolic Burn'
];

export const CreateChallengeModal: React.FC<CreateChallengeModalProps> = ({
  isOpen,
  circleId,
  circleName,
  onClose,
  onSubmit
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<CircleChallengeCategory>('Endurance');
  const [metric, setMetric] = useState<CircleChallengeMetric>('distance');
  const [metricUnit, setMetricUnit] = useState('km');
  const [targetValue, setTargetValue] = useState<number>(50);
  const [durationDays, setDurationDays] = useState<number>(30);
  const [xpReward, setXpReward] = useState<number>(650);
  const [badgeRewardName, setBadgeRewardName] = useState('');

  if (!isOpen) return null;

  const handleMetricChange = (m: CircleChallengeMetric) => {
    setMetric(m);
    const config = METRICS.find((item) => item.metric === m);
    if (config) {
      setMetricUnit(config.defaultUnit);
      setTargetValue(config.defaultTarget);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || targetValue <= 0) return;

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + durationDays);

    onSubmit({
      title: title.trim(),
      description: description.trim() || `Complete ${targetValue} ${metricUnit} before the deadline. Earn respect among your circle brothers.`,
      category,
      metric,
      metricUnit: metricUnit.trim() || 'units',
      targetValue: Number(targetValue),
      endDate: endDate.toISOString().split('T')[0],
      xpReward: Number(xpReward) || 500,
      badgeRewardName: badgeRewardName.trim() || `${title.trim()} Crest`
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#0c1911] border border-[#234e32] rounded-2xl shadow-2xl p-6 text-[#f4f1ea] my-8 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-[#789a83] hover:text-[#e4efe8] hover:bg-[#153421] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-[#143422] border border-[#2d6844] flex items-center justify-center">
            <Swords className="w-6 h-6 text-[#86efac]" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#86efac] tracking-widest uppercase">
              {circleName}
            </span>
            <h2 className="text-xl font-bold font-['Cinzel'] text-[#f5ebd7]">
              Forge Custom Challenge
            </h2>
            <p className="text-xs text-[#8da696]">
              Set a test of strength, distance, or consistency for your circle brothers
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Challenge Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#a7c4b1] mb-1.5">
              Challenge Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 50km High-Altitude Ridge Crusade, 1,000 Push-Up Fortnight"
              className="w-full px-3.5 py-2.5 bg-[#07110b] border border-[#1d3d28] rounded-xl text-sm text-[#f4f1ea] placeholder-[#4f6f5b] focus:outline-none focus:border-[#4ade80]"
            />
          </div>

          {/* Metric Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#a7c4b1] mb-2">
              Challenge Metric
            </label>
            <div className="grid grid-cols-3 gap-2">
              {METRICS.map((item) => {
                const isSelected = metric === item.metric;
                return (
                  <button
                    key={item.metric}
                    type="button"
                    onClick={() => handleMetricChange(item.metric)}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      isSelected
                        ? 'border-[#4ade80] bg-[#143823] text-[#86efac] font-bold shadow-md'
                        : 'border-[#1b3b27] bg-[#07110b] text-[#789a83] hover:bg-[#0e2116]'
                    }`}
                  >
                    <div className="text-xs">{item.label}</div>
                    <div className="text-[10px] opacity-70">({item.defaultUnit})</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Target Value & Unit */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#a7c4b1] mb-1.5">
                Target Value *
              </label>
              <div className="relative">
                <input
                  type="number"
                  required
                  min={1}
                  step="any"
                  value={targetValue}
                  onChange={(e) => setTargetValue(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 bg-[#07110b] border border-[#1d3d28] rounded-xl text-sm font-bold text-[#4ade80] focus:outline-none focus:border-[#4ade80]"
                />
                <Target className="w-4 h-4 text-[#4f6f5b] absolute right-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#a7c4b1] mb-1.5">
                Unit Label
              </label>
              <input
                type="text"
                required
                value={metricUnit}
                onChange={(e) => setMetricUnit(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#07110b] border border-[#1d3d28] rounded-xl text-sm text-[#f4f1ea] focus:outline-none focus:border-[#4ade80]"
              />
            </div>
          </div>

          {/* Category & Duration */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#a7c4b1] mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CircleChallengeCategory)}
                className="w-full px-3.5 py-2.5 bg-[#07110b] border border-[#1d3d28] rounded-xl text-sm text-[#f4f1ea] focus:outline-none focus:border-[#4ade80]"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} className="bg-[#0c1911]">
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#a7c4b1] mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#86efac]" />
                Duration
              </label>
              <select
                value={durationDays}
                onChange={(e) => setDurationDays(parseInt(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-[#07110b] border border-[#1d3d28] rounded-xl text-sm text-[#f4f1ea] focus:outline-none focus:border-[#4ade80]"
              >
                <option value={7} className="bg-[#0c1911]">7 Days (Sprint)</option>
                <option value={14} className="bg-[#0c1911]">14 Days (Fortnight)</option>
                <option value={30} className="bg-[#0c1911]">30 Days (Crusade)</option>
                <option value={60} className="bg-[#0c1911]">60 Days (Season)</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#a7c4b1] mb-1.5">
              Challenge Rules / Motivation
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Strict form only, outdoor trail miles count, log reps every evening."
              className="w-full px-3.5 py-2 bg-[#07110b] border border-[#1d3d28] rounded-xl text-sm text-[#f4f1ea] placeholder-[#4f6f5b] focus:outline-none focus:border-[#4ade80]"
            />
          </div>

          {/* XP Reward & Custom Badge Name */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#a7c4b1] mb-1.5 flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5 text-yellow-400" />
                XP Reward
              </label>
              <input
                type="number"
                min={100}
                step={50}
                value={xpReward}
                onChange={(e) => setXpReward(parseInt(e.target.value) || 500)}
                className="w-full px-3.5 py-2.5 bg-[#07110b] border border-[#1d3d28] rounded-xl text-sm text-yellow-400 font-bold focus:outline-none focus:border-[#4ade80]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#a7c4b1] mb-1.5 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-[#86efac]" />
                Honorary Crest Name
              </label>
              <input
                type="text"
                value={badgeRewardName}
                onChange={(e) => setBadgeRewardName(e.target.value)}
                placeholder="e.g. Iron Shield Finisher"
                className="w-full px-3.5 py-2.5 bg-[#07110b] border border-[#1d3d28] rounded-xl text-sm text-[#f4f1ea] placeholder-[#4f6f5b] focus:outline-none focus:border-[#4ade80]"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-[#183122]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#8ba495] hover:text-[#e4efe8] hover:bg-[#142e1e] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim() || targetValue <= 0}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-black bg-[#4ade80] hover:bg-[#22c55e] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-green-900/30 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Publish Challenge</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
