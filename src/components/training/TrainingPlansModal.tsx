import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TrainingPlan } from '../../types';
import { X, Calendar, Check, Zap, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export const TrainingPlansModal: React.FC = () => {
  const {
    showTrainingPlansModal,
    setShowTrainingPlansModal,
    trainingPlans,
    user,
    showToast
  } = useApp();

  const [plans, setPlans] = useState<TrainingPlan[]>(trainingPlans);
  const [activePlanId, setActivePlanId] = useState<string>(
    trainingPlans.find((p) => p.isEnrolled)?.id || trainingPlans[0].id
  );

  if (!showTrainingPlansModal) return null;

  const handleEnroll = (planId: string) => {
    setPlans((prev) =>
      prev.map((p) => ({
        ...p,
        isEnrolled: p.id === planId
      }))
    );
    setActivePlanId(planId);
    showToast('Enrolled in training plan. Your daily workouts will align.');
  };

  const handleGenerateAdaptive = () => {
    showToast(`Generating plan tailored for ${user.primaryGoal} and ${user.fitnessLevel}...`);
    setTimeout(() => {
      showToast('Adaptive training roadmap updated with brotherhood pacing.');
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#08110b] border border-[#1d3d29] rounded-3xl p-5 sm:p-7 shadow-2xl my-auto text-[#f4f1ea]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#14261b] pb-3 mb-5">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-[#132c1c] text-[var(--accent-main)]">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[var(--accent-main)] uppercase tracking-wider">
                STRUCTURED REGIMENS
              </span>
              <h2 className="text-lg sm:text-xl font-bold font-['Cinzel'] text-[#f5ebd7]">
                Adaptive Panther Plans
              </h2>
            </div>
          </div>
          <button
            onClick={() => setShowTrainingPlansModal(false)}
            className="p-1.5 rounded-full bg-[#111c14] text-[#869f8f] hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Adaptive generator banner based on onboarding profile */}
        <div className="p-4 rounded-2xl bg-[#0d1e15] border border-[#234d34] mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold text-[#86efac] uppercase tracking-wider flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-[var(--accent-bright)]" />
              <span>DYNAMIC TAILORING ACTIVE</span>
            </span>
            <p className="text-xs text-[#b8cbbf] mt-0.5">
              Current profile: <strong className="text-[#f5ebd7]">{user.primaryGoal}</strong> •{' '}
              <strong className="text-[#f5ebd7]">{user.fitnessLevel}</strong> •{' '}
              <strong className="text-[#f5ebd7]">{user.trainingFrequency} days/wk</strong>
            </p>
          </div>
          <button
            onClick={handleGenerateAdaptive}
            className="px-4 py-2 rounded-xl bg-[#183d28] hover:bg-[#204e33] text-xs font-bold text-[#86efac] border border-[#2b6441] transition-colors flex-shrink-0"
          >
            Recalibrate Plan
          </button>
        </div>

        {/* Plans List */}
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {plans.map((plan) => {
            const isSelected = plan.id === activePlanId;
            return (
              <div
                key={plan.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                  isSelected
                    ? 'bg-[#0f2418] border-[var(--accent-main)] shadow-[0_0_15px_rgba(201,151,56,0.15)]'
                    : 'bg-[#09140e] border-[#183121] hover:border-[#2b553a]'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#132c1c] text-[#86efac] uppercase">
                        {plan.durationWeeks} Weeks • {plan.workoutsPerWeek} Days/Wk
                      </span>
                      <span className="text-[10px] text-[var(--accent-main)] font-semibold uppercase">
                        {plan.fitnessLevel}
                      </span>
                    </div>
                    <h3 className="text-base font-bold font-['Cinzel'] text-[#f5ebd7] mt-1.5">
                      {plan.title}
                    </h3>
                    <p className="text-xs text-[#8da696] font-medium italic mt-0.5">
                      “{plan.tagline}”
                    </p>
                  </div>

                  {plan.isEnrolled ? (
                    <span className="px-3 py-1.5 rounded-xl bg-[#163e26] text-[#86efac] border border-[#286b43] text-xs font-bold flex items-center space-x-1.5 self-start sm:self-auto">
                      <Check className="w-3.5 h-3.5" />
                      <span>CURRENT PLAN</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => handleEnroll(plan.id)}
                      className="px-4 py-2 rounded-xl bg-[#153422] hover:bg-[#1d462e] text-xs font-bold text-[#f5ebd7] border border-[#275b39] transition-colors self-start sm:self-auto"
                    >
                      Enroll in Plan
                    </button>
                  )}
                </div>

                <p className="text-xs text-[#9eb6a8] mt-3 leading-relaxed border-t border-[#152a1d] pt-2.5">
                  {plan.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
