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
