import React, { useState } from 'react';
import { X, Shield, Sparkles, Key, Info } from 'lucide-react';
import { CircleCrestIcon, CircleFocusCategory } from '../../../types';
import { CrestIconRenderer } from './CrestIconRenderer';

interface CreateCircleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    tagline: string;
    description: string;
    crestIcon: CircleCrestIcon;
    themeColor: string;
    focusCategory: CircleFocusCategory;
    inviteCode?: string;
  }) => void;
}

const CREST_OPTIONS: { icon: CircleCrestIcon; label: string }[] = [
  { icon: 'Shield', label: 'Shield' },
  { icon: 'Mountain', label: 'Mountain' },
  { icon: 'Flame', label: 'Flame' },
  { icon: 'Swords', label: 'Swords' },
  { icon: 'Crown', label: 'Crown' },
  { icon: 'Footprints', label: 'Footprints' },
  { icon: 'TreePine', label: 'Forest' },
  { icon: 'Zap', label: 'Lightning' }
];

const COLOR_OPTIONS = [
  { color: '#10b981', label: 'Emerald' },
  { color: '#eab308', label: 'Gold' },
  { color: '#f97316', label: 'Flame' },
  { color: '#06b6d4', label: 'Cyan' },
  { color: '#a855f7', label: 'Violet' },
  { color: '#ef4444', label: 'Crimson' }
];

const CATEGORIES: CircleFocusCategory[] = [
  'Trail & Altitude',
  'Strength & Calisthenics',
  'Dawn Discipline',
  'Hybrid Endurance',
  'General Brotherhood'
];

export const CreateCircleModal: React.FC<CreateCircleModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [crestIcon, setCrestIcon] = useState<CircleCrestIcon>('Shield');
  const [themeColor, setThemeColor] = useState('#10b981');
  const [focusCategory, setFocusCategory] = useState<CircleFocusCategory>('Strength & Calisthenics');
  const [customCode, setCustomCode] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSubmit({
      name: name.trim(),
      tagline: tagline.trim() || 'Strength, Brotherhood & Discipline',
      description: description.trim() || 'A private circle of disciplined brothers testing our limits together.',
      crestIcon,
      themeColor,
      focusCategory,
      inviteCode: customCode.trim() ? customCode.trim().toUpperCase() : undefined
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

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-5">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center border shadow-md"
            style={{
              backgroundColor: `${themeColor}20`,
              borderColor: `${themeColor}50`
            }}
          >
            <CrestIconRenderer icon={crestIcon} themeColor={themeColor} size="lg" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-['Cinzel'] text-[#f5ebd7] flex items-center gap-2">
              Forge Brotherhood Circle
              <Shield className="w-4 h-4 text-[#86efac]" />
            </h2>
            <p className="text-xs text-[#8da696]">
              Private invite-only circle for custom challenges & private leaderboards
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Circle Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#a7c4b1] mb-1.5">
              Circle Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Iron Vanguard, High Desert Runners, 0500 Dawn Pack"
              className="w-full px-3.5 py-2.5 bg-[#07110b] border border-[#1d3d28] rounded-xl text-sm text-[#f4f1ea] placeholder-[#4f6f5b] focus:outline-none focus:border-[#4ade80]"
            />
          </div>

          {/* Creed / Tagline */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#a7c4b1] mb-1.5">
              Motto / Creed
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. 'No man left behind. Every rep accounted for.'"
              className="w-full px-3.5 py-2.5 bg-[#07110b] border border-[#1d3d28] rounded-xl text-sm text-[#f4f1ea] placeholder-[#4f6f5b] focus:outline-none focus:border-[#4ade80]"
            />
          </div>

          {/* Focus Category */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#a7c4b1] mb-1.5">
              Focus Discipline
            </label>
            <select
              value={focusCategory}
              onChange={(e) => setFocusCategory(e.target.value as CircleFocusCategory)}
              className="w-full px-3.5 py-2.5 bg-[#07110b] border border-[#1d3d28] rounded-xl text-sm text-[#f4f1ea] focus:outline-none focus:border-[#4ade80]"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="bg-[#0c1911]">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#a7c4b1] mb-1.5">
              Circle Purpose & Standards
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What standards do members hold each other to? What kind of challenges will you compete in?"
              className="w-full px-3.5 py-2 bg-[#07110b] border border-[#1d3d28] rounded-xl text-sm text-[#f4f1ea] placeholder-[#4f6f5b] focus:outline-none focus:border-[#4ade80]"
            />
          </div>

          {/* Crest Icon Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#a7c4b1] mb-2">
              Circle Crest Icon
            </label>
            <div className="grid grid-cols-4 gap-2">
              {CREST_OPTIONS.map((opt) => {
                const isSelected = crestIcon === opt.icon;
                return (
                  <button
                    key={opt.icon}
                    type="button"
                    onClick={() => setCrestIcon(opt.icon)}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all ${
                      isSelected
                        ? 'border-[#4ade80] bg-[#143823] shadow-md'
                        : 'border-[#1b3b27] bg-[#07110b] hover:bg-[#0e2116]'
                    }`}
                  >
                    <CrestIconRenderer
                      icon={opt.icon}
                      themeColor={isSelected ? themeColor : '#738f7d'}
                      size="md"
                    />
                    <span className="text-[11px] mt-1 text-[#a5beaf]">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Theme Color */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#a7c4b1] mb-2">
              Heraldry Banner Color
            </label>
            <div className="flex items-center space-x-3">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c.color}
                  type="button"
                  onClick={() => setThemeColor(c.color)}
                  className={`w-8 h-8 rounded-full border-2 transition-transform ${
                    themeColor === c.color ? 'scale-110 border-white shadow-lg' : 'border-transparent opacity-80 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: c.color }}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          {/* Custom Invite Code (Optional) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#a7c4b1] flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-[#86efac]" />
                Private Invite Code (Optional)
              </label>
              <span className="text-[10px] text-[#698574]">Auto-generated if blank</span>
            </div>
            <input
              type="text"
              value={customCode}
              onChange={(e) => setCustomCode(e.target.value.toUpperCase().replace(/\s+/g, '-'))}
              placeholder="e.g. VALOR-2026 or WOLFPACK"
              maxLength={15}
              className="w-full px-3.5 py-2.5 bg-[#07110b] border border-[#1d3d28] rounded-xl text-sm font-mono tracking-wider text-[#4ade80] placeholder-[#4f6f5b] focus:outline-none focus:border-[#4ade80]"
            />
          </div>

          {/* Privacy Note */}
          <div className="p-3 bg-[#08150d] border border-[#1b3a26] rounded-xl flex items-start space-x-2.5 text-xs text-[#89a592]">
            <Info className="w-4 h-4 text-[#86efac] shrink-0 mt-0.5" />
            <span>
              Circles are strictly private. Only brothers who possess your invite code can view the member roster, challenge standings, and activity wall.
            </span>
          </div>

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
              disabled={!name.trim()}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-black bg-[#4ade80] hover:bg-[#22c55e] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-green-900/30 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Forge Circle</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
