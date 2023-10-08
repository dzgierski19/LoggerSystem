import { IItemList, ItemList } from "./ItemList";
import { Log, LogId } from "./Log";
import { clock } from "./Clock";
import { randomUUID } from "crypto";

const APP_CREATOR = "APP_CREATOR";
const APP_CREATOR_ID = randomUUID();

interface ILogList extends IItemList<LogId, Log> {
  deleteItem(logId: LogId): void;
}

export class LogList extends ItemList<LogId, Log> implements ILogList {
  deleteItem(logId: LogId): void {
    this.isItemAvailable(logId);
    this.isDeleted(logId);
    this.list.get(logId).deletedAt = clock();
    this.list.get(logId).deletedBy = `${APP_CREATOR}: ${APP_CREATOR_ID}`;
  }

  private isDeleted(logId: LogId) {
    if (this.list.get(logId).deletedAt) {
      throw new Error(`Log ${logId} is already deleted`);
    }
  }
}
