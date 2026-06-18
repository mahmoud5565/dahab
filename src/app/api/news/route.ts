import { NextResponse } from "next/server";
import { MOCK_NEWS } from "@/lib/goldData";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(
    { success: true, data: MOCK_NEWS },
    {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    }
  );
}
