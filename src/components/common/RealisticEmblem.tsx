import React from 'react';
import {
  Shield,
  Compass,
  Zap,
  Crown,
  Mountain,
  Sun,
  Users,
  TreePine,
  Brain,
  Flame,
  Award,
  Footprints,
  Navigation,
  Crosshair,
  Target,
  Sparkles,
  Layers,
  Activity
} from 'lucide-react';

interface RealisticEmblemProps {
  icon: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'gold' | 'emerald' | 'amber' | 'silver' | 'bronze' | 'obsidian';
  className?: string;
  showHalo?: boolean;
}

export const RealisticEmblem: React.FC<RealisticEmblemProps> = ({
  icon,
  size = 'md',
  variant = 'gold',
  className = '',
  showHalo = false
}) => {
  // Normalize icon key or convert legacy emoji to key
  const normalizedKey = (() => {
    const raw = (icon || '').trim();
    if (raw === '🐾' || raw === 'cub' || raw === 'claw') return 'claw';
    if (raw === '🧭' || raw === 'tracker' || raw === 'compass') return 'compass';
    if (raw === '⚡' || raw === 'hunter' || raw === 'zap' || raw === '100') return 'zap';
    if (raw === '🐆' || raw === 'panther' || raw === '30day') return 'panther';
    if (raw === '👑' || raw === 'alpha' || raw === 'consistency' || raw === 'crown') return 'crown';
    if (raw === '🛡️' || raw === 'shield' || raw === '7day' || raw === 'pride') return 'shield';
    if (raw === '🌳' || raw === 'tree' || raw === 'legacy' || raw === 'green') return 'tree';
    if (raw === '🌅' || raw === 'sun' || raw === 'early') return 'sun';
    if (raw === '🏔️' || raw === 'mountain' || raw === 'trail') return 'mountain';
    if (raw === '🤝' || raw === 'users' || raw === 'brotherhood') return 'users';
    if (raw === '🧠' || raw === 'brain' || raw === 'mental') return 'brain';
    if (raw === '🔥' || raw === 'flame') return 'flame';
    if (raw === '🏃' || raw === 'run') return 'run';
    if (raw === '🥾' || raw === 'hike') return 'hike';
    if (raw === '🚶' || raw === 'walk') return 'walk';
    return raw.toLowerCase();
  })();

  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20'
  }[size];

  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
    xl: 'w-10 h-10'
  }[size];

  const variantStyles = {
    gold: {
      border: 'border-amber-400/60',
      bg: 'bg-gradient-to-b from-[#2a2210] via-[#1a1508] to-[#0c0903]',
      text: 'text-amber-300',
      glow: 'shadow-[0_0_20px_rgba(245,158,11,0.25)]',
      accent: '#f59e0b'
    },
    emerald: {
      border: 'border-emerald-400/60',
      bg: 'bg-gradient-to-b from-[#0e2a1b] via-[#091b11] to-[#040e09]',
      text: 'text-emerald-300',
      glow: 'shadow-[0_0_20px_rgba(16,185,129,0.25)]',
      accent: '#10b981'
    },
    amber: {
      border: 'border-amber-500/60',
      bg: 'bg-gradient-to-b from-[#2a1a0e] via-[#1a0f07] to-[#0c0702]',
      text: 'text-amber-400',
      glow: 'shadow-[0_0_20px_rgba(249,115,22,0.25)]',
      accent: '#f97316'
    },
    silver: {
      border: 'border-slate-300/60',
      bg: 'bg-gradient-to-b from-[#1e2528] via-[#121719] to-[#090b0c]',
      text: 'text-slate-200',
      glow: 'shadow-[0_0_20px_rgba(226,232,240,0.2)]',
      accent: '#cbd5e1'
    },
    bronze: {
      border: 'border-amber-700/60',
      bg: 'bg-gradient-to-b from-[#281811] via-[#180e08] to-[#0b0503]',
      text: 'text-amber-500',
      glow: 'shadow-[0_0_20px_rgba(180,83,9,0.2)]',
      accent: '#b45309'
    },
    obsidian: {
      border: 'border-[#264e37]',
      bg: 'bg-gradient-to-b from-[#0f1f16] via-[#09140e] to-[#030705]',
      text: 'text-[#d6e3db]',
      glow: 'shadow-[0_0_15px_rgba(0,0,0,0.6)]',
      accent: '#10b981'
    }
  }[variant];

  // Render SVG inner glyph based on key
  const renderIcon = () => {
    switch (normalizedKey) {
      case 'claw':
      case 'panther':
        return (
          <svg
            viewBox="0 0 24 24"
            className={`${iconSizes} ${variantStyles.text}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12c0 3.85 2.16 7.19 5.34 8.89l1.66-2.89A7.96 7.96 0 0 1 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8a7.96 7.96 0 0 1-5 7.42l1.66 2.89C19.84 19.19 22 15.85 22 12c0-5.52-4.48-10-10-10z" />
            <path d="M7 9l2 3-1 2" />
            <path d="M17 9l-2 3 1 2" />
            <circle cx="12" cy="14" r="2" fill="currentColor" />
          </svg>
        );
      case 'compass':
        return <Compass className={`${iconSizes} ${variantStyles.text}`} />;
      case 'zap':
        return <Zap className={`${iconSizes} ${variantStyles.text} fill-current`} />;
      case 'crown':
        return <Crown className={`${iconSizes} ${variantStyles.text} fill-current`} />;
      case 'shield':
        return <Shield className={`${iconSizes} ${variantStyles.text}`} />;
      case 'tree':
        return <TreePine className={`${iconSizes} ${variantStyles.text}`} />;
      case 'sun':
        return <Sun className={`${iconSizes} ${variantStyles.text}`} />;
      case 'mountain':
      case 'hike':
        return <Mountain className={`${iconSizes} ${variantStyles.text}`} />;
      case 'users':
        return <Users className={`${iconSizes} ${variantStyles.text}`} />;
      case 'brain':
        return <Brain className={`${iconSizes} ${variantStyles.text}`} />;
      case 'flame':
        return <Flame className={`${iconSizes} ${variantStyles.text} fill-current`} />;
      case 'run':
        return <Navigation className={`${iconSizes} ${variantStyles.text}`} />;
      case 'walk':
        return <Footprints className={`${iconSizes} ${variantStyles.text}`} />;
      case 'activity':
        return <Activity className={`${iconSizes} ${variantStyles.text}`} />;
      default:
        return <Award className={`${iconSizes} ${variantStyles.text}`} />;
    }
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-2xl border ${variantStyles.border} ${variantStyles.bg} ${variantStyles.glow} ${sizeClasses} flex-shrink-0 ${className}`}
    >
      {/* Precision Geometric Frame Accent */}
      <div className="absolute inset-0.5 rounded-[14px] border border-white/10 pointer-events-none" />
      {showHalo && (
        <div
          className="absolute -inset-1 rounded-2xl opacity-40 blur-sm pointer-events-none"
          style={{ backgroundColor: variantStyles.accent }}
        />
      )}
      <div className="relative z-10 flex items-center justify-center">
        {renderIcon()}
      </div>
    </div>
  );
};
