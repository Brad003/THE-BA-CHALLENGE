import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FitnessLevel, PrimaryGoal, TrainingEnvironment, BAMembershipStatus } from '../../types';
import { PantherLogoIcon } from '../common/PantherSilhouette';
import { Shield, ArrowRight, ArrowLeft, Check, Compass, AlertCircle, HeartHandshake } from 'lucide-react';

const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=300&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=300&auto=format&fit=crop',
];

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const OnboardingModal: React.FC = () => {
  const { user, updateUserProfile, showOnboarding, setShowOnboarding } = useApp();
  const [step, setStep] = useState<number>(1);

  // Local form state initialized with user values
  const [fullName, setFullName] = useState(user.fullName || '');
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || AVATAR_OPTIONS[0]);
  const [ageBracket, setAgeBracket] = useState(user.ageBracket || '25-34');
  const [fitnessLevel, setFitnessLevel] = useState<FitnessLevel>(user.fitnessLevel || 'Intermediate');
  const [primaryGoal, setPrimaryGoal] = useState<PrimaryGoal>(user.primaryGoal || 'Strength');
  const [trainingFrequency, setTrainingFrequency] = useState<number>(user.trainingFrequency || 4);
  const [availableDays, setAvailableDays] = useState<string[]>(user.availableDays || ['Mon', 'Tue', 'Wed', 'Thu', 'Sat']);
  const [preferredEnvironment, setPreferredEnvironment] = useState<TrainingEnvironment>(user.preferredEnvironment || 'Mixed');
  const [injuries, setInjuries] = useState(user.injuries || 'None');
  const [emergencyName, setEmergencyName] = useState(user.emergencyContact?.name || '');
  const [emergencyPhone, setEmergencyPhone] = useState(user.emergencyContact?.phone || '');
  const [baMembershipStatus, setBaMembershipStatus] = useState<BAMembershipStatus>(user.baMembershipStatus || 'Active BA Challenger');

  const handleToggleDay = (day: string) => {
    if (availableDays.includes(day)) {
      if (availableDays.length > 1) {
        setAvailableDays(availableDays.filter(d => d !== day));
      }
    } else {
      setAvailableDays([...availableDays, day]);
    }
  };

  const handleFinish = () => {
    updateUserProfile({
      fullName: fullName.trim() || 'Brother Panther',
      avatarUrl,
      ageBracket,
      fitnessLevel,
      primaryGoal,
      trainingFrequency,
      availableDays,
      preferredEnvironment,
      injuries,
      emergencyContact: {
        name: emergencyName || 'Designated Brother',
        phone: emergencyPhone || '+254 700 000 000'
      },
      baMembershipStatus
    });
    setShowOnboarding(false);
  };

  if (!showOnboarding) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#09110c] border border-[#1e3c2b] rounded-3xl p-6 sm:p-8 shadow-2xl my-6">
        {/* Top brand crest */}
        <div className="flex items-center justify-between border-b border-[#162a1e] pb-4 mb-6">
          <div className="flex items-center space-x-3">
            <PantherLogoIcon size={36} />
            <div>
              <h2 className="font-['Cinzel'] text-xl font-bold tracking-wider text-[#f5ebd7]">
                THE BA CHALLENGE
              </h2>
              <p className="text-xs text-[var(--accent-main)] font-medium tracking-wide">
                PANTHER ONBOARDING • STEP {step} OF 4
              </p>
            </div>
          </div>
          <span className="text-xs text-[#6e8576] font-mono">
            {step === 1 && 'Identity'}
            {step === 2 && 'Fitness & Goals'}
            {step === 3 && 'Schedule & Base'}
            {step === 4 && 'Brotherhood Code'}
          </span>
        </div>

        {/* Step 1: Personal Identity */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <h3 className="text-lg font-bold text-[#e6f0ea]">Enter The Trail</h3>
              <p className="text-xs text-[#8da696] mt-1">
                Every man has a name. In the pride, you are recognized by your character and your commitment.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#c5ceca] uppercase tracking-wider mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="input-onboarding-fullname"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Brad Madahana"
                className="w-full px-4 py-3 rounded-xl bg-[#111c15] border border-[#213a29] text-[#f4f1ea] placeholder-[#53685b] focus:outline-none focus:border-[var(--accent-main)]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#c5ceca] uppercase tracking-wider mb-2">
                Select Panther Avatar
              </label>
              <div className="flex items-center space-x-3 overflow-x-auto pb-2">
                {AVATAR_OPTIONS.map((url, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setAvatarUrl(url)}
                    className={`relative rounded-full p-1 transition-all flex-shrink-0 ${
                      avatarUrl === url
                        ? 'ring-2 ring-[var(--accent-main)] scale-105'
                        : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={url} alt={`Avatar ${i}`} className="w-14 h-14 rounded-full object-cover" />
                    {avatarUrl === url && (
                      <div className="absolute bottom-0 right-0 bg-[var(--accent-main)] p-0.5 rounded-full text-black">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#c5ceca] uppercase tracking-wider mb-2">
                Age Bracket
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {['18-24', '25-34', '35-44', '45-54', '55+'].map((bracket) => (
                  <button
                    key={bracket}
                    type="button"
                    onClick={() => setAgeBracket(bracket)}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
                      ageBracket === bracket
                        ? 'bg-[#183a27] border-[var(--accent-main)] text-[#f5ebd7]'
                        : 'bg-[#101b14] border-[#1e3425] text-[#7d9987] hover:border-[#31533b]'
                    }`}
                  >
                    {bracket}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Fitness Level & Primary Goal */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h3 className="text-lg font-bold text-[#e6f0ea]">Capacity & Target</h3>
              <p className="text-xs text-[#8da696] mt-1">
                Be honest with where you stand today. The trail meets you exactly where your boots touch ground.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#c5ceca] uppercase tracking-wider mb-2">
                Current Fitness Level
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {(['Beginner', 'Intermediate', 'Advanced'] as FitnessLevel[]).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setFitnessLevel(level)}
                    className={`p-3 text-left rounded-xl border transition-all ${
                      fitnessLevel === level
                        ? 'bg-[#183a27] border-[var(--accent-main)] text-[#f5ebd7]'
                        : 'bg-[#101b14] border-[#1e3425] text-[#8ea496] hover:border-[#31533b]'
                    }`}
                  >
                    <div className="text-xs font-bold">{level}</div>
                    <div className="text-[10px] text-[#6d8a77] mt-1">
                      {level === 'Beginner' && 'Starting or rebooting'}
                      {level === 'Intermediate' && 'Regularly active'}
                      {level === 'Advanced' && 'High performance'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#c5ceca] uppercase tracking-wider mb-2">
                Primary Goal
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(
                  [
                    'Strength',
                    'Muscle building',
                    'Fat loss',
                    'Endurance',
                    'Mobility',
                    'General fitness',
                    'Mental wellness',
                    'Discipline'
                  ] as PrimaryGoal[]
                ).map((goal) => (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => setPrimaryGoal(goal)}
                    className={`py-2 px-2.5 text-xs font-medium rounded-xl border text-center transition-all ${
                      primaryGoal === goal
                        ? 'bg-[#183a27] border-[var(--accent-main)] text-[#f5ebd7]'
                        : 'bg-[#101b14] border-[#1e3425] text-[#8ea496] hover:border-[#31533b]'
                    }`}
                  >
                    {goal}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#c5ceca] uppercase tracking-wider mb-2">
                Injuries or Physical Limitations
              </label>
              <input
                type="text"
                id="input-onboarding-injuries"
                value={injuries}
                onChange={(e) => setInjuries(e.target.value)}
                placeholder="e.g. Mild lower back sensitivity, or None"
                className="w-full px-4 py-2.5 text-xs rounded-xl bg-[#111c15] border border-[#213a29] text-[#f4f1ea] placeholder-[#53685b] focus:outline-none focus:border-[var(--accent-main)]"
              />
            </div>
          </div>
        )}

        {/* Step 3: Schedule & Environment */}
        {step === 3 && (
          <div className="space-y-5">
            <div>
              <h3 className="text-lg font-bold text-[#e6f0ea]">Training Rhythm</h3>
              <p className="text-xs text-[#8da696] mt-1">
                Silent consistency beats reckless intensity. Lock in your weekly commitment.
              </p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-[#c5ceca] uppercase tracking-wider">
                  Weekly Training Frequency
                </label>
                <span className="text-xs font-bold text-[var(--accent-main)]">{trainingFrequency} Days / Week</span>
              </div>
              <input
                type="range"
                min="2"
                max="6"
                value={trainingFrequency}
                onChange={(e) => setTrainingFrequency(Number(e.target.value))}
                className="w-full accent-[var(--accent-main)] bg-[#1a2f22] h-2 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#c5ceca] uppercase tracking-wider mb-2">
                Available Training Days
              </label>
              <div className="grid grid-cols-7 gap-1.5">
                {DAYS_OF_WEEK.map((day) => {
                  const selected = availableDays.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleToggleDay(day)}
                      className={`py-2 rounded-lg text-xs font-semibold transition-all ${
                        selected
                          ? 'bg-[var(--accent-main)] text-[#07130c]'
                          : 'bg-[#101b14] border border-[#1e3425] text-[#7d9987]'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#c5ceca] uppercase tracking-wider mb-2">
                Preferred Training Environment
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['Home', 'Gym', 'Outdoors', 'Mixed'] as TrainingEnvironment[]).map((env) => (
                  <button
                    key={env}
                    type="button"
                    onClick={() => setPreferredEnvironment(env)}
                    className={`py-2.5 px-3 text-xs font-medium rounded-xl border text-center transition-all ${
                      preferredEnvironment === env
                        ? 'bg-[#183a27] border-[var(--accent-main)] text-[#f5ebd7]'
                        : 'bg-[#101b14] border-[#1e3425] text-[#8ea496] hover:border-[#31533b]'
                    }`}
                  >
                    {env}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Emergency Contact & BA Membership Status */}
        {step === 4 && (
          <div className="space-y-5">
            <div>
              <h3 className="text-lg font-bold text-[#e6f0ea]">The Brotherhood Code</h3>
              <p className="text-xs text-[#8da696] mt-1">
                “We don't leave any man behind.” Connect with your brothers and confirm safety contacts for wilderness rucks.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#c5ceca] uppercase tracking-wider mb-2">
                BA Challenge Status
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    'Active BA Challenger',
                    'BA Alum',
                    'Prospective Brother',
                    'Guest'
                  ] as BAMembershipStatus[]
                ).map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setBaMembershipStatus(status)}
                    className={`py-2 px-3 text-xs font-medium rounded-xl border text-left transition-all ${
                      baMembershipStatus === status
                        ? 'bg-[#183a27] border-[var(--accent-main)] text-[#f5ebd7]'
                        : 'bg-[#101b14] border-[#1e3425] text-[#8ea496] hover:border-[#31533b]'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0e1b13] border border-[#1d3827] space-y-3">
              <div className="flex items-center space-x-2 text-xs font-semibold text-[var(--accent-main)]">
                <Shield className="w-4 h-4" />
                <span>Expedition Emergency Contact</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  id="input-onboarding-emergency-name"
                  value={emergencyName}
                  onChange={(e) => setEmergencyName(e.target.value)}
                  placeholder="Contact Name / Next of Kin"
                  className="px-3 py-2 text-xs rounded-xl bg-[#132219] border border-[#23422e] text-[#f4f1ea] placeholder-[#556e5f] focus:outline-none"
                />
                <input
                  type="text"
                  id="input-onboarding-emergency-phone"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  placeholder="Contact Phone Number"
                  className="px-3 py-2 text-xs rounded-xl bg-[#132219] border border-[#23422e] text-[#f4f1ea] placeholder-[#556e5f] focus:outline-none"
                />
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0d1611] border border-[#1b3123] flex items-start space-x-3">
              <HeartHandshake className="w-5 h-5 text-[var(--accent-main)] flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-[#93ab9c] leading-relaxed">
                By entering PANTHER, you agree to uphold the core tenets: strength, silent consistency, environmental stewardship, and lifting up your fellow brothers.
              </p>
            </div>
          </div>
        )}

        {/* Step Navigation Buttons */}
        <div className="flex items-center justify-between mt-8 pt-4 border-t border-[#172c1f]">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-[#101c15] text-[#a4baa9] text-xs font-semibold hover:bg-[#182d21] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-[#18462d] text-[#f5ebd7] text-xs font-bold hover:bg-[#20593a] transition-colors shadow-lg border border-[#2b6845]"
            >
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[var(--accent-main)] to-[var(--accent-bright)] text-[#07130c] text-xs font-black hover:opacity-95 transition-all shadow-[0_0_15px_rgba(201,151,56,0.3)]"
            >
              <span>ENTER THE PRIDE</span>
              <Check className="w-4 h-4 stroke-[3]" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
