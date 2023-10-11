import { IItemList, ItemList } from "./ItemList";
import { Log, LogId } from "./Log";
import { clock } from "./Clock";
import { randomUUID } from "crypto";
import { UserId } from "./User";

const APP_CREATOR = "APP_CREATOR";
const APP_CREATOR_ID = randomUUID();

export interface ILogList extends IItemList<LogId, Log> {
  deleteOne(logId: LogId, userId: UserId): void;
}

export class LogList extends ItemList<LogId, Log> implements ILogList {
  constructor() {
    super("Log");
  }

  deleteOne(logId: LogId, userId: UserId): void {
    this.isItemAvailable(logId);
    this.isDeleted(logId);
    const log = this.list.get(logId);
    log.deletedAt = clock();
    log.deletedBy = userId;
  }

  private isDeleted(logId: LogId) {
    if (this.list.get(logId).deletedAt) {
      throw new Error(`Log ${logId} is already deleted`);
    }
  }
}
