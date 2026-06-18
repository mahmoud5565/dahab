import type { Metadata } from "next";
import { NewsContent } from "@/components/news/NewsContent";

export const metadata: Metadata = {
  title: "أخبار الذهب والاقتصاد",
  description: "آخر أخبار الذهب والدولار والاقتصاد المصري",
};

export default function NewsPage() {
  return <NewsContent />;
}
