"""Create review bundles from an explicit allowlist, excluding backups and unknown files."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
from hashlib import sha256
import json
root = Path(__file__).resolve().parent.parent
def hash_file(path):
    digest=sha256()
    with path.open('rb') as source_file:
        for chunk in iter(lambda: source_file.read(1024*1024), b''): digest.update(chunk)
    return digest.hexdigest()
source = ['.gitignore','.nvmrc','README.md','package.json','data/site.json','data/releases.json',
'docs/architecture.md','docs/cache-and-deployment.md',
'docs/release-publication.md',
'scripts/build.mjs','scripts/assets.mjs','scripts/model.mjs','scripts/releases.mjs','scripts/verify-loader-zip.py','scripts/serve.mjs','scripts/safe-files.mjs','scripts/catalog.mjs','scripts/http-qa.mjs','scripts/browser-qa.cjs','scripts/package.py',
'src/app.js','src/catalog-view.mjs','src/release-view.mjs','src/templates.mjs','src/style.css','src/favicon.svg',
'test/catalog-view.test.mjs','test/assets.test.mjs','test/model.test.mjs','test/site.test.mjs','test/safe-files.test.mjs','test/catalog.test.mjs','test/releases.test.mjs','test/release-view.test.mjs']
static = ['index.html','mods/index.html','tools/index.html','docs/index.html','releases/index.html','404/index.html','asset-manifest.json','release-index.json','favicon.svg']
for image in ['assets/manager-catalog.png','assets/admin-world-preview.png']:
    if (root/'dist'/image).is_file(): static.append(image)
# Derive the only permitted generated asset names from source bytes; never
# trust arbitrary paths in the output manifest.
manifest=json.loads((root/'dist/asset-manifest.json').read_text())
for name in ['style.css','app.js']:
    stem,extension=name.split('.')
    digest=sha256((root/'src'/name).read_bytes()).hexdigest()[:16]
    filename=f'{stem}.{digest}.{extension}'
    if manifest.get(name)!=filename: raise ValueError('Asset manifest differs from source hash')
    if (root/'dist'/filename).read_bytes()!=(root/'src'/name).read_bytes(): raise ValueError('Asset bytes differ from source')
    static.append(filename)
release_index=json.loads((root/'dist/release-index.json').read_text(encoding='utf-8'))
if release_index!=json.loads((root/'data/releases.json').read_text(encoding='utf-8')):
    raise ValueError('Built release index differs from source')
for record in release_index['releases']:
    for artifact in record['artifacts']:
        local=artifact['sitePath'].lstrip('/')
        output=root/'dist'/local
        if output.stat().st_size!=artifact['size'] or hash_file(output).lower()!=artifact['sha256'].lower():
            raise ValueError(f'Built release artifact mismatch: {local}')
        static.append(local)
    if record['product']=='loader':
        source.append(f"data/loader-manifests/{record['releaseId']}.json")
        source.append(f"data/package-inventories/{record['releaseId']}.json")
        static.append(f"releases/loader/{record['version']}/OpenACAILoader.manifest.json")
if release_index['latest']['loader']:
    static.append('releases/loader/latest/OpenACAILoader.manifest.json')
out = root / 'artifacts'
out.mkdir(exist_ok=True)
def checked(path):
    if any(p.is_symlink() for p in [path,*path.parents]):
        raise ValueError(f'Symlink not allowed in package: {path}')
    if not path.is_file(): raise ValueError(f'Not a regular file: {path}')
    return path
def archive(name, base, files, prefix, extra=None):
    path = out / name
    with ZipFile(path,'w',ZIP_DEFLATED) as z:
        for f in files: z.write(checked(base/f), prefix+f)
        if extra: z.writestr('PREVIEW-README.txt',extra)
    with ZipFile(path) as z:
        assert z.testzip() is None
        assert len(z.namelist()) == len(files)+(1 if extra else 0)
    return {'filename':name,'path':str(path),'size_bytes':path.stat().st_size,'sha256':hash_file(path)}
results=[archive('modstoke-website-source.zip',root,source,'modstoke-website/'),archive('modstoke-static-preview.zip',root/'dist',static,'','''Modstoke visual preview
Extract this archive, then serve this folder locally. Example with Python 3:
python3 -m http.server 4173 --bind 127.0.0.1
Open http://127.0.0.1:4173/ on the same computer.
Do not open HTML directly with file://: routes and asset URLs assume a web server.
This ZIP contains static pages and optional reviewed product captures.
The public source ZIP deliberately omits screenshot binaries.
The release index is included. Product downloads appear only when reviewed artifacts have passed the build gate.
This community-layout checkpoint still needs actual desktop/mobile visual review.
Do not deploy it without approval.
''')]
(out/'package-manifest.json').write_text(json.dumps(results,indent=2)+'\n')
print(json.dumps(results,indent=2))
