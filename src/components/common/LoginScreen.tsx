import React from 'react';
import { useApp } from '../../context/AppContext';
import { PantherLogoIcon } from './PantherSilhouette';
import { LogIn, Loader2, Shield } from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { loginWithGoogle, isSyncing } = useApp();

  return (
    <div className="min-h-screen bg-[#040805] text-[#f4f1ea] flex flex-col items-center justify-center p-6 selection:bg-[var(--accent-main)]/30">
      <div className="w-full max-w-md flex flex-col items-center text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        <div className="relative">
          <div className="absolute inset-0 bg-[var(--accent-main)] blur-[60px] opacity-10 rounded-full"></div>
          <PantherLogoIcon size={80} />
        </div>

        <div className="space-y-3">
          <h1 className="font-['Cinzel'] text-4xl font-bold tracking-widest text-[#f5ebd7]">
            PANTHER
          </h1>
          <h2 className="text-sm font-semibold tracking-[0.2em] text-[var(--accent-main)] uppercase">
            The BA Challenge
          </h2>
          <p className="text-[#8ea496] text-sm max-w-xs mx-auto pt-2 leading-relaxed">
            A brotherhood forged in discipline, sweat, and absolute accountability. Enter the pride.
          </p>
        </div>

        <div className="w-full pt-8 space-y-4">
          <button
            onClick={loginWithGoogle}
            disabled={isSyncing}
            className="w-full relative group overflow-hidden rounded-2xl bg-[#142a1d] hover:bg-[#1a3826] border border-[#23452f] transition-all duration-300 disabled:opacity-50"
          >
            <div className="absolute inset-0 w-1/4 h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-[400%] transition-transform duration-1000"></div>
            <div className="flex items-center justify-center px-6 py-4 space-x-3">
              {isSyncing ? (
                <Loader2 className="w-5 h-5 text-[var(--accent-main)] animate-spin" />
              ) : (
                <Shield className="w-5 h-5 text-[var(--accent-main)]" />
              )}
              <span className="font-bold text-sm tracking-wide text-[#f5ebd7]">
                {isSyncing ? 'AUTHENTICATING...' : 'SECURE SIGN IN WITH GOOGLE'}
              </span>
            </div>
          </button>
          
          <div className="flex items-center justify-center space-x-2 text-[11px] text-[#5c7566]">
            <Shield className="w-3 h-3" />
            <span>Secured by Firebase Authentication</span>
          </div>
        </div>

      </div>
    </div>
  );
};
