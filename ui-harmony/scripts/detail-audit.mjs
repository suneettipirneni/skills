#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import {parseArgs} from 'node:util';
import {chromium} from 'playwright';
import {PNG} from 'pngjs';
import {validateDetailConfig,geometryCheck,paintMask,inkGap,paintBalanceSensitivity} from './lib/detail.mjs';

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

async function assertPaintSupported(part,clip,strictCoverage=false){
  await part.evaluate((el,{clip,strictCoverage})=>{
    for(let ancestor=el.parentElement;ancestor;ancestor=ancestor.parentElement){
      const s=getComputedStyle(ancestor);
      if(s.filter!=='none'||s.mixBlendMode!=='normal'||s.backdropFilter!=='none')throw Error('Ancestor filters or blending need manual paint review');
    }
    for(const e of [el,...el.querySelectorAll('*')]){
      const r=e.getBoundingClientRect(),s=getComputedStyle(e);
      // A zero-sized element can still paint through generated content.
      if(s.filter!=='none'||s.mixBlendMode!=='normal'||s.backdropFilter!=='none'||s.boxShadow!=='none'||s.textShadow!=='none')throw Error('Filters, blending or shadows need manual paint review');
      for(const pseudo of ['::before','::after']){const p=getComputedStyle(e,pseudo);if(!['none','normal',''].includes(p.content))throw Error('Generated pseudo-element paint needs manual review or an explicit element');}
      if(strictCoverage&&(s.clipPath!=='none'||s.maskImage!=='none'||(s.clip&&s.clip!=='auto')))throw Error('Masks or clip paths need manual paint review');
      if(strictCoverage&&s.outlineStyle!=='none'&&parseFloat(s.outlineWidth)>0)throw Error('Outlines need manual paint review');
      if(!r.width||!r.height)continue;
      const stroke=e instanceof SVGElement&&s.stroke!=='none'?parseFloat(s.strokeWidth)||0:0;
      let scale=1;if(strictCoverage&&stroke&&s.vectorEffect!=='non-scaling-stroke'){const m=e.getScreenCTM();if(m){const trace=m.a*m.a+m.b*m.b+m.c*m.c+m.d*m.d,det=m.a*m.d-m.b*m.c;scale=Math.sqrt((trace+Math.sqrt(Math.max(0,trace*trace-4*det*det)))/2)}}
      const pad=stroke*scale/2;
      if(r.left+scrollX-pad<clip.x||r.top+scrollY-pad<clip.y||r.right+scrollX+pad>clip.x+clip.width||r.bottom+scrollY+pad>clip.y+clip.height)throw Error('Part or descendant protrudes beyond crop; paint coverage is incomplete');
      if(strictCoverage){
        for(let ancestor=e.parentElement;ancestor;ancestor=ancestor.parentElement){
          const a=getComputedStyle(ancestor);
          if(a.clipPath!=='none'||a.maskImage!=='none'||(a.clip&&a.clip!=='auto'))throw Error('Ancestor masks or clip paths need manual paint review');
          if(ancestor instanceof SVGElement&&ancestor.tagName.toLowerCase()!=='svg')continue;
          const clipsX=['hidden','clip','scroll','auto'].includes(a.overflowX),clipsY=['hidden','clip','scroll','auto'].includes(a.overflowY);
          if(!clipsX&&!clipsY)continue;
          if(a.transform!=='none')throw Error('Transformed clipping ancestor needs manual paint review');
          const ar=ancestor.getBoundingClientRect(),left=ar.left+ancestor.clientLeft,top=ar.top+ancestor.clientTop,right=left+ancestor.clientWidth,bottom=top+ancestor.clientHeight;
          if((clipsX&&(r.left-pad<left-.01||r.right+pad>right+.01))||(clipsY&&(r.top-pad<top-.01||r.bottom+pad>bottom+.01)))throw Error('Part or descendant is clipped by an ancestor; paint coverage is incomplete');
          const radii=[a.borderTopLeftRadius,a.borderTopRightRadius,a.borderBottomLeftRadius,a.borderBottomRightRadius];
          if(radii.some(v=>parseFloat(v)>0)){
            if(!radii.every(v=>/^\d+(?:\.\d+)?px$/.test(v)))throw Error('Complex rounded clipping ancestor needs manual paint review');
            const inset=Math.max(...radii.map(parseFloat));
            if(r.left-pad<left+inset||r.right+pad>right-inset||r.top-pad<top+inset||r.bottom+pad>bottom-inset)throw Error('Rounded clipping ancestor: part is outside the conservative safe interior; manual paint review required');
          }
        }
      }

    }
  },{clip,strictCoverage});
}

async function rasterPair(page,root,a,b,clip,dpr,minGap,threshold,out,prefix){
  const ah=await a.elementHandle(),bh=await b.elementHandle();
  const related=await page.evaluate(([a,b])=>a.contains(b)||b.contains(a),[ah,bh]);if(related)throw Error('Raster parts must be disjoint, not ancestor/descendant');
  const saved=await Promise.all([ah,bh].map(l=>l.evaluate(e=>e.getAttribute('style'))));
  // The verdict is meaningful only if the selected paint is actually isolated
  // and fully represented in this crop. Conservative exclusions stay unverified.
  for(const part of [ah,bh])await assertPaintSupported(part,clip);
  const shot=async name=>{const bytes=await page.screenshot({clip,fullPage:true,animations:'allow'});if(name)await fs.writeFile(path.join(out,name),bytes);return PNG.sync.read(bytes)};
  const visibility=async (l,v)=>l.evaluate((e,v)=>e.style.setProperty('visibility',v,'important'),v);
  try{
    const original=await shot(`${prefix}-original.png`);
    await visibility(ah,'hidden');await visibility(bh,'hidden');
    for(const part of [ah,bh])await part.evaluate(el=>{
      if([el,...el.querySelectorAll('*')].some(e=>getComputedStyle(e).visibility!=='hidden'&&e.getBoundingClientRect().width&&e.getBoundingClientRect().height))throw Error('Hidden part retains visible descendants; isolation is incomplete');
    });
    const base=await shot();
    await visibility(ah,'visible');const aa=await shot(`${prefix}-a.png`);
    await visibility(ah,'hidden');await visibility(bh,'visible');const bb=await shot(`${prefix}-b.png`);
    // Restore exactly; capture repeated original to detect layout/state instability.
    for(let i=0;i<2;i++)await [ah,bh][i].evaluate((e,s)=>s===null?e.removeAttribute('style'):e.setAttribute('style',s),saved[i]);
    const restored=await shot(`${prefix}-restored.png`);
    const changed=paintMask(original,restored,threshold).count;
    if(changed)throw Error(`Component paint changed at ${changed} pixels during isolation; inspect original/restored crops and capture a stable state`);
    return inkGap(paintMask(base,aa,threshold),paintMask(base,bb,threshold),dpr,minGap);
  } finally {
    for(let i=0;i<2;i++)await [ah,bh][i].evaluate((e,s)=>s===null?e.removeAttribute('style'):e.setAttribute('style',s),saved[i]);
    await ah.dispose();await bh.dispose();
  }
}

function balanceOverlay(result,clip,original){
  const m=result.observed,local=p=>({x:p.x-clip.x,y:p.y-clip.y});
  const bounds=m.inkBoundsCssPx,frame=m.referenceBoundsCssPx,r=local(frame),ink=local(bounds),rc=local(m.referenceCenterCssPx),bc=local(m.boundsCenterCssPx),cc=local(m.coverageCentroidCssPx);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${clip.width}" height="${clip.height}" viewBox="0 0 ${clip.width} ${clip.height}" role="img" aria-labelledby="title desc"><title id="title">Paint-balance measurement overlay</title><desc id="desc">Blue dashed frame and plus: reference. Magenta bounds and hollow square: bounds center. Orange circle: binary pixel-cell coverage centroid. Descriptive statistics, not an optical center or correction.</desc><image href="${escape(original)}" width="${clip.width}" height="${clip.height}"/><rect x="${r.x}" y="${r.y}" width="${frame.width}" height="${frame.height}" fill="none" stroke="#005fcc" stroke-width="1" stroke-dasharray="3 2"/><rect x="${ink.x}" y="${ink.y}" width="${bounds.width}" height="${bounds.height}" fill="none" stroke="#a02291" stroke-width="1"/><path d="M ${rc.x-5} ${rc.y} H ${rc.x+5} M ${rc.x} ${rc.y-5} V ${rc.y+5}" fill="none" stroke="white" stroke-width="3"/><path d="M ${rc.x-5} ${rc.y} H ${rc.x+5} M ${rc.x} ${rc.y-5} V ${rc.y+5}" fill="none" stroke="#005fcc" stroke-width="1.5"/><rect x="${bc.x-4}" y="${bc.y-4}" width="8" height="8" fill="none" stroke="white" stroke-width="3"/><rect x="${bc.x-4}" y="${bc.y-4}" width="8" height="8" fill="none" stroke="#a02291" stroke-width="1.5"/><circle cx="${cc.x}" cy="${cc.y}" r="2.5" fill="#b14c00" stroke="white" stroke-width="1"/></svg>`;
}

async function rasterBalance(page,root,a,b,clip,dpr,threshold,referenceMeasurement,referenceMode,region,out,prefix){
  const ah=await a.elementHandle(),bh=await b.elementHandle();
  const saved=await ah.evaluate(e=>e.getAttribute('style'));
  const restore=()=>ah.evaluate((e,s)=>s===null?e.removeAttribute('style'):e.setAttribute('style',s),saved);
  try{
    if(await page.evaluate(([a,b])=>a.contains(b),[ah,bh]))throw Error('Reference frame must remain visible when paint is hidden; it cannot be the paint part or its descendant');
    await assertPaintSupported(ah,clip,true);
    const checkReference=async()=>{
      const measured=await measure(bh,referenceMode);
      if(JSON.stringify(measured.rect)!==JSON.stringify(referenceMeasurement.rect))throw Error('Reference geometry changed during isolation; capture is unstable');
      const r=measured.rect;
      if(r.x<clip.x||r.y<clip.y||r.x+r.width>clip.x+clip.width||r.y+r.height>clip.y+clip.height)throw Error('Reference frame is partially outside crop; coverage is incomplete');
      await bh.evaluate((el,r)=>{
        for(let ancestor=el.parentElement;ancestor;ancestor=ancestor.parentElement){
          const s=getComputedStyle(ancestor);
          if(s.clipPath!=='none'||s.maskImage!=='none'||(s.clip&&s.clip!=='auto'))throw Error('Reference has an unsupported clipping ancestor');
          const x=['hidden','clip','scroll','auto'].includes(s.overflowX),y=['hidden','clip','scroll','auto'].includes(s.overflowY);
          if(!x&&!y)continue;
          if(s.transform!=='none')throw Error('Reference has a transformed clipping ancestor');
          const box=ancestor.getBoundingClientRect(),left=box.left+scrollX+ancestor.clientLeft,top=box.top+scrollY+ancestor.clientTop;
          if((x&&(r.x<left-.01||r.x+r.width>left+ancestor.clientWidth+.01))||(y&&(r.y<top-.01||r.y+r.height>top+ancestor.clientHeight+.01)))throw Error('Reference frame is clipped by an ancestor; coverage is incomplete');
          const radii=[s.borderTopLeftRadius,s.borderTopRightRadius,s.borderBottomLeftRadius,s.borderBottomRightRadius];
          if(radii.some(v=>parseFloat(v)>0)){
            if(!radii.every(v=>/^\d+(?:\.\d+)?px$/.test(v)))throw Error('Reference has a complex rounded clipping ancestor');
            const inset=Math.max(...radii.map(parseFloat));
            if(r.x<left+inset||r.x+r.width>left+ancestor.clientWidth-inset||r.y<top+inset||r.y+r.height>top+ancestor.clientHeight-inset)throw Error('Reference frame is outside the rounded clipping ancestor safe interior');
          }
        }
      },r);

    };
    await checkReference();
    const shot=async name=>{
      const bytes=await page.screenshot({clip,fullPage:true,animations:'allow'});
      if(name)await fs.writeFile(path.join(out,name),bytes);
      const png=PNG.sync.read(bytes);
      if(png.width!==Math.round(clip.width*dpr)||png.height!==Math.round(clip.height*dpr))throw Error('Raster crop dimensions are incomplete or differ from configured DPR');
      return png;
    };
    const originalName=`${prefix}-original.png`,overlayName=`${prefix}-balance.svg`;
    const original=await shot(originalName);
    await ah.evaluate(e=>e.style.setProperty('visibility','hidden','important'));
    await ah.evaluate(el=>{if([el,...el.querySelectorAll('*')].some(e=>getComputedStyle(e).visibility!=='hidden'&&e.getBoundingClientRect().width&&e.getBoundingClientRect().height))throw Error('Hidden part retains visible descendants; isolation is incomplete')});
    // b is deliberately never hidden or restyled, including when it contains a.
    await checkReference();
    const base=await shot(`${prefix}-without-a.png`);
    await restore();
    await checkReference();
    const restored=await shot(`${prefix}-restored.png`);
    const changed=paintMask(original,restored,1).count;
    if(changed)throw Error(`Component paint changed at ${changed} pixels during isolation; inspect original/restored crops and capture a stable state`);
    const r=referenceMeasurement.rect,n=region??{x:0,y:0,width:1,height:1};
    const frame={x:r.x+r.width*n.x,y:r.y+r.height*n.y,width:r.width*n.width,height:r.height*n.height};
    const coverage=paintMask(base,original,Math.max(1,Math.round(threshold/2)));
    const touches=coverage.mask.some((v,i)=>v&&(i<coverage.width||i>=coverage.width*(coverage.height-1)||i%coverage.width===0||i%coverage.width===coverage.width-1));
    if(touches)throw Error('Thresholded paint touches the crop boundary; complete coverage is uncertain');
    const result=paintBalanceSensitivity(base,original,dpr,frame,clip,threshold);
    if(result.status==='review-needed'){
      await fs.writeFile(path.join(out,overlayName),balanceOverlay(result,clip,originalName));
      return {...result,artifacts:{original:originalName,overlay:overlayName}};
    }
    return {...result,artifacts:{original:originalName}};
  }finally{
    await restore();await ah.dispose();await bh.dispose();
  }
}

export async function runDetailAudit(o){
  const theme=o.theme??'light';if(!['light','dark'].includes(theme))throw Error('theme must be light or dark');
  for(const key of ['fixture','state'])if(o[key]!==undefined&&(typeof o[key]!=='string'||!o[key].trim()))throw Error(`${key} must be a nonempty label`);
  const toolVersion=JSON.parse(await fs.readFile(new URL('../package.json',import.meta.url),'utf8')).version;
  const setupHash=o.setup?createHash('sha256').update(await fs.readFile(path.resolve(o.setup))).digest('hex'):null;
  const config=validateDetailConfig(o.config),url=new URL(o.url);if(!['http:','https:','file:'].includes(url.protocol))throw Error('Unsupported URL');
  const out=path.resolve(o.out);await fs.mkdir(out,{recursive:false});
  const report={schemaVersion:1,url:url.href,createdAt:new Date().toISOString(),config,environment:{toolVersion,setupHash,ready:o.ready??null,fixture:o.fixture??null,state:o.state??'default',theme},finalURLs:[],cases:[],errors:[],limits:['Authored contracts do not establish good visual design.','Paint isolation temporarily changes inline visibility and restores it; pseudo-elements, filters, blending and dynamic state require inspection.','Raster measurements depend on browser, font, DPR and threshold. Integer coordinates are not required; do not snap all values to whole pixels.','Paint balance measures thresholded visible contribution, not unoccluded alpha or optical mass. Reference regions are authored frames, not inferred perceptual targets.','No global collision, occlusion, accessibility or beauty guarantee. Inspect natural-size crops before enlarged raster evidence.']};
  let browser;
  try{
    browser=await chromium.launch({channel:o.channel??'chrome',headless:true});report.browser=browser.version();
    for(const v of config.viewports??[{name:'desktop',width:1440,height:1000,dpr:1}]){
      const context=await browser.newContext({viewport:{width:v.width,height:v.height},deviceScaleFactor:v.dpr??1,colorScheme:theme});
      try{
        const page=await context.newPage();page.setDefaultTimeout(10000);const response=await page.goto(url.href,{waitUntil:'load'});if(response?.status()>=400)throw Error(`HTTP ${response.status()}`);
        if(o.setup){const setup=(await import(pathToFileURL(path.resolve(o.setup)).href+'?sha256='+setupHash)).default;await setup({page,context,viewport:v})}
        if(o.ready)await page.locator(o.ready).waitFor({state:'visible'});await page.evaluate(()=>document.fonts.ready);report.finalURLs.push({viewport:v.name,url:page.url()});
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
              await page.screenshot({path:path.join(out,item.screenshot),clip,fullPage:true,animations:'allow'});
              const parts={};for(const [id,p]of Object.entries(c.parts)){
                const loc=p.selector==='$root'?root:root.locator(p.selector);if(await loc.count()!==1)throw Error(`${id} must match exactly one part within root`);
                parts[id]=loc;item.parts[id]=await measure(loc,p.measure);
              }
              for(let n=0;n<c.checks.length;n++){
                const q=c.checks[n];let result;
                if(q.kind==='paint-balance'){
                  try{result=await rasterBalance(page,root,parts[q.a],parts[q.b],clip,v.dpr??1,config.paintThreshold??8,item.parts[q.b],c.parts[q.b].measure,q.region,out,`${stem}-${n}`)}
                  catch(e){result={status:'unverified',reviewRequired:true,reason:e.message}}
                }else result=q.kind==='ink-gap'?await rasterPair(page,root,parts[q.a],parts[q.b],clip,v.dpr??1,q.minGap,config.paintThreshold??8,out,`${stem}-${n}`):geometryCheck(q,item.parts);
                item.checks.push({...q,...result});if(result.status==='unverified')report.errors.push({viewport:v.name,component:c.name,index:i,error:result.reason});
              }
            }catch(e){item.error=e.message;report.errors.push({viewport:v.name,component:c.name,index:i,error:e.message})}
          }
        }
      }catch(e){report.errors.push({viewport:v.name,error:e.message})}finally{await context.close()}
    }
  }catch(e){report.errors.push({error:e.message})}finally{await browser?.close()}
  const checks=report.cases.flatMap(c=>c.checks),diagnostics=checks.filter(q=>q.kind==='paint-balance');
  report.summary={components:report.cases.length,checks:checks.length,completedContracts:checks.filter(q=>typeof q.pass==='boolean').length,passedContracts:checks.filter(q=>q.pass===true).length,failedContracts:checks.filter(q=>q.pass===false).length,diagnosticReports:diagnostics.filter(q=>q.status==='review-needed').length,reviewRequired:diagnostics.filter(q=>q.reviewRequired).length,unverified:report.errors.length,status:report.errors.length?'incomplete':diagnostics.length?'review-needed':'captured'};
  await fs.writeFile(path.join(out,'report.json'),JSON.stringify(report,null,2));
  const cards=report.cases.map(c=>`<article><h2>${escape(c.viewport.name)} · ${escape(c.component)} #${c.index}</h2>${c.screenshot?`<p>Actual CSS display size</p><img src="${escape(c.screenshot)}" width="${c.cssSize.width}" height="${c.cssSize.height}" alt="Component at actual CSS size"><p>8× raster enlargement (inspection aid)</p><img class="zoom" src="${escape(c.screenshot)}" width="${c.cssSize.width*8}" alt="Enlarged component">`:''}${c.checks.filter(q=>q.kind==='paint-balance'&&q.artifacts?.overlay).map(q=>`<h3>Paint-balance: ${escape(q.a)} relative to ${escape(q.b)} — review required</h3><div class="balance-pair"><figure><figcaption>Untouched natural-size crop</figcaption><img src="${escape(q.artifacts.original)}" width="${c.cssSize.width}" height="${c.cssSize.height}" alt="Untouched original component"></figure><figure><figcaption>Annotated at threshold ${q.observed.threshold}</figcaption><object type="image/svg+xml" data="${escape(q.artifacts.overlay)}" width="${c.cssSize.width}" height="${c.cssSize.height}" aria-label="Measurement overlay"></object></figure></div><p>Blue + / dashed frame: reference center and bounds. Magenta □ / bounds: paint-bounds center. Orange ●: binary coverage centroid. None is an optical center or a recommended offset.</p>`).join('')}<pre>${escape(JSON.stringify({parts:c.parts,checks:c.checks,error:c.error},null,2))}</pre></article>`).join('');
  await fs.writeFile(path.join(out,'report.html'),`<!doctype html><meta charset="utf-8"><title>Component detail diagnostics</title><style>body{font:14px/1.5 system-ui;margin:32px;color:#222}article{border-top:1px solid #ccc;padding:24px 0}.zoom{image-rendering:pixelated;max-width:100%;object-fit:contain;object-position:left}pre{white-space:pre-wrap}img{border:1px solid #ddd}.balance-pair{display:flex;align-items:start;gap:24px;overflow:auto}.balance-pair figure{margin:0;flex:none}.balance-pair img,.balance-pair object{display:block;box-sizing:content-box}.balance-pair figcaption{margin-bottom:8px}</style><h1>Component detail diagnostics</h1><p>${escape(JSON.stringify(report.summary))}</p><p>Contract agreement is not an optical-quality verdict. Review actual-size crops and limits.</p>${cards}<h2>Coverage and limits</h2><pre>${escape(JSON.stringify({errors:report.errors,limits:report.limits},null,2))}</pre>`);
  return report;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href){
  try{const{values:v}=parseArgs({options:{url:{type:'string'},out:{type:'string'},config:{type:'string'},channel:{type:'string'},ready:{type:'string'},setup:{type:'string'},fixture:{type:'string'},state:{type:'string'},theme:{type:'string'},help:{type:'boolean'}}});
    if(v.help){console.log('detail-audit.mjs --url URL --out NEW_DIR --config FILE [--channel chrome] [--ready SELECTOR] [--setup MODULE] [--fixture LABEL] [--state LABEL] [--theme light|dark]');process.exit(0)}
    if(!v.url||!v.out||!v.config)throw Error('url, out and config required');const r=await runDetailAudit({...v,config:JSON.parse(await fs.readFile(v.config,'utf8'))});console.log(JSON.stringify({out:path.resolve(v.out),...r.summary}));process.exitCode=r.errors.length?2:r.summary.failedContracts?1:0;
  }catch(e){console.error(e.message);process.exitCode=2}
}
