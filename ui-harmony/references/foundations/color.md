# Color roles, contrast and meaningful variation

Layer: **foundations** · Route: `color`

**Use when:** Color hierarchy, state communication or theme coherence needs review.

**Avoid when:** Normalizing brand expression to one neutral/accent palette by default.

## Decision and composition

Name roles: canvas, surface, text, muted text, action, selected, focus, semantic status and data encoding. The same hue may serve different contexts but should not create contradictory meanings within a task.

Use contrast and area alongside hue/saturation to prioritize. Preserve brand relationships while repairing illegible text or missing state distinctions. A status needs textual/shape context where color alone would carry meaning.

## Verify a shared color role

Keep raw colors in a palette, then map product roles to palette entries in the theme. A chart might map `--chart-peak-tariff` to `--amber-400` and `--chart-peak-tariff-selected` to `--amber-700`. Both the legend swatch and ordinary peak bars read the first role. The inspected peak bar reads the second. Roles that happen to share a hue can evolve independently when their meanings differ. For each supported theme, change the role mappings in one place. [Emil Kowalski on design tokens](https://x.com/emilkowalski/status/2124828365823615017)

Use the real component on the specimen. Select a peak bar and record the painted colors for its peers, its legend, the selection and an off-peak bar. Temporarily override the ordinary peak role with a visibly different color at the theme boundary. Check that the legend and every ordinary peak bar change together, while the selection and off-peak series keep their colors. Move selection to a different bar to exercise both states. Restore the role, check the original colors return, and inspect the settled chart at reading size. Adapt the same check to the relationship at hand, such as a status dot and its filter key.

## Behavior and adaptation

Test actual composited colors, opacity, imagery, gradients and dark/light states. Opaque hex calculations do not establish contrast on variable backgrounds. Disabled, selected, hover and focus are distinct states.

## Evidence and repair

Use exact WCAG ratios and exceptions in measurement-rules.md. Record foreground/background and unrounded ratio, then assess context. Do not confuse a palette contrast table with coverage of all rendered states.

**Worked decision:** A pale brand yellow can remain the page background while dark text/control boundaries provide readability; replacing the brand with gray is not the required repair.

**Source boundary:** [WCAG contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) governs applicable text contrast; palette harmony remains contextual judgment.
