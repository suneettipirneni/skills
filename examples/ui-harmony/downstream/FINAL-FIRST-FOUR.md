# Independent final review: first four downstream apps

**Scoped pass after correction:11 targeted checks passed; no page errors observed.** Verified live at390×844 in isolated Chrome contexts, plus Switchyard detail at1440×1000. This is a bounded review of selected tasks and rendered states, not universal beauty, accessibility or production-readiness certification. No application files were edited by this reviewer.

| App | Independently verified outcome | Evidence |
| --- | --- | --- |
| Crate | Search `o`, open later work Cloud Atlas: detail heading visible and focused at y408. Back preserves query and exact window scroll689, returns focus to originating row visible at y589–663. | `crate/final-review/deep-390.png`, `back-390.png` |
| Gloss | Search `task` + Pending, open `task.empty_body`: selected editor visible at y127 with focus on Back; translation field at y574. Back preserves query/filter, window scroll125 and list scroll60; originating row focused and visible at y753–818. | `gloss/final-review/deep-390.png`, `back-390.png` |
| Switchyard | Phone changes begin y485 before checklist y3137. Comparison has15/15CSS-px gaps vertically on phone and horizontally on desktop. Injected long-version stress strings wrap into three text fragments;268px value boxes and298px comparison have no horizontal overflow. | `switchyard/final-review/deep-390.png`, `deep-1440.png`, `long-values-390.png` |
| Daymark | Quiet heading is Studio schedule; New York time·EST and studio hours remain. Overlapping Studio A session rejects with resource/time/person context. Choosing Studio B recovers and creates the entered session. | `daymark/final-review/deep-390.png` shows the consequential conflict state |

Natural-size deep-state captures were inspected. The selected Crate and Gloss detail states retain object identity, meaningful content and return affordances; Switchyard keeps comparison semantics while changing orientation; Daymark's error explains the concrete conflict instead of showing generic failure. These are materially improved task transitions and restrained compositions within the reviewed scope.

## Retained failure and verification corrections

The first final-review attempt caught a remaining Gloss defect: Back reset window scroll to0 while preserving inner list scroll60 and focused the selected row below the viewport (y878–943). Its creator corrected this, and the independent combined rerun above passed the same later-result case. Evidence remains in `first-four-checks-attempt1.json` and `gloss/final-review/back-offscreen-before.png`.

The initial Switchyard probe incorrectly assumed a horizontal phone comparison and numeric computed line-height. Those were harness assumptions, not product defects: the phone layout intentionally stacks the comparison. The corrected probe derives the axis from actual child geometry and counts rendered text fragments for wrapping. Its final result is15/15 vertically and horizontally as appropriate.

## Reproduce and limits

Run from this directory with servers4321–4324 active:

```sh
node verify-first-four.mjs
# Optional focused run:
node verify-first-four.mjs gloss
```

`first-four-checks.json` records final measurements and checks; the script writes selected captures to each app's `final-review` directory. A rerun replaces those final artifacts; immutable original parent baselines remain separate. The long-value stress changes DOM text only inside the isolated browser context and is labeled as a test fixture, not shipped content.

This probe does not repeat the broader axe or complete task suites, test real mobile keyboards or assistive technology, or establish that all other states are correct. Independent root checks remain separate. The separate Cue pixel-isolation incompleteness is not resolved or superseded by these four app results.
