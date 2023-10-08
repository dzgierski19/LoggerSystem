import { LogType } from "./LogType";
import { NUMBER_LEVEL_TO_ROLE_MAPPER, UserId, UserType } from "./User";
import { randomUUID } from "crypto";
import { Clock } from "./Clock";

export type LogId = string;

export class Log {
  readonly id = randomUUID();
  createdBy: UserId;
  createdAt: Date;
  deletedBy?: UserId;
  deletedAt?: Date;
  type: LogType;
  message: string;
  constructor(createdBy: UserId, type: LogType, message: string, clock: Clock) {
    this.createdAt = clock();
    this.createdBy = createdBy;
    this.type = type;
    this.message = this.logMessage(type, message);
  }

  private logMessage(level: LogType, message: string): string {
    return `${level}: ${message}`;
  }
}
