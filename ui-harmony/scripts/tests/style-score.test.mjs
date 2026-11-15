import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {profile,gateIds,scoreStyle,compareStyles,validateStyleReview} from '../style-score.mjs';
import {validateReview} from '../review.mjs';
function review(rating=3) {
 return {profile:'modern-saas',rubricVersion:1,candidate:'local fixture',reviewer:'reviewer-a',scope:'same collection scenarios',context:{audience:'Operators',task:'Locate an overdue item',route:'/issues',surface:'product',fixture:'issues-v1',viewport:'390x844 and 1440x1000 CSS px',theme:'light',state:'rest and focus',evidenceMode:'rendered'},criteria:Object.fromEntries(profile.criteria.map(c=>[c.id,{rating,reason:c.anchors[rating],evidence:[`fixture.png: ${c.id}`],tradeoff:'More restrained treatment can reduce separation; inspect grouping.',nextChange:'Keep the current relationship; inspect long content.',preserve:'Visible task content and labels',confidence:'medium'}])),gates:Object.fromEntries(gateIds.map(k=>[k,{status:'pass',reason:'Scoped fixture assertion only',evidence:[`fixture-checks.json#${k}`]}]))};
}
test('style fit uses explicit weights while general UX ratings remain separate',()=>{
 assert.equal(profile.criteria.reduce((n,c)=>n+c.weight,0),100);
 assert.equal(scoreStyle(review()).styleFit,75);
 const r=review(4);r.criteria.surfaceRestraint.rating=0;
 assert.equal(scoreStyle(r).styleFit,80);
 assert.equal(scoreStyle(r).breakdown.find(c=>c.criterion==='surfaceRestraint').contribution,0);
});
test('missing evidence or an unreviewed dimension cannot be renormalized into a high score',()=>{
 const r=review(4);r.criteria.typography={rating:null,reason:'Missing text detail'};
 assert.equal(scoreStyle(r).styleFit,null);assert.equal(scoreStyle(r).reviewedWeight,85);
 assert.equal(scoreStyle(r).recommendation,'incomplete');
 r.criteria.typography={rating:4,reason:'Looks clean'};assert.equal(scoreStyle(r).structurallyValid,false);
});
test('failed or unknown functional gates cannot be outweighed by perfect style ratings',()=>{
 const r=review(4);r.gates.legibility.status='fail';r.gates.legibility.reason='Measured text contrast fails';
 assert.equal(scoreStyle(r).styleFit,100);assert.equal(scoreStyle(r).recommendation,'blocked');
 assert.equal(compareStyles(review(3),r).comparable,false);
 assert.match(scoreStyle(r).gates.legibility.reason,/contrast/);
 r.gates.legibility.status='unknown';assert.equal(scoreStyle(r).recommendation,'provisional');
 assert.equal(compareStyles(review(3),r).styleFitDelta,null);
});
test('static evidence cannot declare functional passes even with confident prose',()=>{
 const r=review(4);r.context.evidenceMode='screenshot';assert.equal(scoreStyle(r).structurallyValid,false);
 for(const k of gateIds) r.gates[k].status='unknown';
 assert.equal(scoreStyle(r).recommendation,'provisional');
 r.gates.task.status='fail';assert.equal(scoreStyle(r).recommendation,'blocked');
});
test('comparison requires matching context, reviewer, scope and current rubric',()=>{
 const a=review(2),b=review(3);assert.equal(compareStyles(a,b).styleFitDelta,25);
 for(const key of Object.keys(b.context)) {const changed=structuredClone(b);changed.context[key]+=' changed';assert.equal(compareStyles(a,changed).comparable,false,key);}
 for(const key of ['reviewer','scope']) {const changed=structuredClone(b);changed[key]+=' changed';assert.equal(compareStyles(a,changed).comparable,false,key);}
 b.rubricVersion=2;assert.equal(compareStyles(a,b).comparable,false);
});
test('invalid numeric ratings, typos and malformed structures report diagnostics',()=>{
 for(const rating of [-1,5,2.5,'4',true,NaN]) {const r=review();r.criteria.typography.rating=rating;assert.equal(scoreStyle(r).structurallyValid,false);}
 for(const x of [null,[],{},'bad',{criteria:[],gates:[]}]) assert.ok(validateStyleReview(x).length);
 const r=review();r.criteria.typo={rating:4};r.gates.typo={status:'pass'};assert.ok(validateStyleReview(r).length>=2);
});
test('authored rating metadata cannot overwrite calculated contributions or weights',()=>{
 const r=review();Object.assign(r.criteria.typography,{weight:1000,contribution:1000,criterion:'surfaceRestraint',anchor:'fake'});
 const result=scoreStyle(r);assert.equal(result.styleFit,75);
 const item=result.breakdown.find(c=>c.criterion==='typography');assert.equal(item.weight,15);assert.notEqual(item.anchor,'fake');
});
test('optional style review integrates without turning the general profile into a total',()=>{
 const r=JSON.parse(readFileSync(new URL('../../assets/examples/realworld/arngren-review.json',import.meta.url),'utf8'));
 r.styleReview=review();r.styleReview.context.task=r.task;r.styleReview.context.audience=r.audience;r.styleReview.scope=r.scope;assert.deepEqual(validateReview(r),[]);
 r.styleReview.criteria.typography.rating=8;assert.ok(validateReview(r).some(e=>e.startsWith('styleReview:')));
});

test('embedded preferences cannot conceal parent failures or compare a different task',()=>{
 const r=JSON.parse(readFileSync(new URL('../../assets/examples/realworld/arngren-review.json',import.meta.url),'utf8'));
 r.styleReview=review();assert.ok(validateReview(r).some(e=>e.includes('enclosing review')));
 r.styleReview.context.task=r.task;r.styleReview.context.audience=r.audience;r.styleReview.scope=r.scope;
 r.accessibilityGates=['Known unresolved contrast issue'];assert.ok(validateReview(r).some(e=>e.includes('legibility pass')));
 r.accessibilityGates=[];r.dimensions.adaptation.rating=0;assert.ok(validateReview(r).some(e=>e.includes('failed adaptation')));
});

test('CLI suppresses a nested eligible score when the enclosing review is invalid',async()=>{
 const {mkdtemp,writeFile,rm}=await import('node:fs/promises');
 const {tmpdir}=await import('node:os');
 const {join}=await import('node:path');
 const {fileURLToPath}=await import('node:url');
 const {spawnSync}=await import('node:child_process');
 const dir=await mkdtemp(join(tmpdir(),'style-review-cli-'));
 try {
  const r=JSON.parse(readFileSync(new URL('../../assets/examples/realworld/arngren-review.json',import.meta.url),'utf8'));
  r.styleReview=review();const f=join(dir,'review.json');await writeFile(f,JSON.stringify(r));
  const proc=spawnSync(process.execPath,[fileURLToPath(new URL('../review.mjs',import.meta.url)),f],{encoding:'utf8'});
  const result=JSON.parse(proc.stdout);assert.equal(proc.status,2);assert.equal(result.stylePreference.styleFit,null);assert.equal(result.stylePreference.recommendation,'invalid-enclosing-review');
 } finally {await rm(dir,{recursive:true,force:true});}
});
