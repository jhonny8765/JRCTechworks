# JRC Techworks

Building technology that works for you.

This repository contains the JRC Techworks studio website. It is built with Next.js, TypeScript, and Tailwind CSS, and is configured for static export.

## Development

Run `npm install`, then `npm run dev` and open http://localhost:3000.

Run `npm run typecheck` and `npm run build` to verify the code. The static output is generated in `out/`.

## Project screenshots

The homepage uses screenshots supplied by the project owner:

- `public/projects/sukisuite.png` — SukiSuite
- `public/projects/better-yield.png` — Better Yield POS

## Phase checkpoints

- Phase 2: Responsive homepage, visual identity, and real project previews.
- Phase 3: Six-service overview and dedicated SukiSuite and Better Yield case studies.
- Phase 4: Two-person studio introduction, contact section, social links, and consistent footer navigation.
- Phase 5: Responsive, accessibility, and source-level performance checks with targeted fixes.
- Phase 6: Published on Cloudflare Pages at https://jrc-techworks.pages.dev.
- Phase 7: Search and sharing metadata, canonical URLs, sitemap, robots rules, and a branded social preview.
- Phase 8: Clear three-step studio process, direct live-product links on case studies, and a consistent brand guide.

The GitHub repository is the source of truth. Cloudflare Pages is connected to its `main` branch.

## Case-study routes

- `/work/sukisuite` — booking, client management, and follow-up workflows
- `/work/better-yield` — POS welcome experience and highlighted store workflows

Product descriptions reflect publicly visible features and the original supplied screenshots. No private dashboard data or performance claims are included.

## Contact

The homepage includes About (`/#about`) and Contact (`/#contact`) sections. The contact
area links to the owner's supplied email, Facebook, GitHub, and LinkedIn profiles.
Email buttons open the visitor's own email application; no server-side form or
message storage is configured.

JRC Techworks is described as a two-person studio. Jhon Rey Consolacion is named;
the other member remains unnamed until their public identity is confirmed.

## Quality assurance

See [`docs/phase-5-qa.md`](docs/phase-5-qa.md) for the Phase 5 test matrix,
issues fixed, verified image sizes, and remaining limitations.
See [`docs/phase-7-seo.md`](docs/phase-7-seo.md) for SEO checks and optional indexing steps.
See [`docs/brand-guide.md`](docs/brand-guide.md) for the Phase 8 identity, design, and content guidance.
