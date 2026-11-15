# Search and refine results

Layer: **templates** · Route: `search-results`

**Use when:** The user expresses an information need and evaluates relevance.

**Avoid when:** A fixed short collection needs only browsing or sorting.

## Decision and composition

Keep the submitted query and scope visible. Distinguish search submission from result sorting and filtering. Relevance signals must explain why a result fits; do not decorate every result with unsupported match scores.

Use search entry, scope, count/status, relevant facets and result identity/snippet. Highlight matched terms only when it helps interpretation. Preserve the user’s query when offering a correction; distinguish suggestions from actual applied changes.

## Behavior and adaptation

Handle no results, slow search, partial source failures and stale requests; late responses must not overwrite a newer query. Restore query/filter/scroll state after opening a result. Search-as-you-type needs deliberate request and announcement behavior, not screen-reader chatter for every key.

## Evidence and repair

Test known-item and exploratory queries, misspellings, long queries and zero matches. Check that filters are discoverable and removable. Results containing multiple links/buttons are not listbox options.

**Worked decision:** A document result needs title, useful excerpt, owner/date when relevant and permission-aware access. A generic card with a large decorative icon hides what the query matched.

**Source boundary:** [Baymard product lists research](https://baymard.com/research/ecommerce-product-lists) addresses integrated retrieval in commerce; [APG listbox](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/) explains the interactive-descendant constraint.

## Route deeper only when relevant

- [Query, filters and scope](../molecules/search-filter.md) — Enter and refine the query
- [Table, list, cards and selection](../organisms/collection-region.md) — Render independently actionable results
- [State, error and recovery messages](../molecules/feedback.md) — No matches or partial search failure

## Nearest alternatives

- [Browse or compare a collection](collection.md) — Browsing common metadata dominates

## Related context

- [Navigation and application frame](../organisms/app-shell.md) — Stable cross-screen navigation is part of this scope
