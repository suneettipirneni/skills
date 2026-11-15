---
name: ui-harmony
description: Design and refine interfaces through a full UX workflow and an Atomic Design router from screen idioms to primitives. Default to modern SaaS minimalism, with explicit style-fit scoring, and preserve visual identity with research-backed critique, rendered measurements, semantic review, and regression checks. Use when creating or refining interfaces, reviewing screenshots, or diagnosing inconsistent, awkward, cluttered, sterile, or generic AI-generated UI. Provides browser audit and comparison tools; adapts to native and screenshot-only reviews without claiming unavailable measurements.
---

# UI Harmony

Make the interface feel considered: clear relationships, purposeful contrast, appropriate density, distinctive character, and predictable behavior. Consistency serves understanding; variation serves hierarchy and personality. For this user, favor modern SaaS minimalism: restrained surfaces, typography-led hierarchy, useful density and precise controls. Keep this explicit taste preference separate from universal UX quality.

## Apply the preferred visual direction

For new designs and substantial refinements, load [modern SaaS minimalism](references/preferences/modern-saas.md). It routes the preference from screen idioms down to primitives. A later brief overrides it; a scoped repair retains the surrounding identity. Prefer calm working surfaces over decorative card walls, without sacrificing labels, readability, meaningful color or useful density.

For scored reviews, use the [weighted preference rubric](references/preferences/style-scoring.md) and `scripts/style-score.mjs`. Report **modern SaaS style fit / 100** with its evidence and blocked/provisional/eligible status, separately from task and accessibility findings. Do not treat element counts or a famous reference brand as a score.

## Start with the design problem

Before prescribing values, establish from the request and existing product:

- Who is doing what, under which constraints? Distinguish reading, comparison, monitoring, editing, exploration, and persuasion.
- What should people notice, understand, and do? Write the intended priority order independently of what currently looks prominent.
- Which existing qualities must survive? Identify specific typography, color relationships, imagery, density, component language, or motion. State where deliberate variation earns its place.
- What evidence is available: implementation, live browser, design file, native app, screenshots, or actual user research?

Infer reasonable context and label assumptions; ask only when the answer changes the design decision. Do not convert a request for polish into a rebrand or unrelated product redesign.

## Route the work

Use [router.md](references/router.md) to select a task-specific route before applying generic visual rules. The hierarchy is **atoms → molecules → organisms → templates → pages**, with foundations beneath and the designer workflow alongside. It is a concurrent mental model, not a waterfall or required code architecture. Templates encode screen idioms; pages bind them to actual content and state.

For broad work, route by the dominant task (monitor, analyze, browse, compare, edit, read, commit, converse), then follow only relevant child decisions. For a small repair, enter at its atom/molecule and consult parent constraints only as needed. Add scoped secondary branches for hybrid screens. Use `specialist` when the catalog lacks the dominant interaction. Never load every reference or equate a valid route with a good design.

For fragile web layouts, use [Andy Bell’s resilient composition guidance](references/foundations/resilient-css.md), which connects CUBE CSS ownership to content/container stress checks without requiring a framework migration.

The dependency-free `scripts/route.mjs` supports `list`, `show ID`, `path ID ...`, `check`, and `plan FILE.json`. It returns exact references, discriminants and conditional next steps; it does not pretend to classify design intent automatically. Workflow modules cover framing, task/information structure, alternatives, composition, evaluation and handoff. Choose activities by unresolved uncertainty and stop when the requested work is verified.

Read [design-review.md](references/design-review.md) for composition and semantic diagnosis. Read [measurement-rules.md](references/measurement-rules.md) before assigning numerical targets. The [research ledger](references/research.md) links primary articles, named practitioners, standards, conflicting advice, and research limitations; consult the relevant entries when defending a recommendation.

## Choose evidence appropriate to the surface

**Rendered web:** Use the existing project's browser tools where practical, or the bundled audit tools in [tools.md](references/tools.md). They capture screenshots, computed styles, scoped contracts, geometry candidates, and axe results. Inspect the actual screenshots and operate relevant interactions. A successful script is not a design approval.

**Screenshot or design file:** Review composition, priority, grouping, optical balance, typography, color roles, imagery, and visible states. Use pixel coordinates only as image coordinates unless scale is known. Mark hit area, actual contrast, keyboard, reflow, responsiveness, and behavior unverified. Do not fabricate DOM measurements from a raster image. Request another artifact only if needed for a decision.

**Native:** Use native inspection and platform conventions; apply the same semantic review. Measure in platform units and test large text, safe areas, actual input modalities, and state changes. Bundled DOM scripts do not audit SwiftUI, canvas, or native accessibility trees. Do not convert Apple points, Android dp, or screenshot pixels into CSS pixels without evidence.

## Review and improve

1. **Capture a baseline.** Record route, state, viewport, theme, content fixture, input mode, and loading readiness. Include representative content, not only ideal short strings. Preserve strengths explicitly.
2. **Challenge the structure.** Is the chosen pattern suitable for the task? A perfect card grid may be wrong for exact comparison. Can the visual priority be explained by user importance? If not, fix structure before polishing tokens.
3. **Inspect relationships.** Work from whole composition to groups to details. Check emphasis, grouping, rhythm, alignment, type, color, icon/shape language, imagery, content, state, and motion. Verify optical alignment separately from bounding boxes.
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

The configured modern SaaS preference score is allowed with its stated scope and evidence limits. Never produce a universal “design quality: 93/100,” predicted conversion gain, inferred eye-tracking result, or validated usability claim from static inspection. Report numerical facts, anchored qualitative judgments, coverage, and remaining uncertainty separately. The optional structured review template and validator require evidence fields; they cannot verify the evidence or validate the judgment itself.

Use [tools.md](references/tools.md) for setup, outputs, limitations, comparison, and CI semantics. A finished review states what was verified and what remains untested. When implementing, stop once the requested defects are resolved and scoped regression checks pass; do not endlessly normalize intentional differences.
