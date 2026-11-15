# Actions, scope and commitment

Layer: **molecules** · Route: `action-group`

**Use when:** Several related actions compete for attention or need clear consequences.

**Avoid when:** Applying exactly one primary button to every page regardless of independent task regions.

## Decision and composition

Choose emphasis by consequence and scope. A primary action belongs to a task context, not a global count quota. Separate routine, alternate and destructive operations. Wording should predict the resulting state.

Group actions with the object/section they affect. Use buttons for actions and links for navigation. Keep icon-only commands named and understandable. A split action needs a clear default plus distinct alternatives.

## Behavior and adaptation

Handle pending, success, failure and repeated activation deliberately. Preserve focus through async changes; do not replace the focused button with a nonfocusable spinner without a plan. Destructive operations need appropriate reversibility or confirmation based on actual consequence.

## Evidence and repair

Compare size, baseline and spacing only among equivalent variants/states. Test that Cancel really cancels the relevant scope and that bulk actions name their target set. Never hide the only recovery behind disabled controls.

**Worked decision:** A page can have a primary “Save profile” within one form and “Invite member” in a separate region; the question is whether their scopes are legible.

**Source boundary:** [APG button](https://www.w3.org/WAI/ARIA/apg/patterns/button/) differentiates actions and toggle state. Priority and grouping are local task decisions.

## Route deeper only when relevant

- [Action, destination and toggle](../atoms/button-link.md) — Implement correct action/navigation semantics
- [Images, icons and optical alignment](../atoms/image-icon.md) — Name and align icon actions
- [State, error and recovery messages](feedback.md) — Show pending and result
- [Relationship-owned spacing and layout](../foundations/spacing.md) — Group actions by scope
