#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

const directory = fileURLToPath(new URL('../references/fieldwork/2026-11/', import.meta.url));
const catalog = JSON.parse(await fs.readFile(path.join(directory, 'specimens.json'), 'utf8'));
const tasks = [...new Set(catalog.flatMap(s => s.tasks))].sort();
const esc = value => value.replace(/[<>&"']/g, c => ({'<':'&lt;', '>':'&gt;', '&':'&amp;', '"':'&quot;', "'":'&#39;'}[c]));

async function readCandidate(file) {
  const bytes = await fs.readFile(file);
  const isPng = bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  const isJpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (!isPng && !isJpeg) throw Error('Use a PNG or JPEG screenshot for --candidate.');
  return {name: path.basename(file), src: 'data:image/' + (isPng ? 'png' : 'jpeg') + ';base64,' + bytes.toString('base64')};
}

async function makeBoard(rows, title, candidate) {
  const articles = [];
  for (const item of rows) {
    const figures = [];
    for (const file of item.frames) {
      const bytes = await fs.readFile(file);
      figures.push('<img alt="' + esc(item.title) + '" src="data:image/jpeg;base64,' + bytes.toString('base64') + '">');
    }
    const examples = '<div class="frames">' + figures.join('') + '</div>';
    const comparison = candidate
      ? '<div class="comparison"><figure><figcaption>Source · ' + esc(item.credit) +
        '</figcaption>' + examples + '</figure><figure><figcaption>Rendered design · ' +
        esc(candidate.name) + '</figcaption><img alt="Rendered design for comparison" src="' +
        candidate.src + '"></figure></div>'
      : examples;
    articles.push('<article><h2>' + esc(item.title) + '</h2><a href="' + esc(item.source) + '">' + esc(item.credit) +
      '</a>' + comparison + '<p>' + esc(item.preserve) + '</p><p><b>Test</b> ' + esc(item.test) + '</p></article>');
  }
  return '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>' + esc(title) +
    '</title><style>*{box-sizing:border-box}html{color:#242624;background:#f8f8f6;font:16px/1.5 system-ui}body{max-width:76rem;margin:auto;padding:clamp(1rem,4vw,4rem)}h1,h2{line-height:1.15;letter-spacing:-.03em}h1{font-size:clamp(2rem,5vw,4rem)}h2{margin-bottom:.35em}a{color:#334e64}article{padding:1rem 0 2.5rem;border-top:1px solid #c8ccc5}article p{max-width:70ch}.frames{display:flex;flex-wrap:wrap;align-items:center;gap:1rem;margin:1.2rem 0}.frames img{width:auto;height:auto;max-height:35rem;max-width:100%;object-fit:contain}.comparison{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1.25rem;margin-block:1.5rem}.comparison figure{margin:0;min-width:0}.comparison figcaption{font-weight:600;margin-bottom:.6rem;overflow-wrap:anywhere}.comparison .frames{margin:0}.comparison img{display:block;max-width:100%;height:auto;max-height:none}@media(max-width:48rem){.comparison{grid-template-columns:1fr}}@media print{article{break-inside:avoid}}</style><main><h1>' +
    esc(title) + '</h1>' + articles.join('') + '</main></html>';
}

try {
  const {values} = parseArgs({options: {task:{type:'string'},id:{type:'string'},out:{type:'string'},candidate:{type:'string'},list:{type:'boolean'},help:{type:'boolean'}}});
  if (values.help) {
    console.log('specimens.mjs [--list | --task ROUTE | --id SPECIMEN] [--out NEW_BOARD.html]\nCompare a render: --id SPECIMEN --candidate LOCAL.png --out NEW_BOARD.html');
  } else if (values.candidate !== undefined && (!values.id || !values.out || values.list || !values.candidate)) {
    throw Error('--candidate requires --id, a local screenshot, and --out.');
  } else if (values.list) {
    console.log(JSON.stringify({tasks, specimens: catalog.map(({id, title, tasks}) => ({id, title, tasks}))}, null, 2));
  } else {
    const rows = catalog.filter(s => (!values.task || s.tasks.includes(values.task)) && (!values.id || s.id === values.id))
      .map(s => ({...s, frames: s.frames.map(f => path.join(directory, 'specimens', f + '.jpg'))}));
    if (!rows.length) throw Error('No matching specimens. Use --list for available tasks and IDs.');
    if (values.out) {
      const title = values.id ? rows[0].title : (values.task ? values.task + ' · Interface field notes' : 'Interface field notes');
      const candidate = values.candidate ? await readCandidate(values.candidate) : undefined;
      await fs.writeFile(values.out, await makeBoard(rows, title, candidate), {flag:'wx'});
      console.log(path.resolve(values.out));
    } else {
      console.log(JSON.stringify(rows, null, 2));
    }
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 2;
}
