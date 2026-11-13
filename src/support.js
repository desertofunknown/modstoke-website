// Donation form on /support/. The page works without it; with no API, the form stays hidden and
// the "open soon" note shows. PayPal's SDK can only load in one mode at a time, so switching
// between one-time and monthly reloads it.
(() => {
  const form = document.querySelector('#donate');
  const closed = document.querySelector('#donate-closed');
  const status = document.querySelector('#donate-status');
  const holder = document.querySelector('#paypal-buttons');
  if (!form) return;

  const text = JSON.parse(document.getElementById('site-text')?.textContent || '{}');
  const t = (key, values) => String(text[key] ?? key).replace(/\{(\w+)\}/g, (all, name) => values?.[name] ?? all);

  let config;
  let sdk;

  const amount = () => {
    const other = Number(form.elements.other.value);
    if (form.elements.other.value !== '') return Number.isInteger(other) ? other : NaN;
    return Number(form.elements.amount.value);
  };
  const valid = value => Number.isInteger(value) && value >= config.minimum && value <= config.maximum;
  const say = text => { status.textContent = text; };

  const post = async (path, body) => {
    const response = await fetch(`/api/support/v1/${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'request failed');
    return data;
  };

  function loadSdk(kind) {
    sdk?.remove();
    holder.replaceChildren();
    // Pay Later doesn't make sense for a donation.
    const params = new URLSearchParams({ 'client-id': config.clientId, currency: config.currency, components: 'buttons', 'disable-funding': 'paylater' });
    if (kind === 'monthly') { params.set('vault', 'true'); params.set('intent', 'subscription'); }
    sdk = document.createElement('script');
    sdk.src = `https://www.paypal.com/sdk/js?${params}`;
    sdk.onload = () => render(kind);
    sdk.onerror = () => say(t('client.support.paypalFailed'));
    document.head.append(sdk);
  }

  function render(kind) {
    const options = {
      style: { layout: 'vertical', color: 'gold', shape: 'rect', label: kind === 'monthly' ? 'subscribe' : 'donate' },
      onClick: (data, actions) => {
        if (valid(amount())) { say(''); return actions.resolve(); }
        say(t('client.support.pickAmount', { min: config.minimum, max: config.maximum }));
        return actions.reject();
      },
      onCancel: () => say(t('client.support.cancelled')),
      onError: () => say(t('client.support.error')),
    };
    if (kind === 'monthly') {
      options.createSubscription = (data, actions) => actions.subscription.create({ plan_id: config.monthlyPlanId, quantity: String(amount()) });
      options.onApprove = async data => {
        const result = await post('subscriptions', { id: data.subscriptionID });
        say(t('client.support.monthlyThanks', { amount: result.amount }));
      };
    } else {
      options.createOrder = async () => (await post('orders', { amount: amount() })).id;
      options.onApprove = async data => {
        const result = await post(`orders/${data.orderID}/capture`, {});
        say(result.status === 'COMPLETED' ? t('client.support.thanks', { amount: result.amount }) : t('client.support.processing'));
      };
    }
    window.paypal.Buttons(options).render(holder);
  }

  fetch('/api/support/v1/config')
    .then(response => response.ok ? response.json() : Promise.reject())
    .then(data => {
      config = data;
      if (!config.monthlyPlanId) form.querySelector('input[value="monthly"]').closest('label').remove();
      form.hidden = false;
      closed.hidden = true;
      form.addEventListener('change', event => { if (event.target.name === 'kind') loadSdk(event.target.value); });
      form.elements.other.addEventListener('input', () => { if (form.elements.other.value) form.querySelectorAll('input[name="amount"]').forEach(input => { input.checked = false; }); });
      loadSdk('once');
    })
    .catch(() => {});
})();
