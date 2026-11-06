'use strict';
// Mod list filter. The page lists every mod without this script; the controls only appear when it runs.
const form = document.querySelector('.list-tools');
const search = document.querySelector('#mod-search');
const role = document.querySelector('#role-filter');
const status = document.querySelector('#search-status');
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
    status.textContent = shown === rows.length ? `${rows.length} mods` : `${shown} of ${rows.length} mods`;
  };
  form.hidden = false;
  search.addEventListener('input', update);
  role.addEventListener('change', update);
  form.addEventListener('submit', event => { event.preventDefault(); update(); });
}
