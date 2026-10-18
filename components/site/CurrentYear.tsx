"use client";

import { useMounted } from "@/lib/hooks";

export function CurrentYear() {
  const mounted = useMounted();
  return <>{mounted ? new Date().getFullYear() : null}</>;
}
