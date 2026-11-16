# Index evaluation

## Design and route trace

Index is a fictional archive workspace for an archivist bringing a batch into a local catalog. The core relationship is source column → archive field → validated record → import batch. That relationship drove a dependent **wizard** for source and mapping, a **workspace** for editable row review, and a **record-detail** view for inspection. A history receipt connects a batch to its undo operation. A single form was considered, but would make the column mapping compete with row-level corrections; a generic dashboard would put summary above the actual work.

Applied `/private/tmp/ui-harmony-downstream/skill-v3/SKILL.md`, `references/router.md`, `references/templates/wizard.md`, `references/templates/workspace.md`, `references/templates/record-detail.md`, `references/preferences/modern-saas.md`, `references/preferences/untitled-ui.md`, and `references/foundations/headless-react.md`. The Untitled UI anchor informed restrained surfaces, aligned labels, compact controls, and meaningful state; the archive-specific source/mapping/review structure and moss/ivory editorial identity are original. Native selects and buttons fit the simple controls here. Related source guidance: [GOV.UK question pages](https://design-system.service.gov.uk/patterns/question-pages/), [Cloudscape details](https://cloudscape.design/patterns/resource-management/details/), and [Untitled UI](https://www.untitledui.com/). These are design references, not copied assets or proof of usability.

## Assumptions and behavior

CSV has a header row; identifiers and titles are required. Identifiers are compared case-insensitively against the catalog and preceding source records. A valid subset can be committed while invalid rows are skipped, with the count explicitly shown. A quoted-field parser handles commas, escaped quotes, CRLF, and embedded newlines. File data, draft mappings, edits, catalog and history are saved in browser localStorage; no backend or upload is involved. Three initial records demonstrate unrelated catalog data. Undo removes records associated with the most recent batch only. Undo is immediate and cannot be redone. No cross-device sync, collaboration, import-size guarantee, or full CSV dialect detection is claimed. Browser storage can be cleared or unavailable. Failed writes retain the current in-memory state and show “Changes not saved”; a later successful write clears the warning.

## Evidence and self-review

- First runnable desktop baseline: `baseline-desktop.png`; original review: `review-desktop.png`.
- Local Chrome at 1440×900: sample yielded 7 records, 4 ready and 3 actionable errors. Corrected duplicate ID, missing ID, and missing title; imported 7, inspected the first record, and undid the batch. The 3 preexisting records remained (`final-catalog.png`).
- At 390×844: tested unmapped required title, remapping, a quoted newline title, editing then refresh, and review. Draft edit persisted and the document width matched viewport width. `final-phone.png` and `final-review-phone.png` preserve captures.
- Scoped axe scan of the 390px review after refinements: zero automated violations. This is not a complete accessibility certification.
- `npm run build` passed. Package lock is present.
- Self changes after baseline: title cells became multiline editors to show long and newline-containing text; offscreen label positioning was corrected to prevent narrow-screen page overflow; secondary text was darkened following contrast findings. Review uses horizontal table scrolling on a phone so fields retain space; this trades simultaneous visibility for legible editing and is a remaining usability consideration.
- Referee changes: none yet. Independent root review follows.

Style assessment: modern SaaS style fit is **provisional**, not scored; the workflow has browser evidence but no independent matched-scale reference comparison or user research. Craft judgment: developed, with coherent archive-specific color, typography and workflow; further work should test dense mobile correction with real users and add durable storage-error reporting.

## User-directed subtraction pass

After initial QA, the user requested quieter surfaces and removal of redundant text. Removed the duplicate privacy sidebar panel, decorative eyebrow and section labels, page code, footer slogan, and the separate preparation card. Shortened source guidance while retaining file privacy, mapping labels, validation, and recovery. The local save indicator remains in the header. This is a self change in response to steering; independent referee changes remain pending.

## Independent root review fixes

Root identified a misleading saved status when storage writes throw, a blank filtered catalog, and residual marketing subtitles. Failed localStorage writes now show “Changes not saved” while preserving in-memory edits; the initial status is neutral until a write succeeds. A no-match state names the query and provides Clear search. Removed the cited subtitles and redundant catalog instruction. Chrome with setItem forced to throw verified the warning and retained row edit; a zero-match search followed by Clear search restored all 3 seed records at 390px without page overflow. Captured `referee-search-recovered.png`.


## Independent remaining-app review

Independent reviewer verified 11 named checks covering correction/import/record inspection/undo, quoted CSV, phone search recovery, draft reload and injected storage failure; desktop and phone default axe scans are clean, and 320px root overflow is absent. Removed WORKSPACE/01 decoration and redundant history subtitles, increased metadata contrast, and added stable explicit row-field labels. Existing baselines preserved. Final evidence is in `independent-review/`; see `../REMAINING-REVIEW.md` for exact scope and limitations.
