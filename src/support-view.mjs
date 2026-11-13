import { arrow, discordUrl } from './layout.mjs';
import { translator } from './i18n.mjs';

const amounts = [5, 10, 25, 50];

export function renderSupport(i = translator('en')) {
  return `<section class="page-head wrap">
  <p class="eyebrow">${i.t('support.eyebrow')}</p>
  <h1>${i.t('support.title')}</h1>
  <p class="lede">${i.t('support.lede')}</p>
</section>

<section class="wrap block support">
  <div class="donate-panel">
    <h2>${i.t('support.donate.title')}</h2>
    <form class="donate" id="donate" hidden>
      <fieldset class="segmented">
        <legend class="sr-only">${i.t('support.donate.often')}</legend>
        <label><input type="radio" name="kind" value="once" checked><span>${i.t('support.donate.once')}</span></label>
        <label><input type="radio" name="kind" value="monthly"><span>${i.t('support.donate.monthly')}</span></label>
      </fieldset>
      <fieldset class="segmented amounts">
        <legend class="sr-only">${i.t('support.donate.amount')}</legend>
${amounts.map((amount, n) => `        <label><input type="radio" name="amount" value="${amount}"${n === 1 ? ' checked' : ''}><span>$${amount}</span></label>`).join('\n')}
        <label class="other"><span class="sr-only">${i.t('support.donate.otherLabel')}</span><input type="number" name="other" min="2" max="1000" step="1" inputmode="numeric" placeholder="${i.t('support.donate.otherPlaceholder')}"></label>
      </fieldset>
      <div id="paypal-buttons" class="paypal-buttons"></div>
      <p class="donate-status" id="donate-status" role="status"></p>
    </form>
    <p class="donate-closed" id="donate-closed">${i.t('support.donate.closed', { discord: `<a href="${discordUrl}">Discord</a>` })}</p>
    <p class="aside-note">${i.t('support.donate.note')}</p>
  </div>
  <div>
    <h2>${i.t('support.roles.title')}</h2>
    <p>${i.t('support.roles.intro')}</p>
    <dl class="roles">
      <div><dt>${i.t('support.roles.supporter.name')}</dt><dd>${i.t('support.roles.supporter.text')}</dd></div>
      <div><dt>${i.t('support.roles.monthly.name')}</dt><dd>${i.t('support.roles.monthly.text')}</dd></div>
      <div><dt>${i.t('support.roles.host.name')}</dt><dd>${i.t('support.roles.host.text', { hosting: `<a href="${i.href('/hosting/')}">${i.t('support.roles.host.link')}</a>` })}</dd></div>
    </dl>
    <p>${i.t('support.roles.note')}</p>
  </div>
</section>

<section class="wrap block setup" id="gamhon">
  <div>
    <h2>${i.t('support.gamhon.title')}</h2>
    <p>${i.t('support.gamhon.what')}</p>
    <p>${i.t('support.gamhon.modding')}</p>
    <p>${i.t('support.gamhon.money', { hosting: `<a href="${i.href('/hosting/')}">${i.t('support.gamhon.hostingLink')}</a>` })}</p>
    <p class="aside-note">${i.t('support.gamhon.crisis')}</p>
    <p><a class="text-link" href="https://openacai.com/g-a-m-h-o-n/">${i.t('support.gamhon.more')} ${arrow}</a></p>
  </div>
  <div>
    <h2>${i.t('support.where.title')}</h2>
    <p>${i.t('support.where.body')}</p>
    <p><a class="text-link" href="${discordUrl}">${i.t('support.where.ask')} ${arrow}</a></p>
  </div>
</section>`;
}
