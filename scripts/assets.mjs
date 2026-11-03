import { createHash } from 'node:crypto';
export function assetName(name, bytes) {
 const match=/^(?:style|servers|guides)\.css$|^(?:app|servers)\.js$/.exec(name);
 if(!match) throw new Error('Only allowlisted stylesheets and application scripts can be fingerprinted');
 const [stem,extension]=name.split('.');
 return `${stem}.${createHash('sha256').update(bytes).digest('hex').slice(0,16)}.${extension}`;
}
