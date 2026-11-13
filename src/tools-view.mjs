import { escapeHtml as e } from '../scripts/model.mjs';
import { selectedRelease } from './release-view.mjs';
import { arrow, megabytes, picture, shortDate } from './layout.mjs';
import { translator } from './i18n.mjs';

const trailers = { manager: '5t5raSOat9U', loader: 'x-sJDUwtgIo' };

function trailer(id, name, files, i) {
  if (!files.includes(`${id}-trailer.jpg`)) return '';
  return `<figure class="shot video wide"><a href="https://www.youtube.com/watch?v=${trailers[id]}" aria-label="${i.t('tools.trailer.watch', { name })}"><picture><source type="image/webp" srcset="/assets/${id}-trailer-800.webp 800w, /assets/${id}-trailer.webp 1280w" sizes="(max-width: 900px) 100vw, 560px"><img src="/assets/${id}-trailer.jpg" width="1280" height="720" alt="${i.t('tools.trailer.alt', { name })}" loading="lazy" decoding="async"></picture><span class="play" aria-hidden="true"></span></a><figcaption>${i.t('tools.trailer.caption', { name })}</figcaption></figure>`;
}

function fileLine(record, i) {
  if (!record) return `<p class="file-line">${i.t('tools.file.none')}</p>`;
  const artifact = record.artifacts[0];
  const signed = i.t(artifact.signatureStatus === 'verified' ? 'tools.file.signed' : 'tools.file.unsigned');
  return `<p class="file-line"><span class="mono">${e(record.version)}</span> · ${e(shortDate(record.publishedUtc, i))} · ${e(megabytes(artifact.size))} · ${signed}${record.channel === 'preview' ? ` · ${i.t('tools.file.preview')}` : ''}</p>`;
}

export function renderTools({ releaseIndex, files, loaderShot }, i = translator('en')) {
  const manager = releaseIndex && selectedRelease(releaseIndex, 'manager');
  const loader = releaseIndex && selectedRelease(releaseIndex, 'loader');
  const shot = picture('/assets/tools/loader-mods-menu-1600.webp', i.t('tools.loader.shotAlt'), { sizes: '(max-width: 900px) 100vw, 560px' });
  return `<section class="page-head wrap">
  <p class="eyebrow">${i.t('tools.eyebrow')}</p>
  <h1>${i.t('tools.title')}</h1>
  <p class="lede">${i.t('tools.lede')}</p>
</section>

<section class="wrap tool" id="manager">
  <div class="tool-text">
    <h2>Modstoke Manager</h2>
    <p>${i.t('tools.manager.what')}</p>
    <p>${i.t('tools.manager.store')}</p>
    ${fileLine(manager, i)}
    <div class="actions">${manager ? `<a class="button" href="${i.href(`/releases/#${manager.releaseId}`)}">${i.t('tools.manager.download')}</a>` : ''}<a class="text-link" href="${i.href('/guides/install-modstoke-manager/')}">${i.t('tools.installGuide')} ${arrow}</a></div>
  </div>
  <div class="tool-media">${trailer('manager', 'Manager', files, i)}</div>
</section>

<section class="wrap tool" id="loader">
  <div class="tool-text">
    <h2>Modstoke Loader</h2>
    <p>${i.t('tools.loader.what')}</p>
    <p>${i.t('tools.loader.legacy')}</p>
    ${fileLine(loader, i)}
    <div class="actions">${loader ? `<a class="button button-quiet" href="${i.href(`/releases/#${loader.releaseId}`)}">${i.t('tools.loader.onReleases')}</a>` : ''}<a class="text-link" href="https://www.nexusmods.com/sonsoftheforest/mods/438">${i.t('tools.loader.nexus')} ${arrow}</a></div>
  </div>
  <div class="tool-media">${trailer('loader', 'Loader', files, i)}${loaderShot ? `<figure class="shot wide">${shot}<figcaption>${i.t('tools.loader.shotCaption')}</figcaption></figure>` : ''}</div>
</section>

<section class="wrap tool" id="sdk">
  <div class="tool-text">
    <h2>Modstoke SDK</h2>
    <p>${i.t('tools.sdk.what')}</p>
    <p>${i.t('tools.sdk.notes', { notes: `<a href="${i.href('/docs/#authors')}">${i.t('tools.sdk.notesLink')}</a>` })}</p>
  </div>
</section>`;
}
