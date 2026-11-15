# Escalate a specialist interaction

Layer: **templates** · Route: `specialist`

**Use when:** Calendar, spatial map, media player, canvas, or another dominant interaction lacks adequate coverage.

**Avoid when:** Forcing a specialist surface into generic cards, forms or dashboards.

## Decision and composition

Name the missing idiom and dominant operation. This is an explicit coverage boundary, not a generic approved design. Research the platform and specialist task before prescribing mechanics; retain useful local primitive guidance meanwhile.

For scheduling: time zone, duration, recurrence, overlap and alternate agenda view. For maps: spatial selection, scale, layers and nonspatial alternatives. For media: transport, seek, captions and playback state. For boards: status transitions, ordering and keyboard alternatives to drag.

## Behavior and adaptation

Prototype the risky operation and failure case. Adaptation may change representation: calendar grid to agenda, map to result list, spatial editing to a focused inspector. Preserve domain meaning across that change.

## Evidence and repair

Record unsupported questions and required specialist sources. Do not mark specialist coverage complete because general contrast/spacing passed. Verify real tasks in the domain and input modality.

**Worked decision:** A scheduling app needs daylight-saving and recurrence behavior explored; a generic date input audit cannot validate appointment correctness.

**Source boundary:** This is a declared catalog limitation and research prompt, not source-backed specialist guidance.

## Route deeper only when relevant

- [Tools, central surface and inspector](../organisms/workbench.md) — A central working surface is useful
- [Table, list, cards and selection](../organisms/collection-region.md) — An accessible alternate list supports the task
- [Platform, input and evidence boundaries](../conditions/platform-access.md) — Input and platform constraints need explicit review

## Dragging acceptance

For authored web dragging, separately verify keyboard access and a non-dragging single-pointer alternative, such as click/tap Move controls or choosing a destination. Keyboard support alone does not satisfy [WCAG 2.2 SC 2.5.7](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html). The criterion has essential-dragging and unmodified-user-agent exceptions; inspect applicability. This is not automatically measured by the bundled audit.
