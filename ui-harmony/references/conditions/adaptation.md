# Responsive, content and localization stress

Layer: **conditions** · Route: `adaptation`

**Use when:** Layout or meaning may fail as available space or content changes.

**Avoid when:** Treating one phone screenshot as proof of responsiveness.

## Decision and composition

Adapt relationships, not merely scale. Identify what must remain visible for the task, what can move and what may change presentation. Container space, text growth, input modality and content length matter beyond viewport width.

Build a compact scenario matrix from actual risk: narrow and wide layouts, long labels/values, missing media, dense records, translated text and relevant directionality. Do not invent translations and call them native-language validation.

## Behavior and adaptation

Check reflow, local versus page overflow, reading/focus order, sticky occlusion and retained context. Zero horizontal overflow can conceal excessive text shrinking. Compare actual role readability across sizes, including transformed SVG labels; recompose filters, rows and annotations instead of reducing necessary labels to microtext. A table may scroll locally while keeping task-critical identity/status visible; an inspector may become a page.

## Evidence and repair

Use CSS-pixel measurements only for rendered web. WCAG reflow/text-spacing conditions have exceptions and specific definitions; read measurement-rules.md. Passing custom viewport sizes is not complete accessibility proof.

**Worked decision:** A dashboard at 320px has no page overflow but conceals every action in a local horizontal table; responsive geometry passed while task accessibility remains unresolved.

**Source boundary:** [Ethan Marcotte, Responsive Web Design](https://alistapart.com/article/responsive-web-design/) grounds adaptable composition historically; current acceptance combines task evidence and WCAG requirements.

## Flexible implementation

[Resilient composition and CSS ownership](../foundations/resilient-css.md) applies Andy Bell’s CUBE CSS and browser-oriented design principles when content, containers or overrides expose fragile rules.
