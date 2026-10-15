import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { assetName } from '../scripts/assets.mjs';
test('asset names derive deterministically from the exact content bytes',()=>{
 const bytes=Buffer.from('body { color: white; }\n');
 const hash=createHash('sha256').update(bytes).digest('hex').slice(0,16);
 assert.equal(assetName('style.css',bytes),`style.${hash}.css`);
 assert.equal(assetName('app.js',bytes),`app.${hash}.js`);
 assert.equal(assetName('style.css',Buffer.from(bytes)),assetName('style.css',bytes));
 assert.notEqual(assetName('style.css',Buffer.concat([bytes,Buffer.from(' ')])),assetName('style.css',bytes));
 assert.throws(()=>assetName('../style.css',bytes));
});
