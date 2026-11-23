# Design review: pleasantness, coherence, and purposeful difference

Use this as a diagnostic vocabulary, not a universal style recipe. The named sources and their limits are in [research.md](research.md). The procedures and examples below are an original synthesis, not a validated aesthetic instrument.

## 1. Read the composition before inspecting components

### Make an aesthetic judgment

Review the settled source and candidate at comparable subject scale before looking at test outcomes. First identify where the eye enters and how the main masses and negative space balance. Then compare letterforms, type scale, weight, line endings and text density. Finally inspect the recognizable artwork, glyph silhouettes, edges, depth and contrast. Use the dimensions that actually shape this reference. For a wordless avatar, the crop, texture and ring matter more than a font inventory.

Apply six lenses to the aspects that matter to the actual screen. Describe both the candidate's independent merits and its relationship to the source; a faithful copy can still feel unresolved, and a deliberate deviation can improve the result.

1. **Hierarchy and typography:** Compare focal order, size, weight, spacing, contrast, letterform contours, line endings and reading tension. Identify the type that paints the candidate when browser evidence is available.
2. **Color balance and contrast:** Describe dominant, secondary and accent roles, their relative visual weight and contrast, including the atmosphere they create. A 60–30–10 distribution is an optional compositional heuristic, never a required ratio or accessibility test.
3. **Layout and whitespace:** Inspect alignment, proximity, grouping, rhythm, optical balance, meaningful density and negative space. Compare corresponding regions at comparable subject scale; do not assume sparse means simple.
4. **Depth and elevation:** Assess how surfaces, borders, shadows, translucency and stacking communicate relationships and material. Distinguish useful layers from decorative noise.
5. **Consistency:** Compare recurring controls, icon silhouettes, spacing and state treatments by role. Preserve purposeful variation that explains hierarchy or character.
6. **Purposeful motion:** Observe transitions in time when available: continuity, pacing, feedback, interruption and reduced motion. A still frame cannot establish how motion feels or behaves; mark it unobserved if playback is unavailable.

Use [appearance studies](tools.md#source-relative-appearance-studies) for descriptive source-relative geometry, tonal, palette, foreground and type evidence when appropriate. Measurements help locate a difference; they do not establish beauty, semantic grouping, accessibility or a pass threshold.

Give the screen a visual disposition with a reason grounded in something visible. “The serif now has the tall, narrow lowercase of the reference, but the wider paragraph still pushes the image below the fold” is actionable. Describe the strongest match and the most consequential remaining drift. Re-render when addressing it. Report functional checks independently so a working control cannot settle a judgment about typography or composition.

Write a one-sentence account of the screen: “Compare outstanding invoices and act on overdue ones.” Identify the visual entry point, the next useful information, and the action. Compare that order to the intended task. A title need not be the largest object; a monitoring screen may properly emphasize an exception count.

At full size, check whether the content is legible. At a reduced overview, check broad emphasis and grouping. This is an inspection technique, not eye tracking. Never claim where users looked or how many milliseconds comprehension takes without actual study data.

Record two specific strengths if present, and one place where purposeful variation matters. Examples: a recognizable condensed heading; quiet controls that allow imagery to lead; compact aligned numbers that aid comparison; asymmetric space that establishes an editorial voice. If you cannot identify a distinctive quality, describe its deliberate familiarity or lack of distinctive qualities without automatically treating that as a defect. Distinctiveness is valuable when the task or brand calls for it; a familiar public-service form may be excellent.

**Pleasantness questions:** Does the surface feel calm or energetic in the way the product intends? Is there enough contrast to remain engaging? Do details feel cared for without overwhelming the task? Does repeated interaction feel predictable? What would be lost if every element were normalized?

## 2. Hierarchy and information architecture

Inspect priority through size, weight, contrast, area, position, whitespace, imagery, and motion together. A larger font is only one way to create importance. When everything competes, first reduce unnecessary emphasis; do not keep enlarging the primary element indefinitely.

- Identify competing actions within the **same decision group**, not across the entire page.
- Check whether controls, labels, values, and metadata have recognizably different roles.
- Group by the user's mental task rather than the implementation's component tree.
- A table supports exact comparison; a card can support browsing heterogeneous items; an ordered narrative can support explanation. Choose the representation before tuning its spacing.
- Preserve frequently used expert controls when appropriate. Hiding all but one action can hurt efficient work.

**Semantic failure with clean geometry:** On a phone, an orders table scrolls correctly, but the task is to find late orders and the status column starts offscreen. Recommend bringing status next to identity or exposing an overdue filter and a visible scroll cue. Preserve row density and numeric comparison. “Convert it into cards” is not a sufficient diagnosis.

## 3. Grouping, spacing, and rhythm

Ask what is related before measuring the gap. A label should appear attached to its field, an explanation to its heading, an action to its object. Equal gaps between unrelated and related elements can create ambiguity. A border or background may establish a group when distance alone cannot.

Distinguish small internal spacing from section-level pacing. Dense tables need usable row rhythm, not landing-page margins. Editorial sections may benefit from changing rhythm. A repeated blank region can be an intentional pause; it can also be missing content. Infer from the reading sequence and task, not empty-pixel ratios.

Check nesting: padding should make parent-child relationships understandable. Do not mechanically require `inner radius = outer radius − padding` for every shape; that approximation only fits some concentric shapes and does not replace optical judgment.

**Repair:** Prefer a shared stack, grid, gap, or component token. When a single 17px gap stands out among equivalent 12px gaps, explain the detached relationship before changing it. Do not round all page values to a favored base.

## 4. Alignment and optical balance

Establish the meaningful axes: text start, numerical decimal/right edge, input start, shared baseline, image edge. Different groups need not share every axis. Alignment conveys relationships; intentional offsets convey separation.

Bounding boxes do not represent visual weight. Inspect play triangles, circular icons, italic overhangs, mixed-case text, logo whitespace, and image subject position. A nominally centered icon may look off-center. Document optical corrections with a component-level reason instead of declaring a numerical failure or applying arbitrary offsets everywhere.

Check both side-to-side and top-to-bottom balance. A large quiet image may balance a smaller dense text block. Do not enforce mirror symmetry or equal area. Review whether an unintended mass interrupts the desired reading order.

## 5. Typography as a system of roles

Compare title, section heading, label, body, value, caption, and navigation roles across the same context. Consistency means the role is learnable, not that every role shares a size. Use existing type styles when available.

Inspect line endings, awkward wraps, orphaned short words, ascender/descender clipping, crowded line height, long reading lines, and mismatched font loading. Test real long names and text in supported languages. A heading's tight leading can be appropriate while the body needs room. Keep semantic heading markup meaningful even when visual scale differs.

For numerical work, check alignment, unit placement, precision, and tabular numerals where available. Do not make monetary totals difficult to compare for stylistic symmetry. Avoid all-caps or tightly tracked small copy when it impairs reading, while retaining deliberate display typography.

**Pleasantness counterexample:** A poster-like heading has intentionally compressed type, but “ROOM FOR” looks like “ROOMFOR.” Correct local word spacing or line breaks and preserve the oversized display character. Replacing it with a default 32px heading solves the wrong problem.

## 6. Color, surfaces, and emphasis

Map color roles: content, muted content, surface, boundary, interactive, selected, success, warning, destructive, and categorical data. A hue can be expressive while its role stays stable. Avoid arbitrary palette limits; data categories and brand illustration may need variety.

Check actual contrast in each theme and state, including overlays, images, gradients, hover, focus, selection, disabled, and error. Muted text is still text. A lightness number in HSL/OKLCH alone does not establish WCAG contrast.

Review depth semantics. Shadows can indicate elevation, but some brands use them decoratively. Borders, backgrounds, spacing, and shadows are alternative separation tools; adding all of them everywhere often produces redundant enclosure. Remove a cue only when the remaining cues still establish grouping and affordance. Neither gradients nor shadows are intrinsically “AI-looking.”

## 7. Icons, imagery, and shape language

Compare icon stroke, optical size, filled/outline style, corner treatment, and semantic meaning. Distinguish navigation icons from illustrations: enlarging a tiny glyph can expose inappropriate proportions. Keep hit area separate from visible glyph size.

Inspect image crop, subject visibility, aspect ratio, resolution, loading state, and purpose. A meaningful image should support understanding or the intended emotional tone. Decorative images should not masquerade as charts, product evidence, or working controls. Do not add generic imagery to fill whitespace without a reason.

Audit radii and borders by family: a pill tag, square data cell, and rounded panel may coexist coherently. Investigate unexplained differences between equivalent cards rather than minimizing all differences.

## 8. Content, signals, and trust

Make action labels predict the result. “Continue” can be fine when the next step is evident; “Submit” may be ambiguous where it could charge, publish, or send. Inspect terms for consistency and user familiarity.

Check persistent field labels, units, date/number formats, required/optional cues, help placement, error specificity, and recovery. Placeholder text is not a substitute for a visible label. A decorative element that looks clickable must either work or look less interactive; a real control needs a perceivable cue.

Charts need the context required to interpret them: metric, units, time range, comparison basis, and credible data. Match direct labels and legend use to available space. A smooth curve, percentage, or “up” badge without meaning is decorative reporting. Never invent data or testimonials to make a design seem complete.

## 9. State, interaction, and motion

Inspect the full state transition, not just the resting frame. For a form: focus, input, invalid input, pending, success, and failure with entered data retained. For search: query, results, no results, clearing, and loading. For a modal: focus entry, constrained tab order, dismiss, and focus return. Native components should retain expected platform behavior.

Motion should explain change, maintain object continuity, communicate feedback, or support the chosen character. Test interruption and repeated input: animation must not strand controls, create duplicate submissions, or steal focus. Review motion in time; a sequence of stills does not establish smoothness.

Use the product's timing language. Do not enforce a universal 200ms duration; travel, scale, distance, input, and purpose differ. Reduced motion should preserve meaning and feedback while changing nonessential movement.

## 10. Common generated-interface oddities

| Symptom | Diagnostic question | Coherent repair |
| --- | --- | --- |
| Every item is a card | Are these independent objects or rows people compare? | Choose grouping and representation from the task; remove redundant containers. |
| Every section has an eyebrow, title, subtitle, icon | Which labels add orientation, which repeat the same meaning? | Keep useful structure and remove repetitive scaffolding. |
| Page is tidy but lifeless | Is there a focal point, expressive asset, or rhythm related to the content? | Introduce purposeful contrast using the product's own identity; don't add arbitrary decoration. |
| Hero overwhelms a working tool | Does it help the returning user complete the task? | Rebalance priority and recover useful working area. |
| Controls look like decorative chips | Does appearance predict clickability and selection? | Restore signifiers, states, keyboard behavior, and labels. |
| Quiet means unreadable | Did muted styling reduce essential text contrast? | Adjust semantic colors while preserving hierarchy. |
| Random badges and metrics | What decision can the user make from them? | Add valid context or remove unsupported claims. |
| Large blank panel at one width | Intentional pacing, reserved state, or broken grid? | Inspect content and breakpoints before filling it. |
| Desktop shrunk onto phone | Does priority survive, and can labels and controls fit? | Recompose groups, preserve essentials, test long content and keyboard. |
| Several nearly identical styles | Do differences encode a real role/state? | Consolidate accidental variants at their shared owner. |

Finish with a counterfactual: if the suggested change were rejected, what evidence would make the original design acceptable? This exposes personal taste disguised as a requirement and helps produce a reviewable decision.
