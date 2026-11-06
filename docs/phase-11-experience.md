# Phase 11 — Website experience redesign

The original first page contained a long sequence of independent card sections. The redesigned homepage is organized into five shorter, guided scenes:

1. Home — core pitch and the original SukiSuite and Better Yield screenshots.
2. Work — one large, switchable project spotlight with live and case-study links.
3. Services — six selectable service topics share one focused detail panel.
4. Studio — team information and the three-step process share one switchable panel.
5. Contact — the existing guided email brief and authentic social/contact links.

## Interaction decisions (slideshow refinement)

- The homepage is now a fixed, five-scene presentation. Standard document scrolling is locked after hydration. It does **not** use scroll snapping.
- A wheel or trackpad gesture activates exactly one next/previous scene. Momentum is debounced so it cannot rapidly skip multiple scenes.
- Scenes use explicit Web Animations API timelines (1,180ms) rather than relying on visibility-triggered CSS transitions. The outgoing panel remains painted while the incoming panel travels into place; upward navigation reverses both movements.
- A Motion on/off button beside the slide controls lets visitors choose animation explicitly. System reduced-motion preference is respected by default; a saved on/off choice overrides it.
- Keyboard Arrow Up/Down, Page Up/Down, Home, and End navigate the slides when focus is outside interactive controls.
- Touch gestures and on-screen previous/next buttons navigate the same scenes; the header and progress rail support direct jumps.
- Content that exceeds a small or short viewport can scroll **inside its own scene**, particularly the project brief on Contact. This preserves full access to form fields without returning to a long page.
- URLs with section hashes open the matching scene, including `/\?service=...#contact`. History and anchor navigation are supported.
- Project and service selection are standard accessible buttons with tab semantics and arrow-key support. Details are never fetched from an external service.
- The shorter homepage does not delete case-study routes. Both supplied screenshots stay unmodified.
- With motion disabled, slides change instantly and navigation still works. All keyboard, anchor, and form interactions are retained.
- Without JavaScript, the server-rendered sections remain available as an ordinary scrollable page.

## Verification

- `npm run typecheck`
- `npm run build`
- Check that the HTML contains five stages, working service tabs, project tabs, studio/process tabs, and the contact form.
- Check project screenshots, live URLs, email, and social links were preserved.
- Test keyboard navigation and focus visibility on the tab controls.
- Check desktop and mobile viewports for clipping, text size, and unwanted horizontal scrolling.
- Confirm one gesture changes only one scene, reverse gestures move backward, and the document itself stays fixed.
- Verify the outgoing and incoming panels visibly move during a transition, and that Motion off/on changes the behavior.
- Confirm form fields and social links remain reachable inside Contact on short screens.
- Confirm the reduced-motion behavior and animated content entrance styles.

## Deployment boundary

Phase 11 only changes the website's frontend. It does not change the inquiry delivery mechanism, backend, Cloudflare project settings, or DNS. Stop for user inspection before starting another improvement phase.
