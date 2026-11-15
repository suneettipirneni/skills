# Relationship-owned spacing and layout

Layer: **foundations** · Route: `spacing`

**Use when:** Grouping, rhythm, alignment or fit is unclear.

**Avoid when:** Forcing all gaps to multiples of a preferred base regardless of meaning.

## Decision and composition

Assign space to relationships: within a unit, between units, between sections and around a composition. Derive a compact vocabulary from the existing system. Equivalent relationships should usually agree; different relationships should be distinguishable.

Use layout primitives appropriate to relationship: vertical stack, wrapping cluster, asymmetric sidebar, equal group, or grid. These are compositions, not a mandatory CSS framework. Prefer intrinsic/container-aware behavior where it preserves intent.

## Behavior and adaptation

Test available component space as well as viewport width. Keep content order meaningful when wrapping. Avoid arbitrary offsets and forced heights that hide an upstream structure problem.

## Evidence and repair

Measure scoped gaps and alignment against justified local contracts. Example: an existing form uses 8px within fields and 24px between fields; its help attachment can be tested with those values. Optical correction may legitimately depart from bounding-box equality.

**Worked decision:** Three related actions should wrap as a group when needed rather than leave one wide orphan that accidentally appears primary.

**Source boundary:** [Heydon Pickering and Andy Bell, Stack](https://every-layout.dev/layouts/stack/) motivates relationship-owned spacing. The measurements here are local design contracts, not standards. [Every Layout Sidebar](https://every-layout.dev/layouts/sidebar/) and [Switcher](https://every-layout.dev/layouts/switcher/) inform intrinsic adaptation; older implementation commentary must be checked against current CSS.

## Flexible implementation

[Resilient composition and CSS ownership](../foundations/resilient-css.md) applies Andy Bell’s CUBE CSS and browser-oriented design principles when content, containers or overrides expose fragile rules.
