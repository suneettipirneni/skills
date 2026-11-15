import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {collect} from '../lib/collect.mjs';
import {analyze} from '../lib/analyze.mjs';
const browser=await chromium.launch({channel:process.env.UI_HARMONY_TEST_CHANNEL==='chromium'?undefined:'chrome',headless:true});
let checks=0;
try{
 for(const mode of ['standards','quirks']){
  const page=await browser.newPage({viewport:{width:390,height:844}});
  await page.setContent(`${mode==='standards'?'<!doctype html>':''}<html><body style="margin:0"><div style="width:2000px">Wide content</div></body></html>`);
  const s=await page.evaluate(collect,{});assert.equal(s.document.scrollingElement,mode==='quirks'?'body':'html');assert.equal(s.document.overflowX,1610);assert.ok(analyze(s).findings.some(f=>f.rule==='page-overflow'));checks++;await page.close();
 }
 const page=await browser.newPage({viewport:{width:390,height:844}});
 await page.setContent('<!doctype html><html><head><style>.hidden{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);clip-path:inset(50%)}#skip:focus{width:auto;height:auto;clip:auto;clip-path:none}button{width:1px;height:1px;padding:0;overflow:hidden}</style></head><body><a id="skip" class="hidden" href="#content">Skip to content</a><h2 id="sr" class="hidden">Section label</h2><button id="tiny">Necessary action</button><p>Read the <a id="inline" href="#content">instructions</a> carefully.</p><div style="width:300px;overflow:auto"><div style="width:1200px">Local scroll content</div></div><main id="content">Content</main></body></html>');
 let s=await page.evaluate(collect,{});assert.equal(s.document.overflowX,0);assert.ok(s.elements.find(e=>e.selector==='#skip').visuallyHiddenCandidate);assert.ok(s.elements.find(e=>e.selector==='#sr').visuallyHiddenCandidate);assert.equal(s.elements.find(e=>e.selector==='#tiny').visuallyHiddenCandidate,false);assert.equal(s.elements.find(e=>e.selector==='#inline').targetContext.inlineTextCandidate,true);checks++;
 await page.locator('#skip').focus();s=await page.evaluate(collect,{});assert.equal(s.elements.find(e=>e.selector==='#skip').visuallyHiddenCandidate,false);assert.ok(s.elements.find(e=>e.selector==='#skip').rect.width>24);checks++;
 await page.evaluate(()=>Object.defineProperty(document,'scrollingElement',{configurable:true,get:()=>null}));s=await page.evaluate(collect,{});assert.match(s.document.extentMethod,/fallback/);assert.equal(s.document.overflowX,0);checks++;
 await page.close();console.log(JSON.stringify({result:'passed',checks,note:'Synthetic regressions derived from real-site failures, not user testing.'}));
}finally{await browser.close();}
