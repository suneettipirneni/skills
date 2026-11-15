# History, messages and composer

Layer: **organisms** · Route: `conversation-region`

**Use when:** A conversation must preserve context while messages change.

**Avoid when:** An inbox or static event log has no conversational turn-taking.

## Decision and composition

Keep author, message content and associated actions together. Group consecutive turns only when authorship and time remain understandable. Distinguish transient typing/streaming indicators from actual messages.

Compose history, retrieval boundary, unread/new-message cue and composer with attachments/send state. Keep global conversation controls separate from message actions. Use plain content hierarchy rather than boxing every subparagraph.

## Behavior and adaptation

If the reader is at the end, follow new content appropriately; if reading history, preserve position and offer a return-to-latest cue. Failed sends retain editable content. Streaming announcements should summarize useful changes rather than speak each token.

## Evidence and repair

Test long messages, code, failed attachments, new arrivals while scrolled up, interrupted streams and software keyboard occlusion. Validate duplicate prevention with actual behavior, not just disabled styling.

**Worked decision:** A retry reuses the failed draft’s identity and reports success without adding a second copy of the message.

**Source boundary:** Conversation mechanics here are original synthesis and require implementation testing; general accessibility standards remain applicable.

## Route deeper only when relevant

- [Label, input, hint and error](../molecules/field.md) — Compose accessible input and attachments
- [Actions, scope and commitment](../molecules/action-group.md) — Scope send/retry/message actions
- [State, error and recovery messages](../molecules/feedback.md) — Explain sending, failure and new content
- [Semantic text and labels](../atoms/text.md) — Preserve readable message structure
