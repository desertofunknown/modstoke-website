import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';
const server=spawn(process.execPath,['scripts/serve.mjs'],{env:{...process.env,PORT:'4175'},stdio:['ignore','pipe','pipe']});
let error='';server.stderr.on('data',d=>error+=d);
try {
 await new Promise((yes,no)=>{const timer=setTimeout(()=>no(Error('Server startup timeout '+error)),5000);server.on('exit',code=>{clearTimeout(timer);no(Error('Server exited '+code+' '+error));});server.stdout.on('data',data=>{if(String(data).includes('loopback only')){clearTimeout(timer);yes();}});});
 const html=await (await fetch('http://127.0.0.1:4175/')).text();
 const css=html.match(/href="(\/style\.[a-f0-9]{16}\.css)"/)[1];
 const js=html.match(/src="(\/app\.[a-f0-9]{16}\.js)"/)[1];
 for(const route of ['/','/mods/','/tools/','/docs/','/releases/',css,js,'/asset-manifest.json','/release-index.json','/favicon.svg']){
  const res=await fetch('http://127.0.0.1:4175'+route);assert.equal(res.status,200,route);
  assert.equal(res.headers.get('x-content-type-options'),'nosniff');
  assert.ok(res.headers.get('content-security-policy'));
 }
 for(const route of [css,js]) {const res=await fetch('http://127.0.0.1:4175'+route);assert.equal(res.headers.get('cache-control'),'public, max-age=31536000, immutable');}
 assert.equal((await fetch('http://127.0.0.1:4175/')).headers.get('cache-control'),'no-cache');
 const releases=await (await fetch('http://127.0.0.1:4175/release-index.json')).json();
 assert.equal(releases.schema,1);
 assert.ok(Array.isArray(releases.releases));
 assert.ok(Object.hasOwn(releases.latest,'manager') && Object.hasOwn(releases.latest,'loader'));
 assert.equal((await fetch('http://127.0.0.1:4175/release-index.json')).headers.get('cache-control'),'no-cache');
 assert.equal((await fetch('http://127.0.0.1:4175/releases/loader/latest/OpenACAILoader.manifest.json')).status,releases.latest.loader?200:404);
 assert.equal((await fetch('http://127.0.0.1:4175/style.css')).status,404);
 assert.equal((await fetch('http://127.0.0.1:4175/app.js')).status,404);
 for(const asset of [...html.matchAll(/<img[^>]+src="([^"]+)"/g)].map(match=>match[1]))assert.equal((await fetch('http://127.0.0.1:4175'+asset)).status,200);
 const catalog=await (await fetch('http://127.0.0.1:4175/api/mods?approved=true&page=1')).json();assert.deepEqual(catalog.data,[]);assert.equal(catalog.meta.total,0);
 assert.deepEqual(await (await fetch('http://127.0.0.1:4175/api/categories')).json(),{data:[]});
 assert.equal((await fetch('http://127.0.0.1:4175/api/mods?page=-1')).status,400);
 assert.equal((await fetch('http://127.0.0.1:4175/missing')).status,404);
 assert.equal((await fetch('http://127.0.0.1:4175/',{method:'POST'})).status,405);
 assert.equal((await fetch('http://127.0.0.1:4175/%00')).status,400);
 const head=await fetch('http://127.0.0.1:4175/',{method:'HEAD'});assert.equal(head.status,200);assert.equal(await head.text(),'');
 console.log('HTTP QA passed: all routes/assets, headers, 404, rejected POST, malformed URL, HEAD.');
}finally{server.kill();}
