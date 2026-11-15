# Research ledger: visual harmony and interface quality

Research reviewed 2026-11-15. This is a selective synthesis of publicly accessible articles, official guidance, and research records. The selection answers specific design/evaluation questions; it is not an exhaustive systematic literature review. Older articles are used for durable reasoning, not current browser APIs or superseded accessibility levels. Public excerpts do not imply access to an author's paid book or complete research dataset.

## Research questions and triangulation

| Question | Evidence selected | Decision in this skill |
| --- | --- | --- |
| What makes a composition understandable and pleasant? | Wroblewski, Gordon, Schoger/Wathan, Boulton; Tuch and VisAWI | Inspect hierarchy, grouping, rhythm, and character; do not substitute token regularity for aesthetic judgment. |
| What makes a system coherent without sameness? | Frost, Head, Pickering/Bell, Carbon, GOV.UK, Spectrum | Establish roles and relationships; allow intentional variation and different valid scales. |
| How should UI respond to actual intent? | Norman, Nielsen, Zhuo, Spool, Freiberg, Baymard | Challenge pattern choice and interaction behavior before polishing visual details. |
| How does design survive varying conditions? | Marcotte, Chimero, Apple, WCAG | Review recomposition, content/state growth, modality and actual usage. |
| Which claims can be quantified honestly? | WCAG, axe/Playwright docs, empirical aesthetics research | Report measured facts and authored tolerances; retain unknowns; avoid a synthetic aesthetic score. |
| What challenges a minimalist default? | VisAWI diversity, Reinecke/Gajos preference variation, Boulton micro/macro spacing, Carbon productive/expressive roles | Preserve useful density, distinctive character, and deliberate contrast. |

## Named practitioners: article → implication → limit

**P01 — Don Norman, [Signifiers, not affordances](https://jnd.org/signifiers-not-affordances/) (2008; ACM Interactions essay).** People need perceptible clues to available actions and system meaning. Applied here: inspect whether something looks actionable and whether its action matches the cue. A click handler alone does not establish discoverability. This is conceptual/practitioner guidance, not a pixel threshold.

**P02 — Luke Wroblewski, [Visible Narratives: Understanding Visual Organization](https://origin.lukew.com/ff/981/visible-narratives-understanding-visual-organization) (2003).** Visual relationships and relative weight establish an order of understanding. Applied here: write intended priorities and compare them to rendered emphasis. A measurement of area or saturation is not a validated prediction of attention; task relevance matters.

**P03 — Adam Wathan and Steve Schoger, [7 Practical Tips for Cheating at Design](https://medium.com/refactoring-ui/7-practical-tips-for-cheating-at-design-40c736799886) (2018).** Public article offers concrete tactics for type emphasis, boundaries, icons, and action emphasis. Applied here: consider weight/color as well as size, reduce redundant separation cues, respect icon proportions. These are craft tactics, not universal rules. Muted colors still need applicable contrast; a destructive action may require prominent treatment. No paid-book content is reproduced.

**P04 — Mark Boulton, [Whitespace](https://alistapart.com/article/whitespace/) (2007).** Distinguishes detail-level spacing from larger compositional space and relates space to brand expression. Applied here: identify whether a problem is legibility within a dense region or pacing between regions. More empty space is not intrinsically better; density and character are contextual.

**P05 — Brad Frost, [Atomic Design](https://bradfrost.com/blog/post/atomic-web-design/) (2013).** Describes composing interfaces from reusable parts through whole pages. Applied here: group equivalent components and fix drift at its shared source, then verify the assembled screen. Component consistency alone cannot establish good page composition. The skill does not require atomic folder names or a repository restructure.

**P06 — Julie Zhuo, [Build a Trustworthy Design Process](https://medium.com/the-year-of-the-looking-glass/build-a-trustworthy-design-process-89e964d0a3a5) (2013).** Critique explores alternatives and helps designers make intentional decisions. Applied here: state competing explanations, tradeoffs, and what should survive a repair. It is not a requirement to seek consensus or permission for every reversible edit.

**P07 — Jared Spool, [Moving from Critical Review to Critique](https://archive.uie.com/brainsparks/2011/10/27/moving-from-critical-review-to-critique/) (2011).** Separates intended goals from how a rendition achieves them and recognizes strengths. Applied here: define the task independently, preserve successful qualities, and challenge the evaluation contract itself. Counting flaws is an incomplete critique.

**P08 — Ethan Marcotte, [Responsive Web Design](https://alistapart.com/article/responsive-web-design/) (2010).** Flexible layout, media, and conditional adaptation respond to varying contexts. Applied here: inspect transitions and content stress, not only a desktop and phone snapshot. Its historical CSS examples are not a prescription to use dated implementation techniques.

**P09 — Frank Chimero, [The Web's Grain](https://frankchimero.com/blog/2015/the-webs-grain/) (2015).** Examines the web as an adaptable medium rather than a fixed canvas. Applied here: prefer compositions that reorganize with content and available space. It is an argument about the medium, not a ban on art direction or rich visuals.

**P10 — Val Head, [Designing Interface Animation](https://alistapart.com/article/designing-interface-animation/) (2016; public excerpt).** Connects motion choices across a product with character and coherent communication. Applied here: inventory motion purpose and evaluate it in time, including preferences and interruption. No single duration or easing curve is inferred as universally correct.

**P11 — Rauno Freiberg, [Invisible Details of Interaction Design](https://rauno.me/craft/interaction-design) (2023).** An observational craft essay on intent, metaphors, and interaction details. Applied here: inspect interruption, input continuity, and behavior that screenshots omit. The author explicitly frames it as observation, not a universal guideline collection.

**P12 — Sara Soueidan, [A guide to designing accessible, WCAG-conformant focus indicators](https://www.sarasoueidan.com/blog/focus-indicators/) (2021; updated 2023).** Practical treatment of focus geometry, contrast, and visibility. Applied here: inspect actual keyboard states. Verify levels and wording against the current normative WCAG text rather than treating older drafts or explanatory articles as authoritative requirements.

**P13 — Heydon Pickering and Andy Bell, [Modular scale](https://every-layout.dev/rudiments/modular-scale/) (public Every Layout chapter).** A coherent type/space approach can derive from relative relationships. Applied here: accept intentional fractional values and alternatives to fixed 4/8px scales. Mathematical consistency is not proof of perceived harmony; no paid chapters are copied.

**P14 — Kelley Gordon, [5 Principles of Visual Design in UX](https://www.nngroup.com/articles/principles-visual-design/) (2020) and [Good Visual Design, Explained](https://www.nngroup.com/articles/good-visual-design/) (2025).** Explains scale, hierarchy, balance, contrast, grouping, and examples of systematic visual choices. Applied here: inspect relationships at multiple scales. Recommendations about small numbers of type sizes are contextual teaching heuristics, not hard limits for complex products.

**P15 — Jakob Nielsen, [10 Usability Heuristics for User Interface Design](https://www.nngroup.com/articles/ten-usability-heuristics/) (1994; reviewed 2024).** Broad guidance covers feedback, familiar language, control, consistency, prevention and recovery. Applied here: include state transitions and task behavior. These heuristics do not specify a visual style and cannot certify usability without observation.

**P16 — Christian Holst, [Form Design: 6 Best Practices for Better Ecommerce UI](https://baymard.com/blog/form-design) (2021; updated 2026).** Checkout research motivates clear field relationships, labels, and form flow. Applied here: review form states with real content. Ecommerce results should not be generalized into exact conversion claims or mandatory layouts for every expert workflow.

**P17 — Lisa Charlotte Muth, [What to consider when using text in data visualizations](https://www.datawrapper.de/blog/text-in-data-visualizations) (2022; current byline).** Connects chart labels, units, annotation and reading effort. Applied here: require interpretable metrics and place explanatory context where it helps. Label placement still depends on chart density and screen size.

**P18 — Kate Moran, [How Chunking Helps Content Processing](https://www.nngroup.com/articles/chunking/) (2016; current byline).** Discusses grouping and the limits of turning memory research into interface rules. Applied here: use meaningful organization rather than a seven-item navigation cap. Visible choices and memorized items are different situations.

## Empirical evidence and limits

**E01 — Tuch, Presslaber, Stoecklin, Opwis, Bargas-Avila, [The role of visual complexity and prototypicality regarding first impression of websites](https://research.google/pubs/the-role-of-visual-complexity-and-prototypicality-regarding-first-impression-of-websites-working-towards-understanding-aesthetic-judgments/) (IJHCS, 2012).** The accessible abstract describes screenshot experiments with varying exposure times and effects on aesthetic ratings. Supports separating initial composition from task success. Does not justify a universal complexity threshold, conversion prediction, or inference that every interface should be sparse. Review scope here: publication abstract, not a fresh analysis of the underlying data.

**E02 — Reinecke and Gajos, [Quantifying Visual Preferences Around the World](https://dash.harvard.edu/entities/publication/73120379-17ff-6bd4-e053-0100007fdf3b) (CHI, 2014).** Institutional abstract reports large-scale variation in preferences for complexity/colorfulness across backgrounds. Supports resisting one universal aesthetic. Group correlations must not become stereotypes about an individual. Review scope: institutional abstract; direct page retrieval was intermittently rate-limited, so no full-paper methodological claim is made.

**E03 — Moshagen and Thielsch, [VisAWI instrument and research](https://meinald.de/forschung/visawi/) and [Facets of visual aesthetics](https://www.uni-muenster.de/OWMS/uploads/drafts_thielsch/pdf/moshagen_2010.pdf) (2010; manual 2014).** Distinguishes simplicity, diversity, colorfulness, and craftsmanship in respondent judgments. Supports evaluating both order and useful variety. The custom rubric in this skill is not VisAWI, has not been psychometrically validated, and cannot be scored as that instrument by an agent. Use the published instrument and actual participants for that purpose.

**E04 — Secondary explanation: [The Aesthetic-Usability Effect](https://www.nngroup.com/articles/aesthetic-usability-effect/) (NN/G).** Explains how appealing appearance can affect perceived usability and obscure problems in evaluation. Applied here: keep observed task performance separate from reactions to appearance. Neither “looks good” nor “passes automated checks” establishes ease of use.

## Established systems: conventions to adapt, not combine indiscriminately

- **GOV.UK:** [spacing](https://design-system.service.gov.uk/styles/spacing/) and [type scale](https://design-system.service.gov.uk/styles/type-scale/). Maintained responsive scales demonstrate coherence without an 8px-only convention. Reuse the target product's scale; do not import GOV.UK's entire visual identity.
- **IBM Carbon:** [spacing](https://www.carbondesignsystem.com/building-blocks/foundations/spacing/overview) and [type strategies](https://www.carbondesignsystem.com/building-blocks/foundations/typography/style-strategies). Shows related scales and different productive/expressive contexts. Supports selecting density and emphasis by purpose rather than applying a marketing composition to every application.
- **USWDS:** [typography](https://designsystem.digital.gov/components/typography/). Context-sensitive reading measure and typography guidance; its numerical ranges are starting points, not universal accessibility criteria.
- **Adobe Spectrum:** [colors](https://spectrum.adobe.com/foundations/color/colors). Semantic roles, contrast relationships and themes motivate role-based color review. A number of distinct RGB values is not a defect count.
- **Apple:** [layout](https://developer.apple.com/design/human-interface-guidelines/layout), [motion](https://developer.apple.com/design/human-interface-guidelines/motion.md), [UI design tips](https://developer.apple.com/design/tips/). Platform adaptation, text size and purposeful motion; native points and platform behaviors must remain distinct from web CSS units.
- **Microsoft:** [Inclusive Design Cognition Guide](https://inclusive.microsoft.design/articles/inclusive-design-for-cognition-guidebook). Motivations, goals and cognitive demands broaden review beyond appearance. An agent's assumed user persona is not a substitute for inclusive research.
- **Atlassian:** [content design](https://atlassian.design/get-started/content-design). Treats interface language as part of the system, including clarity and localization. Adopt useful principles, not another product's terminology.

## Standards and measurement implementation

[WCAG 2.2](https://www.w3.org/TR/WCAG22/) is the normative accessibility reference. [measurement-rules.md](measurement-rules.md) links individual Understanding pages for contrast, non-text cues, target size, reflow, text resizing/spacing, focus and motion, with levels and exceptions. Understanding documents explain criteria; they are not themselves the normative standard.

[WAI-ARIA modal dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) supplies an interaction model for focus and dismissal. APG patterns are implementation guidance, not a complete conformance certificate.

[Playwright accessibility testing](https://playwright.dev/docs/accessibility-testing), [screenshot API](https://playwright.dev/docs/api/class-page#page-screenshot), and [axe API](https://github.com/dequelabs/axe-core/blob/develop/doc/API.md) ground the automation. Preserve axe's distinction between violations, incomplete, passes, and inapplicable. Automated testing does not find every accessibility issue. Recheck library docs when updating pinned dependencies.

## Conflicts resolved in this skill

1. **Scale versus emphasis:** large elements attract attention, but weight, context and contrast also matter. Do not mandate title size ratios.
2. **Consistency versus diversity:** consistent role semantics can coexist with varied composition. Penalize unexplained difference, not difference itself.
3. **Whitespace versus density:** adequate grouping is required; generous space is a context-dependent choice.
4. **Familiarity versus identity:** established interaction patterns reduce ambiguity while brand expression can remain distinctive.
5. **Visual order versus optical correction:** geometrically equal boxes can look unequal. Inspect the result before removing intentional corrections.
6. **Measurement versus judgment:** deterministic checks make some facts repeatable; they do not make taste, attention, or task success objectively known.

Excluded from authority: search-result aggregators, copied paid books, generic “laws of UX” lists without context, unverified AI-generated design guides, and numerical folklore. Material pages that could not be retrieved reliably were not used to support rules. No source is claimed to endorse this skill or its custom thresholds.

## Deeper router and designer workflow research

See [research-routing.md](research-routing.md) for Atomic Design, screen/interaction idioms, proportional designer workflow, source conflicts and the expanded Andy Bell integration.

## Real interface calibration

See [real-world-evaluation.md](real-world-evaluation.md) for source-backed reception, actual capture evidence, a historical participant-failure counterexample, dissenting design criticism and explicit unavailable cases. Reception is not a ground-truth design label.

## Modern SaaS preference research

The [focused research synthesis](preferences/modern-saas-research.md) adds product-team accounts from Linear and Intercom, Geist/Radix/Atlassian role systems, Schoger/Wathan visual techniques, Bell/Pickering composition, Moran/Fessenden counterevidence and Freiberg/Kowalski interaction craft. The [preference rubric](preferences/style-scoring.md) makes the user's requested direction explicit without presenting its weights as empirical findings.
