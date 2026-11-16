# Tools, central surface and inspector

Layer: **organisms** · Route: `workbench`

**Use when:** Repeated editing requires persistent context and controls.

**Avoid when:** One short edit can be handled by a simple form.

## Decision and composition

Assign each region a clear scope: global/document tools, selected-object controls, central work and navigation. Keep frequently repeated adjustments close enough to reduce context switching; avoid duplicating identical commands in competing places.

Include object identity, current mode/selection, tools, working surface, optional inspector and save state. Separate toolbar groupings by function; use a toolbar composite role only when its keyboard model is implemented.

## Behavior and adaptation

Focus must travel to and from panels predictably. Drag operations need accessible alternatives. Inspectors can become focused views on compact screens. If an operation acts on an object hidden in another view, retain enough target identity to verify the action. Keep repeated switching reachable after scrolling through real content; do not force a return to the top for every edit. Label counts by what they count when objects and related items coexist. Preserve selection through panel toggles and avoid intercepting unrelated/global shortcuts while typing; preserve intentional editor formatting shortcuts.

## Evidence and repair

Test repeated operations, undo/redo, resizing and keyboard-only editing. Use at least two selectable objects when target identity matters: a single populated example can conceal actions applied to the wrong context. Check that undo cannot silently reverse unrelated edits or an intervening save. Record effective working area after panels and task completion friction; do not set a universal inspector ratio.

**Worked decision:** A formatting toolbar acts on the current text selection; clicking it must not erase that selection or silently target another object.

**Source boundary:** [Tidwell Common Ground](https://www.mit.edu/~jtidwell/common_ground_onefile.html) provides the historical central-surface concept; [APG toolbar](https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/) supplies current widget guidance.

## Route deeper only when relevant

- [Actions, scope and commitment](../molecules/action-group.md) — Group scoped commands
- [Dialog, popover, sheet or contextual panel](../molecules/overlay.md) — Use temporary scoped interaction when justified
- [State, error and recovery messages](../molecules/feedback.md) — Show mode/save/conflict state
- [Relationship-owned spacing and layout](../foundations/spacing.md) — Allocate space to the working task

## Dragging acceptance

For authored web dragging, separately verify keyboard access and a non-dragging single-pointer alternative, such as click/tap Move controls or choosing a destination. Keyboard support alone does not satisfy [WCAG 2.2 SC 2.5.7](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html). The criterion has essential-dragging and unmodified-user-agent exceptions; inspect applicability. This is not automatically measured by the bundled audit.
