# Modern SaaS preference: independent research and adversarial scoring review

Reviewed2026-11-15. This concerns an explicitly requested modern minimal SaaS preference, not universal design quality. Installed v2.1 skill read before review. Staging changes belong to parent; this file contains independent research and proposed acceptance.

## Primary sources and what they actually support

1. **Linear, Charlie Aufmann/Maxime Heckel, March12,2026:** https://linear.app/now/behind-the-latest-design-refresh . Reduces competing chrome and standardizes placement while preserving rich information density. Custom themes and contrast remain. Smaller icons, softer borders and dimmer sidebar are local decisions, not universal thresholds. Supports quiet hierarchy and purposeful restraint; cannot justify arbitrary small/low-contrast defaults.
2. **Linear, Karri Saarinen/Yann-Edern Gillet/engineering contributors, March28,2024:** https://linear.app/now/how-we-redesigned-the-linear-ui . Their redesign explores whole screens/flows and tests environment, appearance and hierarchy. It preserves scope and avoids gratuitously rebuilding navigation. Reference visual language is stress-tested through native/browser configurations and themes. Supports coherent component precision and real states, not copying a marketing hero into an app.
3. **Vercel Geist colors:** https://vercel.com/geist/colors . Separate backgrounds, state backgrounds, borders and text/icon roles;10color scales. Gray-alpha has specific compositing uses. Supports restrained semantic roles, not monochrome-only or lowcontrasttext. Actual contrast still requires testing on actual backgrounds.
4. **Vercel Geist materials:** https://vercel.com/geist/materials . Elevation corresponds to surface role; recommends the lowest effective elevation, with menus/modals separated and dark-theme checks. Supports consistent restraint, not zero borders/shadows/radii.
5. **Vercel Geist typography:** https://vercel.com/geist/typography . Defines role-based combinations of size/weight/tracking/leading and separates marketing heroes from dashboard/UI uses. Its token values are system decisions, not mandatory SaaS aesthetic constants.
6. **Radix Themes typography:** https://www.radix-ui.com/themes/docs/theme/typography . Combines type metrics and permits system/custom font families and tuned weights. Supports coherent readable type rather than awarding Geist/Inter font names. Its scale is a system, not a universal legibility rule.
7. **Intercom, Pranava Tandra, January24,2025:** https://www.intercom.com/blog/designing-for-clarity-restructuring-intercoms-information-architecture . Describes confusing icons, scattered settings and user-informed restructuring. Simultaneous labels address repeated hover discovery. Supports predictable structure and progressive disclosure; directly contradicts rewarding icon-only navigation by default. Self-reported case outcomes are not independent causal measurements.
8. **Intercom, Gustavs Cirulis, December8,2021:** https://www.intercom.com/blog/fundamentals-good-interaction-design . Recognizable objects, hierarchy, rhythm, common interaction, progressive disclosure and accessibility. Warns against both nesting too many boxes and flattening everything into an undifferentiated list. States the fundamentals are their priorities, not universal commandments.
9. **NN/g, Therese Fessenden, January24,2021:** https://www.nngroup.com/articles/aesthetic-minimalist-design/ . Task-relevant minimalism means retaining necessary information. A visually minimal interface can violate the heuristic by hiding purpose/actions. A denser surface can satisfy it. Keep this distinction explicit in style scoring.
10. **NN/g, Kate Moran, September3,2017:** https://www.nngroup.com/articles/flat-ui-less-attention-cause-uncertainty/ .71participants,9pairedpage stimuli, desktop target-location experiment: weak signifiers took22%longer on average and25%morefixations. This concerns constrained findability, not whole-task usability, and does not validate a22%score penalty. Supports affordance checks against flatness fetishism.
11. **Rauno Freiberg, July2023:** https://rauno.me/craft/interaction-design . Explicitly an observational essay, not a guideline collection. Discusses interruptibility, spatial continuity and frequency-dependent motion restraint. High-frequency command interactions may work better without animated entry.
12. **Emil Kowalski:** https://emilkowal.ski/ui/you-dont-need-animations . Separates explanatory marketing animation from repeated operational interaction, with concrete timing demos.180ms/400ms and under300ms are practitioner examples/rules of thumb, not universal standards. Do not award animation quantity as SaaS polish.

No source validates the proposed numerical weights. They are an authored preference setting selected to implement the user's request.

## Scoring model challenges

A fixed7dimension0–4manual profile can produce a preference-fit index if explicitly named subjective. All7ratings must be present; no silent renormalization when a weak dimension is omitted. Preserve reason, located evidence and tradeoff. Unknown evidence is not zero and not4. Require dimensions to have discriminants: one bright badge should not incur three duplicate penalties unless hierarchy, surface and color independently fail different relationships.

Task, legibility, interaction and adaptation gates must remain separate. A100stylefit with failed keyboard/contrast is blocked; a90with unknowns is provisional; neither can outrank an85fully checked design as a recommended outcome. Screenshot-only evidence cannot establish keyboard, persistence or responsive behavior. Numerical fit should remain available as preference evidence if useful but clearly separated from recommendation.

Comparison needs fixed profile version/weights and matching task/audience/route/fixture/state/viewport/theme/evidence scope. ContextId alone can conceal incomparable cases. Weights changing must not masquerade as UI improvement. Ratings are ordinal expert judgments; a1point derived score change is not statistically meaningful.

Neutral product character can be intentional and excellent; do not force memorable novelty. Conversely, established brand color or warm typography is not a failure merely because it differs from Linear. User's requested preference can legitimately rank an ornate design lower on style fit even if usable, but should not rewrite a non-SaaS surface outside the applicable scope.

## Adversarial acceptance cases

1. **Tiny gray clone:** perfect token consistency, pale12pxbody and tiny icon-only targets. Style evidence may look coherent, but legibility/interaction failures block recommendation. Do not award muted colors for being hard to see.
2. **Dense operational table:** many rows, compact spacing, meaningful status colors, readable labels. Can score high; dense is not clutter when it serves comparison.
3. **Sparse fake dashboard:** huge whitespace,4vanitycards, missing decision-critical states. Style fit cannot erase task failure.
4. **Error state:** one strong red alert and clear corrective action. Purposeful color and hierarchy can score4despite intentional intensity.
5. **Analytical visualization:** several distinguishable series colors plus legend and direct labels. No penalty simply for palette size.
6. **Visible navigation:** labels plus icons on a moderate sidebar. Can beat cryptic icon rail that needs repeated hover; more visible words may create calmer operation.
7. **Proper modal elevation:** clear layer separation/focus without excessive chrome. Can beat flat overlay whose boundary disappears.
8. **Warm branded minimal app:** restrained warm neutral palette, distinctive type, coherent rhythm. No mandatory coolgray/Inter/Geist condition.
9. **Fast keyboard commands:** instantaneous repeated menu versus gratuitous spring animation. No-motion version can score higher in component precision/gate outcome.
10. **Marketing versus app:** dramatic hero typography may suit landing, while same treatment obstructs a daily task view. Compare within context, not universalrank.
11. **Large text/accessibility:** enlargedfont and roomier controls preserve tasks. Do not penalize accessibility adaptation as lack of precision.
12. **Partial screenshot:** allvisible dimensions scored but keyboard/adaptation unknown. Provisional output, not recommendation or validated ranking.
13. **Missing low dimension:**6ratings4and omittedcharacter. Totalnull, coverage6/7, never100.
14. **Tampered weight:**samecontextdifferentprofileweights/version. Reject comparison.
15. **Mismatched scenario:**phoneerror versusdesktoprest. Reject ranking even if contextIdsame.
16. **Good non-SaaS:**expressiveeditorial/public-servicepage. Profile explicitly not applicable or only applied under declared redesignbrief; lowstylefit is not poorUX.
17. **Intentional neutral identity:**familiarquietenterpriseUIwith little visualnovelty. Character can be wellresolved without being memorable.
18. **Highscorefailedgate:**100withcontrastfail versus85allpass. Block former; never select it automatically.

## Proposed anchors

0 means a clearly contrary/failed visual relationship in the declared brief;1 substantial mismatch;2 mixed/uneven;3 coherent fit with limited issues;4 well-resolved fit across the declared scenario. Each dimension needs specific meaning, not only these generic labels.

Quiet hierarchy: content/action priority holds while orientation chrome recedes. Surface restraint: bounded layers/grouping use only necessary chrome; crucial boundaries remain perceptible. Typography: role hierarchy, real-content readability and metrics are coherent. Density/rhythm: task-appropriate grouping and rhythm support comparison/reading without gratuitous space or compression. Component precision: equivalent roles/states align and behave predictably, with justified optical correction. Purposeful color: accent/semantic/interactive roles are distinct and intentional, including meaningful saturation. Product character: a deliberate compatible identity, which may be quiet and neutral, survives consistent execution.
