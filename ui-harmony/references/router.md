# Route by task, then by the relationship that needs work

This catalog uses Brad Frost’s **atoms → molecules → organisms → templates → pages** as concurrent levels of a system. Foundations/tokens support them; workflow and conditions are separate axes. These extra categories are this skill’s organization, not additional canonical Atomic Design stages. Organisms may contain atoms, molecules or organisms. No framework, directory reorganization, atom-first build order or adjacent-level-only traversal is required.

## Make a bounded route choice

1. State the task, evidence mode, scope and quality to preserve. Separate observations from assumptions.
2. Select the **dominant decision**, not the noun in the request. A “dashboard” may really be a work queue. A “dropdown” may be a value selector, navigation disclosure or command menu.
3. Choose one primary route and explain its discriminant. Add a second scoped branch only for a distinct region/concern. For a local fix, enter at the owning atom/molecule and consult its parent constraints only when needed.
4. Read that route’s document. Follow only the relevant conditional links; do not recursively load the catalog. `show` lists options and parents; it does not prescribe reading them all. `path` produces exactly the selected file list.
5. Bind screen work to real content/state through `page-instance`, or record the same fixture metadata directly in a narrow repair. Add workflow/condition routes only for unresolved decisions. Record rejected alternatives and what would change the choice when those alternatives matter.
6. Review whole/part consequences after the repair. A local change can expose a bad parent contract. Return to the owner rather than accumulating overrides.

The deterministic tool validates IDs, paths, reference integrity and declared plans. It does **not** infer the best design from text or rank design confidence. Semantic choice belongs to the reviewing agent and ultimately to product/task evidence.

## Practical entry map

| Decision | Entry | Discriminant / useful alternative |
| --- | --- | --- |
| Unclear new product or requested solution | `frame` | Establish the job; do not invent research |
| Information architecture or task order | `structure` | Dependencies versus independent work |
| Prompt UI generation or targeted iteration | `agent-prompting` | Working brief, reference roles, preserved constraints and observable feedback |
| Choose architecture or visual direction | `explore` | Compare meaningful task/interaction/composition alternatives on representative content |
| Develop this user’s SaaS aesthetic | `modern-saas` → `untitled-ui` | Concrete screen/component references and finished restraint; task route still owns the idiom |
| Implement coherent visual relationships | `compose` | Existing identity and real states |
| Test an uncertainty | `evaluate` | Choose fidelity/evidence for that question |
| Implement/specify/verify | `handoff` | Behavior, owners and acceptance, proportional to scope |
| Test template with actual content | `page-instance` | Not an empty wireframe |
| Detect and act on exceptions | `monitoring` | `analytics` if explaining causes is the primary goal |
| Explain quantitative evidence | `analytics` | Question/denominator/scale before KPI cards |
| Browse/compare objects | `collection` | Table/list/cards/split decided by the task |
| Interpret a query and relevance | `search-results` | Not just a collection with a text box |
| Inspect or edit one known object | `record-detail` | Inline/dedicated edit; panel/page/hub |
| Submit related information | `form` | One commit boundary |
| Dependent staged progression | `wizard` | `task-hub` for independent resumable tasks |
| Persistent preferences | `settings` | Immediate versus explicit save |
| Identity, recovery or session return | `authentication` | Not general onboarding |
| Read long-form content | `article` | Reading continuity before decorative containers |
| Understand offer/service entry | `landing` | Actual claims and evidence |
| Compare purchase alternatives | `pricing` | Units, billing and conditions |
| Commit a purchase/application | `checkout` | Review, uncertain outcome, durable receipt |
| Repeated editing | `workspace` | Central work, tools and inspector |
| Exchange messages | `conversation` | `activity` for events/inbox; `monitoring` for a queue |
| Unsupported specialist interaction | `specialist` | Research scheduling/maps/media/boards before prescribing |
| One icon or action defect | `image-icon` / `button-link` | Read parent context only if its contract is unclear |
| Responsive/content stress | `adaptation` | Container space, text and order, not viewport alone |
| Async/persistence defect | `states` | Verify transitions, not only settled frames |
| Native/static evidence | `platform-access` | Explicit units and unverified behavior |

## Commands

Run from the skill directory, or use an absolute script path from any directory. No dependencies are required.

```sh
node scripts/route.mjs list templates
node scripts/route.mjs show collection
node scripts/route.mjs path collection collection-region card-row image-icon
node scripts/route.mjs path image-icon
node scripts/route.mjs check
node scripts/route.mjs plan assets/examples/dispatch-route-plan.json
```

`path` accepts declared child, alternative or related edges. A multi-branch plan is not one artificial linear chain: put the queue, inspector and responsive condition in separate scoped paths. The generated read plan deduplicates only selected files. Composition children are acyclic; workflow/alternative links may revisit earlier decisions intentionally.

Copy [route-plan-template.json](../assets/route-plan-template.json) when a structured plan would aid review. For a trivial repair, an equivalent short prose route is sufficient; do not require JSON paperwork. A static evidence plan must disclose unverified behavior. A structurally valid plan may still choose the wrong template or invent evidence—challenge those claims manually.

## Ownership in feedback

Add `ownerRoute` to a semantic finding when useful. It names the layer where the correction belongs, not where its symptom was noticed. Optionally add a valid `routePath` explaining the containment/decision path. The review validator checks these IDs/edges against the catalog but cannot verify that the owner is correct.

Example: a page-level spacing defect may be owned by `field` or `spacing`. Report “Internal help gap 20px versus the existing 8px field contract; change the field stack, preserve input height; recheck wrapped error at 320px,” rather than a global `gap: 8px` reset.

## Full workflow, without ceremony

For each relevant activity, name the unresolved decision, evidence available, useful artifact, exit signal and reason to revisit. The workflow modules provide these. Typical loops are brief → task model → alternative prototype → composition → evaluation → implementation, but enter and exit according to the actual work.

- **New product:** a declared-assumption brief, representative task flow, a meaningful alternative, a prototype targeting the hardest uncertainty and a concrete page/state example. Do not claim research participants existed.
- **Existing redesign:** reuse available research/system, preserve strengths, diagnose task friction, choose structural or local repair and compare the same scenarios.
- **One-control repair:** inspect the control and parent relationship, change the owner, verify adjacent states. No persona workshop or mandatory template audit.
- **Screenshot review:** review visible composition and propose behavior checks; never fabricate DOM or interaction evidence.
- **Native inspector:** use native platform behavior/units and actual interaction tooling; web audit scripts remain inapplicable.

See [research-routing.md](research-routing.md) for the expanded research ledger, scope of evidence and source conflicts.
