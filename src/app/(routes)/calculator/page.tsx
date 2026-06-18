import type { Metadata } from "next";
import { GoldCalculator } from "@/components/calculator/GoldCalculator";

export const metadata: Metadata = {
  title: "حاسبة الذهب",
  description: "احسب قيمة ذهبك بسهولة - شراء وبيع جميع العيارات",
};

export default function CalculatorPage() {
  return <GoldCalculator />;
}
