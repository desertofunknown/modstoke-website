import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { renderCatalog } from '../src/catalog-view.mjs';
import { renderPages } from '../src/templates.mjs';
const data=JSON.parse(await readFile(new URL('../data/site.json',import.meta.url),'utf8'));
const assets={'style.css':'style.test.css','app.js':'app.test.js'};
test('empty inventory renders honest catalog status without unusable controls',()=>{
 const html=renderCatalog(data);
 assert.match(html,/<h1>Catalog status\.<\/h1>/);
 assert.doesNotMatch(html,/id="mod-search"|id="game-filter"|role="search"/);
 assert.match(html,/No mods published yet/);
 const home=renderPages(data,assets).find(([route])=>route==='/')[1];
 assert.match(home,/href="\/mods\/">Catalog status/);
 assert.doesNotMatch(home,/>Browse mods|>Explore the catalog/);
});
test('nonempty synthetic view model exposes controls, escaped records and browse label',()=>{
 const fixture=structuredClone(data);
 fixture.mods=[{id:'test-fixture',name:'Synthetic <fixture>',shortDescription:'Test & only',gameId:fixture.games[0].id}];
 const html=renderCatalog(fixture);
 assert.match(html,/id="mod-search"/);assert.match(html,/id="game-filter"/);
 assert.match(html,/Synthetic &lt;fixture&gt;/);assert.match(html,/Test &amp; only/);
 assert.doesNotMatch(html,/No mods published yet/);
 assert.match(renderPages(fixture,assets)[0][1],/>Browse mods/);
});
test('catalog heading sequence never skips from h1 to h3',()=>{
 const headings=[...renderCatalog(data).matchAll(/<h([1-6])\b/g)].map(x=>Number(x[1]));
 assert.equal(headings[0],1);
 for(let i=1;i<headings.length;i++)assert.ok(headings[i]<=headings[i-1]+1);
});
test('future nonempty filtering combines game/query and resets without submission navigation',async()=>{
 const handlers={};
 const rows=[{dataset:{modName:'Synthetic Alpha',gameId:'a'},hidden:false},{dataset:{modName:'Synthetic Beta',gameId:'b'},hidden:false}];
 const form={addEventListener:(type,fn)=>handlers.submit=fn};
 const search={value:'',addEventListener:(type,fn)=>handlers.input=fn,closest:()=>form};
 const game={value:'all',addEventListener:(type,fn)=>handlers.change=fn};
 const status={textContent:''};
 const document={querySelector:selector=>({'#mod-search':search,'#game-filter':game,'#search-status':status}[selector]),querySelectorAll:()=>rows};
 vm.runInNewContext(await readFile(new URL('../src/app.js',import.meta.url),'utf8'),{document});
 search.value='ALPHA';handlers.input();assert.equal(rows[0].hidden,false);assert.equal(rows[1].hidden,true);
 game.value='b';handlers.change();assert.equal(rows[0].hidden,true);assert.match(status.textContent,/0 of 2/);
 search.value='';handlers.input();assert.equal(rows[1].hidden,false);
 game.value='all';let prevented=false;handlers.submit({preventDefault(){prevented=true;}});
 assert.equal(prevented,true);assert.deepEqual(rows.map(r=>r.hidden),[false,false]);assert.match(status.textContent,/2 of 2/);
});
test('captions offer visible full-size links and creators/releases give factual guidance',()=>{
 const pages=Object.fromEntries(renderPages(data,assets));
 assert.match(pages['/'],/class="image-full-link"[^>]*>View full-size screenshot/);
 assert.match(pages['/tools/'],/clock-preflight failure/);
 assert.match(pages['/docs/'],/class="creator-checklist"/);assert.match(pages['/docs/'],/public parameterless constructor/);
 assert.match(pages['/releases/'],/datetime="2026-10-14"/);assert.doesNotMatch(pages['/releases/'],/is on its way/);
});
test('caption minimum-size refinement is explicit in desktop and mobile rules',async()=>{
 const css=await readFile(new URL('../src/style.css',import.meta.url),'utf8');
 const final=css;
 assert.match(final,/\.manager-figure figcaption strong,\.manager-figure figcaption span,\.admin-preview figcaption\{font-size:14px/);
 assert.match(final,/@media\(max-width:740px\).*font-size:14px/s);
});
test('public source builds omit unavailable screenshots without broken image references',()=>{
 const pages=renderPages(data,assets,{screenshots:[]});
 for(const [,html] of pages) assert.doesNotMatch(html,/<img\b|href="\/assets\//);
 assert.match(pages[0][1],/Find your starting point/);
 assert.match(pages[0][1],/The toolkit/);
});

test('reviewed screenshot framing qualifies visible catalog actions and keeps links compact',async()=>{
 const pages=Object.fromEntries(renderPages(data,assets));
 for(const route of ['/', '/tools/']) {
  const html=pages[route];
  assert.ok(html.indexOf('class="capture-qualification"')<html.indexOf('class="manager-screen"'));
  assert.match(html,/capture-qualification">Actual development build · Third-party catalog shown/);
 }
 assert.match(pages['/'],/The catalog is still being prepared\./);
 const css=await readFile(new URL('../src/style.css',import.meta.url),'utf8');
 assert.match(css,/community-capture \.manager-screen\{height:clamp\(180px,22vw,270px\);aspect-ratio:auto/);
 assert.match(css,/figcaption>span\{/);
 assert.match(css,/image-full-link>span\{flex:0 0 auto;white-space:nowrap/);
 assert.doesNotMatch(css,/figcaption span\{color:/);
});
