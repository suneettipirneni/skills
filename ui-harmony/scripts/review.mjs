#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import {readFileSync} from 'node:fs';
import {validateStyleReview,scoreStyle} from './style-score.mjs';
import {routePath} from './route.mjs';
const routes=JSON.parse(readFileSync(new URL('../assets/routes.json',import.meta.url),'utf8'));
const routeIds=new Set(routes.nodes.map(n=>n.id));
const array=x=>Array.isArray(x)?x:[];
const record=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
import { pathToFileURL } from 'node:url';
export const dimensions=['taskHierarchy','groupingRhythm','typography','colorSurfaces','componentLanguage','compositionCharacter','contentMeaning','interactionState','adaptation'];
export function validateReview(r) {
  const errors=[];
  const text=x=>typeof x==='string'&&x.trim().length>0;
  const texts=x=>Array.isArray(x)&&x.length>0&&x.every(text);
  if(!record(r)) return ['Review must be an object'];
  if(!['partial','reviewed'].includes(r.status)) errors.push('status must be partial or reviewed');
  for(const k of ['task','audience','scope','identityToPreserve']) if(!text(r[k])) errors.push(`${k} requires context`);
  if(!texts(r.strengths)) errors.push('strengths needs at least one observed quality, or a reason none was identified');
  if(!Array.isArray(r.scenarios)||!r.scenarios.length) errors.push('Declare scenarios and their coverage');
  for(const s of array(r.scenarios)) {
    if(!record(s)){errors.push('Each scenario must be an object');continue;}
    if(!text(s.id)||!['tested','untested','not-applicable'].includes(s.status)||!text(s.evidence)) errors.push('Each scenario requires id, status, and evidence or reason');
  }
  for(const k of dimensions) {
    const d=r?.dimensions?.[k];
    if(!d){errors.push(`Missing dimension ${k}`);continue;}
    if(![null,0,1,2,3,'not-applicable'].includes(d.rating)) errors.push(`${k}: rating must be null, 0–3, or not-applicable`);
    if(d.rating!==null && (!text(d.reason)||!texts(d.evidence)||!text(d.tradeoff))) errors.push(`${k}: assigned ratings require reason, located evidence, and tradeoff/counterexample`);
    if(r.status==='reviewed'&&d.rating===null) errors.push(`${k}: unreviewed dimension in reviewed report (use partial)`);
  }
  if(!Array.isArray(r.findings)) errors.push('findings must be an array');
  const ids=new Set();
  for(const f of array(r.findings)) {
    if(!record(f)){errors.push('Each finding must be an object');continue;}
    if(f.ownerRoute!==undefined&&!routeIds.has(f.ownerRoute)) errors.push(`${f.id}: unknown ownerRoute`);
    if(f.routePath!==undefined){
      if(!Array.isArray(f.routePath)||!f.routePath.length) errors.push(`${f.id}: routePath must be a nonempty ID array`);
      else {try{routePath(routes,f.routePath);}catch(e){errors.push(`${f.id}: ${e.message}`);}
      if(f.ownerRoute!==undefined&&!f.routePath.includes(f.ownerRoute)) errors.push(`${f.id}: ownerRoute must appear in routePath`);}
    }
    if(!text(f.id)||ids.has(f.id)) errors.push('Finding IDs must be unique');ids.add(f.id);
    if(!dimensions.includes(f.dimension)) errors.push(`${f.id}: unknown dimension`);
    if(!['critical','major','moderate','minor'].includes(f.severity)) errors.push(`${f.id}: invalid severity`);
    if(!['high','medium','low'].includes(f.confidence)) errors.push(`${f.id}: invalid confidence`);
    for(const k of ['location','observation','intendedRelationship','consequence','proposal','preserve','alternative','verification']) if(!text(f[k])) errors.push(`${f.id}: missing ${k}`);
    if(!texts(f.evidence)) errors.push(`${f.id}: located evidence required`);
    if(!['standard','platform','existing-system','proposed-heuristic','semantic-judgment'].includes(f.provenance)) errors.push(`${f.id}: invalid provenance`);
    if(['standard','platform'].includes(f.provenance)&&!text(f.source)) errors.push(`${f.id}: source required for standard/platform claim`);
  }
  if(!Array.isArray(r.unknowns)) errors.push('unknowns must explicitly list unverified claims or be empty');
  if(!Array.isArray(r.accessibilityGates)) errors.push('accessibilityGates must be separate from the ordinal profile');
  if(r.status==='reviewed'&&array(r.scenarios).some(s=>s?.status==='untested')&&!r.unknowns?.length) errors.push('Untested scenarios must be disclosed in unknowns');
  if(r.styleReview!==undefined) {
    errors.push(...validateStyleReview(r.styleReview).map(e=>`styleReview: ${e}`));
    if(r.styleReview?.context?.task!==r.task||r.styleReview?.scope!==r.scope||r.styleReview?.context?.audience!==r.audience) errors.push('styleReview: task, audience and scope must match the enclosing review');
    if(array(r.accessibilityGates).length&&r.styleReview?.gates?.legibility?.status==='pass') errors.push('styleReview: unresolved accessibilityGates cannot coexist with a legibility pass');
    for(const [dimension,gate] of [['taskHierarchy','task'],['typography','legibility'],['interactionState','interaction'],['adaptation','adaptation']]) {
      if(r.dimensions?.[dimension]?.rating===0&&r.styleReview?.gates?.[gate]?.status!=='fail') errors.push(`styleReview: broken ${dimension} requires a failed ${gate} gate`);
    }
  }
  return errors;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    if(!process.argv[2]) throw Error('Usage: node review.mjs REVIEW.json');
    const r=JSON.parse(await fs.readFile(process.argv[2],'utf8')),errors=validateReview(r);
    console.log(JSON.stringify({structurallyValid:!errors.length,status:r?.status,errors,profile:Object.fromEntries(dimensions.map(k=>[k,r?.dimensions?.[k]?.rating??null])),coverage:{tested:array(r?.scenarios).filter(s=>s?.status==='tested').length,declared:array(r?.scenarios).length},stylePreference:r?.styleReview===undefined?null:errors.length?{structurallyValid:false,recommendation:'invalid-enclosing-review',styleFit:null,errors}:scoreStyle(r.styleReview),note:'Completeness validation only; does not verify truth, pleasantness, or conformance. No aggregate UX score; optional style fit is a separate preference index.'},null,2));
    process.exitCode=errors.length?2:0;
  } catch(e) {console.error(e.message);process.exitCode=2;}
}
