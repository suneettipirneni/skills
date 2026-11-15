# Images, icons and optical alignment

Layer: **atoms** · Route: `image-icon`

**Use when:** A visual carries identity, explanation, status or action meaning.

**Avoid when:** Using generic decorative icons as a substitute for content hierarchy.

## Decision and composition

Decide whether the visual is informative, functional or decorative. Use an established icon language within equivalent roles. Preserve deliberate illustrative or brand variation rather than forcing all artwork into one style.

Choose meaningful crop/aspect behavior and sufficient resolution. Functional icons need accessible names at the control level; decorative imagery should not add redundant announcements. Captions explain context rather than restating every visible detail.

## Behavior and adaptation

Test loading failure, transparent assets, dark backgrounds and narrow crops. Essential meaning cannot depend on hover tooltip or color alone. Keep motion/decorative imagery from obscuring text.

## Evidence and repair

Compare optical center and stroke weight at actual display size, not just SVG viewBox dimensions. A triangular play glyph may need a small contextual optical correction; do not globally translate every icon or change hit geometry to compensate.

**Worked decision:** The play icon’s bounding box is centered but its visual mass feels left-heavy. Inspect at normal scale and adjust the glyph within the existing button while preserving its target and focus ring.

**Source boundary:** Original optical synthesis; the main ledger’s Rauno Freiberg detail research and platform conventions inform contextual review.

## Route deeper only when relevant

- [Shape, stroke and layering language](../foundations/shape.md) — Maintain compatible strokes and geometry
- [Color roles, contrast and meaningful variation](../foundations/color.md) — Contrast meaningful visuals
- [Meaning, structure and accessible interaction](../foundations/semantics.md) — Provide appropriate alternatives
