# Untitled UI: an anchor for finished SaaS interfaces

Layer: **conditions** · Route: `untitled-ui`

**Use when:** Creating or substantially refining this user's SaaS interface, especially when a coherent draft still feels basic. Untitled UI is the primary aesthetic anchor; Vercel, shadcn, Cloudflare and Apple supply complementary lessons.

**Avoid when:** A different brief or existing identity determines the direction, or an isolated defect needs repair. This preference does not require adopting a library, copying a product, purchasing assets or making every screen resemble a dashboard.

Read only the relevant level below. [Evidence and source ledger](untitled-ui-evidence.md) distinguishes inspected pixels, measured CSS, code, practitioner advice and unverified behavior.

## The target: familiar forms with deliberate finish

Aim for composed working surfaces, readable neutral typography, softly articulated controls, controlled accents, and content that makes the application credible. Finish comes from coordinated relationships: a label's weight against its value, an icon's apparent size against its text, a control edge against the surrounding plane, or section spacing against row spacing. A novel logo, colorful rail, extra animation or more rounded cards is not required.

Preserve useful visual richness. Avatars can identify people; previews can identify content; charts can explain change; status can make a record actionable. Use these when the domain supplies them. Do not invent irrelevant metrics, stock-photo panels, fictitious people or charts to occupy whitespace. A text-only operational table can meet this direction through exceptional typography, grouping and state treatment.

## Route from the screen to the detail

| Work | Enter / continue | Concrete decision to develop |
| --- | --- | --- |
| Settings, profile, billing | `settings` → `form-section` → `field` | Organize section explanation and editable values into stable tracks; define the commit scope. On narrow screens place labels with their controls and keep actions reachable. Do not shrink a desktop two-column form into illegibility. |
| Team, customers, records | `collection` → `collection-region` → `card-row` | Keep identity and supporting metadata perceptually together; assign widths by content and comparison task. Align comparable status/roles; distinguish row navigation, selection and row actions. Choose one coherent table boundary when it helps. |
| Analytics | `analytics` → `data-viz` / `metric` | Develop a deliberate relationship between the main measure, its trend, scope controls and supporting comparisons. Distinguish summary from explanation; never add equal KPI cards by habit. Preserve units and meaningful axes. |
| Record plus conversation | `record-detail` + scoped `conversation` branch | Give the object and discussion distinct but related planes. Keep attachments, authorship and context together; provide a coherent narrow-screen alternative. Do not copy a messaging sidebar when the product has no conversation task. |
| Repeated work on a domain object | `structure` → `workspace` → `workbench` | Derive regions from the repeated operation and context that must remain visible. Keep selection, draft and return behavior coherent; do not prescribe panes before identifying their job. |
| Media, spatial or otherwise specialist work | `structure` → `specialist` → relevant primitives | Identify missing domain mechanics and research them explicitly. General spacing and contrast checks cannot validate playback, temporal selection or spatial operations. |
| Shell and navigation | `app-shell` → relevant navigation route | Coordinate sidebar width, content inset, active treatment and account context. A collapsed shell needs an operable replacement. Brand continuity must survive the narrow layout. |
| Fields and actions | `field` / `button-link` / `choice` | Coordinate type, icon, padding, border, material and states as a family. Use the existing project's mature primitives when available; inspect their defaults before replacing them with a rough approximation. |
| Visual finish | `typography`, `spacing`, `surface`, `image-icon` | Tune optical balance and surface definition in context at actual size, then check the full composition. Token consistency alone is insufficient. |

These are conditional branches, not one mandatory reading chain. Atomic Design connects whole and part decisions concurrently. The anchor guides appearance; the task route still decides the screen idiom.

For React implementation, [headless primitives](../foundations/headless-react.md) recommends Base UI where a behavior foundation is needed. Keep visual authorship and task verification with the application.

## What to take from the references

**Composition and pacing.** Use clear shared alignment tracks and varying gaps that encode relationships. A section heading, its explanation and its fields belong together; sections need a different rhythm from rows. Whitespace should frame useful content. Assess whether long horizontal distances detach identity from status, and whether a narrow layout merely postpones the user's primary task far below the fold. Do not optimize a generic content-density percentage.

**Typography.** Develop roles rather than a list of font sizes: page identification, section identification, object identity, editable value, supporting context and metadata. Judge size, weight, line-height and color together. Preserve readable secondary text. A modest page title can coexist with a larger main metric because the measure is the work. Choose a different hierarchy for a reading or marketing surface.

**Control material.** A restrained interface can use a fine edge, subtle external shadow and inset highlight to make a button feel tactile. Ordinary controls can have material definition without pretending to float like a dialog. Keep the treatment subordinate to actual overlay layers and coordinated across siblings. Do not translate “minimal” into removing every shadow, border or gradient. Conversely, a shallow control highlight does not justify a glowing card wall.

**Optical detail.** Compare icons by apparent weight and alignment, not only equal bounding boxes. Check leading/trailing spacing, icon-only controls, text baseline, nested radii and selected/hover/focus treatment. A badge's shape need not equal an input's radius: their roles differ. For joined controls, identify the owner of the outer silhouette, internal seams and focus layer. Test relevant combinations such as icon/no-icon, loading replacement, invalid+focus, selection+focus and long value+trailing affordance; isolated resting states miss these defects. Inspect at normal scale before magnifying. Intentional optical corrections are local system decisions, not unexplained one-off nudges.

**Content and state.** Pair identity with useful secondary information. Use real domain language and representative long/empty/unusual values. Distinguish selection from hover, validation from disabled, and loading from empty. Inspect a full meaningful interaction where scope permits: find → inspect → act → feedback/recovery → resume. Immediate response and preserved context can provide the desired satisfaction without animation.

**Responsive composition.** Reconsider tracks, label placement, navigation and action grouping. Preserve access to task-critical data when columns collapse. A select replacing tabs is an option when it preserves understandable category navigation, not a universal responsive rule. Retain errors, helper text and recovery at increased text size. Apply [resilient composition](../foundations/resilient-css.md) instead of copying screenshot widths.

## Bespoke applications: transfer craft, derive the product

For this user, prefer original applications built around their own object model and consequential task. A reference supplies qualities to study—type hierarchy, optical spacing, material definition, useful density and state continuity—not an existing surface to reproduce. State the domain relationship that drives the architecture before choosing a shell: evidence linked to a finding, a timecoded note linked to playback, or a review decision linked to a revision. Use familiar idioms where they fit; originality does not require inventing unfamiliar controls.

Make this decision trace concrete before choosing the screen: **domain relationship → repeated operation → context that must remain visible → commitment/recovery → idiom and primitives**. Continue through [task structure](../workflow/structure.md), then [workspace](../templates/workspace.md) and [workbench](../organisms/workbench.md) when persistent editing context is needed. Use [specialist](../templates/specialist.md) when media, time, spatial or other mechanics exceed the catalog. A single focused view may fit better than multiple panes.

Do not make every brief a renamed analytics dashboard or team table. Develop the task-specific composition and interaction first, then apply the reference’s level of finish to its primitives. When comparing with the anchor, explain intentional architectural differences and compare corresponding relationships/states rather than overall pixel similarity.

## A generation path that reaches beyond a clean draft

Use this for broad creation or polish, proportionally to the unresolved decisions. Keep the existing repair loop for narrow fixes.

1. **State the intended experience and task.** Example: “A calm team directory where identity is easy to scan, permissions are clear, and inviting someone gives immediate, recoverable feedback.” This is an intention, not a claim about measured user emotion.
2. **Select concrete references.** Usually one relevant full screen, one component/state example, and a responsive or contrasting example suffice. Record the exact source, useful relationship and feature that does not fit this product. Prefer the live implementation alongside Dribbble shots. Use [the ledger](untitled-ui-evidence.md) as a starting set; fetch current evidence when exact implementation matters.
3. **Explore the unresolved visual decision.** Even with the same table/form idiom, compare meaningful arrangements of emphasis, content width, density, material or contextual detail. Hold the content and task fixed. Two small rendered alternatives are useful when genuinely uncertain; do not force variants of an already successful design or substitute a palette swap for composition.
4. **Develop one direction through a complete state.** Establish the whole-screen rhythm, then finish the relevant component family and one consequential interaction. Use realistic content. For a static deliverable specify the missing states and mark them unverified rather than inventing a working result.
5. **Review against the anchor at matched scale.** Compare the actual application crop, not a zoomed browser mockup against an unframed screenshot. Inspect desktop/narrow composition, type relationships, surface detail and state continuity. Record the biggest remaining craft gap and make one purposeful revision where supported.
6. **Stop against explicit scope.** State what makes the result considered, show the relevant rendered evidence, and pass scoped task/accessibility checks. An agreed direction can be deliberately plain. If reference access or behavior evidence is missing, finish the available work with those limits; do not invent proof or loop indefinitely.

## Numerical and semantic feedback that changes the design

Use numbers to locate a decision and check a proposed contract. Use semantic reasoning to decide whether that contract helps. Do not use distances, shadow counts, font counts or brand similarity as proxies for delight.

| Review level | Useful measurement | Required interpretation |
| --- | --- | --- |
| Screen | Content/rail widths, alignment tracks, actual location of the main task at each viewport | Does the composition support the work? Is empty space framing content or separating related values? |
| Section | Internal and inter-section gaps, label/control track alignment | Are relationships legible? Does changing the gap weaken another grouping? |
| Type | Computed family, size, weight, line-height and color by role | Does emphasis match meaning, including real long text? A matched size is not proof of readable hierarchy. |
| Control | Visual and hit bounds separately, padding, radius, icon size, focus ring and state changes | Does the control feel clear and coordinated, remain operable, and retain its footprint during loading? |
| Interaction | Actual focus destination, open/closed state, preserved selection/input/scroll and recovery outcome | Does feedback maintain context and control? A focus probe alone does not prove an end-to-end task. |

Example feedback for a hypothetical local design: “The two 40px controls use different icon scales (16px and 24px), making the secondary action visually heavier. Compare a 20px common optical family while preserving their distinct fill priorities and hit areas; inspect at normal scale and recheck focus/loading.” These values are an authored comparison proposal, not measurements from Untitled UI or a universal prescription.

For a polished-looking but incomplete design, report the visual strength and the behavioral gap separately. For a functioning but basic design, identify the positive relationship to develop: “Separate identity and metadata type roles and bring status into a stable nearby column” is more actionable than “add personality.”

Keep **style fit**, **task/accessibility evidence**, and **craft judgment** separate. The existing scorer can validate records and calculate the declared preference; it cannot inspect taste or establish excellence. A high style-fit result is never the generation stopping rule. Use a short evidence-backed craft verdict (developed / unresolved / unverified) with reasons and the next concrete improvement, without manufacturing a new delight percentage. Write this verdict alongside the structured review; it is a narrative judgment, not a new field in the style-score schema.

## Reference boundaries

Untitled UI supplies a visual vocabulary and useful public implementation examples. A Dribbble shot proves only its visible composition; staged crops, lorem ipsum and selected states conceal production constraints. Library demos may have mock actions or accessibility defects. Neither popularity nor an official component library guarantees product suitability. Preserve task checks and independent criticism.

Study public references and link to them. Use source code/assets only under their actual license; a publicly visible paid template is not permission to redistribute it. This skill's prose transfers design relationships and does not bundle third-party images, logos or template code.
