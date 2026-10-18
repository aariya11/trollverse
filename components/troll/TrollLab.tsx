"use client";

import { useMemo, useState } from "react";
import { useToast } from "@/components/ui/Toast";
import { useSound } from "@/components/providers/SoundProvider";
import { copyText } from "@/lib/clipboard";
import { buildShareLink, type SharePayload } from "@/lib/share";
import { buildAwardPayload, buildCardPayload, buildDramaPayload, buildLoadPayload, buildQuizPayload } from "@/lib/troll";
import { unlock } from "@/lib/achievements";
import { mulberry32, pick } from "@/lib/rng";
import {
  AWARD_TITLES,
  COMPLIMENT_SIGNATURES,
  COMPLIMENT_TEMPLATES,
  DRAW_PROMPTS,
  FINALE_REVEALS,
  HYPOTHETICALS,
  LOADING_MESSAGES,
  QUIZ_PACKS,
  WOULD_YOU_RATHER,
  generateAward,
  generateScenario,
} from "@/lib/content";
import { QuizRunner } from "@/components/quiz/QuizRunner";
import { Chip } from "@/components/ui/Bits";

type Tab = "load" | "award" | "drama" | "quiz" | "card";

const TABS: Array<{ id: Tab; label: string; blurb: string }> = [
  { id: "load", label: "Fake loading", blurb: "A dramatic loading screen that ends in a reveal." },
  { id: "award", label: "Silly award", blurb: "An official-looking certificate for a friend." },
  { id: "drama", label: "Breaking news", blurb: "Turn anything into a news broadcast." },
  { id: "quiz", label: "Absurd quiz", blurb: "Six ridiculous questions, one weird verdict." },
  { id: "card", label: "Reveal card", blurb: "A message hidden behind a tap-to-open card." },
];

function random<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="label-mono text-ink-soft">{label}</span>
      <span className="mt-1.5 block">{children}</span>
      {hint ? <span className="mt-1 block text-xs text-ink-faint">{hint}</span> : null}
    </label>
  );
}

function LinkActions({
  build,
  extraNote,
}: {
  build: () => SharePayload | null;
  extraNote?: string;
}) {
  const toast = useToast();
  const sound = useSound();
  const [link, setLink] = useState<string | null>(null);

  const ensureLink = (): string | null => {
    const payload = build();
    if (!payload) return null;
    const next = buildShareLink(payload);
    setLink(next);
    return next;
  };

  const onCopy = async () => {
    const next = ensureLink();
    if (!next) return;
    const ok = await copyText(next);
    if (ok) {
      unlock("prankster");
      sound.play("pop");
      toast.push({
        title: "Prank link copied",
        desc: "Send it to your target. It works with zero setup on their end.",
        tone: "success",
      });
    } else {
      toast.push({ title: "Couldn't copy the link", desc: "Your browser blocked clipboard access — try the manual copy field below.", tone: "warn" });
    }
  };

  const onOpen = () => {
    const next = ensureLink();
    if (!next) return;
    unlock("prankster");
    window.location.assign(next);
  };

  const longLink = link !== null && link.length > 5500;

  return (
    <div className="mt-5">
      <div className="flex flex-wrap gap-3">
        <button type="button" className="btn btn-sm btn-primary" onClick={onCopy}>
          Copy prank link
        </button>
        <button type="button" className="btn btn-sm btn-paper" onClick={onOpen}>
          Open in this tab
        </button>
      </div>
      {link ? (
        <div className="mt-3">
          <label className="label-mono text-ink-faint" htmlFor="manual-link">
            Manual copy (in case the clipboard is shy)
          </label>
          <input
            id="manual-link"
            readOnly
            value={link}
            onFocus={(event) => event.currentTarget.select()}
            className="input mt-1 font-mono text-xs"
          />
          {longLink ? (
            <p className="mt-1 text-xs text-rose-deep">
              Heads up: this link is long because the whole prank travels inside it. Chat apps handle it fine.
            </p>
          ) : null}
        </div>
      ) : null}
      {extraNote ? <p className="mt-2 text-xs text-ink-faint">{extraNote}</p> : null}
    </div>
  );
}

const PREVIEW_SHELL =
  "rounded-3xl border-2 border-ink bg-paper p-5";
const PREVIEW_SHADOW = { boxShadow: "4px 4px 0 0 var(--color-ink)" } as const;

function LoadCreator() {
  const [to, setTo] = useState("");
  const [stepsText, setStepsText] = useState(() =>
    Array.from({ length: 6 }, () => random(LOADING_MESSAGES)).join("\n"),
  );
  const [finaleTitle, setFinaleTitle] = useState("GOTCHA — that was a prank loading screen");
  const [finaleBody, setFinaleBody] = useState(
    "Nothing was actually loading. No files, no downloads, no secrets. Just a joke with premium pacing.",
  );

  const steps = stepsText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 10);

  const shuffle = () => {
    setStepsText(Array.from({ length: 6 }, () => random(LOADING_MESSAGES)).join("\n"));
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className={PREVIEW_SHELL} style={PREVIEW_SHADOW}>
        <p className="label-mono text-rose-deep">Compose</p>
        <div className="mt-4 space-y-4">
          <Field label="Victim's name" hint="Shown at the start: 'Preparing something for NAME…'">
            <input className="input" value={to} onChange={(e) => setTo(e.target.value)} placeholder="Alex" maxLength={40} />
          </Field>
          <Field label="Loading steps (one per line, max 10)" hint="Keep them absurd. Real system names are banned, obviously.">
            <textarea className="input min-h-32" value={stepsText} onChange={(e) => setStepsText(e.target.value)} />
          </Field>
          <div className="flex gap-2">
            <button type="button" className="btn btn-sm btn-sage" onClick={shuffle}>
              Shuffle steps
            </button>
          </div>
          <Field label="Final reveal title">
            <input className="input" value={finaleTitle} onChange={(e) => setFinaleTitle(e.target.value)} maxLength={80} />
          </Field>
          <Field label="Final reveal message">
            <textarea className="input min-h-20" value={finaleBody} onChange={(e) => setFinaleBody(e.target.value)} maxLength={280} />
          </Field>
        </div>
        <LinkActions
          build={() =>
            steps.length >= 2 ? buildLoadPayload({ to: to || "friend", steps, finaleTitle, finaleBody }) : null
          }
          extraNote="The loading screen takes about 12 seconds, has a skip button, and ends with confetti. It never downloads anything."
        />
      </div>

      <div>
        <p className="label-mono mb-3 text-ink-faint">Preview</p>
        <div className="rounded-2xl border-2 border-ink bg-ink p-5 text-cream">
          <p className="font-mono text-xs text-cream/70">
            TROLLVERSE PRANK LOADER — preparing something for {to || "a friend"}…
          </p>
          <div className="mt-4 h-3 overflow-hidden rounded-full border border-cream/30 bg-cream/10">
            <div className="h-full w-1/3 bg-rose" />
          </div>
          <ul className="mt-4 space-y-1.5">
            {steps.slice(0, 4).map((step, index) => (
              <li key={`${step}-${index}`} className="flex items-center gap-2 font-mono text-xs text-cream/75">
                <span className="text-sage">✓</span> {step}
              </li>
            ))}
            {steps.length > 4 ? <li className="font-mono text-xs text-cream/50">…and more nonsense</li> : null}
          </ul>
          <p className="mt-4 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-rose">
            then: {finaleTitle || "the reveal"}
          </p>
        </div>
      </div>
    </div>
  );
}

function AwardCreator() {
  const [to, setTo] = useState("");
  const [award, setAward] = useState("");
  const [reason, setReason] = useState("");
  const [from, setFrom] = useState("");

  const roll = (rng = mulberry32(Math.floor(Math.random() * 2 ** 31))) => {
    const generated = generateAward(rng, to || undefined);
    setAward(generated.award);
    setReason(generated.reason);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className={PREVIEW_SHELL} style={PREVIEW_SHADOW}>
        <p className="label-mono text-rose-deep">Compose</p>
        <div className="mt-4 space-y-4">
          <Field label="Who gets the award?">
            <input className="input" value={to} onChange={(e) => setTo(e.target.value)} placeholder="The friend who deserves recognition" maxLength={40} />
          </Field>
          <Field label="Award title" hint="Classics: Professional Overthinker, CEO of Doing Nothing…">
            <input className="input" value={award} onChange={(e) => setAward(e.target.value)} placeholder={random(AWARD_TITLES)} maxLength={70} />
          </Field>
          <Field label="Citation (the reason)">
            <textarea className="input min-h-24" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="for answering 'almost done' for six consecutive business days" maxLength={280} />
          </Field>
          <Field label="Awarded by (optional)">
            <input className="input" value={from} onChange={(e) => setFrom(e.target.value)} placeholder="a secret admirer of your process" maxLength={40} />
          </Field>
          <button type="button" className="btn btn-sm btn-sage" onClick={() => roll()}>
            Generate a full award
          </button>
        </div>
        <LinkActions
          build={() => (award.trim() ? buildAwardPayload({ to, award, reason, from }) : null)}
          extraNote="The award is a certificate page with a tap-to-claim reveal and a downloadable PNG."
        />
      </div>

      <div>
        <p className="label-mono mb-3 text-ink-faint">Preview</p>
        <div className="rounded-2xl border-2 border-ink bg-blush p-6 text-center">
          <p className="label-mono text-rose-deep">Official-ish certificate</p>
          <p className="mt-3 text-sm text-ink-soft">This document certifies that</p>
          <p className="font-display text-2xl font-extrabold text-rose-deep">{to || "A Legend, Unnamed"}</p>
          <p className="mt-2 text-lg font-bold">{award || "Certified Snack Inspector"}</p>
          <p className="mt-2 text-sm text-ink-soft">{reason || "for services to the group chat that cannot be disclosed at this time."}</p>
          <p className="mt-4 font-mono text-xs text-ink-faint">
            {from ? `Awarded by ${from}` : "Awarded by an anonymous menace"}
          </p>
        </div>
      </div>
    </div>
  );
}

function DramaCreator() {
  const [headline, setHeadline] = useState(() => generateScenario(mulberry32(Math.floor(Math.random() * 2 ** 31))).headline);
  const [scenario, setScenario] = useState(() => generateScenario(mulberry32(Math.floor(Math.random() * 2 ** 31))));

  const roll = () => {
    const next = generateScenario(mulberry32(Math.floor(Math.random() * 2 ** 31)));
    setScenario(next);
    setHeadline(next.headline);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className={PREVIEW_SHELL} style={PREVIEW_SHADOW}>
        <p className="label-mono text-rose-deep">Compose</p>
        <div className="mt-4 space-y-4">
          <p className="text-sm text-ink-soft">
            The generator writes a full fake news broadcast. Tweak the headline, roll again, send
            it as a breaking-news page. Entirely fictional, completely harmless.
          </p>
          <Field label="Headline (editable)">
            <textarea className="input min-h-20" value={headline} onChange={(e) => setHeadline(e.target.value)} maxLength={180} />
          </Field>
          <button type="button" className="btn btn-sm btn-sage" onClick={roll}>
            Roll a different story
          </button>
          <div className="rounded-2xl border-2 border-dashed border-ink/20 bg-cream px-4 py-3 text-xs text-ink-soft">
            <p><strong>Context:</strong> {scenario.sub}</p>
            <p className="mt-2"><strong>Quote:</strong> {scenario.quote}</p>
          </div>
        </div>
        <LinkActions
          build={() =>
            buildDramaPayload({ ...scenario, headline: headline.trim() || scenario.headline })
          }
          extraNote="The news page includes a download button so your friend can frame it forever."
        />
      </div>

      <div>
        <p className="label-mono mb-3 text-ink-faint">Preview</p>
        <div className="rounded-2xl border-2 border-ink bg-ink p-6 text-cream">
          <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-rose">
            <span className="h-2 w-2 animate-blink rounded-full bg-rose" /> {scenario.kicker}
          </p>
          <p className="mt-3 font-display text-2xl font-bold leading-snug">{headline}</p>
          <p className="mt-3 text-sm text-cream/75">{scenario.sub}</p>
          <p className="mt-3 text-sm text-sage">{scenario.quote}</p>
          <p className="mt-4 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-cream/50">
            {scenario.byline}
          </p>
        </div>
      </div>
    </div>
  );
}

function QuizCreator() {
  const [packId, setPackId] = useState(QUIZ_PACKS[0].id);
  const [playing, setPlaying] = useState(false);
  const [got, setGot] = useState<number | null>(null);
  const [to, setTo] = useState("");

  const pack = useMemo(() => QUIZ_PACKS.find((entry) => entry.id === packId) ?? QUIZ_PACKS[0], [packId]);
  const result = got !== null ? pack.results[got] : null;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className={PREVIEW_SHELL} style={PREVIEW_SHADOW}>
        <p className="label-mono text-rose-deep">Compose</p>
        <div className="mt-4 space-y-4">
          <div>
            <span className="label-mono text-ink-soft">Pick a quiz</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {QUIZ_PACKS.map((entry) => (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => {
                    setPackId(entry.id);
                    setGot(null);
                    setPlaying(false);
                  }}
                  className={`chip transition-colors ${packId === entry.id ? "bg-ink text-cream" : "bg-paper hover:bg-blush"}`}
                  aria-pressed={packId === entry.id}
                >
                  {entry.title}
                </button>
              ))}
            </div>
          </div>

          <p className="text-sm text-ink-soft">{pack.intro}</p>

          {!playing && got === null ? (
            <button type="button" className="btn btn-sm btn-primary" onClick={() => setPlaying(true)}>
              Play it yourself first
            </button>
          ) : null}

          {playing && got === null ? (
            <QuizRunner pack={pack} onDone={(index) => setGot(index)} />
          ) : null}

          {result ? (
            <div className="rounded-2xl border-2 border-ink bg-sage-tint px-4 py-3 text-sm">
              <strong>Your result:</strong> {result.title}. Your friend will see this in the share page and try to match it.
            </div>
          ) : null}

          <Field label="Challenge who?" >
            <input className="input" value={to} onChange={(e) => setTo(e.target.value)} placeholder="Sam" maxLength={40} />
          </Field>
        </div>
        <LinkActions
          build={() => (got !== null ? buildQuizPayload({ pack: packId, to, got }) : null)}
          extraNote="They get the same quiz and a friendly comparison at the end. Rivalry guaranteed."
        />
      </div>

      <div>
        <p className="label-mono mb-3 text-ink-faint">How the prank plays</p>
        <div className="space-y-3">
          {["You send the link: 'Sam, quick, take this'", "They answer six ridiculous questions", "The page compares results and declares a winner", "Friendship survives, barely"].map((line, index) => (
            <div key={line} className="flex items-start gap-3 rounded-2xl border-2 border-ink/15 bg-paper px-4 py-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-blush font-mono text-xs font-bold">
                {index + 1}
              </span>
              <p className="text-sm text-ink-soft">{line}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CardCreator({ preset }: { preset?: string | null }) {
  const isCompliment = preset === "compliment";
  const [title, setTitle] = useState(isCompliment ? "A nice thing about you" : "");
  const [body, setBody] = useState("");
  const [extra, setExtra] = useState("");
  const [from, setFrom] = useState("");

  const shuffle = () => {
    if (isCompliment) {
      setTitle("A nice thing about you");
      setBody(random(COMPLIMENT_TEMPLATES));
      setExtra(`— ${random(COMPLIMENT_SIGNATURES)}`);
    } else {
      const rng = mulberry32(Math.floor(Math.random() * 2 ** 31));
      setTitle(pick(rng, ["Open when you need a laugh", "A message from the void", "Urgent: read immediately", "You have been selected"]));
      const mode = rng();
      if (mode < 0.34) setBody(pick(rng, HYPOTHETICALS));
      else if (mode < 0.67) {
        const pair = pick(rng, WOULD_YOU_RATHER);
        setBody(`Would you rather ${pair.a} — or ${pair.b}?`);
      } else setBody(`Draw this: ${pick(rng, DRAW_PROMPTS)}`);
      setExtra(random(FINALE_REVEALS));
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className={PREVIEW_SHELL} style={PREVIEW_SHADOW}>
        <p className="label-mono text-rose-deep">Compose</p>
        <div className="mt-4 space-y-4">
          <div className="flex flex-wrap gap-2">
            <Chip tone={isCompliment ? "sage" : "paper"}>{isCompliment ? "compliment card" : "standard card"}</Chip>
            <button type="button" className="btn btn-sm btn-sage" onClick={shuffle}>
              Shuffle an idea
            </button>
          </div>
          <Field label="Card title">
            <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Open when you need a laugh" maxLength={80} />
          </Field>
          <Field label="The message inside">
            <textarea className="input min-h-28" value={body} onChange={(e) => setBody(e.target.value)} placeholder="Something worth opening a card for…" maxLength={420} />
          </Field>
          <Field label="Small print (optional)">
            <input className="input" value={extra} onChange={(e) => setExtra(e.target.value)} placeholder="— a harmless internet stranger" maxLength={180} />
          </Field>
          <Field label="From (optional)">
            <input className="input" value={from} onChange={(e) => setFrom(e.target.value)} placeholder="leave empty to stay mysterious" maxLength={40} />
          </Field>
        </div>
        <LinkActions
          build={() =>
            body.trim()
              ? buildCardPayload({ title: title.trim() || "A message for you", body, extra, from, tone: isCompliment ? "compliment" : "note" })
              : null
          }
          extraNote="The recipient taps to open the card. Perfect for compliments, cursed questions and gentle nonsense."
        />
      </div>

      <div>
        <p className="label-mono mb-3 text-ink-faint">Preview</p>
        <div className={`rounded-2xl border-2 border-ink p-6 ${isCompliment ? "bg-sage-tint" : "bg-blush"}`}>
          <p className="label-mono text-rose-deep">{isCompliment ? "A nice thing" : "A card for you"}</p>
          <p className="mt-3 font-display text-2xl font-bold">{title || "Open when you need a laugh"}</p>
          <p className="mt-3 whitespace-pre-line text-sm text-ink-soft">
            {body || "Your message will appear here, hidden behind a tap-to-open animation on the real page."}
          </p>
          {extra ? <p className="mt-3 font-mono text-xs text-ink-faint">{extra}</p> : null}
          <p className="mt-4 font-mono text-xs text-ink-faint">
            {from ? `From ${from}` : "From a friend in the Trollverse"}
          </p>
        </div>
      </div>
    </div>
  );
}

export function TrollLab({ initialTab, template }: { initialTab?: string; template?: string | null }) {
  const initial = TABS.some((tab) => tab.id === initialTab) ? (initialTab as Tab) : "load";
  const [tab, setTab] = useState<Tab>(initial);
  const active = TABS.find((entry) => entry.id === tab) ?? TABS[0];

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Prank creators">
        {TABS.map((entry) => (
          <button
            key={entry.id}
            type="button"
            role="tab"
            aria-selected={tab === entry.id}
            onClick={() => setTab(entry.id)}
            className={`chip transition-colors ${tab === entry.id ? "bg-ink text-cream" : "bg-paper hover:bg-blush"}`}
          >
            {entry.label}
          </button>
        ))}
      </div>

      <p className="mt-4 text-sm text-ink-soft">{active.blurb}</p>

      <div className="mt-6" role="tabpanel">
        {tab === "load" ? <LoadCreator /> : null}
        {tab === "award" ? <AwardCreator /> : null}
        {tab === "drama" ? <DramaCreator /> : null}
        {tab === "quiz" ? <QuizCreator /> : null}
        {tab === "card" ? <CardCreator key={template ?? "plain"} preset={template} /> : null}
      </div>
    </div>
  );
}
