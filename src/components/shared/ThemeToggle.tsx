"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "w-9 h-9 rounded-xl flex items-center justify-center",
        "bg-muted hover:bg-accent transition-all duration-200",
        "text-muted-foreground hover:text-foreground"
      )}
      title={resolvedTheme === "dark" ? "الوضع الفاتح" : "الوضع الليلي"}
    >
      {resolvedTheme === "dark" ? (
        <Sun className="w-4 h-4" />
      ) : (
        <Moon className="w-4 h-4" />
      )}
    </button>
  );
}
