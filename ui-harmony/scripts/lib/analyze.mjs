import { createHash } from 'node:crypto';

export const round = n => Math.round(n * 100) / 100;
export const median = values => {
  const a = [...values].sort((a, b) => a - b);
  return a.length % 2 ? a[(a.length - 1) / 2] : (a[a.length / 2 - 1] + a[a.length / 2]) / 2;
};
export const keyFor = f => createHash('sha256').update(JSON.stringify([f.caseId, f.rule, f.contract ?? '', f.selector, f.property ?? ''])).digest('hex').slice(0, 14);

export function validateConfig(c) {
  if (!c || typeof c !== 'object' || Array.isArray(c)) throw Error('Config must be an object');
  const allowed = ['viewports', 'groups', 'separations', 'ignore', 'maxElements', 'geometryTolerance'];
  for (const k of Object.keys(c)) if (!allowed.includes(k)) throw Error(`Unknown config key: ${k}`);
  if (c.viewports) {
    if (!Array.isArray(c.viewports) || !c.viewports.length) throw Error('viewports must be a nonempty array');
    const names = new Set();
    for (const v of c.viewports) {
      if (!/^[a-zA-Z0-9_-]+$/.test(v.name) || names.has(v.name)) throw Error('Viewport names must be unique safe filenames');
      names.add(v.name);
      if (![v.width, v.height].every(n => Number.isInteger(n) && n >= 100 && n <= 10000)) throw Error('Viewport dimensions must be integer CSS px from 100 to 10000');
    }
  }
  for (const k of ['groups', 'separations', 'ignore']) if (c[k] && !Array.isArray(c[k])) throw Error(`${k} must be an array`);
  const names=new Set();
  const bounds=g=>{
    if(typeof g.name!=='string'||!g.name.trim()||names.has(g.name)) throw Error('Contracts need unique nonempty names');
    names.add(g.name);
    for(const k of ['minWidth','maxWidth']) if(g[k]!==undefined&&(!Number.isFinite(g[k])||g[k]<0)) throw Error(`${k} must be a nonnegative number`);
    if(g.minWidth!==undefined&&g.maxWidth!==undefined&&g.minWidth>g.maxWidth) throw Error('minWidth exceeds maxWidth');
  };
  for (const g of c.groups ?? []) {
    for(const k of Object.keys(g)) if(!['name','selector','rationale','align','reference','tolerance','minCount','styles','minWidth','maxWidth'].includes(k)) throw Error(`Unknown group key: ${k}`);
    bounds(g);
    if (typeof g.selector!=='string'||!g.selector.trim()) throw Error('Each group needs a nonempty selector');
    if (g.reference!==undefined&&!Number.isFinite(g.reference)) throw Error('reference must be a finite number');
    if (!g.align&&!Object.keys(g.styles??{}).length) throw Error('A group needs alignment or styles to evaluate');
    if (g.align && !['left', 'right', 'top', 'bottom', 'centerX', 'centerY'].includes(g.align)) throw Error('Invalid alignment axis');
    if (g.tolerance !== undefined && (!Number.isFinite(g.tolerance) || g.tolerance < 0)) throw Error('tolerance must be nonnegative');
    if (g.minCount !== undefined && (!Number.isInteger(g.minCount) || g.minCount < 1)) throw Error('minCount must be a positive integer');
    for (const [p, values] of Object.entries(g.styles ?? {})) {
      if (!/^[a-z][a-z-]+$/.test(p) || !Array.isArray(values) || !values.length || values.some(v => typeof v !== 'string')) throw Error('styles requires CSS property names and nonempty arrays of computed-value strings');
    }
  }
  for (const s of c.separations ?? []) {
    for(const k of Object.keys(s)) if(!['name','a','b','axis','minGap','rationale','minWidth','maxWidth'].includes(k)) throw Error(`Unknown separation key: ${k}`);
    bounds(s);
    if (typeof s.a!=='string'||!s.a.trim()||typeof s.b!=='string'||!s.b.trim()||!['x','y'].includes(s.axis)||!Number.isFinite(s.minGap)||s.minGap<0) throw Error('Separation requires selectors, axis x/y and nonnegative minGap');
  }
  for (const i of c.ignore ?? []) if (!/^[a-f0-9]{14}$/.test(i.id)||typeof i.reason!=='string'||!i.reason.trim()||Object.keys(i).some(k=>!['id','reason'].includes(k))) throw Error('Ignore entries require exact finding id and reason only');
  if (c.maxElements !== undefined && (!Number.isInteger(c.maxElements) || c.maxElements < 1)) throw Error('maxElements must be positive');
  if (c.geometryTolerance !== undefined && (!Number.isFinite(c.geometryTolerance) || c.geometryTolerance < 0)) throw Error('geometryTolerance must be nonnegative');
  return c;
}

export function analyze(snapshot, config = {}) {
  const findings = [], metrics = [];
  const tol = config.geometryTolerance ?? 1;
  const add = f => findings.push({ caseId: snapshot.caseId, evidence: snapshot.screenshot, confidence: 'high', ...f });
  if (snapshot.document.overflowX > tol) add({rule:'page-overflow', selector:'html', kind:'review', severity:'major', observed:{overflowCssPx:round(snapshot.document.overflowX)}, expected:{maximumCssPx:tol}, message:'The document extends horizontally beyond the viewport.', fix:'Find the overflowing container; reflow ordinary content. Keep necessary two-dimensional content in a labelled, usable local scroller. Do not hide overflow to conceal missing content.', verification:'At the same width, ordinary content remains reachable without page-level horizontal scrolling.'});
  for (const e of snapshot.elements) {
    if (e.visuallyHiddenCandidate) {
      add({rule:'visually-hidden-pattern',selector:e.selector,rect:e.rect,kind:'review',confidence:'medium',severity:'minor',observed:{focusable:e.focusable,clip:e.styles?.clip,clipPath:e.styles?.['clip-path']},expected:'Intentional accessibility-only content or a control that reveals appropriately on focus',message:'A common visually-hidden CSS pattern is present; intent and focus behavior need review.',fix:'Preserve accessibility labels. Verify purpose; for focusable content, test focus reveal or its associated visible control and operation. Do not enlarge hidden text solely to satisfy visual geometry.',verification:'The content serves an intentional semantic purpose; focusable content or its associated control provides a reachable, visible, operable focus state.'});
      continue;
    }
    if (e.clipping) add({rule:'text-clipping', selector:e.selector, rect:e.rect, kind:'review', confidence:'medium', severity:'major', observed:e.clipping, expected:'All necessary text readable or a clear route to the full text', message:'A text-containing box clips overflow; truncation may be intentional.', fix:'Inspect the screenshot and expanded state. Allow wrapping or growth when essential text is lost; retain intentional previews when full content is reachable.', verification:'Longest realistic content and text-spacing override do not hide essential text.'});
    if (e.interactive && (e.rect.width < 24 || e.rect.height < 24)) add({rule:'small-target-candidate', selector:e.selector, rect:e.rect, kind:'review', confidence:'medium', severity:'moderate', observed:{widthCssPx:round(e.rect.width),heightCssPx:round(e.rect.height),context:e.targetContext??null}, expected:'24 × 24 CSS px or an applicable WCAG 2.5.8 exception', message:'Small target bounding box; not a conformance verdict.', fix:'Inspect the actual hit area and spacing, inline/equivalent/user-agent/essential exceptions. Enlarge the clickable area if needed without enlarging the icon.', verification:'Actual target geometry or an applicable exception is documented.'});
  }
  for (const g of snapshot.groups) {
    if (g.skipped) {metrics.push({group:g.name,status:'not-applicable',reason:g.skipped}); continue;}
    const n = g.elements.length, minimum = g.minCount ?? (g.align ? 2 : 1);
    if (n < minimum) {add({rule:'contract-unmatched',contract:g.name,selector:g.selector,kind:'coverage',severity:'moderate',observed:n,expected:minimum,message:`${g.name}: insufficient rendered matches to check the contract.`,fix:'Check selector, state, and viewport bounds; never count an unmatched contract as passed.',verification:'The intended elements are captured and the contract is evaluated.'}); continue;}
    const tolerance = g.tolerance ?? 1;
    if (g.align) {
      const values = g.elements.map(e => e.rect[g.align]);
      const reference = g.reference !== undefined ? g.reference : median(values);
      const deviations = values.map(v => Math.abs(v-reference));
      metrics.push({group:g.name,property:g.align,referenceCssPx:round(reference),maxDeviationCssPx:round(Math.max(...deviations)),samples:n,toleranceCssPx:tolerance,referenceType:g.reference !== undefined?'authored':'peer median; not proof of correctness'});
      g.elements.forEach((e,i) => {if (deviations[i] > tolerance) add({rule:'alignment-contract',contract:g.name,selector:e.selector,property:g.align,rect:e.rect,kind:'contract',severity:'moderate',observed:{positionCssPx:round(values[i]),deltaCssPx:round(values[i]-reference)},expected:{positionCssPx:round(reference),toleranceCssPx:tolerance},message:`${g.name}: ${g.align} differs from the declared alignment.`,fix:'Use the shared layout track or inset. Check optical alignment and responsive intent before changing.',verification:`Align within ${tolerance} CSS px or revise the contract with a reason.`});});
    }
    for (const [property, allowed] of Object.entries(g.styles ?? {})) {
      let matches = 0;
      for (const e of g.elements) {
        const value = e.styles[property];
        const compatible = allowed.some(a => {
          const px = /^-?(?:\d+\.?\d*|\.\d+)px$/;
          return a === value || (px.test(a) && px.test(value) && Math.abs(parseFloat(a)-parseFloat(value)) <= tolerance);
        });
        if (compatible) matches++;
        else add({rule:'style-contract',contract:g.name,selector:e.selector,property,rect:e.rect,kind:'contract',severity:'moderate',observed:value,expected:allowed,message:`${g.name}: ${property} is outside the authored values.`,fix:'Use the existing semantic token for this role/state, or document why this instance needs a variant.',verification:`Computed ${property} matches an allowed value (px tolerance ${tolerance}).`});
      }
      metrics.push({group:g.name,property,matched:matches,total:n,conformancePercent:round(100*matches/n),allowed,toleranceCssPx:tolerance});
    }
  }
  for (const s of snapshot.separations) {
    if (s.skipped) {metrics.push({group:s.name,status:'not-applicable',reason:s.skipped}); continue;}
    if (s.a.length !== 1 || s.b.length !== 1) {add({rule:'contract-unmatched',contract:s.name,selector:`${s.aSelector} → ${s.bSelector}`,kind:'coverage',severity:'moderate',observed:{a:s.a.length,b:s.b.length},expected:{a:1,b:1},message:`${s.name}: separation requires exactly one rendered element on each side.`,fix:'Narrow the selectors or capture the intended state.',verification:'Both unique elements are measured.'}); continue;}
    const a=s.a[0], b=s.b[0];
    const gap = s.axis==='x' ? b.rect.left-a.rect.right : b.rect.top-a.rect.bottom;
    metrics.push({group:s.name,property:`gap-${s.axis}`,gapCssPx:round(gap),minimumCssPx:s.minGap});
    if (gap < s.minGap-tol) add({rule:'separation-contract',contract:s.name,selector:`${a.selector} → ${b.selector}`,kind:'contract',severity:'moderate',observed:{gapCssPx:round(gap)},expected:{minimumCssPx:s.minGap,toleranceCssPx:tol},message:`${s.name}: insufficient separation in the declared order.`,fix:'Adjust the owning layout gap; do not move unrelated elements. Negative gap means projections overlap, not necessarily visible occlusion.',verification:`The ${s.axis}-axis gap is at least ${s.minGap} CSS px within tolerance.`});
  }
  for (const f of findings) {
    if(f.contract) f.rationale=[...snapshot.groups,...snapshot.separations].find(c=>c.name===f.contract)?.rationale??'No rationale supplied; justify this contract before prescribing a repair.';
    f.id = keyFor(f);
    const exception = (config.ignore??[]).find(i=>i.id===f.id);
    if(exception) f.exception={reason:exception.reason};
  }
  return {findings, metrics};
}

export function compare(before, after) {
  const signature = r => JSON.stringify([r.url,r.fixture,r.config,r.setupHash,r.environment,r.cases.map(c=>({id:c.caseId,finalUrl:c.finalUrl,viewport:c.viewport,theme:c.theme,motion:c.motion,textSpacing:c.textSpacing}))]);
  const comparable = signature(before)===signature(after)&&before.coverage?.automatedStatus!=='incomplete'&&after.coverage?.automatedStatus!=='incomplete'&&before.cases.length>0&&after.cases.length>0;
  const old = new Map(before.findings.map(f=>[keyFor(f),f]));
  const now = new Map(after.findings.map(f=>[keyFor(f),f]));
  return {comparable, warning:comparable?'Matching capture settings; disappearing nodes still require human verification.':'Settings, URL, setup, or case coverage differ. Disappearances cannot be called fixes.',
    absent: [...old].filter(([k])=>!now.has(k)).map(([,v])=>v),
    introduced:[...now].filter(([k])=>!old.has(k)).map(([,v])=>v),
    persistent:[...now].filter(([k])=>old.has(k)).map(([k,v])=>({before:old.get(k),after:v}))};
}
