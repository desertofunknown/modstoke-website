import { escapeHtml as e } from '../scripts/model.mjs';

export function selectedRelease(index, product) {
  return index.releases.find(record => record.releaseId === index.latest[product]) || null;
}

function releaseEvidence(record) {
  const artifact=record.artifacts[0];
  const signing=artifact.signatureStatus==='verified'
    ? `Signature review recorded${artifact.signingEvidence?.publisher ? ` for ${artifact.signingEvidence.publisher}` : ''}.`
    : artifact.signatureStatus==='unsigned-preview'
      ? `This preview package is unsigned: ${artifact.unsignedReason}. Signature verification has not been recorded.`
      : 'Signature verification has not been recorded.';
  const labels={cleanSource:'Clean source',licenses:'Licenses',build:'Build',install:'Installation',game:'Game launch',multiplayer:'Multiplayer',hostedFetch:'Hosted file check'};
  const checks=Object.entries(labels).map(([key,label])=>{
    const value=record.validation?.[key];
    return `${label}: ${value==='passed'?'passed':value==='pending'?'pending':value==='not-applicable'?'not applicable':'not recorded'}`;
  }).join(' � ');
  return `<p class="release-signing">${e(signing)} A SHA-256 checksum identifies file bytes; it does not authenticate an update manifest.</p><p class="release-validation">${e(checks)}.</p>`;
}

function previewWarning(record) {
  if (record.channel !== 'preview') return '';
  const artifact = record.artifacts[0];
  const pendingLabels = {game:'game launch',multiplayer:'multiplayer'};
  const pending = Object.entries(pendingLabels)
    .filter(([key]) => record.validation?.[key] === 'pending')
    .map(([, label]) => label);
  const unsigned = artifact.signatureStatus === 'unsigned-preview'
    ? ` This package is unsigned: ${artifact.unsignedReason}.`
    : '';
  const unfinished = pending.length ? ` Pending checks: ${pending.join(', ')}.` : '';
  return `<p class="release-warning">Preview test build.${e(unsigned + unfinished)} Review the release details before installing.</p>`;
}

function releaseNotes(record) {
  return typeof record.changelog==='string' && record.changelog.trim()
    ? `<p class="release-changelog">${e(record.changelog)}</p>`
    : '<p class="release-changelog">No release notes have been supplied for this version. The file and validation metadata below are not a changelog.</p>';
}

function artifactCard(record, label) {
  const artifact = record.artifacts[0];
  return `<article class="release-download-card"><p class="eyebrow">${e(record.product.toUpperCase())} / ${e(record.channel.toUpperCase())}</p><h2>${e(label)} ${e(record.version)}</h2><p>${record.product === 'loader' ? 'Game-root bundle with Loader, its bundled SDK, and a separately built client companion.' : 'Windows desktop package for Modstoke Manager.'}</p>${previewWarning(record)}<a class="button button-light" href="${e(artifact.sitePath)}">Download ${e(artifact.fileName)}</a><dl class="release-file-details"><div><dt>Size</dt><dd>${e(artifact.size.toLocaleString('en-US'))} bytes</dd></div><div><dt>SHA-256</dt><dd><code>${e(artifact.sha256)}</code></dd></div><div><dt>Published</dt><dd><time datetime="${e(record.publishedUtc)}">${e(record.publishedUtc.slice(0,10))}</time></dd></div></dl>${releaseEvidence(record)}<p><a class="inline-link" href="${e(record.notesPath)}">Release details</a></p></article>`;
}

export function renderReleasePage(index, game) {
  const manager = selectedRelease(index, 'manager');
  const loader = selectedRelease(index, 'loader');
  if (!manager && !loader) return null;
  const hasPreview = index.releases.some(record => record.channel === 'preview');
  const heading = hasPreview ? 'Downloads, including preview builds.' : 'Verified downloads.';
  const cards = [manager && artifactCard(manager, 'Modstoke Manager'), loader && artifactCard(loader, 'Player bundle')].filter(Boolean).join('');
  const rows = index.releases.map(record => {
    const artifact = record.artifacts[0];
    const selected = index.latest[record.product] === record.releaseId;
    const gameBuilds = record.product !== 'loader' ? '' : record.compatibility.testedGameBuilds.length
      ? `Tested ${e(game)} builds: ${record.compatibility.testedGameBuilds.map(e).join(', ')}.`
      : 'No game builds have been tested yet. Game compatibility is unknown.';
    const compatibility = record.product === 'loader'
      ? `<p>${gameBuilds} Requires Manager ${e(record.compatibility.minManagerVersion)} or newer.</p>`
      : `<p>${record.defaultLoaderReleaseId ? `Guided Loader bundle: ${e(record.defaultLoaderReleaseId)}.` : 'A matching guided Loader bundle is not selected for this Manager release.'}</p>`;
    return `<article class="release-record" id="${e(record.releaseId)}"><div><p class="eyebrow">${e(record.product.toUpperCase())} / ${e(record.channel.toUpperCase())}${selected ? ' / CURRENT' : ' / PREVIOUS'}</p><h3>${e(record.version)}</h3>${releaseNotes(record)}<p>Published ${e(record.publishedUtc.slice(0,10))}. Source commit <code>${e(record.sourceCommit)}</code>.</p>${previewWarning(record)}${compatibility}<p>Package: <a href="${e(artifact.sitePath)}">${e(artifact.fileName)}</a> (${e(artifact.size.toLocaleString('en-US'))} bytes). SHA-256: <code>${e(artifact.sha256)}</code>.</p></div></article>`;
  }).join('');
  return `<section class="page-hero compact"><p class="eyebrow">RELEASES</p><h1>${heading}</h1><p class="page-lede">Select a current release or inspect a retained version before installing.</p></section><section class="releases-body light-section">${hasPreview ? '<p class="release-warning">Preview downloads are test builds. Check signature and validation details before installing.</p>' : ''}<div class="release-download-grid">${cards}</div>${manager && !loader ? '<p class="release-warning">Manager is available, but the complete Loader, SDK and client bundle is not yet published. Guided setup remains incomplete.</p>' : ''}<div class="release-note release-history"><h2>Release details and rollback</h2><p>Versioned file URLs stay fixed. An earlier release record can remain available when the current selection changes.</p>${rows}</div></section>`;
}
