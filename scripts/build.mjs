import { readFile, mkdir, writeFile, copyFile, mkdtemp, rename, rmdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, dirname, basename } from 'node:path';
import { validate } from './model.mjs';
import { assetName } from './assets.mjs';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const data = validate(JSON.parse(await readFile(resolve(root, 'data/site.json'), 'utf8')));
import { renderPages } from '../src/templates.mjs';
const assetBytes = {};
const assets = {};
for(const name of ['style.css','app.js']) {
 assetBytes[name]=await readFile(resolve(root,'src',name));
 assets[name]=assetName(name,assetBytes[name]);
}
const screenshots = {};
for(const file of ['manager-catalog.png','admin-world-preview.png']) {
 try { screenshots[file]=await readFile(resolve(root,'src/assets',file)); }
 catch(error) { if(error.code!=='ENOENT') throw error; }
}
const pages = renderPages(data, assets, {screenshots:Object.keys(screenshots)});
const lock = resolve(root, '.build-lock');
await mkdir(lock); // Refuse concurrent publishers rather than interleave output.
let previous;
let movedPrevious = false;
try {
const staging = await mkdtemp(resolve(root, '.build-stage-')); 
for (const [path,html] of pages) {
 const out=resolve(staging,path.slice(1)); await mkdir(out,{recursive:true}); await writeFile(resolve(out,'index.html'),html);
}
for(const name of ['style.css','app.js']) await writeFile(resolve(staging,assets[name]),assetBytes[name]);
await writeFile(resolve(staging,'asset-manifest.json'),JSON.stringify(assets,null,2)+'\n');
await copyFile(resolve(root,'src/favicon.svg'),resolve(staging,'favicon.svg'));
await mkdir(resolve(staging,'assets'),{recursive:true});
for(const [file,bytes] of Object.entries(screenshots)) await writeFile(resolve(staging,'assets',file),bytes);
// Never serve residual files from an older output tree. Keep all previous bytes
// outside the serving root rather than deleting unknown/user-added content.
await mkdir(resolve(root, '.build-backups'), { recursive: true });
previous = resolve(root, '.build-backups', basename(staging));
try { await rename(resolve(root, 'dist'), previous); movedPrevious = true; }
catch (error) { if (error.code !== 'ENOENT') throw error; }
try { await rename(staging, resolve(root, 'dist')); }
catch (error) {
  if (movedPrevious) await rename(previous, resolve(root, 'dist'));
  throw error;
}
console.log('Built 6 pages from a fresh allowlisted staging tree. Previous output preserved outside dist. Publication disabled.');
} finally { await rmdir(lock); }
