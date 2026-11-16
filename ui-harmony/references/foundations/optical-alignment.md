# Optical alignment: reference, evidence and correction

Use when aligned rectangles still look uneven, symbols feel off-center, text and icons do not sit together, or supposedly equivalent controls differ in visual weight. Start at the owning `image-icon`, `typography`, `text`, `button-link` or `spacing` route; return to the parent component to judge the result. This reference supplements those routes rather than imposing a new universal grid.

## Choose what should align

Keep four concepts separate: **layout bounds** (CSS boxes and advance widths), **paint bounds** (visible raster coverage), **coverage centroid** (the average occupied pixel position), and **perceived balance** (a contextual human judgment). None is interchangeable with the others. A baseline is a typographic reference, not the bottom of a DOM text rectangle. A zero centroid offset is not evidence of optical correctness.

Name the intended reference before moving anything. The correct anchor might be a button’s usable interior, a label’s first baseline, the main body of a badged icon, the text edge after an opening quote, or a repeated column. Do not center a symbol against the entire screenshot, or force every icon in a family to share an identical painted rectangle.

| Situation | Inspect | Appropriate correction and guard |
| --- | --- | --- |
| Icon-only button | ViewBox whitespace, asymmetric contour, stroke ends, interior relative to hit area | Fix incorrect asset bounds first. If needed, optically offset the glyph within its stable button; preserve target, focus ring and neighboring tracks. |
| Icon beside one line of text | Font cap/x-height, icon scale and weight, label baseline, line-height leading | Use the system’s baseline-capable symbol where available. On the web, establish shared layout then inspect actual glyphs; flex centering only centers boxes. Do not copy a platform baseline offset into unrelated SVGs. |
| Icon beside wrapping text | Whether the symbol belongs to the first line or whole message | Align to the intended line/region. A centered icon can drift downward as copy grows; a first-line alignment may suit a message while whole-block centering may suit an independent action. Test both short and wrapped states. |
| Arrow, triangle, crescent or off-axis detail | Negative space, directional emphasis, outline versus fill | Inspect shape balance at actual size. Treat centroid and bounds as competing evidence, not correction vectors. A triangle’s filled area need not be centered like a square. |
| Badge on an existing symbol | Base icon track versus whole composite extent | Keep the base object aligned with unbadged peers when that is the relationship. Badge overhang can be intentional. Measure base and badge separately; retain clearance and clipping checks. |
| Text-only or icon–text button | Visible label group, side bearings, internal gap and surrounding padding | Judge the group first, then its internal relationships. Do not offset each letter or recentre unrelated rows by their changing word lengths. Loading/success replacements must preserve the control’s stability. |
| Mixed icon family | Same-role perceived size, contour complexity, stroke thickness, corner/terminal language | Prefer a coherent family and suitable optical-size/weight variant. Equal outer dimensions or painted area do not imply equal visual size or weight. Avoid stretching one axis to make shapes match. |
| Heading, quote or list edge | First visible letter versus punctuation/bullet indentation | Consider hanging punctuation or a deliberate gutter for editorial text. Keep wrapping, selection and clipping sound. This is not a reason to protrude every control label outside its box. |
| Numeric row, badge or status chip | Digit widths, units, baseline, vertical leading and changing counts | Use tabular figures when exact column comparison needs them; keep number and unit semantics together. Do not vary chip offsets per digit merely to force a pixel centroid. |
| Circle versus square or round glyph versus flat glyph | Apparent size and baseline/cap-height overshoot | Preserve intentional overshoot in well-designed assets/fonts. Do not crop a round glyph to a flat letter’s geometric bounds. |

## Verify physical placement before optical compensation

Review from the layout inward: **screen/container → content group → control → visible glyph**. If the toolbar itself is 12px off its content track, translating its icons only conceals the layout error. Establish intentional shared tracks for headings, fields, rows, toolbars and repeated controls; identify exceptions such as outdented markers and badge overhang.

Measure the relationship that actually matters:

| Physical relationship | Tool and interpretation |
| --- | --- |
| Repeated rows share a leading/trailing track | Main audit’s scoped alignment group, or `edge-align` for a named pair. Compare equivalent roles and states; use an authored reference when the majority could be wrong. |
| A field’s label and input begin together | `edge-align` on their left edges in that layout, or the appropriate right edges for its RTL design. Physical edges are explicit; the tool does not infer logical start/end from document direction. |
| A control or content group has deliberate container padding | `insets` checks only the specified sides against authored values. Leave unconstrained trailing space unconstrained. Use the complete icon–label group when its group padding matters. |
| A glyph or group should fit inside its region | `inside` tests containment. An inset contract alone does not guarantee containment on omitted sides. |
| Connector or related controls have meaningful gaps | `gap` / `between` check actual part edges; inspect internal spacing separately from the container’s grid tracks. |
| A whole region is centered in its parent | `center` checks the authored reference, including any deliberate offset. Then judge the visible content within that region. |

All distances are CSS pixels in document coordinates. Edge-alignment offsets are signed `a.edge − b.referenceEdge`. Insets are child-to-container clearances; negative values mean protrusion and can be intentional. Transformed rectangles remain axis-aligned bounds, not contour distances or text baselines. A zero geometric delta may coexist with a visible paint imbalance, and an intentional paint imbalance may coexist with good design.

Use existing spacing tokens or measured equivalent peers to choose targets. Do not impose a global 1px tolerance, uniform padding on every side, equal row heights for wrapped content, or exact pixel centering on all assets. Check several real repeated instances and the deepest relevant responsive state. Report selector, scope, actual and expected measurements, rationale and owner so a shared component/token can be fixed instead of accumulating local nudges.

## Resolve the cause before adding an offset

Check the loaded asset and font first: unexpected SVG viewBox padding, a fallback font, different icon weight, a substituted glyph, inherited line height, stretched SVG dimensions or a transformed ancestor can imitate an alignment problem. Compare equivalent variants in the same state. A filled selected icon may deliberately differ from an outlined idle icon.

Then inspect natural-size context, not only an isolated enlargement. Temporarily show geometric guides and paint overlays; hide them again to judge the interface. Enlargement helps locate antialiasing, collisions and stroke clipping but can make insignificant pixels look important. For high-DPR captures, display at the original CSS size when judging comfort and readability. Do not use image downsampling artifacts as UI evidence.

Choose the smallest coherent owner: correct shared asset padding or component alignment before adding instance-specific offsets. A local glyph transform can preserve a control’s box, but its paint still needs enough room. Record why it exists and which variant owns it; do not apply `translateY(-1px)` to every icon. An offset that helps at one font size may fail at another. Use a scale-relative correction only if it survives the relevant sizes; otherwise use the family’s designed size variants. Keep text selection, interaction geometry, focus indicators and layout order intact.

Optical size, weight and grade solve related but distinct problems. `font-optical-sizing` only helps fonts that supply optical sizing; it does not align an element in its container. A variable icon font’s optical-size axis is not an instruction to change CSS dimensions or weight arbitrarily. Recheck the selected variant at its actual rendered size and background contrast.

## Measure without manufacturing certainty

Use [detail audit](../detail-audit.md) for a local supported DOM/SVG component:

- `center`, `edge-align`, `insets`, `inside`, `gap` and `between` test authored geometric relationships. Their tolerances belong to that component and purpose.
- `ink-gap` tests thresholded painted clearance between disjoint parts. An icon and numeral can have overlapping geometric rectangles without touching paint.
- `paint-balance` describes the selected part’s ink bounds, binary coverage centroid, signed insets and area relative to an explicit frame/region. It produces an untouched crop and annotated overlay, with threshold sensitivity. It always requires visual review and emits no suggested CSS offset.
- `optical-compare.mjs` compares compatible before/after paint reports. It reports movement, extent and area changes; it does not say which version looks better. `optical-review.mjs` binds explicit human decisions to the exact captured report and keeps failed placement contracts and unverified evidence visible. See the [verification and judgment workflow](../optical-workflow.md).

Select the visible mark as the paint part, not a wrapper whose background, border or label would dominate the measurement. Use a meaningful frame/region. For a badged folder, profile the folder body against the icon slot and inspect the badge separately. An overlapping badge can hide some of the body: the measurement then describes its visible contribution in that composition, not the unoccluded asset’s shape. Do not derive a base-icon correction from that occluded centroid. For text, a full glyph run includes ascenders, descenders, punctuation and content-dependent mass; its centroid cannot establish a baseline or justify a global vertical translation. The bundled tool does not extract font baselines or cap heights.

Keep measured precision proportional to evidence. A raster cell is `1 / DPR` CSS px across; subpixel antialiasing changes which cells cross a threshold. Report the browser, DPR, threshold and variation across the sampled thresholds. A large change across thresholds makes a small offset less persuasive. The default threshold and any local tolerance are engineering choices, not psychophysical constants. Never raise the threshold to hide a collision or remove faint parts from the measurement.

Unsupported paint, clipping, empty masks and changing pixels remain unverified. Do not repair the interface simply to satisfy the diagnostic’s exclusions. If the relevant view is canvas, native UI, a static screenshot, or uses unsupported effects, perform a disclosed manual review or use suitable platform inspection. Do not invent DOM units or font metrics from a compressed screenshot.

## Verify the correction across actual states

Choose the relevant subset, not an exhaustive ritual for a single defect:

- Natural-size before/after in the whole component, plus annotated detail; inspect without guides before accepting.
- Equivalent peer icons, outline/fill, enabled/disabled, hover/focus, loading and selected states where the mark changes.
- Relevant sizes, container widths, long/wrapped/localized labels, text growth, actual browser zoom, and fallback-font conditions. Changing DPR alone does not test zoom or text resizing.
- Light/dark or alternate backgrounds when supported: perceived weight can change even with identical geometry.
- RTL and directional variants: decide whether the symbol should mirror semantically. Keep numerals/letters legible, recheck badge placement, and avoid blindly negating every horizontal offset.
- Target/focus behavior, hit geometry and nearby spacing after the paint moves. A visually centered glyph must not clip or mask another element.

Stop when the intended relationship is clear, the relevant variants remain coherent and there is no material regression. Retain deliberate asymmetry instead of endlessly minimizing the numbers.

## Feedback format and worked reasoning

Record **component/state → intended anchor → geometric and paint observations → contextual judgment → scoped correction → preserved behavior → verification**. Separate observation from inference and a proposed experiment from an accepted fix.

Example (illustrative, not a universal target): “The play SVG box is centered in its 32px control. Its paint-bounds center is also centered, while the binary coverage centroid is 1.6px left at DPR2. That asymmetry is expected for this triangle, so it is not a defect on its own. In the toolbar, compare the unchanged glyph with a small rightward variant at natural size; retain the variant only if it feels better beside pause/skip and preserves inner clearance. Do not automatically apply a 1.6px translation.”

A different diagnosis: “The base folder remains on the shared track; the badge shifts the whole-symbol centroid right. Keep the base alignment and test badge clearance. Recentering the composite would move the folder out of its family.”

## Primary sources and limits

- [Apple, SF Symbols 2 (WWDC20)](https://developer.apple.com/videos/play/wwdc2020/10207/) explains symbols’ relationship to text baselines and scale/weight. Apply the typographic reasoning; SF’s built-in metrics are not automatically present in arbitrary web SVGs.
- [Apple, SF Symbols](https://developer.apple.com/design/human-interface-guidelines/sf-symbols) describes optical side-margin adjustments, including badged symbols. This supports semantic anchoring of a base object instead of always centering the complete paint extent.
- [IBM, UI icon design](https://www.ibm.com/design/language/iconography/ui-icons/design/) provides a coordinated grid/key-shape system with judgment around the metaphor. Its system-specific dimensions do not define a global optical threshold.
- [Google, Material Symbols](https://developers.google.com/fonts/docs/material_symbols) distinguishes fill, weight, grade and optical size. These axes help explain why scaling a single outline is not always sufficient; they do not establish a perceived-center formula.
- [Mark Boulton, Five simple steps to better typography, Part 2 (2005)](https://markboulton.co.uk/journal/five-simple-steps-to-better-typography-part-2/) demonstrates hanging punctuation and list gutters. The visual principle remains useful; its historical software-support statements are not current implementation guidance.
- [Monotype, Lack of Overshoots](https://foundrysupport.monotype.com/hc/en-us/articles/360029597112-Lack-of-Overshoots) explains deliberate round-letter overshoot. Preserve designed compensation; do not infer that every UI circle needs a fixed enlargement.
- [MDN, font-optical-sizing](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/font-optical-sizing) documents the CSS feature and its font dependency. It is not an optical-alignment API.

The workflow, diagnostic metrics and examples here are an applied synthesis. They are not a model of human vision or a validated design-quality score.
