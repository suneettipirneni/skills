#!/usr/bin/env node
import { pathToFileURL } from 'node:url';
import path from 'node:path';
export function contrast(foreground,background) {
  const parse=s=>{
    if(!/^#(?:[a-f0-9]{3}|[a-f0-9]{6})$/i.test(s)) throw Error('Use opaque sRGB #RGB or #RRGGBB. Composite alpha and resolve backgrounds first.');
    let h=s.slice(1);if(h.length===3) h=[...h].map(c=>c+c).join('');
    return h.match(/../g).map(x=>parseInt(x,16)/255);
  };
  const luminance=c=>c.map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);
  const a=luminance(parse(foreground)),b=luminance(parse(background));
  const ratio=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);
  return {foreground,background,ratio,normalTextAA:ratio>=4.5,largeTextAA:ratio>=3,normalTextAAA:ratio>=7,largeTextAAA:ratio>=4.5,necessaryNonTextAA:ratio>=3,note:'Pair calculation only. Large text: at least 18pt regular or 14pt bold (24px or 18.667px at 96dpi). Apply criterion exceptions and actual composited colors. Do not round before judging.'};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href) {
  try{console.log(JSON.stringify(contrast(...process.argv.slice(2)),null,2));}
  catch(e){console.error(e.message);process.exitCode=2;}
}
