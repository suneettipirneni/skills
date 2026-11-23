import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { promisify } from "node:util";
import { chromium } from "playwright";

const execFileAsync = promisify(execFile);
const root = await fs.mkdtemp(path.join(os.tmpdir(), "ui-appearance-study-"));
const channel =
  process.env.UI_HARMONY_TEST_CHANNEL === "chromium" ? "chromium" : "chrome";
const cli = fileURLToPath(new URL("../appearance-study.mjs", import.meta.url));
const viewport = { width: 160, height: 100 };
try {
  const html = path.join(root, "fixture.html");
  await fs.writeFile(
    html,
    '<!doctype html><style>body{margin:0;background:white}#copy{font:20px Arial,sans-serif;color:black}</style><div id="copy">Painted font sample</div>',
  );
  const url = pathToFileURL(html).href;
  const source = path.join(root, "source.png");
  const browser = await chromium.launch({ channel });
  try {
    const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
    await page.goto(url);
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: source });
  } finally {
    await browser.close();
  }
  const base = {
    title: "Fixture",
    intent: "Compare a synthetic sample",
    url,
    source,
    viewport,
    regions: [
      {
        name: "Text",
        reason: "Inspect actual painted glyphs",
        selector: "#copy",
        type: { selector: "#copy" },
      },
    ],
  };
  async function run(name, cases) {
    const spec = path.join(root, `${name}.mjs`),
      out = path.join(root, name);
    await fs.writeFile(spec, `export default ${JSON.stringify(cases)};\n`);
    let exit = 0,
      output = "";
    try {
      const result = await execFileAsync(process.execPath, [
        cli,
        "--spec",
        spec,
        "--out",
        out,
        "--channel",
        channel,
      ]);
      output = result.stdout;
    } catch (error) {
      if (typeof error.code !== "number") throw error;
      exit = error.code;
      output = error.stdout + error.stderr;
    }
    const report = JSON.parse(
      await fs.readFile(path.join(out, "report.json"), "utf8"),
    );
    return { exit, output, report };
  }
  const baseline = await run("baseline", [{ ...base, id: "baseline" }]);
  assert.equal(baseline.exit, 0, baseline.output);
  assert.equal(baseline.report[0].status, "complete");
  const fonts = baseline.report[0].regions[1].typography.fonts;
  assert.ok(fonts.length > 0, "baseline must record painted glyphs");
  const families = [...new Set(fonts.map((font) => font.familyName))];
  const validType = {
    ...base.regions[0],
    type: { selector: "#copy", families },
  };
  const valid = await run("matching-font", [
    { ...base, id: "matching-font", regions: [validType] },
  ]);
  assert.equal(valid.exit, 0, valid.output);
  assert.equal(valid.report[0].status, "complete");
  assert.equal(valid.report[0].regions[1].typography.matched, true);

  const failures = await run("faults", [
    {
      ...base,
      id: "font-mismatch",
      regions: [
        {
          ...validType,
          type: {
            selector: "#copy",
            families: ["Definitely Not A Real Font Family"],
          },
        },
      ],
    },
    { ...base, id: "missing-selector", subject: "#does-not-exist" },
    { ...base, id: "out-of-bounds", sourceBox: [-1, 0, 20, 20] },
  ]);
  assert.equal(failures.exit, 1, failures.output);
  const [mismatch, missing, bounds] = failures.report;
  assert.equal(mismatch.status, "complete");
  assert.equal(mismatch.regions[1].typography.matched, false);
  assert.ok(
    mismatch.regions[1].typography.fonts.some((font) => font.glyphCount > 0),
  );
  assert.equal(missing.status, "incomplete");
  assert.match(missing.errors.join(" "), /Expected one visible subject/);
  assert.equal(bounds.status, "incomplete");
  assert.match(bounds.errors.join(" "), /bounds/);
  console.log(
    "Appearance study verified matching painted fonts and detected font, selector, and bounds faults.",
  );
} finally {
  await fs.rm(root, { recursive: true, force: true });
}
