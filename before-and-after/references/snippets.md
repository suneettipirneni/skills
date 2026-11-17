# Copy-ready recipes

Use the bundled renderer for every export; it already implements the HTML, image embedding, sliders, accessibility, and batch controls. Pick the recipe matching the request. Replace the paths and labels below with the actual inputs; do not regenerate the viewer from scratch.

## Set paths once

Run from the project being reviewed. Set `comparison_skill_dir` to the directory containing the loaded `SKILL.md`, which may differ between installations. Keep `comparison_dir` consistent across follow-up requests.

```sh
comparison_skill_dir='/absolute/path/to/before-and-after'
comparison_dir="$PWD/artifacts/visual-review"
mkdir -p "$comparison_dir/images"
```

Place or capture source images in `images/` using the names in the selected recipe. These commands assume the supplied images already exist; never substitute invented before images.

## One comparison

Use a stable ID even for one pair so later requests can update it. Here the inputs are `images/desktop-before.png` and `images/desktop-after.png`.

```sh
node "$comparison_skill_dir/scripts/render.mjs" \
  --before "$comparison_dir/images/desktop-before.png" \
  --after "$comparison_dir/images/desktop-after.png" \
  --id desktop \
  --title 'Desktop redesign' \
  --output "$comparison_dir/comparison.html"
```

## A batch of comparisons

Write the manifest with a quoted heredoc so shell substitutions cannot alter its contents. Image paths resolve relative to this JSON file. Extend `pairs` with one explicitly matched entry per comparison.

```sh
cat > "$comparison_dir/comparisons.json" <<'JSON'
{
  "title": "Visual review",
  "description": "Desktop and mobile changes",
  "pairs": [
    {
      "id": "desktop",
      "title": "Desktop collection",
      "before": "images/desktop-before.png",
      "after": "images/desktop-after.png",
      "caption": "Same viewport, scroll position, and UI state.",
      "beforeLabel": "Before",
      "afterLabel": "After",
      "fit": "contain",
      "position": 50
    },
    {
      "id": "mobile",
      "title": "Mobile collection",
      "before": "images/mobile-before.png",
      "after": "images/mobile-after.png"
    }
  ]
}
JSON
node "$comparison_skill_dir/scripts/render.mjs" \
  --manifest "$comparison_dir/comparisons.json" \
  --output "$comparison_dir/comparison.html" --append
```

`--append` creates an export if absent and merges if it exists. Stable IDs make this recipe safe to rerun without duplicating pairs. It retains unrelated existing pairs. To intentionally rebuild from only this manifest, use `--force` instead of `--append`.

Only `before` and `after` are required per pair. `position` is the initial percentage of **before** revealed on the left, from 0 to 100. `fit` accepts `contain` (default, no cropping) or `cover` (intentional cropping). Every provided ID must be nonempty and unique within the manifest.

## A follow-up request: update one pair and add another

Keep the same ID to replace a pair in place. Use a new ID to append. This example compares the original desktop baseline against revision 2 and adds a settings comparison. To compare revision 1 against revision 2 as a separate historical entry, give that pair a new ID and use revision 1 as its `before`.

```sh
cat > "$comparison_dir/round-2.json" <<'JSON'
{
  "pairs": [
    {
      "id": "desktop",
      "title": "Desktop collection · revision 2",
      "before": "images/desktop-before.png",
      "after": "images/desktop-after-v2.png",
      "caption": "Original baseline compared with revision 2."
    },
    {
      "id": "settings",
      "title": "Settings",
      "before": "images/settings-before.png",
      "after": "images/settings-after.png"
    }
  ]
}
JSON
node "$comparison_skill_dir/scripts/render.mjs" \
  --manifest "$comparison_dir/round-2.json" \
  --output "$comparison_dir/comparison.html" --append
```

Omitting top-level `title` and `description` preserves the existing document heading. Include them only when the user wants to change it. Replacing a pair replaces its metadata too, so include any caption, labels, fit, or initial position that should carry forward. Unchanged pairs use their already embedded images; only incoming pairs need local sources. Omitted IDs get fresh generated IDs and will create another pair on every run.

## Generate a large batch from a known list

When the caller already has structured inputs, build the manifest with `JSON.stringify` rather than hand-escaping filenames. This alternative uses an explicit list of stems; do not pair unrelated directory entries by their sort order. Run in the same shell as the path setup above.

```sh
node --input-type=module - "$comparison_dir" <<'JS'
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const directory = process.argv[2];
const screens = [
  { id: 'desktop', title: 'Desktop collection' },
  { id: 'mobile', title: 'Mobile collection' },
  { id: 'settings', title: 'Settings' }
];
const manifest = {
  title: 'Visual review',
  pairs: screens.map(({ id, title }) => ({
    id,
    title,
    before: `images/${id}-before.png`,
    after: `images/${id}-after.png`,
    fit: 'contain',
    position: 50
  }))
};
await writeFile(join(directory, 'comparisons.json'), JSON.stringify(manifest, null, 2) + '\n');
JS
node "$comparison_skill_dir/scripts/render.mjs" \
  --manifest "$comparison_dir/comparisons.json" \
  --output "$comparison_dir/comparison.html" --append
```

## Export GIFs and static PNGs

For a manual export, open `comparison.html` directly and click **Export GIF** or **Export PNG** on the desired entry. GIF sweeps back and forth; PNG shows both states side by side. Both work offline. The same HTML includes the JavaScript once for every entry, so agents should reuse these recipes rather than regenerate the implementation.

For all entries, use the bundled helper with an existing Playwright installation. `--deps` points to that project's `package.json`; it does not install or modify its dependencies. The default browser is installed Chrome; use `--browser chromium` for a Playwright Chromium installation.

```sh
node "$comparison_skill_dir/scripts/export.mjs" \
  --input "$comparison_dir/comparison.html" \
  --output-dir "$comparison_dir/exports" \
  --format both \
  --deps '/absolute/path/to/project-with-playwright/package.json'
```

To export just one entry as a GIF:

```sh
node "$comparison_skill_dir/scripts/export.mjs" \
  --input "$comparison_dir/comparison.html" \
  --output-dir "$comparison_dir/gifs" \
  --format gif --id desktop \
  --deps '/absolute/path/to/project-with-playwright/package.json'
```

Use `--format png` for only static images. The helper processes entries sequentially, opens the HTML using `file://` with networking disabled, and prints each saved path. Output names include the entry order and a safe version of its ID, such as `01-desktop-before-after.gif`. Existing outputs are protected; add `--force` only for an intended replacement. After changing the source images, regenerate the HTML before exporting again. Older HTML without export buttons must also be regenerated using the current renderer.

## Check the export with an existing Playwright session

Use this in a Node environment that already has Playwright and an installed browser. Adapt the launch options to that environment. `comparisonFile` is the absolute path to the generated HTML. This checks the actual deliverable using `file://` with networking disabled; no dev server is started.

```js
import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import { chromium } from 'playwright';

const comparisonFile = '/absolute/path/to/artifacts/visual-review/comparison.html';
const browser = await chromium.launch();
try {
  const context = await browser.newContext({ offline: true });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(pathToFileURL(comparisonFile).href);
  await page.waitForFunction(() => document.images.length > 0 &&
    [...document.images].every(image => image.complete && image.naturalWidth > 0));

  const sliders = page.locator('input[type="range"]');
  assert.ok(await sliders.count() > 0);
  const first = sliders.first();
  const secondInitial = await sliders.count() > 1 ? await sliders.nth(1).inputValue() : null;
  await first.focus();
  await page.keyboard.press('Home');
  assert.equal(await first.inputValue(), '0');
  await page.keyboard.press('End');
  assert.equal(await first.inputValue(), '100');
  if (secondInitial !== null) assert.equal(await sliders.nth(1).inputValue(), secondInitial);

  await page.setViewportSize({ width: 320, height: 740 });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  assert.deepEqual(errors, []);
} finally {
  await browser.close();
}
```

Also inspect the images and drag behavior visually; passing this check does not establish that the correct before/after images were paired. Hand off a clickable link to `comparison.html`, stating that it opens directly in a browser offline. The JSON and source images are useful for future revisions but are not needed to view the exported file.
