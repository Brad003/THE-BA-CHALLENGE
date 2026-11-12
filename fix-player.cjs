const fs = require('fs');
let code = fs.readFileSync('src/components/common/CinematicBackground.tsx', 'utf8');
code = code.replace(
  /<ReactPlayer/g,
  `{/* @ts-ignore */}\n        <ReactPlayer`
);
fs.writeFileSync('src/components/common/CinematicBackground.tsx', code);
