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

Use a small number of concrete references with assigned roles. For each, note the source and state, the relationship to transfer, what must remain native to the product, and what the reference cannot establish. A reference can inform alignment or material without supplying the product's architecture. If several references conflict, choose which controls that decision instead of averaging their appearance.

Provide a whole-screen view for composition and a crop for the specific relationship when useful. Preserve the crop's context, scale and state. Text transcriptions help where copy is hard to read; uncertain text remains uncertain. Exported design metadata can be incomplete or wrong: reconcile it with rendered evidence rather than blindly implementing every coordinate.

Use positive constraints before long prohibition lists. Instead of “no AI slop,” describe the task-specific outcome and accepted examples. A small negative example helps only when paired with its replacement and reason. Familiar system fonts, quiet surfaces, rounded cards or gradients are not defects by themselves. Do not import model-specific bans, mandatory motion counts, or marketing hero rules into an unrelated product.

## Sequence prompts around unresolved decisions

Keep stable guidance in the skill; keep the current brief, approved direction and fixture in task context; keep the next repair prompt focused on the observed defect. Remove superseded decisions from handoffs. Restating a long style manifesto on every turn can bury the relevant correction.

For broad creation, establish a representative composition and one complete interaction before expanding across screens. If the layout decision is genuinely open, compare alternatives using the same content and task. Ask for a short decision rationale and tradeoff, not hidden chain-of-thought. Once the direction is chosen, carry its invariants into subsequent edits so each iteration does not restart the design.

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

> Build a delivery-exception workspace for coordinators who need to find shipments at risk and assign an owner. Show shipment identity, cutoff, exception and owner using the supplied fixture; mark the fixture as demo data. The first useful action is opening an unassigned shipment and assigning it. Keep the active filter and list position when returning from details. Use a restrained, dense working surface with clear row identity and status; follow this project's existing controls. If queue-plus-detail and separate detail pages have a meaningful tradeoff, compare them briefly on the same records, then implement one. Verify assignment, empty search, failed save with input retained, and the selected shipment on a phone. Report what is functional and what is simulated.

### Existing-product polish

> Refine the collection screen in this checkout. Preserve its palette, artwork, navigation and browsing modes. Find the most consequential hierarchy or legibility problem in the rendered desktop and narrow states, then make a coherent component-level repair. Keep search, selected filters and return position intact through details. Use representative long names; compare matched before/after states and exercise the changed controls. Leave unrelated screens and release work outside this pass.

### Reference-led generation

> Implement the supplied desktop settings reference in the existing app. Treat it as authoritative for hierarchy, alignment and control treatment; use our text, assets and established primitives. Identify unavailable assets or ambiguous interactions before replacing them. Adapt the layout to narrow containers while retaining labels, errors and save scope. Render the default and invalid states and check keyboard focus. A desktop screenshot does not specify mobile behavior; state the adaptation you chose.

### Targeted iteration

> In the 320px collection capture, the rarity badge takes space from the object name and several names become indistinguishable. Give identity the primary text track and group rarity with supporting metadata. Preserve artwork size, palette, capture actions and the list view. Recheck the same records, a long name, keyboard details/return and a nearby width. Prefer the existing spacing/type roles; report measured results only after rendering.

### Design direction and finish

> The workspace is functional but still feels like a component demo. Inspect its current task and strongest visual relationships. Recommend a design direction in one sentence, then make that direction visible through proportion, hierarchy, content and state treatment. Develop the most consequential relationship before tuning small details. Follow one real action through feedback and return, and test the composition with typical and awkward content at wide and narrow widths. Preserve the product's identity and learned behavior. Show what improved, what tradeoff you accepted and what remains unverified; stop when the scoped design holds together.

For evaluation of these instructions rather than an individual UI, use [generation evaluation](../generation-evaluation.md). No prompt template establishes that usability or visual quality improved without evidence.
