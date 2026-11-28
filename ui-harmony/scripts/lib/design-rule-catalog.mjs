import fs from "node:fs/promises";
import { createHash } from "node:crypto";
import { probes } from "./design-rule-probes.mjs";
import { measurements } from "./design-rule-measurements.mjs";

export const hash = (data) => createHash("sha256").update(data).digest("hex");
export const digest = (value) => hash(JSON.stringify(value));
export async function catalog() {
  const body = await fs.readFile(
    new URL("../../references/design-rule-catalog.md", import.meta.url),
    "utf8",
  );
  const rules = [];
  let category;
  for (const line of body.split("\n")) {
    if (line.startsWith("## ")) {
      category = line.match(/\(([a-z0-9-]+)\)$/)?.[1];
      if (!category) throw Error("Missing catalog category: " + line);
    }
    if (!line.startsWith("| ") || line.startsWith("| Rule ID ") || line.startsWith("| ---"))
      continue;
    const [id, title, procedure, acceptance, ...extra] = line
      .slice(1, -1)
      .split("|")
      .map((x) => x.trim());
    if (
      !category ||
      !/^[a-z0-9-]+$/.test(id) ||
      !title ||
      !procedure ||
      !acceptance ||
      extra.length ||
      rules.some((r) => r.id === id)
    )
      throw Error("Invalid catalog row: " + line);
    rules.push({ id, title, category, procedure, acceptance });
  }
  if (!rules.length) throw Error("Empty rule catalog");
  for (const id of [...Object.keys(probes), ...Object.keys(measurements)])
    if (!rules.some((r) => r.id === id)) throw Error("Unknown validator rule: " + id);
  return rules;
}
export function compareInventory(rules, feed) {
  const local = new Map(rules.map((r) => [r.id, r]));
  const seen = new Set(),
    differences = [];
  for (const [category, group] of Object.entries(feed.categories)) {
    for (const { id, title } of group.rules) {
      const row = local.get(id);
      if (seen.has(id) || !row || row.category !== category || row.title !== title)
        differences.push({ id, category, title, local: row?.title ?? null });
      seen.add(id);
    }
  }
  for (const id of local.keys()) if (!seen.has(id)) differences.push({ id, missingFromFeed: true });
  return {
    local: local.size,
    upstream: seen.size,
    categories: new Set(rules.map((r) => r.category)).size,
    differences,
  };
}
