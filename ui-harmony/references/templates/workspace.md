# Work repeatedly on a central object

Layer: **templates** · Route: `workspace`

**Use when:** Create or edit with tools, inspectors, previews or multiple contexts.

**Avoid when:** A short form does not warrant application-like panel complexity.

## Decision and composition

Keep the working object central. Toolbars express available operations; inspectors express selected-object properties; navigation changes context. Separate these roles so repeated work does not require hunting across identical panels.

Provide document/object identity, selection/context, tools, working surface, optional inspector and visible save/sync state. Make modes, units and selection scope legible. Preserve space for the work rather than filling every edge with decoration.

## Behavior and adaptation

Handle undo/redo, dirty state, autosave failure, conflict and permission changes. Provide keyboard alternatives to drag and direct manipulation. At narrow widths choose a focused task mode or separate inspector rather than compressing all panels into unusable strips.

## Evidence and repair

Test repeated edit/undo, switching selection, unsaved exit and restoration after failure. Measure remaining working area and obscured controls for real tasks; no universal ideal panel-width ratio exists.

**Worked decision:** A graphics editor uses contextual properties for the selected shape and a persistent canvas; moving every property to a modal would break repeated adjustment.

**Source boundary:** [Jenifer Tidwell, Common Ground](https://www.mit.edu/~jtidwell/common_ground_onefile.html), Central Working Surface, is historical conceptual support. Current input and accessibility behavior needs contemporary implementation checks.

## Route deeper only when relevant

- [Tools, central surface and inspector](../organisms/workbench.md) — Compose tools, working surface and inspectors
- [Dialog, popover, sheet or contextual panel](../molecules/overlay.md) — A scoped subtask needs a dialog
- [State, error and recovery messages](../molecules/feedback.md) — Show save/sync/conflict state

## Related context

- [Navigation and application frame](../organisms/app-shell.md) — Stable cross-screen navigation is part of this scope

## Dragging acceptance

For authored web dragging, separately verify keyboard access and a non-dragging single-pointer alternative, such as click/tap Move controls or choosing a destination. Keyboard support alone does not satisfy [WCAG 2.2 SC 2.5.7](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html). The criterion has essential-dragging and unmodified-user-agent exceptions; inspect applicability. This is not automatically measured by the bundled audit.
