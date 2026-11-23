# Compose the interaction and visual system

Layer: **workflow** · Route: `compose`

**Use when:** Structure is plausible and needs coherent behavior and appearance.

**Avoid when:** Polishing a structure already known to fail the task.

## Design the primitives first

Before laying out a new screen, make a compact sheet in the delivery medium. Use real component instances or shared type and surface styles. A web build can use an existing story or temporary preview, a design file can use a component frame, and native work can use platform previews. If rendering is unavailable, author the definitions and specimen first, proceed with composition, and report that the visual check is outstanding.

For standalone HTML studies, a shared local stylesheet or render function can serve both the sheet and the page. Inspect one distinctive primitive in both places. A generic swatch on the sheet and a separately drawn avatar on the page leave the actual portrait and status-ring relationship untested. For a toolbar, inspect the real glyph family at control size, including stroke and optical weight.

| Decide on the sheet | Example of a useful specimen | What the composition owns |
| --- | --- | --- |
| Type and tone | A real object name beside a quiet metadata label and tabular value. For a publication, set the actual title, standfirst, body and caption. | Reading order, column measure and the space between groups |
| Shape, surface and emphasis | Put the actual selected mark on its surface next to the resting one. Check the edge, label and accent together. | Which object is selected, and how that group sits beside the main task |
| Operable elements | Show each required control with its real label, relevant active/focus states, and a representative awkward value. Reuse an existing primitive where it fits. | Action scope, focus flow, feedback and position at narrow widths |
| Domain-specific visual parts | Design a waveform, folio, glyph or swatch when it helps the task. Show it at its intended working size. | How the part combines with labels, controls or neighboring content |

Use only rows that apply. A printed essay might need four type roles, a rule, an image treatment and a reading link. A review queue might need a recording label, timestamp, selection mark and approval action. Give each part an owner in the implementation: a component, CSS role, platform style or library instance. The stage is complete when those parts can be inspected with real content and instantiated in the composition. A list of token names alone cannot show how the parts sit together.

Build a representative group from these owners before repeating it through the page. For verification, trace a distinctive part from the sheet to its consumer. Compare them in the same variant and state, including a rendered property that should agree. Allow differences in available width, wrapping, placement and inherited theme when the composition calls for them. If a consumer needs a new variant, define and inspect it at the owner first. Keep preview controls and labels outside the user’s production UI.

## Make the direction concrete

Choose the template by dominant task, then only the organisms, molecules and atoms needed. Use existing system roles first. Design the whole and the parts together; a beautiful button cannot rescue a misleading priority order.

Form a short design thesis linking experience to composition: “An artwork-led collection: imagery carries recognition, names anchor scanning, and capture controls stay quiet until needed.” Then identify the choices that make it visible: image-to-text proportion, stable identity track, separation of metadata, and discoverable action states across input modes. “Clean, premium, modern” is not a sufficient thesis. This is a working decision, not extra marketing copy to put in the interface.

For an established product, develop its strongest existing relationship. For a new product, derive character from its subject, language, imagery and recurring operation. Expressive typography or dramatic contrast may be appropriate to an editorial surface; precise columns and immediate feedback may supply the character of an operations tool. Do not invent a signature flourish merely to satisfy a distinctiveness requirement.

## Compose attention, space and content together

| Decision | Work to do | Inspect the consequence |
| --- | --- | --- |
| Attention | Establish entry point, next useful information and relevant action within each decision group. Reduce competing signals before adding emphasis. | The main task remains clear when a warning, selection or expanded detail appears. A global rule of one primary button per screen cannot resolve local action scope. |
| Proportion | Allocate space by reading, comparison, editing or image-recognition needs. Set meaningful alignment tracks. | Long identity text, units and actual imagery fit without being sacrificed to equal-width columns or decorative symmetry. |
| Rhythm | Distinguish within-object, between-object and between-section spacing. Let density change where the task changes. | A dense list can sit beside a more spacious editor without losing their relationship. Repeated tasks do not require excessive scrolling. |
| Emphasis | Coordinate type, color, enclosure and position so they reinforce roles. | Status, selection and primary action remain distinguishable; every label does not demand its own badge or container. |
| Restraint | Remove a cue only after identifying what carries its meaning afterward. | Less framing still leaves groups and controls discoverable. More whitespace does not detach labels from their values. |

Treat these as connected choices. If a layout feels weak, identify the dominant cause and change that relationship first. Increasing radius, blur, shadow and font size together can obscure which change helped. Once the relationship works, propagate the decision through equivalent components. Tokens encode repeated decisions after their role is understood; do not force every value onto a scale prematurely.

Use typical content to establish the intended rhythm, then stretch it with awkward content. Typeset the actual words: deliberate wraps, column alignment, value/unit relationships and image crops are design work. A manually balanced title that breaks with localization or dynamic content needs a resilient rule, not an invisible overflow patch. Follow [quiet content](../foundations/quiet-content.md) when removing redundant language.

## Design the experience between frames

Choose a consequential interaction and follow **intent → response → commitment → recovery → continuation**. At each transition, decide what stays visible, what changes, where focus goes and how the person knows the outcome. Keep object identity and action scope understandable as the layout changes.

For example, assigning an owner may change the record's position in a filtered queue. Decide how confirmation and the next useful task remain available when the row disappears. An attractive success toast alone does not settle that behavior. Reuse established product semantics; do not silently alter persistence or introduce optimistic success without a credible failure path.

Evaluate immediate response separately from completion: a pressed or pending state can acknowledge input while work continues. Preserve input and control geometry when useful; avoid moving a target under the pointer or forcing a person to wait for decorative animation. For frequent actions, try repeated, interrupted and reversed use. Motion earns its place by communicating a transition or the intended character, and must preserve meaning under reduced motion. A static concept can specify these choices but cannot verify them.

### Test the consequence of an edit

For an editor or workbench, take a small, known fixture. Predict the downstream result of one meaningful decision before implementing it. Name a nearby object that should stay the same. Let a person make the decision, inspect its consequences in context, and recover or continue as the task calls for. Use the [state-study runner](../state-study.md) or an existing browser test to compare the actual object and its visible representation against that prediction. A toast can acknowledge the edit. The evidence lives in the changed work.

In a weaving draft, removing a tie affects every crossing that uses both its shaft and its treadle. A miniature fixture can predict the exact affected coordinates. Keep those crossings readable alongside the tie, trace one back to its inputs, and check that undo restores the original drawdown. A preset picker and a recolored image would miss that decision.

When an interaction feels shallow, revisit what the user can accomplish with the underlying object. Compare two placements of the decision and its consequence if their relationship is hard to see. Keep the version that lets someone inspect or act with less reconstruction. On a reading surface, follow the reader’s actual purpose, such as comparing passages or returning to a cited figure, only when the brief calls for it.

## Behavior and adaptation

Compose loading, empty, error and permission cases alongside the happy path. Inspect narrow layout and large text early. Responsive changes may alter the idiom, such as detail panel becoming a dedicated page.

Make adaptation a priority decision: which relationships must remain adjacent, which supporting content can move, and what access replaces a collapsed region? Recheck the reading and focus order after recomposition. Do not treat hiding content or stacking desktop panels as sufficient responsive design. In an existing app, preserve learned locations unless a demonstrated constraint warrants changing them.

## Finish at three scales

- **Whole composition:** inspect mass, dominant alignment, content width and pacing. Does the screen express the intended task and character, or merely fill a grid?
- **Working scale:** read actual text and complete the chosen task at normal display size. Do identity, status, action scope and recovery remain clear without an explanation from the designer?
- **Detail:** compare the relevant component family in its real states: optical weight, baselines, edge treatment, focus, loading replacements and awkward wraps. Magnification helps diagnosis; accept the result at normal scale too.

Move between these scales when necessary. Do not polish every icon while the content model is still wrong. Once the composition works, stop redesigning it to chase a new visual idea and resolve the remaining local craft gap.

## Evidence and repair

For scoped repairs, exit when representative content/states explain themselves, the primary task is visible and changed relationships are verified. For creation or broad polish, also substantiate the chosen visual direction: inspect the whole composition, refine its relevant component family and develop a consequential state transition where interaction is in scope. Use the [Untitled UI anchor](../preferences/untitled-ui.md) for this user’s SaaS aesthetic. A functioning scaffold or high preference score alone is insufficient evidence of craft. Audit optical alignment as well as rectangles, preserve identity strengths and disclose untested states.

**Worked decision:** A vivid editorial heading has intentional tight tracking; only the word boundary is unclear. Increase that boundary rather than replacing the typeface or applying a global spacing reset.

**Source boundary:** [Brad Frost, Atomic Design](https://atomicdesign.bradfrost.com/chapter-2/) supports concurrent whole/part thinking. This catalog’s route boundaries are an applied synthesis, not Frost’s prescribed taxonomy.

The design thesis, decision table and review scales are this skill's practitioner synthesis, not experimentally validated rules. [Linear's redesign account](https://linear.app/now/how-we-redesigned-the-linear-ui) informs whole-view and state stress checks; [Rauno Freiberg's interaction observations](https://rauno.me/craft/interaction-design) inform continuity and interruption. Neither source establishes a universal layout, aesthetic or timing prescription. See the [existing source ledger](../preferences/modern-saas-research.md) for scope and limits.

## Related context

- [Bind templates to actual pages and states](../pages/page-instance.md) — Test the composition with real content
- [Prototype, inspect and learn](evaluate.md) — Inspect the composed result

## Flexible implementation

[Resilient composition and CSS ownership](../foundations/resilient-css.md) applies Andy Bell’s CUBE CSS and browser-oriented design principles when content, containers or overrides expose fragile rules.

For React generation, [headless primitives](../foundations/headless-react.md) can supply complex control behavior while the application owns its visual family. Recommend Base UI for a new suitable project; retain established primitives where appropriate.
