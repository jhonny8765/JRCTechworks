# Phase 11 — Website experience redesign

The original first page contained a long sequence of independent card sections. The redesigned homepage is organized into five shorter, guided scenes:

1. Home — core pitch and the original SukiSuite and Better Yield screenshots.
2. Work — one large, switchable project spotlight with live and case-study links.
3. Services — six selectable service topics share one focused detail panel.
4. Studio — team information and the three-step process share one switchable panel.
5. Contact — the existing guided email brief and authentic social/contact links.

## Interaction decisions

- Large screens use gentle CSS `scroll-snap-type: proximity` to settle near scene boundaries, while normal scrolling remains available.
- A fixed scene rail shows the active stage and provides direct section links on wide screens.
- An `IntersectionObserver` progressively reveals content as it becomes visible. Animations affect opacity and transforms only.
- Project and service selection are standard accessible buttons with tab semantics and arrow-key support. Details are never fetched from an external service.
- The shorter homepage does not delete case-study routes. Both supplied screenshots stay unmodified.
- On smaller viewports, section snapping is disabled and all scenes flow normally.
- For users requesting reduced motion, scroll snapping and animations are disabled.

## Verification

- `npm run typecheck`
- `npm run build`
- Check that the HTML contains five stages, working service tabs, project tabs, studio/process tabs, and the contact form.
- Check project screenshots, live URLs, email, and social links were preserved.
- Test keyboard navigation and focus visibility on the tab controls.
- Check desktop and mobile viewports for clipping, text size, and unwanted horizontal scrolling.
- Confirm the reduced-motion behavior and new section-reveal styles.

## Deployment boundary

Phase 11 only changes the website's frontend. It does not change the inquiry delivery mechanism, backend, Cloudflare project settings, or DNS. Stop for user inspection before starting another improvement phase.
