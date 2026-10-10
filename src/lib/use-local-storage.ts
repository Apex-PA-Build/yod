"use client";

import { useCallback, useSyncExternalStore } from "react";

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function read(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

/**
 * A localStorage-backed value that stays in sync across tabs. Matches the
 * `useStorage` signature that convex-helpers' SessionProvider expects.
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const raw = useSyncExternalStore(
    subscribe,
    () => read(key),
    () => null,
  );
  const value = raw === null ? initialValue : (JSON.parse(raw) as T);

  const setValue = useCallback(
    (next: T) => {
      try {
        window.localStorage.setItem(key, JSON.stringify(next));
      } catch {
        // Storage can be unavailable (private mode); keep working in memory.
      }
      listeners.forEach((l) => l());
    },
    [key],
  );

  return [value, setValue] as const;
}
