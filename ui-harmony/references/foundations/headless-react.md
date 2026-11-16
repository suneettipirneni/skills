# Headless React primitives: behavior foundation, authored visual system

Use when generating React interfaces with dialogs, menus, selects, tabs or other interaction-heavy controls. For new work without an established primitive layer, **recommend Base UI** as a starting option. Preserve a suitable existing Base UI, React Aria, Radix or equivalent implementation. Native buttons, inputs and selects remain appropriate for simple cases; avoid introducing a library solely to render static content.

The aesthetic anchor remains [Untitled UI](../preferences/untitled-ui.md). Headless primitives help supply behavior and semantics; the app still owns composition, typography, spacing, control material, content and state presentation. Installing a package is not evidence of polish or assembled accessibility.

## Choose by behavior

| Product need | Primitive / integration decision | Verify after composition |
| --- | --- | --- |
| Invitation, edit or contextual task | Dialog with a title, a description when useful, and trigger/close semantics | Initial focus, keyboard containment, Escape policy, return focus, long content and error recovery |
| Action choices | Menu, with real command actions | Keyboard opening/navigation, dismissal, disabled items and focus return |
| Choosing a value | Native select, Select, or Combobox when search is needed | Label/value distinction, keyboard selection, long options, empty matches and selected state |
| Switching views | Tabs when panels share a context; links for destinations | Keyboard behavior and active-panel relationships; do not turn navigation into a tab merely for appearance |
| Fields and validation | Native entry or Field/Form composition | Persistent labels, descriptions, invalid+focus state, retained input and useful error messages |
| Secondary explanation | Tooltip only for supplemental information | Named trigger, keyboard access, visible focus; essential instructions stay visible elsewhere |

Read the current API or the installed package documentation before implementing. [Base UI quick start](https://base-ui.com/react/overview/quick-start) identifies `@base-ui/react`; component imports include `@base-ui/react/dialog` and `@base-ui/react/select`. Do not paste obsolete APIs from a similarly named library. Check project conventions and the lockfile before adding dependencies.

## Apply the visual family without breaking behavior

- Use the component's documented state attributes and CSS variables for styling. [Styling guidance](https://base-ui.com/react/handbook/styling) covers classes, state callbacks, state data attributes and available-size/anchor variables. Preserve highlighted, selected, disabled and focus distinctions in the finished design. Inspect the actual popup's available space rather than giving every menu a fixed height.
- When composing a custom trigger through `render`, pass the ref and received props to its actual DOM element as required by [composition guidance](https://base-ui.com/react/handbook/composition). Prefer native-button custom triggers. If changing the rendered element type, follow that part’s documented `nativeButton` requirements; ref/prop forwarding alone does not make arbitrary markup keyboard-equivalent. Avoid nested buttons and dropped event handlers. Verify the rendered semantics after styling.
- Follow the library's portal/stacking guidance and the host app's layer system. Theme variables must reach portaled surfaces. A menu should remain related to its trigger and fit the narrow viewport; a focus ring must not be clipped by the component's material wrapper.
- Build a small set of app-owned styled wrappers only for repeated roles. Coordinate type, optical padding, icons, borders, subtle control shadows and state transitions. Preserve dimensions through pending states when appropriate. Avoid a wrapper layer that discards useful primitive props or forces all variants to one geometry.
- Use reduced-motion preferences and interruptible transitions where motion is justified. When checking dismissal, observe the settled state; a still frame during an exit animation is not a confirmed close failure.

## Evidence boundary

[Base UI accessibility guidance](https://base-ui.com/react/overview/accessibility) is a foundation, not certification of the product assembled from it. Test actual keyboard/focus, labels, contrast, responsive layout and the scoped task. Untitled UI's public implementation uses React Aria; transferring its visual relationships to Base UI requires deliberate composition, not pretending their component APIs are interchangeable.

Reference review: 2026-11-15. Package versions and API details can change; verify them at implementation time. This guidance recommends an option and does not require framework or primitive-library migration.
