import { renderProjectKnowledge } from './project-knowledge-view.mjs';

export function renderDocs({ projectKnowledge }) {
  const knowledge = renderProjectKnowledge(projectKnowledge);
  return `<section class="page-head wrap">
  <p class="eyebrow">Docs</p>
  <h1>Notes for players and mod authors</h1>
  <p class="lede">Setup help lives in the <a href="/guides/">guides</a>. This page covers how the pieces fit together and what to know before you build a mod.</p>
</section>
<div class="wrap docs">
  <nav class="docs-nav" aria-label="On this page">
    <a href="#project">The project</a>
    <a href="#players">For players</a>
    <a href="#compatibility">Game compatibility</a>
    <a href="#authors">For mod authors</a>
    ${knowledge ? '<a href="#sdk-development">SDK development</a><a href="#play-together">Play together</a><a href="#tithewood">Tithewood</a>' : ''}
    <a href="#downloads">Downloads and updates</a>
  </nav>
  <div class="docs-body">
    <section id="project">
      <h2>The project</h2>
      <p>Modstoke is a modding project by OpenACAI, a nonprofit. It's a mod loader, a desktop manager and a set of mods for Sons of the Forest, with a community around them on Discord. Everything is free and you don't need an account to use this site.</p>
      <p>We aren't connected to Endnight Games. Please don't take Modstoke problems to their support.</p>
    </section>
    <section id="players">
      <h2>For players</h2>
      <p>Start with the <a href="/tools/#manager">Manager</a>. It finds your game, installs the <a href="/tools/#loader">Loader</a> and keeps track of what you've installed. Then pick from the <a href="/mods/">mods</a>; for now they download from Nexus Mods.</p>
      <p>The <a href="/guides/install-modstoke-manager/">install guide</a> covers backing up your saves first, and the <a href="/guides/sons-of-the-forest-mod-troubleshooting/">troubleshooting guide</a> helps narrow down a problem.</p>
    </section>
    <section id="compatibility">
      <h2>Game compatibility</h2>
      <div class="compat-row"><strong>Sons of the Forest</strong><span>Supported</span></div>
      <p>Each release lists the game builds it was tested on. If a release doesn't list one, it hasn't been checked against a specific build yet, so try it on a copy of your save.</p>
    </section>
    <section id="authors">
      <h2>For mod authors</h2>
      <p>This is how the current Loader finds and starts a native mod. Check it against the Loader source you build with; the manifest isn't a frozen schema yet.</p>
      <ol class="checklist">
        <li><strong>Build against the Loader you test with.</strong> The SDK interfaces live in the Loader. Reference its assembly from your project and note the Loader version and game build you tested.</li>
        <li><strong>Use one package folder.</strong> The Loader looks under <code>Modstoke/Mods/&lt;package&gt;/</code>, up to four folders deep. <code>OpenACAI/Mods/</code> from before the rename still works. Keep the manifest next to its assembly.</li>
        <li><strong>Describe the entry point.</strong> The manifest can be <code>openacai.mod.json</code>, <code>openacai.json</code> or <code>manifest.json</code>, with id, name, version, author, assembly, entryType and entryMethod. entryMethod can be left out when the entry type has a public parameterless constructor.</li>
        <li><strong>Test on a separate copy of the game.</strong> Keep your real saves out of it. Write down the game build, Loader version, dependencies and anything that doesn't work yet.</li>
        <li><strong>Ship notes with the files.</strong> Version notes, install and removal steps, the licence and file hashes. There's no upload form here yet; the store will take submissions from GitHub releases.</li>
      </ol>
    </section>
    ${knowledge}
    <section id="downloads">
      <h2>Downloads and updates</h2>
      <p>Every release on the <a href="/releases/">Releases</a> page lists its version, changes, compatibility, size and SHA-256, so you can check a file you downloaded is the one we published.</p>
      <p>A checksum tells you the bytes match; it doesn't prove who published them. The Modstoke store will add signatures for that, so the Manager can refuse anything that wasn't published by us or a reviewed author.</p>
    </section>
  </div>
</div>`;
}
