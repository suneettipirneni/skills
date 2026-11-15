# Color roles, contrast and meaningful variation

Layer: **foundations** · Route: `color`

**Use when:** Color hierarchy, state communication or theme coherence needs review.

**Avoid when:** Normalizing brand expression to one neutral/accent palette by default.

## Decision and composition

Name roles: canvas, surface, text, muted text, action, selected, focus, semantic status and data encoding. The same hue may serve different contexts but should not create contradictory meanings within a task.

Use contrast and area alongside hue/saturation to prioritize. Preserve brand relationships while repairing illegible text or missing state distinctions. A status needs textual/shape context where color alone would carry meaning.

## Behavior and adaptation

Test actual composited colors, opacity, imagery, gradients and dark/light states. Opaque hex calculations do not establish contrast on variable backgrounds. Disabled, selected, hover and focus are distinct states.

## Evidence and repair

Use exact WCAG ratios and exceptions in measurement-rules.md. Record foreground/background and unrounded ratio, then assess context. Do not confuse a palette contrast table with coverage of all rendered states.

**Worked decision:** A pale brand yellow can remain the page background while dark text/control boundaries provide readability; replacing the brand with gray is not the required repair.

**Source boundary:** [WCAG contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) governs applicable text contrast; palette harmony remains contextual judgment.
