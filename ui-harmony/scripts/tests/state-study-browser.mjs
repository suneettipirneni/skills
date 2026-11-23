import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { runStudy } from '../state-study.mjs';
import spec from '../../assets/examples/state-study/mix.mjs';
import toolsSpec from '../../assets/examples/state-study/tools.mjs';

const url = new URL('../../assets/examples/state-study/mix.html', import.meta.url).href;
const root = await fs.mkdtemp(path.join(os.tmpdir(), 'ui-state-study-'));
const channel = process.env.UI_HARMONY_TEST_CHANNEL === 'chromium' ? undefined : 'chrome';
const run = (name, study) => runStudy({url, channel, spec: study, specSource: {id: name}, out: path.join(root, name)});
const good = await run('baseline', spec);
assert.equal(good.status, 'passed', JSON.stringify(good.errors));
assert.equal(good.plannedFrames, 8);
for (const c of good.cases) {
  assert.equal(c.frames.length, 4);
  for (const frame of c.frames) {
    assert.equal(frame.checks.length, 4);
    assert.ok((await fs.stat(path.join(root, 'baseline', frame.image))).size > 0);
  }
}
const [first, second] = spec.states;
const bad = await run('regression', {...spec, states: [first, {...second, async enter(page) {
  await second.enter(page);
  await page.locator('#readout').evaluate(el => {
    el.value = '60%';
    el.style.transform = 'translateX(-12px)';
  });
}}]});
assert.equal(bad.status, 'failed');
assert.deepEqual(bad.plannedStates, ['At rest', 'Minimum']);
assert.equal(bad.specSource.id, 'regression');
for (const c of bad.cases) assert.deepEqual(c.frames[1].checks.filter(k => k.status === 'fail').map(k => k.name), ['Visible readout', 'Value column']);
const missing = await run('missing', {...spec, anchors: [{...spec.anchors[0], selector: '#absent'}]});
assert.equal(missing.status, 'incomplete');
assert.equal(missing.errors.length, 2);
assert.equal(missing.cases[0].frames.length, 1);
const toolsUrl = new URL('../../assets/examples/state-study/tools.html', import.meta.url).href;
const toolbar = await runStudy({url: toolsUrl, channel, spec: toolsSpec, out: path.join(root, 'tools')});
assert.equal(toolbar.status, 'passed', JSON.stringify(toolbar));
assert.equal(toolbar.plannedFrames, 6);
console.log('Verified correct states, injected behavior and layout regressions, and missing evidence. Reports at ' + root);
