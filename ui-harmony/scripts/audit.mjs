#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import { parseArgs } from 'node:util';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { collect } from './lib/collect.mjs';
import { analyze, validateConfig, keyFor } from './lib/analyze.mjs';
import {classifyAxe} from './lib/axe.mjs';
import { htmlReport, markdownReport, summarizeFindings } from './lib/report.mjs';

const toolVersion=JSON.parse(await fs.readFile(new URL('../package.json',import.meta.url),'utf8')).version;

export async function runAudit(options) {
  const config=validateConfig(options.config??{});
  const url=new URL(options.url);
  if(!['http:','https:','file:'].includes(url.protocol)) throw Error('Use an http, https, or file URL');
  const out=path.resolve(options.out);
  // A fresh directory prevents stale screenshots/reports from masquerading as this run.
  await fs.mkdir(out,{recursive:false});
  const viewports=config.viewports??[{name:'narrow',width:320,height:800},{name:'phone',width:390,height:844},{name:'tablet',width:768,height:1024},{name:'desktop',width:1440,height:1000}];
  const theme=options.theme??'light', motion=options.motion??'no-preference';
  let setup=null, setupHash=null;
  if(options.setup) {
    const full=path.resolve(options.setup);
    setupHash=createHash('sha256').update(await fs.readFile(full)).digest('hex');
    setup=(await import(pathToFileURL(full).href)).default;
    if(typeof setup!=='function') throw Error('Setup module must default-export an async function');
  }
  const r={schemaVersion:1,createdAt:new Date().toISOString(),url:url.href,fixture:options.fixture??'unspecified',config,setupHash,environment:{toolVersion,node:process.version,platform:process.platform,channel:options.channel??'chromium'},coverage:{plannedCases:viewports.length,semanticReview:'not-performed',keyboard:'not-performed',realBrowserZoom:'not-performed',motionPlayback:'not-performed',states:options.state??'default'},cases:[],findings:[],errors:[]};
  let browser;
  try {
    browser=await chromium.launch({headless:true,...(options.channel?{channel:options.channel}:{})});
    r.environment.browser=browser.version();
    for(const viewport of viewports) {
      const caseId=`${viewport.name}-${theme}-${motion}${options.textSpacing?'-spacing':''}-${options.state??'default'}`;
      let context;
      try {
        context=await browser.newContext({viewport:{width:viewport.width,height:viewport.height},deviceScaleFactor:1,colorScheme:theme,reducedMotion:motion,...(options.storageState?{storageState:options.storageState}:{})});
        const page=await context.newPage();
        page.setDefaultTimeout(15000);
        const consoleErrors=[], resourceErrors=[];
        page.on('requestfailed',q=>{if(['font','image','stylesheet','script'].includes(q.resourceType())) resourceErrors.push({url:q.url().split('?')[0],type:q.resourceType(),error:q.failure()?.errorText});});
        page.on('response',q=>{if(q.status()>=400&&['font','image','stylesheet','script'].includes(q.request().resourceType())) resourceErrors.push({url:q.url().split('?')[0],type:q.request().resourceType(),status:q.status()});});
        page.on('pageerror',e=>consoleErrors.push(e.message));
        const response=await page.goto(url.href,{waitUntil:'load',timeout:30000});
        if(response && response.status()>=400) throw Error(`HTTP ${response.status()}`);
        if(setup) await setup({page,context,viewport});
        if(options.ready) await page.locator(options.ready).waitFor({state:'visible'});
        await page.evaluate(async()=>{await document.fonts.ready;});
        const finalUrl=new URL(page.url());
        const normalizePath=p=>p.replace(/\/$/,'');
        if(finalUrl.origin!==url.origin||normalizePath(finalUrl.pathname)!==normalizePath(url.pathname)) r.errors.push({caseId,stage:'readiness',error:`Route changed to ${finalUrl.origin}${finalUrl.pathname}; capture the intended final route explicitly.`});
        const assetProblems=await page.evaluate(()=>({images:[...document.images].filter(i=>i.complete&&i.naturalWidth===0).map(i=>({source:i.currentSrc.split('?')[0],alt:i.alt})),fonts:[...document.fonts].filter(f=>f.status==='error').map(f=>f.family)}));
        if(resourceErrors.length||assetProblems.images.length||assetProblems.fonts.length||consoleErrors.length) r.errors.push({caseId,stage:'readiness',error:'Resource or runtime errors need investigation.',resourceErrors,assetProblems,consoleErrors});
        if(options.textSpacing) await page.addStyleTag({content:'* {line-height:1.5!important;letter-spacing:.12em!important;word-spacing:.16em!important} p {margin-bottom:2em!important}'});
        await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
        const screenshot=`${caseId}.png`, viewportScreenshot=`${caseId}-viewport.png`;
        // Capture natural state. Do not fast-forward transitions or disable animation,
        // which could hide defects or fire transition handlers before measurement.
        const snapshot=await page.evaluate(collect,config);
        Object.assign(snapshot,{caseId,viewport,theme,motion,textSpacing:!!options.textSpacing,screenshot,viewportScreenshot});
        await page.screenshot({path:path.join(out,viewportScreenshot),fullPage:false,animations:'allow'});
        await page.screenshot({path:path.join(out,screenshot),fullPage:true,animations:'allow'});
        const result=analyze(snapshot,config);
        const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa','best-practice']).analyze();
        await fs.writeFile(path.join(out,`${caseId}-axe.json`),JSON.stringify(axe,null,2));
        for(const type of ['violations','incomplete']) for(const rule of axe[type]) for(const node of rule.nodes) {
          const f={caseId,rule:`axe:${rule.id}`,selector:JSON.stringify(node.target),...classifyAxe(rule,type),confidence:type==='incomplete'?'low':'high',severity:type==='incomplete'?'moderate':({critical:'critical',serious:'major',moderate:'moderate',minor:'minor'}[rule.impact]??'moderate'),message:rule.help,observed:{summary:node.failureSummary,checks:[...node.any,...node.all,...node.none].map(c=>({id:c.id,message:c.message,data:c.data}))},expected:rule.description,fix:type==='incomplete'?'Resolve this indeterminate result manually using the rule documentation.':node.failureSummary??rule.description,verification:'Re-run the same state and manually confirm the relevant accessibility behavior.',source:rule.helpUrl,evidence:screenshot};
          f.id=keyFor(f);
          const exception=(config.ignore??[]).find(i=>i.id===f.id);
          if(exception) f.exception={reason:exception.reason};
          result.findings.push(f);
        }
        await fs.writeFile(path.join(out,`${caseId}-dom.json`),JSON.stringify(snapshot,null,2));
        r.cases.push({caseId,finalUrl:page.url(),viewport,theme,motion,textSpacing:!!options.textSpacing,screenshot,viewportScreenshot,metrics:result.metrics,coverage:snapshot.coverage,consoleErrors,axeSummary:{version:axe.testEngine.version,violationRules:axe.violations.length,incompleteRules:axe.incomplete.length,passedRules:axe.passes.length,inapplicableRules:axe.inapplicable.length}});
        r.findings.push(...result.findings);
      } catch(e) {r.errors.push({caseId,error:e.message});}
      finally {await context?.close();}
    }
  } catch(e) {r.errors.push({stage:'browser',error:e.message});}
  finally {await browser?.close();}
  r.coverage.capturedCases=r.cases.length;
  r.coverage.geometryTruncated=r.cases.some(c=>c.coverage.truncated);
  r.coverage.unverifiedContracts=r.findings.filter(f=>f.kind==='coverage').length;
  r.coverage.automatedStatus=r.errors.length||r.coverage.geometryTruncated||r.coverage.unverifiedContracts?'incomplete':'captured';
  r.coverage.notes=['A clean capture is not a quality pass. Read all axe incomplete results.','Viewport width is not browser zoom; screenshots are not motion or usability tests.','Geometry and screenshots are sequential samples; capture a stable state with --ready/--setup.','Fresh contexts per viewport. No crawling, clicking, or form submission unless a setup hook explicitly does it.'];
  r.findingSummary=summarizeFindings(r.findings);
  await fs.writeFile(path.join(out,'report.json'),JSON.stringify(r,null,2));
  await fs.writeFile(path.join(out,'report.html'),htmlReport(r));
  await fs.writeFile(path.join(out,'report.md'),markdownReport(r));
  return r;
}

if(process.argv[1] && import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    const {values:v}=parseArgs({options:{url:{type:'string'},out:{type:'string'},config:{type:'string'},channel:{type:'string'},setup:{type:'string'},ready:{type:'string'},fixture:{type:'string'},state:{type:'string',default:'default'},theme:{type:'string',default:'light'},motion:{type:'string',default:'no-preference'},'text-spacing':{type:'boolean'},'storage-state':{type:'string'},'fail-on':{type:'string',default:'none'},help:{type:'boolean'}}});
    if(v.help){console.log('audit.mjs --url URL --out NEW_DIRECTORY [--config FILE] [--channel chrome] [--setup FILE.mjs] [--ready SELECTOR] [--state NAME] [--fixture NAME] [--theme light|dark] [--motion no-preference|reduce] [--text-spacing] [--storage-state FILE] [--fail-on none|critical|major|moderate|minor]');process.exit(0);}
    if(!v.url||!v.out) throw Error('--url and --out are required');
    if(!/^[a-zA-Z0-9_-]+$/.test(v.state)) throw Error('--state must be a safe filename token');
    if(!['light','dark'].includes(v.theme)||!['reduce','no-preference'].includes(v.motion)) throw Error('Invalid theme or motion');
    const levels=['critical','major','moderate','minor'];
    if(v['fail-on']!=='none'&&!levels.includes(v['fail-on'])) throw Error('Invalid --fail-on');
    const r=await runAudit({...v,config:v.config?JSON.parse(await fs.readFile(v.config,'utf8')):{},textSpacing:v['text-spacing'],storageState:v['storage-state']});
    console.log(JSON.stringify({report:path.resolve(v.out,'report.html'),cases:r.cases.length,findings:r.findings.length,errors:r.errors.length,status:r.coverage.automatedStatus}));
    const fails=v['fail-on']!=='none'&&r.findings.some(f=>!f.exception&&['accessibility','contract'].includes(f.kind)&&levels.indexOf(f.severity)<=levels.indexOf(v['fail-on']));
    process.exitCode=r.coverage.automatedStatus==='incomplete'?2:fails?1:0;
  } catch(e) {console.error(e.message);process.exitCode=2;}
}
