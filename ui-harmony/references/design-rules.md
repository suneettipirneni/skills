# Run the design rule catalog

Use a single rule for a focused repair, a category for a specialist pass, or all rules for holistic feedback. Every selected rule produces a result with its procedure, acceptance evidence, and status. All commands below run from the skill directory. The [catalog](design-rule-catalog.md) doubles as the offline registry. The [browser tools guide](tools.md) covers Playwright installation.

```sh
node scripts/design-rules.mjs list --category typography
node scripts/design-rules.mjs list --rule line-height
node scripts/design-rules.mjs run --all --url http://localhost:3000 --out /tmp/design-first --channel chrome
node scripts/design-rules.mjs loop --url http://localhost:3000 --out /tmp/design-loop --channel chrome --review /tmp/design-reviews.json
```

For the last command, initialize the review file with an empty JSON object. For a screenshot, native capture, print proof or study record, replace `--url URL` with `--subject FILE`. The runner archives the supplied file. Use `--ready SELECTOR` for a stable web state. The optional `--config FILE` is reread each round. A fresh output directory keeps captures and issues from different tasks distinct.

## Give the next designer actionable feedback

1. Read `feedback.md` for open findings, measured candidates and the outstanding review queue. Inspect the cited selector and screenshot. Use `report.json` for exact bounds, sample counts, issue keys, external measurements and evidence paths.
2. State the affected task, intended relationship, observed failure, smallest useful correction, and one quality to preserve. A 12 px link box calls for inspecting its inline context and neighboring targets before changing its size. Reserve perception and usability claims for the observation described in the corresponding catalog entry.
3. Repair the owning component in the working project. Run the same scope and states again. The loop observes changes made by the designer, application tooling or coding agent. An optional repair executable can make the change between rounds. It writes its own reports and evidence.
4. Complete the applicable contextual checks. For an unsupported surface or case, leave the row pending until the relevant artifact is available. Record a specific reason and supporting artifact when a rule genuinely falls outside the task.

The browser pass uses the skill's audit runner for rendered screenshots, DOM measurements and axe. It extracts relevant axe results for contrast, target size and inline link cues. The companion `browser/report.html` contains the broader accessibility audit. Generated color shares measure quantized viewport pixels including images. Semantic roles, actual gaze and audience preferences require interpretation. Browser probes sample up to eight visible light-DOM matches per rule and report total matches. A computed family is a requested stack, a canvas x-height is a glyph estimate, and line counts cover simple untransformed horizontal text nodes up to 2,000 UTF-16 code units. Complete-line counts omit the final partial line. Use the scoped tools when a sample misses the intended component.

## Add measurable contracts or studies

The [working example config](../assets/examples/design-rules/checks.json) targets the [statement fixture](../assets/examples/design-rules/fixture.html). Pass a file URL for the local HTML. Each `checks` entry selects exactly one visible element per viewport, gives the design rationale, and names fields listed by `list --rule ID`. Use inclusive numeric `min` and `max` bounds or a scalar `equals`. CSS properties are computed strings such as `"24px"`. Fields ending in `Px` and ratios are numbers. Zero or multiple matches, unavailable values and incomplete browser captures keep the check open. Passing a DOM contract records a successful measurement. Review the catalog's remaining acceptance evidence.

A holistic web run captures light and dark color-scheme preferences. Supply `"themes":["light"]` for an explicitly light-only scope. Use a state study for product-controlled theme switches. Dark captures are in `browser-dark/`. The optional `audit` object accepts `viewports` and `maxElements`. Add `studies` to the same config to run product-specific validation scripts alongside every selected rule they cover. Paths resolve relative to the config. A local study module executes its authored interactions. Choose a test fixture appropriate for those actions. Supply each study with a unique name.

```json
{
  "studies": [
    {"name":"submission","tool":"state-study","file":"./submitted.mjs","rules":["button-design","reward-anticipation"]},
    {"name":"toolbar-ink","tool":"detail-audit","file":"./toolbar.json","rules":["icon-alignment","icon-optical-balance"]},
    {"name":"brand-proof","tool":"appearance-study","file":"./brand.mjs","rules":["logo-variations"]}
  ]
}
```

Define the inputs using the [state study](state-study.md), [detail audit](detail-audit.md), and [appearance study](tools.md#source-relative-appearance-studies) guides. Each study runs once per round and shares its evidence across the named rules. Appearance specs own their source and candidate URLs. Verify that the spec targets the intended design. A state or appearance capture can supply evidence for a contextual judgment.

## Check observed task outcomes

For perception and behavioral rules, `list --rule ID` identifies the supported trial task. Under `trials` in the config, specify a local study data file, the required participant count and the minimum acceptable accuracy. Add a maximum median time or minimum accuracy gain where the brief calls for a timing or paired comparison. Set these criteria from the task before evaluating outcomes.

```json
{"trials":{"banner-blindness":{"file":"notice-trials.json","minParticipants":3,"minAccuracy":1}}}
```

The data file records the rule ID in `rule`, the report's `targetBasis`, the actual `protocol`, the `audience`, and an `observations` array. Each trial has a pseudonymous `participant`, a `task`, a `condition` of `candidate` or `baseline`, and exact nonempty string `expected` and `answer` values. Use an explicit category such as `"missed"` for a missed notice. Include numeric `timeMs` when using `maxMedianMs`. When using `minAccuracyGain`, supply both conditions for the same participant/task pairs and the same answer key.

The runner detects duplicate trials, insufficient participants, unmatched conditions, stale target revisions, misses and threshold failures. A verified trial result covers that task, audience and recorded sample. For example, compare observed notice detection during renewal across placements before making claims about banner blindness. A screenshot can establish where the notice appeared.

## Verify physical and supplied measurements

Under `measurements`, key each object by rule ID. Include `reason`, a local evidence file in `artifact`, its `artifactSha256`, and the fields below. SHA-256 binds an assertion to the bytes actually inspected. Use `shasum -a 256 FILE` to obtain it. When the measurement artifact differs from the subject, copy the current `targetBasis` from the report after confirming the target revision. The runner reports the expected hashes when they are missing or stale.

| Rule | Input fields | Calculation |
| --- | --- | --- |
| `rgb-vs-cmyk` | `sourceModel`, `outputModel`, `requiredModel`, `embeddedProfile`, `requiredProfile` | Checks the exported color model and embedded profile against the job. Review gamut changes on a proof. |
| `cmyk-vs-pantone` | `plates`, `orderedPlates` as unique, exact ink names | Lists missing and unexpected process or spot plates. Confirm overprint and fallback on the proof. |
| `iso-216` | `size` (A0–A10), `widthMm`, `heightMm`, `toleranceMm` | Compares both trim edges in either orientation against nominal dimensions. |
| `visual-angle-arcminutes` | `heightMm`, `distanceMm`, `minimumArcmin` | Computes the angle subtended by a centered detail and applies the declared recognition target. |
| `cielab-color-space` | `reference`, `sample` as Lab triples, `whitePoint` with observer, `tolerance` | Computes Euclidean ΔE76 under the common reference conditions. |
| `luminance-vs-lightness`, `wcag-contrast` | Opaque sRGB hex `foreground` and `background`, `role` of `normalText`, `largeText` or `necessaryNonText` | Compares the unrounded luminance ratio with the applicable AA pair threshold. |
| `dieline-bleed`, `logo-clearspace` | `top`, `right`, `bottom`, `left`, `required`. For logo clearance supply `unit`. | Compares the smallest edge with the job requirement. Bleed uses mm. Review the artwork or dieline too. |

The trim, visual angle, Lab difference and luminance calculation can produce a scoped verified result directly from current measurements. The reviewer establishes the actual dimensions, viewing assumptions, color profile or composited samples. WCAG contrast coverage, logo protection and production bleed also require contextual review. The [A-series dimension table](https://resources.cs.rutgers.edu/docs/paper-size/) and [WCAG contrast guidance](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) give the reference values.

## Record a review and close issues

Copy the relevant entries from `review-template.json` into the file passed with `--review`. Preserve each row's `basis`. Store the observed outcome, evidence path relative to that review file, and its SHA-256. Evidence can be a screenshot from the last run, a study transcript or a print preflight report. The next run archives the referenced evidence. Recheck a stale basis against the newly captured design.

```json
{
  "banner-blindness": {
    "basis":"<current rule basis>",
    "status":"failed",
    "observation":"During the renewal task both participants continued past the expiry notice.",
    "artifact":"renewal-observations.txt",
    "artifactSha256":"<sha256 of the observations>",
    "issues":[{"id":"expiry-missed","observation":"The expiry date was missed in the renewal step."}]
  }
}
```

Statuses for submitted reviews are `pending`, `failed`, `verified`, and `not-applicable`. Use `resolves` on a verified or inapplicable review to name previous issue keys whose correction or removal you actually checked. For the example, the key is `banner-blindness/review/expiry-missed`. A current failing automated check takes precedence over a review. An absent selector, a removed contract, an omitted study or a missing participant observation cannot clear a recorded issue. A renamed component can be closed with explicit current evidence.

## Run the repair loop

`loop` selects every rule by default and also accepts `--rule` or `--category`. Every round writes a fresh numbered directory containing feedback, evidence, a review template, and an issue history with first and last sightings. Fix the design or update the review file between rounds. A positive observation for the same check can close its previous finding. If the issue returns, it reopens.

By default the loop continues until verified, with 60 seconds between rounds. Use `--interval SECONDS` to change the polling interval and `--max-runs N` to bound a session. For an agent-driven edit cycle, use a one-round budget and resume after each repair. Use the same target, rule selection, config and review paths on resume.

```sh
node scripts/design-rules.mjs loop --url http://localhost:3000 --out /tmp/repair --review /tmp/design-reviews.json --max-runs 1
node scripts/design-rules.mjs loop --resume --url http://localhost:3000 --out /tmp/repair --review /tmp/design-reviews.json --max-runs 1
```

Exit 0 requires closure of all historical issues and a verified result or evidenced inapplicability for every selected rule. Exit 1 reports open issues. Exit 2 reports missing review, incomplete evidence or an execution/input error. Reaching the budget preserves the unresolved outcome. The highest completed round's `report.json` is the resume point. If an unclean shutdown leaves `.running`, inspect its PID and remove the stale lock only after confirming the owner has exited.

### Let an agent perform the repair between rounds

Pass `--repair /absolute/path/to/executable` to run an existing local fixer or agent wrapper after each unsuccessful round that has a verification round remaining. The executable receives the absolute paths to `report.json` and `feedback.md` as its two arguments, runs from the invocation directory, and can update the design or the review file. It can use the per-rule procedure, observed value, acceptance criterion and prior issue keys from the report. Its output is retained in `repair.log`. A zero exit triggers fresh validation immediately unless you also set `--interval`. A nonzero exit stops with an incomplete outcome and preserves the round. Only the validator can report success.

For behavior changes that leave the initial frame identical, pass `--revision-file PATH` to include a build ID or the relevant implementation file in each evidence fingerprint. The default browser fingerprint covers the observed frames. Include state studies for outcomes that depend on interaction.

## Check upstream coverage

```sh
curl -fsSL https://designparser.de/data/rules.json -o /tmp/designparser-rules.json
node scripts/design-rules.mjs inventory --source /tmp/designparser-rules.json
```

The comparison checks IDs, titles and category membership in both directions and flags duplicate upstream IDs. The bundled catalog and audit commands work offline against local artifacts.
