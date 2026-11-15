# Dialog, popover, sheet or contextual panel

Layer: **molecules** · Route: `overlay`

**Use when:** A scoped subtask or related detail benefits from retained context.

**Avoid when:** A large primary workflow is hidden in a cramped modal by default.

## Decision and composition

Choose purpose, then modality, then presentation. A popover’s shape/placement does not decide whether its contents are a menu, listbox or dialog. A persistent inspector differs from a blocking modal even if both slide in from the side.

Provide a clear title/context, necessary controls and a discoverable close/cancel path. Keep the task bounded. Avoid nesting modal layers when a coherent page or expanded panel would be easier.

## Behavior and adaptation

Modal dialogs require appropriate focus entry/containment/return and background inactivity. Nonmodal panels require predictable access without falsely trapping focus. Outside-click dismissal must not silently discard work. Compact adaptation can change presentation or route to a page.

## Evidence and repair

Test Escape, close, submit, outside interaction, long content, keyboard and focus return when the trigger disappears. Measure viewport fit and visible actions; do not simply subtract fixed pixels from height.

**Worked decision:** A record inspector remains nonmodal for repeated comparison; editing a destructive account operation may be a scoped modal with explicit consequences.

**Source boundary:** [APG modal dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) and [Apple popovers](https://developer.apple.com/design/human-interface-guidelines/popovers/) supply distinct web/platform guidance; do not mix their requirements blindly.

## Route deeper only when relevant

- [Actions, scope and commitment](action-group.md) — Clarify completion/cancel
- [Platform, input and evidence boundaries](../conditions/platform-access.md) — Check modality and platform adaptation

## Related content composition

[Form section](../organisms/form-section.md) can be presented inside an overlay; this is a related read, not a claim that a molecule contains an Atomic Design organism.
