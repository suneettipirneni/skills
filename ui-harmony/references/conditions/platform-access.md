# Platform, input and evidence boundaries

Layer: **conditions** · Route: `platform-access`

**Use when:** Native, screenshot-only, canvas or accessibility behavior changes the available evidence.

**Avoid when:** Pretending DOM tools measure every interface or every input modality.

## Decision and composition

Choose tools from the surface. Rendered web permits DOM/axe/geometry plus interaction; screenshots permit visible composition only; native requires native units, trees and platform behavior. State the evidence boundary before assigning numbers.

Consider keyboard, touch, pointer, assistive technology, large text, safe areas, reduced motion and platform navigation. Review platform idioms when adapting sheets/popovers/inspectors instead of importing web behavior blindly.

## Behavior and adaptation

Operate relevant interactions and inspect focus/announcements with suitable tools. A screenshot cannot prove hit area, actual text contrast on dynamic backgrounds, semantic labels, persistence or keyboard support.

## Evidence and repair

Use points, dp, CSS px or image pixels with explicit provenance; never convert without known scale. Mark unavailable checks unverified rather than passing. A complete visual review can coexist with incomplete behavioral coverage.

**Worked decision:** A native inspector screenshot supports optical review of grouping; it cannot establish whether VoiceOver can reach its controls or whether its sheet restores focus.

**Source boundary:** [Apple popovers](https://developer.apple.com/design/human-interface-guidelines/popovers/) supplies platform-specific adaptation guidance; [APG](https://www.w3.org/WAI/ARIA/apg/patterns/) applies to web widgets, not native trees.

[Reference calibration](../conditions/reference-calibration.md) tests the critique against praised, criticized and disputed designs without treating reputation as ground truth.
