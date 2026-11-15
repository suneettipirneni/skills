# Meaning, structure and accessible interaction

Layer: **foundations** · Route: `semantics`

**Use when:** A visual element’s role or accessible behavior is uncertain.

**Avoid when:** Assigning ARIA roles by visual resemblance.

## Decision and composition

Start with native semantic elements and the actual operation. Visual layout and accessible structure are related but not identical. Names identify purpose; roles identify behavior; states describe the current condition.

Check headings/landmarks, labels/descriptions, control names, reading order and widget ownership. Use ARIA only with the required interaction model; a role alone does not implement keyboard support.

## Behavior and adaptation

Test keyboard, focus movement, announcements and assistive-technology behavior appropriate to the surface. Native, canvas, shadow DOM and embedded contexts require tooling suited to their trees; bundled light-DOM measurement is incomplete there.

## Evidence and repair

Automated accessibility findings are evidence, not full conformance. Separate confirmed failures, manual review candidates and untested behavior. Do not infer names/roles from screenshots.

**Worked decision:** A CSS grid of product cards remains a collection of links/buttons unless spreadsheet-like keyboard interaction actually warrants an ARIA grid.

**Source boundary:** [WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/patterns/) supplies interaction guidance; examples are not a substitute for testing the implementation with assistive technology.
