# Modstoke website

A community-oriented website for Modstoke, the free modding tools project by OpenACAI. Sons of the Forest is the initial game focus.

This repository contains the static site: the mod pages, tool overviews, guides and creator notes. It does not contain Manager, Loader, SDK or mod binaries.

Join the [Modstoke Discord](https://discord.gg/T2Tjh5ECS) to connect with the community. The permanent invite opens in #welcome.

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

- `src/templates.mjs`: assembles every route from the views below
- `src/layout.mjs`: page shell, release strip, header, phone menu and footer
- `src/home-view.mjs`, `src/mods-view.mjs`, `src/tools-view.mjs`, `src/docs-view.mjs`: page content
- `src/style.css`: site styles; `src/fonts/`: Roboto subsets (Apache 2.0, licence alongside)
- `src/app.js`: the mod list filter
- `src/guides-view.mjs`, `src/guides.css`: install and troubleshooting guides
- `src/servers-view.mjs`, `src/servers.js`: the community server directory, read from `/api/community/v1`
- `src/app-policies-view.mjs`: the `/apps/` privacy and terms pages
- `src/project-knowledge-view.mjs`, `data/project-knowledge.json`: dated project facts, published at `/community/knowledge.json` for Sentinel
- `src/seo.mjs`: sitemap, robots and page metadata
- `data/store/catalog.json`: the mods, in the store catalog format shared with the Manager
- `data/site.json`: brand and game metadata
- `data/releases.json`: reviewed product download selection
- `deploy/caddy/modstoke.caddy`: the site's Caddy block
- `scripts/`: build, local server, packaging and checks
- `test/`: Node test-runner tests
- `docs/`: architecture and hosting notes

## Publication state

Product downloads use the validated `data/releases.json` adapter; it currently selects Manager 0.3.0 and Loader 0.4.1-net11-preview. Mods are listed from `data/store/catalog.json` and download from Nexus Mods until the store can host signed packages. The legacy `mods` and `releases` arrays in `data/site.json` stay empty. A screenshot of a desktop catalog is not an approval to copy those entries or distribute their files.

The SDK interfaces live with the Loader. A Loader release is selected only when one ZIP contains the Loader and SDK (and the client companion, if one is bundled), with its per-file manifest and package inventory. Admin has a public repository with project documentation; its source import is pending, and there is no downloadable Admin package here. See [release publication](docs/release-publication.md) for the exact file, index and verification gates.

The local server includes empty catalog/category response fixtures to support integration work. They are not a production backend or an updater service. See [architecture](docs/architecture.md).

## Product screenshots

Screenshot binaries are excluded from the public source bundle. The site builds without them and does not render broken images or placeholder screenshots.

For an authorized visual preview, optional captures can be supplied at:

- `src/assets/manager-catalog.webp`, with `-1200` and `-800` sizes (or `.png`)
- `src/assets/admin-world-preview.webp`, with `-1200` and `-800` sizes (or `.png`)

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
