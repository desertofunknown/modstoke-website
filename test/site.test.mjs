import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = new URL('../',import.meta.url);
const build = spawnSync(process.execPath,['scripts/build.mjs'],{cwd:root,encoding:'utf8'});
assert.equal(build.status,0,build.stderr);
const pages=['index.html','mods/index.html','tools/index.html','docs/index.html','releases/index.html','404/index.html'];
test('all pages contain accessible navigation and unique main heading',async()=>{
 for(const page of pages){
  const html=await readFile(new URL('../dist/'+page,import.meta.url),'utf8');
  assert.equal((html.match(/<h1[ >]/g)||[]).length,1,page);
  assert.match(html,/lang="en"/);
  assert.match(html,/<main id="main"/);
  assert.match(html,/name="viewport"/);
  assert.match(html,/Skip to content/);
 }
});
test('all local links and fragments resolve',async()=>{
 for(const page of pages){
  const html=await readFile(new URL('../dist/'+page,import.meta.url),'utf8');
  for(const [,href] of html.matchAll(/href="([^"]+)"/g)){
   const url=new URL(href,'https://example.invalid/'+page.replace('index.html',''));
   assert.equal(url.origin,'https://example.invalid');
   const target=url.pathname.endsWith('/')?url.pathname+'index.html':url.pathname;
   const contents=await readFile(resolve(fileURLToPath(root),'dist','.'+target),'utf8');
   if(url.hash) assert.ok(contents.includes(`id="${url.hash.slice(1)}"`),`${page}: ${href}`);
  }
 }
});
test('no fake downloads, external scripts, trackers, or release metadata',async()=>{
 for(const page of pages){
  const html=await readFile(new URL('../dist/'+page,import.meta.url),'utf8');
  assert.doesNotMatch(html,/download=|<script[^>]+https?:|https?:\/\/.*\.(exe|zip|msi)|download count|testimonials/i);
 }
});

test('fresh output excludes stale files and preserves their bytes outside publish root',async()=>{
 const { writeFile, readdir } = await import('node:fs/promises');
 const sentinel='user-added-stale-file.txt';
 await writeFile(new URL('../dist/'+sentinel,import.meta.url),'preserve these bytes');
 const result=spawnSync(process.execPath,['scripts/build.mjs'],{cwd:root,encoding:'utf8'});
 assert.equal(result.status,0,result.stderr);
 await assert.rejects(readFile(new URL('../dist/'+sentinel,import.meta.url)),{code:'ENOENT'});
 const backups=await readdir(new URL('../.build-backups/',import.meta.url));
 let preserved=false;
 for(const backup of backups){
  try { if(await readFile(new URL('../.build-backups/'+backup+'/'+sentinel,import.meta.url),'utf8')==='preserve these bytes')preserved=true; } catch(error){if(error.code!=='ENOENT')throw error;}
 }
 assert.equal(preserved,true);
});

test('selected product screenshots are copied unchanged with truthful captions',async()=>{
 for(const name of ['manager-catalog.png','admin-world-preview.png']){
  let source;
  try { source=await readFile(new URL('../src/assets/'+name,import.meta.url)); }
  catch(error){if(error.code==='ENOENT')continue;throw error;}
  const output=await readFile(new URL('../dist/assets/'+name,import.meta.url));
  assert.deepEqual(output,source);
 }
 const home=await readFile(new URL('../dist/index.html',import.meta.url),'utf8');
 const products=await readFile(new URL('../dist/tools/index.html',import.meta.url),'utf8');
 if(home.includes('manager-catalog.png')) assert.match(home,/Third-party catalog shown/);
 if(products.includes('admin-world-preview.png')) {assert.match(products,/DEVELOPMENT PREVIEW/);assert.match(products,/clock-preflight failure/);}
});

test('all pages reference exact content-hashed assets and no unversioned files',async()=>{
 const { createHash }=await import('node:crypto');
 const manifest=JSON.parse(await readFile(new URL('../dist/asset-manifest.json',import.meta.url),'utf8'));
 for(const name of ['style.css','app.js']){
  const bytes=await readFile(new URL('../src/'+name,import.meta.url));
  const [stem,extension]=name.split('.');
  const expected=`${stem}.${createHash('sha256').update(bytes).digest('hex').slice(0,16)}.${extension}`;
  assert.equal(manifest[name],expected);
  assert.deepEqual(await readFile(new URL('../dist/'+expected,import.meta.url)),bytes);
  await assert.rejects(readFile(new URL('../dist/'+name,import.meta.url)),{code:'ENOENT'});
  for(const page of pages){
   const html=await readFile(new URL('../dist/'+page,import.meta.url),'utf8');
   assert.ok(html.includes(`"/${expected}"`),page);
   assert.ok(!html.includes(`"/${name}"`),page);
  }
 }
});
