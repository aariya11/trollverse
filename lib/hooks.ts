"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { readStore, writeStore, STORE_PREFIX } from "./storage";

const emptySubscribe = () => () => {};

export function useMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

export function useStoredState<T>(
  key: string,
  initial: T,
): [T, (value: T | ((prev: T) => T)) => void, boolean] {
  const [value, setValue] = useState<T>(initial);
  const [ready, setReady] = useState(false);
  const initialRef = useRef(initial);

  useEffect(() => {
    setValue(readStore(key, initialRef.current));
    setReady(true);
  }, [key]);

  useEffect(() => {
    const onChange = (event: Event) => {
      const detail = (event as CustomEvent<{ key: string }>).detail;
      if (detail && (detail.key === key || detail.key === "*")) {
        setValue(readStore(key, initialRef.current));
      }
    };
    window.addEventListener("trollverse:store", onChange);
    return () => window.removeEventListener("trollverse:store", onChange);
  }, [key]);

  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved = typeof next === "function" ? (next as (p: T) => T)(prev) : next;
        writeStore(key, resolved);
        return resolved;
      });
    },
    [key],
  );

  return [value, set, ready];
}

export function useReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query],
  );
  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);
  const getServerSnapshot = useCallback(() => false, []);
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function useSecretWord(word: string, onMatch: () => void): void {
  const bufferRef = useRef("");
  const callbackRef = useRef(onMatch);

  useEffect(() => {
    callbackRef.current = onMatch;
  });

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) {
        return;
      }
      if (event.key.length !== 1) return;
      bufferRef.current = (bufferRef.current + event.key.toLowerCase()).slice(-word.length);
      if (bufferRef.current === word.toLowerCase()) {
        bufferRef.current = "";
        callbackRef.current();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [word]);
}

export function subscribeToStoreKey(key: string, callback: () => void): () => void {
  const onStore = (event: Event) => {
    const detail = (event as CustomEvent<{ key: string }>).detail;
    if (!detail || detail.key === key || detail.key === "*" || detail.key.startsWith(STORE_PREFIX)) {
      callback();
    }
  };
  window.addEventListener("trollverse:store", onStore);
  window.addEventListener("storage", onStore);
  return () => {
    window.removeEventListener("trollverse:store", onStore);
    window.removeEventListener("storage", onStore);
  };
}

/**
 * Reads client-only data (localStorage, generated content) in an SSR-safe way.
 * Returns the fallback during server rendering and the first client render,
 * then the live value — and stays in sync via the trollverse store events.
 * The read function must be deterministic; its result is cached by JSON equality.
 */
export function useClientValue<T>(read: () => T, fallback: () => T): T {
  const readRef = useRef(read);
  const fallbackRef = useRef(fallback);
  const cacheRef = useRef<{ json: string; value: T } | null>(null);
  const serverValueRef = useRef<{ value: T } | null>(null);

  useEffect(() => {
    readRef.current = read;
    fallbackRef.current = fallback;
  });

  const getSnapshot = useCallback(() => {
    let value: T;
    let json: string;
    try {
      value = readRef.current();
      json = JSON.stringify(value) ?? "undefined";
    } catch {
      value = fallbackRef.current();
      json = `__fallback_${cacheRef.current === null ? 0 : 1}`;
    }
    if (cacheRef.current === null || cacheRef.current.json !== json) {
      cacheRef.current = { json, value };
    }
    return cacheRef.current.value;
  }, []);

  const getServerSnapshot = useCallback(() => {
    if (serverValueRef.current === null) {
      serverValueRef.current = { value: fallbackRef.current() };
    }
    return serverValueRef.current.value;
  }, []);

  const subscribe = useCallback(
    (onChange: () => void) => subscribeToStoreKey("*", onChange),
    [],
  );

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
