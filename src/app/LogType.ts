export const LOGTYPE = {
  ERROR: "ERROR",
  WARN: "WARN",
  INFO: "INFO",
  DEBUG: "DEBUG",
  VERBOSE: "VERBOSE",
} as const;

export type LogType = (typeof LOGTYPE)[keyof typeof LOGTYPE];
