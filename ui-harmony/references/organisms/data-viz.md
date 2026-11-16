# Charts and coordinated comparison

Layer: **organisms** · Route: `data-viz`

**Use when:** A visual encoding helps answer a quantitative question.

**Avoid when:** Exact lookup or a simple number is clearer in text/table.

## Decision and composition

Choose encoding from question: change, comparison, distribution, relationship or composition. State what the chart cannot establish. Keep shared encodings consistent across coordinated views and explain exceptions.

Provide a question-oriented title, units, scale, legend or direct labels, relevant baseline/context, source and inspectable values. Distinguish data marks from decoration. Do not encode meaning by color alone or crop an axis to exaggerate a difference without making scale clear.

## Behavior and adaptation

Provide useful values without hover-only access. Filter changes should expose their effect and maintain coherent scopes. Small layouts may use fewer annotations or a table alternative; never silently drop consequential data. Recompute the plot for its actual container rather than scaling an entire desktop SVG, including its labels, into a small box. Inspect text at actual rendered size: a computed15px SVG label can appear near6px after a viewBox transform. Keep readable text and a useful plot area; adjust ticks, label placement or layout before shrinking type. A data table supplements visual legibility rather than excusing an unreadable plot.

## Evidence and repair

Check number formatting, units, denominator, missing data and comparable scales before geometry. Measure label clipping and overlap. A chart can be visually harmonious and substantively misleading.

**Worked decision:** Two trends with different denominators require explicit labels; equal-height cards do not make them comparable.

**Source boundary:** [Bach et al. pattern catalog](https://dashboarddesignpatterns.github.io/patterns.html) describes dashboard composition. Quantitative truth must be checked against underlying data; consult the main ledger’s Datawrapper guidance for chart text.

## Route deeper only when relevant

- [Quantity, label and comparison](../molecules/metric.md) — Summarize a defined quantity
- [Color roles, contrast and meaningful variation](../foundations/color.md) — Use meaningful consistent encodings
- [Semantic text and labels](../atoms/text.md) — Label units and comparisons
- [Query, filters and scope](../molecules/search-filter.md) — Control coordinated scope
