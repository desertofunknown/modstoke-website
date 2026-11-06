import { escapeHtml as e } from '../scripts/model.mjs';

export const origin = 'https://modstoke.com';
const descriptions = {
 '/': ['Modstoke: Sons of the Forest mods, Mod Manager and Loader', 'Free Sons of the Forest mods and the tools to run them: Modstoke Manager for Windows, the Modstoke Loader, and mods like Client, Admin, Terraforming and Virginia.'],
 '/mods/': ['Sons of the Forest Mods | Modstoke', 'Modstoke mods for Sons of the Forest: Client (tablet, drone and the Kestrel plane), Admin host tools, Terraforming and Virginia. Versions, requirements and multiplayer notes.'],
 '/tools/': ['Modstoke Manager, Loader and SDK for Sons of the Forest', 'Download Modstoke Manager for Windows, add the Modstoke Loader to Sons of the Forest and build mods against the SDK that ships with it.'],
 '/docs/': ['Modstoke Docs for Players and Mod Authors', 'How Modstoke Manager, the Loader and mods fit together, game compatibility, and what to know before you build a Sons of the Forest mod.'],
 '/releases/': ['Download Modstoke Manager and Loader | Releases', 'Download Modstoke Manager for Windows and the Modstoke Loader. Each release lists its version, changes, size, signing status and SHA-256.'],
 '/hosting/': ['Sons of the Forest Server Hosting | Modstoke', 'Rent a dedicated Sons of the Forest server from OpenACAI, a nonprofit, with dedicated cores, daily backups and the Modstoke Loader ready to go.'],
 '/support/': ['Support Modstoke | OpenACAI', 'Donate to keep Modstoke free. Donations go to OpenACAI, a 501(c)(3) nonprofit, and GAMHON, its program for mental health and social connection through games.'],
 '/servers/': ['Sons of the Forest Community Servers | Modstoke','Find Sons of the Forest servers whose hosts chose to list them, with player counts, required mods and settings, or learn how to list your own.'],
 '/404/': ['Page not found | Modstoke', 'This page could not be found. Head back to Modstoke for Sons of the Forest mods, tools and guides.'],
};

export function seoHead(path, label, description) {
 const [title, summary] = descriptions[path] || [`${label} | Modstoke`, description];
 if (!summary) throw new Error(`Missing page description: ${path}`);
 const canonical = origin + path;
 const graph = [{
  '@type': 'WebPage', '@id': canonical + '#webpage', url: canonical,
  name: title, description: summary, inLanguage: 'en',
  isPartOf: { '@id': origin + '/#website' },
 }];
 if (path === '/') {
  graph.push({ '@type': 'WebSite', '@id': origin + '/#website', url: origin + '/',
   name: 'Modstoke', description: summary, inLanguage: 'en', publisher: { '@id': origin + '/#organization' } },
   { '@type': 'Organization', '@id': origin + '/#organization', name: 'Modstoke', url: origin + '/',
    description: 'Free modding tools and a community for Sons of the Forest, by OpenACAI.',
    logo: { '@type': 'ImageObject', url: origin + '/assets/modstoke-logo.png', width: 512, height: 512 },
    parentOrganization: { '@type': 'Organization', name: 'OpenACAI', url: 'https://openacai.com/' } });
 } else if (path !== '/404/') {
  const trail = [{ '@type': 'ListItem', position: 1, name: 'Modstoke', item: origin + '/' }];
  if (path.startsWith('/guides/') && path !== '/guides/') trail.push({ '@type': 'ListItem', position: 2, name: 'Guides', item: origin + '/guides/' });
  if (path.startsWith('/mods/') && path !== '/mods/') trail.push({ '@type': 'ListItem', position: 2, name: 'Mods', item: origin + '/mods/' });
  trail.push({ '@type': 'ListItem', position: trail.length + 1, name: label, item: canonical });
  graph.push({ '@type': 'BreadcrumbList', itemListElement: trail });
 }
 const json = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replaceAll('<', '\\u003c').replaceAll('\u2028', '\\u2028').replaceAll('\u2029', '\\u2029');
 return `<title>${e(title)}</title><meta name="description" content="${e(summary)}"><link rel="canonical" href="${canonical}">${path === '/404/' ? '<meta name="robots" content="noindex,follow">' : ''}<meta property="og:type" content="website"><meta property="og:site_name" content="Modstoke"><meta property="og:locale" content="en_US"><meta property="og:title" content="${e(title)}"><meta property="og:description" content="${e(summary)}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="${origin}/assets/modstoke-social.png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="Modstoke, mods and tools for Sons of the Forest"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${e(title)}"><meta name="twitter:description" content="${e(summary)}"><meta name="twitter:image" content="${origin}/assets/modstoke-social.png"><meta name="twitter:image:alt" content="Modstoke, mods and tools for Sons of the Forest"><script type="application/ld+json">${json}</script>`;
}

export function sitemap(paths) {
 const entries = paths.filter(path => path !== '/404/').map(path => `<url><loc>${origin}${path}</loc></url>`).join('');
 return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}</urlset>\n`;
}

export const robots = `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`;
