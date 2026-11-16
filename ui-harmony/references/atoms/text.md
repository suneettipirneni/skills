# Semantic text and labels

Layer: **atoms** · Route: `text`

**Use when:** Words identify, explain, navigate or structure content.

**Avoid when:** Styling every phrase as a heading or using visual size as the only structure.

## Decision and composition

Choose the semantic role before typography: heading, paragraph, label, value, help, error or caption. A visual style token does not determine heading level. Write specific domain terms and actions instead of generic filler.

Keep labels concise but sufficient to distinguish adjacent objects/actions. Support wrapping, translation and correct pluralization. Explain units and abbreviations near first use when needed.

## Behavior and adaptation

Test missing/long content and text growth without clipping. Avoid meaning hidden only in ellipsis; provide an operable way to access the full value when truncation is necessary. Do not infer accessible reading order from visual placement.

## Evidence and repair

Inspect copy and hierarchy semantically; measure line boxes and clipping with rendered evidence. A DOM text rectangle does not prove typographic optical balance or comprehension.

**Worked decision:** Two “Manage” buttons are ambiguous without their record context; “Manage billing” and “Manage members” predict the destination.

**Source boundary:** Original content synthesis; see the main research ledger for Atlassian content and visual-hierarchy practitioner guidance.

## Route deeper only when relevant

- [Type roles, rhythm and optical clarity](../foundations/typography.md) — Assign role-based styles
- [Meaning, structure and accessible interaction](../foundations/semantics.md) — Keep structure and accessible names meaningful

- [Quiet content and purposeful subtraction](../foundations/quiet-content.md) — Remove semantic repetition while retaining labels, constraints and recovery
