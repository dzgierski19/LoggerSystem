export interface IItemList<T, U extends { deletedAt?: Date }> {
  list: Map<T, U>;
  addOne(itemId: T, item: U): void;
  deleteOne(itemId: T, userId?: T): void;
  getOne(itemId: T): U;
}

export abstract class ItemList<T, U> implements IItemList<T, U> {
  list: Map<T, U> = new Map();

  constructor(private readonly itemType: "Log" | "User") {}

  addOne(itemId: T, item: U) {
    this.list.set(itemId, item);
  }

  abstract deleteOne(itemId: T, userId: T): void;

  getOne(itemId: T) {
    const item = this.getOne(itemId);
    if (!item || !item.deletedAt) {
      throw new Error(`${this.itemType} not found`);
    }
    return item;
  }

  protected isItemAvailable(itemId: T) {
    if (!this.list.has(itemId)) {
      throw new Error(`${this.itemType} not found`);
    }
  }
}
