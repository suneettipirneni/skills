# Crate evaluation

## Intent and task model

Assumption: a registrar is preparing a fictional exhibition from a known collection, working locally and returning to incomplete objects. The working relationship is **object → case → per-object readiness → manifest**. Selecting a work and editing it are separate; removing it from the current list preserves its assignment and checks for a later return. The manifest is a planning summary, not a shipping action or permanent signed record. All content and artwork are fictional. The abstract SVG previews are original code, not reproductions of actual works.

## Route and composition

The primary route is UI Harmony `structure → workspace → workbench`, with a scoped `collection` branch and a review/commit state. The selected work's dimensions, condition, handling, case and checks stay together in the inspector. The collection is a compact comparison list rather than a card gallery. Cases are a grouping view; the manifest derives readiness directly from assignment and checks. On phones, the inspector becomes a full-width focused area; selecting a row scrolls it into view.

Alternative considered: a step-by-step wizard. It would make initial progression clear but would make revisiting a work and reassigning cases more cumbersome. The chosen navigation leaves every stage revisitable and retains the local draft.

The visual direction is a warm, restrained working surface with a forest-green action color and small object previews. Untitled UI's typography, deliberate control finish, and quiet grouped surfaces informed the level of finish, while the split object-and-case workflow is specific to this product. References consulted: frozen UI Harmony `preferences/modern-saas.md`, `preferences/untitled-ui.md`, `workflow/structure.md`, `templates/workspace.md`, `organisms/workbench.md`, `templates/collection.md`, and `foundations/headless-react.md`. Their referenced conceptual sources include [Untitled UI](https://www.untitledui.com/), [Cloudscape resource views](https://cloudscape.design/patterns/resource-management/view/), and [Tidwell's Common Ground](https://www.mit.edu/~jtidwell/common_ground_onefile.html). No third-party visual assets or template code were copied. Native buttons, selects and checkboxes suit the simple interactions; no custom popovers or dialogs were needed.

## Evidence and revisions

Baseline captures: `baseline-desktop.png` (1440 × 1000) and `baseline-phone.png` (390 × 844), fresh local state, collection view with work 03 selected and its last check incomplete. Final captures: `final-1440.png`, `final-390.png`, and `final-320.png` with the same fixture. Captures use full-page screenshots; viewport dimensions are noted, not the resulting full image height.

Self-directed revisions after inspecting the baseline: darkened secondary text and condition badge for contrast; removed row labels that excluded visible content from their accessible name; named aside landmarks; kept the phone progress action legible and made row selection bring the inspector into view. The baseline's calm list/inspector relationship and work-specific context were retained. No reviewer-directed corrections have been made at this point.

## QA and limits

`npm run build` passes. Chrome/Playwright checks at 1440, 390 and 320 CSS pixels found no horizontal document overflow. Axe reported zero violations on the initial collection state at all three widths after corrections; this is a scoped automated check, not a full accessibility certification. The same browser checks verified: manifest initially blocked; opening the flagged work and completing the missing check enables it; reassignment persists through reload; removing and re-adding that work restores its checks and assignment; derived ready counts update. A keyboard Tab focus probe reached a button, and native controls have visible focus styling; a complete keyboard-only task and screen-reader session were not independently audited.

Persistence uses browser localStorage on this device and does not sync or provide a backup. There are two seeded case definitions; case dimensions/capacity are not modeled and assignment does not imply fit. Local manifest creation confirms the current summary in the interface; no download, shipment booking, signature or external communication is performed. The fictional condition notes are demonstration data, not professional condition reports. No user research or live collection integration was performed.

## Depth steering revision

Following reviewer direction to deepen the working prototype, case rows now show handling context and readiness, and provide a native case reassignment control directly in the case plan. Manifest preflight reports both missing assignment and incomplete checks where relevant. Creating a manifest saves an immutable local snapshot with its works and case assignments; expandable history remains after reload. This reviewer-directed extension was verified in Chrome at 1440 and 390 CSS pixels: moving a work between cases, resolving the initial blocked check, creating and expanding a snapshot, and reloading the saved history all worked. Full-page captures are `manifest-1440.png` and `manifest-390.png`. Manifest creation retains the editable current draft separately from snapshots. History is device-local and snapshots do not restore prior drafts.

## Phone navigation and quiet-surface revision

Reviewer-directed correction: the earlier phone composition put the inspector before the collection, pushing search far below the initial viewport and leaving keyboard focus on a distant row after inspection. Phones now start on the collection. Opening a work replaces the list with a focused detail view; Back restores the prior query, scroll position and focus to the originating row. Work selection, case assignment and checks remain intact. Entering a work from preflight also opens the detail view. The repeated sidebar preparation callout, collection instruction and packing-check instruction were removed while status, labels and recovery remain. This supersedes the earlier description of the phone inspector ordering.

At 390 × 844, the search input starts at y=468 CSS pixels. A keyboard-driven search for Blue Hour, opening detail, adding it, assigning Case A and checking condition, then returning preserved the query, selected state, assignment, check and row focus. A separate lower-list test restored scroll from y=660 to y=660 and focus to the originating work. Axe reported no violations in these collection and detail states; no horizontal overflow was observed. `phone-list-revision.png` and `phone-detail-revision.png` record the revised states; original baseline captures remain unchanged. Production build passes. This remains a scoped browser check, not a screen-reader or complete keyboard accessibility audit.
