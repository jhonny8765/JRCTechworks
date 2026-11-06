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
- Phase 9: Service-specific project inquiry links, a guided email brief, and clearer calls to action across the site.
- Phase 10: Custom domain was intentionally skipped; the free `pages.dev` address stays in use.
- Phase 11: Experience redesign — five compact scroll scenes, interactive featured work and services, a combined studio/process scene, and progressive motion.

The GitHub repository is the source of truth. Cloudflare Pages is connected to its `main` branch.

## Case-study routes

- `/work/sukisuite` — booking, client management, and follow-up workflows
- `/work/better-yield` — POS welcome experience and highlighted store workflows

Product descriptions reflect publicly visible features and the original supplied screenshots. No private dashboard data or performance claims are included.

## Contact

The homepage includes About (`/#about`) and Contact (`/#contact`) sections. The contact
area includes a project-brief form for service, timeline, and goals, plus the owner's
supplied email, Facebook, GitHub, and LinkedIn profiles. Service links can preselect
the matching category using a query parameter.

**Important:** The brief does not send or store messages on the website. It opens the
visitor's email app with a draft, or lets them copy the text into their preferred app.
The visitor must send the message themselves. No backend, database, or transactional
email integration is configured.

JRC Techworks is described as a two-person studio. Jhon Rey Consolacion is named;
the other member remains unnamed until their public identity is confirmed.

## Quality assurance

See [`docs/phase-5-qa.md`](docs/phase-5-qa.md) for the Phase 5 test matrix,
issues fixed, verified image sizes, and remaining limitations.
See [`docs/phase-7-seo.md`](docs/phase-7-seo.md) for SEO checks and optional indexing steps.
See [`docs/brand-guide.md`](docs/brand-guide.md) for the Phase 8 identity, design, and content guidance.
See [`docs/phase-9-inquiries.md`](docs/phase-9-inquiries.md) for the client-acquisition flow and QA.
See [`docs/phase-11-experience.md`](docs/phase-11-experience.md) for the new navigation and motion behavior.
