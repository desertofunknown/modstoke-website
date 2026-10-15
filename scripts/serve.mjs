import { createServer } from 'node:http';
import { readPublicFile } from './safe-files.mjs';
import { resolve, dirname, basename, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import './build.mjs';
import { emptyCatalog } from './catalog.mjs';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '../dist');
const port = Number(process.env.PORT || 4173);
const mime = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.json':'application/json; charset=utf-8'};
createServer(async (req,res)=>{
  res.setHeader('X-Content-Type-Options','nosniff');
  res.setHeader('Referrer-Policy','no-referrer');
  res.setHeader('Content-Security-Policy',"default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'");
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
    const fingerprinted = dirname(file)===root && /^(?:style|app)\.[a-f0-9]{16}\.(?:css|js)$/.test(basename(file));
    res.setHeader('Cache-Control',res.statusCode!==200?'no-store':fingerprinted?'public, max-age=31536000, immutable':'no-cache');
    res.end(req.method==='HEAD'?undefined:body);
  } catch {res.writeHead(400);res.end('Bad request');}
}).listen(port,'127.0.0.1',()=>console.log(`Modstoke preview: http://127.0.0.1:${port} (loopback only)`));
