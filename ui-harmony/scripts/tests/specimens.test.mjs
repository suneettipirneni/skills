import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const cli = fileURLToPath(new URL('../specimens.mjs', import.meta.url));
const call = args => spawnSync(process.execPath, [cli, ...args], {encoding: 'utf8'});

test('every field specimen has an original source and a distinct, readable local capture', async () => {
  const result = call([]);
  assert.equal(result.status, 0);
  const rows = JSON.parse(result.stdout);
  assert.equal(new Set(rows.map(r => r.id)).size, rows.length);
  const used = new Set();
  for (const row of rows) {
    assert.equal(new URL(row.source).protocol, 'https:');
    assert.ok(row.tasks.length && row.frames.length && row.preserve && row.test);
    for (const f of row.frames) {
      assert.ok(!used.has(f), 'duplicate capture: ' + f);
      used.add(f);
      assert.equal((await fs.readFile(f)).readUInt16BE(0), 0xffd8);
    }
  }
  const dir = path.dirname([...used][0]);
  assert.equal((await fs.readdir(dir)).filter(f => f.endsWith('.jpg')).length, used.size);
});

test('selected references produce a portable board and reject missing IDs and stale destinations', async () => {
  const folder = await fs.mkdtemp(path.join(os.tmpdir(), 'ui-specimens-'));
  const file = path.join(folder, 'study.html');
  const args = ['--task', 'workspace', '--id', 'tool-hints', '--out', file];
  assert.equal(call(args).status, 0);
  const html = await fs.readFile(file, 'utf8');
  assert.equal(html.match(/data:image\/jpeg;base64,/g).length, 3);
  assert.ok(html.includes('https://fluidfunctionalism.com/docs/tooltip'));
  assert.equal(call(args).status, 2);
  assert.equal(call(['--id', 'no-such-specimen']).status, 2);
});

test('compare a generated render beside only the selected source and embed both for offline review', async () => {
  const folder = await fs.mkdtemp(path.join(os.tmpdir(), 'ui-reference-render-'));
  const file = path.join(folder, 'review.html');
  const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a1BEAAAAASUVORK5CYII=', 'base64');
  const shot = path.join(folder, 'candidate & draft.png');
  await fs.writeFile(shot, png);
  assert.equal(call(['--candidate', shot, '--out', file]).status, 2);
  assert.equal(call(['--id', 'value-row', '--candidate', shot, '--out', file]).status, 0);
  const html = await fs.readFile(file, 'utf8');
  assert.equal(html.match(/data:image\/jpeg;base64,/g).length, 1);
  assert.ok(html.includes('data:image/png;base64,' + png.toString('base64')));
  assert.ok(html.includes('candidate &amp; draft.png'));
  assert.equal(call(['--id', 'value-row', '--candidate', file, '--out', path.join(folder, 'invalid.html')]).status, 2);
});
