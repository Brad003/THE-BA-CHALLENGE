const fs = require('fs');
let code = fs.readFileSync('src/components/training/TrainingView.tsx', 'utf8');

code = code.replace(
  /{[^}]*Adaptive Training Plans Button[^}]*}\n\s*<button[\s\S]*?<\/button>/,
  `
        <div className="flex items-center space-x-2 self-start sm:self-auto">
          {/* Build My Own Button */}
          <button
            onClick={() => setShowBuildWorkoutModal(true)}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#0a140e] border border-[var(--accent-main)]/50 text-xs font-bold text-[var(--accent-main)] hover:bg-[#122418] transition-colors"
          >
            <Dumbbell className="w-4 h-4" />
            <span>BUILD MY OWN</span>
          </button>
          
          {/* Adaptive Training Plans Button */}
          <button
            onClick={() => setShowTrainingPlansModal(true)}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#12281a] border border-[#235335] text-xs font-bold text-[#86efac] hover:bg-[#183925] transition-colors"
          >
            <Calendar className="w-4 h-4 text-[var(--accent-main)]" />
            <span>TRAINING PLANS</span>
          </button>
        </div>`
);

fs.writeFileSync('src/components/training/TrainingView.tsx', code);
