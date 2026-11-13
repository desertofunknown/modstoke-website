import { existsSync, readFileSync } from 'node:fs';
import { escapeHtml as e } from '../scripts/model.mjs';
import { translator } from './i18n.mjs';

// The Terms of Service and the Privacy Policy, written in src/legal/*.md so they can be read and
// changed as text. The files use a small part of Markdown: "## Heading {#id}" starts a section,
// "### Heading {#id}" a part of one, and there are paragraphs, "- " lists, tables, links,
// **bold** and `code`. A translation sits in src/legal/<language code>/ under the same file name,
// with the same ids and the English "Effective" line; a language without one shows the English file.

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function inline(text, i) {
  return e(text)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (all, label, href) => `<a href="${href.startsWith('/') ? i.href(href) : href}">${label}</a>`)
    .replace(/(^|[\s(])([\w.]+@[\w.]+\.\w+)/g, '$1<a href="mailto:$2">$2</a>');
}

function heading(line) {
  const [, marks, text, id] = line.match(/^(#+) (.*?)(?: \{#([\w-]+)\})?$/);
  return { level: marks.length, text, id };
}

function sections(lines, i) {
  const found = [];
  let html = [];
  const take = test => {
    const run = [];
    while (lines.length && test(lines[0])) run.push(lines.shift());
    return run;
  };
  while (lines.length) {
    const line = lines[0];
    if (!line.trim()) lines.shift();
    else if (line.startsWith('## ')) {
      const { text, id } = heading(lines.shift());
      html = [];
      found.push({ id, text, html });
    } else if (line.startsWith('### ')) {
      const { text, id } = heading(lines.shift());
      html.push(`<h3 id="${e(id)}">${inline(text, i)}</h3>`);
    } else if (line.startsWith('- ')) {
      html.push(`<ul>${take(l => l.startsWith('- ')).map(l => `<li>${inline(l.slice(2), i)}</li>`).join('')}</ul>`);
    } else if (line.startsWith('|')) {
      const [head, , ...rows] = take(l => l.startsWith('|')).map(l => l.replace(/^\||\|$/g, '').split('|').map(cell => cell.trim()));
      html.push(`<table><thead><tr>${head.map(cell => `<th scope="col">${inline(cell, i)}</th>`).join('')}</tr></thead><tbody>${rows.map(row => `<tr>${row.map(cell => `<td>${inline(cell, i)}</td>`).join('')}</tr>`).join('')}</tbody></table>`);
    } else html.push(`<p>${inline(lines.shift(), i)}</p>`);
  }
  return found;
}

function legalPage(path, file, i) {
  const translated = i.code !== 'en' && existsSync(new URL(`./legal/${i.code}/${file}`, import.meta.url));
  const lines = readFileSync(new URL(`./legal/${translated ? `${i.code}/` : ''}${file}`, import.meta.url), 'utf8').split(/\r?\n/);
  const title = lines.shift().replace(/^# /, '');
  const start = lines.findIndex(line => line.startsWith('## '));
  const [description, effective] = lines.slice(0, start).filter(line => line.trim());
  const [, day, month, year] = effective.match(/^Effective (\d+) (\w+) (\d+)$/);
  const stamp = `${year}-${String(months.indexOf(month) + 1).padStart(2, '0')}-${day.padStart(2, '0')}`;
  const parts = sections(lines.slice(start), i);
  const date = i.code === 'en' ? `${day} ${month} ${year}` : new Intl.DateTimeFormat(i.code, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${stamp}T00:00:00Z`));
  const notice = i.code === 'en' ? '' : `<p class="aside-note">${i.t(translated ? 'legal.translationNote' : 'legal.untranslated')}</p>`;
  const body = `<nav class="guide-breadcrumbs" aria-label="${i.t('legal.breadcrumb')}"><ol><li><a href="${i.href('/')}">${i.t('legal.home')}</a></li><li aria-current="page">${e(title)}</li></ol></nav>
    <header class="page-hero compact guide-hero"><p class="eyebrow">MODSTOKE</p><h1>${e(title)}</h1><p class="page-lede">${e(description)}</p><p>${i.t('legal.effective', { date: `<time datetime="${stamp}">${e(date)}</time>` })}</p></header>
    <div class="guide-layout"><nav class="guide-contents" aria-label="${i.t('legal.onThisPage')}"><h2>${i.t('legal.onThisPage')}</h2><ol>${parts.map(({ id, text }) => `<li><a href="#${e(id)}">${e(text)}</a></li>`).join('')}</ol></nav><article class="guide-body">${notice}${parts.map(({ id, text, html }) => `<section id="${e(id)}"><h2>${e(text)}</h2>${html.join('')}</section>`).join('')}</article></div>`;
  return [path, title, description, body];
}

export function renderLegal(i = translator('en')) {
  return [legalPage('/terms/', 'terms.md', i), legalPage('/privacy/', 'privacy.md', i)];
}
