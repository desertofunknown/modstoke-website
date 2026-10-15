import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { lstat, readFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';

const products = ['manager', 'loader'];
const slug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const versionText = /^[0-9]+\.[0-9]+\.[0-9]+(?:[-+][A-Za-z0-9.-]+)?$/;
const hex = /^[a-f0-9]{64}$/i;
const commit = /^[a-f0-9]{40,64}$/i;
const versionedFile = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;
const requiredChecks = ['cleanSource', 'licenses', 'build', 'install', 'game', 'multiplayer', 'hostedFetch'];

function fail(message) { throw new Error(`Release index: ${message}`); }
function object(value) { return value !== null && typeof value === 'object' && !Array.isArray(value); }
function filled(value) { return typeof value === 'string' && value.trim() === value && value.length > 0; }
function date(value) { return filled(value) && !Number.isNaN(Date.parse(value)) && /Z$/.test(value); }
function safeRelativePath(value) {
  return filled(value) && !value.includes('\\') && !value.startsWith('/') &&
    value.split('/').every(part => part && part !== '.' && part !== '..' && !part.includes(':'));
}
function atLeastVersion(actual, minimum) {
  const numbers = value => value.split(/[+-]/, 1)[0].split('.').map(Number);
  const a = numbers(actual), b = numbers(minimum);
  for (let i = 0; i < 3; i++) if (a[i] !== b[i]) return a[i] > b[i];
  if (actual === minimum) return true;
  if (actual.includes('-')) return false; // Do not guess precedence between preview labels.
  return true;
}

export function validateReleaseIndex(index) {
  if (!object(index) || index.schema !== 1 || !object(index.latest) || !Array.isArray(index.releases)) fail('expected schema 1, latest, and releases');
  if (Object.keys(index.latest).sort().join(',') !== 'loader,manager') fail('latest must contain manager and loader only');
  const byId = new Map();
  const artifactPaths = new Set();
  for (const record of index.releases) {
    if (!object(record) || !slug.test(record.releaseId || '') || byId.has(record.releaseId)) fail('releaseId must be unique and URL-safe');
    if (!products.includes(record.product) || !versionText.test(record.version || '') || !['stable', 'preview'].includes(record.channel)) fail(`${record.releaseId}: invalid product, version, or channel`);
    if (!date(record.publishedUtc) || !commit.test(record.sourceCommit || '')) fail(`${record.releaseId}: missing publication date or source commit`);
    if (record.notesPath !== `/releases/#${record.releaseId}`) fail(`${record.releaseId}: notesPath must point to its release section`);
    if (!object(record.validation) || requiredChecks.some(key => !['passed', 'not-applicable'].includes(record.validation[key]))) fail(`${record.releaseId}: incomplete release validation`);
    for (const key of ['cleanSource', 'licenses', 'build', 'install', 'hostedFetch']) if (record.validation[key] !== 'passed') fail(`${record.releaseId}: ${key} has not passed`);
    if (record.product === 'loader' && (record.validation.game !== 'passed' || record.validation.multiplayer !== 'passed')) fail(`${record.releaseId}: game and multiplayer checks required`);
    if (record.product === 'manager') {
      if (record.defaultLoaderReleaseId !== null && !slug.test(record.defaultLoaderReleaseId || '')) fail(`${record.releaseId}: invalid default Loader reference`);
    } else {
      const fit = record.compatibility;
      const bundle = record.bundled;
      if (!object(fit) || fit.gameId !== 'sons-of-the-forest' || !Array.isArray(fit.testedGameBuilds) || !fit.testedGameBuilds.length || fit.testedGameBuilds.some(x => !filled(x)) || !versionText.test(fit.minManagerVersion || '')) fail(`${record.releaseId}: untested or invalid compatibility`);
      if (!object(bundle) || !object(bundle.sdk) || !safeRelativePath(bundle.sdk.assemblyPath) || !commit.test(bundle.sdk.sourceCommit || '') || !object(bundle.client) || !filled(bundle.client.pluginId) || !versionText.test(bundle.client.version || '') || !safeRelativePath(bundle.client.installPath) || !commit.test(bundle.client.sourceCommit || '')) fail(`${record.releaseId}: complete SDK and distinct client companion required`);
      if (bundle.client.pluginId === 'com.openacai.sotf.admin') fail(`${record.releaseId}: host Admin cannot be the client companion`);
    }
    if (!Array.isArray(record.artifacts) || record.artifacts.length !== 1) fail(`${record.releaseId}: exactly one hosted artifact is required`);
    const artifact = record.artifacts[0];
    const kind = record.product === 'manager' ? 'manager-windows' : 'game-root-bundle';
    if (!object(artifact) || artifact.kind !== kind || !versionedFile.test(artifact.fileName || '') || artifact.fileName.includes('..') ||
        artifact.sitePath !== `/downloads/${record.product}/${record.version}/${artifact.fileName}` ||
        !Number.isSafeInteger(artifact.size) || artifact.size <= 0 || !hex.test(artifact.sha256 || '') || artifact.signatureStatus !== 'verified') fail(`${record.releaseId}: artifact metadata is incomplete or path is mutable`);
    if (record.product === 'loader' && !artifact.fileName.toLowerCase().endsWith('.zip')) fail(`${record.releaseId}: Loader bundle must be a ZIP`);
    if (record.product === 'manager' && !/\.(exe|msi)$/i.test(artifact.fileName)) fail(`${record.releaseId}: Manager package must be a signed EXE or MSI`);
    if (artifactPaths.has(artifact.sitePath)) fail(`${record.releaseId}: duplicate artifact path`);
    artifactPaths.add(artifact.sitePath);
    const evidence = artifact.signingEvidence;
    if (!object(evidence) || !filled(evidence.publisher) || !date(evidence.verifiedUtc) || !Array.isArray(evidence.files) || !evidence.files.length || evidence.files.some(file => !object(file) || !safeRelativePath(file.path) || !hex.test(file.sha256 || '') || !/^[a-f0-9]{40,64}$/i.test(file.certificateThumbprint || ''))) fail(`${record.releaseId}: signing evidence is incomplete`);
    if (record.product === 'manager' && !evidence.files.some(file => file.path === artifact.fileName && file.sha256.toLowerCase() === artifact.sha256.toLowerCase())) fail(`${record.releaseId}: Manager signing evidence must identify the package bytes`);
    byId.set(record.releaseId, record);
  }
  for (const product of products) {
    const selected = index.latest[product];
    if (selected !== null && (!byId.has(selected) || byId.get(selected).product !== product)) fail(`latest.${product} must select a matching release`);
  }
  for (const record of index.releases.filter(x => x.product === 'manager' && x.defaultLoaderReleaseId !== null)) {
    const loader = byId.get(record.defaultLoaderReleaseId);
    if (!loader || loader.product !== 'loader') fail(`${record.releaseId}: default Loader release is missing`);
  }
  const currentManager = byId.get(index.latest.manager);
  if (currentManager?.defaultLoaderReleaseId && currentManager.defaultLoaderReleaseId !== index.latest.loader) fail('current Manager and Loader selections do not match');
  const currentLoader = byId.get(index.latest.loader);
  if (currentManager && currentLoader && !atLeastVersion(currentManager.version,currentLoader.compatibility.minManagerVersion)) fail('selected Manager is below the Loader minimum version');
  return index;
}

async function regularFileBelow(root, local) {
  if (!safeRelativePath(local)) fail(`unsafe local artifact path: ${local}`);
  for (const directory of [dirname(root),root]) {
    const info = await lstat(directory);
    if (!info.isDirectory() || info.isSymbolicLink()) fail(`symlink or non-directory in artifact root: ${directory}`);
  }
  let current = root;
  for (const part of local.split('/')) {
    current = join(current, part);
    const info = await lstat(current);
    if (info.isSymbolicLink()) fail(`symlink in artifact path: ${local}`);
  }
  const info = await lstat(current);
  if (!info.isFile()) fail(`artifact is not a regular file: ${local}`);
  return { path: current, size: info.size };
}

async function sha256(file) {
  const hash = createHash('sha256');
  for await (const chunk of createReadStream(file)) hash.update(chunk);
  return hash.digest('hex');
}

export async function verifiedArtifacts(root, index) {
  validateReleaseIndex(index);
  const results = [];
  for (const record of index.releases) {
    const metadata = record.artifacts[0];
    const local = metadata.sitePath.slice('/downloads/'.length);
    const found = await regularFileBelow(resolve(root, 'artifacts/hosted'), local);
    if (found.size !== metadata.size || (await sha256(found.path)).toLowerCase() !== metadata.sha256.toLowerCase()) fail(`${record.releaseId}: hosted bytes differ from size or SHA256`);
    results.push({ record, metadata, source: found.path });
  }
  return results;
}

export async function verifyCopiedArtifact(file, metadata) {
  const info = await lstat(file);
  if (!info.isFile() || info.size !== metadata.size || (await sha256(file)).toLowerCase() !== metadata.sha256.toLowerCase()) fail(`copied artifact mismatch: ${metadata.sitePath}`);
}

export async function loaderManifest(root, record, origin) {
  if (record.product !== 'loader') fail('Loader manifest requested for another product');
  if (!/^https:\/\/[A-Za-z0-9.-]+(?::[0-9]+)?$/.test(origin || '')) fail('PUBLIC_ORIGIN must be an HTTPS origin for Loader publication');
  const source = (await regularFileBelow(resolve(root, 'data/loader-manifests'), `${record.releaseId}.json`)).path;
  const manifest = JSON.parse(await readFile(source, 'utf8'));
  const artifact = record.artifacts[0];
  if (manifest.schema !== 1 || !filled(manifest.name) || !date(manifest.generatedUtc) || manifest.version !== record.version || !object(manifest.package) ||
      manifest.package.fileName !== artifact.fileName || String(manifest.package.sha256 || '').toLowerCase() !== artifact.sha256.toLowerCase() ||
      !object(manifest.update) || manifest.update.minManagerVersion !== record.compatibility.minManagerVersion ||
      !object(manifest.runtime) || ['targetFramework','dotnetRuntimeVersion','supportPolicy','redLoaderCompatibilityTarget'].some(key => !filled(manifest.runtime[key])) ||
      !Array.isArray(manifest.files) || !manifest.files.length) fail(`${record.releaseId}: invalid Loader schema-1 manifest source`);
  const paths = new Set();
  for (const file of manifest.files) {
    if (!object(file) || !safeRelativePath(file.path) || !hex.test(file.sha256 || '') || !Number.isSafeInteger(file.size) || file.size <= 0 || paths.has(file.path)) fail(`${record.releaseId}: invalid or duplicate installed file`);
    paths.add(file.path);
  }
  if (!paths.has(record.bundled.sdk.assemblyPath) || !paths.has(record.bundled.client.installPath)) fail(`${record.releaseId}: SDK or client companion absent from installed files`);
  for (const signedFile of artifact.signingEvidence.files) {
    const listed = manifest.files.find(file => file.path === signedFile.path);
    if (!listed || listed.sha256.toLowerCase() !== signedFile.sha256.toLowerCase()) fail(`${record.releaseId}: signing evidence does not match an installed file`);
  }
  if ('downloadUrl' in manifest.package || 'manifestUrl' in manifest.update) fail(`${record.releaseId}: URLs are generated by the website build`);
  manifest.package.downloadUrl = origin + artifact.sitePath;
  manifest.update.manifestUrl = origin + '/releases/loader/latest/OpenACAILoader.manifest.json';
  return manifest;
}
