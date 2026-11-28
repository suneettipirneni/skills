#!/usr/bin/env node
import fs from "node:fs/promises";
import { unlinkSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { parseArgs } from "node:util";
import { randomUUID } from "node:crypto";
import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";
import { catalog, compareInventory } from "./lib/design-rule-catalog.mjs";
import { readJson, runRules, pixelRules, axeRules } from "./lib/design-rule-run.mjs";
import { probes } from "./lib/design-rule-probes.mjs";
import { trialTasks } from "./lib/design-rule-trials.mjs";
import { measurements } from "./lib/design-rule-measurements.mjs";

const usage = `design-rules.mjs list [--rule ID | --category ID]
design-rules.mjs inventory --source DOWNLOADED_RULES.json
design-rules.mjs run (--all | --rule ID | --category ID) (--url URL | --subject FILE) --out NEW_DIR
design-rules.mjs loop (--url URL | --subject FILE) --out DIR [--resume] [--repair EXECUTABLE] [--interval SECONDS] [--max-runs N]
Run and loop accept --config FILE, --review FILE, --ready SELECTOR and --channel chrome.
Loop defaults to all rules. See references/design-rules.md for evidence and exit codes.`;

export function reconcile(report, previous = {}, run = ".") {
  const history = structuredClone(previous);
  for (const row of report.rows) {
    for (const issue of row.issues) {
      const prior = history[issue.key];
      history[issue.key] = {
        rule: row.id,
        first: prior?.first ?? run,
        lastSeen: run,
        status: "open",
        issue,
      };
    }
    if (row.gaps.length || report.errors.length) continue;
    const fixed = new Set(row.passedChecks.map((c) => c.key));
    if (row.review?.status === "verified" || row.review?.status === "not-applicable")
      for (const key of row.review.resolves) fixed.add(key);
    for (const key of fixed) {
      const old = history[key];
      if (old?.status === "open" && !row.issues.some((i) => i.key === key))
        Object.assign(old, { status: "resolved", resolvedIn: run });
    }
  }
  const counts = {};
  for (const r of report.rows) counts[r.status] = (counts[r.status] ?? 0) + 1;
  const open = Object.keys(history).filter((k) => history[k].status === "open");
  const verified =
    report.rows.length > 0 &&
    report.rows.every((r) => ["verified", "not-applicable"].includes(r.status));
  const status =
    report.errors.length || counts.incomplete
      ? "incomplete"
      : open.length
        ? "failed"
        : verified
          ? "verified"
          : "needs-review";
  return { status, counts, open, history };
}
const writeJson = (p, obj) => fs.writeFile(p, JSON.stringify(obj, null, 2) + "\n", { flag: "wx" });
function feedback(report, summary) {
  const lines = [
    "# Design feedback",
    "",
    `Target: ${report.target}`,
    "",
    `Outcome: **${summary.status}** across ${report.rows.length} rules. Open issues: ${summary.open.length}.`,
    "",
  ];
  const groupBy = (items, key) => {
    const groups = new Map();
    for (const item of items) {
      const id = key(item);
      if (!groups.has(id)) groups.set(id, []);
      groups.get(id).push(item);
    }
    return [...groups.values()];
  };
  const open = summary.open.map((k) => summary.history[k]);
  for (const items of groupBy(open, (item) => item.rule)) {
    const r = report.rows.find((row) => row.id === items[0].rule);
    lines.push("## " + r.title + " · " + items.length + " open", "");
    for (const repeats of groupBy(items, ({ issue }) =>
      JSON.stringify([
        issue.field,
        issue.selector,
        issue.observed,
        issue.expected,
        issue.scope,
        issue.value,
        issue.key.includes("/review/") ? issue.key : null,
      ]),
    )) {
      const { issue, lastSeen } = repeats[0];
      const location = Array.isArray(issue.selector)
        ? issue.selector.join(" ")
        : (issue.selector ?? issue.scope?.join(" / "));
      const observed = issue.observed ?? issue.value ?? issue.reason ?? issue;
      const expected = issue.expected ?? issue.required ?? issue.maximum ?? issue.criteria;
      const artifact = issue.evidence ?? issue.artifact?.file;
      const evidence = artifact
        ? lastSeen === "."
          ? artifact
          : "../" + lastSeen + "/" + artifact
        : null;
      lines.push(
        "- " +
          (location ? "`" + location + "` · " : "") +
          (issue.field ? issue.field + " · " : "") +
          (typeof observed === "string" ? observed : JSON.stringify(observed)) +
          (expected !== undefined ? " · expected " + JSON.stringify(expected) : "") +
          (repeats.length > 1 ? " · " + repeats.length + " occurrences" : "") +
          (evidence ? " · [evidence](" + evidence + ")" : "") +
          " · `" +
          issue.key +
          "`",
      );
    }
    lines.push("", r.procedure + " " + r.acceptance, "");
  }
  for (const r of report.rows) {
    const leads = r.browser.flatMap((b) =>
      (b.candidates ?? []).map((c) => ({ ...c, case: b.case, screenshot: b.screenshot })),
    );
    if (!leads.length) continue;
    lines.push("### Inspect " + r.title, "");
    for (const repeats of groupBy(leads, (c) => JSON.stringify([c.element, c.values, c.message]))) {
      const c = repeats[0];
      lines.push(
        "- `" +
          c.element +
          "` · " +
          c.message +
          " " +
          JSON.stringify(c.values) +
          " · " +
          repeats.map((item) => item.case).join(", ") +
          " · [frame](" +
          c.screenshot +
          ")",
      );
    }
    lines.push("");
  }
  for (const r of report.rows.filter((r) => ["incomplete", "needs-review"].includes(r.status))) {
    lines.push(
      "### " + r.title + " · " + r.status,
      "",
      r.procedure + " " + r.acceptance,
      "",
      ...(r.gaps.length ? [r.gaps.join("\n"), ""] : []),
    );
  }
  lines.push(
    "The JSON report contains per-rule samples, study outputs and evidence paths. Compare the intended task and existing design before changing a component.",
  );
  return lines.join("\n") + "\n";
}
async function save(o, rules, selected, previous, run) {
  await fs.mkdir(o.out);
  let report;
  try {
    report = await runRules(o, rules, selected);
  } catch (e) {
    if (!o.loopMode) throw e;
    report = {
      schemaVersion: 1,
      target: o.url ?? o.subject,
      createdAt: new Date().toISOString(),
      errors: [e.message],
      rows: selected.map((r) => ({
        ...r,
        status: "incomplete",
        issues: [],
        passedChecks: [],
        gaps: [e.message],
        browser: [],
      })),
    };
  }
  const summary = reconcile(report, previous, run);
  const template = Object.fromEntries(
    report.rows.map((r) => [
      r.id,
      {
        basis: r.basis,
        status: "pending",
        observation: "",
        artifact: "",
        artifactSha256: "",
        resolves: [],
      },
    ]),
  );
  await writeJson(path.join(o.out, "review-template.json"), template);
  await fs.writeFile(path.join(o.out, "feedback.md"), feedback(report, summary));
  // This is the commit point for a round. An interrupted round cannot replace history.
  const staging = path.join(o.out, "report-" + randomUUID() + ".tmp");
  await writeJson(staging, { ...report, ...summary });
  await fs.rename(staging, path.join(o.out, "report.json"));
  return summary;
}
function bounded(value, fallback, max, label) {
  const n = value === undefined ? fallback : Number(value);
  if (!Number.isSafeInteger(n) || n < 1 || n > max)
    throw Error(label + " must be an integer from 1 through " + max);
  return n;
}
function select(rules, v) {
  if (Number(!!v.all) + Number(!!v.rule) + Number(!!v.category) > 1)
    throw Error("Choose a single scope");
  const selected = rules.filter(
    (r) => (!v.rule || r.id === v.rule) && (!v.category || r.category === v.category),
  );
  if (!selected.length) throw Error("Unknown rule or category");
  return selected;
}
const exitCode = (s) => ({ verified: 0, failed: 1, "needs-review": 2, incomplete: 2 })[s];
const describe = (s, out) =>
  console.log(
    JSON.stringify({
      status: s.status,
      counts: s.counts,
      open: s.open.length,
      report: path.join(out, "report.json"),
      feedback: path.join(out, "feedback.md"),
    }),
  );
async function loop(o, rules, selected, v) {
  const attempts =
    v["max-runs"] === undefined ? Infinity : bounded(v["max-runs"], 1, 100000, "max-runs");
  const seconds =
    v.repair && v.interval === undefined ? 0 : bounded(v.interval, 60, 86400, "interval");
  const meta = { target: o.url ?? o.subject, scope: selected.map((r) => r.id) };
  if (!v.resume) {
    await fs.mkdir(o.out);
    await writeJson(path.join(o.out, "loop.json"), meta);
  } else if (JSON.stringify(await readJson(path.join(o.out, "loop.json"))) !== JSON.stringify(meta))
    throw Error("Resume requires the original target and rule selection");
  const lock = path.join(o.out, ".running");
  const handle = await fs.open(lock, "wx").catch((e) => {
    if (e.code === "EEXIST")
      throw Error("Loop lock exists at " + lock + ". Check its PID before resuming.");
    throw e;
  });
  const cleanup = () => {
    try {
      unlinkSync(lock);
    } catch {}
  };
  process.once("exit", cleanup);
  try {
    await handle.writeFile(String(process.pid));
    await handle.close();
    return await rounds(o, rules, selected, attempts, seconds);
  } finally {
    process.off("exit", cleanup);
    cleanup();
  }
}
async function rounds(o, rules, selected, attempts, seconds) {
  const entries = (await fs.readdir(o.out))
    .filter((n) => /^run-\d+$/.test(n))
    .sort((a, b) => Number(b.slice(4)) - Number(a.slice(4)));
  let previous = {};
  for (const entry of entries) {
    try {
      previous = (await readJson(path.join(o.out, entry, "report.json"))).history;
      break;
    } catch (e) {
      if (e.code !== "ENOENT") throw e;
    }
  }
  let next = entries.length ? Number(entries[0].slice(4)) + 1 : 1;
  let code = 2;
  for (let i = 0; i < attempts; i++, next++) {
    const run = "run-" + String(next).padStart(4, "0"),
      out = path.join(o.out, run);
    // mkdir in save is exclusive, so concurrent/resumed runs cannot overwrite a round.
    const summary = await save({ ...o, out, loopMode: true }, rules, selected, previous, run);
    describe(summary, out);
    code = exitCode(summary.status);
    if (code === 0) return 0;
    previous = summary.history;
    if (i + 1 >= attempts) break;
    if (o.repair) {
      const log = await fs.open(path.join(out, "repair.log"), "wx");
      let result;
      try {
        result = await new Promise((resolve, reject) => {
          const child = spawn(
            path.resolve(o.repair),
            [path.join(out, "report.json"), path.join(out, "feedback.md")],
            { stdio: ["ignore", log.fd, log.fd] },
          );
          child.once("error", reject);
          child.once("close", (code, signal) => resolve({ code, signal }));
        });
      } finally {
        await log.close();
      }
      await writeJson(path.join(out, "repair-result.json"), result);
      if (result.code !== 0)
        throw Error("Repair hook stopped; inspect " + path.join(out, "repair.log"));
    }
    if (seconds) await delay(seconds * 1000);
  }
  return code;
}
export async function main(args) {
  const [command, ...rest] = args;
  if (!command || command === "--help" || command === "help") {
    console.log(usage);
    return 0;
  }
  const options = Object.fromEntries(
    [
      "source",
      "url",
      "subject",
      "out",
      "config",
      "review",
      "rule",
      "category",
      "channel",
      "ready",
      "interval",
      "max-runs",
      "repair",
      "revision-file",
    ].map((k) => [k, { type: "string" }]),
  );
  const { values: v } = parseArgs({
    args: rest,
    options: { ...options, all: { type: "boolean" }, resume: { type: "boolean" } },
  });
  const rules = await catalog(),
    selected = select(rules, v);
  if (command === "inventory") {
    if (!v.source) throw Error("Supply --source with the saved DesignParser JSON feed");
    const check = compareInventory(rules, await readJson(v.source));
    console.log(JSON.stringify(check, null, 2));
    return check.differences.length ? 1 : 0;
  }
  if (command === "list") {
    console.log(
      JSON.stringify(
        selected.map((r) => ({
          ...r,
          probe: probes[r.id] ?? null,
          measurement: !!measurements[r.id],
          trialTask: trialTasks[r.id] ?? null,
          pixelEvidence: pixelRules.has(r.id),
          axe: axeRules[r.id] ?? [],
        })),
        null,
        2,
      ),
    );
    return 0;
  }
  if (!["run", "loop"].includes(command) || !v.out || !!v.url === !!v.subject) throw Error(usage);
  if (command === "run" && !v.all && !v.rule && !v.category)
    throw Error("Choose --all, --rule or --category");
  if (command === "run" && (v.resume || v.interval || v["max-runs"] || v.repair))
    throw Error("Loop options require the loop command");
  const o = {
    ...v,
    out: path.resolve(v.out),
    url: v.url ? new URL(v.url).href : null,
    subject: v.subject ? path.resolve(v.subject) : null,
    base: v.config ? path.dirname(path.resolve(v.config)) : process.cwd(),
    reviewBase: v.review ? path.dirname(path.resolve(v.review)) : process.cwd(),
  };
  if (command === "loop") return loop(o, rules, selected, v);
  const summary = await save(o, rules, selected, {}, ".");
  describe(summary, o.out);
  return exitCode(summary.status);
}
const entryPath = process.argv[1] && await fs.realpath(process.argv[1]).catch(() => null);
if (entryPath && import.meta.url === pathToFileURL(entryPath).href) {
  try {
    process.exitCode = await main(process.argv.slice(2));
  } catch (e) {
    console.error(e.message);
    process.exitCode = 2;
  }
}
