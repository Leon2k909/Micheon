const fs = require('fs');
const path = require('path');

const sharedPath = path.join(__dirname, 'shared-progress.json');
const recoveredPath = path.join(__dirname, 'recovered.json');

const shared = JSON.parse(fs.readFileSync(sharedPath, 'utf8'));
const recovered = JSON.parse(fs.readFileSync(recoveredPath, 'utf8'));

const currentKey = 'session-completed:leon--leon-ordifydirect-com';
let current = {};
try {
  current = JSON.parse(shared.items[currentKey] || '{}');
} catch(e){}

for (const [key, value] of Object.entries(recovered)) {
  let grade = value.lastGrade;
  if (grade === 'good' || grade === 'easy' || grade === 'know') grade = 'know';
  else grade = 'struggle';
  
  if (!current[key]) {
    current[key] = {
      lastGrade: grade,
      updatedAt: new Date().toISOString()
    };
  }
}

shared.items[currentKey] = JSON.stringify(current);
shared.updatedAt = new Date().toISOString();

fs.writeFileSync(sharedPath, JSON.stringify(shared, null, 2));

// Also update APPDATA if it exists
const appdata = process.env.APPDATA;
const appdataDir = path.join(appdata, 'germ');
const appdataFile = path.join(appdataDir, 'shared-progress.json');
if (fs.existsSync(appdataDir)) {
  fs.writeFileSync(appdataFile, JSON.stringify(shared, null, 2));
}

console.log('Merged recovered words into shared-progress.json');
