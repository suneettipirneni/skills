# Lifecycle, persistence and failure coverage

Layer: **conditions** · Route: `states`

**Use when:** An interaction changes data, loads asynchronously or spans sessions.

**Avoid when:** Treating a happy-path screenshot as the entire design.

## Decision and composition

Map initial, loading, ready, empty, partial, stale, error, denied and offline states only where relevant. Then map transitions, including interruption, retry and return. A state list without transitions misses the most consequential failures.

Name owner, data scope and commitment for each transition. Identify drafts, optimistic changes, authoritative values and uncertain outcomes. Errors should preserve recoverable user work and offer a meaningful next action.

## Behavior and adaptation

Test rapid repeated actions, slow/out-of-order responses, partial batch success, expiry and concurrent changes. Do not generalize a global spinner/error to independent regions with different states.

## Evidence and repair

Record tested transitions separately from observed settled screenshots. Numeric pass counts must disclose coverage. A validation script cannot infer persistence or backend truth from color changes.

**Worked decision:** A batch delete partially succeeds; the remaining list identifies failed items and targeted retry rather than restoring all records or claiming everything succeeded.

**Source boundary:** Original lifecycle synthesis, informed by Cloudscape and GOV.UK state/recovery patterns. Domain correctness requires implementation evidence.
