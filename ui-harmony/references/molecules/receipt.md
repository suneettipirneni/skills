# Durable confirmation and next steps

Layer: **molecules** · Route: `receipt`

**Use when:** A consequential transaction has completed or has a trackable pending outcome.

**Avoid when:** An ephemeral local action only needs a short acknowledgment.

## Decision and composition

Provide durable evidence of what happened and what happens next. Success is not always fulfillment: distinguish submitted, accepted, paid, scheduled and complete. A toast alone is insufficient for a returnable transaction record.

Include clear outcome, object/transaction identity, reference where useful, essential summary, next steps/time expectations if known and a way to return or obtain a copy. Avoid congratulatory copy that hides pending obligations.

## Behavior and adaptation

Handle revisiting/bookmarking and refresh without resubmitting. Provide a useful state if the underlying transaction later changes. Do not expose sensitive details on an unauthenticated receipt merely for convenience.

## Evidence and repair

Verify the receipt matches the actual committed data and can be revisited appropriately. Test uncertain/pending outcome separately from confirmed success. No visual metric can certify that the transaction occurred.

**Worked decision:** An application receipt says “Submitted; decision pending” and records the reference. It does not imply approval with a green “All done” heading.

**Source boundary:** [GOV.UK confirmation pages](https://design-system.service.gov.uk/patterns/confirmation-pages/) supports durable outcome and next steps; details should fit the transaction.

## Route deeper only when relevant

- [Semantic text and labels](../atoms/text.md) — Name the actual outcome
- [Actions, scope and commitment](action-group.md) — Provide return/copy/next steps
- [State, error and recovery messages](feedback.md) — Represent pending or changed status
