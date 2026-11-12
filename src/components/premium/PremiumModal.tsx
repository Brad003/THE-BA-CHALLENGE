import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Crown,
  Check,
  Zap,
  Mountain,
  Activity,
  ShieldCheck,
  CreditCard,
  Smartphone,
  Sparkles,
  TreePine,
  TrendingUp,
  ArrowRight,
  Lock,
  Calendar,
  AlertCircle
} from 'lucide-react';

export const PremiumModal: React.FC = () => {
  const {
    showPremiumModal,
    setShowPremiumModal,
    premiumFeatureLockedNotice,
    upgradeToPremium,
    cancelPremium,
    isPremium,
    user
  } = useApp();

  const [billingPlan, setBillingPlan] = useState<'monthly' | 'annual'>('annual');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mpesa' | 'googlepay'>('card');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Card Form State
  const [cardNumber, setCardNumber] = useState<string>('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState<string>('12/28');
  const [cardCvc, setCardCvc] = useState<string>('888');
  const [cardName, setCardName] = useState<string>(user?.fullName || 'Brad Madahana');

  // M-Pesa State
  const [mpesaPhone, setMpesaPhone] = useState<string>('+254 712 345 678');
  const [mpesaPromptSent, setMpesaPromptSent] = useState<boolean>(false);

  if (!showPremiumModal) return null;

  const handleSubscribe = async (isTrial: boolean = false) => {
    setIsProcessing(true);

    if (paymentMethod === 'mpesa' && !isTrial) {
      setMpesaPromptSent(true);
      // Simulate M-Pesa STK Push timeout
      await new Promise(r => setTimeout(r, 2000));
    } else {
      await new Promise(r => setTimeout(r, 1400));
    }

    const methodLabel =
      isTrial
        ? '7-Day Free Trial'
        : paymentMethod === 'mpesa'
        ? `M-Pesa (${mpesaPhone})`
        : paymentMethod === 'googlepay'
        ? 'Google Pay'
        : `Credit Card (•••• ${cardNumber.slice(-4)})`;

    await upgradeToPremium(billingPlan, methodLabel);
    setIsProcessing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-xl bg-gradient-to-b from-[#0c1e13] via-[#08150d] to-[#040a06] border border-[#235837] rounded-3xl p-5 sm:p-7 shadow-[0_0_50px_rgba(34,197,94,0.15)] my-auto text-[#f4f1ea] space-y-5">
        {/* Close Button */}
        <button
          onClick={() => setShowPremiumModal(false)}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#102719] text-[#7d9385] hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Branding */}
        <div className="text-center space-y-2 pt-2">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-amber-500/20 border border-amber-500/40 text-amber-300 text-[11px] font-black uppercase tracking-widest">
            <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Black Panther Apex Membership</span>
          </div>

          <h2 className="font-['Cinzel'] text-2xl sm:text-3xl font-black text-[#f5ebd7] tracking-wide">
            {isPremium ? 'Your Apex Membership' : 'Unleash Apex Performance'}
          </h2>

          <p className="text-xs text-[#8da696] max-w-md mx-auto leading-relaxed">
            {premiumFeatureLockedNotice ? (
              <span className="inline-flex items-center text-amber-300 font-semibold space-x-1.5">
                <Lock className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{premiumFeatureLockedNotice} is exclusive to Panther Apex members.</span>
              </span>
            ) : (
              'Unlock 3D wilderness maps, deep biomechanical diagnostics, AI sports science coaching, and elite brotherhood privileges.'
            )}
          </p>
        </div>

        {/* If user is already Premium */}
        {isPremium ? (
          <div className="space-y-4 bg-[#0a1e12] border border-[#1b432a] rounded-2xl p-5 text-center">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center mx-auto text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.25)]">
              <Crown className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-black uppercase tracking-wider text-amber-300">
                You Are An Active Apex Panther
              </h3>
              <p className="text-xs text-[#8da696] mt-1">
                Plan: <span className="font-bold text-white capitalize">{user.subscriptionPlan || 'Annual'} Apex</span> • 
                Active via: <span className="font-bold text-white">{user.paymentMethod || 'Credit Card'}</span>
              </p>
              <p className="text-[11px] text-[#52705d] mt-1">
                All 3D Maps, Deep Analytics, and AI Recovery protocols are fully unlocked.
              </p>
            </div>

            <div className="flex justify-center space-x-3 pt-2">
              <button
                onClick={() => setShowPremiumModal(false)}
                className="px-5 py-2.5 rounded-xl bg-[#143d25] hover:bg-[#1a4e2f] text-xs font-bold text-[#f5ebd7] transition-all"
              >
                Return to Regimen
              </button>
              <button
                onClick={cancelPremium}
                className="px-4 py-2.5 rounded-xl bg-transparent border border-red-500/40 text-red-400 hover:bg-red-950/40 text-xs font-semibold transition-all"
              >
                Cancel Subscription
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Feature Matrix Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-3 rounded-2xl bg-[#09180f] border border-[#173823] flex items-start space-x-3">
                <div className="p-2 rounded-xl bg-[#143d25] text-amber-400 flex-shrink-0">
                  <Mountain className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#f5ebd7]">3D Photorealistic Maps</h4>
                  <p className="text-[10px] text-[#7d9385] leading-normal">
                    Interactive 3D orbital flyovers, dynamic camera pitch (67.5°), and elevation contour ribbons.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#09180f] border border-[#173823] flex items-start space-x-3">
                <div className="p-2 rounded-xl bg-[#143d25] text-[#34d399] flex-shrink-0">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#f5ebd7]">Deep Workout Analysis</h4>
                  <p className="text-[10px] text-[#7d9385] leading-normal">
                    Acute:Chronic workload ratio (ACWR), muscle group fatigue distribution & Grade-Adjusted Pace.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#09180f] border border-[#173823] flex items-start space-x-3">
                <div className="p-2 rounded-xl bg-[#143d25] text-sky-400 flex-shrink-0">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#f5ebd7]">Velocity 1RM Forecast</h4>
                  <p className="text-[10px] text-[#7d9385] leading-normal">
                    Predictive overload modeling for squat, deadlift & 10k pacing over 8-week cycles.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#09180f] border border-[#173823] flex items-start space-x-3">
                <div className="p-2 rounded-xl bg-[#143d25] text-emerald-400 flex-shrink-0">
                  <TreePine className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#f5ebd7]">2X Green Legacy Matching</h4>
                  <p className="text-[10px] text-[#7d9385] leading-normal">
                    Every tree you plant through training is matched 2x by the Panther Conservation Guild.
                  </p>
                </div>
              </div>
            </div>

            {/* Billing Plan Selector */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div
                onClick={() => setBillingPlan('annual')}
                className={`p-3.5 rounded-2xl border cursor-pointer relative transition-all ${
                  billingPlan === 'annual'
                    ? 'bg-[#143a24] border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.2)]'
                    : 'bg-[#08150e] border-[#183623] hover:bg-[#0c2014]'
                }`}
              >
                <div className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-amber-500 text-[#051108] text-[9px] font-black uppercase tracking-wider">
                  Save 33%
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#f5ebd7]">Annual Apex</span>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      billingPlan === 'annual' ? 'border-amber-400 bg-amber-400 text-black' : 'border-[#43644f]'
                    }`}
                  >
                    {billingPlan === 'annual' && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-2xl font-black font-mono text-[#f5ebd7]">$79.99</span>
                  <span className="text-[10px] text-[#8ea496]"> / year</span>
                </div>
                <p className="text-[10px] text-amber-300/90 mt-0.5">
                  $6.67/mo • 2 Months Free
                </p>
              </div>

              <div
                onClick={() => setBillingPlan('monthly')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  billingPlan === 'monthly'
                    ? 'bg-[#143a24] border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.2)]'
                    : 'bg-[#08150e] border-[#183623] hover:bg-[#0c2014]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#f5ebd7]">Monthly Apex</span>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      billingPlan === 'monthly' ? 'border-amber-400 bg-amber-400 text-black' : 'border-[#43644f]'
                    }`}
                  >
                    {billingPlan === 'monthly' && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-2xl font-black font-mono text-[#f5ebd7]">$9.99</span>
                  <span className="text-[10px] text-[#8ea496]"> / month</span>
                </div>
                <p className="text-[10px] text-[#7d9385] mt-0.5">
                  Flexible • Cancel anytime
                </p>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#d1e0d7] uppercase tracking-wider block">
                Select Payment Method
              </label>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-2.5 rounded-xl border flex items-center justify-center space-x-1.5 text-xs font-bold transition-all ${
                    paymentMethod === 'card'
                      ? 'bg-[#163e26] border-emerald-400 text-white'
                      : 'bg-[#08150e] border-[#173623] text-[#7d9385] hover:text-white'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('mpesa')}
                  className={`p-2.5 rounded-xl border flex items-center justify-center space-x-1.5 text-xs font-bold transition-all ${
                    paymentMethod === 'mpesa'
                      ? 'bg-[#163e26] border-emerald-400 text-white'
                      : 'bg-[#08150e] border-[#173623] text-[#7d9385] hover:text-white'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>M-Pesa</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('googlepay')}
                  className={`p-2.5 rounded-xl border flex items-center justify-center space-x-1.5 text-xs font-bold transition-all ${
                    paymentMethod === 'googlepay'
                      ? 'bg-[#163e26] border-emerald-400 text-white'
                      : 'bg-[#08150e] border-[#173623] text-[#7d9385] hover:text-white'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Google Pay</span>
                </button>
              </div>

              {/* Card Inputs */}
              {paymentMethod === 'card' && (
                <div className="bg-[#07130a] p-3 rounded-2xl border border-[#163622] space-y-2">
                  <div>
                    <span className="text-[10px] text-[#7d9385] block mb-0.5">Cardholder Name</span>
                    <input
                      type="text"
                      value={cardName}
                      onChange={e => setCardName(e.target.value)}
                      className="w-full bg-[#0d2216] border border-[#1f4a30] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2">
                      <span className="text-[10px] text-[#7d9385] block mb-0.5">Card Number</span>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={e => setCardNumber(e.target.value)}
                        className="w-full bg-[#0d2216] border border-[#1f4a30] rounded-xl px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-[#7d9385] block mb-0.5">Exp / CVC</span>
                      <input
                        type="text"
                        value={`${cardExpiry} ${cardCvc}`}
                        onChange={e => {
                          const val = e.target.value;
                          setCardExpiry(val.slice(0, 5));
                        }}
                        className="w-full bg-[#0d2216] border border-[#1f4a30] rounded-xl px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* M-Pesa Input */}
              {paymentMethod === 'mpesa' && (
                <div className="bg-[#07130a] p-3 rounded-2xl border border-[#163622] space-y-2">
                  <div>
                    <span className="text-[10px] text-[#7d9385] block mb-0.5">
                      Safaricom M-Pesa Phone Number
                    </span>
                    <input
                      type="text"
                      value={mpesaPhone}
                      onChange={e => setMpesaPhone(e.target.value)}
                      placeholder="+254 7XX XXX XXX"
                      className="w-full bg-[#0d2216] border border-[#1f4a30] rounded-xl px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                  <p className="text-[10px] text-[#55866a]">
                    You will receive an instant SIM prompt on your phone to authorize via M-Pesa PIN.
                  </p>
                </div>
              )}

              {/* Google Pay Notice */}
              {paymentMethod === 'googlepay' && (
                <div className="bg-[#07130a] p-3 rounded-2xl border border-[#163622] text-center space-y-1">
                  <span className="text-xs text-[#a9bcae]">
                    One-touch checkout with Google Pay and biometric verification.
                  </span>
                </div>
              )}
            </div>

            {/* Primary Upgrade CTA & 7-Day Trial */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => handleSubscribe(false)}
                disabled={isProcessing}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-400 text-[#07130a] font-black text-sm uppercase tracking-widest flex items-center justify-center space-x-2 shadow-[0_0_30px_rgba(251,191,36,0.35)] hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
              >
                {isProcessing ? (
                  <span>Processing Secure Checkout...</span>
                ) : (
                  <>
                    <Crown className="w-4 h-4 fill-current" />
                    <span>
                      Upgrade to Apex •{' '}
                      {billingPlan === 'annual' ? '$79.99/Year' : '$9.99/Month'}
                    </span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleSubscribe(true)}
                disabled={isProcessing}
                className="w-full py-2.5 rounded-xl bg-transparent border border-[#235837] text-xs font-bold text-[#8ea496] hover:text-white hover:border-[#34d399] transition-all"
              >
                Or Start 7-Day Free Trial (Cancel Anytime)
              </button>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center justify-center space-x-4 text-[10px] text-[#557762] pt-1">
              <div className="flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>256-Bit SSL Encrypted</span>
              </div>
              <span>•</span>
              <div className="flex items-center space-x-1">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Instant Activation</span>
              </div>
              <span>•</span>
              <div className="flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Satisfaction Guaranteed</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
