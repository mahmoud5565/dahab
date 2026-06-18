import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { GoldProvider } from "@/context/GoldContext";
import { AppShell } from "@/components/layout/AppShell";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: {
    default: "ذهب مصر - أسعار الذهب اليوم",
    template: "%s | ذهب مصر",
  },
  description:
    "تابع أسعار الذهب في مصر لحظة بلحظة - عيار 24، 21، 18 والجنيه الذهب. احسب قيمة ذهبك واستلم تنبيهات فورية عند تغير الأسعار.",
  keywords: [
    "أسعار الذهب",
    "سعر الذهب اليوم",
    "ذهب مصر",
    "عيار 21",
    "عيار 24",
    "الجنيه الذهب",
    "سعر الذهب في مصر",
  ],
  authors: [{ name: "ذهب مصر" }],
  creator: "ذهب مصر",
  publisher: "ذهب مصر",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ذهب مصر",
  },
  openGraph: {
    type: "website",
    locale: "ar_EG",
    url: "https://dahab-misr.vercel.app",
    title: "ذهب مصر - أسعار الذهب اليوم",
    description: "تابع أسعار الذهب في مصر لحظة بلحظة",
    siteName: "ذهب مصر",
  },
  twitter: {
    card: "summary_large_image",
    title: "ذهب مصر - أسعار الذهب اليوم",
    description: "تابع أسعار الذهب في مصر لحظة بلحظة",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f59e0b" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a1a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
      </head>
      <body className="font-arabic antialiased">
        <ThemeProvider>
          <GoldProvider>
            <AppShell>{children}</AppShell>
            <Toaster
              position="top-center"
              richColors
              dir="rtl"
              toastOptions={{
                style: { fontFamily: "Cairo, sans-serif" },
              }}
            />
          </GoldProvider>
        </ThemeProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function(err) {
                    console.log('SW registration failed:', err);
                  });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
