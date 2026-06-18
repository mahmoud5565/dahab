import type { Metadata } from "next";
import { ChartsContent } from "@/components/charts/ChartsContent";

export const metadata: Metadata = {
  title: "الرسوم البيانية",
  description: "تتبع حركة أسعار الذهب عبر الزمن",
};

export default function ChartsPage() {
  return <ChartsContent />;
}
