import { IItemList, ItemList } from "./ItemList";
import { User, UserId } from "./User";
import { clock } from "./Clock";

export interface IUserList extends IItemList<UserId, User> {
  deleteOne(userId: string): void;
}

export class UserList extends ItemList<UserId, User> implements IUserList {
  constructor() {
    super("User");
  }

  deleteOne(userId: string): void {
    this.isItemAvailable(userId);
    this.list.get(userId).deletedAt = clock();
  }
}
