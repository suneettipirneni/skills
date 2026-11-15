# Table, list, cards and selection

Layer: **organisms** · Route: `collection-region`

**Use when:** Repeated records need readable structure and scoped interaction.

**Avoid when:** Using one generic card for all semantic relationships.

## Decision and composition

Choose semantic structure from operation. A native table expresses shared row/column relationships. Ordinary lists/cards can contain links and buttons. An interactive grid is a composite keyboard widget, not a synonym for CSS grid; implement that complexity only when the interaction benefits.

Define identity, repeated attributes, row/card actions, optional expansion and selection. Keep numeric comparisons aligned consistently; use headers and units. Avoid nested clickable cards with conflicting buttons. Selection controls and row navigation must have distinct hit areas.

## Behavior and adaptation

Sorting should retain meaningful focus and announce result changes appropriately. Explain bulk-action scope across pages and partial failures. Virtualization must preserve accessible context; validate actual rendered behavior. Narrow tables may scroll locally, but critical task fields need deliberate priority.

## Evidence and repair

Check equivalent-column alignment and same-role style drift with scoped selectors. Audit missing records/headers before interpreting a low finding count. Compare long text, zero/missing data, selected, expanded and restricted rows.

**Worked decision:** A searchable directory contains profile links and Follow buttons: render a list of independently operable items, not listbox options.

**Source boundary:** [APG table/grid/listbox patterns](https://www.w3.org/WAI/ARIA/apg/patterns/) distinguish these semantics. [Cloudscape resource views](https://cloudscape.design/patterns/resource-management/view/) distinguishes tabular comparison, visual browsing and contextual details. Its item-count recommendations are local conventions, not universal limits.

## Route deeper only when relevant

- [Repeated item identity and action](../molecules/card-row.md) — Compose individual records
- [Query, filters and scope](../molecules/search-filter.md) — Filter/sort the collection
- [Retrieve and navigate additional records](../molecules/pagination.md) — Retrieve additional records
- [Actions, scope and commitment](../molecules/action-group.md) — Handle row and bulk actions
- [State, error and recovery messages](../molecules/feedback.md) — Explain partial bulk failure
