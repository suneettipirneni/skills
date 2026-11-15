# Exchange messages and maintain context

Layer: **templates** · Route: `conversation`

**Use when:** Participate in a chronological exchange with another person or assistant.

**Avoid when:** Notifications are primarily triage tasks or records need sorting/comparison.

## Decision and composition

Preserve speaker, chronology and conversational context. Distinguish generated draft, sent message, delivered state and failure. For AI output, identify uncertainty and tool/action states when they affect user decisions without exposing irrelevant implementation chatter.

Use conversation identity, message history, attachments/context and composer. Group by meaning and speaker without erasing timestamps where needed. Actions belong to the relevant message; the composer should not become a large competing card.

## Behavior and adaptation

Handle streaming, cancellation, retry, offline sending, long code/media and history retrieval. Do not pull readers to the bottom while they inspect earlier content. Keep composer accessible when keyboards appear; avoid announcing every streamed token.

## Evidence and repair

Test long threads, failed send, retry without duplicates and scrolling during updates. Measure composer occlusion and readable message width; equal left/right bubble widths are not a quality goal.

**Worked decision:** A failed message remains associated with its content and offers retry; it does not vanish behind a generic global toast.

**Source boundary:** [Tidwell, Common Ground](https://www.mit.edu/~jtidwell/common_ground_onefile.html) supports stable context conceptually. Conversation-specific guidance here is authored synthesis requiring product testing.

## Route deeper only when relevant

- [History, messages and composer](../organisms/conversation-region.md) — Compose history and composer
- [State, error and recovery messages](../molecules/feedback.md) — Differentiate sending, failure and stream states
- [Text entry and editing](../atoms/input.md) — Support multiline composition

## Nearest alternatives

- [Review events and notifications](activity.md) — Items are events or notifications to triage

## Related context

- [Navigation and application frame](../organisms/app-shell.md) — Stable cross-screen navigation is part of this scope
