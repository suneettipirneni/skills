# Switchyard evaluation

## Framing and assumptions
A release reviewer compares a candidate to a current manifest, follows the highest-risk changes into context, records supporting evidence, completes required checks, and records a local decision. The manifests and review data are illustrative; no deployment, external system, real user identity, or verified release evidence is implied. Local browser storage is the only persistence layer.

Priority: candidate identity and comparison; risk and evidence exceptions; individual change explanation; checklist and decision. The composition is a compact dark work surface with a persistent checklist next to an aligned diff. On phones the checklist precedes the change list and a direct link jumps to evidence-needing changes. I chose aligned rows over independent cards because version/value comparison is the central task; a modal detail preserves the filtered list and position for repeated inspection.

## UI Harmony route and references
Used `/private/tmp/ui-harmony-downstream/skill-v3/SKILL.md`, `router.md`, `preferences/modern-saas.md`, `preferences/untitled-ui.md`, and `foundations/headless-react.md`. Primary route: `workspace → workbench` for the repeated review operation; scoped `collection → collection-region` for comparing manifest entries; `record-detail` for the selected change. Read those five route references. The modern SaaS anchor informed restrained control material and typography; this is a new domain-specific composition, not a claim of reference parity.

Current Base UI documentation consulted: https://base-ui.com/react/components/dialog and https://base-ui.com/react/overview/quick-start. Base UI Dialog supplies modal focus and dismissal behavior for change detail, review history, and decision. Native search, select, checkbox and textarea controls serve the remaining interactions.

## Baseline and refinement
The first runnable baseline was captured before changes at 1440 × 900 and 390 × 844, dark theme, fresh local state (`baseline-desktop.png`, `baseline-phone.png`). It established the manifest strip, diff and checklist. Self-review found pending evidence was not visible on individual rows, the displayed keyboard shortcut did not work, metadata contrast needed improvement, and a review note was not persisted. The refinement labels pending rows, removes the shortcut, improves contrast and persists notes. Document language and landmark labels were added after axe findings.

## Review-directed scope change
After the baseline, the request was expanded to require deeper connected workflows. Added local evidence notes on each change, a derived pending-evidence count, saved decision notes, and revisitable local review history. History is reachable on desktop and phone. These additions are separate from the initial visual and accessibility corrections above.

## Validation and boundaries
- `npm run build` succeeded. Vite emitted module-level `use client` directive warnings for dependencies in this client-only app.
- Chrome / Playwright at 1440 × 900: 26 rows; decision disabled until all three checks; change detail opens and Escape closes; search empty state and clear recovery work; checklist, decision and note survive reload.
- Recorded evidence on checkout-api, observed pending count decrease from 9 to 8, reloaded and verified evidence text. Recorded a request-changes decision and opened its history.
- Browser console had no page errors in the tested flow. Axe returned zero violations in the tested desktop state after contrast, language and landmark corrections. This is not a complete accessibility certification.
- At 390 × 844 the document had no horizontal overflow; captured baseline and final phone screenshots. Detail and history screenshots are also provided. Keyboard Escape was tested; broader assistive technology and real user testing were not performed.
- The examples are static fixtures. Changes marked reviewed are seed context, not assertions of real review. Evidence notes and decision records live only in the current browser; clearing storage removes them. The checklist is reviewer attestation and does not verify external evidence.

## Targeted reviewer corrections

The reviewer measured a 165.59px vs 15px imbalance around the desktop previous/candidate connector, and observed that the full checklist preceded the diff on phones. The comparison now uses content-sized flex items with a 15px gap on both sides of the arrow; at 390px it stacks the values and rotates the arrow. Added a realistic long endpoint pair to the fixtures (27 changes total) to exercise wrapping. Captured `review-desktop-detail.png`, `review-desktop-long-detail.png`, `review-phone.png`, `review-phone-detail.png`, and `review-phone-long-detail.png`; the original baseline files remain untouched.

The phone now shows the diff first, with a compact checklist progress link above it that jumps to the full checklist. Removed the inert Manifests item, redundant section numbering and explanatory copy, and repeated local-only warning; retained local persistence and unsaved-draft context where decisions are made. No deployment behavior was added.

Rechecked the actual rendered desktop and phone dialogs in Chrome. Short desktop values have measured 15px gaps on both sides of the arrow. Both long URLs render in full without horizontal dialog overflow; the phone dialog scrolls to its Done action. Keyboard Enter opened the detail, focus moved into the dialog, Escape closed it and returned focus to the originating row on both viewport sizes. The phone checklist link reached the checklist; completing all three checks and recording a decision persisted across reload. The phone document had no horizontal overflow, axe reported zero violations in the tested phone state, and no page errors were observed. `npm run build` passed after the changes.
