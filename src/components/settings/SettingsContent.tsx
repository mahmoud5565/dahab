"use client";

import { useState } from "react";
import {
  Settings,
  Sun,
  Moon,
  Monitor,
  Bell,
  Share2,
  Star,
  Info,
  ChevronLeft,
  Download,
  Trash2,
  Shield,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { clearCache } from "@/lib/storage";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const THEME_OPTIONS = [
  { value: "light" as const, label: "فاتح", Icon: Sun },
  { value: "dark" as const, label: "داكن", Icon: Moon },
  { value: "system" as const, label: "تلقائي", Icon: Monitor },
];

function SettingRow({
  icon: Icon,
  label,
  description,
  action,
  iconColor = "text-gold-500",
  iconBg = "bg-gold-500/10",
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description?: string;
  action: React.ReactNode;
  iconColor?: string;
  iconBg?: string;
}) {
  return (
    <div className="flex items-center gap-3 py-3">
      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", iconBg)}>
        <Icon className={cn("w-5 h-5", iconColor)} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold">{label}</p>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
      <div className="flex-shrink-0">{action}</div>
    </div>
  );
}

export function SettingsContent() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);

  const handleShare = async () => {
    const shareData = {
      title: "ذهب مصر",
      text: "تطبيق رائع لمتابعة أسعار الذهب في مصر",
      url: "https://dahab-misr.vercel.app",
    };
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(shareData.url);
      toast.success("تم نسخ رابط التطبيق");
    }
  };

  const handleClearCache = () => {
    clearCache();
    toast.success("تم مسح الذاكرة المؤقتة");
  };

  const handleRating = () => {
    toast.success("شكراً لتقييمك! 🎉");
  };

  const handleInstall = async () => {
    toast.success("افتح قائمة المتصفح ← اختر 'تثبيت التطبيق'");
  };

  const handleToggleNotifications = async () => {
    if (!notifications) {
      const perm = await Notification.requestPermission();
      if (perm === "granted") {
        setNotifications(true);
        toast.success("تم تفعيل الإشعارات");
      } else {
        toast.error("يرجى السماح بالإشعارات من إعدادات المتصفح");
      }
    } else {
      setNotifications(false);
      toast.info("تم إيقاف الإشعارات");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gold-gradient flex items-center justify-center shadow-lg shadow-gold-500/30">
          <Settings className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-black text-lg">الإعدادات</h1>
          <p className="text-xs text-muted-foreground">تخصيص التطبيق</p>
        </div>
      </div>

      {/* Appearance */}
      <div className="gold-card p-5 space-y-1">
        <h2 className="font-bold text-xs text-muted-foreground mb-4 uppercase tracking-wider">
          المظهر
        </h2>

        <div className="grid grid-cols-3 gap-2 p-1 bg-muted rounded-2xl mb-2">
          {THEME_OPTIONS.map(({ value, label, Icon }) => (
            <button
              key={value}
              onClick={() => setTheme(value)}
              className={cn(
                "flex flex-col items-center gap-1.5 py-3 rounded-xl text-xs font-bold transition-all duration-200",
                theme === value
                  ? "bg-card shadow-sm text-gold-600 dark:text-gold-400"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        <p className="text-xs text-muted-foreground text-center">
          الوضع الحالي: {resolvedTheme === "dark" ? "داكن 🌙" : "فاتح ☀️"}
        </p>
      </div>

      {/* Notifications */}
      <div className="gold-card p-5">
        <h2 className="font-bold text-xs text-muted-foreground mb-4 uppercase tracking-wider">
          الإشعارات
        </h2>
        <SettingRow
          icon={Bell}
          label="تنبيهات الأسعار"
          description="استلم إشعاراً عند تغيّر الأسعار"
          iconBg="bg-blue-500/10"
          iconColor="text-blue-500"
          action={
            <button
              onClick={handleToggleNotifications}
              className={cn(
                "w-12 h-6 rounded-full transition-all duration-200 relative",
                notifications ? "bg-gold-500" : "bg-muted"
              )}
            >
              <div
                className={cn(
                  "w-5 h-5 rounded-full bg-white shadow-sm absolute top-0.5 transition-all duration-200",
                  notifications ? "left-6" : "left-0.5"
                )}
              />
            </button>
          }
        />
      </div>

      {/* App Actions */}
      <div className="gold-card p-5 space-y-1 divide-y divide-border/50">
        <h2 className="font-bold text-xs text-muted-foreground mb-4 uppercase tracking-wider">
          التطبيق
        </h2>

        <button
          onClick={handleShare}
          className="w-full text-right"
        >
          <SettingRow
            icon={Share2}
            label="مشاركة التطبيق"
            description="شارك ذهب مصر مع أصدقائك"
            iconBg="bg-green-500/10"
            iconColor="text-green-500"
            action={<ChevronLeft className="w-4 h-4 text-muted-foreground" />}
          />
        </button>

        <button onClick={handleRating} className="w-full text-right">
          <SettingRow
            icon={Star}
            label="تقييم التطبيق"
            description="ساعدنا بتقييمك على المتجر"
            iconBg="bg-yellow-500/10"
            iconColor="text-yellow-500"
            action={<ChevronLeft className="w-4 h-4 text-muted-foreground" />}
          />
        </button>

        <button
          onClick={handleClearCache}
          className="w-full text-right"
        >
          <SettingRow
            icon={Trash2}
            label="مسح الذاكرة المؤقتة"
            description="حرّر مساحة التخزين المحلي"
            iconBg="bg-red-500/10"
            iconColor="text-red-500"
            action={<ChevronLeft className="w-4 h-4 text-muted-foreground" />}
          />
        </button>
      </div>

      {/* About */}
      <div className="gold-card p-5 space-y-1 divide-y divide-border/50">
        <h2 className="font-bold text-xs text-muted-foreground mb-4 uppercase tracking-wider">
          حول التطبيق
        </h2>

        <div className="py-2">
          <SettingRow
            icon={Info}
            label="الإصدار"
            description="ذهب مصر"
            iconBg="bg-purple-500/10"
            iconColor="text-purple-500"
            action={
              <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-1 rounded-lg">
                1.0.0
              </span>
            }
          />
        </div>

        <div className="py-2">
          <SettingRow
            icon={Shield}
            label="سياسة الخصوصية"
            description="بياناتك محفوظة بالكامل على جهازك"
            iconBg="bg-green-500/10"
            iconColor="text-green-500"
            action={<ChevronLeft className="w-4 h-4 text-muted-foreground" />}
          />
        </div>

        <button onClick={handleInstall} className="w-full text-right">
          <div className="py-2">
            <SettingRow
              icon={Download}
              label="تثبيت التطبيق"
              description="أضف ذهب مصر إلى الشاشة الرئيسية"
              iconBg="bg-gold-500/10"
              iconColor="text-gold-500"
              action={<ChevronLeft className="w-4 h-4 text-muted-foreground" />}
            />
          </div>
        </button>
      </div>

      {/* App Info */}
      <div className="text-center py-4 space-y-1">
        <div className="w-14 h-14 rounded-3xl bg-gold-gradient mx-auto flex items-center justify-center mb-3 shadow-lg shadow-gold-500/30">
          <span className="text-white font-black text-2xl">ذ</span>
        </div>
        <p className="font-black text-base gold-text">ذهب مصر</p>
        <p className="text-xs text-muted-foreground">
          أسعار الذهب لحظياً في مصر
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          الأسعار للاسترشاد فقط · يُنصح بمراجعة المحلات
        </p>
      </div>
    </div>
  );
}
