# Complete a coherent form

Layer: **templates** · Route: `form`

**Use when:** Capture or edit related information with an understandable commitment.

**Avoid when:** Independent work across sessions or purely immediate preferences.

## Decision and composition

Group by user meaning and dependency, not database column order. Choose one page when context benefits from overview; split when stages are genuinely manageable and dependencies support it. Do not universalize one-question-per-page outside its service context.

Provide purpose, required information, fields with visible labels/hints, grouped choices, relevant help and a clear submission boundary. Use sensible known values without silently inventing data. Place review before high-consequence submission when needed.

## Behavior and adaptation

Preserve entered values after validation or network failure. Explain errors near fields and provide a navigable summary for a multi-field failure. Distinguish client validation, server rejection and uncertain submission outcome. Back/Cancel behavior and draft persistence must be explicit.

## Evidence and repair

Test complete submission, invalid data, long/localized labels, repeated submit, keyboard order and recovery. Measure field-group spacing locally and accessible target/contrast separately. A disabled unexplained submit does not teach the missing requirement.

**Worked decision:** An address form retains all valid fields after postcode rejection, focuses an error summary and links to the field. It does not reset the form or flash a toast as the only explanation.

**Source boundary:** [GOV.UK question pages](https://design-system.service.gov.uk/patterns/question-pages/), [check answers](https://design-system.service.gov.uk/patterns/check-answers/) and [error summary](https://design-system.service.gov.uk/components/error-summary/) are service guidance adapted to task scope.

## Route deeper only when relevant

- [Related fields and validation boundary](../organisms/form-section.md) — Group related fields and validation
- [Actions, scope and commitment](../molecules/action-group.md) — Specify submit/cancel consequences
- [State, error and recovery messages](../molecules/feedback.md) — Communicate recoverable validation or uncertain submission

## Nearest alternatives

- [Guide a dependent sequence](wizard.md) — A real sequence or dependency justifies stages
- [Resume independent tasks](task-hub.md) — Independent tasks can be completed out of order
- [Change preferences and configuration](settings.md) — Preference persistence is the primary decision

## Related context

- [Navigation and application frame](../organisms/app-shell.md) — Stable cross-screen navigation is part of this scope
