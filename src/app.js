'use strict';
const search = document.querySelector('#mod-search');
const game = document.querySelector('#game-filter');
const status = document.querySelector('#search-status');
if (search && game && status) {
  const rows = [...document.querySelectorAll('[data-mod-name]')];
  const update = () => {
    const query = search.value.trim().toLocaleLowerCase();
    let shown = 0;
    for (const row of rows) {
      const matches = row.dataset.modName.toLocaleLowerCase().includes(query) &&
        (game.value === 'all' || row.dataset.gameId === game.value);
      row.hidden = !matches;
      if (matches) shown++;
    }
    status.textContent = `${shown} of ${rows.length} published mods shown.`;
  };
  search.addEventListener('input', update);
  game.addEventListener('change', update);
  search.closest('form').addEventListener('submit', event => { event.preventDefault(); update(); });
}
