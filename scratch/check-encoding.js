import fs from 'fs';

function findIssues(filepath) {
  const content = fs.readFileSync(filepath, 'utf8');
  let data;
  if (filepath.endsWith('.json')) {
    data = JSON.parse(content);
  } else {
    console.log('Searching TS/JS file...');
    const lines = content.split('\n');
    lines.forEach((line, i) => {
      if (line.includes('\uFFFD') || /[\u0080-\uFFFF]/.test(line)) {
        // Log only if it contains replacement char \uFFFD or weird characters, but allow standard German/French chars: äöüßéèêàçîôûÄÖÜœæ
        if (line.includes('\uFFFD') || /[^\x00-\x7FäöüßéèêàçîôûÄÖÜœæëïûüûùœæÂÀÇÉÈÊËÎÏÔŒÙÛÜŸàâæçéèêëîïôœùûüÿœ\'\"\`\s\{\}\[\]\:\,\.\-\!\?\/\\\*\&\%\$\#\@\(\)\_\+\=\;\<\>\~]/i.test(line)) {
          console.log(`TS Line ${i+1}: ${line.trim()}`);
        }
      }
    });
    return;
  }

  console.log('Searching JSON...');
  if (Array.isArray(data)) {
    data.forEach((item, index) => {
      const de = item.de || '';
      const lookup = item.lookup || '';
      const en = item.en || '';
      const example = item.example || '';
      if (de.includes('\uFFFD') || lookup.includes('\uFFFD') || en.includes('\uFFFD') || example.includes('\uFFFD')) {
        console.log(`JSON Index ${index}: de="${de}", lookup="${lookup}", en="${en}", example="${example}"`);
      }
    });
  } else {
    for (const [k, v] of Object.entries(data)) {
      const de = v.de || v.word || '';
      const lookup = v.lookup || k || '';
      if (de.includes('\uFFFD') || lookup.includes('\uFFFD')) {
        console.log(`JSON Key ${k}: de="${de}", lookup="${lookup}"`);
      }
    }
  }
}

findIssues('./src/lib/data.ts');
findIssues('./src/lib/bundledWordBank.json');
