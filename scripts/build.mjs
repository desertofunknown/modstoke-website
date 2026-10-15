import { readFile, mkdir, writeFile, copyFile, mkdtemp, rename, rmdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { resolve, dirname, basename } from 'node:path';
import { validate } from './model.mjs';
import { assetName } from './assets.mjs';
import { validateReleaseIndex, verifiedArtifacts, verifyCopiedArtifact, loaderManifest, packageInventoryPath } from './releases.mjs';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const data = validate(JSON.parse(await readFile(resolve(root, 'data/site.json'), 'utf8')));
const releaseIndex = validateReleaseIndex(JSON.parse(await readFile(resolve(root, 'data/releases.json'), 'utf8')));
const hostedArtifacts = await verifiedArtifacts(root, releaseIndex);
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
const pages = renderPages(data, assets, {screenshots:Object.keys(screenshots), releaseIndex});
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
await writeFile(resolve(staging,'release-index.json'),JSON.stringify(releaseIndex,null,2)+'\n');
await copyFile(resolve(root,'src/favicon.svg'),resolve(staging,'favicon.svg'));
await mkdir(resolve(staging,'assets'),{recursive:true});
for(const [file,bytes] of Object.entries(screenshots)) await writeFile(resolve(staging,'assets',file),bytes);
for (const {metadata,source} of hostedArtifacts) {
 const target=resolve(staging,'.'+metadata.sitePath);
 await mkdir(dirname(target),{recursive:true});
 await copyFile(source,target);
 await verifyCopiedArtifact(target,metadata);
}
for (const record of releaseIndex.releases.filter(x=>x.product==='loader')) {
 const manifest=await loaderManifest(root,record,process.env.PUBLIC_ORIGIN);
 const bundle=hostedArtifacts.find(x=>x.record.releaseId===record.releaseId);
 const inventory=await packageInventoryPath(root,record.releaseId);
 execFileSync(process.env.PYTHON || (process.platform==='win32'?'python':'python3'),[
  resolve(root,'scripts/verify-loader-zip.py'), bundle.source,
  resolve(root,'data/loader-manifests',`${record.releaseId}.json`),
  inventory,
  record.bundled.sdk.assemblyPath,record.bundled.client.installPath,record.releaseId
 ],{stdio:'inherit'});
 const output=resolve(staging,'releases/loader',record.version,'OpenACAILoader.manifest.json');
 await mkdir(dirname(output),{recursive:true});
 await writeFile(output,JSON.stringify(manifest,null,2)+'\n');
 if (record.releaseId===releaseIndex.latest.loader) {
  const latest=resolve(staging,'releases/loader/latest/OpenACAILoader.manifest.json');
  await mkdir(dirname(latest),{recursive:true});
  await writeFile(latest,JSON.stringify(manifest,null,2)+'\n');
 }
}
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
console.log(`Built 6 pages and ${hostedArtifacts.length} verified release artifacts from a fresh allowlisted staging tree. Previous output preserved outside dist.`);
} finally { await rmdir(lock); }
