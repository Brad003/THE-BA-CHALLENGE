import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { RecoveryCard } from './RecoveryCard';
import {
  X,
  HeartPulse,
  Wind,
  Brain,
  BookOpen,
  PhoneCall,
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export const WellnessModal: React.FC = () => {
  const {
    showWellnessModal,
    setShowWellnessModal,
    wellnessResources,
    addXP,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'breathing' | 'journal' | 'checkin' | 'directory'>('breathing');

  // Interactive Breathing State (Box Breathing: 4s inhale, 4s hold, 4s exhale, 4s hold)
  const [breathingActive, setBreathingActive] = useState(false);
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Rest'>('Inhale');
  const [countdown, setCountdown] = useState(4);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);

  // Journaling state
  const [journalPrompt, setJournalPrompt] = useState(
    'What made you stronger today, and what burden are you ready to put down?'
  );
  const [journalEntry, setJournalEntry] = useState('');
  const [savedEntries, setSavedEntries] = useState<{ id: string; text: string; date: string }[]>([
    {
      id: 'j-1',
      text: 'Felt heavy after a long week of work pressure. Took a walk through the trees and remembered that a man is not defined by external chaos, but by how he holds his composure.',
      date: 'Yesterday'
    }
  ]);

  // Stress Mindset Check-in state
  const [stressLevel, setStressLevel] = useState<'Centred' | 'Grounded' | 'Strained' | 'Overwhelmed'>('Grounded');

  // Breathing interval engine
  useEffect(() => {
    if (!breathingActive) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Switch phase
          if (phase === 'Inhale') {
            setPhase('Hold');
            return 4;
          } else if (phase === 'Hold') {
            setPhase('Exhale');
            return 4;
          } else if (phase === 'Exhale') {
            setPhase('Rest');
            return 4;
          } else {
            setPhase('Inhale');
            setCyclesCompleted((c) => c + 1);
            return 4;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [breathingActive, phase]);

  if (!showWellnessModal) return null;

  const handleSaveJournal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!journalEntry.trim()) return;
    setSavedEntries([
      { id: `j-${Date.now()}`, text: journalEntry.trim(), date: 'Just now' },
      ...savedEntries
    ]);
    setJournalEntry('');
    addXP(40, 'Completed evening character reflection');
    showToast('Reflection sealed in private Panther journal.');
  };

  const handleCompleteCheckin = () => {
    addXP(30, `Mindset check-in: ${stressLevel}`);
    showToast(`Mindset recorded: ${stressLevel}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#070e0a] border border-[#1b3b28] rounded-3xl p-5 sm:p-7 shadow-2xl my-auto text-[#f4f1ea]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#14261a] pb-3 mb-4">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-[#0f2418] text-[#93c5fd] border border-[#1e4830]">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[var(--accent-main)] uppercase tracking-widest">
                MEN'S WELLNESS SANCTUARY
              </span>
              <h2 className="text-lg sm:text-xl font-bold font-['Cinzel'] text-[#f5ebd7]">
                “Strong Men Speak.”
              </h2>
            </div>
          </div>
          <button
            onClick={() => {
              setBreathingActive(false);
              setShowWellnessModal(false);
            }}
            className="p-1.5 rounded-full bg-[#0e1811] text-[#869f8f] hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Core Tagline & Safety Notice */}
        <div className="p-3 rounded-2xl bg-[#0c1b12] border border-[#1d3d29] flex items-center justify-between gap-3 text-xs mb-4">
          <p className="text-[#a4baa9] leading-tight">
            Emotional composure and vulnerability in brotherhood are marks of courage, not weakness.
          </p>
          <span className="text-[10px] uppercase font-bold text-[var(--accent-main)] border border-[#2d583c] px-2 py-0.5 rounded bg-[#102418] flex-shrink-0">
            Confidential
          </span>
        </div>

        {/* Sub Navigation */}
        <div className="flex items-center space-x-2 border-b border-[#14261a] pb-3 mb-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('breathing')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'breathing'
                ? 'bg-[#183d28] text-[#86efac] border border-[#2b6441]'
                : 'text-[#7d9987] hover:text-[#b4c4b9]'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            <span>Box Breathing</span>
          </button>

          <button
            onClick={() => setActiveTab('journal')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'journal'
                ? 'bg-[#183d28] text-[#86efac] border border-[#2b6441]'
                : 'text-[#7d9987] hover:text-[#b4c4b9]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Character Journal</span>
          </button>

          <button
            onClick={() => setActiveTab('checkin')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'checkin'
                ? 'bg-[#183d28] text-[#86efac] border border-[#2b6441]'
                : 'text-[#7d9987] hover:text-[#b4c4b9]'
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            <span>Mindset Check-In</span>
          </button>

          <button
            onClick={() => setActiveTab('directory')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'directory'
                ? 'bg-[#183d28] text-[var(--accent-main)] border border-[#2b6441]'
                : 'text-[#7d9987] hover:text-[#b4c4b9]'
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Helplines & Support</span>
          </button>
        </div>

        {/* TAB 1: BREATHING PACER */}
        {activeTab === 'breathing' && (
          <div className="space-y-6 text-center py-4">
            <div>
              <h3 className="text-base font-bold font-['Cinzel'] text-[#f5ebd7]">
                Panther Tactical Box Breathing (4-4-4-4)
              </h3>
              <p className="text-xs text-[#8da696] max-w-sm mx-auto mt-1">
                De-escalates autonomic cortisol, restores vagal tone, and sharpens mental presence.
              </p>
            </div>

            {/* Visual Animated Breathing Circle */}
            <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
              {/* Expanding ring */}
              <div
                className={`absolute inset-0 rounded-full border-2 border-[var(--accent-main)] transition-all duration-1000 ${
                  phase === 'Inhale'
                    ? 'scale-110 bg-[#163a25]/60 shadow-[0_0_30px_rgba(201,151,56,0.3)]'
                    : phase === 'Hold'
                    ? 'scale-110 bg-[#1e4830]/80'
                    : phase === 'Exhale'
                    ? 'scale-90 bg-[#0f2418]/40'
                    : 'scale-90 bg-[#0a1810]'
                }`}
              />

              <div className="relative z-10 space-y-1">
                <span className="text-xs uppercase font-bold text-[var(--accent-main)] tracking-widest block">
                  {breathingActive ? phase : 'Ready'}
                </span>
                <span className="text-3xl font-black font-mono text-[#f5ebd7]">
                  {breathingActive ? countdown : '4s'}
                </span>
                <span className="text-[10px] text-[#738f7d] block">
                  Cycles: {cyclesCompleted}
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center space-x-3">
              <button
                onClick={() => setBreathingActive(!breathingActive)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[var(--accent-main)] to-[var(--accent-grad)] text-[#07130c] font-black text-xs flex items-center space-x-2 shadow-lg hover:opacity-95"
              >
                {breathingActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{breathingActive ? 'PAUSE RESET' : 'START 4-CYCLE BREATH'}</span>
              </button>

              <button
                onClick={() => {
                  setBreathingActive(false);
                  setPhase('Inhale');
                  setCountdown(4);
                  setCyclesCompleted(0);
                }}
                className="p-2.5 rounded-xl bg-[#0e1811] text-[#869f8f] hover:text-white border border-[#193121]"
                title="Reset Cycles"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: JOURNALING */}
        {activeTab === 'journal' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-[#0a160e] border border-[#183122]">
              <span className="text-[10px] uppercase font-bold text-[var(--accent-main)] tracking-wider block mb-1">
                Daily Reflection Prompt
              </span>
              <p className="text-xs text-[#f5ebd7] font-serif italic">{journalPrompt}</p>
            </div>

            <form onSubmit={handleSaveJournal} className="space-y-3">
              <textarea
                value={journalEntry}
                onChange={(e) => setJournalEntry(e.target.value)}
                placeholder="Write your honest reflections here. No one in the pride reads your private journal..."
                rows={4}
                className="w-full px-4 py-3 rounded-2xl bg-[#0c1911] border border-[#1d3d29] text-xs text-[#f4f1ea] placeholder-[#516b5b] focus:outline-none focus:border-[var(--accent-main)] resize-none"
              />
              <button
                type="submit"
                disabled={!journalEntry.trim()}
                className="px-5 py-2 rounded-xl bg-[#1a4b30] hover:bg-[#215d3c] text-xs font-bold text-[#86efac] border border-[#2b7249] disabled:opacity-40 transition-colors"
              >
                Seal Entry (+40 XP)
              </button>
            </form>

            {/* Past Entries */}
            <div className="space-y-2 pt-2 border-t border-[#14261a]">
              <span className="text-[10px] uppercase font-bold text-[#6d8a77] tracking-wider">
                Recent Entries
              </span>
              {savedEntries.map((e) => (
                <div
                  key={e.id}
                  className="p-3 rounded-xl bg-[#08120b] border border-[#152a1d] text-xs space-y-1"
                >
                  <span className="text-[10px] text-[var(--accent-main)] font-mono">{e.date}</span>
                  <p className="text-[#a4baa9] leading-relaxed">{e.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: MINDSET CHECK-IN */}
        {activeTab === 'checkin' && (
          <div className="space-y-5 py-2">
            <div>
              <h3 className="text-sm font-bold text-[#f5ebd7]">How is your spirit today, Panther?</h3>
              <p className="text-xs text-[#8da696] mt-0.5">
                Check in with your internal state without pretense or judgment.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {(
                [
                  { level: 'Centred', desc: 'Calm, focused, in control of actions' },
                  { level: 'Grounded', desc: 'Holding firm against routine pressures' },
                  { level: 'Strained', desc: 'Fatigued, high friction, needs recovery' },
                  { level: 'Overwhelmed', desc: 'Heavy load, needs brotherly counsel' }
                ] as const
              ).map((item) => (
                <div
                  key={item.level}
                  onClick={() => setStressLevel(item.level)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    stressLevel === item.level
                      ? 'bg-[#173e28] border-[var(--accent-main)] text-[#f5ebd7] shadow-lg'
                      : 'bg-[#08130c] border-[#183121] text-[#869f8f] hover:border-[#285237]'
                  }`}
                >
                  <span className="text-xs font-bold block">{item.level}</span>
                  <p className="text-[10px] text-[#6d8a77] mt-1">{item.desc}</p>
                </div>
              ))}
            </div>

            <button
              onClick={handleCompleteCheckin}
              className="w-full py-2.5 rounded-xl bg-[#143924] hover:bg-[#1b4b30] text-xs font-bold text-[#86efac] border border-[#225738] transition-colors"
            >
              Record Mindset State
            </button>

            <RecoveryCard />
          </div>
        )}

        {/* TAB 4: CRISIS & PROFESSIONAL HELPLINES DIRECTORY */}
        {activeTab === 'directory' && (
          <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-1">
            <div className="p-3.5 rounded-2xl bg-[#1e130c] border border-[#6b3518] flex items-start space-x-3 text-xs">
              <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#fbcfe8] block text-[11px] uppercase">
                  Safety & Emergency Support
                </span>
                <p className="text-[#fed7aa] mt-0.5 leading-relaxed text-[11px]">
                  This application does not diagnose or replace clinical medical advice. If you or a brother are experiencing an acute mental crisis or immediate danger, please reach out directly to the confidential toll-free services below.
                </p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-[#09140e] border border-[#1a3323]">
                <h4 className="font-bold text-[#f5ebd7]">Kenya Red Cross Psychological Support</h4>
                <p className="text-[#8ea496] text-[11px]">Toll-Free, 24/7 National Emergency Hotline</p>
                <span className="text-[var(--accent-main)] font-bold font-mono text-sm block mt-1">1199</span>
              </div>

              <div className="p-3 rounded-xl bg-[#09140e] border border-[#1a3323]">
                <h4 className="font-bold text-[#f5ebd7]">Befrienders Kenya Support Line</h4>
                <p className="text-[#8ea496] text-[11px]">Confidential listening service for distress</p>
                <span className="text-[var(--accent-main)] font-bold font-mono text-sm block mt-1">+254 722 178 177</span>
              </div>

              <div className="p-3 rounded-xl bg-[#09140e] border border-[#1a3323]">
                <h4 className="font-bold text-[#f5ebd7]">CALM (Campaign Against Living Miserably for Men)</h4>
                <p className="text-[#8ea496] text-[11px]">Dedicated men’s mental wellness line (UK & International)</p>
                <span className="text-[var(--accent-main)] font-bold font-mono text-sm block mt-1">0800 58 58 58</span>
              </div>

              <div className="p-3 rounded-xl bg-[#09140e] border border-[#1a3323]">
                <h4 className="font-bold text-[#f5ebd7]">Global Crisis Text Line</h4>
                <p className="text-[#8ea496] text-[11px]">Free, 24/7 crisis support via SMS</p>
                <span className="text-[var(--accent-main)] font-bold font-mono text-sm block mt-1">Text HOME to 741741</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
