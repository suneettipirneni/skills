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
