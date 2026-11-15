import test from 'node:test';
import assert from 'node:assert/strict';
import {classifyAxe} from '../lib/axe.mjs';
import {summarizeFindings,htmlReport} from '../lib/report.mjs';
import {analyze,compare} from '../lib/analyze.mjs';
test('axe best practices remain advisories and incomplete checks remain review',()=>{
 assert.equal(classifyAxe({tags:['best-practice']},'violations').kind,'advisory');
 assert.equal(classifyAxe({tags:['wcag2aa','wcag143']},'violations').kind,'accessibility');
 assert.equal(classifyAxe({tags:['wcag2aa','wcag143']},'incomplete').kind,'review');
 assert.equal(classifyAxe({},'violations').standard,'other');
});
test('summary never conflates inconclusive contrast with a WCAG-tagged violation',()=>{
 const fs=[{id:'a',caseId:'phone',rule:'axe:color-contrast',...classifyAxe({tags:['wcag2aa']},'violations')},{id:'b',caseId:'phone',rule:'axe:color-contrast',...classifyAxe({tags:['wcag2aa']},'incomplete')},{id:'c',caseId:'desktop',rule:'axe:color-contrast',...classifyAxe({tags:['wcag2aa']},'incomplete'),exception:{reason:'inspect'}}];
 const s=summarizeFindings(fs);assert.equal(s.groups.length,2);assert.deepEqual(s.byKind,{accessibility:1,review:2});assert.equal(s.groups[1].excepted,1);assert.equal(s.groups.flatMap(g=>g.findingIds).length,3);
 const html=htmlReport({url:'local',cases:[],findings:fs,errors:[],coverage:{}});for(const id of ['a','b','c'])assert.ok(html.includes(`id="${id}"`));
});
test('CSS hiding is retained as contextual review, not mislabeled as clipped visible text',()=>{
 const snap={caseId:'phone',document:{overflowX:0},groups:[],separations:[],elements:[{selector:'#skip',rect:{width:1,height:1},visuallyHiddenCandidate:true,focusable:true,styles:{clip:'rect(0px, 0px, 0px, 0px)'},interactive:true,clipping:{x:true,y:true}},{selector:'#bad',rect:{width:1,height:1},interactive:true,clipping:{x:true,y:true}}]};
 const f=analyze(snap).findings;assert.equal(f.filter(x=>x.selector==='#skip').length,1);assert.equal(f[0].rule,'visually-hidden-pattern');assert.ok(f.some(x=>x.selector==='#bad'&&x.rule==='text-clipping'));assert.ok(f.some(x=>x.selector==='#bad'&&x.rule==='small-target-candidate'));
});

test('comparison rejects a changed checker version even with the same browser',()=>{
 const r={url:'https://local/',fixture:'one',config:{},setupHash:null,environment:{toolVersion:'2.0.0',browser:'same'},cases:[{caseId:'phone'}],coverage:{automatedStatus:'captured'},findings:[]};
 assert.equal(compare(r,{...r,environment:{...r.environment,toolVersion:'2.1.0'}}).comparable,false);
});
