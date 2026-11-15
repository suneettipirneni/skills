# Retrieve and navigate additional records

Layer: **molecules** · Route: `pagination`

**Use when:** The collection exceeds one useful rendering unit.

**Avoid when:** Adding page controls to a short stable set without benefit.

## Decision and composition

Choose pagination for bounded navigation and return, load-more for controlled continuation, and continuous loading only where loss of endpoint and place is acceptable. Virtualization is an implementation technique, not the user’s retrieval model.

Expose current scope, count when known and meaningful next/previous or continuation controls. Avoid claiming a total before it is known. Selection scope must remain clear across retrieved pages.

## Behavior and adaptation

Preserve filters, sort and return position. Keep focus predictable after loading; announce a useful count/status without reading every new row. Handle end, empty next page and partial retrieval failure.

## Evidence and repair

Test back-navigation, stale pagination after filtering, bulk selection and keyboard access to new content. Measure control wrapping and reachability; page count alone does not determine the pattern.

**Worked decision:** A legal document search benefits from stable pages and query state; a photo exploration feed may use load-more with preserved position.

**Source boundary:** Original retrieval synthesis informed by collection research; choose based on actual task and performance constraints.

## Route deeper only when relevant

- [Action, destination and toggle](../atoms/button-link.md) — Provide navigation or load actions
- [State, error and recovery messages](feedback.md) — Show pending/end/failure
- [Semantic text and labels](../atoms/text.md) — Explain current scope
