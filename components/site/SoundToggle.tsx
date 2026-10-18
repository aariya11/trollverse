"use client";

import { useSound } from "@/components/providers/SoundProvider";
import { useMounted } from "@/lib/hooks";

export function SoundToggle({ className = "" }: { className?: string }) {
  const { enabled, toggle } = useSound();
  const mounted = useMounted();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={mounted ? enabled : false}
      aria-label={mounted && enabled ? "Turn sound effects off" : "Turn sound effects on"}
      title={mounted && enabled ? "Sound on" : "Sound off"}
      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 border-ink transition-colors ${
        mounted && enabled ? "bg-sage" : "bg-paper hover:bg-cream-deep"
      } ${className}`}
      style={{ boxShadow: "2px 2px 0 0 var(--color-ink)" }}
    >
      <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M11 5L6 9H3v6h3l5 4z" fill="currentColor" stroke="none" />
        {mounted && enabled ? (
          <>
            <path d="M15.5 8.5a5 5 0 0 1 0 7" />
            <path d="M18.5 6a9 9 0 0 1 0 12" />
          </>
        ) : (
          <path d="M16 9l6 6M22 9l-6 6" />
        )}
      </svg>
    </button>
  );
}
