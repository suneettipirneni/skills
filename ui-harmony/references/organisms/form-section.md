# Related fields and validation boundary

Layer: **organisms** · Route: `form-section`

**Use when:** Several fields form a meaningful group or share a submission.

**Avoid when:** Grouping fields solely because their database types match.

## Decision and composition

Choose the group from user meaning and dependency. A fieldset/legend can name related choices. Keep validation and save scope aligned: users should know whether changing a field saves itself or participates in a larger commit.

Compose section purpose, relevant instructions, fields, conditional content and actions. Optional helper text explains the decision before the error occurs; error text names what failed and how to recover. Avoid placeholder-only labels.

## Behavior and adaptation

Conditional fields appear in a predictable reading position and do not silently lose relevant values. Errors preserve valid input. After submission failure, move focus deliberately to useful context, such as a linked error summary, while avoiding surprise during typing.

## Evidence and repair

Contract internal field spacing separately from section spacing. Test multiline labels/hints/errors, conditional branches, keyboard order and server rejection. Automatic equal-height fields often create awkward whitespace or clip error text.

**Worked decision:** A contact-method radio group reveals an email field directly under Email when selected. The section keeps a stable legend and validates only the active choice.

**Source boundary:** [GOV.UK error summary](https://design-system.service.gov.uk/components/error-summary/) and [APG radio group](https://www.w3.org/WAI/ARIA/apg/patterns/radio/) inform behavior.

## Route deeper only when relevant

- [Label, input, hint and error](../molecules/field.md) — Pair controls with labels, hints and errors
- [Checkbox, radio, switch and select](../atoms/choice.md) — Select the correct choice primitive
- [Actions, scope and commitment](../molecules/action-group.md) — Define submission boundaries
- [State, error and recovery messages](../molecules/feedback.md) — Summarize recoverable failures
