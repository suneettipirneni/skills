# Calibrate against praised, criticized and disputed designs

Layer: **conditions** · Route: `reference-calibration`

**Use when:** Evaluating the skill/rubric itself, learning from established interfaces or checking whether a critique would erase intentional design.

**Avoid when:** Treating a famous domain, award or “worst websites” list as a ground-truth quality label.

## Establish the evidence before the verdict

Choose a small, diverse set of task-relevant examples. Include a respected conventional interface, an expressive one, a documented failure and an unconventional or plain counterexample. Match tasks, content density, platform and state when making direct comparisons. A service-entry page and a marketing homepage can inform separate case studies but are not matched benchmark subjects.

Record the exact URL, capture date, viewport, state, region/theme, readiness and tool version. Separately record reception source, author, date, the particular praised/criticized mechanism and how closely the current version matches. An award for a 2013 service does not certify today's page. A historical participant failure is evidence about that task and version, not a permanent label for the company.

Inspect current evidence and record strengths before reading a detailed critique where feasible. Separate what the interface does, what the external source claims and what you infer. Do not force findings to agree with reputation. A useful review can recommend **no visual change** while identifying an unrelated semantic-accessibility repair.

## Apply the skill as a designer, not a style judge

1. Define one concrete task and select only its relevant routes.
2. Capture the initial state and relevant settled/interactive state. A cookie banner or unfinished transition changes what the screenshot proves. Do not diagnose a mid-transition frame as a permanent overlap without checking completion and interruption.
3. Write at least one observed strength and one harmful “repair” to avoid. Plain links may support fast lookup; purposeful density may enable comparison; an unconventional visual language may serve the audience.
4. Run measurements, then inspect their actual evidence. Distinguish a WCAG-tagged axe result, an axe best-practice advisory, an incomplete check and a geometry candidate. Rule occurrence counts depend on page size and markup; they are not an ordering of design quality.
5. Verify a meaningful interaction where available: focus/keyboard, category-to-detail, menu dismissal, return context or recovery. Record partial progress and locator/tool failures separately from product failures. Do not claim participant task success from an agent navigating a site.
6. Adjudicate representative candidates with evidence: actionable defect, intentional pattern, unresolved applicability, capture limitation or tool defect. Name the owner and the smallest coherent repair; retain the identity and relationships that work.
7. Fix the checker with a small regression fixture. Preserve a negative control: a legitimate local scroller, a genuinely clipped control beside hidden accessibility text, or an expressive layout whose unusual values are intentional.
8. Freeze changes before trying a new case. A site used to tune the checker is a development case. If the unseen case is blocked, report the gap; do not call it a passed validation or repeatedly work around access controls.

## Interpret difficult evidence

**Hidden accessibility text:** A clipped 1px absolutely positioned label may be intentional. Review its semantic purpose. A skip link should reveal on focus; a hidden native checkbox may have an associated visible control/focus treatment. Do not enlarge all hidden text. The tool recognizes a narrow CSS pattern and retains a dedicated review item; it does not prove the intent correct.

**Small links:** Inline links can fall under target-size exceptions. A small bounding box is a review candidate, not a command to turn every paragraph link into a padded button. Context metadata helps triage; verify the real exception and nearby targets.

**Root overflow:** Standards and quirks documents can use different scrolling elements. Inspect the actual document scroller rather than the furthest child edge: offscreen carousel slides and legitimate local scrollers must not become page-overflow failures.

**Axe output:** `violations` and `incomplete` are different results. Best-practice-only rules are advisories here and do not trigger WCAG/contract severity gates. A WCAG-tagged result still needs correct applicability; illustrative text in a demo is not automatically equivalent to a live checkout control. Do not dismiss it merely because the site is respected.

**Incomplete resources:** Keep a missing counter image, unavailable font, blocked request and blank page distinguishable. Preserve the tool's incomplete status while explaining which observations remain usable. Do not silently exempt resources just to turn a run green.

**Historical motion failures:** A still image cannot show whether content disappeared before someone could use it. [Jakob Nielsen's 2013 Siemens case](https://www.nngroup.com/articles/auto-forwarding/) reports a participant missing a washing-machine promotion on an auto-forwarding surface. This supports checking timing and control, not a claim about today's Siemens site. [W3C's carousel tutorial](https://www.w3.org/WAI/tutorials/carousels/) guides keyboard operation, pause/resume and understandable focus. Avoid prescribing a universal slide duration or interpreting one participant as a general failure rate.

## Feedback and reporting

Report scope and denominators: how many cases were attempted, usable, blocked and actually inspected; how many candidates were reviewed versus left unresolved. Do not compute precision or false-positive rates unless independent labels and a defined sample justify them. “No false positives found in these four fixtures” is not a population estimate.

Use **evidence → intended relationship → consequence → owner → proposed change → preservation → verification**. Include reasons to leave something unchanged. A checker revision can change counts without any website changing; the comparison tool rejects differing checker versions to avoid mistaking that for a design repair.

See the [real-world iteration report](../real-world-evaluation.md) for actual cases, screenshots, tool defects and remaining gaps.
