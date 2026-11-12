const fs = require('fs');
let code = fs.readFileSync('src/context/AppContext.tsx', 'utf8');
code = code.replace(
  /const \[showWeeklySummaryModal,[\s\S]*?setShowBuildWorkoutModal\] = useState<boolean>\(false\);/,
  `const [showWeeklySummaryModal, setShowWeeklySummaryModal] = useState<boolean>(false);\n  const [showBuildWorkoutModal, setShowBuildWorkoutModal] = useState<boolean>(false);`
);
fs.writeFileSync('src/context/AppContext.tsx', code);
