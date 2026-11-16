# Eight additional bespoke apps

[Open the screenshot gallery](gallery.html). Eight fresh-context **gpt-6.1-terra / high** builds used the frozen published UI Harmony instructions, plus the user’s later workflow-depth and quieter-surface steering. The new diagnostics and guidance were developed during review. Initial outputs cannot be attributed to instructions added afterward. See [protocol](PROTOCOL.md) and [snapshot manifest](skill-v3-manifest.json).

| App | Connected task | Port | Screenshots |
| --- | --- | --- | --- |
| [Switchyard](switchyard/EVALUATION.md) | Release comparison, evidence and local decisions | 4321 | [Desktop](switchyard/final-review/1440.png) · [Phone](switchyard/final-review/390.png) · [Task state](switchyard/final-review/deep-390.png) |
| [Crate](crate/EVALUATION.md) | Packing readiness, case assignments and manifests | 4322 | [Desktop](crate/final-review/1440.png) · [Phone](crate/final-review/390.png) · [Task state](crate/final-review/deep-390.png) |
| [Daymark](daymark/EVALUATION.md) | Studio bookings, shared resources and conflict recovery | 4323 | [Desktop](daymark/final-review/1440.png) · [Phone](daymark/final-review/390.png) · [Task state](daymark/final-review/deep-390.png) |
| [Gloss](gloss/EVALUATION.md) | Translation review, placeholders, RTL and drafts | 4324 | [Desktop](gloss/final-review/1440.png) · [Phone](gloss/final-review/390.png) · [Task state](gloss/final-review/deep-390.png) |
| [Index](index-app/EVALUATION.md) | CSV mapping, row correction, import and undo | 4325 | [Desktop](index-app/independent-review/final-desktop.png) · [Phone](index-app/independent-review/final-phone.png) · [Task state](index-app/independent-review/selected-phone-state.png) |
| [Traverse](traverse/EVALUATION.md) | Room inspections, linked issues and completion | 4326 | [Desktop](traverse/independent-review/final-desktop.png) · [Phone](traverse/independent-review/final-phone.png) · [Task state](traverse/independent-review/selected-phone-state.png) |
| [Seating](seating/EVALUATION.md) | Party placement, capacity conflicts and saved plans | 4331 | [Desktop](seating/independent-review/final-desktop.png) · [Phone](seating/independent-review/final-phone.png) · [Task state](seating/independent-review/selected-phone-state.png) |
| [Proof](proof/EVALUATION.md) | Long-form editorial review and anchored comments | 4332 | [Desktop](proof/independent-review/final-desktop.png) · [Phone](proof/independent-review/final-phone.png) · [Task state](proof/independent-review/selected-phone-state.png) |

## Run and repeat

Use Node 22.12+ and install each React app’s own dependencies with `npm ci`; then run `npm run dev -- --host 127.0.0.1 --port PORT --strictPort` in its folder, using the table’s port. `npm run build` builds it. Traverse is plain HTML/CSS/JS: from its folder run `python3 -m http.server 4326 --bind 127.0.0.1`. All seven React apps were separately installed and built from their lockfiles; Traverse passed `node --check app.js`. All eight separately served production/static pages also rendered at 390px without page errors or root overflow; see production-smoke.json. Normal Vite dependency directive warnings are retained. Development dependency symlinks are excluded; Gloss’s temporary-workspace lockfile was regenerated for portability.

With the previews running, install the skill’s own browser dependencies and Google Chrome. From this downstream directory:

```sh
node verify-first-four.mjs
node independent-review/workflows.mjs
node independent-review/transitions.mjs
# After building each React app:
node smoke-builds.mjs
```

These scripts use fresh isolated browser contexts and fictional local data. They overwrite their named review outputs, so preserve an earlier run before repeating it. No personal browser session is used. Fonts may request external Google Fonts; system fallbacks exist. Apps are single-device prototypes, not backend services; do not use them for real release approval, bookings, translation publication, or venue planning.

## What the review established

- [First-four report](FINAL-FIRST-FOUR.md): 11 targeted checks, including phone focus/return, comparison gaps, long values and booking conflict recovery.
- [Remaining-four report](REMAINING-REVIEW.md): 42 named checks and three transition checks, with scoped default-state axe scans. These are assertions within selected workflows, not 42 different journeys.
- [Adversarial report](adversarial/REPORT.md): initial failures, tool false passes, corrections and remaining uncertainty.
- Tool calibration: 47 unit tests, seven existing browser cases and 34 new detail-browser assertions passed. The adversarial fixture intentionally retains two known collision failures and 18 incomplete cases; passing the test means those are classified correctly.
- Cue’s revised glyph passed its 42 existing workflow assertions and scoped axe checks. The original compound icon fails all eight configured geometric/paint contracts with the final tool. Three revised component/DPR cases pass; phone-forward remains **unverified** because four pixels change during isolation. No active animation explained that run. See [final diagnostic](adversarial/cue-tool-motion/report.html) and [original baseline](diagnostics/cue-before-final-tool/report.html).

The observed spacing error was 165.6px/15px around Switchyard’s desktop arrow. The corrected desktop pair is 15px/15px. Phone deliberately stacks labeled groups and measures 15px/15px vertically; a retained failed code-only phone contract incorrectly counted the next label as empty space. This demonstrates why semantic ownership matters even in numerical checks.

The builds still share a sage/cream/sidebar family (except the dark release view). Their domain structures vary; **stylistic diversity and universal downstream reliability are not established**. Dense mobile tables, long inspectors, real touch keyboards, screen readers, cross-browser behavior, multi-tab persistence, production data and backend guarantees remain outside these checks. Each review records more specific limitations. Do not read zero axe findings or a completed script as a complete accessibility or design approval.
