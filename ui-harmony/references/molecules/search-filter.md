# Query, filters and scope

Layer: **molecules** · Route: `search-filter`

**Use when:** A collection or analysis needs retrieval controls.

**Avoid when:** Controls are decorative or have no meaningful effect on the task.

## Decision and composition

Separate query, filter, sort and scope. A combobox chooses a value with a popup; a command menu invokes actions; a search input submits a query. The word “dropdown” is insufficient to choose semantics.

Show current values, applied filters and a way to remove them. Make Apply versus immediate update explicit. Label sort direction in the domain’s terms, not ambiguous arrows alone. Keep result scope close to controls.

## Behavior and adaptation

Handle debounce, pending state, stale responses and empty results. Restore state after navigation. Do not automatically move focus to results on each input. Ensure compact controls retain their names and current values.

## Evidence and repair

Test keyboard selection, clear-all scope, late response ordering and result counts. Measure wrapping and hit targets, not a universal maximum number of filters. Verify expensive filters do not appear applied before they are.

**Worked decision:** A customer selector uses a combobox; search results with profile links and Follow buttons use ordinary result structures, not options.

**Source boundary:** [APG combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/) includes editable and select-only variants; [APG listbox](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/) limits nested interaction.

## Route deeper only when relevant

- [Text entry and editing](../atoms/input.md) — Enter query text
- [Checkbox, radio, switch and select](../atoms/choice.md) — Choose a filter value
- [Links, disclosures and command menus](navigation.md) — Distinguish commands and destinations
- [State, error and recovery messages](feedback.md) — Communicate pending/no matches
