import React from 'react';
import { Shield } from 'lucide-react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { DashboardView } from './components/dashboard/DashboardView';
import { TrainingView } from './components/training/TrainingView';
import { DisciplineView } from './components/discipline/DisciplineView';
import { CommunityView } from './components/community/CommunityView';
import { ProfileView } from './components/profile/ProfileView';

// Modals
import { OnboardingModal } from './components/onboarding/OnboardingModal';
import { WorkoutPlayerModal } from './components/training/WorkoutPlayerModal';
import { TrainingPlansModal } from './components/training/TrainingPlansModal';
import { BuildWorkoutModal } from './components/training/BuildWorkoutModal';
import { GreenLegacyModal } from './components/greenlegacy/GreenLegacyModal';
import { WellnessModal } from './components/wellness/WellnessModal';
import { LeaderboardModal } from './components/leaderboard/LeaderboardModal';
import { AdminDashboardModal } from './components/admin/AdminDashboardModal';
import { LogActivityModal } from './components/common/LogActivityModal';
import { WeeklySummaryModal } from './components/dashboard/WeeklySummaryModal';
import { OutdoorTrackerModal } from './components/outdoor/OutdoorTrackerModal';
import { PremiumModal } from './components/premium/PremiumModal';
import { DeepWorkoutAnalysisModal } from './components/analytics/DeepWorkoutAnalysisModal';
import { VideoFormAnalysisModal } from './components/training/VideoFormAnalysisModal';

import { LoginScreen } from './components/common/LoginScreen';
import { CinematicBackground } from './components/common/CinematicBackground';

const AppContent: React.FC = () => {
  const { activeTab, toastMessage, firebaseUser, isAuthReady, user, updateUserProfile, setShowWeeklySummaryModal } = useApp();

  React.useEffect(() => {
    if (user && user.themePreference === 'amber') {
      document.documentElement.setAttribute('data-theme', 'amber');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [user?.themePreference]);

  // Trigger Weekly Summary on Sundays
  React.useEffect(() => {
    if (user) {
      const today = new Date();
      const isSunday = today.getDay() === 0;
      
      // Use YYYY-MM-DD format for consistency
      const todayStr = today.toISOString().split('T')[0];
      
      if (isSunday && user.lastWeeklySummaryDate !== todayStr) {
        setShowWeeklySummaryModal(true);
        updateUserProfile({ lastWeeklySummaryDate: todayStr });
      }
    }
  }, [user, setShowWeeklySummaryModal, updateUserProfile]);

  if (!isAuthReady) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-2 border-[var(--accent-main)] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[#8ea496] text-xs font-semibold tracking-widest uppercase">Initializing Vault...</p>
        </div>
      </div>
    );
  }

  if (!firebaseUser) {
    return <LoginScreen />;
  }

  return (
    <div className="min-h-screen bg-transparent text-[#f4f1ea] font-sans antialiased selection:bg-[var(--accent-main)]/30 selection:text-[#f5ebd7] flex flex-col justify-between">
      <CinematicBackground />
      {/* Top Application Header */}
      <Header />

      {/* Main Screen Layout based on activeTab */}
      <main className="flex-1 w-full">
        {activeTab === 'home' && <DashboardView />}
        {activeTab === 'train' && <TrainingView />}
        {activeTab === 'challenges' && <DisciplineView />}
        {activeTab === 'community' && <CommunityView />}
        {activeTab === 'profile' && <ProfileView />}
      </main>

      {/* Floating Global Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-[#0f2418] border border-[var(--accent-main)] text-xs font-semibold text-[#f5ebd7] shadow-[0_0_25px_rgba(201,151,56,0.35)] flex items-center space-x-2 animate-bounce">
          <Shield className="w-4 h-4 text-[var(--accent-main)] flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Persistent Bottom Mobile Navigation Bar */}
      <BottomNav />

      {/* Interactive Feature Modals */}
      <OnboardingModal />
      <WorkoutPlayerModal />
      <TrainingPlansModal />
      <BuildWorkoutModal />
      <GreenLegacyModal />
      <WellnessModal />
      <LeaderboardModal />
      <AdminDashboardModal />
      <LogActivityModal />
      <WeeklySummaryModal />
      <OutdoorTrackerModal />
      <PremiumModal />
      <DeepWorkoutAnalysisModal />
      <VideoFormAnalysisModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
