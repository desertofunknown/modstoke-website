export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
export function validate(data) {
  for (const key of ['name','organization']) if(typeof data[key] !== 'string' || !data[key].trim()) throw Error(`Invalid ${key}`);
  for (const key of ['games', 'products', 'mods', 'releases']) {
    if (!Array.isArray(data[key])) throw new Error(`${key} must be an array`);
    const ids = new Set();
    for (const item of data[key]) {
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.id || '')) throw new Error(`Invalid ${key} ID`);
      if (ids.has(item.id)) throw new Error(`Duplicate ${key} ID`);
      ids.add(item.id);
    }
  }
  if(!data.games.length || data.games.some(game => typeof game.name !== 'string' || !game.name.trim() || game.status !== 'planned')) throw Error('Invalid planned game');
  // Product downloads use the separate, reviewed data/releases.json adapter.
  if (data.mods.length || data.releases.length) throw new Error('Legacy site.json mods/releases must remain empty. Use data/releases.json for verified product files; see docs/architecture.md.');
  if (data.products.some(x => x.status !== 'unpublished')) throw new Error('Product publication is not configured');
  return data;
}
