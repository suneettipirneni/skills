import http from 'node:http';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import {runAudit} from '../audit.mjs';

// Synthetic, original fixture. Values are local contracts, not Bell/WCAG rules.
const html=`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Container adaptation calibration</title><style>
*{box-sizing:border-box}body{margin:0;background:#f6f5f0;color:#252725;font:16px/1.5 system-ui}main{padding:24px}h1{font-size:1.5em;line-height:1.2;margin:0 0 16px}p{margin:0 0 24px;overflow-wrap:anywhere}.inspector{background:white;padding:16px;border:1px solid #656b60;border-radius:8px;width:300px}.actions{display:flex;flex-wrap:wrap;gap:12px}.actions button{flex:1 1 11.25em;min-width:0;min-height:44px;padding:8px 12px;font:inherit;white-space:normal;overflow-wrap:anywhere;border:1px solid #343a31;border-radius:4px;background:white;color:#252725}.actions button:first-child{background:#253c2c;color:white}.broken .actions{flex-wrap:nowrap}.broken button{flex:0 0 180px;height:44px;white-space:nowrap;overflow:hidden}
</style><main><section class="inspector" aria-labelledby="title"><h1 id="title">Delivery details</h1><p>Review the selected delivery, then contact its owner or return to the queue.</p><div class="actions"><button>Contact owner</button><button>Return to queue</button></div></section></main></html>`;
const server=http.createServer((req,res)=>{res.setHeader('content-type','text/html');res.end(html);});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const out=await fs.mkdtemp(path.join(os.tmpdir(),'ui-harmony-resilience-'));
const channel=process.env.UI_HARMONY_TEST_CHANNEL==='chromium'?undefined:(process.env.UI_HARMONY_TEST_CHANNEL??'chrome');
const results=[];
try{
 for(const scenario of [
  {id:'narrow',width:300,text:16,long:false,broken:false},
  {id:'wide',width:420,text:16,long:false,broken:false},
  {id:'narrow-long-grown',width:300,text:32,long:true,broken:false},
  {id:'wide-long-grown',width:420,text:32,long:true,broken:false},
  {id:'broken-narrow',width:300,text:16,long:true,broken:true},
 ]){
  const setup=path.join(out,scenario.id+'.mjs');
  const measurement=path.join(out,scenario.id+'-geometry.json');
  await fs.writeFile(setup,`import fs from 'node:fs/promises';\nexport default async function({page}){\nconst scenario=${JSON.stringify(scenario)};\nawait page.evaluate(s=>{const el=document.querySelector('.inspector');el.style.width=s.width+'px';el.style.fontSize=s.text+'px';if(s.broken)el.classList.add('broken');if(s.long){document.querySelectorAll('button')[0].textContent='Contact the assigned delivery coordinator';document.querySelectorAll('button')[1].textContent='Return to the delivery review queue';}},scenario);\nconst result=await page.evaluate(()=>{const box=document.querySelector('.inspector').getBoundingClientRect();const buttons=[...document.querySelectorAll('button')].map(el=>{const r=el.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height,clientWidth:el.clientWidth,scrollWidth:el.scrollWidth,clientHeight:el.clientHeight,scrollHeight:el.scrollHeight};});return {container:{left:box.left,right:box.right,width:box.width},buttons,fontSize:getComputedStyle(document.querySelector('.inspector')).fontSize};});\nawait fs.writeFile(${JSON.stringify(measurement)},JSON.stringify(result,null,2));\n}`);
  const report=await runAudit({url:`http://127.0.0.1:${server.address().port}/`,out:path.join(out,scenario.id),channel,setup,state:scenario.id,fixture:'container-actions-v1',config:{viewports:[{name:'desktop',width:1440,height:1000}]}});
  assert.deepEqual(report.errors,[]);
  const geometry=JSON.parse(await fs.readFile(measurement,'utf8'));
  const overflow=geometry.buttons.some(b=>b.right>geometry.container.right+1||b.scrollWidth>b.clientWidth+1||b.scrollHeight>b.clientHeight+1);
  assert.equal(overflow,scenario.broken,scenario.id+' must accurately distinguish content/container overflow');
  if(scenario.id==='narrow')assert.ok(geometry.buttons[1].top>geometry.buttons[0].bottom,'narrow container should wrap');
  if(scenario.text===32)assert.ok(geometry.buttons[1].top>geometry.buttons[0].bottom,'grown text should recompose actions rather than become narrow text towers');
  if(scenario.id==='wide')assert.equal(geometry.buttons[1].top,geometry.buttons[0].top,'wide container should keep related actions on one line');
  if(!scenario.broken)assert.ok(!report.findings.some(f=>['page-overflow','text-clipping'].includes(f.rule)),JSON.stringify(report.findings));
  if(scenario.broken)assert.ok(report.findings.some(f=>f.rule==='text-clipping'),'broken fixed button text must be detected');
  results.push({scenario,geometry,findings:report.findings.map(f=>({rule:f.rule,kind:f.kind})),screenshot:path.join(out,scenario.id,report.cases[0].screenshot)});
 }
 await fs.writeFile(path.join(out,'results.json'),JSON.stringify(results,null,2));
 console.log(JSON.stringify({result:'passed',cases:results.length,evidence:out,note:'Container adaptation and simulated text growth at one viewport; not real zoom, usability, motion or general design validation.'}));
}finally{await new Promise(resolve=>server.close(resolve));}
