# Type roles, rhythm and optical clarity

Layer: **foundations** · Route: `typography`

**Use when:** Text hierarchy, reading comfort or type consistency needs diagnosis.

**Avoid when:** Applying a fashionable scale independently of content and identity.

## Decision and composition

Inventory existing role styles: display, heading, body, label, metadata and numeric value. Choose size, weight, line height and tracking together. Match role equivalence rather than forcing all text onto a geometric ratio.

Build hierarchy through several signals, not ever-larger text alone. Keep expressive display treatment distinct from sustained reading. Numeric alignment and tabular figures can help exact comparisons when supported.

## Behavior and adaptation

Choose faces from representative letterforms. Compare the actual title or label at matched size and width. Look for differences in cap width, x-height, contrast between thick and thin strokes, numeral shapes and line breaks. Check the chosen weight in both quiet labels and dominant text. Put the selected licensed font in the build, including its required weights. Where the reference typeface is unknown, identify the chosen face as an approximation and name what made it fit. An explicitly chosen platform face can also be appropriate.

Inspect the face used for a text node after font loading. In Chromium, Rendered Fonts or `CSS.getPlatformFontsForNode` reveals the face that contributed glyphs. A CSS family declaration and a resolved `document.fonts.ready` can both accompany a fallback. Inspect representative letters and digits, especially across weights and scripts.

Test actual fonts, fallback/font failure, long headings, localization and user text growth. Tight leading/tracking can be intentional but must preserve word boundaries and avoid collision.

## Evidence and repair

Report rendered font/line-height/measure with units and context. Target ranges are local hypotheses unless sourced otherwise. Compare baseline/optical rhythm visually; computed styles cannot judge pleasantness.

**Worked decision:** A 64px headline is not inherently too large. If it turns “ROOM FOR” into “ROOMFOR”, repair its word separation while retaining the intended impact.

**Source boundary:** The main ledger covers Boulton, Wroblewski and Every Layout. This role-based contract is synthesis, not a universal type scale.

## Flexible implementation

[Resilient composition and CSS ownership](../foundations/resilient-css.md) applies Andy Bell’s CUBE CSS and browser-oriented design principles when content, containers or overrides expose fragile rules.

[Optical alignment](optical-alignment.md) covers baseline versus ink bounds, icon–text pairs, deliberate overshoot, punctuation edges, optical size and wrapped/localized labels. Do not use a text run’s pixel centroid as its baseline.
