import test from 'node:test';
import assert from 'node:assert/strict';
import {validateDetailConfig,paintBalance,paintBalanceSensitivity} from '../lib/detail.mjs';
const config=()=>({components:[{name:'icon',selector:'.icon',parts:{paint:{selector:'path'},frame:{selector:'$root'}},checks:[{kind:'paint-balance',a:'paint',b:'frame',rationale:'Compare the visible arrow contribution with this button frame.'}]}]});
const mask=(w,h,predicate)=>({width:w,height:h,mask:Uint8Array.from({length:w*h},(_,i)=>Number(predicate(i%w,Math.floor(i/w))))});
const frame={x:0,y:0,width:4,height:4};
test('paint-balance has strict review-only configuration and normalized frame region',()=>{
 assert.doesNotThrow(()=>validateDetailConfig(config()));const region=config();region.components[0].checks[0].region={x:.1,y:.2,width:.8,height:.6};assert.doesNotThrow(()=>validateDetailConfig(region));
 for(const patch of [{tolerance:1},{offsetX:1},{minGap:0},{pass:true},{threshold:4},{rationale:''},{b:'missing'},{b:'paint'},{region:null},{region:false},{region:0},{region:{x:0,y:0,width:2,height:1}},{region:{x:0,y:0,width:1,height:1,extra:true}}]){const c=config();Object.assign(c.components[0].checks[0],patch);assert.throws(()=>validateDetailConfig(c))}
});
test('asymmetric triangle separates bounds center from binary coverage centroid',()=>{
 const r=paintBalance(mask(4,4,(x,y)=>x+y<=3),1,frame);
 assert.equal(r.status,'review-needed');assert.equal(r.reviewRequired,true);assert.equal('pass' in r,false);
 assert.deepEqual(r.observed.boundsCenterOffsetCssPx,{x:0,y:0});assert.deepEqual(r.observed.coverageCentroidOffsetCssPx,{x:-.5,y:-.5});assert.equal(r.observed.paintedAreaCssPx2,10);
});
test('transparent viewBox-like padding and signed insets retain their meaning',()=>{
 const r=paintBalance(mask(8,8,(x,y)=>x>=1&&x<=2&&y>=2&&y<=3),1,{x:0,y:0,width:8,height:8});
 assert.deepEqual(r.observed.inkBoundsCssPx,{x:1,y:2,width:2,height:2});assert.deepEqual(r.observed.signedInsetsCssPx,{left:1,top:2,right:5,bottom:4});assert.deepEqual(r.observed.boundsCenterOffsetCssPx,{x:-2,y:-1});
 const shifted=paintBalance(mask(8,8,(x,y)=>x>=1&&x<=2&&y>=2&&y<=3),1,{x:102,y:203,width:1,height:1},{x:100,y:200});
 assert.deepEqual(shifted.observed.signedInsetsCssPx,{left:-1,top:-1,right:0,bottom:0});
});
test('pixel-cell metrics are DPR invariant under exact raster replication',()=>{
 const a=paintBalance(mask(4,4,(x,y)=>x+y<=3),1,frame),b=paintBalance(mask(8,8,(x,y)=>Math.floor(x/2)+Math.floor(y/2)<=3),2,frame);
 for(const key of Object.keys(a.observed))if(key!=='paintPixels')assert.deepEqual(b.observed[key],a.observed[key],key);
 assert.equal(b.observed.paintPixels,a.observed.paintPixels*4);
});
test('threshold sensitivity flags differing coverage without becoming a verdict',()=>{
 const raster=values=>({width:values.length,height:1,data:Uint8Array.from(values.flatMap(v=>[v,v,v,255]))});
 const r=paintBalanceSensitivity(raster([255,255,255]),raster([251,247,239]),1,{x:0,y:0,width:3,height:1},{x:0,y:0},8);
 assert.deepEqual(r.sensitivity.samples.map(s=>s.threshold),[4,8,16]);assert.deepEqual(r.sensitivity.samples.map(s=>s.observed.paintPixels),[3,2,1]);assert.equal(r.sensitivity.measurementVariation,true);assert.equal(r.observed.threshold,8);assert.equal('pass' in r,false);
 assert.ok(r.sensitivity.samples.every(s=>s.reviewRequired&&!('pass'in s)));
 const zero=paintBalanceSensitivity(raster([255]),raster([255]),1,{x:0,y:0,width:1,height:1},{x:0,y:0});assert.equal(zero.status,'unverified');assert.equal('pass'in zero,false);
});
test('threshold endpoints are explicit and a missing sensitivity sample is disclosed',()=>{
 const base={width:1,height:1,data:Uint8Array.from([255,255,255,255])},layer={width:1,height:1,data:Uint8Array.from([245,245,245,255])};
 const r=paintBalanceSensitivity(base,layer,1,{x:0,y:0,width:1,height:1},{x:0,y:0},8);assert.equal(r.status,'review-needed');assert.equal(r.sensitivity.samples[2].status,'unverified');assert.equal(r.sensitivity.measurementVariation,true);
 const low=paintBalanceSensitivity(base,layer,1,{x:0,y:0,width:1,height:1},{x:0,y:0},1);assert.deepEqual(low.sensitivity.samples.map(s=>s.threshold),[1,1,2]);
 assert.throws(()=>paintBalance(mask(1,1,()=>true),0,frame));assert.throws(()=>paintBalance(mask(1,1,()=>true),1,{...frame,width:0}));
});
