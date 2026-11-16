# Daymark evaluation

## Framing and route

Daymark is a fictional shared photography studio planner. The core relationship is that a booking occupies one room and optionally shared equipment over a time interval. The repeated task is to compare a day, find available resources, commit a session, then return to change or cancel it. The studio's timezone is America/New_York (EST for the fixed sample week, November 16–22, 2026); hours are 8 AM–6 PM. This is a local demo, not a reservation service.

UI Harmony v3 routes: `structure` → `specialist` for interval scheduling; `workspace` → `workbench` for the persistent schedule and contextual editor; `form` and `field` for the commit boundary; `modern-saas` → `untitled-ui` for finish. Native selects and time inputs fit the constrained choices. A single schedule and a contextual editor were chosen over a multi-page wizard so that the day remains the organizing context. The mobile treatment condenses the week to day selection and gives the agenda and task form their own space.

The aesthetic anchor is the skill's Untitled UI guidance: shared alignment, readable hierarchy, restrained control material, and related metadata. Daymark deliberately uses a studio-specific week/agenda and resource model instead of replicating an existing screen. Warm paper, muted botanical green, editorial serif headings, and room-specific muted colors distinguish the studio without obscuring booking state.

## Sources

- [W3C modal dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/): focus containment, Escape, and return to the trigger guided panel behavior.
- [MDN time input](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/time): native time input exposes normalized 24-hour values; explicit validation is still needed.
- [W3C dialog technique](https://www.w3.org/WAI/WCAG22/Techniques/html/H102): modal background should be inert. The app sets the background inert while its panel is open.

## Design and verification

The original baseline is preserved as `baseline-desktop.png` and `baseline-phone.png`. Self-review found insufficient contrast in secondary metadata, a too-implicit mobile action, and no visible resource availability before attempting a booking. Revisions darkened supporting text, restored the mobile action label, and added live availability and busy labels. A later explicit depth request led to resource descriptions and a persistent activity panel with prior reschedule details and restoration of cancelled bookings. That was a scope revision, not an independent reviewer finding.

Chrome/Playwright checks exercised room and cross-room equipment collisions, creation, rescheduling, cancellation, undo, reload persistence, history restoration, Escape, and initial focus. `check.cjs` and `depth-check.cjs` preserve the test sequence. Axe reported no violations in the desktop and 390px agenda, and in the phone booking, resource, and activity panels after contrast revisions. `npm run build` passed. Final screenshots are in `final-desktop.png`, `final-phone.png`, `final-phone-form.png`, and `final-phone-history.png`; the agenda captures include the test-created booking. No user study or independent design review is claimed.

## Limits

Only the fixed sample week is supported; there is no server, account, real reservation, time-zone conversion, or cross-device sync. Local storage is browser-specific. Each equipment line represents one shared set. Intervals use half-open overlap checks, so one session may start as another ends. The seeded bookings are fictional. Undo is immediate; older cancellations can be restored from activity if the resources remain free, otherwise the editor provides a recovery path. The application was not tested with every browser, assistive technology, or locale. The public font import has system fallbacks if unavailable. A formal weighted style-fit score is not asserted: this is a self-review, not an independent scored review.

## Quietness pass

A targeted follow-up replaced the slogan with “Studio schedule,” shortened the introductory copy to the actual room/equipment scope, and made the sidebar and footer labels functional. The date, New York time zone, studio hours, resource availability, conflict messages, and booking controls remain. The original baseline screenshots remain unchanged; `quiet-phone.png` records the revised phone layout with a test-created booking. The production build passed again. At 390px, a room conflict was shown, changing the room allowed the booking, and cancellation followed by Undo restored it. The activity restoration and open-panel axe checks also passed again.
