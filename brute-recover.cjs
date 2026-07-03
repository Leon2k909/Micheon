const fs = require('fs');
const path = require('path');

function scanDirectory(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file.endsWith('.log') || file.endsWith('.ldb') || file.endsWith('.sst')) {
      const p = path.join(dir, file);
      try {
        const content = fs.readFileSync(p, 'utf8');
        
        // We will look for anything that looks like {"part...":{"lastGrade"
        // Since we want the biggest one, we'll search by regex first, then expand
        let idx = content.indexOf('"lastGrade"');
        while (idx !== -1) {
          // find the start of this JSON
          // It should be a '{' character
          let start = -1;
          for (let i = idx; i >= 0; i--) {
            if (content[i] === '{') {
              // check if this is the root by parsing
              // we can just find the first { that is not immediately preceded by another json key
              // Let's just walk backward and try to parse
            }
          }
          idx = content.indexOf('"lastGrade"', idx + 1);
        }
      } catch(e) {}
    }
  }
}
