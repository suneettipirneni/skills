# Proof evaluation

## Intent and route

An editor repeatedly relates a comment to a paragraph, works through the open comments, and records readiness. The object is the story; the reading surface and review inspector stay adjacent on desktop. On a phone they become focused Story, Review and History views. Workspace → workbench is the primary UI Harmony route; article is the reading branch. Native form controls were used for the small set of choices and a custom dialog for the two-field edit. The alternative of a full-screen comment queue was rejected because it would detach each note from its source during reading.

The visual direction is a restrained independent-publication desk: an editorial serif for the story, compact sans for the tools, pale green contextual cues, and flat surfaces. The useful reference relationship is Untitled UI's restrained control hierarchy and careful alignment, adapted to a reading task rather than its dashboard patterns. Sources: frozen UI Harmony v3 `references/templates/workspace.md`, `references/organisms/workbench.md`, `references/templates/article.md`, `references/preferences/modern-saas.md`, `references/preferences/untitled-ui.md`; [Untitled UI](https://www.untitledui.com/); [Tidwell's Common Ground](https://www.mit.edu/~jtidwell/common_ground_onefile.html). The articles, people and publication are fictional, original content.

## State and assumptions

Four stories contain 317–345 words each with stable paragraph IDs. Comments, selection, title/summary, per-story drafts, anchor, readiness and review history are saved in browser localStorage. A comment or reopened comment clears readiness; a title/summary edit also clears it. All open comments are treated as blockers. There is no network collaboration, publishing or message delivery. Browser storage can be cleared by the browser or user; storage failure is surfaced in the header. Initial comments are examples, and dates on the fictional articles are editorial fixtures.

## QA and refinement

- First runnable baseline was preserved and announced before browser review. Chrome screenshots at 1440×900 and 390×844 were inspected; the desktop reading measure and sidebar relationship were retained. Phone reading keeps paragraph comment controls visible and switches to a focused review view.
- Browser interaction verified add, resolve, filter, reload, reopen, readiness, title edit, history, story switching, and draft plus anchor restoration. A phone check verified paragraph → composer focus, comment creation, and comment → focused source. Phone document had no horizontal overflow at 390px.
- The initial axe scan found low-contrast secondary labels and duplicate complementary landmarks. The self-review darkened secondary text and named the landmarks; a repeated desktop axe scan reported no violations. This automated scan does not establish complete accessibility.
- `npm run build` passes. Vite emits a non-fatal warning about dependency-level `use client` directives. The lockfile and installed packages were copied from the adjacent local baseline because the registry install did not finish; dependency versions match the lockfile.
- Further limits: no user study, server-side persistence, cross-device sync, or collaborative conflict handling. Focus trapping and Escape are implemented for the edit dialog, but exhaustive assistive-technology testing and additional viewport/text-zoom checks remain. The screenshots are in `/private/tmp/proof-desktop.png` and `/private/tmp/proof-mobile.png`; they capture the baseline before the contrast refinement.


## Independent remaining-app review

Independent review verified ten named checks covering edit dismissal/focus return, title/comment persistence, blockers/readiness/reopen, phone draft-anchor recovery, source focus and history. Removed inert workspace options, duplicate review scaffolding/inline edit action, unsupported reading time and duplicate phone tabs; ALL STORIES replaces the inaccurate fixed IN REVIEW count. Added named phone navigation landmarks, composer focus treatment, modal scroll bound and edit-trigger focus restoration. App-local Vite cache/React dedupe prevents shared dependency collisions. Final desktop/phone default axe scans are clean and 320px root overflow is absent. Build passes with existing non-fatal Lucide directive warnings. Evidence and exact limitations: `independent-review/` and `../REMAINING-REVIEW.md`.
