# Quiet content and purposeful subtraction

Use during composition and the final rendered review of working interfaces, especially modern SaaS surfaces. This is a semantic check, not a word-count target. Preserve the product’s task, identity and useful information density.

## Give each visible line a job

Inspect one complete task state at a time. For each heading, subtitle, hint, badge and persistent notice, identify its contribution: object identity, scope, action, status, decision support or recovery. If it only repeats a nearby contribution, challenge it. Read the screen with the candidate removed: can a first-time user still understand what they are editing, what will happen, and how to recover? Repetition across distant contexts can be useful; repetition in one glance often adds competition. Judge it at the actual point of use after scrolling, opening an overlay or switching phone views, and in keyboard and screen-reader navigation. A heading or scope label needed there may repeat information elsewhere.

| Candidate | Check | Typical correction | Preserve |
| --- | --- | --- | --- |
| Heading plus explanatory subtitle | Does the subtitle add a constraint, scope or consequence? | Remove “Browse and manage your projects” beneath “Projects” | Project scope, permissions or an unusual workflow |
| Obvious control instructions | Does “Click Save to save changes” explain anything beyond its button? | Remove it; make the button label precise | Unsaved state, irreversible consequences and save failures |
| Marketing copy in a work area | Does a slogan help the current decision? | Remove “Every word, ready for the world” above a translation queue | Product identity and a meaningful document title |
| Repeated status badges | Are these separate scopes or copies of the same state? | Keep status beside the object or action it describes | Distinct row state, live feedback and error announcements |
| Repeated help or environment notices | Is the limitation already clearly established at this scope? | State it once persistently, repeat at a consequential commitment only if needed | Truthful local-only/storage/security limitations |
| Decorative eyebrow, section number or nested card | Does it express navigation, sequence or a distinct unit? | Remove unnecessary framing; use spacing and type roles | Reading order, real steps, group boundaries and affordance |

Short text is not automatically good text. “Manage” may be less useful than “Manage billing.” A number without its unit, a destructive icon without a name, or “Saved” after a failed storage write is a regression. Keep persistent labels, unfamiliar format guidance, provenance and uncertainty when relevant. Move secondary help to disclosure only if users can find it before they need to act; errors and essential constraints must remain available at the point of need.

## Make the surface quieter without weakening it

Reduce competing signals before changing contrast: repeated borders, nested containers, equal-weight headings, decorative icons, status pills and accent-colored secondary actions. Retain enough cues to establish grouping and operability. Do not create calmness by making small text faint, hiding useful controls, replacing labels with unexplained icons or adding empty space that separates related content. Dense tables and rich editors can be quiet when their hierarchy is clear.

After subtraction, revisit the layout. Removing a subtitle should not leave its fixed-height gap. Recheck first viewport, focused editor, empty/error state, narrow widths and keyboard reading order. Check that the task remains discoverable and the retained feedback remains truthful.

## Feedback that can be acted on

Record **location/state → exact redundant contribution → remove/merge/rewrite → information retained → verification**. Example: “The catalog header and its subtitle both announce browsing. Remove the subtitle; keep the collection name and search label. Recheck the empty search state so recovery remains explicit.” If useful, report local counts (three repetitions reduced to one) and measured reclaimed space, clearly scoped to that screen. Never use a universal maximum word count, minimum whitespace ratio or automated ‘noise score’ as proof of clarity. Automated text inventories can nominate candidates; semantic review decides whether the repetition is useful.

## Evidence and boundaries

- Therese Fessenden’s [Aesthetic and Minimalist Design](https://www.nngroup.com/articles/aesthetic-minimalist-design/) supports reducing irrelevant competition while retaining useful information and visual character. It does not justify deleting task context for a sparse screenshot.
- [DWP hint-text guidance](https://design-system.dwp.gov.uk/guidance/hint-text) supports concise help where users need it. Whether an instruction is obvious depends on audience and task knowledge.
- [GOV.UK text-input guidance](https://design-system.service.gov.uk/components/text-input/) retains labels and rejects placeholders as substitutes. Apply this safeguard when simplifying forms; do not impose the entire public-service visual style on a SaaS application.

The checklist and examples above are this skill’s synthesis, calibrated against the bespoke app reviews; they are not a validated quantitative usability scale.
