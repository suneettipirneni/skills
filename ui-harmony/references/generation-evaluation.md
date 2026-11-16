# Evaluate UI-generation prompting changes

Use when revising the agent-prompting guidance or comparing instruction sets. Ordinary UI work uses the main repair loop; it does not require running this evaluation suite. These are authored evaluation cases and a proposed protocol, not recorded agent results.

## Check behavior rather than prompt wording

A route validator proves that guidance is reachable. A successful build proves the generated code builds. Neither establishes that a prompt improves design. Test the candidate against the previous skill on the same task, source snapshot, assets, content, tools and available time. Record the model/version and settings rather than assuming results transfer between models. Keep rejected candidates and failures in the record.

When practical, use repeated runs and vary presentation order for reviewers. Hide which instruction set produced each candidate during comparison. For an independent evaluation, provide the user request and raw artifacts without the intended solution or previous critique. Delegation is optional and requires available, authorized tooling. Otherwise label the exercise as a single-agent review; do not call it independent or a controlled study.

Choose cases covering the changed decisions. Do not generate an entire application for every case when a bounded decision probe is sufficient. Conversely, a planning answer cannot prove that an interaction was implemented. Evaluate both the agent's decisions and the resulting artifact where execution is in scope.

## Reusable cases

The evidence/context column is fixture setup, not text to invent as observed evidence. Use real local artifacts or explicitly labeled synthetic fixtures when executing a case. Test criteria belong to the evaluator; the generator should receive the actual task and necessary constraints.

| Case and user request | Evidence/context | Observable acceptance and regression risk |
| --- | --- | --- |
| **Existing brand:** “Give this collection a polish pass.” | Running app with navy/mint identity, artwork cards, filters and a narrow state where names are truncated. | Agent inspects the baseline, repairs the identity/metadata relationship and preserves branding, query and detail return. Replacing it with a neutral dashboard or reporting only lint results fails the case. |
| **New work tool:** “Build a delivery-exception workspace.” | Records with deadlines, missing owners, one failed save response, existing primitives. | First screen supports the actual operation; assignment has truthful feedback and recoverable failure. A decorative KPI overview with inert actions fails. |
| **Visual reference:** “Implement this settings screen.” | Authoritative desktop reference, licensed assets, existing form semantics; no mobile design. | Agent respects specified visual relationships, names mobile assumptions and retains labels/errors/save scope. Unsupported pixel-perfect or keyboard claims fail. |
| **Ambiguous commitment:** “Let me edit project settings.” | Repository supports explicit saves, user has not specified a change. | Agent inspects and retains existing save semantics or asks a targeted question if evidence conflicts. A broad questionnaire or silent persistence redesign fails. |
| **Missing reference:** “Match the attached reference.” | Attachment is actually unavailable; source UI exists. | Agent reports the missing reference and can inspect the current UI while requesting it. Claiming reference fidelity or inventing the image fails. |
| **Conflicting style advice:** “Polish this dense admin tool; preserve its system font and compact rows.” | Reference material promotes expressive typography and large hero compositions. | Agent applies product constraints and transfers only relevant component finish. Importing the reference's architecture or font bans fails. |
| **False visual defect:** “The cards look huge and blurry.” | Baseline screenshot captured before hydration/image readiness; settled UI has different geometry. | Agent checks readiness before prescribing geometry changes, then inspects the settled state. Mistaking a placeholder for final design fails. |
| **Misleading success:** “Finish this search/detail flow.” | Screenshot is polished, axe is clean, but opening and closing details loses the filter and scroll position. | Agent exercises the flow and identifies state loss despite clean static checks. Declaring the flow complete from a screenshot or score fails. |
| **Revision regression:** “One more refinement.” | Two saved candidates: newer one has higher declared style fit but drops an important action at narrow width. | Agent retains or repairs the functional candidate and explains the tradeoff. Selecting the latest or highest-scoring version automatically fails. |
| **Static-only evidence:** “Review this mobile mockup.” | Raster image with unknown scale and no runnable source. | Agent critiques visible relationships and marks behavior/contrast/hit geometry unknown as applicable. Inventing DOM measurements or functional tests fails. |
| **Functional but undeveloped:** “Refine this as a world-class designer.” | Working research workspace with readable components, evidence separated from the selected claim and equally prominent secondary actions. | Agent recommends a task-specific direction and develops a consequential relationship with matched evidence. Cosmetic token changes, a persona declaration or a process document alone fail. Multiple coherent designs can satisfy the case. |
| **Task-dependent character:** “Give these two screens a considered visual direction.” | A supplied editorial reading surface and a dense operational queue, with different content and goals. | Agent derives proportion, rhythm and emphasis from each task while respecting their shared brand. Applying the same hero/card composition or demanding decorative novelty fails. |
| **Polished transition gap:** “Finish the assignment interaction.” | A functioning queue where assigning an owner removes the row under the current filter; confirmation and continuation are unclear. | Agent resolves truthful feedback, retained context and the next action without changing save semantics. Styling only the toast, inventing successful persistence or stranding focus fails. |

## Record separate outcomes

For each executed case, retain:

- Inputs: request, source/asset versions, fixture and evidence access.
- Instruction variant and execution conditions: model, tools, elapsed time and relevant budget.
- Observed decisions: selected task route, justified assumptions/questions, preserved constraints and scope.
- Artifact evidence: settled captures, tested interactions, content completeness, applicable accessibility checks and failures.
- Judgment: task result, visual composition/fidelity, preservation of identity, maintainability concerns and remaining uncertainty. If style scoring is used, follow the existing preference rubric separately.

A small pilot can reveal failure modes; it cannot establish a general success rate. Report the number of cases and runs, their coverage and unexecuted cases. If no generations were run, say “guidance and structural validation only.” Keep acceptance criteria fixed during a comparison; if the original criterion was mistaken, record the correction and reassess both candidates.

Revise the skill when evidence exposes a reusable decision failure. Add the smallest guidance that addresses the cause, then check a neighboring case for overreach. For example, a missing-reference correction should prevent fabricated fidelity without forcing every routine polish request to ask for a screenshot.
