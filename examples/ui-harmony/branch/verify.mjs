import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mkdir, readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {summarize,readings,energy,money,ratesDefault,LAST,FIRST} from './data.js';

const require = createRequire(new URL('../../../ui-harmony/package.json',import.meta.url));
const {chromium} = require('playwright');
const {PNG} = require('pngjs');
const browser=await chromium.launch({channel:'chrome',args:['--disable-gpu']});
const home=new URL('./index.html',import.meta.url).href;
const shots=fileURLToPath(new URL('./screenshots/',import.meta.url));
await mkdir(shots,{recursive:true});
const problems=[];
async function open(width,height,url=home){
  const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:2,offline:true,hasTouch:width<500});
  page.on('pageerror',error=>problems.push(error.message));
  await page.goto(url);
  await page.locator('.usage-card').waitFor();
  await page.evaluate(()=>document.fonts.ready);
  return page;
}
async function verifyChartRole(page, saveEvidence = false) {
  const chart = page.locator('.usage-card');
  const slider = chart.getByRole('slider');
  const peakSlots = chart.locator('.usage-bar-slot:has(.is-peak)');
  async function selectPeak(index) {
    await peakSlots.nth(index).hover();
    // Park the pointer away from the plot during screenshot capture.
    await chart.locator('.section-title').hover();
  }

  // Read pixels from the settled browser render, including every bar and the legend.
  async function paint(filename) {
    await chart.evaluate(element => Promise.all(
      element.getAnimations({subtree:true}).map(animation => animation.finished)
    ));
    const marks = await chart.evaluate(element => {
      const frame = element.getBoundingClientRect();
      return [...element.querySelectorAll('.usage-legend span, .usage-bar')].map(mark => {
        const box = mark.getBoundingClientRect();
        const group = mark.closest('.usage-legend') ? 'legend' :
          mark.classList.contains('is-selected') ? 'selected' :
          mark.classList.contains('is-peak') ? 'peak' : 'regular';
        return {group, x:(box.left + box.width / 2 - frame.left) / frame.width,
          y:(box.top + box.height / 2 - frame.top) / frame.height};
      });
    });
    const buffer = await chart.screenshot({path:filename && shots + filename, animations:'disabled'});
    const png = PNG.sync.read(buffer);
    const groups = {legend:[], selected:[], peak:[], regular:[]};
    for (const {group,x,y} of marks) {
      const offset = 4 * (Math.floor(y * png.height) * png.width + Math.floor(x * png.width));
      groups[group].push(png.data.subarray(offset, offset + 3).toString('hex'));
    }
    return groups;
  }

  await selectPeak(0);
  const original = await paint(saveEvidence ? 'tariff-original.png' : undefined);
  assert.equal(original.selected.length, 1);
  assert.ok(original.peak.length > 1 && original.regular.length > 0);
  assert.deepEqual([...new Set(original.peak)], original.legend, 'Legend must match every ordinary peak bar');
  assert.notEqual(original.selected[0], original.legend[0]);

  const override = await page.addStyleTag({content:':root { --chart-peak-tariff: #7855d0; }'});
  try {
    const changed = await paint(saveEvidence ? 'tariff-override.png' : undefined);
    assert.notEqual(original.legend[0], '7855d0');
    assert.deepEqual(changed, {...original, legend:['7855d0'], peak:original.peak.map(() => '7855d0')});
    const firstIndex = await slider.getAttribute('aria-valuenow');
    await selectPeak(1);
    assert.equal(Number(await slider.getAttribute('aria-valuenow')), Number(firstIndex) + 1);
    assert.deepEqual(await paint(), changed, 'Former selection must rejoin the recolored peak bars');
  } finally {
    await override.evaluate(style => style.remove());
  }
  assert.deepEqual(await paint(), original, 'Removing the override must restore the rendered palette');
}

try{
  const specimen = await open(700, 540, new URL('./specimen.html',import.meta.url).href);
  await verifyChartRole(specimen, true);
  await specimen.context().close();
  for(const [width,height] of [[1440,920],[390,844],[320,740],[768,880],[1024,850]]){
    const page=await open(width,height);
    const geometry=await page.evaluate(()=>{
      const rect=s=>document.querySelector(s).getBoundingClientRect();
      return {viewport:innerWidth,body:document.documentElement.scrollWidth,
        content:document.documentElement.scrollHeight,lefts:['.page-title','.range-row','.stats','.usage-card','.circuits'].map(s=>rect(s).left),
        charts:['.usage-card','.home-map'].map(s=>[rect(s).top,rect(s).bottom]),
        plot:rect('.usage-plot').height,axis:rect('.usage-axis').height,
        periodOverlap:rect('.date-controls').right>rect('.range-row .segments').left && rect('.date-controls').bottom>rect('.range-row .segments').top};
    });
    assert.equal(geometry.viewport,geometry.body);
    assert.ok(new Set(geometry.lefts).size===1);
    assert.equal(geometry.periodOverlap,false);
    assert.ok(Math.abs(geometry.plot-geometry.axis)<3,JSON.stringify(geometry));
    if(width>660)assert.deepEqual(geometry.charts[0],geometry.charts[1]);
    const cdp=await page.context().newCDPSession(page);
    await cdp.send('DOM.enable');await cdp.send('CSS.enable');
    const {root}=await cdp.send('DOM.getDocument');
    const {nodeId}=await cdp.send('DOM.querySelector',{nodeId:root.nodeId,selector:'h1'});
    const {fonts}=await cdp.send('CSS.getPlatformFontsForNode',{nodeId});
    assert.ok(fonts.some(font=>font.isCustomFont&&font.familyName.includes('Inter')));
    if(width===1440||width===390){
      let capturePage=page;
      if(geometry.content>height)capturePage=await open(width,geometry.content);
      await capturePage.screenshot({path:shots+(width===1440?'desktop':'mobile')+'.png',fullPage:true,animations:'disabled'});
      if(capturePage!==page)await capturePage.context().close();
    }
    console.log(width,geometry);
    await page.context().close();
  }
  const page=await open(1200,860);
  await verifyChartRole(page);
  const button=name=>page.getByRole('button',{name,exact:true});
  const day=readings(LAST,LAST),total=summarize(day,ratesDefault);
  const numbers=page.locator('.stat-number');
  assert.equal(await numbers.nth(0).textContent(),energy(total.kwh)+'kWh');
  assert.equal(await numbers.nth(1).textContent(),money(total.cost));
  assert.equal(await numbers.nth(2).textContent(),total.max.toFixed(2)+'kW');
  assert.equal(await numbers.nth(3).textContent(),Math.round(total.off/total.kwh*100)+'%');
  const downloadPromise=page.waitForEvent('download');await button('Export CSV').click();
  const csv=await readFile(await (await downloadPromise).path(),'utf8');
  const rows=csv.trim().split('\n').slice(1).map(r=>r.split(','));
  assert.equal(rows.length,48);
  for(const row of rows)assert.ok(Math.abs(row.slice(6).reduce((a,n)=>a+Number(n),0)-Number(row[4]))<1e-8);
  assert.equal(energy(rows.reduce((a,r)=>a+Number(r[4]),0)),energy(total.kwh));
  assert.equal(money(rows.reduce((a,r)=>a+Number(r[5]),0)),money(total.cost));
  assert.equal(await page.locator('.usage-bar').count(),48);
  const slider=page.getByRole('slider');await slider.focus();await slider.press('Home');
  assert.equal(await slider.getAttribute('aria-valuenow'),'1');await slider.press('ArrowRight');
  assert.equal(await slider.getAttribute('aria-valuenow'),'2');await button('$').click();
  assert.equal(await page.locator('.usage-value').textContent(),money(day[1].kwh*ratesDefault.off));
  await button('Week').click();assert.equal(await page.locator('.usage-bar').count(),7);
  assert.equal(await numbers.nth(0).textContent(),energy(summarize(readings('2026-11-16',LAST),ratesDefault).kwh)+'kWh');
  await button('Month').click();assert.equal(await page.locator('.usage-bar').count(),22);
  await button('Previous period').click();assert.equal(await page.locator('.usage-bar').count(),31);
  await button('Next period').click();assert.equal(await button('Next period').isDisabled(),true);
  await button('Day').click();await page.getByLabel('Choose meter date').fill(FIRST);
  assert.equal(await button('Previous period').isDisabled(),true);
  await page.getByLabel('Choose meter date').fill(LAST);
  await page.getByRole('combobox',{name:'Select circuit'}).selectOption('kitchen');
  assert.match(await page.locator('.circuits tr.selected').innerText(),/Kitchen/);
  await page.locator('.home-map-pin[aria-label="Laundry"]').click();
  assert.equal(await page.locator('.home-map-current strong').textContent(),'Laundry');
  await button('View Laundry details').click();assert.equal(await page.getByRole('dialog').isVisible(),true);
  await page.keyboard.press('Escape');await button('Rate plan').click();
  await page.getByRole('spinbutton',{name:'Off-peak rate',exact:true}).fill('20');
  await button('Save rates').click();await page.reload();await numbers.nth(1).waitFor();
  assert.equal(await numbers.nth(1).textContent(),money(summarize(day,{...ratesDefault,off:.20}).cost));
  await button('History').click();assert.equal(await page.locator('.history tbody tr').count(),14);
  await button('Older readings').click();await page.locator('.history .date-link').first().click();
  assert.equal(await page.getByLabel('Choose meter date').inputValue(),'2026-11-08');
  assert.deepEqual(problems,[]);console.log('Verified interval totals, tariffs, CSV, history, chart inspection and linked circuits.');
}finally{await browser.close()}
