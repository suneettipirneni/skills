# Cue — bespoke podcast review workspace

Built 2026-11-15. Local URL: http://127.0.0.1:4313/ . Vite remains running on port 4313. This is an original fictional application, with synthetic audio and local browser persistence. No publishing, team messages, external review actions, or backend writes occur.

## Intended experience and domain architecture

A reviewer should listen, identify a moment, leave an actionable note, and return to the same review without losing their place. The key object relationship is **a review note attached to an immutable capture of playback time**, with a resolution decision independent of that time. Playback can continue or move while someone writes; the draft timestamp changes only when explicitly refreshed.

Priority: episode identity → transport and exact time → chapter/transcript context → timecoded feedback → draft/recovery. This is a specialist media workbench, not an analytics dashboard. There is no invented metric wall or generic persistent navigation rail.

The dominant layout decision was whether the transcript should lead with a floating player, or whether transport should establish shared time above transcript and notes. The latter was selected because every note and passage points into the same short audio object. At desktop, side-by-side reading and review avoid repeated context changes. At phone widths, the transcript and feedback become two focused views. The transport dock appears when the actual transport controls leave view, preserving play/pause while reading and composing. A short resolved-note panel may leave the main controls in view and correctly does not require a dock.

This task-driven architectural choice was settled without manufacturing two cosmetic alternatives. Visual exploration instead refined readable text hierarchy, the waveform's narrow-screen geometry, and restrained material definition through rendered revisions.

## Skill routes read and applied

- `/private/tmp/ui-harmony-evaluation/skill-v2/SKILL.md` and `references/router.md`.
- `modern-saas` → `untitled-ui`, including the evidence ledger.
- Live `/Users/suneettipirneni/skills/ui-harmony/references/preferences/untitled-ui.md`, **Bespoke applications: transfer craft, derive the product**.
- Primary `specialist` → `workbench`: transport, seek, audio state, reading and timecoded notes. The specialist route explicitly marks media as requiring domain-specific evidence; generic layout checks cannot validate media behavior.
- Scoped `states`: draft capture, saved/unsaved state, resolved/reopened, empty search, empty review, damaged storage, audio failure/retry.
- `resilient-css`: fluid columns, text wrapping, narrow view changes, full waveform preservation.
- `headless-react`, `design-review`, and `measurement-rules`.

Base UI is the recommended starting point for a future dialog/combobox layer. This small implementation uses native buttons, input range controls, textarea, and select elements because their built-in behavior fits the workflow; adding a headless dependency solely for ordinary controls would not improve the task. View switches and filters are named pressed buttons, not incomplete ARIA tab or toolbar implementations.

## Sources and what transferred

- [Untitled UI Settings 01](https://www.untitledui.com/react/iframe/settings-pages/settings-01): live Chrome captures at 1440×1000 and 390×1000, inspected in `evidence/reference-settings-1440.png` and `evidence/reference-settings-390.png`. Useful relationships: clear identity/metadata hierarchy, small tactile controls, calm edges, coordinated field/action families, purposeful mobile restacking. Cue intentionally does not inherit the sidebar, form tracks, or page composition. Reference captures are visual evidence only, not an audit or claim of behavioral parity.
- [Untitled UI buttons](https://www.untitledui.com/react/components/buttons): live documentation checked. Transferred shallow edge and shadow treatment and differentiated primary/secondary emphasis; no template source or assets copied.
- [Vercel Geist materials](https://vercel.com/geist/materials): live documentation checked. Surface and floating-layer distinctions inform the quiet resting deck and more elevated transient notification. Cue's own tokens are authored decisions, not claimed Vercel measurements.
- The skill's shadcn guidance informs composable, owned component families; no shadcn screen was reproduced.
- [MDN HTMLMediaElement.currentTime](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/currentTime): current media API behavior checked. Browser tests verify the actual audio element's time changes, not just a painted progress indicator.

## Art direction and actual content

Warm near-white working plane, deep forest ink, sage playback state, and restrained cream show artwork. Original CSS acoustic rings belong to the fictional Small Hours identity; typography and the waveform provide character rather than decorative background effects. The show cover is a single labeled image role. Lucide icons share one stroke family. DM Sans is requested from Google Fonts with a system-sans fallback.

The player is the only broad contained surface. Transcript passages use space and timestamp tracks; feedback uses separators. The bordered composer earns containment because it is an explicit edit/commit boundary. Secondary metadata uses contrast-safe muted green-gray; type size and weight establish secondary status rather than insufficient contrast.

`src/episode.json` and `public/episode.wav` are copied from the supplied original fixture. Duration is 53.318 seconds. The waveform derives from its 240 measured peaks. The three chapters seek to 0, 19.146 and 36.547 seconds. The ruler positions labels by `time / duration`; it does not imply equally spaced fifteen-second intervals over 53 seconds. Transcript provenance and the episode header explicitly identify synthetic audio. Seed feedback references the actual spoken content, not a nonexistent music bed.

## Implemented meaningful workflow

- Play/pause actual WAV audio, seek with pointer or native keyboard range, skip ±10 seconds, adjust rate, and desktop volume.
- Navigate chapters or transcript timestamps; these are correctly labeled **seek**, preserving the current playback state.
- Search chapter text and title, recover zero results with Clear search.
- Capture playback time when opening/focusing an empty note. Write while playback/seek changes. Explicit timestamp refresh uses the current playback time.
- Choose Note/Edit/Mix, create notes, seek from notes, resolve, reopen, undo the latest resolution, and filter Open/Resolved/All.
- Persist playback position, notes, unfinished draft, draft timestamp and note type in localStorage. Reload restores that context without autoplay.
- Export actual notes as Markdown, including timecodes, type, authors and resolution state. Local-save scope is explicit.
- Recover empty reviews, invalid storage, unavailable storage, and audio fetch failures. Unavailable storage leaves current-session work visible and displays “Not saved — storage unavailable.”

## Rendered review and revisions

1. **Baseline inspected:** `evidence/desktop-baseline.png`, `phone-baseline.png`, `phone-feedback-baseline.png`. Strengths preserved: waveform spans the shared task, identity stays compact, repeated feedback has a stable author/time relationship. Initial phone full-page screenshot after resizing a reused page showed capture tiling; final screenshots use fresh explicit contexts and do not reproduce it.
2. **Geometry and accuracy:** original flex waveform could conceal trailing peaks on phone because bars plus gaps exceeded width. Replaced with an SVG viewBox scaled over the whole audio. Corrected ruler labels to actual time positions. Root independently identified ruler and seek-copy accuracy, and nonexistent-music seed feedback; all corrected.
3. **Reading and material:** increased desktop transcript from 13 to 14px and note copy from 12 to 13px. Retained controlled working density, chapter order, shallow button edges and the quiet creator-oriented palette. At matched viewport, Cue deliberately uses a smaller operational text hierarchy than the reference's large editable values; no claim that equal numerical tokens would improve this different task.
4. **Phone continuity:** added conditional compact playback dock. Adversarial composer state revealed a whole-player IntersectionObserver still considered a 6px waveform sliver “visible” while all transport controls were offscreen. Changed observation to `.player-top`. Explicit offscreen composer checks now exercise real audio play/pause through the dock.
5. **Contrast and semantics:** root and local axe checks found secondary text at 3.5–4.4:1. Consolidated the affected text family to `#5e6b60`, including resolved notes, helper text and metadata. Added `role=img` to artwork and `role=group` to the filter group. Phone section titles remain visually hidden, accessible h2 headings rather than being removed with display:none. Corrected small artwork caption positioning and narrow artwork type to prevent clipping.

**Craft judgment: developed for the scoped demo.** The work has a domain-specific composition, original show identity, a coherent control family, responsive task continuity, and tested feedback/recovery. The biggest remaining product gap is transcript navigation granularity: chapter-level prose is adequate for this 53-second fixture, but a real long episode would benefit from aligned sentence timecodes and explicit search-result highlighting. That is an extension requiring real timing data, not something to fabricate for visual richness. Neither functional success nor zero axe violations establishes user-tested usability or reference parity. A final independent craft check found that search-wrapper padding did not focus the input even though it looked like one field. Wrapper clicks now focus the input; the clear button remains a separate working action and returns focus to the input. Padding and clear behavior were verified at desktop and phone widths.

## Verification and evidence

Commands: `npm run build`, `node verify.mjs`, `node final-check.mjs`. Playwright uses installed Chrome and explicit `browser.newContext`. Test scripts are in this application directory. No repository or skill source was modified.

`evidence/verification.json` records the complete core workflow: actual playback progress/pause, chapter seek, keyboard seek, rate, stable timestamp while seeking, draft reload and type persistence, create/resolve/reopen/revisit, search recovery, actual export contents, widths 320/390/768/1440, empty-review creation, malformed storage, and audio retry. Its early axe record is retained honestly: desktop states passed while phone heading-order was subsequently repaired.

`evidence/final-accessibility.json` is the post-repair report for transcript and resolved feedback at 320, 390, 768 and 1440 pixels. Final screenshots use `verified-{width}-{state}.png`; `phone-composer-dock.png` demonstrates the focused composer and offscreen transport state. Root's independent flow/axe evidence lives under `root-verified` and related folders, and is separate from this agent's verification.

Numerical checks are scoped: no horizontal page overflow at the four tested widths; real media duration/time were read from HTMLAudioElement; keyboard focus is a visible 3px outline; timestamps are read back from persisted records; export is checked by downloaded file content. These authored checks do not certify general accessibility conformance.

### Manual adjudication of axe incomplete results

Remaining contrast incompletes arise from decorative SVG overlap/pseudo-elements, not automatic passing exemptions. Inspect the corresponding rendered controls:

- Skip control “10” is drawn inside a circular-arrow SVG; its actual foreground is `#5d6961` on white. Both icon and text remain visibly legible, with an explicit Back/Forward 10 seconds accessible name.
- Selected chapter text sits on `#edf3eb`, with `#34543d` primary text and `#5e6b60` chapter index and timestamp. Independent adversarial review found the previous timestamp color `#69766c` was 4.223770:1 on the selected background despite being an axe incomplete; this was a real failure and was corrected with a scoped timestamp color change. The rendered target was remeasured at 4.968294890815419:1 (`evidence/chapter-time-contrast.json`) and the production build passed. The 2px top-line pseudo-element does not cover the text. It preserves the selected relationship without lowering contrast.
- Selected feedback filter/count uses `#254f36` on `#f7f8f6`; the underline is below the text. Inactive counts now use `#5e6b60`, including short one-character counts that axe cannot always classify.
- Show cover is labeled original artwork; small graphic lettering is artwork, not a required interactive label. Episode/show identity remains available as ordinary text.
- Status and export-control overlap warnings were checked in the 320/390px renders; visible text is not occluded. Their actual colors are `#456151` on `#f7f8f6` and `#252b28` on white respectively. These do not rely on a shadow or image backdrop.

No unsupported aria-label-on-div incomplete remains after the role fixes. Manual interpretation is not an automated clean bill of health.

## Scope and limitations

- Single fictional episode, one device/browser storage, synthetic voices, fabricated reviewers and seed notes. No real authentication, shared review service, episode uploads, actual teammates, waveform generation pipeline or external publishing.
- Media progress and controls are verified in headless Chrome; audibility was not independently assessed by a human listener. Native iOS/Safari media behavior and virtual-keyboard viewport changes are unverified.
- Responsive and keyboard checks are scoped to the listed Chrome states; no screen-reader session or true browser text-zoom session was run. No dark theme is offered.
- Font loading is external and gracefully falls back. Audio and application content are local. Development dependencies currently reuse the adjacent evaluation installation via node_modules symlink; package.json declares the dependencies for independent installation.
- Storage failure cannot provide cross-reload persistence; the app explicitly says so and supports current-session work and export.
- This is an authored design evaluation, not participant research, a universal design-quality score, or evidence of a measured productivity gain.


## Published artifact note

This record describes the historical temporary evaluation workspace. Third-party reference screenshots and generator-specific helper scripts are not redistributed. Original app screenshots and independent checks are retained in `../evidence/`; portable verification scripts are one directory above this app.

Packaging verification: the root pinned dependencies to the exact versions used in the inspected generation workspace (React/React DOM19.3.1, Vite7.3.8, Lucide0.468.0) and generated a lockfile for repeatable installation. This changed package metadata only.
