# Checkbox, radio, switch and select

Layer: **atoms** · Route: `choice`

**Use when:** Select among values or enable a binary setting.

**Avoid when:** Making an action look like a switch without a persistent state.

## Decision and composition

Checkbox supports independent selection and can represent a mixed aggregate. Radio groups choose one option. Switch expresses on/off and does not have a mixed state. Select/combobox supports constrained values; visible choices can be preferable when comparison matters.

Use stable clear labels, grouping and selected-state cues beyond color. A switch’s visual state must correspond to the actual value, including while saving. Do not use a binary switch for three-way inherited settings.

## Behavior and adaptation

Implement native or established keyboard behavior and group naming. Explain dependent choices. Immediate persistence versus form submission is determined by the parent task, not by the widget’s silhouette alone.

## Evidence and repair

Test all states, group selection, programmatic label association and touch target. Check focus independently from checked/selected state. Measure label/control proximity rather than normalizing every control to a text-input height.

**Worked decision:** “Use workspace default / On / Off” is a three-value choice, not a switch whose indeterminate position users must guess.

**Source boundary:** [APG checkbox](https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/), [radio](https://www.w3.org/WAI/ARIA/apg/patterns/radio/) and [switch](https://www.w3.org/WAI/ARIA/apg/patterns/switch/) supply distinct behavior.

## Route deeper only when relevant

- [Meaning, structure and accessible interaction](../foundations/semantics.md) — Name groups and expose state
- [Color roles, contrast and meaningful variation](../foundations/color.md) — Differentiate selected and focus states
- [Relationship-owned spacing and layout](../foundations/spacing.md) — Keep control and label attached

## Selection decision matrix

This matrix is an applied synthesis. It separates values, focus, input and persistence rather than routing by a dropdown shape.

| Need | Candidate | Decide and verify |
| --- | --- | --- |
| Independent multiple choices | Native checkboxes; grouped when meaningful | Every chosen value remains apparent; a mixed parent represents child selection, not an invented third saved value |
| Exactly one visible alternative | Native radio group | Label the group; show choices for comparison; do not silently preselect a consequential answer without a justified default |
| A binary preference | Switch or checkbox | Name On/Off meaning; parent specifies immediate save or form commit; failed save must not leave a false persisted state |
| One constrained value in little space | Native select first; select-only combobox if justified | Current value stays apparent when collapsed; keyboard behavior and long labels work; custom styling alone does not justify replacing native behavior |
| Type to find one value | Editable combobox | Is arbitrary text permitted or only a listed value? State that contract; distinguish query text from committed value; handle options loading, failure and no matches |
| Several values from a large set | Checkboxes/listbox or composed token chooser as appropriate | Expose selected set, add/remove actions and limits; token removal needs named controls and predictable focus; a complex chip chooser is a molecule-level composition, not a new primitive role |

Focus and selection are different states. Moving through options may or may not commit a selection depending on the chosen widget model. Document the model; do not conflate a hover highlight with a saved value. For asynchronous options, preserve the current committed value while fetching suggestions, prevent stale responses replacing current results and explain no matches without clearing the user’s input. A free-entry tag and an allowed-record identifier require different validation.

**Worked discriminator:** A shipping-country field accepts only known country IDs; typing “Atlantis” must not silently commit an invalid record. A tag creator can explicitly allow a new value, but should distinguish “Create tag” from selecting an existing tag. Do not smuggle a separately interactive Create button inside a listbox option.

**Acceptance:** With keyboard and pointer, open, navigate without committing, choose, dismiss, reopen, remove a value where applicable and recover from failed option loading. Inspect both visible current value and actual form value. Use current [APG combobox](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/) and [listbox](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/) guidance for the chosen model. A multi-value composite needs its own end-to-end testing; this matrix is not a complete implementation recipe.
