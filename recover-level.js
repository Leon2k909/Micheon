import { Level } from 'level';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function dumpDB(sourcePath, dbName) {
  if (!fs.existsSync(sourcePath)) {
    console.log(`Skipping ${dbName}, path does not exist: ${sourcePath}`);
    return;
  }
  
  const tempPath = path.join(os.tmpdir(), `leveldb-copy-${dbName}`);
  fs.rmSync(tempPath, { recursive: true, force: true });
  fs.cpSync(sourcePath, tempPath, { recursive: true });
  
  const db = new Level(tempPath, { valueEncoding: 'utf8' });
  try {
    await db.open();
    let maxCount = 0;
    let bestValue = null;
    let bestKey = null;
    
    for await (const [key, value] of db.iterator()) {
      const k = key.toString();
      const v = value.toString();
      
      // Look for session-completed or review-state
      if (k.includes('session-completed') || k.includes('review-state')) {
        try {
          let cleanV = v;
          const braceIdx = v.indexOf('{');
          const bracketIdx = v.indexOf('[');
          const firstChar = Math.min(
            braceIdx !== -1 ? braceIdx : Infinity,
            bracketIdx !== -1 ? bracketIdx : Infinity
          );
          
          if (firstChar !== Infinity && firstChar > 0) {
            cleanV = v.substring(firstChar);
          }
          
          const parsed = JSON.parse(cleanV);
          const count = Object.keys(parsed).length;
          console.log(`[${dbName}] Found key "${k}" with ${count} items`);
          
          if (count > maxCount) {
            maxCount = count;
            bestValue = cleanV;
            bestKey = k;
          }
        } catch (e) {
          console.log(`[${dbName}] Found key "${k}" but could not parse JSON`);
        }
      }
    }
    
    if (maxCount > 1) {
      console.log(`[${dbName}] BEST FOUND: ${maxCount} items for key ${bestKey}`);
      fs.writeFileSync(path.join(__dirname, 'recovered.json'), bestValue);
    }
  } catch (e) {
    console.error(`Error reading ${dbName}:`, e.message);
  } finally {
    await db.close();
  }
}

async function main() {
  const appdata = process.env.APPDATA;
  const localappdata = process.env.LOCALAPPDATA;

  await dumpDB(path.join(appdata, 'Claude', 'Local Storage', 'leveldb'), 'Claude');
  await dumpDB(path.join(appdata, 'germ', 'Local Storage', 'leveldb'), 'Electron');
  await dumpDB(path.join(localappdata, 'BraveSoftware', 'Brave-Browser-Nightly', 'User Data', 'Default', 'Local Storage', 'leveldb'), 'Brave-Nightly-Default');
  await dumpDB(path.join(localappdata, 'BraveSoftware', 'Brave-Browser-Nightly', 'User Data', 'Profile 1', 'Local Storage', 'leveldb'), 'Brave-Nightly-Profile1');
  await dumpDB(path.join(localappdata, 'ms-playwright', 'mcp-chrome', 'Default', 'Local Storage', 'leveldb'), 'MCP-Chrome');
  await dumpDB(path.join(localappdata, 'Packages', 'Claude_pzs8sxrjxfjjc', 'LocalCache', 'Roaming', 'germ', 'Local Storage', 'leveldb'), 'Claude-Packaged-App');
}

main().catch(console.error);
