import { IItemList, ItemList } from "./ItemList";
import { User, UserId } from "./User";
import { clock } from "./Clock";

interface IUserList extends IItemList<UserId, User> {
  deleteItem(userId: UserId): void;
}

export class UserList extends ItemList<UserId, User> implements IUserList {
  deleteItem(userId: UserId): void {
    this.isItemAvailable(userId);
    this.list.get(userId).deletedAt = clock();
  }
}
