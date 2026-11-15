# Quantity, label and comparison

Layer: **molecules** · Route: `metric`

**Use when:** A concise quantity answers a named question.

**Avoid when:** A large number is decorative or lacks useful context.

## Decision and composition

Bind label, value, unit, period and comparison so the number cannot be mistaken for another measure. Show uncertainty or missingness when consequential. A trend arrow needs a defined baseline and meaning.

Prioritize the value according to the task; not every metric needs a card. Place supporting comparison nearby and explain whether absolute or percentage change. Use consistent precision justified by the data.

## Behavior and adaptation

Handle zero, unknown, not applicable, loading and stale values distinctly. Never show zero while loading. Large numbers/localized separators must fit without shrinking arbitrarily.

## Evidence and repair

Check arithmetic and denominator from source data; measure value/label grouping and same-role typography. Color “up” is not inherently good—cost and error rates reverse the meaning.

**Worked decision:** “12 overdue deliveries, 3 more than yesterday at this time” is actionable; an unlabeled +25% green badge is not.

**Source boundary:** Original metric synthesis informed by the main ledger’s chart-text research. Numerical validity requires underlying data, not screenshot inference.

## Route deeper only when relevant

- [Semantic text and labels](../atoms/text.md) — Label value, unit and context
- [Color roles, contrast and meaningful variation](../foundations/color.md) — Encode status rather than arbitrary direction
- [Type roles, rhythm and optical clarity](../foundations/typography.md) — Establish value/context hierarchy
