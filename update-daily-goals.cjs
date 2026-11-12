const fs = require('fs');

let code = fs.readFileSync('src/components/dashboard/DailyGoals.tsx', 'utf8');

// 1. Add import
code = code.replace(
  /import \{ CheckCircle2, Edit2, Check, X, Target, Bell \} from 'lucide-react';/,
  `import { CheckCircle2, Edit2, Check, X, Target, Bell } from 'lucide-react';\nimport { CompletionSpark } from '../common/CompletionSpark';\nimport { useRef, useEffect } from 'react';`
);

// 2. We need a small wrapper component or we can just keep state for the last completed habit id.
// Let's replace the whole file. It's safer and cleaner.
