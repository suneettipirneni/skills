// Each browser probe samples a relevant role. A caller can narrow or replace the selector.
const prose = "p,article li,blockquote";
const headings = 'h1,h2,h3,h4,h5,h6,[role="heading"]';
const text = headings + ",p,label,button,th,td";
const actions = 'button,a[href],input:not([type="hidden"]),select,textarea,[role="button"]';
const icons = "svg,img[alt]";
const regions = "main,section,article,aside,nav,header,figure";
const media = "img,video,canvas,svg";
const surfaces = regions + ',button,dialog,[role="dialog"]';

function probe(selector, fields) {
  return { selector, fields: fields.split(" ") };
}

export const probes = {
  "color-naming": probe(surfaces, "color background-color"),
  "reward-anticipation": probe(
    'progress,[role="progressbar"],[aria-busy],[role="status"]',
    "busy ariaValue ariaMax",
  ),
  "color-scale": probe(surfaces, "color background-color"),
  "luminance-vs-lightness": probe(text, "color background-color"),
  "simultaneous-contrast": probe(surfaces, "background-color parentBackground"),
  "red-green-color-blindness": probe(
    '[role="status"],[role="alert"],[aria-invalid],meter',
    "color background-color",
  ),
  "dark-mode-color-adaptation": probe(text, "color background-color"),
  "line-height": probe(prose + "," + headings, "font-size line-height leadingRatio"),
  "line-length": probe(prose, "charactersPerLine completeLineMax"),
  "x-height": probe(text, "font-family font-size canvasXHeightPx"),
  "all-caps-fatigue": probe(prose + ",button", "uppercaseLetters letters text-transform"),
  "font-pairing": probe(text, "font-family font-size font-weight canvasXHeightPx"),
  "type-hierarchy": probe(text, "font-size font-weight"),
  "text-alignment": probe(prose, "direction text-align writing-mode"),
  "typeface-vs-font": probe(text, "font-family font-weight font-style font-synthesis"),
  "variable-fonts": probe(
    text,
    "font-family font-weight font-variation-settings font-optical-sizing",
  ),
  "font-weight-contrast": probe(text, "font-family font-weight"),
  "small-caps": probe(
    "abbr,small,span",
    "font-family font-variant-caps font-synthesis font-feature-settings",
  ),
  ligatures: probe("code,pre,p,h1,h2", "font-family font-variant-ligatures font-feature-settings"),
  "em-vs-rem": probe(text, "font-size parentFontPx rootFontPx"),
  "uppercase-letter-spacing": probe(
    "button,label,th,h1,h2,abbr",
    "letter-spacing trackingEm text-transform",
  ),
  "oldstyle-vs-lining-numerals": probe(
    "td,th,time,p",
    "font-family font-variant-numeric font-feature-settings",
  ),
  "8pt-grid": probe(regions, "row-gap column-gap padding-top padding-left"),
  "4pt-system": probe(actions, "column-gap padding-top padding-left"),
  proximity: probe("label,input,fieldset", "leftPx topPx widthPx heightPx"),
  "modular-grid": probe(
    regions,
    "display grid-template-rows grid-template-columns row-gap column-gap",
  ),
  "baseline-grid": probe(prose + "," + headings, "line-height topPx"),
  "active-white-space": probe(regions, "padding-top padding-bottom row-gap heightPx"),
  "twelve-column-grid": probe(regions, "display grid-template-columns column-gap"),
  "manuscript-grid": probe(
    "article,article p,main p",
    "widthPx margin-inline-start margin-inline-end",
  ),
  "padding-gap-ratio": probe(
    "article,li,section",
    "padding-inline-start parentGapPx paddingGapRatio",
  ),
  "visual-weight": probe(headings + ",button,img", "widthPx heightPx color background-color"),
  "rule-of-thirds": probe(media, "centerFractionX centerFractionY"),
  "optical-center": probe(icons, "centerFractionX centerFractionY"),
  "rule-of-odds": probe('ul,ol,[role="list"]', "visibleChildren"),
  emphasis: probe(actions, "font-weight color background-color widthPx"),
  "golden-ratio": probe(regions, "widthPx heightPx aspectRatio"),
  "aspect-ratios": probe(media, "aspectRatio widthPx heightPx object-fit object-position"),
  "joint-cropping": probe("img,video", "object-fit object-position widthPx heightPx"),
  "logo-variations": probe("header img,header svg", "widthPx heightPx"),
  "logo-clearspace": probe("header img,header svg", "leftPx topPx widthPx heightPx"),
  "corner-radius-tone": probe(
    surfaces,
    "border-top-left-radius border-top-right-radius border-bottom-left-radius border-bottom-right-radius",
  ),
  "center-bias": probe(headings + ",button,img", "leftPx topPx widthPx heightPx"),
  "default-effect": probe(
    'input[type="checkbox"],input[type="radio"],option',
    "chosen defaultChosen",
  ),
  chunking: probe("fieldset,ul,ol,section", "visibleChildren row-gap padding-top"),
  "stroop-effect": probe('[role="status"],[role="alert"],[aria-invalid]', "color background-color"),
  "figure-ground-separation": probe(surfaces, "background-color box-shadow parentBackground"),
  "touch-target": probe(actions, "widthPx heightPx"),
  "button-design": probe('button,[role="button"]', "disabled busy background-color outline-style"),
  "button-padding": probe(
    'button,[role="button"]',
    "padding-inline-start padding-inline-end column-gap widthPx",
  ),
  "link-design": probe("a[href]", "color text-decoration-line outline-style"),
  "icon-bounding-box": probe(icons, "widthPx heightPx viewBox"),
  "icon-alignment": probe(icons, "topPx heightPx vertical-align"),
  "icon-optical-balance": probe(icons, "viewBox centerFractionX centerFractionY"),
  "icon-stroke-weight": probe(
    "svg,svg path,svg line,svg circle",
    "stroke stroke-width vector-effect",
  ),
  "shadow-fundamentals": probe(surfaces, "box-shadow border-top-color"),
  "elevation-system": probe(surfaces, "box-shadow z-index"),
  "raised-vs-inset": probe(
    "button,input,select,textarea",
    "box-shadow border-top-color border-bottom-color",
  ),
};

// Executed inside the page. "normal" and insufficient samples remain unknown.
export function collectRuleSamples(requests) {
  const result = {};
  const visible = (el) =>
    el.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true }) &&
    el.getClientRects().length > 0;
  const canv = document.createElement("canvas").getContext("2d");
  function lineCounts(el, style) {
    // Only count simple, horizontal text. Mixed inline markup, transformations and
    // collapsed whitespace can otherwise assign characters to the wrong line.
    if (
      el.childNodes.length !== 1 ||
      el.firstChild.nodeType !== Node.TEXT_NODE ||
      style.writingMode !== "horizontal-tb" ||
      style.textTransform !== "none"
    )
      return null;
    const node = el.firstChild;
    if (!node.length || node.length > 2000) return null;
    const lines = new Map(),
      range = document.createRange();
    for (const { segment, index } of new Intl.Segmenter(undefined, {
      granularity: "grapheme",
    }).segment(node.data)) {
      range.setStart(node, index);
      range.setEnd(node, index + segment.length);
      const rect = range.getBoundingClientRect();
      if (rect.width > 0) lines.set(rect.y, (lines.get(rect.y) ?? 0) + 1);
    }
    return [...lines.values()];
  }
  for (const { id, selector, fields, limit } of requests) {
    try {
      const matches = [...document.querySelectorAll(selector)].filter(visible);
      const samples = matches.slice(0, limit).map((el) => {
        const style = getComputedStyle(el),
          rect = el.getBoundingClientRect();
        const parent = el.parentElement,
          parentRect = parent?.getBoundingClientRect();
        const parentStyle = parent && getComputedStyle(parent);
        const ratio = (a, b) => (Number.isFinite(a) && b > 0 ? a / b : null);
        const cssPx = (v) =>
          typeof v === "string" && /^-?[\d.]+px$/.test(v) ? parseFloat(v) : null;
        let lines;
        const getLines = () => (lines ??= lineCounts(el, style) ?? []);
        const special = {
          leftPx: () => rect.left,
          topPx: () => rect.top,
          widthPx: () => rect.width,
          heightPx: () => rect.height,
          aspectRatio: () => ratio(rect.width, rect.height),
          leadingRatio: () => ratio(cssPx(style.lineHeight) ?? NaN, cssPx(style.fontSize)),
          canvasXHeightPx: () => {
            canv.font = [style.fontStyle, style.fontWeight, style.fontSize, style.fontFamily].join(
              " ",
            );
            return canv.measureText("x").actualBoundingBoxAscent;
          },
          charactersPerLine: getLines,
          completeLineMax: () =>
            getLines().length > 1 ? Math.max(...getLines().slice(0, -1)) : null,
          uppercaseLetters: () => (el.innerText ?? "").match(/\p{Lu}/gu)?.length ?? 0,
          letters: () => (el.innerText ?? "").match(/\p{L}/gu)?.length ?? 0,
          trackingEm: () => ratio(cssPx(style.letterSpacing) ?? NaN, cssPx(style.fontSize)),
          parentFontPx: () => cssPx(parentStyle?.fontSize),
          rootFontPx: () => cssPx(getComputedStyle(document.documentElement).fontSize),
          parentBackground: () => parentStyle?.backgroundColor,
          parentGapPx: () => cssPx(parentStyle?.columnGap),
          paddingGapRatio: () =>
            ratio(cssPx(style.paddingInlineStart) ?? NaN, cssPx(parentStyle?.columnGap)),
          centerFractionX: () => ratio(rect.x + rect.width / 2 - parentRect?.x, parentRect?.width),
          centerFractionY: () =>
            ratio(rect.y + rect.height / 2 - parentRect?.y, parentRect?.height),
          visibleChildren: () => [...el.children].filter(visible).length,
          viewBox: () => el.getAttribute("viewBox"),
          disabled: () => el.matches(':disabled,[aria-disabled="true"]'),
          busy: () => el.getAttribute("aria-busy"),
          ariaValue: () => el.getAttribute("aria-valuenow") ?? el.getAttribute("value"),
          ariaMax: () => el.getAttribute("aria-valuemax") ?? el.getAttribute("max"),
          chosen: () => el.checked ?? el.selected,
          defaultChosen: () => el.defaultChecked ?? el.defaultSelected,
        };
        const values = Object.fromEntries(
          fields.map((k) => [k, special[k] ? special[k]() : style.getPropertyValue(k)]),
        );
        // Stable DOM location for evidence. Configured assertions require one match per selector.
        let part = el;
        const parts = [];
        while (part && !part.id && part.parentElement) {
          const peers = [...part.parentElement.children].filter(
            (p) => p.localName === part.localName,
          );
          parts.unshift(part.localName + ":nth-of-type(" + (peers.indexOf(part) + 1) + ")");
          part = part.parentElement;
        }
        parts.unshift(part?.id ? "#" + CSS.escape(part.id) : "html");
        return { element: parts.join(" > "), values };
      });
      result[id] = { selector, matched: matches.length, samples };
    } catch (err) {
      result[id] = { selector, error: err.message, samples: [] };
    }
  }
  return result;
}
