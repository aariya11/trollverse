# Security Policy

## Reporting

If you believe you have found a security issue, please report it via the process described on `/report` or open an issue in the project tracker. Please do not publicly disclose an issue before it has been addressed.

## Design: where the risk surface is (and mostly isn't)

TROLLVERSE is a static, client-only site. There is no server-side database, no authentication, no user accounts, and no user-generated content stored anywhere.

The only untrusted input the site ever processes is a **share-link payload**: an encoded JSON blob in the `?d=` query parameter of `/t/*` pages. Defenses applied to it (see `lib/share.ts`):

- **Strict size caps**: `MAX_ENCODED_LENGTH` (8,000 chars) and `MAX_DECODED_LENGTH` (16,000 chars) before any allocation-heavy processing.
- **Schema validation**: payloads must match one of five known shapes with a matching version (`v: 1`); anything else renders a "broken link" screen.
- **Sanitization**: control characters are stripped, whitespace-trimmed, and every field is length-capped before display.
- **No code execution**: payloads are rendered exclusively through React's escaped text nodes — never `dangerouslySetInnerHTML`, never `eval`.
- **Closed enums**: tone, quiz pack ids, quiz scores and other categorical fields are validated against known values.

Uploaded images are processed entirely in the browser (canvas), validated for type and size, and are never transmitted anywhere.

## Local data

All persistence uses `localStorage` under the `trollverse:v1:` prefix. You can wipe it from `/profile` → danger zone, or from `/cookie-preferences`.

## Dependency audit

`npm audit` currently reports 5 high-severity advisories that are **all in dev-only tooling** (transitive dependencies of `eslint-config-next`). They are not part of the production bundle or runtime. They will be resolved by upstream dependency updates; re-run `npm audit` after upgrades to confirm.

## Supported versions

The project ships continuously from the main branch; only the latest revision is supported.
