// Leads for a critic. Conventions here never produce failures or clear issues.
// Restrict comparisons to the selector and measurements supplied in the report.
const px = (s) => (typeof s === "string" && /^[\d.]+px$/.test(s) ? parseFloat(s) : null);
const offStep = (s, step) => {
  const n = px(s);
  return n !== null && Math.abs(n / step - Math.round(n / step)) > 0.015;
};
const spacingFields = ["row-gap", "column-gap", "padding-top", "padding-left"];
const stepCue = (v, step) =>
  spacingFields.some((k) => offStep(v[k], step))
    ? "Measured spacing falls outside the " +
      step +
      " CSS px convention. Check the local scale and optical exceptions."
    : null;
const signals = {
  "line-height": (v) =>
    v.leadingRatio !== null &&
    v.leadingRatio < 1.15 &&
    "Tight leading on a sampled role. Inspect wrapped lines for collisions.",
  "line-length": (v) =>
    v.completeLineMax > 80 &&
    "A complete line exceeds 80 graphemes. Check the reading measure, script and any user-adjustable width.",
  "all-caps-fatigue": (v) =>
    v.letters >= 45 &&
    v.letters === v.uppercaseLetters &&
    "A sustained uppercase passage merits a mixed-case reading comparison.",
  "text-alignment": (v) =>
    ["center", "justify"].includes(v["text-align"]) &&
    "Inspect wrapped prose for an unstable reading edge or uneven word spaces.",
  "small-caps": (v) =>
    v["font-variant-caps"].includes("small-caps") &&
    "Small capitals are requested. Compare with synthesis disabled and inspect font support.",
  "uppercase-letter-spacing": (v) =>
    v["text-transform"] === "uppercase" &&
    !(v.trackingEm > 0) &&
    "Compare the tightly tracked capital pairs at actual size.",
  "8pt-grid": (v) => stepCue(v, 8),
  "4pt-system": (v) => stepCue(v, 4),
  "baseline-grid": (v) =>
    offStep(v["line-height"], 4) &&
    "The line-box increment is off the four-unit rhythm. Check actual baselines and the project scale.",
  "padding-gap-ratio": (v) =>
    v.paddingGapRatio !== null &&
    v.paddingGapRatio <= 1 &&
    "The inline inset is at most the parent column gap. Inspect whether the card edge still makes ownership clear.",
  "joint-cropping": (v) =>
    v["object-fit"] === "cover" &&
    "Cover fitting can trim the subject. Compare the visible crop with the original portrait.",
  "touch-target": (v) =>
    (v.widthPx < 24 || v.heightPx < 24) &&
    "One hit-box dimension is below 24 CSS px. Check neighboring targets and the spacing, inline or other applicable exception.",
  "link-design": (v) =>
    !v["text-decoration-line"].includes("underline") &&
    "If this link sits in prose, check its persistent non-color cue or applicable contrast and interaction treatment.",
  "default-effect": (v) =>
    v.chosen === true &&
    "The option is already selected. Verify the initial choice and whether changing it persists.",
  "icon-bounding-box": (v) =>
    v.widthPx !== v.heightPx &&
    "A non-square slot may be intentional. Compare with peer glyphs in the same control family.",
  "raised-vs-inset": (v) =>
    v["box-shadow"].includes("inset") &&
    "Inspect the direction of the inset highlight and shadow against the intended control affordance.",
  "icon-stroke-weight": (v) =>
    v["vector-effect"] === "non-scaling-stroke" &&
    "This stroke stays fixed during scaling. Compare the rendered weight at each shipped size.",
};
export function collectSignals(id, sample) {
  if (!signals[id]) return [];
  return (sample?.samples ?? []).flatMap(({ element, values }) => {
    const message = signals[id](values);
    return message ? [{ element, values, message }] : [];
  });
}
