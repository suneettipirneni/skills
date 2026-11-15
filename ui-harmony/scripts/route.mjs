#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
export const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const text=x=>typeof x==='string'&&x.trim().length>0;
const array=x=>Array.isArray(x)?x:[];
const edges=n=>[...array(n.children),...array(n.alternatives),...array(n.related)];
export async function catalog(base=root){return JSON.parse(await fs.readFile(path.join(base,'assets/routes.json'),'utf8'));}
export function showRoute(c,id){
 const n=c.nodes.find(n=>n.id===id);if(!n)throw Error(`Unknown route '${id}'. Use list; use specialist when coverage is missing.`);
 return {...n,parents:c.nodes.filter(p=>(p.children??[]).some(e=>e.id===id)).map(p=>({id:p.id,title:p.title,when:p.children.find(e=>e.id===id).when})),note:'Decision support, not automated classification. Read the named file and only relevant next routes. Parents are optional context, not required reads.'};
}
export function routePath(c,ids){
 if(!ids.length)throw Error('path requires at least one exact route ID');
 const selected=ids.map(id=>showRoute(c,id));
 for(let i=1;i<selected.length;i++)if(!edges(selected[i-1]).some(e=>e.id===ids[i]))throw Error(`No declared route ${ids[i-1]} -> ${ids[i]}. Use a separate scoped path for an independent concern.`);
 return {readPlan:[...new Set(selected.map(n=>n.file))],decisions:selected.map((n,i)=>({id:n.id,layer:n.layer,why:i?edges(selected[i-1]).find(e=>e.id===n.id).when:n.useWhen})),note:'Only selected references are loaded. Route validity does not prove task suitability. Conditions and workflow can be added as separately scoped routes.'};
}
export async function validateCatalog(c,base=root){
 const errors=[];
 if(!c||c.version!==1||!Array.isArray(c.nodes)||!Array.isArray(c.layers))return ['Expected version 1, nodes and layers arrays'];
 const ids=new Set(),files=new Set(),realBase=await fs.realpath(base);
 for(const n of c.nodes){
  if(!n||!text(n.id)||!/^[a-z][a-z0-9-]*$/.test(n.id)){errors.push('Invalid route ID');continue;}
  if(ids.has(n.id))errors.push(`Duplicate ID ${n.id}`);ids.add(n.id);
  if(!c.layers.includes(n.layer))errors.push(`${n.id}: unknown layer`);
  for(const k of ['title','useWhen','avoidWhen','file'])if(!text(n[k]))errors.push(`${n.id}: missing ${k}`);
  if(text(n.file)){
   const full=path.resolve(base,n.file);
   if(path.isAbsolute(n.file)||!full.startsWith(path.resolve(base)+path.sep)||!n.file.endsWith('.md'))errors.push(`${n.id}: unsafe reference path`);
   else try{
    const real=await fs.realpath(full);
    if(!real.startsWith(realBase+path.sep))errors.push(`${n.id}: reference escapes skill through symlink`);
    if(files.has(real))errors.push(`${n.id}: duplicate reference file`);files.add(real);
    const content=await fs.readFile(full,'utf8');
    if(!content.includes(`Route: \`${n.id}\``))errors.push(`${n.id}: document identity mismatch`);
   }catch{errors.push(`${n.id}: missing reference file`);}
  }
  for(const kind of ['children','alternatives','related']){
   if(!Array.isArray(n[kind])){errors.push(`${n.id}: ${kind} must be an array`);continue;}
   const seen=new Set();
   for(const e of n[kind]){if(!e||!text(e.id)||!text(e.when))errors.push(`${n.id}: malformed ${kind} edge`);else{if(seen.has(e.id))errors.push(`${n.id}: duplicate ${kind} edge ${e.id}`);seen.add(e.id);}}
  }
 }
 const by=new Map(c.nodes.filter(n=>n&&text(n.id)).map(n=>[n.id,n]));
 for(const n of by.values())for(const e of edges(n))if(e?.id&&!ids.has(e.id))errors.push(`${n.id}: dangling edge ${e.id}`);
 const visiting=new Set(),done=new Set();
 function visit(id){if(visiting.has(id)){errors.push(`Composition cycle at ${id}`);return;}if(done.has(id))return;visiting.add(id);for(const e of array(by.get(id)?.children))if(e?.id&&by.has(e.id))visit(e.id);visiting.delete(id);done.add(id);}
 for(const id of by.keys())visit(id);
 return errors;
}
export function validatePlan(c,p){
 const errors=[],known=new Set(c.nodes.map(n=>n.id));
 if(!p||typeof p!=='object'||Array.isArray(p))return ['Plan must be an object'];
 for(const k of ['task','evidenceMode','primaryReason','scope','identityToPreserve'])if(!text(p[k]))errors.push(`Missing ${k}`);
 if(!['rendered-web','screenshot','design-file','native','mixed'].includes(p.evidenceMode))errors.push('Invalid evidenceMode');
 if(!known.has(p.primary))errors.push('Unknown primary route');
 for(const k of ['assumptions','unknowns','preserve','rejectedAlternatives','scenarios','paths'])if(!Array.isArray(p[k]))errors.push(`${k} must be an array`);
 for(const k of ['assumptions','unknowns','preserve'])if(Array.isArray(p[k])&&!p[k].every(text))errors.push(`${k} entries must be nonempty text`);
 if(!p.preserve?.length)errors.push('Declare observed strengths or explain that none is established');
 if(!p.paths?.length)errors.push('At least one scoped path required');
 let primaryUsed=false;
 for(const branch of array(p.paths)){
  if(!branch||!text(branch.scope)||!text(branch.reason)||!Array.isArray(branch.ids)||!branch.ids.length){errors.push('Each path needs scope, reason and IDs');continue;}
  if(branch.ids.includes(p.primary))primaryUsed=true;
  try{routePath(c,branch.ids);}catch(e){errors.push(e.message);}
 }
 if(!primaryUsed)errors.push('Primary route must appear in a scoped path');
 for(const alt of array(p.rejectedAlternatives))if(!alt||!known.has(alt.id)||!text(alt.reason)||!text(alt.reconsiderWhen))errors.push('Rejected alternative needs known id, reason, reconsiderWhen');
 if(!p.scenarios?.length)errors.push('At least one concrete scenario required');
 for(const s of array(p.scenarios))if(!s||!text(s.id)||!text(s.fixture)||!text(s.state)||!text(s.expected)||!['planned','tested','unverified'].includes(s.status)||!text(s.evidence))errors.push('Each scenario needs id, fixture, state, expected, status and evidence/boundary');
 if(['screenshot','design-file'].includes(p.evidenceMode)&&!p.unknowns?.length)errors.push('Static evidence requires explicit unverified behavior/measurement boundaries');
 return errors;
}
async function main(){
 const [cmd,...args]=process.argv.slice(2),c=await catalog();
 let result;
 if(cmd==='list'){
  if(args.length>1||(args[0]&&!c.layers.includes(args[0])))throw Error(`Use list [${c.layers.join('|')}]`);
  result=c.nodes.filter(n=>!args[0]||n.layer===args[0]).map(({id,layer,title,useWhen})=>({id,layer,title,useWhen}));
 }else if(cmd==='show'){if(args.length!==1)throw Error('show requires one exact ID');result=showRoute(c,args[0]);}
 else if(cmd==='path')result=routePath(c,args);
 else if(cmd==='check'){
  if(args.length)throw Error('check takes no arguments');
  const errors=await validateCatalog(c);result={structurallyValid:!errors.length,nodes:c.nodes.length,errors,note:'Checks catalog integrity, not design correctness.'};if(errors.length)process.exitCode=2;
 }else if(cmd==='plan'){
  if(args.length!==1)throw Error('plan requires a JSON file');
  const p=JSON.parse(await fs.readFile(args[0],'utf8')),errors=validatePlan(c,p);
  result={structurallyValid:!errors.length,errors,readPlan:errors.length?[]:[...new Set(p.paths.flatMap(b=>routePath(c,b.ids).readPlan))],note:'Validates declared routes and context fields, not the truth of evidence or suitability of design decisions.'};if(errors.length)process.exitCode=2;
 }else throw Error('Usage: node scripts/route.mjs list [layer] | show ID | path ID [ID ...] | check | plan PLAN.json');
 console.log(JSON.stringify(result,null,2));
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href)main().catch(e=>{console.error(e.message);process.exitCode=2;});
