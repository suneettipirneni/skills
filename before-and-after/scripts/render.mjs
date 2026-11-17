#!/usr/bin/env node
import { readFile, writeFile, mkdir, rename, unlink, access } from 'node:fs/promises';
import { dirname, resolve, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';

const HELP = `Export offline before/after image comparisons.
  node render.mjs --before image.png --after image.png --output review.html
  node render.mjs --manifest pairs.json --output review.html [--append | --force]
Options: --title TEXT, --id ID (single pair), --append, --force, --help
Manifest: { title?, description?, pairs: [{ id?, title?, before, after,
  caption?, beforeLabel?, afterLabel?, fit?: "contain"|"cover", position?: 0..100 }] }
Paths in a manifest are relative to that manifest. All images are embedded.`;
const flags = new Set(['append', 'force', 'help']);
const values = new Set(['before', 'after', 'output', 'manifest', 'title', 'id']);
function args(argv) {
  const result = {};
  for (let i = 0; i < argv.length; i++) {
    const key = argv[i].slice(2);
    if (!argv[i].startsWith('--') || (!flags.has(key) && !values.has(key))) throw Error(`Unknown argument: ${argv[i]}`);
    if (key in result) throw Error(`Repeated option: --${key}`);
    result[key] = flags.has(key) ? true : argv[++i];
    if (result[key] === undefined || (typeof result[key] === 'string' && result[key].startsWith('--'))) throw Error(`Missing value for --${key}`);
  }
  return result;
}
function string(value, fallback, field) {
  if (value === undefined) return fallback;
  if (typeof value !== 'string') throw Error(`${field} must be a string`);
  return value;
}
function mime(bytes) {
  if (bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) return 'image/png';
  if (bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) return 'image/jpeg';
  if (/^GIF8[79]a/.test(bytes.toString('ascii', 0, 6))) return 'image/gif';
  if (bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP') return 'image/webp';
  if (bytes.toString('ascii', 4, 8) === 'ftyp' && /avif|avis/.test(bytes.toString('ascii', 8, 40))) return 'image/avif';
  if (/^(?:\uFEFF)?\s*(?:<\?xml[^>]*>\s*)?(?:<!--[\s\S]*?-->\s*)*<svg[\s>]/i.test(bytes.toString('utf8'))) return 'image/svg+xml';
  throw Error('Unsupported image contents; use PNG, JPEG, WebP, GIF, AVIF, or SVG');
}
async function embed(path, base, output) {
  if (typeof path !== 'string' || !path.trim()) throw Error('Each pair needs local before and after paths');
  if (/^[a-z][a-z\d+.-]*:\/\//i.test(path) || path.startsWith('data:')) throw Error('Use local image files, not URLs');
  const absolute = resolve(base, path);
  if (absolute === output) throw Error('Output cannot overwrite an input image');
  const bytes = await readFile(absolute);
  return `data:${mime(bytes)};base64,${bytes.toString('base64')}`;
}
function json(value) { return JSON.stringify(value).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029'); }
function escape(value) { return value.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

export async function render(argv) {
  const options = args(argv);
  if (options.help) return HELP;
  if (!options.output) throw Error('--output is required');
  if (options.append && options.force) throw Error('Choose --append or --force');
  if (options.manifest && (options.before || options.after || options.id)) throw Error('Choose a manifest or a single image pair');
  const output = resolve(options.output);
  if (!['.html', '.htm'].includes(extname(output).toLowerCase())) throw Error('Output must be an .html or .htm file');
  if (options.manifest && output === resolve(options.manifest)) throw Error('Output cannot overwrite the manifest');
  let exists = false;
  try { await access(output); exists = true; } catch (e) { if (e.code !== 'ENOENT') throw e; }
  if (exists && !options.append && !options.force) throw Error('Output exists. Use --append to merge or --force to replace');
  let previous = { title: 'Before and After', description: '', pairs: [] };
  if (exists && options.append) {
    const html = await readFile(output, 'utf8');
    const match = html.match(/<script id="comparison-data" type="application\/json">([\s\S]*?)<\/script>/);
    if (!match) throw Error('Cannot append: output is not a Before and After export');
    previous = JSON.parse(match[1]);
    if (previous.version !== 1 || !Array.isArray(previous.pairs)) throw Error('Unsupported export version');
    const ids = new Set();
    for (const pair of previous.pairs) {
      if (!pair || typeof pair.id !== 'string' || ids.has(pair.id) ||
        !['before', 'after'].every(k => typeof pair[k] === 'string' && /^data:image\/(png|jpeg|webp|gif|avif|svg\+xml);base64,[A-Za-z0-9+/=]+$/.test(pair[k]))) throw Error('Invalid existing comparison data');
      ids.add(pair.id);
    }
  }
  const input = options.manifest ? JSON.parse(await readFile(resolve(options.manifest), 'utf8')) : {
    pairs: [{ before: options.before, after: options.after, title: options.title, id: options.id }]
  };
  if (!input || !Array.isArray(input.pairs) || !input.pairs.length) throw Error('Manifest pairs must be a nonempty array');
  const data = { version: 1,
    title: string(options.title ?? input.title, previous.title, 'title'),
    description: string(input.description, previous.description, 'description'), pairs: [...previous.pairs] };
  const base = options.manifest ? dirname(resolve(options.manifest)) : process.cwd();
  const ids = new Set();
  for (const [i, pair] of input.pairs.entries()) {
    if (!pair || typeof pair !== 'object' || Array.isArray(pair)) throw Error(`Pair ${i + 1} must be an object`);
    const id = string(pair.id, randomUUID(), 'id');
    if (!id.trim() || ids.has(id)) throw Error(`Pair IDs must be nonempty and unique: ${id}`);
    ids.add(id);
    const fit = pair.fit ?? 'contain';
    const position = pair.position ?? 50;
    if (!['contain', 'cover'].includes(fit)) throw Error('fit must be contain or cover');
    if (typeof position !== 'number' || !Number.isFinite(position) || position < 0 || position > 100) throw Error('position must be between 0 and 100');
    const converted = { id, title: string(pair.title, `Comparison ${data.pairs.length + 1}`, 'pair title'),
      caption: string(pair.caption, '', 'caption'), beforeLabel: string(pair.beforeLabel, 'Before', 'beforeLabel'),
      afterLabel: string(pair.afterLabel, 'After', 'afterLabel'), fit, position,
      before: await embed(pair.before, base, output), after: await embed(pair.after, base, output) };
    const index = data.pairs.findIndex(p => p.id === id);
    if (index === -1) data.pairs.push(converted); else data.pairs[index] = converted;
  }
  const template = await readFile(new URL('../assets/viewer.html', import.meta.url), 'utf8');
  const encoder = await readFile(new URL('../assets/vendor/gifenc.min.js', import.meta.url), 'utf8');
  const exporter = await readFile(new URL('../assets/export.js', import.meta.url), 'utf8');
  const substitutions = {
    '<!--DOCUMENT_TITLE-->': escape(data.title),
    '/*COMPARISON_DATA*/': json(data),
    '/*EXPORT_CODE*/': encoder + '\n' + exporter
  };
  // Replace only tokens in the template, never token-like text in user metadata.
  const html = template.replace(/<!--DOCUMENT_TITLE-->|\/\*COMPARISON_DATA\*\/|\/\*EXPORT_CODE\*\//g,
    token => substitutions[token]);
  await mkdir(dirname(output), { recursive: true });
  if (!exists) {
    await writeFile(output, html, { flag: 'wx' });
  } else {
    const temporary = `${output}.${randomUUID()}.tmp`;
    try { await writeFile(temporary, html, { flag: 'wx' }); await rename(temporary, output); }
    finally { await unlink(temporary).catch(e => { if (e.code !== 'ENOENT') throw e; }); }
  }
  return `${output} — ${data.pairs.length} comparison(s), ${(Buffer.byteLength(html) / 1024 / 1024).toFixed(2)} MiB. Open directly in a browser.`;
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  render(process.argv.slice(2)).then(console.log).catch(error => { console.error(`Error: ${error.message}`); process.exitCode = 1; });
}
