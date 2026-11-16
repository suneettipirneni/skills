import test from 'node:test';
import assert from 'node:assert/strict';
import {validateDetailConfig,geometryCheck,paintMask,inkGap} from '../lib/detail.mjs';
const rect=(x,y,width,height)=>({rect:{x,y,width,height}});
const config=()=>({components:[{name:'control',selector:'.control',parts:{arc:{selector:'svg'},label:{selector:'.label'}},checks:[{kind:'ink-gap',a:'arc',b:'label',minGap:1,rationale:'Separate internal numeral from surrounding stroke.'}]}]});
test('detail config rejects missing coverage and ignored parameters',()=>{
 assert.doesNotThrow(()=>validateDetailConfig(config()));
 for(const mutate of [c=>c.viewports=[],c=>c.components[0].checks[0].offsetX=2,c=>c.components[0].checks[0].minGap=-1,c=>c.components[0].checks[0].rationale='',c=>c.components[0].maxCount=0,c=>c.paintThreshold=0]){const c=config();mutate(c);assert.throws(()=>validateDetailConfig(c))}
});
test('paired comparison evaluates actual connector gaps, not container center',()=>{
 const q={kind:'between',a:'old',b:'arrow',c:'next',axis:'x',minGap:8,tolerance:1};
 const p={old:rect(0,0,80,20),arrow:rect(300,0,16,20),next:rect(340,0,80,20)};
 assert.equal(geometryCheck(q,p).pass,false);assert.equal(geometryCheck(q,p).observed.imbalance,196);
 p.arrow=rect(92,0,16,20);p.next=rect(120,0,80,20);assert.equal(geometryCheck(q,p).pass,true);
});
test('optical offsets and fractional layouts remain intentional contracts',()=>{
 assert.equal(geometryCheck({kind:'center',a:'a',b:'b',offsetX:.5,offsetY:1,tolerance:.1},{a:rect(4.5,5,12,12),b:rect(0,0,20,20)}).pass,true);
 assert.equal(geometryCheck({kind:'inside',a:'a',b:'b',region:{x:.25,y:.25,width:.5,height:.5},tolerance:0},{a:rect(4,6,8,8),b:rect(0,0,20,20)}).observed.clearance.left,-1);
});
test('paint masks detect real layer overlap and do not confuse bounding-box overlap',()=>{
 const layer=points=>{const data=Buffer.alloc(12*12*4,255);for(const [x,y]of points){const j=(y*12+x)*4;data[j]=data[j+1]=data[j+2]=0}return {width:12,height:12,data}};
 const base=layer([]),a=paintMask(base,layer([[2,2],[2,8],[8,2],[8,8]])),b=paintMask(base,layer([[5,5]]));
 assert.equal(inkGap(a,b,1,1).pass,true);
 assert.equal(inkGap(a,a,1,1).observed.overlapPixels,4);
 assert.equal(inkGap(a,paintMask(base,base),1,1).status,'unverified');
});
test('paint clearance is expressed in CSS pixels at distinct DPR',()=>{
 const mask=(x)=>({mask:Uint8Array.from({length:25},(_,i)=>i===x?1:0),count:1,width:25,height:1});
 assert.equal(inkGap(mask(2),mask(5),1,3).observed.minimumClearanceCssPx,2);
 assert.equal(inkGap(mask(2),mask(5),2,2).observed.minimumClearanceCssPx,1);
});
test('diagonal cells touching at a corner have zero clearance',()=>{
 const mask=(x,y)=>({mask:Uint8Array.from({length:16},(_,i)=>i===y*4+x?1:0),count:1,width:4,height:4});
 const r=inkGap(mask(0,0),mask(1,1),1,.3);
 assert.equal(r.observed.minimumClearanceCssPx,0);assert.equal(r.pass,false);
 assert.equal(inkGap(mask(0,0),mask(2,2),2,1).observed.minimumClearanceCssPx,Math.SQRT2/2);
});
test('zero-clearance optimization retains full overlap count and witness',()=>{
 const mask={mask:new Uint8Array(256*256).fill(1),count:256*256,width:256,height:256};
 const r=inkGap(mask,mask,3,16);assert.equal(r.observed.overlapPixels,256*256);assert.equal(r.observed.minimumClearanceCssPx,0);assert.equal(r.pass,false);assert.deepEqual(r.observed.closestPaintCssPx.a,r.observed.closestPaintCssPx.b);
});
test('malformed checks and inherited part names fail with useful errors',()=>{
 for(const value of [null,undefined,3,'oops']){const c=config();c.components[0].checks=[value];assert.throws(()=>validateDetailConfig(c),/Each check must be an object/)}
 const c=config();c.components[0].checks[0].a='constructor';assert.throws(()=>validateDetailConfig(c),/valid distinct parts/);
});

test('edge alignment preserves fractional right edges and authored offsets',()=>{
 const q={kind:'edge-align',a:'a',b:'b',edge:'right',offset:.25,tolerance:.01,rationale:'Align these right edges with the intentional quarter pixel offset.'};
 const p={a:rect(8.25,4,12,9),b:rect(0,0,20,20)};const r=geometryCheck(q,p);assert.equal(r.pass,true);assert.equal(r.observed.delta,.25);
 assert.equal(geometryCheck({...q,offset:0},p).pass,false);
 assert.equal(geometryCheck({...q,edge:'left',referenceEdge:'right',offset:-11.75},p).pass,true);
 const c=config();c.components[0].checks=[{...q,a:'arc',b:'label'}];assert.doesNotThrow(()=>validateDetailConfig(c));
 for(const patch of [{referenceEdge:'top'},{edge:'baseline'},{offset:Infinity},{minGap:1}]){const bad=structuredClone(c);Object.assign(bad.components[0].checks[0],patch);assert.throws(()=>validateDetailConfig(bad))}
});
test('one-sided insets retain intentional opposite gaps and negative overhang',()=>{
 const q={kind:'insets',a:'a',b:'b',insets:{left:8},tolerance:.1,rationale:'Keep the group start inset while allowing the authored remaining space.'};
 const p={a:rect(8,3,10,9),b:rect(0,0,100,20)};const r=geometryCheck(q,p);assert.equal(r.pass,true);assert.equal(r.observed.clearance.right,82);assert.deepEqual(r.observed.deltas,{left:0});
 assert.equal(geometryCheck({...q,insets:{left:-2,top:3}},{a:rect(-2,3,12,9),b:p.b}).pass,true);
 assert.equal(geometryCheck({...q,insets:{right:8}},p).pass,false);
 const c=config();c.components[0].checks=[{...q,a:'arc',b:'label'}];assert.doesNotThrow(()=>validateDetailConfig(c));
 for(const insets of [{},null,{left:NaN},{bottom:Infinity},{left:8,start:2}]){const bad=structuredClone(c);bad.components[0].checks[0].insets=insets;assert.throws(()=>validateDetailConfig(bad))}
});
