import test from 'node:test';
import assert from 'node:assert/strict';
import { emptyCatalog } from '../scripts/catalog.mjs';
test('local catalog returns reviewed empty envelopes without invented mods',()=>{
 const result=emptyCatalog('/api/mods',new URLSearchParams('approved=true&page=1&search=test'));
 assert.deepEqual(result,{meta:{limit:20,next_page:null,page:1,pages:0,prev_page:null,total:0},data:[]});
 assert.deepEqual(emptyCatalog('/api/categories',new URLSearchParams()),{data:[]});
 assert.equal(emptyCatalog('/api/mods/fictional',new URLSearchParams()),null);
});
test('local catalog rejects malformed pagination',()=>{for(const page of ['0','-1','abc','9007199254740992'])assert.throws(()=>emptyCatalog('/api/mods',new URLSearchParams({page})));});
