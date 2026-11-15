# Monitor and triage work

Layer: **templates** · Route: `monitoring`

**Use when:** Detect exceptions and decide the next intervention.

**Avoid when:** Explaining long-term causes without an immediate operational decision.

## Decision and composition

Lead with conditions requiring attention, their urgency and available action. First determine whether the product is a work queue, status overview or mixed surface. A queue may need no KPI cards at all. If critical priorities are common, arbitrary personalization may bury them.

Use a clear scope/time/freshness header; prioritized exceptions or queue; status with text; record identity and owner; relevant action; optional summary and contextual detail. Stable reference summaries should not compete with urgent items. Align shared attributes to enable scanning.

## Behavior and adaptation

Handle stale/partial data, disconnected sources, acknowledged versus resolved states and permission-limited actions. Avoid live reordering under a pointer or keyboard focus without preserving orientation. On narrow screens keep task-critical identity/status/action visible before secondary metadata.

## Evidence and repair

Measure visible critical fields and comparable column alignment, not card equality. Inspect whether the first actionable exception can be found in each viewport. Freshness thresholds are domain contracts: declare the source and units; do not invent a universal refresh interval.

**Worked decision:** A delivery queue displays four matching cards but hides failed deliveries below revenue metrics. Put failures first and pair each with owner/contact; preserve dense useful rows.

**Source boundary:** [Cloudscape service dashboards](https://cloudscape.design/patterns/general/service-dashboard/) discusses fixed and configurable contexts. Prioritization and acceptance here are task-specific synthesis.

## Route deeper only when relevant

- [Table, list, cards and selection](../organisms/collection-region.md) — Triage repeated records
- [Quantity, label and comparison](../molecules/metric.md) — A summary changes the intervention decision
- [Identity, properties and relationships](../organisms/detail-region.md) — Repeated inspection benefits from retained queue context
- [State, error and recovery messages](../molecules/feedback.md) — A source is stale, partial or unavailable

## Nearest alternatives

- [Analyze and compare evidence](analytics.md) — The task is explanation and comparison over time
- [Resume independent tasks](task-hub.md) — The user is completing independent setup tasks

## Related context

- [Navigation and application frame](../organisms/app-shell.md) — Stable cross-screen navigation is part of this scope
