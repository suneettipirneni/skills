# DesignParser rule catalog

Each row supplies an independent UI Harmony verification procedure and the evidence needed for a decision. Use the stable rule ID with the runner. Category and rule identities follow the [DesignParser feed](https://designparser.de/data/rules.json), checked on 2026-11-28. For accessibility criteria consult [WCAG 2.2](https://www.w3.org/TR/WCAG22/). See the [runner guide](design-rules.md) for scoped checks and holistic review.

## Color (color)

| Rule ID | Rule | Verification procedure | Acceptance evidence |
| --- | --- | --- | --- |
| 60-30-10 | 60-30-10 | Map the three most common painted colors to surface, support and accent. Inspect what the accent calls attention to. | The primary task remains distinct at the chosen proportions. Record intentional deviations for imagery or brand expression. |
| saturation-control | Saturation Control | Compare saturation of the canvas, repeated controls and a critical signal in the same color model. | The signal stands out against sustained-use surfaces at viewing size. Record the role of any highly saturated background. |
| greyscale | Greyscale First | Inspect the grayscale capture. Locate the primary action and distinguish selected, error and disabled states. | Hierarchy and essential meanings survive removal of hue through text, shape, position or lightness. |
| color-scale | Color Scale | Arrange the actual palette stops in token order and apply adjacent stops to real component states. | The ramp progresses in its intended direction and adjacent functional states remain distinguishable. |
| luminance-vs-lightness | Luminance vs. Lightness | Measure the foreground and its painted background with relative sRGB luminance, including the least favorable point behind the glyphs. | Record the ratio and the applicable threshold. HSL lightness alone cannot establish legibility. |
| color-temperature-dominance | Color Temperature Dominance | Compare a warm accent on the actual cool field with the reverse treatment. Include photos and large panels. | Explain which group draws attention in each composition and whether that serves the task. |
| color-psychology | Color Psychology | Ask people from the intended audience what a color signals before revealing its label. | Record their interpretations against the intended meaning and retain an explicit cue for essential states. |
| color-naming | Color Naming | Trace a functional color to its semantic token. Change that token in a specimen and inspect the affected states in both themes. | Equivalent meanings update together while unrelated roles retain their colors. |
| wcag-contrast | WCAG Contrast Ratio | Inspect axe text-contrast results and measure necessary text and non-text pairs across states, including gradients and focus indicators. | Apply WCAG 1.4.3 or 1.4.11 to the actual role, size, adjacent colors and exceptions. Document manual coverage alongside the ratios. |
| rgb-vs-cmyk | RGB vs. CMYK | Soft-proof the screen master with the printer's destination profile and compare a physical proof of critical swatches. | Record the source and output profiles and approval or correction of visible gamut shifts. |
| simultaneous-contrast | Simultaneous Contrast | Place the same sampled swatch on each production surround and compare the pair at normal size. | Record whether the surrounds change the apparent grouping or state and whether a contextual token is needed. |
| color-constancy | Color Constancy | View the same status and brand colors on the intended device in daylight and dim ambient light. | Identify each critical state under both conditions and record the device and lighting. |
| red-green-color-blindness | Red-Green Blindness | Hide hue or simulate a red–green deficiency, then identify each status and chart series without a legend color match. | Each essential distinction has a usable text, shape, line-style or positional cue. |
| dark-mode-color-adaptation | Dark Mode Color | Switch between actual light and dark surfaces. Compare accent glare, disabled controls and text contrast. | Both themes preserve the same meaning and legible state differences. Record measured ratios for critical pairs. |
| cielab-color-space | CIELAB Color Space | Compare two measured Lab swatches under the same illuminant and observer using the named difference formula. | Report the difference and the project's specified tolerance, reference white and method. |

## Typography (typography)

| Rule ID | Rule | Verification procedure | Acceptance evidence |
| --- | --- | --- | --- |
| line-height | Line Height | Measure leading divided by font size on representative wrapped body and heading text. Recheck with text enlargement. | The chosen role-specific range preserves line tracking, accents and descenders without clipping. |
| line-length | Line Length | Count rendered characters on complete lines in a representative prose block at each width. Exclude the partial final line when evaluating a target. | The measured distribution fits the reader, script and intended measure. Record unusually short or long lines. |
| x-height | X-Height | Compare the lowercase x ink height in the actual body face and its fallback at the shipped size. | Small letters and counters remain legible at device scale, including when the fallback renders. |
| all-caps-fatigue | All Caps Fatigue | Locate sustained uppercase passages and read the longest one beside a mixed-case version. | Keep all-caps treatment where scanning and word recognition remain effective for the actual copy. |
| font-pairing | Font Pairing | Render a heading beside body text and labels in both chosen faces, including fallback and translated copy. | Roles are distinguishable and neither face overwhelms its neighbor through scale, width or stroke. |
| type-hierarchy | Type Hierarchy | Compare rendered sizes of adjacent heading and body roles on the same screen and after reflow. | The intended levels are identifiable from type and spacing. Record the scale the product adopts. |
| text-alignment | Text Alignment | Follow line starts in wrapped paragraphs, including right-to-left text. Inspect justified text for uneven word gaps. | Paragraphs have a predictable reading edge for their language and layout. |
| typeface-vs-font | Typeface vs. Font | Match a rendered role to its actual loaded family, weight and style using browser font inspection. | The intended face supplies the glyphs. Document fallback runs and any synthesized weight or style. |
| variable-fonts | Variable Fonts | Compare requested weights and axes with the font metadata and transferred bytes for representative routes. | The delivered font covers the required instances and its cost is justified against equivalent static subsets. |
| font-weight-contrast | Font Weight Contrast | Compare adjacent roles in the same family at actual size and measure their computed weight difference. | The selected weights distinguish the intended ranks on the rendered face, including at small sizes. |
| small-caps | Small Caps | Render abbreviations with synthesis disabled. Inspect the font's smcp glyphs and compare their strokes with lowercase neighbors. | The active face supplies designed small capitals where the typography depends on them. |
| ligatures | Ligatures | Render fi, fl and ambiguous identifiers with the chosen feature settings at the final size. | Joined glyphs avoid collisions in prose and preserve character identity in code or identifiers. |
| em-vs-rem | Em vs Rem | Nest the real component twice and then change the root size. Measure its label and padding at each level. | Page-wide roles scale with the root and local proportions scale only as intended. |
| uppercase-letter-spacing | Uppercase Letter Spacing | Measure tracking relative to font size on the actual uppercase label and compare tight pairs at reading size. | The chosen tracking keeps letters distinct while retaining the word as one unit. |
| oldstyle-vs-lining-numerals | Oldstyle Vs Lining Numerals | Compare dates in prose and aligned columns of changing numbers using digits with different widths and heights. | Editorial figures blend with the text and tabular values retain their column and baseline when they change. |

## Layout & Grid (layout-grid)

| Rule ID | Rule | Verification procedure | Acceptance evidence |
| --- | --- | --- | --- |
| 8pt-grid | 8pt Grid System | Measure repeated layout gaps against the adopted eight-unit spacing scale at the component's supported widths. | Structural gaps follow the declared step or have a documented optical or responsive exception. |
| 4pt-system | 4pt System | Measure compact control insets and icon gaps against the system's four-unit step. | Fine spacing is consistent across equivalent controls without compromising hit area. |
| proximity | Proximity | Measure the gap from a label to its own control and to the next group, including a wrapped help or error state. | The intended association is closer or has another unambiguous grouping cue. |
| modular-grid | Modular Grid | Overlay the row and column tracks on the actual modules and inspect their edges with varied content lengths. | Repeated modules align on shared tracks and content can grow without collisions. |
| baseline-grid | Baseline Grid | Measure the line-box increment and compare painted baselines between peer columns after wrapping. | The intended rhythm survives mixed text roles. A multiple in CSS alone establishes only the increment. |
| active-white-space | Active White Space | Compare the action and its related information before and after reducing a prominent empty region. | The retained space communicates a boundary or focus while keeping the next needed item reachable. |
| twelve-column-grid | 12-Column Grid | Inspect the resolved grid tracks and item spans at every declared breakpoint. | The wide composition uses the intended subdivisions and collapses to useful narrower tracks. |
| manuscript-grid | Manuscript Grid | Inspect the reading column, its margins and full-line lengths on both narrow and wide pages. | The single-column composition keeps a comfortable measure and sufficient margins without horizontal scrolling. |
| padding-gap-ratio | Padding Gap Ratio | Compare the inner padding of a card with the external gutter separating that card from its sibling on the same axis. | The inset-to-gutter relationship or another visible edge clearly communicates containment. |

## Composition (composition)

| Rule ID | Rule | Verification procedure | Acceptance evidence |
| --- | --- | --- | --- |
| visual-weight | Visual Weight | Write down the intended first and second subjects. Inspect the full frame at thumbnail size, then at reading size. | The observed order serves the task. Identify the size, contrast, isolation or position that produces it. |
| rule-of-thirds | Rule of Thirds | Measure the focal point in normalized frame coordinates. Overlay thirds on each delivered crop. | Where thirds are the chosen composition, the subject remains near the intended guide and survives responsive cropping. |
| optical-center | Optical Center | Compare the object's geometric center with its painted balance inside its real frame at native size. | The object appears balanced in context. Record a justified optical offset where useful. |
| rule-of-odds | Rule of Odds | Compare a real item group at even and odd counts, including a partially filled final row. | The grouping and intended focal point survive the actual inventory without inventing filler items. |
| emphasis | Emphasis | Ask a reviewer to identify the next action before operating the screen. Include an error or secondary-action state. | The identified action matches the intended priority and supporting controls remain discoverable. |
| golden-ratio | Golden Ratio | Measure the dominant and subordinate regions, then compare the proposed split with one sized for its content. | Keep a proportional target only where both regions remain useful and visually ordered. |
| aspect-ratios | Aspect Ratios | Measure the displayed media box at every destination and inspect its visible content after fitting or cropping. | The box matches the requested delivery ratio and retains the essential subject. |
| joint-cropping | Joint Cropping | Overlay the final crop on the source portrait at each breakpoint and mark the nearest visible body joint. | The crop reads as intentional, with any cut through an elbow, wrist or knee reviewed in the final frame. |
| viewing-distance | Viewing Distance | Read the smallest critical item on the target medium from its expected physical viewing distance. | Record distance, physical size and the observed reading or recognition result. |

## Brand & Identity (brand-identity)

| Rule ID | Rule | Verification procedure | Acceptance evidence |
| --- | --- | --- | --- |
| logo-variations | Logo Variations | Render the approved lockups at favicon, compact header and full brand sizes where applicable. | The chosen mark remains recognizable and any wordmark stays legible at its smallest use. |
| logo-clearspace | Logo Clearspace | Measure from the defined logo artwork boundary to the nearest neighboring ink on each side in brand units. | All protected sides meet the brand guide's required clearance, including in compact lockups. |
| handmade-vs-polished | Handmade vs. Polished | Compare crafted and precise treatments on the same content with representative readers. | Record which treatment conveys the intended brand attributes and preserves legibility. |
| corner-radius-tone | Corner Radius Tone | Compare radius tokens and actual silhouettes across equivalent component tiers, including small and pill controls. | Peer shapes follow the intended brand language and differences communicate a role or size. |
| visual-angle-arcminutes | Visual Angle | Measure the physical height of the critical glyph or detail and the viewer's distance in the same units. | Calculate its angular extent and compare it with the medium's tested recognition target. |

## Perception & Psychology (perception-psychology)

| Rule ID | Rule | Verification procedure | Acceptance evidence |
| --- | --- | --- | --- |
| millers-law | Miller's Law | Walk the task and count which facts a person must remember across screens. Repeat with key context visible. | The person can complete the task without avoidable recall. Record the specific forgotten or externalized information. |
| hicks-law | Hick's Law | Observe comparable choice tasks before and after grouping options. Record time, errors and familiarity. | The intended choice remains findable and observed decision cost is acceptable for the audience. |
| jakobs-law | Jakob's Law | Ask an experienced user to predict the familiar control's location and outcome before trying it. | Observed behavior matches the expectation or a tested benefit justifies the departure. |
| center-bias | Center Bias | Show the realistic frame briefly and record the first noticed item across starting positions. | Any claim about attention is grounded in observed responses. Center coordinates provide placement evidence only. |
| banner-blindness | Banner Blindness | Give a realistic task requiring information from the banner-like notice without directing attention to it. | Record whether participants find and use the notice amid the surrounding page content. |
| inattentional-blindness | Inattentional Blindness | Present the critical update while a participant performs the primary task. Observe detection and recovery. | The person notices the update in time to act or can recover it reliably afterward. |
| default-effect | Default Effect | Open the first-use state, record preselected choices, change them and revisit the step. | The defaults reflect the user's likely intent, and changing or declining them works with clear consequences. |
| decoy-effect | Decoy Effect | Compare plans on the attributes users actually need. Repeat a choice with and without the dominated option. | Each offered plan has a defensible use or the choice presentation is revised. Document observed shifts separately. |
| peak-end-rule | Peak-End Rule | Follow a full journey through its hardest step and completion. Ask for immediate and later impressions. | The difficult moment is recoverable and the ending makes the outcome clear. Report participant responses. |
| subitizing | Subitizing | Briefly expose the real quantity displays without labels and ask readers to report the count. | The required quantities are read accurately or an explicit number or grouping supports larger sets. |
| von-restorff-effect | Von Restorff Effect | Present the item among its actual peers and ask which one stands out and why. | The intended exception is identifiable and conveys its meaning with a cue that survives loss of hue. |
| chunking | Chunking | Ask someone to locate related items in the populated group, then inspect spacing and labels between clusters. | Visible groups match the task's conceptual units, including at narrow widths and with long labels. |
| bouba-kiki-effect | Bouba-Kiki Effect | Pair the proposed contours with the actual names and ask the intended audience which attributes each conveys. | Any sound–shape association used for branding is supported in this context and preserves recognition. |
| stroop-effect | Stroop Effect | Compare the literal label, color and icon for each status, including the same term in adjacent contexts. | The cues convey compatible meanings and a reader can identify the state from the label. |
| muller-lyer-illusion | Müller-Lyer Illusion | Compare equal-length indicators with their actual caps and with neutral ends, using the same data scale. | The endpoints convey the intended magnitude without an apparent reversal caused by the caps. |
| ebbinghaus-illusion | Ebbinghaus Illusion | Render the same marker amid large and small neighbors and compare perceived size with its encoded value. | Neighbors do not cause readers to mistake equal quantities for unequal ones in the intended task. |
| picture-superiority | Picture Superiority | Compare recognition or delayed recall of the real item with its label alone and with the proposed picture. | The picture helps the reader recognize the intended concept and the label remains available where needed. |
| reward-anticipation | Reward Anticipation | Exercise the wait, reveal and repeat actions with fast, slow and empty outcomes. | Progress and completion reflect actual work, and people can leave or stop without losing the result. |
| irradiation-illusion | Irradiation Illusion | Compare light-on-dark and dark-on-light versions of a glyph at identical dimensions and viewing size. | The pair has the intended apparent weight and edge clarity in both polarities. |
| figure-ground-separation | Figure Ground Separation | Identify the active surface, subject and actionable foreground over the busiest available background. | Boundaries and information remain legible through overlap, scroll and theme changes. |

## Interaction & Animation (interaction-animation)

| Rule ID | Rule | Verification procedure | Acceptance evidence |
| --- | --- | --- | --- |
| touch-target | Touch Target Size | Measure the interactive hit region and nearby targets. For a small region, check spacing or another applicable WCAG 2.5.8 exception. | Record the satisfied criterion or the specific exception, including units and neighboring geometry. |
| button-design | Button Design | Operate the enabled control with mouse and keyboard. Inspect focus, pressed, disabled and pending states where supported. | The named action runs once, feedback tracks the outcome and each applicable state is identifiable. |
| button-padding | Button Padding | Measure inline insets and the glyph-to-label gap for text, icon and combined variants. Inspect at actual size. | The contents appear balanced and the clickable area remains adequate when a label wraps or changes. |
| link-design | Link Design | Find an inline link among prose without relying on hue alone, then focus and activate it. Inspect supported state cues visually. | The destination and affordance are clear in context, keyboard focus is visible and activation works. |

## Icons (icons)

| Rule ID | Rule | Verification procedure | Acceptance evidence |
| --- | --- | --- | --- |
| icon-bounding-box | Icon Bounding Box | Compare viewport dimensions and painted extents of circle, square and asymmetric icons in the same slot. | The shared slot aligns while the painted shapes keep appropriate breathing room. |
| icon-alignment | Icon Alignment | Compare icon ink with adjacent text ink and the container's intended alignment at each density. | The pair reads on one track at native size and remains aligned with fallback or wrapped text. |
| icon-optical-balance | Icon Optical Balance | Inspect an asymmetric glyph with a paint-isolation overlay and compare its apparent center before and after adjustment. | The chosen position is visually balanced in the actual control and remains stable across scale factors. |
| icon-stroke-weight | Icon Stroke Weight | Compare an icon's effective painted stroke and adjacent letter stems at actual size across relevant weights. | Neither glyph nor text overpowers its peer. Record the chosen weight for the role. |

## Data Visualization (data-viz)

| Rule ID | Rule | Verification procedure | Acceptance evidence |
| --- | --- | --- | --- |
| pie-chart-problem | Pie Chart Problem | Ask readers to identify the total and compare the closest slices, then try aligned bars with the same data. | The chart communicates a meaningful whole and the task's comparisons can be answered accurately. |

## Shadows & Depth (shadows)

| Rule ID | Rule | Verification procedure | Acceptance evidence |
| --- | --- | --- | --- |
| shadow-fundamentals | Shadow Fundamentals | Inspect elevated objects together on the actual backdrop and identify the apparent light direction. | Edges and shadows agree with the intended light source and boundaries remain visible. |
| elevation-system | Elevation System | Open nested menus or dialogs and compare shadow tokens, occlusion and stacking in each state. | Higher layers read in the intended order and equivalent layers reuse their elevation treatment. |
| raised-vs-inset | Raised vs. Inset | Inspect the lit and shadowed edges of raised controls and recessed fields before and during interaction. | The apparent depth agrees with the intended affordance and remains readable across themes. |

## Print & Production (print)

| Rule ID | Rule | Verification procedure | Acceptance evidence |
| --- | --- | --- | --- |
| dieline-bleed | Dieline and Bleed | Measure artwork extension beyond each trim edge on the final production file. Overlay the vendor's cut and fold paths. | Every required edge meets the printer's bleed specification and the approved dieline aligns with the artwork. |
| cmyk-vs-pantone | CMYK vs. Pantone | Inspect the exported separation plates against the job's ink list and proof the requested process fallback. | The spot name, overprint and process substitution agree with the print order and approved proof. |
| iso-216 | ISO 216 | Read the final trim box in millimeters, normalize the orientation and compare both dimensions with the ordered A-series size. | Both edges meet the declared production tolerance. A matching aspect ratio alone is insufficient. |
