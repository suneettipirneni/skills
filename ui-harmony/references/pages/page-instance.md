# Bind templates to actual pages and states

Layer: **pages** · Route: `page-instance`

**Use when:** A template needs to be tested against representative content or an existing screen reviewed.

**Avoid when:** A blank placeholder presented as validation of a template.

## Decision and composition

Choose one primary template from the task; add a secondary template only for a genuinely separate region or journey. Pages instantiate those structures with actual content. Treat route names as hypotheses, not automatic classification.

Record URL or artifact, actor/task, selected template, content fixture, state, theme, viewport/platform and input mode. Include plausible typical content, long/extreme content, no data, unavailable data, permission restriction and relevant asynchronous transitions. Use actual domain wording whenever available; label invented fixtures.

## Behavior and adaptation

Trace one complete task and one recovery path through the page. Inspect each relevant region in context, not just the isolated component gallery. If content breaks the template, revise the structure or its contract instead of truncating the important information.

## Evidence and repair

Acceptance means the actual instance works under the declared scenarios. Report which variants were not inspected. A representative fixture is not evidence about the distribution of real users or data.

**Worked decision:** A monitoring page with a record drawer uses monitoring as primary and record-detail as scoped secondary. On narrow screens the record can move to a linked detail view while preserving queue filters and return position.

**Source boundary:** [Brad Frost, Atomic Design](https://atomicdesign.bradfrost.com/chapter-2/) supports concurrent whole/part thinking. This catalog’s route boundaries are an applied synthesis, not Frost’s prescribed taxonomy.

## Route deeper only when relevant

- [Monitor and triage work](../templates/monitoring.md) — Detect exceptions and decide the next intervention.
- [Analyze and compare evidence](../templates/analytics.md) — Explain change, compare distributions or investigate a hypothesis.
- [Browse or compare a collection](../templates/collection.md) — Find, compare, select or manage objects sharing a domain.
- [Search and refine results](../templates/search-results.md) — The user expresses an information need and evaluates relevance.
- [Understand and act on one record](../templates/record-detail.md) — Inspect a known object, related objects or its state.
- [Complete a coherent form](../templates/form.md) — Capture or edit related information with an understandable commitment.
- [Guide a dependent sequence](../templates/wizard.md) — Later stages depend on earlier choices or a long transaction needs staged progression.
- [Resume independent tasks](../templates/task-hub.md) — A longer service comprises tasks with flexible order or multiple sessions.
- [Change preferences and configuration](../templates/settings.md) — Adjust persistent product or account behavior.
- [Enter, recover and resume identity](../templates/authentication.md) — Sign in, verify, recover access or return after session expiry.
- [Read and navigate long-form content](../templates/article.md) — Comprehension and reading continuity are the primary goals.
- [Explain an offer or service entry](../templates/landing.md) — Help visitors understand relevance and choose a next step.
- [Compare plans and commitments](../templates/pricing.md) — Evaluate alternatives by cost, fit and constraints.
- [Review and commit a transaction](../templates/checkout.md) — Submit a purchase, booking or consequential application.
- [Work repeatedly on a central object](../templates/workspace.md) — Create or edit with tools, inspectors, previews or multiple contexts.
- [Exchange messages and maintain context](../templates/conversation.md) — Participate in a chronological exchange with another person or assistant.
- [Review events and notifications](../templates/activity.md) — Scan changes, notifications or chronological activity and act selectively.
- [Escalate a specialist interaction](../templates/specialist.md) — Calendar, spatial map, media player, canvas, or another dominant interaction lacks adequate coverage.
