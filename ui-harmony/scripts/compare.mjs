#!/usr/bin/env node
import fs from 'node:fs/promises';
import { compare } from './lib/analyze.mjs';
try {
  const [before,after]=process.argv.slice(2);
  if(!before||!after) throw Error('Usage: node compare.mjs BEFORE/report.json AFTER/report.json');
  const result=compare(JSON.parse(await fs.readFile(before,'utf8')),JSON.parse(await fs.readFile(after,'utf8')));
  console.log(JSON.stringify(result,null,2));
  process.exitCode=result.comparable?0:2;
} catch(e) {console.error(e.message);process.exitCode=2;}
