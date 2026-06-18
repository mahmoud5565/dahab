"use client";

import { useState, useEffect } from "react";
import { Download, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("pwa_install_dismissed");
    if (dismissed) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => setShowPrompt(true), 3000);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setIsDismissed(true);
    localStorage.setItem("pwa_install_dismissed", "true");
  };

  if (!showPrompt || isDismissed) return null;

  return (
    <div
      className={cn(
        "fixed bottom-20 lg:bottom-6 left-4 right-4 lg:left-auto lg:right-72 lg:w-80 z-50",
        "animate-slide-in"
      )}
    >
      <div className="gold-card p-4 shadow-2xl shadow-black/20 border border-gold-500/30">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gold-gradient flex items-center justify-center flex-shrink-0 shadow-lg">
            <span className="text-white font-black text-lg">ذ</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm">ثبّت تطبيق ذهب مصر</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              احصل على تجربة أفضل وإشعارات فورية بتغيرات الأسعار
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <button
          onClick={handleInstall}
          className={cn(
            "mt-3 w-full flex items-center justify-center gap-2",
            "bg-gold-gradient text-white font-bold text-sm py-2.5 rounded-xl",
            "shadow-lg shadow-gold-500/30 hover:shadow-gold-500/50",
            "transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          )}
        >
          <Download className="w-4 h-4" />
          تثبيت التطبيق مجاناً
        </button>
      </div>
    </div>
  );
}
