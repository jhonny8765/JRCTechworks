# Phase 7 — SEO and Online Visibility

Published site: https://jrc-techworks.pages.dev

## Included in this phase

- Unique page titles and descriptions for the homepage and both case studies.
- Absolute canonical URLs pointing to the live production hostname.
- Open Graph and Twitter/X summary-card metadata with a 1200 × 630 PNG studio preview.
- Project-specific sharing images using the original SukiSuite and Better Yield screenshots.
- `robots.txt` allowing public crawling and pointing to `sitemap.xml`.
- `sitemap.xml` with all three public pages and their project imagery.
- Lightweight Organization and WebSite structured data using only publicly supplied business details.

## Verified during the build

Run `npm run typecheck` and `npm run build`. With static export, the following
files must be present under `out/`:

- `index.html`, `work/sukisuite.html`, `work/better-yield.html`
- `robots.txt`, `sitemap.xml`, `social-preview.png`

Inspect each page's generated HTML for a canonical URL, unique title/description,
Open Graph image, and Twitter image. Check the exported sitemap for the same URLs.

## Optional owner steps (not performed automatically)

1. Open [Google Search Console](https://search.google.com/search-console/about).
2. Add the URL-prefix property `https://jrc-techworks.pages.dev/` and complete
   Google's site ownership verification, if supported for this hostname.
3. Submit `https://jrc-techworks.pages.dev/sitemap.xml` in **Sitemaps**.
4. Use URL Inspection for the homepage and case studies after Google can access them.

Publishing metadata and a sitemap makes the site easier for crawlers and link
previews to understand; it does not guarantee ranking or instant indexing.

If a custom domain is connected later, update `siteUrl` in `lib/seo.ts`, rebuild,
and submit the new domain's sitemap. The current production hostname is the canonical source.
