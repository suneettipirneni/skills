# Boundary, divider and elevation

Layer: **atoms** · Route: `surface`

**Use when:** A container or separator needs to communicate grouping or layering.

**Avoid when:** Adding cards, shadows and borders to every nested region.

## Decision and composition

Choose the least ambiguous boundary for the relationship: space, divider, surface or elevation. Elevation can imply layering; a border can establish a record boundary. Neither should compete with actual modal/contextual layers.

Use consistent surface roles within the existing identity. Avoid double borders and nested cards that obscure which unit owns actions. Intentional emphasis may differ from neutral containers.

## Behavior and adaptation

Test light/dark themes, disabled states and adjacent surfaces. A removed border may need stronger spacing or heading cues. Do not rely solely on a faint background difference to expose an interactive boundary.

## Evidence and repair

Measure radius/border/shadow drift only among comparable roles. Inspect whether the boundary strengthens grouping; a mathematically matching radius cannot justify an unnecessary box.

**Worked decision:** A continuous article loses repeated card backgrounds, while its related-resource aside retains a distinct surface because it is a different content unit.

**Source boundary:** [Brad Frost, Atomic Design](https://atomicdesign.bradfrost.com/chapter-2/) supports concurrent whole/part thinking. This catalog’s route boundaries are an applied synthesis, not Frost’s prescribed taxonomy.

## Route deeper only when relevant

- [Shape, stroke and layering language](../foundations/shape.md) — Relate radius and elevation roles
- [Color roles, contrast and meaningful variation](../foundations/color.md) — Use surfaces and contrast deliberately
- [Relationship-owned spacing and layout](../foundations/spacing.md) — Prefer clear relationships over redundant boxes
