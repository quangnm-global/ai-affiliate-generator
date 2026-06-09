export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { validateProductionEnv, validateProductionClientEnv } = await import(
      "@/lib/env"
    );
    const { logger } = await import("@/lib/logging");

    const server = validateProductionEnv();
    const client = validateProductionClientEnv();

    if (!server.ok || !client.ok) {
      logger.warn("Production environment validation failed at startup", {
        service: "instrumentation",
        metadata: {
          missingServer: server.missing.join(",") || "none",
          missingClient: client.missing.join(",") || "none",
          vercelEnv: process.env.VERCEL_ENV ?? "unknown",
        },
      });
    } else {
      logger.info("Application instrumentation registered", {
        service: "instrumentation",
        metadata: {
          vercelEnv: process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "development",
        },
      });
    }
  }
}

export async function onRequestError(
  error: Error,
  request: { path: string; method: string; headers: { [key: string]: string } },
  context: { routerKind: string; routePath: string }
) {
  const { logError } = await import("@/lib/logging");

  logError(error, {
    service: "request-error",
    route: context.routePath,
    method: request.method,
    metadata: {
      routerKind: context.routerKind,
      path: request.path,
    },
  });
}
