# Action, destination and toggle

Layer: **atoms** · Route: `button-link`

**Use when:** A control changes state or navigates.

**Avoid when:** Choosing semantics solely from a filled or underlined appearance.

## Decision and composition

Use a button for an action, a link for navigation and a toggle button for a persistent pressed state. Name the consequence. Appearance can express priority without changing the underlying role.

Keep a visible or otherwise appropriate accessible name; icon-only controls still need names. Text and icon form a coherent hit target. Toggle labels should remain stable when pressed-state semantics convey the change.

## Behavior and adaptation

Implement keyboard activation, focus, disabled/pending and error recovery. Do not use hover alone for discovery. Avoid disabling a navigation link by styling it as gray while leaving unexpected activation.

## Evidence and repair

Measure actual hit area separately from visible icon dimensions. Apply WCAG target-size rules with their exceptions from measurement-rules.md; do not mark every visible icon below 24px as a violation. Check text contrast and visible focus independently.

**Worked decision:** A 16px gear inside a 40px button has a 40px hit area. The audit should inspect the control rectangle, not demand a 24px gear.

**Source boundary:** [APG button](https://www.w3.org/WAI/ARIA/apg/patterns/button/) grounds action/toggle behavior; WCAG numerical rules are in measurement-rules.md.

## Route deeper only when relevant

- [Color roles, contrast and meaningful variation](../foundations/color.md) — Contrast and state roles
- [Relationship-owned spacing and layout](../foundations/spacing.md) — Optical padding and target relationships
- [Meaning, structure and accessible interaction](../foundations/semantics.md) — Correct names and roles

For an apparently off-center control, review the button frame, complete content group and glyph separately using [optical alignment](../foundations/optical-alignment.md). Preserve hit geometry and focus treatment when adjusting visible paint.
