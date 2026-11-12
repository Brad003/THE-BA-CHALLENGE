const fs = require('fs');
let code = fs.readFileSync('src/components/common/LogActivityModal.tsx', 'utf8');
code = code.replace(
  /logCustomActivity\(newLog\);/,
  `logCustomActivity(title.trim(), category, duration, calories);`
);
fs.writeFileSync('src/components/common/LogActivityModal.tsx', code);
