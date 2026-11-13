import { renderProjectKnowledge } from './project-knowledge-view.mjs';
import { translator } from './i18n.mjs';

export function renderDocs({ projectKnowledge, releaseIndex }, i = translator('en')) {
  const knowledge = renderProjectKnowledge(projectKnowledge, releaseIndex, i);
  const steps = {
    folder: { path: '<code>Modstoke/Mods/&lt;package&gt;/</code>', legacy: '<code>OpenACAI/Mods/</code>' },
    entry: { first: '<code>openacai.mod.json</code>', second: '<code>openacai.json</code>', third: '<code>manifest.json</code>' },
  };
  const link = (path, key) => `<a href="${i.href(path)}">${i.t(key)}</a>`;
  return `<section class="page-head wrap">
  <p class="eyebrow">${i.t('docs.eyebrow')}</p>
  <h1>${i.t('docs.title')}</h1>
  <p class="lede">${i.t('docs.lede', { guides: link('/guides/', 'docs.guidesLink') })}</p>
</section>
<div class="wrap docs">
  <nav class="docs-nav" aria-label="${i.t('docs.onThisPage')}">
    <a href="#project">${i.t('docs.nav.project')}</a>
    <a href="#players">${i.t('docs.nav.players')}</a>
    <a href="#compatibility">${i.t('docs.nav.compatibility')}</a>
    <a href="#authors">${i.t('docs.nav.authors')}</a>
    ${knowledge ? `<a href="#sdk-development">${i.t('docs.nav.sdk')}</a><a href="#play-together">${i.t('docs.nav.play')}</a><a href="#tithewood">Tithewood</a>` : ''}
    <a href="#downloads">${i.t('docs.nav.downloads')}</a>
  </nav>
  <div class="docs-body">
    <section id="project">
      <h2>${i.t('docs.project.title')}</h2>
      <p>${i.t('docs.project.about')}</p>
      <p>${i.t('docs.project.endnight')}</p>
    </section>
    <section id="players">
      <h2>${i.t('docs.players.title')}</h2>
      <p>${i.t('docs.players.start', { manager: link('/tools/#manager', 'docs.players.managerLink'), loader: link('/tools/#loader', 'docs.players.loaderLink'), mods: link('/mods/', 'docs.players.modsLink') })}</p>
      <p>${i.t('docs.players.guides', { install: link('/guides/install-modstoke-manager/', 'docs.players.installGuide'), troubleshooting: link('/guides/sons-of-the-forest-mod-troubleshooting/', 'docs.players.troubleshootingGuide') })}</p>
    </section>
    <section id="compatibility">
      <h2>${i.t('docs.compatibility.title')}</h2>
      <div class="compat-row"><strong>Sons of the Forest</strong><span>${i.t('docs.compatibility.supported')}</span></div>
      <p>${i.t('docs.compatibility.note')}</p>
    </section>
    <section id="authors">
      <h2>${i.t('docs.authors.title')}</h2>
      <p>${i.t('docs.authors.intro')}</p>
      <ol class="checklist">
        ${['build', 'folder', 'entry', 'test', 'ship'].map(step => `<li><strong>${i.t(`docs.authors.${step}.title`)}</strong> ${i.t(`docs.authors.${step}.text`, steps[step])}</li>`).join('')}
      </ol>
    </section>
    ${knowledge}
    <section id="downloads">
      <h2>${i.t('docs.downloads.title')}</h2>
      <p>${i.t('docs.downloads.releases', { releases: link('/releases/', 'docs.downloads.releasesLink') })}</p>
      <p>${i.t('docs.downloads.checksum')}</p>
    </section>
  </div>
</div>`;
}
