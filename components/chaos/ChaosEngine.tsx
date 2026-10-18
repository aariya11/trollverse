"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useToast } from "@/components/ui/Toast";
import { useSound } from "@/components/providers/SoundProvider";
import { Chip } from "@/components/ui/Bits";
import { copyText } from "@/lib/clipboard";
import { buildShareLink } from "@/lib/share";
import { buildCardPayload } from "@/lib/troll";
import { saveItem } from "@/lib/saves";
import { readStore, writeStore, STORE_KEYS } from "@/lib/storage";
import { unlock } from "@/lib/achievements";
import {
  CHAOS_CATEGORIES,
  accentClasses,
  spinChaos,
  type ChaosCategory,
  type ChaosResult,
} from "@/lib/chaos";

export function ChaosEngine({
  autoSpin = false,
  initialCategory = null,
}: {
  autoSpin?: boolean;
  initialCategory?: ChaosCategory | null;
}) {
  const [category, setCategory] = useState<ChaosCategory | "surprise">(initialCategory ?? "surprise");
  const [result, setResult] = useState<ChaosResult | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [saved, setSaved] = useState(false);
  const timerRef = useRef<number | null>(null);
  const toast = useToast();
  const sound = useSound();

  const spin = useCallback(
    (nextCategory?: ChaosCategory | "surprise") => {
      const target = nextCategory ?? category;
      setCategory(target);
      setSpinning(true);
      setSaved(false);
      sound.play("whoosh");

      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => {
        const next = spinChaos(target);
        setResult(next);
        setSpinning(false);
        sound.play("pop");

        const spins = readStore<number>(STORE_KEYS.spins, 0) + 1;
        writeStore(STORE_KEYS.spins, spins);
        if (spins >= 1) unlock("chaos-beginner");
        if (spins >= 25) unlock("randomness-enthusiast");
      }, 520);
    },
    [category, sound],
  );

  useEffect(() => {
    if (!autoSpin) return;
    const timeout = window.setTimeout(() => spin(), 60);
    return () => {
      window.clearTimeout(timeout);
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoSpin]);

  const onSave = () => {
    if (!result) return;
    const outcome = saveItem({
      id: result.id,
      kind: result.category,
      category: result.label,
      title: result.title,
      body: result.body,
      extra: result.extra,
    });
    if (outcome === "saved") {
      setSaved(true);
      toast.push({ title: "Saved to your stash", desc: "It will be waiting on your profile page.", tone: "success" });
    } else if (outcome === "exists") {
      toast.push({ title: "Already saved", desc: "The chaos remembers.", tone: "info" });
    } else {
      toast.push({ title: "Stash is full", desc: "Clear some space on your profile page first.", tone: "warn" });
    }
  };

  const onCopyText = async () => {
    if (!result) return;
    const text = `${result.title}\n\n${result.body}${result.extra ? `\n\n${result.extra}` : ""}`;
    const ok = await copyText(text);
    toast.push(
      ok
        ? { title: "Copied", desc: "Paste it into the group chat of your choice.", tone: "success" }
        : { title: "Couldn't copy", desc: "Clipboard access blocked by your browser.", tone: "warn" },
    );
  };

  const onCopyLink = async () => {
    if (!result) return;
    const link = buildShareLink(
      buildCardPayload({ title: result.title, body: result.body, extra: result.extra }),
    );
    const ok = await copyText(link);
    sound.play(ok ? "pop" : "boop");
    toast.push(
      ok
        ? { title: "Share link copied", desc: "It opens a pretty card page with your result.", tone: "success" }
        : { title: "Couldn't copy", desc: "Clipboard access blocked by your browser.", tone: "warn" },
    );
  };

  const accents = result ? accentClasses(result.accent) : accentClasses("rose");

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Chaos categories">
        <button
          type="button"
          onClick={() => spin("surprise")}
          className={`chip transition-colors ${category === "surprise" ? "bg-ink text-cream" : "bg-paper hover:bg-blush"}`}
          aria-pressed={category === "surprise"}
        >
          Surprise me
        </button>
        {CHAOS_CATEGORIES.map((entry) => (
          <button
            key={entry.id}
            type="button"
            onClick={() => spin(entry.id)}
            className={`chip transition-colors ${category === entry.id ? "bg-ink text-cream" : "bg-paper hover:bg-blush"}`}
            aria-pressed={category === entry.id}
          >
            {entry.label}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[auto_1fr]">
        <button
          type="button"
          onClick={() => spin()}
          disabled={spinning}
          className="group relative mx-auto flex h-40 w-40 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-rose text-center transition-transform duration-150 hover:-translate-y-1 active:translate-y-0 disabled:opacity-70 sm:h-48 sm:w-48"
          style={{ boxShadow: "6px 6px 0 0 var(--color-ink)" }}
          aria-label="Spin the chaos engine"
        >
          <span
            aria-hidden="true"
            className="absolute inset-3 rounded-full border-2 border-dashed border-ink/30 transition-transform duration-500 group-hover:rotate-45"
          />
          <span className="font-display text-xl font-extrabold uppercase tracking-wide">
            {spinning ? "Shuffling" : result ? "Spin again" : "Spin the chaos"}
          </span>
        </button>

        <div aria-live="polite" className="min-h-56">
          {spinning ? (
            <div
              className="flex h-full min-h-56 flex-col items-center justify-center rounded-3xl border-2 border-dashed border-ink/40 bg-paper/70 p-8 text-center"
            >
              <p className="animate-pulse-soft font-mono text-sm uppercase tracking-[0.16em] text-ink-soft">
                Consulting the gremlins…
              </p>
              <p className="mt-2 text-xs text-ink-faint">This is a real random generator, not a video.</p>
            </div>
          ) : result ? (
            <article
              key={result.id}
              className={`animate-pop rounded-3xl border-2 border-ink p-6 sm:p-8 ${accents.bg} ${accents.text}`}
              style={{ boxShadow: "6px 6px 0 0 var(--color-ink)" }}
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className={`chip border-current ${accents.chip} text-ink`}>{result.label}</span>
                <span className="label-mono opacity-60">seed {result.seed.toString(16).slice(0, 6)}</span>
              </div>
              <h2 className="mt-4 text-2xl sm:text-3xl">{result.title}</h2>
              <p className="mt-3 whitespace-pre-line text-[0.98rem] leading-relaxed">{result.body}</p>
              {result.extra ? <p className="mt-3 font-mono text-xs opacity-70">{result.extra}</p> : null}

              <div className="mt-6 flex flex-wrap gap-3">
                <button type="button" onClick={() => spin()} className="btn btn-sm btn-primary">
                  Try something else
                </button>
                <button type="button" onClick={onSave} className="btn btn-sm btn-paper" disabled={saved}>
                  {saved ? "Saved ✓" : "Save this"}
                </button>
                <button type="button" onClick={onCopyLink} className="btn btn-sm btn-paper">
                  Copy share link
                </button>
                <button type="button" onClick={onCopyText} className="btn btn-sm btn-ghost">
                  Copy as text
                </button>
              </div>
            </article>
          ) : (
            <div className="flex h-full min-h-56 flex-col items-center justify-center rounded-3xl border-2 border-dashed border-ink/40 bg-paper/70 p-8 text-center">
              <p className="font-display text-xl">Nothing loaded yet. That is the point.</p>
              <p className="mt-2 max-w-sm text-sm text-ink-soft">
                Hit the big rose button, or pick a category above. Every spin is generated fresh —
                you will not see the same nonsense twice in a row.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {CHAOS_CATEGORIES.map((entry) => (
          <div key={entry.id} className="flex items-start gap-3 rounded-2xl border-2 border-ink/15 bg-paper/60 px-4 py-3">
            <Chip tone="blush" className="mt-0.5 shrink-0">
              {entry.label}
            </Chip>
            <p className="text-xs leading-relaxed text-ink-soft">{entry.blurb}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
