import React, { useState } from 'react';
import { X, Key, Shield, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

interface JoinCircleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoinedSuccess?: (circleId: string) => void;
}

export const JoinCircleModal: React.FC<JoinCircleModalProps> = ({
  isOpen,
  onClose,
  onJoinedSuccess
}) => {
  const { joinBrotherhoodCircleByCode, brotherhoodCircles } = useApp();
  const [code, setCode] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) return;

    const result = joinBrotherhoodCircleByCode(cleanCode);
    if (result.success) {
      setSuccessMessage(result.message);
      setTimeout(() => {
        if (result.circle && onJoinedSuccess) {
          onJoinedSuccess(result.circle.id);
        }
        onClose();
      }, 1000);
    } else {
      setErrorMessage(result.message);
    }
  };

  // Preset quick-test codes from existing circles for easy testing
  const sampleCodes = brotherhoodCircles.slice(0, 3).map(c => ({
    name: c.name,
    code: c.inviteCode,
    color: c.themeColor
  }));

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
        <div className="flex items-center space-x-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-[#143422] border border-[#2d6844] flex items-center justify-center">
            <Key className="w-6 h-6 text-[#86efac]" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-['Cinzel'] text-[#f5ebd7]">
              Join Brotherhood Circle
            </h2>
            <p className="text-xs text-[#8da696]">
              Enter the private invitation code provided by your brother
            </p>
          </div>
        </div>

        <form onSubmit={handleJoin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#a7c4b1] mb-1.5">
              Circle Invite Code
            </label>
            <div className="relative">
              <input
                type="text"
                autoFocus
                required
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.toUpperCase());
                  setErrorMessage(null);
                }}
                placeholder="e.g. RIDGE-5500"
                className="w-full pl-3.5 pr-10 py-3 bg-[#07110b] border border-[#1d3d28] rounded-xl text-base font-mono font-bold tracking-widest text-[#4ade80] placeholder-[#4f6f5b] focus:outline-none focus:border-[#4ade80]"
              />
              <Shield className="w-5 h-5 text-[#4f6f5b] absolute right-3.5 top-3.5" />
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-950/40 border border-red-800/60 rounded-xl flex items-center space-x-2 text-xs text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-950/40 border border-emerald-700/60 rounded-xl flex items-center space-x-2 text-xs text-emerald-300">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Sample quick test hints */}
          {sampleCodes.length > 0 && (
            <div className="pt-2 border-t border-[#183122]">
              <span className="text-[11px] text-[#718d7c] block mb-2 font-medium">
                Try active brotherhood codes:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {sampleCodes.map((s) => (
                  <button
                    key={s.code}
                    type="button"
                    onClick={() => {
                      setCode(s.code);
                      setErrorMessage(null);
                    }}
                    className="px-2.5 py-1 bg-[#09150e] hover:bg-[#153421] border border-[#1a3825] rounded-lg text-xs font-mono text-[#86efac] transition-colors"
                  >
                    {s.code}
                  </button>
                ))}
              </div>
            </div>
          )}

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
              disabled={!code.trim()}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-black bg-[#4ade80] hover:bg-[#22c55e] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-green-900/30 flex items-center gap-2"
            >
              <span>Unlock Circle</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
