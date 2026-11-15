# State, error and recovery messages

Layer: **molecules** · Route: `feedback`

**Use when:** The interface must explain outcome, pending work or an exceptional state.

**Avoid when:** Adding success toasts for every inconsequential interaction.

## Decision and composition

Distinguish no existing data, no filter matches, loading, partial data, stale data, denied access, session expiry and failed operations. Each has a different recovery. Zero is a value, not empty. Match the location/persistence of feedback to its consequence.

Use specific state, affected scope and useful next action. Field error belongs near its field; a summary aids multi-field navigation; a toast can acknowledge a transient result; a durable transaction needs a receipt. Keep urgent messages distinguishable without relying on color alone.

## Behavior and adaptation

For partial bulk failure, show successful and failed counts/items and retry only failed work. For uncertain submission, check status rather than claiming failure. Preserve drafts through auth/network interruption where supported. Live announcements should match urgency and avoid repetition.

## Evidence and repair

Test each distinct cause and recovery action. Measure text/indicator contrast using actual rendered colors, but inspect wording and ownership semantically. Do not fabricate an exact wait time or reassuring success state.

**Worked decision:** “3 of 12 uploads failed; 9 completed” with failed filenames and targeted retry is more useful than a red “Something went wrong” banner.

**Source boundary:** [Cloudscape empty states](https://cloudscape.design/patterns/general/empty-states/) distinguishes missing/empty/filter cases; [GOV.UK notification banner](https://design-system.service.gov.uk/components/notification-banner/) informs scoped notification use.

## Route deeper only when relevant

- [Progress, pending and busy state](../atoms/progress.md) — Represent ongoing work honestly
- [Action, destination and toggle](../atoms/button-link.md) — Provide a meaningful recovery action
- [Semantic text and labels](../atoms/text.md) — Explain cause/scope without blame
- [Color roles, contrast and meaningful variation](../foundations/color.md) — Encode state accessibly
