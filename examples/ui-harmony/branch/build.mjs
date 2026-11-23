import { build } from "esbuild";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
const root = path.dirname(fileURLToPath(import.meta.url));
const specimen = process.argv.includes("--specimen");
const entry = specimen ? "Specimen.jsx" : "App.jsx";
const name = specimen ? "specimen" : "branch";
const out = path.join(root, "static");
await mkdir(out, { recursive: true });
await build({
  absWorkingDir: root,
  entryPoints: [entry],
  outfile: path.join(out, name + ".js"),
  bundle: true,
  jsx: "automatic",
  format: "iife",
  minify: true,
  loader: { ".woff2": "dataurl", ".pdf": "dataurl" },
  define: { "process.env.NODE_ENV": '"production"' },
});
await writeFile(
  path.join(root, specimen ? "specimen.html" : "index.html"),
  `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#f5f7f5"><title>Branch · Home energy</title><link rel="stylesheet" href="static/${name}.css"></head><body><div id="root"></div><script src="static/${name}.js"></script></body></html>\n`,
);
