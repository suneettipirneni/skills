# Type roles, rhythm and optical clarity

Layer: **foundations** · Route: `typography`

**Use when:** Text hierarchy, reading comfort or type consistency needs diagnosis.

**Avoid when:** Applying a fashionable scale independently of content and identity.

## Decision and composition

Inventory existing role styles: display, heading, body, label, metadata and numeric value. Choose size, weight, line height and tracking together. Match role equivalence rather than forcing all text onto a geometric ratio.

Build hierarchy through several signals, not ever-larger text alone. Keep expressive display treatment distinct from sustained reading. Numeric alignment and tabular figures can help exact comparisons when supported.

## Behavior and adaptation

Test actual fonts, fallback/font failure, long headings, localization and user text growth. Tight leading/tracking can be intentional but must preserve word boundaries and avoid collision.

## Evidence and repair

Report rendered font/line-height/measure with units and context. Target ranges are local hypotheses unless sourced otherwise. Compare baseline/optical rhythm visually; computed styles cannot judge pleasantness.

**Worked decision:** A 64px headline is not inherently too large. If it turns “ROOM FOR” into “ROOMFOR”, repair its word separation while retaining the intended impact.

**Source boundary:** The main ledger covers Boulton, Wroblewski and Every Layout. This role-based contract is synthesis, not a universal type scale.

## Flexible implementation

[Resilient composition and CSS ownership](../foundations/resilient-css.md) applies Andy Bell’s CUBE CSS and browser-oriented design principles when content, containers or overrides expose fragile rules.
