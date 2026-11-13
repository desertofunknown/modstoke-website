import { escapeHtml as e } from '../scripts/model.mjs';
import { selectedRelease } from './release-view.mjs';
import { translator } from './i18n.mjs';

const installPath = '/guides/install-modstoke-manager/';
const troubleshootingPath = '/guides/sons-of-the-forest-mod-troubleshooting/';

function breadcrumbs(current, i) {
  return `<nav class="guide-breadcrumbs" aria-label="${i.t('guides.breadcrumb')}"><ol><li><a href="${i.href('/')}">${i.t('guides.home')}</a></li>${current ? `<li><a href="${i.href('/guides/')}">${i.t('guides.guides')}</a></li><li aria-current="page">${current}</li>` : `<li aria-current="page">${i.t('guides.guides')}</li>`}</ol></nav>`;
}

function hero(title, description, current, i) {
  return `${breadcrumbs(current, i)}<header class="page-hero compact guide-hero"><p class="eyebrow">${i.t('guides.eyebrow')}</p><h1>${title}</h1><p class="page-lede">${description}</p></header>`;
}

function contents(items, i) {
  return `<nav class="guide-contents" aria-label="${i.t('guides.onThisPage')}"><h2>${i.t('guides.onThisPage')}</h2><ol>${items.map(([id, label]) => `<li><a href="#${id}">${label}</a></li>`).join('')}</ol></nav>`;
}

const backupSteps = i => `<ol class="guide-steps">
  <li>${i.t('guides.backup.exit')}</li>
  <li>${i.t('guides.backup.find', { path: '<code>%USERPROFILE%\\AppData\\LocalLow\\Endnight\\SonsOfTheForest</code>', saves: '<code>Saves</code>' })}</li>
  <li>${i.t('guides.backup.copy', { saves: '<code>Saves</code>' })}</li>
  <li>${i.t('guides.backup.verify')}</li>
</ol><p>${i.t('guides.backup.note')}</p>`;

export function renderGuides(releaseIndex, i = translator('en')) {
  const manager = selectedRelease(releaseIndex, 'manager');
  const loader = selectedRelease(releaseIndex, 'loader');
  const artifact = manager?.artifacts[0];
  const signed = artifact?.signatureStatus === 'verified';
  const currentManager = manager ? i.t('guides.managerVersion', { version: e(manager.version) }) : i.t('guides.managerPreview');
  const releases = i.href('/releases/');
  const installHref = i.href(installPath);
  const troubleshootingHref = i.href(troubleshootingPath);
  const checksum = artifact ? `<p>${i.t('guides.checksum.open')}</p><pre><code>${e(`Get-FileHash -LiteralPath '.\\${artifact.fileName.replaceAll("'", "''")}' -Algorithm SHA256`)}</code></pre><p>${i.t('guides.checksum.compare', { hash: '<code>Hash</code>', release: `<a href="${releases}">${i.t('guides.checksum.releasePage')}</a>`, manager: currentManager })}</p><p class="guide-hash"><code>${e(artifact.sha256)}</code></p><p>${i.t('guides.checksum.differs', { reference: `<a href="https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.utility/get-filehash">${i.t('guides.checksum.reference')}</a>` })}</p>` : `<p>${i.t('guides.checksum.none', { releases: `<a href="${releases}">${i.t('guides.checksum.releases')}</a>` })}</p>`;

  const indexTitle = i.t('guides.index.title');
  const indexDescription = i.t('guides.index.description');
  const index = `${hero(indexTitle, indexDescription, null, i)}
    <section class="guide-status" aria-labelledby="guide-status-title"><h2 id="guide-status-title">${i.t('guides.index.statusTitle')}</h2><p>${manager ? i.t(manager.channel === 'preview' ? 'guides.index.statusManagerPreview' : 'guides.index.statusManager', { manager: currentManager }) : i.t('guides.index.statusNoManager')} ${loader ? i.t('guides.index.statusLoader', { version: e(loader.version) }) : i.t('guides.index.statusNoLoader')}</p><a class="inline-link" href="${releases}">${i.t('guides.index.reviewReleases')}</a></section>
    <section class="guide-card-grid" aria-label="${i.t('guides.index.cardsLabel')}">
      <article class="guide-card"><p class="eyebrow">${i.t('guides.index.installEyebrow')}</p><h2><a href="${installHref}">${i.t('guides.index.installTitle')}</a></h2><p>${i.t('guides.index.installText')}</p><a class="inline-link" href="${installHref}">${i.t('guides.index.installLink')}</a></article>
      <article class="guide-card"><p class="eyebrow">${i.t('guides.index.troubleEyebrow')}</p><h2><a href="${troubleshootingHref}">${i.t('guides.index.troubleTitle')}</a></h2><p>${i.t('guides.index.troubleText')}</p><a class="inline-link" href="${troubleshootingHref}">${i.t('guides.index.troubleLink')}</a></article>
    </section><p class="guide-footer-note">${i.t('guides.index.footer', { docs: `<a href="${i.href('/docs/')}">${i.t('guides.index.docs')}</a>` })}</p>`;

  const installTitle = i.t('guides.install.title');
  const installDescription = i.t('guides.install.description');
  const install = `${hero(installTitle, installDescription, i.t('guides.install.crumb'), i)}
    <div class="guide-layout">${contents([['before-you-start', i.t('guides.install.toc.before')], ['backup-saves', i.t('guides.install.toc.backup')], ['download-manager', i.t('guides.install.toc.download')], ['check-download', i.t('guides.install.toc.check')], ['install-manager', i.t('guides.install.toc.install')], ['next-steps', i.t('guides.install.toc.next')]], i)}<article class="guide-body">
      <section id="before-you-start"><h2>${i.t('guides.install.before.title')}</h2><p>${i.t('guides.install.before.intro', { manager: currentManager })}</p><div class="guide-callout">${signed ? `<p>${i.t('guides.install.before.signed', { publisher: e(artifact.signingEvidence.publisher) })}</p>` : `<p>${i.t('guides.install.before.unsigned')}</p>`}</div><p>${i.t('guides.install.before.scope')} ${loader ? i.t('guides.install.before.scopeLoader') : i.t('guides.install.before.scopeNoLoader')}</p></section>
      <section id="backup-saves"><h2>${i.t('guides.install.backupTitle')}</h2>${backupSteps(i)}</section>
      <section id="download-manager"><h2>${i.t('guides.install.download.title')}</h2><ol class="guide-steps"><li>${i.t('guides.install.download.open', { releases: `<a href="${releases}">${i.t('guides.install.download.releases')}</a>` })}</li><li>${i.t('guides.install.download.read')} ${artifact ? i.t('guides.install.download.filename', { file: `<code>${e(artifact.fileName)}</code>` }) : i.t('guides.install.download.noFile')}</li><li>${i.t('guides.install.download.get')}</li></ol><p>${i.t('guides.install.download.note')}</p></section>
      <section id="check-download"><h2>${i.t('guides.install.checkTitle')}</h2>${checksum}</section>
      <section id="install-manager"><h2>${i.t('guides.install.setup.title')}</h2><ol class="guide-steps"><li>${i.t('guides.install.setup.run', { run: i.t(signed ? 'guides.install.setup.runSigned' : 'guides.install.setup.runUnsigned') })}</li><li>${i.t('guides.install.setup.open')}</li><li>${i.t('guides.install.setup.select', { exe: '<code>SonsOfTheForest.exe</code>' })}</li><li>${i.t('guides.install.setup.status')}</li></ol><p>${i.t('guides.install.setup.note')}</p></section>
      <section id="next-steps"><h2>${i.t('guides.install.next.title')}</h2><p>${loader ? i.t('guides.install.next.loader') : i.t('guides.install.next.noLoader')}</p><p>${i.t('guides.install.next.elsewhere')}</p><p>${i.t('guides.install.next.continue', { troubleshooting: `<a href="${troubleshootingHref}">${i.t('guides.install.next.troubleshooting')}</a>`, docs: `<a href="${i.href('/docs/')}#players">${i.t('guides.install.next.docs')}</a>` })}</p></section>
    </article></div>`;

  const troubleshootingTitle = i.t('guides.trouble.title');
  const troubleshootingDescription = i.t('guides.trouble.description');
  const troubleshooting = `${hero(troubleshootingTitle, troubleshootingDescription, i.t('guides.trouble.crumb'), i)}
    <div class="guide-layout">${contents([['identify-problem', i.t('guides.trouble.toc.identify')], ['protect-saves', i.t('guides.trouble.toc.protect')], ['manager-problems', i.t('guides.trouble.toc.manager')], ['loader-and-mods', i.t('guides.trouble.toc.loader')], ['restore-game', i.t('guides.trouble.toc.restore')], ['report-problem', i.t('guides.trouble.toc.report')]], i)}<article class="guide-body">
      <section id="identify-problem"><h2>${i.t('guides.trouble.identify.title')}</h2><p>${i.t('guides.trouble.identify.intro')}</p><dl class="guide-definitions"><div><dt>${i.t('guides.trouble.identify.managerTerm')}</dt><dd>${i.t('guides.trouble.identify.manager', { link: `<a href="#manager-problems">${i.t('guides.trouble.identify.managerLink')}</a>` })}</dd></div><div><dt>${i.t('guides.trouble.identify.loaderTerm')}</dt><dd>${i.t('guides.trouble.identify.loader')}</dd></div><div><dt>${i.t('guides.trouble.identify.gameTerm')}</dt><dd>${i.t('guides.trouble.identify.game', { link: `<a href="#loader-and-mods">${i.t('guides.trouble.identify.gameLink')}</a>` })}</dd></div></dl><p>${i.t('guides.trouble.identify.catalog')}</p></section>
      <section id="protect-saves"><h2>${i.t('guides.trouble.protect.title')}</h2>${backupSteps(i)}<p>${i.t('guides.trouble.protect.note')}</p></section>
      <section id="manager-problems"><h2>${i.t('guides.trouble.manager.title')}</h2><ul><li>${i.t('guides.trouble.manager.version', { releases: `<a href="${releases}">${i.t('guides.trouble.manager.releases')}</a>` })}</li><li>${i.t('guides.trouble.manager.publisher')}</li><li>${i.t('guides.trouble.manager.incomplete', { check: `<a href="${installHref}#check-download">${i.t('guides.trouble.manager.checkLink')}</a>` })}</li><li>${i.t('guides.trouble.manager.find', { exe: '<code>SonsOfTheForest.exe</code>' })}</li><li>${i.t('guides.trouble.manager.error')}</li></ul></section>
      <section id="loader-and-mods"><h2>${i.t('guides.trouble.loader.title')}</h2><ol class="guide-steps"><li>${i.t('guides.trouble.loader.read')}</li><li>${i.t('guides.trouble.loader.compare')}</li><li>${i.t('guides.trouble.loader.update')}</li><li>${i.t('guides.trouble.loader.isolate')}</li></ol><p>${i.t('guides.trouble.loader.combine')}</p><p>${i.t('guides.trouble.loader.notes', { link: `<a href="${i.href('/docs/')}#compatibility">${i.t('guides.trouble.loader.notesLink')}</a>` })}</p></section>
      <section id="restore-game"><h2>${i.t('guides.trouble.restore.title')}</h2><ol class="guide-steps"><li>${i.t('guides.trouble.restore.close', { backup: `<a href="#protect-saves">${i.t('guides.trouble.restore.backupLink')}</a>` })}</li><li>${i.t('guides.trouble.restore.remove')}</li><li>${i.t('guides.trouble.restore.verify', { properties: `<strong>${i.t('guides.trouble.restore.properties')}</strong>`, installed: `<strong>${i.t('guides.trouble.restore.installed')}</strong>`, integrity: `<strong>${i.t('guides.trouble.restore.integrity')}</strong>`, support: `<a href="https://help.steampowered.com/en/faqs/view/0C48-FCBD-DA71-93EB/">${i.t('guides.trouble.restore.support')}</a>` })}</li><li>${i.t('guides.trouble.restore.leftover')}</li><li>${i.t('guides.trouble.restore.launch')}</li></ol><p>${i.t('guides.trouble.restore.stop')}</p></section>
      <section id="report-problem"><h2>${i.t('guides.trouble.report.title')}</h2><p>${i.t('guides.trouble.report.intro')}</p><ul><li>${i.t('guides.trouble.report.versions')}</li><li>${i.t('guides.trouble.report.error')}</li><li>${i.t('guides.trouble.report.steps')}</li><li>${i.t('guides.trouble.report.scope')}</li><li>${i.t('guides.trouble.report.last')}</li></ul><p>${i.t('guides.trouble.report.outro', { guide: `<a href="${installHref}">${i.t('guides.trouble.report.guideLink')}</a>` })}</p></section>
    </article></div>`;

  return [
    ['/guides/', indexTitle, indexDescription, index],
    [installPath, installTitle, installDescription, install],
    [troubleshootingPath, troubleshootingTitle, troubleshootingDescription, troubleshooting],
  ];
}
