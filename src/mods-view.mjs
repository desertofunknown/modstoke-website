import { escapeHtml as e } from '../scripts/model.mjs';
import { latestRelease } from '../scripts/store.mjs';
import { arrow, discordUrl, picture, shortDate } from './layout.mjs';
import { translator } from './i18n.mjs';

const roleKeys = { client: 'client', host: 'host', 'all-players': 'allPlayers', solo: 'solo' };
const dedicatedKeys = { supported: 'supported', unsupported: 'unsupported' };
const settingsKeys = { 'host-synced': 'hostSynced', 'per-player': 'perPlayer', none: 'none' };
const word = (i, group, keys, value) => i.t(`mods.${group}.${keys[value] || 'notStated'}`);
const own = (i, mod, field) => i.own(`catalog.${mod.id}.${field}`);
// A picture's alt text or caption, escaped; translations name the picture by its file.
export const mediaText = (i, mod, item, field) => i.own(`catalog.${mod.id}.media.${item.path.split('/').pop().replace(/-1600\.webp$/, '')}.${field}`) || e(item[field]);

export const modPath = mod => `/mods/${mod.slug}/`;
const nexusUrl = mod => mod.crossRefs.nexusModId ? `https://www.nexusmods.com/sonsoftheforest/mods/${mod.crossRefs.nexusModId}` : null;
const shortName = mod => mod.name.replace(/^Modstoke /, '');
// Escaped text, ready to put in a page.
const loaderNeed = (release, i) => {
  const modstoke = release.runsOn.find(entry => entry.loader === 'modstoke');
  const minimum = modstoke && /^>=([^ ]+)$/.exec(modstoke.range);
  return minimum ? i.t('mods.loaderOrNewer', { version: e(minimum[1].replace(/-.*$/, '')) }) : modstoke ? i.t('mods.loaderRange', { range: e(modstoke.range) }) : 'RedLoader';
};

// Plain-text description: blank lines split blocks, a block whose every line starts with "- " is a list.
// Text that is already escaped (a translation from i.own) is passed with escaped set.
export function renderDescription(text, escaped = false) {
  const esc = escaped ? line => line : e;
  return text.split(/\n{2,}/).map(block => {
    const lines = block.split('\n');
    if (lines.every(line => line.startsWith('- '))) return `<ul>${lines.map(line => `<li>${esc(line.slice(2))}</li>`).join('')}</ul>`;
    return `<p>${lines.map(esc).join('<br>')}</p>`;
  }).join('\n');
}

function cover(mod, present, i, sizes, eager = false) {
  const item = mod.media[0];
  return present.has(item.path) ? picture(item.path, mediaText(i, mod, item, 'alt'), { sizes, eager, width: item.width, height: item.height }) : '';
}

function modRow(mod, present, i) {
  const release = latestRelease(mod);
  const role = release.multiplayer.role;
  const nexus = nexusUrl(mod);
  const summary = own(i, mod, 'summary');
  return `<article class="mod-row" data-mod-name="${e(`${mod.name} ${mod.summary} ${mod.tags.join(' ')}`)}${summary ? ` ${summary}` : ''}" data-role="${e(role || 'unknown')}">
  <a class="mod-row-image" href="${i.href(modPath(mod))}" tabindex="-1" aria-hidden="true">${cover(mod, present, i, '(max-width: 700px) 100vw, 320px')}</a>
  <div class="mod-row-body">
    <h2><a href="${i.href(modPath(mod))}">${e(mod.name)}</a> <span class="mono version">${e(release.version)}</span></h2>
    <p>${summary || e(mod.summary)}</p>
    <dl class="mod-facts">
      <div><dt>${i.t('mods.label.needs')}</dt><dd>${loaderNeed(release, i)}</dd></div>
      <div><dt>${i.t('mods.label.multiplayer')}</dt><dd>${word(i, 'role', roleKeys, role)}</dd></div>
      <div><dt>${i.t('mods.label.updated')}</dt><dd>${e(shortDate(release.publishedUtc, i))}</dd></div>
    </dl>
  </div>
  <div class="mod-row-actions">
    <a class="button" href="${i.href(modPath(mod))}">${i.t('mods.list.details')}</a>
    ${nexus ? `<a class="text-link" href="${nexus}">${i.t('mods.list.nexusPage')} ${arrow}</a>` : ''}
  </div>
</article>`;
}

export function renderModList(catalog, present, i = translator('en')) {
  const mods = catalog.mods.filter(mod => mod.status === 'listed');
  const roles = [...new Set(mods.map(mod => latestRelease(mod).multiplayer.role || 'unknown'))];
  return `<section class="page-head wrap">
  <p class="eyebrow">Sons of the Forest</p>
  <h1>${i.t('mods.list.title')}</h1>
  <p class="lede">${i.t('mods.list.lede')}</p>
</section>
<section class="wrap mods-list">
  <form class="list-tools" role="search" hidden>
    <label class="search"><span class="sr-only">${i.t('mods.list.search')}</span><input id="mod-search" type="search" placeholder="${i.t('mods.list.search')}" autocomplete="off"></label>
    <label><span class="sr-only">${i.t('mods.label.multiplayer')}</span><select id="role-filter"><option value="all">${i.t('mods.list.anyMultiplayer')}</option>${roles.map(role => `<option value="${e(role)}">${word(i, 'role', roleKeys, role)}</option>`).join('')}</select></label>
    <p id="search-status" role="status">${i.count('mods.list.count', mods.length)}</p>
  </form>
  <div class="mod-rows">
${mods.map(mod => modRow(mod, present, i)).join('\n')}
  </div>
  <p class="list-note">${i.t('mods.list.note', { loader: `<a href="${i.href('/tools/#loader')}">${i.t('mods.loaderLink')}</a>`, guide: `<a href="${i.href('/guides/install-modstoke-manager/')}">${i.t('mods.list.installGuide')}</a>` })}</p>
</section>`;
}

function gallery(mod, present, i) {
  const items = mod.media.slice(1).filter(item => present.has(item.path));
  if (!items.length) return '';
  return `<section class="gallery" aria-label="${i.t('mods.page.gallery')}">
${items.map(item => {
  const alt = mediaText(i, mod, item, 'alt');
  const img = picture(item.path, alt, { sizes: '(max-width: 700px) 50vw, 260px', width: item.width, height: item.height });
  const href = item.kind === 'video' ? `https://www.youtube.com/watch?v=${item.youtubeId}` : item.path.replace(/-1600\.webp$/, '-1600.jpg');
  const label = item.kind === 'video' ? i.t('mods.page.watchTrailer') : i.t('mods.page.openFullSize');
  return `<figure class="${item.kind === 'video' ? 'shot video' : 'shot'}"><a href="${e(href)}" aria-label="${label}: ${alt}">${img}${item.kind === 'video' ? '<span class="play" aria-hidden="true"></span>' : ''}</a>${item.caption ? `<figcaption>${mediaText(i, mod, item, 'caption')}</figcaption>` : item.kind === 'video' ? `<figcaption>${i.t('mods.page.trailerCaption')}</figcaption>` : ''}</figure>`;
}).join('\n')}
</section>`;
}

function details(mod, release, i) {
  const nexus = nexusUrl(mod);
  const mp = release.multiplayer;
  const rows = [
    [i.t('mods.label.version'), `<span class="mono">${e(release.version)}</span>`],
    [i.t('mods.label.status'), i.t(release.channel === 'preview' ? 'mods.status.preview' : release.version.startsWith('0.') ? 'mods.status.experimental' : 'mods.status.stable')],
    [i.t('mods.label.updated'), e(shortDate(release.publishedUtc, i))],
    [i.t('mods.label.needs'), `<a href="${i.href('/tools/#loader')}">${i.t('mods.needsModstoke', { need: loaderNeed(release, i) })}</a>`],
    [i.t('mods.label.multiplayer'), word(i, 'role', roleKeys, mp.role)],
    [i.t('mods.label.dedicatedServer'), word(i, 'dedicated', dedicatedKeys, mp.dedicatedServer)],
    [i.t('mods.label.settings'), word(i, 'settings', settingsKeys, mp.settings)],
    [i.t('mods.label.madeBy'), 'OpenACAI'],
    [i.t('mods.label.licence'), mod.license ? e(mod.license.replace(/-only$/, '')) : i.t('mods.notStated')],
    [i.t('mods.label.source'), mod.sourceUrl ? `<a href="${e(mod.sourceUrl)}">${e(mod.sourceUrl.replace(/^https:\/\//, ''))}</a>` : i.t('mods.page.sourceNotPublic')],
    [i.t('mods.label.aiAssistance'), i.t(mod.aiAssisted ? 'mods.page.aiYes' : 'mods.page.aiNo')],
  ];
  return `<aside class="mod-details" aria-label="${i.t('mods.page.details')}">
  <h2>${i.t('mods.page.details')}</h2>
  <dl>${rows.map(([key, value]) => `<div><dt>${key}</dt><dd>${value}</dd></div>`).join('')}</dl>
  ${nexus ? `<a class="button button-block" href="${nexus}">${i.t('mods.page.downloadOnNexus')} ${arrow}</a>` : ''}
  <p class="aside-note">${i.t('mods.page.storeNote')}</p>
</aside>`;
}

export function renderModPage(mod, present, i = translator('en')) {
  const release = latestRelease(mod);
  const nexus = nexusUrl(mod);
  const description = own(i, mod, 'description');
  const changelog = own(i, mod, `changelog.${release.version}`);
  return `<div class="wrap">
<nav class="crumbs" aria-label="${i.t('mods.page.breadcrumb')}"><a href="${i.href('/mods/')}">${i.t('mods.list.title')}</a><span aria-hidden="true">/</span><span>${e(shortName(mod))}</span></nav>
<section class="mod-head">
  <h1>${e(mod.name)}</h1>
  <p class="lede">${own(i, mod, 'summary') || e(mod.summary)}</p>
  <p class="mod-head-meta">${i.t('mods.page.meta', { version: `<span class="mono">${e(release.version)}</span>`, date: e(shortDate(release.publishedUtc, i)) })}</p>
  <div class="actions">
    ${nexus ? `<a class="button" href="${nexus}">${i.t('mods.page.downloadOnNexus')} ${arrow}</a>` : ''}
    <a class="text-link" href="#v${e(release.version)}">${i.t('mods.page.whatsNew', { version: e(release.version) })}</a>
  </div>
</section>
<div class="mod-layout">
  <div class="mod-main">
    <figure class="mod-cover">${cover(mod, present, i, '(max-width: 1000px) 100vw, 820px', true)}</figure>
    ${gallery(mod, present, i)}
    <section class="prose">
      <h2>${i.t('mods.page.about')}</h2>
      ${description ? renderDescription(description, true) : renderDescription(mod.description)}
    </section>
    ${mod.inTesting ? `<section class="testing"><h2>${i.t('mods.page.inTesting')}</h2><p>${own(i, mod, 'inTesting') || e(mod.inTesting)}</p></section>` : ''}
    <section class="prose" id="v${e(release.version)}">
      <h2>${i.t('mods.page.whatsNew', { version: `<span class="mono">${e(release.version)}</span>` })}</h2>
      <ul>${(changelog ? changelog.split('\n') : release.changelog.split('\n').map(e)).map(line => `<li>${line}</li>`).join('')}</ul>
    </section>
    <section class="prose">
      <h2>${i.t('mods.page.install')}</h2>
      <ol>
        <li>${i.t('mods.page.installStep1', { loader: `<a href="${i.href('/tools/#loader')}">${i.t('mods.loaderLink')}</a>`, manager: `<a href="${i.href('/tools/#manager')}">${i.t('mods.page.managerLink')}</a>` })}</li>
        <li>${i.t('mods.page.installStep2', { name: e(shortName(mod)), exe: '<code>SonsOfTheForest.exe</code>' })}</li>
        <li>${i.t('mods.page.installStep3')}</li>
      </ol>
      <p>${i.t('mods.page.installNote', { guide: `<a href="${i.href('/guides/sons-of-the-forest-mod-troubleshooting/')}">${i.t('mods.page.troubleshootingGuide')}</a>`, discord: `<a href="${discordUrl}">Discord</a>` })}</p>
    </section>
  </div>
  ${details(mod, release, i)}
</div>
</div>`;
}
