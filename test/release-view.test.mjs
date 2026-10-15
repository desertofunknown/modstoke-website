import test from 'node:test';
import assert from 'node:assert/strict';
import { renderReleasePage } from '../src/release-view.mjs';

test('unselected release index keeps the original unavailable page', () => {
 assert.equal(renderReleasePage({latest:{manager:null,loader:null},releases:[]},'Sons of the Forest'),null);
});

test('selected Manager has a versioned download and does not promise complete guided setup', () => {
 const record={releaseId:'manager-test',product:'manager',version:'1.2.3',channel:'preview',publishedUtc:'2026-10-15T00:00:00Z',sourceCommit:'a'.repeat(40),notesPath:'/releases/#manager-test',defaultLoaderReleaseId:null,artifacts:[{sitePath:'/downloads/manager/1.2.3/Manager.exe',fileName:'Manager.exe',size:10,sha256:'b'.repeat(64)}]};
 const html=renderReleasePage({latest:{manager:'manager-test',loader:null},releases:[record]},'Sons of the Forest');
 assert.match(html,/href="\/downloads\/manager\/1\.2\.3\/Manager\.exe"/);
 assert.match(html,/complete Loader, SDK and client bundle is not yet published/);
 assert.match(html,/id="manager-test"/);
 assert.match(html,/PREVIEW/);
});

test('selected release anchors are unique and evidence is explicit',()=>{
 const record={releaseId:'manager-fixture',product:'manager',version:'1.2.3',channel:'preview',publishedUtc:'2026-10-15T00:00:00Z',sourceCommit:'a'.repeat(40),notesPath:'/releases/#manager-fixture',defaultLoaderReleaseId:null,validation:{build:'passed',game:'not-applicable'},artifacts:[{sitePath:'/downloads/manager/1.2.3/Manager.exe',fileName:'Manager.exe',size:10,sha256:'b'.repeat(64),signatureStatus:'verified',signingEvidence:{publisher:'Fixture <Publisher>'}}]};
 const index={latest:{manager:record.releaseId,loader:null},releases:[record]};
 let html=renderReleasePage(index,'Sons of the Forest');
 const ids=[...html.matchAll(/ id="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(ids.length,new Set(ids).size);
 assert.equal(ids.filter(id=>id===record.releaseId).length,1);
 assert.match(html,/Signature review recorded for Fixture &lt;Publisher&gt;/);
 assert.match(html,/Build: passed \| Installation: not recorded/);assert.match(html,/Game launch: not applicable/);
 assert.match(html,/does not authenticate an update manifest/);
 assert.match(html,/No release notes have been supplied/);
 record.changelog='Fix <script>fake</script> & installation reporting.';
 html=renderReleasePage(index,'Sons of the Forest');
 assert.match(html,/Fix &lt;script&gt;fake&lt;\/script&gt; &amp; installation reporting/);
 assert.doesNotMatch(html,/<script>|No release notes have been supplied/);
});

test('unsigned Loader preview discloses pending checks and unknown game compatibility before download', () => {
 const record={
  releaseId:'loader-preview',product:'loader',version:'0.5.0-preview',channel:'preview',
  publishedUtc:'2026-10-15T00:00:00Z',sourceCommit:'a'.repeat(40),notesPath:'/releases/#loader-preview',
  compatibility:{gameId:'sons-of-the-forest',testedGameBuilds:[],minManagerVersion:'0.2.0'},
  bundled:{sdk:{assemblyPath:'BepInEx/core/OpenACAI.SDK.dll',sourceCommit:'b'.repeat(40)},client:{pluginId:'test.client',version:'0.1.0',installPath:'BepInEx/plugins/TestClient.dll',sourceCommit:'c'.repeat(40)}},
  validation:{cleanSource:'passed',licenses:'passed',build:'passed',install:'passed',game:'pending',multiplayer:'pending',hostedFetch:'passed'},
  artifacts:[{kind:'game-root-bundle',sitePath:'/downloads/loader/0.5.0-preview/Loader.zip',fileName:'Loader.zip',size:10,sha256:'d'.repeat(64),signatureStatus:'unsigned-preview',signingEvidence:null,unsignedReason:'Test publisher <unverified> & no signature'}]
 };
 const html=renderReleasePage({latest:{manager:null,loader:record.releaseId},releases:[record]},'Sons of the Forest');
 assert.match(html,/<h1>Downloads, including preview builds\.<\/h1>/);
 assert.doesNotMatch(html,/<h1>Verified downloads\.<\/h1>|earlier verified record|Tested Sons of the Forest builds: \./);
 assert.equal([...html.matchAll(/Preview test build\./g)].length,2);
 assert.match(html,/This package is unsigned: Test publisher &lt;unverified&gt; &amp; no signature/);
 assert.doesNotMatch(html,/<unverified>/);
 assert.match(html,/Game launch: pending/);
 assert.match(html,/Multiplayer: pending/);
 assert.match(html,/No game builds have been tested yet\. Game compatibility is unknown/);
 assert.ok(html.indexOf('Preview test build.') < html.indexOf('Download Loader.zip'));
});

test('retained preview stays labeled when the current download is verified', () => {
 const stable={releaseId:'manager-stable',product:'manager',version:'1.2.3',channel:'stable',publishedUtc:'2026-10-15T00:00:00Z',sourceCommit:'a'.repeat(40),notesPath:'/releases/#manager-stable',defaultLoaderReleaseId:null,validation:{cleanSource:'passed',licenses:'passed',build:'passed',install:'passed',game:'not-applicable',multiplayer:'not-applicable',hostedFetch:'passed'},artifacts:[{sitePath:'/downloads/manager/1.2.3/Manager.exe',fileName:'Manager.exe',size:10,sha256:'b'.repeat(64),signatureStatus:'verified',signingEvidence:{publisher:'Modstoke'}}]};
 const preview={...stable,releaseId:'manager-preview',version:'1.2.4-preview',channel:'preview',notesPath:'/releases/#manager-preview',artifacts:[{...stable.artifacts[0],sitePath:'/downloads/manager/1.2.4-preview/Manager.exe',signatureStatus:'unsigned-preview',signingEvidence:null,unsignedReason:'Test build only'}]};
 const stableOnly=renderReleasePage({latest:{manager:stable.releaseId,loader:null},releases:[stable]},'Sons of the Forest');
 assert.match(stableOnly,/<h1>Verified downloads\.<\/h1>/);
 const html=renderReleasePage({latest:{manager:stable.releaseId,loader:null},releases:[stable,preview]},'Sons of the Forest');
 assert.match(html,/<h1>Downloads, including preview builds\.<\/h1>/);
 assert.match(html,/id="manager-preview"[\s\S]*?Preview test build\.[\s\S]*?Test build only/);
 assert.equal([...html.matchAll(/Preview test build\./g)].length,1);
});
