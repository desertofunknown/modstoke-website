import { escapeHtml as e } from '../scripts/model.mjs';
import { latestRelease } from '../scripts/store.mjs';
import { selectedRelease } from './release-view.mjs';
import { arrow, discordUrl, megabytes, picture, shortDate } from './layout.mjs';
import { mediaText, modPath } from './mods-view.mjs';
import { translator } from './i18n.mjs';

const hero = i => `<picture class="hero-image"><source type="image/webp" srcset="/assets/home/golden-mountains-1200.webp 1200w, /assets/home/golden-mountains-2400.webp 2400w" sizes="100vw"><img src="/assets/home/golden-mountains-2400.jpg" width="2400" height="1350" alt="${i.t('home.hero.alt')}" fetchpriority="high" decoding="async"></picture>`;

function ledger(catalog, releaseIndex, i) {
  const rows = [];
  for (const product of ['manager', 'loader']) {
    const record = selectedRelease(releaseIndex, product);
    if (record) rows.push({ date: record.publishedUtc, name: product === 'manager' ? 'Manager' : 'Loader', version: record.version, href: i.href(`/releases/#${record.releaseId}`), note: i.t(product === 'manager' ? 'home.ledger.manager' : 'home.ledger.loader') });
  }
  for (const mod of catalog.mods) {
    const release = latestRelease(mod);
    rows.push({ date: release.publishedUtc, name: mod.name.replace(/^Modstoke /, ''), version: release.version, href: i.href(`${modPath(mod)}#v${release.version}`), note: (i.own(`catalog.${mod.id}.changelog.${release.version}`) || e(release.changelog)).split('\n')[0] });
  }
  rows.sort((a, b) => b.date.localeCompare(a.date));
  return rows.map(row => `<li><time class="mono" datetime="${e(row.date)}">${e(shortDate(row.date, i))}</time><a href="${e(row.href)}">${e(row.name)} <span class="mono">${e(row.version)}</span></a><span>${row.note}</span></li>`).join('\n');
}

export function renderHome({ catalog, present, releaseIndex, showManager, showHero }, i = translator('en')) {
  const manager = releaseIndex && selectedRelease(releaseIndex, 'manager');
  const mods = catalog.mods.filter(mod => mod.status === 'listed');
  const managerArtifact = manager?.artifacts[0];
  const cards = mods.map(mod => {
    const release = latestRelease(mod);
    const item = mod.media[0];
    const image = present.has(item.path) ? picture(item.path, mediaText(i, mod, item, 'alt'), { sizes: '(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 300px', width: item.width, height: item.height }) : '';
    return `<a class="mod-card" href="${i.href(modPath(mod))}">${image}<span class="mod-card-body"><span class="mod-card-title">${e(mod.name.replace(/^Modstoke /, ''))} <span class="mono">${e(release.version)}</span></span><span>${i.own(`catalog.${mod.id}.summary`) || e(mod.summary)}</span></span></a>`;
  }).join('\n');

  return `<section class="hero${showHero ? '' : ' no-image'}">
  ${showHero ? hero(i) : ''}
  <div class="hero-text wrap">
    <p class="eyebrow">Sons of the Forest</p>
    <h1>${i.t('home.hero.title')}</h1>
    <p class="lede">${i.t('home.hero.lede')}</p>
    <div class="actions">
      ${manager ? `<a class="button" href="${i.href(`/releases/#${manager.releaseId}`)}">${i.t('home.hero.download', { version: e(manager.version) })}</a>` : ''}
      <a class="button button-quiet" href="${i.href('/mods/')}">${i.t('home.hero.seeMods')}</a>
    </div>
    ${managerArtifact ? `<p class="hero-file mono">${i.t(managerArtifact.signatureStatus === 'verified' ? 'home.hero.fileSigned' : 'home.hero.file', { size: e(megabytes(managerArtifact.size)) })}</p>` : ''}
  </div>
</section>

<section class="wrap block">
  <div class="block-head"><h2>${i.t('home.mods.title')}</h2><a class="text-link" href="${i.href('/mods/')}">${i.t('home.mods.all')} ${arrow}</a></div>
  <div class="mod-cards">
${cards}
  </div>
</section>

<section class="wrap block setup">
  <div>
    <h2>${i.t('home.setup.title')}</h2>
    <ol class="steps">
      <li><strong>${i.t('home.setup.manager.title')}</strong> ${i.t('home.setup.manager.body')}</li>
      <li><strong>${i.t('home.setup.loader.title')}</strong> ${i.t('home.setup.loader.body')}</li>
      <li><strong>${i.t('home.setup.mods.title')}</strong> ${i.t('home.setup.mods.body')}</li>
    </ol>
    <p>${i.t('home.setup.backup', { guide: `<a href="${i.href('/guides/install-modstoke-manager/')}">${i.t('home.setup.guideLink')}</a>` })}</p>
  </div>
  ${showManager ? `<figure class="setup-shot"><a href="/assets/manager-catalog.png"><picture><source type="image/webp" srcset="/assets/manager-catalog-800.webp 800w, /assets/manager-catalog-1200.webp 1200w" sizes="(max-width: 900px) 100vw, 600px"><img src="/assets/manager-catalog.png" width="1920" height="1240" alt="${i.t('home.setup.shotAlt')}" loading="lazy" decoding="async"></picture></a><figcaption>${i.t('home.setup.shotCaption')}</figcaption></figure>` : ''}
</section>

<section class="wrap block">
  <div class="block-head"><h2>${i.t('home.releases.title')}</h2><a class="text-link" href="${i.href('/releases/')}">${i.t('home.releases.all')} ${arrow}</a></div>
  <ol class="ledger">
${ledger(catalog, releaseIndex, i)}
  </ol>
</section>

<section class="wrap block together">
  <div>
    <h2>${i.t('home.together.title')}</h2>
    <p>${i.t('home.together.body', { servers: `<a href="${i.href('/servers/')}">${i.t('home.together.serversLink')}</a>`, discord: `<a href="${discordUrl}">Discord</a>`, gamhon: `<a href="${i.href('/support/#gamhon')}">GAMHON</a>` })}</p>
  </div>
  <div class="actions"><a class="button button-quiet" href="${i.href('/servers/')}">${i.t('home.together.browse')}</a><a class="button button-quiet" href="${discordUrl}">${i.t('home.together.join')} ${arrow}</a></div>
</section>`;
}
