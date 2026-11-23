---
name: ui-harmony
description: Design and refine interfaces through a full UX workflow and an Atomic Design router from screen idioms to primitives. Start each generation with designed primitives and compose them into screens. Default to modern SaaS minimalism, and preserve visual identity with research-backed critique, rendered measurements, semantic review, and regression checks. Use when creating or refining interfaces, reviewing screenshots, or diagnosing inconsistent, awkward, cluttered, sterile, or generic AI-generated UI. Provides browser audit and comparison tools; adapts to native and screenshot-only reviews without claiming unavailable measurements.
---

# UI Harmony

Make the interface feel considered: clear relationships, purposeful contrast, appropriate density, distinctive character, and predictable behavior. Consistency serves understanding; variation serves hierarchy and personality. For this user, favor modern SaaS minimalism: restrained surfaces, typography-led hierarchy, useful density and precise controls. Keep this explicit taste preference separate from universal UX quality.

## Begin every generation with designed primitives

For this user's new web examples and generation trials, start in **React with Base UI**. Create the shared design system before authoring the example screens. Render a working specimen of its typography, surfaces, controls and states with the actual React components. Inspect it at reading size, then import those same components into every example. A batch can share one system and extend it for individual references. Tailwind CSS 4 `@theme` is a supported way to own font, color, space and shape tokens. Follow a specified medium or host system for other tasks. [React build sequence](references/foundations/headless-react.md#build-and-inspect-the-system-before-the-screen)

Use **Lucide** for interface icons in new web work. In React, import the named icons from `lucide-react` for navigation, actions, disclosures and status indicators. Set size and stroke in the design system and inspect them next to real text. Give icon-only controls an accessible name. Preserve product logos, illustrations and chart artwork when reproducing a reference.

Use **Inter** as this user’s default sans-serif for new interfaces. Honor a typeface specified by the brief or established by the host product. For a reference recreation, use its identifiable face when fidelity calls for it. Set representative copy at its intended size, weight, tracking, measure and leading on the specimen. Load the chosen face and confirm which font actually paints the text. For visual acceptance, compare the source and rendered screen before inspecting interaction results. State what looks convincing, the largest aesthetic mismatch, and the disposition. [Visual review criteria](references/design-review.md#make-an-aesthetic-judgment)

Make the first design artifact a small **primitive sheet** for the requested interface. Read the brief and source images to decide what belongs on it. Design the actual type roles, surfaces, control parts and states the task uses, with representative content. Render and inspect them together before composing a screen. In an existing system, instantiate its real primitives and design only the missing roles. A static concept uses a specimen frame and component instances or styles in its design medium.

**Compose from those same definitions.** Combine primitives into rows, groups or other components, then arrange those into the working page. Let composition own placement and responsive reflow. When the whole view exposes a weak primitive, revise its owner and inspect both the sheet and the page again. Keep the sheet in a local preview, design frame or existing component workbench. The [composition guide](references/workflow/compose.md#design-the-primitives-first) shows what to put on it and how to verify reuse.

For an interactive product, ground the sheet in one decision a practitioner makes. Show the object before the decision, the control at the point of work, and the resulting change to that object. Use that relationship to choose the layout. [Test the consequence](references/workflow/compose.md#test-the-consequence-of-an-edit) when developing or revising the working screen.

## Apply the preferred visual direction

For new designs and substantial refinements, load [modern SaaS minimalism](references/preferences/modern-saas.md) and its primary aesthetic anchor, [Untitled UI](references/preferences/untitled-ui.md). The target is carefully finished composition, typography, controls and states; familiar neutral forms can be excellent. Study specific screens and component relationships rather than imitating a brand name. It routes the preference from screen idioms down to primitives. A later brief overrides it; a scoped repair retains the surrounding identity. Prefer calm working surfaces over decorative card walls, without sacrificing labels, readability, meaningful color or useful density.

For a new design or broad refinement, use the [source-to-render workflow](references/workflow/agent-prompting.md#generate-from-a-field-specimen). Select a task-relevant image from the [field atlas](references/fieldwork/2026-11/atlas.md), carry its visible relationships into the build brief, then compare the rendered design with the source. A supplied reference or the host product can take precedence. The atlas works offline. From the skill directory, `node scripts/specimens.mjs --list` lists the available tasks and frames are returned by `--id SPECIMEN`.

When recreating a depicted interface, identify the product region inside the screenshot or reel. Preserve the artwork and content that give that region its identity. When a source shows multiple states, operate the control and compare the changed object with its corresponding frame. See [interpreting framed and multi-state references](references/workflow/agent-prompting.md#read-the-product-inside-the-frame).

In a working study, give a visible per-item control its own input target and state. If a review row supports both opening a file and marking it reviewed, exercise both actions on the same file and verify its mark after returning. A checkbox drawn inside the row’s open button cannot perform the second action.

Judge the result in its own right as well as against the source. Describe atmosphere, focal order, typography, color, composition, material, density, consistency and observed motion; name what works, the largest remaining mismatch, and the best correction or tradeoff. Use [source-relative appearance evidence](references/tools.md#source-relative-appearance-studies) to inform that judgment, not replace it with a numeric quality score. Report task and accessibility findings independently.

## Start with the design problem

Before prescribing values, establish from the request and existing product:

- Who is doing what, under which constraints? Distinguish reading, comparison, monitoring, editing, exploration, and persuasion.
- What should people notice, understand, and do? Write the intended priority order independently of what currently looks prominent.
- Which existing qualities must survive? Identify specific typography, color relationships, imagery, density, component language, or motion. State where deliberate variation earns its place.
- What evidence is available: implementation, live browser, design file, native app, screenshots, or actual user research?

Infer reasonable context and label assumptions; ask only when the answer changes the design decision. Do not convert a request for polish into a rebrand or unrelated product redesign.

## Route the work

Use [router.md](references/router.md) to select a task-specific route before applying generic visual rules. The hierarchy is **atoms → molecules → organisms → templates → pages**, with foundations beneath and the designer workflow alongside. These levels guide diagnosis in any order. The primitives-first build order applies to generation in any framework. Templates encode screen idioms; pages bind them to actual content and state.

For broad work, route by the dominant task (monitor, analyze, browse, compare, edit, read, commit, converse), then follow only relevant child decisions. For a small repair, enter at its atom/molecule and consult parent constraints only as needed. Add scoped secondary branches for hybrid screens. Use `specialist` when the catalog lacks the dominant interaction. Never load every reference or equate a valid route with a good design.

For fragile web layouts, use [Andy Bell’s resilient composition guidance](references/foundations/resilient-css.md), which connects CUBE CSS ownership to content/container stress checks without requiring a framework migration.

The dependency-free `scripts/route.mjs` supports `list`, `show ID`, `path ID ...`, `check`, and `plan FILE.json`. It returns exact references, discriminants and conditional next steps; it does not pretend to classify design intent automatically. Workflow modules cover framing, task/information structure, alternatives, composition, evaluation and handoff. Choose activities by unresolved uncertainty and stop when the requested work is verified.

Read [design-review.md](references/design-review.md) for composition and semantic diagnosis. Read [measurement-rules.md](references/measurement-rules.md) before assigning numerical targets. The [research ledger](references/research.md) links primary articles, named practitioners, standards, conflicting advice, and research limitations; consult the relevant entries when defending a recommendation.

## Choose evidence appropriate to the surface

**Rendered web:** Use the existing project's browser tools where practical, or the bundled audit tools in [tools.md](references/tools.md). They capture screenshots, computed styles, scoped contracts, geometry candidates, and axe results. For a relationship that must survive input, run a [state study](references/state-study.md) with meaningful checkpoints and a product-specific failure condition. Inspect the actual screenshots and operate relevant interactions. A successful script is not a design approval.

**Screenshot or design file:** Review composition, priority, grouping, optical balance, typography, color roles, imagery, and visible states. Use pixel coordinates only as image coordinates unless scale is known. Mark hit area, actual contrast, keyboard, reflow, responsiveness, and behavior unverified. Do not fabricate DOM measurements from a raster image. Request another artifact only if needed for a decision.

**Native:** Use native inspection and platform conventions; apply the same semantic review. Measure in platform units and test large text, safe areas, actual input modalities, and state changes. Bundled DOM scripts do not audit SwiftUI, canvas, or native accessibility trees. Do not convert Apple points, Android dp, or screenshot pixels into CSS pixels without evidence.

## Create and develop a direction

For broad design work, use the [composition decisions](references/workflow/compose.md#make-the-direction-concrete) to turn the intended experience into a visible hierarchy, useful density and a coherent interaction. Commit to a direction with a clear reason; keep it open to contrary evidence. Distinguish an interface that is merely consistent from one whose proportions, content and behavior are deliberately composed. Express character through the product's own material and task, without requiring novelty or decoration.

For new interfaces and broad polish requests, follow the [anchor generation path](references/preferences/untitled-ui.md#a-generation-path-that-reaches-beyond-a-clean-draft): state the intended experience, study task-relevant references, explore unresolved visual choices even when the screen idiom is fixed, develop a complete state/interaction, and refine the rendered result. Use meaningful content and coordinated component families. For React, consult [headless primitives](references/foundations/headless-react.md): recommend Base UI for new interaction-heavy work, or retain the project’s existing suitable primitives. Retain the host product identity. The absence of defects does not establish visual craft.

For generation, reference implementation, broad polish, or an unproductive agent iteration, use [agent prompting](references/workflow/agent-prompting.md): turn the available context into a compact working brief, assign roles to references, preserve the chosen direction, and request evidence-backed corrections. Infer the brief rather than requiring the user to supply a prompt template. Keep actual interaction checks separate from visual preference; retain the best verified candidate when later iterations regress. The [generation research](references/generation-research.md) explains where vendor advice and benchmark findings apply—and where they do not.

For a narrow defect, use the repair loop below without requiring an art-direction exercise.

## Review and improve

1. **Capture a baseline.** Record route, state, viewport, theme, content fixture, input mode, and loading readiness. Include representative content, not only ideal short strings. Preserve strengths explicitly.
2. **Challenge the structure.** Is the chosen pattern suitable for the task? A perfect card grid may be wrong for exact comparison. Can the visual priority be explained by user importance? If not, fix structure before polishing tokens.
3. **Inspect relationships.** Work from whole composition to groups to details. Check emphasis, grouping, rhythm, alignment, type, color, icon/shape language, imagery, content, state, and motion. For placement or optical defects, use [physical and optical alignment](references/foundations/optical-alignment.md): establish the container/group reference before adjusting glyphs. Verify optical balance separately from bounding boxes with the [measurement and judgment workflow](references/optical-workflow.md). Run the [quiet-content pass](references/foundations/quiet-content.md): remove redundant explanations and framing while retaining task context, labels and truthful feedback.
4. **Measure justified contracts.** Derive values from the existing system. Group only equivalent component roles, variants, and states. Each contract needs a rationale: the intended relationship and user benefit. Passing a self-authored contract proves agreement with that contract, not that the contract is good. Change or exempt a mistaken contract with reasons.
5. **Prioritize by consequence.** Repair blocked tasks, lost content, deceptive signals, and accessibility barriers before cosmetic drift. Cluster repeated instances by owning token/component instead of proposing dozens of one-off adjustments.
6. **Make the smallest coherent correction.** Preserve intentional asymmetry, expressive type, useful density, and brand colors. Avoid fixing symptoms with arbitrary offsets, forced heights, smaller text, or hidden overflow. When alternatives have real tradeoffs, compare them and explain the choice.
7. **Verify the whole result.** Re-capture the same scenarios and test the changed interaction. Check adjacent breakpoints, long content, keyboard/focus, relevant empty/loading/error states, themes, text growth, and reduced motion. Compare measurements and visual evidence. Did the repair improve clarity while weakening character, adding scrolling, or flattening hierarchy?

Scale the depth to the work. One awkward button does not require a full product audit. For a broad quality review, use the scenario matrix and anchored rubric in [evaluation.md](references/evaluation.md).

## Calibrate the critique

When testing this skill or learning from established interfaces, use [reference calibration](references/conditions/reference-calibration.md). Compare concrete tasks and current versions, preserve successful relationships, and challenge both reputation bias and indiscriminate modernization. A respected design can have accessibility defects; a criticized one can still support a task. Grouped automated counts are not a cross-site quality ranking.

## Deliver actionable feedback

When useful, name the owning route/component so fixes occur at the right level; `review.mjs` accepts optional `ownerRoute` and `routePath`.

Each material finding must explain:

**Evidence → intended relationship → user consequence → proposed change → what to preserve → verification.**

Include location/state, observed and target values with units when measured, threshold provenance, severity, confidence, and an exception or alternative worth considering. Distinguish observation from inference. For example:

> In the phone error state, the email help text is 20px from its input and 8px from the next field. This visually attaches it to the wrong group. Use this form's existing 8px internal / 24px between-field spacing; preserve its compact input height. Recheck wrapped help and error text at 320px. These values are local design decisions, not WCAG requirements.

Do not reduce visual quality to a numeric score, or claim predicted conversion gains, inferred eye tracking, or validated usability from static inspection. Report numerical facts, anchored qualitative judgments, coverage, and remaining uncertainty separately. The optional structured review template and validator require evidence fields; they cannot verify the evidence or validate the judgment itself.

Use [tools.md](references/tools.md) for setup, outputs, limitations, comparison, and CI semantics. A finished review states what was verified and what remains untested. For narrow repairs, stop once requested defects are resolved and scoped regression checks pass. For broad creation or refinement, also show the chosen visual direction and evidence of a considered composition, relevant component states and responsive treatment; disclose unresolved craft or behavior. Do not endlessly normalize intentional differences.
