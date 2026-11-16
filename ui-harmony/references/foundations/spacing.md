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

## Paired values and connectors

For a before → after or source → destination relationship, inspect the space between the **visible value groups and connector**, not just equal grid tracks. A `1fr auto 1fr` layout with left-aligned short values can leave a large void before the arrow and a small gap after it. Choose a content-driven cluster when the pair is one reading unit, or keep independent aligned columns when cross-row comparison requires them. Do not force symmetry across unrelated columns.

Measure both signed gaps and their difference with a local tolerance and rationale. A reproduced release-detail defect measured 165.6px before its arrow and 15px after; a content-sized arrangement made both 15px. These are example measurements, not preferred global spacing tokens. Inspect labels as well as values; longer text must wrap or adapt without colliding. At narrow widths, a deliberate vertical pair needs its own y-axis contract instead of reusing the desktop x-axis contract. The [detail audit](../detail-audit.md) supports explicit `between` relationships; bounds alone cannot establish optical balance.

Use [physical placement and optical alignment](optical-alignment.md#verify-physical-placement-before-optical-compensation) to check container tracks, group insets and component edges before moving individual glyphs. `edge-align` and `insets` test the explicitly chosen physical relationship; omitted inset sides remain unconstrained.
