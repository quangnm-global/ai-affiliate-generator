export {
  getServerEnv,
  validateProductionEnv,
  isProductionRuntime,
  getDeploymentMeta,
} from "@/lib/env/server";
export { getClientEnv, validateProductionClientEnv } from "@/lib/env/client";
export {
  PRODUCTION_REQUIRED_SERVER_VARS,
  PRODUCTION_REQUIRED_CLIENT_VARS,
} from "@/lib/env/schema";
