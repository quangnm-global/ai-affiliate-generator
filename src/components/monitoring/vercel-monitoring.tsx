import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { isProductionRuntime } from "@/lib/env/server";

export function VercelMonitoring() {
  if (!isProductionRuntime()) return null;

  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
