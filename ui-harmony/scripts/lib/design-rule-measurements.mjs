// Measurements from a physical proof, a design file, or composited samples.
// All tolerances other than the standard AA pair thresholds come from the job.
import { contrast } from "../contrast.mjs";

const number = (o, k, min = 0) => {
  const n = o[k];
  if (!Number.isFinite(n) || n < min) throw Error("Expected finite " + k + " >= " + min);
  return n;
};
const positive = (o, k) => {
  const n = number(o, k);
  if (n === 0) throw Error(k + " must be positive");
  return n;
};
function lab(o, k) {
  const v = o[k];
  if (!Array.isArray(v) || v.length !== 3 || !v.every(Number.isFinite) || v[0] < 0 || v[0] > 100)
    throw Error(k + " needs [L*, a*, b*] with L* from 0 to 100");
  return v;
}
const sides = ["top", "right", "bottom", "left"];
function margins(o) {
  const values = sides.map((k) => number(o, k));
  return {
    value: Math.min(...values),
    unit: o.unit,
    required: positive(o, "required"),
    edges: Object.fromEntries(sides.map((k, i) => [k, values[i]])),
  };
}
function colorPair(o) {
  const thresholds = { normalText: 4.5, largeText: 3, necessaryNonText: 3 };
  if (!Object.hasOwn(thresholds, o.role))
    throw Error("Specify normalText, largeText or necessaryNonText");
  const { ratio } = contrast(o.foreground, o.background);
  return { value: ratio, required: thresholds[o.role], unit: "contrast ratio" };
}
export const measurements = {
  "luminance-vs-lightness": colorPair,
  "wcag-contrast": colorPair,
  "cielab-color-space": (o) => {
    const first = lab(o, "reference"),
      second = lab(o, "sample");
    if (typeof o.whitePoint !== "string" || !o.whitePoint.trim())
      throw Error("Specify common whitePoint and observer");
    return {
      value: Math.hypot(...first.map((v, i) => v - second[i])),
      maximum: number(o, "tolerance"),
      unit: "ΔE76",
    };
  },
  "visual-angle-arcminutes": (o) => ({
    value:
      ((2 * Math.atan(positive(o, "heightMm") / (2 * positive(o, "distanceMm"))) * 180) / Math.PI) *
      60,
    required: positive(o, "minimumArcmin"),
    unit: "arcmin",
  }),
  "dieline-bleed": (o) => ({ ...margins(o), unit: "mm" }),
  "logo-clearspace": (o) => {
    if (typeof o.unit !== "string" || !o.unit.trim()) throw Error("Specify the clearance unit");
    return margins(o);
  },
  "rgb-vs-cmyk": (o) => {
    for (const k of [
      "embeddedProfile",
      "requiredProfile",
      "sourceModel",
      "outputModel",
      "requiredModel",
    ])
      if (typeof o[k] !== "string" || !o[k].trim())
        throw Error("Specify " + k + " from the export or print order");
    return {
      value: [o.embeddedProfile !== o.requiredProfile, o.outputModel !== o.requiredModel].filter(
        Boolean,
      ).length,
      maximum: 0,
      unit: "output profile or color model mismatches",
    };
  },
  "cmyk-vs-pantone": (o) => {
    for (const k of ["plates", "orderedPlates"]) {
      if (
        !Array.isArray(o[k]) ||
        !o[k].length ||
        new Set(o[k]).size !== o[k].length ||
        o[k].some((p) => typeof p !== "string" || !p.trim())
      )
        throw Error("Specify distinct named " + k);
    }
    const missing = o.orderedPlates.filter((p) => !o.plates.includes(p));
    const extra = o.plates.filter((p) => !o.orderedPlates.includes(p));
    return {
      value: missing.length + extra.length,
      maximum: 0,
      unit: "unmatched separation plates",
      missing,
      extra,
    };
  },
  "iso-216": (o) => {
    const aSizes = [
      [841, 1189],
      [594, 841],
      [420, 594],
      [297, 420],
      [210, 297],
      [148, 210],
      [105, 148],
      [74, 105],
      [52, 74],
      [37, 52],
      [26, 37],
    ];
    if (!/^A(?:10|[0-9])$/.test(o.size)) throw Error("Specify A0 through A10");
    const edges = [positive(o, "widthMm"), positive(o, "heightMm")].sort((a, b) => a - b);
    const nominal = aSizes[Number(o.size.slice(1))];
    return {
      value: Math.max(...edges.map((n, i) => Math.abs(n - nominal[i]))),
      maximum: number(o, "toleranceMm"),
      unit: "mm trim error",
      edges,
      nominal,
    };
  },
};
export function measure(id, input) {
  const result = measurements[id](input);
  return {
    ...result,
    passed:
      result.required !== undefined
        ? result.value >= result.required
        : result.value <= result.maximum,
  };
}
