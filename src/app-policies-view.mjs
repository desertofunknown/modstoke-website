import { escapeHtml as e } from '../scripts/model.mjs';
import { translator } from './i18n.mjs';

function policyPage(title, description, sections, i) {
  return `<nav class="guide-breadcrumbs" aria-label="${i.t('apps.breadcrumb')}"><ol><li><a href="${i.href('/')}">${i.t('apps.home')}</a></li><li aria-current="page">${title}</li></ol></nav>
    <header class="page-hero compact guide-hero"><p class="eyebrow">${i.t('apps.eyebrow')}</p><h1>${title}</h1><p class="page-lede">${description}</p><p>${i.t('apps.effective', { date: `<time datetime="2026-10-19">${i.t('apps.effectiveDate')}</time>` })}</p></header>
    <div class="guide-layout"><nav class="guide-contents" aria-label="${i.t('apps.onThisPage')}"><h2>${i.t('apps.onThisPage')}</h2><ol>${sections.map(([id, heading]) => `<li><a href="#${e(id)}">${heading}</a></li>`).join('')}</ol></nav><article class="guide-body">${sections.map(([id, heading, content]) => `<section id="${e(id)}"><h2>${heading}</h2>${content}</section>`).join('')}</article></div>`;
}

export function renderAppPolicies(i = translator('en')) {
  const email = '<a href="mailto:legal@openacai.com">legal@openacai.com</a>';
  const contactPage = `<a href="https://openacai.com/contact/">${i.t('apps.contactPage')}</a>`;
  const alerts = '<code>/crew alerts</code>';
  const quiet = '<code>/companion quiet</code>';

  const appsTitle = i.t('apps.index.title');
  const appsDescription = i.t('apps.index.description');
  const apps = policyPage(appsTitle, appsDescription, [
    ['sentinel', i.t('apps.index.sentinel.heading'), `<p>${i.t('apps.index.sentinel.intro')}</p><p><a href="https://discord.com/oauth2/authorize?client_id=1203537957152231526&amp;integration_type=0">${i.t('apps.index.sentinel.add')}</a></p><p>${i.t('apps.index.sentinel.install', { configure: '<code>/sentinel configure</code>', setup: '<code>/setup</code>' })}</p><p>${i.t('apps.index.sentinel.permissions')}</p>`],
    ['radio', i.t('apps.index.radio.heading'), `<p>${i.t('apps.index.radio.intro')}</p><p><a href="https://discord.com/oauth2/authorize?client_id=1561647543966769223&amp;integration_type=0">${i.t('apps.index.radio.add')}</a></p><p>${i.t('apps.index.radio.install')}</p><p>${i.t('apps.index.radio.limits')}</p>`],
    ['support', i.t('apps.index.support.heading'), `<p>${i.t('apps.index.support.preview')}</p><p>${i.t('apps.index.support.read', { privacy: `<a href="${i.href('/apps/privacy/')}">${i.t('apps.index.support.privacy')}</a>`, terms: `<a href="${i.href('/apps/terms/')}">${i.t('apps.index.support.terms')}</a>`, community: `<a href="https://discord.gg/T2Tjh5ECS">${i.t('apps.index.support.community')}</a>` })}</p>`],
  ], i);

  const privacyTitle = i.t('apps.privacy.title');
  const privacyDescription = i.t('apps.privacy.description');
  const privacy = policyPage(privacyTitle, privacyDescription, [
    ['scope', i.t('apps.privacy.scope.heading'), `<p>${i.t('apps.privacy.scope.operator')}</p><p>${i.t('apps.privacy.scope.supplement', { privacy: `<a href="${i.href('/privacy/')}">${i.t('apps.privacy.scope.privacyLink')}</a>`, terms: `<a href="${i.href('/apps/terms/')}">${i.t('apps.privacy.scope.termsLink')}</a>`, apps: `<a href="${i.href('/apps/')}">${i.t('apps.privacy.scope.appsLink')}</a>` })}</p>`],
    ['sentinel', i.t('apps.privacy.sentinel.heading'), `<p>${i.t('apps.privacy.sentinel.inactive')}</p><p>${i.t('apps.privacy.sentinel.model')}</p><p>${i.t('apps.privacy.sentinel.ledger')}</p>`],
    ['crew', i.t('apps.privacy.crew.heading'), `<p>${i.t('apps.privacy.crew.records')}</p><p>${i.t('apps.privacy.crew.alerts', { alerts, quiet })}</p><p>${i.t('apps.privacy.crew.leave')}</p>`],
    ['radio', i.t('apps.privacy.radio.heading'), `<p>${i.t('apps.privacy.radio.intents')}</p><p>${i.t('apps.privacy.radio.media')}</p><p>${i.t('apps.privacy.radio.fetch')}</p>`],
    ['hosting', i.t('apps.privacy.hosting.heading'), `<p>${i.t('apps.privacy.hosting.vps')}</p><p>${i.t('apps.privacy.hosting.discord')}</p>`],
    ['removal', i.t('apps.privacy.removal.heading'), `<p>${i.t('apps.privacy.removal.purge')}</p><p>${i.t('apps.privacy.removal.home')}</p>`],
    ['requests', i.t('apps.privacy.requests.heading'), `<p>${i.t('apps.privacy.requests.contact', { email, page: contactPage })}</p><p>${i.t('apps.privacy.requests.different')}</p>`],
  ], i);

  const termsTitle = i.t('apps.terms.title');
  const termsDescription = i.t('apps.terms.description');
  const terms = policyPage(termsTitle, termsDescription, [
    ['scope', i.t('apps.terms.scope.heading'), `<p>${i.t('apps.terms.scope.operator', { terms: `<a href="${i.href('/terms/')}">${i.t('apps.terms.scope.termsLink')}</a>`, privacy: `<a href="${i.href('/apps/privacy/')}">${i.t('apps.terms.scope.privacyLink')}</a>` })}</p><p>${i.t('apps.terms.scope.install', { apps: `<a href="${i.href('/apps/')}">${i.t('apps.terms.scope.appsLink')}</a>` })}</p>`],
    ['use', i.t('apps.terms.use.heading'), `<p>${i.t('apps.terms.use.rules')}</p><p>${i.t('apps.terms.use.media')}</p>`],
    ['features', i.t('apps.terms.features.heading'), `<p>${i.t('apps.terms.features.besteffort')}</p><p>${i.t('apps.terms.features.radio')}</p>`],
    ['moderation', i.t('apps.terms.moderation.heading'), `<p>${i.t('apps.terms.moderation.appeals')}</p><p>${i.t('apps.terms.moderation.owners')}</p><p>${i.t('apps.terms.moderation.removal', { privacy: `<a href="${i.href('/apps/privacy/')}#removal">${i.t('apps.terms.moderation.privacyLink')}</a>` })}</p>`],
    ['controls', i.t('apps.terms.controls.heading'), `<p>${i.t('apps.terms.controls.controls', { alerts, quiet, contact: `<a href="${i.href('/apps/privacy/')}#requests">${i.t('apps.terms.controls.contactLink')}</a>` })}</p><p>${i.t('apps.terms.controls.questions', { email, page: contactPage })}</p>`],
  ], i);

  return [
    ['/apps/', appsTitle, appsDescription, apps],
    ['/apps/privacy/', privacyTitle, privacyDescription, privacy],
    ['/apps/terms/', termsTitle, termsDescription, terms],
  ];
}
