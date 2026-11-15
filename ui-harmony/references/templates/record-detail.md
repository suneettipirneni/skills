# Understand and act on one record

Layer: **templates** · Route: `record-detail`

**Use when:** Inspect a known object, related objects or its state.

**Avoid when:** Repeated independent records require comparison before selecting one.

## Decision and composition

Decide between simple detail, tabbed independent task groups, and a hub linking related resources. Long content alone does not justify tabs. For repeated inspection, a panel can retain collection context; complex work or deep links may deserve a page.

Lead with identity, current state, key facts and record-scoped actions. Group properties by meaning; show relationships separately from attributes. Use tabs only when panels form understandable alternate views. Place destructive actions away from routine actions without making them undiscoverable.

## Behavior and adaptation

Name read/edit mode and save scope. Inline edit suits independent attributes; dependent multi-field changes need a coherent commit. Preserve selection and focus when closing a panel. Keep invalid drafts or explicitly explain discard behavior.

## Evidence and repair

Verify record identity stays evident while scrolling and that actions affect the named record. Inspect long values, missing versus zero, forbidden fields and stale concurrent edits. Do not force key-value rows to identical heights by clipping content.

**Worked decision:** A customer drawer shows contact details for quick calls. Editing billing/tax dependencies opens a dedicated form with one save boundary rather than several unrelated inline saves.

**Source boundary:** [Cloudscape details](https://cloudscape.design/patterns/resource-management/details/) and [edit patterns](https://cloudscape.design/patterns/resource-management/edit/) inform the branching; presentation follows local needs.

## Route deeper only when relevant

- [Identity, properties and relationships](../organisms/detail-region.md) — Compose identity, properties and relationships
- [Related fields and validation boundary](../organisms/form-section.md) — Edit related properties together
- [Alternate panels with tab behavior](../molecules/tabs.md) — Independent panels justify a tab widget
- [Dialog, popover, sheet or contextual panel](../molecules/overlay.md) — A contextual panel or scoped dialog is appropriate

## Nearest alternatives

- [Browse or compare a collection](collection.md) — Records must be compared before selection

## Related context

- [Navigation and application frame](../organisms/app-shell.md) — Stable cross-screen navigation is part of this scope
