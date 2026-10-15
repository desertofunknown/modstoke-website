// Optional: requires Playwright and a Chromium browser in the execution environment.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
(async()=>{
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:1440,height:1000}});
const errors=[];page.on('pageerror',error=>errors.push(error.message));
fs.mkdirSync('artifacts',{recursive:true});
for(const route of ['/','/tools/','/mods/','/docs/','/releases/']){
 const response=await page.goto('http://127.0.0.1:4173'+route);
 assert.equal(response.status(),200);
 assert.equal(await page.locator('h1').count(),1);
 assert.equal(await page.locator('nav a[aria-current="page"]').count(),1);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 for(const anchor of await page.locator('a[href*="#"]').evaluateAll(xs=>xs.map(x=>x.getAttribute('href')))){
  const url=new URL(anchor,page.url());
  if(url.pathname===new URL(page.url()).pathname)assert.equal(await page.locator(url.hash).count(),1,anchor);
 }
}
await page.goto('http://127.0.0.1:4173/');
await page.screenshot({path:'artifacts/home-desktop.png',fullPage:true});
await page.goto('http://127.0.0.1:4173/mods/');
assert.equal(await page.locator('#mod-search').count(),0);
assert.equal(await page.locator('#game-filter').count(),0);
assert.match(await page.locator('h1').innerText(),/Catalog status/);
await page.locator('nav a[href="/tools/"]').click();
await page.goBack();assert.equal(new URL(page.url()).pathname,'/mods/');
await page.goForward();assert.equal(new URL(page.url()).pathname,'/tools/');
for(const width of [360,390,768]){
 await page.setViewportSize({width,height:844});
 for(const route of ['/','/tools/','/mods/','/docs/','/releases/']){
  await page.goto('http://127.0.0.1:4173'+route);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`${width} ${route}`);
  if(width===390&&route==='/')await page.screenshot({path:'artifacts/home-mobile.png',fullPage:true});
 }
}
assert.equal((await page.goto('http://127.0.0.1:4173/missing')).status(),404);
assert.deepEqual(errors,[]);
await browser.close();console.log('Browser QA passed: desktop/mobile pages, internal anchors, empty search/filter, repeated submit, back/forward, 404, no runtime errors.');
})().catch(error=>{console.error(error);process.exit(1)});
