import { escapeHtml as e } from '../scripts/model.mjs';
import { selectedRelease } from './release-view.mjs';
import { arrow, megabytes, picture, shortDate } from './layout.mjs';

const trailers = { manager: '5t5raSOat9U', loader: 'x-sJDUwtgIo' };

function trailer(id, name, files) {
  if (!files.includes(`${id}-trailer.jpg`)) return '';
  return `<figure class="shot video wide"><a href="https://www.youtube.com/watch?v=${trailers[id]}" aria-label="Watch the ${name} trailer on YouTube"><picture><source type="image/webp" srcset="/assets/${id}-trailer-800.webp 800w, /assets/${id}-trailer.webp 1280w" sizes="(max-width: 900px) 100vw, 560px"><img src="/assets/${id}-trailer.jpg" width="1280" height="720" alt="Title card from the ${name} trailer" loading="lazy" decoding="async"></picture><span class="play" aria-hidden="true"></span></a><figcaption>${name} trailer, plays on YouTube</figcaption></figure>`;
}

function fileLine(record) {
  if (!record) return '<p class="file-line">No public download yet.</p>';
  const artifact = record.artifacts[0];
  const signed = artifact.signatureStatus === 'verified' ? 'signed' : 'unsigned';
  return `<p class="file-line"><span class="mono">${e(record.version)}</span> · ${e(shortDate(record.publishedUtc))} · ${e(megabytes(artifact.size))} · ${signed}${record.channel === 'preview' ? ' · preview' : ''}</p>`;
}

export function renderTools({ releaseIndex, files, loaderShot }) {
  const manager = releaseIndex && selectedRelease(releaseIndex, 'manager');
  const loader = releaseIndex && selectedRelease(releaseIndex, 'loader');
  return `<section class="page-head wrap">
  <p class="eyebrow">Tools</p>
  <h1>Manager, Loader and SDK</h1>
  <p class="lede">Players need the Manager and the Loader. Mod authors build against the SDK, which comes with the Loader.</p>
</section>

<section class="wrap tool" id="manager">
  <div class="tool-text">
    <h2>Modstoke Manager</h2>
    <p>A Windows app for your Sons of the Forest mods. It finds your game, installs the Loader and keeps your mods in one place. You can browse SOTF Mods and Nexus Mods from it, find a server to join or set up your own dedicated server.</p>
    <p>When the Modstoke store opens, the Manager is how you'll install from it: it checks every file against the signed catalog before anything is extracted.</p>
    ${fileLine(manager)}
    <div class="actions">${manager ? `<a class="button" href="/releases/#${e(manager.releaseId)}">Download Manager</a>` : ''}<a class="text-link" href="/guides/install-modstoke-manager/">Install guide ${arrow}</a></div>
  </div>
  <div class="tool-media">${trailer('manager', 'Manager', files)}</div>
</section>

<section class="wrap tool" id="loader">
  <div class="tool-text">
    <h2>Modstoke Loader</h2>
    <p>The loader behind every Modstoke mod. Install it once, then add the mods you want. It puts a Mods menu on the title and pause screens, where each mod keeps its settings, and it ships with the .NET runtime it needs.</p>
    <p>Older RedLoader and BepInEx mods keep working alongside it.</p>
    ${fileLine(loader)}
    <div class="actions">${loader ? `<a class="button button-quiet" href="/releases/#${e(loader.releaseId)}">Loader on Releases</a>` : ''}<a class="text-link" href="https://www.nexusmods.com/sonsoftheforest/mods/438">Nexus page ${arrow}</a></div>
  </div>
  <div class="tool-media">${trailer('loader', 'Loader', files)}${loaderShot ? `<figure class="shot wide">${picture('/assets/tools/loader-mods-menu-1600.webp', "The Loader's Mods menu in game", { sizes: '(max-width: 900px) 100vw, 560px' })}<figcaption>The Mods menu the Loader adds to the game</figcaption></figure>` : ''}</div>
</section>

<section class="wrap tool" id="sdk">
  <div class="tool-text">
    <h2>Modstoke SDK</h2>
    <p>The interfaces mods build against. They ship inside the Loader, so there's nothing separate to download: reference the Loader assembly from your project and test against the same Loader version your players run.</p>
    <p>The <a href="/docs/#authors">creator notes</a> cover package layout, the manifest and testing on a separate copy of the game.</p>
  </div>
</section>`;
}
