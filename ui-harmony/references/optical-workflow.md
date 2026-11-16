# Physical and optical verification workflow

Use [optical alignment guidance](foundations/optical-alignment.md) to decide what should align. These tools split three jobs: measure physical contracts, describe visible paint, and validate the completeness of an explicit visual judgment. They do not infer a universally correct optical center.

## 1. Define a scoped capture

After [tool setup](tools.md), adapt this configuration to a real component. The example’s values are authored choices for one toolbar, not recommended defaults:

```json
{
  "viewports": [
    {"name":"desktop-1x","width":1440,"height":1000,"dpr":1},
    {"name":"phone-2x","width":390,"height":844,"dpr":2}
  ],
  "components": [{
    "name":"toolbar-control",
    "selector":"[data-optical-control]",
    "minCount":1,
    "maxCount":1,
    "parts": {
      "frame":{"selector":"$root"},
      "group":{"selector":".content-group"},
      "icon":{"selector":"svg","measure":"svg"},
      "label":{"selector":".label","measure":"text"}
    },
    "checks": [
      {"kind":"insets","a":"group","b":"frame","insets":{"left":12},"tolerance":0.5,
       "rationale":"This control family's content starts 12px inside its outer border box; trailing space is unconstrained."},
      {"kind":"edge-align","a":"group","b":"frame","edge":"centerY","tolerance":0.5,
       "rationale":"The content group's layout center follows the control's vertical center; glyph optics are reviewed separately."},
      {"kind":"gap","a":"icon","b":"label","axis":"x","minGap":8,"tolerance":0.5,
       "rationale":"This LTR icon-label pair retains its authored minimum internal gap."},
      {"kind":"paint-balance","a":"icon","b":"group",
       "rationale":"Describe the icon's visible contribution relative to the content group; the expected leftward offset is not a failure."}
    ]
  }]
}
```

Choose a meaningful paint reference for your question: an icon slot, button interior or semantic base. The example intentionally shows an icon left of a label; its nonzero offset within their group is expected. For an icon-only button, the button frame may be the relevant reference. Optional `region:{x,y,width,height}` restricts the paint reference to a normalized rectangle inside `b`. It is an authored region, not an inferred perceptual center.

```sh
node scripts/detail-audit.mjs --url http://localhost:3000 \
  --config optical.json --out /tmp/optical-before \
  --channel chrome --ready '[data-optical-control]' \
  --fixture toolbar-short-label-v1 --state idle --theme light
```

Use a new output directory for each capture. `--setup` can establish the exact expanded/selected state; see [detail audit](detail-audit.md) for its executable-code boundary. Record real content and asset/variant identity in your fixture notes. Fixture/state labels are declarations, not evidence that content actually matches. Theme selects the browser’s color-scheme preference; an application’s own theme control may require setup.

## 2. Read physical and optical findings separately

`edge-align` compares physical `left`, `right`, `top`, `bottom`, `centerX` or `centerY`. `referenceEdge` defaults to `edge`; different edges must share an axis. Its measured offset is `a.edge − b.referenceEdge`, compared with optional `offset` (default0) and `tolerance` (default0.5 CSSpx). Positive x is right and positive y is down. These are axis-aligned rectangle edges even if the part is rotated. No option pretends to extract a text baseline.

`insets` compares child-to-reference clearances only for the supplied sides. A negative target can represent intentional overhang. Omitted sides remain unconstrained; use `inside` separately when full containment matters. Measurements are relative to the selected rectangle, normally its border box, not automatically its CSS padding/content box. Include border thickness in the rationale or select a content wrapper.

`paint-balance` is always review-only. It reports:

- Ink bounds and their center offset from the selected reference.
- Binary coverage centroid and its independent offset; each above-threshold pixel cell has equal weight.
- Signed visible insets, painted area in CSSpx² and pixel count.
- Half/default/double threshold samples, rounded and clamped to1–255, with a variation flag. A changed paint set does not itself mean bad alignment.
- An untouched natural-size crop and an SVG annotation: blue reference frame/center, magenta paint bounds/center, orange coverage centroid. Hide guides when judging the composition.

Coordinates in JSON are document CSSpx. The overlay maps them back into the crop. It measures the selected element’s **visible contribution** under current compositing, not unoccluded alpha, color-weighted saliency, text baselines or human perception. Occlusion can change the centroid of a correctly aligned base icon. Shadows, filters, clipping, missing paint, unsupported isolation or pixel instability may prevent measurement; keep those cases unverified. Detailed coverage limits remain in [detail audit](detail-audit.md).

Summary fields distinguish `completedContracts`, `passedContracts`, `failedContracts`, `diagnosticReports` and `reviewRequired`. A capture containing optical profiles has `status:"review-needed"`; errors take precedence as `"incomplete"`. The detail command can exit0 with review required: it completed its measurements, not your visual judgment.

## 3. Compare a specific correction

Recapture the same task, state, fixture, theme, selectors, reference meaning, viewport/DPR and raster settings after your change, then:

```sh
node scripts/optical-compare.mjs /tmp/optical-before/report.json \
  /tmp/optical-after/report.json > /tmp/optical-delta.json
```

The comparator requires matching schema, checker version, URL/final URLs, browser, configuration, setup hash, ready selector and explicit fixture/state/theme metadata. It refuses incomplete captures, incomplete threshold samples and changed diagnostic identities. Measured font metadata and reference-frame size must match by default. If changing one is the deliberate intervention, document it explicitly:

```sh
node scripts/optical-compare.mjs before/report.json after/report.json \
  --font-change "Use the intended loaded font instead of the fallback" \
  --frame-change "Increase the control interior while preserving its reference role"
```

These reasons permit only those differences; they cannot override a changed DPR, threshold, state or incomplete capture. Each row retains before/after observations, after-minus-before offsets, inset/size/area deltas and both threshold-sensitivity records. There is no ranking, improvement score, automatic rescaling, recommended translation or rule that closer to zero is better. Actual font resolution, asset identity, content equality, app theme and semantic reference continuity still require inspection; matching metadata cannot prove them.

Exit0 means comparison is supported within these declared controls; exit2 means invalid/incomparable input and no delta table is emitted. Different reference contracts need separate reviews rather than a forced numerical comparison.

## 4. Record the judgment and gate completion

```sh
node scripts/optical-review.mjs --template /tmp/optical-after/report.json \
  > /tmp/optical-review.json
# Inspect untouched crops AND the whole relevant interface, then fill the template.
node scripts/optical-review.mjs /tmp/optical-after/report.json /tmp/optical-review.json
```

The template binds to the SHA-256 of the exact report bytes. Name the reviewer, record a whole-context judgment, and address every paint diagnostic by its generated ID. Each decision is `accept`, `change-required` or `unverified`, with an evidence reference and rationale; a requested change also needs a concrete `action`. Reference natural-size context and the actual capture rather than only an enlarged overlay. A new capture requires a newly bound review.

The result is:

- `reviewed` / exit0: configured physical checks have no failures and all required human judgments are recorded as accepted for this capture.
- `needs-changes` / exit1: an authored physical contract failed or the reviewer requests a change. Manual acceptance cannot conceal a failed physical contract; revise an incorrect contract with a reason and recapture.
- `incomplete` / exit2: capture errors, stale digest, missing/duplicate/unknown decisions, malformed measurements or unverified judgments remain. Known failures are retained even when incomplete evidence takes precedence.

The validator checks coverage and evidence structure; it cannot tell whether a human truly inspected an image or whether their judgment is good. It does not certify accessibility, beauty or all future content. Use the main audit and interaction checks for hit targets, contrast, focus, reflow and behavior. Keep the report’s scope and remaining uncertainties in the final design feedback.

## Calibration and example evidence

See the [calibration record](optical-calibration.md) for tested behavior, an actual app review and the independent adversary’s counterexamples.
