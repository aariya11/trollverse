# Moderation & Content Guidelines

TROLLVERSE is built to be the *harmless* kind of trolling. Moderation starts at design time: the product only allows content we'd be comfortable shipping.

## What this site can and cannot contain

- There is **no public feed, no comments, and no user-generated content stored on a server**. Everything you make stays in your browser or inside a link you deliberately share.
- Prank pages are entirely **generated from templates and template slots** (names of recipients, quiz scores). The site does not have free-form fields that render as anyone else's page content.
- One free-text field exists — the message body on a prank card — and it renders **only to whoever opens the link you send**.

This means moderation is mostly about the *content we author* plus the *rules we ask sharers to follow*.

## House rules (enforced in `/community-guidelines`)

1. Punch up or sideways, never down. No content targeting someone's identity, appearance, or vulnerabilities.
2. Prank the moment, not the person. The best pranks are ones the victim laughs at within seconds.
3. No pretending to be a real organization, emergency service, or person you're not.
4. No fake breaking news about real people, companies, or events.
5. No harassment-by-repetition: sending the same "prank" to someone who asked you to stop is not a prank.
6. Keep it recoverable. If the joke needs a second message to explain it wasn't real, send that second message.
7. No scams, phishing, or anything asking for money, credentials, or personal data.
8. Screenshots of prank pages are fine; editing them to misrepresent real events is not.

## Content we author

All jokes, hypotheticals, scenarios, awards, compliments and challenges shipped in `lib/content/` are written in-house, reviewed to avoid slurs, harassment, and cruelty, and labeled as fictional where they imitate media formats (e.g. the fake news format carried by `DramaPrank` always includes a fictional byline, and the award format is visibly absurd).

## Report flow

If a shared link or our own content breaks the rules above, use `/report`. Reports include: the link (or a screenshot), what happened, and when. Because share payloads live in URLs, a screenshot or the full link is very helpful — we cannot look up links after the fact, since nothing is stored server-side.

## Enforcement

For content in our own libraries: we fix or remove it in the next release. For shared links: nothing is hosted, so enforcement means updating the templates so the format cannot be abused (e.g. tightening free-text fields), and publishing clarification here when warranted.
