# Analyze and compare evidence

Layer: **templates** · Route: `analytics`

**Use when:** Explain change, compare distributions or investigate a hypothesis.

**Avoid when:** Urgent operations where summary exploration delays the intervention.

## Decision and composition

Organize around analytical questions rather than a fixed KPI-card count. Choose overview, comparison and drill-down according to the reasoning sequence. Parallel charts need comparable scales and scopes; a narrative sequence may intentionally vary emphasis.

Show scope, units, denominator, period, source and freshness; coordinated visualizations or table; meaningful comparisons; definitions and access to detail. Distinguish no observations, zero, missing and filtered-out values. Keep filters and their effects legible.

## Behavior and adaptation

Preserve filter state and explain cross-filtering. Loading one panel should not silently imply the others share its time range. Offer inspectable values and a non-color path to meaning. At narrow widths retain the question and comparisons; do not shrink charts until labels fail.

## Evidence and repair

Measure label clipping, plotting space and consistency of shared encodings. Verify identical denominators for claimed comparisons. Do not infer chart truth from visual polish or use a universal chart-to-text ratio.

**Worked decision:** Revenue rises but active accounts fall. A paired trend with stated per-account denominator supports explanation better than six unrelated large numerals.

**Source boundary:** [Bach et al., Dashboard Design Patterns](https://arxiv.org/abs/2205.00757) and [author pattern catalog](https://dashboarddesignpatterns.github.io/patterns.html) provide descriptive composition choices, not a causal aesthetic ranking.

## Route deeper only when relevant

- [Charts and coordinated comparison](../organisms/data-viz.md) — Choose encodings and comparisons
- [Query, filters and scope](../molecules/search-filter.md) — Control analytical scope
- [Table, list, cards and selection](../organisms/collection-region.md) — Exact values or source records matter
- [Quantity, label and comparison](../molecules/metric.md) — A bounded summary answers a question

## Nearest alternatives

- [Monitor and triage work](monitoring.md) — The key outcome is an immediate intervention

## Related context

- [Navigation and application frame](../organisms/app-shell.md) — Stable cross-screen navigation is part of this scope
