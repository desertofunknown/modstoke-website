# Architecture

## Current application

The site is a static Node-generated portal. Templates render pages from curated project data. No browser framework, dependency installation, database or account is needed to build it.

Routes:

- `/`: game context, actual tool information and player/creator resources
- `/tools/`: Manager, Loader and SDK overviews; a secondary Admin status note
- `/mods/`: catalog status until approved inventory exists
- `/docs/`: project information and source-grounded preparation notes
- `/releases/`: dated development milestones and publication state
- `/404/`: not-found page

The browser script filters already-rendered catalog rows. Test fixtures exercise populated states, but the public data validator rejects inventory until a publication adapter and its validation rules are ready. The catalog view model is not a new wire API.

## Existing clients and future integration

The Manager is a separate Tauri/Svelte/Rust desktop application. Its existing catalog client and the Loader updater have different contracts. A website redesign must not silently change either endpoint or native package layout.

The Loader discovers native mod packages under `OpenACAI/Mods`. Public preparation notes summarize the reviewed source behavior; they are not a stable SDK API guarantee. Test against the intended source revision and game build.

The local preview server exposes empty GET `/api/mods` and `/api/categories` response fixtures. The list envelope contains `meta` and `data`; category responses contain `data`. Pagination values are local fixture conventions. No upstream service is contacted, no real records are included and no downloads are exposed.

Before implementing a production catalog, pin client parser fixtures, validate the actual field types and nullability, define approval and ownership rules, and decide how compatibility and release files will be verified. Catalog metadata, release metadata and updater manifests should remain separate interfaces.

## Trust boundaries

A file hash checks bytes against a supplied digest. It does not by itself authenticate a publisher or turn an unsigned update manifest into a signed one. Do not advertise secure automatic updating until the complete trust and installation flow has been implemented and verified.

There is no public upload endpoint, account system, signing service or production updater in this repository. Admin application source, player data and credentials do not belong in public website data or assets.

## Output safety

Builds write a fresh staging tree, then replace the serving root while preserving the previous output outside it. Concurrent builds are refused. ZIP packaging uses explicit file allowlists and verifies asset fingerprints. The local server rejects symlinked file paths and traversal outside its public root.

These safeguards are development defaults, not a substitute for deployment review. Cache policy, release activation and retention of approved old hashed assets are described in the hosting notes.
