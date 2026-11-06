import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { renderDescription, renderModList } from '../src/mods-view.mjs';
import { renderPages } from '../src/templates.mjs';
import { validateStoreCatalog } from '../scripts/store.mjs';
import { validateReleaseIndex } from '../scripts/releases.mjs';

const json = async path => JSON.parse(await readFile(new URL(path, import.meta.url), 'utf8'));
const site = await json('../data/site.json');
const catalog = validateStoreCatalog(await json('../data/store/catalog.json'));
const releaseIndex = validateReleaseIndex(await json('../data/releases.json'));
const assets = { 'style.css': 'style.test.css', 'app.js': 'app.test.js', 'servers.css': 's.css', 'servers.js': 's.js', 'guides.css': 'g.css' };
const allMedia = new Set(catalog.mods.flatMap(mod => mod.media.map(item => item.path)));
const render = (options = {}) => Object.fromEntries(renderPages(site, assets, { releaseIndex, catalog, media: allMedia, screenshots: [], ...options }));

test('descriptions are escaped plain text with paragraphs and dash lists only', () => {
  const html = renderDescription('First <b>line</b>\nsecond line\n\n- one & two\n- three\n\n- mixed\nnot a list');
  assert.match(html, /<p>First &lt;b&gt;line&lt;\/b&gt;<br>second line<\/p>/);
  assert.match(html, /<ul><li>one &amp; two<\/li><li>three<\/li><\/ul>/);
  assert.match(html, /<p>- mixed<br>not a list<\/p>/);
});

test('the catalog validator accepts the data file and rejects broken records', () => {
  const broken = edit => { const copy = structuredClone(catalog); edit(copy.mods[0]); return () => validateStoreCatalog(copy); };
  assert.throws(broken(mod => { mod.slug = 'Other'; }), /slug/);
  assert.throws(broken(mod => { mod.releases[0].package = { fileName: 'x.zip' }; }), /signed store pipeline/);
  assert.throws(broken(mod => { mod.media[0].kind = 'video'; }), /cover/);
  assert.throws(broken(mod => { mod.releases[0].multiplayer.role = 'everyone'; }), /multiplayer/);
  assert.throws(broken(mod => { mod.releases[0].version = '1.0'; }), /version/);
});

test('the mod list works without scripts and escapes its data', () => {
  const fixture = structuredClone(catalog);
  fixture.mods[0].name = 'Client <test>';
  const html = renderModList(fixture, new Set());
  assert.match(html, /<form class="list-tools" role="search" hidden>/);
  assert.equal((html.match(/class="mod-row"/g) || []).length, catalog.mods.length);
  assert.match(html, /Client &lt;test&gt;/);
  assert.doesNotMatch(html, /<img\b/);
});

test('every listed mod gets a page with its version anchor, details and Nexus link', () => {
  const pages = render();
  for (const mod of catalog.mods) {
    const html = pages[`/mods/${mod.slug}/`];
    const version = mod.releases[0].version;
    assert.ok(html, mod.slug);
    assert.equal((html.match(/<h1[ >]/g) || []).length, 1);
    assert.ok(html.includes(`id="v${version}"`), `${mod.slug} anchor`);
    assert.ok(html.includes(`https://www.nexusmods.com/sonsoftheforest/mods/${mod.crossRefs.nexusModId}`));
    assert.match(html, /Dedicated server/);
    if (!mod.license) assert.match(html, /Licence<\/dt><dd>Not stated/);
  }
});

test('pages without media files render no image references', () => {
  const pages = render({ media: new Set() });
  for (const [path, html] of Object.entries(pages)) assert.doesNotMatch(html, /<img\b|srcset="\/assets\//, path);
});

test('the home page lists the mods and the current releases from data', () => {
  const home = render()['/'];
  for (const mod of catalog.mods) assert.ok(home.includes(`href="/mods/${mod.slug}/"`));
  const manager = releaseIndex.releases.find(record => record.releaseId === releaseIndex.latest.manager);
  assert.ok(home.includes(`Download Manager ${manager.version}`));
  assert.match(home, /class="ledger"/);
});

test('the filter combines search and multiplayer role and reports counts', async () => {
  const handlers = {};
  const rows = [{ dataset: { modName: 'Client tablet', role: 'all-players' }, hidden: false }, { dataset: { modName: 'Admin roster', role: 'host' }, hidden: false }];
  const form = { hidden: true, addEventListener: (type, fn) => { handlers.submit = fn; } };
  const search = { value: '', addEventListener: (type, fn) => { handlers.input = fn; } };
  const role = { value: 'all', addEventListener: (type, fn) => { handlers.change = fn; } };
  const status = { textContent: '' };
  const document = { querySelector: selector => ({ '.list-tools': form, '#mod-search': search, '#role-filter': role, '#search-status': status })[selector], querySelectorAll: () => rows };
  vm.runInNewContext(await readFile(new URL('../src/app.js', import.meta.url), 'utf8'), { document });
  assert.equal(form.hidden, false);
  search.value = 'ROSTER'; handlers.input();
  assert.deepEqual(rows.map(row => row.hidden), [true, false]);
  role.value = 'all-players'; handlers.change();
  assert.match(status.textContent, /0 of 2/);
  search.value = ''; role.value = 'all';
  let prevented = false; handlers.submit({ preventDefault() { prevented = true; } });
  assert.equal(prevented, true);
  assert.equal(status.textContent, '2 mods');
});
