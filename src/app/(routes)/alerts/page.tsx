import type { Metadata } from "next";
import { AlertsContent } from "@/components/alerts/AlertsContent";

export const metadata: Metadata = {
  title: "تنبيهات الأسعار",
  description: "اضبط تنبيهاتك وكن أول من يعلم بتغيرات أسعار الذهب",
};

export default function AlertsPage() {
  return <AlertsContent />;
}
