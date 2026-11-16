# Margin evaluation

Original React application, built 15 November 2026. Local preview: http://127.0.0.1:4314/.

## Task, object model and architecture

Assumption: a researcher is making a small, revisable interpretation from interview evidence, rather than quantitatively measuring a population. The central relationship is **excerpt → supporting/challenging link → finding**, with every excerpt retaining interview identity, role, timestamp, theme and surrounding source context.

Repeated operation: read, compare, link, qualify the interpretation, inspect context, revise. Necessary context: the claim being developed and both supporting and challenging evidence. Commitment: edits and links are device-local drafts; Save finding records an explicit version. Recovery: local drafts survive reload, each finding retains its own draft, previous saved versions can be restored as a draft, and link/restore actions offer a bounded undo. Undo is cleared at typing, saving, creation, and finding-switch boundaries so an earlier whole-workspace snapshot cannot roll back later unrelated work.

The resulting desktop idiom is an evidence bench, with a reading area beside an interpretation. This was chosen after the task model; pane count was not a brief requirement. A serial wizard was rejected because interpretation and evidence review are iterative. A dashboard would provide little useful context. A full-screen editor with evidence only in a modal was rejected because repeated comparisons would require opening and closing the same source collection. On phones, two focused views replace the adjacent regions. The currently targeted finding remains visible when linking excerpts, and view controls remain reachable while scrolling.

The material is explicitly fictional: six named participants, one excerpt each, three themes (ownership, visibility, recovery). The initialized finding has two supporting excerpts and one challenge. Counts are derived from linked records; interview representation is a count with an explicit denominator. No confidence score or arbitrary percentage is presented.

## Visual decisions and alternatives

The reading sequence is study question → evidence → interpretation → evidence provenance → save. The warm white evidence surface and very pale sage interpretation surface distinguish source material from authored interpretation without enclosing every excerpt in a card. Quote text is larger than attribution; numbered source references recur in the finding. A restrained two-stroke Margin mark represents a reading margin, rather than borrowing a reference brand.

DM Sans body text and Manrope headings coordinate a modest interface title, readable quotes and a larger editable finding title. Green indicates supporting evidence; warm brown marks challenges, with explicit text in both states. Action buttons use a shallow edge/shadow; dialog elevation is materially stronger. Initial field heights were reduced after rendering because they created excessive distance between the claim, interpretation and evidence map. Metadata was enlarged/darkened after visual and measured contrast review.

A single wide reading flow was considered, but it separated the current interpretation from the excerpts on desktop. A dense table was rejected because the central task is reading and interpreting short prose, not comparing fixed numeric attributes. Neither alternative required copying an established product shell.

## Skill and reference trace

Read the frozen skill at `/private/tmp/ui-harmony-evaluation/skill-v2/SKILL.md` and these relevant files beneath it:

- `references/router.md`
- `references/preferences/modern-saas.md`
- `references/preferences/untitled-ui.md`
- `references/preferences/untitled-ui-evidence.md`
- `references/foundations/headless-react.md`
- `references/design-review.md`
- `references/foundations/resilient-css.md`
- `references/workflow/structure.md`
- `references/templates/workspace.md`
- `references/organisms/workbench.md`
- `references/conditions/adaptation.md`
- `references/conditions/states.md`

Read the later bespoke supplement in `/Users/suneettipirneni/skills/ui-harmony/references/preferences/untitled-ui.md`, specifically the new repeated-domain-work and specialist routing rows and “Bespoke applications” section. Frozen skill-v2 files were not changed.

Native buttons, inputs, a select and the HTML dialog element were sufficient for this interaction scope. Base UI was considered under the headless-primitives guidance but no custom combobox/menu behavior warranted adding it. The native dialog supplies modal focus containment; actual Escape and focus-return behavior was checked.

Public references inspected:

- [Untitled UI buttons](https://www.untitledui.com/react/components/buttons): explicit primary/secondary action families and restrained control material. No source or paid templates copied.
- [Vercel Geist materials](https://vercel.com/geist/materials): distinguish resting surfaces from floating dialogs; use the lowest elevation that expresses the layer.
- [Untitled UI Settings 01](https://www.untitledui.com/react/iframe/settings-pages/settings-01): actually captured and inspected at 1440×1000 and 390×844. Useful relationships were labels near editable values, clear action hierarchy, deliberate separation between field groups, and recomposition on phone. Its sidebar, account settings, purple branding and property tracks do not fit Margin's evidence task and were not reproduced.

Reference captures remain in `screenshots/reference-settings-desktop.png` and `screenshots/reference-settings-phone.png` solely as review evidence. Margin differs intentionally in architecture and quote/interpretation hierarchy. The component/state relationships informed the refinement; pixel similarity was not the goal. No aesthetic-parity or user-validation claim is made.

## Reviewer-directed corrections

Root/adversarial review identified:

1. Phone linking hid the current finding identity. Added a sticky “Linking to” title and Edit action; also labeled counts “excerpts” and “linked”. Verified at the final excerpt and with separate findings retained.
2. The cross-view controls were above a long source list. Made the phone view switch sticky while preserving the uninterrupted quote list.
3. Generic Undo could survive unrelated saves or edits. Clear undo at explicit mutation boundaries; checked no Undo after typing or save.
4. Pale provenance and framing text failed contrast. Darkened the role-specific tokens while keeping the sage palette. Final desktop and three phone-state axe scans report no violations.

Self-review also changed “Linked excerpt” in source context to “Selected excerpt”, since unlinked sources can be inspected; reduced excessive draft-field heights; enlarged quote-link metadata and phone controls; and kept save feedback truthful about local device storage.

## Checks and evidence

`verify.mjs` passes 23 named checks recorded in `test-results.json`:

- Source context visible; Escape dismissal and trigger focus return.
- Search empty state and reset; theme filter returns the correct two recovery excerpts.
- Supporting link count increments and Undo restores the count.
- Save survives reload, revision retained, previous title restored, restoration undo.
- Empty-title validation; new finding creation, second finding retention and reopening.
- Unsaved draft recovery after reload.
- No root horizontal overflow at 320, 390, 760, 900 and 1280 CSS px.
- Phone editor reachable; phone save persists.
- No JavaScript page errors during the exercised workflow.

`final-extra.mjs` / `extra-checks.json` cover phone evidence, phone finding and phone source modal with zero axe violations, no Undo after typing/save, and no root overflow at 1440 when every computed text size is doubled. The latter is a bounded content stress test, not complete WCAG reflow/text-spacing certification. `axe-results.json` is the clean desktop scan. `npm run build` passes.

Screenshots were opened and visually inspected during iteration:

- `screenshots/desktop-baseline.png`, `screenshots/phone-baseline.png`: first rendered version.
- `screenshots/desktop-final.png`: final desktop composition.
- `screenshots/phone-evidence.png`: final phone evidence flow.
- `screenshots/phone-finding.png`: phone interpretation and evidence map.
- `screenshots/phone-target-scrolled.png`: sticky target and controls at the last excerpt.
- `screenshots/source-context.png`: complete source-context modal state.
- `screenshots/search-empty.png`: recoverable search-empty state.

The source/empty captures predate the final metadata contrast changes, but preserve the tested state structure. Full-page phone captures can show a sticky save footer at its viewport-relative position; the interactive page should be used for spatial/scroll judgments.

## Limits

This is a local prototype with six fixed fictional interviews, not a research repository or real study. No transcription, import, collaboration, cloud sync, audio, sharing or export is implied. Context views contain an authored before/selected/after excerpt, not a complete transcript. Saved history retains up to 20 older versions. Browser storage can be cleared; a storage failure preserves in-memory edits and shows a device-storage warning, but quota/security failure and cross-tab concurrency were not simulated. No screen-reader session, real touch device, Safari/Firefox coverage or user study was performed.

Fonts load from Google Fonts when online and have system sans-serif fallback. Research content and findings are stored only in localStorage and never sent to a backend. The app makes no data/network requests beyond font assets and Vite's development connection. Dependency installation was initially restricted, so the existing local dependency tree was copied into this app; an npm package lock was then generated against the declared package versions. Only Margin's directory was written.

Craft remains a reviewer judgment. The implemented direction develops quote/interpretation hierarchy, restrained surface contrast, source continuity and state recovery; that is evidence of considered decisions, not proof of beauty parity with the references.

## Final context-transition correction

Adversarial review found that using the sticky phone Edit action at a late excerpt could preserve an unsuitable scroll position, hide the finding title behind the sticky navigation, and leave focus on the body when the trigger unmounted. The explicit Edit action now switches view, focuses the finding-title field without an intermediate browser scroll, and brings that field to the viewport center. This is a deliberate move into editing; source-dialog dismissal continues to return to its trigger.

`transition-check.mjs` creates a second finding, returns to evidence, links the sixth excerpt, and uses sticky Edit. It verifies two retained findings, the correct second title, focused title input, and title bounds below navigation and inside the viewport. Results are in `transition-results.json`; rendered evidence is `screenshots/phone-edit-transition.png`. The production build passes after this correction.


## Published artifact note

This record describes the historical temporary evaluation workspace. Third-party reference screenshots and generator-specific helper scripts are not redistributed. Original app screenshots and independent checks are retained in `../evidence/`; portable verification scripts are one directory above this app.
