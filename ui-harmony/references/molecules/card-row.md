# Repeated item identity and action

Layer: **molecules** · Route: `card-row`

**Use when:** A record needs a compact repeated presentation.

**Avoid when:** Wrapping unrelated content in cards merely to fill a grid.

## Decision and composition

Choose a row for aligned scanning, a card for meaningful bounded objects or visual browsing. Surface boundaries should express object/group boundaries. A card is not a reason to repeat the same heading/icon/button trio everywhere.

Use identity, differentiating information and scoped action. Keep optional metadata subordinate. If the whole card navigates, avoid nested competing interactive elements; otherwise use an explicit primary link and independent controls.

## Behavior and adaptation

Test selected, hovered, focused, pending and unavailable states separately. Preserve stable content order. Long titles and missing images must not break the relationship or make actions jump unpredictably.

## Evidence and repair

Measure equivalent internal paddings and alignment only within matching variants. Permit height variation when content needs it; forced heights must not truncate decision-critical text. Inspect optical icon alignment separately.

**Worked decision:** A product card gives image and price prominence; an incident row gives severity and owner prominence. They should not share a content hierarchy just because both repeat.

**Source boundary:** [Cloudscape resource views](https://cloudscape.design/patterns/resource-management/view/) distinguishes tabular comparison, visual browsing and contextual details. Its item-count recommendations are local conventions, not universal limits.

## Route deeper only when relevant

- [Action, destination and toggle](../atoms/button-link.md) — Provide explicit scoped actions
- [Images, icons and optical alignment](../atoms/image-icon.md) — Use meaningful media
- [Semantic text and labels](../atoms/text.md) — Prioritize identifying information
- [Boundary, divider and elevation](../atoms/surface.md) — Decide whether a boundary is needed
