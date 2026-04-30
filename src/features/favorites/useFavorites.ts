"use client";

import { useState, useCallback } from "react";

const STORAGE_KEY = "monstrino:favorites";

function readStorage(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeStorage(ids: string[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // localStorage unavailable (private mode, quota exceeded)
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(() => readStorage());

  const toggle = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id)
        ? prev.filter((v) => v !== id)
        : [...prev, id];
      writeStorage(next);
      return next;
    });
  }, []);

  const isFavorited = useCallback(
    (id: string) => favorites.includes(id),
    [favorites],
  );

  const clear = useCallback(() => {
    writeStorage([]);
    setFavorites([]);
  }, []);

  return { favorites, toggle, isFavorited, clear };
}
