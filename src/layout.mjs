import { escapeHtml as e } from '../scripts/model.mjs';
import { seoHead } from './seo.mjs';
import { selectedRelease } from './release-view.mjs';

export const discordUrl = 'https://discord.gg/T2Tjh5ECS';
export const arrow = '<span aria-hidden="true">↗</span>';
export const mark = '<svg viewBox="0 0 40 30" aria-hidden="true"><path d="M0 30V0h8l12 17L32 0h8v30H29V16l-9 12-9-12v14z" fill="currentColor"/></svg>';

const nav = [['/mods/', 'Mods'], ['/tools/', 'Tools'], ['/servers/', 'Servers'], ['/hosting/', 'Hosting'], ['/guides/', 'Guides'], ['/docs/', 'Docs'], ['/releases/', 'Releases']];

export function megabytes(bytes) {
  return `${(bytes / 1e6).toFixed(bytes < 1e7 ? 1 : 0)} MB`;
}

// 6 Nov 2026, from a UTC timestamp. Written out so the build doesn't depend on the host locale.
export function shortDate(utc) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const [year, month, day] = utc.slice(0, 10).split('-').map(Number);
  return `${day} ${months[month - 1]} ${year}`;
}

// Images are referenced by their 1600 px WebP; an 800 px WebP and a 1600 px JPEG sit next to it.
export function picture(path, alt, { sizes = '100vw', eager = false, width = 1600, height = 900 } = {}) {
  const base = path.replace(/-1600\.webp$/, '');
  return `<picture><source type="image/webp" srcset="${e(base)}-800.webp 800w, ${e(base)}-1600.webp 1600w" sizes="${e(sizes)}">`
    + `<img src="${e(base)}-1600.jpg" width="${width}" height="${height}" alt="${e(alt)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"></picture>`;
}

export function createLayout({ assets, releaseIndex }) {
  const manager = releaseIndex && selectedRelease(releaseIndex, 'manager');
  const loader = releaseIndex && selectedRelease(releaseIndex, 'loader');

  const strip = [
    manager && `<a href="/releases/#${e(manager.releaseId)}">Manager <span class="mono">${e(manager.version)}</span></a>`,
    loader && `<a href="/releases/#${e(loader.releaseId)}">Loader <span class="mono">${e(loader.version)}</span></a>`,
  ].filter(Boolean).join('<span class="strip-sep" aria-hidden="true">/</span>');

  const download = manager
    ? `<a class="button header-download" href="/releases/#${e(manager.releaseId)}">Download Manager</a>`
    : '';

  return function layout(path, title, body, description) {
    const section = ['/guides/', '/mods/'].find(prefix => path.startsWith(prefix)) || path;
    const links = nav.map(([url, label]) => `<a href="${url}"${section === url ? ' aria-current="page"' : ''}>${label}</a>`).join('');
    const extra = path === '/servers/'
      ? `<link rel="stylesheet" href="/${e(assets['servers.css'])}"><script src="/${e(assets['servers.js'])}" defer></script>`
      : (path.startsWith('/guides/') || path.startsWith('/apps/') || path === '/terms/' || path === '/privacy/') ? `<link rel="stylesheet" href="/${e(assets['guides.css'])}">`
      : path === '/support/' ? `<script src="/${e(assets['support.js'])}" defer></script>` : '';
    return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
${seoHead(path, title, description)}
<meta name="color-scheme" content="dark">
<meta name="theme-color" content="#0d0f13">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preload" href="/fonts/roboto-400.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/roboto-900.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/${e(assets['style.css'])}">
<script src="/${e(assets['app.js'])}" defer></script>
${extra}
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<div class="release-strip">
  <div class="wrap">
    <span class="strip-label">Current</span>${strip || '<span>No public downloads yet</span>'}
    <a class="strip-discord" href="/support/">Support Modstoke</a>
    <a class="strip-discord strip-tight" href="${discordUrl}">Discord ${arrow}</a>
  </div>
</div>
<header class="site-header">
  <div class="wrap">
    <a class="brand" href="/" aria-label="Modstoke home">${mark}<span>MODSTOKE</span></a>
    <details class="menu">
      <summary>Menu</summary>
      <nav aria-label="Main navigation">${links}</nav>
    </details>
    <nav class="desktop-nav" aria-label="Main navigation">${links}</nav>
    ${download}
  </div>
</header>
<main id="main">
${body}
</main>
<footer class="site-footer">
  <div class="wrap">
    <div class="footer-brand">
      <a class="brand" href="/">${mark}<span>MODSTOKE</span></a>
      <p>Free mods and tools for Sons of the Forest, made by OpenACAI, a nonprofit, as part of <a href="/support/#gamhon">GAMHON</a>, its program for mental health and social connection through games. Not affiliated with Endnight Games.</p>
    </div>
    <nav class="footer-links" aria-label="Footer">
      <div><h2>Play</h2><a href="/mods/">Mods</a><a href="/servers/">Servers</a><a href="/hosting/">Rent a server</a><a href="/guides/install-modstoke-manager/">Install guide</a><a href="/guides/sons-of-the-forest-mod-troubleshooting/">Troubleshooting</a></div>
      <div><h2>Build</h2><a href="/tools/">Manager, Loader and SDK</a><a href="/docs/#authors">Make a mod</a><a href="/releases/">Releases</a></div>
      <div><h2>Community</h2><a href="${discordUrl}">Discord</a><a href="/support/">Support Modstoke</a><a href="/support/#gamhon">GAMHON</a><a href="/apps/">Discord apps</a><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a></div>
    </nav>
  </div>
</footer>
</body>
</html>
`;
  };
}
