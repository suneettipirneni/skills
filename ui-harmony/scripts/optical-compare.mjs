#!/usr/bin/env node
import fs from 'node:fs/promises';
import {parseArgs} from 'node:util';
import {compareOptical} from './lib/optical-workflow.mjs';
try{const{values,positionals}=parseArgs({allowPositionals:true,options:{'font-change':{type:'string'},'frame-change':{type:'string'}}});if(positionals.length!==2)throw Error('Usage: optical-compare.mjs BEFORE/report.json AFTER/report.json [--font-change REASON] [--frame-change REASON]');const[a,b]=await Promise.all(positionals.map(async p=>JSON.parse(await fs.readFile(p,'utf8'))));const r=compareOptical(a,b,{fontChange:values['font-change'],frameChange:values['frame-change']});console.log(JSON.stringify(r,null,2));process.exitCode=r.comparable?0:2}catch(e){console.error(e.message);process.exitCode=2}
