import { escapeHtml as e } from '../scripts/model.mjs';
import { LANGUAGES, translator } from './i18n.mjs';

export const origin = 'https://modstoke.com';
const PAGES = { '/': 'home', '/mods/': 'mods', '/tools/': 'tools', '/docs/': 'docs', '/releases/': 'releases', '/hosting/': 'hosting', '/support/': 'support', '/servers/': 'servers', '/404/': 'notFound' };
const LOCALES = { en: 'en_US', de: 'de_DE', fr: 'fr_FR', es: 'es_ES', it: 'it_IT', pt: 'pt_BR', pl: 'pl_PL', cs: 'cs_CZ', ru: 'ru_RU', tr: 'tr_TR', sv: 'sv_SE', fi: 'fi_FI', ja: 'ja_JP', ko: 'ko_KR', 'zh-Hans': 'zh_CN', 'zh-Hant': 'zh_TW' };

// The head of a page in one language: its title and description, its address in this language and
// in every other one, so search engines show each person the page in theirs.
export function seoHead(path, label, description, i = translator('en')) {
 const page = PAGES[path];
 // The label and description come in escaped, like all text from the language files.
 const title = page ? i.t(`seo.${page}.title`) : i.t('seo.pageTitle', { page: label });
 const summary = page ? i.t(`seo.${page}.description`) : description;
 if (!summary) throw new Error(`Missing page description: ${path}`);
 const canonical = origin + i.prefix + path;
 const alternates = path === '/404/' ? '' : LANGUAGES.map(l => `<link rel="alternate" hreflang="${l.code}" href="${origin}${l.slug ? '/' + l.slug : ''}${path}">`).join('')
  + `<link rel="alternate" hreflang="x-default" href="${origin}${path}">`;
 const graph = [{
  '@type': 'WebPage', '@id': canonical + '#webpage', url: canonical,
  name: title, description: summary, inLanguage: i.code,
  isPartOf: { '@id': origin + '/#website' },
 }];
 if (path === '/') {
  graph.push({ '@type': 'WebSite', '@id': origin + '/#website', url: origin + '/',
   name: 'Modstoke', description: summary, inLanguage: i.code, publisher: { '@id': origin + '/#organization' } },
   { '@type': 'Organization', '@id': origin + '/#organization', name: 'Modstoke', url: origin + '/',
    description: i.t('seo.organization'),
    logo: { '@type': 'ImageObject', url: origin + '/assets/modstoke-logo.png', width: 512, height: 512 },
    parentOrganization: { '@type': 'Organization', name: 'OpenACAI', url: 'https://openacai.com/' } });
 } else if (path !== '/404/') {
  const trail = [{ '@type': 'ListItem', position: 1, name: 'Modstoke', item: origin + i.prefix + '/' }];
  if (path.startsWith('/guides/') && path !== '/guides/') trail.push({ '@type': 'ListItem', position: 2, name: i.t('nav.guides'), item: origin + i.prefix + '/guides/' });
  if (path.startsWith('/mods/') && path !== '/mods/') trail.push({ '@type': 'ListItem', position: 2, name: i.t('nav.mods'), item: origin + i.prefix + '/mods/' });
  trail.push({ '@type': 'ListItem', position: trail.length + 1, name: label, item: canonical });
  graph.push({ '@type': 'BreadcrumbList', itemListElement: trail });
 }
 const plain = value => typeof value === 'string' ? value.replace(/&(amp|lt|gt|quot|#39);/g, (_, x) => ({ amp: '&', lt: '<', gt: '>', quot: '"', '#39': "'" }[x])) : value;
 const json = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }, (k, v) => plain(v)).replaceAll('<', '\\u003c').replaceAll('\u2028', '\\u2028').replaceAll('\u2029', '\\u2029');
 return `<title>${title}</title><meta name="description" content="${summary}"><link rel="canonical" href="${canonical}">${alternates}${path === '/404/' ? '<meta name="robots" content="noindex,follow">' : ''}<meta property="og:type" content="website"><meta property="og:site_name" content="Modstoke"><meta property="og:locale" content="${LOCALES[i.code]}"><meta property="og:title" content="${title}"><meta property="og:description" content="${summary}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="${origin}/assets/modstoke-social.png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="${i.t('seo.imageAlt')}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${title}"><meta name="twitter:description" content="${summary}"><meta name="twitter:image" content="${origin}/assets/modstoke-social.png"><meta name="twitter:image:alt" content="${i.t('seo.imageAlt')}"><script type="application/ld+json">${json}</script>`;
}

export function sitemap(paths) {
 const entries = paths.filter(path => path !== '/404/').map(path => `<url><loc>${origin}${path}</loc></url>`).join('');
 return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}</urlset>\n`;
}

export const robots = `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`;
