import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {catalog,root,showRoute,routePath,validateCatalog,validatePlan} from '../route.mjs';
import {validateReview} from '../review.mjs';
const c=await catalog();
const plan=JSON.parse(await fs.readFile(new URL('../../assets/examples/dispatch-route-plan.json',import.meta.url),'utf8'));

test('real catalog and every declared route edge are valid',async()=>{
 assert.deepEqual(await validateCatalog(c),[]);
 for(const n of c.nodes)for(const e of [...n.children,...n.related,...n.alternatives])assert.doesNotThrow(()=>routePath(c,[n.id,e.id]));
});
test('narrow repair reads only selected references and exposes optional parent context',()=>{
 const r=routePath(c,['image-icon','shape']);assert.equal(r.readPlan.length,2);
 assert.ok(r.readPlan.every(x=>!x.includes('templates')&&!x.includes('workflow')));
 assert.ok(showRoute(c,'image-icon').parents.some(p=>p.id==='card-row'));
});
test('nonadjacent layers and iterative workflow are allowed, unrelated hops rejected',()=>{
 assert.equal(routePath(c,['monitoring','metric','typography']).readPlan.length,3);
 assert.doesNotThrow(()=>routePath(c,['evaluate','explore','compose','evaluate']));
 assert.throws(()=>routePath(c,['image-icon','checkout']),/No declared route/);
 assert.throws(()=>routePath(c,['not-a-route']),/Unknown route/);
 assert.throws(()=>routePath(c,[]),/requires/);
});
test('hybrid plan deduplicates only chosen files and preserves bounded scopes',()=>{
 assert.deepEqual(validatePlan(c,plan),[]);
 assert.equal(new Set(plan.paths.flatMap(p=>routePath(c,p.ids).readPlan)).size,7);
 assert.ok(validatePlan(c,{...plan,primary:'article'}).includes('Primary route must appear in a scoped path'));
});
test('static evidence cannot omit measurement and behavioral unknowns',()=>{
 assert.ok(validatePlan(c,{...plan,evidenceMode:'screenshot',unknowns:[]}).some(x=>x.includes('Static evidence')));
 assert.deepEqual(validatePlan(c,{...plan,evidenceMode:'screenshot'}),[]);
});
test('malformed plan array fields return diagnostics rather than throwing',()=>{
 for(const k of ['paths','scenarios','rejectedAlternatives','preserve','unknowns','assumptions'])for(const value of [{},null,42]){
  const errors=validatePlan(c,{...plan,[k]:value});assert.ok(errors.some(x=>x.includes(`${k} must be an array`)));
 }
 assert.ok(validatePlan(c,{...plan,paths:[null]}).length);
});
test('catalog catches dangling IDs, malformed edges and composition cycles',async()=>{
 const mutate=()=>structuredClone(c);
 let d=mutate();d.nodes[0].children=[{id:'missing',when:'test'}];assert.ok((await validateCatalog(d)).some(x=>x.includes('dangling')));
 d=mutate();d.nodes[0].children={};assert.ok((await validateCatalog(d)).some(x=>x.includes('must be an array')));
 d=mutate();d.nodes[0].children=[{id:d.nodes[0].id,when:'cycle'}];assert.ok((await validateCatalog(d)).some(x=>x.includes('cycle')));
 d=mutate();d.nodes.push(structuredClone(d.nodes[0]));assert.ok((await validateCatalog(d)).some(x=>x.includes('Duplicate ID')));
});
test('catalog disallows traversal and symlink escape',async()=>{
 const d=structuredClone(c);d.nodes[0].file='../outside.md';assert.ok((await validateCatalog(d)).some(x=>x.includes('unsafe')));
 const temp=await fs.mkdtemp(path.join(os.tmpdir(),'route-integrity-'));
 try{await fs.symlink(path.join(root,c.nodes[0].file),path.join(temp,'escape.md'));
  const e={version:1,layers:c.layers,nodes:[{...c.nodes[0],file:'escape.md',children:[],related:[],alternatives:[]}]};
  assert.ok((await validateCatalog(e,temp)).some(x=>x.includes('symlink')));
 }finally{await fs.rm(temp,{recursive:true,force:true});}
});
test('semantic feedback accepts known owners and rejects invalid routing claims',async()=>{
 const r=JSON.parse(await fs.readFile(new URL('../../assets/examples/dashboard-review.json',import.meta.url),'utf8'));
 r.findings[0].ownerRoute='collection-region';r.findings[0].routePath=['monitoring','collection-region'];assert.deepEqual(validateReview(r),[]);
 r.findings[0].ownerRoute='not-a-route';assert.ok(validateReview(r).some(e=>e.includes('ownerRoute')));
 r.findings[0].routePath=['monitoring','shape'];assert.ok(validateReview(r).some(e=>e.includes('No declared route')));
});
test('all authored local Markdown links resolve',async()=>{
 const files=[];async function walk(dir){for(const e of await fs.readdir(dir,{withFileTypes:true})){if(['node_modules','.git'].includes(e.name))continue;const p=path.join(dir,e.name);if(e.isDirectory())await walk(p);else if(p.endsWith('.md'))files.push(p);}}await walk(root);
 for(const f of files){const body=await fs.readFile(f,'utf8');for(const m of body.matchAll(/\]\(([^)]+)\)/g)){
  const link=m[1];if(/^(https?:|mailto:|#)/.test(link))continue;
  const target=path.resolve(path.dirname(f),link.split('#')[0]);await assert.doesNotReject(()=>fs.access(target),`${f}: ${link}`);
 }}
});

test('malformed semantic review collections return diagnostic errors',()=>{
 for(const r of [{scenarios:{}},{findings:{}},{scenarios:[null]},{findings:[null]},null,[]])assert.ok(validateReview(r).length);
});

test('independent 22-case applicability corpus retains its declared route paths',async()=>{
 const corpus=JSON.parse(await fs.readFile(new URL('../../assets/examples/router-cases.json',import.meta.url),'utf8'));
 for(const cse of corpus.cases){
  const reads=new Set(cse.reviewerSelectedPaths.flatMap(ids=>routePath(c,ids).readPlan));
  assert.ok(reads.size>0, cse.id);
  assert.ok(cse.reviewerSelectedPaths.some(ids=>ids.includes(cse.primary)),cse.id+' primary belongs to a selected path');
 }
});
