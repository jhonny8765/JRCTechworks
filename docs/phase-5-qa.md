# Phase 5 — Performance, Accessibility, and Responsive QA

Date: 2026-11-06

## Scope

This checkpoint covers the homepage and both case-study routes at local preview
sizes. It does not publish the website. The original user-provided screenshots,
project descriptions, and Phase 4 contact links are preserved.

## Responsive checks

Visual checks used a temporary, locally served iframe to simulate CSS viewport
widths. The temporary test page was removed afterward.

| View | Width tested | Result |
| --- | ---: | --- |
| Homepage, small phone | 320px | Layout fits; no document-level horizontal overflow |
| Homepage, phone | 390px | Hero, services, contact, and footer inspected; no document-level horizontal overflow |
| Homepage, tablet | 768px | Fixed crowded header; navigation now uses menu button; no document-level horizontal overflow |
| Homepage, desktop | ~1350px | Hero and project screenshot composition visually inspected |
| SukiSuite case study, phone | 390px | Heading and actions fit; image loads; no horizontal overflow |
| Better Yield case study, phone | 390px | Heading and actions fit; image loads; no horizontal overflow |

The inner document measurements (excluding iframe scrollbar space) were
301px, 371px, and 749px respectively, with **0px measured horizontal overflow**.

## Accessibility and navigation

- Added a keyboard-visible **Skip to main content** link on all routes.
- The mobile/tablet menu exposes its expanded state and closes on Escape.
- Confirmed that mobile menu navigation reaches its homepage section anchors.
- Confirmed that the homepage has one `<main>` and one `<h1>`.
- Confirmed that internal homepage hash links resolve to existing section IDs.
- Confirmed that all three pages have no broken rendered project images.
- Improved small-print color contrast for service numbering, the footer,
  hero caption, and team graphic caption. Sample source-color contrast ratios
  now range from **5.45:1 to 6.98:1** on their specified background colors.

These checks do not replace a full screen-reader or automated WCAG audit.

## Performance and layout stability

- Corrected the SukiSuite screenshot dimensions from the Better Yield dimensions
  to its actual **1597 × 806** pixel size, reducing potential image-ratio shifts.
- Better Yield remains **1599 × 813** pixels.
- Removed eager priority/preload from the secondary Better Yield screenshot in
  the homepage hero; it can now load lazily near the viewport.
- Preserved the exact user-provided screenshot files:
  - SukiSuite: **45,998 bytes**
  - Better Yield: **245,697 bytes**
- The site uses a static export and no remote webfont download.
- The existing reduced-motion CSS remains in place.

## Build verification

- `npm run typecheck` — passed.
- `npm run build` — passed, generating `/`, `/work/sukisuite`, and
  `/work/better-yield` as static routes.

## Measurement limits

Chrome DevTools performance tracing and Lighthouse tools were not available in
the connected environment. Therefore no LCP, INP, CLS, Lighthouse score, or
real-user Core Web Vitals values are claimed. Real-device, slow-network, and
assistive-technology checks should be repeated after staging deployment.

**Phase 6 publication is not authorized by this checkpoint.**
