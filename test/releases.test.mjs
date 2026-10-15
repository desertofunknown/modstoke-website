import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { mkdtemp, mkdir, writeFile, symlink, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateReleaseIndex, verifiedArtifacts, loaderManifest } from '../scripts/releases.mjs';

const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const commit = 'a'.repeat(40);
const checks = {cleanSource:'passed',licenses:'passed',build:'passed',install:'passed',game:'passed',multiplayer:'passed',hostedFetch:'passed'};
const empty = () => ({schema:1,latest:{manager:null,loader:null},releases:[]});
function manager(bytes = Buffer.from('test Manager bytes')) {
 const sha256=hash(bytes);
 return {releaseId:'manager-fixture',product:'manager',version:'1.2.3',channel:'stable',publishedUtc:'2026-10-15T00:00:00Z',sourceCommit:commit,defaultLoaderReleaseId:null,notesPath:'/releases/#manager-fixture',validation:{...checks},artifacts:[{kind:'manager-windows',sitePath:'/downloads/manager/1.2.3/Manager.exe',fileName:'Manager.exe',size:bytes.length,sha256,signatureStatus:'verified',signingEvidence:{publisher:'Fixture only',verifiedUtc:'2026-10-15T00:00:00Z',files:[{path:'Manager.exe',sha256,certificateThumbprint:'b'.repeat(40)}]}}]};
}
function loader(bytes = Buffer.from('test Loader ZIP bytes')) {
 const sha256=hash(bytes);
 return {releaseId:'loader-fixture',product:'loader',version:'2.3.4',channel:'preview',publishedUtc:'2026-10-15T00:00:00Z',sourceCommit:commit,notesPath:'/releases/#loader-fixture',validation:{...checks},compatibility:{gameId:'sons-of-the-forest',testedGameBuilds:['fixture-build'],minManagerVersion:'1.2.3'},bundled:{sdk:{assemblyPath:'OpenACAI/Runtime/OpenACAI.Endnight.Loader.Core.dll',sourceCommit:commit},client:{pluginId:'com.fixture.client',version:'1.0.0',installPath:'BepInEx/plugins/FixtureClient.dll',sourceCommit:commit}},artifacts:[{kind:'game-root-bundle',sitePath:'/downloads/loader/2.3.4/Loader.zip',fileName:'Loader.zip',size:bytes.length,sha256,signatureStatus:'verified',signingEvidence:{publisher:'Fixture only',verifiedUtc:'2026-10-15T00:00:00Z',files:[{path:'winhttp.dll',sha256:hash(Buffer.from('fixture signed dll')),certificateThumbprint:'c'.repeat(40)}]}}]};
}

test('empty release index is valid and has no selected downloads', () => {
 assert.deepEqual(validateReleaseIndex(empty()),empty());
});

test('latest release must match product and Manager bundle reference', () => {
 const m=manager(), l=loader();
 const index={schema:1,latest:{manager:m.releaseId,loader:l.releaseId},releases:[m,l]};
 assert.equal(validateReleaseIndex(index).latest.loader,l.releaseId);
 index.latest.loader=m.releaseId;
 assert.throws(()=>validateReleaseIndex(index),/latest.loader/);
 index.latest.loader=l.releaseId;
 m.defaultLoaderReleaseId='missing-loader';
 assert.throws(()=>validateReleaseIndex(index),/default Loader release is missing/);
 m.defaultLoaderReleaseId=l.releaseId;
 index.latest.loader=null;
 assert.throws(()=>validateReleaseIndex(index),/selections do not match/);
});

test('mutable paths, placeholder hashes, and missing client identity cannot publish', () => {
 const l=loader();
 const index={schema:1,latest:{manager:null,loader:l.releaseId},releases:[l]};
 l.artifacts[0].sitePath='/releases/latest/Loader.zip';
 assert.throws(()=>validateReleaseIndex(index),/path is mutable/);
 l.artifacts[0].sitePath='/downloads/loader/2.3.4/Loader.zip';
 l.artifacts[0].sha256='pending';
 assert.throws(()=>validateReleaseIndex(index),/artifact metadata/);
 l.artifacts[0].sha256=hash(Buffer.from('test Loader ZIP bytes'));
 l.bundled.client.pluginId='com.openacai.sotf.admin';
 assert.throws(()=>validateReleaseIndex(index),/host Admin/);
});

test('preview can disclose unsigned and pending play checks without relaxing rights or install gates', () => {
 const m=manager();
 m.channel='preview';
 m.validation.game='pending';
 m.validation.multiplayer='pending';
 m.artifacts[0].signatureStatus='unsigned-preview';
 m.artifacts[0].signingEvidence=null;
 m.artifacts[0].unsignedReason='Signing is pending for this test build';
 const index={schema:1,latest:{manager:m.releaseId,loader:null},releases:[m]};
 assert.equal(validateReleaseIndex(index).latest.manager,m.releaseId);
 m.channel='stable';
 assert.throws(()=>validateReleaseIndex(index),/incomplete release validation|stable artifacts require verified signatures/);
 m.channel='preview';
 m.artifacts[0].unsignedReason='';
 assert.throws(()=>validateReleaseIndex(index),/unsigned preview requires/);
 m.artifacts[0].unsignedReason='Signing is pending for this test build';
 m.validation.install='pending';
 assert.throws(()=>validateReleaseIndex(index),/install has not passed/);
 m.validation.install='passed';
 m.validation.licenses='pending';
 assert.throws(()=>validateReleaseIndex(index),/licenses has not passed/);
});

test('Loader preview has unknown game builds until the game check passes', () => {
 const l=loader();
 l.validation.game='pending';
 l.validation.multiplayer='pending';
 l.compatibility.testedGameBuilds=[];
 l.artifacts[0].signatureStatus='unsigned-preview';
 l.artifacts[0].signingEvidence=null;
 l.artifacts[0].unsignedReason='Signing is pending for this test bundle';
 const index={schema:1,latest:{manager:null,loader:l.releaseId},releases:[l]};
 assert.equal(validateReleaseIndex(index).latest.loader,l.releaseId);
 l.compatibility.testedGameBuilds=['untested-build'];
 assert.throws(()=>validateReleaseIndex(index),/tested game builds must match/);
 l.compatibility.testedGameBuilds=[];
 l.channel='stable';
 assert.throws(()=>validateReleaseIndex(index),/incomplete release validation|Loader game and multiplayer/);
});

test('hosted artifact bytes and paths are checked before publication', async t => {
 const root=await mkdtemp(join(tmpdir(),'modstoke-release-test-'));
 t.after(()=>rm(root,{recursive:true,force:true}));
 const bytes=Buffer.from('test Manager bytes');
 const m=manager(bytes);
 const index={schema:1,latest:{manager:m.releaseId,loader:null},releases:[m]};
 const dir=join(root,'artifacts','hosted','manager','1.2.3');
 await mkdir(dir,{recursive:true});
 const file=join(dir,'Manager.exe');
 await writeFile(file,bytes);
 assert.equal((await verifiedArtifacts(root,index)).length,1);
 await writeFile(file,'different Manager bytes');
 await assert.rejects(verifiedArtifacts(root,index),/hosted bytes differ/);
 await rm(file);
 try {
  await symlink(join(root,'outside.exe'),file,'file');
  await assert.rejects(verifiedArtifacts(root,index),/symlink/);
 } catch(error) {
  if (!['EPERM','EACCES','ENOTSUP'].includes(error.code)) throw error;
  t.diagnostic('Symlink creation unavailable on this Windows account');
 }
});

test('schema-1 Loader manifest gets immutable website URLs and requires SDK and client files', async t => {
 const root=await mkdtemp(join(tmpdir(),'modstoke-manifest-test-'));
 t.after(()=>rm(root,{recursive:true,force:true}));
 const l=loader();
 const source={schema:1,name:'Fixture Loader',version:l.version,generatedUtc:'2026-10-15T00:00:00Z',package:{fileName:'Loader.zip',sha256:l.artifacts[0].sha256},update:{minManagerVersion:'1.2.3'},runtime:{targetFramework:'net11.0',dotnetRuntimeVersion:'11.0.0',supportPolicy:'fixture',redLoaderCompatibilityTarget:'fixture'},files:[
  {path:'winhttp.dll',size:18,sha256:hash(Buffer.from('fixture signed dll'))},
  {path:l.bundled.sdk.assemblyPath,size:4,sha256:hash('core')},
  {path:l.bundled.client.installPath,size:6,sha256:hash('client')}
 ]};
 const dir=join(root,'data','loader-manifests');
 await mkdir(dir,{recursive:true});
 const file=join(dir,'loader-fixture.json');
 await writeFile(file,JSON.stringify(source));
 const result=await loaderManifest(root,l,'https://example.org');
 assert.equal(result.package.downloadUrl,'https://example.org/downloads/loader/2.3.4/Loader.zip');
 assert.equal(result.update.manifestUrl,'https://example.org/releases/loader/latest/OpenACAILoader.manifest.json');
 l.artifacts[0].signatureStatus='unsigned-preview';
 l.artifacts[0].signingEvidence=null;
 l.artifacts[0].unsignedReason='Pending signature check';
 assert.equal((await loaderManifest(root,l,'https://example.org')).package.downloadUrl,result.package.downloadUrl);
 source.files.pop();
 await writeFile(file,JSON.stringify(source));
 await assert.rejects(loaderManifest(root,l,'https://example.org'),/SDK or client companion absent/);
});

test('Loader ZIP member bytes match the reviewed file manifest', async t => {
 const python=process.env.PYTHON || (process.platform==='win32'?'python':'python3');
 if(spawnSync(python,['--version']).status!==0) return t.skip('Python 3 unavailable');
 const root=await mkdtemp(join(tmpdir(),'modstoke-zip-test-'));
 t.after(()=>rm(root,{recursive:true,force:true}));
 const sdk='OpenACAI/Runtime/OpenACAI.Endnight.Loader.Core.dll';
 const client='BepInEx/plugins/FixtureClient.dll';
 const archive=join(root,'Loader.zip');
 const manifest=join(root,'manifest.json');
 const inventory=join(root,'inventory.json');
 const files=[{path:sdk,size:4,sha256:hash('core')},{path:client,size:6,sha256:hash('client')}];
 await writeFile(manifest,JSON.stringify({files}));
 const reviewed={schema:1,releaseId:'loader-fixture',reviewedUtc:'2026-10-15T00:00:00Z',files:files.map(file=>({path:file.path,provenance:'publisher',license:'GPL-3.0-or-later',sourceRef:'fixture-only',redistributionApproved:true}))};
 await writeFile(inventory,JSON.stringify(reviewed));
 const makeZip=`import zipfile,sys\nwith zipfile.ZipFile(sys.argv[1],'w') as z:\n z.writestr(sys.argv[2],b'core')\n z.writestr(sys.argv[3],b'client')`;
 assert.equal(spawnSync(python,['-c',makeZip,archive,sdk,client]).status,0);
 const script=fileURLToPath(new URL('../scripts/verify-loader-zip.py',import.meta.url));
 const args=[script,archive,manifest,inventory,sdk,client,'loader-fixture'];
 assert.equal(spawnSync(python,args,{encoding:'utf8'}).status,0);
 reviewed.files[1].redistributionApproved=false;
 await writeFile(inventory,JSON.stringify(reviewed));
 assert.match(spawnSync(python,args,{encoding:'utf8'}).stderr,/Redistribution has not been approved/);
 reviewed.files[1].redistributionApproved=true;
 await writeFile(inventory,JSON.stringify(reviewed));
 files[1].sha256=hash('tampered');
 await writeFile(manifest,JSON.stringify({files}));
 const failed=spawnSync(python,args,{encoding:'utf8'});
 assert.notEqual(failed.status,0);
 assert.match(failed.stderr,/SHA256 mismatch/);
 files[1].sha256=hash('client');
 const game='GameAssembly.dll';
 files.push({path:game,size:4,sha256:hash('game')});
 reviewed.files.push({path:game,provenance:'publisher',license:'GPL-3.0-or-later',sourceRef:'fixture-only',redistributionApproved:true});
 await writeFile(manifest,JSON.stringify({files}));
 await writeFile(inventory,JSON.stringify(reviewed));
 const makeUnsafeZip=`import zipfile,sys\nwith zipfile.ZipFile(sys.argv[1],'w') as z:\n z.writestr(sys.argv[2],b'core')\n z.writestr(sys.argv[3],b'client')\n z.writestr('GameAssembly.dll',b'game')`;
 assert.equal(spawnSync(python,['-c',makeUnsafeZip,archive,sdk,client]).status,0);
 assert.match(spawnSync(python,args,{encoding:'utf8'}).stderr,/Proprietary game file path/);
});
