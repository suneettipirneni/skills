# Component detail diagnostics

Use `scripts/detail-audit.mjs` when a compact component looks wrong despite a coherent screen: a numeral touches a curved arrow, a connector is centered in a grid track rather than between its values, or an inner mark drifts within its intended region. First inspect the natural-size component and state its intended relationship. Then author a contract. The tool does not discover every collision or decide whether a design is pleasant.

## Run

From this skill directory, after installing its dependencies:

```sh
node scripts/detail-audit.mjs --url http://127.0.0.1:4321 \
  --config detail.json --out /tmp/detail-review-01 --channel chrome
```

The output directory must not exist. Supply `--fixture`, `--state` and `--theme light|dark` to record controlled context for optical comparison; fixture defaults to null, state to `default`, and theme to `light`. Theme sets the browser color-scheme preference, not necessarily an application-owned theme switch. `--ready '.control'` waits for a visible locator; `--setup ./detail-state.mjs` imports a trusted module whose default async function receives `{page, context, viewport}`. Use setup to open the required dialog or establish local test state. It executes application actions: keep mutations within the authorized task. Each viewport gets a fresh browser context. State/authentication from the user's browser is not automatically inherited. After scrolling and moving the pointer away, the tool waits up to1500ms for active finite component/subtree or ancestor animations to finish naturally and records `motionReadiness`. Continuous motion or an exceeded budget is incomplete; animations are not frozen, suppressed or silently retried. Paused animation is captured at its current state. Original/restored comparison still rejects changes during isolation. The tool waits for document fonts, but cannot establish that the intended font loaded successfully or that a network-driven app has finished changing.

## Example: compound seek control

Adapt selectors to the actual implementation. The numbers below are a proposed local contract, not universal icon-design rules.

```json
{
  "viewports": [
    {"name": "desktop-1x", "width": 1440, "height": 1000, "dpr": 1},
    {"name": "phone-2x", "width": 390, "height": 844, "dpr": 2}
  ],
  "components": [{
    "name": "seek-control",
    "selector": ".seek-button",
    "minCount": 2,
    "maxCount": 2,
    "parts": {
      "frame": {"selector": "$root", "measure": "box"},
      "arc": {"selector": "svg", "measure": "svg"},
      "numeral": {"selector": ".seek-numeral", "measure": "text"}
    },
    "checks": [
      {"kind": "inside", "a": "numeral", "b": "frame", "tolerance": 0,
       "rationale": "The numeral remains within this button at each tested size."},
      {"kind": "ink-gap", "a": "arc", "b": "numeral", "minGap": 1,
       "rationale": "Separate the numeral from the curved arrow at natural size."}
    ]
  }]
}
```

Roots default to1–20 matches; use explicit expected counts when possible (1–50). Every part must match exactly one element inside each root; `$root` selects the root. Missing, ambiguous, invisible or empty geometry becomes incomplete evidence.

## Choose the measurement

| Check | What it measures | Required parameters and interpretation |
| --- | --- | --- |
| `center` | Difference between the centers of `a` and `b` | Optional `offsetX`, `offsetY` (CSS px; default0), `tolerance` (default0.5). A deliberate optical offset may be appropriate. |
| `edge-align` | Signed `a.edge − b.referenceEdge` | `edge`: `left`, `right`, `top`, `bottom`, `centerX` or `centerY`; optional same-axis `referenceEdge` (defaults to `edge`), `offset` (default0), `tolerance` (default0.5 CSSpx). Physical edges, not inferred logical start/end or text baselines. |
| `insets` | Signed child-to-reference clearances on selected sides | `insets:{left?,right?,top?,bottom?}` with at least one finite CSSpx value; optional `tolerance` (default0.5). Omitted sides are unconstrained; negative targets permit deliberate overhang. |
| `inside` | Four clearances between `a` and a region of `b` | Optional normalized `region:{x,y,width,height}` within0–1 and `tolerance` (default0.5). Negative clearance means protrusion. |
| `gap` | Signed edge-to-edge gap from `a` to `b` along `axis` | `axis:"x"` or `"y"`, `minGap`, optional `tolerance` (default0.5). It does not establish alignment on the other axis. |
| `between` | Gaps before and after connector `b`, between `a` and `c` | `c`, `axis`, `minGap`; `tolerance` is maximum gap imbalance (default0.5), not a deduction from minimum gap. Use when content-pair centering is actually intended. |
| `ink-gap` | Separation of isolated, thresholded visible paint from `a` and `b` | `minGap`0–16 CSS px. Parts must be disjoint subtrees. Uses occupied raster-cell edges, not glyph optical mass. |

| `paint-balance` | Visible paint bounds, binary coverage centroid, signed insets and area relative to `b` | Optional normalized `region`. Always review-only: no tolerance, preferred offset or pass. Includes natural-size original, overlay and half/default/double threshold samples. `b` may contain `a`, but may not equal or descend from `a`. |

All checks require an explicit `rationale`. `measure:"box"` uses the CSS border rectangle. `"text"` requires one DOM text fragment and measures its rectangle, not glyph ink. `"svg"` transforms SVG geometric bounds into page coordinates; stroke/filter ink is excluded. `ink-gap` and `paint-balance` isolate selected element paint regardless of its geometry mode. For physical placement, interpretation of paint profiles, controlled before/after comparison and report-bound judgments, follow the [optical verification workflow](optical-workflow.md).

For a previous → candidate comparison, use `between` with the actual previous value, arrow and candidate value. Do not automatically equalize arbitrary grid tracks. A long label, multiline value or stacked phone layout may require a different justified contract/state. If it is not the same relationship, author another configuration rather than weakening a tolerance to pass.

## Read the result

`report.json` and `report.html` retain measurements, expected values, error coverage and natural CSS-size crops. DPR controls raster detail; the HTML displays a2× raster capture at its CSS size. Enlargement is an inspection aid. Preserve before/after artifacts and compare the same browser, content, state, viewport, DPR and threshold.

- Exit0: configured measurements completed and no authored contract failed. Paint diagnostics remain review-required; this exit code does not mean the optical review passed. This is not a visual-quality, accessibility or application-readiness certificate.
- Exit1: completed evidence contains failed contracts. Use signed clearance, both connector gaps, imbalance or overlap pixels to locate the defect; preserve intentional asymmetry and identity.
- Exit2: configuration/capture/coverage error or unsupported measurement. Partial passing checks remain partial. `summary.status:"captured"` means capture completed without optical profiles, even when contracts failed. Profiles produce `"review-needed"`; errors take precedence as `"incomplete"`. Read `completedContracts`, `passedContracts`, `failedContracts`, `diagnosticReports`, `reviewRequired` and `unverified` separately.
- Raster `minimumClearanceCssPx:null` with `clearanceAtLeastCssPx` is a bounded search result, not an exact large gap. Witness coordinates, when present, are CSS coordinates relative to the crop.

## Paint exclusions and practical limits

Isolation temporarily changes inline visibility and restores exact original attributes. Visible descendants that survive hiding, generated pseudo-elements, selected-element filters/blending/shadows and ancestor filters/blending, protruding descendant geometry, and empty paint masks are reported incomplete. Use actual elements or a simpler supported local fixture when appropriate; do not rewrite a good product solely to satisfy this diagnostic.

For paint-balance, a rectangular clip is supported only when the selected paint fits. Rounded ancestors with simple circular pixel radii are supported only when bounds plus stroke padding fit entirely inside a conservative safe interior inset by the largest radius. Near-corner, percentage, elliptical and uncertain transformed clipping remain unverified. This does not prove an asset is unoccluded by other elements.

Coverage checks are conservative: they can reject nonpainting descendant boxes and benign shadows. They are not a complete paint-bound algorithm. Other ancestor effects, clipping, masks, transformed strokes, glyph overhang, third-party occlusion and dynamic state still require natural-size inspection. An original/restored pixel comparison catches many changes but cannot prove every intermediate capture was stable. This tool does not audit runtime errors, failed resources, focus, semantics, contrast or whole-screen task flow; use the normal browser audit and interaction review alongside it.

`paintThreshold` defaults to8 (max RGBA channel difference, range1–255); antialiasing, transparency and low-contrast paint can fall below it. Do not raise the threshold until a collision disappears. Record any change and inspect its effect. `maxRasterPixels` defaults to262144 (maximum1048576); use compact roots, not full screens. Large dense masks and large gap searches can be expensive. Fractional CSS coordinates are normal: no rule requires snapping every shape to integer pixels.

## Calibration

```sh
node --test scripts/tests/detail.test.mjs
node scripts/tests/detail-browser.mjs /tmp/detail-browser-01
npm run test:optical
```

The browser calibration retains its fixture, reports and assertions at1× and2×. It checks known separation/overlap, missing and ambiguous selectors, visibility bypass, overflowing paint, unsupported pseudo/shadow/ancestor-filter paint (including zero-sized pseudo hosts), hidden parts and exact style restoration after success/failure. These adversarial fixtures establish diagnostic behavior within this scope; they are not representative user testing or a universal optical benchmark.

The [optical calibration record](optical-calibration.md) includes physical-contract probes, adversarial paint profiles, actual-app captures and the limitations that remain.
