import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { catalog, compareInventory, hash } from "../lib/design-rule-catalog.mjs";
import { measure } from "../lib/design-rule-measurements.mjs";
import { collectSignals } from "../lib/design-rule-signals.mjs";
import { reconcile } from "../design-rules.mjs";

const cli = fileURLToPath(new URL("../design-rules.mjs", import.meta.url));
const run = (...args) => spawnSync(process.execPath, [cli, ...args], { encoding: "utf8" });
test("the installed directory symlink exposes the complete CLI catalog", async (t) => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "harmony-install-"));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  const installed = path.join(root, "ui-harmony");
  await fs.symlink(path.resolve(path.dirname(cli), ".."), installed, "dir");
  const entry = path.join(installed, "scripts", "design-rules.mjs");
  const result = spawnSync(process.execPath, [entry, "list"], { encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(JSON.parse(result.stdout).map((r) => r.id), (await catalog()).map((r) => r.id));
});

test("registry identifies missing, extra, renamed and moved upstream entries", async () => {
  const rules = await catalog();
  assert.equal(rules.length, 88);
  assert.equal(new Set(rules.map((r) => r.category)).size, 11);
  const local = rules.slice(0, 3);
  const feed = {
    categories: {
      color: {
        rules: [local[0], { ...local[1], title: "new name" }, { id: "new", title: "added" }],
      },
    },
  };
  assert.deepEqual(
    compareInventory(local, feed).differences.map((d) => d.id),
    [local[1].id, "new", local[2].id],
  );
  assert.equal(
    compareInventory([local[0]], { categories: { moved: { rules: [local[0]] } } }).differences
      .length,
    1,
  );
});
test("measurement gates use real units, unrounded limits and the worst edge", () => {
  assert.equal(
    measure("wcag-contrast", { foreground: "#777", background: "#fff", role: "normalText" }).passed,
    false,
  );
  assert.equal(
    measure("luminance-vs-lightness", {
      foreground: "#000",
      background: "#fff",
      role: "normalText",
    }).value,
    21,
  );
  assert.equal(
    measure("visual-angle-arcminutes", { heightMm: 1, distanceMm: 1000, minimumArcmin: 3 }).passed,
    true,
  );
  assert.equal(
    measure("cielab-color-space", {
      reference: [50, 0, 0],
      sample: [50, 3, 4],
      whitePoint: "D50 2°",
      tolerance: 5,
    }).value,
    5,
  );
  assert.equal(
    measure("dieline-bleed", { left: 3, right: 3, top: 2.9, bottom: 4, required: 3 }).passed,
    false,
  );
  assert.equal(
    measure("logo-clearspace", {
      left: 2,
      right: 2,
      top: 2,
      bottom: 2,
      required: 1,
      unit: "cap height",
    }).passed,
    true,
  );
  const a4 = { widthMm: 297, heightMm: 210, size: "A4", toleranceMm: 0 };
  assert.equal(measure("iso-216", a4).passed, true);
  assert.equal(measure("iso-216", { ...a4, widthMm: 594, heightMm: 420 }).passed, false);
  assert.throws(() =>
    measure("visual-angle-arcminutes", { heightMm: 3, distanceMm: 0, minimumArcmin: 1 }),
  );
});
test("small hit box yields a located review candidate", () => {
  const sample = { samples: [{ element: "#terms", values: { widthPx: 120, heightPx: 12 } }] };
  assert.equal(collectSignals("touch-target", sample)[0].element, "#terms");
  sample.samples[0].values.heightPx = 24;
  assert.deepEqual(collectSignals("touch-target", sample), []);
});
test("disappearance cannot resolve a known issue, current positive evidence can, and recurrence reopens it", () => {
  const r = {
    id: "line-height",
    gaps: [],
    passedChecks: [],
    issues: [{ key: "line-height/one" }],
    status: "failed",
  };
  const report = { rows: [r], errors: [] };
  const fail = reconcile(report, {}, "run-0001");
  r.issues = [];
  r.status = "verified";
  const absent = reconcile(report, fail.history, "run-0002");
  assert.equal(absent.status, "failed");
  r.passedChecks = [{ key: "line-height/one" }];
  assert.equal(reconcile({ ...report, errors: ["missing frame"] }, absent.history).open.length, 1);
  const fixed = reconcile(report, absent.history, "run-0003");
  assert.equal(fixed.status, "verified");
  r.status = "failed";
  r.issues = [{ key: "line-height/one" }];
  const again = reconcile(report, fixed.history, "run-0004");
  assert.equal(again.history["line-height/one"].first, "run-0001");
  assert.equal(again.history["line-height/one"].lastSeen, "run-0004");
});
test("CLI loop archives a real failing round, verifies the repair, rejects stale input and resumes past interrupted rounds", async (t) => {
  const folder = await fs.mkdtemp(path.join(os.tmpdir(), "harmony-rules-"));
  t.after(() => fs.rm(folder, { recursive: true, force: true }));
  const target = path.join(folder, "trim.txt"),
    config = path.join(folder, "job.json"),
    out = path.join(folder, "rounds");
  const args = [
    "--subject",
    target,
    "--out",
    out,
    "--config",
    config,
    "--rule",
    "iso-216",
    "--max-runs",
    "1",
  ];
  async function proof(width) {
    const text = "Preflight trim " + width + " × 297 mm";
    await fs.writeFile(target, text);
    await fs.writeFile(
      config,
      JSON.stringify({
        measurements: {
          "iso-216": {
            widthMm: width,
            heightMm: 297,
            size: "A4",
            toleranceMm: 1,
            reason: "Printer brief",
            artifact: "trim.txt",
            artifactSha256: hash(text),
          },
        },
      }),
    );
  }
  await proof(200);
  assert.equal(run("loop", ...args).status, 1);
  await proof(210);
  assert.equal(run("loop", "--resume", ...args).status, 0);
  const original = JSON.parse(await fs.readFile(path.join(out, "run-0001", "report.json")));
  assert.match(await fs.readFile(path.join(out, "run-0001", original.subject.file), "utf8"), /200/);
  await fs.mkdir(path.join(out, "run-0003"));
  await fs.writeFile(path.join(out, "run-0003", "report.tmp"), "{");
  await fs.writeFile(target, "Changed proof, same file name");
  assert.equal(run("loop", "--resume", ...args).status, 2);
  const last = JSON.parse(await fs.readFile(path.join(out, "run-0004", "report.json")));
  assert.equal(last.rows[0].status, "incomplete");
  assert.match(last.rows[0].gaps[0], /artifactSha256/);
});
test("holistic review accounts for all rows, binds approvals to current evidence, retains explicitly resolved issue records", async (t) => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "harmony-all-"));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  const target = path.join(root, "subject.txt"),
    reviews = path.join(root, "reviews.json"),
    out = path.join(root, "rounds");
  await fs.writeFile(target, "synthetic fixture");
  await fs.writeFile(reviews, "{}");
  const args = ["--all", "--subject", target, "--out", out, "--review", reviews, "--max-runs", "1"];
  assert.equal(run("loop", ...args).status, 2);
  const template = JSON.parse(
    await fs.readFile(path.join(out, "run-0001", "review-template.json")),
  );
  const note = "synthetic review evidence for gate regression";
  await fs.writeFile(path.join(root, "note.txt"), note);
  for (const r of Object.values(template))
    Object.assign(r, {
      status: "not-applicable",
      observation: "This test fixture is a text record only.",
      artifact: "note.txt",
      artifactSha256: hash(note),
    });
  const row = template["color-psychology"];
  Object.assign(row, {
    status: "failed",
    observation: "Review fixture",
    issues: [{ id: "meaning", observation: "Signal misidentified" }],
  });
  await fs.writeFile(reviews, JSON.stringify(template));
  assert.equal(run("loop", "--resume", ...args).status, 1);
  Object.assign(row, { status: "verified", issues: [] });
  await fs.writeFile(reviews, JSON.stringify(template));
  assert.equal(run("loop", "--resume", ...args).status, 1);
  row.resolves = ["color-psychology/review/meaning"];
  await fs.writeFile(reviews, JSON.stringify(template));
  assert.equal(run("loop", "--resume", ...args).status, 0);
  await fs.writeFile(path.join(root, "note.txt"), "changed transcript");
  assert.equal(run("loop", "--resume", ...args).status, 2);
});

test("task trials evaluate observed accuracy, paired changes and time without passing missing evidence", async () => {
  const { evaluateTrials } = await import("../lib/design-rule-trials.mjs");
  const spec = { minParticipants: 2, minAccuracy: 1, maxMedianMs: 850, minAccuracyGain: 0.5 };
  const data = {
    rule: "hicks-law",
    targetBasis: "fixture",
    protocol: "Find payment options in two layouts",
    audience: "returning buyers",
    observations: ["baseline", "candidate"].flatMap((condition) =>
      ["p1", "p2"].map((participant) => ({
        condition,
        participant,
        task: "coupon",
        expected: "apply",
        answer: condition === "baseline" && participant === "p1" ? "skip" : "apply",
        timeMs: participant === "p1" ? 700 : 1000,
      })),
    ),
  };
  const evaluate = () => evaluateTrials("hicks-law", spec, data);
  assert.equal(evaluate().observed.medianMs, 850);
  assert.equal(evaluate().passed, true);
  data.observations[3].answer = "skip";
  assert.equal(evaluate().passed, false);
  assert.equal(evaluate().observed.misses[0].participant, "p2");
  data.observations.shift();
  assert.ok(evaluate().gaps.length);
  data.observations.push(data.observations.at(-1));
  assert.throws(evaluate, /Duplicate/);
});
test("press preflight compares output profiles and exact spot plate names", () => {
  assert.equal(
    measure("rgb-vs-cmyk", {
      embeddedProfile: "A",
      requiredProfile: "B",
      sourceModel: "RGB",
      outputModel: "CMYK",
      requiredModel: "CMYK",
    }).passed,
    false,
  );
  const plates = measure("cmyk-vs-pantone", {
    plates: ["K", "PMS 123 U"],
    orderedPlates: ["K", "PMS 123 C"],
  });
  assert.equal(plates.passed, false);
  assert.deepEqual(plates.missing, ["PMS 123 C"]);
});

test("repair executable receives round evidence and verification decides whether another round is needed", async (t) => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "harmony-hook-"));
  t.after(() => fs.rm(dir, { recursive: true, force: true }));
  const target = path.join(dir, "proof"),
    cfg = path.join(dir, "config.json"),
    out = path.join(dir, "loop"),
    hook = path.join(dir, "correct.mjs");
  await fs.writeFile(target, "Synthetic drawing fixture");
  const input = {
    widthMm: 200,
    heightMm: 297,
    size: "A4",
    toleranceMm: 1,
    reason: "Verify the specified proof trim",
    artifact: "proof",
    artifactSha256: hash("Synthetic drawing fixture"),
  };
  await fs.writeFile(cfg, JSON.stringify({ measurements: { "iso-216": input } }));
  await fs.writeFile(
    hook,
    `#!/usr/bin/env node
import fs from 'node:fs';
import {createHash} from 'node:crypto';
const report=JSON.parse(fs.readFileSync(process.argv[2]));
if(report.status!=='failed'||!fs.existsSync(process.argv[3])) process.exit(3);
const text='Corrected synthetic trim 210 x 297';
fs.writeFileSync(report.target,text);
const config=new URL('config.json',import.meta.url);
const data=JSON.parse(fs.readFileSync(config));
Object.assign(data.measurements['iso-216'],{widthMm:210,artifactSha256:createHash('sha256').update(text).digest('hex')});
fs.writeFileSync(config,JSON.stringify(data));
`,
    { mode: 0o755 },
  );
  const result = run(
    "loop",
    "--rule",
    "iso-216",
    "--subject",
    target,
    "--out",
    out,
    "--config",
    cfg,
    "--repair",
    hook,
    "--max-runs",
    "3",
  );
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual((await fs.readdir(out)).filter((n) => n.startsWith("run-")).sort(), [
    "run-0001",
    "run-0002",
  ]);
  assert.equal(
    JSON.parse(await fs.readFile(path.join(out, "run-0001", "repair-result.json"))).code,
    0,
  );
});
test("recorded task can verify a scoped rule; a changed implementation revision invalidates prior observations", async (t) => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "harmony-trials-"));
  t.after(() => fs.rm(dir, { recursive: true, force: true }));
  const target = path.join(dir, "design.txt"),
    rev = path.join(dir, "build-id"),
    cfg = path.join(dir, "config.json");
  await fs.writeFile(target, "Notice layout");
  await fs.writeFile(rev, "build 1");
  const args = ["run", "--rule", "banner-blindness", "--subject", target, "--revision-file", rev];
  const first = path.join(dir, "first");
  assert.equal(run(...args, "--out", first).status, 2);
  const { targetBasis } = JSON.parse(await fs.readFile(path.join(first, "report.json")));
  await fs.writeFile(
    path.join(dir, "results.json"),
    JSON.stringify({
      rule: "banner-blindness",
      targetBasis,
      protocol: "Read expiry during renewal",
      audience: "Synthetic test participant",
      observations: [
        {
          condition: "candidate",
          participant: "p1",
          task: "expiry",
          expected: "March",
          answer: "March",
        },
      ],
    }),
  );
  await fs.writeFile(
    cfg,
    JSON.stringify({
      trials: { "banner-blindness": { file: "results.json", minParticipants: 1, minAccuracy: 1 } },
    }),
  );
  assert.equal(run(...args, "--config", cfg, "--out", path.join(dir, "second")).status, 0);
  await fs.writeFile(rev, "build 2");
  assert.equal(run(...args, "--config", cfg, "--out", path.join(dir, "third")).status, 2);
});
