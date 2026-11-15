#!/usr/bin/env node
import {readFileSync} from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

export const profile=JSON.parse(readFileSync(new URL('../assets/style-profile.json',import.meta.url),'utf8'));
export const gateIds=['task','legibility','interaction','adaptation'];
const contextKeys=['task','audience','route','surface','fixture','viewport','theme','state','evidenceMode'];
const record=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const text=x=>typeof x==='string'&&x.trim().length>0;
const texts=x=>Array.isArray(x)&&x.length>0&&x.every(text);

export function validateStyleReview(r) {
  if(!record(r)) return ['Style review must be an object'];
  const errors=[];
  if(r.profile!==profile.id||r.rubricVersion!==profile.version) errors.push('Unsupported profile or rubricVersion');
  for(const key of ['candidate','reviewer','scope']) if(!text(r[key])) errors.push(`${key} is required`);
  for(const key of contextKeys) if(!text(r.context?.[key])) errors.push(`context.${key} is required`);
  if(!['rendered','screenshot','design-file','native'].includes(r.context?.evidenceMode)) errors.push('Unknown evidenceMode');
  if(!['product','marketing','hybrid'].includes(r.context?.surface)) errors.push('surface must be product, marketing or hybrid');
  if(!record(r.criteria)) errors.push('criteria must be an object');
  for(const key of Object.keys(r.criteria??{})) if(!profile.criteria.some(c=>c.id===key)) errors.push(`Unknown criterion ${key}`);
  for(const c of profile.criteria) {
    const item=r.criteria?.[c.id];
    if(!record(item)){errors.push(`Missing criterion ${c.id}`);continue;}
    if(![null,0,1,2,3,4].includes(item.rating)) errors.push(`${c.id}: rating must be null or integer 0–4`);
    if(!text(item.reason)) errors.push(`${c.id}: reason required, including when unreviewed`);
    if(item.rating!==null) {
      if(!texts(item.evidence)) errors.push(`${c.id}: located evidence required`);
      for(const key of ['tradeoff','nextChange','preserve']) if(!text(item[key])) errors.push(`${c.id}: ${key} required`);
      if(!['high','medium','low'].includes(item.confidence)) errors.push(`${c.id}: confidence required`);
    }
  }
  if(!record(r.gates)) errors.push('gates must be an object');
  for(const key of Object.keys(r.gates??{})) if(!gateIds.includes(key)) errors.push(`Unknown gate ${key}`);
  for(const key of gateIds) {
    const g=r.gates?.[key];
    if(!record(g)||!['pass','fail','unknown'].includes(g.status)||!text(g.reason)||!texts(g.evidence)) errors.push(`${key}: gate needs status, reason and evidence (or missing-evidence explanation)`);
    if(['screenshot','design-file'].includes(r.context?.evidenceMode)&&g?.status==='pass') errors.push(`${key}: static evidence cannot pass functional gates; use unknown or fail`);
  }
  return errors;
}

export function scoreStyle(r) {
  const errors=validateStyleReview(r);
  if(errors.length) return {structurallyValid:false,errors,styleFit:null,recommendation:'invalid'};
  const breakdown=profile.criteria.map(c=>({criterion:c.id,label:c.label,weight:c.weight,rating:r.criteria[c.id].rating,anchor:r.criteria[c.id].rating===null?null:c.anchors[r.criteria[c.id].rating],contribution:r.criteria[c.id].rating===null?null:c.weight*r.criteria[c.id].rating/4,reason:r.criteria[c.id].reason,evidence:r.criteria[c.id].evidence,tradeoff:r.criteria[c.id].tradeoff,nextChange:r.criteria[c.id].nextChange,preserve:r.criteria[c.id].preserve,confidence:r.criteria[c.id].confidence}));
  const complete=breakdown.every(c=>c.rating!==null);
  const failed=gateIds.filter(k=>r.gates[k].status==='fail');
  const unknown=gateIds.filter(k=>r.gates[k].status==='unknown');
  return {
    structurallyValid:true,errors:[],profile:profile.id,rubricVersion:profile.version,
    candidate:r.candidate,reviewer:r.reviewer,context:r.context,scope:r.scope,
    styleFit:complete?Math.round(breakdown.reduce((n,c)=>n+c.contribution,0)):null,
    scale:100,label:profile.label,weightProvenance:profile.weightProvenance,
    reviewedWeight:breakdown.filter(c=>c.rating!==null).reduce((n,c)=>n+c.weight,0),
    recommendation:failed.length?'blocked':!complete?'incomplete':unknown.length?'provisional':'eligible-for-scoped-comparison',
    failedGates:failed,unknownGates:unknown,gates:r.gates,breakdown,
    priorities:breakdown.filter(c=>c.rating!==null&&c.rating<4).sort((a,b)=>(b.weight-b.contribution)-(a.weight-a.contribution)).map(c=>({criterion:c.criterion,weightedGap:c.weight-c.contribution,nextChange:c.nextChange,preserve:c.preserve})),
    note:'Reviewer-authored preference fit, not measured beauty, UX quality or conformance. Gates describe only the declared scope. Small differences may reflect judgment. Fix failed gates before style gaps; weightedGap is not severity.'
  };
}

export function compareStyles(a,b) {
  const left=scoreStyle(a),right=scoreStyle(b),reasons=[];
  if(!left.structurallyValid||!right.structurallyValid) reasons.push('Invalid input');
  for(const key of contextKeys) if(a?.context?.[key]!==b?.context?.[key]) reasons.push(`Different ${key}`);
  if(a?.scope!==b?.scope) reasons.push('Different scope');
  if(a?.reviewer!==b?.reviewer) reasons.push('Different reviewer; calibrate judgments before comparison');
  for(const [name,s] of [['left',left],['right',right]]) if(s.recommendation!=='eligible-for-scoped-comparison') reasons.push(`${name}: ${s.recommendation}`);
  const comparable=!reasons.length;
  return {comparable,reasons,left,right,styleFitDelta:comparable?right.styleFit-left.styleFit:null,note:'Delta is only preference-fit arithmetic for matched reviewed cases. It does not establish a usability improvement or an automatic winner.'};
}

if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    const args=process.argv.slice(2);
    if(args[0]==='profile'&&args.length===1) console.log(JSON.stringify(profile,null,2));
    else {
      const comparing=args[0]==='compare';
      if((comparing&&args.length!==3)||(!comparing&&args.length!==1)) throw Error('Usage: style-score.mjs REVIEW.json | profile | compare BEFORE.json AFTER.json');
      const read=f=>JSON.parse(readFileSync(f,'utf8'));
      const result=comparing?compareStyles(read(args[1]),read(args[2])):scoreStyle(read(args[0]));
      console.log(JSON.stringify(result,null,2));
      process.exitCode=(comparing?!result.comparable:!result.structurallyValid)?2:0;
    }
  } catch(e){console.error(e.message);process.exitCode=2;}
}
