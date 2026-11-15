# Progress, pending and busy state

Layer: **atoms** · Route: `progress`

**Use when:** Work is underway and its scope or completion needs explanation.

**Avoid when:** Decorative spinners stand in for an unknown task state forever.

## Decision and composition

Use determinate progress only when a meaningful denominator exists. Indeterminate activity means work is ongoing, not a fabricated percentage. Step progress, file progress and overall job progress are different quantities.

Name the operation and affected scope. Show useful status and cancel/retry controls where supported. Preserve enough stable structure to avoid disorienting layout shifts; a skeleton should match expected content rather than decorative placeholder density.

## Behavior and adaptation

Handle stalled, canceled, failed, partial and completed work. Reduced motion may replace animated indicators with stable status. Announce meaningful milestones rather than every incremental percentage.

## Evidence and repair

Validate progress against actual work, not elapsed animation. Test 0, near-complete, partial failure and unknown duration. Measure layout stability and persistent operation identity.

**Worked decision:** An import completes 90 records and rejects 10; “100% processed” must not imply “100 records imported successfully”.

**Source boundary:** Original state synthesis; relevant live-region and progress semantics must follow current platform guidance.

## Route deeper only when relevant

- [Motion, continuity and interruption](../foundations/motion.md) — Make activity understandable with reduced motion
- [Meaning, structure and accessible interaction](../foundations/semantics.md) — Expose useful state without announcement overload
- [Semantic text and labels](text.md) — Name actual scope and outcome
