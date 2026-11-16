# Compose the interaction and visual system

Layer: **workflow** · Route: `compose`

**Use when:** Structure is plausible and needs coherent behavior and appearance.

**Avoid when:** Polishing a structure already known to fail the task.

## Decision and composition

Choose the template by dominant task, then only the organisms, molecules and atoms needed. Use existing system roles first. Design the whole and the parts together; a beautiful button cannot rescue a misleading priority order.

Establish attention order, grouping, density and dominant alignment. Name intentional differences: urgent state, primary action, editorial interruption, brand expression. Tokens encode repeated decisions after their role is understood; do not force every value onto a scale prematurely.

## Behavior and adaptation

Compose loading, empty, error and permission cases alongside the happy path. Inspect narrow layout and large text early. Responsive changes may alter the idiom, such as detail panel becoming a dedicated page.

## Evidence and repair

For scoped repairs, exit when representative content/states explain themselves, the primary task is visible and changed relationships are verified. For creation or broad polish, also substantiate the chosen visual direction: inspect the whole composition, refine its relevant component family and develop a consequential state transition where interaction is in scope. Use the [Untitled UI anchor](../preferences/untitled-ui.md) for this user’s SaaS aesthetic. A functioning scaffold or high preference score alone is insufficient evidence of craft. Audit optical alignment as well as rectangles, preserve identity strengths and disclose untested states.

**Worked decision:** A vivid editorial heading has intentional tight tracking; only the word boundary is unclear. Increase that boundary rather than replacing the typeface or applying a global spacing reset.

**Source boundary:** [Brad Frost, Atomic Design](https://atomicdesign.bradfrost.com/chapter-2/) supports concurrent whole/part thinking. This catalog’s route boundaries are an applied synthesis, not Frost’s prescribed taxonomy.

## Related context

- [Bind templates to actual pages and states](../pages/page-instance.md) — Test the composition with real content
- [Prototype, inspect and learn](evaluate.md) — Inspect the composed result

## Flexible implementation

[Resilient composition and CSS ownership](../foundations/resilient-css.md) applies Andy Bell’s CUBE CSS and browser-oriented design principles when content, containers or overrides expose fragile rules.

For React generation, [headless primitives](../foundations/headless-react.md) can supply complex control behavior while the application owns its visual family. Recommend Base UI for a new suitable project; retain established primitives where appropriate.
