# Skills

Reusable agent skills for design and development.

## UI Harmony

[UI Harmony](ui-harmony/SKILL.md) is a research-backed UI/UX workflow with an Atomic Design router, concrete screen and component idioms, browser auditing, semantic review, and regression tools.

It defaults to modern SaaS minimalism: restrained surfaces, clear typography, useful density and precise controls. A separate weighted style-fit profile expresses that preference while preserving independent task, legibility, interaction and adaptation checks. The score is a transparent preference aid, not a universal measure of interface quality.

- [Design workflow and entry point](ui-harmony/SKILL.md)
- [Modern SaaS guidance](ui-harmony/references/preferences/modern-saas.md)
- [Untitled UI craft anchor](ui-harmony/references/preferences/untitled-ui.md)
- [Headless React foundations](ui-harmony/references/foundations/headless-react.md)
- [Bespoke React examples and verification](examples/ui-harmony/README.md)
- [Generation evidence and limitations](ui-harmony/references/preferences/react-generation-validation.md)
- [Research and sources](ui-harmony/references/research.md)
- [Scoring and comparison](ui-harmony/references/preferences/style-scoring.md)
- [Quiet-content checks](ui-harmony/references/foundations/quiet-content.md)
- [Physical placement and optical alignment](ui-harmony/references/foundations/optical-alignment.md)
- [Optical verification and judgment tools](ui-harmony/references/optical-workflow.md)
- [Pixel and paired-spacing diagnostics](ui-harmony/references/detail-audit.md)
- [Eight additional bespoke apps and screenshots](examples/ui-harmony/downstream/README.md)
- [Tool setup and usage](ui-harmony/references/tools.md)
- [Rendered calibration and adversarial validation](ui-harmony/references/preferences/modern-saas-validation.md)

## Before and After

[Before and After](before-and-after/SKILL.md) demonstrates UI changes and other visual changes with interactive image comparisons in a single self-contained HTML file. Images, styles, and controls are embedded: open the file directly in a browser, offline, with no dev server.

- Drag, touch, or use the keyboard to reveal before and after images.
- Compare one pair or a batch, search comparisons, and optionally synchronize sliders.
- Append later requests to an existing export or replace a pair by its stable ID.
- Keep original image proportions; use contain by default or opt into cover.
- Export each entry as a looping slider GIF or a static side-by-side PNG, directly from the offline HTML.
- Use the [copy-ready recipes](before-and-after/references/snippets.md) for repeated requests and batch GIF/PNG export.

[Open the static example](examples/before-and-after/index.html) after downloading it, or regenerate it with Node.js 20+:

```sh
node before-and-after/scripts/render.mjs \
  --manifest examples/before-and-after/comparisons.json \
  --output /tmp/before-and-after.html
```

No npm install is required for HTML generation, viewing, or the per-entry export buttons. The optional `scripts/export.mjs` batch helper uses an existing Playwright installation and browser. All runtime JavaScript, including the compact GIF encoder, is inlined once in the HTML.

To validate the generator:

```sh
node --test before-and-after/scripts/tests/render.test.mjs
```

Install this skill by selecting `--skill before-and-after` in the install command below. Invoke it with `$before-and-after`.

## Install in Codex

Use the [skills CLI](https://github.com/vercel-labs/skills), which requires Node.js 22.20 or later. To make UI Harmony available across your Codex projects:

```sh
npx skills add suneettipirneni/skills --skill ui-harmony --agent codex --global
```

For a project-only installation, run this from that project's root:

```sh
npx skills add suneettipirneni/skills --skill ui-harmony --agent codex
```

`--skill ui-harmony` selects this skill, `--agent codex` targets Codex, and `--global` selects user-wide installation. Omit `--agent codex` to choose other supported agents interactively. Invoke the installed skill with `$ui-harmony`.

To inspect the available skills without installing:

```sh
npx skills add suneettipirneni/skills --list
```

The CLI installs the skill folder. Clone this repository to also get the bespoke apps and their review evidence; the validation commands below assume a repository checkout. Browser audit dependencies still need the separate setup in the [tool guide](ui-harmony/references/tools.md).

### Manual installation from a checkout

Alternatively, clone this repository and link the skill into your Codex skills directory:

```sh
git clone https://github.com/suneettipirneni/skills.git "$HOME/skills"
mkdir -p "$HOME/.codex/skills"
ln -s "$HOME/skills/ui-harmony" "$HOME/.codex/skills/ui-harmony"
```

If either destination already exists, keep the existing contents and choose another clone location or reconcile the existing skill before linking. The symlink keeps the installed skill aligned with repository updates. Invoke it with `$ui-harmony`.

## Validate and use the tools

Requires Node.js 20 or newer. Unit tests, routing and style scoring need no dependency installation:

```sh
cd skills/ui-harmony
npm test
node scripts/route.mjs check
node scripts/style-score.mjs profile
```

For browser audits, install the pinned dependencies and a browser as described in the [tool guide](ui-harmony/references/tools.md). Keep audit dependencies separate from the application being reviewed. The npm package is marked private to prevent accidental npm publication; the GitHub repository is public.

## Research and examples

Source articles are linked and summarized in the reference ledgers. Public-site screenshots are included as evidence for limited design critiques; they are not templates or claims of endorsement. Third-party names, screenshots and referenced material retain their respective ownership. Synthetic calibration fixtures illustrate the tools. The bespoke React examples implement complete local review workflows with fictional content; they are prototypes, not production applications.
