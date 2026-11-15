# Shape, stroke and layering language

Layer: **foundations** · Route: `shape`

**Use when:** Components feel visually unrelated or depth is misleading.

**Avoid when:** Enforcing a single radius on every size and semantic role.

## Decision and composition

Identify families: controls, content surfaces, floating layers, badges and illustrations. Coherence can use related proportions, stroke weight and layering rather than identical values. Preserve expressive exceptions with a clear role.

Check border emphasis, corner treatment, shadow direction/softness and icon strokes together. Nested radii should look coherent at actual padding; a simple subtraction rule is a starting hypothesis, not an optical law.

## Behavior and adaptation

Test actual scale, theme, clipping and focus outlines. Shadows may disappear on dark backgrounds; do not make them the only layer cue. A focus indicator must remain visible beyond rounded clipping.

## Evidence and repair

Measure equivalent role drift with scoped contracts, then inspect perceived weight. Avoid arbitrary “maximum three radii” claims or treating every unique shadow as an error.

**Worked decision:** A pill tag and rectangular table container differ appropriately; two identical secondary buttons with unexplained different corner radii are a likely component defect.

**Source boundary:** Original system synthesis supported by the main ledger’s Atomic Design and component-system sources.
