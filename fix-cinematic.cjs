const fs = require('fs');
let code = fs.readFileSync('src/components/common/CinematicBackground.tsx', 'utf8');

code = code.replace(
  /youtube: \{[\s\S]*?\} as any/g,
  `youtube: { playerVars: { controls: 0, showinfo: 0, rel: 0, modestbranding: 1, iv_load_policy: 3, disablekb: 1, playsinline: 1, start: 5 } } as any`
);

// If that fails we just replace the whole config
code = code.replace(
  /config=\{\{[\s\S]*?\}\}/,
  `config={{ youtube: { playerVars: { controls: 0, showinfo: 0, rel: 0, modestbranding: 1, iv_load_policy: 3, disablekb: 1, playsinline: 1, start: 5 } } as any }}`
);

fs.writeFileSync('src/components/common/CinematicBackground.tsx', code);
