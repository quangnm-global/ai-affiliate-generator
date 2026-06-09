"use client";

import { useEffect, useState } from "react";

import { canGenerate } from "@/lib/credits/check";

export function useCredits() {
  const [credits, setCredits] = useState<number | null>(null);
  const [canGen, setCanGen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/credits")
      .then((res) => res.json())
      .then((data) => {
        const balance = data.credits ?? 0;
        setCredits(balance);
        setCanGen(data.canGenerate ?? canGenerate(balance));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return { credits, canGenerate: canGen, loading };
}
