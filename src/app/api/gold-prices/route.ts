import { NextResponse } from "next/server";
import { generateCurrentPrices } from "@/lib/goldData";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    // In production, replace this with a real gold price API call
    // e.g., https://www.goldapi.io/ or scraping a local Egyptian source
    const prices = generateCurrentPrices();

    return NextResponse.json(
      { success: true, data: prices },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error) {
    console.error("Gold prices API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch gold prices" },
      { status: 500 }
    );
  }
}
