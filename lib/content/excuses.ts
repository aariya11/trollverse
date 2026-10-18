import { pick, type Rng } from "../rng";

const OPENERS: readonly string[] = [
  "Sorry I'm late —",
  "Look, about yesterday —",
  "I can't come in today because",
  "Quick update: I'll be slightly delayed because",
  "You will not believe this, but",
  "Not making excuses, but",
  "The situation is under control, except",
];

const ACTIVITIES: readonly string[] = [
  "I was trapped in a very polite argument with a door",
  "my neighbor's cat appointed me as its emotional translator",
  "I was on hold with a company that may not exist",
  "a pigeon and I had a stare-down and I lost respectably",
  "I got 94% through reorganizing my socks by emotional value",
  "I was assisting a friend with extremely urgent soup",
  "my headphones unionized and refused to play anything upbeat",
  "I was waiting for a phone update that kept promising to be back in five minutes",
  "I was negotiating with a stubborn jar lid on a matter of principle",
  "my smart speaker misunderstood me and started a tiny rebellion",
  "I was reverse-engineering the snacks in my pantry",
  "an escalator and I disagreed about direction",
  "I was helping a spider relocate to better opportunities",
  "I found a playlist from 2009 and had to lie down",
  "I was stuck applauding a microwave that deserved it",
];

const REASONS: readonly string[] = [
  "and the universe insisted we finish the conversation",
  "and honestly, I'd do it again",
  "which took exactly as long as it sounds",
  "and I stand by every minute of it",
  "because someone has to set boundaries with technology",
  "and the bus simply feared me",
  "which is technically a wellness activity",
  "because my horoscope said 'not today, and you know it'",
  "and I'm legally required to finish what I start, probably",
  "because closure matters, even for socks",
  "and I refuse to explain further in writing",
  "which felt important at the time and still does",
];

const SIGN_OFFS: readonly string[] = [
  "Thank you for your understanding.",
  "I trust this clears everything up.",
  "Please forward this to whoever asks.",
  "Do not fact-check the details.",
  "I will not be taking questions.",
  "This message is retroactively sincere.",
];

export function generateExcuse(rng: Rng): { title: string; body: string; extra: string } {
  const opener = pick(rng, OPENERS);
  const activity = pick(rng, ACTIVITIES);
  const reason = pick(rng, REASONS);
  const signOff = pick(rng, SIGN_OFFS);

  const body =
    opener.endsWith("because") || opener === "The situation is under control, except"
      ? `${opener} ${activity}, ${reason} ${signOff}`
      : `${opener} ${activity} ${reason} ${signOff}`;

  return {
    title: "Official Statement",
    body: body.replace(/\s+/g, " ").trim(),
    extra: "Suitable for group chats, calendar invites, and gentle accountability.",
  };
}
