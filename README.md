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
- Phase 6 (planned): Deployment after approval.

The GitHub repository is the source of truth. Deployment is intentionally deferred until approval.

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
issues fixed, verified image sizes, and remaining limitations. The code is still
not deployed publicly; Phase 6 requires separate approval.
