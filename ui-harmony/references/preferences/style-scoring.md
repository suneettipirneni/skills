# Scoring the modern SaaS preference

Use `modern-saas` by default for this user's new designs and substantial refinements, unless the current brief selects another direction. Keep the general UX profile in [evaluation](../evaluation.md). Its ordinal ratings are not averaged. This **separate, explicitly subjective preference index** helps choose the visual direction the user requested.

## What the number means

The machine-readable [profile](../../assets/style-profile.json) is the single source of truth for seven criteria and their criterion-specific 0–4 anchors. Run `node scripts/style-score.mjs profile` to see them.

| Criterion | Weight | Distinction |
| --- | ---: | --- |
| Quiet hierarchy | 20 | Relative attention between work, navigation and actions |
| Surface restraint | 20 | Containment and depth, not text or color counts |
| Typography | 15 | Type roles, optical rhythm and compact app character |
| Density and rhythm | 15 | Useful proximity and pacing for the particular task |
| Component precision | 15 | Related shapes, controls, icons and states |
| Purposeful color | 10 | Color's semantic role and restrained working palette |
| Product character | 5 | Purposeful identity or deliberate neutrality grounded in the product |

The weights total 100. For a **fully reviewed** case: `styleFit = round(sum(weight × rating / 4))`. The index uses an authored linear convention over ordinal judgments; it is not a measured interval scale. A rating of 3 everywhere yields 75 and means aligned with the direction, not a C grade. No universal pass mark, precise beauty claim or automatic winner is implied. Small deltas require looking at the actual changed criterion and evidence. The weights reflect the user's taste, not numbers established by the articles.

Ratings broadly mean 0 = opposed, 1 = weak fit, 2 = mixed, 3 = aligned, 4 = refined. **Null is unreviewed**, never zero. All seven criteria remain in the denominator; any null withholds the total and exposes reviewed weight. Do not silently omit a troublesome dimension, substitute N/A or rescale the remaining ratings.

Interpret type scale and density by declared surface and region: an editorial marketing hero can be refined without using compact app labels. In a hybrid, review product and marketing regions separately if their roles differ.

Do not count one problem three times merely to increase its penalty. Locate its primary cause. A loud decorative badge normally belongs to purposeful color; lower hierarchy or surface restraint as well only if there is separately explained attention or containment evidence. A warning, selected item, chart or brand detail can score highly even with strong color. Deliberate neutral typography and domain-specific language can satisfy product character without a novel logo or extra flourish.

## Evidence contract

Copy [style-review-template.json](../../assets/style-review-template.json). The tool does not look at screenshots and invent taste scores. A reviewer inspects the rendered design, states and context, then supplies:

- Candidate, reviewer, declared scope and comparison context: task, audience, route, surface (`product`, `marketing`, `hybrid`), fixture, viewport, theme, state, evidence mode.
- Each criterion's rating, anchor-matching reason, located evidence, confidence, tradeoff, next concrete change, and what to preserve. For 4, nextChange can explain why no change is justified. For null, give the missing-evidence reason.
- Four separate task, legibility, interaction and adaptation gates. Each has `pass`, `fail` or `unknown`, evidence and a reason. A pass is only for the declared scope and tests, never whole-product certification.

Example: surface restraint 2, “Desktop collection screenshot has a bordered shell, a shadowed list card, then shadowed cards for every row. Remove the per-row raised surface and keep the list boundary; preserve selected-row contrast. Recheck row grouping at 390px.” The numerical rating is interpretation. The measured three nested boundaries are observation. Do not invent CSS measurements from screenshot pixels.

Gate interpretations:

| Gate | What must be established to pass within scope |
| --- | --- |
| Task | Required content/actions remain available and the scoped task probe succeeds; no false claims from a visually empty screen |
| Legibility | Relevant actual text/state contrast, readable content and applicable accessibility checks have evidence; no known unresolved barrier hidden by style |
| Interaction | Relevant keyboard/focus, control meaning and changed behavior work; errors/recovery covered if part of scope |
| Adaptation | Declared size/content stress cases preserve content and hierarchy; a desktop still alone is insufficient |

Static screenshot/design-file evidence may show a definite visible failure but cannot pass these functional gates; unknown remains explicit. Other evidence modes still need actual checks. Setting a string to `pass` is a reviewer assertion: the validator cannot verify the truth of evidence. Existing audit findings and accessibility gates take precedence; never manually mark pass to erase a known failure.

## Outputs and ordering

```sh
node scripts/style-score.mjs assets/style-review-template.json
node scripts/style-score.mjs compare before-style.json after-style.json
node scripts/review.mjs full-review-with-optional-styleReview.json
```

`review.mjs` accepts the same object as optional `styleReview` and emits it separately as `stylePreference`. Embedded task, audience and scope must match the parent review. Unresolved parent accessibility gates cannot coexist with a legibility pass, and broken task/type/interaction/adaptation dimensions require the corresponding failed gate. The browser auditor retains its factual contract/geometry/axe lanes; it does not automatically compute subjective style fit from element counts.

- `blocked`: at least one gate fails. A high style number remains visible as preference evidence, but cannot support a recommendation.
- `incomplete`: no failed gate, but criteria remain unreviewed; score is null.
- `provisional`: all criteria reviewed but at least one gate unknown. Display the score with this label, never as an approved design.
- `eligible-for-scoped-comparison`: criteria complete and declared gates pass. This is permission to compare that scope, not universal UX approval.

Comparison refuses different task/audience/route/fixture/viewport/theme/state/surface/evidence mode, scope or reviewer; both inputs must use the current profile version. Compare each responsive scenario independently. Do not launder a desktop-only score into a product-wide number. The tool provides a delta, not an automatic winner. A new reviewer needs calibration; a changed rubric needs rescoring both artifacts. Preserve original reports.

The output lists criterion contributions, original evidence and actionable next changes. `weightedGap` orders potential **style** improvements only; task/accessibility severity always comes first. Confidence is reported, not converted into fabricated statistical certainty. A lower style-fit design can still be excellent for a different brief.

CLI exit 0 means structurally valid evaluation, including provisional/blocked reviews; it is not a ship gate. Invalid input or refused comparison exits 2. Read `recommendation` and the gate reasons explicitly.

See [rendered calibration and adversarial validation](modern-saas-validation.md) for examples, actual outcomes and limits.
