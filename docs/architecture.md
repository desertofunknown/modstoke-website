# Architecture

## Current application

The site is a static Node-generated portal. Templates render pages from curated project data. No browser framework, dependency installation, database or account is needed to build it.

Routes:

- `/`: game context, actual tool information and player/creator resources
- `/tools/`: Manager, Loader and SDK overviews; a secondary Admin status note
- `/mods/`: catalog status until approved inventory exists
- `/docs/`: project information and source-grounded preparation notes
- `/releases/`: dated development milestones and publication state
- `/release-index.json`: static selected Manager and Loader releases (currently empty)
- `/downloads/{product}/{version}/{fileName}`: immutable reviewed files, only after release approval
- `/releases/loader/latest/OpenACAILoader.manifest.json`: Loader schema-1 compatibility route, only when a complete verified Loader bundle is selected
- `/404/`: not-found page

The browser script filters already-rendered catalog rows. Test fixtures exercise populated states, but the public data validator rejects inventory until a publication adapter and its validation rules are ready. The catalog view model is not a new wire API.

## Existing clients and future integration

The Manager is a separate Tauri/Svelte/Rust desktop application. Its existing catalog client and the Loader updater have different contracts. A website redesign must not silently change either endpoint or native package layout.

The Loader discovers native mod packages under `OpenACAI/Mods`. Public preparation notes summarize the reviewed source behavior; they are not a stable SDK API guarantee. Test against the intended source revision and game build.

The local preview server exposes empty GET `/api/mods` and `/api/categories` response fixtures. The list envelope contains `meta` and `data`; category responses contain `data`. Pagination values are local fixture conventions. No upstream catalog service is contacted. While the release index is empty, no product downloads are exposed.

Product downloads use [`data/releases.json`](../data/releases.json), separate from the unpublished mod catalog and the Loader's installed-file manifest. A selected release must have a local reviewed artifact under ignored `artifacts/hosted/`. The build checks its size and SHA-256, copies it into a fresh `dist/downloads/` tree, and emits the same index read by the website. For a selected Loader bundle, it also emits the old schema-1 compatibility manifest after checking the ZIP against every recorded installed file. See [release publication](release-publication.md). The empty index currently emits no binary or Loader compatibility route.

Before implementing a production catalog, pin client parser fixtures, validate the actual field types and nullability, define approval and ownership rules, and decide how compatibility and release files will be verified. Catalog metadata, release metadata and updater manifests should remain separate interfaces.

## Trust boundaries

A file hash checks bytes against a supplied digest. It does not by itself authenticate a publisher or turn an unsigned update manifest into a signed one. Do not advertise secure automatic updating until the complete trust and installation flow has been implemented and verified.

The release index's signing and test evidence is manually reviewed metadata. The static site does not verify Authenticode signatures or implement installation. Manager remains responsible for checking the downloaded ZIP against the selected index and refusing incomplete or incompatible bundles.

There is no public upload endpoint, account system, signing service or production updater in this repository. Admin application source, player data and credentials do not belong in public website data or assets.

## Output safety

Builds write a fresh staging tree, then replace the serving root while preserving the previous output outside it. Concurrent builds are refused. ZIP packaging uses explicit file allowlists and verifies asset fingerprints. The local server rejects symlinked file paths and traversal outside its public root.

These safeguards are development defaults, not a substitute for deployment review. Cache policy, release activation and retention of approved old hashed assets are described in the hosting notes.
