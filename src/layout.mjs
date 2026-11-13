import { escapeHtml as e } from '../scripts/model.mjs';
import { seoHead } from './seo.mjs';
import { selectedRelease } from './release-view.mjs';
import { LANGUAGES, translator } from './i18n.mjs';

export const discordUrl = 'https://discord.gg/T2Tjh5ECS';
// Where a rented server is run from, and where a beta code is used.
export const panelUrl = 'https://panel.modstoke.com/';
export const arrow = '<span aria-hidden="true">↗</span>';
export const mark = '<svg viewBox="0 0 40 30" aria-hidden="true"><path d="M0 30V0h8l12 17L32 0h8v30H29V16l-9 12-9-12v14z" fill="currentColor"/></svg>';

const nav = [['/mods/', 'mods'], ['/tools/', 'tools'], ['/servers/', 'servers'], ['/hosting/', 'hosting'], ['/guides/', 'guides'], ['/docs/', 'docs'], ['/releases/', 'releases']];

export function megabytes(bytes) {
  return `${(bytes / 1e6).toFixed(bytes < 1e7 ? 1 : 0)} MB`;
}

// 6 Nov 2026, from a UTC timestamp. English is written out so the build doesn't depend on the host
// locale; other languages use their own order and month names.
export function shortDate(utc, i) {
  if (i && i.code !== 'en') return new Intl.DateTimeFormat(i.code, { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(utc.slice(0, 10) + 'T00:00:00Z'));
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const [year, month, day] = utc.slice(0, 10).split('-').map(Number);
  return `${day} ${months[month - 1]} ${year}`;
}

// Images are referenced by their 1600 px WebP; an 800 px WebP and a 1600 px JPEG sit next to it.
// alt comes escaped, like all text from the language files.
export function picture(path, alt, { sizes = '100vw', eager = false, width = 1600, height = 900 } = {}) {
  const base = path.replace(/-1600\.webp$/, '');
  return `<picture><source type="image/webp" srcset="${e(base)}-800.webp 800w, ${e(base)}-1600.webp 1600w" sizes="${e(sizes)}">`
    + `<img src="${e(base)}-1600.jpg" width="${width}" height="${height}" alt="${alt}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"></picture>`;
}

// lang.js, the first script in every page's head, runs before the page is drawn: a person who
// picked a language in the menu gets it on every page, and a first visit to an English address
// gets the browser's language, or when the browser's is none of ours, the one of the country
// Cloudflare places them in. A link into another language is followed as given, and crawlers are
// left on the page they asked for; the hreflang links tell search engines about
// the others. It is a file rather than inline so the site's script-src 'self' policy allows it.
const REGIONS = { BR: 'pt', PT: 'pt', AO: 'pt', MZ: 'pt', DE: 'de', AT: 'de', LI: 'de', FR: 'fr', BE: 'fr', LU: 'fr', MC: 'fr', SN: 'fr', CI: 'fr',
  ES: 'es', MX: 'es', AR: 'es', CO: 'es', CL: 'es', PE: 'es', VE: 'es', EC: 'es', GT: 'es', CU: 'es', BO: 'es', DO: 'es', HN: 'es', PY: 'es',
  SV: 'es', NI: 'es', CR: 'es', PA: 'es', UY: 'es', IT: 'it', SM: 'it', PL: 'pl', CZ: 'cs', RU: 'ru', BY: 'ru', KZ: 'ru', KG: 'ru', TR: 'tr',
  SE: 'sv', FI: 'fi', JP: 'ja', KR: 'ko', CN: 'zh-Hans', SG: 'zh-Hans', TW: 'zh-Hant', HK: 'zh-Hant', MO: 'zh-Hant' };
const SLUGS = Object.fromEntries(LANGUAGES.map(l => [l.code, l.slug]));

export function languageScript() {
  return `(function(){var L=${JSON.stringify(SLUGS)},R=${JSON.stringify(REGIONS)},K="modstoke-lang",here=document.documentElement.lang;
var path=location.pathname,first=path.split("/")[1];
for(var s in L)if(L[s]&&L[s]===first){path=path.slice(first.length+1);break}
function go(c){if(c&&c!==here&&c in L)location.replace((L[c]?"/"+L[c]:"")+path+location.search+location.hash)}
document.addEventListener("click",function(e){var a=e.target.closest&&e.target.closest("a[data-lang]");if(a)try{localStorage.setItem(K,a.getAttribute("data-lang"))}catch(x){}});
var saved=null;try{saved=localStorage.getItem(K)}catch(x){}
if(saved)return go(saved);
if(here!=="en")return;
if(/bot|crawl|spider|slurp|preview|facebookexternalhit|embed|lighthouse|headless/i.test(navigator.userAgent))return;
function pick(t){t=String(t||"").toLowerCase();if(!t.indexOf("zh"))return /-(tw|hk|mo|hant)/.test(t)?"zh-Hant":"zh-Hans";t=t.split("-")[0];for(var c in L)if(c.toLowerCase()===t)return c}
var langs=navigator.languages&&navigator.languages.length?navigator.languages:[navigator.language];
for(var n=0;n<langs.length;n++){var c=pick(langs[n]);if(c)return go(c)}
fetch("/cdn-cgi/trace").then(function(r){return r.text()}).then(function(t){var m=/\\bloc=([A-Z]{2})/.exec(t);if(m)go(R[m[1]])}).catch(function(){});
})();
`;
}

export function createLayout({ assets, releaseIndex }) {
  const manager = releaseIndex && selectedRelease(releaseIndex, 'manager');
  const loader = releaseIndex && selectedRelease(releaseIndex, 'loader');

  // path is the page's address in English; i is the language it is drawn in.
  return function layout(path, title, body, description, i = translator('en')) {
    const strip = [
      manager && `<a href="${i.href('/releases/')}#${e(manager.releaseId)}">Manager <span class="mono">${e(manager.version)}</span></a>`,
      loader && `<a href="${i.href('/releases/')}#${e(loader.releaseId)}">Loader <span class="mono">${e(loader.version)}</span></a>`,
    ].filter(Boolean).join('<span class="strip-sep" aria-hidden="true">/</span>');
    const download = manager
      ? `<a class="button header-download" href="${i.href('/releases/')}#${e(manager.releaseId)}">${i.t('layout.download')}</a>`
      : '';
    const section = ['/guides/', '/mods/'].find(prefix => path.startsWith(prefix)) || path;
    const links = nav.map(([url, key]) => `<a href="${i.href(url)}"${section === url ? ' aria-current="page"' : ''}>${i.t(`nav.${key}`)}</a>`).join('');
    const languages = LANGUAGES.map(l => `<a href="${l.slug ? '/' + l.slug : ''}${path}" hreflang="${l.code}" lang="${l.code}" data-lang="${l.code}"${l.code === i.code ? ' aria-current="true"' : ''}>${e(l.name)}</a>`).join('');
    const extra = path === '/servers/'
      ? `<link rel="stylesheet" href="/${e(assets['servers.css'])}"><script src="/${e(assets['servers.js'])}" defer></script>`
      : (path.startsWith('/guides/') || path.startsWith('/apps/') || path === '/terms/' || path === '/privacy/') ? `<link rel="stylesheet" href="/${e(assets['guides.css'])}">`
      : path === '/support/' ? `<script src="/${e(assets['support.js'])}" defer></script>` : '';
    return `<!doctype html>
<html lang="${i.code}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
${seoHead(path, title, description, i)}
${path === '/404/' ? '' : `<script src="/${e(assets['lang.js'])}"></script>\n`}<meta name="color-scheme" content="dark">
<meta name="theme-color" content="#0d0f13">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preload" href="/fonts/roboto-400.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/roboto-900.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/${e(assets['style.css'])}">
<script src="/${e(assets['app.js'])}" defer></script>
${extra}
<script type="application/json" id="site-text">${i.client(['client.'])}</script>
</head>
<body>
<a class="skip" href="#main">${i.t('layout.skip')}</a>
<div class="release-strip">
  <div class="wrap">
    <span class="strip-label">${i.t('layout.current')}</span>${strip || `<span>${i.t('layout.noDownloads')}</span>`}
    <a class="strip-discord" href="${i.href('/support/')}">${i.t('layout.support')}</a>
    <a class="strip-discord strip-tight" href="${discordUrl}">Discord ${arrow}</a>
  </div>
</div>
<header class="site-header">
  <div class="wrap">
    <a class="brand" href="${i.href('/')}" aria-label="${i.t('layout.home')}">${mark}<span>MODSTOKE</span></a>
    <details class="menu">
      <summary>${i.t('layout.menu')}</summary>
      <nav aria-label="${i.t('layout.mainNav')}">${links}</nav>
    </details>
    <nav class="desktop-nav" aria-label="${i.t('layout.mainNav')}">${links}</nav>
    ${download}
    <details class="lang-menu">
      <summary aria-label="${i.t('layout.language')}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" fill="none" stroke="currentColor" stroke-width="1.6"/></svg><span>${e(i.name)}</span></summary>
      <nav aria-label="${i.t('layout.language')}"><p>${i.t('layout.languageNote')}</p>${languages}</nav>
    </details>
  </div>
</header>
<main id="main">
${body}
</main>
<footer class="site-footer">
  <div class="wrap">
    <div class="footer-brand">
      <a class="brand" href="${i.href('/')}">${mark}<span>MODSTOKE</span></a>
      <p>${i.t('footer.about', { gamhon: `<a href="${i.href('/support/')}#gamhon">GAMHON</a>` })}</p>${i.code === 'en' ? '' : `<p class="footer-translated">${i.t('layout.translated')}</p>`}
    </div>
    <nav class="footer-links" aria-label="${i.t('footer.label')}">
      <div><h2>${i.t('footer.play')}</h2><a href="${i.href('/mods/')}">${i.t('footer.mods')}</a><a href="${i.href('/servers/')}">${i.t('footer.servers')}</a><a href="${i.href('/hosting/')}">${i.t('footer.rent')}</a><a href="${panelUrl}">${i.t('footer.panel')}</a><a href="${i.href('/guides/install-modstoke-manager/')}">${i.t('footer.install')}</a><a href="${i.href('/guides/sons-of-the-forest-mod-troubleshooting/')}">${i.t('footer.troubleshooting')}</a></div>
      <div><h2>${i.t('footer.build')}</h2><a href="${i.href('/tools/')}">${i.t('footer.tools')}</a><a href="${i.href('/docs/')}#authors">${i.t('footer.makeMod')}</a><a href="${i.href('/releases/')}">${i.t('footer.releases')}</a></div>
      <div><h2>${i.t('footer.community')}</h2><a href="${discordUrl}">${i.t('footer.discord')}</a><a href="${i.href('/support/')}">${i.t('footer.support')}</a><a href="${i.href('/support/')}#gamhon">GAMHON</a><a href="${i.href('/apps/')}">${i.t('footer.apps')}</a><a href="${i.href('/privacy/')}">${i.t('footer.privacy')}</a><a href="${i.href('/terms/')}">${i.t('footer.terms')}</a></div>
    </nav>
  </div>
</footer>
</body>
</html>
`;
  };
}
