export interface IItemList<T, U> {
  list: Map<T, U>;
  addItem(itemId: T, item: U): void;
  deleteItem(itemId: T): void;
  isItemAvailable(itemId: T): void;
}

export class ItemList<T, U> implements IItemList<T, U> {
  list: Map<T, U> = new Map();

  addItem(itemId: T, item: U) {
    this.list.set(itemId, item);
  }

  deleteItem(itemId: T) {
    this.isItemAvailable(itemId);
    this.list.get(itemId);
  }

  isItemAvailable(itemId: T) {
    if (!this.list.has(itemId)) {
      throw new Error("Item not found");
    }
  }
}
