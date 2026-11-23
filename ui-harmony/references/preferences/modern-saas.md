# Modern SaaS minimalism: the preferred direction

Layer: **conditions** · Route: `modern-saas`

This is the user's explicit default taste for new designs and substantial redesigns: calm, precise, contemporary software surfaces. Prefer it when choosing among otherwise suitable solutions. The user excludes Material Design from this visual direction. A later brief overrides it. On narrow repairs, retain the surrounding product identity; this preference does not authorize unrelated rebranding. Keep successful domain vocabulary, imagery and brand cues while reducing incidental chrome.

Use this profile alongside a task route, not instead of one. For creation and broad polish, use [Untitled UI as the primary aesthetic anchor](untitled-ui.md): develop composition and component finish down to primitives, with specific references and state evidence. Vercel, shadcn, Cloudflare and Apple are complementary references; do not average their visual identities into a generic template. Read the [research and disagreements](modern-saas-research.md) when explaining a choice. Use [perceptual review](../design-review.md#make-an-aesthetic-judgment) for evidence-backed comparisons. The profile is intentionally opinionated; it is not a claim that other styles are bad UX.

For concrete visual references, choose a [field specimen by the job in front of you](../fieldwork/2026-11/atlas.md#choose-by-the-job-in-front-of-you). Linear’s review surface, its brand typography and a creator’s landing page answer different briefs. Inspect the working-size crop before borrowing a characteristic.

## Recognizable direction

Start with quiet neutral or low-chroma content planes, compact readable typography, well-aligned controls, restrained radii, and spacing that explains relationships. Let actual objects, labels and data carry the screen. Use a clear primary emphasis within each action group. Keep secondary actions available with quieter treatment. Navigation and framing recede after orientation.

Prefer a coherent flat list or table over wrapping every row in a floating card. Cards earn their boundaries when objects are independent or contain distinct actions. Use separators, subtle fills or space according to the relationship; removing all boundaries can destroy grouping. Reserve stronger elevation for actual layers such as menus and dialogs. Subtle control shadows, inset edges and highlights can make ordinary buttons and inputs feel finished; keep their material coherent and subordinate to overlays. Avoid decorative nested panels, glowing borders, oversized pill controls, gratuitous icon tiles, gradients behind every metric, and giant dashboard greetings that push work away.

Minimalism reduces cognitive load by prioritizing information, grouping related controls, using predictable navigation, revealing secondary complexity when useful, and giving clear feedback and recovery. Fast access such as a command palette earns its place when the product and audience benefit; it is not mandatory. Keep task-supporting controls visible or discoverable. [Nielsen Norman Group on aesthetic and minimalist design](https://www.nngroup.com/articles/aesthetic-minimalist-design/) and the [aesthetic-usability effect](https://www.nngroup.com/articles/aesthetic-usability-effect/) distinguish visual appeal from demonstrated usability.

Minimalism is not an empty page. A well-composed dense issue list can fit this preference better than a sparse screen of large cards. Meaningful charts, warnings, status colors, imagery and a restrained brand accent are welcome. A warm neutral palette can fit as well as cool gray. No specific font, component library, hue, theme or pixel value earns points by itself.

## Route the idiom before styling it

| Route | Preferred composition | What to resist / preserve |
| --- | --- | --- |
| `collection`, `search-results` | Compact title/action row, nearby filters, aligned rows for comparable attributes; cards for image-led browsing | Resist a dashboard hero and per-row shadows; preserve useful metadata, selection and bulk actions |
| `monitoring`, `analytics` | Exceptions and task-relevant measures first; charts share units, labels and grids; subdued framing | Resist equal-weight KPI card walls; preserve semantic color and alerts even when visually prominent |
| `record-detail` | Stable identity header, related properties grouped, primary content plane and optional contextual side panel | Resist boxes within boxes; preserve history and critical context near decisions |
| `settings`, `form`, `authentication` | Restrained page heading, labeled controls, sections with clear spacing, explicit save/commit model | Resist oversized rounded fields and icon-only labels; preserve help, validation and recovery |
| `editor`, `conversation` | Content-first canvas/thread, predictable tools, progressive disclosure of secondary controls | Resist decorative chrome and repeated intro animations; preserve discoverability and interruption recovery |
| `landing`, `pricing` | A clear offer, real product proof, deliberate typography and a controlled visual signature | Marketing can use larger type, illustration and motion. Do not paste a hero into the product or score a persuasive hero as dashboard noise |
| `article`, onboarding via `wizard` | Comfortable reading measure and step context; intentional sparse composition where it helps comprehension | Do not compress reading into an issue-table density or reward empty space without a purpose |

For hybrid screens, scope each region and explain the dominant task. Do not average marketing and product regions into an unqualified score. A task does not become simple merely because advanced options were moved into a menu: inspect discovery and repeated interaction cost.

## Carry it down to primitives

These are **proposed starting points for a new desktop web app**, not standards or fixed scoring thresholds. Prefer existing tokens when coherent. Translate to rem where appropriate; respect user font settings and native units.

| Level | Starting decision | Measurement / semantic check |
| --- | --- | --- |
| Foundation: type | One UI sans family; regular and medium/semibold roles; app text commonly 14–16px, metadata 12–14px, section/page headings 18–28px | Record actual size/line-height/weight roles. Smaller metadata must remain readable; never shrink text just to fit. Tables may need tabular numerals; large marketing headlines are a different role |
| Foundation: space | A small token scale such as 4/8/12/16/24/32px; internal gaps smaller than inter-group gaps | Measure the same role across siblings. Treat tokens as a vocabulary, not a modulus test on every dimension. Allow optical corrections and intrinsic sizing |
| Atom: control | Often 32–40px desktop visual height, 6–8px radius; touch contexts commonly need 44–48px comfortable targets | Measure actual hit areas and spacing independently. These are local comfort proposals; apply platform/WCAG requirements and exceptions separately. Keep focus and accessible names |
| Atom: surface | Quiet base; deliberate dividers/fills; subtle control material where appropriate; modest 6–12px container corners as a starting point; distinct elevation for floating layers | Name the grouping/layering job. A border, shadow or radius count alone cannot determine quality. Inspect dark themes and stacking |
| Atom: icon | For this user's new web UIs, use named Lucide icons for navigation, actions, disclosures and status indicators. Size the strokes alongside the actual label on the primitive sheet. | Check the glyph in its resting, disabled and toggled states. Keep the action's accessible name stable and hide decorative SVGs from assistive technology. |
| Molecule: field, row, toolbar | Consistent label/control/help grouping, aligned values and quiet secondary actions | Inspect long labels, errors, selected state and overflow. Do not remove persistent labels for a cleaner screenshot |
| Organism: shell, collection, panel | Stable navigation/action placement, content owns available area, one clear layer per meaningful boundary | Measure usable content area and visible task-relevant rows as observations, not goals to maximize. Track extra scrolling or menu steps caused by visual simplification |
| Condition: motion | Fast, interruptible feedback; no animation where immediacy serves frequent actions | Test repetition, reduced motion, focus and settled states. Do not assign a craft bonus merely for animation |

For this user's bespoke web work, load **Inter** on the primitive sheet and use it for sans-serif text by default. Set the actual product title and the smallest useful control label before choosing weights. Use a separate numeral or display face when the content benefits from it. Bundle the licensed font files for offline prototypes and inspect the font Chrome actually used for representative glyphs. An existing product's established type and icon system takes precedence when preserving its identity is part of the brief.

Andy Bell's [resilient composition](../foundations/resilient-css.md) remains foundational: use layout relationships and content-driven wrapping rather than hardcoded screenshots. A precise appearance must survive text growth, error copy and intermediate containers.

## Review and act

Prefer typography and hierarchy refinements, removing redundant containment, normalizing genuinely equivalent controls and clarifying color roles. Do not optimize by removing necessary content, lowering text contrast, replacing familiar labels with icons or hiding task-critical controls. A blank white page is not a complete product surface.

The highest useful improvement is often a relationship: align object identity with its status, reduce toolbar competition, remove a redundant card layer, or keep help with its field. State the observed condition, the intended relationship, the proposed numerical target if justified, what must survive, and the recheck. Report style fit separately from task/accessibility findings.

Use [quiet content and purposeful subtraction](../foundations/quiet-content.md) to inspect repeated headings, obvious instructions, slogans and redundant badges. Quietness comes from fewer competing signals, not reduced legibility or a thin feature set.

For a worked SaaS example, Lollypop describes using accordions for secondary help and tabs for order types in Mavic. Apply disclosure where the task gives it a purpose. [Mavic workflow examples](https://lollypop.design/blog/2025/may/saas-ux-design/)
