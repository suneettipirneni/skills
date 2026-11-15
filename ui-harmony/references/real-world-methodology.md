# Real-site calibration corpus: independent adversarial review

Research date: 2026-11-15. This is a purposive calibration corpus, not a representative benchmark, a usability study, or classifier accuracy evaluation.

## Method constraints

- Freeze each case's task and relevant audience before looking at audit counts. Record source reception separately from current findings. Good/bad belongs to a dated task or design version, not an entire domain.
- Preserve viewport, region, language, cookie state, load readiness, date, browser and asset failures. First-visit cookie overlays are real UI but should not stand in for the settled content experience. Evaluate both when they change the task.
- Ratings must survive contradictory evidence: an acclaimed site can have accessibility barriers; an unfashionable directory can support its task well. Historical criticism may be obsolete. Award criteria differ from task usability.
- Compare confirmed relationships, not finding totals. Page length, DOM nodes, repetition, intentionally offscreen content, pseudo-elements and decorative demonstration UIs drive noise. Missing captures are missing evidence, not successes.
- Retain strengths, necessary variation and domain content. A generic spacious card redesign is not automatically an improvement to a dense catalogue or shareholder directory.
- The selected GOV.UK/Stripe/Arngren/Yale/PennyJuice/Berkshire set is useful for aesthetic bias and version drift. Four frequently mocked legacy sites overweight that niche; do not generalize to all product UI. Later add a normal polished ecommerce failure and a task-specific positive observation rather than merely another visual-award homepage.
- If iteration is calibrated on all six cases, these become development cases. Reuse demonstrates regression, not held-out generalization. Keep at least one later site unseen until rules are fixed.

## Positive sources

**GOV.UK, Design Museum, 2013 award.** Museum retrospective confirms overall winner and praises clarity. https://designmuseum.org/exhibitions/beazley-designs-of-the-year/designs-of-the-decades . Official dated announcement April16,2013: https://www.gov.uk/government/news/govuk-wins-design-of-the-year-2013 . Historical recognition supports corpus inclusion; it does not certify the current passport page or every current state. A public-service page can be harmonious without visual spectacle.

**Task-specific positive apparel navigation, Iva Olah/Baymard, July23,2024.** https://baymard.com/research-articles/apparel-search documents participant approval of Adidas sport navigation and Catbird's budget-oriented category. This is a better task-grounded positive source than generic aesthetic acclaim. Findings concern tested versions and study tasks; sample behavior is not a universal browsing percentage. Could add one current site as a held-out task check.

## Criticized and contested sources

**Siemens UK carousel, Jakob Nielsen, January19,2013.** https://www.nngroup.com/articles/auto-forwarding/ documents one participant failing to find the relevant washing-machine promotion. Timed rotation and uninformative labels undermined large visual prominence. The current Siemens site cannot inherit the verdict. Use the published historical screenshot and behavioral account as an archived mechanism case, not a live bad-site label.

**Best Buy/REI mobile homepage scope, Christian Holst/Baymard, February17,2016.** https://baymard.com/research-articles/mobile-homepage-usability documents misleadingly narrow product coverage in tested mobile homepages. Current sites may have changed. This challenges visually clean interfaces that fail to communicate the available range, a semantic weakness geometry cannot settle.

**Craigslist / Bloomberg Design2016 / Adult Swim, Kate Moran, November5,2017.** https://www.nngroup.com/articles/brutalism-antidesign/ distinguishes raw aesthetics from disorienting interaction. Craigslist is a historical influence, not automatically bad. Bloomberg's provocative style may suit a designer audience; Adult Swim receives context-dependent praise for retaining hierarchy/navigation. This is practitioner critique, not comparative experimental ranking. A useful contested source, but old versions require labels.

**Yale counterevidence, designer Teddy Blanks, September1,2007.** https://designobserver.com/olia-lialina-relics-of-the-lost-web/ discusses the school's editable wiki positively as personal and considered within vernacular web history. This directly challenges internet worst-website lists. It does not prove admissions findability or contemporary accessibility. Current school site fetch timed out in this reviewer's web tool; parent browser capture should confirm its current self-described wiki purpose. Test public admissions task separately from community authorship/identity.

**Berkshire opposed reception.** David Wang, April12,2020, https://builtin.com/articles/berkshire-hathaway-human-centered-design praises the shareholder-information directory while explicitly acknowledging lack of insider design research. Treat his audience model as interpretation. Nora Dunne, November12,2010, https://www.csmonitor.com/Technology/2010/1112/4-ugly-websites-from-companies-that-should-know-better/Berkshire-Hathaway quotes agency founder Gabriel Shaoolian criticizing absent branding/social sharing. Search excerpt retrieved; direct open403. Criticism reflects a marketing frame, not observed shareholder task failure. Current official https://www.berkshirehathaway.com/ lists reports, SEC filings, meetings and letters: a concrete basis for an information-retrieval task. Neither profitability nor plainness establishes good UX.

## First actual tool findings

Read initial GOV.UK and Stripe reports and phone viewport screenshots, plus Arngren phone screenshot.

GOV.UK generated96 small-target candidates and12 major text-clipping candidates across two viewports. Clipping selectors include a skip link, hidden navigation heading, search/button label spans and footer heading. Intentional accessible-only content needs a distinct diagnostic and focus-state check, not an instruction to enlarge/wrap all hidden labels. Collect explicit computed clip/clip-path/position evidence; do not suppress all small boxes or assume every sr-only class is safe.

Stripe generated216 small-target candidates plus162 inconclusive contrast checks, compared with4 contrast-violation nodes. Decorative product demos and carousel cards require contextual inspection. Report grouping and a separate incomplete-results category are necessary for actionable feedback. Preserve raw instances; do not turn a clean grouped summary into hidden coverage.

GOV.UK's4 axe:region instances are best-practice findings. Expose axe tags so users do not read all accessibility entries as WCAG failures. The report currently caveats certification globally but lacks this local distinction.

Phone captures show: GOV.UK's substantial first-visit cookie region dominates first fold; Stripe has prominent brand/art direction and repeated signup actions; Arngren has dense visible products/prices but page content clipped horizontally. These are observations, not measured user outcomes. Do not dismiss Arngren's recognizable catalogue or treat Stripe's polish as proof that the product task is obvious.

## Confirmed false negative: quirks-mode root overflow

Independently launched isolated Chrome against Arngren at390×844. Actual values: `compatMode=BackCompat`, `scrollingElement=body`, `innerWidth=390`, `documentElement.clientWidth=390`, `documentElement.scrollWidth=390`, `body.scrollWidth=3495`, `scrollingElement.scrollWidth=3495`; root and body overflow are visible. The audit's use of documentElement alone misses3105px of horizontal extent. Script: `probe-arngren.mjs`. Correct measurement must account for document.scrollingElement and defensible null fallback, not maximum child rects (intentional carousels extend offscreen). Add standards-mode and quirks-mode fixtures. API reference: https://developer.mozilla.org/en-US/docs/Web/API/Document/scrollingElement .

Arngren's readiness incompleteness stems from a broken third-party counter GIF, while catalogue content is captured. Keep the failure evidence and explicitly assess its impact rather than discard the useful screenshot or pretend all assets loaded. Yale timed out with zero captured cases; no automated findings means no evidence, not good design.

Berkshire phone image supports a narrower critique than 'dated': long link labels wrap in narrow two-column cells with large row-height consequences, but distinct report and shareholder-letter links remain visible with dates. Preserve direct textual access. A one-column narrow layout may improve scanning but must be compared with the current density and task. Current annual-letter task also needs distinction between Warren Buffett and Greg Abel; do not assume the newest letter must be under Buffett's archive merely because historical reviews name him.

## Review of the revised tool

Read staged collect/analyze/report changes. New collection uses actual document scroller and discloses compatibility mode/fallback. Explicit tiny clipped positioned CSS patterns are annotated, retained for semantics/focus review, and no longer become generic clipping/target repair demands. Inline-text target context supports exception review without automatic exemption. Axe WCAG tags versus best-practice advisories and incomplete-result categories are exposed. HTML groups repeated occurrences and preserves every raw finding inside expandable groups. These address actual feedback applicability rather than improve an artificial score.

Independently ran the25 current unit tests successfully and four isolated Chrome collector fixtures (`collector-regression.mjs`, output `collector-regression.json`): quirks root excess detected3113px; legitimate local scroller leaves page overflow0; intentional hidden skip link distinguished from a20×10px genuinely clipped paragraph; hidden native checkbox detected with inset(50%). The last fixture prompted wording that accepts a visible associated proxy/control with clear focus rather than necessarily revealing the native checkbox itself. This is a review candidate, not automatic accessibility approval.

Grouping is meaningful but cannot compress causal understanding: hundreds of region occurrences may share one missing landmark; multiple contrast nodes may be repeated decorative demos; distinct user tasks can share a rule. Do not equate groups with distinct defects. Retain exact instances and task consequences.

## Suggested held-out site and task

Source: Iva Olah, Baymard, July23,2024, https://baymard.com/research-articles/apparel-search . Exact linked case https://baymard.com/ux-benchmark/case-studies/adidas identifies adidas.co.uk, last reviewed July2024; no premium scores were read. Target https://www.adidas.co.uk/ ; task find men's hiking clothing using the navigation. Read-only discovery, no cart/purchase. Historical positive observation is a reason to choose the task, not proof of current success. Freeze tool changes before capturing to distinguish the next test from calibration.
