# Preference calibration and tool validation

2026-11-15, package 2.2.0, profile `modern-saas` v1. The profile was tested for deterministic calculation and useful criticism, not validated as a beauty measure. No user study or inter-reviewer reliability estimate was performed.

## Same-content rendered examples

Five authored queue variants use the same four tasks. Each was rendered at 1440×1000 and 390×844 CSS px. The main reviewer inspected all ten captures. The scoped keyboard probe focused the overdue task, activated it with Enter, and confirmed visible detail and focus in all ten cases. This does not test user discovery. Navigation, filtering and New task are mock controls, not a complete working app.

| Variant | Style fit | Status | What the review rewards or challenges |
| --- | ---: | --- | --- |
| [Restrained](../../assets/examples/saas/rendered/restrained-1440.png) | 75 | Provisional | Quiet app frame, flat list and readable type roles; phone header action still wraps awkwardly |
| [Warm minimal](../../assets/examples/saas/rendered/warm-1440.png) | 75 | Provisional | Warm low-chroma planes and a serif wordmark can fit just as well; cool gray and a particular font are not requirements |
| [Ornate](../../assets/examples/saas/rendered/ornate-1440.png) | 41 | Provisional | Heavy nested framing, raised rows and a large tinted header compete with work; consistent control styling is still acknowledged |
| [Excessively sparse](../../assets/examples/saas/rendered/sparse-1440.png) | 59 | Provisional | Empty space and large heading do not earn extra credit; only three complete task rows fit the desktop initial viewport |
| [Faint](../../assets/examples/saas/rendered/faint-1440.png) | 43 | Blocked | Low-contrast gray labels and weakened action/state distinctions do not become good design merely because the surface is quiet |

These values are manual anchored judgments passed through deterministic arithmetic. They are not automatic visual classifications, ground truth, or a general cross-site ranking. All are provisional or blocked because the examples lack full functional, accessibility and content-stress evidence. Comparison correctly refuses to recommend a winner from these incomplete cases.

The [observations](../../assets/examples/saas/rendered/observations.json) record actual geometry and task-probe outcomes. All ten captures had zero root overflow. Phone hides some metadata/navigation; this is disclosed rather than claimed as successful adaptation. The faint variant's normal task text uses #aaa on white: sRGB contrast approximately 2.323:1, below the applicable [WCAG normal-text threshold](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html). This is one confirmed problem, not a complete accessibility audit.

The machine-readable reviews contain located evidence, proposed changes, preservation requirements and gate reasons: [restrained](../../assets/examples/saas/restrained-review.json), [warm](../../assets/examples/saas/warm-review.json), [ornate](../../assets/examples/saas/ornate-review.json), [sparse](../../assets/examples/saas/sparse-review.json), [faint](../../assets/examples/saas/faint-review.json). Recompute any with `node scripts/style-score.mjs PATH`. Reproduce captures with `node scripts/tests/style-fixtures.mjs /tmp/saas-captures` after browser setup; captured files are illustrative review material, not a deployable product template.

## Independent challenge

The [adversarial report](modern-saas-adversarial.md) documents independent research, 46 scoring probes and an actual review of the earlier dashboard screenshot. That review produced [70/provisional](../../assets/examples/saas/dashboard-score.json), retaining unknown functional gates. Its recommendations focus on priority and visible delay status while preserving compact rows and the warm palette.

The adversary reproduced three integration problems that were fixed: comparisons ignored audience; an embedded style review could contradict the parent task or known failures; and an invalid parent could still emit a nested comparison-eligible result. Reviewer provenance is now retained in saved results. Source and semantic challenges also led to explicit exceptions for meaningful status color, labeled navigation, sparse onboarding, warm brands, instant repeated commands and region-appropriate marketing typography.

## Regression checks

The final suite has 39 Node tests. New cases exercise weighted arithmetic, unknown coverage, noncompensable gates, static evidence limits, matched comparison context, malformed inputs, computed-field injection, parent-review binding and invalid-parent CLI output. Router validation checks 64 nodes and local links. The skill-format validator checks packaging. Existing browser collection algorithms were not changed in this iteration; the ten new fixture captures exercised the browser path needed for the preference review.

The tools still cannot verify the truth of reviewer evidence. A false declaration of rendered evidence is not converted into a real test. Treat the score as a transparent decision aid for this user's chosen taste, always accompanied by its criterion breakdown and functional status.
