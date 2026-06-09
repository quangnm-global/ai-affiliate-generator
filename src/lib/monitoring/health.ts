import { validateProductionClientEnv, validateProductionEnv } from "@/lib/env";
import { getDeploymentMeta } from "@/lib/env/server";

export type HealthStatus = "ok" | "degraded" | "error";

export interface HealthCheck {
  name: string;
  ok: boolean;
  message?: string;
}

export interface HealthReport {
  status: HealthStatus;
  timestamp: string;
  deployment: ReturnType<typeof getDeploymentMeta>;
  checks: HealthCheck[];
}

function checkEnvVar(name: string, requiredInProduction = false): HealthCheck {
  const present = Boolean(process.env[name]);
  const isProduction = process.env.VERCEL_ENV === "production";

  if (requiredInProduction && isProduction) {
    return {
      name,
      ok: present,
      message: present ? undefined : `${name} is not configured`,
    };
  }

  return {
    name,
    ok: true,
    message: present ? undefined : `${name} is not set`,
  };
}

export function getHealthReport(): HealthReport {
  const serverValidation = validateProductionEnv();
  const clientValidation = validateProductionClientEnv();

  const checks: HealthCheck[] = [
    checkEnvVar("NEXT_PUBLIC_SUPABASE_URL", true),
    checkEnvVar("NEXT_PUBLIC_SUPABASE_ANON_KEY", true),
    checkEnvVar("NEXT_PUBLIC_APP_URL", true),
    checkEnvVar("OPENAI_API_KEY", true),
    checkEnvVar("SUPABASE_SERVICE_ROLE_KEY", true),
    {
      name: "production_server_env",
      ok: serverValidation.ok,
      message: serverValidation.missing.length
        ? `Missing: ${serverValidation.missing.join(", ")}`
        : undefined,
    },
    {
      name: "production_client_env",
      ok: clientValidation.ok,
      message: clientValidation.missing.length
        ? `Missing: ${clientValidation.missing.join(", ")}`
        : undefined,
    },
  ];

  const failedRequired = checks.filter((check) => !check.ok);
  const status: HealthStatus =
    failedRequired.length === 0
      ? "ok"
      : process.env.VERCEL_ENV === "production"
        ? "error"
        : "degraded";

  return {
    status,
    timestamp: new Date().toISOString(),
    deployment: getDeploymentMeta(),
    checks,
  };
}
