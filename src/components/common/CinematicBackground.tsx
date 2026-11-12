import React from 'react';
import _ReactPlayer from 'react-player';
const ReactPlayer = _ReactPlayer as any;

export const CinematicBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#020503] pointer-events-none">
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-40 mix-blend-screen"
        style={{ width: '100vw', height: '56.25vw', minHeight: '100vh', minWidth: '177.77vh' }}
      >
        {/* @ts-ignore */}
        <ReactPlayer
          url="https://www.youtube.com/watch?v=gThIDTb9k6w"
          playing loop muted width="100%" height="100%"
          config={{ youtube: { playerVars: { controls: 0, showinfo: 0, rel: 0, modestbranding: 1, iv_load_policy: 3, disablekb: 1, playsinline: 1, start: 5 } } as any }}
          style={{ pointerEvents: 'none' }}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#050b07] via-transparent to-[#050b07] z-0 opacity-90" />
      <div className="absolute inset-0 shadow-[inset_0_0_200px_rgba(2,5,3,1)] z-0" />
      <div className="absolute inset-0 bg-[#09150e]/30 z-0 mix-blend-multiply" />
    </div>
  );
};
