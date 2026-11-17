---
name: before-and-after
description: Demonstrate UI changes and other visual changes with standalone before-and-after HTML sliders, looping GIFs, and static side-by-side PNGs. Use when implementing or reviewing interface, layout, styling, artwork, chart, document, or photo changes, including batches and successive revisions that must open offline without a dev server.
---

# Before and After

Produce one portable HTML file with embedded images, CSS, and JavaScript. Open it directly with `file://`; no server, dependencies, CDN, or network is needed to view it. Use the bundled generator instead of rebuilding the slider for each request. Node.js 20+ is needed only to generate the export.

## Demonstrate visual changes

Use this skill to show the result of UI changes and other visual changes whenever a before/after comparison would make the work easier to assess. Examples include layout and typography fixes, responsive redesigns, component styling, artwork edits, chart revisions, and document formatting. Capture a real baseline before making the change, then capture the same content and framing afterward. Include the comparison in the handoff instead of relying only on a written description of visible differences. For work spanning several screens or assets, create one labeled entry per meaningful change.

Keep this proportional to the task: a nonvisual code change does not need a comparison. If no real baseline exists, identify the limitation rather than fabricating a before image. For UI work, the screenshot comparison supplements functional checks; it does not prove interactions work.

## Prepare the comparison

Use the images supplied or captured for the requested work. Preserve before/after ordering. For UI changes, capture the baseline before editing, then capture the same viewport, route, scroll position, and UI state afterward. Do not fabricate a baseline when it is unavailable; ask for the missing image or identify a real existing baseline.

Pair images by the user's labels or reliable matching names, not arbitrary directory order. Ask only when pairing is ambiguous. PNG, JPEG, WebP, GIF, AVIF, and SVG files are supported. Animated images retain their animation; prefer still frames when timing affects the comparison. Download remote images to local files first if access is authorized. The generator reads local files only.

Different dimensions are supported. Both images share the before image's aspect ratio and use `contain` by default, so neither is stretched or cropped. Use `cover` only when intentional cropping is appropriate; explain meaningful framing differences in the caption.

## Export and repeat

Use [Copy-ready recipes](references/snippets.md) for the exact workflow requested:

- **One comparison:** path setup and a single renderer command with a stable ID.
- **Several pairs:** a complete JSON manifest and export command.
- **Follow-up requests:** update an existing pair and append another without rebuilding the collection.
- **Large batches:** generate a manifest from an explicit list using `JSON.stringify`.
- **GIF and PNG exports:** use each entry’s export buttons or the batch-export snippet to save one file per entry.
- **Verification:** open the actual export offline with Playwright and check image loading, keyboard controls, independent sliders, and narrow layout.

Resolve the renderer relative to this skill's directory. Reuse its HTML template and renderer rather than recreating the slider. Keep the output path and pair IDs stable across requests. `--append` merges into an existing export (or creates it); matching IDs replace pairs in place, and new IDs append. Omitted IDs generate new entries on each run. Use `--force` only for an intended full replacement. Never overwrite source images.

The viewer provides Export GIF and Export PNG buttons for every entry, search, per-pair drag/touch/keyboard controls, before/half/after buttons, optional synchronized sliders, and reset. There is no fixed pair-count limit; embedded originals increase file size, so resize very large sources only with the user's intended review fidelity in mind. Changes to the viewer's slider positions are temporary; regenerate to change saved starting positions.

## GIF and static image exports

Each entry has two offline export options:

- **Export GIF:** a looping slider sweep from all before to all after and back, with pauses at both endpoints. A progress indicator and Cancel GIF control keep the job recoverable.
- **Export PNG:** a static side-by-side image showing both complete states, with the title and before/after labels above the images.

The HTML embeds the JavaScript once for all entries, including a compact, pinned GIF encoder. No server, CDN, external worker, or npm install is needed to use either button. Agents should invoke the bundled scripts and snippets rather than rewriting or pasting the viewer implementation into each task. Read individual assets only when modifying their implementation.

Use `scripts/export.mjs` when an agent needs files for several entries; it drives the same export buttons in an offline browser. See the [batch export recipe](references/snippets.md#export-gifs-and-static-pngs) for commands. This optional helper needs an existing Playwright installation and browser; HTML generation and browser export buttons do not.

GIFs contain 60 frames, loop indefinitely, and cap the image's longest edge at 960px. PNGs cap each image panel's longest edge at 1600px. Neither upscales the source; both preserve the viewer's before-image framing and contain/cover setting, flatten transparency onto the light background, and keep labels outside the image. GIF uses a shared palette of at most 256 colors, so it can lose subtle gradients; use the HTML or PNG for detailed image review. Animated input images are captured as still frames before the slider animation is generated. Exports describe the pair, independent of current slider position or synchronized-slider settings.

## Verify and hand off

Open the exported file directly in a browser, ideally offline. Check image loading, dragging, keyboard arrows/Home/End, a narrow viewport, and at least two independent pairs for batches. Confirm captions accurately describe the evidence. Link the final HTML file and state that it opens directly without a server. Preserve the manifest if further rounds are expected. When GIF or PNG output is requested, link the actual downloaded files as well. Inspect the PNG and verify the GIF reaches both endpoints and reverses; labels and framing should match the corresponding entry.

For generator maintenance, run `node --test scripts/tests/render.test.mjs`. The optional browser check is documented at the top of `scripts/tests/browser.mjs`; it uses an existing Playwright installation, not a runtime dependency of the skill or export.

For export maintenance, run `scripts/tests/exports-browser.mjs` with the same Playwright setup as the main browser check. The vendored gifenc 1.0.3 encoder retains its MIT license and provenance in `assets/vendor/gifenc.min.js`.
