# Hosting and caching

CSS and JavaScript filenames use the first 16 hexadecimal characters of SHA-256 over the exact emitted bytes. Every page receives the names from the same build, and `asset-manifest.json` records the mapping. Packaging recomputes the fingerprints and verifies the bytes.

## Deployment requirements

- Revalidate HTML and the asset manifest with `Cache-Control: no-cache`.
- Content-hashed CSS/JS may use `Cache-Control: public, max-age=31536000, immutable`.
- Publish assets before or atomically with the HTML that references them.
- Keep previously approved hashed assets available while cached HTML or open tabs may still reference them. Retain only explicitly verified public asset files, never arbitrary output backups.
- Never replace bytes behind an immutable hashed URL. Rebuild references whenever assets change.
- Return real 404 responses for missing files and avoid caching error pages.

The local preview applies these headers. A static ZIP cannot configure production headers. Verify the chosen server/CDN configuration separately.

Before publishing, confirm domain control, complete an actual browser review on desktop and mobile, review image/publication permissions and verify that no private files entered the package. A successful build is not deployment approval.
