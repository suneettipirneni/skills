const escapeHtml = (value) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ],
  );
const list = (value) => (Array.isArray(value) ? value : []);
const display = (value) =>
  value == null || value === ""
    ? "—"
    : typeof value === "object"
      ? JSON.stringify(value)
      : String(value);
const number = (value) =>
  typeof value === "number" && Number.isFinite(value)
    ? value.toFixed(3).replace(/\.?0+$/, "")
    : "—";
const difference = (source, candidate) =>
  typeof source === "number" &&
  Number.isFinite(source) &&
  typeof candidate === "number" &&
  Number.isFinite(candidate)
    ? `${candidate - source > 0 ? "+" : ""}${number(candidate - source)}`
    : "—";
// Keep evidence links relative to the report and encode each path segment.
const relativePath = (value) => {
  if (
    typeof value !== "string" ||
    !value ||
    value.startsWith("/") ||
    value.includes("\\") ||
    /^[a-z][a-z\d+.-]*:/i.test(value)
  )
    return null;
  const parts = value.split("/");
  if (parts.some((part) => !part || part === "." || part === "..")) return null;
  return parts.map(encodeURIComponent).join("/");
};
const evidence = (path, label) => {
  const href = relativePath(path);
  return href
    ? `<figure><a href="${escapeHtml(href)}"><img src="${escapeHtml(href)}" alt="${escapeHtml(label)}" loading="lazy"></a><figcaption>${escapeHtml(label)} · <a href="${escapeHtml(href)}">Open image</a></figcaption></figure>`
    : `<div class="missing">${escapeHtml(label)}: image unavailable</div>`;
};
const metricRows = [
  ["Median lightness", "medianLightness"],
  ["Tonal span", "tonalSpan"],
  ["Mean chroma", "meanChroma"],
  ["Foreground share (%)", "foregroundShare"],
  ["Foreground centroid X (%)", "centroidX"],
  ["Foreground centroid Y (%)", "centroidY"],
  ["Edge activity", "edgeActivity"],
];
function palette(metrics) {
  const colors = list(metrics?.palette);
  if (!colors.length) return '<span class="muted">Unavailable</span>';
  return `<ul class="palette">${colors
    .map((color) => {
      const hex =
        typeof color?.hex === "string" &&
        /^#[\da-f]{3}(?:[\da-f]{3})?$/i.test(color.hex)
          ? color.hex
          : null;
      return `<li>${hex ? `<span class="swatch" style="background:${hex}"></span>` : ""}<span>${escapeHtml(display(color?.hex))} <span class="muted">${escapeHtml(number(color?.share))}%</span></span></li>`;
    })
    .join("")}</ul>`;
}
function geometry(rect) {
  if (!rect) return "Unavailable";
  return ["x", "y", "width", "height"]
    .map((key) => `${key}: ${number(rect[key])}%`)
    .join(" · ");
}
function typography(type) {
  if (!type) return "";
  const fonts = list(type.fonts);
  const expected = list(type.expected);
  return `<h5>Typography evidence</h5><p>Expected: ${expected.length ? expected.map((item) => escapeHtml(display(item))).join(", ") : "None specified"} · Match: ${type.matched === true ? "yes" : type.matched === false ? "no" : "unknown"}</p><p>Computed: ${["fontFamily", "fontSize", "fontWeight", "lineHeight", "letterSpacing"].map((key) => `${escapeHtml(key)}: ${escapeHtml(display(type[key]))}`).join(" · ")}</p>${fonts.length ? `<ul>${fonts.map((font) => `<li>${escapeHtml(display(font?.familyName))} · ${escapeHtml(display(font?.glyphCount))} glyphs · ${font?.isCustomFont === true ? "custom font" : font?.isCustomFont === false ? "not a custom font" : "custom status unknown"}</li>`).join("")}</ul>` : '<p class="muted">No glyph-level font evidence available.</p>'}`;
}
function regionReport(region, index) {
  const source = region?.source?.metrics || {},
    candidate = region?.candidate?.metrics || {};
  return `<article class="region"><h4>${escapeHtml(region?.name || `Region ${index + 1}`)}</h4>${region?.reason ? `<p>${escapeHtml(region.reason)}</p>` : ""}<p class="muted">Polarity: ${escapeHtml(display(region?.polarity))} · Region geometry is expressed as percentages of each matched subject.</p><div class="pair">${evidence(region?.source?.image, "Source region")}${evidence(region?.candidate?.image, "Render region")}</div><p class="geometry"><strong>Source:</strong> ${escapeHtml(geometry(region?.geometry?.source))}<br><strong>Render:</strong> ${escapeHtml(geometry(region?.geometry?.candidate))}</p><div class="table-wrap"><table><thead><tr><th>Measure</th><th>Source</th><th>Render</th><th>Delta</th></tr></thead><tbody>${metricRows.map(([label, key]) => `<tr><th>${escapeHtml(label)}</th><td>${number(source[key])}</td><td>${number(candidate[key])}</td><td>${difference(source[key], candidate[key])}</td></tr>`).join("")}</tbody></table></div><div class="pair palette-pair"><div><strong>Source palette</strong>${palette(source)}</div><div><strong>Render palette</strong>${palette(candidate)}</div></div>${typography(region?.typography)}</article>`;
}
function caseReport(item, index) {
  const id = typeof item?.id === "string" ? item.id : "";
  const complete = item?.status === "complete" || item?.status === "completed";
  const errors = list(item?.errors),
    regions = list(item?.regions);
  return `<section class="case" id="${escapeHtml(id)}"><h2>${escapeHtml(item?.title || id || `Case ${index + 1}`)}</h2><p class="muted">${escapeHtml(id)} · ${escapeHtml(display(item?.status))}</p>${item?.intent ? `<p>${escapeHtml(item.intent)}</p>` : ""}${errors.length ? `<div class="errors"><h3>Capture errors</h3><ul>${errors.map((error) => `<li>${escapeHtml(display(error))}</li>`).join("")}</ul></div>` : ""}<h3>Full context</h3>${complete ? `<div class="pair">${evidence(`${id}/source.png`, "Source context")}${evidence(`${id}/render.png`, "Render context")}</div><h3>Matched subjects</h3><div class="pair">${evidence(`${id}/reference.png`, "Source subject")}${evidence(`${id}/subject.png`, "Render subject")}</div>` : '<p class="muted">Context and subject captures may be unavailable for an incomplete case.</p>'}<h3>Regions</h3>${regions.length ? regions.map(regionReport).join("") : '<p class="muted">No region comparisons available.</p>'}</section>`;
}
export function appearanceReport(cases) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Appearance evidence</title><style>
:root{color-scheme:light}*{box-sizing:border-box}body{margin:0;background:#f5f6f7;color:#20252c;font:16px/1.55 system-ui,-apple-system,sans-serif}main{max-width:1100px;margin:auto;padding:40px 24px 80px}h1,h2,h3,h4,h5{line-height:1.25}h1{font-size:2rem}h2{font-size:1.5rem}h3{margin-top:2rem}h4{font-size:1.15rem;margin-bottom:.5rem}h5{font-size:1rem;margin-bottom:.3rem}a{color:#2052a2}p,li{overflow-wrap:anywhere}.muted,figcaption{color:#58616d}.intro,.case{background:white;border:1px solid #d9dde2;border-radius:10px;padding:24px;margin:20px 0}.region{border-top:1px solid #d9dde2;margin-top:24px;padding-top:8px}.pair{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}figure{margin:0;min-width:0}figure img{display:block;max-width:100%;height:auto;border:1px solid #d9dde2;background:#f5f6f7}figcaption{font-size:.875rem;margin-top:6px}.missing{border:1px dashed #a9b1bb;padding:16px;color:#58616d}.table-wrap{overflow-x:auto}table{border-collapse:collapse;width:100%;font-size:.9rem;text-align:left}th,td{padding:8px 12px;border-bottom:1px solid #e5e7eb}thead th{color:#58616d}td{font-variant-numeric:tabular-nums}.palette-pair{margin:18px 0}.palette{list-style:none;padding:0;margin:8px 0}.palette li{display:flex;align-items:center;gap:8px;margin:5px 0;font-size:.9rem}.swatch{width:22px;height:22px;border:1px solid #adb4bd;border-radius:4px;flex:none}.errors{border-left:3px solid #ad5c42;padding:1px 16px;background:#fff7f3}.errors h3{margin:12px 0}.geometry{font-size:.9rem}@media(max-width:600px){main{padding:20px 14px 48px}.intro,.case{padding:18px}.pair{grid-template-columns:1fr}}
</style></head><body><main><h1>Appearance evidence</h1><div class="intro"><p>Read the two images first. Each comparison names the visual relationship under review and measures the corresponding parts of the source and render.</p><p>Geometry uses percent of the chosen product region. Text ranges include their font metrics. The pixel samples use a common width up to 192 pixels and preserve each crop’s aspect ratio. Lightness is OKLab L × 100. Tonal span is the 90th minus 10th percentile. Chroma is mean OKLab chroma × 100. Foreground pixels differ by at least 10 lightness points from the local background percentile (90th for dark ink, 10th for light ink). Their center of mass is reported as a percentage of the crop. Edge activity is the mean absolute lightness step between neighboring pixels. Each palette swatch represents a 16-level RGB bin. Compression, hand-marked bounds, text and subject matter affect every comparison.</p></div>${list(cases).length ? list(cases).map(caseReport).join("") : "<p>No cases available.</p>"}</main></body></html>`;
}
