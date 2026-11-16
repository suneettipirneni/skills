import {createHash} from 'node:crypto';
const object=x=>x&&typeof x==='object'&&!Array.isArray(x);
const finite=x=>typeof x==='number'&&Number.isFinite(x);
const stable=x=>JSON.stringify(canonical(x));
function canonical(x){return Array.isArray(x)?x.map(canonical):object(x)?Object.fromEntries(Object.keys(x).sort().map(k=>[k,canonical(x[k])])):x}
export const reportDigest=bytes=>createHash('sha256').update(bytes).digest('hex');
const kinds=new Set(['center','inside','gap','between','ink-gap','edge-align','insets','paint-balance']);
const key=(c,i)=>`${c.viewport?.name}/${c.component}/${c.index}/${i}`;
function validObservation(o){
 const point=p=>object(p)&&finite(p.x)&&finite(p.y);
 const rect=p=>point(p)&&finite(p.width)&&p.width>0&&finite(p.height)&&p.height>0;
 return object(o)&&Number.isInteger(o.threshold)&&o.threshold>=1&&o.threshold<=255&&rect(o.referenceBoundsCssPx)&&rect(o.inkBoundsCssPx)&&['referenceCenterCssPx','boundsCenterCssPx','coverageCentroidCssPx','boundsCenterOffsetCssPx','coverageCentroidOffsetCssPx'].every(k=>point(o[k]))&&object(o.signedInsetsCssPx)&&['left','right','top','bottom'].every(k=>finite(o.signedInsetsCssPx[k]))&&finite(o.paintedAreaCssPx2)&&o.paintedAreaCssPx2>0&&Number.isInteger(o.paintPixels)&&o.paintPixels>0;
}
function inventory(r){
 const problems=[],diagnostics=[],contracts=[];
 if(!object(r)||!Array.isArray(r.cases)||!r.cases.length)return {problems:['Report has no cases'],diagnostics,contracts};
 if(r.schemaVersion!==1)problems.push('Unsupported report schema');
 if(!Array.isArray(r.errors)||r.errors.length||r.summary?.unverified>0)problems.push('Capture has incomplete or missing error coverage');
 const configComponents=Array.isArray(r.config?.components)?r.config.components:[];
 if(!configComponents.length)problems.push('Configured components are missing');
 const seen=new Set();
 for(const c of r.cases){
  if(!object(c)){problems.push('Invalid case');continue}
  const configured=configComponents.find(x=>x?.name===c.component);
  if(!configured||!Array.isArray(configured.checks)||!Array.isArray(c.checks)||configured.checks.length!==c.checks.length)problems.push('Missing configured checks: '+key(c,0));
  if(c.error||!Array.isArray(c.checks)||!c.checks.length)problems.push('Incomplete case: '+key(c,0));
  for(const[i,q]of(Array.isArray(c.checks)?c.checks:[]).entries()){
   const id=key(c,i);if(seen.has(id))problems.push('Duplicate identity: '+id);seen.add(id);
   if(!object(q)){problems.push('Invalid measurement: '+id);continue}
   const requested=configured?.checks?.[i];
   if(!object(requested)||Object.entries(requested).some(([k,v])=>stable(v)!==stable(q[k])))problems.push('Measurement differs from configured contract: '+id);
   if(!kinds.has(q.kind))problems.push('Unknown measurement: '+id);
   if(q.kind==='paint-balance'){
    if(q.status!=='review-needed'||q.reviewRequired!==true||Object.hasOwn(q,'pass')||!validObservation(q.observed))problems.push('Missing or invalid paint measurement: '+id);
    const samples=q.sensitivity?.samples,t=q.observed?.threshold;
    if(!Array.isArray(samples)||samples.length!==3||samples.some((s,i)=>!object(s)||s.status!=='review-needed'||s.factor!==[.5,1,2][i]||s.threshold!==Math.max(1,Math.min(255,Math.round(t*[.5,1,2][i])))||!validObservation(s.observed)||s.observed.threshold!==s.threshold))problems.push('Incomplete threshold sensitivity: '+id);
    diagnostics.push({id,c,q});
   }else{if(typeof q.pass!=='boolean')problems.push('Unverified contract: '+id);contracts.push({id,q})}
  }
 }
 for(const v of Array.isArray(r.config?.viewports)?r.config.viewports:[])for(const c of configComponents){const count=r.cases.filter(x=>x?.viewport?.name===v.name&&x.component===c.name).length;if(count<(c.minCount??1)||count>(c.maxCount??20))problems.push('Configured component coverage missing: '+v.name+'/'+c.name)}
 return {problems,diagnostics,contracts};
}
export function compareOptical(a,b,{fontChange,frameChange}={}){
 for(const [k,v]of Object.entries({fontChange,frameChange}))if(v!==undefined&&(typeof v!=='string'||!v.trim()))throw Error(k+' requires a reason');
 const aa=inventory(a),bb=inventory(b),reasons=[...aa.problems.map(x=>'Before: '+x),...bb.problems.map(x=>'After: '+x)];
 for(const k of ['schemaVersion','url','browser','config','finalURLs'])if(a?.[k]===undefined||b?.[k]===undefined||stable(a[k])!==stable(b[k]))reasons.push('Missing or changed '+k);
 for(const k of ['toolVersion','setupHash','ready','fixture','state','theme'])if(a?.environment?.[k]===undefined||b?.environment?.[k]===undefined||stable(a.environment[k])!==stable(b.environment[k]))reasons.push('Missing or changed environment.'+k);
 if(typeof a?.environment?.fixture!=='string'||!a.environment.fixture.trim())reasons.push('Explicit fixture identity required');
 if(!aa.diagnostics.length||!bb.diagnostics.length)reasons.push('No paint-balance diagnostics to compare');
 const before=new Map(aa.diagnostics.map(x=>[x.id,x])),after=new Map(bb.diagnostics.map(x=>[x.id,x]));
 if(stable([...before.keys()].sort())!==stable([...after.keys()].sort()))reasons.push('Diagnostic identities changed');
 const rows=[];
 for(const[id,x]of before){const y=after.get(id);if(!y)continue;
  if(stable(x.c.viewport)!==stable(y.c.viewport))reasons.push('Viewport changed: '+id);
  const fonts=c=>Object.fromEntries(Object.entries(c.parts??{}).map(([k,v])=>[k,v.font]));
  const fontChanged=stable(fonts(x.c))!==stable(fonts(y.c));if(fontChanged&&!fontChange)reasons.push('Measured font metadata changed: '+id);
  const p=x.q.observed,n=y.q.observed;if(!p||!n)continue;
  const frameChanged=stable([p.referenceBoundsCssPx?.width,p.referenceBoundsCssPx?.height])!==stable([n.referenceBoundsCssPx?.width,n.referenceBoundsCssPx?.height]);if(frameChanged&&!frameChange)reasons.push('Reference frame size changed: '+id);
  const delta={};for(const name of ['boundsCenterOffsetCssPx','coverageCentroidOffsetCssPx','signedInsetsCssPx'])delta[name]=Object.fromEntries(Object.keys(p[name]??{}).map(k=>[k,n[name]?.[k]-p[name][k]]));
  delta.paintedAreaCssPx2=n.paintedAreaCssPx2-p.paintedAreaCssPx2;delta.inkSizeCssPx={width:n.inkBoundsCssPx?.width-p.inkBoundsCssPx?.width,height:n.inkBoundsCssPx?.height-p.inkBoundsCssPx?.height};
  rows.push({id,before:p,after:n,delta,thresholdSensitivity:{before:x.q.sensitivity,after:y.q.sensitivity},fontChanged,frameChanged});
 }
 return {comparable:reasons.length===0,reasons:[...new Set(reasons)],changes:reasons.length?[]:rows,declaredInterventions:{fontChange:fontChange??null,frameChange:frameChange??null},reviewRequired:true,note:'Deltas are after minus before, not improvement scores or suggested corrections. Matching labels cannot prove identical actual fonts, assets, content, theme or intended state. Inspect natural-size context.'};
}
export function opticalReviewTemplate(r,digest){const inv=inventory(r);return {reportSha256:digest,reviewer:'',context:{decision:null,evidence:'',rationale:''},decisions:inv.diagnostics.map(({id})=>({id,decision:null,evidence:'',rationale:'',action:''}))}}
export function judgeOptical(r,v,digest){
 const inv=inventory(r),problems=[...inv.problems];const nonempty=x=>typeof x==='string'&&x.trim().length>0;
 if(!object(v))return {status:'incomplete',problems:['Review must be an object'],reviewRequired:true};
 if(v.reportSha256!==digest)problems.push('Review does not match these exact report bytes');
 if(!nonempty(v.reviewer))problems.push('Named reviewer required');
 const valid=d=>object(d)&&['accept','change-required','unverified'].includes(d.decision)&&nonempty(d.evidence)&&nonempty(d.rationale)&&(d.decision!=='change-required'||nonempty(d.action));
 if(!valid(v.context))problems.push('Context judgment needs decision, evidence, rationale and action when changes are required');
 const ids=new Set(inv.diagnostics.map(d=>d.id)),seen=new Set();
 if(!Array.isArray(v.decisions))problems.push('decisions array required');
 for(const d of Array.isArray(v.decisions)?v.decisions:[]){if(!object(d)||!ids.has(d.id)||seen.has(d.id)){problems.push('Unknown or duplicate diagnostic judgment');continue}seen.add(d.id);if(!valid(d))problems.push('Incomplete judgment: '+d.id);if(d.decision==='unverified')problems.push('Unverified judgment: '+d.id)}
 for(const id of ids)if(!seen.has(id))problems.push('Missing judgment: '+id);
 if(v.context?.decision==='unverified')problems.push('Context remains unverified');
 const failedContracts=inv.contracts.filter(x=>x.q.pass===false).map(x=>({id:x.id,kind:x.q.kind,observed:x.q.observed,expected:x.q.expected}));
 const changes=[...(Array.isArray(v.decisions)?v.decisions:[]),v.context].filter(d=>d?.decision==='change-required');
 return {status:problems.length?'incomplete':failedContracts.length||changes.length?'needs-changes':'reviewed',problems,failedContracts,changes,reviewRequired:problems.length>0||failedContracts.length>0||changes.length>0,reviewer:v.reviewer??null,diagnostics:inv.diagnostics.length,note:'Reviewed means authored placement contracts and recorded human judgments are complete for this capture. The validator cannot establish the truth or quality of a human judgment; this is not an automatic optical approval.'};
}
