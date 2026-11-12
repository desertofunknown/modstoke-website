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

const emptyCatalog = { mods: [] };

const noReleases = `<section class="page-head wrap">
  <p class="eyebrow">Releases</p>
  <h1>No downloads yet</h1>
  <p class="lede">Nothing has been published here yet. Each release will list its version, changes, compatibility and file hashes.</p>
</section>`;

const notFound = `<section class="page-head wrap not-found">
  <p class="eyebrow">404</p>
  <h1>Nothing here.</h1>
  <p class="lede">That page doesn't exist, or it moved.</p>
  <div class="actions"><a class="button" href="/">Back to Modstoke</a><a class="button button-quiet" href="/mods/">See the mods</a></div>
</section>`;

export function renderPages(data, assets, options = {}) {
  const files = options.screenshots || [];
  const catalog = options.catalog || emptyCatalog;
  const present = options.media || new Set();
  const releaseIndex = options.releaseIndex || { latest: { manager: null, loader: null }, releases: [] };
  const layout = createLayout({ assets, releaseIndex });
  const page = (path, title, body, description) => [path, layout(path, title, body, description)];
  // Views written for the old layout bring no page width of their own.
  const wrapped = body => `<div class="wrap">${body}</div>`;

  const releasePage = renderReleasePage(releaseIndex, data.games[0].name);
  const modPages = catalog.mods
    .filter(mod => mod.status === 'listed')
    .map(mod => page(modPath(mod), mod.name.replace(/^Modstoke /, ''), renderModPage(mod, present), mod.summary));

  return [
    page('/', 'Overview', renderHome({ catalog, present, releaseIndex, showManager: files.includes('manager-catalog.png'), showHero: files.includes('home/golden-mountains-2400.jpg') })),
    page('/mods/', 'Mods', renderModList(catalog, present)),
    ...modPages,
    page('/tools/', 'Tools', renderTools({ releaseIndex, files, loaderShot: options.toolShots?.includes('loader-mods-menu') })),
    page('/docs/', 'Docs', renderDocs({ projectKnowledge: options.projectKnowledge })),
    page('/releases/', 'Releases', releasePage ? wrapped(releasePage) : noReleases),
    page('/servers/', 'Community servers', wrapped(renderServers())),
    page('/hosting/', 'Server hosting', renderHosting()),
    page('/support/', 'Support Modstoke', renderSupport()),
    ...[...renderGuides(options.releaseIndex), ...renderAppPolicies(), ...renderLegal()].map(([path, title, description, body]) => page(path, title, wrapped(body), description)),
    page('/404/', 'Page not found', notFound),
  ];
}
