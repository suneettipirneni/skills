# Alternate panels with tab behavior

Layer: **molecules** · Route: `tabs`

**Use when:** A small set of related panels shares one local context.

**Avoid when:** Ordinary page links, sequential steps or hidden critical content.

## Decision and composition

Use tabs when users understand the panel alternatives and need one at a time. A row of navigation links is not automatically a tab widget. Critical cross-panel comparison may require simultaneous presentation instead.

Provide tablist, clearly named tabs, selected state and associated panels. Preserve labels at narrow widths; clipping half a label is not a navigation strategy. Decide whether panel state persists when switched.

## Behavior and adaptation

Implement keyboard/focus and activation together. Automatic activation suits panels available without noticeable delay; otherwise manual activation can avoid loading each traversed tab. Do not remove focused content unexpectedly.

## Evidence and repair

Test keyboard movement, selection, panel labeling, slow loading and long names. Measure selected indicator relation to label and focus distinction. Avoid validating tabs from underline pixels alone.

**Worked decision:** Account Overview and Billing are independent local views; a three-stage application with required completion belongs to wizard, not tabs.

**Source boundary:** [APG tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/) supplies the interaction model and activation considerations.

## Route deeper only when relevant

- [Action, destination and toggle](../atoms/button-link.md) — Implement focusable activators with correct tab roles
- [Color roles, contrast and meaningful variation](../foundations/color.md) — Separate selected, hover and focus
- [State, error and recovery messages](feedback.md) — Explain unavailable panel data
