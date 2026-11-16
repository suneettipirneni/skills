// Layout and painted-pixel contracts are authored expectations, not taste scores.
export function validateDetailConfig(c) {
  const object=x=>x&&typeof x==='object'&&!Array.isArray(x);
  const keys=(x,allowed)=>{if(!object(x))throw Error('Expected object');for(const k of Object.keys(x))if(!allowed.includes(k))throw Error(`Unknown key: ${k}`)};
  const num=(v,min=0)=>Number.isFinite(v)&&v>=min;
  keys(c,['viewports','components','paintThreshold','maxRasterPixels']);
  if(c.viewports!==undefined&&(!Array.isArray(c.viewports)||!c.viewports.length))throw Error('viewports must be nonempty');
  if(!Array.isArray(c.components)||!c.components.length)throw Error('components must be nonempty');
  if(c.paintThreshold!==undefined&&(!Number.isInteger(c.paintThreshold)||c.paintThreshold<1||c.paintThreshold>255))throw Error('paintThreshold must be 1..255');
  if(c.maxRasterPixels!==undefined&&(!Number.isInteger(c.maxRasterPixels)||c.maxRasterPixels<1||c.maxRasterPixels>1048576))throw Error('maxRasterPixels must be 1..1048576');
  const names=new Set();
  for(const v of c.viewports??[{name:'desktop',width:1440,height:1000,dpr:1}]){
    keys(v,['name','width','height','dpr']);
    if(!/^[\w-]+$/.test(v.name)||names.has(v.name))throw Error('Viewport names must be unique filename tokens');names.add(v.name);
    if(![v.width,v.height].every(n=>Number.isInteger(n)&&n>=100&&n<=10000)||![1,2,3].includes(v.dpr??1))throw Error('Invalid viewport or DPR');
  }
  names.clear();
  for(const x of c.components){
    keys(x,['name','selector','minCount','maxCount','parts','checks']);
    if(!/^[\w-]+$/.test(x.name)||names.has(x.name)||typeof x.selector!=='string'||!x.selector.trim())throw Error('Components need unique safe names and selectors');names.add(x.name);
    for(const k of ['minCount','maxCount'])if(x[k]!==undefined&&(!Number.isInteger(x[k])||x[k]<1||x[k]>50))throw Error('Component counts must be 1..50');
    if((x.maxCount??20)<(x.minCount??1))throw Error('maxCount below minCount');
    if(!object(x.parts)||!Object.keys(x.parts).length)throw Error('parts required');
    for(const [name,p]of Object.entries(x.parts)){
      keys(p,['selector','measure']);if(!/^[\w-]+$/.test(name)||typeof p.selector!=='string'||!p.selector.trim()||!['box','text','svg'].includes(p.measure??'box'))throw Error('Invalid part');
    }
    if(!Array.isArray(x.checks)||!x.checks.length)throw Error('checks required');
    for(const q of x.checks){
      if(!object(q))throw Error('Each check must be an object');
      const extras={center:['tolerance','offsetX','offsetY'],inside:['tolerance','region'],gap:['tolerance','axis','minGap'],'ink-gap':['minGap'],between:['c','axis','tolerance','minGap']};
      if(!extras[q.kind])throw Error('Unknown check kind');
      keys(q,['kind','a','b','rationale',...extras[q.kind]]);
      if(!Object.hasOwn(x.parts,q.a)||!Object.hasOwn(x.parts,q.b)||q.a===q.b||typeof q.rationale!=='string'||!q.rationale.trim())throw Error('Checks require valid distinct parts and rationale');
      if(q.kind==='between'&&(!Object.hasOwn(x.parts,q.c)||[q.a,q.b].includes(q.c)))throw Error('between requires three distinct parts');
      for(const k of ['tolerance','minGap'])if(q[k]!==undefined&&!num(q[k]))throw Error(`${k} must be nonnegative`);
      for(const k of ['offsetX','offsetY'])if(q[k]!==undefined&&!Number.isFinite(q[k]))throw Error(`${k} must be finite`);
      if(['gap','between'].includes(q.kind)&&!['x','y'].includes(q.axis))throw Error('gap/between needs x/y axis');
      if(['gap','ink-gap','between'].includes(q.kind)&&!num(q.minGap))throw Error('gap needs minGap');
      if(q.kind==='ink-gap'&&q.minGap>16)throw Error('ink-gap is a local diagnostic: minGap <=16 CSS px');
      if(q.region){keys(q.region,['x','y','width','height']);const r=q.region;if(!['x','y','width','height'].every(k=>num(r[k]))||!r.width||!r.height||r.x+r.width>1||r.y+r.height>1)throw Error('region must fit normalized 0..1 bounds');}
    }
  }
  return c;
}

export function geometryCheck(q,parts){
  const a=parts[q.a].rect,b=parts[q.b].rect,t=q.tolerance??.5;
  if(q.kind==='center'){
    const dx=a.x+a.width/2-(b.x+b.width/2)-(q.offsetX??0),dy=a.y+a.height/2-(b.y+b.height/2)-(q.offsetY??0);
    return {pass:Math.abs(dx)<=t&&Math.abs(dy)<=t,observed:{deltaX:dx,deltaY:dy},expected:{offsetX:q.offsetX??0,offsetY:q.offsetY??0,tolerance:t}};
  }
  if(q.kind==='inside'){
    const r=q.region??{x:0,y:0,width:1,height:1};const safe={x:b.x+b.width*r.x,y:b.y+b.height*r.y,width:b.width*r.width,height:b.height*r.height};
    const clearance={left:a.x-safe.x,top:a.y-safe.y,right:safe.x+safe.width-a.x-a.width,bottom:safe.y+safe.height-a.y-a.height};
    return {pass:Object.values(clearance).every(n=>n>=-t),observed:{clearance},expected:{safeRect:safe,tolerance:t}};
  }
  if(q.kind==='gap'){
    const gap=q.axis==='x'?b.x-a.x-a.width:b.y-a.y-a.height;
    return {pass:gap>=q.minGap-t,observed:{gap},expected:{minimum:q.minGap,tolerance:t,axis:q.axis}};
  }
  if(q.kind==='between'){
    const c=parts[q.c].rect,axis=q.axis==='x'?'x':'y',size=q.axis==='x'?'width':'height';
    const before=b[axis]-a[axis]-a[size],after=c[axis]-b[axis]-b[size],imbalance=Math.abs(before-after);
    return {pass:before>=q.minGap&&after>=q.minGap&&imbalance<=t,observed:{beforeGap:before,afterGap:after,imbalance},expected:{minimumGap:q.minGap,maximumImbalance:t,axis:q.axis},note:'Use only when the connector belongs between this actual content pair; equal grid tracks may serve a different task.'};
  }
  throw Error('Raster check requires isolated paint masks');
}

export function paintMask(base,layer,threshold=8){
  if(base.width!==layer.width||base.height!==layer.height)throw Error('Raster dimensions changed during capture');
  const mask=new Uint8Array(base.width*base.height);let count=0;
  for(let i=0;i<mask.length;i++){const j=i*4;let delta=0;for(let k=0;k<4;k++)delta=Math.max(delta,Math.abs(base.data[j+k]-layer.data[j+k]));if(delta>=threshold){mask[i]=1;count++}}
  return {mask,count,width:base.width,height:base.height};
}

export function inkGap(a,b,dpr,minGap){
  if(a.width!==b.width||a.height!==b.height)throw Error('Mask dimensions differ');
  if(!a.count||!b.count)return {status:'unverified',reason:'One isolated part has no measurable paint; inspect visibility, clipping, contrast and selector.'};
  const radius=Math.ceil(minGap*dpr+1),w=a.width,h=a.height;let overlapPixels=0,nearest=Infinity,witness=null;
  for(let y=0;y<h;y++)for(let x=0;x<w;x++)if(a.mask[y*w+x]){
    if(b.mask[y*w+x]){overlapPixels++;nearest=0;witness={a:{x:x/dpr,y:y/dpr},b:{x:x/dpr,y:y/dpr}}}
    // Zero is the global lower bound; still count every overlapping pixel,
    // but avoid a quadratic neighbourhood scan once clearance is known.
    if(nearest===0)continue;
    for(let dy=-radius;dy<=radius;dy++)for(let dx=-radius;dx<=radius;dx++){
      const xx=x+dx,yy=y+dy;if(xx<0||xx>=w||yy<0||yy>=h||!b.mask[yy*w+xx])continue;
      const distance=Math.hypot(Math.max(Math.abs(dx)-1,0),Math.max(Math.abs(dy)-1,0));if(distance<nearest){nearest=distance;witness={a:{x:x/dpr,y:y/dpr},b:{x:xx/dpr,y:yy/dpr}}}
    }
  }
  const gap=Number.isFinite(nearest)?nearest/dpr:null;
  return {status:'measured',pass:overlapPixels===0&&(gap===null||gap>=minGap),observed:{overlapPixels,minimumClearanceCssPx:gap,clearanceAtLeastCssPx:gap===null?minGap:null,closestPaintCssPx:witness,aPaintPixels:a.count,bPaintPixels:b.count},expected:{minimumClearanceCssPx:minGap},note:'Thresholded raster coverage; clearance uses pixel-cell edge approximation. Witness coordinates are local to the crop. Not perceptual centering or a universal optical verdict.'};
}
