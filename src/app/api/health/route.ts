import { NextResponse } from "next/server";

import { getHealthReport } from "@/lib/monitoring/health";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const report = getHealthReport();
  const statusCode = report.status === "error" ? 503 : 200;

  return NextResponse.json(report, {
    status: statusCode,
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
