"use client";

import { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import { generateHistoricalData } from "@/lib/goldData";
import { formatPrice, formatShortDate } from "@/lib/utils";
import type { GoldHistoryPoint } from "@/types";
import { Skeleton } from "@/components/shared/SkeletonCard";

export function MiniChart() {
  const [data, setData] = useState<GoldHistoryPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setData(generateHistoricalData("day"));
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Skeleton className="h-40 rounded-2xl" />;
  }

  return (
    <div className="gold-card p-4">
      <ResponsiveContainer width="100%" height={140}>
        <AreaChart
          data={data}
          margin={{ top: 5, right: 5, left: 5, bottom: 0 }}
        >
          <defs>
            <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            tickFormatter={formatShortDate}
            tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <Tooltip
            contentStyle={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "12px",
              fontFamily: "Cairo, sans-serif",
              fontSize: "12px",
              direction: "rtl",
            }}
            formatter={(value: number) => [
              `${formatPrice(value)} ج.م`,
              "عيار 21",
            ]}
            labelFormatter={formatShortDate}
          />
          <Area
            type="monotone"
            dataKey="price21"
            stroke="#f59e0b"
            strokeWidth={2}
            fill="url(#goldGrad)"
            dot={false}
            activeDot={{ r: 5, fill: "#f59e0b" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
