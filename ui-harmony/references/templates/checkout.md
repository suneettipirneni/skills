# Review and commit a transaction

Layer: **templates** · Route: `checkout`

**Use when:** Submit a purchase, booking or consequential application.

**Avoid when:** An ordinary preference change has no transaction boundary.

## Decision and composition

Make the commitment model explicit: draft, review, submit/payment, pending and confirmed are different states. Show the exact object, quantities, recipient and total that the action will commit.

Provide editable order/application summary, necessary information, cost breakdown, conditions and a clearly named final action. Explain changed prices or availability before commitment. Keep recovery near the failing information.

## Behavior and adaptation

Handle uncertain outcomes without encouraging blind resubmission. Preserve data on failure; distinguish payment authorization, settlement and order confirmation where the product exposes them. A successful request alone may not mean completed fulfillment.

## Evidence and repair

Test changes during review, duplicate clicks, network interruption, server rejection and confirmed return. Verify totals and scope against data; geometry checks cannot validate the transaction.

**Worked decision:** After a timeout, show that order status is being checked with a stable reference rather than saying “Payment failed, try again” without evidence.

**Source boundary:** [GOV.UK check answers](https://design-system.service.gov.uk/patterns/check-answers/) and [confirmation pages](https://design-system.service.gov.uk/patterns/confirmation-pages/) inform review and durable completion, adapted beyond government services.

## Route deeper only when relevant

- [Related fields and validation boundary](../organisms/form-section.md) — Capture required transaction data
- [Identity, properties and relationships](../organisms/detail-region.md) — Present the commitment summary
- [Durable confirmation and next steps](../molecules/receipt.md) — Provide durable outcome and next steps
- [State, error and recovery messages](../molecules/feedback.md) — Handle pending and uncertain outcomes

## Related context

- [Navigation and application frame](../organisms/app-shell.md) — Stable cross-screen navigation is part of this scope
