import { escapeHtml as e } from '../scripts/model.mjs';
import { translator } from './i18n.mjs';

export function selectedRelease(index, product) {
  return index.releases.find(record => record.releaseId === index.latest[product]) || null;
}

function releaseEvidence(record, i) {
  const artifact=record.artifacts[0];
  const signing=artifact.signatureStatus==='verified'
    ? artifact.signingEvidence?.publisher ? i.t('release.signatureReviewedFor',{publisher:e(artifact.signingEvidence.publisher)}) : i.t('release.signatureReviewed')
    : artifact.signatureStatus==='unsigned-preview'
      ? i.t('release.previewUnsigned',{reason:e(artifact.unsignedReason)})
      : i.t('release.signatureNotRecorded');
  const labels={cleanSource:'cleanSource',licenses:'licenses',build:'build',install:'install',game:'game',multiplayer:'multiplayer',hostedFetch:'hostedFetch'};
  const states={passed:'passed',pending:'pending','not-applicable':'notApplicable'};
  const checks=Object.entries(labels).map(([key,label])=>{
    const value=record.validation?.[key];
    return i.t('release.checkLine',{label:i.t(`release.checks.${label}`),state:i.t(`release.state.${states[value]||'notRecorded'}`)});
  }).join(i.t('release.checkSeparator'));
  return `<p class="release-signing">${signing} ${i.t('release.checksumNote')}</p><p class="release-validation">${i.t('release.validation',{checks})}</p>`;
}

function previewWarning(record, i) {
  if (record.channel !== 'preview') return '';
  const artifact = record.artifacts[0];
  const pending = ['game', 'multiplayer']
    .filter(key => record.validation?.[key] === 'pending')
    .map(key => i.t(`release.pending.${key}`));
  const unsigned = artifact.signatureStatus === 'unsigned-preview'
    ? ` ${i.t('release.packageUnsigned', { reason: e(artifact.unsignedReason) })}`
    : '';
  const unfinished = pending.length ? ` ${i.t('release.pendingChecks', { checks: pending.join(i.t('release.listSeparator')) })}` : '';
  return `<p class="release-warning">${i.t('release.previewBuild')}${unsigned}${unfinished} ${i.t('release.reviewDetails')}</p>`;
}

function releaseNotes(record, i) {
  return typeof record.changelog==='string' && record.changelog.trim()
    ? `<p class="release-changelog">${i.own(`releaseNotes.${record.releaseId}`) || e(record.changelog)}</p>`
    : `<p class="release-changelog">${i.t('release.noNotes')}</p>`;
}

function artifactCard(record, label, i) {
  const artifact = record.artifacts[0];
  return `<article class="release-download-card"><p class="eyebrow">${e(record.product.toUpperCase())} / ${i.t(`mods.status.${record.channel}`).toLocaleUpperCase(i.code)}</p><h2>${e(label)} ${e(record.version)}</h2><p>${record.product === 'loader' ? (record.bundled.client ? i.t('release.loaderWithClient') : i.t('release.loaderOnly')) : i.t('release.managerPackage')}</p>${previewWarning(record, i)}<a class="button button-light" href="${e(artifact.sitePath)}" download="${e(artifact.fileName)}">${i.t('release.download', { file: e(artifact.fileName) })}</a><dl class="release-file-details"><div><dt>${i.t('release.size')}</dt><dd>${i.t('release.bytes', { size: artifact.size })}</dd></div><div><dt>SHA-256</dt><dd><code>${e(artifact.sha256)}</code></dd></div><div><dt>${i.t('release.published')}</dt><dd><time datetime="${e(record.publishedUtc)}">${e(record.publishedUtc.slice(0,10))}</time></dd></div></dl>${releaseEvidence(record, i)}<p><a class="inline-link" href="${e(record.notesPath)}">${i.t('release.details')}</a></p></article>`;
}

export function renderReleasePage(index, game, i = translator('en')) {
  const manager = selectedRelease(index, 'manager');
  const loader = selectedRelease(index, 'loader');
  if (!manager && !loader) return null;
  const hasPreview = index.releases.some(record => record.channel === 'preview');
  const heading = hasPreview ? i.t('release.headingPreview') : i.t('release.headingVerified');
  const cards = [manager && artifactCard(manager, 'Modstoke Manager', i), loader && artifactCard(loader, i.t('release.playerBundle'), i)].filter(Boolean).join('');
  const rows = index.releases.map(record => {
    const artifact = record.artifacts[0];
    const selected = index.latest[record.product] === record.releaseId;
    const gameBuilds = record.product !== 'loader' ? '' : record.compatibility.testedGameBuilds.length
      ? i.t('release.testedBuilds', { game: e(game), builds: record.compatibility.testedGameBuilds.map(e).join(i.t('release.listSeparator')) })
      : i.t('release.noTestedBuilds');
    const compatibility = record.product === 'loader'
      ? `<p>${gameBuilds} ${i.t('release.requiresManager', { version: e(record.compatibility.minManagerVersion) })}</p>`
      : `<p>${record.defaultLoaderReleaseId ? i.t('release.guidedLoader', { id: e(record.defaultLoaderReleaseId) }) : i.t('release.noGuidedLoader')}</p>`;
    return `<article class="release-record" id="${e(record.releaseId)}"><div><p class="eyebrow">${e(record.product.toUpperCase())} / ${i.t(`mods.status.${record.channel}`).toLocaleUpperCase(i.code)} / ${i.t(selected ? 'release.current' : 'release.previous')}</p><h3>${e(record.version)}</h3>${releaseNotes(record, i)}<p>${i.t('release.publishedCommit', { date: e(record.publishedUtc.slice(0,10)), commit: `<code>${e(record.sourceCommit)}</code>` })}</p>${previewWarning(record, i)}${compatibility}<p>${i.t('release.packageLine', { file: `<a href="${e(artifact.sitePath)}" download="${e(artifact.fileName)}">${e(artifact.fileName)}</a>`, size: artifact.size, hash: `<code>${e(artifact.sha256)}</code>` })}</p></div></article>`;
  }).join('');
  return `<section class="page-hero compact"><p class="eyebrow">${i.t('release.eyebrow')}</p><h1>${heading}</h1><p class="page-lede">${i.t('release.lede')}</p></section><section class="releases-body light-section">${hasPreview ? `<p class="release-warning">${i.t('release.previewDownloads')}</p>` : ''}<div class="release-download-grid">${cards}</div>${manager && !loader ? `<p class="release-warning">${i.t('release.managerOnly')}</p>` : ''}<div class="release-note release-history"><h2>${i.t('release.historyTitle')}</h2><p>${i.t('release.historyNote')}</p>${rows}</div></section>`;
}
