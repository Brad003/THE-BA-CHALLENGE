const fs = require('fs');
let code = fs.readFileSync('src/components/common/CinematicBackground.tsx', 'utf8');
code = code.replace(
  /import ReactPlayer from 'react-player';/,
  `import _ReactPlayer from 'react-player';\nconst ReactPlayer = _ReactPlayer as any;`
);
fs.writeFileSync('src/components/common/CinematicBackground.tsx', code);
