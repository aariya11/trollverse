"use client";

import { useEffect } from "react";
import { ConfettiProvider, useConfetti } from "@/components/ui/Confetti";
import { ToastProvider, useToast } from "@/components/ui/Toast";
import { SoundProvider, useSound } from "./SoundProvider";
import { useSecretWord } from "@/lib/hooks";
import { unlock } from "@/lib/achievements";

function Effects() {
  const toast = useToast();
  const confetti = useConfetti();
  const sound = useSound();

  useEffect(() => {
    const onAchievement = (event: Event) => {
      const detail = (event as CustomEvent<{ id: string; name: string; description: string }>).detail;
      if (!detail) return;
      toast.push({
        title: detail.name,
        desc: detail.description,
        tone: "achievement",
        glyph: "star",
      });
      confetti.burst();
      sound.play("win");
    };
    window.addEventListener("trollverse:achievement", onAchievement);
    return () => window.removeEventListener("trollverse:achievement", onAchievement);
  }, [toast, confetti, sound]);

  useSecretWord("chaos", () => {
    const root = document.documentElement;
    root.classList.add("animate-shake");
    window.setTimeout(() => root.classList.remove("animate-shake"), 600);
    unlock("forbidden-word");
  });

  return null;
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ConfettiProvider>
      <SoundProvider>
        <ToastProvider>
          <Effects />
          {children}
        </ToastProvider>
      </SoundProvider>
    </ConfettiProvider>
  );
}
