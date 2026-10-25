# Maintenance guide

## Scope and safeguards

- This is a fictional Portuguese-language portfolio demo, not a real bakery or ordering system.
- Preserve the visible fictional-identity, illustrative-price, AI-image and no-order/no-data-collection disclosures.
- Do not add customer names, contact details, private research, commercial proposals, conversation URLs, secrets or account screenshots.
- Do not introduce APIs, analytics, cookies, storage, external font requests, payment flows or real message sending without explicit authorization and a separate privacy/security review.
- Do not publish, create external resources, modify account settings or reuse the owner's hosting project for another deployment without authorization.
- Do not assign a new license to the project's code without the owner's decision. Preserve the bundled Inter font license unchanged.

## Implementation

- Requires Node.js >=20; no dependency installation is necessary.
- Edit `src/`; run `npm run check` to regenerate `dist/` and test.
- Keep `dist/` versioned and do not delete it before building: its image/font files are preserved build inputs.
- Keep the entire menu readable without JavaScript, all app resources local, and existing CSP restrictions intact.
- Preserve accent-insensitive filters, empty-state recovery, native date/number validation, keyboard navigation, dialog focus return, optional local copying and reduced-motion behavior.
- `.openai/hosting.json` identifies the owner's existing project, not a credential. Preserve it for authorized updates of that original project. A separate fork requires its own authorized hosting configuration and corresponding test expectations.
- Deployment assumes `dist/` at the domain root; absolute `/assets/` paths do not support subdirectory hosting without adaptation.

## Verification and documentation

- Run `npm run check` after changes. Compare the generated files with the intended source changes.
- For UI or interaction changes, verify desktop/tablet/mobile, keyboard flows, repeated actions, interrupted input, close/reopen and copy failure in a real browser.
- Record actual tested runtime, viewports and outcomes in `docs/QA.md`; distinguish automated checks from browser observations.
- Never mark pending browser QA or public availability as passed based only on static tests or older screenshots.
- Keep README commands portable: label shell-specific environment-variable examples, including PowerShell.
- Review any new asset's provenance and redistribution terms before including it.
