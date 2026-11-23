# Prompt agents for UI generation and refinement

Layer: **workflow** · Route: `agent-prompting`

**Use when:** Generating an interface, translating a visual reference, planning a broad polish pass, or repairing an agent's unhelpful design iteration.

**Avoid when:** Adding a briefing ceremony to a known one-control defect. A brief user request is enough to start; infer the working brief from the project and state material assumptions.

This module guides how the agent interprets and carries out the request as well as how someone can prompt it. It is not a requirement that users write elaborate prompts. The [research ledger](../generation-research.md) separates empirical findings, vendor advice and this skill's synthesis. Adapt the examples below; do not paste the whole module into every task.

## Establish what kind of output is wanted

| Mode | The prompt should settle | Judge the result by |
| --- | --- | --- |
| New application | Actor, consequential operation, real objects, scope, intended visual direction | A complete representative task and coherent composition |
| Existing-product refinement | Current route/state, problem, preserved strengths, allowed change boundary | Improvement against the same baseline without regressions or identity drift |
| Reference implementation | Which reference is authoritative, viewport/state, permitted adaptation, available assets | Fidelity in the specified dimensions plus actual behavior; do not silently redesign |
| Static concept | Audience, content, composition, deliverable and unspecified interactions | Visible craft with behavioral unknowns explicitly retained |

A sketch or mood board leaves decisions open. A specified reference screen can constrain them. Do not treat either as authority for unseen mobile layouts, inaccessible behavior, or content omitted from the reference. For a functional deliverable, trace the UI to an actual state transition; for a static deliverable, do not pretend the controls work.

## Build the smallest useful working brief

Extract these decisions from user instructions, code, assets and available evidence. Record only what affects this task; unknowns are allowed.

- **Job:** who acts, on what object, in which situation, toward what outcome. Example: a coordinator resolves an unassigned delivery before its cutoff.
- **Priority:** what must be noticed, compared and acted on, in that order. Distinguish the user's objective from the most prominent element in the current screen.
- **Content:** representative records, long labels, meaningful units, assets and ownership of factual copy. Label fixtures as fixtures; never invent customer proof or production metrics to fill space.
- **Interaction boundary:** entry → action → feedback → recovery/return, including what persists and where changes take effect. Say whether data is real, locally simulated, or unavailable.
- **Design constraints:** existing typography, palette, density, component family, platform conventions and authorized scope. Separate these constraints from preferences that can be explored.
- **Evidence and finish:** what can be rendered or operated, scenarios that matter, and the artifact/checks needed to assess completion.

Ask a question only when its answer changes a consequential decision and cannot be recovered from context. Explain the choice it resolves. “Should changes save immediately or on Save?” can change interaction architecture; “What vibe do you want?” usually does not resolve a known toolbar overflow. Progress on independent work while an answer is pending. An unanswered question is not approval to invent a backend, publish, purchase assets or expand scope.

## Make visual intent executable

Translate adjectives into relationships. “Premium” alone is underdetermined; specify which content leads, how supporting information recedes, and what the control family should feel like. For example: “Keep the artwork dominant; give object names a readable track; place rarity with metadata; reserve the strongest status color for achieved progress.” These are design hypotheses to inspect, not universal values.

“Act as a world-class designer” raises the ambition but does not settle a design decision. Translate it into the [composition workflow](compose.md#make-the-direction-concrete): choose a task-specific design thesis, develop its relationships, exercise a consequential transition, and critique the result at whole-screen, working and detail scales. Make a recommendation when evidence is sufficient. Do not simulate expertise with confident adjectives, invented research or a longer process.

### Generate from a field specimen

1. **Pick the image for the decision.** Use the user’s reference first when one is supplied. Otherwise run `node scripts/specimens.mjs --task ROUTE` from the skill directory and open the relevant local frame at working size. Use `--list` for available routes, or choose a neighboring job when the route has no match. A sidebar crop can guide the shell. Choose a separate source for the content plane only if the shell leaves a consequential decision unresolved.
2. **Translate what you see before building.** In the working brief, name the source frame, the region it owns, the visible relationship you will carry over, and the target content that will express it. Read the image at two scales. At screen scale, identify the dominant mass, density changes and reading order. Within the working region, identify the alignment tracks, type contrast, edge treatment or interaction landmark that makes the design recognizable. Decide how those relationships adapt to narrower content. Use local typography and assets, and derive dimensions from the target screen.
3. **Brief the primitive sheet and the composition.** The implementer’s first output is the [designed primitive sheet](compose.md#design-the-primitives-first). Identify which source decisions each relevant primitive carries and which relationships belong to composition. Build the screen from those same definitions. If another model, tool or session produces the design, include the selected images as visual inputs or provide file paths it can actually open. Pass the translation and acceptance check with the brief. A board URL or a designer’s name alone leaves the implementer to guess. When only text is supported, pass a precise visual description and reserve the fidelity judgment for a reviewer with image access.
4. **Compare the first render while it is still cheap to change.** Open the source frame beside the corresponding rendered viewport or region. Trace the same reading order and edges in both. Name the strongest match, any visible drift, and a deliberate departure justified by the new task. If the result has the right colors but the wrong emphasis or proportion, correct the owning layout or type role, render again, and repeat the comparison. For a stateful relationship, also exercise the input or state change. Review the narrow composition in its own right. A source with only a desktop view leaves mobile fidelity unverified.

For example, a conservation studio’s review queue could borrow the column rhythm of Linear’s annotated navigation. Specify that collection icons have one center line, object names share a start edge within each nesting level, and the selected collection stays recognizable beside the active record. On a phone the collection switch can collapse while preserving the selected name. Measure the shared edges on the implementation and visually compare the hierarchy. The reference supplies neither the studio’s copy nor a required sidebar width.

For a source comparison board, run `node scripts/specimens.mjs --id SPECIMEN --candidate rendered.png --out comparison.html`. Use a region crop where the reference shows a detail. Keep the whole viewport available to judge surrounding hierarchy. The board juxtaposes evidence for inspection. It assigns no fidelity score.

### Read the product inside the frame

For a reference implementation, identify what a person would see **inside the product** at the depicted moment. A walkthrough may put a presenter beside two theme previews, annotate a sidebar or line up successive phone screens. Use those surroundings to interpret the evidence. Recreate them only when the requested deliverable includes the presentation itself. Within the product crop, identify the first visible object and what else fits in that view. An invented hero above a depicted artwork changes its priority even if the artwork is accurate farther down the page. Record which panel, state or region you are comparing and bring the implementation to that state before capturing it.

When a busy frame makes that boundary ambiguous, crop the product region and pass it as the primary visual input. Keep the original for attribution and context. In the [paired theme study](../fieldwork/2026-11/atlas.md#pull-up-a-working-reference), compare both product crops at the same section. The artwork leads in each, with short supporting copy beneath it.

If the composition depends on a recognizable subject, choose its asset while designing the primitives. Inspect the subject, crop, texture and overlap at the intended display size. Use available product art, an appropriate local or generated image, or a faithful illustration in the source medium. A CSS ridge can demonstrate overlap while leaving a photographic landscape unresolved. Inspect the actual image on the screen before calling the relationship reproduced. A missing asset belongs in the fidelity findings. Apply this check where imagery carries meaning. Simple geometric controls and abstract marks can use simple geometry.

When multiple frames show the same control, pair each state's label with the **content it represents**. For a feature carousel, advance it and check that each new caption sits under its own demonstration, then reverse and recover the original pair. For a theme switch, inspect what happens to the artwork on the selected surface. If the source only supplies a still, describe the chosen local interaction as an implementation assumption.

For review and editing tasks, exercise the smallest selectable object. Mark one file, open its details and return to check that file and its neighbor. Select a different sentence before applying a proposed edit and inspect both spans. A step indicator or a successful first edit can mask a lost per-item state or a hard-coded target.

Use positive constraints before long prohibition lists. Instead of “no AI slop,” describe the task-specific outcome and accepted examples. A small negative example helps only when paired with its replacement and reason. Familiar system fonts, quiet surfaces, rounded cards or gradients are not defects by themselves. Do not import model-specific bans, mandatory motion counts, or marketing hero rules into an unrelated product.

## Sequence prompts around unresolved decisions

Keep stable guidance in the skill; keep the current brief, approved direction and fixture in task context; keep the next repair prompt focused on the observed defect. Remove superseded decisions from handoffs. Restating a long style manifesto on every turn can bury the relevant correction.

After inspecting the primitive sheet, assemble a representative composition and one complete interaction before expanding across screens. If the layout decision is genuinely open, compare alternatives using the same content and task. Ask for a short decision rationale and tradeoff, not hidden chain-of-thought. Once the direction is chosen, carry its invariants into subsequent edits so each iteration does not restart the design.

Distinguish these checkpoints:

1. **Structure:** can the intended task be completed with the information shown?
2. **Composition:** do emphasis, grouping and density support that task and identity?
3. **Component finish:** do related controls, text roles and states form a coherent family?
4. **Rendered proof:** do the changed relationships and interactions survive the relevant constraints?

These are review lenses, not four mandatory approval stops. A narrow fix can pass through them in one short loop. Reuse the existing application architecture and suitable primitives. Prompting is not a substitute for inspecting version-specific APIs or running the result.

## Give repair prompts an observable target

A useful correction contains **state/location → observation → intended relationship → bounded edit → preserve → verification**. Reuse the main skill's finding format rather than creating another scoring system.

Before critique, verify the intended route, fixture and settled rendering. Check relevant fonts, artwork and hydration; an oversized pre-hydration grid or blurred image placeholder is not evidence of the final composition. Wait for a meaningful readiness condition, not an arbitrary delay alone. Record a blocked asset or tool as a limitation instead of pretending to have seen it.

Resolve task failures and missing content before fine styling. Tie each edit to a shared owner when it repeats. After the edit, recapture the same state and operate the affected control. Keep the previous verified candidate available. Continue when new evidence identifies a consequential defect; stop when the scoped outcome is verified, or report the evidence/access blocker. Higher self-assigned scores and more iterations are not sufficient reasons to replace a successful direction.

A separate evaluator can help when delegation is available and authorized, but is optional. Give it the brief and raw artifacts, not the generator's self-praise or desired verdict. Whether using one agent or several, ground findings in observed behavior and inspect the final artifact. A different role prompt in the same conversation is not an independent evaluation.

## Adaptable prompt examples

### New working interface

> Build a delivery-exception workspace for coordinators who need to find shipments at risk and assign an owner. Show shipment identity, cutoff, exception and owner using the supplied fixture; mark the fixture as demo data. The first useful action is opening an unassigned shipment and assigning it. First render the identity, timestamp, ownership state and action primitives with sample records. Assemble the queue and its detail view from them. Keep the active filter and list position when returning from details. Use a restrained, dense working surface with clear row identity and status; follow this project's existing controls. If queue-plus-detail and separate detail pages have a meaningful tradeoff, compare them briefly on the same records, then implement one. Verify assignment, empty search, failed save with input retained, and the selected shipment on a phone. Report what is functional and what is simulated.

### Existing-product polish

> Refine the collection screen in this checkout. Preserve its palette, artwork, navigation and browsing modes. Find the most consequential hierarchy or legibility problem in the rendered desktop and narrow states, then make a coherent component-level repair. Keep search, selected filters and return position intact through details. Use representative long names; compare matched before/after states and exercise the changed controls. Leave unrelated screens and release work outside this pass.

### Reference-led generation

> Implement the supplied desktop settings reference in the existing app. Treat it as authoritative for hierarchy, alignment and control treatment; use our text, assets and established primitives. Start with a specimen of the actual field, label, validation and action primitives, then compose the form from them. Identify unavailable assets or ambiguous interactions before replacing them. Adapt the layout to narrow containers while retaining labels, errors and save scope. Render the default and invalid states and check keyboard focus. A desktop screenshot does not specify mobile behavior; state the adaptation you chose.

### Targeted iteration

> In the 320px collection capture, the rarity badge takes space from the object name and several names become indistinguishable. Give identity the primary text track and group rarity with supporting metadata. Preserve artwork size, palette, capture actions and the list view. Recheck the same records, a long name, keyboard details/return and a nearby width. Prefer the existing spacing/type roles; report measured results only after rendering.

### Design direction and finish

> The workspace is functional but still feels like a component demo. Inspect its current task and strongest visual relationships. Recommend a design direction in one sentence, then make that direction visible through proportion, hierarchy, content and state treatment. Develop the most consequential relationship before tuning small details. Follow one real action through feedback and return, and test the composition with typical and awkward content at wide and narrow widths. Preserve the product's identity and learned behavior. Show what improved, what tradeoff you accepted and what remains unverified; stop when the scoped design holds together.

For evaluation of these instructions rather than an individual UI, use [generation evaluation](../generation-evaluation.md). No prompt template establishes that usability or visual quality improved without evidence.
