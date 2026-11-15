# Browse or compare a collection

Layer: **templates** · Route: `collection`

**Use when:** Find, compare, select or manage objects sharing a domain.

**Avoid when:** A single known object or chronological conversation is the main task.

## Decision and composition

Choose table for exact common-attribute comparison, cards for visual/nonuniform browsing, list for quick identity scanning, and split detail for repeated inspection with context. Do not choose cards simply because the generator produces attractive boxes.

Provide collection identity/scope, meaningful search/filter/sort, result count, records and retrieval controls. Add selection and bulk actions only when needed; clearly name whether selection covers visible rows, current results or all records. Record actions belong to their row, collection actions to the collection.

## Behavior and adaptation

Preserve filters and return location through detail navigation. Handle no records differently from no matches. With pagination/virtualization, disclose scope and support stable focus. Recompose essential attributes on narrow views without converting exact comparisons into disconnected cards automatically.

## Evidence and repair

Check ordering, count consistency and selection scope with real data. Measure alignments within equivalent columns/rows and ensure the critical attributes are available without accidental page overflow. Local scrolling may be appropriate but must not conceal the primary task.

**Worked decision:** A plan comparison uses a shared feature table; a photo library uses image cards. Same collection count, different dominant decision.

**Source boundary:** [Cloudscape resource views](https://cloudscape.design/patterns/resource-management/view/) distinguishes tabular comparison, visual browsing and contextual details. Its item-count recommendations are local conventions, not universal limits.

## Route deeper only when relevant

- [Table, list, cards and selection](../organisms/collection-region.md) — Compose table/list/card behavior
- [Query, filters and scope](../molecules/search-filter.md) — Retrieval needs controls
- [Retrieve and navigate additional records](../molecules/pagination.md) — Partition or progressively retrieve results
- [Identity, properties and relationships](../organisms/detail-region.md) — Contextual inspection is needed

## Nearest alternatives

- [Search and refine results](search-results.md) — Query interpretation and relevance dominate
- [Understand and act on one record](record-detail.md) — Only one known object matters

## Related context

- [Navigation and application frame](../organisms/app-shell.md) — Stable cross-screen navigation is part of this scope
