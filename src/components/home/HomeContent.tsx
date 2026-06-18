"use client";

import { useGoldContext } from "@/context/GoldContext";
import { PriceGrid } from "./PriceGrid";
import { LastUpdateBadge } from "./LastUpdateBadge";
import { QuickStats } from "./QuickStats";
import { MiniChart } from "./MiniChart";
import Link from "next/link";
import { Calculator, TrendingUp, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export function HomeContent() {
  const { prices, isLoading, error } = useGoldContext();

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gold-900 via-gold-800 to-amber-900 p-6 text-white shadow-2xl shadow-gold-900/30">
        {/* Background pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 60%),
                              radial-gradient(circle at 80% 20%, rgba(255,255,255,0.2) 0%, transparent 50%)`,
          }}
        />
        <div className="relative z-10">
          <p className="text-gold-200 text-sm font-medium mb-1">
            السعر الحالي - عيار ٢١
          </p>
          {isLoading ? (
            <div className="h-10 w-40 shimmer rounded-xl" />
          ) : (
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black tracking-tight">
                {prices
                  ? new Intl.NumberFormat("ar-EG").format(
                      prices.karat21.buyPrice
                    )
                  : "---"}
              </span>
              <span className="text-xl text-gold-300 font-bold">ج.م</span>
            </div>
          )}
          <p className="text-gold-300 text-xs mt-1">للجرام الواحد</p>

          {/* Quick action buttons */}
          <div className="flex items-center gap-3 mt-5">
            <Link
              href="/calculator"
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl",
                "bg-white/20 hover:bg-white/30 backdrop-blur-sm",
                "text-white text-sm font-bold transition-all duration-200",
                "border border-white/20 hover:border-white/40"
              )}
            >
              <Calculator className="w-4 h-4" />
              احسب ذهبك
            </Link>
            <Link
              href="/charts"
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl",
                "bg-white/10 hover:bg-white/20 backdrop-blur-sm",
                "text-white text-sm font-medium transition-all duration-200",
                "border border-white/10 hover:border-white/30"
              )}
            >
              <TrendingUp className="w-4 h-4" />
              الرسوم البيانية
            </Link>
          </div>
        </div>

        {/* Decorative gold circle */}
        <div className="absolute -top-8 -left-8 w-40 h-40 rounded-full bg-gold-600/20 blur-2xl" />
        <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full bg-amber-400/20 blur-2xl" />
      </div>

      {/* Last Update */}
      <LastUpdateBadge />

      {/* Error State */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm text-center">
          {error}
        </div>
      )}

      {/* Quick Stats */}
      <div>
        <h2 className="text-sm font-bold text-muted-foreground mb-3 px-1">
          إحصائيات سريعة
        </h2>
        <QuickStats />
      </div>

      {/* Price Grid */}
      <div>
        <h2 className="text-sm font-bold text-muted-foreground mb-3 px-1">
          أسعار جميع العيارات
        </h2>
        <PriceGrid prices={prices} isLoading={isLoading} />
      </div>

      {/* Mini Chart Preview */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-sm font-bold text-muted-foreground">
            حركة الأسعار اليوم
          </h2>
          <Link
            href="/charts"
            className="flex items-center gap-1 text-xs text-gold-600 dark:text-gold-400 font-bold hover:underline"
          >
            عرض الكل
            <ChevronLeft className="w-3 h-3" />
          </Link>
        </div>
        <MiniChart />
      </div>

      {/* News Teaser */}
      <div className="gold-card p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-base">آخر الأخبار</h2>
          <Link
            href="/news"
            className="text-xs text-gold-600 dark:text-gold-400 font-bold hover:underline"
          >
            المزيد
          </Link>
        </div>
        <div className="space-y-3">
          <div className="p-3 rounded-xl bg-muted/50 border border-border/50">
            <p className="text-sm font-semibold leading-relaxed">
              الذهب يرتفع وسط توترات جيوسياسية وزيادة الطلب على الملاذات الآمنة
            </p>
            <p className="text-xs text-muted-foreground mt-1.5">
              منذ ساعتين · بوابة المال
            </p>
          </div>
          <div className="p-3 rounded-xl bg-muted/50 border border-border/50">
            <p className="text-sm font-semibold leading-relaxed">
              الدولار يستقر أمام الجنيه المصري عند مستويات 50 جنيهاً
            </p>
            <p className="text-xs text-muted-foreground mt-1.5">
              منذ 4 ساعات · اقتصاد اليوم
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
