import { arrow, discordUrl, panelUrl } from './layout.mjs';
import { translator } from './i18n.mjs';

// The plans and minimums follow docs/DESIGN.md in the modstoke-hosting repo. Prices are monthly, in US dollars.
export const plans = [
  { id: 'small', name: 'Small', players: 4, cores: 2, memory: 8, disk: 30, minimum: 12 },
  { id: 'standard', name: 'Standard', players: 8, cores: 2, memory: 10, disk: 40, minimum: 15 },
];

const plan = (p, i) => `<article class="plan">
  <h3>${i.t(`hosting.plans.${p.id}`)}</h3>
  <p class="plan-price">${i.t('hosting.plans.price', { price: `<span class="mono">$${p.minimum}</span>` })}</p>
  <dl>
    <div><dt>${i.t('hosting.plans.players')}</dt><dd>${i.t('hosting.plans.upTo', { count: p.players })}</dd></div>
    <div><dt>${i.t('hosting.plans.cpu')}</dt><dd>${i.t('hosting.plans.cores', { cores: p.cores })}</dd></div>
    <div><dt>${i.t('hosting.plans.memory')}</dt><dd>${i.t('hosting.plans.memorySize', { memory: p.memory })}</dd></div>
    <div><dt>${i.t('hosting.plans.storage')}</dt><dd>${i.t('hosting.plans.storageSize', { disk: p.disk })}</dd></div>
  </dl>
</article>`;

export function renderHosting(i = translator('en')) {
  return `<section class="page-head wrap">
  <p class="eyebrow">${i.t('hosting.eyebrow')}</p>
  <h1>${i.t('hosting.title')}</h1>
  <p class="lede">${i.t('hosting.lede')}</p>
  <p class="status-line">${i.t('hosting.status')}</p>
</section>

<section class="wrap block">
  <h2 class="sr-only">${i.t('hosting.plans.heading')}</h2>
  <div class="plans">
${plans.map(p => plan(p, i)).join('\n')}
  </div>
  <p class="list-note">${i.t('hosting.plans.note')}</p>
</section>

<section class="wrap block setup">
  <div>
    <h2>${i.t('hosting.get.title')}</h2>
    <ul class="checklist">
      <li><strong>${i.t('hosting.get.cores.title')}</strong> ${i.t('hosting.get.cores.body')}</li>
      <li><strong>${i.t('hosting.get.modstoke.title')}</strong> ${i.t('hosting.get.modstoke.body')}</li>
      <li><strong>${i.t('hosting.get.find.title')}</strong> ${i.t('hosting.get.find.body', { servers: `<a href="${i.href('/servers/')}">${i.t('hosting.get.find.link')}</a>` })}</li>
      <li><strong>${i.t('hosting.get.admin.title')}</strong> ${i.t('hosting.get.admin.body')}</li>
      <li><strong>${i.t('hosting.get.panel.title')}</strong> ${i.t('hosting.get.panel.body')}</li>
      <li><strong>${i.t('hosting.get.world.title')}</strong> ${i.t('hosting.get.world.body')}</li>
      <li><strong>${i.t('hosting.get.discord.title')}</strong> ${i.t('hosting.get.discord.body')}</li>
      <li><strong>${i.t('hosting.get.coast.title')}</strong> ${i.t('hosting.get.coast.body')}</li>
    </ul>
  </div>
  <div>
    <h2>${i.t('hosting.how.title')}</h2>
    <ol class="steps">
      <li><strong>${i.t('hosting.how.apply.title')}</strong> ${i.t('hosting.how.apply.body')}</li>
      <li><strong>${i.t('hosting.how.review.title')}</strong> ${i.t('hosting.how.review.body')}</li>
      <li><strong>${i.t('hosting.how.pay.title')}</strong> ${i.t('hosting.how.pay.body')}</li>
      <li><strong>${i.t('hosting.how.play.title')}</strong> ${i.t('hosting.how.play.body', { panel: `<a href="${panelUrl}">${i.t('hosting.how.play.link')}</a>` })}</li>
    </ol>
  </div>
</section>

<section class="wrap block">
  <div class="prose faq">
  <h2>${i.t('hosting.faq.title')}</h2>
  <h3>${i.t('hosting.faq.players.q')}</h3>
  <p>${i.t('hosting.faq.players.a')}</p>
  <h3>${i.t('hosting.faq.mods.q')}</h3>
  <p>${i.t('hosting.faq.mods.a')}</p>
  <h3>${i.t('hosting.faq.payment.q')}</h3>
  <p>${i.t('hosting.faq.payment.a')}</p>
  <h3>${i.t('hosting.faq.apply.q')}</h3>
  <p>${i.t('hosting.faq.apply.a')}</p>
  <h3>${i.t('hosting.faq.rules.q')}</h3>
  <p>${i.t('hosting.faq.rules.a', { terms: `<a href="${i.href('/terms/#hosting')}">${i.t('hosting.faq.rules.termsLink')}</a>`, privacy: `<a href="${i.href('/privacy/')}">${i.t('hosting.faq.rules.privacyLink')}</a>` })}</p>
  </div>
</section>

<section class="wrap block together">
  <div>
    <h2>${i.t('hosting.beta.title')}</h2>
    <p>${i.t('hosting.beta.body', { gamhon: `<a href="${i.href('/support/#gamhon')}">GAMHON</a>` })}</p>
    <p>${i.t('hosting.beta.have', { panel: `<a href="${panelUrl}">${i.t('hosting.beta.panelLink')}</a>` })}</p>
  </div>
  <div class="actions"><a class="button" href="${discordUrl}">${i.t('hosting.beta.ask')} ${arrow}</a><a class="button button-quiet" href="${panelUrl}register">${i.t('hosting.beta.code')}</a><a class="button button-quiet" href="${i.href('/servers/')}">${i.t('hosting.beta.servers')}</a></div>
</section>`;
}
