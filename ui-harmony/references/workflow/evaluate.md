# Prototype, inspect and learn

Layer: **workflow** · Route: `evaluate`

**Use when:** A design decision or implemented behavior needs evidence.

**Avoid when:** Using screenshot taste as proof of task success.

## Decision and composition

Choose evidence for the question. Screenshots reveal hierarchy and grouping; interaction probes reveal state and focus; task sessions with actual participants reveal comprehension and recovery. Expert review and automated checks cannot replace those sessions.

Prepare task scenarios without embedding the intended answer. Capture starting state, fixture, viewport, theme, input modality and endpoint. Inspect ordinary, extreme and failure content. Record what happened separately from the interpretation.

## Behavior and adaptation

Run the bundled audit for rendered web contracts and accessibility candidates, then inspect screenshots and exercise the task. Compare like scenarios. A missing finding may mean missing content or reduced coverage, not a fix.

## Evidence and repair

Exit with evidence-backed findings, preserved strengths, remaining uncertainty and a decision to ship, iterate or investigate. Quantify only measured facts; use anchored semantic ratings without an aggregate aesthetic score.

**Worked decision:** A table passes overflow checks yet hides Status behind horizontal scrolling. Ask whether triage works in the initial narrow view and recompose essential columns; a zero-finding audit is insufficient.

**Source boundary:** [GOV.UK alpha](https://www.gov.uk/service-manual/agile-delivery/how-the-alpha-phase-works) supports testing risky assumptions. Measurement and semantic-review boundaries are specified in this skill’s tools documentation.

## Related context

- [Specify, implement and iterate](handoff.md) — Evidence supports implementation or completion
- [Explore meaningful alternatives](explore.md) — The task structure failed
- [Compose the interaction and visual system](compose.md) — A local relationship needs repair

## Choose fidelity by the question

[Kara Pernice’s prototype guidance](https://www.nngroup.com/articles/ux-prototype-hi-lo-fidelity/) distinguishes visual, interaction and content fidelity. A rough interactive prototype can test branching/recovery; realistic content can test hierarchy before final styling; a polished still cannot establish keyboard or persistence behavior. Select the fidelity needed for the uncertainty rather than requiring every task to progress through a fixed fidelity ladder.

[Reference calibration](../conditions/reference-calibration.md) tests the critique against praised, criticized and disputed designs without treating reputation as ground truth.

## Test the selected state on narrow screens

Selecting a row must expose a usable editor or detail view, not leave it beyond an unseen long list. Verify its destination and keyboard focus together. If the idiom becomes a dedicated detail view, provide a clear return that preserves the relevant query, list position and selected item; preserve drafts when the task requires it. Place supporting readiness/checklist regions after the work they summarize, or provide a compact route to them. Test actual long records and error states, not only the initial overview. A page with no horizontal overflow can still fail this workflow.
