"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { Glyph } from "./Glyph";

export interface ToastInput {
  title: string;
  desc?: string;
  tone?: "info" | "success" | "warn" | "achievement";
  glyph?: "star" | "spiral" | "blob" | "flower" | "zigzag" | "bolt" | "crown" | "orb";
}

interface ToastItem extends ToastInput {
  id: number;
  tone: "info" | "success" | "warn" | "achievement";
}

interface ToastContextValue {
  push: (toast: ToastInput) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return { push: () => undefined };
  }
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const counter = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const push = useCallback(
    (input: ToastInput) => {
      const id = ++counter.current;
      const toast: ToastItem = { ...input, id, tone: input.tone ?? "info" };
      setToasts((prev) => [...prev.slice(-2), toast]);
      const ttl = toast.tone === "achievement" ? 6000 : 4200;
      window.setTimeout(() => dismiss(id), ttl);
    },
    [dismiss],
  );

  const value = useMemo(() => ({ push }), [push]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        aria-label="Notifications"
        className="pointer-events-none fixed inset-x-3 bottom-3 z-[70] flex flex-col items-center gap-2 sm:inset-x-auto sm:right-5 sm:bottom-5 sm:items-end"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto w-full max-w-sm rounded-2xl border-2 border-ink px-4 py-3 animate-rise ${
              toast.tone === "achievement"
                ? "bg-blush"
                : toast.tone === "success"
                  ? "bg-sage-tint"
                  : toast.tone === "warn"
                    ? "bg-rose-tint"
                    : "bg-paper"
            }`}
            style={{ boxShadow: "4px 4px 0 0 var(--color-ink)" }}
          >
            <div className="flex items-start gap-3">
              {toast.tone === "achievement" ? (
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-rose">
                  <Glyph name={toast.glyph ?? "star"} className="h-4 w-4" />
                </span>
              ) : null}
              <div className="min-w-0">
                <p className="font-display text-sm font-bold">
                  {toast.tone === "achievement" ? "Achievement unlocked! " : ""}
                  {toast.title}
                </p>
                {toast.desc ? <p className="mt-0.5 text-xs leading-relaxed text-ink-soft">{toast.desc}</p> : null}
              </div>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                aria-label="Dismiss notification"
                className="ml-auto -mr-1 -mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-base font-bold text-ink-soft transition-colors hover:bg-cream hover:text-ink"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
