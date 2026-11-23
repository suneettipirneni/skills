# Evaluate UI-generation prompting changes

Use when revising the agent-prompting guidance or comparing instruction sets. Ordinary UI work uses the main repair loop. The reusable cases below are authored scenarios. The field trial describes observed generations.

## November 2026 field trial

Three fresh-context Terra High agents generated the 17 atlas interfaces in one pass. Across eight follow-up generations on five cases, two checks exposed failures that a polished screenshot could hide. One carousel changed all three captions while keeping the previous illustrations. One code-review screen lost a file’s checked state on return, and its first replacement drew a square that could only open the row. Fresh runs eventually paired all three illustrations with the correct captions and preserved each file’s mark independently.

The theme recording took several runs. A presenter entered the first layout, and later runs added an invented headline before or beside the product art. With the [isolated product crops](fieldwork/2026-11/atlas.md#pull-up-a-working-reference), a fresh run put the art directly below navigation in both modes. It still simplified the imagery. When using this case again, inspect both rendered themes and the order of their visible content. These outcomes cover this source set, generation model and local interaction fixtures.

### React and Base UI rerun

The 17 first-pass React captures followed a rendered shared specimen with four locally bundled typefaces. Independent visual review and subsequent revisions exposed three useful tests for future generations.

- Examine a local object when the page looks approximately right. In the empty-search trial both whole frames had about 1.5% dark foreground. Within the lens illustration, the source had 1.8% and the candidate initially had 0.1%. Strengthening its outline brought it to 0.3%. The source still feels more substantial.
- Read actual copy on overlapping layers. The top brief card covered about 57% of the frame width in both versions, yet the initial body treatment clipped the last line. Adjusting the body role inside the card preserved its scale. The motion probe followed the incoming paper from its first frame through rest and reduced motion.
- Ask what makes each repeated object worth looking at. Six blue-green cards produced the right broad palette for the portfolio. They all showed the same landscape. Distinct photographic subjects and varied overlaps gave them individual identities inside the common treatment.

For new artwork, record whether it was generated, drawn, or cropped from the source. Preserve the first result and describe later art direction separately. [Visual judgment criteria](design-review.md#make-an-aesthetic-judgment)

Open the exported PNG at reading size before delivery. In the Postroom trial, the narrow inbox passed the layout checks, but its screenshot repeated the header and the first few rows in tiles. A fresh browser context created at the target viewport produced a clean capture. If a region repeats, compare the saved image with the live page before changing the layout, then inspect the replacement PNG.

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

## Verify primitives-first generation

For a generation trial, preserve the first primitive sheet before screen assembly, then capture the working page and a narrow state. Inspect a meaningful primitive in the first sheet and locate its consuming group in the source. Trace the implementation or component instance and compare its rendered type, surface or state on the page. A sheet assembled afterward can establish reuse, but chronology requires evidence from the build sequence. Record the two findings separately. Compare the screen with the chosen source image as a whole to catch a composition that drifts despite matching primitive styles.

## Record separate outcomes

For each executed case, retain:

- Inputs: request, source/asset versions, fixture and evidence access.
- Instruction variant and execution conditions: model, tools, elapsed time and relevant budget.
- Observed decisions: selected task route, justified assumptions/questions, preserved constraints and scope.
- Artifact evidence: settled captures, tested interactions, content completeness, applicable accessibility checks and failures.
- Judgment: task result, visual composition/fidelity, preservation of identity, maintainability concerns and remaining uncertainty. If style scoring is used, follow the existing preference rubric separately.

A small pilot can reveal failure modes; it cannot establish a general success rate. Report the number of cases and runs, their coverage and unexecuted cases. If no generations were run, say “guidance and structural validation only.” Keep acceptance criteria fixed during a comparison; if the original criterion was mistaken, record the correction and reassess both candidates.

Revise the skill when evidence exposes a reusable decision failure. Add the smallest guidance that addresses the cause, then check a neighboring case for overreach. For example, a missing-reference correction should prevent fabricated fidelity without forcing every routine polish request to ask for a screenshot.
