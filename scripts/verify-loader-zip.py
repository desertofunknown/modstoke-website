"""Check every game-root ZIP member against the reviewed schema-1 file list."""
from hashlib import sha256
from pathlib import Path
from zipfile import ZipFile
import json
import stat
import sys

archive_path, manifest_path, sdk_path, client_path = map(Path, sys.argv[1:5])
manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
expected = {item["path"]: item for item in manifest["files"]}
for required in (sdk_path.as_posix(), client_path.as_posix()):
    if required not in expected:
        raise ValueError(f"Required bundle component is missing: {required}")

with ZipFile(archive_path) as archive:
    for item in archive.infolist():
        path = item.filename[:-1] if item.is_dir() else item.filename
        if (path.startswith("/") or "\\" in path or ":" in path or
                any(part in ("", ".", "..") for part in path.split("/"))):
            raise ValueError(f"Unsafe ZIP member path: {item.filename}")
        mode = (item.external_attr >> 16) & 0xFFFF
        if stat.S_ISLNK(mode):
            raise ValueError(f"Symlink in ZIP: {item.filename}")
    files = [item for item in archive.infolist() if not item.is_dir()]
    paths = [item.filename for item in files]
    if len(paths) != len(set(paths)) or set(paths) != set(expected):
        raise ValueError("ZIP file list differs from the reviewed Loader manifest")
    for item in files:
        path = item.filename
        declared = expected[path]
        if item.file_size != declared["size"]:
            raise ValueError(f"Size mismatch in ZIP: {path}")
        digest = sha256()
        with archive.open(item) as member:
            for chunk in iter(lambda: member.read(1024 * 1024), b""):
                digest.update(chunk)
        if digest.hexdigest().lower() != declared["sha256"].lower():
            raise ValueError(f"SHA256 mismatch in ZIP: {path}")

print(f"Verified {len(files)} Loader ZIP members against the schema-1 manifest")
