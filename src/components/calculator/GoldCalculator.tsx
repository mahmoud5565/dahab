"use client";

import { useState, useEffect } from "react";
import { Calculator, ArrowLeftRight, Info } from "lucide-react";
import { useGoldContext } from "@/context/GoldContext";
import { formatCurrency, formatPrice, cn } from "@/lib/utils";
import type { CalculatorResult } from "@/types";

const KARATS = [
  { value: 24, label: "عيار 24", purity: 1.0 },
  { value: 21, label: "عيار 21", purity: 0.875 },
  { value: 18, label: "عيار 18", purity: 0.75 },
  { value: 14, label: "عيار 14", purity: 0.585 },
];

const CRAFTING_FEES = {
  24: 0,
  21: 0.05,
  18: 0.08,
  14: 0.10,
};

export function GoldCalculator() {
  const { prices, isLoading } = useGoldContext();
  const [selectedKarat, setSelectedKarat] = useState(21);
  const [weight, setWeight] = useState("");
  const [result, setResult] = useState<CalculatorResult | null>(null);

  useEffect(() => {
    if (!prices || !weight || parseFloat(weight) <= 0) {
      setResult(null);
      return;
    }

    const w = parseFloat(weight);
    const karatInfo = KARATS.find((k) => k.value === selectedKarat)!;
    const craftingFeeRate =
      CRAFTING_FEES[selectedKarat as keyof typeof CRAFTING_FEES] ?? 0.05;

    let basePrice = 0;
    if (selectedKarat === 24) basePrice = prices.karat24.buyPrice;
    else if (selectedKarat === 21) basePrice = prices.karat21.buyPrice;
    else if (selectedKarat === 18) basePrice = prices.karat18.buyPrice;
    else basePrice = prices.karat21.buyPrice * karatInfo.purity;

    const goldValue = Math.round(basePrice * w);
    const craftingFee = Math.round(goldValue * craftingFeeRate);
    const buyPrice = Math.round(goldValue * 1.02);
    const sellPrice = Math.round(goldValue * 0.98);

    setResult({
      karat: selectedKarat,
      weight: w,
      goldValue,
      buyPrice,
      sellPrice,
      craftingFee,
      totalBuy: buyPrice + craftingFee,
      totalSell: sellPrice,
    });
  }, [prices, selectedKarat, weight]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center py-2">
        <div className="w-16 h-16 rounded-3xl bg-gold-gradient mx-auto flex items-center justify-center mb-4 shadow-lg shadow-gold-500/30 animate-float">
          <Calculator className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-xl font-black">حاسبة الذهب</h1>
        <p className="text-sm text-muted-foreground mt-1">
          احسب قيمة ذهبك بدقة وسهولة
        </p>
      </div>

      {/* Karat Selector */}
      <div className="gold-card p-5">
        <h2 className="font-bold text-sm mb-4 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-gold-500 text-white text-xs flex items-center justify-center font-black">
            1
          </span>
          اختر العيار
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {KARATS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setSelectedKarat(value)}
              className={cn(
                "p-4 rounded-xl border-2 text-center transition-all duration-200",
                "font-bold text-sm",
                selectedKarat === value
                  ? "border-gold-500 bg-gold-500/10 text-gold-600 dark:text-gold-400 scale-[1.02]"
                  : "border-border bg-muted/30 text-muted-foreground hover:border-gold-500/50"
              )}
            >
              <span className="text-lg font-black block">{value}</span>
              <span className="text-xs">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Weight Input */}
      <div className="gold-card p-5">
        <h2 className="font-bold text-sm mb-4 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-gold-500 text-white text-xs flex items-center justify-center font-black">
            2
          </span>
          أدخل الوزن بالجرام
        </h2>
        <div className="relative">
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="0.00"
            min="0"
            step="0.1"
            className={cn(
              "w-full text-2xl font-black text-center py-5 px-4 rounded-xl",
              "bg-muted/50 border-2 border-border",
              "focus:outline-none focus:border-gold-500 transition-colors",
              "placeholder:text-muted-foreground/40"
            )}
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-bold">
            جرام
          </span>
        </div>

        {/* Quick Weight Buttons */}
        <div className="flex items-center gap-2 mt-3">
          {[1, 5, 10, 21, 50].map((w) => (
            <button
              key={w}
              onClick={() => setWeight(String(w))}
              className={cn(
                "flex-1 py-2 rounded-lg text-xs font-bold border transition-colors",
                weight === String(w)
                  ? "border-gold-500 bg-gold-500/10 text-gold-600 dark:text-gold-400"
                  : "border-border bg-muted/30 text-muted-foreground hover:border-gold-500/40"
              )}
            >
              {w}
            </button>
          ))}
        </div>
      </div>

      {/* Current Price Info */}
      {prices && !isLoading && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
          <Info className="w-4 h-4 text-blue-500 flex-shrink-0" />
          <p className="text-xs text-blue-600 dark:text-blue-400">
            سعر عيار {selectedKarat} الحالي:{" "}
            <strong>
              {formatPrice(
                selectedKarat === 24
                  ? prices.karat24.buyPrice
                  : selectedKarat === 21
                    ? prices.karat21.buyPrice
                    : prices.karat18.buyPrice
              )}{" "}
              ج.م/جرام
            </strong>
          </p>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-4 animate-scale-in">
          {/* Main Result */}
          <div className="gold-card p-6 bg-gradient-to-br from-gold-500/15 to-amber-600/10 border-gold-500/30">
            <div className="flex items-center gap-2 mb-4">
              <ArrowLeftRight className="w-4 h-4 text-gold-500" />
              <h2 className="font-black text-base">نتيجة الحساب</h2>
            </div>

            <div className="text-center py-3">
              <p className="text-sm text-muted-foreground mb-1">
                قيمة {result.weight} جرام عيار {result.karat}
              </p>
              <p className="text-4xl font-black gold-text">
                {formatCurrency(result.goldValue)}
              </p>
            </div>
          </div>

          {/* Breakdown */}
          <div className="grid grid-cols-2 gap-3">
            <div className="gold-card p-4 bg-green-500/5 border-green-500/20">
              <p className="text-xs text-muted-foreground mb-1">سعر الشراء</p>
              <p className="text-lg font-black text-green-600 dark:text-green-400">
                {formatCurrency(result.buyPrice)}
              </p>
              <p className="text-[11px] text-muted-foreground mt-1">
                سعر السوق + 2%
              </p>
            </div>

            <div className="gold-card p-4 bg-red-500/5 border-red-500/20">
              <p className="text-xs text-muted-foreground mb-1">سعر البيع</p>
              <p className="text-lg font-black text-red-500">
                {formatCurrency(result.sellPrice)}
              </p>
              <p className="text-[11px] text-muted-foreground mt-1">
                سعر السوق - 2%
              </p>
            </div>
          </div>

          {result.craftingFee > 0 && (
            <div className="gold-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold">مع أجرة الصنعة</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    أجرة الصنعة: {formatCurrency(result.craftingFee)}
                  </p>
                </div>
                <p className="text-xl font-black gold-text">
                  {formatCurrency(result.totalBuy)}
                </p>
              </div>
            </div>
          )}

          {/* Disclaimer */}
          <p className="text-xs text-muted-foreground text-center px-4">
            * هذه الأسعار تقريبية. قد تختلف أسعار المحلات بناءً على أجرة
            الصنعة والعروض الخاصة.
          </p>
        </div>
      )}

      {/* Empty state */}
      {!result && weight === "" && (
        <div className="text-center py-6 text-muted-foreground">
          <Calculator className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p className="text-sm">أدخل الوزن لحساب القيمة</p>
        </div>
      )}
    </div>
  );
}
