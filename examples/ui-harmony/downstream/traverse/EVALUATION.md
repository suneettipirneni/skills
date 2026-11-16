# Traverse evaluation

## Task and direction

Traverse is a fictional Northline Gallery opening walkthrough. The unit of work is a required check in a room; an issue is linked to the check that discovered it. The repeated operation is select room → inspect check → record an outcome and optional note → create or revisit a linked issue. A review commits the walkthrough once all 30 checks have outcomes; open issues may remain for follow-up. Reopening retains checks, issues and history. All data is local to the browser on this device; roles are labels, not messages or assignments sent to staff.

The primary UI Harmony route is **structure → workspace → workbench** for repeated inspection with persistent context, with **record-detail / form** for an individual check and **adaptation / states** for narrow screens, errors and recovery. The alternative considered was a single linear wizard: it would simplify the first pass but make independent room selection and return visits harder. The chosen room list and selected-check editor keep the route and current task visible together on desktop; on a phone the rooms become a horizontal strip and the editor follows the checks.

The intended visual direction is quiet gallery operations: a forest-green action color, warm near-white surfaces, precise typography and one editorial italic in the introduction. The route, inspection list and detail form are different regions, not a grid of equivalent cards. References used as design guidance via the frozen skill ledger: [Untitled UI Settings 01](https://www.untitledui.com/react/iframe/settings-pages/settings-01) for field grouping and narrow-screen restacking; [Untitled UI buttons](https://github.com/untitleduico/react/blob/a0e5a7a98fd3b59cd9ec2d3ede09b7f6ac3c4c4b/components/base/buttons/button.tsx) for coordinated control edges and emphasis. These are reference relationships, not copied components. This application uses original plain HTML, CSS and JavaScript.

## Run

From this directory: `python3 -m http.server 4326 --bind 127.0.0.1`, then visit http://127.0.0.1:4326/. No build or dependencies are required. Google Fonts are optional; system fallbacks remain available offline. The browser must allow localStorage. Clear site data to start over.

## Self-review and changes

Baseline captured at 1440×900 and 390×844 before changes. The desktop view kept the selected room, check list and editor on one plane; the phone reflowed them in task order, with a scrollable room strip. The editor is below the check list on mobile, so selecting a check scrolls it into view. That costs vertical travel but retains all five checks and avoids a modal for the frequent action.

Self-review found that dismissing a newly suggested issue left no way to create it later; added a persistent “Create linked issue” action on that check. Unsaved status and note drafts now survive switching checks and reloads without counting as completed checks. Restored focus when dismissing the issue dialog. Axe highlighted low-contrast secondary copy and indistinguishable complementary landmarks; darkened secondary text and named the landmarks. No user research or measured usability claim is implied.

**Subtraction pass:** removed room sequence numbers from the route, the repeated room-selection prompt, redundant checklist instruction, duplicate local-storage reminder and decorative route-footer wrapper. Retained the selected room description, required/optional field labels, progress, validation and local-only disclosure where they support decisions.

## Verification

Using local Chrome with Playwright and explicit browser contexts: inspected desktop and 390px phone screenshots; exercised missing check outcome, issue creation and missing title, role and priority, issue resolution, empty filter recovery, review completion guard, reload persistence, completing all 30 checks from a populated fixture, reopening, and retained history. A keyboard Tab reached a control; the dialog supports Escape, focus return and focus cycling. The 390px flow had no document overflow, no page errors, and axe reported no violations on tested mobile and desktop review states after corrections. The complete fixture was populated programmatically, so this does not claim thirty independent manual field entries. No screen reader, real touch device, or broader viewport matrix was tested. External font loading and localStorage availability depend on the browser environment.

## Remaining limits

This is a single-device prototype, with no backend, shared synchronization, notifications, identity or actual staff messaging. Browser site-data deletion removes the record. Completion checks that every check has an outcome; it intentionally permits open issues, which remain visible for follow-up. Activity records individual saved checks and issue edits, not a full before/after audit trail. The application has no export or print workflow. The style direction was assessed qualitatively against the skill's anchor; no numerical style score or user-tested claim is made.


## Independent remaining-app review

Independent reviewer verified 11 named checks including linked issue create/resolve, filter recovery, incomplete completion guard, phone draft save/reload, completion/reopening using a populated fixture, and injected storage failure. Removed promotional/generic scaffolding while keeping check-specific instructions and constraints. Storage exceptions are caught and honestly reported on phone and desktop. Selecting a check focuses the editor heading; dismissing a newly suggested issue restores actionable focus. Three-app build requirement does not apply to this plain JS app; `node --check app.js` validates syntax. Final default desktop/phone axe scans are clean and 320px root overflow is absent. Evidence and exact boundaries: `independent-review/` and `../REMAINING-REVIEW.md`.
