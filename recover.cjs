const fs = require('fs');
const path = require('path');

function scanDirectory(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file.endsWith('.log') || file.endsWith('.ldb')) {
      const p = path.join(dir, file);
      try {
        const content = fs.readFileSync(p, 'utf8'); // read as string to allow easy index of
        let bestStr = null;
        let maxCount = 1;
        
        // Find all occurrences of "session-completed:"
        let idx = content.indexOf('session-completed:');
        while (idx !== -1) {
          // Look for the first '{' after this key
          const start = content.indexOf('{', idx);
          if (start !== -1 && start < idx + 100) {
            // Find matching '}' by counting brackets
            let brackets = 0;
            let end = -1;
            for (let i = start; i < content.length; i++) {
              if (content[i] === '{') brackets++;
              if (content[i] === '}') brackets--;
              if (brackets === 0) {
                end = i;
                break;
              }
            }
            if (end !== -1) {
              const jsonStr = content.substring(start, end + 1);
              try {
                const parsed = JSON.parse(jsonStr);
                const count = Object.keys(parsed).length;
                if (count > maxCount) {
                  maxCount = count;
                  bestStr = jsonStr;
                }
              } catch (e) {}
            }
          }
          idx = content.indexOf('session-completed:', idx + 1);
        }
        if (bestStr) {
          console.log(`FOUND in ${p} (${maxCount} items)`);
          fs.writeFileSync(path.join(__dirname, 'recovered.json'), bestStr);
        }
      } catch (e) {}
    }
  }
}

const appdata = process.env.APPDATA;
const localappdata = process.env.LOCALAPPDATA;

console.log("Scanning Electron LocalStorage...");
scanDirectory(path.join(appdata, 'germ', 'Local Storage', 'leveldb'));

console.log("Scanning Brave Nightly LocalStorage...");
scanDirectory(path.join(localappdata, 'BraveSoftware', 'Brave-Browser-Nightly', 'User Data', 'Default', 'Local Storage', 'leveldb'));

console.log("Scanning Chrome LocalStorage...");
scanDirectory(path.join(localappdata, 'Google', 'Chrome', 'User Data', 'Default', 'Local Storage', 'leveldb'));
