// Compare recorded task outcomes. The reviewer supplies the ground truth, audience,
// study conditions and acceptance targets. No inference about a population.
export const trialTasks = {
  "color-psychology": "Identify the intended meaning of the color cue.",
  greyscale: "Identify the intended action or state with hue removed.",
  "color-constancy": "Identify the same state under the intended ambient lighting.",
  "red-green-color-blindness": "Distinguish critical states using a second cue.",
  "viewing-distance": "Read the item at the recorded physical viewing distance.",
  "handmade-vs-polished": "Identify the intended brand attribute in each treatment.",
  "millers-law": "Recall or retrieve the information needed to complete the next step.",
  "hicks-law": "Find the requested choice among the presented alternatives.",
  "jakobs-law": "Predict the control outcome and then complete the familiar task.",
  "center-bias": "Record the first noticed subject after the controlled exposure.",
  "banner-blindness": "Use the notice during the primary task without a prompt.",
  "inattentional-blindness": "Detect the critical update while occupied by the primary task.",
  "decoy-effect": "Choose the plan that satisfies the stated task constraints in each choice set.",
  "peak-end-rule": "Identify the final outcome after completing the difficult step.",
  subitizing: "Report the displayed quantity after a brief exposure.",
  "von-restorff-effect": "Identify the intended exception among the peers.",
  "bouba-kiki-effect": "Match the contour to the intended name or attribute.",
  "stroop-effect": "Identify the status when reading the combined text and color cues.",
  "muller-lyer-illusion": "Compare the encoded lengths with the displayed end caps.",
  "ebbinghaus-illusion": "Compare the marker quantities among different neighboring sizes.",
  "picture-superiority": "Identify the studied item after the specified recall interval.",
  "irradiation-illusion": "Compare the apparent sizes across polarities.",
  "pie-chart-problem": "Answer the part-to-whole or closest-slice comparison question.",
};
const text = (s) => typeof s === "string" && s.trim().length > 0;
function summarize(rows, requireTime) {
  const correct = rows.filter((r) => r.answer === r.expected).length;
  const times = rows
    .map((r) => r.timeMs)
    .filter(Number.isFinite)
    .sort((a, b) => a - b);
  const middle = Math.floor(times.length / 2);
  const median = times.length % 2 ? times[middle] : (times[middle - 1] + times[middle]) / 2;
  return {
    observations: rows.length,
    participants: new Set(rows.map((r) => r.participant)).size,
    correct,
    accuracy: correct / rows.length,
    medianMs: times.length === rows.length ? median : null,
    missingTimes: requireTime && times.length !== rows.length,
    misses: rows
      .filter((r) => r.answer !== r.expected)
      .map((r) => ({
        participant: r.participant,
        task: r.task,
        expected: r.expected,
        observed: r.answer,
      })),
  };
}
export function evaluateTrials(id, spec, data) {
  if (!Object.hasOwn(trialTasks, id)) throw Error("No task-trial protocol for " + id);
  if (
    !Number.isInteger(spec.minParticipants) ||
    spec.minParticipants < 1 ||
    !Number.isFinite(spec.minAccuracy) ||
    spec.minAccuracy <= 0 ||
    spec.minAccuracy > 1
  )
    throw Error(id + " requires minParticipants >= 1 and 0 < minAccuracy <= 1");
  if (
    spec.maxMedianMs !== undefined &&
    (!Number.isFinite(spec.maxMedianMs) || spec.maxMedianMs <= 0)
  )
    throw Error("Invalid maxMedianMs");
  if (
    spec.minAccuracyGain !== undefined &&
    (!Number.isFinite(spec.minAccuracyGain) || Math.abs(spec.minAccuracyGain) > 1)
  )
    throw Error("Invalid minAccuracyGain");
  if (
    data.rule !== id ||
    !text(data.protocol) ||
    !text(data.audience) ||
    !text(data.targetBasis) ||
    !Array.isArray(data.observations)
  )
    throw Error("Task file needs matching rule, protocol, audience, targetBasis and observations");
  const groups = { candidate: new Map(), baseline: new Map() };
  for (const r of data.observations) {
    if (
      !Object.hasOwn(groups, r.condition) ||
      ![r.participant, r.task, r.expected, r.answer].every(text) ||
      (r.timeMs !== undefined && (!Number.isFinite(r.timeMs) || r.timeMs < 0))
    )
      throw Error("Invalid trial in " + id);
    const group = groups[r.condition],
      key = JSON.stringify([r.participant, r.task]);
    if (group.has(key)) throw Error("Duplicate participant/task/condition trial in " + id);
    group.set(key, r);
  }
  const rows = [...groups.candidate.values()];
  if (!rows.length) return { gaps: ["No candidate trials"] };
  const observed = summarize(rows, spec.maxMedianMs !== undefined);
  const gaps = [];
  if (observed.participants < spec.minParticipants) gaps.push("Insufficient distinct participants");
  if (observed.missingTimes) gaps.push("Missing candidate task times");
  let baseline = null,
    gain = null;
  if (spec.minAccuracyGain !== undefined || groups.baseline.size) {
    if (
      groups.baseline.size !== rows.length ||
      [...groups.candidate].some(([k, r]) => r.expected !== groups.baseline.get(k)?.expected)
    )
      gaps.push("Baseline and candidate require matching participants, tasks and expected answers");
    else {
      baseline = summarize([...groups.baseline.values()], false);
      gain = observed.accuracy - baseline.accuracy;
    }
  }
  const passed =
    !gaps.length &&
    observed.accuracy >= spec.minAccuracy &&
    (spec.maxMedianMs === undefined || observed.medianMs <= spec.maxMedianMs) &&
    (spec.minAccuracyGain === undefined || gain + 1e-12 >= spec.minAccuracyGain);
  return {
    gaps,
    passed,
    observed,
    baseline,
    accuracyGain: gain,
    protocol: data.protocol,
    audience: data.audience,
    task: trialTasks[id],
  };
}
