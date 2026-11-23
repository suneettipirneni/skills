#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { parseArgs } from 'node:util';
import { pathToFileURL } from 'node:url';
import { chromium } from 'playwright';
import { validateConfig } from './lib/analyze.mjs';

const edges = {
  left: b => b.x, right: b => b.x + b.width, top: b => b.y,
  bottom: b => b.y + b.height, centerX: b => b.x + b.width / 2,
  centerY: b => b.y + b.height / 2, width: b => b.width, height: b => b.height,
};

function namedList(items, label, allowEmpty = false) {
  if (!Array.isArray(items) || (!allowEmpty && !items.length)) throw Error('Expected ' + label);
  const names = items.map(item => item?.name);
  if (names.some(n => typeof n !== 'string' || !n.trim()) || new Set(names).size !== names.length)
    throw Error(label + ' need distinct nonempty names');
}

function scalar(value) {
  return typeof value === 'string' || typeof value === 'boolean' || Number.isFinite(value);
}

function validate(spec) {
  namedList(spec.variants, 'variants');
  namedList(spec.states, 'states');
  namedList(spec.anchors ?? [], 'anchors', true);
  if (spec.states.length < 2) throw Error('Use at least two states for a state study');
  for (const v of spec.variants) {
    validateConfig({viewports: [{name: 'case', ...v.viewport}]});
    if (v.theme && !['dark', 'light'].includes(v.theme)) throw Error('Invalid theme');
    if (v.motion && !['reduce', 'no-preference'].includes(v.motion)) throw Error('Invalid motion preference');
  }
  for (const a of spec.anchors ?? []) {
    if (typeof a.selector !== 'string' || !a.selector.trim() || !Object.hasOwn(edges, a.edge) ||
        !Number.isFinite(a.tolerance) || a.tolerance < 0 || !a.reason?.trim())
      throw Error('Each anchor needs a selector, edge, nonnegative CSS-pixel tolerance and reason');
  }
  for (const s of spec.states) {
    namedList(s.checks, 'checks in ' + s.name);
    if (s.enter !== undefined && typeof s.enter !== 'function') throw Error('Invalid state action');
    for (const c of s.checks) {
      if (typeof c.read !== 'function' || !scalar(c.expected)) throw Error('Each check needs a read function and an expected string, boolean or finite number');
    }
  }
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));
}

function gallery(report) {
  const e = escapeHtml;
  const sections = report.cases.map(c => {
    const frames = c.frames.map(f => {
      const rows = f.checks.map(k => {
        const detail = k.edge ? ' · ' + k.edge + ' ± ' + k.toleranceCssPx + ' CSS px' : '';
        return '<li>' + e(k.status + ' · ' + k.name + ' · observed ' + JSON.stringify(k.actual) + ' / expected ' + JSON.stringify(k.expected) + detail) + '</li>';
      }).join('');
      return '<figure><figcaption><strong>' + e(f.name) + '</strong></figcaption>' +
        (f.image ? '<a href="' + f.image + '"><img src="' + f.image + '" alt="' + e(f.name) + '"></a>' : '') +
        '<ul>' + rows + '</ul></figure>';
    }).join('');
    return '<section><h2>' + e(c.variant.name) + '</h2><p>' + e(c.variant.viewport.width + ' × ' + c.variant.viewport.height + ' · ' + (c.variant.theme ?? 'light') + ' · ' + (c.variant.motion ?? 'no-preference')) + '</p><div>' + frames + '</div></section>';
  }).join('');
  return '<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>State study</title><style>body{font:16px/1.45 system-ui;margin:2rem;color:#222}section>div{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,20rem),1fr));gap:1rem}figure{margin:0;min-width:0}img{max-width:100%;max-height:34rem;display:block;border:1px solid #ddd}li{overflow-wrap:anywhere}</style><h1>State study</h1><p>' +
    e(report.status) + ' · ' + e(report.url) + '</p><p>' + e(report.specSource.path ?? report.specSource.id) + ' · ' + e(report.plannedStates.join(' → ')) + '</p>' + report.errors.map(x => '<p>' + e([x.variant,x.state,x.message].filter(Boolean).join(' · ')) + '</p>').join('') + sections;
}

export async function runStudy({url, out, spec, channel, specSource}) {
  validate(spec);
  if (!['file:', 'http:', 'https:'].includes(new URL(url).protocol)) throw Error('Use a file or web URL');
  await fs.mkdir(out, {recursive: false});
  const report = {url, specSource: specSource ?? {id: spec.name ?? 'Programmatic study'},
    plannedStates: spec.states.map(s => s.name), createdAt: new Date().toISOString(),
    plannedFrames: spec.variants.length * spec.states.length, cases: [], errors: []};
  let browser;
  try {
    browser = await chromium.launch({channel});
    report.browser = browser.version();
    for (const [i, variant] of spec.variants.entries()) {
      const record = {variant, frames: []};
      report.cases.push(record);
      const baseline = new Map();
      let context, stateName;
      try {
        context = await browser.newContext({viewport: variant.viewport, colorScheme: variant.theme ?? 'light', reducedMotion: variant.motion ?? 'no-preference'});
        const page = await context.newPage();
        page.setDefaultTimeout(8000);
        const response = await page.goto(url);
        if (response && !response.ok()) throw Error('HTTP ' + response.status());
        for (const [j, state] of spec.states.entries()) {
          stateName = state.name;
          await state.enter?.(page, variant);
          await page.evaluate(() => document.fonts.ready.then(() => true));
          const frame = {name: stateName, url: page.url(), checks: []};
          record.frames.push(frame);
          const image = 'case-' + (i + 1) + '-state-' + (j + 1) + '.png';
          await page.screenshot({path: path.join(out, image), animations: 'allow'});
          frame.image = image;
          for (const c of state.checks) {
            const actual = await c.read(page, variant);
            if (!scalar(actual)) throw Error('Missing or unsupported observation for ' + c.name);
            frame.checks.push({name: c.name, actual, expected: c.expected, status: actual === c.expected ? 'pass' : 'fail'});
          }
          for (const anchor of spec.anchors ?? []) {
            const target = page.locator(anchor.selector);
            if (await target.count() !== 1 || !await target.isVisible()) throw Error('Expected one visible anchor for ' + anchor.name);
            const box = await target.boundingBox();
            if (!box || !box.width || !box.height) throw Error('Empty anchor box for ' + anchor.name);
            const value = edges[anchor.edge](box);
            if (j === 0) baseline.set(anchor.name, value);
            const initial = baseline.get(anchor.name);
            frame.checks.push({name: anchor.name, reason: anchor.reason, edge: anchor.edge,
              actual: value, expected: initial, toleranceCssPx: anchor.tolerance,
              status: Math.abs(value - initial) <= anchor.tolerance ? 'pass' : 'fail'});
          }
        }
      } catch (error) {
        report.errors.push({variant: variant.name, state: stateName, message: error.message});
      } finally {
        await context?.close();
      }
    }
  } catch (error) {
    report.errors.push({message: error.message});
  } finally {
    await browser?.close();
  }
  report.status = report.errors.length ? 'incomplete' : report.cases.some(c =>
    c.frames.some(f => f.checks.some(k => k.status === 'fail'))) ? 'failed' : 'passed';
  await fs.writeFile(path.join(out, 'report.json'), JSON.stringify(report, null, 2));
  await fs.writeFile(path.join(out, 'index.html'), gallery(report));
  return report;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    const {values} = parseArgs({options: {url:{type:'string'},out:{type:'string'},spec:{type:'string'},channel:{type:'string'},help:{type:'boolean'}}});
    if (values.help) {
      console.log('state-study.mjs --url URL_OR_HTML_FILE --spec LOCAL.mjs --out NEW_DIRECTORY [--channel chrome]');
    } else {
      if (!values.url || !values.spec || !values.out) throw Error('--url, --spec and --out are required');
      const specPath = path.resolve(values.spec);
      const {default: spec} = await import(pathToFileURL(specPath).href);
      const specSource = {path: specPath, sha256: createHash('sha256').update(await fs.readFile(specPath)).digest('hex')};
      const url = /^[a-z][a-z0-9+.-]*:/i.test(values.url) ? values.url : pathToFileURL(path.resolve(values.url)).href;
      const report = await runStudy({...values, url, spec, specSource});
      console.log(report.status + ' · ' + path.resolve(values.out, 'index.html'));
      process.exitCode = {passed: 0, failed: 1, incomplete: 2}[report.status];
    }
  } catch (error) {
    console.error(error.message);
    process.exitCode = 2;
  }
}
