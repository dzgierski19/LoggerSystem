import { ItemList } from "./List";
import { User, UserId } from "./User";
import { clock } from "./Clock";

export class UserList extends ItemList<UserId, User> {
  deleteItem(userId: UserId): void {
    this.isItemAvailable(userId);
    this.list.get(userId).deletedAt = clock();
  }
}
