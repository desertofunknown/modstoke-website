import { escapeHtml as e } from '../scripts/model.mjs';
import { selectedRelease } from './release-view.mjs';

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
  const latestManager = selectedRelease(releaseIndex, 'manager');
  const latestLoader = selectedRelease(releaseIndex, 'loader');
  const managerStatus = latestManager
    ? `Manager ${latestManager.version} is available${latestManager.channel === 'preview' ? ' as a Windows preview' : ''}.${latestManager.artifacts.some(artifact => artifact.signatureStatus === 'unsigned-preview') ? ' The preview is unsigned.' : ''}`
    : 'No Manager package is currently published.';
  const loaderStatus = latestLoader
    ? `Loader ${latestLoader.version} is listed on Releases. Check its bundle contents, compatibility and validation status.`
    : 'The complete Loader, SDK and client bundle is not publicly released.';
  return {schema: data.schema, reviewedOn: data.reviewedOn, releaseStatus: `${managerStatus} ${loaderStatus} Check Releases before downloading.`, topics};
}

export function renderProjectKnowledge(knowledge) {
  if (!knowledge) return '';
  const sdk = knowledge.topics.find(topic => topic.id === 'sdk');
  const play = knowledge.topics.find(topic => topic.id === 'play');
  const tithewood = knowledge.topics.find(topic => topic.id === 'tithewood');
  const facts = topic => topic.facts.map(fact => `<p>${e(fact)}</p>`).join('');
  return `<section id="sdk-development"><p class="eyebrow">SDK DEVELOPMENT</p><h2>${e(sdk.title)}</h2><p>${e(sdk.summary)}</p>${facts(sdk)}<p>${e(knowledge.releaseStatus)}</p><a class="inline-link" href="/releases/">Check release status</a></section><section id="play-together"><p class="eyebrow">PLAY TOGETHER</p><h2>${e(play.title)}</h2><p>${e(play.summary)}</p>${facts(play)}<p>Game information: <a class="inline-link" href="https://store.steampowered.com/app/1326470/Sons_Of_The_Forest/">Sons of the Forest on Steam</a></p><a class="inline-link" href="https://discord.gg/T2Tjh5ECS">Find a crew on Discord</a></section><section id="tithewood"><p class="eyebrow">TITHEWOOD</p><h2>${e(tithewood.title)}</h2><p>${e(tithewood.summary)}</p>${facts(tithewood)}<a class="inline-link" href="https://tithewood.com/">Visit Tithewood for current access information</a></section>`;
}
