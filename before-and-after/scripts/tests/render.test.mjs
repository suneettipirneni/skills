import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { render } from '../render.mjs';

export const svg = color => `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="240"><rect width="400" height="240" fill="${color}"/></svg>`;
async function fixture(t) {
  const root = await mkdtemp(join(tmpdir(), 'before-after-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  await writeFile(join(root, 'before.svg'), svg('#ff0000'));
  await writeFile(join(root, 'after.svg'), svg('#0000ff'));
  return { root, output: join(root, 'review.html'), manifest: join(root, 'pairs.json') };
}
const parse = html => JSON.parse(html.match(/<script id="comparison-data" type="application\/json">([\s\S]*?)<\/script>/)[1]);
const pair = extra => ({ before: 'before.svg', after: 'after.svg', ...extra });

test('single export embeds images and escapes untrusted text', async t => {
  const { root, output } = await fixture(t);
  await render(['--before', join(root,'before.svg'), '--after', join(root,'after.svg'), '--title', '</script><script>alert(1)</script> $&', '--output', output]);
  const html = await readFile(output, 'utf8');
  const data = parse(html);
  assert.equal(data.pairs.length, 1);
  assert.match(data.pairs[0].before, /^data:image\/svg\+xml;base64,/);
  assert.equal(data.title, '</script><script>alert(1)</script> $&');
  assert.ok(!html.includes('<script>alert(1)</script>'));
  assert.ok(!html.includes(root));
});

test('batch append updates IDs in place, keeps old embedded images, appends missing IDs', async t => {
  const { root, output, manifest } = await fixture(t);
  await writeFile(manifest, JSON.stringify({title:'First review', pairs: Array.from({length:12}, (_,i)=> pair({id:`pair-${i}`,title:`Pair ${i}`}))}));
  await render(['--manifest',manifest,'--output',output]);
  const original = parse(await readFile(output,'utf8'));
  await writeFile(manifest, JSON.stringify({pairs:[pair({id:'pair-0',title:'Updated'}),pair({title:'New'})]}));
  await render(['--manifest',manifest,'--output',output,'--append']);
  const result = parse(await readFile(output,'utf8'));
  assert.equal(result.title,'First review');
  assert.equal(result.pairs.length,13);
  assert.equal(result.pairs[0].title,'Updated');
  assert.deepEqual(result.pairs[1],original.pairs[1]);
  assert.equal(result.pairs[12].title,'New');
  await writeFile(manifest, JSON.stringify({title:'Second review',pairs:[pair({title:'Another'})]}));
  await render(['--manifest',manifest,'--output',output,'--append']);
  assert.equal(parse(await readFile(output,'utf8')).pairs.length,14);
  assert.equal(parse(await readFile(output,'utf8')).title,'Second review');
});

test('protects existing files and leaves exports intact on invalid batches', async t => {
  const { output, manifest } = await fixture(t);
  await writeFile(manifest,JSON.stringify({pairs:[pair()]}));
  const argv = ['--manifest',manifest,'--output',output];
  await render(argv);
  const original = await readFile(output,'utf8');
  await assert.rejects(render(argv),/Output exists/);
  for (const pairs of [[],[pair({id:'x'}),pair({id:'x'})],[pair({position:101})],[pair({fit:'stretch'})],[pair({after:'missing.png'})],[pair({before:'https://example.org/a.png'})]]) {
    await writeFile(manifest,JSON.stringify({pairs}));
    await assert.rejects(render([...argv,'--append']));
    assert.equal(await readFile(output,'utf8'),original);
  }
  await writeFile(manifest,JSON.stringify({pairs:[pair({title:'Replacement'})]}));
  await render([...argv,'--force']);
  assert.equal(parse(await readFile(output,'utf8')).pairs[0].title,'Replacement');
});

test('rejects non-images, malformed append targets, and conflicting arguments', async t => {
  const { root, output, manifest } = await fixture(t);
  await writeFile(join(root,'fake.png'),'this is not an image');
  await writeFile(manifest,JSON.stringify({pairs:[pair({before:'fake.png'})]}));
  await assert.rejects(render(['--manifest',manifest,'--output',output]),/Unsupported image/);
  await writeFile(output,'<html>Unrelated file</html>');
  await assert.rejects(render(['--manifest',manifest,'--output',output,'--append']),/not a Before and After/);
  await assert.rejects(render(['--manifest',manifest,'--before','a.png','--output',output]),/Choose a manifest/);
  await assert.rejects(render(['--output',output,'--append','--force']),/Choose --append/);
});


test('metadata resembling template tokens remains literal', async t => {
  const { root, output } = await fixture(t);
  const title = '/*EXPORT_CODE*/ /*COMPARISON_DATA*/ <!--DOCUMENT_TITLE-->';
  await render(['--before', join(root, 'before.svg'), '--after', join(root, 'after.svg'), '--title', title, '--output', output]);
  const data = parse(await readFile(output, 'utf8'));
  assert.equal(data.title, title);
  assert.equal(data.pairs[0].title, title);
});
