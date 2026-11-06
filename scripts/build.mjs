import { readFile, readdir, mkdir, writeFile, copyFile, mkdtemp, rename, rmdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { resolve, dirname, basename } from 'node:path';
import { validate } from './model.mjs';
import { assetName } from './assets.mjs';
import { projectKnowledgeSnapshot } from '../src/project-knowledge-view.mjs';
import { sitemap, robots } from '../src/seo.mjs';
import { validateReleaseIndex, verifiedArtifacts, verifyCopiedArtifact, loaderManifest, packageInventoryPath } from './releases.mjs';
import { validateStoreCatalog, availableMedia, mediaVariants } from './store.mjs';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const data = validate(JSON.parse(await readFile(resolve(root, 'data/site.json'), 'utf8')));
const releaseIndex = validateReleaseIndex(JSON.parse(await readFile(resolve(root, 'data/releases.json'), 'utf8')));
const projectKnowledge = projectKnowledgeSnapshot(JSON.parse(await readFile(resolve(root, 'data/project-knowledge.json'), 'utf8')), releaseIndex);
const hostedArtifacts = await verifiedArtifacts(root, releaseIndex);
const catalog = validateStoreCatalog(JSON.parse(await readFile(resolve(root, 'data/store/catalog.json'), 'utf8')));
const media = await availableMedia(root, catalog);
import { renderPages } from '../src/templates.mjs';
const assetBytes = {};
const assets = {};
for(const name of ['style.css','app.js','servers.css','servers.js','guides.css','support.js']) {
 assetBytes[name]=await readFile(resolve(root,'src',name));
 assets[name]=assetName(name,assetBytes[name]);
}
const screenshots = {};
for(const file of ['manager-catalog.png','manager-catalog.webp','manager-catalog-1200.webp','manager-catalog-800.webp','manager-trailer.jpg','manager-trailer.webp','manager-trailer-800.webp','loader-trailer.jpg','loader-trailer.webp','loader-trailer-800.webp','modstoke-social.png','modstoke-logo.png','home/golden-mountains-1200.webp','home/golden-mountains-2400.webp','home/golden-mountains-2400.jpg',...mediaVariants('/assets/tools/loader-mods-menu-1600.webp').map(path=>path.slice('/assets/'.length))]) {
 try { screenshots[file]=await readFile(resolve(root,'src/assets',file)); }
 catch(error) { if(error.code!=='ENOENT') throw error; }
}
const toolShots = mediaVariants('/assets/tools/loader-mods-menu-1600.webp').every(path=>screenshots[path.slice('/assets/'.length)]) ? ['loader-mods-menu'] : [];
const pages = renderPages(data, assets, {screenshots:Object.keys(screenshots), releaseIndex, projectKnowledge, catalog, media, toolShots});
const lock = resolve(root, '.build-lock');
await mkdir(lock); // Refuse concurrent publishers rather than interleave output.
let previous;
let movedPrevious = false;
try {
const staging = await mkdtemp(resolve(root, '.build-stage-')); 
for (const [path,html] of pages) {
 const out=resolve(staging,path.slice(1)); await mkdir(out,{recursive:true}); await writeFile(resolve(out,'index.html'),html);
}
for(const name of ['style.css','app.js','servers.css','servers.js','guides.css','support.js']) await writeFile(resolve(staging,assets[name]),assetBytes[name]);
await writeFile(resolve(staging,'asset-manifest.json'),JSON.stringify(assets,null,2)+'\n');
await writeFile(resolve(staging,'release-index.json'),JSON.stringify(releaseIndex,null,2)+'\n');
await mkdir(resolve(staging,'community'),{recursive:true});
await writeFile(resolve(staging,'community/knowledge.json'),JSON.stringify(projectKnowledge,null,2)+'\n');
await copyFile(resolve(root,'src/favicon.svg'),resolve(staging,'favicon.svg'));
await writeFile(resolve(staging,'sitemap.xml'),sitemap(pages.map(([path])=>path)));
await writeFile(resolve(staging,'robots.txt'),robots);
await mkdir(resolve(staging,'assets'),{recursive:true});
for(const [file,bytes] of Object.entries(screenshots)) { await mkdir(dirname(resolve(staging,'assets',file)),{recursive:true}); await writeFile(resolve(staging,'assets',file),bytes); }
for(const path of media) for(const variant of mediaVariants(path)) { const target=resolve(staging,variant.slice(1)); await mkdir(dirname(target),{recursive:true}); await copyFile(resolve(root,'src',variant.slice(1)),target); }
await mkdir(resolve(staging,'fonts'),{recursive:true});
for(const file of await readdir(resolve(root,'src/fonts'))) if(/\.woff2$|^LICENSE\.txt$/.test(file)) await copyFile(resolve(root,'src/fonts',file),resolve(staging,'fonts',file));
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
  record.bundled.sdk.assemblyPath,record.bundled.client?.installPath ?? '',record.releaseId
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
console.log(`Built ${pages.length} pages and ${hostedArtifacts.length} verified release artifacts from a fresh allowlisted staging tree. Previous output preserved outside dist.`);
} finally { await rmdir(lock); }
