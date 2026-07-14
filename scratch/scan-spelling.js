import fs from 'fs';

const VALID_EXCEPTIONS = new Set([
  'neue', 'neuer', 'neues', 'neuen', 'neuem', 'neueste', 'neuesten',
  'bauen', 'bauer', 'gebäude', 'feuer', 'feuerwehr', 'teuer', 'teuere',
  'teuerste', 'abenteuer', 'see', 'seen', 'schnee', 'ideen', 'armee',
  'allee', 'kaffee', 'tee', 'püree', 'beeilen', 'beenden', 'beeinflussen',
  'geeignet', 'poet', 'goethe', 'boeing', 'aerger', 'aerzt',
  'zuerich', 'abrunden', 'aktuell', 'eventuell', 'individuell',
  'sexuell', 'visuell', 'dauer', 'dauern', 'dauernd', 'bedauern',
  'sauerkraut', 'sauertöpfisch', 'mauer', 'mauern', 'sauber', 'saubere',
  'kauen', 'blauen', 'grauen', 'schauen', 'zuschauen', 'vertrauen',
  'trauen', 'frauen', 'genauen', 'schlauen', 'verdauen', 'gauchos',
  'museum', 'museen', 'ubahn', 'u-bahn', 'duell', 'quelle', 'quellen',
  'quittung', 'qualität', 'quer', 'bequem', 'bequeme', 'bequemer',
  'bequemste', 'sequenz', 'konsequenz', 'frequenz', 'quatsch',
  'aquarium', 'adäquat', 'äquator', 'konsequent', 'bequemerweise',
  'schaue', 'freue', 'bescheuert', 'baue', 'euer', 'steuern', 'steuer',
  'feucht', 'abenteuerlich', 'abenteurer', 'freuen', 'freude', 'freund',
  'freundin', 'freunde', 'freundlich', 'freundschaft', 'scheuer',
  'scheuen', 'scheu', 'heuer', 'heu', 'treu', 'kauen', 'auen',
  'treue', 'bedeuten', 'bedeutung', 'leute', 'heute', 'treffen',
  'schleuse', 'schleusen', 'kreuz', 'kreuzen', 'kreuzung', 'beute',
  'erzeugen', 'erzeugung', 'feuchtigkeitscreme', 'neuheit', 'neuigkeiten',
  'neugierig', 'neugier', 'feuerwerk', 'feuerzeug', 'abenteuerlustig',
  'abenteuerroman', 'heuhaufen', 'heulend', 'heulen', 'steuererklärung',
  'steuersatz', 'steuerzahler', 'steuermann', 'steuerrad'
]);

function cleanWord(w) {
  return w.toLowerCase().replace(/^[„“"'\-«»“’`]+|[.!?,\-;:„“"'\-«»“’`]+$/g, '');
}

function scanFile(filepath) {
  console.log('=== Scanning:', filepath, '===');
  const content = fs.readFileSync(filepath, 'utf8');
  let count = 0;

  if (filepath.endsWith('.json')) {
    const data = JSON.parse(content);
    data.forEach((item, index) => {
      const de = item.de || '';
      const lookup = item.lookup || '';
      const example = item.example || '';
      
      [de, lookup, example].forEach((text) => {
        const words = text.split(/\s+/);
        words.forEach((w) => {
          const cleaned = cleanWord(w);
          if (cleaned.includes('ae') || cleaned.includes('oe') || cleaned.includes('ue')) {
            let isException = false;
            for (const exc of VALID_EXCEPTIONS) {
              if (cleaned === exc || cleaned.startsWith(exc) || cleaned.endsWith(exc)) {
                isException = true;
                break;
              }
            }
            if (!isException) {
              console.log(`Potential issue in JSON entry [${index}]: text="${text}" (Word: "${w}")`);
              count++;
            }
          }
        });
      });
    });
  } else {
    const deRegex = /de:\s*["`']([^"`']+)["`']/g;
    let match;
    while ((match = deRegex.exec(content)) !== null) {
      const phrase = match[1];
      const words = phrase.split(/\s+/);
      words.forEach((w) => {
        const cleaned = cleanWord(w);
        if (cleaned.includes('ae') || cleaned.includes('oe') || cleaned.includes('ue')) {
          let isException = false;
          for (const exc of VALID_EXCEPTIONS) {
            if (cleaned === exc || cleaned.startsWith(exc) || cleaned.endsWith(exc)) {
              isException = true;
              break;
            }
            // Check if it contains the exception word
            if (cleaned.indexOf(exc) !== -1) {
              isException = true;
              break;
            }
          }
          if (!isException) {
            console.log(`Potential umlaut issue: "${phrase}" (Word: "${w}")`);
            count++;
          }
        }
      });
    }
  }
  console.log(`Found ${count} potential issues.\n`);
}

scanFile('./src/lib/phrasebank.ts');
scanFile('./src/lib/data.ts');
scanFile('./src/lib/bundledWordBank.json');
