# Identity, properties and relationships

Layer: **organisms** · Route: `detail-region`

**Use when:** A selected object needs understandable detail in a page or panel.

**Avoid when:** A large unstructured dump of every database property.

## Decision and composition

Keep identity and consequential state above supporting properties. Separate attributes from related entities and history. Choose key-value, prose or comparison layouts according to content, not one universal label/value grid.

Include object name/identifier, status, important facts, record-scoped actions and relevant relationships. Secondary metadata may be quieter but cannot become illegible. Long values must wrap or expose their full value through an operable mechanism.

## Behavior and adaptation

Preserve context when switching objects. A panel must update identity before action can affect another record; asynchronous stale detail must not masquerade as current. Define loading and permission states for individual properties.

## Evidence and repair

Measure key-value grouping and action proximity, then verify which record each action affects. Test missing, zero, long URL, duplicate names and slow record switching.

**Worked decision:** Two customers named Sam need a secondary identifier near the name; matching typography alone cannot remove the ambiguity.

**Source boundary:** [Cloudscape resource details](https://cloudscape.design/patterns/resource-management/details/) informs detail organization; ownership and acceptance here are synthesis.

## Route deeper only when relevant

- [Actions, scope and commitment](../molecules/action-group.md) — Place record-scoped actions
- [Semantic text and labels](../atoms/text.md) — Express headings, values and secondary metadata
- [Alternate panels with tab behavior](../molecules/tabs.md) — Independent related panels are needed
- [State, error and recovery messages](../molecules/feedback.md) — Some properties are unavailable
