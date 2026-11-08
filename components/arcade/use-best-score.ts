"use client";

import { useCallback, useEffect, useState } from "react";

export function useBestScore(game: string) {
  const [best, setBest] = useState(0);
  const key = `jrc-arcade-best-${game}`;

  useEffect(() => {
    try {
      const previous = Number(window.localStorage.getItem(key));
      if (Number.isFinite(previous) && previous > 0) setBest(previous);
    } catch {
      // Browser storage is optional, including in private browsing.
    }
  }, [key]);

  const record = useCallback((score: number) => {
    setBest((current) => {
      if (score <= current) return current;
      try { window.localStorage.setItem(key, String(score)); } catch { /* optional */ }
      return score;
    });
  }, [key]);

  return { best, record };
}
