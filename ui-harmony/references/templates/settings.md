# Change preferences and configuration

Layer: **templates** · Route: `settings`

**Use when:** Adjust persistent product or account behavior.

**Avoid when:** A one-time transaction or context-local option is better handled in the task.

## Decision and composition

First choose immediate persistence versus explicit Apply/Save. A switch visually implies an on/off state but does not excuse ambiguous saving. Separate personal, workspace and account scope; make inherited or policy-managed values understandable.

Group preferences by user outcome. Show current value, consequence and scope; put related explanations beside controls. Expose advanced options progressively when that reduces irrelevant work. Keep destructive account operations recognizable and distinct.

## Behavior and adaptation

Immediate changes need pending/saved/failure states and recovery. Explicit forms need dirty-state handling, Cancel and navigation behavior. Respect system preferences where appropriate; explain overrides. Avoid optimistic saved claims before confirmation.

## Evidence and repair

Test persistence after reload, failed saves, dependent options and permissions. Measure labels/control group alignment within related settings, not across unrelated toggle and text-input variants.

**Worked decision:** A notification toggle updates immediately but network failure restores its previous state and explains the failure. A multi-field SMTP configuration uses explicit Test and Save.

**Source boundary:** [Apple settings](https://developer.apple.com/design/human-interface-guidelines/settings/) informs scope and system preference relationships; the persistence contract is product-specific.

## Route deeper only when relevant

- [Related fields and validation boundary](../organisms/form-section.md) — Several dependent settings share a save
- [Checkbox, radio, switch and select](../atoms/choice.md) — Choose appropriate preference controls
- [State, error and recovery messages](../molecules/feedback.md) — Communicate saving and failure

## Nearest alternatives

- [Complete a coherent form](form.md) — A one-time submission dominates

## Related context

- [Navigation and application frame](../organisms/app-shell.md) — Stable cross-screen navigation is part of this scope
