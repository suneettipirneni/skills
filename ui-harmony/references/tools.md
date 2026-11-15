# Tools: setup, usage, and interpretation

Requires Node 20+ and a Playwright-compatible Chromium browser. Scripts are skill-local; do not add their dependencies to the application. Existing browser tooling can be used instead, provided evidence and limitations are recorded consistently.

## Setup

From this skill directory:

```sh
npm ci --ignore-scripts --no-audit --no-fund
npx playwright install chromium
```

If Google Chrome is already installed, omit the browser download and pass `--channel chrome`. Use the environment's normal approval mechanism if browser execution/network access requires it; a sandbox launch failure is not an interface defect. Do not weaken application security settings or disable browser sandboxing to make a check pass.

Pinned versions are in `package.json`/`package-lock.json`. No dependencies are needed for `contrast.mjs`, `compare.mjs`, `review.mjs`, `route.mjs`, or the unit tests. `npm test` runs deterministic tests; `npm run test:browser` launches a local synthetic before/after fixture and checks meaningful detection and coverage behavior. The browser test uses Chrome by default; set `UI_HARMONY_TEST_CHANNEL=chromium` for the downloaded browser.

## Capture and audit

```sh
node scripts/audit.mjs --url http://localhost:3000/settings \
  --out /tmp/settings-before --channel chrome \
  --ready '[data-page-ready=true]' --fixture account-long-name-v1
```

The output directory must **not exist**. This prevents stale reports from looking current. Create its parent if needed. Paths may be absolute; run from any directory when using the absolute script path.

Default viewports are 320×800, 390×844, 768×1024, and 1440×1000 CSS pixels. These are a starting sample, not universal product breakpoints. The browser uses device scale factor 1, fresh contexts, and desktop browser input behavior. A narrow viewport does not emulate a real phone, touchscreen, software keyboard, or mobile Safari.

Options:

| Flag | Purpose |
| --- | --- |
| `--config file.json` | Viewports, justified style/alignment/separation contracts, exact exceptions and limits |
| `--ready selector` | Wait for a page-specific visible marker; otherwise load/font readiness alone is used |
| `--setup file.mjs` | Default-exported async function receiving `{page, context, viewport}` after navigation; opens a requested state or asserts fixture readiness |
| `--state name` | Safe filename token identifying captured state; default `default` |
| `--fixture name` | Dataset/content version recorded for comparison; a label is not proof of data parity |
| `--theme light\|dark` | CSS color-scheme preference; custom app toggles may also need setup |
| `--motion no-preference\|reduce` | Preference only; no automatic judgment of actual motion behavior |
| `--text-spacing` | Injects line/paragraph/letter/word spacing stress CSS; manually review language applicability and layout |
| `--storage-state file.json` | Explicit authorized test session; never automatically harvest a personal browser profile |
| `--channel chrome` | Installed Chrome; omit to use downloaded Chromium |
| `--fail-on none\|critical\|major\|moderate\|minor` | Optional severity gate for unexcepted accessibility/contract findings; default none |

The default runner does not click, submit forms, crawl routes, or mutate application state. A setup hook is executable local code, not inert configuration; use it only for the authorized task. `assets/setup.example.mjs` illustrates readiness and a dialog capture. Run separate output directories for error, expanded, dark, reduced-motion, and spacing scenarios. Do not submit destructive/live actions just to test a visual state.

The runner records a route change to a different origin/path as incomplete, allowing a trailing slash change. For an intended redirect, audit the intended final URL explicitly. Query-only redirects remain visible in the final URL metadata; inspect the actual state. It also records resource/runtime errors, failed images/fonts, truncated geometry sampling, and unmatched contracts. Lazy content, silently wrong data, and skeletons still require a meaningful readiness assertion and visual inspection.

## Product-specific contracts

Copy `assets/audit-config.json` and adapt its selectors and values to the actual product. Do **not** blindly apply sample 14/24px choices. Document why each group/relationship matters in `rationale`. Find system tokens and rendered peers first; no automatic inference that the most common value is correct.

```json
{
  "viewports": [{"name":"phone","width":390,"height":844}],
  "groups": [{
    "name":"summary-values",
    "selector":"[data-component=summary-value]",
    "rationale":"Equivalent metrics use one type role so magnitude does not imply importance.",
    "styles":{"font-size":["24px"],"font-weight":["600"]},
    "minCount":3,
    "tolerance":0.5
  }]
}
```

Config fields:

- `viewports`: unique safe `name`, integer `width` and `height` in CSS px.
- `groups`: unique `name`, CSS `selector`, optional `rationale`, `align`, numeric `reference`, `styles`, `tolerance`, `minCount`, `minWidth`, `maxWidth`. At least `align` or `styles` is required. `align` is left/right/top/bottom/centerX/centerY in document CSS coordinates. Without `reference`, the group median is used and explicitly labelled as a peer reference. Alignment expects one shared track; do not select an entire multi-column grid.
- `styles`: kebab-case computed CSS property → array of allowed **strings**. Colors need browser-normalized values such as `rgb(20, 30, 40)`. Simple px values use the group's absolute tolerance (default 1px); other values require exact equality. Do not configure all paragraphs under one size if they have different roles.
- `separations`: unique `name`, selectors `a` and `b` (exactly one rendered match each), `axis` x/y, nonnegative `minGap`, optional `rationale`/width bounds. Measures `b.start − a.end`; use the declared order. This is not an automatic overlap detector.
- `ignore`: `{ "id": "exact-14-character-finding-id", "reason": "why this exact case is intentional" }`. Exceptions remain in reports. One padding exception cannot suppress another property or component contract. No wildcard/global blanket ignores.
- `geometryTolerance`: default 1 CSS px. `maxElements`: default 10000 sampled rendered light-DOM elements; reaching the cap makes coverage incomplete.

Width bounds let different contracts apply at different widths. Outside-range contracts are explicitly not applicable. Zero or insufficient matches produce a coverage finding and incomplete run; they never count as a pass. Invalid selectors/values produce an error. A group's median can be wrong; inspect the design rationale before accepting normalization.

## Outputs

- `report.html`: local screenshot gallery, metrics, findings, exceptions, and coverage.
- `report.md`: concise text evidence report.
- `report.json`: structured findings and case metadata for comparison.
- `CASE.png`, `CASE-viewport.png`: full-page and initial viewport evidence.
- `CASE-dom.json`: selectors, document-coordinate rectangles, computed style inventory, contract measurements and sampling limitations.
- `CASE-axe.json`: raw violations, incomplete, passes and inapplicable results, including source checks and measured contrast data when axe provides it.

Artifacts can contain page content, screenshots, URLs and axe HTML snippets. Keep them local/test-scoped unless sharing is authorized. The geometry collector avoids input values, but that does not make the complete artifact anonymous. Never commit session-state files or sensitive audit captures by default.

**Exit codes:** 0 = capture completed without a configured gate failure, **not** design approval; 1 = configured accessibility/contract severity gate failed; 2 = invalid input, launch/capture/readiness error, truncated geometry, or unverified declared contract. Review candidates—including possible clipping and undersized target boxes—do not automatically fail a gate. Axe incomplete results remain review work, even with exit 0. Exact documented exceptions exempt gate findings, not coverage failures.

Geometry checks cover ordinary rendered light DOM only. They do not fully detect occlusion, ancestor clipping, pseudo-elements, text ink/baselines, closed shadow DOM, iframes, canvas, virtualized rows, or native UI. Counts disclose detectable boundaries; zero detected hosts does not prove no closed shadow DOM. Axe can cover additional contexts, but inspect its own results. Do not extrapolate custom geometry coverage to axe or vice versa.

Screenshots preserve natural animation state; they are not frozen or fast-forwarded. The measurement and screenshot are sequential captures, so an unstable animation can change between them. Use an explicit stable test state and review playback separately. The tool does not measure CLS, eye movements, visual saliency, conversion, reading speed, or perceived beauty.

## Compare improvements

```sh
node scripts/compare.mjs /tmp/settings-before/report.json \
  /tmp/settings-after/report.json > /tmp/settings-comparison.json
```

Comparison checks URL, fixture label, config, setup hash, environment, case metadata and incomplete status. It emits introduced, persistent, and **absent** findings. It never labels absent findings “fixed”: a removed element or changed selector may explain disappearance. Different settings yield `comparable: false` and exit 2. Matching metadata cannot prove identical data, downloaded fonts, dynamic resources or truth of fixture labels. Check those before making a regression claim.

## Contrast and semantic review

```sh
node scripts/contrast.mjs '#777777' '#ffffff'
node scripts/review.mjs /tmp/interface-review.json
```

Contrast accepts opaque sRGB hex pairs only and outputs the unrounded ratio plus threshold results. It does not sample a screenshot or resolve alpha, gradients, images, blend modes, HDR, or wide-gamut compositing. Use it to test a proposed solid-color pair after actual roles/backgrounds are known.

Copy `assets/review-template.json`, fill the context/scenarios and the relevant profile using [evaluation.md](evaluation.md), and add findings in that reference's format. Keep unavailable dimensions null and status partial. `review.mjs` validates required evidence fields and ordinal values; it cannot determine whether the evidence is real or the judgment correct. No overall UX score is calculated; an optional style preference is reported separately. A completed scoped review may still list untested conditions and unresolved findings.

See [validation.md](validation.md) for the independent adversarial calibration, regression coverage, and a filled partial review with screenshot evidence.

## Task and component routing

See [router.md](router.md) for exact-ID route discovery, bounded read plans, plan validation and optional finding ownership. Route integrity does not validate design suitability. The 64-route catalog is dependency-free and supports entry at any level.

`npm run test:resilience` adds five isolated captures of one component in different container widths with normal and grown/long text, plus an intentionally broken variant. This tests content adaptation at one viewport, not browser zoom or universal design quality. See the worked semantic counterexample in [validation.md](validation.md).

## Real-world calibration refinements (2.1)

HTML reports group occurrences by rule, evidence kind, standard tags and axe result, with every node expandable and retained in JSON. `findingSummary` includes counts per case and kind. Counts measure occurrences, not independent user problems or design quality. `advisory` identifies results without a WCAG-level tag (including best-practice rules); only `accessibility` and `contract` kinds participate in the optional severity gate. `review` continues to include incomplete axe checks and geometry candidates.

Geometry now uses `document.scrollingElement` for standards/quirks root extent. A null scroller uses a disclosed root/body fallback. It does not use maximum descendant bounds, which would mistake offscreen/local content for page overflow. Narrow CSS hiding patterns produce `visually-hidden-pattern` contextual reviews instead of ordinary visible-text clipping/target warnings. Their selectors and focusability remain available; intent and associated focus treatment need inspection. Inline target context is advisory metadata, not an automatic exception.

Reports record `environment.toolVersion`; comparison rejects mismatched versions as well as the existing environment/config/fixture checks. A changed checker is not evidence of a repaired website. `npm run test:realworld` runs isolated regressions for the actual real-site failure modes; it makes no external requests. See [real-world-evaluation.md](real-world-evaluation.md).

## Modern SaaS preference scoring

Use [style scoring](preferences/style-scoring.md) for the user's preferred visual direction. `scripts/style-score.mjs` validates evidence-backed manual ratings, calculates the configured weighted fit, preserves functional gates and refuses mismatched comparisons. `scripts/review.mjs` accepts optional `styleReview`. This is separate from automated browser findings. Start from [the template](../assets/style-review-template.json).
