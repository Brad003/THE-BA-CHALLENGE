import React from 'react';
import { useApp } from '../../context/AppContext';
import { CommunityLeaderboard } from './CommunityLeaderboard';

export const LeaderboardModal: React.FC = () => {
  const { showLeaderboardModal, setShowLeaderboardModal } = useApp();

  if (!showLeaderboardModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#08110b] border border-[#1b3d28] rounded-3xl p-5 sm:p-7 shadow-2xl my-auto text-[#f4f1ea] max-h-[90vh] overflow-y-auto">
        <CommunityLeaderboard
          isModalView={true}
          onClose={() => setShowLeaderboardModal(false)}
        />
      </div>
    </div>
  );
};
