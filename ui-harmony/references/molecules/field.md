# Label, input, hint and error

Layer: **molecules** · Route: `field`

**Use when:** A person must supply or edit a named value.

**Avoid when:** A bare input is assumed self-explanatory because it has placeholder text.

## Decision and composition

Treat the label/control/help/error as one semantic and visual unit. The label names the requested value; hint clarifies format or purpose; error explains a specific failure. Keep optional/required meaning consistent across the form.

Use a persistent visible label and programmatic association. Group choice sets with appropriate legends. Keep hints available after entry. Avoid duplicated help/error prose and unexplained abbreviations.

## Behavior and adaptation

Preserve input on validation failure. Associate descriptions and invalid state correctly; announce only useful changes. A suffix/unit must not replace the accessible label. Test disabled versus read-only according to intended operation.

## Evidence and repair

Measure label-to-control and control-to-help gaps against between-field gaps. Example local contract: internal 8px, external 24px because the existing system uses those roles—not a universal 8px law. Test wrapped hints and errors before changing padding.

**Worked decision:** A field’s help sits closer to the next input than its own; fix the owning field stack rather than translating the help text with an isolated offset.

**Source boundary:** [GOV.UK error summary](https://design-system.service.gov.uk/components/error-summary/) informs linked error recovery; [Heydon Pickering and Andy Bell, Stack](https://every-layout.dev/layouts/stack/) motivates relationship-owned spacing. The measurements here are local design contracts, not standards.

## Route deeper only when relevant

- [Text entry and editing](../atoms/input.md) — Choose entry behavior
- [Checkbox, radio, switch and select](../atoms/choice.md) — Choose selection behavior
- [Semantic text and labels](../atoms/text.md) — Write meaningful labels/hints
- [Relationship-owned spacing and layout](../foundations/spacing.md) — Encode internal/external relationships
