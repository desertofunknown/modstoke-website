import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { readPublicFile } from '../scripts/safe-files.mjs';
test('public file reads reject traversal',async()=>{
 const base=await mkdtemp(join(tmpdir(),'modstoke-safe-read-'));
 const root=join(base,'public');await mkdir(root);await writeFile(join(root,'index.html'),'public');await writeFile(join(base,'private.txt'),'private');
 assert.equal((await readPublicFile(root,'index.html')).body.toString(),'public');
 await assert.rejects(readPublicFile(root,'../private.txt'),/Outside/);
});

test('public file reads reject file and directory symlinks when available',async t=>{
 const base=await mkdtemp(join(tmpdir(),'modstoke-safe-read-'));
 const root=join(base,'public');await mkdir(root);await writeFile(join(root,'index.html'),'public');await writeFile(join(base,'private.txt'),'private');
 try {
  await symlink(join(base,'private.txt'),join(root,'leak.txt'));
  await symlink(base,join(root,'linked-dir'));
 } catch(error) {
  if(error.code==='EPERM' && process.platform==='win32') {t.skip('Windows symlink privilege is unavailable');return;}
  throw error;
 }
 await assert.rejects(readPublicFile(root,'leak.txt'),/Symlinks/);
 await assert.rejects(readPublicFile(root,'linked-dir/private.txt'),/Symlinks/);
});
