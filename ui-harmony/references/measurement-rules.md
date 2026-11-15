# Measurement rules and calibration

Separate **standards**, **platform guidance**, **authored contracts**, and **review heuristics**. Never promote a heuristic to a compliance requirement. Links below explain applicability; the normative source is [WCAG 2.2](https://www.w3.org/TR/WCAG22/).

## Accessibility measurements

| Check | Numerical requirement or test | Applicability and evidence |
| --- | --- | --- |
| Text contrast, WCAG 1.4.3 AA | 4.5:1 normal; 3:1 large. Large is at least 18pt regular or 14pt bold, approximately 24 or 18.667 CSS px | Use actual foreground/background compositing. Logos, inactive controls, incidental text have exceptions. Never round a failing ratio upward. [Explanation](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) |
| Necessary non-text cues, 1.4.11 AA | 3:1 against adjacent colors | Applies to information needed to identify components/states and understand graphics; not every decorative border. Evaluate each state against its adjacent background, not arbitrary before/after color pairs. [Explanation](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html) |
| Target size, 2.5.8 AA | At least 24×24 CSS px, subject to exceptions | Spacing exception uses centered 24px-diameter circles; also equivalent, inline, user-agent, essential exceptions. Bounding rectangles alone cannot prove irregular target size or hit areas. [Explanation](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) |
| Reflow, 1.4.10 AA | Ordinary vertical content at equivalent 320 CSS px width; horizontal content at equivalent 256 CSS px height | Necessary two-dimensional content may be excepted locally. Do not hide overflowing text or remove features to make the metric pass. [Explanation](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html) |
| Resize text, 1.4.4 AA | Up to 200% without loss of content/function, applicable exceptions | Real browser scaling and a 320px viewport are different tests. Changing device pixel ratio does not simulate text zoom. [Explanation](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html) |
| Text spacing, 1.4.12 AA | Survive line height 1.5×; paragraph after-space 2×; letter spacing .12×; word spacing .16× font size together | This is an override robustness test, not mandatory default styling. Apply language/script exceptions. The tool's CSS stress mode is a screening aid; manually inspect the result. [Explanation](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html) |
| Focus visibility/occlusion | 2.4.7 AA requires visible keyboard focus; 2.4.11 AA disallows the focused component being entirely hidden by authored content | Fully unobscured focus is a stronger goal. Actual keyboard/scroll testing is required; do not infer from outline CSS. [Occlusion](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html) |
| Focus appearance, 2.4.13 AAA | Qualifying indicator area at least a 2 CSS px perimeter equivalent; 3:1 change between focused/unfocused pixels, with exceptions | Do not label this AAA criterion an AA obligation. [Explanation](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html) |

Use color plus another meaningful cue where necessary; a palette passing contrast does not prove [use-of-color compliance](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html). Nonessential interaction motion can be disabled under [2.3.3 AAA](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html); automatic motion has separate pause/stop/hide requirements. Reduced-motion capture is not proof that animation respects the preference.

Apple's [UI design tips](https://developer.apple.com/design/tips/) recommend 44×44 **points** for touch controls. WCAG's enhanced target criterion uses 44×44 **CSS pixels** at AAA. These are not the same unit or universal requirement. A 16px icon can live inside a larger hit area; measure the clickable control, not the SVG.

## System measurements: only after establishing intent

| Relationship | Metric | Interpretation |
| --- | --- | --- |
| Shared edge/track | signed offset from authored reference, or peer median; maximum absolute deviation | Default 1 CSS px tool tolerance absorbs modest layout rounding. It is a local engineering tolerance, not research-derived aesthetics. A peer median can be wrong. |
| Token adherence | matching eligible values / eligible samples, plus each outlier | Define eligible role/state first. 95% says nothing about the appropriateness of the system or severity of the other 5%. |
| Group separation | directional gap `next.start − previous.end` | Negative means projections overlap; it does not prove painted occlusion. Only compare explicitly ordered pairs. |
| Grouping clarity | internal distances versus distances to the next group | Review ambiguous equal distances; do not enforce a universal 2:1 ratio. Boundaries, color, position, and content also create groups. |
| Type roles | font family, size, weight, line height, tracking by semantic role | Several sizes may be correct. Fluid sizes, fallback scripts, optical sizes, and responsive changes need contextual contracts. |
| Repeated component consistency | same-role padding/radius/type/height distributions | Compare buttons to the same button variant, not all clickable things. Fixed equal heights are inappropriate for variable-length content. |
| Responsive fit | page overflow in CSS px; affected text/control availability | A local table scroller can be intentional. Cropped decoration and clipped essential text have different consequences. |
| Capture coverage | tested scenario count / declared scenario count | Report the denominator and exclusions. More screenshots of the same state do not establish more behavioral coverage. |

Style contracts accept computed-value strings. A pixel tolerance applies only to simple `px` values, not colors, lists, percentages, or shadows. Avoid numeric contracts for fluid values unless scoped by viewport or intentionally enumerated. Inventories are descriptive and must never automatically become “too many colors/radii/font sizes” failures.

## Typography and rhythm: useful ranges, not laws

[USWDS typography](https://designsystem.digital.gov/components/typography/) suggests 45–90 characters for most reading lines and about 66 for long text, while allowing different measures for short or large text. These are starting points for suitable reading contexts, not limits for every table cell, caption, script, or phone screen. `ch` measures the zero glyph's advance; it does not count actual characters. Do not assert exact characters per line by dividing width by half the font size.

Start from an existing type/space scale. [GOV.UK](https://design-system.service.gov.uk/styles/spacing/) uses a different scale from [Carbon](https://www.carbondesignsystem.com/building-blocks/foundations/spacing/overview); [Every Layout](https://every-layout.dev/rudiments/modular-scale/) provides another coherent approach. Consistent relationships are more defensible than requiring every gap to be divisible by 8. A 1px optical correction, a 5px scale, or fractional rem values can all be intentional.

Do not turn the golden ratio, three-font limit, seven-menu-item folklore, 60/30/10 color split, fixed whitespace percentage, or “one CTA on the whole page” into a pass/fail test. Diagnose the actual relationship and consequence. Independent tasks may need equal emphasis; a monitoring interface may need more simultaneous information than a marketing page.

## When numbers are unavailable

Use observable semantic evidence: the same icon means two actions; three competing filled buttons sit in one decision group; error text appears detached from its field; title and metadata have indistinguishable emphasis; a chart has no unit or baseline context. Mark these as interpretations and state the alternative that could explain them. Do not invent measurements to make feedback sound rigorous.

## Classification and document context

[Document.scrollingElement](https://developer.mozilla.org/en-US/docs/Web/API/Document/scrollingElement) can be the body in quirks mode and can be null. A root-only width test misses some older documents. Keep page extent distinct from legitimate local scrolling and offscreen content.

The [axe region rule](https://dequeuniversity.com/rules/axe/4.14/region) is a Deque best-practice rule and also has RGAA mapping; it is not a WCAG criterion merely because axe reports it. Reports retain actual tags and classify WCAG-level results separately from advisories. This tool does not certify conformance to every tagged external standard. Visually-hidden CSS patterns and inline link contexts likewise require applicability review, not automatic visual normalization.
