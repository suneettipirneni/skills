# Real-world calibration: what held up and what broke

Evaluated 2026-11-15. This iteration inspected four live public designs at phone (390×844) and desktop (1440×1000), then ran scoped navigation/focus probes. Four other sites could not be captured; historical source discussion is separated from current observations. This is development calibration, not a representative benchmark, a ranking of companies or a participant usability study.

## Corpus and reception

| Example | Why selected | Current evidence and boundary |
| --- | --- | --- |
| GOV.UK passport entry | The [Design Museum](https://designmuseum.org/exhibitions/beazley-designs-of-the-year/designs-of-the-decades) awarded GOV.UK in 2013 | Current service-entry page, not a reconstruction of the award version. Clear prerequisite/action hierarchy and visible focus were observed. |
| Stripe homepage | [Design-community discussion](https://www.reddit.com/r/web_design/comments/hmhb5u/) includes praise and disagreement | Historical reputation is not a current label. Captured current homepage and settled keyboard-operated mobile menu. |
| Arngren catalog | [Cambridge teaching material](https://www.cl.cam.ac.uk/teaching/1415/ECommerce/ECommerce3.pdf) uses it in a poor-design discussion | Current task-specific inspection supports a responsive-fit problem but also finds useful category links and visible product/price cues. Old lecture rules about font counts or click limits were not adopted. |
| Berkshire Hathaway | [David Wang's 2020 practitioner defense](https://builtin.com/articles/berkshire-hathaway-human-centered-design) challenges judgments based on dated styling | Current annual-report and named shareholder-letter paths work in the scoped probe. The article itself disclaims insider research; its inferred audience is not participant evidence. |
| Yale / Penny Juice | Criticism and possible version drift; Yale also has [Teddy Blanks's 2007 contextual defense](https://designobserver.com/olia-lialina-relics-of-the-lost-web/) | Browser navigation timed out. No current visual verdict. These are unavailable cases, not negative results. |
| Adidas / Catbird | [Iva Olah's 2024 Baymard research](https://baymard.com/research-articles/apparel-search) praises specific category/budget navigation | Attempted only after fixes as unseen cases. Both returned403. **No successful held-out validation** is claimed. |

The [case manifest](../assets/examples/realworld/cases.json) records provenance and status. The [capture summary](../assets/examples/realworld/capture-summary.json) records timestamps, environment, coverage, errors and counts. Initial page states differ and page sizes differ; counts are not directly comparable quality measurements.

## Findings that changed the tools

### 1. Intentional accessibility text was noisy visual feedback

The initial GOV.UK report produced 12 major text-clipping candidates across two viewports. Inspection showed common hidden-label CSS, including the skip link and navigation/landmark labels. Enlarging them would damage the interface. The revised collector recognizes a narrowly defined tiny, positioned, clipped CSS pattern and reports **12 contextual hidden-pattern reviews**, rather than visible-text clipping. It retains each selector and requires purpose/focus inspection; it does not automatically approve hidden content.

A real keyboard probe after rejecting optional cookies and reloading showed the first Tab reveal a 390×40px skip link. Enter moved to`#content`. The application action was located as a link with button semantics and the expected service destination. Earlier locator attempts failed because the probe assumed different semantics/whitespace and accidentally opened search; those are tool artifacts, not failures of the service.

Evidence: [initial phone](../assets/examples/realworld/govuk-phone.png), [keyboard focus](../assets/examples/realworld/govuk-keyboard.png), [prerequisites and action](../assets/examples/realworld/govuk-task.png).

### 2. A genuinely wide page escaped the overflow check

Arngren uses quirks mode. The old collector read`documentElement.scrollWidth=390` on the phone and reported zero excess. The actual document scroller was the body, with 3495px width: **3105px horizontal excess**. Desktop excess was 2055px. The new collector uses the actual scrolling element and discloses its measurement method. Negative-control fixtures confirm that legitimate local scrollers do not become page-overflow findings.

The site still had a working electric-bicycle category link and a prominent initial bicycle/photo/price cue. The category navigation probe succeeded. Its narrow capture then showed a large blank area before specifications while relevant image/price context was outside that view. The useful recommendation is to recompose each product's identity, image, price and detail path for narrow screens while retaining category vocabulary and catalog abundance—not simply make the whole site minimalist. No purchase or participant task was tested.

A failed third-party counter image keeps readiness **incomplete**. It does not erase the directly observed root geometry or navigation, and it is not silently exempted.

Evidence: [catalog phone](../assets/examples/realworld/arngren-phone.png), [category phone](../assets/examples/realworld/arngren-task.png), [task log](../assets/examples/realworld/task-results.json).

### 3. Raw occurrence totals obscured what needed attention

Stripe's initial report contained 397 occurrences across two widths. Of 166 contrast occurrences, 162 were incomplete checks and 4 were axe-reported violations in small product-demo text. These must not be represented as 166 confirmed failures, nor dismissed because the brand is admired. Applicability of illustrative text remains contextual review.

HTML now groups occurrences by rule, kind, standard and axe result, preserving all individual evidence in expandable groups and JSON. The small-target groups include inline-text context; exceptions are still manually verified. GOV.UK's 4`region` results are classified as advisories because the axe rule has best-practice tags, rather than being presented as WCAG-tagged findings. Other tagged standards remain visible; the skill does not certify them.

The revised report is a review queue, not an aesthetic score. [Rendered grouped report](../assets/examples/realworld/grouped-report.png).

### 4. Checker changes must not masquerade as website repairs

The sites were not edited. Classification and collection changed. Reports now record the tool version in comparison metadata; different checker versions are not comparable as a design regression. The original captures and new retests are retained separately.

## What the semantic workflow preserved

**GOV.UK:** Direct language, readable text, prerequisite-before-commitment order and functional yellow focus treatment. It does not need decorative cards or brand embellishment to be considered good. The first-visit cookie state occupies substantial phone space; review it separately from the post-choice content state.

**Stripe:** Expressive color, a clear offer and primary action, and a mobile menu that becomes a readable stable surface. An early menu screenshot was taken during transition and looked overlapped; a settled capture showed coherent structure. With keyboard activation, the toggle reported expanded=true; Escape closed it and focus returned to the named toggle button. Preserve that behavior; do not recommend a redesign from an intermediate frame. [Settled menu](../assets/examples/realworld/stripe-menu-settled.png).

**Arngren:** Category links and immediate product/price cues are useful. The responsive relationship failure is independently supported; crowded appearance alone does not prove that nobody can find a bicycle.

**Berkshire:** Direct report/letter access is a real strength despite plain styling and narrow two-column wrapping. The annual-report directory and Greg Abel's 2025 letter path were reached. Replacing them with a marketing hero or hiding them behind a modern menu could worsen the chosen task. Current authorship differs from older articles, another reason to inspect the live version. [Homepage](../assets/examples/realworld/berkshire-phone.png), [current letter directory](../assets/examples/realworld/berkshire-letter.png).

[Settled task log](../assets/examples/realworld/settled-task-results.json) records only the actions actually performed. It does not claim full task completion, accessibility conformance, comprehension or conversion.

## Historical negative control: motion can defeat a strong still

[Jakob Nielsen's 2013 Siemens study](https://www.nngroup.com/articles/auto-forwarding/) reports a participant missing a washing-machine offer on an auto-forwarding surface. This is evidence about a specific historical task and timing, not today's Siemens site. The calibration guidance now explicitly requires checking changing content, interruption and user control when the claim depends on motion; a polished still and clean geometry cannot answer that question. No automated motion measurement was performed here.

## Validation and limits

The final package has 29 Node tests, including distinct axe classification, grouped evidence retention, hidden-pattern handling and changed-checker comparability. The new local browser suite covers 5 checks: standards root, quirks root, hidden-versus-genuinely-clipped content/local scrolling, focus reveal and null-scroller fallback. The existing 7-case browser and 5-case content-resilience suites passed after the collector changes.

The independent adversary reproduced the Arngren cause, challenged reputational bias and inspected the actual screenshots, reports and task logs. See its [final report](adversarial-review-realworld.md).

Unreviewed candidates remain unreviewed. No cross-site score, false-positive rate, general beauty metric or successful held-out result is claimed. Synthetic regressions verify the observed failure mechanisms; they do not replace user research or the unavailable external cases.

The [structured Arngren critique](../assets/examples/realworld/arngren-review.json) illustrates measured geometry, an explicit inference, successful behavior to preserve and an unimplemented verification plan. It validates as a partial review.
