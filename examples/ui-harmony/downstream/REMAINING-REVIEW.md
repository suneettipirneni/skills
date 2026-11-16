# Independent review: Index, Traverse, Seating, Proof

Reviewed 15 November 2026 in installed desktop Chrome with Playwright. Scope: four existing applications, connected desktop and phone tasks, source/persistence checks, rendered quietness review, narrow corrections. This reviewer is separate from their generators. Source `EVALUATION.md` files were read before testing; their claims were not treated as verification.

## Outcome

The final independent suite passes **42 named checks**: Index 11, Traverse 11, Seating 10, Proof 10. These include the four 320px root-overflow checks; they are not 42 distinct full workflows. Final default-state axe scans at 1440×900 and 390×844 report zero violations for each application. No JavaScript page errors occurred during the final exercised flows. Three additional context-transition checks pass. Index, Seating and Proof production builds pass; Traverse is plain HTML/CSS/JavaScript and needs no build. Lucide's existing module-level `use client` warnings remain non-blocking in the two Vite 8 builds.

These applications share a sage/cream palette and sidebar family. They **do not demonstrate stylistic diversity**. Their task structures differ: column mapping and row correction; room/check/issue inspection; table/party placement; article/comment review. The improvements below preserve that existing identity and remove redundant framing; they are not proof of aesthetic parity with a reference library or user-validated usability.

## Index — archival import

Verified sample mapping → review of 3 invalid rows → corrections → reload → import 7 → inspect an imported record → undo → retain 3 seed records. On phone, a no-match catalog search recovers through Clear search; CSV upload preserves a quoted embedded newline; edited rows survive reload. Injecting a throwing `Storage.prototype.setItem` preserves the in-memory edit and shows “Changes not saved”.

The baseline already contained the earlier subtraction of its preparation sidebar and footer. Independent corrections removed the decorative WORKSPACE/01 label and redundant history-page subtitles, darkened the local-save/profile metadata, and gave each editable row control an explicit accessible label. The implicit label around a textarea was inconsistently matched after reload because its initial text content changed; the explicit row/field name is stable.

Visual judgment: the import sequence, source receipt and required-field mapping provide meaningful structure. The review table retains field relationships, but its horizontal scroll on phone means status and longer titles are not simultaneously visible. The start surface is still relatively spacious for a single upload task; no extra prose or imagery was added to occupy that space.

Evidence: [desktop](index-app/independent-review/final-desktop.png), [phone](index-app/independent-review/final-phone.png), [review desktop](index-app/independent-review/selected-desktop-state.png), [review phone](index-app/independent-review/selected-phone-state.png), [results](index-app/independent-review/results.json).

## Traverse — gallery walkthrough

Verified missing-outcome guard → issue outcome/note → linked issue with responsible role and priority → reload → resolve issue → empty filter recovery → completion guard. Phone selection and unsaved note/outcome survive reload, and saving records the check. A deliberately populated 30-check fixture verifies completion and reopening while retaining check/history state. This does not claim thirty independently entered checks. A forced storage exception now leaves the app usable and displays a visible phone/desktop failure status.

Independent corrections replaced the promotional heading with “Opening walkthrough”, removed generic introductory room prose and THE ROUTE/history scaffolding, and shortened issue/review page headings. Check-specific inspection instructions, location, progress, required outcomes and issue constraints remain. The original unconditional “Saved locally” claim and uncaught storage exception were replaced with neutral/confirmed/failed states. The status is now visible on phone. Selecting a check focuses its editor heading; dismissing an automatically opened issue dialog returns focus to the linked-issue action, rather than leaving it on the body.

Visual judgment: removing the slogan and generic room introduction brings the actual inspection work higher without flattening the selected-check hierarchy. The phone still puts the editor after the room's five checks; choosing one scrolls and focuses it. This is functional but involves vertical travel, and the horizontal room strip only exposes part of the route at once.

Evidence: [desktop](traverse/independent-review/final-desktop.png), [phone](traverse/independent-review/final-phone.png), [linked issue](traverse/independent-review/selected-phone-state.png), [results](traverse/independent-review/results.json), [transition checks](independent-review/transition-results.json).

## Seating — party placement

The first independent render was blank: its symlinked shared node_modules produced a Vite dependency-cache collision followed by a duplicate-React invalid-hook error in Lucide. App-local `vite.config.js` now uses a separate `.vite-cache` and deduplicates React/React DOM. Proof receives the same isolated configuration to prevent recurrence when both servers run. No shared package sources were edited.

Verified whole-party capacity conflict → choose Table 06 → move → visible dirty status → save → reload → CSV export. The exported CSV retains the assigned guest, table/seat, party and access note. Phone flow filters/searches a party, retries a capacity conflict at another table, saves, reloads, rejects a too-small table capacity, and cancels its editor. A forced storage exception preserves dirty edits and reports failure. Switching tables now closes the previous table's edit draft so it cannot overwrite the newly selected table.

Independent subtraction removed the Guest list navigation item that only changed the title while rendering the same workspace, repeated table-total/percentage summary, duplicate date tile and decorative THE ROOM/GUEST DIRECTORY/PARTY DETAILS labels. Seated/remaining counts, exact table occupancy, selected-table context, guest needs and capacity constraints remain. Added dirty-save status, a native unsaved-navigation warning, visible search/select focus, and sufficient inactive phone-view contrast. No full reload/recovery dialog or undo stack was introduced.

Visual judgment: the schematic tables now carry more of the composition and the capacity/assignment relationship remains legible. The long inspector still requires scrolling to reach party actions, and some names/metadata use small type. The diagram is not a venue plan, and accessibility needs are informational notes rather than automatically enforced placement rules. Mobile also lacks the desktop event breadcrumb; that context is a remaining improvement opportunity.

Evidence: [loaded baseline](seating/independent-review/before-desktop-loaded.png), [desktop](seating/independent-review/final-desktop.png), [phone](seating/independent-review/final-phone.png), [selected table on phone](seating/independent-review/selected-phone-state.png), [export](seating/independent-review/export.csv), [results](seating/independent-review/results.json).

## Proof — editorial review

Verified edit dialog/Escape/focus return → title save → anchored comment → reload → resolve all blockers → mark ready → reopen a comment and clear readiness. On phone, selecting a late paragraph focuses the composer; draft and anchor survive reload; comment source returns focus to the original paragraph; history records the comment.

Independent corrections removed an inert Workspace options control, repeated review/Comments introduction, duplicate inline Edit details action, and unsupported hardcoded reading-time labels. “IN REVIEW 4” incorrectly remained 4 when a story was marked ready; it now truthfully labels ALL STORIES. Phone uses its existing Story/Review/History navigation without another duplicate tab row. Story selection and review-view controls now occupy named navigation landmarks. Added composer focus visibility, bounded modal scrolling and edit-trigger focus return.

Visual judgment: the strong serif reading surface and adjacent compact comment controls survive the subtraction. Paragraph anchors and comment provenance are clear in the deeper state. The desktop sidebar remains a familiar app shell; this is a domain-specific editing workspace, not a novel visual style. Font loading and the persistent review mode/filter can still affect a first return to another story; no cross-browser or screen-reader claim is made.

Evidence: [desktop](proof/independent-review/final-desktop.png), [phone](proof/independent-review/final-phone.png), [anchored comment desktop](proof/independent-review/selected-desktop-state.png), [anchored comment phone](proof/independent-review/selected-phone-state.png), [results](proof/independent-review/results.json).

## Reproduction and evidence boundaries

- Running previews: Index http://127.0.0.1:4325, Traverse http://127.0.0.1:4326, Seating http://127.0.0.1:4331, Proof http://127.0.0.1:4332.
- Main automated script: `independent-review/workflows.mjs`; consolidated raw results: `independent-review/results.json`. Additional focused checks: `independent-review/transitions.mjs` and `transition-results.json`.
- `independent-review/deep-captures.mjs` captures source review, linked issue, selected table and anchored comment states. All final desktop and phone images and the four selected phone states were opened and visually inspected. Final captures wait for the resized viewport to settle; early immediate-resize captures showed compositor repetition at the bottom. Root baseline directories and generator baselines were preserved.
- Final screenshots are 1440×900 desktop and 390×844 phone; each app also has a `final-320.png` capture and a no-root-overflow assertion. This is not exhaustive reflow, text-spacing, zoom, localization, or touch-device testing.
- Axe was applied to default states, not every modal and error combination. Keyboard checks cover Escape/focus return and selected editor/source focus, not a complete keyboard-only journey. Native button semantics remain, but no screen-reader session was run.
- Data and exports are fictional and local. No messages, purchases, backend writes, deployments, skill changes, repo edits, or pushes occurred. External font requests and Vite development connections remain. Browser storage can be cleared; multi-tab concurrency and corrupt saved-data schemas were not exercised.
- The narrowed fixes are source changes inside these four app folders. Temporary review scripts/report live in the downstream evaluation folder. Seating/Proof dependency directories remain symlinks to an existing sibling dependency installation; the app-local Vite cache prevents the observed collision, but a portable handoff should run each app's normal dependency install.
