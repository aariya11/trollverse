"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/Toast";
import { useSound } from "@/components/providers/SoundProvider";
import { copyText } from "@/lib/clipboard";
import { buildShareLink } from "@/lib/share";
import { buildCardPayload, buildDramaPayload } from "@/lib/troll";
import { saveItem } from "@/lib/saves";
import { readStore, writeStore, STORE_KEYS } from "@/lib/storage";

export interface FeedItem {
  id: string;
  kind: "joke" | "poll" | "drama" | "prompt" | "challenge";
  category: string;
  title: string;
  body: string;
  extra?: string;
  punchline?: string;
  options?: [string, string];
  scenario?: { kicker: string; headline: string; sub: string; quote: string; byline: string };
  prompt?: string;
}

const chipTone: Record<FeedItem["kind"], string> = {
  joke: "bg-rose",
  poll: "bg-sage",
  drama: "bg-blush-deep",
  prompt: "bg-rose-tint",
  challenge: "bg-sage-tint",
};

export function FeedCard({ item }: { item: FeedItem }) {
  const [revealed, setRevealed] = useState(false);
  const [picked, setPicked] = useState<null | 0 | 1>(null);
  const [savedNow, setSavedNow] = useState(false);
  const toast = useToast();
  const sound = useSound();

  const shareLink = (): string => {
    if (item.kind === "drama" && item.scenario) {
      return buildShareLink(buildDramaPayload(item.scenario));
    }
    if (item.kind === "poll" && item.options) {
      return buildShareLink(
        buildCardPayload({
          title: "Would you rather",
          body: `Would you rather ${item.options[0]} —\n\nor ${item.options[1]}?`,
          extra: "No third option. That's the rule.",
        }),
      );
    }
    if (item.kind === "prompt" && item.prompt) {
      return buildShareLink(
        buildCardPayload({
          title: "Drawing challenge",
          body: item.prompt,
          extra: "Draw it badly, proudly, and immediately.",
        }),
      );
    }
    if (item.kind === "challenge") {
      return buildShareLink(
        buildCardPayload({
          title: "A challenge for you",
          body: item.body,
          extra: "Do it, then report back. — the Trollverse",
        }),
      );
    }
    return buildShareLink(
      buildCardPayload({
        title: "Joke delivery",
        body: item.punchline ? `${item.body}\n\n${item.punchline}` : item.body,
      }),
    );
  };

  const onCopy = async () => {
    const ok = await copyText(shareLink());
    sound.play(ok ? "pop" : "boop");
    toast.push(
      ok
        ? { title: "Share link copied", desc: "Paste it anywhere. The chaos is portable.", tone: "success" }
        : { title: "Couldn't copy automatically", desc: "Your browser blocked clipboard access — copy from the share pages instead.", tone: "warn" },
    );
  };

  const onSave = () => {
    const result = saveItem({
      id: item.id,
      kind: item.kind,
      category: item.category,
      title: item.title,
      body: item.body,
      extra: item.extra,
    });
    if (result === "saved") {
      setSavedNow(true);
      sound.play("tick");
      toast.push({ title: "Saved to your stash", desc: "Find it on your profile page.", tone: "success" });
    } else if (result === "exists") {
      toast.push({ title: "Already in your stash", desc: "Great taste, twice.", tone: "info" });
    } else {
      toast.push({ title: "Stash is full", desc: "Remove a few saves on your profile to make room.", tone: "warn" });
    }
  };

  const onPick = (index: 0 | 1) => {
    setPicked(index);
    sound.play("click");
    const reactions = readStore<Record<string, number>>(STORE_KEYS.reactions, {});
    reactions[item.id] = index;
    writeStore(STORE_KEYS.reactions, reactions);
  };

  return (
    <article className="flex h-full flex-col rounded-3xl border-2 border-ink bg-paper p-5" style={{ boxShadow: "3px 3px 0 0 var(--color-ink)" }}>
      <header className="mb-3 flex items-center gap-2">
        <span className={`chip border-ink ${chipTone[item.kind]}`}>{item.category}</span>
        <span className="label-mono text-ink-faint">house content</span>
      </header>

      <h3 className="text-lg leading-snug">{item.title}</h3>
      <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink-soft">{item.body}</p>

      {item.kind === "joke" && item.punchline ? (
        <div className="mt-3">
          {revealed ? (
            <p className="rounded-2xl border-2 border-dashed border-sage-deep/40 bg-sage-tint px-4 py-3 text-sm font-semibold animate-pop">
              {item.punchline}
            </p>
          ) : (
            <button
              type="button"
              onClick={() => {
                setRevealed(true);
                sound.play("drumroll");
              }}
              className="btn btn-sm btn-sage"
            >
              Reveal punchline
            </button>
          )}
        </div>
      ) : null}

      {item.kind === "poll" && item.options ? (
        <div className="mt-3 grid gap-2">
          {item.options.map((option, index) => (
            <button
              key={option}
              type="button"
              onClick={() => onPick(index as 0 | 1)}
              className={`rounded-2xl border-2 px-3.5 py-2.5 text-left text-sm font-semibold transition-colors ${
                picked === index ? "border-ink bg-blush" : "border-ink/25 bg-cream hover:border-ink hover:bg-blush/60"
              }`}
              aria-pressed={picked === index}
            >
              {option}
            </button>
          ))}
          <p className="text-xs text-ink-faint">
            {picked !== null
              ? "Saved in this browser only — community voting arrives with accounts."
              : "Pick one. It saves locally, no sign-up needed."}
          </p>
        </div>
      ) : null}

      {item.extra ? <p className="mt-3 font-mono text-xs text-ink-faint">{item.extra}</p> : null}

      <footer className="mt-auto flex flex-wrap items-center gap-2 pt-4">
        {item.kind === "prompt" && item.prompt ? (
          <a href={`/draw?prompt=${encodeURIComponent(item.prompt)}`} className="btn btn-sm btn-primary">
            Draw it now
          </a>
        ) : null}
        {item.kind === "challenge" ? (
          <a href="/daily" className="btn btn-sm btn-primary">
            Open in Daily
          </a>
        ) : null}
        <button type="button" onClick={onCopy} className="btn btn-sm btn-paper">
          Copy link
        </button>
        <button type="button" onClick={onSave} className="btn btn-sm btn-ghost" disabled={savedNow}>
          {savedNow ? "Saved ✓" : "Save"}
        </button>
      </footer>
    </article>
  );
}
