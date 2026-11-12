import { readFileSync } from 'node:fs';
import { escapeHtml as e } from '../scripts/model.mjs';

// The Terms of Service and the Privacy Policy, written in src/legal/*.md so they can be read and
// changed as text. The files use a small part of Markdown: "## Heading {#id}" starts a section,
// "### Heading {#id}" a part of one, and there are paragraphs, "- " lists, tables, links,
// **bold** and `code`.

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function inline(text) {
  return e(text)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/(^|[\s(])([\w.]+@[\w.]+\.\w+)/g, '$1<a href="mailto:$2">$2</a>');
}

function heading(line) {
  const [, marks, text, id] = line.match(/^(#+) (.*?)(?: \{#([\w-]+)\})?$/);
  return { level: marks.length, text, id };
}

function sections(lines) {
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
      html.push(`<h3 id="${e(id)}">${inline(text)}</h3>`);
    } else if (line.startsWith('- ')) {
      html.push(`<ul>${take(l => l.startsWith('- ')).map(l => `<li>${inline(l.slice(2))}</li>`).join('')}</ul>`);
    } else if (line.startsWith('|')) {
      const [head, , ...rows] = take(l => l.startsWith('|')).map(l => l.replace(/^\||\|$/g, '').split('|').map(cell => cell.trim()));
      html.push(`<table><thead><tr>${head.map(cell => `<th scope="col">${inline(cell)}</th>`).join('')}</tr></thead><tbody>${rows.map(row => `<tr>${row.map(cell => `<td>${inline(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table>`);
    } else html.push(`<p>${inline(lines.shift())}</p>`);
  }
  return found;
}

function legalPage(path, file) {
  const lines = readFileSync(new URL(`./legal/${file}`, import.meta.url), 'utf8').split(/\r?\n/);
  const title = lines.shift().replace(/^# /, '');
  const start = lines.findIndex(line => line.startsWith('## '));
  const [description, effective] = lines.slice(0, start).filter(line => line.trim());
  const [, day, month, year] = effective.match(/^Effective (\d+) (\w+) (\d+)$/);
  const stamp = `${year}-${String(months.indexOf(month) + 1).padStart(2, '0')}-${day.padStart(2, '0')}`;
  const parts = sections(lines.slice(start));
  const body = `<nav class="guide-breadcrumbs" aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li aria-current="page">${e(title)}</li></ol></nav>
    <header class="page-hero compact guide-hero"><p class="eyebrow">MODSTOKE</p><h1>${e(title)}</h1><p class="page-lede">${e(description)}</p><p>Effective <time datetime="${stamp}">${e(`${day} ${month} ${year}`)}</time></p></header>
    <div class="guide-layout"><nav class="guide-contents" aria-label="On this page"><h2>On this page</h2><ol>${parts.map(({ id, text }) => `<li><a href="#${e(id)}">${e(text)}</a></li>`).join('')}</ol></nav><article class="guide-body">${parts.map(({ id, text, html }) => `<section id="${e(id)}"><h2>${e(text)}</h2>${html.join('')}</section>`).join('')}</article></div>`;
  return [path, title, description, body];
}

export function renderLegal() {
  return [legalPage('/terms/', 'terms.md'), legalPage('/privacy/', 'privacy.md')];
}
