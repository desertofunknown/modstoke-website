import { arrow, discordUrl, panelUrl } from './layout.mjs';

// The plans and minimums follow docs/DESIGN.md in the modstoke-hosting repo. Prices are monthly, in US dollars.
export const plans = [
  { name: 'Small', players: 'Up to 4', cores: 2, memory: 8, disk: 30, minimum: 12 },
  { name: 'Standard', players: 'Up to 8', cores: 2, memory: 10, disk: 40, minimum: 15 },
];

const plan = p => `<article class="plan">
  <h3>${p.name}</h3>
  <p class="plan-price"><span class="mono">$${p.minimum}</span> a month, or more if you like</p>
  <dl>
    <div><dt>Players</dt><dd>${p.players}</dd></div>
    <div><dt>CPU</dt><dd>${p.cores} dedicated cores</dd></div>
    <div><dt>Memory</dt><dd>${p.memory} GB</dd></div>
    <div><dt>Storage</dt><dd>${p.disk} GB on NVMe</dd></div>
  </dl>
</article>`;

export function renderHosting() {
  return `<section class="page-head wrap">
  <p class="eyebrow">Server hosting</p>
  <h1>Rent a Sons of the Forest server</h1>
  <p class="lede">A dedicated server on our own hardware, with the Modstoke Loader and our mods ready to go. OpenACAI runs it as a nonprofit, and what you pay keeps the servers and the mods going.</p>
  <p class="status-line">Opening soon, starting with a small beta for members of our Discord.</p>
</section>

<section class="wrap block">
  <h2 class="sr-only">Plans</h2>
  <div class="plans">
${plans.map(plan).join('\n')}
  </div>
  <p class="list-note">Each plan has a minimum. At checkout you can pay more if you want to. Anything above the minimum counts as a donation to OpenACAI and shows as its own line on your receipt. A 16-player plan comes later, once we've tested one properly.</p>
</section>

<section class="wrap block setup">
  <div>
    <h2>What you get</h2>
    <ul class="checklist">
      <li><strong>Cores of your own.</strong> Your server's CPU cores aren't shared with anyone else's.</li>
      <li><strong>Modstoke set up.</strong> The Loader is installed and kept up to date, and our mods are a click away.</li>
      <li><strong>Easy to find.</strong> It shows up in the game's server browser, and on our <a href="/servers/">Servers page</a> with a Manager join link if you want it listed.</li>
      <li><strong>Admin tools.</strong> Modstoke Admin knows you as the owner through your Steam account.</li>
      <li><strong>A simple control panel.</strong> Drag files and folders straight in, watch the console, see who's playing and run commands, all from one screen.</li>
      <li><strong>Your world, yours to keep.</strong> A backup every day, kept for a week, and one click to download your world to your own PC.</li>
      <li><strong>A home on our Discord.</strong> Your server gets its own announcements and chat channels, and your staff get moderation alerts.</li>
      <li><strong>Close to the East Coast.</strong> Hosted in New Jersey on a 1 Gbps line.</li>
    </ul>
  </div>
  <div>
    <h2>How it works</h2>
    <ol class="steps">
      <li><strong>Apply.</strong> Sign in with Discord, link your Steam account and tell us what the server's for.</li>
      <li><strong>We review it.</strong> A person on our team reads every application.</li>
      <li><strong>Pay with PayPal.</strong> Choose a plan and how much you'd like to pay. It renews monthly, and you can cancel any time.</li>
      <li><strong>Play.</strong> Your server starts within minutes, and you run it from <a href="${panelUrl}">the panel</a>.</li>
    </ol>
  </div>
</section>

<section class="wrap block">
  <div class="prose faq">
  <h2>Questions</h2>
  <h3>Can I have more than 8 players?</h3>
  <p>Not yet. Eight is the game's own limit. Our Loader can lift it, and we'll add a 16-player plan once we've run one with real players.</p>
  <h3>Can I add my own mods?</h3>
  <p>Yes, through the file manager. Your server runs in its own space, apart from everyone else's.</p>
  <h3>What happens if a payment fails?</h3>
  <p>After a few days' grace your server pauses. We keep its files for 14 days, so you can pick up where you left off.</p>
  <h3>Why do I have to apply?</h3>
  <p>We're a small nonprofit sharing one machine, so we want to know who's on it. It keeps things fair and safe for everyone.</p>
  <h3>What are the rules?</h3>
  <p>The <a href="/terms/#hosting">Terms of Service</a> cover hosting, including refunds and what happens to your files when a server ends. The <a href="/privacy/">Privacy Policy</a> says what we keep.</p>
  </div>
</section>

<section class="wrap block together">
  <div>
    <h2>Want in on the beta?</h2>
    <p>Ask in our Discord and we'll add you to the list. Hosting is part of <a href="/support/#gamhon">GAMHON</a>, OpenACAI's program for mental health and social connection through games.</p>
    <p>Already have a server? <a href="${panelUrl}">Open the panel</a> to run it.</p>
  </div>
  <div class="actions"><a class="button" href="${discordUrl}">Ask on Discord ${arrow}</a><a class="button button-quiet" href="${panelUrl}register">I have a beta code</a><a class="button button-quiet" href="/servers/">Community servers</a></div>
</section>`;
}
