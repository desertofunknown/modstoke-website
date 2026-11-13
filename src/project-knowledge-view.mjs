import { escapeHtml as e } from '../scripts/model.mjs';
import { selectedRelease } from './release-view.mjs';
import { translator } from './i18n.mjs';

export function projectKnowledgeSnapshot(data, releaseIndex) {
  const text = value => typeof value === 'string' && value.trim().length > 0;
  const topicIds = ['overview', 'sdk', 'loader', 'manager', 'roadmap', 'play', 'tithewood'];
  if (!data || data.schema !== 1 || !/^\d{4}-\d{2}-\d{2}$/.test(data.reviewedOn || '') ||
      !text(data.releaseStatus) || !Array.isArray(data.topics) || data.topics.length !== topicIds.length) {
    throw new Error('Invalid project knowledge document');
  }
  const seen = new Set();
  const topics = data.topics.map(topic => {
    if (!topic || !topicIds.includes(topic.id) || seen.has(topic.id) ||
        !text(topic.title) || !text(topic.summary) ||
        !Array.isArray(topic.facts) || !topic.facts.length || !topic.facts.every(text) ||
        !Array.isArray(topic.keywords) || !topic.keywords.length || !topic.keywords.every(text) ||
        !text(topic.url)) throw new Error('Invalid project knowledge topic');
    const url = new URL(topic.url);
    if (url.origin !== 'https://modstoke.com' || url.username || url.password) {
      throw new Error(`Invalid project knowledge URL for ${topic.id}`);
    }
    seen.add(topic.id);
    return {id: topic.id, title: topic.title, summary: topic.summary, facts: [...topic.facts], url: topic.url, keywords: [...topic.keywords]};
  });
  return {schema: data.schema, reviewedOn: data.reviewedOn, releaseStatus: releaseStatus(releaseIndex, translator('en').text), topics};
}

// What is published, in one language: t is a translator's t() for a page or text() for the feed.
// Versions need no escaping; validateReleaseIndex only lets letters, digits, dots, - and + through.
function releaseStatus(releaseIndex, t) {
  const manager = selectedRelease(releaseIndex, 'manager');
  const loader = selectedRelease(releaseIndex, 'loader');
  return [
    manager ? t(manager.channel === 'preview' ? 'knowledge.status.managerPreview' : 'knowledge.status.manager', { version: manager.version }) : t('knowledge.status.noManager'),
    manager?.artifacts.some(artifact => artifact.signatureStatus === 'unsigned-preview') && t('knowledge.status.unsigned'),
    loader ? t('knowledge.status.loader', { version: loader.version }) : t('knowledge.status.noLoader'),
    t('knowledge.status.check'),
  ].filter(Boolean).join(' ');
}

export function renderProjectKnowledge(knowledge, releaseIndex, i = translator('en')) {
  if (!knowledge) return '';
  const sdk = knowledge.topics.find(topic => topic.id === 'sdk');
  const play = knowledge.topics.find(topic => topic.id === 'play');
  const tithewood = knowledge.topics.find(topic => topic.id === 'tithewood');
  // The topics are English data; a language may translate them under knowledge.topics.<id>.
  const text = (topic, field) => i.own(`knowledge.topics.${topic.id}.${field}`) || e(topic[field]);
  const facts = topic => (i.own(`knowledge.topics.${topic.id}.facts`)?.split('\n') || topic.facts.map(e)).map(fact => `<p>${fact}</p>`).join('');
  return `<section id="sdk-development"><p class="eyebrow">${i.t('knowledge.sdkEyebrow')}</p><h2>${text(sdk, 'title')}</h2><p>${text(sdk, 'summary')}</p>${facts(sdk)}<p>${releaseStatus(releaseIndex, i.t)}</p><a class="inline-link" href="${i.href('/releases/')}">${i.t('knowledge.checkReleases')}</a></section><section id="play-together"><p class="eyebrow">${i.t('knowledge.playEyebrow')}</p><h2>${text(play, 'title')}</h2><p>${text(play, 'summary')}</p>${facts(play)}<p>${i.t('knowledge.gameInfo', { link: '<a class="inline-link" href="https://store.steampowered.com/app/1326470/Sons_Of_The_Forest/">' + i.t('knowledge.steamLink') + '</a>' })}</p><a class="inline-link" href="https://discord.gg/T2Tjh5ECS">${i.t('knowledge.findCrew')}</a></section><section id="tithewood"><p class="eyebrow">${i.t('knowledge.tithewoodEyebrow')}</p><h2>${text(tithewood, 'title')}</h2><p>${text(tithewood, 'summary')}</p>${facts(tithewood)}<a class="inline-link" href="https://tithewood.com/">${i.t('knowledge.visitTithewood')}</a></section>`;
}
