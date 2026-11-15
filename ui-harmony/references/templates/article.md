# Read and navigate long-form content

Layer: **templates** · Route: `article`

**Use when:** Comprehension and reading continuity are the primary goals.

**Avoid when:** Rapid exact comparison or a transactional workflow dominates.

## Decision and composition

Build a meaningful reading sequence: title/deck, author/date when relevant, introduction, sections, evidence and related next steps. An optional contents rail supports navigation but should not squeeze the text column into fragments.

Use expressive hierarchy consistent with the publication’s identity. Distinguish body, captions, quotes, code and asides by role. Images need purpose, correct cropping and useful captions. Avoid a border-and-card wrapper around every paragraph.

## Behavior and adaptation

Test long headings, lists, tables, code and media on narrow screens and with text growth. Sticky chrome should not obscure anchors or focus. Keep reading position stable when media loads.

## Evidence and repair

Measure the existing readable measure and line spacing under actual font/content, then propose local targets with rationale. A character-per-line range is a heuristic, not WCAG; language, font and audience matter. Inspect word boundaries and rag optically.

**Worked decision:** A magazine can retain oversized tight headings while the body remains calm and readable. Repair a merged word boundary locally instead of flattening all type styles.

**Source boundary:** [Mark Boulton, Whitespace](https://alistapart.com/article/whitespace/) supplies practitioner reasoning about macro/micro space. The typography contracts are local synthesis.

## Route deeper only when relevant

- [Reading flow, media and supporting navigation](../organisms/reading-region.md) — Compose body, media and ancillary navigation
- [Type roles, rhythm and optical clarity](../foundations/typography.md) — Set role-based text relationships
- [Images, icons and optical alignment](../atoms/image-icon.md) — Treat meaningful media and captions

## Related context

- [Navigation and application frame](../organisms/app-shell.md) — Stable cross-screen navigation is part of this scope

## Flexible implementation

[Resilient composition and CSS ownership](../foundations/resilient-css.md) applies Andy Bell’s CUBE CSS and browser-oriented design principles when content, containers or overrides expose fragile rules.
