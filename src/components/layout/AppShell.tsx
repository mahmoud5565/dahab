"use client";

import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";
import { Header } from "./Header";
import { InstallPrompt } from "@/components/shared/InstallPrompt";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="main-content">
        <Header />
        <main className="px-4 py-4 lg:px-8 lg:py-6 max-w-4xl mx-auto">
          {children}
        </main>
      </div>
      <BottomNav />
      <InstallPrompt />
    </div>
  );
}
