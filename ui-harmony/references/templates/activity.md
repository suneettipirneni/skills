# Review events and notifications

Layer: **templates** · Route: `activity`

**Use when:** Scan changes, notifications or chronological activity and act selectively.

**Avoid when:** A live conversation or prioritized work queue is the real task.

## Decision and composition

Distinguish an immutable event log from an actionable inbox. Read, acknowledged, resolved and dismissed are different meanings. Choose chronology for history and priority grouping when intervention is the task.

Provide event actor/action/object, time, relevant context and clear destination. Group repetitive events without hiding important state transitions. Use unread markers as state signals, not decorative dots on every row.

## Behavior and adaptation

Handle new arrivals without losing place, pagination, mark-all scope and deleted/inaccessible destinations. Make bulk dismissal reversible when appropriate. Time zones and relative timestamps need enough context for the decision.

## Evidence and repair

Test returning after new events, marking one versus all and opening unavailable records. Compare information density and scan paths; do not equalize rows by removing essential context.

**Worked decision:** An audit history preserves every status transition; an inbox may bundle ten low-priority comments. Their similar visual lists do not imply identical data or actions.

**Source boundary:** This route is original synthesis. [Cloudscape timestamps](https://cloudscape.design/patterns/general/timestamps/) is a relevant follow-up for timestamp conventions; verify platform-specific formatting before implementation.

## Route deeper only when relevant

- [Table, list, cards and selection](../organisms/collection-region.md) — Render grouped events
- [Actions, scope and commitment](../molecules/action-group.md) — Scope read/dismiss actions
- [State, error and recovery messages](../molecules/feedback.md) — Explain unavailable destinations

## Nearest alternatives

- [Monitor and triage work](monitoring.md) — Prioritized intervention dominates
- [Exchange messages and maintain context](conversation.md) — People exchange replies in context

## Related context

- [Navigation and application frame](../organisms/app-shell.md) — Stable cross-screen navigation is part of this scope
