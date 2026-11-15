# Specify, implement and iterate

Layer: **workflow** · Route: `handoff`

**Use when:** An accepted design needs implementation or a completed change needs handoff.

**Avoid when:** Producing a specification nobody needs for a tiny repair.

## Decision and composition

Hand off decisions and behavior, not screenshots alone. Scale the artifact to the change. Distinguish accepted decisions from open questions and deferred scope.

Include route choice, real content examples, component owners, token/variant relationships, state transitions, keyboard and focus behavior, saving model, responsive recomposition and acceptance scenarios. For existing code, reuse the owning component rather than accumulating per-page overrides.

## Behavior and adaptation

Compare implementation with the accepted intent, then verify with the same fixtures. Note platform-specific departures. Track later observed issues as hypotheses to revisit, not proof that a one-time audit guarantees continuing quality.

## Evidence and repair

Exit with scoped checks passed, remaining limitations disclosed and evidence locations preserved. Stop when the requested outcome is complete; avoid continuous aesthetic normalization.

**Worked decision:** A form spec records that Cancel restores persisted values and returns focus to Edit. Verification must exercise both behaviors, not just compare the input border.

**Source boundary:** [Brad Frost, Atomic Design](https://atomicdesign.bradfrost.com/chapter-2/) supports concurrent whole/part thinking. This catalog’s route boundaries are an applied synthesis, not Frost’s prescribed taxonomy.

## Flexible implementation

[Resilient composition and CSS ownership](../foundations/resilient-css.md) applies Andy Bell’s CUBE CSS and browser-oriented design principles when content, containers or overrides expose fragile rules.
