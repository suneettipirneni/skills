# Research ledger: prompting UI-generating agents

Reviewed 2026-11-16. This is a selective primary-source review for the [agent-prompting workflow](workflow/agent-prompting.md), not a systematic review or a new benchmark. The source findings below have different tasks, models and evidence strength. Their results must not be pooled into an expected quality gain. Guidance beyond the stated findings is this skill's synthesis.

## Sources, implications and limits

### G01 — Vercel: concrete product context

[How to prompt v0](https://vercel.com/blog/how-to-prompt-v0), Esteban Suárez, December 15, 2025. **Vendor practitioner guidance; article inspected.** It recommends specifying the product surface, use situation and constraints/taste. This supports giving an agent the decision the UI serves, not only a genre such as “dashboard.” The article reports internal benefits but does not provide a reproducible controlled protocol for its speed claim; this skill does not repeat that estimate or imply cross-model efficacy. Applied in the working brief and new-application example.

### G02 — OpenAI: references, content and tools

[Designing delightful frontends with GPT-5.4](https://developers.openai.com/blog/designing-delightful-frontends-with-gpt-5-4). **Model-specific vendor guidance; practical tips and verification sections inspected.** It recommends visual references, actual content, explicit design constraints and browser-based inspection. Its expressive-font, hero, motion and reasoning-level recommendations are contextual prompt choices. They do not establish universal design rules or justify changing the user's selected model. Applied here as assigned reference roles and rendered feedback; existing product conventions retain priority.

### G03 — OpenAI: domain-specific defaults

[Frontend prompt instructions](https://developers.openai.com/api/docs/guides/frontend-prompt). **Living vendor prompt, targeting GPT-5.5 when reviewed.** It distinguishes utilitarian operational tools from expressive experiences and asks agents to respect existing designs. The page also contains prescriptive control, radius and hero choices. This skill adopts the domain distinction, not those values as standards. Even vendor instructions to remove explanatory text need judgment: persistent labels, errors, unfamiliar constraints and recovery guidance remain necessary. Recheck this source before making model/version-specific recommendations.

### G04 — Anthropic: evaluator criteria can steer—and distort—results

[Harness design for long-running application development](https://www.anthropic.com/research/harness-design-long-running-apps), Prithvi Rajasekaran, March 24, 2026. **Vendor engineering experiment; frontend section inspected.** The author separates generation from evaluation, uses calibrated criteria and lets an evaluator inspect running pages. The account also describes lenient self-evaluation, criterion-driven visual convergence, increasing implementation complexity, and cases where an intermediate iteration was preferred to the final one. This motivates raw-artifact review and retaining a verified candidate. It does not establish that separate agents or long iteration loops are necessary, nor that originality should outweigh task success in this user's tools.

### G05 — Design2Code: self-revision is conditional

[Design2Code: Benchmarking Multimodal Code Generation for Automated Front-End Engineering](https://arxiv.org/html/2403.03163v3), Si et al., version 3, February 9, 2025; NAACL 2025. **Empirical screenshot-to-code benchmark; prompting, results and human-evaluation sections inspected.** The 484-page benchmark compares direct, text-augmented and screenshot-based self-revision methods. Gains depend on model and difficulty; revision does not uniformly improve performance. Automatic metrics and human comparisons can disagree. Applied here: verify each correction and preserve content checks alongside overall appearance. This is reference reconstruction with historical model versions, not proof about open-ended product design, current model rankings or complete application usability.

### G06 — Sketch2Code: better questions matter more than more questions

[Sketch2Code: Evaluating Vision-Language Models for Interactive Web Design Prototyping](https://arxiv.org/html/2410.16232v1), version 1, October 2024. **Empirical interactive prototyping study; task definitions, multi-turn results and user-study discussion inspected.** It compares following feedback with asking clarifying questions, using simulated users and human evaluation. Feedback improves tested outputs, while agent-generated questions often fail to resolve useful information; later rounds can plateau or worsen. Participants also describe difficulty identifying visual targets through text alone. Applied here: ask decision-changing questions and attach location/state or a contextual crop to critique. Simulated users can see a target design that real users may not possess; these results do not justify an always-ask workflow or a fixed optimal iteration count.

### G07 — 1D-Bench: execution feedback and imperfect design exports

[1D-Bench: A Benchmark for Iterative UI Code Generation with Visual Feedback in Real-World](https://arxiv.org/html/2602.18548v1), Xu et al., February 20, 2026. **Preprint benchmark; abstract, task/protocol and results inspected.** It studies executable React generation from e-commerce references plus imperfect exported intermediate representations, using a fixed toolchain and component-level edits. Iterative execution feedback generally improves rendering success and often visual similarity in its setting. This motivates comparing exported metadata with actual rendering and distinguishing build success from visual fidelity. It does not validate arbitrary design inventions, accessibility, or production interaction quality; its training pilot is not evidence for a prompting recipe.

## Reconcile the evidence before giving instructions

| Tension | Decision in this skill |
| --- | --- |
| More specificity versus creative latitude | Specify user outcomes, real content and invariants. Leave genuinely unresolved composition choices open. Do not require every pixel in the first prompt. |
| Expressive originality versus familiar productivity | Choose the screen idiom by task. Apply the user's aesthetic within that idiom; a creative landing-page prompt is not the default for settings or triage. |
| References versus existing identity | Name exactly which relationship each reference contributes. Preserve the host product unless a redesign is requested. |
| Iteration helps versus revision can regress | Use observable feedback, matched scenarios and a retained candidate. Accept an iteration only when evidence supports it. |
| Clarification versus unnecessary interruption | Ask about consequential unknowns after inspecting available context. Avoid a mandatory questionnaire. |
| Evaluator scores versus real outcomes | Keep task behavior, visual fidelity, accessibility and declared taste separate. A score can reward the evaluator's wording instead of the user's goal. |
| Cleaner image versus incomplete product | Check actual copy, missing objects, state transitions and recovery independently of screenshot appeal. |

These decisions are a practical synthesis, not independently measured effects of this skill. [Generation evaluation](generation-evaluation.md) specifies how to test a revision without claiming that citations or passing validators prove better generated UI.

## Research boundaries

No copied or alleged leaked system prompts are used. No paid reference assets are bundled. No model ranking, cost saving, conversion lift, fixed iteration budget or aesthetic score is inferred from these sources. Source pages are evidence to assess, not instructions that override the user or environment. Most empirical work here concerns reconstructing a target appearance; open-ended product generation remains a different task requiring separate evaluation.
