'use strict';
// Mod list filter. The page lists every mod without this script; the controls only appear when it runs.
const form = document.querySelector('.list-tools');
const search = document.querySelector('#mod-search');
const role = document.querySelector('#role-filter');
const status = document.querySelector('#search-status');
const text = JSON.parse(document.querySelector('#site-text')?.textContent || '{}');
const lang = document.documentElement?.lang || undefined;
const fallback = {
  'client.app.count': { other: '{count} mods' },
  'client.app.countOf': { other: '{shown} of {count} mods' },
};
const count = (key, values) => {
  const forms = text[key] ?? fallback[key];
  const form = forms?.[new Intl.PluralRules(lang).select(values.count)] ?? forms?.other ?? key;
  return form.replace(/\{(\w+)\}/g, (all, name) => values[name] === undefined ? all : number.format(values[name]));
};
const number = new Intl.NumberFormat(lang);
if (form && search && role && status) {
  const rows = [...document.querySelectorAll('[data-mod-name]')];
  const update = () => {
    const query = search.value.trim().toLocaleLowerCase();
    let shown = 0;
    for (const row of rows) {
      const matches = row.dataset.modName.toLocaleLowerCase().includes(query) &&
        (role.value === 'all' || row.dataset.role === role.value);
      row.hidden = !matches;
      if (matches) shown++;
    }
    status.textContent = shown === rows.length
      ? count('client.app.count', { count: rows.length })
      : count('client.app.countOf', { count: rows.length, shown });
  };
  form.hidden = false;
  search.addEventListener('input', update);
  role.addEventListener('change', update);
  form.addEventListener('submit', event => { event.preventDefault(); update(); });
}
