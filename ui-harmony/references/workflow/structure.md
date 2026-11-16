# Model tasks, information and commitments

Layer: **workflow** · Route: `structure`

**Use when:** Navigation, sequence, scope or object relationships need design.

**Avoid when:** Only local appearance changed and relationships are established.

## Decision and composition

Map what people need to know and change, then distinguish objects, operations and journey stages. Decide ownership of global, collection, record and field actions. An object hierarchy is not automatically the navigation hierarchy.

Use a task flow with entry/exit, dependencies, alternate paths, recovery and saved state. Add a small content model with real example objects and terminology. Choose sequential steps only when dependencies justify ordering; choose a hub when people can work independently across sessions.

Look for mental bookkeeping: values people must remember across screens, scope they must infer, or state they must reconstruct after returning. Bring decision inputs together where practical. Judge steps by effort and consequence, not click count alone; a deliberate review can help an irreversible commitment, while a confirmation on every harmless edit can obstruct repeated work. These are task hypotheses to inspect, not claims of observed user performance.

## Behavior and adaptation

Name commitment boundaries: immediate change, draft, explicit save, transaction submission. Record return behavior, deep links and permission differences. Resolve ambiguous terms such as “active”, “done”, “selected” with domain meaning.

## Evidence and repair

Exit when a representative task and a failure/recovery path can be traced without unexplained jumps. Validate terminology and grouping with users where possible; expert inference remains an assumption.

**Worked decision:** A supplier setup has independent bank, contact and tax tasks. Route to task-hub, with a form inside each task; do not force a five-step wizard merely to display progress.

**Source boundary:** [GOV.UK task list](https://design-system.service.gov.uk/components/task-list/) supports nonlinear resumable services; do not import it into inherently fixed sequences.

## Related context

- [Explore meaningful alternatives](explore.md) — Compare alternative task structures
- [Bind templates to actual pages and states](../pages/page-instance.md) — Bind the chosen structure to concrete content
