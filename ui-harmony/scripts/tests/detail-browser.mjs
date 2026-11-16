// Explicit browser calibration; not included in fast unit tests.
// node scripts/tests/detail-browser.mjs [NEW_ARTIFACT_DIRECTORY]
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {runDetailAudit} from '../detail-audit.mjs';
const out=process.argv[2]?path.resolve(process.argv[2]):await fs.mkdtemp(path.join(os.tmpdir(),'ui-harmony-detail-browser-'));
if(process.argv[2])await fs.mkdir(out,{recursive:false});
const fixture=path.join(out,'fixture.html');
await fs.writeFile(fixture,`<!doctype html><meta charset="utf-8"><style>
@keyframes settle{from{background:#eee}to{background:white}}#settling{animation:settle .4s forwards}body{margin:20px;background:white}.control{position:relative;width:160px;height:40px;margin-bottom:15px;border:1px solid #bbb}.part{position:absolute;top:10px;width:20px;height:20px;background:black}.a{left:10px}.b{left:120px}
#collision .b{left:20px}.paint{position:absolute;top:0;width:10px;height:10px;background:red}#override .paint{visibility:visible}.a .paint{left:50px}.b .paint{left:-60px}#overflow .paint{top:70px}
#pseudo .a::before{content:'';position:absolute;width:5px;height:5px;background:red}#shadow .a{box-shadow:2px 0 4px red}#hidden .a{display:none}#zero-pseudo .zero{display:block;width:0;height:0}#zero-pseudo .zero::before{content:"";position:absolute;visibility:visible;width:10px;height:10px;background:red}#ancestor-filter{filter:drop-shadow(40px 0 red)}
</style>
<div class="control" id="settling"><span class="part a"></span><span class="part b"></span></div>
<div class="control" id="separate"><span class="part a" style="color: blue;"></span><span class="part b"></span></div>
<div class="control" id="collision"><span class="part a"></span><span class="part b"></span></div>
<div class="control" id="override"><span class="part a" style="color: blue;"><span class="paint"></span></span><span class="part b"><span class="paint"></span></span></div>
<div class="control" id="overflow"><span class="part a"><span class="paint"></span></span><span class="part b"><span class="paint"></span></span></div>
<div class="control" id="pseudo"><span class="part a"></span><span class="part b"></span></div>
<div class="control" id="shadow"><span class="part a"></span><span class="part b"></span></div>
<div class="control" id="hidden"><span class="part a"></span><span class="part b"></span></div>
<div class="control" id="zero-pseudo"><span class="part a"><i class="zero"></i></span><span class="part b"></span></div>
<div class="control" id="ancestor-filter"><span class="part a"></span><span class="part b"></span></div>
<div class="control" id="ambiguous"><span class="part a"></span><span class="part a"></span><span class="part b"></span></div>
<script>document.getElementById('settling').addEventListener('animationend',e=>e.currentTarget.dataset.settled='true');for(const id of ['separate','override']){const root=document.getElementById(id);const update=()=>root.dataset.restored=String(root.querySelector('.a').getAttribute('style')==='color: blue;'&&root.querySelector('.b').getAttribute('style')===null);update();new MutationObserver(update).observe(root,{subtree:true,attributes:true,attributeFilter:['style']})}</script>`);
const make=(name,kind='ink-gap',selector='#'+name)=>({name,selector,parts:{a:{selector:'.a'},b:{selector:'.b'}},checks:[{kind,a:'a',b:'b',...(kind==='gap'?{axis:'x'}:{}),minGap:2,rationale:'The selected two parts must remain separated in this compact fixture.'}]});
const config={viewports:[{name:'desktop-1x',width:800,height:800,dpr:1},{name:'phone-2x',width:390,height:844,dpr:2}],components:[make('settling'),make('settled-state','gap','#settling[data-settled="true"]'),make('separate'),make('collision'),make('override'),make('overflow'),make('pseudo'),make('shadow'),make('hidden'),make('zero-pseudo'),make('ancestor-filter'),make('ambiguous'),make('missing'),make('restore-success','gap','#separate[data-restored="true"]'),make('restore-failure','gap','#override[data-restored="true"]')]};
const report=await runDetailAudit({url:pathToFileURL(fixture).href,out:path.join(out,'audit'),config});
let assertions=0;const check=(condition,message)=>{assert.ok(condition,message);assertions++};
for(const v of config.viewports){const one=name=>report.cases.find(c=>c.viewport.name===v.name&&c.component===name);check(one('settling').checks[0].pass,'finite animation should settle before isolation');check(one('settled-state')?.checks[0]?.pass,'finite animation must actually reach its finished state');check(one('separate').checks[0].pass,'separate paint should pass');check(one('collision').checks[0].pass===false,'overlapping paint should fail');check(one('collision').checks[0].observed.overlapPixels===200*v.dpr*v.dpr,'overlap count should scale with DPR');
for(const [name,pattern]of [['override',/visible descendants/],['overflow',/protrudes/],['pseudo',/pseudo-element/],['shadow',/shadows/],['hidden',/not rendered/],['zero-pseudo',/pseudo-element/],['ancestor-filter',/Ancestor filters/],['ambiguous',/exactly one/]])check(pattern.test(one(name).error),name+' must be incomplete');
check(report.errors.some(e=>e.viewport===v.name&&e.component==='missing'&&/found 0/.test(e.error)),'missing roots must be reported');for(const name of ['restore-success','restore-failure'])check(one(name)?.checks[0]?.pass,name+' must restore exact styles');}
check(report.summary.status==='incomplete','unsupported states must not produce complete status');check(report.summary.failedContracts===2,'both DPRs must retain collision failures');
await fs.writeFile(path.join(out,'checks.json'),JSON.stringify({assertions,summary:report.summary,scope:'Compact local fixtures; no global optical or accessibility verdict.'},null,2));
console.log(JSON.stringify({out,assertions,summary:report.summary}));
