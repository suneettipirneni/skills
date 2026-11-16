# Gloss evaluation

## Intent and route

Gloss is a fictional localization review workspace for Stillday. The repeated operation is finding a string, comparing its source and contextual use to a translation, correcting it, then approving a valid revision. The source, context, translation, validation and history remain tied to the selected string. Release readiness is derived from the same records, not a separate set of metrics. English is the source; German and Arabic are review locales.

The design route was UI Harmony v3: `SKILL.md` → `references/router.md` → `references/preferences/modern-saas.md` and `untitled-ui.md` → `references/workflow/structure.md`, `references/templates/workspace.md`, `references/organisms/workbench.md`, and `references/design-review.md`. `references/foundations/headless-react.md` informed the choice of native buttons, input, select and textarea for these straightforward interactions. The Untitled UI reference was used as a source of composition and control-finish principles, not as a screen to reproduce. No third-party source code or imagery was copied. Two arrangements were considered: a dedicated detail page (more room for long strings, but costly repeated navigation) and a linked list/editor workbench (chosen for repeated review while retaining source context). At narrow widths the workbench stacks.

## Evidence and decisions

- 36 varied source strings, with translations in both target languages and intentionally invalid examples. Literal interpolation placeholders are preserved in source content. Missing placeholders and empty values prevent approval; correcting a value allows approval. Saving an edit returns an approved entry to pending.
- The string list supports search and all, pending, invalid, and approved filters. Invalid is a cross-cutting condition, so it overlaps pending; release counts do not imply those categories are additive.
- History is per string and language. Saved revisions and approvals create entries; in-progress drafts persist locally across string/language navigation and reload, without changing the approved revision until saved or approved. Release progress derives from saved valid approvals.
- The Arabic editor and preview explicitly use RTL direction. The source remains LTR. Browser localStorage is the sole persistence layer; there is no translation service or publishing operation.
- Captured and inspected desktop (1440 × 900) and phone (390 × 844) screenshots. The workbench stacks on phone and no horizontal page overflow was observed. Browser automation exercised missing placeholder → blocked approval → correction → approval → history, draft navigation/reload, locale switching, and release counts. No page errors were reported.
- Initial automated axe review flagged low contrast in secondary text. Self-review darkened those text roles; a repeat of the release screen reported no violations. A repeat of the editor screen also reported no violations; automated checks are not a complete accessibility audit. Native controls and visible focus styles support keyboard use, but exhaustive assistive technology testing was not performed.
- `npm run build` passes. A lockfile is included. The local development server uses port 4324. For this environment, `node_modules` points to the adjacent prepared dependency installation; a normal checkout can install from the lockfile.

## Self-review changes

The initial draft used a separate editor state synchronized by an effect. Browser testing exposed a transient stale draft when switching strings quickly. The editor now derives its value directly from per-string draft state, which also survives reloads. Contrast was increased after automated inspection without changing the quiet green visual hierarchy.

## Independent reviewer changes

Independent review found that selecting a row on a phone left the editor below the 844px viewport, with focus still on the row. The narrow layout now switches from the list to the editor, moves focus to Back to strings, and returns focus to the selected row while preserving search and list scroll. The reviewer also requested quieter surfaces: removed the decorative project eyebrow, strings tagline, and redundant library description. At 390px and 320px, browser checks opened a long German entry and Arabic entry, confirmed draft recovery after navigation and reload, RTL direction, and no horizontal page overflow. At 320px a list scroll position of 700px was preserved on return. The detail starts at 127px (390px) and 132px (320px) from the viewport top. Corrected full-page captures: `/private/tmp/gloss-390-german.png` and `/private/tmp/gloss-320-arabic.png`. The production build passes after these changes.

## Limits

The fictional translations are representative fixtures, not professionally reviewed linguistic content. Placeholder validation checks required literal tokens rather than full ICU syntax or plural grammar. No real release or publishing occurs. Browser evidence is scoped to the flows above; it does not establish production readiness or full accessibility.

A final adversarial review found that the earlier Back implementation restored list scroll but reset the page scroll, leaving a focused later result below the viewport. Back now restores the page position captured at selection before returning focus. The reported `task` search + Pending filter + `task.empty_body` case was rechecked at 390px and 320px: the focused row was fully visible (y779–844 in an 844px viewport) after return in both cases. The production build passed after this correction.
