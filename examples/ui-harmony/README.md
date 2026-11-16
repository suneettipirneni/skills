# Bespoke React generation examples

These original local prototypes were generated in separate fresh-context conversations using UI Harmony and then refined through independent task, visual and adversarial review. They demonstrate transfer of interface craft to different domain workflows. They do not copy an existing product screen.

- **Margin**: read fictional interview excerpts, develop a finding, link supporting/challenging evidence, inspect source context, save and revisit.
- **Cue**: listen to an original synthetic episode, seek chapters, leave timecoded feedback, resolve/reopen notes and export a review.

## Run

Requires Node.js 20.19+ or 22.12+ (Vite 7), npm, and a browser. In either `margin` or `cue`:

```sh
npm ci
npm run dev
```

Margin uses http://127.0.0.1:4314; Cue uses http://127.0.0.1:4313. `npm run build` builds each prototype. Fonts are requested from Google Fonts, with system fallbacks. App data stays in browser localStorage. These are fictional single-device prototypes, without a production backend or multi-user guarantees.

## Repeat the independent checks

Install UI Harmony's audit dependencies as described in its tool guide and have Google Chrome installed. With both dev servers running, from this directory:

```sh
node verify-margin.mjs
node verify-cue.mjs
```

Outputs go to each app's ignored `verification-output` directory. `OUT` overrides the output directory; `TARGET_URL` overrides the target origin. Tests create fictional records in fresh isolated browser contexts. They do not use a personal browser profile. The original review artifacts and before/final captures are under `evidence`. Generator-specific review histories are in each app's EVALUATION.md; paths there identify the historical evaluation workspace. Third-party reference captures are deliberately excluded.

Read the skill's React generation validation report for acceptance criteria, observed failures, corrections and limits. Passing these scripts is not a universal accessibility, usability or aesthetic certification.
