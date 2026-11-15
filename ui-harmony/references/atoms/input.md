# Text entry and editing

Layer: **atoms** · Route: `input`

**Use when:** A person enters free text or a structured value.

**Avoid when:** A constrained choice is better understood as selection.

## Decision and composition

Choose text, multiline, numeric-like, date or other entry behavior from the data and platform. A number-looking identifier is not necessarily a numeric quantity; preserve leading zeros where meaningful. Use native behavior when appropriate.

Provide the correct type/input mode/autocomplete where supported and a stable label through the field molecule. Show units and formatting expectations without requiring users to decode placeholder examples.

## Behavior and adaptation

Test paste, composition/input methods, autofill, selection, undo and validation. Do not reformat destructively on every keystroke. Multiline entry needs deliberate Enter versus send behavior. Read-only differs from disabled.

## Evidence and repair

Check actual text clipping, caret visibility and text growth. Measure comfortable control geometry against the existing system and target rules; fixed heights must accommodate fonts and borders. Test long values and browser zoom.

**Worked decision:** A postal code with leading zeros uses text semantics and a suitable input hint; numeric coercion would corrupt the value.

**Source boundary:** Original entry synthesis; [WCAG input purposes](https://www.w3.org/WAI/WCAG22/Understanding/identify-input-purpose.html) supports identifying common personal-data inputs.

## Route deeper only when relevant

- [Type roles, rhythm and optical clarity](../foundations/typography.md) — Legible input and placeholder roles
- [Meaning, structure and accessible interaction](../foundations/semantics.md) — Name and describe entry correctly
- [Relationship-owned spacing and layout](../foundations/spacing.md) — Fit text and target geometry
