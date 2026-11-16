# Margin immutable baseline review

2026-11-15. Inspected root-baseline1440.png,390.png,390-full.png and390-aria.txt. Read relevant current main.jsx/style.css to understand target and view-switch mechanics. Generating agent was concurrently doing its own QA; findings below are tied to the root baseline, with code used as mechanism evidence rather than silently treating a later state as the same artifact. No self-evaluation or app edits used.

## Supported strengths

This is a bespoke research workspace, not a renamed analytics dashboard. The desktop places source excerpts beside an authored interpretation, distinguishes supports from challenges, retains author/time/provenance, and explicitly explains that linked evidence is not certainty. The reading type has comfortable line spacing and appropriate emphasis. Its warm neutral/green system, understated edges and restrained section numbering form a coherent visual family. No novelty treatment is needed.

The phone makes a defensible choice to present one working mode at a time rather than squeeze two columns. Excerpts retain quotation, author, role and source affordance. The basic adaptation strategy should be preserved.

## Material task-context gaps

### The target of linking disappears in phone evidence mode

The baseline exposes Supports/Challenges on every excerpt but hides the finding title/content in the other mode. The visible nav says Working finding3, while the top selector says Findings1. Source confirms3 is linked excerpt count, not findings. The excerpt buttons operate on `draft.links` of the active finding.

Consequence: the key relationship in this application becomes implicit precisely where the user commits it. With multiple findings, the reader cannot verify which claim receives an evidence link without switching modes and remembering its title. The number also invites the wrong interpretation.

Correction: keep a compact identity of the currently edited finding available in evidence mode, with a route to inspect it; explicitly describe the attached-evidence count. This may be a short context bar or another proportionate treatment, not a mandate for another card, persistent wide pane or duplicated entire editor. Test a second finding with a long title, return from sources and switching findings. Preserve excerpt readability, current selection and draft.

### Cross-mode access is remote after later excerpts

The six-excerpt phone document is over2000px tall. The only Evidence/Working finding switch is above it; current CSS has no sticky positioning for that control and no corresponding local return affordance. This means synthesis after reading later excerpts requires returning to the top rather than moving directly to the related claim.

Correction: provide a reachable mode/context affordance while reading, or a local action that carries the excerpt/finding context into the other view. A sticky control is one option, but must not consume the reading viewport or cover actions. Preserve each mode's scroll position if repeated comparisons require it. Do not solve this by reducing quote type or turning meaningful excerpts into heavily truncated cards.

These are relationship/adaptation failures, not lack of visual originality. The current one-finding fixture may conceal their importance, so a second-finding scenario is the appropriate probe.

## Additional verification, not predeclared failures

- Supporting provenance and evidence-map text is quite small and pale; check actual contrast and its reading role. Do not infer WCAG failure from pixels or impose a universal font-size minimum.
- Source context should reveal before/quoted/after material associated with the exact excerpt, with focus return; the static Source arrow proves neither.
- Test Supports→Challenges replacement, unlink/undo and save/revert without affecting another finding. A success toast alone is insufficient.
- Distinguish saved revision from locally persisted draft. The draft/save language is promising, but its behavior must survive refresh and recovery.
- Check long finding titles, empty search, native-dialog long content and narrow viewport focus. A complete static desktop does not establish these states.

## Baseline verdict

Strong visual and domain-specific foundation; not yet accepted for the repeated mobile synthesis task because the current target and cross-view continuation need clearer access. No claim of a general aesthetic deficit, and no reason to imitate Untitled UI's settings page or introduce unrelated metrics/cards.

## Independent revision check

A fresh390px browser context created a second finding, gave it a representative long title, saved it, returned to evidence, scrolled to later excerpts and linked excerpt06. The sticky target named the new finding at y64; its count became1linked, while switching to the original retained3linked. The mobile target/unit/isolation repairs work in this scenario.

One transition remained: clicking Edit from the late excerpt region retained scrollY577, placed title bounds−65.8..37.4 under the sticky nav, and left focus on BODY as the clicked button unmounted. Explicit Edit should reveal/focus the appropriate editor target and use an intentional return position. Screenshot `margin-after-edit-phone.png`; data `margin-live-probe.json`. This is a local continuation defect, not reason to redesign the workspace.

Manual color adjudication: linked excerpts use a transparent-to-rgba(247,250,244,.667) gradient over a white evidence pane. Computed foregrounds tested against both composited endpoints yield minimum ratios: excerpt number/time4.934,theme4.957,quote/name12.425,person role/link prompt4.580,Source5.833. Same colors at1440/390. All these gradient-deferred text candidates pass the normal-text threshold. Raw and calculated evidence in `margin-live-probe.json` and `margin-contrast-adjudicated.json`. The lower desktop rows were scrolled fully into view and inspected in `margin-late-desktop.png`; original partial-obscuration candidates arise from the bounded excerpt scroller, not persistent unreadable overlap. No blanket dismissal of every future incomplete is implied.
