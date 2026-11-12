import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PANTHER_LEVELS } from '../../data/initialData';
import { storage } from '../../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Camera, Loader2 } from 'lucide-react';
import { AccountabilityEmailer } from './AccountabilityEmailer';
import { ProfileProgressionMap } from './ProfileProgressionMap';
import { ShareProgressModal } from './ShareProgressModal';
import { RealisticEmblem } from '../common/RealisticEmblem';
import { CameraCaptureModal } from './CameraCaptureModal';
import { RecoveryTrendChart } from './RecoveryTrendChart';
import {
  User,
  Shield,
  Award,
  TreePine,
  Flame,
  Zap,
  Lock,
  Edit3,
  Calendar,
  HeartPulse,
  Eye,
  EyeOff,
  CheckCircle2,
  TrendingUp,
  History,
  Share2,
  Settings,
  Crown,
  Check,
  Film
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const {
    user,
    badges,
    activityLogs,
    currentLevelInfo,
    nextLevelInfo,
    xpProgressPercent,
    updateUserProfile,
    setShowOnboardingModal,
    setShowGreenLegacyModal,
    setShowLeaderboardModal,
    setShowPremiumModal,
    isPremium,
    openPremiumUpgrade,
    firebaseUser,
    logout,
    openFormAnalysis,
    savedFormAnalyses
  } = useApp();

  const [isEditingMetrics, setIsEditingMetrics] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingImage(true);
      
      const fileExtension = file.name.split('.').pop();
      const fileName = `avatars/${user.id}_${Date.now()}.${fileExtension}`;
      const storageRef = ref(storage, fileName);
      
      const uploadTask = uploadBytesResumable(storageRef, file);
      
      uploadTask.on('state_changed', 
        () => {
          // Progress tracking if needed
        }, 
        (error) => {
          console.warn("Storage upload note (falling back to local image):", error);
          setIsUploadingImage(false);
          // Fallback to reading file locally as Data URL so upload still succeeds
          const reader = new FileReader();
          reader.onload = (ev) => {
            if (ev.target?.result) {
              updateUserProfile({ avatarUrl: ev.target.result as string });
            }
          };
          reader.readAsDataURL(file);
        }, 
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            updateUserProfile({ avatarUrl: downloadURL });
          } catch (err) {
            console.warn("Notice getting download URL:", err);
          } finally {
            setIsUploadingImage(false);
          }
        }
      );
    } catch (error) {
      console.warn("Upload fallback notice:", error);
      setIsUploadingImage(false);
    }
  };

  const [weightInput, setWeightInput] = useState(user.weightKg || 82);
  const [heightInput, setHeightInput] = useState(user.heightCm || 184);
  const [showShareModal, setShowShareModal] = useState(false);

  const handleSaveMetrics = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      weightKg: Number(weightInput),
      heightCm: Number(heightInput)
    });
    setIsEditingMetrics(false);
  };

  return (
    <div className="space-y-6 pb-24 max-w-5xl mx-auto px-4 pt-4 text-[#f4f1ea]">
      {/* Profile Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#09150e] via-[#0e2417] to-[#09150e] border border-[#1e452b] shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          
          <div className="flex items-center space-x-4">
            <div className="relative group">
              {/* Clickable avatar opens camera modal */}
              <button
                type="button"
                onClick={() => setShowCameraModal(true)}
                className="relative block rounded-2xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-[var(--accent-main)] cursor-pointer"
                title="Take photo using device camera"
                aria-label="Take photo using device camera"
              >
                <img
                  src={user.avatarUrl}
                  alt={user.fullName}
                  className="w-20 h-20 rounded-2xl object-cover ring-2 ring-[var(--accent-main)] shadow-lg transition-transform group-hover:scale-105"
                />
                
                {/* Overlay for camera on hover */}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-center">
                  <Camera className="w-5 h-5 text-white mb-0.5" />
                  <span className="text-[9px] font-bold text-white uppercase tracking-tight">Camera</span>
                </div>
              </button>

              {/* Dedicated Camera Badge Button */}
              <button
                type="button"
                onClick={() => setShowCameraModal(true)}
                className="absolute -bottom-1.5 -right-1.5 p-1.5 rounded-xl bg-[var(--accent-main)] text-[#09150e] hover:bg-[#e5b349] shadow-md border-2 border-[#09150e] transition-transform active:scale-95 group-hover:scale-110 flex items-center justify-center cursor-pointer z-10"
                title="Take photo with device camera"
                aria-label="Take photo with device camera"
              >
                <Camera className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>

            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#163822] text-[var(--accent-main)] uppercase">
                  {user.membershipTier}
                </span>
                <span className="text-[10px] text-[#86efac] font-bold">
                  LEVEL {user.pantherLevel}
                </span>
              </div>
              <h1 className="font-['Cinzel'] text-xl sm:text-2xl font-bold text-[#f5ebd7]">
                {user.fullName}
              </h1>
              <p className="text-xs text-[#8ea496]">{user.email || 'Brotherhood Member'}</p>
              <div className="flex items-center space-x-2 pt-1">
                <span className={`inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse`} />
                <span className="text-[11px] text-[#9eb6a8]">
                  Firestore Cloud Synced
                </span>
              </div>
            </div>
          </div>

          {/* Auth & Edit Profile buttons */}
          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setShowCameraModal(true)}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-[#143522] hover:bg-[#1d472f] text-xs font-semibold text-[#86efac] border border-[#27603c] transition-colors"
              title="Take photo with device camera"
            >
              <Camera className="w-3.5 h-3.5 text-[var(--accent-main)]" />
              <span>Take Photo</span>
            </button>

            <button
              onClick={() => setShowShareModal(true)}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-[var(--accent-main)]/10 hover:bg-[var(--accent-main)]/20 text-xs font-semibold text-[var(--accent-main)] border border-[var(--accent-main)]/30 transition-colors"
              title="Share Progress"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Progress</span>
            </button>

            <button
              onClick={logout}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-[#142318] hover:bg-[#203a27] text-xs font-semibold text-[#c8d6ce] border border-[#23452f] transition-colors"
              title="Disconnect Google Account"
            >
              <span>Sign Out</span>
            </button>

            <button
              onClick={() => setShowOnboardingModal(true)}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#143321] hover:bg-[#1d472f] text-xs font-bold text-[#f5ebd7] border border-[#27603c] transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Update Profile</span>
            </button>
          </div>
        </div>

        {/* XP & Panther Rank Progression Bar */}
        <div className="mt-6 pt-5 border-t border-[#163121] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2.5">
              <RealisticEmblem
                icon={currentLevelInfo.badgeIcon}
                size="sm"
                variant="gold"
                showHalo
              />
              <span className="font-bold text-[var(--accent-main)] uppercase tracking-wider">
                {currentLevelInfo.name}
              </span>
            </div>
            <span className="text-xs text-[#9eb6a8]">
              <strong className="text-[#f5ebd7]">{user.xp.toLocaleString()} XP</strong>
              {nextLevelInfo && ` / ${nextLevelInfo.minXp.toLocaleString()} XP for ${nextLevelInfo.name}`}
            </span>
          </div>

          <div className="w-full bg-[#0c1811] h-3 rounded-full overflow-hidden border border-[#1b3425]">
            <div
              className="bg-gradient-to-r from-[var(--accent-main)] to-[#f3cf7a] h-full transition-all duration-500 shadow-[0_0_12px_rgba(201,151,56,0.5)]"
              style={{ width: `${xpProgressPercent}%` }}
            />
          </div>

          <p className="text-[11px] text-[#7d9987] text-right italic font-serif">
            {nextLevelInfo
              ? `${(nextLevelInfo.minXp - user.xp).toLocaleString()} XP until advancement to ${nextLevelInfo.name}`
              : 'Apex Panther tier achieved. Lead the pride.'}
          </p>
        </div>
      </div>

      {/* Vital Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-[#09130d] border border-[#1a3323]">
          <span className="text-[10px] text-[#6d8a77] uppercase font-semibold">Active Streak</span>
          <p className="text-2xl font-black text-amber-400 mt-1">{user.streak.current} Days</p>
          <span className="text-[10px] text-[#738f7d]">Longest: {user.streak.longest} days</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#09130d] border border-[#1a3323]">
          <span className="text-[10px] text-[#6d8a77] uppercase font-semibold">Total XP Earned</span>
          <p className="text-2xl font-black text-[var(--accent-main)] mt-1">{user.xp.toLocaleString()}</p>
          <span className="text-[10px] text-[#738f7d]">Pride discipline score</span>
        </div>

        <div
          onClick={() => setShowGreenLegacyModal(true)}
          className="p-4 rounded-2xl bg-[#09130d] border border-[#1a3323] hover:border-[#22c55e]/50 cursor-pointer transition-colors"
        >
          <span className="text-[10px] text-[#6d8a77] uppercase font-semibold">Green Legacy</span>
          <p className="text-2xl font-black text-[#86efac] mt-1">{user.treesPlanted} Trees</p>
          <span className="text-[10px] text-[#86efac]/80">Indigenous trees planted</span>
        </div>

        <div
          onClick={() => setShowLeaderboardModal(true)}
          className="p-4 rounded-2xl bg-[#09130d] border border-[#1a3323] hover:border-[var(--accent-main)]/50 cursor-pointer transition-colors"
        >
          <span className="text-[10px] text-[#6d8a77] uppercase font-semibold">Pride Standing</span>
          <p className="text-2xl font-black text-[#f5ebd7] mt-1">
            {user.isPublicRanking ? 'Rank #2' : 'Private'}
          </p>
          <span className="text-[10px] text-[#738f7d]">Tap to adjust visibility</span>
        </div>
      </div>

      {/* Panther Apex Membership Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0d1f14] via-[#142d1d] to-[#0a170f] border border-amber-500/40 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-[#1b3d27] border border-amber-400 text-amber-400 shadow-md">
              <Crown className="w-6 h-6 fill-amber-400/20" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">
                  MEMBERSHIP & ACCESS
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold border ${
                  isPremium
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-[#14281b] text-[#8ea496] border-[#22442e]'
                }`}>
                  {isPremium ? 'PANTHER APEX (ACTIVE)' : 'STANDARD TIER'}
                </span>
              </div>
              <h2 className="font-['Cinzel'] text-base sm:text-lg font-bold text-[#f5ebd7] mt-0.5">
                {isPremium ? 'Panther Apex All-Access' : 'Upgrade to Panther Apex'}
              </h2>
            </div>
          </div>

          <button
            onClick={() => setShowPremiumModal(true)}
            className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all self-start sm:self-auto ${
              isPremium
                ? 'bg-[#153823] border border-amber-400/50 text-amber-300 hover:bg-[#1d4c30]'
                : 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black shadow-[0_0_15px_rgba(251,191,36,0.3)] hover:scale-105'
            }`}
          >
            {isPremium ? 'Manage Subscription' : 'Unlock Apex ($19/mo)'}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-[#1e452c] text-xs">
          <div className="flex items-center space-x-2 text-[#b0c4b8]">
            <Check className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <span>Photorealistic 3D Mountain Maps</span>
          </div>
          <div className="flex items-center space-x-2 text-[#b0c4b8]">
            <Check className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <span>Deep ACWR & Biomechanical Analysis</span>
          </div>
          <div className="flex items-center space-x-2 text-[#b0c4b8]">
            <Check className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <span>Unlimited GPS Elevation Tracks</span>
          </div>
        </div>
      </div>

      {/* Settings & Preferences */}
      <div className="p-6 rounded-3xl bg-[#09130d] border border-[#1a3323] space-y-4">
        <div className="flex items-center space-x-2">
          <Settings className="w-4 h-4 text-[var(--accent-main)]" />
          <h2 className="font-['Cinzel'] text-sm sm:text-base font-bold text-[#f5ebd7]">
            App Preferences
          </h2>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-[#0c1811] rounded-2xl border border-[#1d3d29]">
          <div>
            <h3 className="text-xs font-bold text-[#f5ebd7]">Amber Glow Mode</h3>
            <p className="text-[10px] text-[#8ea496] mt-0.5">Shift accents to a deeper ember color</p>
          </div>
          <button
            onClick={() => updateUserProfile({ themePreference: user.themePreference === 'amber' ? 'standard' : 'amber' })}
            className={`w-12 h-6 rounded-full transition-colors relative ${
              user.themePreference === 'amber' ? 'bg-[#d95a1a]' : 'bg-[#1b3424]'
            }`}
          >
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-[#f5ebd7] transition-transform ${
              user.themePreference === 'amber' ? 'left-7' : 'left-1'
            }`} />
          </button>
        </div>
      </div>

      {/* Private Physical Metrics (Strictly Confidential) */}
      <div className="p-5 rounded-3xl bg-[#09130d] border border-[#1b3826] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Lock className="w-4 h-4 text-[var(--accent-main)]" />
            <h2 className="font-['Cinzel'] text-sm sm:text-base font-bold text-[#f5ebd7]">
              Confidential Body Metrics & Baseline
            </h2>
          </div>
          <button
            onClick={() => setIsEditingMetrics(!isEditingMetrics)}
            className="text-xs text-[var(--accent-main)] hover:underline"
          >
            {isEditingMetrics ? 'Cancel' : 'Edit Metrics'}
          </button>
        </div>

        <p className="text-xs text-[#8ea496]">
          Protected by privacy design. These numbers are never visible on public leaderboards or pride feeds.
        </p>

        {isEditingMetrics ? (
          <form onSubmit={handleSaveMetrics} className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="text-xs text-[#b8cbbf] block mb-1">Weight (kg)</label>
              <input
                type="number"
                value={weightInput}
                onChange={(e) => setWeightInput(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#0e1c14] border border-[#1e3d29] text-[#f4f1ea] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-[#b8cbbf] block mb-1">Height (cm)</label>
              <input
                type="number"
                value={heightInput}
                onChange={(e) => setHeightInput(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#0e1c14] border border-[#1e3d29] text-[#f4f1ea] focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="sm:col-span-2 py-2 rounded-xl bg-[#1b4b30] text-xs font-bold text-[#86efac] border border-[#2b7249]"
            >
              Save Private Baseline
            </button>
          </form>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
            <div className="p-3 rounded-xl bg-[#0b1810] border border-[#172d1f]">
              <span className="text-[10px] text-[#6d8a77]">Weight</span>
              <p className="font-bold text-[#f5ebd7] mt-0.5">{user.weightKg || 82} kg</p>
            </div>
            <div className="p-3 rounded-xl bg-[#0b1810] border border-[#172d1f]">
              <span className="text-[10px] text-[#6d8a77]">Height</span>
              <p className="font-bold text-[#f5ebd7] mt-0.5">{user.heightCm || 184} cm</p>
            </div>
            <div className="p-3 rounded-xl bg-[#0b1810] border border-[#172d1f]">
              <span className="text-[10px] text-[#6d8a77]">Fitness Level</span>
              <p className="font-bold text-[#f5ebd7] mt-0.5">{user.fitnessLevel}</p>
            </div>
            <div className="p-3 rounded-xl bg-[#0b1810] border border-[#172d1f]">
              <span className="text-[10px] text-[#6d8a77]">Primary Goal</span>
              <p className="font-bold text-[#f5ebd7] mt-0.5">{user.primaryGoal}</p>
            </div>
          </div>
        )}
      </div>

      {/* Long-Term 30-Day Recovery Trend (HRV & Resting Heart Rate via Recharts) */}
      <RecoveryTrendChart activityLogs={activityLogs} />

      {/* Panther Artifact Progression Map */}
      <ProfileProgressionMap />

      {/* Achievement Badges Section */}
      <div className="p-5 rounded-3xl bg-[#09130d] border border-[#1b3826] space-y-4">
        <div className="flex items-center space-x-2">
          <Award className="w-4 h-4 text-[var(--accent-main)]" />
          <h2 className="font-['Cinzel'] text-sm sm:text-base font-bold text-[#f5ebd7]">
            Digital Medals & Achievements
          </h2>
        </div>
        <p className="text-xs text-[#8ea496]">
          Earn these by remaining disciplined. Unlocked badges showcase your resilience.
        </p>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {badges.map((badge) => {
            const isUnlocked = badge.progress >= badge.maxProgress;
            const progressPercent = Math.min(100, Math.round((badge.progress / badge.maxProgress) * 100));

            return (
              <div 
                key={badge.id}
                className={`p-3 rounded-2xl border flex flex-col items-center text-center transition-all ${
                  isUnlocked 
                    ? 'bg-[#153422] border-[#22c55e] shadow-[0_0_12px_rgba(34,197,94,0.15)]' 
                    : 'bg-[#060c08] border-[#142318] opacity-70 grayscale'
                }`}
              >
                <div className="text-4xl mb-2">{badge.icon}</div>
                <h4 className={`text-[11px] font-bold uppercase tracking-wider mb-1 ${isUnlocked ? 'text-[#86efac]' : 'text-[#7d9987]'}`}>
                  {badge.title}
                </h4>
                <p className="text-[9px] text-[#8ea496] leading-snug line-clamp-2 h-6 mb-2">
                  {badge.description}
                </p>
                
                {/* Progress Bar or Unlocked Tag */}
                {isUnlocked ? (
                  <div className="mt-auto px-2 py-1 rounded bg-[#0b1b12] border border-[#1a4027] w-full">
                    <span className="text-[9px] font-bold text-[#22c55e] uppercase">
                      Unlocked {badge.unlockedAt ? badge.unlockedAt : ''}
                    </span>
                  </div>
                ) : (
                  <div className="mt-auto w-full">
                    <div className="flex justify-between text-[9px] text-[#5c7566] mb-1">
                      <span>{badge.progress}</span>
                      <span>{badge.maxProgress}</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#050b07] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#3f5f4b] rounded-full transition-all duration-1000"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Biomechanical Form Analysis Vault */}
      <div className="p-5 rounded-3xl bg-[#09130d] border border-[#1b3826] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Film className="w-4 h-4 text-[var(--accent-main)]" />
            <h2 className="font-['Cinzel'] text-sm sm:text-base font-bold text-[#f5ebd7]">
              AI Biomechanical Form Vault ({savedFormAnalyses.length})
            </h2>
          </div>
          <button
            onClick={() => openFormAnalysis()}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#133020] hover:bg-[#1a442c] border border-[#27663e] text-xs font-bold text-[#34d399] transition-colors"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>New Video Check</span>
          </button>
        </div>

        {savedFormAnalyses.length === 0 ? (
          <div className="p-4 rounded-2xl bg-[#0b1710] border border-[#162e20] text-center space-y-2">
            <p className="text-xs text-[#8ea496]">
              No recorded video form checks yet. Record 10-second exercise clips during training to analyze joint kinematics, spinal stability, and Olympic coaching cues.
            </p>
            <button
              onClick={() => openFormAnalysis({ name: 'Barbell Back Squat', category: 'Strength', targetMuscles: ['Quadriceps', 'Glutes', 'Core'] })}
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-[var(--accent-main)] hover:underline pt-1"
            >
              <span>Record your first form check</span>
              <CheckCircle2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {savedFormAnalyses.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-[#0b1710] border border-[#173021] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-[#f5ebd7]">{item.exerciseName}</span>
                    <span className="text-[10px] text-[#769382] font-mono">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-[#9eb6a6] mt-0.5">{item.verdict}</p>
                  <p className="text-[11px] text-[var(--accent-main)] italic mt-1 font-medium">
                    "{item.pantherCoachingCue}"
                  </p>
                </div>

                <div className="flex items-center space-x-3 self-start sm:self-auto flex-shrink-0">
                  <div className="text-right">
                    <span className="text-sm font-extrabold font-mono text-[#34d399] block">
                      {item.formScore}/100
                    </span>
                    <span className="text-[9px] font-bold text-[#769382] uppercase">
                      {item.injuryRiskAssessment.riskLevel.toUpperCase()} RISK
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Activity History Logs */}
      <div className="p-5 rounded-3xl bg-[#09130d] border border-[#1b3826] space-y-4">
        <div className="flex items-center space-x-2">
          <History className="w-4 h-4 text-[var(--accent-main)]" />
          <h2 className="font-['Cinzel'] text-sm sm:text-base font-bold text-[#f5ebd7]">
            Recent Activity Log History ({activityLogs.length})
          </h2>
        </div>

        <div className="space-y-2 max-h-60 overflow-y-auto pr-1 text-xs">
          {activityLogs.map((log) => (
            <div
              key={log.id}
              className="p-3 rounded-xl bg-[#0b1710] border border-[#172d1f] flex items-center justify-between"
            >
              <div>
                <h5 className="font-bold text-[#f5ebd7]">{log.title}</h5>
                <span className="text-[10px] text-[#738f7d]">
                  {log.category} • {log.durationMinutes} mins • {log.caloriesBurned} kcal
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-[#86efac]">+{log.xpEarned} XP</span>
                <span className="text-[10px] text-[#6d8a77] block">{log.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Accountability Emailer */}
      <AccountabilityEmailer />

      {/* Share Progress Modal */}
      {showShareModal && (
        <ShareProgressModal onClose={() => setShowShareModal(false)} />
      )}

      {/* Device Camera Photo Capture Modal */}
      {showCameraModal && (
        <CameraCaptureModal
          userId={user.id}
          currentAvatarUrl={user.avatarUrl}
          onPhotoSaved={(newAvatarUrl) => {
            updateUserProfile({ avatarUrl: newAvatarUrl });
          }}
          onClose={() => setShowCameraModal(false)}
        />
      )}
    </div>
  );
};
