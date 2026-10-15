"""Create review bundles from an explicit allowlist, excluding backups and unknown files."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
from hashlib import sha256
import json
root = Path(__file__).resolve().parent.parent
source = ['.gitignore','.nvmrc','README.md','package.json','data/site.json',
'docs/architecture.md','docs/cache-and-deployment.md',
'scripts/build.mjs','scripts/assets.mjs','scripts/model.mjs','scripts/serve.mjs','scripts/safe-files.mjs','scripts/catalog.mjs','scripts/http-qa.mjs','scripts/browser-qa.cjs','scripts/package.py',
'src/app.js','src/catalog-view.mjs','src/templates.mjs','src/style.css','src/favicon.svg',
 'test/catalog-view.test.mjs','test/assets.test.mjs','test/model.test.mjs','test/site.test.mjs','test/safe-files.test.mjs','test/catalog.test.mjs']
static = ['index.html','mods/index.html','tools/index.html','docs/index.html','releases/index.html','404/index.html','asset-manifest.json','favicon.svg']
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
out = root / 'artifacts'
out.mkdir(exist_ok=True)
def checked(path):
    if any(p.is_symlink() for p in [path,*path.parents]):
        raise ValueError(f'Symlink not allowed in package: {path}')
    if not path.is_file(): raise ValueError(f'Not a regular file: {path}')
    return path.read_bytes()
def archive(name, base, files, prefix, extra=None):
    path = out / name
    with ZipFile(path,'w',ZIP_DEFLATED) as z:
        for f in files: z.writestr(prefix+f, checked(base/f))
        if extra: z.writestr('PREVIEW-README.txt',extra)
    with ZipFile(path) as z:
        assert z.testzip() is None
        assert len(z.namelist()) == len(files)+(1 if extra else 0)
    return {'filename':name,'path':str(path),'size_bytes':path.stat().st_size,'sha256':sha256(path.read_bytes()).hexdigest()}
results=[archive('modstoke-website-source.zip',root,source,'modstoke-website/'),archive('modstoke-static-preview.zip',root/'dist',static,'','''Modstoke visual preview
Extract this archive, then serve this folder locally. Example with Python 3:
python3 -m http.server 4173 --bind 127.0.0.1
Open http://127.0.0.1:4173/ on the same computer.
Do not open HTML directly with file://: routes and asset URLs assume a web server.
This ZIP contains static pages and optional reviewed product captures.
The public source ZIP deliberately omits screenshot binaries.
No live API, updater or product downloads are included.
This community-layout checkpoint still needs actual desktop/mobile visual review.
Do not deploy it without approval.
''')]
(out/'package-manifest.json').write_text(json.dumps(results,indent=2)+'\n')
print(json.dumps(results,indent=2))
