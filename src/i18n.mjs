import { readFileSync } from 'node:fs';
import { escapeHtml } from '../scripts/model.mjs';

// The site's text in the game's sixteen languages. The files and their rules are the Modstoke
// Loader's and the panel's: one JSON file per language in ./lang, keys nested into dotted names,
// {name} placeholders, counted text as an object of plural forms, keys starting with _ and
// whole-line // comments for translators. en.json is the source; a key missing from a language
// shows in English, and one missing from English stops the build.
//
// English lives at /, every other language under its own folder (/fr/, /zh-hans/), so each page
// has an address of its own per language for people to share and for search engines to list.

export const LANGUAGES = [
  { code: 'en', name: 'English', english: 'English', slug: '' },
  { code: 'de', name: 'Deutsch', english: 'German', slug: 'de' },
  { code: 'fr', name: 'Français', english: 'French', slug: 'fr' },
  { code: 'es', name: 'Español', english: 'Spanish', slug: 'es' },
  { code: 'it', name: 'Italiano', english: 'Italian', slug: 'it' },
  { code: 'pt', name: 'Português', english: 'Portuguese', slug: 'pt' },
  { code: 'pl', name: 'Polski', english: 'Polish', slug: 'pl' },
  { code: 'cs', name: 'Čeština', english: 'Czech', slug: 'cs' },
  { code: 'ru', name: 'Русский', english: 'Russian', slug: 'ru' },
  { code: 'tr', name: 'Türkçe', english: 'Turkish', slug: 'tr' },
  { code: 'sv', name: 'Svenska', english: 'Swedish', slug: 'sv' },
  { code: 'fi', name: 'Suomi', english: 'Finnish', slug: 'fi' },
  { code: 'ja', name: '日本語', english: 'Japanese', slug: 'ja' },
  { code: 'ko', name: '한국어', english: 'Korean', slug: 'ko' },
  { code: 'zh-Hans', name: '简体中文', english: 'Chinese (Simplified)', slug: 'zh-hans' },
  { code: 'zh-Hant', name: '繁體中文', english: 'Chinese (Traditional)', slug: 'zh-hant' },
];

const FORMS = ['zero', 'one', 'two', 'few', 'many', 'other'];

function flatten(tree, prefix = '', out = {}) {
  for (const [key, value] of Object.entries(tree || {})) {
    if (key.startsWith('_')) continue;
    const name = prefix + key;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      if (Object.keys(value).length && Object.keys(value).every(k => FORMS.includes(k))) out[name] = value;
      else flatten(value, name + '.', out);
    } else if (typeof value === 'string') out[name] = value;
  }
  return out;
}

const files = new Map();
function read(code) {
  if (!files.has(code)) {
    let text = null;
    try {
      text = readFileSync(new URL(`./lang/${code}.json`, import.meta.url), 'utf8');
    } catch (error) {
      if (error.code !== 'ENOENT' || code === 'en') throw error;
    }
    files.set(code, text ? flatten(JSON.parse(text.replace(/^\s*\/\/.*$/gm, ''))) : {});
  }
  return files.get(code);
}

// Fills {name} in an already escaped template. Values are put in as given, so a value that is
// text from data is escaped by whoever passes it, and one that is markup (a link) stays markup.
const fill = (template, values, code) => template.replace(/\{\{|\}\}|\{([a-zA-Z0-9_]+)\}/g, (all, name) => {
  if (all === '{{') return '{';
  if (all === '}}') return '}';
  const value = values?.[name];
  if (value == null) return all;
  return typeof value === 'number' ? new Intl.NumberFormat(code).format(value) : String(value);
});

// The text of one language for one build: t() and count() give it escaped for HTML, with
// placeholders filled; href() puts a site path in this language's folder.
export function translator(code) {
  const lang = LANGUAGES.find(l => l.code === code);
  if (!lang) throw new Error(`Unknown language: ${code}`);
  const own = read(code), english = read('en');
  const prefix = lang.slug ? `/${lang.slug}` : '';
  const lookup = key => {
    const found = own[key] ?? english[key];
    if (found == null) throw new Error(`No English text for ${key}`);
    return found;
  };
  return {
    ...lang,
    prefix,
    href: path => (path.startsWith('/') && !path.startsWith('//') ? prefix + path : path),
    has: key => key in own || key in english,
    // Only this language's own text, or null: for text from data, which falls back to the data.
    own: key => (typeof own[key] === 'string' ? escapeHtml(own[key]) : null),
    t(key, values) {
      const found = lookup(key);
      return fill(escapeHtml(typeof found === 'string' ? found : found.other), values, code);
    },
    // The same text unescaped, for places that are not HTML (the knowledge feed Sentinel reads).
    text(key, values) {
      const found = lookup(key);
      return fill(typeof found === 'string' ? found : found.other, values, code);
    },
    count(key, n, values) {
      const found = lookup(key);
      if (typeof found === 'string') return fill(escapeHtml(found), { ...values, count: n }, code);
      const template = found[new Intl.PluralRules(code).select(n)] ?? found.other;
      return fill(escapeHtml(template), { ...values, count: n }, code);
    },
    // Text a script on the page needs, as JSON for a <script type="application/json">.
    client(prefixes) {
      const out = {};
      for (const [key, value] of Object.entries(english)) {
        if (prefixes.some(p => key.startsWith(p))) out[key] = own[key] ?? value;
      }
      return JSON.stringify(out).replaceAll('<', '\\u003c');
    },
  };
}
