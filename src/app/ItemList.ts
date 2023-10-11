export interface IItemList<T, U extends { deletedAt?: Date }> {
  list: Map<T, U>;
  addOne(itemId: T, item: U): void;
  deleteOne(itemId: T, userId?: T): void;
  getOne(itemId: T): U;
}

export abstract class ItemList<T, U extends { deletedAt?: Date }>
  implements IItemList<T, U>
{
  list: Map<T, U> = new Map();

  constructor(private readonly itemType: "Log" | "User") {}

  addOne(itemId: T, item: U) {
    this.list.set(itemId, item);
  }

  getOne(itemId: T) {
    const item = this.list.get(itemId);
    if (!item || item.deletedAt) {
      throw new Error(`${this.itemType} not found`);
    }
    return item;
  }

  abstract deleteOne(itemId: T, userId: T): void;

  protected isItemAvailable(itemId: T) {
    if (!this.list.has(itemId)) {
      throw new Error(`${this.itemType} not found`);
    }
  }
}
