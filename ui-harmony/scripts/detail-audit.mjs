#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {parseArgs} from 'node:util';
import {chromium} from 'playwright';
import {PNG} from 'pngjs';
import {validateDetailConfig,geometryCheck,paintMask,inkGap} from './lib/detail.mjs';

const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
async function settleMotion(root){return root.evaluate(async el=>{
  const start=performance.now(),seen=new Set(),budgetMs=1500;
  for(;;){
    const animations=new Set(el.getAnimations({subtree:true}));
    for(let p=el.parentElement;p;p=p.parentElement)for(const a of p.getAnimations())animations.add(a);
    const active=[...animations].filter(a=>a.playState==='running'||a.pending);
    if(!active.length)return {waitedAnimations:seen.size,elapsedMs:performance.now()-start,budgetMs};
    for(const a of active){seen.add(a);if(!Number.isFinite(a.effect?.getComputedTiming().endTime))throw Error('Continuous component or ancestor motion needs an explicitly stable capture state');}
    const remaining=budgetMs-(performance.now()-start);if(remaining<=0)throw Error('Component motion did not settle within 1500ms; capture readiness is incomplete');
    let timer;try{await Promise.race([Promise.allSettled(active.map(a=>a.finished)),new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('Component motion did not settle within 1500ms; capture readiness is incomplete')),remaining)})]);}finally{clearTimeout(timer)}
    await new Promise(resolve=>requestAnimationFrame(resolve));
  }
})}
async function measure(locator,mode){return locator.evaluate((e,mode)=>{
  let r=e.getBoundingClientRect();
  if(!e.checkVisibility({checkOpacity:true,checkVisibilityCSS:true}))throw Error('Part not rendered');
  if(mode==='text'){
    const range=document.createRange();range.selectNodeContents(e);if(range.getClientRects().length!==1)throw Error('Text measurement requires one text fragment');r=range.getBoundingClientRect();
  }
  if(mode==='svg'){
    if(typeof e.getBBox!=='function')throw Error('svg measurement requires SVG graphics');
    const b=e.getBBox(),m=e.getScreenCTM();if(!m)throw Error('Missing SVG transform');
    const pts=[[b.x,b.y],[b.x+b.width,b.y],[b.x,b.y+b.height],[b.x+b.width,b.y+b.height]].map(([x,y])=>new DOMPoint(x,y).matrixTransform(m));
    const xs=pts.map(p=>p.x),ys=pts.map(p=>p.y);r={x:Math.min(...xs),y:Math.min(...ys),width:Math.max(...xs)-Math.min(...xs),height:Math.max(...ys)-Math.min(...ys)};
  }
  if(!r.width||!r.height)throw Error('Empty part geometry');const c=getComputedStyle(e);
  return {rect:{x:r.x+scrollX,y:r.y+scrollY,width:r.width,height:r.height},mode:mode??'box',font:c.font,transform:c.transform,note:mode==='svg'?'Transformed SVG geometric bounds; stroke/filter ink not included.':mode==='text'?'DOM text-fragment rectangle, not glyph ink.':'CSS border box, not optical mass.'};
},mode)}

async function rasterPair(page,root,a,b,clip,dpr,minGap,threshold,out,prefix){
  const ah=await a.elementHandle(),bh=await b.elementHandle();
  const related=await page.evaluate(([a,b])=>a.contains(b)||b.contains(a),[ah,bh]);if(related)throw Error('Raster parts must be disjoint, not ancestor/descendant');
  const saved=await Promise.all([a,b].map(l=>l.evaluate(e=>e.getAttribute('style'))));
  // The verdict is meaningful only if the selected paint is actually isolated
  // and fully represented in this crop. Conservative exclusions stay unverified.
  for(const part of [a,b])await part.evaluate((el,clip)=>{
    for(let ancestor=el.parentElement;ancestor;ancestor=ancestor.parentElement){
      const s=getComputedStyle(ancestor);
      if(s.filter!=='none'||s.mixBlendMode!=='normal'||s.backdropFilter!=='none')throw Error('Ancestor filters or blending need manual paint review');
    }
    for(const e of [el,...el.querySelectorAll('*')]){
      const r=e.getBoundingClientRect(),s=getComputedStyle(e);
      // A zero-sized element can still paint through generated content.
      if(s.filter!=='none'||s.mixBlendMode!=='normal'||s.backdropFilter!=='none'||s.boxShadow!=='none'||s.textShadow!=='none')throw Error('Filters, blending or shadows need manual paint review');
      for(const pseudo of ['::before','::after']){const p=getComputedStyle(e,pseudo);if(!['none','normal',''].includes(p.content))throw Error('Generated pseudo-element paint needs manual review or an explicit element');}
      if(!r.width||!r.height)continue;
      const stroke=e instanceof SVGElement?parseFloat(s.strokeWidth)||0:0;
      const pad=stroke/2;
      if(r.left+scrollX-pad<clip.x||r.top+scrollY-pad<clip.y||r.right+scrollX+pad>clip.x+clip.width||r.bottom+scrollY+pad>clip.y+clip.height)throw Error('Part or descendant protrudes beyond crop; paint coverage is incomplete');
    }
  },clip);
  const shot=async name=>{const bytes=await page.screenshot({clip,animations:'allow'});if(name)await fs.writeFile(path.join(out,name),bytes);return PNG.sync.read(bytes)};
  const visibility=async (l,v)=>l.evaluate((e,v)=>e.style.setProperty('visibility',v,'important'),v);
  try{
    const original=await shot(`${prefix}-original.png`);
    await visibility(a,'hidden');await visibility(b,'hidden');
    for(const part of [a,b])await part.evaluate(el=>{
      if([el,...el.querySelectorAll('*')].some(e=>getComputedStyle(e).visibility!=='hidden'&&e.getBoundingClientRect().width&&e.getBoundingClientRect().height))throw Error('Hidden part retains visible descendants; isolation is incomplete');
    });
    const base=await shot();
    await visibility(a,'visible');const aa=await shot(`${prefix}-a.png`);
    await visibility(a,'hidden');await visibility(b,'visible');const bb=await shot(`${prefix}-b.png`);
    // Restore exactly; capture repeated original to detect layout/state instability.
    for(let i=0;i<2;i++)await [a,b][i].evaluate((e,s)=>s===null?e.removeAttribute('style'):e.setAttribute('style',s),saved[i]);
    const restored=await shot(`${prefix}-restored.png`);
    const changed=paintMask(original,restored,threshold).count;
    if(changed)throw Error(`Component paint changed at ${changed} pixels during isolation; inspect original/restored crops and capture a stable state`);
    return inkGap(paintMask(base,aa,threshold),paintMask(base,bb,threshold),dpr,minGap);
  } finally {
    for(let i=0;i<2;i++)await [a,b][i].evaluate((e,s)=>s===null?e.removeAttribute('style'):e.setAttribute('style',s),saved[i]);
    await ah.dispose();await bh.dispose();
  }
}

export async function runDetailAudit(o){
  const config=validateDetailConfig(o.config),url=new URL(o.url);if(!['http:','https:','file:'].includes(url.protocol))throw Error('Unsupported URL');
  const out=path.resolve(o.out);await fs.mkdir(out,{recursive:false});
  const report={schemaVersion:1,url:url.href,createdAt:new Date().toISOString(),config,cases:[],errors:[],limits:['Authored contracts do not establish good visual design.','Paint isolation temporarily changes inline visibility and restores it; pseudo-elements, filters, blending and dynamic state require inspection.','Raster measurements depend on browser, font, DPR and threshold. Integer coordinates are not required; do not snap all values to whole pixels.','No global collision, occlusion, accessibility or beauty guarantee. Inspect natural-size crops before enlarged raster evidence.']};
  let browser;
  try{
    browser=await chromium.launch({channel:o.channel??'chrome',headless:true});report.browser=browser.version();
    for(const v of config.viewports??[{name:'desktop',width:1440,height:1000,dpr:1}]){
      const context=await browser.newContext({viewport:{width:v.width,height:v.height},deviceScaleFactor:v.dpr??1});
      try{
        const page=await context.newPage();page.setDefaultTimeout(10000);const response=await page.goto(url.href,{waitUntil:'load'});if(response?.status()>=400)throw Error(`HTTP ${response.status()}`);
        if(o.setup){const setup=(await import(pathToFileURL(path.resolve(o.setup)).href)).default;await setup({page,context,viewport:v})}
        if(o.ready)await page.locator(o.ready).waitFor({state:'visible'});await page.evaluate(()=>document.fonts.ready);
        for(const c of config.components){
          const roots=page.locator(c.selector),count=await roots.count();
          if(count<(c.minCount??1)||count>(c.maxCount??20)){report.errors.push({viewport:v.name,component:c.name,error:`Expected ${c.minCount??1}..${c.maxCount??20} roots, found ${count}`});continue;}
          for(let i=0;i<count;i++){
            const item={viewport:v,component:c.name,index:i,parts:{},checks:[]};report.cases.push(item);
            try{
              const root=roots.nth(i);await root.scrollIntoViewIfNeeded();await page.mouse.move(0,0);await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
              item.motionReadiness=await settleMotion(root);
              const box=await root.boundingBox();if(!box)throw Error('Root invisible');
              // Page screenshot clip uses document coordinates. Include 4 CSS px to expose borders.
              const scroll=await page.evaluate(()=>({x:scrollX,y:scrollY}));const clip={x:Math.max(0,Math.floor(box.x+scroll.x)-4),y:Math.max(0,Math.floor(box.y+scroll.y)-4),width:Math.ceil(box.width)+8,height:Math.ceil(box.height)+8};
              if(clip.width*clip.height*(v.dpr??1)**2>(config.maxRasterPixels??262144))throw Error('Component exceeds detail capture pixel budget');
              const stem=`${v.name}-${c.name}-${i}`;item.screenshot=`${stem}.png`;item.cssSize={width:clip.width,height:clip.height};
              await page.screenshot({path:path.join(out,item.screenshot),clip,animations:'allow'});
              const parts={};for(const [id,p]of Object.entries(c.parts)){
                const loc=p.selector==='$root'?root:root.locator(p.selector);if(await loc.count()!==1)throw Error(`${id} must match exactly one part within root`);
                parts[id]=loc;item.parts[id]=await measure(loc,p.measure);
              }
              for(let n=0;n<c.checks.length;n++){
                const q=c.checks[n],result=q.kind==='ink-gap'?await rasterPair(page,root,parts[q.a],parts[q.b],clip,v.dpr??1,q.minGap,config.paintThreshold??8,out,`${stem}-${n}`):geometryCheck(q,item.parts);
                item.checks.push({...q,...result});if(result.status==='unverified')report.errors.push({viewport:v.name,component:c.name,index:i,error:result.reason});
              }
            }catch(e){item.error=e.message;report.errors.push({viewport:v.name,component:c.name,index:i,error:e.message})}
          }
        }
      }catch(e){report.errors.push({viewport:v.name,error:e.message})}finally{await context.close()}
    }
  }catch(e){report.errors.push({error:e.message})}finally{await browser?.close()}
  report.summary={components:report.cases.length,checks:report.cases.reduce((n,c)=>n+c.checks.length,0),failedContracts:report.cases.flatMap(c=>c.checks).filter(q=>q.pass===false).length,unverified:report.errors.length,status:report.errors.length?'incomplete':'captured'};
  await fs.writeFile(path.join(out,'report.json'),JSON.stringify(report,null,2));
  const cards=report.cases.map(c=>`<article><h2>${escape(c.viewport.name)} · ${escape(c.component)} #${c.index}</h2>${c.screenshot?`<p>Actual CSS display size</p><img src="${escape(c.screenshot)}" width="${c.cssSize.width}" height="${c.cssSize.height}" alt="Component at actual CSS size"><p>8× raster enlargement (inspection aid)</p><img class="zoom" src="${escape(c.screenshot)}" width="${c.cssSize.width*8}" alt="Enlarged component">`:''}<pre>${escape(JSON.stringify({parts:c.parts,checks:c.checks,error:c.error},null,2))}</pre></article>`).join('');
  await fs.writeFile(path.join(out,'report.html'),`<!doctype html><meta charset="utf-8"><title>Component detail diagnostics</title><style>body{font:14px/1.5 system-ui;margin:32px;color:#222}article{border-top:1px solid #ccc;padding:24px 0}.zoom{image-rendering:pixelated;max-width:100%;object-fit:contain;object-position:left}pre{white-space:pre-wrap}img{border:1px solid #ddd}</style><h1>Component detail diagnostics</h1><p>${escape(JSON.stringify(report.summary))}</p><p>Contract agreement is not an optical-quality verdict. Review actual-size crops and limits.</p>${cards}<h2>Coverage and limits</h2><pre>${escape(JSON.stringify({errors:report.errors,limits:report.limits},null,2))}</pre>`);
  return report;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href){
  try{const{values:v}=parseArgs({options:{url:{type:'string'},out:{type:'string'},config:{type:'string'},channel:{type:'string'},ready:{type:'string'},setup:{type:'string'},help:{type:'boolean'}}});
    if(v.help){console.log('detail-audit.mjs --url URL --out NEW_DIR --config FILE [--channel chrome] [--ready SELECTOR] [--setup MODULE]');process.exit(0)}
    if(!v.url||!v.out||!v.config)throw Error('url, out and config required');const r=await runDetailAudit({...v,config:JSON.parse(await fs.readFile(v.config,'utf8'))});console.log(JSON.stringify({out:path.resolve(v.out),...r.summary}));process.exitCode=r.errors.length?2:r.summary.failedContracts?1:0;
  }catch(e){console.error(e.message);process.exitCode=2}
}
