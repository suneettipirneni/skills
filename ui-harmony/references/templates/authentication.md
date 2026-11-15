# Enter, recover and resume identity

Layer: **templates** · Route: `authentication`

**Use when:** Sign in, verify, recover access or return after session expiry.

**Avoid when:** General onboarding tasks after identity is already established.

## Decision and composition

Identify the stage: identity entry, credential challenge, verification, recovery or session return. Minimize uncertainty about the account and requested action. Preserve the user’s intended destination after success where authorized.

Use explicit labels, supported autofill/password-manager behavior, discoverable recovery and understandable verification instructions. Name the delivery channel without exposing unnecessary sensitive information. Present alternate methods without a wall of competing primary buttons.

## Behavior and adaptation

Handle wrong/expired code, resend availability, provider cancellation, session expiry and unavailable methods. Permit paste where appropriate; do not split OTP into inaccessible independent fields merely for appearance. Prevent accidental navigation loops and lost drafts after reauthentication.

## Evidence and repair

Test keyboard, autofill, paste, error recovery and return destination. Accessibility and security requirements need current specialist standards; this module does not certify authentication security.

**Worked decision:** A timed-out editor reauthenticates and returns to the saved draft rather than dropping the user on a generic home screen.

**Source boundary:** [WCAG accessible authentication](https://www.w3.org/WAI/WCAG22/Understanding/accessible-authentication-minimum.html) grounds cognitive-test requirements and exceptions. Auth implementation/security needs separate review.

## Route deeper only when relevant

- [Related fields and validation boundary](../organisms/form-section.md) — Capture identity or verification
- [State, error and recovery messages](../molecules/feedback.md) — Explain recovery and expiry
- [Actions, scope and commitment](../molecules/action-group.md) — Offer clear alternate methods

## Related context

- [Navigation and application frame](../organisms/app-shell.md) — Stable cross-screen navigation is part of this scope
