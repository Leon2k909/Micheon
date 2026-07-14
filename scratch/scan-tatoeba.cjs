const fs = require('fs');
const path = require('path');

const tatoebaPath = path.join(__dirname, '..', 'src', 'lib', 'tatoeba.de-en.json');
const raw = JSON.parse(fs.readFileSync(tatoebaPath, 'utf8'));

const candidates = [];

for (const s of raw) {
  const de = s.de;
  const en = s.en;
  const level = s.level;

  // 1. Check for disrespectful article-as-pronoun (Der/Die/Das referring to humans)
  // German: Die / Der / Den / Dem ... at the start
  // English: He / She / They / Him / Her / Them
  const firstWordDe = de.split(' ')[0];
  const firstWordEn = en.split(' ')[0].replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");

  const deArticleMatch = /^(Der|Die|Den|Dem)$/i.test(firstWordDe);
  const enPronounMatch = /^(He|She|They|Him|Her|Them)$/i.test(firstWordEn) || 
                         /^(He's|She's|They're|They'll|He'll|She'll)$/i.test(en.split(' ')[0]);

  if (deArticleMatch && enPronounMatch) {
    candidates.push({
      type: 'Article as Pronoun (potential disrespectful/colloquial)',
      de,
      en,
      level
    });
  }

  // 2. Stylistic inversions (Dich / Ihn / Mir / Dir / Uns / Euch / Mich at start)
  if (/^(Dich|Ihn|Mir|Dir|Mich|Ihm|Ihr|Uns|Euch)\b/.test(de)) {
    // Make sure it's not a question starting with "Ihr ..."
    if (!de.endsWith('?')) {
      candidates.push({
        type: 'Stylistic Inversion',
        de,
        en,
        level
      });
    }
  }

  // 3. Literally translated "Zeit" phrases (excluding common ones like "Ich habe Zeit")
  if (/zeit/i.test(de) && !/habe\s+zeit|hast\s+zeit|haben\s+zeit|hatte\s+zeit|hätten\s+zeit|hätte\s+zeit/i.test(de)) {
    candidates.push({
      type: 'Time phrase (potential literal translation)',
      de,
      en,
      level
    });
  }
}

const earlyCandidates = candidates.filter(c => c.level === 'A1' || c.level === 'A2');
fs.writeFileSync(path.join(__dirname, 'scan-results.json'), JSON.stringify(earlyCandidates, null, 2));
console.log(`Found ${earlyCandidates.length} candidates in A1/A2.`);
