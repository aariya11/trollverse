"use client";

import { createContext, useCallback, useContext, useEffect, useMemo } from "react";
import { readStore, writeStore, STORE_KEYS } from "@/lib/storage";
import { soundEngine, type SoundName } from "@/lib/sound";
import { unlock } from "@/lib/achievements";
import { useClientValue, useMounted } from "@/lib/hooks";

interface SoundContextValue {
  enabled: boolean;
  toggle: () => void;
  play: (name: SoundName) => void;
}

const SoundContext = createContext<SoundContextValue>({
  enabled: false,
  toggle: () => undefined,
  play: () => undefined,
});

export function useSound(): SoundContextValue {
  return useContext(SoundContext);
}

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const enabled = useClientValue<boolean>(() => readStore(STORE_KEYS.sound, false), () => false);
  const ready = useMounted();

  useEffect(() => {
    soundEngine.enabled = enabled;
  }, [enabled]);

  const play = useCallback((name: SoundName) => {
    soundEngine.play(name);
  }, []);

  const toggle = useCallback(() => {
    const next = !readStore<boolean>(STORE_KEYS.sound, false);
    soundEngine.enabled = next;
    writeStore(STORE_KEYS.sound, next);
    if (next) {
      soundEngine.unlock();
      soundEngine.play("pop");
      unlock("sound-on");
    }
  }, []);

  const value = useMemo(() => ({ enabled, toggle, play }), [enabled, toggle, play]);

  return (
    <SoundContext.Provider value={value}>
      <span data-sound-ready={ready ? "true" : "false"} hidden />
      {children}
    </SoundContext.Provider>
  );
}
