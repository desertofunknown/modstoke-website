import { createHash } from 'node:crypto';
export function assetName(name, bytes) {
 const match=/^(style)\.(css)$|^(app)\.(js)$/.exec(name);
 if(!match) throw new Error('Only stylesheet and application script can be fingerprinted');
 const [stem,extension]=name.split('.');
 return `${stem}.${createHash('sha256').update(bytes).digest('hex').slice(0,16)}.${extension}`;
}
