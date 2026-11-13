(() => {
  'use strict';
  const results = document.querySelector('#server-results');
  if (!results) return;
  const text = JSON.parse(document.getElementById('site-text')?.textContent || '{}');
  const lang = document.documentElement.lang || undefined;
  const t = (key, values) => String(text[key] ?? key).replace(/\{(\w+)\}/g, (all, name) => values?.[name] ?? all);
  const counted = (key, n) => {
    const forms = text[key];
    return String(forms?.[new Intl.PluralRules(lang).select(n)] ?? forms?.other ?? key).replace('{count}', value(n));
  };
  const API = 'https://modstoke.com/api/community/v1';
  const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const MAX_SERVERS = 1000;
  const MAX_SAMPLES = 745;
  const search = document.querySelector('#server-search');
  const status = document.querySelector('#server-status');
  const kind = document.querySelector('#server-kind');
  const count = document.querySelector('#server-result-count');
  const updated = document.querySelector('#server-updated');
  const dialog = document.querySelector('#server-detail');
  const detailBody = document.querySelector('#server-detail-body');
  let servers = [], loaded = false, listController, detailController, selectedId = null, refreshTimer;

  const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
  const plain = (value, max) => typeof value === 'string' && value.length <= max && !/[\u0000-\u001f\u007f-\u009f]/u.test(value);
  const number = (value, max) => value === null || (Number.isFinite(value) && value >= 0 && value <= max);
  const integer = (value, max) => value === null || (Number.isInteger(value) && value >= 0 && value <= max);
  const date = value => typeof value === 'string' && value.length <= 35 && /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d{1,7})?(?:Z|\+00:00)$/.test(value) && Number.isFinite(Date.parse(value));
  const optionalDate = value => value === null || date(value);
  const packages = (value, max) => Array.isArray(value) && value.length <= max && value.every(item => object(item) && plain(item.id, 100) && item.id.length > 0 && plain(item.version, 80));
  const ipv4 = address => typeof address === 'string' && /^(?:0|[1-9]\d{0,2})(?:\.(?:0|[1-9]\d{0,2})){3}$/.test(address) && address.split('.').every(part => Number(part) <= 255);
  function validServer(server) {
    return object(server) && typeof server.id === 'string' && UUID.test(server.id) &&
      plain(server.name, 80) && server.name.length > 0 && plain(server.description, 800) &&
      plain(server.hostLabel, 80) && plain(server.region, 40) && ['dedicated', 'player-hosted'].includes(server.kind) &&
      typeof server.online === 'boolean' && optionalDate(server.firstSeen) && optionalDate(server.lastSeen) &&
      integer(server.playersCurrent, 10000) && integer(server.playersMax, 10000) &&
      packages(server.components, 64) && packages(server.requiredMods, 128) &&
      (server.gameBuild === null || plain(server.gameBuild, 80)) && number(server.hostMedianLatencyMs, 60000) &&
      object(server.settings) && Object.keys(server.settings).every(key => ['difficulty', 'pvp', 'friendlyFire', 'passwordRequired'].includes(key)) &&
      (server.settings.difficulty === null || plain(server.settings.difficulty, 80)) &&
      ['pvp', 'friendlyFire', 'passwordRequired'].every(key => server.settings[key] === null || typeof server.settings[key] === 'boolean') &&
      (server.join === null || (object(server.join) &&
        ((server.join.kind === 'lobby' && typeof server.join.lobbyId === 'string' && /^[0-9]{1,20}$/.test(server.join.lobbyId)) ||
         (server.join.kind === 'dedicated' && ipv4(server.join.address) && Number.isInteger(server.join.port) && server.join.port >= 1 && server.join.port <= 65535))));
  }
  function validHistory(body, id) {
    return object(body) && body.schemaVersion === 1 && typeof body.serverId === 'string' && body.serverId.toLowerCase() === id.toLowerCase() &&
      Array.isArray(body.samples) && body.samples.length <= MAX_SAMPLES && body.samples.every((sample, index, all) =>
        object(sample) && date(sample.at) && number(sample.players, 10000) && number(sample.latencyMs, 60000) &&
        (sample.onlineSeconds === undefined || number(sample.onlineSeconds, 3600)) &&
        (index === 0 || Date.parse(sample.at) > Date.parse(all[index - 1].at)));
  }
  async function request(path, signal, maxBytes) {
    // All routes are constructed locally; neither publisher text nor the query supplies a URL.
    const controller = new AbortController();
    const abort = () => controller.abort();
    signal.addEventListener('abort', abort, {once: true});
    if (signal.aborted) abort();
    const timer = setTimeout(() => controller.abort(), 15000);
    let reader;
    try {
      const response = await fetch(API + path, {signal: controller.signal, credentials: 'omit', cache: 'no-store', redirect: 'error', headers: {'Accept': 'application/json'}});
      if (!response.ok) throw new Error(response.status === 404 ? 'not-found' : 'unavailable');
      if (!(response.headers.get('content-type') || '').toLowerCase().startsWith('application/json')) throw new Error('invalid-response');
      if (Number(response.headers.get('content-length')) > maxBytes) throw new Error('invalid-response');
      reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8', {fatal: true});
      let bytes = 0, text = '';
      while (true) {
        const chunk = await reader.read();
        if (chunk.done) break;
        bytes += chunk.value.byteLength;
        if (bytes > maxBytes) throw new Error('invalid-response');
        text += decoder.decode(chunk.value, {stream: true});
      }
      text += decoder.decode();
      return JSON.parse(text);
    } finally {
      if (reader) await reader.cancel().catch(() => {});
      clearTimeout(timer);
      signal.removeEventListener('abort', abort);
    }
  }

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  const value = n => n === null ? '—' : new Intl.NumberFormat(lang, {maximumFractionDigits: 1}).format(n);
  const players = server => `${value(server.playersCurrent)} / ${value(server.playersMax)}`;
  const latency = n => n === null ? '—' : `${value(n)} ms`;
  const yesNo = v => v === null ? t('client.servers.unknown') : v ? t('client.servers.yes') : t('client.servers.no');
  const typeLabel = server => server.kind === 'dedicated' ? t('client.servers.dedicated') : t('client.servers.playerHosted');
  const sharePath = id => '/servers/?server=' + encodeURIComponent(id);
  function stateBadge(server) { return element('span', 'server-state' + (server.online ? ' online' : ''), server.online ? t('client.servers.online') : t('client.servers.offline')); }
  function facts(items) {
    const list = element('dl', 'server-facts');
    for (const [label, text] of items) {
      const item = element('div'); item.append(element('dt', '', label), element('dd', '', text)); list.append(item);
    }
    return list;
  }
  function empty(target, title, message) {
    const box = element('div', 'server-empty');
    box.append(element('p', 'eyebrow', t('client.servers.eyebrow')), element('h2', '', title), element('p', '', message));
    target.replaceChildren(box);
  }
  function card(server) {
    const node = element('article', 'server-card');
    const top = element('div', 'server-card-top');
    top.append(stateBadge(server), element('span', '', typeLabel(server)));
    node.append(top, element('h2', '', server.name), element('p', 'server-host', `${server.hostLabel || t('client.servers.hostNotSpecified')} · ${server.region || t('client.servers.regionNotSpecified')}`));
    node.append(element('p', 'server-description', server.description || t('client.servers.noDescription')));
    node.append(facts([[t('client.servers.playersCapacity'), players(server)], [t('client.servers.hostLatency'), latency(server.hostMedianLatencyMs)]]));
    const tags = element('div', 'server-tags');
    for (const item of server.components.slice(0, 2)) tags.append(element('span', 'server-tag', `${item.id} ${item.version}`));
    if (server.components.length > 2) tags.append(element('span', 'server-tag', counted('client.servers.moreComponents', server.components.length - 2)));
    tags.append(element('span', 'server-tag', counted('client.servers.requiredMods', server.requiredMods.length)));
    const link = element('a', 'inline-link', t('client.servers.viewServer'));
    link.href = sharePath(server.id);
    link.setAttribute('aria-label', t('client.servers.viewServerLabel', {name: server.name}));
    link.addEventListener('click', event => {
      if (event.button !== 0 || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
      event.preventDefault();
      window.history.pushState(null, '', link.href);
      openDetail(server.id);
    });
    node.append(tags, link);
    return node;
  }
  function renderList() {
    if (!loaded) return;
    const query = search.value.trim().toLocaleLowerCase();
    const filtered = servers.filter(server => (status.value === 'all' || server.online === (status.value === 'online')) &&
      (kind.value === 'all' || server.kind === kind.value) &&
      [server.name, server.description, server.hostLabel, server.region, ...server.components.map(x => x.id), ...server.requiredMods.map(x => x.id)].join(' ').toLocaleLowerCase().includes(query));
    count.textContent = t('client.servers.count', {shown: value(filtered.length), total: value(servers.length), online: value(servers.filter(server => server.online).length)});
    if (!servers.length) empty(results, t('client.servers.noneTitle'), t('client.servers.noneMessage'));
    else if (!filtered.length) empty(results, t('client.servers.noMatchTitle'), t('client.servers.noMatchMessage'));
    else results.replaceChildren(...filtered.map(card));
  }
  async function refreshList() {
    listController?.abort();
    const controller = listController = new AbortController();
    results.setAttribute('aria-busy', 'true');
    updated.textContent = t('client.servers.refreshing');
    try {
      const body = await request('/servers', controller.signal, 8 * 1024 * 1024);
      if (!object(body) || body.schemaVersion !== 1 || !date(body.generatedAt) || !Array.isArray(body.servers) || body.servers.length > MAX_SERVERS || !body.servers.every(validServer) || new Set(body.servers.map(s => s.id.toLowerCase())).size !== body.servers.length) throw new Error('invalid-response');
      if (controller.signal.aborted) return;
      servers = body.servers.sort((a, b) => Number(b.online) - Number(a.online) || a.name.localeCompare(b.name));
      loaded = true;
      renderList();
      updated.textContent = t('client.servers.updated', {time: new Date(body.generatedAt).toLocaleTimeString(lang)});
    } catch {
      if (controller.signal.aborted) return;
      servers = []; loaded = false;
      count.textContent = t('client.servers.unavailable');
      updated.textContent = t('client.servers.tryRefresh');
      empty(results, t('client.servers.loadFailedTitle'), t('client.servers.loadFailedMessage'));
    } finally {
      if (listController === controller) results.setAttribute('aria-busy', 'false');
    }
  }
  function packageList(title, empty, items) {
    const section = element('section'); section.append(element('h3', '', title));
    if (!items.length) section.append(element('p', '', empty));
    else {
      const list = element('ul', 'server-package-list');
      for (const item of items) list.append(element('li', '', `${item.id} · ${item.version || t('client.servers.versionNotSpecified')}`));
      section.append(list);
    }
    return section;
  }
  function svgNode(tag, attributes, text) {
    const node = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (const [name, v] of Object.entries(attributes)) node.setAttribute(name, String(v));
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function chart(samples, field, title, unit, description) {
    const svg = svgNode('svg', {viewBox: '0 0 640 176', role: 'img', 'aria-label': title, class: 'server-chart'});
    svg.append(svgNode('title', {}, title), svgNode('desc', {}, description));
    const max = Math.max(1, ...samples.map(sample => sample[field] ?? 0));
    const start = Date.parse(samples[0].at), end = Date.parse(samples.at(-1).at);
    const x = sample => end === start ? 334 : 50 + (Date.parse(sample.at) - start) / (end - start) * 564;
    const y = sample => 132 - sample[field] / max * 104;
    svg.append(svgNode('line', {x1: 50, x2: 614, y1: 132, y2: 132, class: 'history-axis'}));
    svg.append(svgNode('text', {x: 12, y: 30}, value(max)), svgNode('text', {x: 12, y: 135}, '0'), svgNode('text', {x: 50, y: 16}, unit));
    let segment = [];
    const flush = () => { if (segment.length) svg.append(svgNode('polyline', {points: segment.join(' '), class: 'history-line'})); segment = []; };
    samples.forEach((sample, index) => {
      if (sample[field] === null) { flush(); return; }
      if (index && Date.parse(sample.at) - Date.parse(samples[index - 1].at) > 90 * 60 * 1000) flush();
      segment.push(`${x(sample)},${y(sample)}`);
      svg.append(svgNode('circle', {cx: x(sample), cy: y(sample), r: 2}));
    });
    flush();
    svg.append(svgNode('text', {x: 50, y: 162}, new Date(start).toLocaleDateString(lang)), svgNode('text', {x: 614, y: 162, 'text-anchor': 'end'}, new Date(end).toLocaleDateString(lang)));
    return svg;
  }
  function historySection(result, id) {
    const section = element('section'); section.append(element('h3', '', t('client.servers.history.title')));
    if (result.status !== 'fulfilled' || !validHistory(result.value, id)) {
      section.append(element('p', '', t('client.servers.history.unavailable'))); return section;
    }
    const samples = result.value.samples;
    if (!samples.length) { section.append(element('p', '', t('client.servers.history.none'))); return section; }
    section.append(element('p', 'server-history-note', t('client.servers.history.note')));
    for (const [field, name] of [['players', 'players'], ['latencyMs', 'latency']]) {
      if (samples.some(sample => sample[field] !== null)) section.append(chart(samples, field, t(`client.servers.history.${name}.title`), t(`client.servers.history.${name}.unit`), t(`client.servers.history.${name}.description`)));
      else section.append(element('p', '', t(`client.servers.history.${name}.none`)));
    }
    const details = element('details'); details.append(element('summary', '', t('client.servers.history.viewValues')));
    const scroll = element('div', 'server-history-data');
    const table = element('table', 'server-history-table');
    table.append(element('caption', 'sr-only', t('client.servers.history.caption')));
    const head = element('thead'), row = element('tr');
    const hasOnline = samples.some(sample => sample.onlineSeconds !== undefined && sample.onlineSeconds !== null);
    for (const title of [t('client.servers.history.time'), t('client.servers.history.players.title'), t('client.servers.history.hostLatency'), ...(hasOnline ? [t('client.servers.history.onlineSeconds')] : [])]) { const cell = element('th', '', title); cell.scope = 'col'; row.append(cell); }
    head.append(row); table.append(head);
    const body = element('tbody');
    for (const sample of samples) {
      const row = element('tr');
      for (const text of [new Date(sample.at).toLocaleString(lang), value(sample.players), latency(sample.latencyMs), ...(hasOnline ? [value(sample.onlineSeconds ?? null)] : [])]) row.append(element('td', '', text));
      body.append(row);
    }
    table.append(body); scroll.append(table); details.append(scroll); section.append(details);
    return section;
  }
  function renderDetail(server, history) {
    const title = element('h2', '', server.name); title.id = 'server-detail-title';
    const host = element('p', 'server-host', `${typeLabel(server)} · ${server.hostLabel || t('client.servers.hostNotSpecified')} · ${server.region || t('client.servers.regionNotSpecified')}`);
    detailBody.replaceChildren(stateBadge(server), title, host, element('p', 'server-description', server.description || t('client.servers.noDescription')));
    detailBody.append(facts([[t('client.servers.playersCapacity'), players(server)], [t('client.servers.hostLatency'), latency(server.hostMedianLatencyMs)], [t('client.servers.gameBuild'), server.gameBuild || t('client.servers.unknown')]]));
    detailBody.append(element('p', 'server-history-note', t('client.servers.lastReport', {time: server.lastSeen ? new Date(server.lastSeen).toLocaleString(lang) : t('client.servers.unknown')})));
    const actions = element('div', 'server-detail-actions');
    if (server.online && server.join !== null) {
      const join = element('button', 'button', t('client.servers.openInManager')); join.type = 'button';
      join.addEventListener('click', () => { window.location.href = `modstoke://join/${server.id}`; });
      actions.append(join);
    } else actions.append(element('p', '', server.online ? t('client.servers.noJoinTarget') : t('client.servers.offlineNoJoin')));
    const share = element('a', 'inline-link', t('client.servers.permalink')); share.href = sharePath(server.id); actions.append(share);
    detailBody.append(actions, element('p', 'server-history-note', t('client.servers.joinNote')));
    detailBody.append(packageList(t('client.servers.components'), t('client.servers.noComponents'), server.components), packageList(t('client.servers.requiredModsTitle'), t('client.servers.noRequiredMods'), server.requiredMods));
    detailBody.append(element('h3', '', t('client.servers.settings')), facts([[t('client.servers.difficulty'), server.settings.difficulty || t('client.servers.unknown')], [t('client.servers.pvp'), yesNo(server.settings.pvp)], [t('client.servers.friendlyFire'), yesNo(server.settings.friendlyFire)], [t('client.servers.passwordRequired'), yesNo(server.settings.passwordRequired)]]));
    detailBody.append(historySection(history, server.id));
  }
  function detailMessage(title, message) {
    const heading = element('h2', '', title); heading.id = 'server-detail-title';
    detailBody.replaceChildren(heading, element('p', '', message));
  }
  async function loadDetail(id) {
    detailController?.abort();
    const controller = detailController = new AbortController();
    detailBody.setAttribute('aria-busy', 'true');
    // Remove stale join actions immediately while obtaining a fresh server report.
    detailMessage(t('client.servers.loadingTitle'), t('client.servers.loadingMessage'));
    const [serverResult, historyResult] = await Promise.allSettled([
      request(`/servers/${encodeURIComponent(id)}`, controller.signal, 64 * 1024),
      request(`/servers/${encodeURIComponent(id)}/history`, controller.signal, 256 * 1024)
    ]);
    if (controller.signal.aborted || selectedId !== id) return;
    detailBody.setAttribute('aria-busy', 'false');
    if (serverResult.status !== 'fulfilled') {
      detailMessage(serverResult.reason?.message === 'not-found' ? t('client.servers.goneTitle') : t('client.servers.detailUnavailableTitle'), t('client.servers.goneMessage')); return;
    }
    const body = serverResult.value;
    if (!object(body) || body.schemaVersion !== 1 || !validServer(body.server) || body.server.id.toLowerCase() !== id.toLowerCase()) {
      detailMessage(t('client.servers.detailUnavailableTitle'), t('client.servers.unsupportedReport')); return;
    }
    renderDetail(body.server, historyResult);
  }
  function openDetail(id) {
    selectedId = id;
    if (!dialog.open) dialog.showModal();
    if (!UUID.test(id)) { detailController?.abort(); detailMessage(t('client.servers.invalidTitle'), t('client.servers.invalidMessage')); return; }
    if (!document.hidden) loadDetail(id);
  }
  function readLocation() {
    const id = new URL(window.location.href).searchParams.get('server');
    if (id !== null) openDetail(id);
    else if (dialog.open) dialog.close();
  }
  function refresh() {
    if (document.hidden) return;
    refreshList();
    if (selectedId && UUID.test(selectedId)) loadDetail(selectedId);
  }
  function schedule() {
    clearInterval(refreshTimer);
    if (document.hidden) { listController?.abort(); detailController?.abort(); return; }
    refresh(); refreshTimer = setInterval(refresh, 60000);
  }
  document.querySelector('#server-filters').addEventListener('submit', event => { event.preventDefault(); renderList(); });
  search.addEventListener('input', renderList);
  status.addEventListener('change', renderList);
  kind.addEventListener('change', renderList);
  document.querySelector('#server-refresh').addEventListener('click', refresh);
  document.querySelector('#server-detail-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    detailController?.abort(); selectedId = null;
    const url = new URL(window.location.href); url.searchParams.delete('server');
    window.history.replaceState(null, '', url.pathname + url.search + url.hash);
  });
  window.addEventListener('popstate', readLocation);
  document.addEventListener('visibilitychange', schedule);
  schedule(); readLocation();
})();
