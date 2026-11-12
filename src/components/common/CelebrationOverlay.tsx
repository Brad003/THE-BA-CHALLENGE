import React, { useEffect, useRef } from 'react';
import { RealisticEmblem } from './RealisticEmblem';

export type CelebrationType = 'workout' | 'habit' | 'badge' | 'level';

interface Props {
  isVisible: boolean;
  type: CelebrationType;
  payload?: string;
  onComplete: () => void;
}

class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;

  constructor(x: number, y: number, colors: string[]) {
    this.x = x;
    this.y = y;
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 12 + 2;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.size = Math.random() * 4 + 2;
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.alpha = 1;
    this.decay = Math.random() * 0.02 + 0.015;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.2; // Gravity
    this.alpha -= this.decay;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.alpha);
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

export const CelebrationOverlay: React.FC<Props> = ({ isVisible, type, payload, onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onComplete, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  useEffect(() => {
    if (!isVisible || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set up canvas to full screen
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    const colors = ['var(--accent-main)', '#f5ebd7', '#86efac', '#1b3826', 'var(--accent-bright)'];
    const particles: Particle[] = [];
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    // Burst based on type
    const particleCount = (type === 'level' || type === 'badge') ? 150 : 80;
    
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle(centerX, centerY, colors));
    }
    
    let animationFrameId: number;
    
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      let activeParticles = false;
      for (let i = 0; i < particles.length; i++) {
        if (particles[i].alpha > 0) {
          particles[i].update();
          particles[i].draw(ctx);
          activeParticles = true;
        }
      }
      
      if (activeParticles) {
        animationFrameId = requestAnimationFrame(render);
      }
    };
    
    render();
    
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isVisible, type]);

  if (!isVisible) return null;

  let emblemIcon = 'flame';
  let emblemVariant: 'gold' | 'emerald' | 'amber' | 'silver' | 'bronze' | 'obsidian' = 'gold';
  let title = 'TRAIL CONQUERED';
  let subtitle = 'The Panther Leaves A Mark';
  
  if (type === 'habit') {
    emblemIcon = 'panther';
    emblemVariant = 'emerald';
    title = 'DISCIPLINE MAINTAINED';
  } else if (type === 'badge') {
    emblemIcon = 'shield';
    emblemVariant = 'gold';
    title = 'BADGE UNLOCKED';
    subtitle = payload || 'A new mark of honor.';
  } else if (type === 'level') {
    emblemIcon = 'crown';
    emblemVariant = 'gold';
    title = 'RANK ATTAINED';
    subtitle = payload ? `You are now a ${payload}` : 'Your power grows.';
  }

  return (
    <>
      <style>{`
        @keyframes celebration-fade {
          0% { opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes pop-in {
          0% { transform: scale(0.5) translateY(40px); opacity: 0; }
          20% { transform: scale(1.1) translateY(0); opacity: 1; }
          35% { transform: scale(1) translateY(0); opacity: 1; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes icon-wiggle {
          0% { transform: rotate(0) scale(1); }
          20% { transform: rotate(-10deg) scale(1.1); }
          40% { transform: rotate(10deg) scale(1.1); }
          60% { transform: rotate(-10deg) scale(1.1); }
          80% { transform: rotate(10deg) scale(1.1); }
          100% { transform: rotate(0) scale(1); }
        }
      `}</style>
      <div 
        className="fixed inset-0 z-[200] pointer-events-none flex items-center justify-center bg-black/70 backdrop-blur-sm"
        style={{ animation: 'celebration-fade 4s ease-in-out forwards' }}
      >
        <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />
        
        <div 
          className="relative z-10 flex flex-col items-center justify-center space-y-6"
          style={{ animation: 'pop-in 4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards' }}
        >
          <div 
            className="filter drop-shadow-[0_0_40px_rgba(201,151,56,0.8)]"
            style={{ animation: 'icon-wiggle 1s ease-in-out 0.3s' }}
          >
            <RealisticEmblem
              icon={emblemIcon}
              size="xl"
              variant={emblemVariant}
              showHalo
            />
          </div>
          <div className="text-center px-4">
            <h2 className="font-['Cinzel'] font-bold text-4xl md:text-5xl text-[var(--accent-main)] mb-3 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              {title}
            </h2>
            <p className="text-[#f5ebd7] text-lg font-semibold tracking-widest uppercase opacity-95">
              {subtitle}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
