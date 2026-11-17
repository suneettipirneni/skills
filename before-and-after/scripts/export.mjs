#!/usr/bin/env node
import { createRequire } from 'node:module';
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { readFile, access, mkdir } from 'node:fs/promises';

const help = `Export GIFs or side-by-side PNGs from an existing offline comparison.
  node export.mjs --input review.html --output-dir exports --format both
Options: --format gif|png|both (default both), --id PAIR_ID, --force,
  --deps /path/to/project/package.json (existing Playwright installation),
  --browser chrome (default), --help
No server is started. Existing output files are protected unless --force is set.`;
const options = {};
const boolean = new Set(['help', 'force']);
const strings = new Set(['input', 'output-dir', 'format', 'id', 'deps', 'browser']);
try {
  for (let i = 2; i < process.argv.length; i++) {
    const arg = process.argv[i], key = arg.slice(2);
    if (!arg.startsWith('--') || (!boolean.has(key) && !strings.has(key))) throw Error(`Unknown argument: ${arg}`);
    if (key in options) throw Error(`Repeated option: ${arg}`);
    options[key] = boolean.has(key) ? true : process.argv[++i];
    if (options[key] === undefined || String(options[key]).startsWith('--')) throw Error(`Missing value: ${arg}`);
  }
  if (options.help) { console.log(help); }
  else {
    if (!options.input || !options['output-dir']) throw Error('--input and --output-dir are required');
    const format = options.format || 'both';
    if (!['png', 'gif', 'both'].includes(format)) throw Error('--format must be png, gif, or both');
    const input = resolve(options.input), output = resolve(options['output-dir']);
    const html = await readFile(input, 'utf8');
    const match = html.match(/<script id="comparison-data" type="application\/json">([\s\S]*?)<\/script>/);
    if (!match) throw Error('Input must be a Before and After HTML export');
    const data = JSON.parse(match[1]);
    if (data.version !== 1 || !Array.isArray(data.pairs)) throw Error('Unsupported comparison export');
    const jobs = [];
    for (const [index, pair] of data.pairs.entries()) {
      if (options.id !== undefined && pair.id !== options.id) continue;
      const stem = String(pair.id || 'comparison').normalize('NFKD').replace(/[^a-zA-Z0-9_-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80) || 'comparison';
      for (const extension of format === 'both' ? ['png', 'gif'] : [format]) {
        const path = join(output, `${String(index + 1).padStart(2, '0')}-${stem}-before-after.${extension}`);
        if (!options.force) {
          try { await access(path); throw Error(`Output exists: ${path}. Use --force to replace it.`); }
          catch (error) { if (error.code !== 'ENOENT') throw error; }
        }
        jobs.push({ index, extension, path });
      }
    }
    if (!jobs.length) throw Error('No entries match the requested ID');
    const require = createRequire(options.deps ? resolve(options.deps) : import.meta.url);
    let chromium;
    try { ({ chromium } = require('playwright')); }
    catch { throw Error('Playwright is required for batch export. Pass --deps pointing to a project package.json with Playwright installed. Browser export buttons need no installation.'); }
    const browser = await chromium.launch({ channel: options.browser || 'chrome', headless: true });
    try {
      const context = await browser.newContext({ offline: true, acceptDownloads: true });
      const page = await context.newPage();
      await page.goto(pathToFileURL(input).href);
      if (await page.locator('.export-actions').count() !== data.pairs.length) throw Error('This HTML predates export buttons. Regenerate it with the current renderer.');
      await mkdir(output, { recursive: true });
      for (const job of jobs) {
        const card = page.locator('.card').nth(job.index);
        const [download] = await Promise.all([
          page.waitForEvent('download', { timeout: 120000 }),
          card.getByRole('button', { name: new RegExp(`^Export ${job.extension.toUpperCase()} for `) }).click()
        ]);
        await download.saveAs(job.path);
        console.log(job.path);
      }
    } finally { await browser.close(); }
  }
} catch (error) { console.error(`Error: ${error.message}`); process.exitCode = 1; }
