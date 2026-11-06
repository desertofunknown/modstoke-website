import { escapeHtml as e } from '../scripts/model.mjs';
import { latestRelease } from '../scripts/store.mjs';
import { selectedRelease } from './release-view.mjs';
import { arrow, discordUrl, megabytes, picture, shortDate } from './layout.mjs';
import { modPath } from './mods-view.mjs';

const hero = `<picture class="hero-image"><source type="image/webp" srcset="/assets/home/golden-mountains-1200.webp 1200w, /assets/home/golden-mountains-2400.webp 2400w" sizes="100vw"><img src="/assets/home/golden-mountains-2400.jpg" width="2400" height="1350" alt="Evening light on the snowy peaks above the island's pine forest" fetchpriority="high" decoding="async"></picture>`;

function ledger(catalog, releaseIndex) {
  const rows = [];
  for (const product of ['manager', 'loader']) {
    const record = selectedRelease(releaseIndex, product);
    if (record) rows.push({ date: record.publishedUtc, name: product === 'manager' ? 'Manager' : 'Loader', version: record.version, href: `/releases/#${record.releaseId}`, note: product === 'manager' ? 'Windows installer, signed' : 'Loader and SDK, preview' });
  }
  for (const mod of catalog.mods) {
    const release = latestRelease(mod);
    rows.push({ date: release.publishedUtc, name: mod.name.replace(/^Modstoke /, ''), version: release.version, href: `${modPath(mod)}#v${release.version}`, note: release.changelog.split('\n')[0] });
  }
  rows.sort((a, b) => b.date.localeCompare(a.date));
  return rows.map(row => `<li><time class="mono" datetime="${e(row.date)}">${e(shortDate(row.date))}</time><a href="${e(row.href)}">${e(row.name)} <span class="mono">${e(row.version)}</span></a><span>${e(row.note)}</span></li>`).join('\n');
}

export function renderHome({ catalog, present, releaseIndex, showManager, showHero }) {
  const manager = releaseIndex && selectedRelease(releaseIndex, 'manager');
  const mods = catalog.mods.filter(mod => mod.status === 'listed');
  const managerArtifact = manager?.artifacts[0];
  const cards = mods.map(mod => {
    const release = latestRelease(mod);
    const item = mod.media[0];
    const image = present.has(item.path) ? picture(item.path, item.alt, { sizes: '(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 300px', width: item.width, height: item.height }) : '';
    return `<a class="mod-card" href="${modPath(mod)}">${image}<span class="mod-card-body"><span class="mod-card-title">${e(mod.name.replace(/^Modstoke /, ''))} <span class="mono">${e(release.version)}</span></span><span>${e(mod.summary)}</span></span></a>`;
  }).join('\n');

  return `<section class="hero${showHero ? '' : ' no-image'}">
  ${showHero ? hero : ''}
  <div class="hero-text wrap">
    <p class="eyebrow">Sons of the Forest</p>
    <h1>Mods that feel like part of the game.</h1>
    <p class="lede">Modstoke is a mod loader, a desktop manager and, so far, four mods of our own: Client, Admin, Terraforming and Virginia. It's all free, made by OpenACAI, a nonprofit.</p>
    <div class="actions">
      ${manager ? `<a class="button" href="/releases/#${e(manager.releaseId)}">Download Manager ${e(manager.version)}</a>` : ''}
      <a class="button button-quiet" href="/mods/">See the mods</a>
    </div>
    ${managerArtifact ? `<p class="hero-file mono">Windows · ${e(megabytes(managerArtifact.size))}${managerArtifact.signatureStatus === 'verified' ? ' · signed by OpenACAI' : ''}</p>` : ''}
  </div>
</section>

<section class="wrap block">
  <div class="block-head"><h2>Our mods</h2><a class="text-link" href="/mods/">All mods ${arrow}</a></div>
  <div class="mod-cards">
${cards}
  </div>
</section>

<section class="wrap block setup">
  <div>
    <h2>Getting set up</h2>
    <ol class="steps">
      <li><strong>Install the Manager.</strong> Point it at your Sons of the Forest folder and it finds your game and saves.</li>
      <li><strong>Add the Loader.</strong> The Manager installs it. It puts a Mods menu on the title and pause screens.</li>
      <li><strong>Pick your mods.</strong> Most people want Client. If you host, add Admin as well.</li>
    </ol>
    <p>Back up your saves first. The <a href="/guides/install-modstoke-manager/">install guide</a> goes through it step by step.</p>
  </div>
  ${showManager ? `<figure class="setup-shot"><a href="/assets/manager-catalog.png"><picture><source type="image/webp" srcset="/assets/manager-catalog-800.webp 800w, /assets/manager-catalog-1200.webp 1200w" sizes="(max-width: 900px) 100vw, 600px"><img src="/assets/manager-catalog.png" width="1920" height="1240" alt="Modstoke Manager showing its mod list for Sons of the Forest" loading="lazy" decoding="async"></picture></a><figcaption>The Manager's mod list. The entries shown come from SOTF Mods, not from this site.</figcaption></figure>` : ''}
</section>

<section class="wrap block">
  <div class="block-head"><h2>Latest releases</h2><a class="text-link" href="/releases/">All releases ${arrow}</a></div>
  <ol class="ledger">
${ledger(catalog, releaseIndex)}
  </ol>
</section>

<section class="wrap block together">
  <div>
    <h2>Play together</h2>
    <p>The <a href="/servers/">server list</a> shows Sons of the Forest worlds whose hosts chose to list them, with the mods each one needs. Our <a href="${discordUrl}">Discord</a> is where to find a crew, report bugs and hear about new builds first. It's all part of <a href="/support/#gamhon">GAMHON</a>, OpenACAI's program for mental health and social connection through games.</p>
  </div>
  <div class="actions"><a class="button button-quiet" href="/servers/">Browse servers</a><a class="button button-quiet" href="${discordUrl}">Join the Discord ${arrow}</a></div>
</section>`;
}
