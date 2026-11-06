import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

// Store catalog schema 1 (see the store plan, section 4.5). The site reads it at build time;
// it is not published at /store/v1/ until the catalog is signed.
const modId = /^[A-Za-z0-9._-]{1,96}$/;
const semver = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/;
const utc = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;
const hex = /^[a-f0-9]{64}$/;
const youtubeId = /^[A-Za-z0-9_-]{11}$/;
const mediaPath = /^\/assets\/mods\/[a-z0-9._-]+\/[a-z0-9-]+-1600\.webp$/;
const roles = ['client', 'host', 'all-players', 'solo', null];
const dedicated = ['supported', 'unsupported', null];
const settings = ['host-synced', 'per-player', 'none', null];

function fail(message) { throw new Error(`Store catalog: ${message}`); }
function object(value) { return value !== null && typeof value === 'object' && !Array.isArray(value); }
function text(value, max = 400) { return typeof value === 'string' && value.trim() === value && value.length > 0 && value.length <= max; }
function optionalText(value, max) { return value === null || value === undefined || text(value, max); }

function validateMedia(mod, item) {
  if (!object(item) || !['image', 'video'].includes(item.kind)) fail(`${mod.id}: media kind must be image or video`);
  if (!mediaPath.test(item.path || '') || !item.path.startsWith(`/assets/mods/${mod.slug}/`)) fail(`${mod.id}: media path ${item.path} is not under its own folder`);
  if (!hex.test(item.sha256 || '') || !Number.isInteger(item.width) || !Number.isInteger(item.height)) fail(`${mod.id}: media needs sha256, width and height`);
  if (!text(item.alt, 200) || !optionalText(item.caption, 200)) fail(`${mod.id}: media needs alt text`);
  if (item.kind === 'video' && !youtubeId.test(item.youtubeId || '')) fail(`${mod.id}: video media needs a YouTube id`);
}

function validateRelease(mod, release, seen) {
  if (!object(release) || !semver.test(release.version || '') || seen.has(release.version)) fail(`${mod.id}: invalid or repeated version`);
  seen.add(release.version);
  if (!['stable', 'preview'].includes(release.channel) || (release.channel === 'stable') === release.version.includes('-')) fail(`${mod.id} ${release.version}: channel must match the version`);
  if (!utc.test(release.publishedUtc || '') || !text(release.changelog, 4000)) fail(`${mod.id} ${release.version}: needs a date and a changelog`);
  // A release without a package is listed only; its files live elsewhere (crossRefs).
  if (release.package !== null) fail(`${mod.id} ${release.version}: hosted packages need the signed store pipeline`);
  if (!Array.isArray(release.runsOn) || !release.runsOn.length || release.runsOn.some(entry => !object(entry) || !['modstoke', 'redloader'].includes(entry.loader) || !text(entry.range, 64))) fail(`${mod.id} ${release.version}: runsOn is required`);
  const mp = release.multiplayer;
  if (!object(mp) || !roles.includes(mp.role) || !dedicated.includes(mp.dedicatedServer) || !settings.includes(mp.settings)) fail(`${mod.id} ${release.version}: invalid multiplayer block`);
  for (const key of ['requires', 'conflicts']) if (!Array.isArray(release[key])) fail(`${mod.id} ${release.version}: ${key} must be a list`);
}

export function validateStoreCatalog(catalog) {
  if (!object(catalog) || catalog.schema !== 1 || catalog.kind !== 'modstoke.store-catalog') fail('expected schema 1 and kind modstoke.store-catalog');
  if (!utc.test(catalog.generatedUtc || '') || !object(catalog.game) || catalog.game.id !== 'sons-of-the-forest') fail('missing generatedUtc or game');
  const publishers = new Set();
  for (const publisher of catalog.publishers || []) {
    if (!object(publisher) || !text(publisher.id, 64) || !text(publisher.name, 80) || publishers.has(publisher.id)) fail('publishers need unique ids and names');
    publishers.add(publisher.id);
  }
  const ids = new Set();
  for (const mod of catalog.mods || []) {
    if (!object(mod) || !modId.test(mod.id || '') || ids.has(mod.id.toLowerCase())) fail(`invalid or repeated mod id ${mod?.id}`);
    ids.add(mod.id.toLowerCase());
    if (mod.slug !== mod.id.toLowerCase()) fail(`${mod.id}: slug must be the lowercase id`);
    if (!publishers.has(mod.publisher) || !['mod', 'library'].includes(mod.kind) || !['listed', 'yanked'].includes(mod.status)) fail(`${mod.id}: publisher, kind or status`);
    if (!text(mod.name, 80) || !text(mod.summary, 300) || !text(mod.description, 8000) || !optionalText(mod.inTesting, 600)) fail(`${mod.id}: name, summary and description are required`);
    if (!optionalText(mod.license, 64) || !(mod.sourceUrl === null || /^https:\/\//.test(mod.sourceUrl)) || typeof mod.aiAssisted !== 'boolean') fail(`${mod.id}: license, sourceUrl or aiAssisted`);
    if (!object(mod.crossRefs) || !(mod.crossRefs.nexusModId === null || Number.isInteger(mod.crossRefs.nexusModId))) fail(`${mod.id}: crossRefs`);
    if (!Array.isArray(mod.media) || !mod.media.length || mod.media[0].kind !== 'image') fail(`${mod.id}: the first media item is the cover and must be an image`);
    mod.media.forEach(item => validateMedia(mod, item));
    if (!Array.isArray(mod.releases) || !mod.releases.length) fail(`${mod.id}: at least one release is required`);
    const seen = new Set();
    mod.releases.forEach(release => validateRelease(mod, release, seen));
  }
  if (!Array.isArray(catalog.revocations)) fail('revocations must be a list');
  return catalog;
}

// The 1600 px WebP is the recorded file; pages also use an 800 px WebP and a 1600 px JPEG.
export function mediaVariants(path) {
  const base = path.replace(/-1600\.webp$/, '');
  return [`${base}-1600.webp`, `${base}-800.webp`, `${base}-1600.jpg`];
}

async function exists(file) {
  try { await readFile(file); return true; }
  catch (error) { if (error.code === 'ENOENT') return false; throw error; }
}

// Images are kept out of git like the other captures, so a missing file is allowed and simply not
// rendered; a present file must match its recorded hash.
export async function availableMedia(root, catalog) {
  const present = new Set();
  for (const mod of catalog.mods) for (const item of mod.media) {
    let bytes;
    try { bytes = await readFile(resolve(root, 'src', item.path.slice(1))); }
    catch (error) { if (error.code === 'ENOENT') continue; throw error; }
    if (createHash('sha256').update(bytes).digest('hex') !== item.sha256) fail(`${item.path} does not match its sha256`);
    for (const variant of mediaVariants(item.path).slice(1)) if (!await exists(resolve(root, 'src', variant.slice(1)))) fail(`${variant} is missing`);
    present.add(item.path);
  }
  return present;
}

export function latestRelease(mod) {
  return mod.releases.reduce((latest, release) => release.publishedUtc > latest.publishedUtc ? release : latest);
}
