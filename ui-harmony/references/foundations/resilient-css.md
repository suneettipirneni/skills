# Resilient composition and CSS ownership

Layer: **foundations** · Route: `resilient-css`

**Use when:** A layout works only at a few widths, fights content growth, or accumulates local overrides.

**Avoid when:** Turning a scoped visual repair into a compulsory CSS methodology migration.

## Andy Bell’s contribution

[Build Excellent Websites](https://buildexcellentwebsit.es/) argues for flexible rules, fluid type/space and progressive enhancement rather than rigidly matching a few idealized frames. Apply that as a design contract: specify what should remain related, readable and operable as conditions change. A specific screenshot is evidence of one instance, not the definition of every possible layout. This does not remove the need for deliberate art direction or breakpoint changes when the task requires them.

[CUBE CSS](https://cube.fyi/) means Composition, Utility, Block, Exception. It organizes styling responsibility; Atomic Design organizes interface parts and whole instances. They are complementary, not a one-to-one map. A CUBE block may be an atom or a larger component; a composition can operate inside a small component. Do not relabel “organism” as “CUBE composition”.

## Route the repair to its owner

| Responsibility | Diagnosis | Appropriate correction |
| --- | --- | --- |
| [Composition](https://cube.fyi/composition.html) | The relation between items fails: wrap, flow, available space, alignment | Repair the layout rule that relates items, preserving independent component styling |
| [Utility](https://cube.fyi/utility.html) | A repeated single-purpose value/behavior drifts | Use the existing token/helper, with a justified semantic role |
| [Block](https://cube.fyi/block.html) | This component has a specific contextual requirement | Keep the correction scoped and let inherited/global rules do their work |
| [Exception](https://cube.fyi/exception.html) | A deliberate state/variant departs from the normal component | Name the state and keep the variation understandable; do not disguise unrelated structures as endless variants |

Bell’s documentation has its own conventions, including data attributes for exceptions. Preserve the project’s established state/variant mechanism when it expresses the same intent. Do not turn his illustrative block-size guidance into a universal CSS line-count gate, or infer that Tailwind/component CSS is inherently disallowed. Architecture changes need a concrete maintenance or user benefit.

## Behavioral acceptance, not CSS fashion policing

The following checks are **this skill’s operational synthesis**, not Bell-authored numerical thresholds:

- Put the same component in wide and narrow containers at the same viewport. If it adapts only to viewport breakpoints, inspect whether the component contract has mistaken the available space.
- Test widths around the actual wrap/failure boundary, not only named devices. Allow the browser to wrap when content needs it; evaluate the resulting reading and action order.
- Replace short labels with plausible long ones, increase text size and load fallback fonts. Fixed heights that conceal important content are evidence of a failed relationship.
- For fluid typography, record bounds and test user text growth/zoom. A `clamp()` declaration alone proves neither readability nor accessibility; a viewport-driven term can still produce poor scaling.
- Test the intended baseline when enhancements fail. Match the baseline to the product’s actual dependency model; a complex editor is not automatically expected to reproduce its full functionality without JavaScript, but essential failure/recovery must remain understandable.
- Preserve optical corrections and purposeful variation. A content-adaptive layout may produce different measured gaps; judge whether the intended relationship remains legible before enforcing equality.

**Worked feedback:** “At a 1440px viewport the inspector’s 300px container clips its two 180px actions. The fixed child widths assume page space. Let the action composition wrap, retain the existing 12px internal gap and 44px control height, and test 300/420px containers plus long labels. These values come from this fixture’s contract, not Andy Bell or WCAG.”

## Reading composition can vary without losing harmony

In [Bell’s Piccalilli article-layout case study](https://piccalil.li/blog/a-new-article-layout-and-better-options-for-advertisers/), prose occupies a restrained central track while code and media can use wider tracks. The useful lesson is matching width to content role, rather than enforcing one width on every child. Its five-column implementation is one project choice, not a mandatory article grid. The report describes practitioner decisions and feedback, not a controlled usability result.

## Route connections

- [Spacing](spacing.md) — relationship-owned rhythm and intrinsic wrapping.
- [Typography](typography.md) — role hierarchy, fluid bounds and actual text growth.
- [Adaptation](../conditions/adaptation.md) — preserve task meaning across content and available space.
- [Handoff](../workflow/handoff.md) — specify behavior and ownership with acceptance scenarios.

Only the public Every Layout Stack, Sidebar and Switcher material was inspected for this expansion; paid chapters were not used. Credit Every Layout jointly to **Heydon Pickering and Andy Bell**. Credit CUBE CSS and the cited Piccalilli article to **Andy Bell**.
