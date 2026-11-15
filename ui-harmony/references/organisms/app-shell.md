# Navigation and application frame

Layer: **organisms** · Route: `app-shell`

**Use when:** Users move among stable destinations or scopes.

**Avoid when:** Adding persistent chrome to a self-contained short task.

## Decision and composition

Distinguish global navigation, local navigation, object breadcrumbs and commands. Keep current location legible. A navigation bar styled like tabs is still navigation when it links destinations; do not add composite menu semantics merely for visual similarity.

Compose product/workspace identity, destinations, current location and necessary account/help access. Use a stable frame with enough room for actual content. Secondary rails should earn their width through frequent use.

## Behavior and adaptation

On narrow layouts expose a clear navigation trigger and current destination. A modal drawer needs focus containment and return; an inline disclosure does not become modal. Sticky headers must not hide anchors or focused content.

## Evidence and repair

Test deep links, browser Back, keyboard traversal and long destination labels. Measure content width after chrome, not just overall viewport. Check that selected-state contrast remains distinct from hover/focus.

**Worked decision:** A settings rail uses ordinary links with a current-page indication; arrow-key menu behavior would surprise users expecting link navigation.

**Source boundary:** [APG disclosure navigation](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/) distinguishes ordinary site navigation from ARIA menus.

## Route deeper only when relevant

- [Links, disclosures and command menus](../molecules/navigation.md) — Choose links, disclosures or actual menus
- [Relationship-owned spacing and layout](../foundations/spacing.md) — Allocate frame and content relationships
- [Platform, input and evidence boundaries](../conditions/platform-access.md) — Check navigation under input/access constraints
