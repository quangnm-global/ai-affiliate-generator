type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogContext {
  service?: string;
  requestId?: string;
  userId?: string;
  route?: string;
  method?: string;
  durationMs?: number;
  statusCode?: number;
  error?: string;
  stack?: string;
  metadata?: Record<string, string | number | boolean | null>;
}

const isDev = process.env.NODE_ENV === "development";

function formatEntry(level: LogLevel, message: string, context?: LogContext) {
  return {
    level,
    message,
    timestamp: new Date().toISOString(),
    service: context?.service ?? "app",
    ...context,
  };
}

function write(level: LogLevel, message: string, context?: LogContext) {
  const entry = formatEntry(level, message, context);

  if (isDev) {
    const prefix = `[${entry.service}:${level.toUpperCase()}]`;
    const meta = context ? ` ${JSON.stringify(context)}` : "";
    const line = `${prefix} ${message}${meta}`;

    if (level === "error") console.error(line);
    else if (level === "warn") console.warn(line);
    else if (level === "debug") console.debug(line);
    else console.info(line);
    return;
  }

  const serialized = JSON.stringify(entry);
  if (level === "error") console.error(serialized);
  else if (level === "warn") console.warn(serialized);
  else console.info(serialized);
}

export const logger = {
  debug(message: string, context?: LogContext) {
    if (isDev) write("debug", message, context);
  },
  info(message: string, context?: LogContext) {
    write("info", message, context);
  },
  warn(message: string, context?: LogContext) {
    write("warn", message, context);
  },
  error(message: string, context?: LogContext) {
    write("error", message, context);
  },
};

export function logError(error: unknown, context?: LogContext) {
  const err = error instanceof Error ? error : new Error(String(error));
  logger.error(err.message, {
    ...context,
    error: err.message,
    stack: err.stack,
  });
}
