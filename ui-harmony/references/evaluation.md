# Evaluation protocol and feedback contract

This is an original inspection rubric. Its ordinal anchors are not a psychometrically validated scale. Do not average the general UX dimensions below or assign a universal pass mark. A separate [modern SaaS preference index](preferences/style-scoring.md) uses explicit user-selected weights for visual direction; it is not an aggregate UX score. If user perception matters, conduct research with representative participants; VisAWI and task measures require actual responses, not model simulation.

## Evidence lanes

Keep separate: rendered facts; authored system conformance; accessibility tests; observed interaction; aesthetic interpretation; actual user responses. Each can succeed while another fails. A beautiful form with no recovery can be poor UX; an accessible and consistent page can still be dull or compositionally awkward.

## Scenario coverage

Create a small matrix before capture, selected for the task:

| Axis | Representative cases |
| --- | --- |
| Screen | Narrow 320px web reflow screen, typical phone, intermediate width, desktop; just above/below changed breakpoints |
| Content | Typical, longest realistic, empty, overflow/large dataset, localization and RTL if supported |
| State | Rest, keyboard focus, selected/expanded, loading, disabled, validation error, failed request, success |
| Preferences | Supported themes; reduced motion; text spacing; actual browser zoom or native large text |
| Input | Mouse, keyboard, actual touch where interaction depends on touch; screen reader where semantics matter |

These are sampling axes, not a demand for their full Cartesian product. Explain excluded cases. Record fixture identifier, readiness assertion, viewport units, browser/version, theme and state. Screen sizes alone do not test touchscreen behavior, mobile browser chrome, an on-screen keyboard, or native safe areas.

For web, use a deterministic local fixture or representative authorized data. Confirm the intended route rendered, fonts/images loaded, and skeletons resolved. A login redirect, error page, or missing resource is not a clean audit of the target page. Capture the initial viewport as well as the whole page: long-page thumbnails hide local defects.

## Anchored review profile

For each dimension use **null = unreviewed**, **0 = broken**, **1 = mixed**, **2 = coherent**, **3 = refined**. Support every assigned rating with located evidence, a reason matching an anchor, and a counterexample/tradeoff. “3” does not mean universally beautiful or validated with users. Use N/A only with a reason, not to conceal missing evidence.

| Dimension | 0 — broken | 1 — mixed | 2 — coherent | 3 — refined |
| --- | --- | --- | --- | --- |
| Task hierarchy | Intended task or next action cannot be identified | Competing emphasis or wrong information order | Main task and supporting information are clear | Priority adapts well across content/state; emphasis feels intentional |
| Grouping and rhythm | Wrong associations or unusable crowding | Ambiguous groups or uneven unexplained pacing | Related items group clearly; density suits work | Micro-spacing and macro pacing support scanning/reading with purposeful variety |
| Typography | Essential content unreadable or lost | Role drift, awkward wraps, poor reading texture | Clear roles and comfortable reading in tested cases | Fine wrapping, numeric/optical detail preserve the chosen voice |
| Color and surfaces | Important cues indistinguishable or misleading | Color roles or layers conflict | Stable roles, adequate tested contrast and grouping | Palette, imagery, and depth reinforce identity without competing with meaning |
| Component language | Equivalent signals predict different actions | Unexplained variants and inconsistent cues | Roles/states follow a recognizable system | Details feel related with deliberate, useful exceptions |
| Composition and character | No understandable organization | Pacing, balance, or visual language conflicts with intended purpose | Composition suits purpose and preserves identity | Purposeful contrast and optical care; expressive or deliberately familiar as appropriate |
| Content and meaning | Labels/data mislead or task lacks context | Generic copy or missing units/recovery guidance | Precise terms, useful content, interpretable data | Content anticipates ambiguity and reduces unnecessary effort |
| Interaction and state | Key flow blocked or state deceptive | Resting view works but transitions/recovery fail | Tested flows and keyboard states work predictably | Feedback, interruption, focus, and recovery feel composed and resilient |
| Adaptation | Essential content/functions lost in relevant conditions | One size/state is good, others brittle | Tested sizes/content/preferences retain clarity | Recomposition preserves hierarchy, density and character across tested conditions |

Accessibility failures stay in a separate gate list even if they influence a dimension. Do not bury them in an attractive profile. The reference standard and applicability matter more than an ordinal rating.

## Severity and confidence

- **Critical:** key task impossible, destructive action deceptively presented, or essential interaction inaccessible with no workable route.
- **Major:** significant loss of content, important navigation/recovery failure, or substantial accessibility barrier.
- **Moderate:** repeated confusion, grouping/hierarchy conflict, or systematic component drift that materially weakens comprehension.
- **Minor:** localized finish issue with little effect on task completion.

Severity follows consequence and reach, not pixel magnitude alone. A 2px focus defect can matter more than a 20px decorative offset. Automation assigns preliminary severities; the reviewer can revise them with reasons. **High confidence** means directly measured/observed; **medium** means supported interpretation; **low** means a hypothesis requiring inspection. A source citation does not turn an inference into a fact.

## Finding format

Use `assets/review-template.json` for machine-readable work. A finding includes:

- ID, dimension, severity, confidence, location/state, screenshot or measured evidence.
- Observation: numerical measurement with units/method if available; no fake precision.
- Intended relationship and why it serves the task.
- User-facing consequence, explicitly inferred if not observed with users.
- Proposed change with a concrete target where justified.
- Threshold provenance: standard / platform / existing-system / proposed-heuristic / semantic-judgment.
- What must be preserved, alternative or exception, verification scenario and expected outcome.

Example: “In the mobile shipment view, status is outside the initial 390px viewport. A dispatcher must first find late shipments. Move status next to order identity, or expose a visible overdue filter; preserve the table's compact comparison layout. Verify with late/on-time mixed data at 320/390px and keyboard navigation. This is a task-priority judgment, not a WCAG violation.”

## Repair and comparison

Group findings by cause. Fix the owning component/token and inspect affected siblings. Compare equivalent route, dataset, state, dimensions, theme, preference and browser. A vanished selector might mean deleted content or a changed DOM, not a fix. A different dataset can reduce issue counts without improving design.

After each meaningful repair answer: did the intended relationship improve; did task-critical information remain available; what distinctive quality survived; what tradeoff changed? Run targeted checks and stop when the scoped outcome is met. If two plausible directions remain, show the concrete alternatives and their consequences instead of repeatedly adjusting values until a subjective score rises.

Deliver a short prioritized explanation plus evidence artifacts. Include preserved strengths, the most consequential changes, measurements, verification coverage, and untested conditions. The structured validator checks completeness and types; it cannot verify truthfulness of evidence or the quality of judgment.
