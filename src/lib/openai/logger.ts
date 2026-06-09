import type { LogContext } from "@/lib/openai/types";

type LogLevel = "debug" | "info" | "warn" | "error";

const isDev = process.env.NODE_ENV === "development";

function formatLog(level: LogLevel, message: string, context?: LogContext) {
  const entry = {
    level,
    service: "openai",
    message,
    timestamp: new Date().toISOString(),
    ...context,
  };

  if (isDev) {
    const prefix = `[OpenAI:${level.toUpperCase()}]`;
    const meta = context ? ` ${JSON.stringify(context)}` : "";
    return `${prefix} ${message}${meta}`;
  }

  return JSON.stringify(entry);
}

export const openAILogger = {
  debug(message: string, context?: LogContext) {
    if (isDev) console.debug(formatLog("debug", message, context));
  },

  info(message: string, context?: LogContext) {
    console.info(formatLog("info", message, context));
  },

  warn(message: string, context?: LogContext) {
    console.warn(formatLog("warn", message, context));
  },

  error(message: string, context?: LogContext) {
    console.error(formatLog("error", message, context));
  },
};
