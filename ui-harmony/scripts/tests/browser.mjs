import http from 'node:http';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import {runAudit} from '../audit.mjs';
import {compare} from '../lib/analyze.mjs';

let broken=true;
const page=()=>`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Audit calibration form</title><style>*{box-sizing:border-box}body{font:16px/1.5 system-ui;margin:0;color:#202020;background:white}main{margin:24px;${broken?'width:680px':'max-width:680px'}}h1{font-size:28px;line-height:1.2}section{padding:12px;margin:16px 0;background:#f4f4f4;border-radius:8px}.drift{padding-top:${broken?27:12}px}label{display:block;font-weight:600}input{width:100%;min-height:44px;font:inherit}.help{max-width:250px;${broken?'height:22px;overflow:hidden':''}}button{${broken?'width:18px;height:18px;padding:0':'min-width:44px;min-height:44px'};border:1px solid #222;background:white;color:#222}.muted{color:${broken?'#aaa':'#555'}}.scroller{overflow:auto;max-width:100%}table{width:750px;border-collapse:collapse}td,th{text-align:left;padding:8px}.hidden{display:none}.invisible{opacity:0}</style><main><h1>Account settings</h1><p class="muted">Update where account notifications are delivered.</p><section class="field"><label for="name">Name</label><input id="name" autocomplete="name"></section><section class="field drift"><label for="email">Email</label><input id="email" type="email" autocomplete="email" aria-describedby="help"><p class="help" id="help">Use an address you can access. We will send a confirmation link before changing the account.</p></section><button id="save" ${broken?'':'aria-label="Save account settings"'}>${broken?'':'Save'}</button><div class="scroller" role="region" aria-label="Notification delivery history" tabindex="0"><table><caption>Recent deliveries</caption><tr><th>Date</th><th>Destination</th></tr><tr><td>November 15</td><td>Account inbox</td></tr></table></div><div class="hidden"><button style="width:1px;height:1px">Hidden</button></div><div class="invisible"><button style="width:1px;height:1px">Invisible</button></div></main></html>`;
const server=http.createServer((req,res)=>{if(req.url==='/redirect'){res.writeHead(302,{Location:'/login'});res.end();return;}res.setHeader('content-type','text/html');res.end(page());});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const root=await fs.mkdtemp(path.join(os.tmpdir(),'ui-harmony-test-'));
const url=`http://127.0.0.1:${server.address().port}/`;
const channel=process.env.UI_HARMONY_TEST_CHANNEL==='chromium'?undefined:(process.env.UI_HARMONY_TEST_CHANNEL??'chrome');
const config={viewports:[{name:'phone',width:320,height:800},{name:'desktop',width:1440,height:1000}],groups:[{name:'field-padding',selector:'.field',rationale:'Equivalent field containers share internal spacing',styles:{'padding-top':['12px']},minCount:2,tolerance:.5}]};
try {
  const before=await runAudit({url,out:path.join(root,'before'),channel,config,fixture:'settings-v1'});
  assert.equal(before.errors.length,0,JSON.stringify(before.errors));
  for(const rule of ['page-overflow','style-contract','text-clipping','small-target-candidate','axe:button-name','axe:color-contrast']) assert.ok(before.findings.some(f=>f.rule===rule),`Expected detection of ${rule}`);
  broken=false;
  const after=await runAudit({url,out:path.join(root,'after'),channel,config,fixture:'settings-v1'});
  assert.equal(after.errors.length,0,JSON.stringify(after.errors));
  // An intentional local scroller can make axe contrast indeterminate for
  // partially visible cells. Preserve those reviews rather than call them passes.
  assert.ok(after.findings.every(f=>f.kind==='review'&&f.rule==='axe:color-contrast'),JSON.stringify(after.findings));
  assert.equal(after.coverage.automatedStatus,'captured');
  const diff=compare(before,after);assert.equal(diff.comparable,true);assert.ok(diff.introduced.every(f=>f.kind==='review'));assert.ok(diff.absent.length>0);
  const missing=await runAudit({url,out:path.join(root,'missing'),channel,config:{...config,viewports:[config.viewports[0]],groups:[{name:'missing',selector:'.missing',styles:{'font-size':['16px']}}]}});
  assert.equal(missing.coverage.automatedStatus,'incomplete');assert.equal(missing.coverage.unverifiedContracts,1);
  const redirect=await runAudit({url:url+'redirect',out:path.join(root,'redirect'),channel,config:{viewports:[config.viewports[0]]}});
  assert.equal(redirect.coverage.automatedStatus,'incomplete');assert.ok(redirect.errors.some(e=>e.stage==='readiness'));
  const spacing=await runAudit({url,out:path.join(root,'spacing'),channel,config:{viewports:[config.viewports[0]]},textSpacing:true});
  assert.equal(spacing.errors.length,0);assert.equal(spacing.cases[0].textSpacing,true);
  console.log(JSON.stringify({result:'passed',cases:7,beforeFindings:before.findings.length,afterConfirmedFindings:after.findings.filter(f=>f.kind!=='review').length,remainingManualReviews:after.findings.length,evidence:root}));
} finally {await new Promise(resolve=>server.close(resolve));}
