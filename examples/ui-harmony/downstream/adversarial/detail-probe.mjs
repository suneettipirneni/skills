import fs from 'node:fs/promises';
import {runDetailAudit} from '../../../../ui-harmony/scripts/detail-audit.mjs';
import {inkGap,validateDetailConfig} from '../../../../ui-harmony/scripts/lib/detail.mjs';
const config={viewports:[{name:'one',width:800,height:600,dpr:1}],components:['visible-child','outside'].map(name=>({name,selector:'#'+name,parts:{a:{selector:'.a'},b:{selector:'.b'}},checks:[{kind:'ink-gap',a:'a',b:'b',minGap:2,rationale:'Disjoint component subtrees should have at least 2px paint clearance.'}]}))};
const r=await runDetailAudit({url:'file://./adversarial/detail-fixture.html',out:'./adversarial/detail-results',config});
const mask=(x,y)=>({mask:Uint8Array.from({length:16},(_,i)=>i===y*4+x?1:0),count:1,width:4,height:4});
const diagonal=inkGap(mask(0,0),mask(1,1),1,.3);
const invalid=[];for(const value of [null,undefined,3,'oops']){const c=structuredClone(config);c.components[0].checks=[value];try{validateDetailConfig(c);invalid.push({value,accepted:true})}catch(e){invalid.push({value,error:e.message})}}
await fs.writeFile('./adversarial/detail-probe.json',JSON.stringify({summary:r.summary,checks:r.cases.map(c=>({component:c.component,checks:c.checks,error:c.error})),diagonal,invalid},null,2));console.log(JSON.stringify({summary:r.summary,diagonal}));
