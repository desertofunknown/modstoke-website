import { lstat, readFile } from 'node:fs/promises';
import { resolve, relative, sep } from 'node:path';
export async function readPublicFile(root, requested) {
 const file=resolve(root, requested);
 const local=relative(root,file);
 if(local==='..'||local.startsWith('..'+sep)||local.startsWith(sep)) throw Error('Outside public root');
 let current=root;
 for(const part of ['.',...local.split(sep).filter(Boolean)]){
  current=resolve(current,part);
  const info=await lstat(current);
  if(info.isSymbolicLink()) throw Error('Symlinks are not public files');
 }
 if((await lstat(file)).isDirectory()) return readPublicFile(root,relative(root,resolve(file,'index.html')));
 return {body:await readFile(file),file};
}
