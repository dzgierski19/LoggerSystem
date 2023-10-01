import { LOGTYPE, LogType } from "./LogType";
import { USERS, Users } from "./User";
import { randomUUID } from "crypto";

export class Log {
  readonly id = randomUUID();
  createdBy: Users;
  createdAt: Date = new Date();
  deletedBy: Users;
  deletedAt: Date;
  level: LogType;
  message: string;
  constructor(createdBy: Users, level: LogType) {
    this.createdBy = createdBy;
    this.level = level;
    this.message = this.logMessage(level);
  }

  private logMessage(logLevel: LogType): string {
    return `${logLevel} message`;
  }
}
