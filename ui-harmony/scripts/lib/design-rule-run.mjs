import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import { digest, hash } from "./design-rule-catalog.mjs";
import { probes, collectRuleSamples } from "./design-rule-probes.mjs";
import { collectSignals } from "./design-rule-signals.mjs";
import { trialTasks, evaluateTrials } from "./design-rule-trials.mjs";
import { measurements, measure } from "./design-rule-measurements.mjs";

export const readJson = async (p) => JSON.parse(await fs.readFile(p, "utf8"));
const nonempty = (s) => typeof s === "string" && s.trim().length > 0;
const object = (o) => o !== null && typeof o === "object" && !Array.isArray(o);
export const pixelRules = new Set([
  "60-30-10",
  "saturation-control",
  "greyscale",
  "color-temperature-dominance",
]);
export const axeRules = {
  "wcag-contrast": ["color-contrast"],
  "touch-target": ["target-size"],
  "link-design": ["link-in-text-block"],
};
const autoMeasurements = new Set([
  "iso-216",
  "visual-angle-arcminutes",
  "cielab-color-space",
  "luminance-vs-lightness",
]);
const studyTools = new Set(["state-study", "detail-audit", "appearance-study"]);
const scripts = fileURLToPath(new URL("../", import.meta.url));
const allowed = (obj, keys, where) => {
  if (!object(obj)) throw Error(where + " must be an object");
  for (const key of Object.keys(obj))
    if (!keys.includes(key)) throw Error("Unknown " + where + " key: " + key);
};
function validate(config, rules) {
  const ids = rules.map((r) => r.id);
  allowed(config, ["audit", "checks", "measurements", "studies", "trials", "themes"], "config");
  allowed(config.audit ?? {}, ["viewports", "maxElements"], "audit");
  if (
    config.themes !== undefined &&
    (!Array.isArray(config.themes) ||
      !config.themes.length ||
      new Set(config.themes).size !== config.themes.length ||
      config.themes.some((t) => !["light", "dark"].includes(t)))
  )
    throw Error("Invalid themes");
  for (const section of ["checks", "measurements", "trials"])
    allowed(config[section] ?? {}, ids, section);
  for (const [id, t] of Object.entries(config.trials ?? {})) {
    allowed(
      t,
      ["file", "minParticipants", "minAccuracy", "maxMedianMs", "minAccuracyGain"],
      "trials." + id,
    );
    if (!Object.hasOwn(trialTasks, id) || !nonempty(t.file))
      throw Error("Invalid trial source for " + id);
  }
  for (const [id, c] of Object.entries(config.checks ?? {})) {
    allowed(c, ["selector", "expect", "reason"], "check");
    if (!probes[id] || !nonempty(c.selector) || !nonempty(c.reason))
      throw Error(id + " needs a supported probe, selector and reason");
    allowed(c.expect, probes[id].fields, "expect");
    if (!Object.keys(c.expect).length) throw Error("Empty expectations for " + id);
    for (const bound of Object.values(c.expect)) {
      allowed(bound, ["equals", "min", "max"], "bound");
      if (
        "equals" in bound
          ? Object.keys(bound).length !== 1 ||
            !["number", "boolean", "string"].includes(typeof bound.equals)
          : !Object.keys(bound).length ||
            !Object.values(bound).every(Number.isFinite) ||
            bound.min > bound.max
      )
        throw Error("Invalid bounds for " + id);
    }
  }
  for (const [id, m] of Object.entries(config.measurements ?? {})) {
    if (!measurements[id] || !object(m) || !nonempty(m.artifact) || !nonempty(m.reason))
      throw Error("Invalid measurement for " + id);
    measure(id, m);
  }
  if (config.studies !== undefined && !Array.isArray(config.studies))
    throw Error("studies must be an array");
  const names = new Set();
  for (const s of config.studies ?? []) {
    allowed(s, ["name", "tool", "file", "rules"], "study");
    if (
      !/^[a-z][a-z0-9-]*$/.test(s.name) ||
      names.has(s.name) ||
      !studyTools.has(s.tool) ||
      !nonempty(s.file) ||
      !Array.isArray(s.rules) ||
      !s.rules.length ||
      s.rules.some((id) => !ids.includes(id))
    )
      throw Error("Invalid study definition");
    names.add(s.name);
  }
}

async function archive(file, dir) {
  const bytes = await fs.readFile(file),
    sha256 = hash(bytes);
  const name = path.join("evidence", sha256 + path.extname(file).replace(/[^a-z0-9.]/gi, ""));
  await fs.mkdir(path.join(dir, "evidence"), { recursive: true });
  await fs.writeFile(path.join(dir, name), bytes);
  return { file: name, sha256 };
}
function evaluate(value, bound) {
  if (value === null || value === undefined || value === "") return null;
  if ("equals" in bound) return value === bound.equals;
  if (!Number.isFinite(value)) return null;
  return value >= (bound.min ?? -Infinity) && value <= (bound.max ?? Infinity);
}
async function studyRun(s, o) {
  const out = path.join(o.out, "study-" + s.name);
  const args = [
    path.join(scripts, s.tool + ".mjs"),
    "--out",
    out,
    s.tool === "detail-audit" ? "--config" : "--spec",
    path.resolve(o.base, s.file),
  ];
  if (s.tool !== "appearance-study") {
    if (!o.url) throw Error(s.name + " requires --url");
    args.push("--url", o.url);
  }
  if (o.channel) args.push("--channel", o.channel);
  const log = await fs.open(out + ".log", "wx");
  try {
    const code = await new Promise((resolve, reject) => {
      const child = spawn(process.execPath, args, { stdio: ["ignore", log.fd, log.fd] });
      child.once("error", reject);
      child.once("close", resolve);
    });
    const evidence = path.basename(out) + "/report.json";
    const report = await readJson(path.join(out, "report.json"));
    const checks = [];
    if (s.tool === "state-study")
      for (const c of report.cases)
        for (const f of c.frames)
          for (const q of f.checks)
            checks.push({
              scope: [c.variant.name, f.name, q.name],
              passed: q.status === "pass",
              observed: q.actual,
              expected: q.expected,
            });
    if (s.tool === "detail-audit")
      for (const c of report.cases)
        for (const [i, q] of c.checks.entries()) {
          if (typeof q.pass === "boolean")
            checks.push({
              scope: [c.viewport.name, c.component, c.index, i, q.kind],
              passed: q.pass,
              observed: q.observed,
              expected: q.expected,
            });
        }
    if (s.tool === "appearance-study")
      for (const c of report)
        for (const r of c.regions) {
          if (typeof r.typography?.matched === "boolean")
            checks.push({
              scope: [c.id, r.name ?? r.id],
              passed: r.typography.matched,
              observed: r.typography,
            });
        }
    const incomplete =
      code === null ||
      code > 1 ||
      (s.tool === "appearance-study" && report.some((c) => c.status !== "complete"));
    const fingerprints = [];
    for (const f of (await fs.readdir(out, { recursive: true }))
      .filter((p) => p.endsWith(".png"))
      .sort())
      fingerprints.push([f, hash(await fs.readFile(path.join(out, f)))]);
    const specHash = hash(await fs.readFile(path.resolve(o.base, s.file)));
    return {
      name: s.name,
      tool: s.tool,
      code,
      log: path.basename(out) + ".log",
      evidence,
      checks,
      specHash,
      frames: digest(fingerprints),
      status: incomplete
        ? "incomplete"
        : checks.some((c) => !c.passed) || code !== 0
          ? "failed"
          : "completed",
    };
  } finally {
    await log.close();
  }
}

async function captureTheme(o, config, selected, theme, folder) {
  if (!o.url) return { cases: [], errors: [] };
  const { runAudit } = await import("../audit.mjs");
  const out = path.join(o.out, folder);
  const requests = selected
    .filter((r) => probes[r.id])
    .map(({ id }) => ({
      id,
      ...probes[id],
      selector: config.checks?.[id]?.selector ?? probes[id].selector,
      limit: config.checks?.[id] ? 2 : 8,
    }));
  const audit = await runAudit({
    url: o.url,
    out,
    theme,
    ready: o.ready,
    channel: o.channel,
    config: config.audit ?? {},
    collectSupplement: (page) => page.evaluate(collectRuleSamples, requests),
  });
  const cases = [];
  const wantsPixels = selected.some((r) => pixelRules.has(r.id));
  for (const c of audit.cases) {
    const dom = await readJson(path.join(out, c.caseId + "-dom.json"));
    const axe = await readJson(path.join(out, c.caseId + "-axe.json"));
    const screenshot = folder + "/" + c.viewportScreenshot;
    const gray = folder + "/" + c.caseId + "-gray.png";
    const palette = wantsPixels
      ? await (
          await import("./design-rule-pixels.mjs")
        ).paletteEvidence(path.join(o.out, screenshot), path.join(o.out, gray))
      : null;
    cases.push({
      id: c.caseId,
      screenshot,
      axeFile: folder + "/" + c.caseId + "-axe.json",
      full: folder + "/" + c.screenshot,
      gray: wantsPixels ? gray : null,
      frameHash: hash(await fs.readFile(path.join(out, c.screenshot))),
      samples: dom.supplement,
      axe,
      palette,
    });
  }
  const errors = audit.errors.map((e) => JSON.stringify(e));
  if (audit.coverage.automatedStatus === "incomplete" && !errors.length)
    errors.push("Browser audit coverage incomplete; inspect browser/report.json");
  return { cases, errors };
}

function browserResult(rule, c, config, row) {
  const { id } = rule,
    probe = c.samples[id],
    contract = config.checks?.[id];
  const entry = { case: c.id, screenshot: c.screenshot };
  if (probe) {
    entry.probe = probe;
    const signals = collectSignals(id, probe);
    if (signals.length) entry.candidates = signals;
  }
  if (pixelRules.has(id)) Object.assign(entry, { palette: c.palette, grayscale: c.gray });
  if (probe?.error || (contract && probe?.matched !== 1))
    row.gaps.push(
      c.id + ": " + (probe?.error ?? "Expected one visible match for " + contract.selector),
    );
  if (contract && probe?.matched === 1)
    for (const [field, expected] of Object.entries(contract.expect)) {
      const value = probe.samples[0].values[field],
        pass = evaluate(value, expected);
      const key =
        id + "/web/" + c.id + "/" + digest([contract.selector, field, expected]).slice(0, 16);
      const detail = {
        key,
        selector: contract.selector,
        field,
        observed: value,
        expected,
        reason: contract.reason,
        evidence: c.screenshot,
      };
      if (pass === null) row.gaps.push(c.id + ": unavailable " + field);
      else if (!pass) row.issues.push(detail);
      else row.passedChecks.push(detail);
    }
  for (const axeId of axeRules[id] ?? []) {
    const coverage = {};
    for (const type of ["violations", "incomplete", "passes", "inapplicable"]) {
      const nodes = c.axe[type].find((r) => r.id === axeId)?.nodes ?? [];
      coverage[type] = nodes.length;
      for (const n of nodes) {
        const key = id + "/axe/" + c.id + "/" + digest([axeId, n.target]).slice(0, 16);
        const detail = {
          key,
          field: axeId,
          selector: n.target,
          observed: n.failureSummary ?? type,
          evidence: c.axeFile,
        };
        if (type === "violations") row.issues.push(detail);
        if (type === "passes") row.passedChecks.push(detail);
      }
    }
    (entry.axe ??= {})[axeId] = coverage;
  }
  row.browser.push(entry);
}

async function assessed(row, review, o) {
  if (!review || review.status === "pending") return;
  if (
    !["verified", "failed", "not-applicable"].includes(review.status) ||
    !nonempty(review.observation) ||
    !nonempty(review.artifact)
  )
    throw Error("Review " + row.id + " needs a status, observation and artifact");
  if (review.basis !== row.basis) {
    row.gaps.push("Review is stale; inspect the current evidence");
    return;
  }
  if (
    review.resolves !== undefined &&
    (!Array.isArray(review.resolves) ||
      review.resolves.some((k) => !nonempty(k) || !k.startsWith(row.id + "/")))
  )
    throw Error("Invalid resolution keys for " + row.id);
  const artifact = await archive(path.resolve(o.reviewBase, review.artifact), o.out);
  if (review.artifactSha256 !== artifact.sha256) {
    row.gaps.push("Confirm reviewed artifactSha256 " + artifact.sha256);
    return;
  }
  row.review = {
    status: review.status,
    observation: review.observation,
    artifact,
    resolves: review.resolves ?? [],
  };
  if (review.status === "failed") {
    if (!Array.isArray(review.issues) || !review.issues.length)
      throw Error("Failed review needs named issues for " + row.id);
    const seen = new Set();
    for (const i of review.issues) {
      if (!/^[a-z0-9][a-z0-9-]*$/.test(i.id) || seen.has(i.id) || !nonempty(i.observation))
        throw Error("Invalid review issue for " + row.id);
      seen.add(i.id);
      row.issues.push({
        key: row.id + "/review/" + i.id,
        observed: i.observation,
        evidence: artifact.file,
      });
    }
  }
}

export async function runRules(o, rules, selected) {
  const config = o.config ? await readJson(o.config) : {};
  validate(config, rules);
  const reviews = o.review ? await readJson(o.review) : {};
  allowed(
    reviews,
    rules.map((r) => r.id),
    "reviews",
  );
  const target = o.url ?? path.resolve(o.subject);
  const subject = o.subject ? await archive(o.subject, o.out) : null;
  const cases = [],
    errors = [];
  if (o.url) {
    const themes =
      config.themes ??
      (selected.some((r) => r.id === "dark-mode-color-adaptation") ? ["light", "dark"] : ["light"]);
    for (const theme of themes) {
      const capture = await captureTheme(
        o,
        config,
        selected,
        theme,
        theme === "light" ? "browser" : "browser-dark",
      );
      cases.push(...capture.cases);
      errors.push(...capture.errors);
    }
  }
  const revision = o["revision-file"] ? await archive(o["revision-file"], o.out) : null;
  const targetBasis = digest([
    target,
    revision?.sha256,
    subject?.sha256,
    cases.map((c) => [c.id, c.frameHash]),
  ]);
  const studies = [];
  for (const s of config.studies ?? [])
    if (selected.some((r) => s.rules.includes(r.id))) {
      try {
        studies.push({ ...(await studyRun(s, o)), rules: s.rules });
      } catch (e) {
        studies.push({
          name: s.name,
          tool: s.tool,
          status: "incomplete",
          error: e.message,
          rules: s.rules,
        });
      }
    }
  const rows = [];
  for (const rule of selected) {
    const row = {
      ...rule,
      status: "needs-review",
      browser: [],
      measurements: [],
      issues: [],
      passedChecks: [],
      gaps: [],
    };
    if (o.url) row.gaps.push(...errors);
    for (const c of cases) browserResult(rule, c, config, row);
    const m = config.measurements?.[rule.id];
    if (m) {
      const artifact = await archive(path.resolve(o.base, m.artifact), o.out);
      const boundToTarget = subject?.sha256 === artifact.sha256 || m.targetBasis === targetBasis;
      const current = artifact.sha256 === m.artifactSha256 && boundToTarget;
      const result = measure(rule.id, m),
        { artifact: unused, ...input } = m;
      const detail = { key: rule.id + "/measurement", input, ...result, artifact };
      row.measurements.push(detail);
      if (current) (result.passed ? row.passedChecks : row.issues).push(detail);
      else
        row.gaps.push(
          "Confirm measurements against this revision. Supply artifactSha256 " +
            artifact.sha256 +
            (boundToTarget ? "" : " and targetBasis " + targetBasis),
        );
    }
    if (!o.url && config.checks?.[rule.id])
      row.gaps.push("Browser contract requires a rendered URL");
    row.studies = studies.filter((s) => s.rules.includes(rule.id));
    for (const study of row.studies) {
      if (study.status === "incomplete") row.gaps.push("Study incomplete: " + study.name);
      for (const c of study.checks ?? []) {
        const detail = {
          key:
            rule.id + "/study/" + study.name + "/" + digest([study.specHash, c.scope]).slice(0, 16),
          ...c,
          evidence: study.evidence,
        };
        (c.passed ? row.passedChecks : row.issues).push(detail);
      }
      if (study.status === "failed" && !study.checks?.some((c) => !c.passed))
        row.gaps.push("Study requires investigation: " + study.name);
    }
    const trial = config.trials?.[rule.id];
    if (trial) {
      const file = path.resolve(o.base, trial.file);
      const artifact = await archive(file, o.out);
      const data = await readJson(path.join(o.out, artifact.file));
      const evaluation = evaluateTrials(rule.id, trial, data);
      const { file: sourceFile, ...criteria } = trial;
      const detail = {
        key: rule.id + "/trials/" + digest(criteria).slice(0, 16),
        artifact,
        criteria,
        ...evaluation,
      };
      row.trials = detail;
      if (data.targetBasis !== targetBasis)
        row.gaps.push("Task observations require the current targetBasis " + targetBasis);
      else if (evaluation.gaps.length) row.gaps.push(...evaluation.gaps);
      else (evaluation.passed ? row.passedChecks : row.issues).push(detail);
    }
    row.basis = digest([
      rule,
      targetBasis,
      cases.map((c) => [c.id, c.frameHash]),
      row.browser,
      config.checks?.[rule.id],
      row.measurements,
      row.studies,
      row.issues,
      row.passedChecks,
    ]);
    await assessed(row, reviews[rule.id], o);
    if (row.issues.length) row.status = "failed";
    else if (row.gaps.length) row.status = "incomplete";
    else if (row.review) row.status = row.review.status;
    else if ((m && autoMeasurements.has(rule.id)) || row.trials?.passed) row.status = "verified";
    rows.push(row);
  }
  return {
    schemaVersion: 1,
    target,
    targetBasis,
    subject,
    revision,
    createdAt: new Date().toISOString(),
    errors,
    studies,
    rows,
  };
}
