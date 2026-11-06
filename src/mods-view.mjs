import { escapeHtml as e } from '../scripts/model.mjs';
import { latestRelease } from '../scripts/store.mjs';
import { arrow, discordUrl, picture, shortDate } from './layout.mjs';

const roleText = {
  client: 'Works when only you have it',
  host: 'Only the host or server needs it',
  'all-players': 'Host and players need the same version',
  solo: 'Single-player only',
};
const dedicatedText = { supported: 'Supported', unsupported: 'Not supported' };
const settingsText = { 'host-synced': 'The host decides', 'per-player': 'Each player decides', none: 'No settings' };

export const modPath = mod => `/mods/${mod.slug}/`;
const nexusUrl = mod => mod.crossRefs.nexusModId ? `https://www.nexusmods.com/sonsoftheforest/mods/${mod.crossRefs.nexusModId}` : null;
const shortName = mod => mod.name.replace(/^Modstoke /, '');
const loaderNeed = release => {
  const modstoke = release.runsOn.find(entry => entry.loader === 'modstoke');
  const minimum = modstoke && /^>=([^ ]+)$/.exec(modstoke.range);
  return minimum ? `Loader ${minimum[1].replace(/-.*$/, '')} or newer` : modstoke ? `Loader ${modstoke.range}` : 'RedLoader';
};

// Plain-text description: blank lines split blocks, a block whose every line starts with "- " is a list.
export function renderDescription(text) {
  return text.split(/\n{2,}/).map(block => {
    const lines = block.split('\n');
    if (lines.every(line => line.startsWith('- '))) return `<ul>${lines.map(line => `<li>${e(line.slice(2))}</li>`).join('')}</ul>`;
    return `<p>${lines.map(e).join('<br>')}</p>`;
  }).join('\n');
}

function cover(mod, present, sizes, eager = false) {
  const item = mod.media[0];
  return present.has(item.path) ? picture(item.path, item.alt, { sizes, eager, width: item.width, height: item.height }) : '';
}

function modRow(mod, present) {
  const release = latestRelease(mod);
  const role = release.multiplayer.role;
  const nexus = nexusUrl(mod);
  return `<article class="mod-row" data-mod-name="${e(`${mod.name} ${mod.summary} ${mod.tags.join(' ')}`)}" data-role="${e(role || 'unknown')}">
  <a class="mod-row-image" href="${modPath(mod)}" tabindex="-1" aria-hidden="true">${cover(mod, present, '(max-width: 700px) 100vw, 320px')}</a>
  <div class="mod-row-body">
    <h2><a href="${modPath(mod)}">${e(mod.name)}</a> <span class="mono version">${e(release.version)}</span></h2>
    <p>${e(mod.summary)}</p>
    <dl class="mod-facts">
      <div><dt>Needs</dt><dd>${e(loaderNeed(release))}</dd></div>
      <div><dt>Multiplayer</dt><dd>${e(roleText[role] || 'Not stated')}</dd></div>
      <div><dt>Updated</dt><dd>${e(shortDate(release.publishedUtc))}</dd></div>
    </dl>
  </div>
  <div class="mod-row-actions">
    <a class="button" href="${modPath(mod)}">Details</a>
    ${nexus ? `<a class="text-link" href="${nexus}">Nexus page ${arrow}</a>` : ''}
  </div>
</article>`;
}

export function renderModList(catalog, present) {
  const mods = catalog.mods.filter(mod => mod.status === 'listed');
  const roles = [...new Set(mods.map(mod => latestRelease(mod).multiplayer.role || 'unknown'))];
  return `<section class="page-head wrap">
  <p class="eyebrow">Sons of the Forest</p>
  <h1>Mods</h1>
  <p class="lede">These are the mods we make ourselves. They all run on the Modstoke Loader, and for now you download them from Nexus Mods. When the Modstoke store opens, the Manager will install them for you and other authors' mods will be listed here too.</p>
</section>
<section class="wrap mods-list">
  <form class="list-tools" role="search" hidden>
    <label class="search"><span class="sr-only">Search mods</span><input id="mod-search" type="search" placeholder="Search mods" autocomplete="off"></label>
    <label><span class="sr-only">Multiplayer</span><select id="role-filter"><option value="all">Any multiplayer setup</option>${roles.map(role => `<option value="${e(role)}">${e(roleText[role] || 'Not stated')}</option>`).join('')}</select></label>
    <p id="search-status" role="status">${mods.length} mods</p>
  </form>
  <div class="mod-rows">
${mods.map(mod => modRow(mod, present)).join('\n')}
  </div>
  <p class="list-note">Every mod here needs the <a href="/tools/#loader">Modstoke Loader</a>. The <a href="/guides/install-modstoke-manager/">install guide</a> covers setting it up with the Manager.</p>
</section>`;
}

function gallery(mod, present) {
  const items = mod.media.slice(1).filter(item => present.has(item.path));
  if (!items.length) return '';
  return `<section class="gallery" aria-label="Screenshots and video">
${items.map(item => {
  const img = picture(item.path, item.alt, { sizes: '(max-width: 700px) 50vw, 260px', width: item.width, height: item.height });
  const href = item.kind === 'video' ? `https://www.youtube.com/watch?v=${item.youtubeId}` : item.path.replace(/-1600\.webp$/, '-1600.jpg');
  const label = item.kind === 'video' ? 'Watch the trailer on YouTube' : 'Open full size';
  return `<figure class="${item.kind === 'video' ? 'shot video' : 'shot'}"><a href="${e(href)}" aria-label="${e(`${label}: ${item.alt}`)}">${img}${item.kind === 'video' ? '<span class="play" aria-hidden="true"></span>' : ''}</a>${item.caption ? `<figcaption>${e(item.caption)}</figcaption>` : item.kind === 'video' ? '<figcaption>Trailer, plays on YouTube</figcaption>' : ''}</figure>`;
}).join('\n')}
</section>`;
}

function details(mod, release) {
  const nexus = nexusUrl(mod);
  const mp = release.multiplayer;
  const rows = [
    ['Version', `<span class="mono">${e(release.version)}</span>`],
    ['Status', release.channel === 'preview' ? 'Preview' : release.version.startsWith('0.') ? 'Experimental' : 'Stable'],
    ['Updated', e(shortDate(release.publishedUtc))],
    ['Needs', `<a href="/tools/#loader">Modstoke ${e(loaderNeed(release))}</a>`],
    ['Multiplayer', e(roleText[mp.role] || 'Not stated')],
    ['Dedicated server', e(dedicatedText[mp.dedicatedServer] || 'Not stated')],
    ['Settings', e(settingsText[mp.settings] || 'Not stated')],
    ['Made by', 'OpenACAI'],
    ['Licence', e(mod.license ? mod.license.replace(/-only$/, '') : 'Not stated')],
    ['Source', mod.sourceUrl ? `<a href="${e(mod.sourceUrl)}">${e(mod.sourceUrl.replace(/^https:\/\//, ''))}</a>` : 'Not public yet'],
    ['AI assistance', mod.aiAssisted ? 'Yes, disclosed on Nexus' : 'No'],
  ];
  return `<aside class="mod-details" aria-label="Details">
  <h2>Details</h2>
  <dl>${rows.map(([key, value]) => `<div><dt>${key}</dt><dd>${value}</dd></div>`).join('')}</dl>
  ${nexus ? `<a class="button button-block" href="${nexus}">Download on Nexus ${arrow}</a>` : ''}
  <p class="aside-note">One-click installs from the Manager come with the Modstoke store.</p>
</aside>`;
}

export function renderModPage(mod, present) {
  const release = latestRelease(mod);
  const nexus = nexusUrl(mod);
  return `<div class="wrap">
<nav class="crumbs" aria-label="Breadcrumb"><a href="/mods/">Mods</a><span aria-hidden="true">/</span><span>${e(shortName(mod))}</span></nav>
<section class="mod-head">
  <h1>${e(mod.name)}</h1>
  <p class="lede">${e(mod.summary)}</p>
  <p class="mod-head-meta"><span class="mono">${e(release.version)}</span> · updated ${e(shortDate(release.publishedUtc))} · by OpenACAI</p>
  <div class="actions">
    ${nexus ? `<a class="button" href="${nexus}">Download on Nexus ${arrow}</a>` : ''}
    <a class="text-link" href="#v${e(release.version)}">What's new in ${e(release.version)}</a>
  </div>
</section>
<div class="mod-layout">
  <div class="mod-main">
    <figure class="mod-cover">${cover(mod, present, '(max-width: 1000px) 100vw, 820px', true)}</figure>
    ${gallery(mod, present)}
    <section class="prose">
      <h2>About</h2>
      ${renderDescription(mod.description)}
    </section>
    ${mod.inTesting ? `<section class="testing"><h2>In testing</h2><p>${e(mod.inTesting)}</p></section>` : ''}
    <section class="prose" id="v${e(release.version)}">
      <h2>What's new in <span class="mono">${e(release.version)}</span></h2>
      <ul>${release.changelog.split('\n').map(line => `<li>${e(line)}</li>`).join('')}</ul>
    </section>
    <section class="prose">
      <h2>Install</h2>
      <ol>
        <li>Install the <a href="/tools/#loader">Modstoke Loader</a>, or let the <a href="/tools/#manager">Manager</a> do it for you.</li>
        <li>Close the game. Download ${e(shortName(mod))} from Nexus and extract its Modstoke folder next to <code>SonsOfTheForest.exe</code>.</li>
        <li>Start the game and open the Mods menu from the title screen to check it loaded.</li>
      </ol>
      <p>Back up your saves before trying a preview. If something breaks, the <a href="/guides/sons-of-the-forest-mod-troubleshooting/">troubleshooting guide</a> or our <a href="${discordUrl}">Discord</a> is the place to ask.</p>
    </section>
  </div>
  ${details(mod, release)}
</div>
</div>`;
}
