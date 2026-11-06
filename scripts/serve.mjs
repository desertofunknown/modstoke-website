import { createServer } from 'node:http';
import { readPublicFile } from './safe-files.mjs';
import { resolve, dirname, basename, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import './build.mjs';
import { emptyCatalog } from './catalog.mjs';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '../dist');
const port = Number(process.env.PORT || 4173);
const mime = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.txt':'text/plain; charset=utf-8','.xml':'application/xml; charset=utf-8','.webp':'image/webp','.jpg':'image/jpeg','.woff2':'font/woff2','.svg':'image/svg+xml','.png':'image/png','.json':'application/json; charset=utf-8','.zip':'application/zip','.exe':'application/octet-stream','.msi':'application/octet-stream'};
// Matches deploy/caddy/modstoke.caddy. PayPal's buttons need its scripts, frames and inline styles,
// so only /support/ relaxes the policy.
const csp = "default-src 'self'; connect-src 'self' https://modstoke.com; img-src 'self' data:; style-src 'self'; script-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'";
const paypalCsp = "default-src 'self'; connect-src 'self' https://*.paypal.com; img-src 'self' data: https://*.paypal.com https://*.paypalobjects.com; style-src 'self' 'unsafe-inline'; script-src 'self' 'sha256-xiaD0XEAtT7Da8WrcQjkQbhOx0ZR6pjMSRZNsqZuFdA=' https://*.paypal.com https://*.paypalobjects.com; frame-src https://*.paypal.com; object-src 'none'; base-uri 'none'; frame-ancestors 'none'";
// SUPPORT_API=http://127.0.0.1:12436 forwards /api/support/v1/ to a locally running support.py.
const supportApi = process.env.SUPPORT_API;
createServer(async (req,res)=>{
  res.setHeader('X-Content-Type-Options','nosniff');
  res.setHeader('Referrer-Policy','no-referrer');
  res.setHeader('Content-Security-Policy',req.url.startsWith('/support/')?paypalCsp:csp);
  if (supportApi && req.url.startsWith('/api/support/v1/')) {
    const chunks=[]; for await (const chunk of req) chunks.push(chunk);
    const upstream=await fetch(supportApi+req.url,{method:req.method,headers:{'Content-Type':'application/json'},body:['GET','HEAD'].includes(req.method)?undefined:Buffer.concat(chunks)}).catch(()=>null);
    if(!upstream) {res.writeHead(502);res.end();return;}
    res.writeHead(upstream.status,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(Buffer.from(await upstream.arrayBuffer()));return;
  }
  if (!['GET','HEAD'].includes(req.method)) {res.writeHead(405, {'Allow':'GET, HEAD'}); res.end(); return;}
  try {
    const url = new URL(req.url,'http://localhost');
    const path = decodeURIComponent(url.pathname);
    const catalog = emptyCatalog(path,url.searchParams);
    if(catalog) {res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','no-store');res.end(req.method==='HEAD'?undefined:JSON.stringify(catalog));return;}
    if(path.includes('\0') || path.includes('\\')) throw new Error('Invalid path');
    let file = resolve(root,'.'+path);
    if(!file.startsWith(root+sep) && file!==root) throw new Error('Invalid path');
    let body;
    try { ({body,file}=await readPublicFile(root,'.'+path));res.statusCode=200; }
    catch { ({body,file}=await readPublicFile(root,'404/index.html'));res.statusCode=404; }
    res.setHeader('Content-Type',mime[extname(file)]||'application/octet-stream');
    const fingerprinted = dirname(file)===root && /^(?:style|app|servers|guides|support)\.[a-f0-9]{16}\.(?:css|js)$/.test(basename(file));
    // Font files are renamed rather than replaced, so they can be cached like fingerprinted assets.
    const font = path.startsWith('/fonts/') && extname(file)==='.woff2';
    const download=path.startsWith('/downloads/') && res.statusCode===200;
    if(download) res.setHeader('Content-Disposition',`attachment; filename="${basename(file)}"`);
    res.setHeader('Cache-Control',res.statusCode!==200?'no-store':fingerprinted||font||download?'public, max-age=31536000, immutable':'no-cache');
    res.end(req.method==='HEAD'?undefined:body);
  } catch {res.writeHead(400);res.end('Bad request');}
}).listen(port,'127.0.0.1',()=>console.log(`Modstoke preview: http://127.0.0.1:${port} (loopback only)`));
