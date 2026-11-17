// BEFORE_AFTER_TEST_DEPS=/path/to/project/package.json node scripts/tests/exports-browser.mjs
// Uses the same existing Playwright/Chrome setup as browser.mjs.
import { createRequire } from 'node:module';
import { mkdtemp, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import assert from 'node:assert/strict';
import { render } from '../render.mjs';
const require = createRequire(process.env.BEFORE_AFTER_TEST_DEPS ? resolve(process.env.BEFORE_AFTER_TEST_DEPS) : import.meta.url);
const { chromium } = require('playwright');
const root = await mkdtemp(join(tmpdir(), 'before-after-exports-'));
const html = join(root, 'review.html');
const svg = (color, width, height) => `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="100%" height="100%" fill="${color}"/></svg>`;
let browser;
try {
  await writeFile(join(root, 'before.svg'), svg('#ff0000', 240, 120));
  await writeFile(join(root, 'after.svg'), svg('#0000ff', 120, 240));
  await writeFile(join(root, 'pairs.json'), JSON.stringify({ pairs: [
    { id: 'first', title: 'First', before: 'before.svg', after: 'after.svg', fit: 'cover', position: 37 },
    { id: 'second', title: 'Second', before: 'before.svg', after: 'after.svg', fit: 'contain' }
  ] }));
  await render(['--manifest', join(root, 'pairs.json'), '--output', html]);
  browser = await chromium.launch({ channel: process.env.BEFORE_AFTER_BROWSER || 'chrome', headless: true });
  const context = await browser.newContext({ offline: true, acceptDownloads: true });
  const page = await context.newPage();
  const errors = [], network = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => { if (/^https?:/.test(request.url())) network.push(request.url()); });
  await page.goto(pathToFileURL(html).href);
  await page.waitForFunction(() => [...document.images].every(img => img.complete && img.naturalWidth));
  const first = page.locator('.card').nth(0), second = page.locator('.card').nth(1);
  const download = async (card, format) => {
    const [file] = await Promise.all([
      page.waitForEvent('download'),
      card.getByRole('button', { name: new RegExp(`^Export ${format} for `) }).click()
    ]);
    const path = join(root, file.suggestedFilename()); await file.saveAs(path);
    return { bytes: [...await readFile(path)], name: file.suggestedFilename() };
  };
  const png = await download(first, 'PNG');
  assert.equal(png.name, 'first-before-after.png');
  const pixels = await page.evaluate(async bytes => {
    const bitmap = await createImageBitmap(new Blob([new Uint8Array(bytes)], { type: 'image/png' }));
    const canvas = document.createElement('canvas'); canvas.width = bitmap.width; canvas.height = bitmap.height;
    const ctx = canvas.getContext('2d'); ctx.drawImage(bitmap, 0, 0);
    const result = { width: canvas.width, height: canvas.height,
      left: [...ctx.getImageData(80, 100, 1, 1).data], right: [...ctx.getImageData(340, 100, 1, 1).data],
      header: [...ctx.getImageData(5, 5, 1, 1).data] };
    bitmap.close(); return result;
  }, png.bytes);
  assert.deepEqual(pixels, { width: 540, height: 212, left: [255,0,0,255], right: [0,0,255,255], header: [250,251,249,255] });
  const gif = await download(first, 'GIF');
  assert.equal(gif.name, 'first-before-after.gif');
  assert.equal(Buffer.from(gif.bytes).subarray(0, 6).toString(), 'GIF89a');
  const animation = await page.evaluate(async bytes => {
    const decoder = new ImageDecoder({ data: new Uint8Array(bytes), type: 'image/gif' });
    await decoder.tracks.ready;
    const result = { frames: decoder.tracks.selectedTrack.frameCount,
      repeats: decoder.tracks.selectedTrack.repetitionCount === Infinity, samples: [] };
    for (const index of [0, 15, 30, 45]) {
      const { image } = await decoder.decode({ frameIndex: index });
      const canvas = document.createElement('canvas'); canvas.width = image.displayWidth; canvas.height = image.displayHeight;
      const ctx = canvas.getContext('2d'); ctx.drawImage(image, 0, 0);
      result.samples.push({ delay: image.duration, left: [...ctx.getImageData(80, 100, 1, 1).data], right: [...ctx.getImageData(220, 100, 1, 1).data] });
      image.close();
    }
    decoder.close(); return result;
  }, gif.bytes);
  const red = [255,0,0,255], blue = [0,0,255,255];
  assert.equal(animation.frames, 60); assert.equal(animation.repeats, true);
  assert.deepEqual(animation.samples, [
    { delay: 700000, left: red, right: red }, { delay: 70000, left: red, right: blue },
    { delay: 700000, left: blue, right: blue }, { delay: 70000, left: red, right: blue }
  ]);
  assert.equal(await first.locator('input[type=range]').inputValue(), '37');
  const png2 = await download(second, 'PNG'); assert.equal(png2.name, 'second-before-after.png');
  const contain = await page.evaluate(async bytes => {
    const image = await createImageBitmap(new Blob([new Uint8Array(bytes)], { type: 'image/png' }));
    const canvas = document.createElement('canvas'); canvas.width = image.width; canvas.height = image.height;
    const ctx = canvas.getContext('2d'); ctx.drawImage(image,0,0); image.close();
    return [...ctx.getImageData(285,100,1,1).data];
  }, png2.bytes);
  assert.deepEqual(contain, [250,251,249,255]);
  // Cancel immediately after starting; the next job must remain usable.
  await first.getByRole('button', { name: 'Export GIF for First', exact: true }).click();
  assert.equal(await second.getByRole('button', { name: 'Export PNG for Second', exact: true }).isDisabled(), true);
  await first.getByRole('button', { name: 'Cancel GIF for First', exact: true }).click();
  await page.waitForFunction(() => document.querySelector('.export-status').textContent === 'GIF export cancelled.');
  assert.equal(await second.getByRole('button', { name: 'Export PNG for Second', exact: true }).isEnabled(), true);
  // A bad image produces actionable feedback and releases the export lock.
  await page.evaluate(() => { data.pairs[0].before = 'data:image/png;base64,invalid'; });
  await first.getByRole('button', { name: 'Export PNG for First', exact: true }).click();
  await page.waitForFunction(() => !document.querySelector('.error').hidden);
  assert.match(await first.locator('.error').textContent(), /Export failed:/);
  assert.equal(await second.getByRole('button', { name: 'Export PNG for Second', exact: true }).isEnabled(), true);
  assert.deepEqual(errors, []); assert.deepEqual(network, []);
  console.log('Passed: real offline PNG/GIF downloads, side-by-side pixels, labels outside image area, 60-frame looping GIF, pauses and reverse sweep, contain/cover, entry filenames, slider preservation, cancellation, error recovery, and no network requests.');
} finally { await browser?.close(); await rm(root, { recursive: true, force: true }); }
