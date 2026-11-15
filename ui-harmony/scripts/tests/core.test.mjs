import test from 'node:test';
import assert from 'node:assert/strict';
import {analyze,validateConfig,compare,keyFor} from '../lib/analyze.mjs';
import {contrast} from '../contrast.mjs';
import {dimensions,validateReview} from '../review.mjs';
import {htmlReport} from '../lib/report.mjs';

const el=(selector,left=20,styles={})=>({selector,rect:{left,right:left+100,top:10,bottom:50,width:100,height:40,centerX:left+50,centerY:30},styles});
const snap=(groups=[],extra={})=>({caseId:'phone-light-no-preference-default',screenshot:'case.png',document:{overflowX:0},elements:[],groups,separations:[],...extra});
test('contract reports measured drift, target and concrete selector',()=>{
  const g={name:'card',selector:'.card',styles:{'padding-top':['12px']},elements:[el('#a',20,{'padding-top':'12px'}),el('#b',20,{'padding-top':'27px'})]};
  const r=analyze(snap([g]));assert.equal(r.findings.length,1);assert.equal(r.findings[0].observed,'27px');assert.equal(r.findings[0].selector,'#b');assert.equal(r.metrics[0].conformancePercent,50);
});
test('fractional pixel tolerance accepts intentional rounding',()=>{
  const g={name:'labels',selector:'.label',styles:{'font-size':['16px']},tolerance:.5,elements:[el('#a',20,{'font-size':'16.4px'})]};
  assert.equal(analyze(snap([g])).findings.length,0);
});
test('authored alignment reference beats peer majority',()=>{
  const g={name:'track',selector:'.row',align:'left',reference:20,elements:[el('#a',25),el('#b',25),el('#c',20)]};
  const r=analyze(snap([g]));assert.equal(r.findings.length,2);assert.equal(r.findings[0].observed.deltaCssPx,5);
});
test('zero-match contract is unverified; width exclusion is not applicable',()=>{
  assert.equal(analyze(snap([{name:'x',selector:'.x',styles:{color:['red']},elements:[]}])).findings[0].kind,'coverage');
  assert.equal(analyze(snap([{name:'x',selector:'.x',elements:[],skipped:'outside width range'}])).findings.length,0);
});
test('invalid thresholds, typo keys, inverted ranges and blank selectors reject',()=>{
  for(const g of [{align:'left',reference:'left'},{align:'left',minWidth:500,maxWidth:300},{align:'left',tolerence:1},{styles:{'font-size':[]}}, {align:'left',selector:' '}]) assert.throws(()=>validateConfig({groups:[{name:'g',selector:'.x',...g}]}));
  assert.throws(()=>validateConfig({geometryTolerance:NaN}));
});
test('finding identity includes contract and property',()=>{
  const f={caseId:'a',rule:'style-contract',selector:'#x',property:'padding',contract:'one'};
  assert.notEqual(keyFor(f),keyFor({...f,contract:'two'}));assert.notEqual(keyFor(f),keyFor({...f,property:'font-size'}));
});
test('exact exception does not suppress unrelated property',()=>{
  const g={name:'card',selector:'.card',styles:{'padding-top':['12px'],'font-size':['16px']},elements:[el('#a',20,{'padding-top':'27px','font-size':'30px'})]};
  const first=analyze(snap([g]));const r=analyze(snap([g]),{ignore:[{id:first.findings[0].id,reason:'Intentional padding variant'}]});
  assert.ok(r.findings[0].exception);assert.equal(r.findings[1].exception,undefined);
});
test('small target is review candidate, not accessibility verdict',()=>{
  const e=el('#small');e.interactive=true;e.rect.width=18;e.rect.height=18;
  const f=analyze(snap([],{elements:[e]})).findings[0];assert.equal(f.kind,'review');assert.match(f.message,/not a conformance verdict/);
});
test('gaps preserve signed measurement',()=>{
  const a=el('#a'),b=el('#b');b.rect.top=30;
  const r=analyze(snap([],{separations:[{name:'gap',a:[a],b:[b],axis:'y',minGap:12}]}));assert.equal(r.findings[0].observed.gapCssPx,-20);
});
test('contrast uses exact WCAG thresholds, no round-up',()=>{
  assert.equal(contrast('#000','#fff').ratio,21);assert.equal(contrast('#fff','#fff').ratio,1);
  const r=contrast('#777','#fff');assert.ok(r.ratio>4.47&&r.ratio<4.5);assert.equal(r.normalTextAA,false);assert.equal(r.largeTextAA,true);
  assert.throws(()=>contrast('#ffffff80','#fff'));assert.throws(()=>contrast('red','#fff'));
});
test('comparison distinguishes absence from fixes and rejects differing fixtures/coverage',()=>{
  const r={url:'http://local/',fixture:'one',config:{},environment:{browser:'x'},cases:[{caseId:'a'}],coverage:{automatedStatus:'captured'},findings:[{caseId:'a',rule:'x',selector:'#x'}]};
  assert.equal(compare(r,{...r,findings:[]}).absent.length,1);
  assert.equal(compare(r,{...r,fixture:'two'}).comparable,false);
  assert.equal(compare(r,{...r,coverage:{automatedStatus:'incomplete'}}).comparable,false);
});
test('review requires evidence and cannot treat unknown ratings as reviewed',()=>{
  const r={status:'partial',task:'Compare orders',audience:'Dispatchers',scope:'Phone',identityToPreserve:'Compact rows',strengths:['Readable amounts'],scenarios:[{id:'phone',status:'tested',evidence:'phone.png'}],dimensions:Object.fromEntries(dimensions.map(k=>[k,{rating:null}])),findings:[],unknowns:['Keyboard'],accessibilityGates:[]};
  assert.deepEqual(validateReview(r),[]);assert.ok(validateReview({...r,status:'reviewed'}).length);
  r.dimensions.typography={rating:3};assert.ok(validateReview(r).some(e=>e.includes('typography')));
});
test('HTML report escapes hostile page text rather than executing it',()=>{
  const r={url:'<script>alert(1)</script>',createdAt:'now',cases:[],findings:[],errors:[],coverage:{}};
  const html=htmlReport(r);assert.ok(!html.includes('<script>alert'));assert.ok(html.includes('&lt;script&gt;'));
});
