import { ItemList } from "./List";
import { Log, logId } from "./Log";
import { clock } from "./Clock";

export class LogList extends ItemList<logId, Log> {
  deleteItem(userId: logId): void {
    this.isItemAvailable(userId);
    this.list.get(userId).deletedAt = clock();
  }
}
