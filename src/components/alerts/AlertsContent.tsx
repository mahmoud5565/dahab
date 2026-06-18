"use client";

import { useState, useEffect } from "react";
import { Bell, Plus, Trash2, BellOff, BellRing, TrendingUp, TrendingDown, Check } from "lucide-react";
import { toast } from "sonner";
import { useGoldContext } from "@/context/GoldContext";
import {
  getAlerts,
  addAlert,
  deleteAlert,
  updateAlert,
  generateId,
} from "@/lib/storage";
import type { PriceAlert } from "@/types";
import { formatPrice, getKaratLabel, cn } from "@/lib/utils";

const KARAT_OPTIONS: Array<{ value: PriceAlert["karat"]; label: string }> = [
  { value: 24, label: "عيار 24" },
  { value: 21, label: "عيار 21" },
  { value: 18, label: "عيار 18" },
  { value: "pound", label: "الجنيه الذهب" },
];

export function AlertsContent() {
  const { prices } = useGoldContext();
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [selectedKarat, setSelectedKarat] = useState<PriceAlert["karat"]>(21);
  const [targetPrice, setTargetPrice] = useState("");
  const [condition, setCondition] = useState<"above" | "below">("above");

  useEffect(() => {
    setAlerts(getAlerts());
  }, []);

  // Check alerts against current prices
  useEffect(() => {
    if (!prices || alerts.length === 0) return;
    alerts.forEach((alert) => {
      if (!alert.isActive || alert.notified) return;
      let currentPrice = 0;
      if (alert.karat === 24) currentPrice = prices.karat24.buyPrice;
      else if (alert.karat === 21) currentPrice = prices.karat21.buyPrice;
      else if (alert.karat === 18) currentPrice = prices.karat18.buyPrice;
      else currentPrice = prices.pound.buyPrice;

      const triggered =
        (alert.condition === "above" && currentPrice >= alert.targetPrice) ||
        (alert.condition === "below" && currentPrice <= alert.targetPrice);

      if (triggered) {
        updateAlert(alert.id, {
          notified: true,
          triggeredAt: new Date().toISOString(),
        });
        setAlerts(getAlerts());
        toast.success(
          `🔔 ${getKaratLabel(alert.karat)} وصل إلى ${formatPrice(currentPrice)} ج.م`,
          { duration: 5000 }
        );
      }
    });
  }, [prices, alerts]);

  const handleAddAlert = () => {
    if (!targetPrice || parseFloat(targetPrice) <= 0) {
      toast.error("يرجى إدخال سعر صحيح");
      return;
    }
    const newAlert: PriceAlert = {
      id: generateId(),
      karat: selectedKarat,
      targetPrice: parseFloat(targetPrice),
      condition,
      isActive: true,
      createdAt: new Date().toISOString(),
      notified: false,
    };
    addAlert(newAlert);
    setAlerts(getAlerts());
    setTargetPrice("");
    setShowForm(false);
    toast.success("تم إضافة التنبيه بنجاح");
  };

  const handleDelete = (id: string) => {
    deleteAlert(id);
    setAlerts(getAlerts());
    toast.success("تم حذف التنبيه");
  };

  const handleToggle = (id: string, current: boolean) => {
    updateAlert(id, { isActive: !current, notified: false });
    setAlerts(getAlerts());
  };

  const getCurrentPrice = (karat: PriceAlert["karat"]) => {
    if (!prices) return null;
    if (karat === 24) return prices.karat24.buyPrice;
    if (karat === 21) return prices.karat21.buyPrice;
    if (karat === 18) return prices.karat18.buyPrice;
    return prices.pound.buyPrice;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gold-gradient flex items-center justify-center shadow-lg shadow-gold-500/30">
            <Bell className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-black text-lg">التنبيهات</h1>
            <p className="text-xs text-muted-foreground">
              {alerts.filter((a) => a.isActive).length} تنبيه نشط
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold",
            "bg-gold-gradient text-white shadow-lg shadow-gold-500/30",
            "hover:shadow-gold-500/50 transition-all duration-200 hover:scale-105 active:scale-95"
          )}
        >
          <Plus className="w-4 h-4" />
          تنبيه جديد
        </button>
      </div>

      {/* Add Alert Form */}
      {showForm && (
        <div className="gold-card p-5 space-y-4 animate-scale-in border-gold-500/30">
          <h2 className="font-bold text-base">إضافة تنبيه جديد</h2>

          {/* Karat */}
          <div>
            <label className="text-xs font-bold text-muted-foreground mb-2 block">
              العيار
            </label>
            <div className="grid grid-cols-2 gap-2">
              {KARAT_OPTIONS.map(({ value, label }) => (
                <button
                  key={String(value)}
                  onClick={() => setSelectedKarat(value)}
                  className={cn(
                    "py-3 rounded-xl border text-sm font-bold transition-all",
                    selectedKarat === value
                      ? "border-gold-500 bg-gold-500/10 text-gold-600 dark:text-gold-400"
                      : "border-border bg-muted/30 text-muted-foreground"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Condition */}
          <div>
            <label className="text-xs font-bold text-muted-foreground mb-2 block">
              الشرط
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setCondition("above")}
                className={cn(
                  "flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-bold transition-all",
                  condition === "above"
                    ? "border-green-500 bg-green-500/10 text-green-600 dark:text-green-400"
                    : "border-border bg-muted/30 text-muted-foreground"
                )}
              >
                <TrendingUp className="w-4 h-4" />
                يرتفع إلى
              </button>
              <button
                onClick={() => setCondition("below")}
                className={cn(
                  "flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-bold transition-all",
                  condition === "below"
                    ? "border-red-500 bg-red-500/10 text-red-600 dark:text-red-400"
                    : "border-border bg-muted/30 text-muted-foreground"
                )}
              >
                <TrendingDown className="w-4 h-4" />
                ينخفض إلى
              </button>
            </div>
          </div>

          {/* Target Price */}
          <div>
            <label className="text-xs font-bold text-muted-foreground mb-2 block">
              السعر المستهدف (ج.م)
            </label>
            {prices && (
              <p className="text-xs text-muted-foreground mb-2">
                السعر الحالي:{" "}
                <strong className="text-foreground">
                  {formatPrice(getCurrentPrice(selectedKarat) ?? 0)} ج.م
                </strong>
              </p>
            )}
            <input
              type="number"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              placeholder="أدخل السعر المستهدف"
              className={cn(
                "w-full py-3 px-4 rounded-xl border bg-muted/50",
                "text-lg font-bold text-center",
                "focus:outline-none focus:border-gold-500 transition-colors"
              )}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleAddAlert}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl",
                "bg-gold-gradient text-white font-bold text-sm",
                "shadow-lg shadow-gold-500/20 hover:shadow-gold-500/40 transition-all"
              )}
            >
              <Check className="w-4 h-4" />
              إضافة التنبيه
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-5 py-3 rounded-xl border border-border bg-muted/50 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
            >
              إلغاء
            </button>
          </div>
        </div>
      )}

      {/* Alerts List */}
      {alerts.length === 0 ? (
        <div className="text-center py-16 space-y-3">
          <div className="w-20 h-20 rounded-3xl bg-muted mx-auto flex items-center justify-center">
            <BellOff className="w-10 h-10 text-muted-foreground/30" />
          </div>
          <p className="font-bold text-muted-foreground">لا توجد تنبيهات</p>
          <p className="text-sm text-muted-foreground">
            أضف تنبيهاً لتعلم فوراً عند تغيّر الأسعار
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-2 flex items-center gap-2 mx-auto px-5 py-2.5 rounded-xl bg-gold-500/10 border border-gold-500/20 text-gold-600 dark:text-gold-400 text-sm font-bold hover:bg-gold-500/20 transition-colors"
          >
            <Plus className="w-4 h-4" />
            أضف أول تنبيه
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert, i) => {
            const currentPrice = getCurrentPrice(alert.karat);
            const isTriggered = alert.notified;
            return (
              <div
                key={alert.id}
                className={cn(
                  "gold-card p-4 animate-fade-in transition-all",
                  !alert.isActive && "opacity-50",
                  isTriggered && "border-green-500/40 bg-green-500/5"
                )}
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div
                    className={cn(
                      "w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0",
                      alert.condition === "above"
                        ? "bg-green-500/10"
                        : "bg-red-500/10"
                    )}
                  >
                    {isTriggered ? (
                      <BellRing className="w-5 h-5 text-green-500" />
                    ) : alert.condition === "above" ? (
                      <TrendingUp className="w-5 h-5 text-green-500" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-red-500" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-sm">
                        {getKaratLabel(alert.karat)}
                      </p>
                      {isTriggered && (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-400">
                          تم التفعيل
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {alert.condition === "above" ? "عند الوصول إلى" : "عند الانخفاض إلى"}{" "}
                      <strong className="text-foreground">
                        {formatPrice(alert.targetPrice)} ج.م
                      </strong>
                    </p>
                    {currentPrice && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        الحالي: {formatPrice(currentPrice)} ج.م
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleToggle(alert.id, alert.isActive)}
                      className={cn(
                        "w-9 h-9 rounded-xl flex items-center justify-center transition-colors",
                        alert.isActive
                          ? "bg-gold-500/10 text-gold-600 dark:text-gold-400"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {alert.isActive ? (
                        <Bell className="w-4 h-4" />
                      ) : (
                        <BellOff className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(alert.id)}
                      className="w-9 h-9 rounded-xl flex items-center justify-center bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
