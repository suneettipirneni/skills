# Resume independent tasks

Layer: **templates** · Route: `task-hub`

**Use when:** A longer service comprises tasks with flexible order or multiple sessions.

**Avoid when:** Mandatory sequential dependencies should determine the next step.

## Decision and composition

Organize tasks around user accomplishments and prerequisites. Distinguish not started, in progress, complete and blocked. “Visited” does not imply “complete”. Offer a meaningful next task without inventing a fixed sequence.

Provide overall purpose, saved progress, task groups, named statuses and a final submission boundary when applicable. Explain blocked dependencies near the affected task. Keep task links clearly separate from status text.

## Behavior and adaptation

Returning from a task restores hub context and updates only its true state. Support resumption and changed answers that reopen dependent work. State what is saved and what remains unsubmitted.

## Evidence and repair

Test out-of-order completion, partially complete return, changed prerequisites and session resumption. Progress denominators must match applicable required tasks; do not reward optional work as if required.

**Worked decision:** A licensing application lets contact and premises tasks proceed independently while inspection stays blocked until premises details are complete.

**Source boundary:** [GOV.UK task list](https://design-system.service.gov.uk/components/task-list/) addresses flexible-order tasks over time. Exact status vocabulary should fit the product.

## Route deeper only when relevant

- [Table, list, cards and selection](../organisms/collection-region.md) — List task groups and their status
- [State, error and recovery messages](../molecules/feedback.md) — Explain blocked tasks and saved state
- [Durable confirmation and next steps](../molecules/receipt.md) — Final submission needs a receipt

## Nearest alternatives

- [Guide a dependent sequence](wizard.md) — Dependencies require a sequence

## Related context

- [Navigation and application frame](../organisms/app-shell.md) — Stable cross-screen navigation is part of this scope
