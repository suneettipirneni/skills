# Optical and placement calibration

Validated on2026-11-16 for UI Harmony tools2.4.0. These checks establish scoped diagnostic behavior, not a universal measure of interface quality.

## Automated checks

| Suite | Result and scope |
| --- | --- |
| `npm test` | 63 unit tests passed across the tool suite, including signed edge/inset arithmetic, pixel-cell geometry, threshold sensitivity, comparison and report-bound review. |
| `npm run test:optical` | 157 browser assertions passed at1×/2×. Expected unsupported/unstable cases remain incomplete; an all-supported fixture remains review-needed rather than an optical pass. [Retained summary](../assets/examples/optical/optical-browser-checks.json). |
| `npm run test:detail` | 38 assertions passed, including intentional collision failures, unsupported paint and exact style restoration through stable element handles. [Retained summary](../assets/examples/optical/detail-browser-checks.json). |
| `npm run test:browser` | Seven general audit cases passed. The corrected fixture has zero confirmed findings and retains three contrast reviews; unresolved review evidence was not counted as a pass. |
| `node scripts/route.mjs check` | All66 routing nodes structurally valid. This checks routing integrity, not design correctness. |
| Independent adversary | Nine arithmetic checks and13 final workflow checks passed. Twenty browser profiles exposed four expected unsupported cases and four additional static SVG captures with original/restored pixel drift; these remain unverified. |

The optical browser suite includes centered and asymmetric paint, meaningful ancestor references, threshold-sensitive paint, empty masks, fractional origins, scrolling, restoration, rounded safe interiors and unsupported clipping/effects. Its expected incomplete summary is not a failed test suite: assertions require honest incomplete outcomes on those cases. Conversely, a passing suite does not establish support for every SVG or compositing mode.

## Actual-app applicability: Cue's idle play control

The [capture configuration](../assets/examples/optical/cue-config.json) selects only the play icon and its button, with containment and paint-balance checks. It was captured at1440×1000/DPR1 and390×844/DPR2. The app's layout was not modified for the measurement.

- Both containment contracts pass; both optical profiles require review; no measurements are unverified.
- Desktop paint-bounds center offset is(+2,+0.5)CSSpx; binary coverage centroid offset is approximately(+0.153,+0.534)CSSpx.
- Phone paint-bounds center offset is(+1.75,0)CSSpx; coverage centroid offset is approximately(−0.173,+0.015)CSSpx.
- All sampled thresholds produced valid paint; neither zero offset nor equal offsets are acceptance requirements.

Inspect the [measurement report](../assets/examples/optical/cue/report.html), [raw report](../assets/examples/optical/cue/report.json), and [natural CSS-size context viewer](../assets/examples/optical/cue/context.html). The context images were separate idle-state captures; they are not atomic with the isolated-paint capture. The scoped visual review retained the existing triangle placement: it reads clearly in its circular primary control alongside the transport row. This is not approval of adjacent seek numerals, other states, hit targets or the whole app.

The [completed judgment](../assets/examples/optical/cue/review.json) is bound to the exact report bytes and produces [reviewed](../assets/examples/optical/cue/review-result.json). The unfilled template correctly produced exit2/incomplete. Reproduce the completed review from the skill directory:

```sh
node scripts/optical-review.mjs assets/examples/optical/cue/report.json \
  assets/examples/optical/cue/review.json
```

A rounding-related coverage limitation was repaired during validation: simple circular pixel-radius ancestors now permit paint wholly inside a conservative safe interior. Near-corner or more complex clips remain unverified. We did not remove the app's rounded corners to make the tool pass.

## Independent challenge and controlled comparison

Read the [adversary's full review](../assets/examples/optical/adversarial/REPORT.md) for primary-source reasoning, counterexamples and transfer limits. The [original synthetic fixture](../assets/examples/optical/adversarial/fixture.html) covers square, triangle, equal-bounds circle, badge/base, faint satellite, clipped shape, hollow form and fractional placement. These are diagnostic counterexamples, not a normative design gallery.

A partially occluded base icon showed why its visible-contribution centroid is not its intrinsic asset center. Four static SVG profiles changed during isolation; [pixel-drift evidence](../assets/examples/optical/adversarial/drift.json) is retained rather than loosening the stability guard. Some changed pixels crossed paint thresholds, so accepting them silently could change the reported result.

The independent before/after square capture produced a signed1px movement; the comparator describes this without calling it an improvement. The archived capture was made during staged development and retains its original version metadata. Both reports match each other and remain readable by2.4.0:

```sh
node scripts/optical-compare.mjs \
  assets/examples/optical/adversarial/compare-before/report.json \
  assets/examples/optical/adversarial/compare-after/report.json
```

The installed CLI returned exit0 for that compatible pair and exit2 with no delta table when paired against Cue's different fixture. The independent probes also rejected stale reviews, incomplete judgments, invalid sensitivity, cross-axis edges and malformed input. A human accept cannot override an authored placement failure.

Remaining limitations: human visual judgments are recorded, not proven; binary paint coverage ignores perceived salience; measured CSS font metadata cannot identify the resolved font file; fixture labels cannot prove identical content; unsupported paint may need manual or platform-specific inspection. No automatic correction, universal pixel tolerance or beauty score is inferred from this evidence.
