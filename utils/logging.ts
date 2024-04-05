import config from "config";
import pino, { Logger } from "pino";

const logLevels = config.get<Map<string, string>>("logging.levels");

export function getLogLevel(logger: string): string {
  return logLevels.get(logger) || logLevels.get("*") || "info";
}

export function getLogger(name: string): Logger {
  return pino({ name, level: getLogLevel(name) });
}
