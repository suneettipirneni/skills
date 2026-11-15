# Links, disclosures and command menus

Layer: **molecules** · Route: `navigation`

**Use when:** A compact control reveals destinations or commands.

**Avoid when:** Choosing menu semantics from a dropdown silhouette alone.

## Decision and composition

Destinations use links; disclosure buttons reveal content; command menus invoke operations; value selectors choose values. Keep these concepts distinct even if they share a floating surface. Ordinary site navigation rarely needs menu-role keyboard conventions.

Name the trigger and show expanded/selected state appropriately. Group commands by function and separate destructive actions. A visual chevron signals expansion but does not supply an accessible name.

## Behavior and adaptation

Define dismissal, focus movement and return for the chosen pattern. Escape behavior, outside click and arrow keys depend on actual widget semantics. Never put arbitrary links/buttons inside listbox options.

## Evidence and repair

Test opening, operating, closing and re-opening with keyboard and pointer. Check trigger and content fit near viewport edges and text growth. A popup can flip placement without changing its semantic purpose.

**Worked decision:** A “Projects” navigation disclosure contains ordinary links; a “More actions” command menu implements the corresponding menu behavior.

**Source boundary:** [APG disclosure navigation](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/) and [menu patterns](https://www.w3.org/WAI/ARIA/apg/patterns/menubar/) provide distinctions.

## Route deeper only when relevant

- [Action, destination and toggle](../atoms/button-link.md) — Choose trigger and destination semantics
- [Checkbox, radio, switch and select](../atoms/choice.md) — Route value selection to an appropriate control
- [Dialog, popover, sheet or contextual panel](overlay.md) — Resolve placement and modality separately
