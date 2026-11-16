# Seating workspace evaluation

## Design decision
A party's needs and current placement inform a repeated assignment to a specific table. The workspace keeps a compact table overview next to the selected table's seat list and party directory. A phone switches between the table overview and the assignment inspector; it does not shrink a floor plan. Explicit save is local to the browser. Fictional content: The Field Notes Supper, 35 guests in ten parties, six tables and mixed capacities.

## Route and references
UI Harmony route: workspace → workbench for persistent editing, with collection for the party directory and specialist for spatial seating. The direction uses the frozen UI Harmony v3 skill, its modern SaaS minimalism and Untitled UI anchor (https://www.untitledui.com/), and headless React guidance. Native buttons, inputs and select provide the needed simple controls. Original warm botanical identity; no copied application or assets. Two alternatives considered: a spatial room floor plan (rejected because exact venue geometry is not supplied and placement is the actual task) and an all-guest spreadsheet (rejected because table capacity and seat positions need to remain visible).

## Baseline and review
Baseline source and desktop/phone captures are retained in `baseline/`. At 1440 × 1000 the table overview and selected table were legible as related work areas, but supporting text was too pale. At 390 × 844 the table list fit without horizontal overflow, but activity had no mobile navigation. Self-review darkened secondary roles, added mobile navigation and a seat-position selector, and removed repetitive instruction, decorative dinner divider and unnecessary help content. The user subsequently requested semantic subtraction and quieter surfaces; these changes follow that direction while retaining needs, capacity and recovery messages. Independent reviewer feedback: pending.

## Verification
- `npm run build` passes. Vite emits non-blocking lucide module-directive warnings.
- Desktop Chrome: selecting Maya & friends and moving them to Table 01 produces a capacity conflict; choosing Table 06 completes the move. Save and reload retain 3/8 at Table 06, and activity records the assignment and save.
- Export downloads a CSV with every assigned and unassigned guest; after keyboard assignment, the Maya Thompson row contained Table 06, seat 1, party and access note.
- Keyboard: focused table activated with Enter, access-needs filter activated with Enter, guest seated at selected numbered position with Enter.
- 390 × 844 Chrome: unassigned filter, party assignment and activity navigation worked; document width equaled viewport width.
- Axe on the default desktop plan after contrast fixes: zero reported violations. This is not a complete accessibility audit; other states and assistive technology remain unverified.

## Limits
No real invitations or messages are sent. Persistence is browser-local and only updated by Save plan; history is local to that saved plan. Seat position insertion shifts later guests, stated in the selector. The room arrangement is schematic and does not represent physical geometry. Table names, location and capacities can be edited; adding or deleting tables is outside this prototype. Modern SaaS style fit is provisional: no formal weighted scoring or user study was performed. Visual craft judgment: developed composition and task-specific seating view, with small secondary typography remaining a potential readability tradeoff.


## Independent remaining-app review

Independent review first reproduced a blank runtime from shared Vite cache/duplicate React. Added app-local cache and React dedupe configuration. Ten named checks cover capacity retry, dirty status, save/reload, exported CSV, phone placement, invalid-capacity cancellation, and injected save failure. Save failure now preserves edits and reports failure; dirty plans have a native leave warning. Removed redundant metrics/date/scaffold and a Guest list navigation item that rendered the same workspace. Table switching cancels an old table edit draft; a separate transition check verifies this. Final desktop/phone default axe scans are clean and 320px root overflow is absent. Build passes with existing non-fatal Lucide directive warnings. Evidence and remaining small-type/long-inspector/mobile-event-context limits: `independent-review/` and `../REMAINING-REVIEW.md`.
