# Independent optical alignment review

Status: primary-source research, independent arithmetic/browser probes, comparator/review validation and guidance review complete for the staged implementation. Review target: `/private/tmp/ui-harmony-optical`. No builder files edited.

## Core objection

Optical alignment is not a new coordinate to compute. Ink bounding-box center, thresholded coverage centroid, glyph baseline, cap-height relationships, semantic base-symbol alignment and perceived emphasis answer different questions. A review-only paint-balance diagnostic is useful if it exposes these disagreements without converting one into the correct target.

The dangerous workflow is: measure centroid delta→negate it→declare polished. Correct workflow: identify what must appear aligned and why→inspect supported natural-size evidence→compare plausible local variants alongside adjacent content and sibling controls→retain the smallest justified correction→recheck clipping, target/focus geometry and other sizes/states. A zero delta is neither necessary nor sufficient. Unchanged alignment may be the correct outcome.

## Verified primary sources and transfer boundaries

1. [Apple, SF Symbols HIG](https://developer.apple.com/design/human-interface-guidelines/sf-symbols.md), current page with2025 change log, accessed2026-11-16. Scales are relative to SF cap height; scale changes emphasis without changing matched text weight. Custom symbols can use negative side margins to align a base shape when badges extend width. This is direct counterevidence to centering all visible paint. Apple also asks designers to check rendering in context and provides script-specific variants. Transfer principle: distinguish base symbol, badge and neighboring text. Do not transfer an SF margin or scale numerically to arbitrary SVGs or redistribute restricted Apple symbols.
2. [IBM, UI icon design](https://www.ibm.com/design/language/iconography/ui-icons/design/), page updated2026-11-05. The32px grid and2px padding/stroke rules belong to IBM's icon family. Its own guidance permits fine tuning and extending beyond key shapes to preserve metaphor. Transfer principle: coherent family and meaningful silhouette outweigh forced bounding-box normalization. Do not convert IBM pixel-grid construction advice into a prohibition on fractional CSS placement across every library.
3. [IBM, app-icon design: Alignment](https://www.ibm.com/design/language/iconography/app-icons/design/), updated2026-11-05. Plex app icons remain centered within a grid but can receive optical horizontal correction; one illustration specifically shifts type1px left. This is an example in a named grid/typeface context, not evidence for a universal1px correction. IBM app icons are rights restricted. Baseline and typography treatment remain separate from raster centroid.
4. [Google, Material Symbols guide](https://developers.google.com/fonts/docs/material_symbols), accessed2026-11-16. Weight, grade and optical-size axes change appearance differently. Optical size20–48 adjusts stroke treatment as size changes; grade permits more granular emphasis adjustments, including reduced glare for light symbols on dark backgrounds. Transfer principle: translation is only one possible correction; choosing the appropriate size/weight/asset variant may solve the problem. Do not blindly prescribe Material axis values for other icon families. The page contains differing default-size statements across sections; avoid citing one universal default.
5. [Mary Catherine Pflug, Monotype: Lack of Overshoots](https://foundrysupport.monotype.com/hc/en-us/articles/360029597112-Lack-of-Overshoots), updated2026-03-05. Rounded/pointed letterforms require optical compensation beyond flat-letter alignment guides; exact treatment depends on style and intended point size and requires eye judgment. Transfer principle: unequal measured edges can be correct. Do not manually resize letters in a shipped font or impose one overshoot percentage on UI glyphs.

Known-designer leads checked but not treated as fully read evidence: Tobias Frere-Jones's [Typeface Mechanics001](https://frerejones.com/blog/typeface-mechanics-001/) returned no readable content; Ian Moore's [Making Geometric Type Work](https://typographica.org/on-typography/making-geometric-type-work/) and Anton Studer's [Math & Optics in Type Design](https://typographica.org/on-typography/is-what-i-see-what-i-get-math-and-optics-in-type-design/) returned403. Their reputations or third-party excerpts do not substitute for direct verification. Monotype's actual primary article supplies the supported overshoot principle above.

## Required diagnostic semantics

- Call it **binary coverage centroid**, not visual center, optical center or center of mass of perceived salience. It counts occupied pixels equally, ignoring luminance, color emphasis, semantic importance and contextual illusions.
- Bounds center and centroid should both be shown; their disagreement is useful evidence, not a defect score. Signs/units/reference origin must be explicit. Use pixel-cell centers for centroid; outer cell edges for bounds/insets; verify1×/2× equivalence.
- Allow a semantic subpart (e.g. folder body) inside an ancestor reference frame. Do not hide the ancestor frame while isolating the part. Reject the reverse relationship where isolating paint contains the nominated reference unless behavior is explicitly supported.
- Show threshold sensitivity using fixed recorded thresholds. If some thresholds produce no paint, preserve those unknown results. Never silently drop them, renormalize or report stable center from the remaining sample alone.
- Include cropped-mask warnings and natural-size original alongside overlay. Crosshairs may exaggerate harmless asymmetry and hide details. The overlay is evidence markup, not a redesigned target.
- Review-only status must survive JSON, HTML summary, CLI exit semantics and comparison. An exit0 capture must not become an optical pass. Expose pending manual review count and avoid pass=true on paint-balance results.
- Retain actual size, DPR, background/theme, font/asset, content/state and threshold. Raster results do not transfer automatically across18/20/24px, normal/selected/disabled, light/dark or RTL states.

## Adversarial corpus

| Case | Expected useful observation | False-confidence risk |
| --- | --- | --- |
| Centered solid square | Bounds and centroid coincide near frame center | Arithmetic calibration is mistaken for perceptual validation |
| Right-facing triangle | Bounds center and centroid disagree | Negating either delta is presented as universally correct play-icon correction |
| Circle versus square with equal bounds | Centers agree while occupied area differs | Equal bounds or equal area is treated as equal apparent size |
| Folder base plus offset badge | Whole-group centroid shifts; base remains aligned | Tool recenters badge+base and breaks repeated folder alignment |
| Tiny distant accent | Bounds center changes more than centroid | Bounds-only diagnostic treats a semantic accent as padding error |
| Light satellite crossing threshold | Bounds/centroid/area vary or disappear across thresholds | One convenient threshold yields an unjustified confident correction |
| Same binary shape in two colors | Binary metrics match | Tool claims equal perceived emphasis despite color/contrast differences |
| Hollow versus filled form | Equal outer bounds, different coverage area | Coverage is mislabeled optical weight; selection-state emphasis normalized away |
| Clip-path cutting an otherwise centered part | Visible paint centroid shifts | Tool recommends translation when clipping is the cause |
| Rotated/anisotropically scaled frame | Axis-aligned rectangle differs from actual visual frame | Signed insets are described as true distances to a rotated contour |
| RTL mirrored directional icon | Correctly mirrored geometry and local role differ | Same signed correction copied without reinspection |
| Glyphs with descenders/overshoot | Ink bounds differ from baseline intent | All labels individually nudged to geometric center, breaking typography rhythm |
| Visible descendant override/pseudo/filter/overflow | Incomplete isolation/coverage | Reintroduces the detail audit's already-demonstrated false passes |
| Fractional origin and DPR2 | Descriptive offsets remain geometrically consistent within raster quantization | Half-pixel coordinate convention biases centroid or overlay |

Recommended acceptance: no universal optical pass; manually inspect coherent contextual rows of icons, test canonical simple shapes for arithmetic, intentionally asymmetric shapes for review status, unsupported isolation for incomplete status, and at least one actual app component for applicability. Retain contrary outcomes and deliberate offsets.

## Before/after comparability

Treat viewport/DPR, task/content/state, raster method, threshold set and reference meaning as controlled conditions. A font, asset variant, weight, scale or frame may legitimately be the intended intervention; require it to be reported rather than refusing every useful design change. Conversely, silently comparing different selected states, text strings, backgrounds or reference regions produces misleading deltas. Empty samples and incomplete evidence cannot disappear from the paired table. Neither lower absolute centroid offset nor reduced area establishes improvement. Undeclared changed context should produce an explicit comparability limitation, not automatic normalization.

Prepared `fixture.html` contains eight original synthetic cases for browser verification: square, triangle, equal-bounds circle, base+badge, threshold-sensitive light satellite, clipped circle, hollow square and fractional origin. These are arithmetic/semantic counterexamples, not copyrighted symbol copies or normative visual targets.

## Implemented tool: independent evidence

`pure-probe.mjs` passed9 arithmetic/status checks on the staged implementation: asymmetric bounds and centroid differ, DPR2 replication preserves CSS-unit bounds/centroid/area, fractional origin does not invent a delta, threshold-sensitive paint changes the result, empty masks remain unverified, and nonempty balance has review-required status with no pass field.

`browser-probe.mjs` captured20 cases:12 review-only profiles;4 expected incomplete measurements for clipping or reverse reference containment;4 additional static SVG cases marked incomplete because original/restored paint differed. These are not optical failures, nor do we certify the missing measurements. `drift.json` records actual changes: badge1×15pixels/max channel delta13; fractional-origin1×138pixels/max26; badge-base1×15pixels/max13; circle2×16pixels/max42. The fractional and badge-base cases changed some thresholded masks, so silently relaxing the guard is unjustified.

The probe's initial zero-centroid expectation for a badged base was too strong: the badge occludes part of that base. At2× the base bounds remained centered, but visible-contribution centroid was(-0.202,+0.170)CSSpx. This is correct evidence of the method's limitation, not an arithmetic defect. Guidance should say to distinguish intrinsic asset geometry from visible contribution; isolate an unoccluded variant if that is the intended question, retaining the full composite for contextual judgment.

Natural-size original and overlay were actually rendered and inspected in `triangle-overlay.png`. Both load visually and the annotation exposes bounds/centroid disagreement without presenting a preferred correction. JavaScript `contentDocument` access to the file-based embedded SVG returned null, but the screenshot proves the overlay rendered; do not confuse cross-origin DOM access with missing visual output.

### Workflow validation findings sent for repair

`workflow-probe.mjs` found checks-object and null-check crashes, decisions-object iteration crash, and acceptance of a sensitivity sample with unexpected status and empty observed object. `workflow-results.json` retains exact outputs. These are input-validation concerns; normal arithmetic paths remain useful. Comparator/validator should return meaningful incomplete reasons for malformed structures, and require valid finite sensitivity measurements at the recorded thresholds.

## Guidance review

The draft `optical-alignment.md` has no conceptual blocker: it separates boxes/paint/centroid/perception, treats baseline as typographic rather than rectangle-bottom, protects deliberate asymmetry and same-family rhythm, distinguishes optical size/weight/grade, labels the example as illustrative, and preserves natural-size contextual verification. Add explicit physical placement hierarchy (container/group/component before glyph) and the occluded-base limitation above. Physical sides must stay distinct from logical start/end; cross-axis edge comparisons should reject. Omitted inset sides remain unconstrained, and signed protrusion must not silently become an error or an equality target.

Additional independently verified established-designer primary source: [Mark Boulton, Five simple steps to better typography—Part2](https://markboulton.co.uk/journal/five-simple-steps-to-better-typography-part-2/), April18,2005, describes hanging quotes and list markers in a gutter to create a more continuous text edge. Root's draft applies this to editorial context and correctly does not treat historical software-support comments as current guidance. This supports meaningful text-edge alignment, not moving every control label outside its box.


## Final regression result and scoped verdict

Root repaired the malformed guards and sensitivity validation. Rerunning `workflow-probe.mjs` now rejects all malformed cases with useful reasons rather than throwing; invalid sensitivity is no longer comparable. Actual captured square before/after reports remain valid under the stricter guard.

`final-workflow-probe.mjs` passed13 independent checks: actual captured1pxdelta remains descriptive; complete fixture review validates; stale digest and missing judgment stay incomplete; a recorded human accept cannot override a failed authored geometric placement contract; malformed sensitivity remains incomplete; physical edge differences retain sign; a one-sided inset does not imply whole-object containment; negative overhang remains authorable; cross-axis/logical-start/empty-inset configurations reject. Artifacts are `final-workflow-checks.json`, `comparison-results.json` and the actual `compare-before`/`compare-after` reports.

Final guidance now includes container→group→control→glyph order, physical-versus-logical edge distinction, unconstrained inset sides, signed overhang and axis-aligned transformed-bound limitations. It also includes the occluded-base caveat demonstrated by the badge fixture. No remaining conceptual blocker was found in that scoped guidance.

**Verdict:** appropriate as a descriptive review aid and authored placement checker, with explicit human judgment and incomplete evidence preserved. It is not an automatic optical-quality gate. Four of20browser profiles remained unstable on static SVG fixtures; that practical limitation must remain visible rather than being called a complete optical audit. No builder scripts or application files were modified by this reviewer. The earlier test expectation that a partially occluded base must havezero centroid offset was corrected as a harness assumption, not hidden as a product fix. The source-backed guidance supplies semantic interpretation that arithmetic alone cannot provide.
