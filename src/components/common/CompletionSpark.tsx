import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface CompletionSparkProps {
  trigger: boolean; // Triggers when true
}

export const CompletionSpark: React.FC<CompletionSparkProps> = ({ trigger }) => {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    if (trigger) {
      // Generate some particles
      const newParticles = Array.from({ length: 12 }).map((_, i) => ({
        id: Date.now() + i,
        x: (Math.random() - 0.5) * 100, // random x spread
        y: (Math.random() - 0.5) * 100, // random y spread
      }));
      setParticles(newParticles);
      
      // Clear after animation
      const timer = setTimeout(() => {
        setParticles([]);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [trigger]);

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-50 overflow-visible">
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
            animate={{ 
              opacity: 0, 
              scale: Math.random() * 1.5 + 0.5, 
              x: p.x, 
              y: p.y 
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute w-2 h-2 rounded-full bg-[var(--accent-main)] shadow-[0_0_10px_var(--accent-main)]"
            style={{
              backgroundColor: Math.random() > 0.5 ? '#f5ebd7' : 'var(--accent-main)'
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};
