// Run with Node and installed Chrome, or set UI_HARMONY_TEST_CHANNEL=chromium.
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { fileURLToPath, pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";
import { hash } from "../lib/design-rule-catalog.mjs";
const folder = await fs.mkdtemp(path.join(os.tmpdir(), "design-rule-browser-"));
const channel = process.env.UI_HARMONY_TEST_CHANNEL ?? "chrome";
const cli = fileURLToPath(new URL("../design-rules.mjs", import.meta.url));
const example = new URL("../../assets/examples/design-rules/", import.meta.url);
const good = await fs.readFile(new URL("fixture.html", example), "utf8");
const config = JSON.parse(await fs.readFile(new URL("checks.json", example), "utf8"));
const html = path.join(folder, "statement.html"),
  cfg = path.join(folder, "checks.json"),
  url = pathToFileURL(html).href;
const configArgs = ["--url", url, "--config", cfg, "--channel", channel];
const run = (...args) =>
  spawnSync(process.execPath, [cli, ...args, ...configArgs], { encoding: "utf8" });
const report = async (dir) => JSON.parse(await fs.readFile(path.join(dir, "report.json"), "utf8"));
const row = (r, id) => r.rows.find((x) => x.id === id);
try {
  const broken = good
    .replace("16px/1.5", "16px/1.0")
    .replace(
      "</main>",
      '<button style="width:12px;height:12px;padding:0" id="tiny" aria-label="Help"></button></main>',
    );
  await fs.writeFile(html, broken);
  await fs.writeFile(cfg, JSON.stringify(config));
  const all = path.join(folder, "all");
  assert.equal(run("run", "--all", "--out", all).status, 1);
  const r = await report(all);
  assert.deepEqual(r.errors, []);
  assert.equal(r.rows.length, 88);
  assert.equal(row(r, "line-height").issues.length, 4);
  const palette = row(r, "greyscale").browser[0];
  assert.ok(palette.palette.length);
  await fs.access(path.join(all, palette.grayscale));
  assert.match(await fs.readFile(path.join(all, "feedback.md"), "utf8"), /#tiny/);
  assert.equal(row(r, "aspect-ratios").passedChecks.length, 4);

  // Exercise the holistic adapters using a real reference image and local specs.
  const vp = { width: 390, height: 844 };
  await fs.writeFile(
    path.join(folder, "appearance.mjs"),
    "export default " +
      JSON.stringify([
        {
          id: "statement",
          title: "Statement",
          intent: "Check text",
          url,
          source: path.join(all, palette.screenshot),
          viewport: vp,
          regions: [
            {
              name: "Body",
              reason: "Check face",
              selector: "#terms",
              type: { selector: "#terms", families: ["No Such Font"] },
            },
          ],
        },
      ]),
  );
  const state = `export default {variants:[{name:'phone',viewport:{width:390,height:844}}],states:[
    {name:'loaded',checks:[{name:'preview present',read:p=>p.locator('#preview').count(),expected:1}]},
    {name:'focused',enter:p=>p.locator('#download').focus(),checks:[{name:'link focused',read:p=>p.locator('#download:focus').count(),expected:1}]}
  ]};`;
  await fs.writeFile(path.join(folder, "state.mjs"), state);
  await fs.writeFile(
    path.join(folder, "detail.json"),
    JSON.stringify({
      viewports: [{ name: "phone", ...vp, dpr: 1 }],
      components: [
        {
          name: "preview",
          selector: "#preview",
          parts: { frame: { selector: "$root" }, paper: { selector: "rect" } },
          checks: [
            {
              kind: "inside",
              a: "paper",
              b: "frame",
              rationale: "The page stays inside the preview.",
            },
          ],
        },
      ],
    }),
  );
  const studies = ["appearance-study", "state-study", "detail-audit"].map((tool, i) => ({
    name: ["appearance", "focus", "ink"][i],
    tool,
    file: ["appearance.mjs", "state.mjs", "detail.json"][i],
    rules: ["typeface-vs-font"],
  }));
  await fs.writeFile(cfg, JSON.stringify({ ...config, studies }));
  const studyOut = path.join(folder, "studies");
  const studyResult = run("run", "--rule", "typeface-vs-font", "--out", studyOut);
  const studyReport = await report(studyOut);
  assert.deepEqual(
    studyReport.studies.map((s) => s.status),
    ["failed", "completed", "completed"],
    JSON.stringify(studyReport.studies),
  );
  assert.equal(studyResult.status, 1);
  assert.ok(studyReport.rows[0].issues[0].evidence.endsWith("/report.json"));

  config.themes = ["light"];
  config.audit.viewports = config.audit.viewports.slice(0, 1);
  await fs.writeFile(cfg, JSON.stringify(config));
  const out = path.join(folder, "loop"),
    rev = path.join(folder, "reviews.json");
  await fs.writeFile(rev, "{}");
  const args = ["--rule", "line-height", "--out", out, "--max-runs", "1", "--review", rev];
  assert.equal(run("loop", ...args).status, 1);
  await fs.writeFile(html, good.replace('id="terms"', 'id="renamed"'));
  assert.equal(run("loop", "--resume", ...args).status, 2);
  const unmatched = await report(path.join(out, "run-0002"));
  assert.equal(unmatched.open.length, 1);
  await fs.writeFile(html, good);
  assert.equal(run("loop", "--resume", ...args).status, 2);
  const round = path.join(out, "run-0003"),
    fixed = await report(round);
  assert.equal(fixed.open.length, 0);
  const proof = path.join(round, fixed.rows[0].browser[0].screenshot);
  await fs.writeFile(
    rev,
    JSON.stringify({
      "line-height": {
        basis: fixed.rows[0].basis,
        status: "verified",
        artifact: proof,
        artifactSha256: hash(await fs.readFile(proof)),
        observation:
          "The fixture now uses the declared 1.5 leading and the rendered paragraph has clear line separation.",
      },
    }),
  );
  assert.equal(run("loop", "--resume", ...args).status, 0);
  console.log(
    "Verified full catalog, light/dark captures, scoped measurements, all three study adapters and repair-loop history.",
  );
} finally {
  await fs.rm(folder, { recursive: true, force: true });
}
