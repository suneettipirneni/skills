# Reading flow, media and supporting navigation

Layer: **organisms** · Route: `reading-region`

**Use when:** Sustained comprehension needs a coherent content sequence.

**Avoid when:** A comparison task benefits more from aligned values.

## Decision and composition

Keep the primary reading stream continuous. Place asides, captions and related navigation where their relevance is clear; proximity should express the correct attachment. Strong editorial variation can coexist with predictable body text.

Compose semantic headings, paragraphs, lists, figures/captions, quotes and optional contents links. Allow tables/code their own controlled overflow without making the whole page wider. Avoid repeated surface backgrounds that fragment one argument.

## Behavior and adaptation

Test image loading, long code, nested lists, footnotes and anchor navigation. Supporting rails can move below or become disclosures if their reading order remains useful. Keep accessible names and alternative text aligned with the image’s purpose.

## Evidence and repair

Inspect line length, leading, paragraph spacing and caption attachment using the actual font. Report pixel measures only as local design evidence; then read passages to judge rhythm and word boundaries.

**Worked decision:** A caption 24px from its figure but 8px from the next heading appears to explain the next section. Repair the relationship using local spacing roles.

**Source boundary:** [Mark Boulton, Whitespace](https://alistapart.com/article/whitespace/) and [Heydon Pickering and Andy Bell, Stack](https://every-layout.dev/layouts/stack/) motivates relationship-owned spacing. The measurements here are local design contracts, not standards.

## Route deeper only when relevant

- [Semantic text and labels](../atoms/text.md) — Use semantic text roles
- [Images, icons and optical alignment](../atoms/image-icon.md) — Compose purposeful imagery
- [Type roles, rhythm and optical clarity](../foundations/typography.md) — Tune readable and expressive roles
- [Relationship-owned spacing and layout](../foundations/spacing.md) — Make attachment and separation legible
