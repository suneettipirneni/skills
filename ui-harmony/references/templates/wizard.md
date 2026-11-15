# Guide a dependent sequence

Layer: **templates** · Route: `wizard`

**Use when:** Later stages depend on earlier choices or a long transaction needs staged progression.

**Avoid when:** Independent tasks that users can complete in any order.

## Decision and composition

Define why order is necessary. Show meaningful stages only when they aid orientation; arbitrary equal steps can obscure branching. Progress describes actual completion, not the screen index alone.

Provide stage title, current context, relevant inputs, Back/Continue and review/submit. Separate provisional Continue from the irreversible final action. Include an exit or save-draft path appropriate to the task.

## Behavior and adaptation

Going back preserves data; changing upstream answers invalidates only dependent values and explains why. Handle refresh, resumption, expired sessions and failed final submission. Narrow layouts may shorten the progress representation but must retain current location.

## Evidence and repair

Walk forward, backward, branch changes and resumed sessions. Confirm the last action wording matches its consequence. Count steps only if accurate for the active branch; do not promise a duration without evidence.

**Worked decision:** A shipping choice determines customs fields, so a sequence is useful. Changing domestic to international reveals the new requirements without erasing the recipient.

**Source boundary:** [GOV.UK question pages](https://design-system.service.gov.uk/patterns/question-pages/) and [check answers](https://design-system.service.gov.uk/patterns/check-answers/) inform staged service transactions.

## Route deeper only when relevant

- [Related fields and validation boundary](../organisms/form-section.md) — Each stage captures related information
- [Progress, pending and busy state](../atoms/progress.md) — Represent actual stage/completion
- [Durable confirmation and next steps](../molecules/receipt.md) — A completed transaction needs durable proof

## Nearest alternatives

- [Resume independent tasks](task-hub.md) — Work is independent and resumable
- [Complete a coherent form](form.md) — One view preserves useful context

## Related context

- [Navigation and application frame](../organisms/app-shell.md) — Stable cross-screen navigation is part of this scope
