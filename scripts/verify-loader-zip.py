"""Check every game-root ZIP member against the reviewed schema-1 file list."""
from hashlib import sha256
from pathlib import Path
from zipfile import ZipFile
import json
import stat
import sys

archive_path, manifest_path, inventory_path, sdk_path, client_path = map(Path, sys.argv[1:6])
release_id = sys.argv[6]
manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
expected = {item["path"]: item for item in manifest["files"]}
inventory = json.loads(inventory_path.read_text(encoding="utf-8"))
inventory_files = inventory.get("files")
if inventory.get("schema") != 1 or inventory.get("releaseId") != release_id or not isinstance(inventory_files, list):
    raise ValueError("Reviewed package inventory must use schema 1 and list files")
reviewed = inventory.get("reviewedUtc")
if not isinstance(reviewed, str) or not reviewed.endswith("Z"):
    raise ValueError("Package inventory needs a UTC review date")
reviewed_paths = set()
for item in inventory_files:
    if not isinstance(item, dict) or not isinstance(item.get("path"), str):
        raise ValueError("Invalid package inventory entry")
    path = item["path"]
    if path in reviewed_paths or item.get("provenance") not in ("publisher", "third-party"):
        raise ValueError(f"Missing or duplicate provenance review: {path}")
    if item.get("redistributionApproved") is not True:
        raise ValueError(f"Redistribution has not been approved: {path}")
    if any(not isinstance(item.get(key), str) or not item[key].strip() or item[key].lower() in ("unknown", "pending", "tbd") for key in ("license", "sourceRef")):
        raise ValueError(f"Missing license or source reference: {path}")
    reviewed_paths.add(path)
if reviewed_paths != set(expected):
    raise ValueError("Reviewed inventory must account for every installed ZIP file")
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
        lowered = path.lower().split("/")
        if (lowered[0].endswith("_data") or lowered[-1] in
                ("gameassembly.dll", "unityplayer.dll", "global-metadata.dat", "resources.assets", "sonsoftheforest.exe")):
            raise ValueError(f"Proprietary game file path in ZIP: {item.filename}")
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
