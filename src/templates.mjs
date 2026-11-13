import { renderGuides } from './guides-view.mjs';
import { renderAppPolicies } from './app-policies-view.mjs';
import { renderServers } from './servers-view.mjs';
import { renderReleasePage } from './release-view.mjs';
import { createLayout } from './layout.mjs';
import { renderHome } from './home-view.mjs';
import { renderModList, renderModPage, modPath } from './mods-view.mjs';
import { renderTools } from './tools-view.mjs';
import { renderDocs } from './docs-view.mjs';
import { renderHosting } from './hosting-view.mjs';
import { renderSupport } from './support-view.mjs';
import { renderLegal } from './legal-view.mjs';
import { LANGUAGES, translator } from './i18n.mjs';
import { escapeHtml as e } from '../scripts/model.mjs';

const emptyCatalog = { mods: [] };

const noReleases = i => `<section class="page-head wrap">
  <p class="eyebrow">${i.t('pages.noReleases.eyebrow')}</p>
  <h1>${i.t('pages.noReleases.title')}</h1>
  <p class="lede">${i.t('pages.noReleases.lede')}</p>
</section>`;

const notFound = i => `<section class="page-head wrap not-found">
  <p class="eyebrow">404</p>
  <h1>${i.t('pages.missing.title')}</h1>
  <p class="lede">${i.t('pages.missing.lede')}</p>
  <div class="actions"><a class="button" href="${i.href('/')}">${i.t('pages.missing.home')}</a><a class="button button-quiet" href="${i.href('/mods/')}">${i.t('pages.missing.mods')}</a></div>
</section>`;

// Every page once for each language. Paths are given in English and put in the language's folder.
export function renderPages(data, assets, options = {}) {
  return LANGUAGES.flatMap(lang => renderLanguage(data, assets, options, translator(lang.code)));
}

function renderLanguage(data, assets, options, i) {
  const files = options.screenshots || [];
  const catalog = options.catalog || emptyCatalog;
  const present = options.media || new Set();
  const releaseIndex = options.releaseIndex || { latest: { manager: null, loader: null }, releases: [] };
  const layout = createLayout({ assets, releaseIndex });
  const page = (path, title, body, description) => [i.href(path), layout(path, title, body, description, i)];
  // Views written for the old layout bring no page width of their own.
  const wrapped = body => `<div class="wrap">${body}</div>`;

  const releasePage = renderReleasePage(releaseIndex, data.games[0].name, i);
  const modPages = catalog.mods
    .filter(mod => mod.status === 'listed')
    .map(mod => page(modPath(mod), e(mod.name.replace(/^Modstoke /, '')), renderModPage(mod, present, i), i.own(`catalog.${mod.id}.summary`) || e(mod.summary)));

  return [
    page('/', i.t('pages.overview'), renderHome({ catalog, present, releaseIndex, showManager: files.includes('manager-catalog.png'), showHero: files.includes('home/golden-mountains-2400.jpg') }, i)),
    page('/mods/', i.t('pages.mods'), renderModList(catalog, present, i)),
    ...modPages,
    page('/tools/', i.t('pages.tools'), renderTools({ releaseIndex, files, loaderShot: options.toolShots?.includes('loader-mods-menu') }, i)),
    page('/docs/', i.t('pages.docs'), renderDocs({ projectKnowledge: options.projectKnowledge, releaseIndex }, i)),
    page('/releases/', i.t('pages.releases'), releasePage ? wrapped(releasePage) : noReleases(i)),
    page('/servers/', i.t('pages.servers'), wrapped(renderServers(i))),
    page('/hosting/', i.t('pages.hosting'), renderHosting(i)),
    page('/support/', i.t('pages.support'), renderSupport(i)),
    ...[...renderGuides(options.releaseIndex, i), ...renderAppPolicies(i), ...renderLegal(i)].map(([path, title, description, body]) => page(path, title, wrapped(body), description)),
    page('/404/', i.t('pages.notFound'), notFound(i)),
  ];
}
