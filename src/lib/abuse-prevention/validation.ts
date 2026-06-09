import type { z } from "zod";

import { abuseConfig } from "@/lib/abuse-prevention/config";
import { AbuseError } from "@/lib/abuse-prevention/errors";

const HONEYPOT_FIELD = "_hp";

export function assertContentLength(request: Request): void {
  const header = request.headers.get("content-length");
  if (!header) return;

  const bytes = Number(header);
  if (Number.isFinite(bytes) && bytes > abuseConfig.request.maxBodyBytes) {
    throw new AbuseError(
      `Request body exceeds ${abuseConfig.request.maxBodyBytes} bytes`,
      "PAYLOAD_TOO_LARGE",
      413
    );
  }
}

export function assertJsonContentType(request: Request): void {
  if (request.method !== "POST" && request.method !== "PUT" && request.method !== "PATCH") {
    return;
  }

  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    throw new AbuseError(
      "Content-Type must be application/json",
      "VALIDATION",
      415
    );
  }
}

export async function parseJsonBody(request: Request): Promise<unknown> {
  assertContentLength(request);

  const raw = await request.text();

  if (raw.length > abuseConfig.request.maxBodyBytes) {
    throw new AbuseError(
      `Request body exceeds ${abuseConfig.request.maxBodyBytes} bytes`,
      "PAYLOAD_TOO_LARGE",
      413
    );
  }

  if (!raw.trim()) {
    throw new AbuseError("Request body is required", "VALIDATION", 400);
  }

  try {
    return JSON.parse(raw) as unknown;
  } catch {
    throw new AbuseError("Invalid JSON body", "VALIDATION", 400);
  }
}

export function rejectHoneypot(body: unknown): void {
  if (
    body &&
    typeof body === "object" &&
    HONEYPOT_FIELD in body &&
    (body as Record<string, unknown>)[HONEYPOT_FIELD]
  ) {
    throw new AbuseError("Request rejected", "SPAM", 400);
  }
}

export function validateBody<T>(body: unknown, schema: z.ZodType<T>): T {
  rejectHoneypot(body);

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    throw new AbuseError(
      parsed.error.issues[0]?.message ?? "Invalid input",
      "VALIDATION",
      400
    );
  }

  return parsed.data;
}
