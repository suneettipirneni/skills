// Runs in the page through Playwright. Intentionally does not inspect form values.
export function collect(config) {
  const properties=['position','display','clip','clip-path','font-family','font-size','font-weight','line-height','letter-spacing','color','background-color','border-radius','box-shadow','padding-top','padding-right','padding-bottom','padding-left','row-gap','column-gap'];
  for(const g of config.groups??[]) for(const p of Object.keys(g.styles??{})) if(!properties.includes(p)) properties.push(p);
  const selector = el => {
    if(el.id && document.querySelectorAll(`#${CSS.escape(el.id)}`).length===1) return `#${CSS.escape(el.id)}`;
    if(el.hasAttribute('data-testid')) {
      const s=`[data-testid="${CSS.escape(el.getAttribute('data-testid'))}"]`;
      if(document.querySelectorAll(s).length===1) return s;
    }
    const parts=[];
    while(el && el!==document.documentElement) {
      const tag=el.localName;
      const siblings=el.parentElement?[...el.parentElement.children].filter(x=>x.localName===tag):[];
      parts.unshift(`${tag}:nth-of-type(${siblings.indexOf(el)+1})`);el=el.parentElement;
    }
    return 'html'+(parts.length?' > '+parts.join(' > '):'');
  };
  const visible=el=>el.checkVisibility({checkOpacity:true,checkVisibilityCSS:true}) && el.getBoundingClientRect().width>0 && el.getBoundingClientRect().height>0;
  const measure=el=>{
    const r=el.getBoundingClientRect(), c=getComputedStyle(el);
    const rect={left:r.left+scrollX,right:r.right+scrollX,top:r.top+scrollY,bottom:r.bottom+scrollY,width:r.width,height:r.height,centerX:r.left+scrollX+r.width/2,centerY:r.top+scrollY+r.height/2};
    const directText=[...el.childNodes].some(n=>n.nodeType===Node.TEXT_NODE && n.textContent.trim());
    const clipX=['hidden','clip'].includes(c.overflowX)&&el.scrollWidth>el.clientWidth+1;
    const clipY=['hidden','clip'].includes(c.overflowY)&&el.scrollHeight>el.clientHeight+1;
    const zeroRect=/^rect\(0px[, ]+0px[, ]+0px[, ]+0px\)$/.test(c.clip);
    const insetHalf=/^inset\(50%(?: 50%){0,3}\)$/.test(c.clipPath);
    const visuallyHiddenCandidate=(c.position==='absolute'||c.position==='fixed')&&r.width<=2&&r.height<=2&&(zeroRect||insetHalf);
    const clipping=directText && (clipX||clipY) ? {x:clipX,y:clipY,overflowXCssPx:el.scrollWidth-el.clientWidth,overflowYCssPx:el.scrollHeight-el.clientHeight,textOverflow:c.textOverflow,lineClamp:c.webkitLineClamp}:null;
    return {selector:selector(el),tag:el.localName,rect,visuallyHiddenCandidate,focusable:el.matches('a[href],button,input,select,textarea,[tabindex]')&&!el.matches(':disabled')&&!el.closest('[inert]'),targetContext:{display:c.display,inlineTextCandidate:c.display==='inline'&&!!el.parentElement&&[...el.parentElement.childNodes].some(n=>n.nodeType===Node.TEXT_NODE&&n.textContent.trim()),clientRectCount:el.getClientRects().length},styles:Object.fromEntries(properties.map(p=>[p,c.getPropertyValue(p)])),clipping,interactive:el.matches('button,a[href],input:not([type=hidden]),select,textarea,[role=button],[role=link],[role=checkbox],[role=radio],[role=switch],[role=tab],[role=slider],[role=menuitem]')&&!el.matches(':disabled,[aria-disabled=true]')&&!el.closest('[inert]')};
  };
  const all=[...document.querySelectorAll('*')];
  const rendered=all.filter(visible);
  const elements=rendered.slice(0,config.maxElements??10000).map(measure);
  const match=s=>[...document.querySelectorAll(s)].filter(visible).map(measure);
  const outsideWidth=g=>(g.minWidth!==undefined&&innerWidth<g.minWidth)||(g.maxWidth!==undefined&&innerWidth>g.maxWidth);
  const groups=(config.groups??[]).map(g=>({...g,elements:outsideWidth(g)?[]:match(g.selector),skipped:outsideWidth(g)?'outside declared width range':null}));
  const separations=(config.separations??[]).map(s=>({...s,aSelector:s.a,bSelector:s.b,a:outsideWidth(s)?[]:match(s.a),b:outsideWidth(s)?[]:match(s.b),skipped:outsideWidth(s)?'outside declared width range':null}));
  const inventory={};
  for(const p of properties) {const counts={};for(const e of elements) counts[e.styles[p]]=(counts[e.styles[p]]??0)+1;inventory[p]=Object.entries(counts).map(([value,count])=>({value,count})).sort((a,b)=>b.count-a.count);}
  const scroller=document.scrollingElement;
  const extent=scroller?.scrollWidth??Math.max(document.documentElement.scrollWidth,document.body?.scrollWidth??0);
  const viewportWidth=document.compatMode==='BackCompat'?innerWidth:document.documentElement.clientWidth;
  return {document:{width:viewportWidth,scrollWidth:extent,overflowX:Math.max(0,extent-viewportWidth),compatMode:document.compatMode,scrollingElement:scroller?.localName??null,extentMethod:scroller?'scrollingElement':'root/body fallback; review scrollability',rootScrollWidth:document.documentElement.scrollWidth,bodyScrollWidth:document.body?.scrollWidth??null},elements,groups,separations,inventory,coverage:{visuallyHiddenCandidates:elements.filter(e=>e.visuallyHiddenCandidate).map(e=>({selector:e.selector,focusable:e.focusable,clip:e.styles.clip,clipPath:e.styles['clip-path'],note:'CSS hiding pattern detected, intent unverified. Check semantics and focus reveal for focusable content.'})),totalDomElements:all.length,renderedLightDomElements:rendered.length,sampledElements:elements.length,truncated:elements.length<rendered.length,iframeCount:document.querySelectorAll('iframe').length,shadowHostCount:all.filter(e=>e.shadowRoot).length,canvasCount:document.querySelectorAll('canvas').length,notes:['Geometry samples rendered light DOM only; not occlusion, text ink bounds, closed shadow trees, or iframe contents.','Offscreen rendered elements are included. Virtualized/unmounted content is absent.','Pseudo-elements, ancestor clipping and nested-inline text clipping need visual inspection.']}};
}
