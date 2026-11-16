# Untitled UI anchor: evidence, counterexamples and validation

Reviewed 2026-11-15. This is an authored design study, not user research or a controlled evaluation of generated outputs. Use [the applied guidance](untitled-ui.md) for design work.

## Why the previous skill could stop at basic

The entrypoint primarily specified defect repair and the smallest coherent correction. Exploration was activated by uncertain screen idiom/interaction architecture, leaving visual direction underdeveloped once the structure was settled. Composition could exit when relationships were explainable and testable. Those are useful repair criteria but permit a competent scaffold as the endpoint for broad creation.

The five authored SaaS calibration fixtures distinguish restrained, warm, ornate, sparse and faint treatments. They were explicitly documented as calibration fixtures, not premium product exemplars. Restrained and warm both receive 75/provisional; their mocked actions and generic detail reveal cannot establish interaction craft. The warm variant's wordmark disappears with its sidebar on phone. No actual disappointing production-generation transcript was available, so these findings identify a plausible mechanism rather than prove the cause of every disappointing output.

A synthetic probe of the unchanged scorer returns 98/provisional when six dimensions are rated 4 and product character is rated 2 (generic); character 0 still permits 95. This is correct preference arithmetic, not a visual assessment or evidence of measured beauty. Raising a character weight could reward unnecessary novelty. The correction is a positive generation/refinement path and reference-based craft review; the scoring weights and historical fixture results remain unchanged.

## Inspected visual references

| Source | Evidence inspected | Transfer / limitation |
| --- | --- | --- |
| [Jordan Hughes, Team management](https://dribbble.com/shots/17564827-Team-management-page-Untitled-UI) | Actual desktop/phone presentation image | Near-monochrome composition coordinates section explanation, fields, avatar/name/email groups and restrained control edges. Mobile restacks the invitation controls. The staged crop is useful for visible relationships, not complete task/accessibility evidence. |
| [Jordan Hughes, Project management](https://dribbble.com/shots/17080457-Project-management-dashboard-Untitled-UI) | Actual image | Distinct document and messaging planes, attachment details and repeated author grouping create visual richness. The purple rail and photography are optional stylistic choices. Lorem ipsum, icon-only navigation and cropped content limit production conclusions. |
| [Untitled UI Settings 01](https://www.untitledui.com/react/iframe/settings-pages/settings-01) | Live Chromium captures at 1440×1000 and 390×844; computed CSS; existing audit | Label/control tracks become stacked fields; tabs become a native select; paired names receive individual visible labels on phone. Actions stay explicit. No root overflow in these captures; that is not universal responsiveness or touch validation. |
| [Untitled UI Dashboard 01](https://www.untitledui.com/react/iframe/dashboards/dashboard-01) | Live captures at the same widths; computed CSS | Main measure/trend and supporting measures share a composition, with content previews below. Phone restacks these regions. The meaningful colors and images show that restraint need not erase content. Both captures logged React error #418; use their pixels as limited visual evidence, with no behavioral approval. |

The two live examples demonstrate different idioms; do not rank them against each other or compare a staged Dribbble canvas as if it were a CSS viewport. Public demo dates/content can change. The inspected screenshots were retained locally for this investigation; third-party images are not redistributed in the skill.

## Measured relationships, not universal tokens

In the captured Settings 01 desktop demo: the page heading starts at x=312 CSS px and editable values at x=624; the principal value track is 512px wide. The page heading is Inter 20/30px at weight600; section heading16/24px at600. Save/Cancel use14/20px at600,36px visual height and8px radius. Their computed styles include inset and external shadow layers. Name/email inputs are40px high with16/24px value text; rounded material belongs to their wrappers, so an input's computed0px radius is not a missing visible radius.

At390px, the main inset is16px and the page title retains20/30px. These are snapshot observations, not recommended minimum target sizes or a prescription to replace another product's type system. A screenshot's displayed scale cannot supply these CSS facts; the browser supplied them.

## Official implementation study

Public source pinned to [untitleduico/react commit a0e5a7a](https://github.com/untitleduico/react/tree/a0e5a7a98fd3b59cd9ec2d3ede09b7f6ac3c4c4b). Links below identify the inspected files; exact upstream implementation can evolve.

| Level / source | Observed mechanism | Applicable design feedback |
| --- | --- | --- |
| [Buttons](https://github.com/untitleduico/react/blob/a0e5a7a98fd3b59cd9ec2d3ede09b7f6ac3c4c4b/components/base/buttons/button.tsx) | Primary/secondary variants combine shallow shadow and inset ring; the primary inner edge includes a gradient. Text receives padding separate from the icon gap; small icons adjust stroke. Default loading preserves invisible children around a centered spinner. | Coordinate optical spacing and material, and test whether a loading transition changes width. Inspect both loading options; do not assume every variant preserves geometry. A microscopic edge gradient has a different role from a decorative background. |
| [Input groups](https://github.com/untitleduico/react/blob/a0e5a7a98fd3b59cd9ec2d3ede09b7f6ac3c4c4b/components/base/input/input-group.tsx) and [input](https://github.com/untitleduico/react/blob/a0e5a7a98fd3b59cd9ec2d3ede09b7f6ac3c4c4b/components/base/input/input.tsx) | Joined parts coordinate internal corners, shared seams and focus stacking; wrapper owns visual treatment. Labels, hints and invalid state compose with entry. | Evaluate the complete field, not only the input element. A 1px seam adjustment may express a systematic joined-control rule. Verify outlines remain visible and shared borders do not double. |
| [Badges](https://github.com/untitleduico/react/blob/a0e5a7a98fd3b59cd9ec2d3ede09b7f6ac3c4c4b/components/base/badges/badges.tsx) | Text-only, dot and icon variants use differentiated padding. A modern treatment retains a neutral container while assigning color to the dot/icon. | Balance visual mass and choose where status color lives; equal padding and a saturated whole badge are not automatic requirements. Keep a text label when color carries meaning. |
| [Tables](https://github.com/untitleduico/react/blob/a0e5a7a98fd3b59cd9ec2d3ede09b7f6ac3c4c4b/components/application/table/table.tsx) | Shared size context coordinates table/header/cell density; row boundaries and focus treatment are considered together. | Review density as a family, first/last-cell alignment, selected/focused rows and local overflow. A refined bordered table can be appropriate; a ban on containers would be counterproductive. |
| [Theme](https://github.com/untitleduico/react/blob/a0e5a7a98fd3b59cd9ec2d3ede09b7f6ac3c4c4b/styles/theme.css) and [theming documentation](https://www.untitledui.com/react/docs/theming) | A semantic vocabulary separates text, foreground, background, borders and interaction roles; brand palettes can be replaced. | Transfer relationships into the host system. Purple, Inter and any single radius do not themselves create polish. Preserve light/dark and state roles when changing tokens. |

The pinned repository's [MIT license](https://github.com/untitleduico/react/blob/a0e5a7a98fd3b59cd9ec2d3ede09b7f6ac3c4c4b/LICENSE) applies to that public source. It does not establish reuse rights for paid page templates or Dribbble artwork. This update includes original guidance and source links, not copied components.

## Complementary sources and deliberate limits

- [Vercel Geist materials](https://vercel.com/geist/materials): surface presets coordinate radius, fill, stroke and shadow by layer. Use this to preserve meaningful depth while keeping it restrained; it does not imply that every neutral surface must be flat.
- [shadcn introduction](https://ui.shadcn.com/docs): composable, modifiable component code supports a coherent foundation. Complete primitives still need product-specific composition and content.
- [Cloudflare application-security redesign](https://blog.cloudflare.com/new-application-security-experience/): its account of iteration centers on connected customer tasks and signals across previously separated products. This complements the aesthetic anchor with domain organization; avoid copying navigation by appearance alone.
- [Apple feedback guidance](https://developer.apple.com/design/human-interface-guidelines/feedback): feedback communicates status, results and recovery with emphasis proportional to significance. Apply that to state transitions rather than transplanting platform materials indiscriminately.
- [Karri Saarinen, Design is more than code](https://linear.app/now/design-is-more-than-code): conceptual and divergent decisions precede execution constraints. This supports opening visual exploration even after a familiar screen idiom is chosen; it is practitioner reasoning, not experimental validation of this skill.
- [Therese Fessenden, A Theory of User Delight](https://www.nngroup.com/articles/theory-user-delight/): distinguishes surface pleasure from a satisfying overall experience supported by usability. A visually finished still cannot establish that broader experience.
- [Rauno Freiberg, Invisible Details of Interaction Design](https://rauno.me/craft/interaction-design): close observation of responsiveness and continuity informs a real state-transition review. [Emil Kowalski, You Don't Need Animations](https://emilkowal.ski/ui/you-dont-need-animations) provides the counterweight: frequent interactions may benefit from immediacy.

## Tool applicability observed on the anchor

The existing `audit.mjs` ran on Settings 01 at both captured widths with `--ready h1`, explicit fixture label, no style contracts and no exemptions. It completed with0 capture errors and49 finding occurrences:18 axe violation nodes and31 review candidates/incomplete results. Those are not49 independently confirmed defects or an aesthetic score. Initial configuration incorrectly used `exceptions`; the tool rejected it. The corrected run used supported `ignore` without entries.

Representative adjudication: the captured green “Complete” upload status was reported at3.21:1 against white at14px; retain semantic color while fixing contrast. Unnamed icon buttons need accessible meaning while their visual treatment can survive. A timezone ellipsis retaining its UTC offset needs a disclosure check before being called a clipping defect. Hidden native-select proxies should not be enlarged merely because their tiny boxes trigger candidates. Other findings remain unadjudicated. Strong visual reference status cannot excuse these issues.

The audit captures geometry, CSS contracts and accessibility candidates; it cannot evaluate the layered button's optical finish, the composition's confidence or whether the experience feels delightful. The manual source/screenshot review supplies those judgments. No new universal score or weight retuning follows from this run.

At390px, a separate keyboard probe moved focus from Cancel to Save with a visible outline, opened the country listbox with Enter, then closed it with Escape and returned focus. The first attempt used an incomplete accessible-name locator; the corrected probe succeeded. An immediate dismissal sample preceded the exit animation; waiting for the settled hidden state confirmed closure. No save/upload or complete business task was tested.

## Generation evidence and remaining uncertainty

Fresh-context React generation has now been exercised on two calibration cases and two original bespoke applications, with retained initial captures, independent task probes and adversarial revisions. See [React generation validation](react-generation-validation.md) for the protocol, failures, final evidence and reusable lessons. This provides bounded evidence of the workflow in use; it is not a matched-brief old/new experiment or proof of universal aesthetic improvement. A controlled comparison with fixed task/content/budget and blinded judgments remains future work.
