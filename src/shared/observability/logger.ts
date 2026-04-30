import { isProd } from "@shared/config/env";

type LogLevel = "debug" | "info" | "warn" | "error";

function shouldLog(level: LogLevel): boolean {
  if (!isProd) return true;
  // In production only warn/error reach the console
  return level === "warn" || level === "error";
}

const PREFIX = "[monstrino]";

export const logger = {
  debug: (message: string, ...args: unknown[]) => {
    if (shouldLog("debug")) console.debug(PREFIX, message, ...args);
  },
  info: (message: string, ...args: unknown[]) => {
    if (shouldLog("info")) console.info(PREFIX, message, ...args);
  },
  warn: (message: string, ...args: unknown[]) => {
    if (shouldLog("warn")) console.warn(PREFIX, message, ...args);
  },
  error: (message: string, ...args: unknown[]) => {
    if (shouldLog("error")) console.error(PREFIX, message, ...args);
  },
};
