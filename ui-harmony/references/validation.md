# Validation and adversarial calibration

Created and checked 2026-11-15. These are tool correctness and synthetic applicability checks, not evidence of general usability, aesthetic validity, or improved conversion.

## Executable checks

- The original 13 core Node tests cover meaningful invariants: measured style drift, fractional tolerance, authored references, missing contracts, invalid thresholds, distinct contract identities, narrowly scoped exceptions, conservative target classification, signed gaps, unrounded contrast thresholds, comparison parity, semantic evidence requirements, and report escaping.
- The bundled browser regression runs seven captures: broken/fixed form at two widths, missing-contract coverage, unexpected redirect, and text-spacing stress. Known overflow, clipping, spacing drift, undersized target, missing button name, and low contrast are detected.
- After correction, that fixture has zero confirmed accessibility/contract findings, with three axe contrast items still correctly marked for manual review on partially visible scrolling-table content. It is not labeled fully conforming or aesthetically approved.
- The skill-format validator and internal Markdown link check passed.

Run `npm test` and `npm run test:browser` after changing the scripts. Browser output identifies the temporary evidence directory. Dependencies and capture environment are recorded so measurements can be assessed in context.

## Independent adversarial agent

At the user's request, another agent independently researched design quality, then reviewed the sources, rubric, code, and actual applicability. It tested four synthetic surfaces at phone and desktop widths, plus intentionally broken variants:

| Surface | Successful calibration | Important unautomated judgment |
| --- | --- | --- |
| Dense operations dashboard | Did not flag intentional local table scrolling as page overflow; detected 730px introduced page overflow and 27px padding against a 12px contract | Task-critical status was outside the initial phone view even when geometry checks were clean |
| Editorial | Accepted fluid type and deliberate asymmetry; detected introduced 932px mobile / 60px desktop overflow | Reading texture, pacing, wrapping, and optical balance require inspection |
| Mobile form | Detected helper-content clipping with 24px scroll/client-height difference | Initial capture did not prove validation, keyboard obstruction, recovery, or submission |
| Expressive brand | Accepted large compressed type, bold color, and clipped decoration; detected introduced 1.93:1 text contrast against 4.5:1 | Local word spacing nearly fused two words; preserve the expressive scale while fixing separation |

Zero automatic findings on the clean independent fixtures does not establish a false-positive rate or overall design quality. These cases support conservative detection in a small sample.

The adversary found four implementation defects that were fixed and independently retested: a nonnumeric alignment reference could silently yield NaN; finding identity omitted contract identity; broad exceptions could suppress unrelated properties; missing selectors did not make declared contract coverage incomplete.

It also challenged the conceptual rubric: consistency can become sterile; self-authored contracts can encode a bad design; optical corrections need deliberate exceptions; and requiring memorable/distinctive visuals would penalize excellent familiar interfaces. The delivered guidance now makes expressiveness contingent on task/brand, requires a contract rationale and preserved qualities, and separates measurement from interpretation.

## Worked semantic example

[Dashboard screenshot](../assets/examples/dashboard-phone.png) and [structured review](../assets/examples/dashboard-review.json) show the independent reviewer identifying the status-priority issue. The review proposes concrete alternatives, preserves compact rows and comparison, and leaves eight unreviewed dimensions unknown. Evidence paths inside the JSON are relative to the skill directory.

```sh
node scripts/review.mjs assets/examples/dashboard-review.json
```

This passes structural validation as a **partial** review. Passing means the fields and evidence declarations are present, not that a machine has verified the interpretation.

## Remaining limits

No representative participants were recruited. No general aesthetic benchmark, native automation suite, screen-reader audit, cross-browser compatibility claim, or motion-perception study was performed. Screenshot-based judgments are hypotheses that can be refined by actual task observation. Use the [evaluation protocol](evaluation.md) to choose the missing evidence for the product under review.

## Atomic router expansion and adversarial retest

Version 2 adds 62 routed references: 6 workflow activities, 1 page-instantiation guide, 18 template entries (including an explicit specialist fallback), 9 organisms, 11 molecules, 7 atoms, 7 foundations and 3 cross-cutting conditions. Count is not a depth metric: each route must resolve a task or relationship decision, and no task needs to read the whole catalog.

The independent adversary exercised **22 realistic, manually selected task routes**, including new-product framing, identity-preserving redesign, a one-icon repair, screenshot/native boundaries, misleading “dashboard”/“dropdown” names, bulk selection, slow tabs, task hub versus wizard, persistence, receipts, partial async failure and unsupported maps/scheduling. They selected 1–5 references per scenario. This is an applicability exercise with expert-selected routes, **not classifier accuracy** or participant usability evidence. The portable [case corpus](../assets/examples/router-cases.json) records prompts, expected decisions, bad alternatives and actual chosen paths.

The adversarial review led to concrete corrections:

- Malformed catalog/plan/review collections now return structured diagnostic errors instead of throwing iteration errors.
- The selection-control route now distinguishes six consequential branches, allowed versus suggested/free values, focus versus selection and asynchronous choices.
- Overlay-to-form composition is a related route, avoiding a misleading inversion of Atomic Design containment.
- Dragging guidance separately tests non-dragging pointer alternatives and keyboard access; editor shortcut guidance preserves intended formatting commands.
- A broken Norman source URL was corrected. Historical, inaccessible, paywalled and draft sources are explicitly bounded.
- Andy Bell’s CUBE styling responsibilities remain distinct from Atomic Design levels, with no framework migration requirement.

The **25 Node tests** include the original core checks plus route integrity, actual declared edges, direct low-level entry, skipped layers, intentional workflow loops, invalid hops, hybrid plans, static evidence boundaries, malformed input, traversal/symlink escape, finding ownership, all local Markdown links and the portable 22-case corpus. `route.mjs check` also passes against the actual 62-node catalog. The skill-format validator passes.

The original seven-case browser regression was independently rerun against version 2: 11 baseline findings, zero confirmed after correction, and three explicit manual contrast reviews remain. No complete conformance claim is made.

## Andy Bell application: a clean audit can still look wrong

`npm run test:resilience` adds five captures: 300px and 420px containers at the **same 1440px viewport**, normal text, long labels with simulated 16→32px text growth, and an intentionally broken fixed-width variant. The tests verify container fit, wrapping, full text and detection of the broken variant. These are fixture contracts, not Bell-prescribed numbers or real browser zoom.

An initial version passed automated checks but made enlarged action labels into two narrow columns. Inspection of the actual screenshot rejected that composition. A text-relative flex basis lets the actions stack as text grows:

| Evidence | Before | After |
| --- | --- | --- |
| Action width × height | 187 × 258 CSS px each | 386 × 114 CSS px each |
| Composition | Two fragmented text columns | Two full-width actions in preserved order |
| Text size | 32px | 32px preserved |
| Automated findings in this scenario | 0 | 0 |

[Before screenshot](../assets/examples/resilience-before.png), [after screenshot](../assets/examples/resilience-after.png), [before geometry](../assets/examples/resilience-before-geometry.json), [after geometry](../assets/examples/resilience-after-geometry.json) and [structured semantic review](../assets/examples/resilience-review.json) preserve the evidence. The proposed 11.25em basis is a local hypothesis, not a universal aesthetic threshold. The fixture’s broken variant separately produces two text-clipping review candidates.

```sh
node scripts/review.mjs assets/examples/resilience-review.json
node scripts/route.mjs plan assets/examples/dispatch-route-plan.json
npm test
npm run test:browser
npm run test:resilience
```

This adds practical evidence of content-adaptive composition and useful semantic feedback. It does not establish real-user comprehension, screen-reader behavior, production data correctness, native automation, motion quality or general aesthetic performance. Specialist routes explicitly require further domain research.

The [independent adversary’s final report](adversarial-review-v2.md) found no remaining blocker. It records 24 tests at its final run; the 25th test packages its existing 22-case corpus for portable regression, added afterward by the main agent. Original temporary evidence locations are retained in that report for provenance; portable screenshots, geometry and examples are included above.

## Version2.1: real public designs

The [real-world iteration](real-world-evaluation.md) adds actual praised, criticized and disputed sites, source/version boundaries, scoped interactions and an explicit blocked held-out gap. It found and repaired quirks-mode overflow detection, visually-hidden text classification and best-practice/advisory presentation, and added grouped reports plus checker-version comparison metadata. The suite now contains29 Node tests and a five-check local real-world regression script alongside the existing browser suites. Historical counts above describe version2.0.

## Modern SaaS preference iteration

Package 2.2.0 adds a separately weighted modern SaaS preference profile, 64th route, evidence-backed scoring/comparison CLI and optional full-review integration. See [preference validation](preferences/modern-saas-validation.md) for the final 39-test suite, ten rendered fixture captures, independent probes and the limits of subjective scoring.
