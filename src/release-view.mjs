import { escapeHtml as e } from '../scripts/model.mjs';

export function selectedRelease(index, product) {
  return index.releases.find(record => record.releaseId === index.latest[product]) || null;
}

function artifactCard(record, label) {
  const artifact = record.artifacts[0];
  return `<article class="release-download-card" id="${e(record.releaseId)}"><p class="eyebrow">${e(record.product.toUpperCase())} / ${e(record.channel.toUpperCase())}</p><h2>${e(label)} ${e(record.version)}</h2><p>${record.product === 'loader' ? 'Game-root bundle with Loader, its bundled SDK, and a separately built client companion.' : 'Windows desktop package for Modstoke Manager.'}</p><a class="button button-light" href="${e(artifact.sitePath)}">Download ${e(artifact.fileName)}</a><dl class="release-file-details"><div><dt>Size</dt><dd>${e(artifact.size.toLocaleString('en-US'))} bytes</dd></div><div><dt>SHA-256</dt><dd><code>${e(artifact.sha256)}</code></dd></div><div><dt>Published</dt><dd><time datetime="${e(record.publishedUtc)}">${e(record.publishedUtc.slice(0,10))}</time></dd></div></dl><p><a class="inline-link" href="${e(record.notesPath)}">Release details</a></p></article>`;
}

export function renderReleasePage(index, game) {
  const manager = selectedRelease(index, 'manager');
  const loader = selectedRelease(index, 'loader');
  if (!manager && !loader) return null;
  const cards = [manager && artifactCard(manager, 'Modstoke Manager'), loader && artifactCard(loader, 'Player bundle')].filter(Boolean).join('');
  const rows = index.releases.map(record => {
    const artifact = record.artifacts[0];
    const selected = index.latest[record.product] === record.releaseId;
    return `<article class="release-record" id="${e(record.releaseId)}"><div><p class="eyebrow">${e(record.product.toUpperCase())} / ${e(record.channel.toUpperCase())}${selected ? ' / CURRENT' : ' / PREVIOUS'}</p><h3>${e(record.version)}</h3><p>Published ${e(record.publishedUtc.slice(0,10))}. Source commit <code>${e(record.sourceCommit)}</code>.</p>${record.product === 'loader' ? `<p>Tested ${e(game)} builds: ${record.compatibility.testedGameBuilds.map(e).join(', ')}. Requires Manager ${e(record.compatibility.minManagerVersion)} or newer.</p>` : `<p>${record.defaultLoaderReleaseId ? `Guided Loader bundle: ${e(record.defaultLoaderReleaseId)}.` : 'A matching guided Loader bundle is not selected for this Manager release.'}</p>`}<p>Package: <a href="${e(artifact.sitePath)}">${e(artifact.fileName)}</a> (${e(artifact.size.toLocaleString('en-US'))} bytes). SHA-256: <code>${e(artifact.sha256)}</code>.</p></div></article>`;
  }).join('');
  return `<section class="page-hero compact"><p class="eyebrow">RELEASES</p><h1>Verified downloads.</h1><p class="page-lede">Select a current release or inspect a retained version before installing.</p></section><section class="releases-body light-section"><div class="release-download-grid">${cards}</div>${manager && !loader ? '<p class="release-warning">Manager is available, but the complete Loader, SDK and client bundle is not yet published. Guided setup remains incomplete.</p>' : ''}<div class="release-note release-history"><h2>Release details and rollback</h2><p>Versioned file URLs stay fixed. An earlier verified record can remain available when the current selection changes.</p>${rows}</div></section>`;
}
