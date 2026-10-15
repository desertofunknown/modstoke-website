# Modstoke website

A community-oriented website for Modstoke, the free modding tools project by OpenACAI. Sons of the Forest is the initial game focus.

This repository contains the static portal: tool overviews, player and creator documentation, development notes and an unpublished mod catalog. It does not contain Manager, Loader, SDK or Admin binaries.

## Requirements

- Node.js 24
- Python 3 for ZIP packaging and for checking a future Loader release archive

There are no npm dependencies and no database or credentials are required.

## Development

```sh
npm run check
npm run dev
```

Open http://127.0.0.1:4173 on the same computer. Set `PORT` to change the port. The server binds to loopback. Restart it after editing source; there is no hot-reload service.

```sh
npm run build
```

The build writes `dist/`. Serve that directory through a web server rather than opening HTML through `file://`.

## Project layout

- `src/templates.mjs`: page content and layout
- `src/catalog-view.mjs`: catalog presentation
- `src/style.css`: responsive styling
- `src/app.js`: catalog filtering for future published inventory
- `data/site.json`: product, game and publication state
- `data/releases.json`: reviewed product download selection (currently empty)
- `scripts/`: build, local server, packaging and checks
- `test/`: Node test-runner tests
- `docs/`: architecture and hosting notes

## Publication state

The catalog and legacy releases arrays in `data/site.json` remain empty. Product downloads use a separate validated `data/releases.json` adapter. Its current latest pointers are null, so the generated `/release-index.json` has no downloadable artifacts. A screenshot of a desktop catalog is not an approval to copy those entries or distribute their files.

Manager and Loader downloads are not currently published by this website. The SDK interfaces live with the Loader. A complete future player bundle also requires a distinct client companion that has not been built or accepted yet. Admin has a public repository with project documentation; its source import is pending, and there is no downloadable Admin package here. See [release publication](docs/release-publication.md) for the exact file, index and verification gates.

The local server includes empty catalog/category response fixtures to support integration work. They are not a production backend or an updater service. See [architecture](docs/architecture.md).

## Product screenshots

Screenshot binaries are excluded from the public source bundle. The site builds without them and does not render broken images or placeholder screenshots.

For an authorized visual preview, optional captures can be supplied at:

- `src/assets/manager-catalog.png`
- `src/assets/admin-world-preview.png`

Review the complete image for account names, player identifiers, credentials and private desktop content before adding it. The existing captions distinguish a development capture from a released product; do not remove those qualifications without checking the facts. Merely adding an image locally does not authorize publishing it.

## Checks

`npm run check` runs syntax checks, unit tests, a static build and HTTP smoke tests. Coverage includes empty and synthetic populated catalog states, internal links, image-copy integrity when images are present, release-index gates, traversal/symlink handling and content-hashed asset references.

`npm run test:browser` is optional. It requires Playwright and Chromium in the execution environment and a running local server. Browser checks do not replace manual review of desktop and phone layouts.

## Build output and caching

Every build uses a fresh output tree. Previous output is preserved in `.build-backups/` outside the serving root, including unknown files. Do not publish that backup directory. Review and manage its disk usage separately.

CSS and JavaScript use content-derived filenames. Read [hosting and cache requirements](docs/cache-and-deployment.md) before deployment. This project does not provision hosting, change DNS or configure a live server.

## Contributing

Keep changes focused and include the relevant checks. Do not add fabricated catalog entries, download counts, release versions or compatibility claims. Keep development fixtures in tests. Obtain approval before adding third-party assets, product packages, authentication or public upload functionality.

A project source-code license has not yet been selected. Public repository visibility alone is not a license grant.
