# Compare plans and commitments

Layer: **templates** · Route: `pricing`

**Use when:** Evaluate alternatives by cost, fit and constraints.

**Avoid when:** A single straightforward offer does not need a comparison framework.

## Decision and composition

Choose the comparison attributes from purchase decisions, not from a feature inventory. Align shared criteria when exact comparison matters. A highlighted plan needs a defensible reason; do not label everything “best”.

Show plan identity, price unit/period, billing cadence, eligibility, limits, included features and action. Distinguish per-user versus total prices and introductory versus recurring costs. Place qualifications beside the claim they qualify.

## Behavior and adaptation

Changing billing mode updates amounts and explanations consistently. On narrow screens preserve shared criterion labels; stacking cards must not hide differences. Handle contact-sales and unavailable plans as different actions, not misleading identical Buy buttons.

## Evidence and repair

Check arithmetic and units from actual source data, alignment of like features and visibility of conditions. Visual emphasis must not hide less expensive paths or imply false savings.

**Worked decision:** Annual pricing states the total billed annually and the monthly equivalent, rather than displaying only a smaller monthly-looking amount.

**Source boundary:** [Cloudscape resource views](https://cloudscape.design/patterns/resource-management/view/) supports exact attribute comparison; commercial disclosure and pricing judgment here are task-specific synthesis, not legal guidance.

## Route deeper only when relevant

- [Table, list, cards and selection](../organisms/collection-region.md) — Compare shared plan attributes
- [Quantity, label and comparison](../molecules/metric.md) — Present price with units and cadence
- [Actions, scope and commitment](../molecules/action-group.md) — Use truthful action consequences

## Related context

- [Navigation and application frame](../organisms/app-shell.md) — Stable cross-screen navigation is part of this scope
