import { escapeHtml as e } from '../scripts/model.mjs';

export const origin = 'https://modstoke.com';
const descriptions = {
 '/': ['Modstoke — Sons of the Forest Mod Manager & Community', 'Explore Modstoke, free modding tools for Sons of the Forest. Download the Windows Manager preview, read setup guides and join the community.'],
 '/tools/': ['Sons of the Forest Modding Tools — Modstoke', 'Meet Modstoke Manager, Loader and SDK. Compare their roles, see current download availability and find setup resources for Sons of the Forest.'],
 '/mods/': ['Sons of the Forest Mods: Catalog Status — Modstoke', 'Check the status of the Modstoke mod catalog and find player guides, compatibility notes and creator resources for Sons of the Forest.'],
 '/docs/': ['Sons of the Forest Modding Documentation — Modstoke', 'Read Modstoke documentation for players and mod creators: Manager setup, Loader and SDK availability, compatibility notes and community servers.'],
 '/releases/': ['Download Modstoke Manager for Windows — Releases', 'Download the Modstoke Manager Windows preview for Sons of the Forest. Check release notes, version, signing status and the installer SHA-256.'],
 '/servers/': ['Sons of the Forest Community Servers — Modstoke', 'Find opt-in Sons of the Forest community servers. Browse host-reported status, player counts, required mods and settings, or learn how to list a server.'],
 '/404/': ['Page Not Found — Modstoke', 'This page could not be found. Return to Modstoke for Sons of the Forest tools, guides and community resources.'],
};

export function seoHead(path, label, description) {
 const [title, summary] = descriptions[path] || [`${label} — Modstoke`, description];
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
  trail.push({ '@type': 'ListItem', position: trail.length + 1, name: label, item: canonical });
  graph.push({ '@type': 'BreadcrumbList', itemListElement: trail });
 }
 const json = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replaceAll('<', '\\u003c').replaceAll('\u2028', '\\u2028').replaceAll('\u2029', '\\u2029');
 return `<title>${e(title)}</title><meta name="description" content="${e(summary)}"><link rel="canonical" href="${canonical}">${path === '/404/' ? '<meta name="robots" content="noindex,follow">' : ''}<meta property="og:type" content="website"><meta property="og:site_name" content="Modstoke"><meta property="og:locale" content="en_US"><meta property="og:title" content="${e(title)}"><meta property="og:description" content="${e(summary)}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="${origin}/assets/modstoke-social.png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="Modstoke — Sons of the Forest tools and community"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${e(title)}"><meta name="twitter:description" content="${e(summary)}"><meta name="twitter:image" content="${origin}/assets/modstoke-social.png"><meta name="twitter:image:alt" content="Modstoke — Sons of the Forest tools and community"><script type="application/ld+json">${json}</script>`;
}

export function sitemap(paths) {
 const entries = paths.filter(path => path !== '/404/').map(path => `<url><loc>${origin}${path}</loc></url>`).join('');
 return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}</urlset>\n`;
}

export const robots = `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`;
