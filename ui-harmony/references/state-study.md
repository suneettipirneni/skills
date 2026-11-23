# Study a design through state changes

Use this tool when the design depends on an object, reading edge, focus target or value surviving a change. It runs a trusted local Playwright specification against a rendered page, saves a viewport screenshot at each named checkpoint, and writes actual and expected observations alongside the frames. The [field atlas](fieldwork/2026-11/atlas.md) provides source examples and explains which parts depend on visual judgment.

From the skill directory, with its [browser dependencies](tools.md) installed, run either example in a fresh output directory.

```sh
node scripts/state-study.mjs --channel chrome \
  --url assets/examples/state-study/mix.html \
  --spec assets/examples/state-study/mix.mjs --out /tmp/voice-mix-study

node scripts/state-study.mjs --channel chrome \
  --url assets/examples/state-study/tools.html \
  --spec assets/examples/state-study/tools.mjs --out /tmp/canvas-tools-study
```

Open the output’s `index.html` to compare frames at a glance. Click a frame to see the full-size capture. `report.json` records the local spec path and SHA-256 for CLI runs, planned sequence, browser version, variant, viewport, route at each state, check names, expected and observed values, and the local rationale and tolerance for each anchor. Exit 0 means the declared observations passed, 1 means an observed mismatch, and 2 means incomplete evidence or an invalid invocation. Incomplete runs keep any earlier frames and failures.

## Define the sequence

Start from the [value-row specification](../assets/examples/state-study/mix.mjs) or [grouped-tooltip specification](../assets/examples/state-study/tools.mjs). Point the CLI at a local HTML file or the project’s test URL. A spec is executable project code. Put the intended actions, locators and completion signals in it. Use a test fixture for actions that change records.

- **Variants** each have a name and a CSS-pixel viewport. Optional `theme` and `motion` set browser preferences. A fresh browser context starts each variant. Use the app’s actual theme switch in a state hook when it overrides the browser setting. Set up variants independently when you need to attribute a change to one variable.
- **States** run in order within a variant. An optional async `enter(page, variant)` performs real inputs and waits for a product-specific completion signal. The example toolbar drives consecutive Tab presses and a reversal, then waits for the hint’s own active animations. For delayed work, wait for the pending indicator or application promise to settle before inspecting the result.
- **Checks** have a name, an expected string, boolean or finite number, and `read(page, variant)` returning an observed scalar. Read a visible value, focused object, selected record, rendered count or meaningful state from the product. Use native/ARIA state plus a visible cue where they could diverge. A missing required locator or unsupported observation makes the sequence incomplete.
- **Anchors** optionally track a unique visible selector’s left, right, top, bottom, centerX, centerY, width or height. Each declares a reason and nonnegative tolerance in CSS pixels. The first state establishes the baseline within that variant. Values use viewport coordinates. Keep scroll and camera position fixed for an absolute-edge contract. If a panel legitimately moves, compare its child’s inset relative to the panel in a custom check. An anchor shared across unrelated layouts is usually the wrong contract.

For an opaque button or a changing chart, a stable bounding box alone says little. Inspect the screenshot and check the actual label, state or data in the same sequence. Captures and reads happen sequentially. Only a settled fixture can support a single-state interpretation. This tool samples states, so a clean endpoint does not establish animation fluidity, frame timing or real-device performance.

## Transfer the checks to a new screen

| Design decision | Reproducible test | Inspect by eye |
| --- | --- | --- |
| A slider reads as one numerical row | Drive low, high and reversed values. Read accessible and visible values. Compare the unit-bearing edge across checkpoints. | The filled area and label remain distinguishable throughout the range. |
| One hint moves across an icon strip | Enter on keyboard, move twice, reverse, then Escape. Assert one hint, matching owner and visible text, and retained focus. | The hint appears attached to the right glyph and does not obscure its neighbor. |
| A feature deck can be interrupted | Send forward, forward, back without waiting for each transition. Wait for the component’s idle signal and check the selected item, active count and caption edge. | A card in flight does not cover a persistent action or make the next card appear to move backward. |
| A quiet app shell remains navigable | Visit two sibling views. Use the audit alignment group for same-depth icon or label tracks. Check the current item and where focus lands after navigation. | The selected row survives a squint test while the working content leads. Verify contrast from live colors. |
| A suggested edit remains reviewable | Select a middle passage. Reject a proposal, compare original text, propose another edit and accept. Read unaffected neighboring text and check the original’s location. | The proposed change, its author and the commitment action can be identified without reading tooltips. |
| A dark/light pair preserves art direction | Repeat the same state in both themes. Check that required images loaded and the action is visible and named. Use the existing audit for contrast. | Compare focal crop, tonal separation and whether transparent artwork disappears on one surface. |
| The step footer survives large text | Render the longest step in a short viewport, advance and go back. Check retained input and an operable Next control. Anchor the footer only where the product specifies a fixed location. | Scrolling text has room above the action, including at the last line. |

For a one-frame geometry or typography question, use an existing [audit contract](tools.md#product-specific-contracts). For glyph balance use the [optical workflow](optical-workflow.md). A static design can specify the intended sequence and show its keyframes. It cannot demonstrate correct state, real input, focus or timing.
