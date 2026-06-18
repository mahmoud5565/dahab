"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import type { GoldPrices } from "@/types";
import { generateCurrentPrices } from "@/lib/goldData";

interface GoldContextValue {
  prices: GoldPrices | null;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  refresh: () => void;
  lastUpdated: Date | null;
}

const GoldContext = createContext<GoldContextValue>({
  prices: null,
  isLoading: true,
  isRefreshing: false,
  error: null,
  refresh: () => {},
  lastUpdated: null,
});

export function GoldProvider({ children }: { children: React.ReactNode }) {
  const [prices, setPrices] = useState<GoldPrices | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchPrices = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true);
    else setIsRefreshing(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise((r) => setTimeout(r, silent ? 600 : 1200));
      const data = generateCurrentPrices();
      setPrices(data);
      setLastUpdated(new Date());
    } catch {
      setError("تعذر تحديث الأسعار. يرجى المحاولة مجدداً.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchPrices(false);
    // Auto-refresh every 5 minutes
    const interval = setInterval(() => fetchPrices(true), 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchPrices]);

  const refresh = () => fetchPrices(true);

  return (
    <GoldContext.Provider
      value={{ prices, isLoading, isRefreshing, error, refresh, lastUpdated }}
    >
      {children}
    </GoldContext.Provider>
  );
}

export const useGoldContext = () => useContext(GoldContext);
