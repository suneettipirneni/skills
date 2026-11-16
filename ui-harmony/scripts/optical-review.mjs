#!/usr/bin/env node
import fs from 'node:fs/promises';
import {judgeOptical,opticalReviewTemplate,reportDigest} from './lib/optical-workflow.mjs';
try{const args=process.argv.slice(2),template=args[0]==='--template';if(args.length!==2)throw Error('Usage: optical-review.mjs --template REPORT.json | optical-review.mjs REPORT.json REVIEW.json');const bytes=await fs.readFile(template?args[1]:args[0]),r=JSON.parse(bytes),digest=reportDigest(bytes);const result=template?opticalReviewTemplate(r,digest):judgeOptical(r,JSON.parse(await fs.readFile(args[1],'utf8')),digest);console.log(JSON.stringify(result,null,2));if(!template)process.exitCode=result.status==='reviewed'?0:result.status==='needs-changes'?1:2}catch(e){console.error(e.message);process.exitCode=2}
