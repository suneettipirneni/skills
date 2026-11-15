# Motion, continuity and interruption

Layer: **foundations** · Route: `motion`

**Use when:** State changes, direct manipulation or spatial relationships involve animation.

**Avoid when:** Adding animation purely because a static interface feels generic.

## Decision and composition

Name the purpose: orientation, causality, feedback, continuity or deliberate expression. Choose the behavior from the task. Decorative motion must not delay an action or obscure state. Distinguish direct manipulation from autonomous animation.

Define origin/destination, interruption, reversal and state synchronization. Layout movement should preserve understandable relationships. Repeated bouncy emphasis can compete with task priority even if individually polished.

## Behavior and adaptation

Test rapid repeated input, cancellation, interrupted transitions, reduced motion and low performance. A still screenshot cannot validate motion. Reduced motion should retain state meaning through stable cues, not simply remove all feedback.

## Evidence and repair

Measure actual duration/latency or sampled trajectory only when captured. Numbers require provenance; no universal spring or 200ms rule establishes quality. Inspect responsiveness and continuity during interaction, not just the settled endpoint.

**Worked decision:** A panel opening from its trigger can preserve orientation, but if it ignores a second click until the animation finishes, the pleasant-looking transition harms control.

**Source boundary:** The main ledger includes Val Head and Rauno Freiberg. Detailed motion claims need direct interaction evidence; forthcoming source-specific additions must retain attribution boundaries.
