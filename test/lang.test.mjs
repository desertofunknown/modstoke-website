import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { languageScript } from '../src/layout.mjs';

// Runs lang.js on a page and returns where it sent the visitor, if anywhere.
async function visit(pathname, { lang = 'en', saved = null, languages = ['en-US'], agent = 'Mozilla/5.0 (Windows NT 10.0) Firefox/140.0', trace = 'loc=US\n' } = {}) {
  let went = null;
  let asked = false;
  const store = new Map(saved ? [['modstoke-lang', saved]] : []);
  vm.runInNewContext(languageScript(), {
    document: { documentElement: { lang }, addEventListener() {} },
    location: { pathname, search: '?a=1', hash: '#top', replace: url => { went = url; } },
    localStorage: { getItem: key => store.get(key) ?? null, setItem: (key, value) => store.set(key, value) },
    navigator: { languages, language: languages[0], userAgent: agent },
    fetch: () => { asked = true; return Promise.resolve({ text: () => Promise.resolve(trace) }); },
  });
  await new Promise(done => setImmediate(done));
  return { went, asked };
}

test('a first visit gets the browser language', async () => {
  assert.equal((await visit('/hosting/', { languages: ['fr-FR', 'en'] })).went, '/fr/hosting/?a=1#top');
  assert.equal((await visit('/', { languages: ['zh-TW'] })).went, '/zh-hant/?a=1#top');
  assert.equal((await visit('/', { languages: ['zh-CN'] })).went, '/zh-hans/?a=1#top');
  assert.equal((await visit('/mods/', { languages: ['en-GB', 'de'] })).went, null);
});

test('a link into another language is followed as given', async () => {
  assert.deepEqual(await visit('/fr/hosting/', { lang: 'fr', languages: ['de-DE'], trace: 'loc=DE\n' }), { went: null, asked: false });
});

test('a browser language we lack falls back to the country, then stays put', async () => {
  assert.deepEqual(await visit('/guides/', { languages: ['nl-NL'], trace: 'ip=x\nloc=BR\n' }), { went: '/pt/guides/?a=1#top', asked: true });
  assert.equal((await visit('/guides/', { languages: ['nl-NL'], trace: 'loc=NL\n' })).went, null);
});

test('a language picked in the menu wins on every page', async () => {
  assert.equal((await visit('/fr/hosting/', { lang: 'fr', saved: 'de', languages: ['fr'] })).went, '/de/hosting/?a=1#top');
  assert.equal((await visit('/zh-hans/mods/client/', { lang: 'zh-Hans', saved: 'en' })).went, '/mods/client/?a=1#top');
  assert.equal((await visit('/ru/', { lang: 'ru', saved: 'ru', languages: ['en'] })).went, null);
});

test('crawlers stay on the page they asked for', async () => {
  assert.deepEqual(await visit('/', { languages: ['fr'], agent: 'Mozilla/5.0 (compatible; Googlebot/2.1)' }), { went: null, asked: false });
});
