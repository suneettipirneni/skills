# Real-world adversarial iteration verdict

2026-11-15. The iteration found and repaired meaningful failures that the synthetic corpus missed. Revised collector/classification/report changes are suitable to ship, with the coverage limits below. This is a case-study calibration exercise, not a statistical quality benchmark.

## Evidence directly inspected

Reviewed initial phone screenshots for GOV.UK, Stripe, Arngren and Berkshire; desktop screenshots for Stripe and Arngren; current audit JSON; new GOV.UK/Arngren v3 JSON; GOV.UK skip-link focused screenshot; Berkshire report-directory screenshot; Arngren category screenshot; Stripe initial/task screenshots. Read task-results.json, final-task-results.json and settled-task-results.json; inspected stripe-menu-settled.png. Read the revised collect/analyze/axe/report code and focused regressions. Independently ran28unit tests successfully before the new calibration route; the later29-test run passed28 and failed only on the not-yet-written linked real-world-evaluation.md. Checker-version comparison rejection passed. Independently executed four local Chrome collector fixtures and a live Arngren browser probe.

## Findings that materially changed the tools

1. **Missed real overflow.** Arngren has BackCompat/body scrolling. Old audit measured root scrollWidth390 and reported no excess, even though body width was3495. Independent live browser probe confirmed these values. Revised real capture correctly reports3105px phone and2055px desktop excess. Local-scroller fixture correctly retains zero page excess, avoiding a blanket distant-descendant heuristic.
2. **Accessibility-only content mislabeled as visual damage.** GOV.UK's12 major clipping candidates were hidden labels/headings/skip link. New report retains12 contextual hidden-pattern reviews and preserves ordinary clipping detection. Inspected focused skip-link image shows a visible yellow focus region; the later task locator failure does not erase that evidence. Hidden native inputs with visible associated controls are explicitly accommodated, and ancestor inert handling was corrected.
3. **Standards conflated with advisory practice.** GOV.UK's4 axe:region instances now remain visible as best-practice advisories rather than generic accessibility failures. WCAG tags, result class and rule provenance are preserved.
4. **Unusable report volume.** Stripe's initial result included162 incomplete contrast reviews versus4 actual contrast-violation nodes. New grouping separates kind/rule/standard/result and retains all raw instances. Arngren's thousands of occurrences similarly require grouped causal review, not a numeric design score.

## Independent fixture checks

`collector-regression.mjs` / `collector-regression.json` cover quirks root excess, legitimate local scrolling, hidden skip text alongside genuinely clipped text, and hidden native control with visible proxy. All outputs matched their intended distinctions. The native control test prompted the associated-control wording improvement. `probe-arngren.mjs` independently established the real root-scroller defect.

## Task and interpretation challenges

- Arngren's visible first-fold fatbike image/price and working category link are strengths. Do not infer all tasks fail merely because the visual style is dense. Its category phone capture then shows a large blank region before specifications and separates useful product information from the visible frame: a specific continuation worth diagnosing. Photos/assets and geometry must be inspected before claiming a cause.
- Berkshire annual/interim reports are easy to locate from the homepage; the report grid visibly exposes annual2025 near the top. Its direct document access deserves preservation. Narrow two-column home labels wrap heavily, but that alone does not establish task failure. Current letter routing reaches Greg Abel's directory and2025PDF; historical Buffett references are not current task ground truth. Empty link textContent alone does not establish missing accessible names; inspect image alt/ARIA.
- GOV.UK's first-visit cookie banner occupies much of the viewport. A settled page and first-visit page are distinct scenarios. Focused skip-link reveal is visibly verified. A subsequent settled probe resolves the earlier locator failure: after rejecting cookies/reloading, first Tab reveals a390×40px skip link and Enter reaches#content. Start now is an anchor with role=button and href=https://www.passport.service.gov.uk/filter. No application was started or submitted.
- Stripe mobile menu opens and exposes product discovery paths; escape reports expanded=false. The settled keyboard probe resolves the earlier limited focus log: Enter opens the menu, Escape closes it, and focus returns to BUTTON with aria-label Toggle navigation menu. Independently viewed the settled menu screenshot: readable grouped navigation and visible focus, no transient overlap. No signup or complete product-selection task was performed.

## Corpus honesty

Historical award/criticism is only the selection rationale. GOV.UK's2013 award does not certify today's passport page. Teddy Blanks's2007 Yale praise counters blanket worst-site labels but does not establish modern admissions usability. Berkshire has genuinely opposed commentary, neither based on this run's participant testing. Four legacy/contested examples plus two positive candidates are intentionally chosen stress cases, not a representative distribution of UI.

Yale and PennyJuice produced no current captures. Adidas and Catbird held-out attempts returned403 with no captures. Treat all as unavailable evidence; none establishes good or bad design, and no held-out validation success has been demonstrated. A web search fetch succeeding does not mean this browser test succeeded. Arngren's broken third-party counter remains disclosed while its usable catalogue captures support scoped findings.

The corrected results reduce false framing and recover a real defect; they do not prove a universal ability to judge pleasantness. Automation remains contract/geometry/standards evidence. Task meaning, deliberate expression, animation, optical relationships and audience suitability still require review and, where necessary, actual participant evidence.

Research sources, dates, version caveats and proposed corpus extensions are in [methodology and sources](real-world-methodology.md).

## Final additions checked

Reviewed the new reference-calibration condition route: it distinguishes dated reception, capture limits, matching tasks, hidden-control proxies, standards/advisory/incomplete evidence, deliberate strengths, version-sensitive comparison and unavailable held-out cases without claiming participant validation. Checker-version comparison prevents tool changes from being reported as website repairs. Settled interaction evidence resolves the GOV.UK and Stripe unknowns described above. The only temporary packaging issue in the latest run was a reference to the parent's still-in-progress real-world-evaluation.md; rerun local-link validation once that file is present.

## Packaging completion note from main agent

The report document referenced by the new route has now been added. The final complete suite passed all 29 tests, including local-link validation; the earlier missing-link observation above records the reviewer’s actual in-progress state.
