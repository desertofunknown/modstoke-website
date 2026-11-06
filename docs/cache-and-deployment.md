# Hosting and caching

CSS and JavaScript filenames use the first 16 hexadecimal characters of SHA-256 over the exact emitted bytes. Every page receives the names from the same build, and `asset-manifest.json` records the mapping. Packaging recomputes the fingerprints and verifies the bytes.

## Deployment requirements

- Revalidate HTML and the asset manifest with `Cache-Control: no-cache`.
- Revalidate `/release-index.json` and the `/releases/loader/latest/` compatibility manifest with `Cache-Control: no-cache`.
- Content-hashed CSS/JS may use `Cache-Control: public, max-age=31536000, immutable`.
- Versioned `/downloads/{product}/{version}/{fileName}` bytes may use an immutable cache policy only after final checksum verification. Never change bytes at that URL; publish another versioned path instead.
- Serve downloads as attachments with the correct byte count and MIME type. Verify the CDN does not substitute a cached error page for a ZIP or executable.
- Publish assets before or atomically with the HTML that references them.
- Keep previously approved hashed assets available while cached HTML or open tabs may still reference them. Retain only explicitly verified public asset files, never arbitrary output backups.
- Never replace bytes behind an immutable hashed URL. Rebuild references whenever assets change.
- Return real 404 responses for missing files and avoid caching error pages.

The local preview applies these headers. A static ZIP cannot configure production headers. Verify the chosen server/CDN configuration separately.

Publish the verified versioned binaries and manifests first, then the latest index and pages. Fetch the hosted bytes back and compare SHA-256 before selecting a latest release. Keep retained previous releases available for rollback. The build's recorded signing evidence does not perform cryptographic signature verification; that belongs to the release review.

Before publishing, confirm domain control, complete an actual browser review on desktop and mobile, review image/publication permissions and verify that no private files entered the package. A successful build is not deployment approval.

## Server layout

`deploy/caddy/modstoke.caddy` is the site block for Caddy. It sends the security headers (HSTS, `nosniff`, `no-referrer` and the same Content-Security-Policy as the local preview), caches fingerprinted CSS/JS and `/fonts/` for a year, `/assets/` for an hour and everything else with `no-cache`, and redirects `/x/index.html` to `/x/` for any page, so new pages need no Caddy edits.

The same paths work on the current VPS and the new dedicated server:

- `/srv/www/modstoke/releases/<timestamp>/`: one site build each
- `/srv/www/modstoke/current`: symlink to the live build, swapped atomically on deploy
- `/srv/www/modstoke/files/downloads/`: versioned release files, written once and never replaced, outside every build so deploys and rollbacks never copy them

Before switching to that block, copy the existing `/downloads/` tree from the current build into `files/` and compare SHA-256 for every file. Moving to the new server is then an rsync of `/srv/www/modstoke` plus this block. Keep Cloudflare's script-injecting features (Web Analytics, Rocket Loader, email obfuscation) off; the site makes no third-party requests and the CSP blocks injected scripts.
